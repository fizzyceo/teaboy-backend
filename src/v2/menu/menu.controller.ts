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
  UseGuards,
  Req,
  Headers,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";

import { MenuService } from "./menu.service";

import { CreateMenuDto, UpdateMenuDto } from "./dto";
import { EncryptionService } from "src/encryption/encryption.service";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { formatSuccessResponse } from "src/utils/format-response";

@Controller("v2/menu")
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

  // @Get("v2")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: "Get detailed menus v2" })
  // getAllMenusv2(@Req() user: any, @Headers("LANG") lang: string) {
  //   const { user_id } = user.user;
  //   return this.menuService.getAllMenusv2(user_id, lang);
  // }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all menus" })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getAllMenus(@Req() req: any, @Headers("LANG") lang: string) {
    const { user_id } = req.user;
    return this.menuService.getAllMenus(user_id, lang);
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
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  async getMenuById(
    @Headers("LANG") lang: string,
    @Param("id", ParseIntPipe) id: number,
    @Query("space_id") space_id?: string,
    @Query("site_id") site_id?: string
  ) {
    const spaceId = space_id ? parseInt(space_id, 10) : undefined;
    const siteId = site_id ? parseInt(site_id, 10) : undefined;
    const resp = await this.menuService.getMenuById(id, spaceId, siteId, lang);
    return formatSuccessResponse(resp);
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
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getMenuItems(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.menuService.getMenuItems(id, lang);
  }

  // @Patch(":id")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiBody({ type: UpdateMenuDto })
  // @ApiOperation({
  //   summary: "Update menu details by id",
  //   description:
  //     "You can only update name and description of the menu , restaurant_id cannot be updated, menu_items should be updated separately",
  // })
  // @ApiParam({
  //   name: "id",
  //   description: "Menu id to update ",
  //   required: true,
  // })
  // updateMenu(
  //   @Param("id", ParseIntPipe) id: number,
  //   @Body() updateMenuDto: UpdateMenuDto,
  //   @Req() user: any
  // ) {
  //   const { user_id } = user.user;
  //   return this.menuService.updateMenu(id, updateMenuDto, user_id);
  // }

  // @Delete(":id")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({ summary: "Delete menu by id" })
  // @ApiParam({
  //   name: "id",
  //   description: "Menu id to delete",
  //   required: true,
  // })
  // deleteMenu(@Param("id", ParseIntPipe) id: number) {
  //   //, @Req() user: any
  //   // const { user_id } = user.user;
  //   return this.menuService.deleteMenu(id); //, user_id
  // }

  // @Patch(":menu_id/link-space/:space_id")
  // @ApiOperation({
  //   summary: "Link menu to space",
  //   description: "Link a menu to a space by providing menu_id and space_id",
  // })
  // @ApiParam({
  //   name: "menu_id",
  //   description: "Menu id to link",
  //   required: true,
  // })
  // @ApiParam({
  //   name: "space_id",
  //   description: "Space id to link",
  //   required: true,
  // })
  // linkMenuToSpace(
  //   @Param("menu_id", ParseIntPipe) menuId: number,
  //   @Param("space_id", ParseIntPipe) spaceId: number
  // ) {
  //   return this.menuService.linkMenuToSpace(menuId, spaceId);
  // }

  // @Patch(":menu_id/link-site/:site_id")
  // @UseGuards(JwtAuthGuard)
  // @ApiBearerAuth()
  // @ApiOperation({
  //   summary: "Link menu to site",
  //   description: "Link a menu to a site by providing menu_id and site_id",
  // })
  // @ApiParam({
  //   name: "menu_id",
  //   description: "Menu id to link",
  //   required: true,
  // })
  // @ApiParam({
  //   name: "site_id",
  //   description: "Site id to link",
  //   required: true,
  // })
  // linkMenuToSite(
  //   @Param("menu_id", ParseIntPipe) menuId: number,
  //   @Param("site_id", ParseIntPipe) siteId: number,
  //   @Req() user: any
  // ) {
  //   const { user_id } = user.user;
  //   return this.menuService.linkMenuToSite(menuId, siteId, user_id);
  // }

  @Get("s/:encryptedToken")
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  async getMenuFromToken(
    @Headers("LANG") lang: string,
    @Param("encryptedToken") encryptedToken: string
  ) {
    const decryptedData = this.encryptionService.decryptData(encryptedToken);
    const [menuId, spaceId] = decryptedData.split("-");
    return this.menuService.getMenuById(
      parseInt(menuId),
      parseInt(spaceId),
      null,
      lang
    );
  }

  @Get("links/a")
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  async getLinks(@Headers("LANG") lang: string) {
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
          menu_name: lang === "AR" && menu.name_ar ? menu.name_ar : menu.name,
          encrypted: encryptedData,
          menu_site_image: space.site_image_url,
        };
      })
    );
    return result.flat();
  }

  @Get("list/a")
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  async getMenuList(@Headers("LANG") lang: string) {
    return this.menuService.getMenuList(lang);
  }
}

//getmenubyId to AR
