import { Module } from "@nestjs/common";
import { CallService } from "./call.service";
import { CallController } from "./call.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModule {}
