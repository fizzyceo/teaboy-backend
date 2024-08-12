import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

export class MenuItemCategory {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateMenuItemDto {
  @ApiProperty({
    description: "Title of the menu item",
    example: "Burger",
    type: "string",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Description of the menu item",
    example: "Delicious burger",
    type: "string",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: "Price of the menu item",
    example: 10,
    type: "number",
  })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: "Categories of the menu item",
    type: Number,
    isArray: true,
  })
  @IsInt({ each: true })
  @IsOptional()
  @Type(() => Number)
  categories: number[];

  @ApiProperty({
    description: "Availability of the menu item",
    example: true,
    type: "boolean",
    default: true,
  })
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  available: boolean;

  @ApiProperty({
    description: "Menu id",
    example: 1,
    type: "number",
  })
  @IsInt()
  @Transform(({ value }) => Number(value))
  menu_id: number;

  @ApiProperty({
    description: "Images of the menu Item",
    type: "array",
    items: {
      type: "string",
      format: "binary",
    },
  })
  @IsArray()
  @IsOptional()
  item_images: any[];
}
