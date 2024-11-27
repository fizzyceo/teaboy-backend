import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CronService } from "./cron.service";

@Module({
  imports: [HttpModule],
  providers: [CronService],
})
export class CatsModule {}
