export type Video = {
  id: string;
  video_id: string;
  start_time: number;
  end_time: number | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      videos: {
        Row: Video;
        Insert: Omit<Video, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Video, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}; 