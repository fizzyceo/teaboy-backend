import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService],
  imports: [DatabaseModule],
})
export class EmployeeModule {}
