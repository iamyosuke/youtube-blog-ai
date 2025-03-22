import { SliderCardsContainer } from './components/slider-cards-container';
import { URLInput } from './components/url-input';
import { getArticles } from './(server)/(services)/articles';

export default async function Home() {
  const articles = await getArticles();
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* ヘッダーセクション */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          YouTube字幕ブログジェネレーター
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          YouTubeの動画から自動で魅力的なブログ記事を生成。AIの力で、コンテンツの可能性を広げましょう。
        </p>
        
        {/* URL入力フォーム */}
        <div className="max-w-xl mx-auto">
          <URLInput />
        </div>
      </section>

      {/* スライダーカードセクション */}
      <SliderCardsContainer articles={articles} />
    </main>
  );
}
