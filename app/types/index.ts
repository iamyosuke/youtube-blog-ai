import { InferModel } from 'drizzle-orm';
import { articles, transcripts, users } from '../db/schema';

export type User = InferModel<typeof users>;
export type Article = InferModel<typeof articles>;
export type NewArticle = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
export type Transcript = InferModel<typeof transcripts>;

export interface YouTubeTranscriptSegment {
  text: string;
  start: number;
  duration: number;
}

export type TranscriptResponse = {
  videoId: string;
  transcript: YouTubeTranscriptSegment[];
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
};
