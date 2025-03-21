/**
 * YouTubeサービス
 * YouTube関連の機能を提供するサービスクラス
 */
export class YouTubeService {
  /**
   * 動画IDからサムネイルURLを生成
   * @param videoId - YouTubeの動画ID
   * @returns サムネイルのURL（HQ品質）
   */
  static getThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
}
