import Image from "next/image";
import { YouTubeService } from "@/app/(server)/services/youtube";
import type { Article } from "@/app/lib/types";

interface ArticleCardProps {
  article: Article;
}

/**
 * 記事カードコンポーネント
 * 記事のサムネイルとタイトルを表示
 */
export function ArticleCard({ article }: ArticleCardProps) {
  const thumbnailUrl = YouTubeService.getThumbnailUrl(article.videoId);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
      <div className="relative aspect-video">
        <Image
          src={thumbnailUrl}
          alt={article.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {new Date(article.createdAt ?? new Date()).toLocaleDateString("ja-JP")}
        </p>
      </div>
    </div>
  );
}
