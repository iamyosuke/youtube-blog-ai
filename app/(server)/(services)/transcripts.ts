import db from '@/app/db';
import { transcripts } from '@/app/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Transcript } from '@/app/types';

/**
 * 字幕データを作成する
 */
export const createTranscript = async (data: Omit<Transcript, 'id' | 'createdAt'>): Promise<Transcript> => {
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

/**
 * 字幕データを取得する
 */
export const getTranscript = async (videoId: string, userId: string): Promise<Transcript | null> => {
  try {
    const [transcript] = await db
      .select()
      .from(transcripts)
      .where(
        and(
          eq(transcripts.videoId, videoId),
          eq(transcripts.userId, userId)
        )
      )
      .limit(1);
    
    return transcript || null;
  } catch (error) {
    console.error('Error getting transcript:', error);
    throw error;
  }
};

/**
 * ユーザーの全字幕データを取得する
 */
export const getTranscripts = async (userId: string): Promise<Transcript[]> => {
  try {
    return await db
      .select()
      .from(transcripts)
      .where(eq(transcripts.userId, userId))
      .orderBy(transcripts.createdAt);
  } catch (error) {
    console.error('Error getting transcripts:', error);
    throw error;
  }
};

/**
 * 字幕データを削除する
 */
export const deleteTranscript = async (id: string): Promise<void> => {
  try {
    await db
      .delete(transcripts)
      .where(eq(transcripts.id, id));
  } catch (error) {
    console.error('Error deleting transcript:', error);
    throw error;
  }
};
