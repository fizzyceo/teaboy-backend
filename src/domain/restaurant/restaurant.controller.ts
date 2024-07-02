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
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

import { ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("restaurant")
@ApiTags("restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  @ApiOperation({ summary: "Create a new restaurant" })
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all restaurants" })
  getAllRestraurants() {
    return this.restaurantService.getAllRestraurants();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get restaurant details by id" })
  @ApiParam({
    name: "id",
    description: "Restaurant id to fetch",
    required: true,
  })
  getRestaurantById(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantById(id);
  }

  @Get(":id/menus")
  @ApiOperation({ summary: "Get restaurant menus by id" })
  @ApiParam({
    name: "id",
    description: "Restaurant id to fetch menus",
    required: true,
  })
  getRestaurantMenus(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantMenus(id);
  }

  @Get(":id/employees")
  @ApiOperation({ summary: "Get restaurant employees by id" })
  @ApiParam({
    name: "id",
    description: "Restaurant id to fetch employees",
    required: true,
  })
  getRestaurantEmployees(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantEmployees(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiOperation({ summary: "Update restaurant details by id" })
  @ApiParam({
    name: "id",
    description: "Restaurant id to update",
    required: true,
  })
  updateRestraurant(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return this.restaurantService.updateRestraurant(id, updateRestaurantDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete restaurant by id" })
  @ApiParam({
    name: "id",
    description: "Restaurant id to delete",
    required: true,
  })
  deleteRestaurant(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.deleteRestaurant(id);
  }
}
