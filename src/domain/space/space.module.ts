import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { SpaceService } from "./space.service";

@Module({
  providers: [SpaceService],
  imports: [DatabaseModule],
  exports: [SpaceService],
})
export class SpaceModule {}
