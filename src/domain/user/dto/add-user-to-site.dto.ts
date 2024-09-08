import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class AddUserToSiteDto {
  @ApiProperty({ description: "User id to add" })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: "Site id to add" })
  @IsInt()
  @IsNotEmpty()
  siteId: number;
}
