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

  async getAllKitchens() {
    return await this.database.kitchen.findMany();
  }

  async getKitchenInfos(req: any) {
    const { kitchen_id } = req;
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id: kitchen_id },
      select: {
        kitchen_id: true,
        name: true,
        token: true,
        openingHours: {
          select: {
            openingHours_id: true,
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
    return kitchen;
  }
  async updateKitchen(kitchen: any, updateKitchenDto: UpdateKitchenDto) {
    const { kitchen_id } = kitchen;

    const { openingHours, ...kitchenData } = updateKitchenDto;

    const updatedKitchen = await this.database.$transaction(
      async (transaction) => {
        if (openingHours) {
          // Fetch current opening hours for comparison
          const currentOpeningHours = await transaction.openingHours.findMany({
            where: { kitchen_id },
          });

          const existingDaysOfWeek = currentOpeningHours.map(
            (hour) => hour.dayOfWeek
          );

          // Update existing opening hours or create new ones
          for (const hour of openingHours) {
            if (existingDaysOfWeek.includes(hour.dayOfWeek)) {
              // Update existing opening hour
              await transaction.openingHours.updateMany({
                where: {
                  kitchen_id,
                  dayOfWeek: hour.dayOfWeek,
                },
                data: {
                  openTime: hour.openTime,
                  closeTime: hour.closeTime,
                },
              });
            } else {
              // Create new opening hour
              await transaction.openingHours.create({
                data: {
                  kitchen_id,
                  ...hour,
                },
              });
            }
          }

          // Delete opening hours that are no longer included in the update
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

  async removeKitchen(id: number) {
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

  async getOrderItems(kitchen: any, status?: string, page: number = 1) {
    const { kitchen_id } = kitchen;

    const kitchenExists = await this.getKitchenById(kitchen_id);

    const validStatuses = Object.values(OrderStatus);
    const limit = 10;

    page = Math.max(page, 1);

    const skip = (page - 1) * limit;

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
        ],
      },
      skip: skip ? skip : undefined,
      take: limit,
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
}
