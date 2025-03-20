import { ApiResponse } from '../types';

export function handleApiError(error: unknown): ApiResponse<never> {
  console.error('[API Error]:', error);
  
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: error.message
      }
    };
  }

  return {
    success: false,
    error: {
      code: 'UNKNOWN_ERROR',
      message: '予期せぬエラーが発生しました'
    }
  };
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
}

export function extractVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // 通常のYouTube URL
    if (urlObj.hostname.includes('youtube.com')) {
      const searchParams = new URLSearchParams(urlObj.search);
      return searchParams.get('v');
    }
    
    // 短縮URL (youtu.be)
    if (urlObj.hostname === 'youtu.be') {
      return urlObj.pathname.slice(1);
    }
    
    return null;
  } catch {
    return null;
  }
}

export function validateVideoId(videoId: string | null): boolean {
  if (!videoId) return false;
  // YouTubeのビデオIDは通常11文字
  return /^[A-Za-z0-9_-]{11}$/.test(videoId);
}
