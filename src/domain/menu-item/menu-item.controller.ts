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

import { ApiTags } from "@nestjs/swagger";

@Controller("menu-item")
@ApiTags("menu-item")
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Post()
  create(@Body() createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(createMenuItemDto);
  }

  @Get()
  findAll() {
    return this.menuItemService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: string) {
    return this.menuItemService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateMenuItemDto: UpdateMenuItemDto
  ) {
    return this.menuItemService.update(+id, updateMenuItemDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.menuItemService.remove(+id);
  }
}
