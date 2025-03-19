import { YoutubeTranscript } from 'youtube-transcript';
import { extractVideoId, validateVideoId } from '@/app/utils/api';
import { NextResponse } from 'next/server';
import { TranscriptResponse, YouTubeTranscriptSegment } from '@/app/types';

type RawTranscriptSegment = {
  text: string;
  start: number;
  duration: number;
};

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const videoUrl = data.url;

    // URLからビデオIDを抽出
    const videoId = extractVideoId(videoUrl);
    if (!validateVideoId(videoId)) {
      return NextResponse.json(
        { error: '無効なYouTube URLです' },
        { status: 400 }
      );
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

    const response: TranscriptResponse = {
      videoId: videoId as string,
      transcript
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('[Transcript Error]:', error);

    // エラーレスポンス
    return NextResponse.json(
      { 
        error: error.message || '字幕の取得に失敗しました' 
      },
      { status: 500 }
    );
  }
}
