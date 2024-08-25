import { Body, Controller, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AuthEntity } from "./entity/auth.entity";
import { LoginDto } from "./dto/login.dto";
import { UserAuthService } from "./userAuth.service";
import { KitchenAuthService } from "./kitchenAuth.service";
import { TokenDto } from "./dto/token.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post("login")
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { email, password }: LoginDto) {
    return this.userAuthService.login(email, password);
  }
}

@Controller("kitchen")
@ApiTags("kitchen")
export class KitchenAuthController {
  constructor(private readonly kitchenAuthService: KitchenAuthService) {}

  @Post("auth")
  @ApiOkResponse({ type: AuthEntity })
  login(@Body() { token }: TokenDto) {
    return this.kitchenAuthService.login(token);
  }
}
