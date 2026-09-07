import { BaseModel } from '../../database/base.model';

export type ProductCategory =
  | 'spotify'
  | 'netflix'
  | 'playstation'
  | 'xbox'
  | 'snapchat'
  | 'disney'
  | 'youtube'
  | 'other';

export class Product extends BaseModel {
  static tableName = 'products';

  id!: number;
  slug!: string;
  name_en!: string;
  name_fr!: string;
  name_ar!: string;
  description_en!: string | null;
  description_fr!: string | null;
  description_ar!: string | null;
  logo_url!: string | null;
  category!: ProductCategory;
  price!: number;
  currency!: string;
  duration_days!: number;
  is_active!: boolean;
  stock!: number;
  created_at!: string;
  updated_at!: string;
}
