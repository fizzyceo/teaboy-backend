import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { KitchenModule } from "./kitchen/kitchen.module";
import { SiteModule } from "./site/site.module";
import { UserModule } from "./user/user.module";
import { UserSpaceLinkModule } from "./user-space-link/user-space-link.module";
import { DatabaseModule } from "src/database/database.module";
import { MenuModule } from "./menu/menu.module";
import { EntrepriseModule } from "./entreprise/entreprise.module";
import { MenuItemModule } from "./menu-item/menu-item.module";
import { OrderModule } from "./order/order.module";
import { OrderItemModule } from "./order-item/order-item.module";
import { ConfigModule } from "@nestjs/config";
import { ImagesModule } from "src/images/images.module";
import { SpaceModule } from "./space/space.module";
import { EncryptionModule } from "src/encryption/encryption.module";
import { CallModule } from "./call/call.module";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    AuthModule,
    KitchenModule,
    SiteModule,
    UserModule,
    UserSpaceLinkModule,
    DatabaseModule,
    MenuModule,
    EntrepriseModule,
    MenuItemModule,
    OrderModule,
    OrderItemModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
    SpaceModule,
    EncryptionModule,
    CallModule,

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_APP_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        auth: {
          user: process.env.MAIL_APP_USERNAME,
          pass: process.env.MAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: `"ClickOrder" <${process.env.MAIL_APP_EMAIL}>`,
      },
    }),
  ],
})
export class V2Module {}
