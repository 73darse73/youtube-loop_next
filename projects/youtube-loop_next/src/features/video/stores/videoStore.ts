import { create } from 'zustand';
import type { Video } from '../api/types';
import { videoApi } from '../api/client';

interface VideoStore {
  videos: Video[];
  isLoading: boolean;
  error: string | null;
  fetchVideos: () => Promise<void>;
  addVideo: (video: Video) => void;
  deleteVideo: (id: string) => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  isLoading: false,
  error: null,

  fetchVideos: async () => {
    try {
      set({ isLoading: true });
      const videos = await videoApi.getVideos();
      set({ videos, error: null });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '動画の取得に失敗しました',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  addVideo: (video) => {
    set((state) => ({
      videos: [...state.videos, video],
    }));
  },

  deleteVideo: async (id) => {
    try {
      await videoApi.deleteVideo(id);
      set((state) => ({
        videos: state.videos.filter((video) => video.id !== id),
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : '動画の削除に失敗しました',
      });
    }
  },
})); 