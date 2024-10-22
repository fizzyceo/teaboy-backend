export class User {
  user_id: number;

  name: string;
  email: string;
  password: string;
  phone?: string;

  can_manage_account: boolean;
  can_manage_menu: boolean;
  can_place_order: boolean;

  sites: any[];

  created_at: Date;
  updated_at: Date;
}
