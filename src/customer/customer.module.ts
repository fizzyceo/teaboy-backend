import { Module } from "@nestjs/common";
import { CustomerService } from "./customer.service";
import { CustomerController } from "./customer.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [DatabaseModule],
})
export class CustomerModule {}
