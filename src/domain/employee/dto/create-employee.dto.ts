import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsInt, IsOptional, IsString } from "class-validator";

enum UserRole {
  ADMIN = "ADMIN",
  WAITER = "WAITER",
  CHEF = "CHEF",
  CASHIER = "CASHIER",
}
export class CreateEmployeeDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty()
  @IsInt()
  restaurant_id: number;
}
