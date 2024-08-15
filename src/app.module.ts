import { Module } from "@nestjs/common";

import { DatabaseModule } from "./database/database.module";

import { MenuModule } from "./domain/menu/menu.module";
import { MenuItemModule } from "./domain/menu-item/menu-item.module";
import { OrderModule } from "./domain/order/order.module";
import { SiteModule } from "./domain/site/site.module";
import { OrderItemModule } from "./domain/order-item/order-item.module";
import { ConfigModule } from "@nestjs/config";
import { ImagesModule } from "./images/images.module";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./domain/user/user.module";
import { SpaceModule } from "./domain/space/space.module";
import { EncryptionModule } from './encryption/encryption.module';

@Module({
  imports: [
    AuthModule,
    SiteModule,
    UserModule,
    DatabaseModule,
    MenuModule,
    MenuItemModule,
    OrderModule,
    OrderItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
    SpaceModule,
    EncryptionModule,
  ],
})
export class AppModule {}
