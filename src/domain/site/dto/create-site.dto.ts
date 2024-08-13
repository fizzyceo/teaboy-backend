import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateSiteDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false, default: "" })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({ type: "string", format: "binary" })
  file: Express.Multer.File;
}
