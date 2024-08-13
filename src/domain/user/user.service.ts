import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";

import { CreateUserDto, UpdateUserDto, AddUserToSpaceDto } from "./dto";

@Injectable()
export class UserService {
  constructor(private readonly database: DatabaseService) {}

  private readonly roundsOfHashing = 10;

  private async checkIfUserExists(email: string) {
    const user = await this.database.user.findUnique({ where: { email } });
    if (user) {
      throw new ConflictException("Email already exists");
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.roundsOfHashing);
  }

  private async findUserById(id: number) {
    const user = await this.database.user.findUnique({
      where: { user_id: id },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    await this.checkIfUserExists(createUserDto.email);

    createUserDto.password = await this.hashPassword(createUserDto.password);

    return await this.database.user.create({
      data: createUserDto,
    });
  }

  async getAllUsers() {
    return await this.database.user.findMany();
  }

  async addUserToSpace(addUserToSpaceDto: AddUserToSpaceDto) {
    const { userId, spaceId } = addUserToSpaceDto;

    const user = await this.findUserById(userId);

    const space = await this.database.space.findUnique({
      where: { space_id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${spaceId} not found`);
    }

    return this.database.user.update({
      where: { user_id: userId },
      data: {
        spaces: {
          connect: {
            space_id: spaceId,
          },
        },
      },
    });
  }

  async getUserById(id: number) {
    return await this.findUserById(id);
  }

  async updateUser(id: number, updateuserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    if (updateuserDto.password) {
      updateuserDto.password = await this.hashPassword(updateuserDto.password);
    }

    return await this.database.user.update({
      where: { user_id: id },
      data: updateuserDto,
    });
  }

  async deleteUser(id: number) {
    const user = await this.findUserById(id);

    return await this.database.user.delete({
      where: { user_id: id },
    });
  }
}
