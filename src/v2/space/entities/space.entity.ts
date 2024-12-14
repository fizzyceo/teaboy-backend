import { Call, Kitchen, Menu, Order, QRCode, Site, User } from "@prisma/client";

export class Space {
  space_id: number;
  name: string;
  name_ar?: string;
  type: string; // Assuming SPACE_TYPE is a string enum in Prisma
  site_id: number;
  kitchen_id?: number; // Changed to number for consistency with Prisma model
  created_at: Date;
  updated_at: Date;
  default_lang?: string;
  theme?: string;
  allowedOrderDistance?: number;

  // Relations
  calls?: Call[];
  orders?: Order[];
  kitchen?: Kitchen;
  site?: Site;
  menus?: Menu[];
  users?: User[];
  QRCode?: QRCode[];
}
