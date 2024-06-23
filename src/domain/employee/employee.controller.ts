import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";

import { ApiBody, ApiTags } from "@nestjs/swagger";

@Controller("employee")
@ApiTags("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBody({ type: CreateEmployeeDto })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get()
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: string) {
    return this.employeeService.findOne(+id);
  }

  @Patch(":id")
  @ApiBody({ type: [UpdateEmployeeDto] })
  update(
    @Param("id", ParseIntPipe) id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeeService.update(+id, updateEmployeeDto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: string) {
    return this.employeeService.remove(+id);
  }
}
