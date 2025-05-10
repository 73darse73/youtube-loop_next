'use client';

import { useState } from 'react';
import YouTubePlayer from '../components/YouTubePlayer';

export default function Page() {
  const [url, setUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  }

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  }

  const handlePlay = () => {
    if (!url) {
      alert('YouTubeのURLを入力してください。');
      return;
    }

    try {
      let id = '';
      if (url.includes('youtube.com/watch')) {
        // https://www.youtube.com/watch?v=VIDEO_ID 形式
        const urlObj = new URL(url);
        id = urlObj.searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        // https://youtu.be/VIDEO_ID 形式
        const parts = url.split('youtu.be/');
        id = parts[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        // https://www.youtube.com/embed/VIDEO_ID 形式
        const parts = url.split('embed/');
        id = parts[1]?.split('?')[0] || '';
      } else {
        // 直接動画IDを入力した場合
        id = url;
      }

      if (!id) {
        alert('有効なYouTube URLを入力してください。');
        return;
      }

      setVideoId(id);
    } catch (error) {
      alert('URLの解析中にエラーが発生しました。');
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <YouTubePlayer 
        videoId={videoId}
        startTime={startTime ? parseInt(startTime) : 0}
        endTime={endTime ? parseInt(endTime) : undefined}
      />
      <div className="mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="url">動画のURLを入れてください。</label>
          <input 
            type="text" 
            id="url" 
            value={url}
            onChange={handleUrlChange}
            className="w-full md:w-4/5 border-2 border-gray-300 rounded-md p-2" 
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="startTime">開始時間を入力してください（秒）。</label>
          <input 
            type="text" 
            id="startTime" 
            value={startTime}
            onChange={handleStartTimeChange}
            className="w-full md:w-4/5 border-2 border-gray-300 rounded-md p-2" 
            placeholder="0"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="endTime">終了時間を入力してください（秒）。</label>
          <input 
            type="text" 
            id="endTime" 
            value={endTime}
            onChange={handleEndTimeChange}
            className="w-full md:w-4/5 border-2 border-gray-300 rounded-md p-2" 
            placeholder="省略可"
          />
        </div>
        <div className="mt-4">
          <button 
            onClick={handlePlay} 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            再生
          </button>
        </div>
      </div>
    </div>
  )
}