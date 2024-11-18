import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsOptional()
  name_ar: string;
  @ApiProperty()
  currency: string;

  @ApiProperty()
  @IsOptional()
  currency_ar: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  VAT?: number;

  @ApiProperty()
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  site_id?: number;
}
