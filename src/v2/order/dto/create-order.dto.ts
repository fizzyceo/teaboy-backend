import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @ApiProperty()
  @IsInt()
  spaceId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  customer_name: string;

  // @ApiProperty()
  // @IsInt()
  // @IsOptional()
  // table_number: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty()
  @IsInt()
  @IsOptional()
  user_id: number;

  @ApiProperty({ type: [OrderItemDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => OrderItemDto)
  orders?: OrderItemDto[];
}
