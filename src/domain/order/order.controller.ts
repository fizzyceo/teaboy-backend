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
  Req,
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

  @Post("create")
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

    // const notificationData: sendNotificationDTO = {
    //   title: "Order Created",
    //   body: `Your order with ID has been successfully created.`,
    //   deviceId: "response",
    // };
    // this.notificationService.sendPush(notificationData);

    return response;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all orders" })
  @ApiResponse({
    status: 200,
    description: "List of all orders related to the authenticated user",
  })
  @ApiResponse({ status: 404, description: "No orders found" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  getAllOrders(@Req() req) {
    const user = req.user;
    return this.orderService.getAllOrders(user);
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
  getOrderById(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    return this.orderService.getOrderById(id, user);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
    @Body() updateOrderDto: UpdateOrderDto,
    @Req() req
  ) {
    const user = req.user;
    return this.orderService.updateOrder(id, updateOrderDto, user);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete order by id" })
  @ApiParam({
    name: "id",
    description: "Order id to delete",
    required: true,
    type: Number,
  })
  deleteOrder(@Param("id", ParseIntPipe) id: number, @Req() req) {
    const user = req.user;
    return this.orderService.deleteOrder(id, user);
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel order by id" })
  @ApiParam({
    name: "id",
    description: "Order id to cancel",
    required: true,
    type: Number,
  })
  cancelOrder(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.cancelOrder(id);
  }
}
