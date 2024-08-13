import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddUserToSpaceDto {
  @ApiProperty({ description: "User id to add" })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: "Space id to add" })
  @IsInt()
  @IsNotEmpty()
  spaceId: number;
}
