import { BaseModel } from '../../database/base.model';

export class Faq extends BaseModel {
  static tableName = 'faqs';

  id!: number;
  question_en!: string;
  question_fr!: string;
  question_ar!: string;
  answer_en!: string;
  answer_fr!: string;
  answer_ar!: string;
  category!: string;
  sort_order!: number;
  is_active!: boolean;
  created_at!: string;
  updated_at!: string;
}
