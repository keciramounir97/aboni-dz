import { BaseModel } from '../../database/base.model';

export class BlogPost extends BaseModel {
  static tableName = 'blog_posts';

  id!: number;
  slug!: string;
  title_en!: string;
  title_fr!: string;
  title_ar!: string;
  excerpt_en!: string | null;
  excerpt_fr!: string | null;
  excerpt_ar!: string | null;
  content_en!: string | null;
  content_fr!: string | null;
  content_ar!: string | null;
  image_url!: string | null;
  tag!: string | null;
  is_published!: boolean;
  author_id!: number | null;
  published_at!: string | null;
  created_at!: string;
  updated_at!: string;
}
