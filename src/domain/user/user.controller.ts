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
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { LinkUserToRestaurantDto } from "./dto/link-user-to-restaurant.dto";

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

  @Patch("link")
  @ApiOperation({ summary: "Add User to Restaurant" })
  addUserToRestaurant(
    @Body() linkUserToRestaurantDto: LinkUserToRestaurantDto
  ) {
    return this.userService.addUserToRestaurant(linkUserToRestaurantDto);
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
}
