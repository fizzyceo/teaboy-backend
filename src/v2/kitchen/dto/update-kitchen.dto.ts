import { PartialType } from "@nestjs/mapped-types";
import { CreateKitchenDto } from "./create-kitchen.dto";
import { OmitType } from "@nestjs/swagger";

export class UpdateKitchenDto extends PartialType(CreateKitchenDto) {}
