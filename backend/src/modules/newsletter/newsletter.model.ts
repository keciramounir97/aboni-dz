import { BaseModel } from '../../database/base.model';

export class Newsletter extends BaseModel {
  static tableName = 'newsletters';

  id!: number;
  email!: string;
  is_active!: boolean;
  created_at!: string;
}
