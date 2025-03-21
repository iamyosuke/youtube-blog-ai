# 技術コンテキスト

## 技術スタック
### アプリケーション構造
- **Next.js** - Reactフレームワーク
  - App Router
  - Server Components（優先使用）
  - Client Components（必要最小限）
  - Server Actions（フォーム処理）

### バックエンド構造
- **Server Components** - データフェッチ
- **Server Actions** - サーバーサイド処理
- **サービスレイヤー** - ビジネスロジック

### データ層
- **Supabase** (PostgreSQL)
  - データベースホスティング
  - Row Level Security
  - ストレージ
- **Drizzle ORM**
  - 型安全なクエリ構築
  - スキーマファーストアプローチ
  - 自動生成された型定義の活用

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

## プロジェクト構成
```
app/
├── (server)/           # サーバーサイドロジック
│   ├── services/       # ドメインロジック
│   └── actions/        # Server Actions
├── articles/           # 記事関連ページ
│   ├── components/     # 記事専用コンポーネント
│   └── [id]/          # 記事詳細ページ
├── components/         # 共通コンポーネント
└── lib/               # ユーティリティ
```

## 開発要件
### 基本要件
- Node.js >= 18.x
- TypeScript（Strict Mode）
- ESLint + Prettier
- pnpm（パッケージマネージャー）

### 環境変数設定
- `OPENAI_API_KEY` - OpenAI APIキー
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk公開キー
- `CLERK_SECRET_KEY` - Clerkシークレットキー
- `NEXT_PUBLIC_SUPABASE_URL` - SupabaseプロジェクトURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase匿名キー
- `SUPABASE_SERVICE_ROLE_KEY` - Supabaseサービスロールキー

## 技術的要件と制約
1. **パフォーマンス**
   - Server Componentsによる最適化
   - 必要最小限のClient Components
   - 適切なキャッシング戦略
   - 応答時間目標:
     - ページロード < 3秒
     - Server Action < 5秒

2. **スケーラビリティ**
   - Server Componentのストリーミング
   - Server Actionsの最適化
   - Supabaseコネクションプール管理

3. **セキュリティ**
   - Server Componentsでの安全なデータフェッチ
   - Server Actionsでのバリデーション
   - Row Level Securityの適切な設定
   - 環境変数の厳格な管理

4. **コード品質**
   - Server/Client分離の明確化
   - サービスレイヤーでのロジック集中
   - Drizzle ORMの型活用
   - ユニットテストの実装
