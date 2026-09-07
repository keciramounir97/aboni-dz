import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('orders', (t) => {
    t.increments('id').primary();
    t.string('order_number', 64).notNullable().unique();
    t.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('RESTRICT');
    t.integer('quantity').notNullable().defaultTo(1);
    t.decimal('unit_price', 12, 2).notNullable();
    t.decimal('total_price', 12, 2).notNullable();
    t.enum('status', [
      'pending',
      'awaiting_payment',
      'payment_submitted',
      'approved',
      'rejected',
      'delivered',
      'cancelled',
    ]).notNullable().defaultTo('pending');
    t.string('payment_proof_url', 500).nullable();
    t.json('delivery_account').nullable();
    t.text('admin_note').nullable();
    t.integer('reviewed_by').unsigned().nullable().references('id').inTable('users').onDelete('SET NULL');
    t.timestamp('reviewed_at').nullable();
    t.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('orders');
}
