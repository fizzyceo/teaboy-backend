import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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

    return await this.database.user.update({
      where: { user_id: userId },
      data: {
        spaces: {
          connect: {
            space_id: spaceId,
          },
        },
      },
      include: {
        spaces: true,
      },
    });
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
        type: true,
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
      type: space.type,
      kitchen_id: space.kitchen_id,
      created_at: space.created_at,
      updated_at: space.updated_at,
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

    return await this.database.user.update({
      where: { user_id: userId },
      data: {
        sites: {
          connect: {
            site_id: siteId,
          },
        },
      },
      include: {
        sites: true,
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

  async getKitchenStatus(kitchen_id: number, user_id: number) {
    const userCanAccessKitchen = await this.database.user.findFirst({
      where: {
        user_id,
        spaces: {
          some: {
            kitchen_id: kitchen_id,
          },
        },
      },
    });

    if (!userCanAccessKitchen) {
      throw new UnauthorizedException(
        `User does not have access to kitchen with id ${kitchen_id}`
      );
    }

    // Fetch the kitchen along with openingHours
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id },
      select: {
        isOpen: true,
        openingHours: {
          select: {
            openingHours_id: true,
            dayOfWeek: true,
            openTime: true,
            closeTime: true,
          },
        },
      },
    });

    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${kitchen_id} not found`);
    }

    // Determine if the kitchen is currently open based on opening hours
    const currentTime = new Date();
    const currentDayOfWeek = currentTime
      .toLocaleString("en-US", { weekday: "long" })
      .toUpperCase(); // e.g., "MONDAY"

    let isCurrentlyOpen = false;

    if (kitchen.openingHours && kitchen.openingHours.length > 0) {
      const todayOpeningHours = kitchen.openingHours.find(
        (hours) => hours.dayOfWeek === currentDayOfWeek
      );

      if (todayOpeningHours) {
        const openTimeParts = todayOpeningHours.openTime.split(":");
        const closeTimeParts = todayOpeningHours.closeTime.split(":");

        const openTime = new Date(currentTime);
        openTime.setHours(
          parseInt(openTimeParts[0], 10),
          parseInt(openTimeParts[1], 10),
          0
        );

        const closeTime = new Date(currentTime);
        closeTime.setHours(
          parseInt(closeTimeParts[0], 10),
          parseInt(closeTimeParts[1], 10),
          0
        );

        // Adjust for cases where closeTime is past midnight
        if (closeTime < openTime) {
          closeTime.setDate(closeTime.getDate() + 1);
        }

        // Check if the current time falls within the opening hours
        if (currentTime >= openTime && currentTime <= closeTime) {
          isCurrentlyOpen = true;
        }
      }
    }

    // Combine the kitchen's isOpen flag with the current time status
    const finalIsOpen = kitchen.isOpen && isCurrentlyOpen;

    // Return the kitchen status along with opening hours
    return {
      isOpen: finalIsOpen,
      openingHours: kitchen.openingHours.map((hours) => ({
        openingHours_id: hours.openingHours_id,
        dayOfWeek: hours.dayOfWeek,
        openTime: hours.openTime,
        closeTime: hours.closeTime,
      })),
    };
  }
}
