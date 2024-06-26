import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuItemService {
  constructor(private readonly database: DatabaseService) {}

  async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
    return await this.database.menu_Item.create({
      data: createMenuItemDto,
    });
  }

  async getAllMenuItems() {
    return await this.database.menu_Item.findMany();
  }

  async getMenuItemById(id: number) {
    const menuItem = this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return menuItem;
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return await this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateMenuItemDto,
    });
  }

  async deleteMenuItem(id: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return await this.database.menu_Item.delete({
      where: { menu_item_id: id },
    });
  }
}
