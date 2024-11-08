import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { DatabaseModule } from "src/database/database.module";
import { KitchenModuleV2 } from "../kitchen/kitchen.module";
import { AuthModule } from "src/auth/auth.module";
import { ImagesModule } from "src/images/images.module";

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [DatabaseModule, AuthModule, KitchenModuleV2, ImagesModule],
  exports: [UserService],
})
export class UserModuleV2 {}
