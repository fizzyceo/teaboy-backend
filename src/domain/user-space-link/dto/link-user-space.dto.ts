import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LinkUserSpace {
  @ApiProperty({ description: "User email to add" })
  @IsString()
  @IsNotEmpty()
  user_email: string;

  @ApiProperty({ description: "Space id to add" })
  @IsInt()
  @IsNotEmpty()
  space_id: number;
}
