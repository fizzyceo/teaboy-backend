import { Module } from "@nestjs/common";
import { KitchenService } from "./kitchen.service";
import { KitchenController } from "./kitchen.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [KitchenController],
  providers: [KitchenService],
  imports: [DatabaseModule],
})
export class KitchenModule {}
