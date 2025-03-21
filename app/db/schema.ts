import { jsonb, pgSchema, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
// スキーマ名を定義
export const mySchema = pgSchema('youtube_blog_ai');


// ユーザーテーブル
export const users = mySchema.table('users', {
  id: uuid().primaryKey().defaultRandom(),
  email: text().notNull().unique(),
  fullName: text(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// 記事テーブル
export const articles = mySchema.table('articles', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text().notNull(),
  videoId: text().notNull(),
  transcriptId: uuid().notNull().references(() => transcripts.id),
  title: text().notNull(),
  content: text().notNull(),
  language: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow(),
});

// 字幕テーブル
export const transcripts = mySchema.table('transcripts', {
  id: uuid().primaryKey().defaultRandom(),
  userId: text().notNull(),
  videoId: text().notNull(),
  transcript: jsonb().notNull(), // PostgreSQLの場合
  language: text().notNull(),
  createdAt: timestamp().defaultNow(),
});
