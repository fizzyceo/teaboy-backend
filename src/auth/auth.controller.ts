import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBody, ApiOkResponse } from "@nestjs/swagger";
import { AuthEntity } from "./entity/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { UserAuthService } from "./userAuth.service";
import { KitchenAuthService } from "./kitchenAuth.service";
import { TokenDto } from "./dto/token.dto";

@Controller("user")
@ApiTags("user")
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post("auth")
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
