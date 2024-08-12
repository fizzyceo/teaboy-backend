import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class AddUserToSiteDto {
  @ApiProperty({ description: "User id to add" })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: "Site id to add" })
  @IsInt()
  @IsNotEmpty()
  site_id: number;
}
