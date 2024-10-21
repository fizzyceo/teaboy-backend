import { Module } from "@nestjs/common";
import { EntrepriseService } from "./entreprise.service";
import { EntrepriseController } from "./entreprise.controller";
import { DatabaseModule } from "src/database/database.module";
import { AuthModule } from "src/auth/auth.module";
import { ImagesModule } from "src/images/images.module";

@Module({
  controllers: [EntrepriseController],
  providers: [EntrepriseService],
  imports: [DatabaseModule, AuthModule, ImagesModule],
  exports: [EntrepriseService],
})
export class EntrepriseModule {}
