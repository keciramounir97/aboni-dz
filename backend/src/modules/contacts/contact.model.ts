import { BaseModel } from '../../database/base.model';

export class Contact extends BaseModel {
  static tableName = 'contacts';

  id!: number;
  name!: string;
  email!: string;
  subject!: string;
  message!: string;
  status!: 'new' | 'read' | 'replied';
  created_at!: string;
}
