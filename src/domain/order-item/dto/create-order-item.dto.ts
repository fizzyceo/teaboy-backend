import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  READY = "READY",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export class OrderItemChoice {
  @ApiProperty()
  @IsInt()
  order_item_id: number;

  @ApiProperty()
  @IsInt()
  menu_item_option_choice_id: number;
}

export class CreateOrderItemDto {
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

  @ApiProperty()
  @IsInt()
  order_id: number;

  @ApiProperty({ enum: OrderStatus })
  @IsString()
  status: OrderStatus;

  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemChoice)
  choices: OrderItemChoice[];
}
