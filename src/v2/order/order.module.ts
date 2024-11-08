import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { DatabaseModule } from "src/database/database.module";
import { KitchenModuleV2 } from "../kitchen/kitchen.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [DatabaseModule, KitchenModuleV2],
})
export class OrderModuleV2 {}
