import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { MenuItem } from "./menu-item.dto";

export class CreateMenuDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  restaurant_id: number;

  @ApiProperty({ type: [MenuItem] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => MenuItem)
  menu_items?: MenuItem[];
}
