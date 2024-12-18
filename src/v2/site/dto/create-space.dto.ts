import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";

enum SPACE_TYPE {
  MAJLISS = "MAJLISS",
  OFFICE = "OFFICE",
  DEPARTMENT = "DEPARTMENT",
  SERVICE = "SERVICE",
}

export class CreateSpaceDto {
  @ApiProperty({
    description: "Name of the space",
    example: "Space 1",
    type: "string",
  })
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  name_ar?: string;

  @IsString()
  @IsOptional()
  theme?: string;

  @IsString()
  @IsOptional()
  default_lang?: string;

  @ApiProperty({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  type: SPACE_TYPE;
}
