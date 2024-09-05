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
} from "@nestjs/common";
import { CallService } from "./call.service";
import { CreateCallDto } from "./dto/create-call.dto";
import { UpdateCallDto } from "./dto/update-call.dto";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { KitchenAuthGuard } from "src/auth/guard/kitchen.guard";

@Controller("call")
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
  startCall(@Body() createCallDto: CreateCallDto, @Req() user: any) {
    const { user_id } = user.user;
    console.log("Create call", createCallDto);
    return this.callService.startCall(createCallDto, user_id);
  }

  @Get("history")
  @ApiOperation({
    summary: "Get all calls for the kitchen [Kitchen]",
    description:
      "Get all calls for the kitchen, you should be authenticated as a kitchen",
  })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  getKitchenCalls(@Req() kitchen: any) {
    const { kitchen_id } = kitchen.user;
    return this.callService.getKitchenCalls(kitchen_id);
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
  getCallStatus(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    return this.callService.getCallStatus(call_id, user_id);
  }

  @Get("details/:call_id")
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Get call details by id [Kitchen]",
    description:
      "Get call details by id, you should be authenticated as a kitchen",
  })
  getCallDetails(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Req() kitchen: any
  ) {
    const { kitchen_id } = kitchen.user;
    return this.callService.getCallDetails(call_id, kitchen_id);
  }

  @Patch("/user-update/:call_id")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "ANSWERED",
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update call status [User]",
    description:
      "You should be authenticated as a user, [STARTED,ANSWERED,COMPLETED,FAILED]",
  })
  updateCallUser(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Body() updateCallDto: UpdateCallDto,
    @Req() user: any
  ) {
    const { user_id } = user.user;
    return this.callService.updateCallUser(call_id, updateCallDto, user_id);
  }

  @Patch("/kitchen-update/:call_id")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        status: {
          type: "string",
          example: "ANSWERED",
        },
      },
    },
  })
  @UseGuards(KitchenAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update call status [Kitchen]",
    description:
      "You should be authenticated as a Kitchen, [STARTED,ANSWERED,COMPLETED,FAILED]",
  })
  updateCallKitchen(
    @Param("call_id", ParseIntPipe) call_id: number,
    @Body() updateCallDto: UpdateCallDto,
    @Req() kitchen: any
  ) {
    const { kitchen_id } = kitchen.user;
    return this.callService.updateCallKitchen(
      call_id,
      updateCallDto,
      kitchen_id
    );
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
