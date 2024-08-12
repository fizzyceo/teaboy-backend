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

    const item_images = await this.uploadMenuImages(files);

    const createData = {
      ...menuItemData,
      menu: { connect: { menu_id } },
      item_images: item_images.length
        ? { createMany: { data: item_images } }
        : undefined,
      categories: categories?.length
        ? { connect: categories.map((id) => ({ category_id: id })) }
        : undefined,
    };

    return this.database.menu_Item.create({ data: createData });
  }

  async getAllMenuItems() {
    return this.database.menu_Item.findMany();
  }

  async getMenuItemById(id: number) {
    const menuItem = await this.findMenuItemById(id);

    return this.database.menu_Item.findUnique({
      where: { menu_item_id: id },
      include: {
        item_images: true,
        categories: true,
        options: this.getMenuItemOptionsInclude(),
      },
    });
  }

  async updateMenuItem(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    const { categories, ...menuItemData } = updateMenuItemDto;

    await this.findMenuItemById(id);

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
    const { choices, name, default_choice } = createMenuItemOptionDto;

    const createdOption = await this.database.menu_Item_Option.create({
      data: {
        name,
        menu_item: { connect: { menu_item_id: menuItemId } },
      },
    });

    await this.createChoices(choices, createdOption.menu_item_option_id);

    const defaultChoiceId = await this.createDefaultChoice(
      default_choice,
      createdOption.menu_item_option_id
    );

    return this.updateMenuItemOption(
      createdOption.menu_item_option_id,
      defaultChoiceId
    );
  }

  async getMenuItemOptions(menuItemId: number) {
    const menuItem = await this.database.menu_Item.findUnique({
      where: { menu_item_id: menuItemId },
      include: { options: this.getMenuItemOptionsInclude() },
    });

    if (!menuItem) {
      throw new NotFoundException(`Menu item with id ${menuItemId} not found`);
    }

    return {
      menu_item_id: menuItem.menu_item_id,
      options: this.formatMenuItemOptions(menuItem.options),
    };
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

  private getMenuItemOptionsInclude() {
    return {
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
    };
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
    default_choice: { name: string } | undefined,
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
