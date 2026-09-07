import { Injectable, NotFoundException } from '@nestjs/common';
import { Testimonial } from './testimonial.model';

@Injectable()
export class TestimonialsService {
  async listPublic() {
    return Testimonial.query().where('is_active', true).orderBy('created_at', 'desc');
  }

  async listAdmin() {
    return Testimonial.query().orderBy('created_at', 'desc');
  }

  async create(body: any) {
    return Testimonial.query().insertAndFetch({
      ...body,
      is_active: body.is_active ?? true,
      rating: body.rating ?? 5,
    });
  }

  async update(id: number, body: any) {
    await Testimonial.query().findById(id);
    return Testimonial.query().patchAndFetchById(id, body);
  }

  async remove(id: number) {
    await Testimonial.query().findById(id);
    await Testimonial.query().deleteById(id);
    return { deleted: true };
  }
}
