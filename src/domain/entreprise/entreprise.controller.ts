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
  Headers,
  UseGuards,
  Req,
} from "@nestjs/common";
import { EntrepriseService } from "./entreprise.service";
import { CreateEntrepriseDto } from "./dto/create-ent.dto";
import { UpdateEntrepriseDto } from "./dto/update-ent.dto";
import {
  ApiTags,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiConsumes,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "src/auth/guard/jwt-auth.guard";
import { RolesGuard } from "src/auth/guard/roles.guard";
import { Roles } from "src/auth/roles.decorator";

@Controller("entreprise")
@ApiTags("entreprise")
export class EntrepriseController {
  constructor(private readonly entrepriseService: EntrepriseService) {}

  // Create Entreprise (Accessible by users with the "admin" role)
  @Post("create")
  @ApiBody({ type: CreateEntrepriseDto })
  @ApiOperation({ summary: "Create a new entreprise" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @UseGuards(JwtAuthGuard)
  createEntreprise(
    @Req() req: any,
    @Body() createEntrepriseDto: CreateEntrepriseDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const { user_id, role } = req.user; // The logged-in user's id
    return this.entrepriseService.createEntreprise(
      createEntrepriseDto,
      file,
      role,
      user_id
    );
  }

  // Get all entreprises (Accessible by "superadmin" role only)
  @Get()
  @ApiOperation({ summary: "Get all entreprises" })
  @UseGuards(JwtAuthGuard)
  getAllEntreprises(@Req() req: any) {
    const { user_id, role } = req.user; // The logged-in user's id

    return this.entrepriseService.getAllEntreprises(role);
  }

  // Get one entreprise by ID (Accessible only by the owner)
  @Get(":id")
  @ApiOperation({ summary: "Get entreprise details by id" })
  @ApiParam({
    name: "id",
    description: "Entreprise id to fetch",
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  getEntrepriseById(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @Headers("LANG") lang: string
  ) {
    const { user_id } = req.user;
    return this.entrepriseService.getOneEntrepriseById(id, user_id);
  }

  // Update entreprise (Accessible only by the owner)
  @Patch(":id")
  @ApiBody({ type: UpdateEntrepriseDto })
  @ApiOperation({ summary: "Update entreprise details by id" })
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes("multipart/form-data")
  @ApiParam({
    name: "id",
    description: "Entreprise id to update",
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  updateEntreprise(
    @Req() req: any,
    @Param("id", ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateEntrepriseDto: UpdateEntrepriseDto
  ) {
    const { user_id } = req.user;
    return this.entrepriseService.updateEntreprise(
      id,
      updateEntrepriseDto,
      user_id,
      file
    );
  }

  // Delete entreprise (Accessible only by the owner or superadmin)
  @Delete(":id")
  @ApiOperation({ summary: "Delete entreprise by id" })
  @ApiParam({
    name: "id",
    description: "Entreprise id to delete",
    required: true,
  })
  @UseGuards(JwtAuthGuard)
  deleteEntreprise(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
    const { user_id } = req.user;

    return this.entrepriseService.deleteEntreprise(id, user_id);
  }
}
