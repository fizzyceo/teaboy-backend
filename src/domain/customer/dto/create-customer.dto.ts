import { IsString, IsOptional, IsPhoneNumber, IsEmail } from "class-validator";
export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsPhoneNumber("DZ")
  @IsOptional()
  phone: string;
}
