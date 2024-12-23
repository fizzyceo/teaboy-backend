import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class SpaceService {
  constructor(private readonly database: DatabaseService) {}

  // Get spaces for a specific site
  async getSpacesForSite(site_id: number) {
    const spaces = await this.database.space.findMany({
      where: { site_id },
    });

    if (!spaces || spaces.length === 0) {
      throw new NotFoundException(
        `No spaces found for site with id ${site_id}`
      );
    }

    return spaces;
  }

  // Create a new space
  async createSpace(createSpaceDto: CreateSpaceDto) {
    const { site_id, kitchen_id, menu_id, ...rest } = createSpaceDto;

    return await this.database.space.create({
      data: {
        ...rest,
        site: {
          connect: {
            site_id: site_id,
          },
        },
        kitchen: kitchen_id
          ? {
              connect: {
                kitchen_id: kitchen_id,
              },
            }
          : undefined,
        menus: menu_id
          ? {
              connect: {
                menu_id: menu_id,
              },
            }
          : undefined,
      },
    });
  }

  // Update a space by its ID
  async updateSpace(id: number, updateSpaceDto: UpdateSpaceDto) {
    const space = await this.findSpaceById(id);

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    return await this.database.space.update({
      where: { space_id: id },
      data: { ...updateSpaceDto },
    });
  }

  // Delete a space by its ID
  async deleteSpace(id: number) {
    const space = await this.findSpaceById(id);

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    return await this.database.space.delete({
      where: { space_id: id },
    });
  }

  // Find all spaces
  async findAllSpaces() {
    return await this.database.space.findMany();
  }

  // Find a space by its ID
  async findSpaceById(id: number) {
    const space = await this.database.space.findUnique({
      where: { space_id: id },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    return space;
  }
}
