import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { OpeningHourDto } from "./opening-hour.dto";
import { Type } from "class-transformer";

export class CreateKitchenDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  name_ar: string;

  @ApiProperty()
  @IsBoolean()
  isOpen: boolean;

  @ApiProperty({ type: [OpeningHourDto] })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => OpeningHourDto)
  openingHours: OpeningHourDto[];

  @ApiProperty()
  @IsBoolean()
  isWeeklyTimingOn: boolean;
}
