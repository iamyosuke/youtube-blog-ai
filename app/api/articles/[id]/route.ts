import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getArticle, updateArticle, deleteArticle } from '@/app/(server)/(services)/articles';

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
    const article = await getArticle(params.id);

    if (!article || article.userId !== userId) {
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
      data: article
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
    const exists = await getArticle(params.id);
    if (!exists || exists.userId !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '記事が見つかりません'
        }
      }, { status: 404 });
    }

    // 記事を更新
    const updated = await updateArticle(params.id, {
      ...(title ? { title } : {}),
      ...(content ? { content } : {}),
      ...(language ? { language } : {})
    });

    return NextResponse.json({
      success: true,
      data: updated
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
    // 記事の存在確認
    const exists = await getArticle(params.id);
    if (!exists || exists.userId !== userId) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: '記事が見つかりません'
        }
      }, { status: 404 });
    }

    // 記事を削除
    await deleteArticle(params.id);

    return NextResponse.json({
      success: true
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
