import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsPhoneNumber, IsEmail } from "class-validator";
export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsPhoneNumber("DZ")
  @IsOptional()
  phone: string;
}
