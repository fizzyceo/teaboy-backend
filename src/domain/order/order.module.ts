import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { DatabaseModule } from "src/database/database.module";
import { NotificationModule } from "src/notification/notification.module";

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [DatabaseModule, NotificationModule],
})
export class OrderModule {}
