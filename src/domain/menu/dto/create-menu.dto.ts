import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNumber()
  site_id: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  ask_for_table: boolean;

  @ApiProperty({ default: false })
  @IsBoolean()
  ask_for_name: boolean;
}
