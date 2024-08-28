import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { CreateOrderDto, UpdateOrderDto } from "./dto";

@Injectable()
export class OrderService {
  constructor(private readonly database: DatabaseService) {}

  private async findOrderById(id: number) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  private async getOrderSpaceId(orderId: number): Promise<number> {
    const order = await this.database.order.findUnique({
      where: { order_id: orderId },
      select: { spaceId: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return order.spaceId;
  }

  async creareOrder(createOrderDto: CreateOrderDto) {
    const { order_items, user_id, spaceId, ...orderData } = createOrderDto;

    if (user_id) {
      const user = await this.database.user.findUnique({
        where: {
          user_id,
        },
      });

      if (!user) {
        throw new BadRequestException(`User with id ${user_id} not found`);
      }
    }

    const orderKitchen = await this.database.kitchen.findFirst({
      where: {
        spaces: {
          some: {
            space_id: spaceId,
          },
        },
      },
      select: {
        isOpen: true,
      },
    });

    if (!orderKitchen?.isOpen) {
      throw new InternalServerErrorException(
        "Cannot create order, kitchen is closed"
      );
    }

    const menuItemIds = order_items.map((orderItem) => orderItem.menu_item_id);

    const existingMenuItems = await this.database.menu_Item.findMany({
      where: {
        menu_item_id: {
          in: menuItemIds,
        },
      },
    });

    const existingMenuItemIds = existingMenuItems.map(
      (item) => item.menu_item_id
    );

    const menuId = existingMenuItems[0].menu_id;

    const missingMenuItemIds = menuItemIds.filter(
      (id) => !existingMenuItemIds.includes(id)
    );

    if (missingMenuItemIds.length > 0) {
      console.error(
        "The following menu_item_ids do not exist:",
        missingMenuItemIds
      );
      throw new Error(
        `Some menu items do not exist: ${missingMenuItemIds.join(", ")}`
      );
    }

    const createdOrder = await this.database.$transaction(async (database) => {
      const order = await database.order.create({
        data: {
          user: user_id
            ? {
                connect: {
                  user_id: user_id,
                },
              }
            : undefined,
          menu: {
            connect: {
              menu_id: menuId,
            },
          },
          space: {
            connect: {
              space_id: spaceId,
            },
          },
          order_number: Math.floor(Math.random() * 4096)
            .toString(16)
            .padStart(3, "0")
            .toUpperCase(),
          ...orderData,

          order_items: {
            create: order_items.map((orderItem) => ({
              menu_item: { connect: { menu_item_id: orderItem.menu_item_id } },
              note: orderItem.note,
              status: orderItem.status,
              quantity: orderItem.quantity ? orderItem.quantity : 1,
              choices: {
                create: orderItem.choices.map((choice) => ({
                  menu_item_option_choice: {
                    connect: {
                      menu_item_option_choice_id:
                        choice.menu_item_option_choice_id,
                    },
                  },
                })),
              },
            })),
          },
        },
        include: { order_items: true },
      });

      return order;
    });

    return createdOrder;
  }

  async getAllOrders(user: any) {
    const { user_id } = user;
    const orders = await this.database.order.findMany({
      where: {
        OR: [
          { userId: user_id },
          {
            menu: {
              spaces: {
                some: {
                  users: {
                    some: {
                      user_id: user_id,
                    },
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            note: true,
            quantity: true,
            status: true,
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
                available: true,
                description: true,
                menu_item_id: true,
                price: true,
                title: true,
                item_images: {
                  select: {
                    image_url: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return orders.map((order) => ({
      ...order,
      order_items: order.order_items.map((orderItem) => {
        const transformedChoices = orderItem.choices.map((choice) => ({
          option: choice.menu_item_option_choice.menu_item_option.name,
          option_id:
            choice.menu_item_option_choice.menu_item_option.menu_item_option_id,
          choice: choice.menu_item_option_choice.name,
          choice_id: choice.menu_item_option_choice.menu_item_option_choice_id,
        }));

        return {
          ...orderItem,
          choices: transformedChoices,
        };
      }),
    }));
  }

  async getOrderById(id: number, user: any) {
    const { space_id } = user;
    const order = await this.database.order.findUnique({
      where: { order_id: id },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            note: true,
            status: true,
            menu_item: {
              select: {
                menu_item_id: true,
                title: true,
                description: true,
                price: true,
                available: true,
                item_images: {
                  select: {
                    image_url: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    const orderSpaceId = await this.getOrderSpaceId(id);
    if (orderSpaceId !== space_id) {
      throw new UnauthorizedException("You do not have access to this order");
    }

    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto, user: any) {
    const { space_id } = user;
    const order = await this.findOrderById(id);

    return await this.database.order.update({
      where: { order_id: id },
      data: updateOrderDto,
    });
  }

  async deleteOrder(id: number, user: any) {
    const { restaurant_id } = user;
    const order = await this.findOrderById(id);

    return await this.database.order.delete({
      where: { order_id: id },
    });
  }

  async cancelOrder(id: number) {
    const order = await this.findOrderById(id);

    return await this.database.order_Item.updateMany({
      where: { order_id: id },
      data: { status: "CANCELLED" },
    });
  }
}
