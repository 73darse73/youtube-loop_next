'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { YoutubePlayer } from '@/features/video/components/YoutubePlayer'
import { SaveVideoButton } from '@/features/video/components/SaveVideoButton'
import { SavedVideoList } from '@/features/video/components/SavedVideoList'
import { useAuth } from '@/shared/hooks/useAuth'
import Link from 'next/link'

interface SavedVideo {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  title?: string;
}

export default function Home() {
  const [videoUrl, setVideoUrl] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [appliedVideoId, setAppliedVideoId] = useState('')
  const [appliedStartTime, setAppliedStartTime] = useState(0)
  const [appliedEndTime, setAppliedEndTime] = useState(0)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // 認証チェック
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth')
    }
  }, [user, isLoading, router])

  // ローディング中は何も表示しない
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent"></div>
      </div>
    )
  }

  // 未認証の場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let id = ''
      if (videoUrl.includes('youtube.com/watch')) {
        // https://www.youtube.com/watch?v=VIDEO_ID 形式
        const url = new URL(videoUrl)
        id = url.searchParams.get('v') || ''
      } else if (videoUrl.includes('youtu.be/')) {
        // https://youtu.be/VIDEO_ID 形式
        const parts = videoUrl.split('youtu.be/')
        id = parts[1]?.split('?')[0] || ''
      } else if (videoUrl.includes('youtube.com/embed/')) {
        // https://www.youtube.com/embed/VIDEO_ID 形式
        const parts = videoUrl.split('embed/')
        id = parts[1]?.split('?')[0] || ''
      }

      if (!id) {
        alert('有効なYouTube URLを入力してください。')
        return
      }

      setAppliedVideoId(id)
      setAppliedStartTime(Number(startTime) || 0)
      setAppliedEndTime(Number(endTime) || 0)
    } catch (error) {
      alert('URLの解析中にエラーが発生しました。')
      console.error(error)
    }
  }

  const handleSavedVideoSelect = (video: SavedVideo) => {
    setAppliedVideoId(video.videoId)
    setAppliedStartTime(video.startTime)
    setAppliedEndTime(video.endTime)
    setStartTime(String(video.startTime))
    setEndTime(String(video.endTime))
    setVideoUrl(`https://youtube.com/watch?v=${video.videoId}`)
  }

  const handleSaveSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-center flex-1">
            YouTube Loop Player
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
            <Link 
              href="/trash"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              ゴミ箱
            </Link>
          </div>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL
                </label>
                <input
                  type="text"
                  id="videoUrl"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  placeholder="https://youtube.com/watch?v=..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                    開始時間 (秒)
                  </label>
                  <input
                    type="number"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                    終了時間 (秒)
                  </label>
                  <input
                    type="number"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                    placeholder="30"
                    min="0"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-red-700 text-white py-3 px-6 rounded-md hover:bg-red-800 transition-colors"
              >
                ループ再生を開始
              </button>
            </form>
          </div>

          {appliedVideoId && (
            <div className="mt-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <YoutubePlayer
                  videoId={appliedVideoId}
                  startTime={appliedStartTime}
                  endTime={appliedEndTime}
                  autoplay={true}
                />
                <div className="flex justify-center items-center gap-4 mt-6">
                  <SaveVideoButton
                    videoId={appliedVideoId}
                    startTime={appliedStartTime}
                    endTime={appliedEndTime}
                    className="flex items-center gap-2 bg-red-700 text-white px-6 py-2.5 rounded-md hover:bg-red-800 transition-colors"
                    onSaveSuccess={handleSaveSuccess}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          <SavedVideoList onPlay={handleSavedVideoSelect} refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  )
} 