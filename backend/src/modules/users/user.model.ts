import { BaseModel } from '../../database/base.model';

export type UserRole = 'user' | 'admin' | 'super_admin';

export type UserPermissions = {
  products?: boolean;
  orders?: boolean;
  users?: boolean;
  contacts?: boolean;
  newsletter?: boolean;
  analytics?: boolean;
};

export class User extends BaseModel {
  static tableName = 'users';
  static jsonAttributes = ['permissions'];

  id!: number;
  email!: string;
  password_hash!: string;
  name!: string;
  role!: UserRole;
  permissions!: UserPermissions | null;
  is_active!: boolean;
  created_at!: string;
  updated_at!: string;

  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password_hash;
    return json;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password_hash', 'name'],
      properties: {
        id: { type: 'integer' },
        email: { type: 'string' },
        password_hash: { type: 'string' },
        name: { type: 'string' },
        role: { type: 'string' },
        permissions: { type: ['object', 'null'] },
        is_active: { type: 'boolean' },
      },
    };
  }
}
