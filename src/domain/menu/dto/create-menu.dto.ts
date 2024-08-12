import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNumber()
  space_id: number;
}
