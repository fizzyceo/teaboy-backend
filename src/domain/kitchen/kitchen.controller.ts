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
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from "@nestjs/swagger";

import { KitchenService } from "./kitchen.service";
import { CreateKitchenDto, UpdateKitchenDto } from "./dto";
import { KitchenAuthGuard } from "src/auth/guard/kitchen.guard";
import { OrderStatus } from "../order-item/dto";

@Controller("kitchen")
@ApiTags("kitchen")
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a new kitchen" })
  @ApiBody({ type: CreateKitchenDto })
  @ApiOperation({
    summary: "Create a new kitchen",
    description: "Create a new kitchen by providing name, space_id",
  })
  createKitchen(@Body() createKitchenDto: CreateKitchenDto) {
    return this.kitchenService.createKitchen(createKitchenDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all kitchens" })
  getAllKitchens() {
    return this.kitchenService.getAllKitchens();
  }

  @Get("/order-items")
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: "status",
    required: false,
    description: "Filter order items by status",
    enum: OrderStatus,
  })
  @ApiQuery({
    name: "page",
    required: false,
    description: "Page number for pagination",
    type: Number,
    example: 1,
  })
  @ApiOperation({ summary: "Get all order items related to a Kitchen" })
  async getOrderItems(
    @Req() req,
    @Query("status") status?: string,
    @Query("page") page: number = 1
  ) {
    return await this.kitchenService.getOrderItems(req.user, status, page);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get kitchen details by id" })
  @ApiParam({
    name: "id",
    description: "Kitchen id to fetch",
    required: true,
  })
  getKitchenById(@Param("id", ParseIntPipe) id: number) {
    return this.kitchenService.getKitchenById(id);
  }

  @Patch("/update")
  @ApiBody({
    type: UpdateKitchenDto,
    description: "Update kitchen details",
  })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update kitchen details" })
  updateKitchen(@Body() updateKitchenDto: UpdateKitchenDto, @Req() req) {
    return this.kitchenService.updateKitchen(req.user, updateKitchenDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Remove kitchen" })
  @ApiParam({
    name: "id",
    description: "Kitchen id to remove",
    required: true,
  })
  removeKitchen(@Param("id", ParseIntPipe) id: number) {
    return this.kitchenService.removeKitchen(id);
  }

  @Post(":kitchen_id/link-space/:space_id")
  @ApiOperation({ summary: "Link kitchen to space" })
  @ApiParam({
    name: "kitchen_id",
    description: "Kitchen id to link",
    required: true,
  })
  @ApiQuery({
    name: "space_id",
    description: "Space id to link",
    required: true,
  })
  linkKitchenToSpace(
    @Param("kitchen_id", ParseIntPipe) kitchenId: number,
    @Query("space_id", ParseIntPipe) spaceId: number
  ) {
    return this.kitchenService.linkKitchenToSpace(kitchenId, spaceId);
  }
}
