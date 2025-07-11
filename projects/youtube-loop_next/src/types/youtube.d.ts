// YouTubeのAPI型定義
declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: {
      Player: new (
        element: HTMLElement | null, 
        config: {
          videoId?: string;
          width?: number | string;
          height?: number | string;
          playerVars?: {
            playsinline?: number;
            autoplay?: number;
            start?: number;
            end?: number;
            [key: string]: unknown;
          };
          events?: {
            onReady?: (event: YTEvent) => void;
            onStateChange?: (event: YTStateChangeEvent) => void;
            onError?: (event: YTEvent) => void;
            [key: string]: unknown;
          };
        }
      ) => YTPlayer;
      PlayerState: {
        UNSTARTED: -1;
        ENDED: 0;
        PLAYING: 1;
        PAUSED: 2;
        BUFFERING: 3;
        CUED: 5;
      };
    };
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