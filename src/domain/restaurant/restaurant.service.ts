import { Injectable } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class RestaurantService {
  constructor(private readonly database: DatabaseService) {}

  create(createRestaurantDto: CreateRestaurantDto) {
    return "This action adds a new restaurant";
  }

  async findAll() {
    return await this.database.restaurant.findMany();
  }

  async findOne(id: number) {
    return await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });
  }

  update(id: number, updateRestaurantDto: UpdateRestaurantDto) {
    return `This action updates a #${id} restaurant`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
