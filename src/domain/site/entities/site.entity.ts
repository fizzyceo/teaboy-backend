export class Site {
  site_id: number;
  name: string;
  description?: string;
  phone?: string;
  image_url?: string;
  location?: string;
  address?: string;

  employees: any[];
  spaces: any[];

  created_at: Date;
  updated_at: Date;
}
