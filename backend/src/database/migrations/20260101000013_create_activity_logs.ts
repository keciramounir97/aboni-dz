import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('activity_logs', (t) => {
    t.increments('id').primary();
    t.integer('user_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    t.string('user_name', 255).nullable();
    t.string('action', 100).notNullable();
    t.string('entity', 100).nullable();
    t.integer('entity_id').nullable();
    t.text('metadata').nullable();
    t.string('ip_address', 45).nullable();
    t.timestamps(true, true);
  });
  await knex.schema.alterTable('activity_logs', (t) => {
    t.index(['user_id']);
    t.index(['action']);
    t.index(['created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('activity_logs');
}
