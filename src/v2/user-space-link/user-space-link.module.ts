import { Module } from "@nestjs/common";
import { UserSpaceLinkService } from "./user-space-link.service";
import { UserSpaceLinkController } from "./user-space-link.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [UserSpaceLinkController],
  providers: [UserSpaceLinkService],
  imports: [DatabaseModule, AuthModule],
  exports: [UserSpaceLinkService],
})
export class UserSpaceLinkModuleV2 {}
