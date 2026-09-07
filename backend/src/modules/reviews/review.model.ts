import { BaseModel } from '../../database/base.model';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';

export class Review extends BaseModel {
  static tableName = 'reviews';
  static relationMappings = {
    product: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: Product,
      join: { from: 'reviews.product_id', to: 'products.id' },
    },
    user: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: User,
      join: { from: 'reviews.user_id', to: 'users.id' },
    },
  };

  id!: number;
  user_id!: number;
  product_id!: number;
  rating!: number;
  comment!: string | null;
  is_approved!: boolean;
  created_at!: string;
  updated_at!: string;
  product?: Product;
  user?: User;
}
