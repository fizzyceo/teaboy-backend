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
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { UserService } from "./user.service";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { CreateUserDto, UpdateUserDto, UploadProfileDto } from "./dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { FileInterceptor } from "@nestjs/platform-express";
import { LinkingSpace, UpdateProfile } from "./dto/create-user.dto";
import { formatSuccessResponse } from "src/utils/format-response";
import { UserAuthService } from "src/auth/userAuth.service";
import { LoginDto } from "src/auth/dto/login.dto";
import { AuthEntity } from "src/auth/entity/auth.entity";
import { RegisterDto } from "src/auth/dto/register.dto";
import { ForgotPasswordDto } from "src/auth/dto/forgotPassword.dto";
import { ResetPasswordDto } from "src/auth/dto/resetPassword.dt";
import { CACHE_MANAGER, CacheInterceptor } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@Controller("v2/user")
@ApiTags("user")
@UseInterceptors(CacheInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userAuthService: UserAuthService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get("")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all Users" })
  getAllUsers(@Req() req: any) {
    const { role } = req.user;
    if (role !== "ROOT") throw new UnauthorizedException();
    console.log(this.cacheManager.store.keys());

    return this.userService.getAllUsers();
  }

  @Get("/spaces")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all Spaces of a User" })
  @ApiHeader({
    name: "LANG",
    required: false,
    description: "EN/AR",
    example: "EN",
  })
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

  @Patch("update")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfile })
  @ApiOperation({ summary: "Update User details and upload profile image" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  async updateUser(
    @Req() req: any,
    @Body() updateUserWithProfileDto: UpdateProfile,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { user_id } = req.user;

    // If there's a file, upload it first
    let updatedData = { ...updateUserWithProfileDto };

    // Handle profile image upload
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 1MB
      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException("File size exceeds the 5MB limit");
      }

      // Check file type (allowed formats: .jpg, .jpeg, .png, .webp, .heif, .heic)
      const allowedMimeTypes = [
        "image/jpeg", // .jpg and .jpeg
        "image/jpg",
        "image/png",
        "image/webp",
        "image/heif",
        "image/heic",
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          "Invalid file type. Only JPG, JPEG, PNG, WEBP, HEIF, and HEIC are allowed"
        );
      }

      await this.userService.uploadProfileImage(user_id, file);
    }

    // Update user data
    const resp = await this.userService.updateUser(user_id, updatedData);
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

  @Post("auth/new-otp")
  @ApiOperation({ summary: "send a new otp" })
  @ApiBody({ type: ForgotPasswordDto })
  async newOtp(@Body() newOtpDto: ForgotPasswordDto) {
    const resp = await this.userAuthService.generateNewOtp(newOtpDto);

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
