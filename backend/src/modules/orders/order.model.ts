import { BaseModel } from '../../database/base.model';
import { Product } from '../products/product.model';
import { User } from '../users/user.model';

export type OrderStatus =
  | 'pending'
  | 'awaiting_payment'
  | 'payment_submitted'
  | 'approved'
  | 'rejected'
  | 'delivered'
  | 'cancelled';

export type DeliveryAccount = {
  username?: string;
  email?: string;
  password?: string;
  extra?: string;
};

export class Order extends BaseModel {
  static tableName = 'orders';
  static jsonAttributes = ['delivery_account'];

  id!: number;
  order_number!: string;
  user_id!: number;
  product_id!: number;
  quantity!: number;
  unit_price!: number;
  total_price!: number;
  status!: OrderStatus;
  payment_proof_url!: string | null;
  delivery_account!: DeliveryAccount | null;
  admin_note!: string | null;
  reviewed_by!: number | null;
  reviewed_at!: string | null;
  created_at!: string;
  updated_at!: string;

  product?: Product;
  user?: User;

  static get relationMappings() {
    return {
      product: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Product,
        join: { from: 'orders.product_id', to: 'products.id' },
      },
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: User,
        join: { from: 'orders.user_id', to: 'users.id' },
      },
    };
  }
}
