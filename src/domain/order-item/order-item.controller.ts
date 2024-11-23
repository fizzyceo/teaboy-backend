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
  UseInterceptors,
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
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("order-item")
@ApiTags("order-item")
@UseInterceptors(CacheInterceptor)
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  @ApiBody({ type: CreateOrderItemDto })
  @ApiOperation({ summary: "Create a new order item" })
  createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemService.createOrderItem(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all order items" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter order items by status",
    enum: OrderStatus,
  })
  @ApiQuery({
    name: "menu_id",
    required: false,
    description: "filter orders by menu",
  })
  getAllOrderItems(
    @Query("status") status?: string,
    @Query("menu_id") menu_id?: number
  ) {
    return this.orderItemService.getAllOrderItems(status, menu_id);
  }

  @Get("new/a/")
  @ApiOperation({ summary: "Get all order items" })
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter order items by status",
    enum: OrderStatus,
  })
  @ApiQuery({
    name: "menu_id",
    required: false,
    description: "filter orders by menu",
  })
  getAllOrderItemsNew(
    @Query("status") status?: string,
    @Query("menu_id") menu_id?: number
  ) {
    return this.orderItemService.getAllOrderItemsNew(status, menu_id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get order item details by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to fetch",
    required: true,
  })
  getOrderItemById(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.getOrderItemById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update order item details by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to update",
    required: true,
  })
  @ApiBody({ type: UpdateOrderItemDto })
  updateOrderItem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto
  ) {
    return this.orderItemService.updateOrderItem(id, updateOrderItemDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete order item by id" })
  @ApiParam({
    name: "id",
    description: "Order item id to delete",
    required: true,
  })
  deleteOrderItem(@Param("id", ParseIntPipe) id: number) {
    return this.orderItemService.deleteOrderItem(id);
  }
}
