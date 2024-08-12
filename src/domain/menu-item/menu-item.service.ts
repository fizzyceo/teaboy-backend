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
      include: {
        item_images: true,
        categories: true,
      },
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

    const item_images =
      files.length > 0
        ? await Promise.all(
            files.map(async (file) => {
              const imgUrl = await this.imagesService.uploadFile(file);
              return { image_url: imgUrl.url };
            })
          )
        : [];

    const createData = {
      ...menuItemData,
      menu: {
        connect: {
          menu_id,
        },
      },
      item_images:
        item_images.length > 0
          ? {
              createMany: {
                data: item_images,
              },
            }
          : undefined,
      categories:
        categories && categories.length > 0
          ? {
              connect: categories.map((category_id) => ({ category_id })),
            }
          : undefined,
    };

    return this.database.menu_Item.create({
      data: createData,
    });
  }

  async getAllMenuItems() {
    return await this.database.menu_Item.findMany();
  }

  async getMenuItemById(id: number) {
    const menuItem = this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: {
        item_images: true,
        categories: true,
        options: {
          select: {
            menu_item_option_id: true,
            default_choice: true,
            default_choice_id: true,
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
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return menuItem;
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const { categories, ...menuItemData } = updateMenuItemDto;

    const menuItem = await this.findMenuItemById(id);

    const updateData: any = {
      ...menuItemData,
    };

    if (categories !== undefined) {
      updateData.categories = {
        set: categories.map((category_id) => ({ category_id })),
      };
    }

    const updatedMenuItem = await this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateData,
      include: {
        categories: true,
        item_images: true,
      },
    });

    return updatedMenuItem;
  }

  async deleteMenuItem(id: number) {
    const menuItem = await this.findMenuItemById(id);

    return await this.database.menu_Item.delete({
      where: { menu_item_id: id },
    });
  }

  async deleteMenuImage(menuItemId: number, imageId: number) {
    const menuItem = await this.findMenuItemById(menuItemId);

    const image = await this.database.itemImages.findUnique({
      where: { item_image_id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with id ${imageId} not found`);
    }

    await this.database.itemImages.delete({
      where: { item_image_id: imageId },
    });

    return await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      include: {
        item_images: true,
      },
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
    const { choices, name, default_choice } = createMenuItemOptionDto;

    const createdOption = await this.database.menu_Item_Option.create({
      data: {
        name,
        menu_item: {
          connect: {
            menu_item_id: menuItemId,
          },
        },
      },
    });

    const createdChoices =
      await this.database.menu_Item_Option_Choice.createMany({
        data: choices.map((choice) => ({
          name: choice.name,
          menu_item_option: {
            connect: { menu_item_option_id: createdOption.menu_item_option_id },
          },
          menu_item_option_id: createdOption.menu_item_option_id,
        })),
      });

    let defaultChoiceId = null;
    if (default_choice) {
      const defaultChoice = await this.database.menu_Item_Option_Choice.create({
        data: {
          name: default_choice.name,
          menu_item_option: {
            connect: { menu_item_option_id: createdOption.menu_item_option_id },
          },
        },
      });
      defaultChoiceId = defaultChoice.menu_item_option_choice_id;
    }

    const updatedOption = await this.database.menu_Item_Option.update({
      where: {
        menu_item_option_id: createdOption.menu_item_option_id,
      },
      data: {
        default_choice_id: defaultChoiceId,
      },
    });

    return updatedOption;
  }

  async getMenuItemOptions(menuItemId: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      include: {
        options: {
          include: {
            default_choice: true,
            choices: {
              select: {
                name: true,
                menu_item_option_choice_id: true,
              },
            },
          },
        },
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    return menuItem.options;
  }

  async createMenuItemCategory(category: MenuItemCategory) {
    return await this.database.category.create({
      data: category,
    });
  }
}
