import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class OrderItemChoice {
  // @ApiProperty()
  // @IsInt()
  // order_item_id: number;

  @ApiProperty()
  @IsInt()
  menu_item_option_choice_id: number;
}

export class OrderItemDto {
  // @ApiProperty()
  // @IsInt()
  // quantity: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  note: string;

  @ApiProperty()
  @IsInt()
  menu_item_id: number;

  @ApiProperty({ enum: OrderStatus, default: OrderStatus.PENDING })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ type: [OrderItemChoice] })
  @ValidateNested({ each: true })
  @Type(() => OrderItemChoice)
  choices: OrderItemChoice[];
}
