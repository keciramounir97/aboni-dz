import { Injectable, NotFoundException } from '@nestjs/common';
import { Setting } from './setting.model';

@Injectable()
export class SettingsService {
  async listPublic() {
    const settings = await Setting.query().where('is_public', true);
    return settings.reduce((acc, s) => { acc[s.key] = s.value; return acc; }, {} as Record<string, string | null>);
  }

  async listAdmin() {
    return Setting.query().orderBy('category', 'asc').orderBy('key', 'asc');
  }

  async get(key: string) {
    const setting = await Setting.query().where('key', key).first();
    if (!setting) throw new NotFoundException({ success: false, message: 'Setting not found' });
    return setting;
  }

  async upsert(key: string, value: string, category = 'general', isPublic = false) {
    const existing = await Setting.query().where('key', key).first();
    if (existing) {
      return Setting.query().patchAndFetchById(existing.id, { value, category, is_public: isPublic });
    }
    return Setting.query().insertAndFetch({ key, value, category, is_public: isPublic });
  }

  async bulkUpdate(items: { key: string; value: string }[]) {
    for (const item of items) {
      await this.upsert(item.key, item.value);
    }
    return { updated: items.length };
  }

  async remove(key: string) {
    await Setting.query().where('key', key).delete();
    return { deleted: true };
  }
}
