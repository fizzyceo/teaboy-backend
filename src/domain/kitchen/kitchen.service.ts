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

  async getAllKitchens(user_id: number, lang: string) {
    return await this.database.kitchen.findMany();
  }

  async getKitchenInfos(req: any, lang: string) {
    const { kitchen_id } = req;

    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id },
      select: {
        kitchen_id: true,
        name: true,
        name_ar: true,
        token: true,
        isOpen: true,
        isWeeklyTimingOn: true,
        openingHours: {
          select: {
            openingHours_id: true,
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
            timezone: true,
          },
        },
        spaces: {
          select: {
            space_id: true,
            name: true,
            name_ar: true,
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
      name: lang === "AR" && space.name_ar ? space.name_ar : space.name,
      menu_id: space.menus.length > 0 ? space.menus[0].menu_id : null,
    }));

    return {
      kitchen_id: kitchen.kitchen_id,
      name: lang === "AR" && kitchen.name_ar ? kitchen.name_ar : kitchen.name,
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
                  timezone: timezone,
                },
              });
            } else {
              const { timezone, ...HourWithoutTimezone } = hour;
              // Create new opening hour
              await transaction.openingHours.create({
                data: {
                  kitchen_id,
                  ...HourWithoutTimezone,
                  timezone: timezone,
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

  async linkKitchenToSpace(kitchenId: number, spaceId: number) {
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

  async getOrderItems(
    lang: string,
    kitchen: any,
    status?: string,
    page?: number
  ) {
    const { kitchen_id } = kitchen;

    // Check if the kitchen exists
    const kitchenExists = await this.getKitchenById(kitchen_id);

    const validStatuses = Object.values(OrderStatus);
    const limit = 10;

    const isPendingOrInProgress =
      status === OrderStatus.PENDING || status === OrderStatus.IN_PROGRESS;

    let skip: number | undefined;
    let take: number | undefined;
    let createdAtCondition: any = {};

    // Apply date condition for orders that are pending or in progress
    if (isPendingOrInProgress) {
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      createdAtCondition = { created_at: { gte: last24Hours } };
    } else {
      page = page && page > 0 ? page : 1;
      skip = (page - 1) * limit;
      take = limit;
    }

    // Fetch orders
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
                name_ar: true,
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
                name_ar: true,
                menu_item_option_choice_id: true,
                menu_item_option: {
                  select: {
                    name: true,
                    name_ar: true,
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
            title_ar: true,
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

    const formattedOrders = orders.map((order) => ({
      ...order,
      choices: order.choices.map((choice) => ({
        option:
          lang === "AR" &&
          choice.menu_item_option_choice.menu_item_option.name_ar
            ? choice.menu_item_option_choice.menu_item_option.name_ar
            : choice.menu_item_option_choice.menu_item_option.name,
        option_id:
          choice.menu_item_option_choice.menu_item_option.menu_item_option_id,
        choice:
          lang === "AR" && choice.menu_item_option_choice.name_ar
            ? choice.menu_item_option_choice.name_ar
            : choice.menu_item_option_choice.name,
        choice_id: choice.menu_item_option_choice.menu_item_option_choice_id,
      })),
    }));

    // Fetch kitchen calls within the last 24 hours
    const calls = await this.getKitchenCalls(kitchen_id);

    // Return both orders and calls
    return {
      orders: formattedOrders,
      calls: calls,
    };
  }

  // The getKitchenCalls function remains unchanged
  async getKitchenCalls(kitchen_id: number) {
    const kitchen = await this.database.kitchen.findFirst({
      where: {
        kitchen_id: kitchen_id,
      },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);
    const createdAtCondition = { created_at: { gte: last24Hours } };

    const calls = await this.database.call.findMany({
      where: {
        AND: [
          {
            Space: {
              kitchen_id: kitchen_id,
            },
          },
          createdAtCondition,
        ],
      },
      orderBy: {
        created_at: "desc",
      },
      select: {
        space_id: true,
        call_id: true,
        status: true,
        updated_at: true,
        created_at: true,
        User: {
          select: {
            user_id: true,
            name: true,
            image_url: true,
            spaces: {
              select: {
                space_id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return calls.map((call) => ({
      call_id: call.call_id,
      status: call.status,
      updated_at: call.updated_at,
      created_at: call.created_at,
      User: {
        user_id: call.User.user_id,
        name: call.User.name,
        image_url: call.User.image_url,
        space: {
          ...call.User.spaces.find((space) => space.space_id === call.space_id),
        },
      },
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
            timezone: true,
          },
        },
      },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    if (!kitchen.isWeeklyTimingOn) {
      return kitchen.isOpen;
    }

    if (kitchen.openingHours?.length > 0) {
      const currentTimeUTC = new Date();

      const currentDayOfWeek = currentTimeUTC
        .toLocaleString("en-US", { weekday: "long", timeZone: "UTC" })
        .toUpperCase();

      const todayOpeningHours = kitchen.openingHours.find(
        (hours) => hours.dayOfWeek === currentDayOfWeek
      );

      if (todayOpeningHours) {
        const currentKitchenTime = this.convertToKitchenTimezone(
          currentTimeUTC,
          todayOpeningHours.timezone
        );
        return this.isWithinOpeningHours(
          todayOpeningHours.openTime,
          todayOpeningHours.closeTime,
          currentKitchenTime
        );
      } else {
        return false;
      }
    }

    return false;
  }

  private convertToKitchenTimezone(
    currentTimeUTC: Date,
    timezone: string
  ): Date {
    const [sign, hours, minutes] = timezone
      .match(/([+-])(\d{1,2}):(\d{2})/)
      .slice(1);

    console.log("sign,hours,minutes", sign, hours, minutes);
    const offsetInMinutes =
      (parseInt(hours) * 60 + parseInt(minutes)) * (sign === "+" ? 1 : -1);
    console.log("offsetInMin", offsetInMinutes);

    const localTime = new Date(currentTimeUTC);
    localTime.setMinutes(localTime.getUTCMinutes() + offsetInMinutes);

    return localTime;
  }

  private isWithinOpeningHours(
    openTimeStr: string,
    closeTimeStr: string,
    currentTime: Date
  ): boolean {
    const [openHour, openMinute] = openTimeStr.split(":").map(Number);
    const [closeHour, closeMinute] = closeTimeStr.split(":").map(Number);

    const openTime = new Date(currentTime);
    openTime.setHours(openHour, openMinute, 0, 0);

    const closeTime = new Date(currentTime);
    closeTime.setHours(closeHour, closeMinute, 0, 0);

    if (closeTime < openTime) {
      closeTime.setDate(closeTime.getDate() + 1);
    }

    console.log("currentTime", currentTime);
    console.log("openTime", openTime);
    console.log("closeTime", closeTime);
    console.log("isOpen", currentTime >= openTime && currentTime <= closeTime);
    return currentTime >= openTime && currentTime <= closeTime;
  }

  async unlinkTablet(kitchen_id: number, fcmToken: string) {
    // return await this.database.kitchenTablet.delete({
    //   where: {
    //     fcmToken,
    //     kitchen_id,
    //   },
    // });
  }
}
