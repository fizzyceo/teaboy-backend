import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateMenuItemDto } from "./create-menu-item.dto";

export class UpdateMenuItemDto extends PartialType(
  OmitType(CreateMenuItemDto, ["menu_id"]),
) {}
