// Liteクライアント - 簡易的なデータ管理
export type Video = {
  id: string;
  video_id: string;
  start_time: number;
  end_time: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

class LiteClient {
  private storage: Storage;

  constructor() {
    this.storage = typeof window !== 'undefined' ? localStorage : null as any;
  }

  // 動画を保存
  async saveVideo(video: Omit<Video, 'id' | 'created_at' | 'updated_at'>): Promise<Video> {
    const newVideo: Video = {
      ...video,
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const videos = this.getVideosFromStorage();
    videos.push(newVideo);
    this.setVideosToStorage(videos);

    return newVideo;
  }

  // 動画一覧を取得
  async getVideos(userId?: string): Promise<Video[]> {
    const videos = this.getVideosFromStorage();
    if (userId) {
      return videos.filter(video => video.user_id === userId);
    }
    return videos;
  }

  // 動画を削除
  async deleteVideo(id: string): Promise<void> {
    const videos = this.getVideosFromStorage();
    const filteredVideos = videos.filter(video => video.id !== id);
    this.setVideosToStorage(filteredVideos);
  }

  // ローカルストレージから動画を取得
  private getVideosFromStorage(): Video[] {
    if (!this.storage) return [];
    const stored = this.storage.getItem('videos');
    return stored ? JSON.parse(stored) : [];
  }

  // ローカルストレージに動画を保存
  private setVideosToStorage(videos: Video[]): void {
    if (!this.storage) return;
    this.storage.setItem('videos', JSON.stringify(videos));
  }
}

export const liteClient = new LiteClient(); 