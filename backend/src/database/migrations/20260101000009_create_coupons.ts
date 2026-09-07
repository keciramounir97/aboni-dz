import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('coupons', (t) => {
    t.increments('id').primary();
    t.string('code', 50).notNullable().unique();
    t.string('description').nullable();
    t.decimal('discount_percent', 5, 2).notNullable().defaultTo(0);
    t.integer('max_uses').notNullable().defaultTo(0);
    t.integer('used_count').notNullable().defaultTo(0);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.dateTime('expires_at').nullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('coupons');
}
