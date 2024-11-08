import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("V1") // Global tag for V1 controllers
export class BaseV1Controller {}
