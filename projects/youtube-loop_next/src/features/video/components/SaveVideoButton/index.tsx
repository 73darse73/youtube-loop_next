'use client'

import React, { useState } from 'react';
import { VideoCreateRequest } from '../../types';
import { videoApi, ApiError } from '../../api/client';

interface SaveVideoButtonProps {
  videoId: string;
  startTime: number;
  endTime: number;
  className?: string;
  onSaveSuccess?: () => void; // 保存成功時のコールバック
}

export function SaveVideoButton({ videoId, startTime, endTime, className, onSaveSuccess }: SaveVideoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');

  const handleSaveClick = () => {
    setShowModal(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const videoData: VideoCreateRequest = {
        videoId,
        startTime,
        endTime,
        title: title.trim() || undefined,
      };

      const savedVideo = await videoApi.createVideo(videoData);
      
      // デバッグ用：レスポンスの内容を確認
      console.log('保存された動画データ:', savedVideo);
      
      // 成功アラートを表示
      alert(`動画を保存しました！\nタイトル: ${savedVideo.title || '無題'}\n開始時間: ${savedVideo.startTime}秒\n終了時間: ${savedVideo.endTime}秒\n\n保存した動画は下のリストにリアルタイムで表示されます。`);
      
      setIsSaved(true);
      setShowModal(false);
      setTitle('');
      
      // 親コンポーネントに保存完了を通知
      if (onSaveSuccess) {
        onSaveSuccess();
      }
      
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('保存に失敗しました:', err);
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : '動画の保存に失敗しました';
      setError(errorMessage);
      alert(`保存に失敗しました: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setTitle('');
    setError(null);
  };

  return (
    <>
      <div className="text-center">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
        <button
          onClick={handleSaveClick}
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

      {/* モーダル */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">動画を保存</h3>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル（任意）
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="動画のタイトルを入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                autoFocus
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 