import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Newsletter } from './newsletter.model';
import { SubscribeDto, UpdateNewsletterDto } from './dto/newsletter.dto';

@Injectable()
export class NewsletterService {
  async subscribe(dto: SubscribeDto) {
    const email = dto.email.toLowerCase().trim();
    const existing = await Newsletter.query().where('email', email).first();
    if (existing) {
      if (!existing.is_active) {
        return Newsletter.query().patchAndFetchById(existing.id, { is_active: true });
      }
      throw new BadRequestException({ success: false, message: 'Already subscribed' });
    }
    return Newsletter.query().insertAndFetch({ email, is_active: true });
  }

  async list() {
    return Newsletter.query().orderBy('created_at', 'desc');
  }

  async update(id: number, dto: UpdateNewsletterDto) {
    const row = await Newsletter.query().findById(id);
    if (!row) throw new NotFoundException({ success: false, message: 'Subscriber not found' });
    return Newsletter.query().patchAndFetchById(id, dto);
  }

  async remove(id: number) {
    const row = await Newsletter.query().findById(id);
    if (!row) throw new NotFoundException({ success: false, message: 'Subscriber not found' });
    await Newsletter.query().deleteById(id);
    return { deleted: true };
  }
}
