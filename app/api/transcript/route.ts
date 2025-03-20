import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId, validateVideoId } from '@/app/lib/api';
import { NextResponse } from 'next/server';
import { createTranscript } from '@/app/(server)/(services)/transcripts';
import { auth } from '@clerk/nextjs/server';

type RawTranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

type YouTubeTranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

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
    const data = await request.json();
    const videoUrl = data.url;

    // URLからビデオIDを抽出
    const videoId = extractVideoId(videoUrl);
    if (!validateVideoId(videoId)) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_URL',
          message: '無効なYouTube URLです'
        }
      }, { status: 400 });
    }

    // 字幕を取得
    const rawTranscript = await YoutubeTranscript.fetchTranscript(videoId as string);
    const transcriptData = rawTranscript as unknown as RawTranscriptSegment[];
    
    const transcript: YouTubeTranscriptSegment[] = transcriptData.map(
      (segment: RawTranscriptSegment): YouTubeTranscriptSegment => ({
        text: segment.text,
        start: segment.start,
        duration: segment.duration
      })
    );

    // データベースに字幕を保存
    const transcriptText = transcript.map(segment => segment.text).join('\n');
    await createTranscript({
      userId,
      videoId: videoId as string,
      transcript: transcriptText,
      language: 'ja', // 現在は日本語のみサポート
    });

    const response = {
      videoId: videoId as string,
      transcript
    };

    return NextResponse.json({
      success: true,
      data: response
    });
  } catch (error: any) {
    console.error('[Transcript Error]:', error);

    // エラーレスポンス
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error.message || '字幕の取得に失敗しました'
      }
    }, { status: 500 });
  }
}
