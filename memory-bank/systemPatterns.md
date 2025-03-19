# システムパターン設計

## アーキテクチャ概要
```mermaid
graph TD
    Client[クライアント層] --> |1. YouTube URL送信| API[API層]
    API --> |2. 字幕取得| YT[YouTube API]
    API --> |3. テキスト生成| OpenAI[OpenAI API]
    API --> |4. データ永続化| DB[Supabase]
    Client --> |5. 認証| Auth[Clerk認証]
```

## システムレイヤー
### 1. プレゼンテーション層
- Next.jsによるServer ComponentsとClient Componentsの適切な使い分け
- レスポンシブデザインによるマルチデバイス対応
- プログレッシブエンハンスメントの採用

### 2. アプリケーション層
- サービスレイヤーによるビジネスロジックの分離（app/services）
- Server Actionsによるサーバーサイド処理の最適化
- APIルートによるRESTful APIの提供
- リクエスト・レスポンスの標準化
- エラーハンドリングの一元管理

### 3. ドメイン層
- 字幕処理ドメイン
  - 字幕取得
  - テキスト前処理
  - 言語判定
- 記事生成ドメイン
  - プロンプト管理
  - 記事構造化
  - 品質チェック

### 4. インフラストラクチャ層
- Vercelでのサーバーレスデプロイ
- Supabase + Drizzle ORMでのデータ永続化
- Clerkによる認証基盤

## データフロー
```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as フロントエンド
    participant API as APIルート
    participant YT as YouTube API
    participant AI as OpenAI API
    participant DB as Supabase

    User->>Frontend: URL入力
    Frontend->>API: リクエスト送信
    API->>YT: 字幕取得
    YT-->>API: 字幕データ
    API->>AI: 記事生成リクエスト
    AI-->>API: 生成記事
    API->>DB: 記事保存
    API-->>Frontend: レスポンス
    Frontend-->>User: 記事表示
```

## デザインパターン
### 1. Repository Pattern
- サービスレイヤーでのデータアクセス抽象化
  - articles.ts: 記事関連の操作
  - transcripts.ts: 字幕関連の操作
- Drizzle ORMによるタイプセーフなクエリ構築
- Supabaseリソースへの統一的なアクセス

### 2. Service Layer Pattern
- ビジネスロジックの分離
- データベース操作の一元管理
- Server ActionsとAPIルートでの再利用

### 3. Server Actions Pattern
- フォーム処理の最適化
- クライアントサイドキャッシュの活用
- 楽観的更新の実装

### 2. Factory Pattern
- 記事生成プロセスの抽象化
- プロンプトテンプレートの管理

### 3. Strategy Pattern
- 複数言語対応の字幕処理
- 異なる記事フォーマットの生成

### 4. Observer Pattern
- 処理状態の監視
- プログレス表示の実装

## エラーハンドリング戦略
1. **入力バリデーション**
   - URL形式チェック
   - 言語サポートチェック

2. **プロセスエラー**
   - 字幕取得失敗
   - AI生成エラー
   - DB操作エラー

3. **リカバリー手順**
   - 自動リトライ
   - グレースフルデグラデーション
   - ユーザーへのフィードバック

## キャッシング戦略
1. **アプリケーションキャッシュ**
   - 生成済み記事のキャッシュ
   - 字幕データのキャッシュ

2. **APIキャッシュ**
   - YouTube API応答のキャッシュ
   - OpenAI API応答のキャッシュ
