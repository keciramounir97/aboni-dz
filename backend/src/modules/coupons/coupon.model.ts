import { BaseModel } from '../../database/base.model';

export class Coupon extends BaseModel {
  static tableName = 'coupons';

  id!: number;
  code!: string;
  description!: string | null;
  discount_percent!: number;
  max_uses!: number;
  used_count!: number;
  is_active!: boolean;
  expires_at!: string | null;
  created_at!: string;
  updated_at!: string;
}
