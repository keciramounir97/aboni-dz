import { BaseModel } from '../../database/base.model';

export class PasswordReset extends BaseModel {
  static tableName = 'password_resets';

  id!: number;
  email!: string;
  token!: string;
  expires_at!: string;
  used!: boolean;
  created_at!: string;
}
