import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, ValidateNested } from "class-validator";

export class MenuItemOptionChoice {
  @ApiProperty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  name_ar: string;
}

export class CreateMenuItemOption {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  name_ar: string;

  @ApiProperty({ type: [MenuItemOptionChoice] })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => MenuItemOptionChoice)
  choices: MenuItemOptionChoice[];

  @ApiProperty({ type: MenuItemOptionChoice, required: false })
  @ValidateNested()
  @IsOptional()
  @Type(() => MenuItemOptionChoice)
  default_choice?: MenuItemOptionChoice;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  existing_option_id?: number;
}

export class UpdateMenuItemOptionChoice {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  menu_item_option_choice_id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  name_ar: string;
}

export class UpdateMenuItemOption {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  menu_item_option_id: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name_ar: string;

  @ApiProperty({ type: [UpdateMenuItemOptionChoice] })
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => UpdateMenuItemOptionChoice)
  choices: UpdateMenuItemOptionChoice[];

  @ApiProperty({ type: UpdateMenuItemOptionChoice })
  @ValidateNested()
  @IsOptional()
  @Type(() => UpdateMenuItemOptionChoice)
  default_choice?: UpdateMenuItemOptionChoice;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  existing_option_id?: number;
}
