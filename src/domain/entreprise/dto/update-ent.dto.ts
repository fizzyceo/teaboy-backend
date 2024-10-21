import { PartialType } from "@nestjs/swagger";
import { CreateEntrepriseDto } from "./create-ent.dto";

export class UpdateEntrepriseDto extends PartialType(CreateEntrepriseDto) {}
