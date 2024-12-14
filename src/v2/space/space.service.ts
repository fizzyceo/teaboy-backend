import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateSpaceDto } from "../space/dto/create-space.dto";
import { UpdateSpaceDto } from "../space/dto/update-space.dto";

@Injectable()
export class SpaceService {
  constructor(private readonly database: DatabaseService) {}

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

  // Get all spaces
  async getAllSpaces() {
    const spaces = await this.database.space.findMany({});
    return spaces;
  }

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
    return await this.database.space.create({
      data: { ...createSpaceDto },
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
}
