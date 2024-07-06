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

  async getAllMenuItems(status?: string) {
    const validStatuses = Object.values(OrderStatus);
    if (status) {
      if (!validStatuses.includes(status as OrderStatus)) {
        throw new BadRequestException(`Invalid status: ${status}`);
      }
      return await this.database.order_Item.findMany({
        where: { status: status as OrderStatus },
      });
    }
    return await this.database.order_Item.findMany();
  }

  async getMenuItemById(id: number) {
    const orderItem = await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });

    if (!orderItem) {
      throw new NotFoundException(`Order Item with id ${id} not found`);
    }
    return await this.database.order_Item.findUnique({
      where: { order_item_id: id },
    });
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
