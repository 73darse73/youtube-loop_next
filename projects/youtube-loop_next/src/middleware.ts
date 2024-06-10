import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 認証が必要なルートへのアクセスをチェック
  if (request.nextUrl.pathname.startsWith('/api/video')) {
    // 簡易的な認証チェック（実際のプロジェクトでは適切な認証を実装）
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 以下のパスに対してミドルウェアを適用:
     * - APIルート
     * - 静的ファイルを除く
     */
    '/api/:path*',
  ],
} 