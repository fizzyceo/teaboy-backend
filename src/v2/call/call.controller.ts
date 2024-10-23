import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
  Query,
} from "@nestjs/common";
import { CallService } from "./call.service";
import { CALL_STATUS, CreateCallDto } from "./dto/create-call.dto";
import { UpdateCallDto } from "./dto/update-call.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { KitchenAuthGuard } from "src/auth/guard/kitchen.guard";
import { formatSuccessResponse } from "src/utils/format-response";

@Controller("v2/call")
@ApiTags("call")
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post("start")
  @ApiOperation({
    summary: "Start a new call [User]",
    description:
      "Start a new call by providing space_id you should be authenticated as a user",
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: "space_id",
    description: "Space id",
    type: Number,
    required: true,
  })
  async startCall(
    @Query("space_id", ParseIntPipe) space_id: number,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    const resp = await this.callService.startCall(space_id, user_id);
    return formatSuccessResponse(resp);
  }

  @Get("history")
  @ApiOperation({
    summary: "Get all calls for the kitchen [Kitchen]",
    description:
      "Get all calls for the kitchen, you should be authenticated as a kitchen",
  })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  async getKitchenCalls(@Req() kitchen: any) {
    const { kitchen_id } = kitchen.user;
    const resp = await this.callService.getKitchenCalls(kitchen_id);
    return formatSuccessResponse(resp);
  }

  @Get("status/:call_id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get call status by id [User]",
    description: "Get call status by id, you should be authenticated as a user",
  })
  @ApiParam({
    name: "call_id",
    description: "Call id",
    type: Number,
    required: true,
  })
  async getCallStatus(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    const resp = await this.callService.getCallStatus(call_id, user_id);
    return formatSuccessResponse(resp);
  }

  @Get("details/:call_id")
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get call details by id [Kitchen]",
    description:
      "Get call details by id, you should be authenticated as a kitchen",
  })
  async getCallDetails(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Req() kitchen: any
  ) {
    const { kitchen_id } = kitchen.user;
    const resp = await this.callService.getCallDetails(call_id, kitchen_id);
    return formatSuccessResponse(resp);
  }

  @Patch("/user-update/:call_id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update call status [User]",
    description:
      "You should be authenticated as a user, [STARTED,ANSWERED,COMPLETED,FAILED]",
  })
  @ApiQuery({
    name: "status",
    description: "Call status",
    enum: CALL_STATUS,
    required: true,
  })
  async updateCallUser(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Query("status") status: CALL_STATUS,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    const resp = await this.callService.updateCallUser(
      call_id,
      status,
      user_id
    );
    return formatSuccessResponse(resp);
  }

  @Patch("/kitchen-update/:call_id")
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update call status [Kitchen]",
    description:
      "You should be authenticated as a Kitchen, [STARTED,ANSWERED,COMPLETED,FAILED]",
  })
  @ApiQuery({
    name: "status",
    description: "Call status",
    enum: CALL_STATUS,
    required: true,
  })
  updateCallKitchen(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Query("status") status: CALL_STATUS,
    @Req() kitchen: any
  ) {
    const { kitchen_id } = kitchen.user;
    return this.callService.updateCallKitchen(call_id, status, kitchen_id);
  }

  @Delete(":call_id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Remove call by id [User]",
    description: "Remove call by id, you should be authenticated as a user",
  })
  deleteCall(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    return this.callService.deleteCall(call_id, user_id);
  }
}
