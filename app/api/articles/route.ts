import { NextResponse } from 'next/server';
import { ApiResponse, Article } from '@/app/types';
import db from '@/app/db';
import { articles } from '@/app/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
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
    const { videoId, title, content, language } = await request.json();

    // バリデーション
    if (!videoId || !title || !content || !language) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: '必要なパラメータが不足しています'
        }
      }, { status: 400 });
    }

    // 記事を保存
    const article = await db.insert(articles).values({
      userId,
      videoId,
      title,
      content,
      language
    }).returning();

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
        message: error.message || '記事の保存に失敗しました'
      }
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
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
    // ユーザーの記事一覧を取得
    const userArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId));

    return NextResponse.json({
      success: true,
      data: userArticles
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
