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
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import {
  CreateUserDto,
  UpdateUserDto,
  AddUserToSpaceDto,
  AddUserToSiteDto,
} from "./dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

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

  @Get("")
  @ApiOperation({ summary: "Get all Users" })
  getAllUsers() {
    return this.userService.getAllUsers();
  }

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
    const { userId } = user.user;
    return this.userService.addUserToSpace(userId, spaceId);
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
    const { userId } = user.user;
    return this.userService.addUserToSite(userId, siteId);
  }

  @Get("/spaces")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all Spaces of a User" })
  getUserSpaces(@Req() user: any) {
    const user_id = user.user;
    return this.userService.getUserSpaces(user_id);
  }

  @Get("/sites")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all Sites of a User" })
  getUserSites(@Req() user: any) {
    const user_id = user.user;
    return this.userService.getUserSites(user_id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get User details by id" })
  @ApiParam({
    name: "id",
    description: "User id to fetch",
    required: true,
  })
  getUserById(@Param("id", ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update User details by id" })
  @ApiParam({
    name: "id",
    description: "User id to update",
    required: true,
  })
  updateUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete User by id" })
  @ApiParam({
    name: "id",
    description: "User id to delete",
    required: true,
  })
  deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
