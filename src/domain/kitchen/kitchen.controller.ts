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
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { KitchenService } from "./kitchen.service";
import { CreateKitchenDto, UpdateKitchenDto } from "./dto";

@Controller("kitchen")
@ApiTags("kitchen")
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Post()
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

  @Patch(":id")
  @ApiOperation({ summary: "Update kitchen details" })
  @ApiParam({
    name: "id",
    description: "Kitchen id to update",
    required: true,
  })
  updateKitchen(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateKitchenDto: UpdateKitchenDto
  ) {
    return this.kitchenService.updateKitchen(id, updateKitchenDto);
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
}
