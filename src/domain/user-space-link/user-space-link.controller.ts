import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UserSpaceLinkService } from "./user-space-link.service";
import { ApiBody, ApiProperty, ApiTags } from "@nestjs/swagger";
import { LinkUserSpace } from "./dto/link-user-space.dto";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
@Controller("user-space-link")
@ApiTags("user-space-link")
export class UserSpaceLinkController {
  constructor(private readonly UserSpaceLinkService: UserSpaceLinkService) {}

  @Post("create")
  @ApiBody({ type: LinkUserSpace })
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createLink(@Body() createLinkDto: LinkUserSpace, @Req() req: any) {
    const { user_id, role, spaces } = req.user;

    // Check if user has the required role and access to the space
    const checkSpace = spaces.find(
      (space) => space.space_id === createLinkDto.space_id
    );

    if (!checkSpace) {
      return {
        statusCode: 403,
        message: "You do not have access to this space",
      };
    }

    if (role !== "ADMIN") {
      return {
        statusCode: 403,
        message: "You do not have the required role to create this link",
      };
    }

    try {
      // Create the link if the checks pass
      await this.UserSpaceLinkService.LinkSpaceUser(
        createLinkDto.space_id,
        createLinkDto.user_email
      );
      return {
        statusCode: 201,
        message: "Link created successfully",
      };
    } catch (error) {
      // Handle potential errors during the linking process
      return {
        statusCode: 500,
        message: "Internal server error",
        error: error.message,
      };
    }
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getLinks(@Req() req: any) {
    console.log(req.user);
    const { spaces } = req.user;
    const spaceIds = spaces.map((space) => space.space_id);
    console.log(spaceIds);

    return await this.UserSpaceLinkService.getAllLinks(spaceIds);
  }

  @Get("/user/:email")
  @UseGuards(JwtAuthGuard)
  async getUserSpaces(
    @Param("email", ParseIntPipe) email: string,
    @Req() req: any
  ) {
    const { user_id } = req.user;

    return await this.UserSpaceLinkService.GetUserSpaces(email);
  }

  @Get("/space/:id")
  @UseGuards(JwtAuthGuard)
  async getSpaceUsers(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const { user_id } = req.user;

    return await this.UserSpaceLinkService.GetSpaceUsers(id);
  }
}
