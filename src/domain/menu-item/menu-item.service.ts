import { Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateMenuItemDto,
  MenuItemCategory,
} from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";
import { CreateMenuItemOption } from "./dto/menu-item-option.dto";

@Injectable()
export class MenuItemService {
  constructor(
    private readonly database: DatabaseService,
    private readonly imagesService: ImagesService
  ) {}

  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
    files: Express.Multer.File[]
  ) {
    const { menu_id, categories, ...menuItemData } = createMenuItemDto;

    let item_images = [];

    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const imgUrl = await this.imagesService.uploadFile(file);
          return { image_url: imgUrl.url };
        })
      );

      if (uploadedImages) {
        console.log("Images uploaded successfully");
      }

      item_images = uploadedImages;
    }

    const createData: any = {
      ...menuItemData,
      menu: {
        connect: {
          menu_id: menu_id,
        },
      },
    };

    if (item_images.length > 0) {
      createData.item_images = {
        createMany: {
          data: item_images.map((image) => ({
            image_url: image.image_url,
          })),
        },
      };
    }

    if (categories && categories.length > 0) {
      createData.categories = {
        connect: categories.map((category_id) => ({ category_id })),
      };
    }

    return await this.database.menu_Item.create({
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

  async deleteMenuImage(menuItemId: number, imageId: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

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
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: {
        item_images: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return menuItem.item_images;
  }

  async createMenuItemOption(
    menuItemId: number,
    createMenuItemOptionDto: CreateMenuItemOption
  ) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    const { choices, name } = createMenuItemOptionDto;

    const createdOption = await this.database.menu_Item_Option.create({
      data: {
        name,
        menu_item: {
          connect: {
            menu_item_id: menuItemId,
          },
        },
        choices: {
          createMany: {
            data: choices.map((choice) => ({
              name: choice.name,
            })),
          },
        },
      },
    });

    return createdOption;
  }

  async getMenuItemOptions(menuItemId: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      include: {
        options: {
          include: {
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
