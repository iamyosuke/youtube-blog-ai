import { auth } from '@clerk/nextjs/server';
import { getArticle } from '../../(server)/(services)/articles';
import { notFound } from 'next/navigation';

export default async function ArticlePage({
  params
}: {
  params: { id: string }
}) {
  const { userId } = await auth();
  if (!userId) {
    return <div>ログインが必要です</div>;
  }

  const article = await getArticle(params.id);
  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="text-gray-600 mb-2">
            作成日: {article.createdAt ? new Date(article.createdAt).toLocaleDateString('ja-JP') : '不明'}
          </div>
        </div>
        
        {/* HTML形式のコンテンツを安全に表示 */}
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </div>
    </div>
  );
}
