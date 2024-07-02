import { Module } from "@nestjs/common";
import { MenuItemService } from "./menu-item.service";
import { MenuItemController } from "./menu-item.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [MenuItemController],
  providers: [MenuItemService],
  imports: [DatabaseModule],
})
export class MenuItemModule {}
