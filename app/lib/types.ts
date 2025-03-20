import { InferModel } from 'drizzle-orm';
import { users, articles, transcripts } from '../db/schema';

// Users table types
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;

// Articles table types
export type Article = InferModel<typeof articles>;
export type NewArticle = InferModel<typeof articles, 'insert'>;

// Transcripts table types
export type Transcript = InferModel<typeof transcripts>;
export type NewTranscript = InferModel<typeof transcripts, 'insert'>;

// API Response types

 // Start of Selection
export type YouTubeTranscriptSegment = {
  text: string; // テキスト
  start: number; // 開始時間
  duration: number; // 持続時間
  language: string; // 言語
};

