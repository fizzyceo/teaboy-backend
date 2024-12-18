import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { DatabaseModule } from "src/database/database.module";
import { SpaceModule } from "../space/space.module";
import { EncryptionModule } from "src/encryption/encryption.module";
import { AuthModule } from "src/auth/auth.module";
import { KitchenModule } from "../kitchen/kitchen.module";

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [
    DatabaseModule,
    SpaceModule,
    EncryptionModule,
    AuthModule,
    KitchenModule,
  ],
})
export class MenuModule {}
