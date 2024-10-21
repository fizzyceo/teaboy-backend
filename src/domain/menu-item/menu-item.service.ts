import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";
import {
  CreateMenuItemDto,
  CreateMenuItemOption,
  UpdateMenuItemDto,
} from "./dto";

@Injectable()
export class MenuItemService {
  constructor(
    private readonly database: DatabaseService,
    private readonly imagesService: ImagesService
  ) {}

  private async findMenuItemById(id: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: { item_images: true },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return menuItem;
  }

  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
    files: Express.Multer.File[]
  ) {
    const { menu_id, ...menuItemData } = createMenuItemDto;

    const menu = await this.database.menu.findUnique({
      where: { menu_id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${menu_id} not found`);
    }

    const item_images = await this.uploadMenuImages(files);

    const createData: any = {
      ...menuItemData,
      menu: { connect: { menu_id } },
    };

    if (item_images.length > 0) {
      createData.item_images = { createMany: { data: item_images } };
    }

    return this.database.menu_Item.create({
      data: createData,
      select: {
        menu_item_id: true,
        title: true,
        title_ar: true,
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
                name_ar: true,
                menu_item_option_id: true,
                default_choice: {
                  select: {
                    name: true,
                    name_ar: true,
                    menu_item_option_choice_id: true,
                  },
                },
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
    });
  }

  async getAllMenuItems(lang: string) {
    return this.database.menu_Item.findMany({
      include: { item_images: true },
    });
  }

  async getMenuItemById(id: number, lang: string) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: {
        item_images: true,
        menuItem_options: {
          select: {
            menu_item_option: {
              select: {
                menu_item_option_id: true,
                name: true,
                name_ar: true,
                default_choice: {
                  select: {
                    name: true,
                    name_ar: true,
                    menu_item_option_choice_id: true,
                  },
                },
                choices: {
                  select: {
                    name: true,
                    name_ar: true,
                    menu_item_option_choice_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    // Map the menu item options based on the language
    return {
      menu_item_id: menuItem.menu_item_id,
      title:
        lang === "AR" && menuItem.title_ar ? menuItem.title_ar : menuItem.title,
      title_ar: menuItem.title_ar,
      description: menuItem.description,
      price: menuItem.price,
      available: menuItem.available,
      menu_id: menuItem.menu_id,
      created_at: menuItem.created_at,
      updated_at: menuItem.updated_at,

      menuItem_options: menuItem.menuItem_options.map((opt) => {
        const option = opt.menu_item_option;
        return {
          menu_item_option_id: option.menu_item_option_id,
          name: lang === "AR" && option.name_ar ? option.name_ar : option.name,
          name_ar: option.name_ar,
          default_choice: option.default_choice
            ? {
                menu_item_option_choice_id:
                  option.default_choice.menu_item_option_choice_id,
                name_ar: option.default_choice.name_ar,
                name:
                  lang === "AR" && option.default_choice.name_ar
                    ? option.default_choice.name_ar
                    : option.default_choice.name,
              }
            : null,
          choices: option.choices.map((choice) => ({
            menu_item_option_choice_id: choice.menu_item_option_choice_id,
            name:
              lang === "AR" && choice.name_ar ? choice.name_ar : choice.name,
            name_ar: choice.name_ar,
          })),
        };
      }),
    };
  }

  async updateMenuItem(
    id: number,
    updateMenuItemDto: UpdateMenuItemDto,
    kitchen_id: number
  ) {
    await this.findMenuItemById(id);

    return this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateMenuItemDto,
      include: { item_images: true },
    });
  }

  async deleteMenuItem(id: number) {
    await this.findMenuItemById(id);

    return this.database.menu_Item.delete({ where: { menu_item_id: id } });
  }

  async getMenuItemImages(id: number) {
    const menuItem = await this.findMenuItemById(id);
    return menuItem.item_images;
  }

  async createMenuItemOption(
    menuItemId: number,
    createMenuItemOptionDto: CreateMenuItemOption
  ) {
    const { choices, name, name_ar, default_choice, existing_option_id } =
      createMenuItemOptionDto;

    let createdOption;

    if (existing_option_id) {
      createdOption = await this.database.menu_Item_Option.findUnique({
        where: { menu_item_option_id: existing_option_id },
      });

      if (!createdOption) {
        throw new NotFoundException(
          `Menu item option with id ${existing_option_id} not found`
        );
      }

      await this.database.menuItemOptionConnection.create({
        data: {
          menu_item_id: menuItemId,
          menu_item_option_id: existing_option_id,
        },
      });
    } else {
      createdOption = await this.database.menu_Item_Option.create({
        data: {
          name,
          name_ar,
          option_menuItems: {
            create: {
              menu_item_id: menuItemId,
            },
          },
        },
      });

      // Create the choices
      const createdChoices = await this.createChoices(
        choices,
        createdOption.menu_item_option_id
      );

      // If no default choice is specified, set the first created choice as the default
      const defaultChoice = default_choice || choices[0];
      const defaultChoiceId = await this.createDefaultChoice(
        defaultChoice,
        createdOption.menu_item_option_id
      );

      await this.updateMenuItemOption(
        createdOption.menu_item_option_id,
        defaultChoiceId
      );
    }

    return createdOption;
  }

  async getMenuItemOptions(menuItemId: number, lang: string) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      select: {
        menu_item_id: true,
        menuItem_options: {
          select: {
            menu_item_option: {
              select: {
                menu_item_option_id: true,
                name: true, // Fetch both fields
                name_ar: true, // Fetch both fields
                default_choice: {
                  select: {
                    menu_item_option_choice_id: true,
                    name: true, // Fetch both fields
                    name_ar: true, // Fetch both fields
                  },
                },
                choices: {
                  select: {
                    menu_item_option_choice_id: true,
                    name: true, // Fetch both fields
                    name_ar: true, // Fetch both fields
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    // Map the options based on the language
    const formattedOptions = menuItem.menuItem_options.map((opt) => {
      const option = opt.menu_item_option;

      return {
        menu_item_option_id: option.menu_item_option_id,
        name: lang === "AR" && option.name_ar ? option.name_ar : option.name, // Select based on language
        name_ar: option.name_ar,
        default_choice: option.default_choice
          ? {
              menu_item_option_choice_id:
                option.default_choice.menu_item_option_choice_id,
              name:
                lang === "AR" && option.default_choice.name_ar
                  ? option.default_choice.name_ar
                  : option.default_choice.name,
              name_ar: option.default_choice.name_ar,
              // Select based on language
            }
          : null,
        choices: option.choices.map((choice) => ({
          menu_item_option_choice_id: choice.menu_item_option_choice_id,
          name: lang === "AR" && choice.name_ar ? choice.name_ar : choice.name, // Select based on language
          name_ar: choice.name_ar,
        })),
      };
    });

    return formattedOptions;
  }

  private async uploadMenuImages(files: Express.Multer.File[]) {
    if (!files.length) return [];

    return Promise.all(
      files.map(async (file) => {
        const imgUrl = await this.imagesService.uploadFile(file);
        return { image_url: imgUrl.url };
      })
    );
  }

  private async createChoices(
    choices: { name: string; name_ar: string }[],
    menuItemOptionId: number
  ) {
    return Promise.all(
      choices.map((choice) =>
        this.database.menu_Item_Option_Choice.create({
          data: {
            name: choice.name,
            name_ar: choice.name_ar,
            menu_item_option: {
              connect: { menu_item_option_id: menuItemOptionId },
            },
          },
        })
      )
    );
  }

  private async createDefaultChoice(
    default_choice: { name: string; name_ar: string },
    menuItemOptionId: number
  ) {
    if (!default_choice) return null;

    // Check if the default choice already exists in the choices for this option
    const existingChoice =
      await this.database.menu_Item_Option_Choice.findFirst({
        where: {
          name: default_choice.name,
          name_ar: default_choice.name_ar,
          menu_item_option_id: menuItemOptionId,
        },
      });

    // If it exists, return the existing choice ID
    if (existingChoice) {
      return existingChoice.menu_item_option_choice_id;
    }

    // Otherwise, create a new choice
    const newDefaultChoice = await this.database.menu_Item_Option_Choice.create(
      {
        data: {
          name: default_choice.name,
          name_ar: default_choice.name_ar,
          menu_item_option: {
            connect: { menu_item_option_id: menuItemOptionId },
          },
        },
      }
    );

    return newDefaultChoice.menu_item_option_choice_id;
  }

  private async updateMenuItemOption(
    menuItemOptionId: number,
    defaultChoiceId: number | null
  ) {
    return this.database.menu_Item_Option.update({
      where: { menu_item_option_id: menuItemOptionId },
      data: { default_choice_id: defaultChoiceId },
    });
  }

  private formatMenuItemOptions(options: any[]) {
    return options.map((option) => ({
      option_id: option.menu_item_option_id,
      name: option.name,
      name_ar: option.name_ar,
      defaultChoice: option.default_choice
        ? {
            name: option.default_choice.name,
            name_ar: option.default_choice.name_ar,
            choice_id: option.default_choice.menu_item_option_choice_id,
          }
        : null,
      choices: option.choices.map((choice) => ({
        name: choice.name,
        name_ar: choice.name_ar,
        choice_id: choice.menu_item_option_choice_id,
      })),
    }));
  }
}
