import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateMenuDto } from "./create-menu.dto";

export class UpdateMenuDto extends PartialType(
  OmitType(CreateMenuDto, ["space_id"])
) {}
