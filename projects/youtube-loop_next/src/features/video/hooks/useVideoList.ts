import { useState, useEffect } from 'react';
import { Video } from '../api/types';
import { videoApi } from '../api/client';

export const useVideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      setIsLoading(true);
      const data = await videoApi.getVideos();
      setVideos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : '動画の取得に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id: string) => {
    try {
      await videoApi.deleteVideo(id);
      setVideos(videos => videos.filter(video => video.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : '動画の削除に失敗しました');
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return {
    videos,
    isLoading,
    error,
    refreshVideos: fetchVideos,
    deleteVideo,
  };
}; 