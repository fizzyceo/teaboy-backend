import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";

import { DatabaseService } from "src/database/database.service";

import {
  CreateUserDto,
  UpdateUserDto,
  AddUserToSpaceDto,
  AddUserToSiteDto,
} from "./dto";

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

  async getUserById(id: number) {
    const user = await this.findUserById(id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
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

  // User and Spaces
  async addUserToSpace(userId: number, spaceId: number) {
    const userExists = await this.findUserById(userId);

    const space = await this.database.space.findUnique({
      where: { space_id: spaceId },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${spaceId} not found`);
    }

    this.database.user.update({
      where: { user_id: userId },
      data: {
        spaces: {
          connect: {
            space_id: spaceId,
          },
        },
      },
    });

    return space;
  }
  async getUserSpaces(user: any) {
    const { user_id } = user;

    const myUser = await this.findUserById(user_id);

    const spaces = await this.database.space.findMany({
      where: {
        users: {
          some: {
            user_id: user_id,
          },
        },
      },

      select: {
        space_id: true,
        name: true,
        site_id: true,
        kitchen_id: true,
        created_at: true,
        updated_at: true,
        menus: {
          select: {
            menu_id: true,
          },
        },
      },
    });

    return spaces.map((space) => ({
      space_id: space.space_id,
      name: space.name,
      site_id: space.site_id,
      kitchen_id: space.kitchen_id,
      created_at: space.created_at,
      updated_at: space.updated_at,
      // ...space,
      menu_ids: space.menus.map((menu) => menu.menu_id),
    }));
  }

  // User and Sites
  async addUserToSite(userId: number, siteId: number) {
    const userExists = await this.findUserById(userId);

    const site = await this.database.site.findUnique({
      where: { site_id: siteId },
    });

    if (!site) {
      throw new NotFoundException(`Site with id ${siteId} not found`);
    }

    return this.database.user.update({
      where: { user_id: userId },
      data: {
        sites: {
          connect: {
            site_id: siteId,
          },
        },
      },
    });
  }
  async getUserSites(user: any) {
    const { user_id } = user;

    const myUser = await this.findUserById(user_id);

    return await this.database.site.findMany({
      where: {
        users: {
          some: {
            user_id: user_id,
          },
        },
      },
    });
  }
}
