'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SaveVideoButtonProps {
  videoId: string;
  startTime: number;
  endTime: number;
  className?: string;
}

export function SaveVideoButton({ videoId, startTime, endTime, className }: SaveVideoButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // セッションを確認
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth')
        return
      }

      const response = await fetch('/api/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoId,
          startTime,
          endTime,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 401) {
          router.push('/auth')
          return
        }
        throw new Error(data.error || '保存に失敗しました')
      }

      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2000)
    } catch (err) {
      console.error('保存に失敗しました:', err)
      setError('動画の保存に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="text-center">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      <button
      onClick={handleSave}
        disabled={isLoading || isSaved}
        className={`${
          isSaved
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-red-600 hover:bg-red-700'
        } text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
            保存中...
          </div>
        ) : isSaved ? (
          '保存完了！'
        ) : (
          '動画を保存'
        )}
      </button>
    </div>
  )
} 