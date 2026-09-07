import { BaseModel } from '../../database/base.model';

export class ActivityLog extends BaseModel {
  static tableName = 'activity_logs';

  id!: number;
  user_id!: number | null;
  user_name!: string | null;
  action!: string;
  entity!: string | null;
  entity_id!: number | null;
  metadata!: string | null;
  ip_address!: string | null;
  created_at!: string;
  updated_at!: string;
}
