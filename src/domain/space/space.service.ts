import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";

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
}
