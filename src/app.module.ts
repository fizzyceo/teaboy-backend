import { Module } from "@nestjs/common";
import { CustomerModule } from "./customer/customer.module";
import { EmployeeModule } from "./employee/employee.module";
import { RestaurantModule } from "./restaurant/restaurant.module";
import { MenuModule } from "./menu/menu.module";
import { OrderModule } from "./order/order.module";
import { OrderItemModule } from "./order-item/order-item.module";
import { MenuItemModule } from "./menu-item/menu-item.module";
import { DatabaseModule } from "./database/database.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    CustomerModule,
    EmployeeModule,
    RestaurantModule,
    MenuModule,
    OrderModule,
    OrderItemModule,
    MenuItemModule,
    DatabaseModule,
    AuthModule,
  ],
})
export class AppModule {}
