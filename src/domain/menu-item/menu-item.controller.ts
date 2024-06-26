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

import { ApiTags, ApiBody } from "@nestjs/swagger";

@Controller("menu-item")
@ApiTags("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  @ApiBody({ type: CreateMenuItemDto })
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.createMenuItem(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemService.getAllMenuItems();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.getMenuItemById(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateMenuItemDto })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    return this.menuItemService.updateMenuItem(id, updateMenuItemDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.menuItemService.deleteMenuItem(id);
  }
}
