import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";

import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("restaurant")
@ApiTags("restaurant")
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @ApiBody({ type: CreateRestaurantDto })
  @ApiOperation({ summary: "Create a new restaurant" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.restaurantService.createRestaurant(createRestaurantDto, file);
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
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    description: "Restaurant id to update",
    required: true,
  })
  updateRestraurant(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return this.restaurantService.updateRestaurant(
      id,
      updateRestaurantDto,
      file
    );
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
