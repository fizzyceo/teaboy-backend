import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { CreateOrderItemDto, OrderStatus } from "./dto/create-order-item.dto";
import { UpdateOrderItemDto } from "./dto/update-order-item.dto";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@Controller("order-item")
@ApiTags("order-item")
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @ApiBody({ type: CreateOrderItemDto })
  @ApiOperation({ summary: "Create a new order item" })
  createMenuItem(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.createMenuItem(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all order items" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter order items by status",
    enum: OrderStatus,
  })
  getAllMenuItems(@Query("status") status?: string) {
    return this.orderItemService.getAllMenuItems(status);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order item details by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to fetch",
    required: true,
  })
  getMenuItemById(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.getMenuItemById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update order item details by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to update",
    required: true,
  })
  @ApiBody({ type: UpdateOrderItemDto })
  updateMenuItem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ) {
    return this.orderItemService.updateMenuItem(id, updateOrderItemDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete order item by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to delete",
    required: true,
  })
  deleteMenuItem(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.deleteMenuItem(id);
  }
}
