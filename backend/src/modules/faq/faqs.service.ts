import { Injectable, NotFoundException } from '@nestjs/common';
import { Faq } from './faq.model';

export class CreateFaqDtoBody {
  question_en!: string;
  question_fr!: string;
  question_ar!: string;
  answer_en!: string;
  answer_fr!: string;
  answer_ar!: string;
  category?: string;
  sort_order?: number;
  is_active?: boolean;
}

@Injectable()
export class FaqsService {
  async listPublic() {
    return Faq.query().where('is_active', true).orderBy('sort_order', 'asc').orderBy('created_at', 'desc');
  }

  async listAdmin() {
    return Faq.query().orderBy('sort_order', 'asc').orderBy('created_at', 'desc');
  }

  async create(body: any) {
    return Faq.query().insertAndFetch({
      ...body,
      category: body.category || 'general',
      sort_order: body.sort_order ?? 0,
      is_active: body.is_active ?? true,
    });
  }

  async update(id: number, body: any) {
    await Faq.query().findById(id);
    return Faq.query().patchAndFetchById(id, body);
  }

  async remove(id: number) {
    await Faq.query().findById(id);
    await Faq.query().deleteById(id);
    return { deleted: true };
  }
}
