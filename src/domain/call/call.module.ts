import { Module } from "@nestjs/common";
import { CallService } from "./call.service";
import { CallGateway } from "./call.gateway";
import { DatabaseModule } from "src/database/database.module";

@Module({
  providers: [CallGateway, CallService],
  imports: [DatabaseModule],
})
export class CallModule {}
