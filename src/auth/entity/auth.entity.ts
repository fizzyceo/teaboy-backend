import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from "class-validator";
enum UserRole {
  ADMIN = "ADMIN",
  TEABOY = "TEABOY",
  NORMAL_USER = "NORMAL_USER",
}
class User {
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
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
}
export class AuthEntity2 {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  success: boolean;

  @ApiProperty()
  user: User;
}
