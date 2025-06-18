import { Video, VideoCreateRequest, VideoUpdateRequest, ApiResponse, VideoApiResponse, VideoListApiResponse } from '../types';

const API_BASE_URL = '/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || 'API request failed',
      response.status,
      errorData.details
    );
  }
  return response.json();
}

export const videoApi = {
  // 動画一覧取得
  async getVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/video`);
    return handleResponse<Video[]>(response);
  },

  // 動画作成
  async createVideo(data: VideoCreateRequest): Promise<Video> {
    const response = await fetch(`${API_BASE_URL}/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<Video>(response);
  },

  // 動画削除（ソフトデリート）
  async deleteVideo(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/video/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
  },

  // 動画復元
  async restoreVideo(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/video/trash/${id}/restore`, {
      method: 'POST',
    });
    return handleResponse<{ message: string }>(response);
  },

  // 動画完全削除
  async permanentlyDeleteVideo(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/video/trash/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(response);
  },

  // ゴミ箱の動画一覧取得
  async getTrashVideos(): Promise<Video[]> {
    const response = await fetch(`${API_BASE_URL}/video/trash`);
    return handleResponse<Video[]>(response);
  },
};

export { ApiError }; 