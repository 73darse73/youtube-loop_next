export type Video = {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
  description?: string;
  isPublic: boolean;
  playCount: number;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}; 