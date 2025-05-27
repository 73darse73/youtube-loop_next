import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const error_description = requestUrl.searchParams.get('error_description')

  // エラーパラメータがある場合は、それを表示
  if (error || error_description) {
    console.error('認証エラー:', { error, error_description })
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(error_description || error || '認証に失敗しました')}`, requestUrl.origin)
    )
  }

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('セッション交換エラー:', exchangeError)
        throw exchangeError
      }

      // セッションが正しく設定されたか確認
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) {
        console.error('セッション取得エラー:', sessionError)
        throw sessionError
      }
      
      if (!session) {
        throw new Error('セッションの作成に失敗しました')
      }

      // 認証完了後、ホームページにリダイレクト
      return NextResponse.redirect(new URL('/', requestUrl.origin))
    } catch (error) {
      console.error('認証処理エラー:', error)
      return NextResponse.redirect(
        new URL(`/auth?error=${encodeURIComponent(error instanceof Error ? error.message : '認証に失敗しました')}`, requestUrl.origin)
      )
    }
  }

  // codeパラメータがない場合
  return NextResponse.redirect(
    new URL('/auth?error=認証コードが見つかりません', requestUrl.origin)
  )
} 