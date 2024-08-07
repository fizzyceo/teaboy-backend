import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { DatabaseService } from "src/database/database.service";

import * as bcrypt from "bcrypt";

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

    // return await this.database.user.create({
    //   data: createuserDto,
    // });
  }

  async getAllUsers() {
    return await this.database.user.findMany();
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
