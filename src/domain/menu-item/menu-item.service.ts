import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuItemService {
  constructor(private readonly database: DatabaseService) {}

  async createMenuItem(createMenuItemDto: CreateMenuItemDto) {
    const { menu_id, ...rest } = createMenuItemDto;
    return await this.database.menu_Item.create({
      data: {
        ...rest,
        menu: {
          connect: {
            menu_id: menu_id,
          },
        },
        item_images: {
          create: createMenuItemDto.item_images.map((image) => ({
            image_url: image.image_url,
          })),
        },
        categories: {
          connectOrCreate: createMenuItemDto.categories.map((category) => ({
            where: { name: category.name },
            create: { name: category.name, description: category.description },
          })),
        },
      },
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
      },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${id} not found`);
    }

    return menuItem;
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const { item_images, categories, ...menuItemData } = updateMenuItemDto;

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

    const updateData = {
      ...menuItemData,
      item_images: {
        createMany: {
          data:
            item_images?.map((image) => ({ image_url: image.image_url })) || [],
        },
      },
      categories: {
        connectOrCreate: (categories || []).map((category) => ({
          where: { name: category.name },
          create: {
            name: category.name,
            description: category.description || undefined,
          },
        })),
      },
    };

    const updatedMenuItem = await this.database.menu_Item.update({
      where: { menu_item_id: id },
      data: updateData,
      include: {
        item_images: true,
        categories: true,
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
}
