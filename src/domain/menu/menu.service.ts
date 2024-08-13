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
    const { site_id, ...menuData } = createMenuDto;

    const site = await this.database.site.findUnique({
      where: { site_id },
    });

    if (!site) {
      throw new NotFoundException(`Site with id ${site_id} not found`);
    }

    return await this.database.menu.create({
      data: {
        ...menuData,
        sites: {
          connect: {
            site_id: site_id,
          },
        },
      },
    });
  }

  async getAllMenus() {
    const menus = await this.database.menu.findMany({
      include: {
        spaces: {
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

    return menus.map((menu) => ({
      ...menu,
      spaces: menu.spaces.map((space) => ({
        space_id: space.space_id,
        name: space.name,
        site_id: space.site.site_id,
        site_name: space.site.name,
      })),
    }));
  }

  async getMenuById(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
      select: {
        name: true,
        menu_id: true,
        spaces: {
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
            item_images: {
              select: {
                image_url: true,
                item_image_id: true,
              },
            },
            menuItem_options: {
              select: {
                menu_item_option: {
                  select: {
                    name: true,
                    menu_item_option_id: true,
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
        menuItem_options: {
          include: {
            menu_item_option: {
              include: {
                choices: true,
              },
            },
          },
        },
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

  async linkMenuToSpace(menu_id: number, space_id: number) {
    const menu = await this.findMenuById(menu_id);
    const space = await this.spaceService.findSpaceById(space_id);

    return await this.database.menu.update({
      where: { menu_id },
      data: {
        spaces: {
          connect: {
            space_id,
          },
        },
      },
    });
  }
}
