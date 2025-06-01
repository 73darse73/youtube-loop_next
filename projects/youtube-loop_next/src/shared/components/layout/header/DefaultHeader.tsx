'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // 現在のセッションを取得
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('セッション取得エラー:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        router.push('/auth')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/auth')
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  if (isLoading) {
    return (
      <header className="bg-red-700 text-white shadow-lg">
        <nav className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              YOUTUBE-LOOP
            </Link>
            <div className="animate-pulse bg-white/10 h-10 w-32 rounded-md"></div>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <header className="bg-red-700 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight">
            YOUTUBE-LOOP
          </Link>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium bg-white/10 px-4 py-2 rounded-md">
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="bg-white text-red-700 px-5 py-2 rounded-md hover:bg-red-50 transition-colors"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="bg-white text-red-700 px-5 py-2 rounded-md hover:bg-red-50 transition-colors"
            >
              ログイン
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
} 