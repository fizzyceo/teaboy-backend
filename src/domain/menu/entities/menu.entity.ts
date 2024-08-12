import { MenuItem } from "src/domain/menu-item/entities/menu-item.entity";

export class Menu {
  menu_id: number;
  name?: string;
  space_id: number;
  menu_items: MenuItem[];
  created_at: Date;
  updated_at: Date;
}
