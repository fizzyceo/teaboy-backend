import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { EmployeeModule } from "./domain/employee/employee.module";
import { MenuModule } from "./domain/menu/menu.module";
import { MenuItemModule } from "./domain/menu-item/menu-item.module";
import { OrderModule } from "./domain/order/order.module";
import { RestaurantModule } from "./domain/restaurant/restaurant.module";
import { OrderItemModule } from "./domain/order-item/order-item.module";
import { ConfigModule } from "@nestjs/config";
import { ImagesModule } from "./images/images.module";
import { NotificationModule } from "./notification/notification.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    AuthModule,
    RestaurantModule,
    EmployeeModule,
    DatabaseModule,
    MenuModule,
    MenuItemModule,
    OrderModule,
    OrderItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
    NotificationModule,
  ],
})
export class AppModule {}
