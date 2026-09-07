import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('products', (t) => {
    t.increments('id').primary();
    t.string('slug', 255).notNullable().unique();
    t.string('name_en', 255).notNullable();
    t.string('name_fr', 255).notNullable();
    t.string('name_ar', 255).notNullable();
    t.text('description_en').nullable();
    t.text('description_fr').nullable();
    t.text('description_ar').nullable();
    t.string('logo_url', 500).nullable();
    t.enum('category', [
      'spotify',
      'netflix',
      'playstation',
      'xbox',
      'snapchat',
      'disney',
      'youtube',
      'other',
    ]).notNullable();
    t.decimal('price', 12, 2).notNullable();
    t.string('currency', 10).notNullable().defaultTo('DZD');
    t.integer('duration_days').notNullable();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.integer('stock').notNullable().defaultTo(999);
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('products');
}
