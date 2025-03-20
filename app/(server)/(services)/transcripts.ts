'server only'
import db from '@/app/db';
import { transcripts } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';
import type { NewTranscript, Transcript } from '@/app/lib/types';

/**
 * 字幕データを作成する
 */
export const createTranscript = async (data: NewTranscript): Promise<Transcript> => {
  try {
    const [transcript] = await db
      .insert(transcripts)
      .values(data)
      .returning();
    
    return transcript;
  } catch (error) {
    console.error('Error creating transcript:', error);
    throw error;
  }
};
