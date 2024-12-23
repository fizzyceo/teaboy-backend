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
  UploadedFile,
  Headers,
  UseGuards,
  Req,
} from "@nestjs/common";
import { SiteService } from "./site.service";
import { CreateSiteDto } from "./dto/create-site.dto";
import { UpdateSiteDto } from "./dto/update-site.dto";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
  ApiQuery,
  ApiHeader,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateSpaceDto } from "./dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("v2/site")
@ApiTags("site")
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Post("create")
  @ApiBody({ type: CreateSiteDto })
  @ApiOperation({ summary: "Create a new site" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @UseGuards(JwtAuthGuard)
  createSite(
    @Req() req: any,
    @Body() createRestaurantDto: CreateSiteDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { user_id } = req.user;
    return this.siteService.createSite(createRestaurantDto, file, user_id);
  }

  @Get()
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  @ApiOperation({ summary: "Get all sites" })
  getAllSites(@Headers("LANG") lang: string) {
    return this.siteService.getAllSites(lang);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Site details by id" })
  @ApiParam({
    name: "id",
    description: "Site id to fetch",
    required: true,
  })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getSiteById(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.siteService.getSiteById(id, lang);
  }

  @Get(":id/menus")
  @ApiOperation({ summary: "Get Site menus by id" })
  @ApiParam({
    name: "id",
    description: "Site id to fetch menus",
    required: true,
  })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  getSiteMenus(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.siteService.getSiteMenus(id, lang);
  }

  @Get(":id/employees")
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  @ApiOperation({ summary: "Get site employees by id" })
  @ApiParam({
    name: "id",
    description: "site id to fetch employees",
    required: true,
  })
  getSiteEmployees(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.siteService.getSiteEmployees(id);
  }

  @Get(":id/spaces")
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
  @ApiOperation({ summary: "Get site spaces by id" })
  @ApiParam({
    name: "id",
    description: "site id to fetch spaces",
    required: true,
  })
  getSiteSpaces(
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    return this.siteService.getSiteSpaces(id, lang);
  }

  @Post(":id/spaces")
  @ApiOperation({ summary: "Add space to site" })
  @ApiParam({
    name: "id",
    description: "site id to add space",
    required: true,
  })
  addSpaceToSite(
    @Param("id", ParseIntPipe) id: number,
    @Body() createSiteSpaceDto: CreateSpaceDto
  ) {
    return this.siteService.createSiteSpace(id, createSiteSpaceDto);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateSiteDto })
  @ApiOperation({ summary: "Update Site details by id" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    description: "Site id to update",
    required: true,
  })
  updateSite(
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateSiteDto: UpdateSiteDto
  ) {
    return this.siteService.updateSite(id, updateSiteDto, file);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete Site by id" })
  @ApiParam({
    name: "id",
    description: "Site id to delete",
    required: true,
  })
  deleteSite(@Param("id", ParseIntPipe) id: number) {
    return this.siteService.deleteSite(id);
  }
}
