import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { DatabaseService } from "src/database/database.service";

import * as bcrypt from "bcrypt";

export const roundsOfHashing = 10;

@Injectable()
export class EmployeeService {
  constructor(private readonly database: DatabaseService) {}

  async createEmployee(createEmployeeDto: CreateEmployeeDto) {
    const hashedPassword = await bcrypt.hash(
      createEmployeeDto.password,
      roundsOfHashing
    );

    createEmployeeDto.password = hashedPassword;

    return await this.database.employee.create({
      data: createEmployeeDto,
    });
  }

  async getAllEmployees() {
    return await this.database.employee.findMany();
  }

  async getEmployeeById(id: number) {
    const employee = await this.database.employee.findUnique({
      where: { employee_id: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return await this.database.employee.findUnique({
      where: { employee_id: id },
    });
  }

  async updateEmployee(id: number, updateEmployeeDto: UpdateEmployeeDto) {
    const employee = await this.database.employee.findUnique({
      where: { employee_id: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    if (updateEmployeeDto.password) {
      updateEmployeeDto.password = await bcrypt.hash(
        updateEmployeeDto.password,
        roundsOfHashing
      );
    }
    return await this.database.employee.update({
      where: { employee_id: id },
      data: updateEmployeeDto,
    });
  }

  async deleteEmployee(id: number) {
    const employee = await this.database.employee.findUnique({
      where: { employee_id: id },
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return await this.database.employee.delete({
      where: { employee_id: id },
    });
  }
}
