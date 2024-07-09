import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateOrderItemDto, OrderStatus } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class OrderItemService {
  constructor(private readonly database: DatabaseService) {}

  async createMenuItem(createOrderItemDto: CreateOrderItemDto) {
    return await this.database.order_Item.create({
      data: createOrderItemDto,
    });
  }

  // async getAllMenuItems(status?: string) {
  //   const validStatuses = Object.values(OrderStatus);
  //   if (status) {
  //     if (!validStatuses.includes(status as OrderStatus)) {
  //       throw new BadRequestException(`Invalid status: ${status}`);
  //     }
  //     return await this.database.order_Item.findMany({
  //       where: { status: status as OrderStatus },
  //       include: {
  //         order: {
  //           select: {
  //             order_id: true,
  //             customer_name: true,
  //             table_number: true,
  //           },
  //         },
  //         menu_item: {
  //           select: {
  //             menu: {
  //               select: {
  //                 menu_id: true,
  //                 name: true,
  //                 description: true,
  //               },
  //             },
  //             title: true,
  //             available: true,
  //             description: true,
  //             menu_item_id: true,
  //             price: true,
  //             item_images: {
  //               select: {
  //                 image_url: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //   }
  //   return await this.database.order_Item.findMany({
  //     where: { status: status as OrderStatus },
  //     include: {
  //       order: {
  //         select: {
  //           order_id: true,
  //           customer_name: true,
  //           table_number: true,
  //         },
  //       },
  //       menu_item: {
  //         select: {
  //           menu: {
  //             select: {
  //               menu_id: true,
  //               name: true,
  //               description: true,
  //             },
  //           },
  //           title: true,
  //           available: true,
  //           description: true,
  //           menu_item_id: true,
  //           price: true,
  //           item_images: {
  //             select: {
  //               image_url: true,
  //             },
  //           },
  //         },
  //       },
  //     },
  //   });
  // }
  async getAllMenuItems(status?: string) {
    const validStatuses = Object.values(OrderStatus);
    const queryOptions = {
      include: {
        order: {
          select: {
            customer_name: true,
            table_number: true,
          },
        },
        menu_item: {
          select: {
            menu: {
              select: {
                name: true,
                description: true,
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
    };

    if (status && validStatuses.includes(status as OrderStatus)) {
      return await this.database.order_Item.findMany({
        where: { status: status as OrderStatus },
        ...queryOptions,
      });
    }

    return await this.database.order_Item.findMany({
      ...queryOptions,
    });
  }

  async getMenuItemById(id: number) {
    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
      include: {
        order: {
          select: {
            order_id: true,
            customer_name: true,
            table_number: true,
          },
        },
        menu_item: {
          select: {
            menu: {
              select: {
                menu_id: true,
                name: true,
                description: true,
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
      },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }

    return orderItem;
  }

  async updateMenuItem(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }

    return await this.database.order_Item.update({
      where: { order_item_id: id },
      data: updateOrderItemDto,
    });
  }

  async deleteMenuItem(id: number) {
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
