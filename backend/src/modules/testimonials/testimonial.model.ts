import { BaseModel } from '../../database/base.model';

export class Testimonial extends BaseModel {
  static tableName = 'testimonials';

  id!: number;
  name!: string;
  role!: string | null;
  content_en!: string;
  content_fr!: string;
  content_ar!: string;
  rating!: number;
  avatar_url!: string | null;
  is_active!: boolean;
  created_at!: string;
  updated_at!: string;
}
