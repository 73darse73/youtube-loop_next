'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// 簡易的なユーザー型定義
type User = {
  id: string;
  email: string;
  name: string;
}

export default function Header() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ローカルストレージからユーザー情報を取得
    const getLocalUser = () => {
      try {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('ユーザー情報取得エラー:', error)
      } finally {
        setIsLoading(false)
      }
    }

    getLocalUser()
  }, [])

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('user')
      setUser(null)
      router.push('/')
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