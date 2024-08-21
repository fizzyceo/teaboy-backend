import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";

import { MenuService } from "./menu.service";

import { CreateMenuDto, UpdateMenuDto } from "./dto";
import { EncryptionService } from "src/encryption/encryption.service";

@Controller("menu")
@ApiTags("menu")
export class MenuController {
  constructor(
    private readonly menuService: MenuService,
    private readonly encryptionService: EncryptionService
  ) {}

  @Post("create")
  @ApiBody({ type: CreateMenuDto })
  @ApiOperation({
    summary: "Create a new menu",
    description: "Create a new menu by providing name, space_id",
  })
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
  @ApiQuery({
    name: "space_id",
    description: "Space id to fetch",
    required: false,
  })
  @ApiQuery({
    name: "site_id",
    description: "Site id to fetch",
    required: false,
  })
  getMenuById(
    @Param("id", ParseIntPipe) id: number,
    @Query("space_id") space_id?: string,
    @Query("site_id") site_id?: string
  ) {
    const spaceId = space_id ? parseInt(space_id, 10) : undefined;
    const siteId = site_id ? parseInt(site_id, 10) : undefined;
    return this.menuService.getMenuById(id, spaceId, siteId);
  }

  @Get(":id/items")
  @ApiOperation({
    summary: "Get menu items for a menu by id",
    description: "Get all menu items for a menu by providing menu id",
  })
  @ApiParam({
    name: "id",
    description: "Menu id to fetch items",
    required: true,
  })
  getMenuItems(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.getMenuItems(id);
  }

  @Get(":id/categories")
  @ApiOperation({
    summary: "Get menu categories for a menu by id",
    description: "Get all menu categories for a menu by providing menu id",
  })
  @ApiParam({
    name: "id",
    description: "Menu id to fetch categories",
    required: true,
  })
  getMenuCategories(@Param("id", ParseIntPipe) id: number) {
    return this.menuService.getMenuCategories(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateMenuDto })
  @ApiOperation({
    summary: "Update menu details by id",
    description:
      "You can only update name and description of the menu , restaurant_id cannot be updated, menu_items should be updated separately",
  })
  @ApiParam({
    name: "id",
    description: "Menu id to update ",
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

  @Patch(":menu_id/link-space/:space_id")
  @ApiOperation({
    summary: "Link menu to space",
    description: "Link a menu to a space by providing menu_id and space_id",
  })
  @ApiParam({
    name: "menu_id",
    description: "Menu id to link",
    required: true,
  })
  @ApiParam({
    name: "space_id",
    description: "Space id to link",
    required: true,
  })
  linkMenuToSpace(
    @Param("menu_id", ParseIntPipe) menuId: number,
    @Param("space_id", ParseIntPipe) spaceId: number
  ) {
    return this.menuService.linkMenuToSpace(menuId, spaceId);
  }

  @Patch(":menu_id/link-site/:site_id")
  @ApiOperation({
    summary: "Link menu to site",
    description: "Link a menu to a site by providing menu_id and site_id",
  })
  @ApiParam({
    name: "menu_id",
    description: "Menu id to link",
    required: true,
  })
  @ApiParam({
    name: "site_id",
    description: "Site id to link",
    required: true,
  })
  linkMenuToSite(
    @Param("menu_id", ParseIntPipe) menuId: number,
    @Param("site_id", ParseIntPipe) siteId: number
  ) {
    return this.menuService.linkMenuToSite(menuId, siteId);
  }

  @Get("s/:encryptedToken")
  async getMenuFromToken(@Param("encryptedToken") encryptedToken: string) {
    const decryptedData = this.encryptionService.decryptData(encryptedToken);
    const [menuId, spaceId] = decryptedData.split("-");
    return this.menuService.getMenuById(parseInt(menuId), parseInt(spaceId));
  }

  @Get("links/a")
  async getLinks() {
    const menus = await this.menuService.getAllMenusOld();
    const result = menus.map((menu) =>
      menu.spaces.map((space) => {
        const encryptedData = this.encryptionService.encryptData(
          menu.menu_id.toString(),
          space.space_id.toString()
        );

        return {
          space_name: space.name,
          space_id: space.space_id,
          menu_name: menu.name,
          encrypted: encryptedData,
          menu_site_image: space.site_image_url,
        };
      })
    );
    return result.flat();
  }

  @Get("list/a")
  async getMenuList() {
    return this.menuService.getMenuList();
  }
}
