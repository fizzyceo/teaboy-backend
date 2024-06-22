import { Injectable } from "@nestjs/common";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
import { DatabaseService } from "src/database/database.service";

@Injectable()
export class MenuItemService {
  constructor(private readonly database: DatabaseService) {}

  create(createMenuItemDto: CreateMenuItemDto) {
    return "This action adds a new menuItem";
  }

  findAll() {
    return `This action returns all menuItem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} menuItem`;
  }

  update(id: number, updateMenuItemDto: UpdateMenuItemDto) {
    return `This action updates a #${id} menuItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} menuItem`;
  }
}
