import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { CallService } from './call.service';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@WebSocketGateway()
export class CallGateway {
  constructor(private readonly callService: CallService) {}

  @SubscribeMessage('createCall')
  create(@MessageBody() createCallDto: CreateCallDto) {
    return this.callService.create(createCallDto);
  }

  @SubscribeMessage('findAllCall')
  findAll() {
    return this.callService.findAll();
  }

  @SubscribeMessage('findOneCall')
  findOne(@MessageBody() id: number) {
    return this.callService.findOne(id);
  }

  @SubscribeMessage('updateCall')
  update(@MessageBody() updateCallDto: UpdateCallDto) {
    return this.callService.update(updateCallDto.id, updateCallDto);
  }

  @SubscribeMessage('removeCall')
  remove(@MessageBody() id: number) {
    return this.callService.remove(id);
  }
}
