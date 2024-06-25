import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class CustomerService {
  constructor(private readonly database: DatabaseService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return await this.database.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return await this.database.customer.findMany();
  }

  async findOne(id: number) {
    const customer = await this.database.customer.findUnique({
      where: { customer_id: id },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with id ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return await this.database.customer.update({
      where: { customer_id: id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    return await this.database.customer.delete({
      where: { customer_id: id },
    });
  }
}
