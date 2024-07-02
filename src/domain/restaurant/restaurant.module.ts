import { Module } from "@nestjs/common";
import { RestaurantService } from "./restaurant.service";
import { RestaurantController } from "./restaurant.controller";
import { DatabaseModule } from "src/database/database.module";
import { ImagesModule } from "src/images/images.module";

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [DatabaseModule, ImagesModule],
})
export class RestaurantModule {}
