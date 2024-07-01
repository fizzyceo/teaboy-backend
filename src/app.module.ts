import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { CustomerModule } from "./domain/customer/customer.module";
import { EmployeeModule } from "./domain/employee/employee.module";
import { ImagesModule } from "./images/images.module";
import { MenuModule } from "./domain/menu/menu.module";
import { MenuItemModule } from "./domain/menu-item/menu-item.module";
import { OrderModule } from "./domain/order/order.module";
import { RestaurantModule } from "./domain/restaurant/restaurant.module";
import { OrderItemModule } from "./domain/order-item/order-item.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    RestaurantModule,
    DatabaseModule,
    AuthModule,
    CustomerModule,
    EmployeeModule,
    ImagesModule,
    MenuModule,
    MenuItemModule,
    OrderModule,
    OrderItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
