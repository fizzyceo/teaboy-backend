import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";
import {
  CreateMenuItemDto,
  CreateMenuItemOption,
  MenuItemCategory,
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
      include: { item_images: true, categories: true },
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
    const { menu_id, categories, ...menuItemData } = createMenuItemDto;

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

    if (categories && categories.length > 0) {
      createData.categories = {
        connect: categories.map((id) => ({ category_id: id })),
      };
    }

    return this.database.menu_Item.create({ data: createData });
  }

  async getAllMenuItems() {
    return this.database.menu_Item.findMany({
      include: { item_images: true, categories: true },
    });
  }

  async getMenuItemById(id: number) {
    const menuItem = await this.findMenuItemById(id);

    return this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: {
        item_images: true,
        categories: true,
        menuItem_options: {
          select: {
            menu_item_option: {
              select: {
                menu_item_option_id: true,
                name: true,
                default_choice: {
                  select: {
                    name: true,
                    menu_item_option_choice_id: true,
                  },
                },
                choices: {
                  select: {
                    name: true,
                    menu_item_option_choice_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    await this.findMenuItemById(id);

    const { categories, ...menuItemData } = updateMenuItemDto;

    const updateData: any = { ...menuItemData };

    if (categories) {
      updateData.categories = {
        set: categories.map((id) => ({ category_id: id })),
      };
    }

    return this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateData,
      include: { categories: true, item_images: true },
    });
  }

  async deleteMenuItem(id: number) {
    await this.findMenuItemById(id);

    return this.database.menu_Item.delete({ where: { menu_item_id: id } });
  }

  async deleteMenuImage(menuItemId: number, imageId: number) {
    await this.findMenuItemById(menuItemId);

    const image = await this.database.itemImages.findUnique({
      where: { item_image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${imageId} not found`);
    }

    await this.database.itemImages.delete({
      where: { item_image_id: imageId },
    });

    return this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      include: { item_images: true },
    });
  }

  async getMenuItemImages(id: number) {
    const menuItem = await this.findMenuItemById(id);
    return menuItem.item_images;
  }

  async createMenuItemOption(
    menuItemId: number,
    createMenuItemOptionDto: CreateMenuItemOption
  ) {
    const { choices, name, default_choice, existing_option_id } =
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
          option_menuItems: {
            create: {
              menu_item_id: menuItemId,
            },
          },
        },
      });

      await this.createChoices(choices, createdOption.menu_item_option_id);

      if (default_choice) {
        const defaultChoiceId = await this.createDefaultChoice(
          default_choice,
          createdOption.menu_item_option_id
        );
        await this.updateMenuItemOption(
          createdOption.menu_item_option_id,
          defaultChoiceId
        );
      }
    }

    return createdOption;
  }

  async getMenuItemOptions(menuItemId: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      select: {
        menu_item_id: true,
        menuItem_options: {
          select: {
            menu_item_option: {
              select: {
                menu_item_option_id: true,
                name: true,
                default_choice: {
                  select: {
                    name: true,
                    menu_item_option_choice_id: true,
                  },
                },
                choices: {
                  select: {
                    name: true,
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
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    const formattedOptions = this.formatMenuItemOptions(
      menuItem.menuItem_options.map((opt) => opt.menu_item_option)
    );

    return formattedOptions;
  }

  async createMenuItemCategory(category: MenuItemCategory) {
    return this.database.category.create({ data: category });
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
    choices: { name: string }[],
    menuItemOptionId: number
  ) {
    return Promise.all(
      choices.map((choice) =>
        this.database.menu_Item_Option_Choice.create({
          data: {
            name: choice.name,
            menu_item_option: {
              connect: { menu_item_option_id: menuItemOptionId },
            },
          },
        })
      )
    );
  }

  private async createDefaultChoice(
    default_choice: { name: string },
    menuItemOptionId: number
  ) {
    if (!default_choice) return null;

    const defaultChoice = await this.database.menu_Item_Option_Choice.create({
      data: {
        name: default_choice.name,
        menu_item_option: {
          connect: { menu_item_option_id: menuItemOptionId },
        },
      },
    });

    return defaultChoice.menu_item_option_choice_id;
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
      defaultChoice: option.default_choice
        ? {
            name: option.default_choice.name,
            choice_id: option.default_choice.menu_item_option_choice_id,
          }
        : null,
      choices: option.choices.map((choice) => ({
        name: choice.name,
        choice_id: choice.menu_item_option_choice_id,
      })),
    }));
  }
}
