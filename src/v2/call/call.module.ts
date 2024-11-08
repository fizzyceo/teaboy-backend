import { Module } from "@nestjs/common";
import { CallService } from "./call.service";
import { CallController } from "./call.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { KitchenModuleV2 } from "../kitchen/kitchen.module";

@Module({
  imports: [DatabaseModule, AuthModule, KitchenModuleV2],
  controllers: [CallController],
  providers: [CallService],
})
export class CallModuleV2 {}
