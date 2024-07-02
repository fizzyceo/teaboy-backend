import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [DatabaseModule],
})
export class OrderModule {}
