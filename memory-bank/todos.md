# プロジェクトTODO

## 1. ルーティング最適化
### サブドメイン・パス構造の実装
- [ ] カテゴリ別のルーティング設計
  ```typescript
  // 例: tech.yourdomain.com/ja/programming
  // 例: cooking.yourdomain.com/en/recipe
  ```
- [ ] 言語パスの実装（/ja/, /en/など）
- [ ] middleware.tsの更新
  - [ ] サブドメインのルーティングロジック
  - [ ] 言語パスのハンドリング
- [ ] next.config.tsの更新
  - [ ] ドメイン設定
  - [ ] i18n設定

## 2. カテゴリ管理機能
### データベーススキーマ
- [ ] カテゴリテーブルの作成
  ```sql
  CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] 記事-カテゴリ関連テーブルの作成
  ```sql
  CREATE TABLE article_categories (
    article_id UUID REFERENCES articles(id),
    category_id UUID REFERENCES categories(id),
    PRIMARY KEY (article_id, category_id)
  );
  ```

### UI/UX実装
- [ ] カテゴリ管理画面の作成
  - [ ] カテゴリ一覧表示
  - [ ] カテゴリ作成/編集フォーム
  - [ ] カテゴリ階層構造の表示

## 3. チャンネル情報管理
### データベース更新
- [ ] チャンネルテーブルの作成
  ```sql
  CREATE TABLE channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    youtube_channel_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    subscriber_count INTEGER,
    video_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```
- [ ] 記事-チャンネル関連の追加
  - [ ] articlesテーブルにchannel_id列を追加

### 機能実装
- [ ] チャンネル情報取得サービス
  - [ ] YouTube Data APIを使用したチャンネル情報取得
  - [ ] 定期的な情報更新バッチ処理

## 4. YouTube字幕取得の改善
### ライブラリ移行
- [ ] 新しい字幕取得ライブラリの調査
  - [ ] youtube-transcript-api
  - [ ] youtube-caption-scraper
  - [ ] その他の代替ライブラリ
- [ ] 選定したライブラリの実装
  - [ ] エラーハンドリングの強化
  - [ ] 再試行メカニズムの実装
  - [ ] キャッシュ層の追加

## 5. バッチ処理システム
### 記事一括生成システム
- [ ] バッチ処理フレームワークの選定
  - [ ] Bull
  - [ ] Celery
  - [ ] その他の選択肢
- [ ] ジョブキューの実装
  ```typescript
  interface BatchJob {
    channelId: string;
    videoCount: number;
    targetLanguages: string[];
    categoryId?: string;
  }
  ```
- [ ] バッチ処理モニタリング
  - [ ] 進捗状況の追跡
  - [ ] エラーログの収集
  - [ ] 通知システムの実装

### 定期実行タスク
- [ ] チャンネル情報更新
- [ ] 記事生成状態の監視
- [ ] エラー再試行
- [ ] パフォーマンスメトリクスの収集

## 優先順位
1. YouTube字幕取得の改善
   - 現在の不安定な状況を改善する必要がある
2. チャンネル情報管理
   - コンテンツの整理と管理のため
3. カテゴリ管理機能
   - コンテンツの構造化のため
4. ルーティング最適化
   - SEOとユーザビリティの向上
5. バッチ処理システム
   - スケーラビリティの確保

## 技術的考慮事項
- TypeScriptの型安全性の維持
- Server Componentsの効果的な活用
- エラーハンドリングの一貫性
- パフォーマンスの最適化
- スケーラビリティの確保
