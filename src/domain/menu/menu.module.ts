import { Module } from "@nestjs/common";
import { MenuService } from "./menu.service";
import { MenuController } from "./menu.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [MenuController],
  providers: [MenuService],
  imports: [DatabaseModule],
})
export class MenuModule {}
