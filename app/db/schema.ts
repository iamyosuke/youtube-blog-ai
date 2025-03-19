import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// スキーマ名を定義
const schema = 'youtube_blog_ai';

// ユーザーテーブル
export const users = pgTable(`${schema}.users`, {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 記事テーブル
export const articles = pgTable(`${schema}.articles`, {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  videoId: text('video_id').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  language: text('language').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 字幕テーブル
export const transcripts = pgTable(`${schema}.transcripts`, {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  videoId: text('video_id').notNull(),
  transcript: text('transcript').notNull(),
  language: text('language').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// オートインクリメント用のトリガー関数とトリガーを作成
export const setupSchema = async (client: any) => {
  await client.execute(sql`
    CREATE SCHEMA IF NOT EXISTS ${sql.raw(schema)};
    
    CREATE OR REPLACE FUNCTION ${sql.raw(schema)}.update_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    DROP TRIGGER IF EXISTS update_articles_updated_at ON ${sql.raw(schema)}.articles;
    CREATE TRIGGER update_articles_updated_at
      BEFORE UPDATE ON ${sql.raw(schema)}.articles
      FOR EACH ROW
      EXECUTE FUNCTION ${sql.raw(schema)}.update_updated_at();
  `);
};
