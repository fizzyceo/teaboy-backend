import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { SpaceService } from "../space/space.service";

import { CreateMenuDto, UpdateMenuDto } from "./dto";

@Injectable()
export class MenuService {
  constructor(
    private readonly database: DatabaseService,
    private readonly spaceService: SpaceService
  ) {}

  private async findMenuById(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return menu;
  }

  async createMenu(createMenuDto: CreateMenuDto) {
    const { space_id, ...menuData } = createMenuDto;

    const space = await this.spaceService.findSpaceById(space_id);

    return await this.database.menu.create({
      data: {
        ...menuData,
        space: {
          connect: {
            space_id: space_id,
          },
        },
      },
    });
  }

  async getAllMenus() {
    return await this.database.menu.findMany({
      include: {
        space: {
          select: {
            space_id: true,
            name: true,
            site: {
              select: {
                site_id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getMenuById(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
      include: {
        space: {
          select: {
            space_id: true,
            name: true,
            site: {
              select: {
                site_id: true,
                name: true,
              },
            },
          },
        },
        menu_items: {
          select: {
            menu_item_id: true,
            title: true,
            price: true,
            description: true,
            available: true,
            categories: {
              select: {
                name: true,
                category_id: true,
              },
            },
            item_images: {
              select: {
                image_url: true,
                item_image_id: true,
              },
            },
            options: {
              select: {
                menu_item_option_id: true,
                name: true,
                choices: {
                  select: {
                    menu_item_option_choice_id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return menu;
  }

  async getMenuItems(id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu_Item.findMany({
      where: { menu_id: id },
      include: {
        item_images: true,
        categories: true,
      },
    });
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findMenuById(id);

    return await this.database.menu.update({
      where: { menu_id: id },
      data: updateMenuDto,
    });
  }

  async deleteMenu(id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu.delete({
      where: { menu_id: id },
    });
  }

  async getMenuCategories(id: number) {
    const menu = await this.findMenuById(id);

    const menuItems = await this.database.menu_Item.findMany({
      where: { menu_id: id },
      include: {
        categories: true,
      },
    });

    const categories = menuItems.reduce((acc, item) => {
      item.categories.forEach((category) => {
        if (!acc.includes(category)) {
          acc.push(category);
        }
      });

      return acc;
    }, []);

    return categories;
  }
}
