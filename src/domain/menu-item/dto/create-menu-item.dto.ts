import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class CreateItemImageDto {
  @ApiProperty()
  @IsString()
  image_url: string;
}

export class CreateMenuItemDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsBoolean()
  available: boolean;

  @ApiProperty()
  @IsInt()
  menu_id: number;

  @ApiProperty({ type: [CreateItemImageDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemImageDto)
  images: CreateItemImageDto[];
}
