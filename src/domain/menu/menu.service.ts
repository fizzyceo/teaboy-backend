import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuService {
  constructor(private readonly database: DatabaseService) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    const { restaurant_id, ...rest } = createMenuDto;

    const restaurant = await this.database.restaurant.findUnique({
      where: { restaurant_id: restaurant_id },
    });

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with id ${createMenuDto.restaurant_id} not found`
      );
    }

    return await this.database.menu.create({
      data: {
        ...rest,
        restaurant: {
          connect: {
            restaurant_id: restaurant_id,
          },
        },
        menu_items: {
          create: createMenuDto.menu_items.map((item) => ({
            ...item,
            item_images: {
              create: item.item_images.map((image) => ({
                image_url: image.image_url,
              })),
            },
          })),
        },
      },
    });
  }

  async getAllMenus() {
    return await this.database.menu.findMany({
      include: {
        restaurant: true,
      },
    });
  }

  async getMenuById(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },

      include: {
        restaurant: {
          select: {
            restaurant_id: true,
            name: true,
            address: true,
            phone: true,
            image_url: true,
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
                description: true,
              },
            },
            item_images: {
              select: {
                image_url: true,
                item_image_id: true,
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
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    return await this.database.menu_Item.findMany({
      where: { menu_id: id },
      include: {
        item_images: true,
      },
    });
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

  async getMenuCategories(id: number) {
    const menu = await this.database.menu.findUnique({
      where: { menu_id: id },
    });

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

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
