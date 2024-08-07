import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateRestaurantDto } from "./dto/create-restaurant.dto";
import { UpdateRestaurantDto } from "./dto/update-restaurant.dto";
import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";

@Injectable()
export class RestaurantService {
  constructor(
    private readonly database: DatabaseService,
    private readonly imagesService: ImagesService
  ) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    file: Express.Multer.File
  ) {
    const imageUrl = await this.imagesService.uploadFile(file);

    return await this.database.restaurant.create({
      data: {
        ...createRestaurantDto,
        image_url: imageUrl.url,
      },
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

    return await this.database.user.findMany({
      where: {
        restaurants: {
          some: {
            restaurant_id: id,
          },
        },
      },
    });
  }

  async updateRestaurant(
    id: number,
    updateRestaurantDto: UpdateRestaurantDto,
    updateFile: Express.Multer.File
  ) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    let imageUrl = restaurant.image_url;

    if (updateFile) {
      const uploadedImage = await this.imagesService.uploadFile(updateFile);
      imageUrl = uploadedImage.url;
    }

    const updateData = {
      image_url: imageUrl,
      ...updateRestaurantDto,
    };

    return await this.database.restaurant.update({
      where: { restaurant_id: id },
      data: updateData,
    });
  }

  async deleteRestaurant(id: number) {
    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: id },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with id ${id} not found`);
    }

    await this.database.restaurant.delete({
      where: { restaurant_id: id },
    });

    return {
      message: `Restaurant with id ${id} deleted successfully`,
    };
  }
}
