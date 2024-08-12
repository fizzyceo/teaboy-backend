import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";

import { CreateUserDto, UpdateUserDto, AddUserToSiteDto } from "./dto";

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

  async addUserToSite(addUserToSite: AddUserToSiteDto) {
    const { userId, site_id } = addUserToSite;

    const user = await this.findUserById(userId);

    const site = await this.database.site.findUnique({
      where: {
        site_id: site_id,
      },
    });

    if (!site) {
      throw new NotFoundException(`site with id ${site_id} not found`);
    }

    return this.database.user.update({
      where: { user_id: userId },
      data: {
        sites: {
          connectOrCreate: {
            where: {
              user_id_site_id: {
                user_id: userId,
                site_id: site_id,
              },
            },
            create: {
              site_id: site_id,
            },
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
