import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { DatabaseService } from "src/database/database.service";
import { Order } from "./entities/order.entity";

@Injectable()
export class OrderService {
  constructor(private readonly database: DatabaseService) {}

  async creareOrder(createOrderDto: CreateOrderDto) {
    const { order_items, ...orderData } = createOrderDto;

    const createdOrder = await this.database.$transaction(async (database) => {
      const order = await database.order.create({
        data: orderData,
      });

      const orderItems = order_items.map((orderItem) => ({
        ...orderItem,
        order_id: order.order_id,
      }));

      await database.order_Item.createMany({
        data: orderItems,
      });

      return order;
    });

    return createdOrder;
  }

  async getAllOrders() {
    return await this.database.order.findMany();
  }

  async getOrderById(id: number) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
      include: {
        order_items: {
          select: {
            order_item_id: true,
            quantity: true,
            note: true,
            status: true,
            menu_item: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return await this.database.order.update({
      where: { order_id: id },
      data: updateOrderDto,
    });
  }

  async deleteOrder(id: number) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return await this.database.order.delete({
      where: { order_id: id },
    });
  }
}
