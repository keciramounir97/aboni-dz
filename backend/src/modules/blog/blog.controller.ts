import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/permissions.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ok } from '../../common/response';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  async listPublic() {
    return ok(await this.blogService.listPublic());
  }

  @Get('slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return ok(await this.blogService.bySlug(slug));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async listAdmin() {
    return ok(await this.blogService.listAdmin());
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async create(@CurrentUser() user: { id: number }, @Body() body: any) {
    return ok(await this.blogService.create(body, user.id), 'Post created');
  }

  @Patch('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return ok(await this.blogService.update(id, body), 'Post updated');
  }

  @Delete('admin/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return ok(await this.blogService.remove(id), 'Post deleted');
  }
}
