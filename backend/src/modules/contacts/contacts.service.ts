import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from './contact.model';
import { CreateContactDto, UpdateContactStatusDto } from './dto/contact.dto';

@Injectable()
export class ContactsService {
  async create(dto: CreateContactDto) {
    return Contact.query().insertAndFetch({ ...dto, status: 'new' });
  }

  async list() {
    return Contact.query().orderBy('created_at', 'desc');
  }

  async updateStatus(id: number, dto: UpdateContactStatusDto) {
    const row = await Contact.query().findById(id);
    if (!row) throw new NotFoundException({ success: false, message: 'Contact not found' });
    return Contact.query().patchAndFetchById(id, { status: dto.status });
  }

  async remove(id: number) {
    const row = await Contact.query().findById(id);
    if (!row) throw new NotFoundException({ success: false, message: 'Contact not found' });
    await Contact.query().deleteById(id);
    return { deleted: true };
  }
}
