import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class KitchenAuthGuard extends AuthGuard("kitchen-jwt") {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
