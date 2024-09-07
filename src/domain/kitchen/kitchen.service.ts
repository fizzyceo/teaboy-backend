import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateKitchenDto, UpdateKitchenDto } from "./dto";

import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";
import { OrderStatus } from "../order-item/dto";

@Injectable()
export class KitchenService {
  constructor(private readonly database: DatabaseService) {}

  async getKitchenById(kitchen_id: number) {
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    return kitchen;
  }

  async createKitchen(createKitchenDto: CreateKitchenDto) {
    const { openingHours, ...kitchenData } = createKitchenDto;

    const token = crypto.randomBytes(3).toString("hex").toUpperCase();

    const kitchen = await this.database.kitchen.create({
      data: {
        ...kitchenData,
        token: token,
        openingHours: {
          create: openingHours,
        },
      },
    });

    return {
      kitchen,
      token: token,
    };
  }

  async getAllKitchens(user_id: number) {
    return await this.database.kitchen.findMany();
  }

  async getKitchenInfos(req: any) {
    const { kitchen_id } = req;

    // Fetch kitchen information including spaces and menus
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id },
      select: {
        kitchen_id: true,
        name: true,
        token: true,
        isOpen: true,
        isWeeklyTimingOn: true,
        openingHours: {
          select: {
            openingHours_id: true,
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
          },
        },
        spaces: {
          select: {
            space_id: true,
            name: true,
            menus: {
              select: {
                menu_id: true,
              },
            },
          },
        },
      },
    });

    // Throw an error if kitchen not found
    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    // Prepare response with necessary information
    const formattedSpaces = kitchen.spaces.map((space) => ({
      space_id: space.space_id,
      name: space.name,
      menu_id: space.menus.length > 0 ? space.menus[0].menu_id : null,
    }));

    return {
      kitchen_id: kitchen.kitchen_id,
      name: kitchen.name,
      token: kitchen.token,
      isOpen: kitchen.isOpen,
      isWeeklyTimingOn: kitchen.isWeeklyTimingOn,
      openingHours: kitchen.openingHours,
      spaces: formattedSpaces,
    };
  }

  async updateKitchen(kitchen: any, updateKitchenDto: UpdateKitchenDto) {
    const { kitchen_id } = kitchen;

    const { openingHours, ...kitchenData } = updateKitchenDto;

    const updatedKitchen = await this.database.$transaction(
      async (transaction) => {
        if (openingHours) {
          const currentOpeningHours = await transaction.openingHours.findMany({
            where: { kitchen_id },
          });

          const existingDaysOfWeek = currentOpeningHours.map(
            (hour) => hour.dayOfWeek
          );

          // Update existing opening hours or create new ones
          for (const hour of openingHours) {
            if (existingDaysOfWeek.includes(hour.dayOfWeek)) {
              const { timezone, ...HourWithoutTimezone } = hour;
              // Update existing opening hour
              await transaction.openingHours.updateMany({
                where: {
                  kitchen_id,
                  dayOfWeek: HourWithoutTimezone.dayOfWeek,
                },
                data: {
                  openTime: HourWithoutTimezone.openTime,
                  closeTime: HourWithoutTimezone.closeTime,
                },
              });
            } else {
              const { timezone, ...HourWithoutTimezone } = hour;
              // Create new opening hour
              await transaction.openingHours.create({
                data: {
                  kitchen_id,
                  ...HourWithoutTimezone,
                },
              });
            }
          }

          const daysToKeep = openingHours.map((hour) => hour.dayOfWeek);
          await transaction.openingHours.deleteMany({
            where: {
              kitchen_id,
              dayOfWeek: { notIn: daysToKeep },
            },
          });
        }

        // Update the kitchen data
        return await transaction.kitchen.update({
          where: { kitchen_id },
          data: kitchenData,
        });
      }
    );

    return updatedKitchen;
  }

  async removeKitchen(id: number, user_id: number) {
    const kitchen = await this.getKitchenById(id);

    return await this.database.kitchen.delete({
      where: { kitchen_id: id },
    });
  }

  async linkKitchenToSpace(
    kitchenId: number,
    spaceId: number,
    user_id: number
  ) {
    const kitchen = await this.getKitchenById(kitchenId);

    const space = await this.database.space.findUnique({
      where: { space_id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${spaceId} not found`);
    }

    return await this.database.kitchen.update({
      where: { kitchen_id: kitchenId },
      data: {
        spaces: {
          connect: {
            space_id: spaceId,
          },
        },
      },
    });
  }

  async getOrderItems(kitchen: any, status?: string, page?: number) {
    const { kitchen_id } = kitchen;

    const kitchenExists = await this.getKitchenById(kitchen_id);

    const validStatuses = Object.values(OrderStatus);
    const limit = 10;

    const isPendingOrInProgress =
      status === OrderStatus.PENDING || status === OrderStatus.IN_PROGRESS;

    let skip: number | undefined;
    let take: number | undefined;
    let createdAtCondition: any = {};

    if (isPendingOrInProgress) {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      createdAtCondition = { created_at: { gte: last24Hours } };
    } else {
      page = page && page > 0 ? page : 1;
      skip = (page - 1) * limit;
      take = limit;
    }

    console.log("skip", skip, "take", take);
    const orders = await this.database.order_Item.findMany({
      where: {
        AND: [
          {
            ...(status && validStatuses.includes(status as OrderStatus)
              ? { status: status as OrderStatus }
              : {}),
          },
          {
            order: {
              space: {
                kitchen_id: kitchen_id,
              },
            },
          },
          createdAtCondition,
        ],
      },
      skip,
      take,
      orderBy: {
        created_at: "desc",
      },
      include: {
        order: {
          select: {
            customer_name: true,
            table_number: true,
            order_number: true,
            space: {
              select: {
                name: true,
                space_id: true,
                kitchen_id: true,
              },
            },
          },
        },
        choices: {
          select: {
            menu_item_option_choice: {
              select: {
                name: true,
                menu_item_option_choice_id: true,
                menu_item_option: {
                  select: {
                    name: true,
                    menu_item_option_id: true,
                  },
                },
              },
            },
          },
        },
        menu_item: {
          select: {
            menu: {
              select: {
                menu_id: true,
                name: true,
              },
            },
            title: true,
            available: true,
            description: true,
            price: true,
            item_images: {
              select: {
                image_url: true,
              },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      choices: order.choices.map((choice) => ({
        option: choice.menu_item_option_choice.menu_item_option.name,
        option_id:
          choice.menu_item_option_choice.menu_item_option.menu_item_option_id,
        choice: choice.menu_item_option_choice.name,
        choice_id: choice.menu_item_option_choice.menu_item_option_choice_id,
      })),
    }));
  }

  async isKitchenCurrentlyOpen(kitchen_id: number): Promise<boolean> {
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id },
      select: {
        isOpen: true,
        isWeeklyTimingOn: true,
        openingHours: {
          select: {
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
          },
        },
      },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    if (!kitchen.isOpen) {
      return false;
    }

    const currentTime = new Date();
    const currentDayOfWeek = currentTime
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase();

    if (kitchen.isWeeklyTimingOn && kitchen.openingHours?.length > 0) {
      const todayOpeningHours = kitchen.openingHours.find(
        (hours) => hours.dayOfWeek === currentDayOfWeek
      );

      if (todayOpeningHours) {
        const isCurrentlyOpen = this.isWithinOpeningHours(
          todayOpeningHours.openTime,
          todayOpeningHours.closeTime,
          currentTime
        );

        if (isCurrentlyOpen) {
          return true;
        }
      }
    }

    return false;
  }

  private isWithinOpeningHours(
    openTimeStr: string,
    closeTimeStr: string,
    currentTime: Date
  ): boolean {
    const [openHour, openMinute] = openTimeStr.split(":").map(Number);
    const [closeHour, closeMinute] = closeTimeStr.split(":").map(Number);

    const openTime = new Date(currentTime);
    openTime.setHours(openHour, openMinute, 0);

    const closeTime = new Date(currentTime);
    closeTime.setHours(closeHour, closeMinute, 0);

    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }

    return currentTime >= openTime && currentTime <= closeTime;
  }
}
