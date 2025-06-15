'use client'

import { useEffect, useState } from 'react'

interface Video {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  title?: string;
}

interface SavedVideoListProps {
  onPlay: (video: Video) => void;
  refreshTrigger?: number; // リフレッシュ用のトリガー
}

export function SavedVideoList({ onPlay, refreshTrigger = 0 }: SavedVideoListProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/video')
      if (!response.ok) {
        throw new Error('動画の取得に失敗しました')
      }
      const data = await response.json()
      console.log('取得した動画データ:', data)
      setVideos(data)
    } catch (err) {
      setError('動画の取得に失敗しました')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [refreshTrigger])

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/video/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('削除に失敗しました')
      }
      await fetchVideos()
    } catch (err) {
      console.error('削除に失敗しました:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 mt-6">
        <div className="text-red-700">{error}</div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">保存された動画はありません</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">保存した動画</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => {
          console.log('表示する動画:', video)
          return (
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
                  {new Date(video.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="mt-4 flex gap-2">
              <button
                  onClick={() => onPlay(video)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                再生
              </button>
              <button
                onClick={() => handleDelete(video.id)}
                  className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                削除
              </button>
            </div>
          </div>
        </div>
        )})}
    </div>
    </div>
  )
} 