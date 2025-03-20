import { revalidatePath } from 'next/cache';
import { createArticle, deleteArticle, getArticle, getArticles, updateArticle } from './(services)/articles';
import { createTranscript, deleteTranscript, getTranscript, getTranscripts } from './(services)/transcripts';
import type { Article, NewArticle, Transcript } from '../lib/types';

/**
 * 記事作成アクション
 */
export async function createArticleAction(data: NewArticle) {
  try {
    const article = await createArticle(data);
    revalidatePath('/articles');
    return { success: true, data: article };
  } catch (error) {
    console.error('Error in createArticleAction:', error);
    return {
      success: false,
      error: {
        code: 'CREATE_ARTICLE_ERROR',
        message: '記事の作成に失敗しました'
      }
    };
  }
}

/**
 * 記事一覧取得アクション
 */
export async function getArticlesAction(userId: string) {
  try {
    const articles = await getArticles(userId);
    return { success: true, data: articles };
  } catch (error) {
    console.error('Error in getArticlesAction:', error);
    return {
      success: false,
      error: {
        code: 'GET_ARTICLES_ERROR',
        message: '記事一覧の取得に失敗しました'
      }
    };
  }
}

/**
 * 記事取得アクション
 */
export async function getArticleAction(id: string) {
  try {
    const article = await getArticle(id);
    if (!article) {
      return {
        success: false,
        error: {
          code: 'ARTICLE_NOT_FOUND',
          message: '記事が見つかりません'
        }
      };
    }
    return { success: true, data: article };
  } catch (error) {
    console.error('Error in getArticleAction:', error);
    return {
      success: false,
      error: {
        code: 'GET_ARTICLE_ERROR',
        message: '記事の取得に失敗しました'
      }
    };
  }
}

/**
 * 記事更新アクション
 */
export async function updateArticleAction(id: string, data: Partial<Omit<Article, 'id' | 'createdAt'>>) {
  try {
    const article = await updateArticle(id, data);
    revalidatePath(`/articles/${id}`);
    return { success: true, data: article };
  } catch (error) {
    console.error('Error in updateArticleAction:', error);
    return {
      success: false,
      error: {
        code: 'UPDATE_ARTICLE_ERROR',
        message: '記事の更新に失敗しました'
      }
    };
  }
}

/**
 * 記事削除アクション
 */
export async function deleteArticleAction(id: string) {
  try {
    await deleteArticle(id);
    revalidatePath('/articles');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteArticleAction:', error);
    return {
      success: false,
      error: {
        code: 'DELETE_ARTICLE_ERROR',
        message: '記事の削除に失敗しました'
      }
    };
  }
}

/**
 * 字幕作成アクション
 */
export async function createTranscriptAction(data: Omit<Transcript, 'id' | 'createdAt'>) {
  try {
    const transcript = await createTranscript(data);
    revalidatePath('/transcripts');
    return { success: true, data: transcript };
  } catch (error) {
    console.error('Error in createTranscriptAction:', error);
    return {
      success: false,
      error: {
        code: 'CREATE_TRANSCRIPT_ERROR',
        message: '字幕データの作成に失敗しました'
      }
    };
  }
}

/**
 * 字幕取得アクション
 */
export async function getTranscriptAction(videoId: string, userId: string) {
  try {
    const transcript = await getTranscript(videoId, userId);
    if (!transcript) {
      return {
        success: false,
        error: {
          code: 'TRANSCRIPT_NOT_FOUND',
          message: '字幕データが見つかりません'
        }
      };
    }
    return { success: true, data: transcript };
  } catch (error) {
    console.error('Error in getTranscriptAction:', error);
    return {
      success: false,
      error: {
        code: 'GET_TRANSCRIPT_ERROR',
        message: '字幕データの取得に失敗しました'
      }
    };
  }
}

/**
 * 字幕一覧取得アクション
 */
export async function getTranscriptsAction(userId: string) {
  try {
    const transcripts = await getTranscripts(userId);
    return { success: true, data: transcripts };
  } catch (error) {
    console.error('Error in getTranscriptsAction:', error);
    return {
      success: false,
      error: {
        code: 'GET_TRANSCRIPTS_ERROR',
        message: '字幕データ一覧の取得に失敗しました'
      }
    };
  }
}

/**
 * 字幕削除アクション
 */
export async function deleteTranscriptAction(id: string) {
  try {
    await deleteTranscript(id);
    revalidatePath('/transcripts');
    return { success: true };
  } catch (error) {
    console.error('Error in deleteTranscriptAction:', error);
    return {
      success: false,
      error: {
        code: 'DELETE_TRANSCRIPT_ERROR',
        message: '字幕データの削除に失敗しました'
      }
    };
  }
}
