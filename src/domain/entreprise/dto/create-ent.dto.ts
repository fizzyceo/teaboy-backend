import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber } from "class-validator";

export class CreateEntrepriseDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  file: Express.Multer.File;
}
