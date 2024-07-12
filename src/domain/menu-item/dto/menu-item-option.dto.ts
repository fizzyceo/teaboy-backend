import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsString, Validate, ValidateNested } from "class-validator";

export class MenuItemOptionChoice {
  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateMenuItemOption {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ type: [MenuItemOptionChoice] })
  @ValidateNested({ each: true })
  @Type(() => MenuItemOptionChoice)
  choices: MenuItemOptionChoice[];
}
