import { PartialType } from "@nestjs/mapped-types";
import { CreateCallDto } from "./create-call.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdateCallDto extends PartialType(
  OmitType(CreateCallDto, ["space_id"])
) {}
