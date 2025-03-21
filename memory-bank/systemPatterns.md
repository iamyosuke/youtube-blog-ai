# システムパターン設計

## アーキテクチャ概要
```mermaid
graph TD
    Client[Server Components] --> |1. Server Action呼び出し| Action[Server Actions]
    Action --> |2. サービス呼び出し| Service[サービスレイヤー]
    Service --> |3. 外部API呼び出し| External[外部API]
    Service --> |4. データ永続化| DB[Supabase]
    Client --> |5. 認証| Auth[Clerk認証]
```

## システムレイヤー
### 1. プレゼンテーション層
- Server Componentsを優先使用
- Client Componentsは必要最小限（例：インタラクティブなUI要素のみ）
- ルートごとに分離されたコンポーネント構造
  - 例：articles/components/
  - 例：dashboard/components/

### 2. サーバーサイド構造
- サーバーロジックの集中管理
  ```
  app/
  ├── (server)/
  │   ├── services/     # ドメインロジック・DB操作
  │   │   ├── articles.ts
  │   │   ├── youtube.ts
  │   │   └── openai.ts
  │   └── actions/      # Server Actions
  │       ├── articles.ts
  │       └── generate.ts
  ```
- Server Actionsによるフォーム処理
- APIルートの最小限使用

### 3. ドメインロジック（サービスレイヤー）
- モデルごとに分離されたサービス
  ```typescript
  // app/(server)/services/articles.ts
  export class ArticleService {
    // Drizzle ORMの型を活用
    async createArticle(data: InsertArticle) {
      return db.insert(articles).values(data);
    }
  }
  ```
- ビジネスロジックの集中管理
- 外部APIとの通信処理

### 4. インフラストラクチャ層
- Vercelでのサーバーレス構成
- Supabaseによるデータ永続化
  - Drizzle ORMによる型安全なクエリ
  - スキーマファーストアプローチ
- Clerkによる認証基盤

## データフロー
```mermaid
sequenceDiagram
    participant User as ユーザー
    participant SC as Server Component
    participant SA as Server Action
    participant SV as Service
    participant Ex as 外部API
    participant DB as Database

    User->>SC: フォーム送信
    SC->>SA: Server Action呼び出し
    SA->>SV: サービスメソッド呼び出し
    SV->>Ex: API要求
    Ex-->>SV: レスポンス
    SV->>DB: データ永続化
    DB-->>SV: 保存確認
    SV-->>SA: 処理結果
    SA-->>SC: レスポンス
    SC-->>User: UI更新
```

## 実装パターン
### 1. Page Component型定義パターン
```typescript
// ベース型定義
type BasePageProps = {
  params: { [key: string]: string }
  searchParams?: { [key: string]: string | string[] | undefined }
}

// 静的ページの例
// app/articles/page.tsx
export default async function ArticlesPage({
  searchParams
}: BasePageProps) {
  const articles = await db.query.articles.findMany();
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

// 動的ルートページの例
// app/articles/[id]/page.tsx
export default async function ArticlePage({
  params
}: BasePageProps) {
  const article = await db.query.articles.findFirst({
    where: { id: params.id }
  });
  return <ArticleDetail article={article} />;
}
```

### 2. Server Actionパターン
```typescript
// app/(server)/actions/articles.ts
'use server'

import { db } from '@/db'
import { articles } from '@/db/schema'
import { Article, InsertArticle } from '@/db/types'

export async function createArticle(data: FormData): Promise<Article> {
  const articleData: InsertArticle = {
    title: data.get('title') as string,
    content: data.get('content') as string,
  };

  const articleService = new ArticleService();
  return articleService.create(articleData);
}
```

### 3. サービスレイヤーパターン
```typescript
// app/(server)/services/articles.ts
import { db } from '@/db'
import { articles } from '@/db/schema'
import { Article, InsertArticle } from '@/db/types'

export class ArticleService {
  async create(data: InsertArticle): Promise<Article> {
    return db.insert(articles).values(data).returning();
  }

  async generateFromYoutube(url: string): Promise<Article> {
    const transcript = await this.youtubeService.getTranscript(url);
    const content = await this.openaiService.generateArticle(transcript);
    return this.create({ title: transcript.title, content });
  }
}
```

## エラー処理
```typescript
// app/(server)/services/base.ts
export class BaseService {
  protected handleError(error: unknown) {
    // エラーログ記録
    console.error(error);
    
    // 構造化されたエラーレスポンス
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : '不明なエラーが発生しました',
      }
    };
  }
}
```

## キャッシング戦略
1. **React Server Components**
   - デフォルトのキャッシング動作を活用
   - Route Segment Config でのカスタマイズ

2. **Server Actions**
   - クライアントキャッシュの活用
   - 楽観的更新の実装
