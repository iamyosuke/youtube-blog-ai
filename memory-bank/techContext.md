# 技術コンテキスト

## 技術スタック
### フロントエンド
- **Next.js** - Reactフレームワーク
  - App Router
  - Server Components
  - Client Components
  - API Routes

### バックエンド
- **Next.js API Routes** - サーバーレス関数
- **Node.js** - ランタイム環境

### データベース
- **PostgreSQL** - メインデータベース
- **Drizzle ORM** - TypeSafe なデータベースツールキット
  - スキーマ定義
  - マイグレーション管理
  - クエリビルダー

### 認証
- **Clerk**
  - ユーザー認証
  - セッション管理
  - 権限制御

### 外部API・ライブラリ
- **youtube-transcript** - 字幕取得ライブラリ
- **OpenAI API (GPT-4)** - AI文章生成

### デプロイ
- **Vercel** - サーバーレスプラットフォーム

## 開発要件
### 環境設定
- Node.js >= 18.x
- TypeScript
- ESLint
- Prettier

### 必要な環境変数
- `OPENAI_API_KEY` - OpenAI APIキー
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk公開キー
- `CLERK_SECRET_KEY` - Clerkシークレットキー
- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトURL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabaseサービスロールキー

## 技術的制約
1. **パフォーマンス要件**
   - ページロード時間 < 3秒
   - API応答時間 < 5秒
   - 字幕取得タイムアウト = 30秒

2. **スケーラビリティ**
   - Vercelのサーバーレス環境に最適化
   - Supabaseの接続プール管理
   - APIレート制限の実装

3. **セキュリティ**
   - HTTPS通信のみ
   - CORSポリシーの適切な設定
   - API認証の必須化
   - 入力値の厳格なバリデーション

4. **依存関係**
   - 最新のセキュリティパッチの適用
   - 依存パッケージの定期的な更新
   - 脆弱性スキャンの実施
