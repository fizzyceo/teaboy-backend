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

import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@Controller("employee")
@ApiTags("employee")
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiBody({ type: CreateEmployeeDto })
  @ApiOperation({ summary: "Create a new employee" })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.create(createEmployeeDto);
  }

  @Get("")
  @ApiOperation({ summary: "Get all employees" })
  findAll() {
    return this.employeeService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get employee details by id" })
  @ApiParam({
    name: "id",
    description: "Employee id to fetch",
    required: true,
  })
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.employeeService.findOne(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateEmployeeDto })
  @ApiOperation({ summary: "Update employee details by id" })
  @ApiParam({
    name: "id",
    description: "Employee id to update",
    required: true,
  })
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, updateEmployeeDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete employee by id" })
  @ApiParam({
    name: "id",
    description: "Employee id to delete",
    required: true,
  })
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.employeeService.remove(id);
  }
}
