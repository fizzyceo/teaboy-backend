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
  UseGuards,
  Req,
  Headers,
  Put,
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
  ApiBearerAuth,
  ApiQuery,
  ApiHeader,
} from "@nestjs/swagger";
import { FilesInterceptor } from "@nestjs/platform-express";
import {
  CreateMenuItemOption,
  UpdateMenuItemOption,
} from "./dto/menu-item-option.dto";
import { KitchenAuthGuard } from "src/auth/guard/kitchen.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";

@Controller("menu-item")
@ApiTags("menu-item")
@UseInterceptors(CacheInterceptor)
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
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getAllMenuItems(@Headers("LANG") lang: string) {
    return this.menuItemService.getAllMenuItems(lang);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get menu item details by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to fetch",
    required: true,
  })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getMenuItemById(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.menuItemService.getMenuItemById(id, lang);
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
  // @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
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
    // @Req() kitchen: any
  ) {
    // console.log(kitchen, id);

    // const { kitchen_id } = kitchen.user;
    return this.menuItemService.updateMenuItem(id, updateMenuItemDto, null);
  }

  @Delete(":id")
  // @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete menu item by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to delete",
    required: true,
  })
  deleteMenuItem(@Param("id", ParseIntPipe) id: number, @Req() kitchen: any) {
    return this.menuItemService.deleteMenuItem(id);
  }

  @Get(":id/options")
  @ApiOperation({ summary: "Get menu item options by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id to fetch options",
    required: true,
  })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getMenuItemOptions(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.menuItemService.getMenuItemOptions(id, lang);
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

  @Delete(":id/options/:optionId")
  @ApiOperation({ summary: "Delete a menu item option by id" })
  @ApiParam({
    name: "id",
    description: "Menu item id associated with the option",
    required: true,
  })
  @ApiParam({
    name: "optionId",
    description: "ID of the menu item option to delete",
    required: true,
  })
  async deleteMenuItemOption(
    @Param("id", ParseIntPipe) id: number,
    @Param("optionId", ParseIntPipe) optionId: number
  ) {
    return this.menuItemService.deleteMenuItemOption(id, optionId);
  }

  @Put(":menuid/options/:optionid")
  updateMenuItemOptions(
    @Param("menuid", ParseIntPipe) menuid: number,
    @Param("optionid", ParseIntPipe) optionid: number,
    @Body() MenuOption: UpdateMenuItemOption
  ) {
    return this.menuItemService.updateOption(menuid, MenuOption, optionid);
  }
}
