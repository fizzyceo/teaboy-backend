import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { DatabaseService } from "src/database/database.service";
import { Order } from "./entities/order.entity";

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

  /**
   * Retrieves the restaurant ID associated with the given order ID.
   * @param orderId - The ID of the order.
   * @returns A Promise that resolves to the restaurant ID.
   * @throws NotFoundException if the order is not found or has no order items.
   */
  private async getOrderSpaceId(orderId: number): Promise<number> {
    const order = await this.database.order.findUnique({
      where: { order_id: orderId },
      select: {
        order_items: {
          select: {
            menu_item: {
              select: {
                menu: {
                  select: {
                    space: {
                      select: {
                        space_id: true,
                        site_id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order || !order.order_items.length) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    return order.order_items[0].menu_item.menu.space.space_id;
  }

  /**
   * Creates an order based on the provided order data.
   * @param createOrderDto - The data for creating the order.
   * @returns The created order.
   * @throws Error if any of the menu items in the order do not exist.
   */
  async creareOrder(createOrderDto: CreateOrderDto) {
    const { order_items, ...orderData } = createOrderDto;

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

  /**
   * Retrieves all orders for a given user.
   * @param user - The user object.
   * @returns An array of orders with transformed order items.
   */
  async getAllOrders(user: any) {
    const { space_id } = user;
    const orders = await this.database.order.findMany({
      where: {
        order_items: {
          some: {
            menu_item: {
              menu: {
                space_id: space_id,
              },
            },
          },
        },
      },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            note: true,
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

  /**
   * Retrieves an order by its ID.
   * @param id - The ID of the order.
   * @param user - The user object containing the restaurant ID.
   * @returns The order object with the specified ID.
   * @throws NotFoundException if the order with the specified ID is not found.
   * @throws UnauthorizedException if the user does not have access to the order.
   */
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
