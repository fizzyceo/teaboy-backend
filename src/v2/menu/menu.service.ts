import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { SpaceService } from "../space/space.service";

import { CreateMenuDto, UpdateMenuDto } from "./dto";
import { KitchenService } from "../kitchen/kitchen.service";
import { formatMenuResponse } from "src/utils/formatting-ar";

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

  async createMenu(createMenuDto: CreateMenuDto) {
    return await this.database.menu.create({
      data: {
        ...createMenuDto,
      },
    });
  }

  async getAllMenus(user_id: number, lang: string) {
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
        name_ar: true,
        ask_for_name: true,
        currency: true,
        currency_ar: true,
        VAT: true,
        ask_for_table: true,

        created_at: true,
        updated_at: true,
        spaces: {
          select: {
            space_id: true,
            name: true,
            name_ar: true,
            site: {
              select: {
                site_id: true,
                name: true,
                name_ar: true,
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
        name:
          lang?.toUpperCase() === "AR" && space.name_ar
            ? space.name_ar
            : space.name, // Conditional logic based on LANG
      }))
    );
  }
  async getAllMenusv2(user_id: number, lang: string) {
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
        name_ar: true,
        ask_for_name: true,
        ask_for_table: true,
        VAT: true,
        created_at: true,
        updated_at: true,
        spaces: {
          select: {
            space_id: true,
            name: true,
            name_ar: true,
            site: {
              select: {
                site_id: true,
                name: true,
                name_ar: true,
                image_url: true,
              },
            },
          },
        },
      },
    });

    // Map based on the language header
    return menus.map((menu) => ({
      menu_id: menu.menu_id,
      name: lang === "AR" && menu.name_ar ? menu.name_ar : menu.name, // Check for LANG to return name or name_ar
      spaces: menu.spaces.map((space) => ({
        space_id: space.space_id,
        name: lang === "AR" && menu.name_ar ? space.name_ar : space.name, // Check for LANG to return space name or space name_ar
        site: {
          site_id: space.site.site_id,
          name:
            lang === "AR" && menu.name_ar
              ? space.site.name_ar
              : space.site.name, // Check for LANG to return site name or site name_ar
          image_url: space.site.image_url,
        },
      })),
    }));
  }

  async getAllMenusOld() {
    const menus = await this.database.menu.findMany({
      include: {
        spaces: {
          select: {
            space_id: true,
            name: true,
            name_ar: true,

            site: {
              select: {
                site_id: true,
                name: true,
                name_ar: true,
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

  async getMenuById(
    id: number,
    space_id?: number,
    site_id?: number,
    lang?: string
  ) {
    // Fetch associated kitchen
    const associatedKitchen = await this.database.kitchen.findFirst({
      where: { spaces: { some: { space_id } } },
      select: { kitchen_id: true },
    });

    // Check if kitchen is currently open
    const isCurrentlyOpen = associatedKitchen?.kitchen_id
      ? await this.kitchenService.isKitchenCurrentlyOpen(
          associatedKitchen.kitchen_id
        )
      : false;

    // Fetch the menu
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
      select: {
        name: true,
        name_ar: true,
        currency: true,

        currency_ar: true,
        ask: true,
        menu_id: true,
        VAT: true,
        // ask_for_name: true,
        // ask_for_table: true,
        // sites: site_id
        //   ? {
        //       select: {
        //         name: true,
        //         name_ar: true,
        //         site_id: true,
        //         image_url: true,
        //       },
        //       where: { site_id },
        //     }
        //   : undefined,
        spaces: space_id
          ? {
              select: {
                name: true,
                name_ar: true,

                default_lang: true,
                kitchen_id: true,
                site_id: true,
                type: true,
                space_id: true,
                theme: true,
                site: {
                  select: {
                    name: true,
                    name_ar: true,
                    address: true,
                    address_ar: true,
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
            title_ar: true,
            price: true,
            description: true,
            available: true,
            item_images: { select: { image_url: true, item_image_id: true } },
            menuItem_options: {
              select: {
                menu_item_option: {
                  select: {
                    name: true,
                    name_ar: true,
                    menu_item_option_id: true,

                    default_choice_id: true,
                    choices: {
                      select: {
                        menu_item_option_choice_id: true,
                        name: true,
                        name_ar: true,
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

    // Check if menu exists
    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    const { name, name_ar, spaces, currency, currency_ar, ...rest } = menu;
    const currentLang = lang?.toUpperCase() === "AR" ? "ar" : "en";

    // Transform spaces
    const transformedSpaces = spaces.map((space) => ({
      space_id: space.space_id,
      name: currentLang === "ar" && space.name_ar ? space.name_ar : space.name,
      theme: space.theme,
      default_lang: space.default_lang,
      kitchen_id: space.kitchen_id,
      site_id: space.site_id,
      type: space.type,
      // Conditionally include the `site` field if `site_id` is present
      ...(space.site && {
        site: {
          ...space.site,
          name:
            currentLang === "ar" && space.site.name_ar
              ? space.site.name_ar
              : space.site.name,
        },
      }),
    }));

    // Transform menu items
    const transformedMenuItems = menu.menu_items.map((item) => ({
      item_id: item.menu_item_id,
      title: currentLang === "ar" && item.title_ar ? item.title_ar : item.title,
      price: item.price,

      available: item.available,
      description: item.description,
      images: item.item_images.map((image) => image.image_url.split("/").pop()), // Get unique part of the image URL

      options: item.menuItem_options.map((option) => ({
        name:
          currentLang === "ar" && option.menu_item_option.name_ar
            ? option.menu_item_option.name_ar
            : option.menu_item_option.name,
        option_id: option.menu_item_option.menu_item_option_id,

        choices: option.menu_item_option.choices.map((choice) => ({
          choice_id: choice.menu_item_option_choice_id,
          name:
            currentLang === "ar" && choice.name_ar
              ? choice.name_ar
              : choice.name,
        })),
        default_choice_id: option.menu_item_option.default_choice_id,
      })),
    }));

    const isPriceAvailable = transformedMenuItems.some(
      (item) => item.price > 0
    );

    // Return the structured menu data
    return {
      ask: menu.ask || "Put your table number: ",
      image_url: "https://res.cloudinary.com/dm2k40ije/image/upload/",
      name: currentLang === "ar" && name_ar ? name_ar : name,
      currency: currentLang === "ar" && currency_ar ? currency_ar : currency,

      isOpen: isCurrentlyOpen,
      is_price: isPriceAvailable,
      ...rest,

      menu_items: transformedMenuItems,
      spaces: transformedSpaces,
    };
  }

  async getMenuItems(id: number, lang: string) {
    // const menu = await this.findMenuById(id);

    const items = await this.database.menu_Item.findMany({
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
    return items.map((item) => {
      return formatMenuResponse(item, lang);
    });
  }

  async updateMenu(id: number, updateMenuDto: UpdateMenuDto, user_id: number) {
    const menu = await this.findMenuById(id);

    return await this.database.menu.update({
      where: { menu_id: id },
      data: updateMenuDto,
    });
  }

  // async updateMenu(id: number, updateMenuDto: UpdateMenuDto, user_id: number) {
  //   const menu = await this.findMenuById(id);
  //   const { site_id, ...rest } = updateMenuDto;
  //   return await this.database.menu.update({
  //     where: { menu_id: id },
  //     data: {
  //       ...rest,
  //       sites: {
  //         connect: {
  //           site_id: site_id,
  //         },
  //       },
  //     },
  //   });
  // }

  async deleteMenu(id: number) {
    //, user_id: number
    const menu = await this.findMenuById(id);

    return await this.database.menu.delete({
      where: { menu_id: id },
    });
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

  async getMenuList(lang?: string) {
    const menus = await this.database.menu.findMany();

    return menus.map((menu) => {
      return formatMenuResponse(menu, lang);
    });
  }
}
