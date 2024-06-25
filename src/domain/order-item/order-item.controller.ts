import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { CreateOrderItemDto } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("order-item")
@ApiTags("order-item")
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @ApiBody({ type: CreateOrderItemDto })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  findAll() {
    return this.orderItemService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.findOne(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateOrderItemDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ) {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.remove(id);
  }
}
