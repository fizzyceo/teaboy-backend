import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  qr_code: string;

  @ApiProperty()
  @IsNumber()
  restaurant_id: number;
}
