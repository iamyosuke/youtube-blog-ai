'use server'

import { auth } from '@clerk/nextjs/server'
import { YoutubeTranscript } from 'youtube-transcript'
import { createTranscript } from '../(services)/transcripts'
import { generateAndSaveArticle } from '../(services)/articles'
import { YouTubeTranscriptSegment } from '@/lib/types'
import { revalidatePath } from 'next/cache'
// URLからビデオIDを抽出する関数
function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      return urlObj.searchParams.get('v');
    }
    return null;
  } catch {
    return null;
  }
}

// ビデオIDを検証する関数
function validateVideoId(videoId: string | null): boolean {
  return Boolean(videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId));
}

export async function getYouTubeTranscriptAction(formData: FormData) {
  const userId = await auth();
  if (!userId) {
    return {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: '認証が必要です'
      }
    };
  }

  try {
    const url = formData.get('url') as string;
    const videoId = extractVideoId(url);

    if (!validateVideoId(videoId)) {
      return {
        success: false,
        error: {
          code: 'INVALID_URL',
          message: '無効なYouTube URLです'
        }
      };
    }

    // 字幕を取得
    const rawTranscript = await YoutubeTranscript.fetchTranscript(videoId as string);
    const transcript = rawTranscript.map(segment => ({
      text: segment.text,
      start: segment.offset,
      duration: segment.duration,
      language: segment.lang
    }));

    console.log(transcript[0].language);

    // 字幕を保存
    await createTranscript({
      userId: userId.userId as string,
      videoId: videoId as string,
      transcript: JSON.stringify(transcript),
      language: transcript[0].language as string, 
    });

    // 記事を生成して保存
    const article = await generateAndSaveArticle(
      userId.userId as string,
      videoId as string,
      transcript[0].language as string
    );

    revalidatePath('/');
    
    // 記事の生成に成功した場合は記事ページにリダイレクト
    return {
      success: true,
      data: {
        videoId,
        transcript,
        redirect: `/articles/${article.id}`
      }
    };


  } catch (error: any) {
    console.error('[Transcript Error]:', error);
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '字幕の取得に失敗しました'
      }
    };
  }
}
