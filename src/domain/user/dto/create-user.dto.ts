import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

enum UserRole {
  ADMIN = "ADMIN",
  TEABOY = "TEABOY",
  NORMAL_USER = "NORMAL_USER",
}
export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  signedUp?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canCallTeaboy?: boolean;

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
}
export class UpdateUserByAdminDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  signedUp?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canCallTeaboy?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

export class LinkingSpace {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNumber()
  space_id: number;
}
