import { ApiProperty } from "@nestjs/swagger";
import { LANGUAGE, OS_TYPE, USER_ROLE2 } from "@prisma/client";
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
  USER = "USER",
  ROOT = "ROOT",
}
export class RegisterDto {
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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  signedUp?: boolean;
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  max_daily_orders?: number;

  @ApiProperty({ enum: USER_ROLE2 })
  @IsEnum(USER_ROLE2)
  role: USER_ROLE2;

  @ApiProperty({ enum: LANGUAGE })
  @IsOptional()
  @IsEnum(LANGUAGE)
  userLanguage?: LANGUAGE;

  @ApiProperty({ enum: OS_TYPE })
  @IsOptional()
  @IsEnum(OS_TYPE)
  phoneOS?: OS_TYPE;
}
