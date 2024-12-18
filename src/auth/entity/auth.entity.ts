import { ApiProperty } from "@nestjs/swagger";
import { LANGUAGE, OS_TYPE } from "@prisma/client";
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";
// enum LANGUAGE {
//   EN = "EN",
//   AR = "AR",
// }
// enum OS_TYPE {
//   android = "android",
//   ios = "ios",
// }

enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  ROOT = "ROOT",
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

  @ApiProperty({ enum: OS_TYPE })
  @IsOptional()
  @IsEnum(OS_TYPE)
  phoneOS?: OS_TYPE;

  @ApiProperty({ enum: LANGUAGE })
  @IsOptional()
  @IsEnum(LANGUAGE)
  userLanguage?: LANGUAGE;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  max_daily_orders?: number;

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
  @IsOptional()
  success?: boolean;

  @ApiProperty()
  user: User;
}
