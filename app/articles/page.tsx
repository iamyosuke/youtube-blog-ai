import { auth } from '@clerk/nextjs/server';
import { getArticles } from '../(server)/(services)/articles';
import Link from 'next/link';

export default async function ArticlesPage() {
  const { userId } = await auth();
  if (!userId) {
    return <div>ログインが必要です</div>;
  }

  const articles = await getArticles(userId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">記事一覧</h1>
      <div className="grid gap-6">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
            <div className="text-gray-600">
              作成日: {article.createdAt ? new Date(article.createdAt).toLocaleDateString('ja-JP') : '不明'}
            </div>
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
