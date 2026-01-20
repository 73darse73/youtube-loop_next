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
  videos: Video[];
}; 