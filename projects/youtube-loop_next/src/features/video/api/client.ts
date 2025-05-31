import { VideoData, Video, ApiResponse } from './types';

export const videoApi = {
  getVideos: async (): Promise<Video[]> => {
    const res = await fetch('/api/video');
    if (!res.ok) {
      throw new Error('動画の取得に失敗しました');
    }
    return res.json();
  },

  createVideo: async (data: VideoData): Promise<Video> => {
    const res = await fetch('/api/video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('動画の保存に失敗しました');
    }
    return res.json();
  },

  deleteVideo: async (id: string): Promise<void> => {
    const res = await fetch(`/api/video/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw new Error('動画の削除に失敗しました');
    }
  },
}; 