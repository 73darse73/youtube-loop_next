'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/shared/hooks/useAuth'
import Link from 'next/link'

interface DeletedVideo {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  deletedAt: string;
  title?: string;
}

export default function TrashPage() {
  const [deletedVideos, setDeletedVideos] = useState<DeletedVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // 認証チェック
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // 認証されていない場合は実行しない
    if (!user) return

    const fetchDeletedVideos = async () => {
      try {
        const response = await fetch('/api/video/trash')
        if (!response.ok) {
          throw new Error('削除された動画の取得に失敗しました')
        }
        const data = await response.json()
        setDeletedVideos(data)
      } catch (err) {
        setError('削除された動画の取得に失敗しました')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDeletedVideos()
  }, [user])

  const handleRestore = async (id: string) => {
    try {
      const response = await fetch(`/api/video/trash/${id}/restore`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('復元に失敗しました')
      }
      setDeletedVideos(deletedVideos.filter(video => video.id !== id))
      alert('動画を復元しました')
    } catch (err) {
      console.error('復元に失敗しました:', err)
      alert('復元に失敗しました')
    }
  }

  const handlePermanentDelete = async (id: string) => {
    if (!confirm('この動画を完全に削除しますか？この操作は取り消せません。')) {
      return
    }

    try {
      const response = await fetch(`/api/video/trash/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('完全削除に失敗しました')
      }
      setDeletedVideos(deletedVideos.filter(video => video.id !== id))
      alert('動画を完全に削除しました')
    } catch (err) {
      console.error('完全削除に失敗しました:', err)
      alert('完全削除に失敗しました')
    }
  }

  // ローディング中は何も表示しない
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
          </div>
        </div>
      </div>
    )
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="rounded-lg bg-red-50 p-4 mt-6">
            <div className="text-red-700">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ゴミ箱</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <Link 
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ホームに戻る
            </Link>
          </div>
        </div>

        {deletedVideos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">削除された動画はありません</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {deletedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg border shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="mb-3">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                      alt={`動画ID: ${video.videoId}`}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iOTAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                        動画ID
                      </span>
                      <span className="font-mono text-sm text-gray-900">
                        {video.videoId}
                      </span>
                    </div>
                    {video.title && (
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {video.title}
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">開始:</span>
                        <span>{video.startTime}秒</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">終了:</span>
                        <span>{video.endTime}秒</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      削除日時: {new Date(video.deletedAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleRestore(video.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      復元
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(video.id)}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      完全削除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 