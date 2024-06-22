import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";
import { CustomerModule } from "./customer/customer.module";
import { EmployeeModule } from "./employee/employee.module";
import { ImagesModule } from "./images/images.module";
import { MenuModule } from "./menu/menu.module";
import { MenuItemModule } from "./menu-item/menu-item.module";
import { OrderModule } from "./order/order.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { OrderItemModule } from './order-item/order-item.module';

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
  ],
})
export class AppModule {}
