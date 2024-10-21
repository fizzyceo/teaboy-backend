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
} from "@nestjs/common";
//   import { SiteService } from "./site.service";
//   import { CreateSiteDto } from "./dto/create-site.dto";
//   import { UpdateSiteDto } from "./dto/update-site.dto";
//   import {
//     ApiTags,
//     ApiBody,
//     ApiOperation,
//     ApiParam,
//     ApiConsumes,
//   } from "@nestjs/swagger";
//   import { FileInterceptor } from "@nestjs/platform-express";
//   import { CreateSpaceDto } from "./dto";

// //   @Controller("site")
//   @ApiTags("site")
//   export class SiteController {
//     constructor(private readonly siteService: SiteService) {}

//     @Post("create")
//     @ApiBody({ type: CreateSiteDto })
//     @ApiOperation({ summary: "Create a new site" })
//     @UseInterceptors(FileInterceptor("file"))
//     @ApiConsumes("multipart/form-data")
//     createSite(
//       @Body() createRestaurantDto: CreateSiteDto,
//       @UploadedFile() file: Express.Multer.File
//     ) {
//       return this.siteService.createSite(createRestaurantDto, file);
//     }

//     @Get()
//     @ApiOperation({ summary: "Get all sites" })
//     getAllSites() {
//       return this.siteService.getAllSites();
//     }

//     @Get(":id")
//     @ApiOperation({ summary: "Get Site details by id" })
//     @ApiParam({
//       name: "id",
//       description: "Site id to fetch",
//       required: true,
//     })
//     getSiteById(@Param("id", ParseIntPipe) id: number) {
//       return this.siteService.getSiteById(id);
//     }

//     @Get(":id/menus")
//     @ApiOperation({ summary: "Get Site menus by id" })
//     @ApiParam({
//       name: "id",
//       description: "Site id to fetch menus",
//       required: true,
//     })
//     getSiteMenus(@Param("id", ParseIntPipe) id: number) {
//       return this.siteService.getSiteMenus(id);
//     }

//     @Get(":id/employees")
//     @ApiOperation({ summary: "Get site employees by id" })
//     @ApiParam({
//       name: "id",
//       description: "site id to fetch employees",
//       required: true,
//     })
//     getSiteEmployees(@Param("id", ParseIntPipe) id: number) {
//       return this.siteService.getSiteEmployees(id);
//     }

//     @Get(":id/spaces")
//     @ApiOperation({ summary: "Get site spaces by id" })
//     @ApiParam({
//       name: "id",
//       description: "site id to fetch spaces",
//       required: true,
//     })
//     getSiteSpaces(@Param("id", ParseIntPipe) id: number) {
//       return this.siteService.getSiteSpaces(id);
//     }

//     @Post(":id/spaces")
//     @ApiOperation({ summary: "Add space to site" })
//     @ApiParam({
//       name: "id",
//       description: "site id to add space",
//       required: true,
//     })
//     addSpaceToSite(
//       @Param("id", ParseIntPipe) id: number,
//       @Body() createSiteSpaceDto: CreateSpaceDto
//     ) {
//       return this.siteService.createSiteSpace(id, createSiteSpaceDto);
//     }

//     @Patch(":id")
//     @ApiBody({ type: UpdateSiteDto })
//     @ApiOperation({ summary: "Update Site details by id" })
//     @UseInterceptors(FileInterceptor("file"))
//     @ApiConsumes("multipart/form-data")
//     @ApiParam({
//       name: "id",
//       description: "Site id to update",
//       required: true,
//     })
//     updateSite(
//       @Param("id", ParseIntPipe) id: number,
//       @UploadedFile() file: Express.Multer.File,
//       @Body() updateSiteDto: UpdateSiteDto
//     ) {
//       return this.siteService.updateSite(id, updateSiteDto, file);
//     }

//     @Delete(":id")
//     @ApiOperation({ summary: "Delete Site by id" })
//     @ApiParam({
//       name: "id",
//       description: "Site id to delete",
//       required: true,
//     })
//     deleteSite(@Param("id", ParseIntPipe) id: number) {
//       return this.siteService.deleteSite(id);
//     }
//   }
