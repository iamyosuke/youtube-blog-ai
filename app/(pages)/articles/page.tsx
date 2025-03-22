import { auth } from '@clerk/nextjs/server';
import { getArticles } from '@/app/(server)/(services)/articles';
import Link from 'next/link';
import { ArticleCard } from './components/article-card';

export default async function ArticlesPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div>ログインが必要です</div>;
  }

  const articles = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="block hover:opacity-80 transition-opacity"
          >
            <ArticleCard article={article} />
          </Link>
        ))}
        {articles.length === 0 && (
          <div className="text-center text-gray-600">
            記事がまだありません
          </div>
        )}
      </div>
    </div>
  );
}
