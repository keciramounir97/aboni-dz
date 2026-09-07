import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('faqs', (t) => {
    t.increments('id').primary();
    t.string('question_en', 500).notNullable();
    t.string('question_fr', 500).notNullable();
    t.string('question_ar', 500).notNullable();
    t.text('answer_en').notNullable();
    t.text('answer_fr').notNullable();
    t.text('answer_ar').notNullable();
    t.string('category', 100).notNullable().defaultTo('general');
    t.integer('sort_order').notNullable().defaultTo(0);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('faqs');
}
