import db from '@/app/db';
import { articles } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import type { NewArticle, Article } from '@/app/lib/types';

/**
 * 記事を作成する
 */
export const createArticle = async (data: NewArticle): Promise<Article> => {
  try {
    const [article] = await db
      .insert(articles)
      .values(data)
      .returning();
    
    return article;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * 記事一覧を取得する
 */
export const getArticles = async (userId: string): Promise<Article[]> => {
  try {
    return await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId))
      .orderBy(articles.createdAt);
  } catch (error) {
    console.error('Error getting articles:', error);
    throw error;
  }
};

/**
 * 記事を取得する
 */
export const getArticle = async (id: string): Promise<Article | null> => {
  try {
    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);
    
    return article || null;
  } catch (error) {
    console.error('Error getting article:', error);
    throw error;
  }
};

/**
 * 記事を更新する
 */
export const updateArticle = async (
  id: string,
  data: Partial<Omit<Article, 'id' | 'createdAt'>>
): Promise<Article> => {
  try {
    const [article] = await db
      .update(articles)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();
    
    return article;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * 記事を削除する
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await db
      .delete(articles)
      .where(eq(articles.id, id));
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};
