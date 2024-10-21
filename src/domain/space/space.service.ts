import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { CreateSpaceDto } from "../space/dto/create-space.dto";

@Injectable()
export class SpaceService {
  constructor(private readonly database: DatabaseService) {}

  async findSpaceById(id: number) {
    const space = await this.database.space.findUnique({
      where: { space_id: id },
    });

    if (!space) {
      throw new NotFoundException(`Space with id ${id} not found`);
    }

    return space;
  }

  async getAllSpaces() {
    const spaces = await this.database.space.findMany({});
    return spaces;
  }

  async getSpacesForSite(site_id: number) {
    const spaces = await this.database.space.findMany({
      where: {
        site_id: site_id,
      },
    });

    return spaces;
  }

  async createSpace(createSpaceDto: CreateSpaceDto) {
    return await this.database.space.create({
      data: {
        ...createSpaceDto,
      },
    });
  }
}
