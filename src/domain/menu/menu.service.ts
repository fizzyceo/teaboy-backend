import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuService {
  constructor(private readonly database: DatabaseService) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    return await this.database.menu.create({
      data: createMenuDto,
    });
  }

  async getAllMenus() {
    return await this.database.menu.findMany({
      include: {
        menu_items: true,
        restaurant: true,
      },
    });
  }

  async getMenuById(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
      include: {
        menu_items: {
          select: {
            menu_item_id: true,
            title: true,
            price: true,
            description: true,
            categories: true,
            available: true,
          },
        },
        restaurant: {
          select: {
            restaurant_id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return menu;
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return await this.database.menu.update({
      where: { menu_id: id },
      data: updateMenuDto,
    });
  }

  async deleteMenu(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return await this.database.menu.delete({
      where: { menu_id: id },
    });
  }
}
