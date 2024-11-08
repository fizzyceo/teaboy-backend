import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Req,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UnauthorizedException,
  UploadedFiles,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto, UpdateUserDto, UploadProfileDto } from "./dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { LinkingSpace, UpdateUserByAdminDto } from "./dto/create-user.dto";

@Controller("user")
@ApiTags("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/create")
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: "Create a new User" })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // @Get("")
  // @ApiOperation({ summary: "Get all Users" })
  // getAllUsers() {
  //   return this.userService.getAllUsers();
  // }

  //1
  @Patch("link-space")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add User to Space" })
  @ApiQuery({
    name: "spaceId",
    required: true,
    description: "Space id to add",
  })
  addUserToSpace(@Query("spaceId") spaceId: number, @Req() user: any) {
    const { user_id } = user.user;
    return this.userService.addUserToSpace(user_id, spaceId);
  }

  @Post("link-space2")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  addUserToSpace2(@Body() LinkingSpace: LinkingSpace, @Req() user: any) {
    const { user_id, role } = user.user;

    if (role.toUpperCase() !== "ADMIN" && role.toUpperCase() !== "ROOT") {
      throw new UnauthorizedException("you are not authorized");
    }
    return this.userService.addUserToSpace2(
      LinkingSpace.email,
      LinkingSpace.space_id
    );
  }
  @Post("unlink-space2")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  removeUserFromSpace(@Body() LinkingSpace: LinkingSpace, @Req() user: any) {
    const { user_id, role } = user.user;

    if (role.toUpperCase() !== "ADMIN" && role.toUpperCase() !== "ROOT") {
      throw new UnauthorizedException("you are not authorized");
    }
    return this.userService.removeUserFromSpace(
      LinkingSpace.email,
      LinkingSpace.space_id
    );
  }

  @Patch("link-site")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add User to Site" })
  @ApiQuery({
    name: "siteId",
    required: true,
    description: "Site id to add",
  })
  addUserToSite(@Query("siteId") siteId: number, @Req() user: any) {
    const { user_id } = user.user;
    return this.userService.addUserToSite(user_id, siteId);
  }
  @Get("get-all-space-links")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getAllSpaceLinks() {
    const allSpaceLinks = await this.userService.getAllSpaceLinks();

    return allSpaceLinks;
  }

  @Get("/spaces")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all Spaces of a User" })
  getUserSpaces(@Req() user: any) {
    return this.userService.getUserSpaces(user.user);
  }

  @Get("/sites")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all Sites of a User" })
  getUserSites(@Req() user: any) {
    return this.userService.getUserSites(user.user);
  }

  @Get("infos")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get my informatiosn as user" })
  getUserById(@Req() user: any) {
    const { user_id } = user.user;
    return this.userService.getUserById(user_id);
  }

  @Patch("update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update User details by id" })
  updateUser(@Req() user: any, @Body() updateUserDto: UpdateUserDto) {
    const { user_id } = user.user;
    return this.userService.updateUser(user_id, updateUserDto);
  }
  @Patch("update/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserByAdminDto })
  @ApiOperation({ summary: "Update User details by id" })
  updateUserByAdmin(
    @Req() user: any,
    @Body() updateUserDto: UpdateUserByAdminDto,
    @UploadedFiles() files: Express.Multer.File[],

    @Param("userId", ParseIntPipe) userId: number
  ) {
    const { role } = user.user;

    if (role !== "ROOT") throw new UnauthorizedException();

    return this.userService.updateUserByAdmin(userId, updateUserDto);
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete User by id" })
  deleteUser(@Req() user: any) {
    const { user_id } = user.user;
    return this.userService.deleteUser(user_id);
  }

  @Delete("delete/:userId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete User by id" })
  deleteUserByAdmin(
    @Req() user: any,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const { role } = user.user;
    if (role !== "ROOT") throw new UnauthorizedException();

    return this.userService.deleteUser(userId);
  }

  @Get("kitchen-status/:kitchen_id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get Kitchen status by id" })
  @ApiParam({
    name: "kitchen_id",
    required: true,
    description: "Kitchen id to get status",
  })
  getKitchenStatus(
    @Param("kitchen_id", ParseIntPipe) kitchen_id: number,
    @Req() req
  ) {
    const { user_id } = req.user;
    return this.userService.getKitchenStatus(kitchen_id, user_id);
  }

  @Post("upload-profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UploadProfileDto })
  @ApiOperation({ summary: "Create a new site" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  createSite(
    @Body() uploadProfileDto: UploadProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const { user_id } = req.user;
    return this.userService.uploadProfileImage(user_id, file);
  }
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteCurrentUser(@Req() req: any) {
    const { user_id } = req.user;
    return this.userService.deleteUser(user_id);
  }
}
