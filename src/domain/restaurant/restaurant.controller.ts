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

import { ApiTags, ApiBody } from "@nestjs/swagger";

@Controller("restaurant")
@ApiTags("restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  createRestaurant(@Body() createRestaurantDto: CreateRestaurantDto) {
    return this.restaurantService.createRestaurant(createRestaurantDto);
  }

  @Get()
  getAllRestraurants() {
    return this.restaurantService.getAllRestraurants();
  }

  @Get(":id")
  getRestaurantById(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.getRestaurantById(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateRestaurantDto })
  updateRestraurant(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return this.restaurantService.updateRestraurant(id, updateRestaurantDto);
  }

  @Delete(":id")
  deleteRestaurant(@Param("id", ParseIntPipe) id: number) {
    return this.restaurantService.deleteRestaurant(id);
  }
}
