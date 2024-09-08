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
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all kitchens" })
  getAllKitchens(@Req() user: any) {
    const { user_id } = user.user;
    return this.kitchenService.getAllKitchens(user_id);
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

  @Get("/infos")
  @ApiOperation({ summary: "Get kitchen details by id" })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  getKitchenById(@Req() req) {
    return this.kitchenService.getKitchenInfos(req.user);
  }

  @Patch("/update")
  @ApiBody({
    type: UpdateKitchenDto,
    description: "Update kitchen details",
    examples: {
      example1: {
        summary: "Example of updating a kitchen",
        value: {
          name: "Kitchen 1",
          isOpen: true,
          isWeeklyTimingOn: true,
          openingHours: [
            {
              dayOfWeek: "MONDAY",
              openTime: "09:00",
              closeTime: "18:00",
              timezone: "+1:00",
            },
          ],
        },
      },
    },
  })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update kitchen details" })
  updateKitchen(@Body() updateKitchenDto: UpdateKitchenDto, @Req() req) {
    return this.kitchenService.updateKitchen(req.user, updateKitchenDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Remove kitchen" })
  @ApiParam({
    name: "id",
    description: "Kitchen id to remove",
    required: true,
  })
  removeKitchen(@Param("id", ParseIntPipe) id: number, @Req() user: any) {
    const { user_id } = user.user;
    return this.kitchenService.removeKitchen(id, user_id);
  }

  @Post(":kitchen_id/link-space/:space_id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Link kitchen to space" })
  @ApiParam({
    name: "kitchen_id",
    description: "Kitchen id to link",
    required: true,
  })
  @ApiParam({
    name: "space_id",
    description: "Space id to link",
    required: true,
  })
  linkKitchenToSpace(
    @Param("kitchen_id", ParseIntPipe) kitchenId: number,
    @Param("space_id", ParseIntPipe) spaceId: number,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    return this.kitchenService.linkKitchenToSpace(kitchenId, spaceId, user_id);
  }
}
