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

import { ApiTags, ApiBody } from "@nestjs/swagger";

@Controller("menu")
@ApiTags("menu")
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBody({ type: CreateMenuDto })
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Get(":id")
  getMenuById(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.getMenuById(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateMenuDto })
  updateMenu(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @Delete(":id")
  deleteMenu(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.deleteMenu(id);
  }
}
