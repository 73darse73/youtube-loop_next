# Youtube Loop

## 概要
YouTubeの動画を指定した範囲でループ再生できるWebアプリ。

## 使用技術
### フロントエンド
- Next.js
- React
- TypeScript

### バックエンド
- PostgreSQL（予定）

### インフラ
- Docker（予定）

### 機能
- 動的ルーティング
- APIルート
- ページ間遷移
- 非同期データフェッチ

## セットアップ方法

1. リポジトリをクローンする
```bash
git clone https://github.com/73darse73/youtube-loop_next.git
```

2. カレントディレクトリを移す
```bash
cd youtube-loop_next
```

3. 依存パッケージをインストールする
```bash
npm install
```

4. 開発サーバーを起動する
```bash
npm run dev
```

5. ブラウザでアプリを確認する
```
http://localhost:3000
```

## プロジェクト構成
```
next_page/
├── pages/
│   ├── api/
│   │   └── time.ts
│   ├── book/
│   │   └── [id].tsx
│   ├── _app.tsx
│   └── index.tsx
├── public/
└── package.json
```