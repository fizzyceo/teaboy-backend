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
import { UserSpaceLinkModule } from "./domain/user-space-link/user-space-link.module";
import { SpaceModule } from "./domain/space/space.module";
import { EncryptionModule } from "./encryption/encryption.module";
import { KitchenModule } from "./domain/kitchen/kitchen.module";
import { CallModule } from "./domain/call/call.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { EntrepriseModule } from "./domain/entreprise/entreprise.module";
import { V2Module } from "./v2/v2.module";
import { V1Module } from "./domain/v1.module";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [
    V1Module,
    V2Module,
    CacheModule.register({
      max: 500,
      ttl: 60 * 1000,
      isGlobal: true,
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     service: "gmail",
    //     // host: "mail.clickorder.io", // Gmail SMTP host
    //     // port: 465, // Use port 465 for SSL or 587 for STARTTLS
    //     secure: true, // Use SSL for port 465, set to false if using port 587 with STARTTLS
    //     auth: {
    //       type: "OAuth2",
    //       clientId: process.env.CLIENT_ID,
    //       clientSecret: process.env.CLIENT_SECRET,
    //       refreshToken: process.env.REFRESH_TOKEN,
    //       accessToken: process.env.ACCESS_TOKEN,
    //       user: process.env.MAIL_APP_EMAIL, // Your Gmail email address
    //     },
    //   },
    //   defaults: {
    //     from: `"ClickOrder" <${`donotreply@clickorder.io`}>`, // Default 'from' email
    //   },
    // }),
  ],
})
export class AppModule {}
