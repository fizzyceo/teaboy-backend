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
  Headers,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto, UpdateUserDto, UploadProfileDto } from "./dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { LinkingSpace } from "./dto/create-user.dto";
import { formatSuccessResponse } from "src/utils/format-response";
import { UserAuthService } from "src/auth/userAuth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { AuthEntity } from "src/auth/entity/auth.entity";
import { RegisterDto } from "src/auth/dto/register.dto";
import { ForgotPasswordDto } from "src/auth/dto/forgotPassword.dto";
import { ResetPasswordDto } from "src/auth/dto/resetPassword.dt";

@Controller("v2/user")
@ApiTags("user")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService
  ) {}

  @Post("/create")
  @ApiBody({ type: CreateUserDto })
  @ApiOperation({ summary: "Create a new User" })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get("")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all Users" })
  getAllUsers(@Req() req: any) {
    const { role } = req.user;
    if (role !== "SUPER_ADMIN") throw new UnauthorizedException();
    return this.userService.getAllUsers();
  }

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

    if (
      role.toUpperCase() !== "ADMIN" ||
      role.toUpperCase() !== "SUPER_ADMIN"
    ) {
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

    if (
      role.toUpperCase() !== "ADMIN" ||
      role.toUpperCase() !== "SUPER_ADMIN"
    ) {
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
  async getUserSpaces(@Req() user: any, @Headers("LANG") lang: string) {
    const resp = await this.userService.getUserSpaces(user.user, lang);

    return formatSuccessResponse(resp);
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
  async getUserById(@Req() user: any) {
    const { user_id } = user.user;
    const resp = await this.userService.getUserById(user_id);
    return formatSuccessResponse(resp);
  }

  @Patch("update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOperation({ summary: "Update User details by id" })
  async updateUser(@Req() user: any, @Body() updateUserDto: UpdateUserDto) {
    const { user_id } = user.user;

    const resp = await this.userService.updateUser(user_id, updateUserDto);
    return formatSuccessResponse(resp);
  }

  @Delete("delete")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete User by id" })
  async deleteUser(@Req() user: any) {
    const { user_id } = user.user;

    const resp = await this.userService.deleteUser(user_id);
    return formatSuccessResponse(resp);
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
  async getKitchenStatus(
    @Param("kitchen_id", ParseIntPipe) kitchen_id: number,
    @Req() req
  ) {
    const { user_id } = req.user;
    const resp = await this.userService.getKitchenStatus(kitchen_id, user_id);

    return formatSuccessResponse(resp);
  }

  @Post("upload-profile")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UploadProfileDto })
  @ApiOperation({ summary: "Create a new site" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async uploadProfile(
    @Body() uploadProfileDto: UploadProfileDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const { user_id } = req.user;
    const resp = await this.userService.uploadProfileImage(user_id, file);
    return formatSuccessResponse(resp);
  }
  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteCurrentUser(@Req() req: any) {
    const { user_id } = req.user;
    return this.userService.deleteUser(user_id);
  }

  @Post("auth/login")
  @ApiOperation({ summary: "Authenticate a user by email and password" })
  @ApiBody({
    type: LoginDto,
    description: "Email and password required for user authentication",
  })
  @ApiOkResponse({
    description: "User successfully authenticated, returns access token",
    type: AuthEntity,
  })
  async login(@Body() { email, password }: LoginDto) {
    const resp = await this.userAuthService.login(email, password);
    return formatSuccessResponse(resp);
  }

  @Post("auth/register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: "Signup successful, please check your email for verification",
  })
  async signup(@Body() registerDto: RegisterDto) {
    const resp = await this.userAuthService.register(registerDto);

    return formatSuccessResponse(resp);
  }

  @Get("auth/validate-email/:token")
  @ApiOperation({ summary: "Verify user email" })
  @ApiParam({
    name: "token",
    description: "Verification token sent to the user's email",
  })
  async validateEmail(@Param("token") token: string) {
    const resp = await this.userAuthService.verifyEmail(token);
    return formatSuccessResponse(resp);
  }

  @Post("auth/forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const resp = await this.userAuthService.forgotPassword(forgotPasswordDto);
    return formatSuccessResponse(resp);
  }

  @Post("auth/reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const resp = await this.userAuthService.resetPassword(resetPasswordDto);
    return formatSuccessResponse(resp);
  }
}
