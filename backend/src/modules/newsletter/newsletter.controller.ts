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
import { NewsletterService } from './newsletter.service';
import { SubscribeDto, UpdateNewsletterDto } from './dto/newsletter.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles, RequirePermissions } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body() dto: SubscribeDto) {
    return ok(await this.newsletterService.subscribe(dto), 'Subscribed');
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('newsletter')
  async list() {
    return ok(await this.newsletterService.list());
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('newsletter')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateNewsletterDto) {
    return ok(await this.newsletterService.update(id, dto), 'Updated');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @RequirePermissions('newsletter')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.newsletterService.remove(id), 'Deleted');
  }
}
