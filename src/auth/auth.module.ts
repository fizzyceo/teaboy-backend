import { Module } from "@nestjs/common";
import { AuthController, KitchenAuthController } from "./auth.controller";
import { DatabaseModule } from "src/database/database.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { RolesGuard } from "./guard/roles.guard";
import { KitchenJwtStrategy } from "./strategy/kitchenJwt.strategy";
import { UserJwtStrategy } from "./strategy/userJwt.strategy";
import { UserAuthService } from "./userAuth.service";
import { KitchenAuthService } from "./kitchenAuth.service";

@Module({
  imports: [
    DatabaseModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [AuthController, KitchenAuthController],
  providers: [
    UserAuthService,
    KitchenAuthService,
    KitchenJwtStrategy,
    UserJwtStrategy,
    RolesGuard,
  ],
  exports: [UserAuthService, KitchenAuthService],
})
export class AuthModule {}
