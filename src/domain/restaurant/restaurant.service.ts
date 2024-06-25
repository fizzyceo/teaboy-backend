import { Injectable } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class RestaurantService {
  constructor(private readonly database: DatabaseService) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    return await this.database.restaurant.create({
      data: createRestaurantDto,
    });
  }

  async findAll() {
    return await this.database.restaurant.findMany();
  }

  async findOne(id: number) {
    return await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });
  }

  async update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return await this.database.restaurant.update({
      where: { restaurant_id: id },
      data: updateRestaurantDto,
    });
  }

  async remove(id: number) {
    return await this.database.restaurant.delete({
      where: { restaurant_id: id },
    });
  }
}
