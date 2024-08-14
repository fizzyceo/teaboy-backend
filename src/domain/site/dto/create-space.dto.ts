import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsString } from "class-validator";

export class CreateSpaceDto {
  @ApiProperty({
    description: "Name of the space",
    example: "Space 1",
    type: "string",
  })
  @IsString()
  name: string;
}
