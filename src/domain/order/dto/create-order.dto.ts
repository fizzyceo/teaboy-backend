import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";

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
  @IsInt()
  customer_id: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;
}
