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
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cron/cron.service";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    V1Module,
    V2Module,
    HttpModule,
    CacheModule.register({
      max: 500,
      ttl: 30 * 1000,
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
  ],
  providers: [CronService],
})
export class AppModule {}
