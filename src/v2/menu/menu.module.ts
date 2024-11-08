import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { DatabaseModule } from "src/database/database.module";
import { SpaceModuleV2 } from "../space/space.module";
import { EncryptionModule } from "src/encryption/encryption.module";
import { AuthModule } from "src/auth/auth.module";
import { KitchenModuleV2 } from "../kitchen/kitchen.module";

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [
    DatabaseModule,
    SpaceModuleV2,
    EncryptionModule,
    AuthModule,
    KitchenModuleV2,
  ],
})
export class MenuModuleV2 {}
