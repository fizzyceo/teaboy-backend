import { Injectable } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuItemService {
  constructor(private readonly database: DatabaseService) {}

  async create(createMenuItemDto: CreateMenuItemDto) {
    return await this.database.menu_Item.create({
      data: createMenuItemDto,
    });
  }

  async findAll() {
    return await this.database.menu_Item.findMany();
  }

  async findOne(id: number) {
    return await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
    });
  }

  async update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return await this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateMenuItemDto,
    });
  }

  async remove(id: number) {
    return await this.database.menu_Item.delete({
      where: { menu_item_id: id },
    });
  }
}
