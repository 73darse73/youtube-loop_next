FROM node:18-alpine

# pnpmのインストール
RUN npm install -g pnpm

WORKDIR /app

# パッケージファイルのコピー
COPY package.json pnpm-lock.yaml* ./

# 依存関係のインストール
RUN pnpm install

# アプリケーションのソースをコピー
COPY . .

# ポート3001を解放
EXPOSE 3001

# 開発サーバーを起動
CMD ["pnpm", "dev"] 