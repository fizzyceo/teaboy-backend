import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from "@nestjs/common";
import { SpaceService } from "./space.service";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";

@Controller("v2/space")
@ApiTags("space")
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post("create")
  @ApiBody({ type: CreateSpaceDto })
  @ApiOperation({ summary: "Create a new space" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  createSpace(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.createSpace(createSpaceDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get all spaces" })
  getAllSpaces() {
    return this.spaceService.getAllSpaces();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get Space details by id" })
  @ApiParam({
    name: "id",
    description: "Space id to fetch",
    required: true,
  })
  getSpaceById(@Param("id", ParseIntPipe) id: number) {
    return this.spaceService.findSpaceById(id);
  }

  @Patch(":id")
  @ApiBody({ type: UpdateSpaceDto })
  @ApiOperation({ summary: "Update Space details by id" })
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    description: "Space id to update",
    required: true,
  })
  updateSpace(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateSpaceDto: UpdateSpaceDto
  ) {
    return this.spaceService.updateSpace(id, updateSpaceDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete Space by id" })
  @ApiParam({
    name: "id",
    description: "Space id to delete",
    required: true,
  })
  deleteSpace(@Param("id", ParseIntPipe) id: number) {
    return this.spaceService.deleteSpace(id);
  }
}
