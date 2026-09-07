import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  async listPublic() {
    return ok(await this.settingsService.listPublic());
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async listAdmin() {
    return ok(await this.settingsService.listAdmin());
  }

  @Patch('admin/bulk')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async bulkUpdate(@Body() body: { items: { key: string; value: string }[] }) {
    return ok(await this.settingsService.bulkUpdate(body.items), 'Settings updated');
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async upsert(@Body() body: { key: string; value: string; category?: string; is_public?: boolean }) {
    return ok(await this.settingsService.upsert(body.key, body.value, body.category, body.is_public), 'Setting saved');
  }

  @Delete('admin/:key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('super_admin')
  async remove(@Param('key') key: string) {
    return ok(await this.settingsService.remove(key), 'Setting deleted');
  }
}
