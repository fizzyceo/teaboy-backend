import { Injectable, NotFoundException } from "@nestjs/common";

import { DatabaseService } from "src/database/database.service";
import { ImagesService } from "src/images/images.service";

import { CreateSiteDto, CreateSpaceDto, UpdateSiteDto } from "./dto";
import { formatSiteResponse } from "src/utils/formatting-ar";

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

  async createSite(
    createSiteDto: CreateSiteDto,
    file: Express.Multer.File,
    user_id: number
  ) {
    const imageUrl = await this.imagesService.uploadFile(file);

    return await this.database.site.create({
      data: {
        ...createSiteDto,
        // owner_id:user_id,
        image_url: imageUrl.url,
      },
    });
  }

  async getAllSites(lang: string) {
    const sites = await this.database.site.findMany();

    return sites.map((site) => {
      return formatSiteResponse(site, lang);
    });
  }

  async updateSpaces() {
    const updatedSpaces = await this.database.space.updateMany({
      where: {
        default_lang: {
          not: "EN", // or null if you want to update only those that are null
        },
      },
      data: {
        default_lang: "EN",
      },
    });
  }

  async getSiteById(id: number, lang: string) {
    const site = await this.findSiteById(id);

    this.updateSpaces();

    return formatSiteResponse(site, lang);
  }

  async getSiteMenus(id: number, lang: string) {
    // const site = await this.findSiteById(id);

    const menus = await this.database.menu.findMany({
      where: {
        sites: {
          some: {
            site_id: id,
          },
        },
      },
    });
    return menus.map((menu) => {
      return formatSiteResponse(menu, lang);
    });

    // return menus;
  }

  async getSiteEmployees(id: number) {
    const site = await this.findSiteById(id);

    // the site have spaces and each space have employees

    return await this.database.user.findMany({
      where: {
        spaces: {
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

  async getSiteSpaces(id: number, lang: string) {
    // const site = await this.findSiteById(id);

    const spaces = await this.database.space.findMany({
      where: { site_id: id },
      select: {
        space_id: true,
        type: true,
        default_lang: true,
        name: true,
        name_ar: true,
        theme: true,
      },
    });
    spaces.map((space) => ({
      space_id: space.space_id,
      name: lang?.toUpperCase() === "AR" ? space.name_ar : space.name,
      default_lang: space.default_lang,
      name_ar: space.name_ar,
      theme: space.theme,
    }));

    return spaces;
  }

  async createSiteSpace(siteId: number, spaceData: CreateSpaceDto) {
    const site = await this.findSiteById(siteId);

    const { name, theme, type, name_ar, default_lang } = spaceData;

    return await this.database.space.create({
      data: {
        theme: theme,
        name,
        type: type,
        default_lang: default_lang,
        name_ar: name_ar,
        site: {
          connect: {
            site_id: siteId,
          },
        },
      },
    });
  }
}
