import { Module, Global, OnModuleInit, Inject } from '@nestjs/common';
import { Model } from 'objection';
import { Knex } from 'knex';
import { createKnex, KNEX } from './knex';

@Global()
@Module({
  providers: [
    {
      provide: KNEX,
      useFactory: () => createKnex(),
    },
  ],
  exports: [KNEX],
})
export class DatabaseModule implements OnModuleInit {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  onModuleInit() {
    Model.knex(this.knex);
  }
}
