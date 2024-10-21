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
