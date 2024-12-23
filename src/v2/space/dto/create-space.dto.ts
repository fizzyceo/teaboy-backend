import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsNumber, IsEnum } from "class-validator";
import { SPACE_TYPE } from "@prisma/client"; // Assuming SPACE_TYPE is an enum from Prisma

export class CreateSpaceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name_ar?: string;

  @ApiProperty({ enum: SPACE_TYPE, default: SPACE_TYPE.DEPARTMENT })
  @IsEnum(SPACE_TYPE)
  @IsOptional()
  type?: SPACE_TYPE;

  @ApiProperty()
  @IsNumber()
  site_id: number;
  @ApiProperty()
  @IsNumber()
  menu_id?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  kitchen_id?: number;
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  default_lang?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  theme?: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  allowedOrderDistance?: number;
}
