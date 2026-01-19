// YouTubeのAPI型定義
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

// YouTubeプレーヤーのインターフェース
export interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  loadVideoById: (options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }) => void;
  cueVideoById: (options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }) => void;
  getPlayerState: () => number;
  destroy: () => void;
  [key: string]: unknown;
}

// YouTubeイベントの型定義
export interface YTEvent {
  target: YTPlayer;
}

export interface YTStateChangeEvent extends YTEvent {
  data: number;
}

export {}; 