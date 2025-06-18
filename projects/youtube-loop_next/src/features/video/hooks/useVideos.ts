import { useState, useEffect, useCallback } from 'react';
import { Video, VideoCreateRequest } from '../types';
import { videoApi, ApiError } from '../api/client';

export const useVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await videoApi.getVideos();
      setVideos(data);
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : '動画の取得に失敗しました';
      setError(errorMessage);
      console.error('動画取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createVideo = useCallback(async (data: VideoCreateRequest): Promise<Video | null> => {
    try {
      setError(null);
      const newVideo = await videoApi.createVideo(data);
      setVideos(prev => [newVideo, ...prev]);
      return newVideo;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : '動画の保存に失敗しました';
      setError(errorMessage);
      console.error('動画保存エラー:', err);
      return null;
    }
  }, []);

  const deleteVideo = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await videoApi.deleteVideo(id);
      setVideos(prev => prev.filter(video => video.id !== id));
      return true;
    } catch (err) {
      const errorMessage = err instanceof ApiError 
        ? err.message 
        : '動画の削除に失敗しました';
      setError(errorMessage);
      console.error('動画削除エラー:', err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    isLoading,
    error,
    fetchVideos,
    createVideo,
    deleteVideo,
  };
}; 