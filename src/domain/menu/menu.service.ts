import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { SpaceService } from "../space/space.service";

import { CreateMenuDto, UpdateMenuDto } from "./dto";
import { KitchenService } from "../kitchen/kitchen.service";

@Injectable()
export class MenuService {
  constructor(
    private readonly database: DatabaseService,
    private readonly spaceService: SpaceService,
    private readonly kitchenService: KitchenService
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

  async createMenu(createMenuDto: CreateMenuDto, user_id: number) {
    return await this.database.menu.create({
      data: {
        ...createMenuDto,
      },
    });
  }

  async getAllMenus(user_id: number) {
    const menus = await this.database.menu.findMany({
      where: {
        spaces: {
          some: {
            users: {
              some: {
                user_id: user_id,
              },
            },
          },
        },
      },
      select: {
        menu_id: true,
        name: true,
        ask_for_name: true,
        ask_for_table: true,
        created_at: true,
        updated_at: true,
        spaces: {
          select: {
            space_id: true,
            name: true,
            site: {
              select: {
                site_id: true,
                name: true,
                image_url: true,
              },
            },
          },
        },
      },
    });

    return menus.flatMap((menu) =>
      menu.spaces.map((space) => ({
        menu_id: space.space_id,
        name: space.name,
      }))
    );
  }

  async getAllMenusOld() {
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
                image_url: true,
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
        site_image_url: space.site.image_url,
      })),
    }));
  }

  async getMenuById(id: number, space_id?: number, site_id?: number) {
    const associatedKitchen = await this.database.kitchen.findFirst({
      where: {
        spaces: {
          some: { space_id },
        },
      },
      select: {
        kitchen_id: true,
      },
    });

    let isCurrentlyOpen = false;
    if (associatedKitchen?.kitchen_id) {
      isCurrentlyOpen = await this.kitchenService.isKitchenCurrentlyOpen(
        associatedKitchen.kitchen_id
      );
    }

    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
      select: {
        created_at: true,
        updated_at: true,
        name: true,
        menu_id: true,
        ask_for_name: true,
        ask_for_table: true,
        sites: site_id
          ? {
              select: {
                name: true,
                site_id: true,
                image_url: true,
              },
              where: { site_id },
            }
          : undefined,
        spaces: space_id
          ? {
              select: {
                name: true,
                space_id: true,
                site: {
                  select: {
                    name: true,
                    address: true,
                    description: true,
                    image_url: true,
                    phone: true,
                  },
                },
              },
              where: { space_id },
            }
          : undefined,
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
                    default_choice: {
                      select: {
                        name: true,
                        menu_item_option_choice_id: true,
                      },
                    },
                    default_choice_id: true,
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

    return {
      ...menu,
      isOpen: isCurrentlyOpen,
      menu_items: menu.menu_items.map((item) => ({
        menu_item_id: item.menu_item_id,
        title: item.title,
        price: item.price,
        available: item.available,
        item_images: item.item_images.map((image) => ({
          image_url: image.image_url,
          item_image_id: image.item_image_id,
        })),
        options: item.menuItem_options.map((option) => ({
          name: option.menu_item_option.name,
          menu_item_option_id: option.menu_item_option.menu_item_option_id,
          default_choice: option.menu_item_option.default_choice,
          choices: option.menu_item_option.choices,
          default_choice_id: option.menu_item_option.default_choice_id,
        })),
      })),
    };
  }

  async getMenuItems(id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu_Item.findMany({
      where: { menu_id: id },
      include: {
        item_images: true,
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

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto, user_id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu.update({
      where: { menu_id: id },
      data: updateMenuDto,
    });
  }

  async deleteMenu(id: number, user_id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu.delete({
      where: { menu_id: id },
    });
  }

  async linkMenuToSpace(menu_id: number, space_id: number, user_id: number) {
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

  async linkMenuToSite(menu_id: number, site_id: number, user_id: number) {
    const menu = await this.findMenuById(menu_id);
    const site = await this.database.site.findUnique({
      where: { site_id },
    });

    if (!site) {
      throw new NotFoundException(`Site with id ${site_id} not found`);
    }

    return await this.database.menu.update({
      where: { menu_id },
      data: {
        sites: {
          connect: {
            site_id,
          },
        },
      },
    });
  }

  async getMenuList() {
    return await this.database.menu.findMany();
  }
}
