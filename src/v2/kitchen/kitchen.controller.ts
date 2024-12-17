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
  Headers,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";

import { KitchenService } from "./kitchen.service";
import { CreateKitchenDto, UpdateKitchenDto } from "./dto";
import { KitchenAuthGuard } from "src/auth/guard/kitchen.guard";
import { OrderStatus } from "../order-item/dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("v2/kitchen")
@ApiTags("kitchen")
// @UseInterceptors(CacheInterceptor)
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
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getAllKitchens(@Req() user: any, @Headers("LANG") lang: string) {
    const { user_id } = user.user;
    return this.kitchenService.getAllKitchens(user_id, lang);
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
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  @ApiOperation({ summary: "Get all order items related to a Kitchen" })
  async getOrderItems(
    @Req() req,
    @Headers("LANG") lang: string,

    @Query("status") status?: string,
    @Query("page") page: number = 1
  ) {
    return await this.kitchenService.getOrderItems(
      lang,
      req.user,
      status,
      page
    );
  }

  @Get("/infos")
  @ApiOperation({ summary: "Get kitchen details by id" })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getKitchenById(@Req() req, @Headers("LANG") lang: string) {
    return this.kitchenService.getKitchenInfos(req.user, lang);
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
    @Param("space_id", ParseIntPipe) spaceId: number
  ) {
    return this.kitchenService.linkKitchenToSpace(kitchenId, spaceId);
  }

  @Post(":kitchen_id/unlink-tablet")
  @ApiOperation({ summary: "Unlink tablet from kitchen" })
  @ApiParam({
    name: "kitchen_id",
    description: "Kitchen id to unlink",
    required: true,
  })
  @ApiQuery({
    name: "fcm_token",
    required: false,
    description: "FCM token to unlink",
    type: String,
  })
  unlinkTablet(
    @Param("kitchen_id", ParseIntPipe) kitchenId: number,
    @Query("fcm_token") fcmToken?: string
  ) {
    return this.kitchenService.unlinkTablet(kitchenId, fcmToken);
  }
}
