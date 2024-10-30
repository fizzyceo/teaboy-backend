import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  name: string;
  @ApiProperty()
  @IsOptional()
  name_ar: string;

  @ApiProperty()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  @IsOptional()
  currency_ar?: string;

  @ApiProperty({ default: false })
  @IsBoolean()
  ask_for_table: boolean;

  @ApiProperty({ default: true })
  @IsBoolean()
  ask_for_name: boolean;
}
