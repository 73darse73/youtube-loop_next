export interface VideoPlayerConfig {
  videoId: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
}

export interface VideoPlayerState {
  isPlaying: boolean;
  isReady: boolean;
  error: string | null;
}

export interface VideoPlayerActions {
  play: () => void;
  pause: () => void;
  seekTo: (seconds: number) => void;
} 