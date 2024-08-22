import { PartialType } from '@nestjs/mapped-types';
import { CreateCallDto } from './create-call.dto';

export class UpdateCallDto extends PartialType(CreateCallDto) {
  id: number;
}
