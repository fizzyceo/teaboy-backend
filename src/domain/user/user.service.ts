import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "src/database/database.service";

import * as bcrypt from "bcrypt";
import { LinkUserToRestaurantDto } from "./dto/link-user-to-restaurant.dto";

export const roundsOfHashing = 10;

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  async createUser(createuserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(
      createuserDto.password,
      roundsOfHashing
    );

    createuserDto.password = hashedPassword;

    console.log(createuserDto);

    return await this.database.user.create({
      data: createuserDto,
    });
  }

  async getAllUsers() {
    return await this.database.user.findMany();
  }

  async addUserToRestaurant(linkUserToRestaurantDto: LinkUserToRestaurantDto) {
    console.log(linkUserToRestaurantDto);
    const { userId, restaurantId } = linkUserToRestaurantDto;
    const user = await this.database.user.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${userId} not found`);
    }

    const restaurant = await this.database.restaurant.findUnique({
      where: {
        restaurant_id: restaurantId,
      },
    });

    if (!restaurant) {
      throw new NotFoundException(
        `restaurant with id ${restaurantId} not found`
      );
    }

    return this.database.user.update({
      where: { user_id: userId },
      data: {
        restaurants: {
          connectOrCreate: {
            where: {
              user_id_restaurant_id: {
                user_id: userId,
                restaurant_id: restaurantId,
              },
            },
            create: {
              restaurant_id: restaurantId,
            },
          },
        },
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.database.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }
    return await this.database.user.findUnique({
      where: { user_id: id },
    });
  }

  async updateUser(id: number, updateuserDto: UpdateUserDto) {
    const user = await this.database.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    if (updateuserDto.password) {
      updateuserDto.password = await bcrypt.hash(
        updateuserDto.password,
        roundsOfHashing
      );
    }
    // return await this.database.user.update({
    //   where: { user_id: id },
    //   data: updateuserDto,
    // });
  }

  async deleteUser(id: number) {
    const user = await this.database.user.findUnique({
      where: { user_id: id },
    });

    if (!user) {
      throw new NotFoundException(`user with id ${id} not found`);
    }

    return await this.database.user.delete({
      where: { user_id: id },
    });
  }
}
