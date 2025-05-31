interface YouTubePlayer {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  loadVideoById(options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }): void;
  cueVideoById(options: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }): void;
  getPlayerState(): number;
  destroy(): void;
}

interface YouTubePlayerEvent {
  target: YouTubePlayer;
}

interface YouTubeStateChangeEvent extends YouTubePlayerEvent {
  data: number;
}

interface YouTubePlayerConfig {
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
    onReady?: (event: YouTubePlayerEvent) => void;
    onStateChange?: (event: YouTubeStateChangeEvent) => void;
    onError?: (event: YouTubePlayerEvent) => void;
  };
}

interface YouTubeAPI {
  Player: new (
    element: HTMLElement | null,
    config: YouTubePlayerConfig
  ) => YouTubePlayer;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

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
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { target: YouTubePlayer; data: number }) => void;
            onError?: (event: { target: YouTubePlayer }) => void;
          };
        }
      ) => YouTubePlayer;
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

export type { YouTubePlayer, YouTubePlayerEvent, YouTubeStateChangeEvent };

// ESLintのエラーを防ぐために空のexportを追加
export {}; 