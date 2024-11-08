import { Module } from "@nestjs/common";
import { OrderItemService } from "./order-item.service";
import { OrderItemController } from "./order-item.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [OrderItemController],
  providers: [OrderItemService],
  imports: [DatabaseModule],
})
export class OrderItemModuleV2 {}
