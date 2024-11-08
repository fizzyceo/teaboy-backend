import { ApiProperty } from "@nestjs/swagger";
import { LANGUAGE, OS_TYPE } from "@prisma/client";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
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

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: LANGUAGE })
  @IsOptional()
  @IsEnum(LANGUAGE)
  userLanguage?: LANGUAGE;

  @ApiProperty({ enum: OS_TYPE })
  @IsOptional()
  @IsEnum(OS_TYPE)
  phoneOS?: OS_TYPE;
}
