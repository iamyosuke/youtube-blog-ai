# アクティブコンテキスト

## 現在のフェーズ
- アーキテクチャ再構築フェーズ
- Server Components優先アプローチへの移行
- サーバーサイドロジックの整理

## 最近の変更
- アーキテクチャの方針更新
  - Server Components優先の採用
  - サーバーサイドロジックの構造化
  - APIルートの最小限化
- ディレクトリ構造の整理
  - (server)フォルダーの導入
  - ルートごとのコンポーネント分離

## 進行中のタスク
1. **アーキテクチャ再構築**
   - [ ] Server Componentsへの移行
   - [ ] サーバーサイドロジックの整理
   - [ ] コンポーネント構造の見直し

2. **サーバーサイド実装**
   - [ ] サービスレイヤーの実装
     ```
     app/(server)/services/
     ├── articles.ts
     ├── youtube.ts
     └── openai.ts
     ```
   - [ ] Server Actionsの実装
     ```
     app/(server)/actions/
     ├── articles.ts
     └── generate.ts
     ```

3. **データアクセス最適化**
   - [ ] Drizzle ORMの型活用
   - [ ] クエリの効率化
   - [ ] エラーハンドリングの実装

## 優先度の高い実装項目
1. **コアロジック**
   - [ ] サービスレイヤーの基盤実装
   - [ ] Server Actionsの基盤実装
   - [ ] エラーハンドリング基盤の実装

2. **UI実装**
   - [ ] Server Components実装
   - [ ] 必要最小限のClient Components特定
   - [ ] フォーム処理のServer Actions化

3. **データ層**
   - [ ] Drizzleスキーマの最適化
   - [ ] 型定義の活用
   - [ ] マイグレーション管理

## 現在の課題
1. **技術的課題**
   - Server Componentsでのデータフェッチ最適化
   - Server Actionsのエラーハンドリング
   - 型安全性の確保

2. **構造的課題**
   - ロジックの適切な分離
   - コンポーネントの適切な配置
   - 型定義の管理

## 次のステップ
1. サーバーサイドロジックの実装
   ```
   app/(server)/
   ├── services/
   │   ├── articles.ts
   │   ├── youtube.ts
   │   └── openai.ts
   └── actions/
       ├── articles.ts
       └── generate.ts
   ```
2. コンポーネントの再構築
   - ルートごとのコンポーネントフォルダー作成
   - Server/Client分離の明確化
3. 型システムの整備
   - Drizzle生成の型の活用
   - 共通型定義の整理

## アクティブな決定事項
1. **アーキテクチャ**
   - Server Components優先
   - サーバーサイドロジックの集中管理
   - APIルートの最小限使用

2. **実装方針**
   - ロジックはサービスレイヤーに集中
   - フォーム処理はServer Actions
   - 型はDrizzle ORMから生成
   - シンプルな実装を維持

3. **コード構成**
   - ルートごとのコンポーネント分離
   - サーバーロジックの明確な構造化
   - 最小限のClient Components

## 留意点
- Server Componentsでのデータフェッチを優先
- Client Componentsは必要な場合のみ使用
- サービスレイヤーでのロジック集中
- 型安全性の確保
