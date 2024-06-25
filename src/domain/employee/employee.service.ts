import { Injectable } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class EmployeeService {
  constructor(private readonly database: DatabaseService) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return await this.database.employee.create({
      data: createEmployeeDto,
    });
  }

  async findAll() {
    return await this.database.employee.findMany();
  }

  async findOne(id: number) {
    return await this.database.employee.findUnique({
      where: { employee_id: id },
    });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    await this.database.employee.update({
      where: { employee_id: id },
      data: updateEmployeeDto,
    });
  }

  async remove(id: number) {
    await this.database.employee.delete({
      where: { employee_id: id },
    });
  }
}
