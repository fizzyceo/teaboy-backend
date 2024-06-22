import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImagesController } from "./images.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [ImagesController],
  providers: [ImagesService],
  imports: [DatabaseModule],
})
export class ImagesModule {}
