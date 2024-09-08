import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt, IsString } from "class-validator";

enum SPACE_TYPE {
  MAJLISS = "MAJLISS",
  OFFICE = "OFFICE",
  DEPARTMENT = "DEPARTMENT",
}

export class CreateSpaceDto {
  @ApiProperty({
    description: "Name of the space",
    example: "Space 1",
    type: "string",
  })
  @IsString()
  name: string;

  @ApiProperty({ enum: SPACE_TYPE })
  @IsEnum(SPACE_TYPE)
  type: SPACE_TYPE;
}
