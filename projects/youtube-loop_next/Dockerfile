FROM node:18-alpine

WORKDIR /app

# パッケージファイルをコピー
COPY package.json package-lock.json* ./

# 依存関係をインストール
RUN npm ci

# アプリケーションのソースコードをコピー
COPY . .

# 開発サーバーのポートを開放
EXPOSE 3001

# 開発サーバーを起動
CMD ["npm", "run", "dev"] 