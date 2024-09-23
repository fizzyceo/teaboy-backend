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
  Query,
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
  ApiQuery,
} from "@nestjs/swagger";

import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("order")
@ApiTags("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    const response = this.orderService.createOrder(createOrderDto);
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
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    description: "Number of orders per page",
    type: Number,
    example: 1,
  })
  getAllOrders(
    @Req() req,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 5
  ) {
    const user = req.user;
    return this.orderService.getAllOrders(user, page, limit);
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

  @Get("report/general")
  @ApiOperation({ summary: "Get Order report with optional filters" })
  @ApiQuery({
    name: "from",
    required: true,
    description: "Start date for report",
    type: Date,
    example: "2021-09-01",
  })
  @ApiQuery({
    name: "to",
    required: true,
    description: "End date for report",
    type: Date,
    example: "2021-09-30",
  })
  @ApiQuery({
    name: "kitchen_id",
    required: false,
    description: "Kitchen ID for report (optional)",
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: "site_id",
    required: false,
    description: "Site ID for report (optional)",
    type: Number,
    example: 2,
  })
  @ApiQuery({
    name: "space_id",
    required: false,
    description: "Space ID for report (optional)",
    type: Number,
    example: 3,
  })
  @ApiQuery({
    name: "user_id",
    required: false,
    description: "User ID for report (optional)",
    type: Number,
    example: 123,
  })
  getOrderReport(
    @Query("from") from: Date,
    @Query("to") to: Date,
    @Query("kitchen_id") kitchenId?: number,
    @Query("site_id") siteId?: number,
    @Query("space_id") spaceId?: number,
    @Query("user_id") userId?: number
  ) {
    const filters = {
      kitchen_id: kitchenId,
      site_id: siteId,
      space_id: spaceId,
      user_id: userId,
    };

    return this.orderService.orderReport(from, to, filters);
  }
}
