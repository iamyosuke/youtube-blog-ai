import { auth } from '@clerk/nextjs/server';
import { getArticle } from '@/app/(server)/(services)/articles';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import { YouTubeService } from '@/app/(server)/services/youtube';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ 
  params
}: {
  params: Params;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    return {
      title: '記事が見つかりません',
    };
  }

  return {
    title: article.title,
    description: `${article.title}の記事ページです。`,
  };
}

export default async function ArticlePage({
  params
}: {
  params: Params;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  
  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          {/* サムネイル */}
          <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
            <Image
              src={YouTubeService.getThumbnailUrl(article.videoId)}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* タイトル */}
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            {article.title}
          </h1>
          
          {/* メタ情報 */}
          <div className="flex items-center text-sm text-gray-600">
            <time dateTime={article.createdAt?.toISOString()}>
              {article.createdAt 
                ? new Date(article.createdAt).toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '不明'
              }
            </time>
          </div>
        </header>

        本文
        <div 
          className="prose article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </article>
  );
}
