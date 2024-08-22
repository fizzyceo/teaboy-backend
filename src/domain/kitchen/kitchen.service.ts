import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateKitchenDto } from "./dto/create-kitchen.dto";
import { UpdateKitchenDto } from "./dto/update-kitchen.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class KitchenService {
  constructor(private readonly database: DatabaseService) {}

  async createKitchen(createKitchenDto: CreateKitchenDto) {
    const { openingHours, ...kitchenData } = createKitchenDto;

    const kitchen = await this.database.kitchen.create({
      data: {
        ...kitchenData,
        openingHours: {
          create: openingHours,
        },
      },
    });

    return kitchen;
  }

  async getAllKitchens() {
    return await this.database.kitchen.findMany();
  }

  async getKitchenById(id: number) {
    const kitchen = await this.database.kitchen.findUnique({
      where: { kitchen_id: id },
    });
    if (!kitchen) {
      throw new NotFoundException(`Kitchen with id ${id} not found`);
    }
    return kitchen;
  }

  async updateKitchen(id: number, updateKitchenDto: UpdateKitchenDto) {
    const kitchen = await this.getKitchenById(id);

    return await this.database.kitchen.update({
      where: { kitchen_id: id },
      data: updateKitchenDto,
    });
  }

  async removeKitchen(id: number) {
    const kitchen = await this.getKitchenById(id);

    return await this.database.kitchen.delete({
      where: { kitchen_id: id },
    });
  }
}
