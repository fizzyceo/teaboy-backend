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
import { MenuService } from "./menu.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

import { ApiTags, ApiBody, ApiOperation, ApiParam } from "@nestjs/swagger";

@Controller("menu")
@ApiTags("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBody({ type: CreateMenuDto })
  @ApiOperation({ summary: "Create a new menu" })
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all menus" })
  getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get menu details by id" })
  @ApiParam({
    name: "id",
    description: "Menu id to fetch",
    required: true,
  })
  getMenuById(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.getMenuById(id);
  }

  @Get(":id/items")
  @ApiOperation({ summary: "Get menu items for a menu by id" })
  @ApiParam({
    name: "id",
    description: "Menu id to fetch items",
    required: true,
  })
  getMenuItems(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.getMenuItems(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateMenuDto })
  @ApiOperation({ summary: "Update menu details by id" })
  @ApiParam({
    name: "id",
    description: "Menu id to update",
    required: true,
  })
  updateMenu(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete menu by id" })
  @ApiParam({
    name: "id",
    description: "Menu id to delete",
    required: true,
  })
  deleteMenu(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.deleteMenu(id);
  }
}
