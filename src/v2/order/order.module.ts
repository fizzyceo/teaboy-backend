import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { DatabaseModule } from "src/database/database.module";
import { KitchenModule } from "../kitchen/kitchen.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [DatabaseModule, KitchenModule],
})
export class OrderModule {}
