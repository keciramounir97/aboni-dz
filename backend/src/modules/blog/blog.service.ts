import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogPost } from './blog-post.model';
import { slugify } from './blog.helpers';

@Injectable()
export class BlogService {
  async listPublic() {
    return BlogPost.query().where('is_published', true).orderBy('published_at', 'desc').orderBy('created_at', 'desc');
  }

  async listAdmin() {
    return BlogPost.query().orderBy('created_at', 'desc');
  }

  async bySlug(slug: string) {
    const post = await BlogPost.query().where({ slug, is_published: true }).first();
    if (!post) throw new NotFoundException({ success: false, message: 'Post not found' });
    return post;
  }

  async create(body: any, authorId: number) {
    const slug = body.slug || slugify(body.title_en);
    return BlogPost.query().insertAndFetch({
      ...body,
      slug,
      author_id: authorId,
      is_published: body.is_published ?? true,
      published_at: body.is_published === false ? null : new Date().toISOString(),
    });
  }

  async update(id: number, body: any) {
    await BlogPost.query().findById(id);
    return BlogPost.query().patchAndFetchById(id, body);
  }

  async remove(id: number) {
    await BlogPost.query().findById(id);
    await BlogPost.query().deleteById(id);
    return { deleted: true };
  }
}
