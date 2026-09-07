import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blog_posts', (t) => {
    t.increments('id').primary();
    t.string('slug', 255).notNullable().unique();
    t.string('title_en', 255).notNullable();
    t.string('title_fr', 255).notNullable();
    t.string('title_ar', 255).notNullable();
    t.text('excerpt_en').nullable();
    t.text('excerpt_fr').nullable();
    t.text('excerpt_ar').nullable();
    t.text('content_en').nullable();
    t.text('content_fr').nullable();
    t.text('content_ar').nullable();
    t.string('image_url', 500).nullable();
    t.string('tag', 100).nullable();
    t.boolean('is_published').notNullable().defaultTo(true);
    t.integer('author_id').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    t.dateTime('published_at').nullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('blog_posts');
}
