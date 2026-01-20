export interface SavedVideo {
  id: string;
  videoId: string;
  startTime: number;
  endTime: number;
  createdAt: string;
  title?: string;
}

export interface VideoPlayerProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
}

export interface SaveVideoButtonProps {
  videoId: string;
  startTime: number;
  endTime: number;
  className?: string;
  onSaveSuccess?: () => void;
} 