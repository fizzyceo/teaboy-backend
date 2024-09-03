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
    const { user_id } = user.user;
    console.log("link_space", user_id, spaceId);
    return this.userService.addUserToSpace(user_id, spaceId);
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

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete User by id" })
  deleteUser(@Req() user: any) {
    const { user_id } = user.user;
    return this.userService.deleteUser(user_id);
  }
}
