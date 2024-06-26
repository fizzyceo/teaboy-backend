import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, ValidateNested } from "class-validator";
import { CreateCustomerDto } from "src/domain/customer/dto/create-customer.dto";
import { CreateOrderItemDto } from "src/domain/order-item/dto/create-order-item.dto";

enum PaymentMethod {
  CASH = "CASH",
  CARD = "CARD",
}

enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
}

export class CreateOrderDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer: CreateCustomerDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => CreateOrderItemDto)
  order_items: CreateOrderItemDto[];

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;
}
