import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CreateMenuItemOption } from "./dto/menu-item-option.dto";

@Controller("menu-item")
@ApiTags("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  @ApiOperation({
    summary: "Create a new menu item",
    description: "you can add multiple images (max 5) for a menu item",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("item_images"))
  createMenuItem(
    @Body() createMenuItemDto: CreateMenuItemDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.menuItemService.createMenuItem(createMenuItemDto, files);
  }

  @Get()
  @ApiOperation({
    summary: "Get all menu items",
    description: "Get All menu items , this should be later be modified",
  })
  getAllMenuItems() {
    return this.menuItemService.getAllMenuItems();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get menu item details by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to fetch",
    required: true,
  })
  getMenuItemById(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.getMenuItemById(id);
  }

  @Get(":id/images")
  @ApiOperation({ summary: "Get menu item images by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to fetch images",
    required: true,
  })
  getMenuItemImages(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.getMenuItemImages(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateMenuItemDto })
  @ApiOperation({ summary: "Update menu item details by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to update",
    required: true,
  })
  updateMenuItem(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    return this.menuItemService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete menu item by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to delete",
    required: true,
  })
  deleteMenuItem(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.deleteMenuItem(id);
  }

  @Delete(":id/image/:imageId")
  @ApiOperation({ summary: "Delete menu item image by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to delete image from",
    required: true,
  })
  @ApiParam({
    name: "imageId",
    description: "Image id to delete",
    required: true,
  })
  deleteMenuItemImage(
    @Param("id", ParseIntPipe) id: number,
    @Param("imageId", ParseIntPipe) imageId: number
  ) {
    return this.menuItemService.deleteMenuImage(id, imageId);
  }

  @Get(":id/options")
  @ApiOperation({ summary: "Get menu item options by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to fetch options",
    required: true,
  })
  getMenuItemOptions(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.getMenuItemOptions(id);
  }

  @Post(":id/options")
  @ApiOperation({ summary: "Create menu item options by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to create options",
    required: true,
  })
  createMenuItemOptions(
    @Param("id", ParseIntPipe) id: number,
    @Body() MenuOption: CreateMenuItemOption
  ) {
    return this.menuItemService.createMenuItemOption(id, MenuOption);
  }
}
