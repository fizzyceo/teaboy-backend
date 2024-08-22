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
import { UserService } from "./user.service";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import {
  CreateUserDto,
  UpdateUserDto,
  AddUserToSpaceDto,
  AddUserToSiteDto,
} from "./dto";

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

  //  User and Spaces
  @Patch("link-space")
  @ApiOperation({ summary: "Add User to Space" })
  addUserToSpace(@Body() addUserToSpaceDto: AddUserToSpaceDto) {
    return this.userService.addUserToSpace(addUserToSpaceDto);
  }

  @Get(":user_id/spaces")
  @ApiOperation({ summary: "Get all Spaces of a User" })
  @ApiParam({
    name: "user_id",
    description: "User id to fetch",
    required: true,
  })
  getUserSpaces(@Param("user_id", ParseIntPipe) user_id: number) {
    return this.userService.getUserSpaces(user_id);
  }

  //  User and Sites
  @Patch("link-site")
  @ApiOperation({ summary: "Add User to Site" })
  addUserToSite(@Body() addUserToSiteDto: AddUserToSiteDto) {
    return this.userService.addUserToSite(addUserToSiteDto);
  }

  @Get(":user_id/sites")
  @ApiOperation({ summary: "Get all Sites of a User" })
  @ApiParam({
    name: "user_id",
    description: "User id to fetch",
    required: true,
  })
  getUserSites(@Param("user_id", ParseIntPipe) user_id: number) {
    return this.userService.getUserSites(user_id);
  }
}
