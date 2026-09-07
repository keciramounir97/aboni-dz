import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('settings', (t) => {
    t.increments('id').primary();
    t.string('key', 100).notNullable().unique();
    t.text('value').nullable();
    t.string('category', 100).notNullable().defaultTo('general');
    t.boolean('is_public').notNullable().defaultTo(false);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('settings');
}
