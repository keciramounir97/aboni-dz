import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactStatusDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() dto: CreateContactDto) {
    return ok(await this.contactsService.create(dto), 'Message sent');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('contacts')
  async list() {
    return ok(await this.contactsService.list());
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('contacts')
  async status(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateContactStatusDto) {
    return ok(await this.contactsService.updateStatus(id, dto), 'Status updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('contacts')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.contactsService.remove(id), 'Deleted');
  }
}
