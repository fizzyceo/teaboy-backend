import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateKitchenDto, UpdateKitchenDto } from "./dto";

import * as crypto from "crypto";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";
import { OrderStatus } from "../order-item/dto";

@Injectable()
export class KitchenService {
  constructor(private readonly database: DatabaseService) {}

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

  async getKitchenById(id: number) {
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id: id },
      include: {
        openingHours: true,
        spaces: true,
      },
    });
    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${id} not found`);
    }
    return kitchen;
  }

  async updateKitchen(id: number, updateKitchenDto: UpdateKitchenDto) {
    const kitchen = await this.getKitchenById(id);

    return await this.database.kitchen.update({
      where: { kitchen_id: id },
      data: updateKitchenDto,
    });
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

  async getOrderItems(kitchen: any, status?: string) {
    const { kitchen_id } = kitchen;

    const kitchenExists = await this.getKitchenById(kitchen_id);

    const orders = await this.database.order_Item.findMany({
      where: {
        order: {
          space: {
            kitchen_id: kitchen_id,
          },
        },
      },
      include: {
        order: {
          select: {
            customer_name: true,
            table_number: true,
            order_number: true,
            space: {
              select: {
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
