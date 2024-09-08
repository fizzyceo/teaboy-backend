import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsInt } from "class-validator";

export enum CALL_STATUS {
  STARTED = "STARTED",
  ANSWERED = "ANSWERED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export class CreateCallDto {
  @ApiProperty()
  @IsInt()
  space_id: number;

  @ApiProperty({ enum: CALL_STATUS, default: CALL_STATUS.STARTED })
  @IsEnum(CALL_STATUS)
  status: CALL_STATUS;
}
