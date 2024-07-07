import { Controller, Post, Body } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { sendNotificationDTO } from "./dto/send-notification.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller("notification")
@ApiTags("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  sendNotification(@Body() pushNotification: sendNotificationDTO) {
    this.notificationService.sendPush(pushNotification);
  }
}
