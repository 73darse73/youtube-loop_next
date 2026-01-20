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
  deletedAt?: string | null;
  userId?: string;
};

export type VideoCreateRequest = {
  videoId: string;
  startTime: number;
  endTime: number;
  title?: string;
};

export type VideoUpdateRequest = {
  title?: string;
  description?: string;
  isPublic?: boolean;
};

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
};

export type VideoApiResponse = ApiResponse<Video>;
export type VideoListApiResponse = ApiResponse<Video[]>; 