import { Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { ActivityLog } from './activity-log.model';
import { Inject } from '@nestjs/common';
import { KNEX } from '../../database/knex';

@Injectable()
export class ActivityLogService {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  async log(
    userId: number | null,
    userName: string | null,
    action: string,
    entity?: string | null,
    entityId?: number | null,
    metadata?: Record<string, unknown> | null,
    ipAddress?: string | null,
  ) {
    try {
      await ActivityLog.query().insert({
        user_id: userId,
        user_name: userName,
        action,
        entity: entity || null,
        entity_id: entityId || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
        ip_address: ipAddress || null,
      });
    } catch {
      // Logging is best-effort; never block the main operation
    }
  }

  async list(filters: { action?: string; entity?: string; user_id?: number; limit?: number } = {}) {
    let query = ActivityLog.query().orderBy('created_at', 'desc');
    if (filters.action) query = query.where('action', filters.action);
    if (filters.entity) query = query.where('entity', filters.entity);
    if (filters.user_id) query = query.where('user_id', filters.user_id);
    if (filters.limit) query = query.limit(filters.limit);
    return query;
  }

  async listForUser(userId: number) {
    return ActivityLog.query().where('user_id', userId).orderBy('created_at', 'desc');
  }

  async countByAction() {
    const rows = await ActivityLog.query()
      .select('action')
      .count('id as count')
      .groupBy('action')
      .orderBy('count', 'desc') as any;
    return rows;
  }
}
