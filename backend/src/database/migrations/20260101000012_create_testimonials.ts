import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('testimonials', (t) => {
    t.increments('id').primary();
    t.string('name', 255).notNullable();
    t.string('role').nullable();
    t.text('content_en').notNullable();
    t.text('content_fr').notNullable();
    t.text('content_ar').notNullable();
    t.integer('rating').notNullable().defaultTo(5);
    t.string('avatar_url', 500).nullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('testimonials');
}
