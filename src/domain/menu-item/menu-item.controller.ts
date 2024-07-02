import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";

import { ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("menu-item")
@ApiTags("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  @ApiOperation({ summary: "Create a new menu item" })
  createMenuItem(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.createMenuItem(createMenuItemDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all menu items" })
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
}
