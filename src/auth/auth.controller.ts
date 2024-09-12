import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthEntity } from "./entity/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { UserAuthService } from "./userAuth.service";
import { KitchenAuthService } from "./kitchenAuth.service";
import { TokenDto } from "./dto/token.dto";
import { RegisterDto } from "./dto/register.dto";
import { ForgotPasswordDto } from "./dto/forgotPassword.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dt";
import { JwtAuthGuard } from "./guard/jwt-auth.guard";

@Controller("user")
@ApiTags("user")
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

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
  login(@Body() { email, password }: LoginDto) {
    return this.userAuthService.login(email, password);
  }

  @Post("auth/register")
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({
    description: "Signup successful, please check your email for verification",
  })
  async signup(@Body() registerDto: RegisterDto) {
    return this.userAuthService.register(registerDto);
  }

  @Get("auth/validate-email/:token")
  @ApiOperation({ summary: "Verify user email" })
  @ApiParam({
    name: "token",
    description: "Verification token sent to the user's email",
  })
  async validateEmail(@Param("token") token: string) {
    await this.userAuthService.verifyEmail(token);
  }

  @Post("auth/forgot-password")
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.userAuthService.forgotPassword(forgotPasswordDto);
  }

  @Post("auth/reset-password")
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.userAuthService.resetPassword(resetPasswordDto);
  }
}

@Controller("kitchen")
@ApiTags("kitchen")
export class KitchenAuthController {
  constructor(private readonly kitchenAuthService: KitchenAuthService) {}

  @Post("auth")
  @ApiOperation({ summary: "Authenticate a kitchen using a unique token" })
  @ApiBody({
    type: TokenDto,
    description: "Token required for kitchen authentication",
  })
  @ApiOkResponse({
    description: "Kitchen successfully authenticated, returns access token",
    type: AuthEntity,
  })
  login(@Body() { token }: TokenDto) {
    return this.kitchenAuthService.login(token);
  }
}
