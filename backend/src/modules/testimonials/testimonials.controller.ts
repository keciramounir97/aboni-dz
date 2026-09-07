import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/permissions.decorator';
import { ok } from '../../common/response';

@Controller('testimonials')
export class TestimonialsController {
  constructor(private readonly testimonialsService: TestimonialsService) {}

  @Get()
  async listPublic() {
    return ok(await this.testimonialsService.listPublic());
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async listAdmin() {
    return ok(await this.testimonialsService.listAdmin());
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async create(@Body() body: any) {
    return ok(await this.testimonialsService.create(body), 'Testimonial created');
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return ok(await this.testimonialsService.update(id, body), 'Testimonial updated');
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.testimonialsService.remove(id), 'Testimonial deleted');
  }
}
