import {
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator";

export class Customer {
  @IsInt()
  id: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsPhoneNumber("DZ")
  @IsOptional()
  phone: string;

  @IsDate()
  createdAt: Date;
  @IsDate()
  updatedAt: Date;
}
