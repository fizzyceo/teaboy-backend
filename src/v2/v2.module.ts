import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { KitchenModuleV2 } from "./kitchen/kitchen.module";
import { SiteModuleV2 } from "./site/site.module";
import { UserModuleV2 } from "./user/user.module";
import { UserSpaceLinkModuleV2 } from "./user-space-link/user-space-link.module";
import { DatabaseModule } from "src/database/database.module";
import { MenuModuleV2 } from "./menu/menu.module";
import { EntrepriseModuleV2 } from "./entreprise/entreprise.module";
import { MenuItemModuleV2 } from "./menu-item/menu-item.module";
import { OrderModuleV2 } from "./order/order.module";
import { OrderItemModuleV2 } from "./order-item/order-item.module";
import { ConfigModule } from "@nestjs/config";
import { ImagesModule } from "src/images/images.module";
import { SpaceModuleV2 } from "./space/space.module";
import { EncryptionModule } from "src/encryption/encryption.module";
import { CallModuleV2 } from "./call/call.module";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
  imports: [
    AuthModule,
    KitchenModuleV2,
    SiteModuleV2,
    SpaceModuleV2,

    UserModuleV2,
    UserSpaceLinkModuleV2,
    DatabaseModule,
    MenuModuleV2,
    EntrepriseModuleV2,
    MenuItemModuleV2,
    OrderModuleV2,
    OrderItemModuleV2,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ImagesModule,
    EncryptionModule,
    CallModuleV2,

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
