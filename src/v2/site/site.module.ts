import { Module } from "@nestjs/common";
import { SiteService } from "./site.service";
import { SiteController } from "./site.controller";
import { DatabaseModule } from "src/database/database.module";
import { ImagesModule } from "src/images/images.module";

@Module({
  controllers: [SiteController],
  providers: [SiteService],
  imports: [DatabaseModule, ImagesModule],
})
export class SiteModuleV2 {}
