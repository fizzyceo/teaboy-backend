import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class OrderService {
  constructor(private readonly database: DatabaseService) {}

  async create(createOrderDto: CreateOrderDto) {
    return await this.database.order.create({
      data: createOrderDto,
    });
  }

  async findAll() {
    return await this.database.order.findMany();
  }

  async findOne(id: number) {
    return this.database.order.findUnique({
      where: { order_id: id },
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await this.database.order.update({
      where: { order_id: id },
      data: updateOrderDto,
    });
  }

  async remove(id: number) {
    return await this.database.order.delete({
      where: { order_id: id },
    });
  }
}
