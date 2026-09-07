import { BaseModel } from '../../database/base.model';

export class Wishlist extends BaseModel {
  static tableName = 'wishlists';

  id!: number;
  user_id!: number;
  product_id!: number;
  created_at!: string;
  updated_at!: string;
}
