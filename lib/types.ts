import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { users, articles, transcripts } from '../app/db/schema';

// Users table types
export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// Articles table types
export type Article = InferSelectModel<typeof articles>;
export type NewArticle = InferInsertModel<typeof articles>;

// Transcripts table types
export type Transcript = InferSelectModel<typeof transcripts>;
export type NewTranscript = InferInsertModel<typeof transcripts>;

// YouTube API Response types
interface TranscriptRun {
  text: string;
  bold: boolean;
  italics: boolean;
  strikethrough: boolean;
  deemphasize: boolean;
}

interface TranscriptSnippet {
  runs: TranscriptRun[];
  text: string;
}

interface TranscriptTimeText {
  text: string;
}

export interface RawTranscriptSegment {
  type: string;
  start_ms: string;
  end_ms: string;
  snippet: TranscriptSnippet;
  start_time_text: TranscriptTimeText;
  target_id: string;
}

interface TranscriptBody {
  initial_segments: RawTranscriptSegment[];
}

interface TranscriptContent {
  type: string;
  body: TranscriptBody;
}

interface SubMenuItem {
  title: string;
  selected: boolean;
  continuation?: string;
  endpoint?: {
    type: string;
    payload: Record<string, unknown>;
    metadata: Record<string, unknown>;
  };
  subtitle?: string | null;
}

interface LanguageMenu {
  type: string;
  sub_menu_items: SubMenuItem[];
}



export interface RawTranscript {
  transcript: {
    type: string;
    content: TranscriptContent;
    target_id: string;
  };
}

// YouTube Transcript types
export type YouTubeTranscriptSegment = {
  text: string;
  start: number;
  duration: number;
  language: string;
};

export interface TranscriptWithLanguage {
  segments: YouTubeTranscriptSegment[];
  language: string;
}
