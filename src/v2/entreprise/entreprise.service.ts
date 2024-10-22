import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";
import { CreateEntrepriseDto, UpdateEntrepriseDto } from "./dto";
import { CreateSiteDto } from "../site/dto";

@Injectable()
export class EntrepriseService {
  constructor(
    private readonly database: DatabaseService,
    private readonly imagesService: ImagesService
  ) {}

  // Find entreprise by ID
  private async findEntrepriseById(id: number) {
    const entreprise = await this.database.entreprise.findUnique({
      where: { ent_id: id },
      include: { owner: true },
    });

    if (!entreprise) {
      throw new NotFoundException(`Entreprise with id ${id} not found`);
    }

    return entreprise;
  }

  // Get all entreprises (only accessible by superadmin)
  async getAllEntreprises(userRole: string) {
    if (userRole !== "superadmin") {
      throw new ForbiddenException(
        "Access denied. Only superadmin can view all entreprises."
      );
    }

    const entreprises = await this.database.entreprise.findMany({
      include: { owner: true, Site: true },
    });

    return entreprises;
  }

  // Get one entreprise by ID (only accessible by the owner)
  async getOneEntrepriseById(id: number, userId: number) {
    const entreprise = await this.findEntrepriseById(id);

    if (entreprise.owner.user_id !== userId) {
      throw new ForbiddenException(
        "Access denied. You are not the owner of this entreprise."
      );
    }

    return entreprise;
  }

  // Create entreprise (accessible by users with admin role)
  async createEntreprise(
    createEntrepriseDto: CreateEntrepriseDto,
    file: Express.Multer.File,
    userRole: string,
    ownerId: number
  ) {
    if (userRole !== "ADMIN") {
      throw new ForbiddenException(
        "Access denied. Only admins can create an entreprise."
      );
    }

    const imageUrl = await this.imagesService.uploadFile(file);

    return await this.database.entreprise.create({
      data: {
        ...createEntrepriseDto,
        image_url: imageUrl.url,
        owner_id: ownerId,
      },
    });
  }

  // Update entreprise (only accessible by the owner)
  async updateEntreprise(
    id: number,
    updateEntrepriseDto: UpdateEntrepriseDto,
    userId: number,
    updateFile: Express.Multer.File
  ) {
    const entreprise = await this.findEntrepriseById(id);

    if (entreprise.owner.user_id !== userId) {
      throw new ForbiddenException(
        "Access denied. You are not the owner of this entreprise."
      );
    }

    let imageUrl = entreprise.image_url;

    if (updateFile) {
      const uploadedImage = await this.imagesService.uploadFile(updateFile);
      imageUrl = uploadedImage.url;
    }

    const updateData = {
      image_url: imageUrl,
      ...updateEntrepriseDto,
    };

    return await this.database.entreprise.update({
      where: { ent_id: id },
      data: updateData,
    });
  }

  // Delete entreprise (only accessible by the owner)
  async deleteEntreprise(id: number, userId: number) {
    const entreprise = await this.findEntrepriseById(id);

    if (entreprise.owner.user_id !== userId) {
      throw new ForbiddenException(
        "Access denied. You are not the owner of this entreprise."
      );
    }

    await this.database.entreprise.delete({
      where: { ent_id: id },
    });

    return {
      message: `Entreprise with id ${id} deleted successfully`,
    };
  }

  // Get all sites under a specific entreprise
  async getEntrepriseSites(entrepriseId: number, userId: number) {
    const entreprise = await this.findEntrepriseById(entrepriseId);

    if (entreprise.owner.user_id !== userId) {
      throw new ForbiddenException(
        "Access denied. You are not the owner of this entreprise."
      );
    }

    return await this.database.site.findMany({
      where: { ent_id: entrepriseId },
    });
  }

  // Create a new site for an entreprise (only accessible by the owner)
  async createEntrepriseSite(
    entrepriseId: number,
    createSiteDto: CreateSiteDto,
    userId: number,
    file: Express.Multer.File
  ) {
    const entreprise = await this.findEntrepriseById(entrepriseId);

    if (entreprise.owner.user_id !== userId) {
      throw new ForbiddenException(
        "Access denied. You are not the owner of this entreprise."
      );
    }

    const imageUrl = await this.imagesService.uploadFile(file);

    return await this.database.site.create({
      data: {
        ...createSiteDto,
        entreprise: {
          connect: { ent_id: entrepriseId },
        },
        image_url: imageUrl.url,
      },
    });
  }
}
