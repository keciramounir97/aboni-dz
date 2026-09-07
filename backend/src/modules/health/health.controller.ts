import { Controller, Get, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { KNEX } from '../../database/knex';
import { ok } from '../../common/response';

@Controller('health')
export class HealthController {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  @Get()
  async check() {
    await this.knex.raw('SELECT 1');
    return ok({ status: 'ok', service: 'aboni-api', time: new Date().toISOString() });
  }
}
