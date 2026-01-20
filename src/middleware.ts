import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Supabase URLが設定されていない場合は認証チェックをスキップ
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('認証チェックをスキップ: Supabase URLが設定されていません');
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // セッションの更新
  const { data: { session } } = await supabase.auth.getSession()

  // 認証が必要なルートへのアクセスをチェック
  if (!session && request.nextUrl.pathname.startsWith('/api/video')) {
    return NextResponse.json(
      { error: '認証が必要です' },
      { status: 401 }
    )
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * 以下のパスに対してミドルウェアを適用:
     * - すべてのページ（静的ファイルを除く）
     * - /auth/callback を除外
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
} 