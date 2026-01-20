# YouTube Loop Player

YouTube動画を指定した区間でループ再生できるアプリケーション。特定の部分を何度も見たい場合に便利です。

## 技術スタック

- **フロントエンド**: Next.js (App Router), TypeScript, TailwindCSS
- **バックエンド**: Supabase (PostgreSQL), Prisma ORM
- **インフラ**: Docker, Vercel, GitHub Actions
- **認証**: Supabase Auth
- **パッケージマネージャー**: pnpm (高速で効率的なnpmの代替)

## 機能

- YouTube動画IDまたはURLから動画をロード
- 開始時間と終了時間を指定してループ再生
- ユーザー認証（予定）
- お気に入り動画の保存（予定）
- 再生履歴の記録（予定）

## 開発環境のセットアップ

### 前提条件

- Node.js (v18以上)
- pnpm (`npm install -g pnpm`でインストール可能)
- Docker & Docker Compose
- Supabaseアカウント

### Dockerを使った開発環境構築

```bash
# リポジトリをクローン
git clone <your-repo-url>
cd youtube-loop_next

# .envファイルを作成し、Supabase接続情報を設定
cp .env.example .env

# Dockerでアプリケーションを起動
docker-compose up
```

### ローカル開発（Docker無し）

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

## Prismaのセットアップ

```bash
# Prismaクライアントの生成
pnpm prisma generate

# データベースマイグレーション
pnpm prisma migrate dev
```

## デプロイ

### Vercelへのデプロイ

1. GitHubリポジトリをVercelに接続
2. 環境変数を設定
   - `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
   - その他必要な環境変数
3. デプロイを実行

### GitHub Actionsの設定

リポジトリには、以下を自動化するGitHub Actionsワークフローが含まれています：

- コードのリント
- TypeScriptの型チェック
- テスト実行（実装予定）
- Vercelへの自動デプロイ

## 貢献方法

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

## ライセンス

[MIT](LICENSE)
