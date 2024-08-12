import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";

import { CreateSiteDto, CreateSpaceDto, UpdateSiteDto } from "./dto";

@Injectable()
export class SiteService {
  constructor(
    private readonly database: DatabaseService,
    private readonly imagesService: ImagesService
  ) {}

  private async findSiteById(id: number) {
    const site = await this.database.site.findUnique({
      where: { site_id: id },
    });

    if (!site) {
      throw new NotFoundException(`Site with id ${id} not found`);
    }

    return site;
  }

  async createSite(createSiteDto: CreateSiteDto, file: Express.Multer.File) {
    const imageUrl = await this.imagesService.uploadFile(file);

    return await this.database.site.create({
      data: {
        ...createSiteDto,
        image_url: imageUrl.url,
      },
    });
  }

  async getAllSites() {
    return await this.database.site.findMany();
  }

  async getSiteById(id: number) {
    return await this.findSiteById(id);
  }

  async getSiteMenus(id: number) {
    const site = await this.findSiteById(id);

    return await this.database.menu.findMany({
      where: {
        space: {
          site_id: id,
        },
      },
    });
  }

  async getSiteEmployees(id: number) {
    const site = await this.findSiteById(id);

    return await this.database.user.findMany({
      where: {
        sites: {
          some: {
            site_id: id,
          },
        },
      },
    });
  }

  async updateSite(
    id: number,
    updateSiteDto: UpdateSiteDto,
    updateFile: Express.Multer.File
  ) {
    const site = await this.findSiteById(id);

    let imageUrl = site.image_url;

    if (updateFile) {
      const uploadedImage = await this.imagesService.uploadFile(updateFile);
      imageUrl = uploadedImage.url;
    }

    const updateData = {
      image_url: imageUrl,
      ...updateSiteDto,
    };

    return await this.database.site.update({
      where: { site_id: id },
      data: updateData,
    });
  }

  async deleteSite(id: number) {
    const site = await this.findSiteById(id);

    await this.database.site.delete({
      where: { site_id: id },
    });

    return {
      message: `Site with id ${id} deleted successfully`,
    };
  }

  async getSiteSpaces(id: number) {
    const site = await this.findSiteById(id);

    return await this.database.space.findMany({
      where: { site_id: id },
    });
  }

  async createSiteSpace(siteId: number, spaceData: CreateSpaceDto) {
    const site = await this.findSiteById(siteId);

    const { name } = spaceData;

    return await this.database.space.create({
      data: {
        name,
        site: {
          connect: {
            site_id: siteId,
          },
        },
      },
    });
  }
}
