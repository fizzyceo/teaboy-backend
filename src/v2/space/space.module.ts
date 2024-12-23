import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/database/database.module";
import { SpaceService } from "./space.service";
import { AuthModule } from "src/auth/auth.module";
import { SpaceController } from "./space.controller";

@Module({
  controllers: [SpaceController],
  providers: [SpaceService],
  imports: [DatabaseModule, AuthModule],
  exports: [SpaceService],
})
export class SpaceModuleV2 {}
