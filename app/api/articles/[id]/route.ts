import { NextResponse } from 'next/server';
import { ApiResponse } from '@/app/types';
import db from '@/app/db';
import { articles } from '@/app/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq, and } from 'drizzle-orm';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '認証が必要です'
      }
    }, { status: 401 });
  }

  try {
    const article = await db
      .select()
      .from(articles)
      .where(and(
        eq(articles.id, params.id),
        eq(articles.userId, userId)
      ))
      .limit(1);

    if (article.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '記事が見つかりません'
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: article[0]
    });
  } catch (error: any) {
    console.error('[Article Error]:', error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '記事の取得に失敗しました'
      }
    }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '認証が必要です'
      }
    }, { status: 401 });
  }

  try {
    const { title, content, language } = await request.json();

    // バリデーション
    if (!title && !content && !language) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '更新するフィールドが指定されていません'
        }
      }, { status: 400 });
    }

    // 記事の存在確認
    const exists = await db
      .select({ id: articles.id })
      .from(articles)
      .where(and(
        eq(articles.id, params.id),
        eq(articles.userId, userId)
      ))
      .limit(1);

    if (exists.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '記事が見つかりません'
        }
      }, { status: 404 });
    }

    // 更新するフィールドを準備
    const updateData: {
      title?: string;
      content?: string;
      language?: string;
    } = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (language) updateData.language = language;

    // 記事を更新
    const updated = await db
      .update(articles)
      .set(updateData)
      .where(and(
        eq(articles.id, params.id),
        eq(articles.userId, userId)
      ))
      .returning();

    return NextResponse.json({
      success: true,
      data: updated[0]
    });
  } catch (error: any) {
    console.error('[Article Error]:', error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '記事の更新に失敗しました'
      }
    }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '認証が必要です'
      }
    }, { status: 401 });
  }

  try {
    const deleted = await db
      .delete(articles)
      .where(and(
        eq(articles.id, params.id),
        eq(articles.userId, userId)
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '記事が見つかりません'
        }
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: deleted[0]
    });
  } catch (error: any) {
    console.error('[Article Error]:', error);

    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '記事の削除に失敗しました'
      }
    }, { status: 500 });
  }
}
