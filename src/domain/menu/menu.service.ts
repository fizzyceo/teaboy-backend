import { Injectable } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuService {
  constructor(private readonly database: DatabaseService) {}

  async create(createMenuDto: CreateMenuDto) {
    return await this.database.menu.create({
      data: createMenuDto,
    });
  }

  async findAll() {
    return await this.database.menu.findMany();
  }

  async findOne(id: number) {
    return await this.database.menu.findUnique({
      where: { menu_id: id },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return await this.database.menu.update({
      where: { menu_id: id },
      data: updateMenuDto,
    });
  }

  async remove(id: number) {
    return await this.database.menu.delete({
      where: { menu_id: id },
    });
  }
}
