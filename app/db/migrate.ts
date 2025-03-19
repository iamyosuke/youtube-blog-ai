import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import { setupDatabase } from './index';

// 環境変数のチェック
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// マイグレーションの実行
async function runMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  // マイグレーションの実行
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: 'drizzle' });
  console.log('Migrations completed');

  // スキーマのセットアップ
  console.log('Setting up schema...');
  await setupDatabase();
  console.log('Schema setup completed');

  // クリーンアップ
  await pool.end();
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
