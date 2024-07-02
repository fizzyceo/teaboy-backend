import { Module } from "@nestjs/common";
import { ImagesService } from "./images.service";
import { ImageProvider } from "./images.provider";

@Module({
  providers: [ImageProvider, ImagesService],
  exports: [ImageProvider, ImagesService],
})
export class ImagesModule {}
