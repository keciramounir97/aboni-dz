import knex, { Knex } from 'knex';
import { Model } from 'objection';
import * as path from 'path';

export function createKnex(): Knex {
  const instance = knex({
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'aboni',
    },
    pool: { min: 0, max: 10 },
  });
  Model.knex(instance);
  return instance;
}

export async function runMigrations(): Promise<void> {
  const instance = createKnex();
  try {
    await instance.migrate.latest({
      directory: path.join(__dirname, 'migrations'),
      extension: process.env.NODE_ENV === 'production' ? 'js' : 'ts',
      loadExtensions: ['.js', '.ts'],
    });
  } finally {
    // Keep the same knex for the app via DatabaseModule; only disconnect if this was a one-off
  }
}

export const KNEX = Symbol('KNEX');
