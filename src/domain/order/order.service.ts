import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class OrderService {
  constructor(private readonly database: DatabaseService) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.database.order.create({
      data: {
        customer: {
          create: {
            name: createOrderDto.customer.name,
            email: createOrderDto.customer.email,
            phone: createOrderDto.customer.phone,
          },
        },
        order_items: {
          create: createOrderDto.order_items.map((item) => ({
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            note: item.note,
          })),
        },

        payment_method: createOrderDto.payment_method,
        payment_status: createOrderDto.payment_status,
      },
    });
  }

  async findAll() {
    return await this.database.order.findMany();
  }

  async findOne(id: number) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.database.order.findUnique({
      where: { order_id: id },
    });

    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    // return await this.database.order.update({
    //   where: { order_id: id },
    //   data: updateOrderDto,
    // });
  }

  async remove(id: number) {
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
