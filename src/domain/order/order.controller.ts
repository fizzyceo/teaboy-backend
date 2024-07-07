import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { UpdateOrderDto } from "./dto/update-order.dto";

import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from "@nestjs/swagger";
import { NotificationService } from "src/notification/notification.service";
import { sendNotificationDTO } from "src/notification/dto/send-notification.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("order")
@ApiTags("order")
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly notificationService: NotificationService
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new order" })
  @ApiBody({
    type: CreateOrderDto,
    description:
      "Order details including order items , payment method, payment status, customer name and table number",
  })
  @ApiResponse({
    status: 201,
    description: "The order has been successfully created.",
  })
  @ApiResponse({ status: 400, description: "Invalid input, object invalid." })
  creareOrder(@Body() createOrderDto: CreateOrderDto) {
    const response = this.orderService.creareOrder(createOrderDto);

    const notificationData: sendNotificationDTO = {
      title: "Order Created",
      body: `Your order with ID has been successfully created.`,
      deviceId: "response",
    };

    // this.notificationService.sendPush(notificationData);
    return response;
  }

  @Get()
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({
    status: 200,
    description: "List of all orders",
  })
  @ApiResponse({ status: 404, description: "No orders found" })
  getAllOrders() {
    return this.orderService.getAllOrders();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get order details by id" })
  @ApiParam({
    name: "id",
    description: "Order id to fetch",
    required: true,
    type: Number,
  })
  getOrderById(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.getOrderById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update order details by id" })
  @ApiBody({ type: UpdateOrderDto })
  @ApiParam({
    name: "id",
    description: "Order id to update",
    required: true,
    type: Number,
  })
  updateOrder(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.orderService.updateOrder(id, updateOrderDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete order by id" })
  @ApiParam({
    name: "id",
    description: "Order id to delete",
    required: true,
    type: Number,
  })
  deleteOrder(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }
}
