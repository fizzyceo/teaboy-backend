import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @IsOptional()
  name_ar: string;
  @ApiProperty()
  @IsOptional()
  currency: string;

  @IsOptional()
  currency_ar: string;

  @IsOptional()
  @IsNumber()
  VAT?: number;

  @IsOptional()
  ask: string;

  @ApiProperty({ default: false })
  @IsOptional()
  @IsBoolean()
  ask_for_table?: boolean;

  @ApiProperty({ default: true })
  @IsOptional()
  @IsBoolean()
  ask_for_name?: boolean;
}
