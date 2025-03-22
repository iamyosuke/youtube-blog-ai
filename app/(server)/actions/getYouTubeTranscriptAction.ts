'use server'

import { auth } from '@clerk/nextjs/server'
import { TranscriptResponse, YoutubeTranscript } from 'youtube-transcript'
import { createTranscript } from '../(services)/transcripts'
import { generateAndSaveArticle } from '../(services)/articles'
import { YouTubeTranscriptSegment, RawTranscriptSegment, RawTranscript, TranscriptWithLanguage } from '@/lib/types'
import { Innertube } from 'youtubei.js/web';
import { revalidatePath } from 'next/cache'
import { franc } from 'franc-min';

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

// 生の字幕データを整形する関数
function formatTranscript(rawTranscript: RawTranscript): TranscriptWithLanguage {
  const language = extractLanguageFromTitle(rawTranscript);
  const segments = rawTranscript.transcript.content.body.initial_segments
    .filter((segment: RawTranscriptSegment) => segment.type === 'TranscriptSegment')
    .map((segment: RawTranscriptSegment) => ({
      text: segment.snippet.text,
      start: parseInt(segment.start_ms) / 1000,
      duration: (parseInt(segment.end_ms) - parseInt(segment.start_ms)) / 1000,
      language
    }));

  return {
    segments,
    language
  };
}

// 字幕テキストから言語コードを抽出する関数
function extractLanguageFromTitle(rawTranscript: RawTranscript): string {
  try {
    const text = rawTranscript.transcript.content.body.initial_segments
      .slice(0, 3)
      .map((segment: RawTranscriptSegment) => segment.snippet.text)
      .join(' ');
    
    const langCode = franc(text, { minLength: 1 });
    console.log('Detected language code:', langCode);
    return 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
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

    const youtube = await Innertube.create({
      lang: 'en',
      location: 'US',
      retrieve_player: false,
      generate_session_locally: false,
      enable_safety_mode: false,
    });

    const info = await youtube.getInfo(videoId as string);
    const rawTranscript = await info.getTranscript() as unknown as RawTranscript;
    const transcriptWithLang = formatTranscript(rawTranscript);
    
    // 字幕を保存
    await createTranscript({
      userId: userId.userId as string,
      videoId: videoId as string,
      transcript: JSON.stringify(transcriptWithLang.segments),
      language: transcriptWithLang.language
    });

    // 記事を生成して保存
    const article = await generateAndSaveArticle(
      userId.userId as string,
      videoId as string,
      transcriptWithLang.language
    );

    revalidatePath('/');
    
    return {
      success: true,
      data: {
        videoId,
        transcript: transcriptWithLang,
        redirect: `/articles/${article.id}`
      }
    };

  } catch (error: unknown) {
    console.error('[Transcript Error]:', error);
    const errorMessage = error instanceof Error ? error.message : '字幕の取得に失敗しました';
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: errorMessage
      }
    };
  }
}
