import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber, IsEmail } from "class-validator";

export class CreateRestaurantDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
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
}