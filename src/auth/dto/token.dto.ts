import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}

export class KitchneTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  token: string;

  @IsString()
  @IsNotEmpty()
  fcmToken: string;
}
