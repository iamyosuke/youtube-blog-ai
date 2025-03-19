import { URLInput } from './components/url-input'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        YouTube Blog AI
      </h1>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            URLを入力して始める
          </h2>
          <URLInput />
          <p className="mt-4 text-sm text-gray-500">
            YouTubeの動画URLを入力すると、AIが自動で記事を生成します
          </p>
        </div>
      </div>
    </div>
  )
}
