import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";

import { CreateOrderDto, UpdateOrderDto } from "./dto";
import { KitchenService } from "../kitchen/kitchen.service";

@Injectable()
export class OrderService {
  constructor(
    private readonly database: DatabaseService,
    private readonly kitchenService: KitchenService
  ) {}

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

  async createOrder(createOrderDto: CreateOrderDto) {
    const { order_items, user_id, spaceId, ...orderData } = createOrderDto;

    if (user_id) {
      await this.validateUser(user_id);
    }

    await this.ensureKitchenIsOpen(spaceId);

    const menuId = await this.validateMenuItems(order_items);

    const createdOrder = await this.database.$transaction(async (database) => {
      const order = await database.order.create({
        data: {
          user: user_id ? { connect: { user_id } } : undefined,
          menu: { connect: { menu_id: menuId } },
          space: { connect: { space_id: spaceId } },
          order_number: this.generateOrderNumber(),
          ...orderData,
          order_items: {
            create: order_items.map((orderItem) =>
              this.createOrderItem(orderItem)
            ),
          },
        },
        include: { order_items: true },
      });

      return order;
    });

    return createdOrder;
  }

  private async validateUser(user_id: number) {
    const user = await this.database.user.findUnique({ where: { user_id } });

    if (!user) {
      throw new BadRequestException(`User with id ${user_id} not found`);
    }
  }

  private async ensureKitchenIsOpen(spaceId: number) {
    const kitchen = await this.database.kitchen.findFirst({
      where: {
        spaces: {
          some: { space_id: spaceId },
        },
      },
      select: { kitchen_id: true },
    });

    if (!kitchen) {
      throw new NotFoundException(
        `No kitchen found for space with id ${spaceId}`
      );
    }

    const isOpen = await this.kitchenService.isKitchenCurrentlyOpen(
      kitchen.kitchen_id
    );

    if (!isOpen) {
      throw new ConflictException("Cannot create order, kitchen is closed");
    }
  }

  private async validateMenuItems(order_items: any[]) {
    const menuItemIds = order_items.map((orderItem) => orderItem.menu_item_id);

    const existingMenuItems = await this.database.menu_Item.findMany({
      where: {
        menu_item_id: { in: menuItemIds },
      },
    });

    const existingMenuItemIds = existingMenuItems.map(
      (item) => item.menu_item_id
    );
    const missingMenuItemIds = menuItemIds.filter(
      (id) => !existingMenuItemIds.includes(id)
    );

    if (missingMenuItemIds.length > 0) {
      throw new Error(
        `Some menu items do not exist: ${missingMenuItemIds.join(", ")}`
      );
    }

    return existingMenuItems[0].menu_id;
  }

  private generateOrderNumber(): string {
    return Math.floor(Math.random() * 4096)
      .toString(16)
      .padStart(3, "0")
      .toUpperCase();
  }

  private createOrderItem(orderItem: any) {
    return {
      menu_item: { connect: { menu_item_id: orderItem.menu_item_id } },
      note: orderItem.note,
      status: orderItem.status,
      quantity: orderItem.quantity ?? 1,
      choices: {
        create: orderItem.choices.map((choice) => ({
          menu_item_option_choice: {
            connect: {
              menu_item_option_choice_id: choice.menu_item_option_choice_id,
            },
          },
        })),
      },
    };
  }

  async getAllOrders(
    user_id: any,
    page: number = 1,
    limit: number = 5,
    lang?: string
  ) {
    // const { user_id } = user;

    const pageNumber = page > 0 ? page : 1;
    const pageSize = limit > 0 ? limit : 5;

    const skip = (pageNumber - 1) * pageSize;
    const orders = await this.database.order.findMany({
      where: {
        userId: user_id,
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
                available: true,
                description: true,
                menu_item_id: true,
                price: true,
                title: true,
                title_ar: true,
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
      skip: skip ? skip : undefined,
      take: pageSize,
    });

    return orders.map((order) => ({
      ...order,
      order_items: order.order_items.map((orderItem) => {
        const transformedChoices = orderItem.choices.map((choice) => ({
          option:
            lang.toLowerCase() === "ar" &&
            choice.menu_item_option_choice.menu_item_option.name_ar
              ? choice.menu_item_option_choice.menu_item_option.name_ar
              : choice.menu_item_option_choice.menu_item_option.name,

          option_id:
            choice.menu_item_option_choice.menu_item_option.menu_item_option_id,
          choice:
            lang.toLowerCase() === "ar" &&
            choice.menu_item_option_choice.name_ar
              ? choice.menu_item_option_choice.name_ar
              : choice.menu_item_option_choice.name,
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

  async orderReport(
    from: Date,
    to: Date,
    filters: {
      kitchen_id?: number;
      site_id?: number;
      space_id?: number;
      user_id?: number;
    }
  ) {
    // Build dynamic where conditions based on optional filters
    const whereClause: any = {
      created_at: {
        gte: new Date(from),
        lte: new Date(to),
      },
    };

    if (filters.kitchen_id) {
      whereClause.space = { kitchen_id: filters.kitchen_id };
    }

    if (filters.site_id) {
      whereClause.space = { ...whereClause.space, site_id: filters.site_id };
    }

    if (filters.space_id) {
      whereClause.space = { ...whereClause.space, space_id: filters.space_id };
    }

    if (filters.user_id) {
      whereClause.userId = filters.user_id;
    }

    //select title if header LANG = 'EN', title_ar if header LANG =='AR'
    const orders = await this.database.order.findMany({
      where: whereClause,
      include: {
        order_items: {
          select: {
            menu_item_id: true,
            quantity: true,
            menu_item: {
              select: {
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

    let totalOrders = 0;
    let totalItems = 0;

    const ordersWithPrepTime = orders.map((order) => {
      const preparationTime =
        (new Date(order.updated_at).getTime() -
          new Date(order.created_at).getTime()) /
        1000;
      const orderItemsCount = order.order_items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );

      totalOrders += 1;
      totalItems += orderItemsCount;

      return {
        ...order,
        preparationTime: Math.round(preparationTime),
      };
    });

    return {
      orders: ordersWithPrepTime,
      totalOrders,
      totalItems,
    };
  }
}
