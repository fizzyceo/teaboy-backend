import { Injectable } from "@nestjs/common";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class OrderItemService {
  constructor(private readonly database: DatabaseService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    return await this.database.order_Item.create({
      data: createOrderItemDto,
    });
  }

  async findAll() {
    return await this.database.order_Item.findMany();
  }

  async findOne(id: number) {
    return await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    return await this.database.order_Item.update({
      where: { order_item_id: id },
      data: updateOrderItemDto,
    });
  }

  async remove(id: number) {
    return await this.database.order_Item.delete({
      where: { order_item_id: id },
    });
  }
}
