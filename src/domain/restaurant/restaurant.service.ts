import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class RestaurantService {
  constructor(private readonly database: DatabaseService) {}

  async createRestaurant(createRestaurantDto: CreateRestaurantDto) {
    return await this.database.restaurant.create({
      data: createRestaurantDto,
    });
  }

  async getAllRestraurants() {
    return await this.database.restaurant.findMany();
  }

  async getRestaurantById(id: number) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });
  }

  async getRestaurantMenus(id: number) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return await this.database.menu.findMany({
      where: { restaurant_id: id },
    });
  }

  async getRestaurantEmployees(id: number) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return await this.database.employee.findMany({
      where: { restaurant_id: id },
    });
  }

  async updateRestraurant(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto
  ) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return await this.database.restaurant.update({
      where: { restaurant_id: id },
      data: updateRestaurantDto,
    });
  }

  async deleteRestaurant(id: number) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    return await this.database.restaurant.delete({
      where: { restaurant_id: id },
    });
  }
}
