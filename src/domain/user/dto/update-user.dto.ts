import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ["email", "role"])
) {}

// export class UpdateUserByAdminDto extends PartialType(CreateUserDto) {}
