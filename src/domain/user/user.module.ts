import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "src/database/database.module";
import { KitchenModule } from "../kitchen/kitchen.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, AuthModule, KitchenModule],
  exports: [UserService],
})
export class UserModule {}
