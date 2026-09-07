import { BaseModel } from '../../database/base.model';

export class Setting extends BaseModel {
  static tableName = 'settings';

  id!: number;
  key!: string;
  value!: string | null;
  category!: string;
  is_public!: boolean;
  created_at!: string;
  updated_at!: string;
}
