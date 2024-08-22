import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Matches } from "class-validator";

enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export class OpeningHourDto {
  @ApiProperty({
    enum: DayOfWeek,
    description: "Day of the week",
    example: "MONDAY",
  })
  @IsEnum(DayOfWeek)
  dayOfWeek: DayOfWeek;

  @ApiProperty({
    description: "Opening time in HH:mm format",
    example: "09:00",
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: "Time must be in HH:mm format",
  })
  openTime: string;

  @ApiProperty({
    description: "Closing time in HH:mm format",
    example: "18:00",
  })
  @IsString()
  @Matches(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
    message: "Time must be in HH:mm format",
  })
  closeTime: string;
}
