import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { CreateOrderItemDto, UpdateOrderItemDto, OrderStatus } from "./dto";

@Injectable()
export class OrderItemService {
  constructor(private readonly database: DatabaseService) {}

  async createOrderItem(createOrderItemDto: CreateOrderItemDto) {
    const { choices, menu_item_id, order_id, ...orderItemData } =
      createOrderItemDto;

    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id },
    });

    if (!menuItem) {
      throw new BadRequestException(
        `Menu Item with id ${menu_item_id} not found`
      );
    }

    const orderItem = await this.database.order_Item.create({
      data: {
        ...orderItemData,
        order: {
          connect: {
            order_id,
          },
        },
        menu_item: {
          connect: {
            menu_item_id,
          },
        },
        choices: {
          createMany: {
            data: choices.map((choice) => ({
              menu_item_option_choice_id: choice.menu_item_option_choice_id,
            })),
          },
        },
      },
    });

    return orderItem;
  }

  async getAllOrderItemsNew(status?: string, menu_id?: number) {
    const validStatuses = Object.values(OrderStatus);

    const whereConditions: any = {
      ...(status && validStatuses.includes(status as OrderStatus)
        ? { status: status as OrderStatus }
        : {}),
      ...(menu_id && !isNaN(menu_id)
        ? { menu_item: { menu: { menu_id: menu_id } } }
        : {}),
    };

    const orders = await this.database.order_Item.findMany({
      where: whereConditions,
      include: {
        order: {
          select: {
            customer_name: true,
            table_number: true,
            order_number: true,
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

  async getAllOrderItems(status?: string, menu_id?: number) {
    const validStatuses = Object.values(OrderStatus);

    const whereConditions: any = {
      ...(status && validStatuses.includes(status as OrderStatus)
        ? { status: status as OrderStatus }
        : {}),
      ...(menu_id && !isNaN(menu_id)
        ? {
            order: {
              spaceId: menu_id,
            },
          }
        : {}),
    };

    // console.log("whereCondiion", whereConditions);

    const orders = await this.database.order_Item.findMany({
      where: whereConditions,
      include: {
        order: {
          select: {
            customer_name: true,
            table_number: true,
            order_number: true,
            spaceId: true,
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
                spaces: {
                  select: {
                    space_id: true,
                    name: true,
                  },
                  ...(menu_id && {
                    where: {
                      space_id: menu_id,
                    },
                  }),
                },
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

    // console.log("orders", orders);

    return orders.map((order) => ({
      ...order,
      menu_item: {
        ...order.menu_item,
        menu: {
          menu_id: order.order.spaceId,
          name: order.menu_item.menu.spaces.find(
            (space) => space.space_id === order.order.spaceId
          )?.name,
        },
      },
      choices: order.choices.map((choice) => ({
        option: choice.menu_item_option_choice.menu_item_option.name,
        option_id:
          choice.menu_item_option_choice.menu_item_option.menu_item_option_id,
        choice: choice.menu_item_option_choice.name,
        choice_id: choice.menu_item_option_choice.menu_item_option_choice_id,
      })),
    }));
  }

  async getOrderItemById(id: number) {
    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
      include: {
        order: {
          select: {
            order_id: true,
            customer_name: true,
            table_number: true,
            spaceId: true,
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
            menu_item_id: true,
            price: true,
            item_images: {
              select: {
                image_url: true,
              },
            },
          },
        },
        choices: {
          select: {
            menu_item_option_choice: {
              select: {
                name: true,
                menu_item_option: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!orderItem) {
      throw new Error(`Order item with ID ${id} not found`);
    }

    const transformedChoices = orderItem.choices.map((choice) => ({
      option: choice.menu_item_option_choice.menu_item_option.name,
      choice: choice.menu_item_option_choice.name,
    }));

    return {
      ...orderItem,
      choices: transformedChoices,
    };
  }

  async updateOrderItem(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const { choices, ...orderItemData } = updateOrderItemDto;

    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }

    const updateData: any = {
      ...orderItemData,
    };

    if (choices && choices.length > 0) {
      updateData.choices = {
        createMany: {
          data: choices.map((choice) => ({
            menu_item_option_choice_id: choice.menu_item_option_choice_id,
          })),
        },
      };
    }

    return await this.database.order_Item.update({
      where: { order_item_id: id },
      data: updateData,
    });
  }

  async deleteOrderItem(id: number) {
    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }

    return await this.database.order_Item.delete({
      where: { order_item_id: id },
    });
  }
}
