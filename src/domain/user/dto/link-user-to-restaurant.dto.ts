import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LinkUserToRestaurantDto {
  @ApiProperty({ description: "User id to add" })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ description: "Restaurant id to add" })
  @IsInt()
  @IsNotEmpty()
  restaurantId: number;
}
