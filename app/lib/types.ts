import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users, articles, transcripts } from '../db/schema';

// Users table types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Articles table types
export type Article = InferSelectModel<typeof articles>;
export type NewArticle = InferInsertModel<typeof articles>;

// Transcripts table types
export type Transcript = InferSelectModel<typeof transcripts>;
export type NewTranscript = InferInsertModel<typeof transcripts>;

// API Response types

 // Start of Selection
export type YouTubeTranscriptSegment = {
  text: string; // テキスト
  start: number; // 開始時間
  duration: number; // 持続時間
  language: string; // 言語
};

