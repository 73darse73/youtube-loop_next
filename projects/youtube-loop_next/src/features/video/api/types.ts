export interface VideoData {
  videoId: string;
  startTime: number;
  endTime: number;
}

export interface Video extends VideoData {
  id: string;
  createdAt: string;
  isPublic: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
} 