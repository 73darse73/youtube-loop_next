'use client';

import { useEffect, useRef, useState } from 'react';

// 型定義
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
            onStateChange?: (event: YTEvent) => void;
            onError?: (event: YTEvent) => void;
            [key: string]: ((event: YTEvent) => void) | undefined;
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

// YouTubeプレーヤーインターフェース
interface YTPlayer {
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
  [key: string]: any;
}

// YouTubeイベントインターフェース
interface YTEvent {
  target: YTPlayer;
  data?: number;
}

// コンポーネントのprops型
interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
}

export default function YouTubePlayer({
  videoId,
  startTime = 0,
  endTime,
  autoplay = false
}: YouTubePlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // プレーヤーのロードと初期化
  useEffect(() => {
    const loadYouTubeAPI = () => {
      // すでにAPIが読み込まれている場合はプレーヤーを初期化
      if (window.YT) {
        initializePlayer();
        return;
      }

      // APIスクリプトをロード
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);

      // APIが読み込まれたら実行されるコールバック
      window.onYouTubeIframeAPIReady = initializePlayer;
    };

    const initializePlayer = () => {
      if (!playerRef.current) return;

      // 現在のプレーヤーを破棄（再初期化のため）
      if (player) {
        player.destroy();
      }

      try {
        const newPlayer = new window.YT.Player(playerRef.current, {
          videoId: videoId || undefined,
          playerVars: {
            playsinline: 1,
            start: startTime,
            end: endTime,
            autoplay: autoplay ? 1 : 0,
          },
          events: {
            onReady: (event: YTEvent) => {
              console.log('プレーヤー準備完了');
              setPlayer(event.target);
              if (autoplay) {
                setIsPlaying(true);
              }
            },
            onStateChange: (event: YTEvent) => {
              // 再生状態の更新
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
              }
              
              // 動画が終了したらループ
              if (event.data === window.YT.PlayerState.ENDED) {
                // まずシーク位置を設定
                event.target.seekTo(startTime, true);
                
                // 少し遅延をかけて確実に再生開始
                setTimeout(() => {
                  event.target.playVideo();
                }, 100);
              }
            },
          },
        });
      } catch (error) {
        console.error('プレーヤーの初期化エラー:', error);
      }
    };

    // VideoIDがあればYouTube APIをロード
    if (videoId) {
      loadYouTubeAPI();
    }

    // クリーンアップ関数
    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, [videoId, startTime, endTime, autoplay, player]);

  // 動画IDが変更されたらプレーヤーを更新
  useEffect(() => {
    if (player && videoId) {
      player.loadVideoById({
        videoId,
        startSeconds: startTime,
        endSeconds: endTime
      });
      setIsPlaying(true);
    }
  }, [videoId, player]);

  // 再生/一時停止を切り替える
  const togglePlayPause = () => {
    if (!player) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  return (
    <div className="youtube-player-container">
      <div ref={playerRef} className="w-full aspect-video bg-gray-100"></div>
      {player && (
        <div className="mt-2">
          <button 
            onClick={togglePlayPause}
            className={`${
              isPlaying ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'
            } text-white px-4 py-1 rounded-md text-sm transition-colors`}
          >
            {isPlaying ? '一時停止' : '再生'}
          </button>
        </div>
      )}
    </div>
  );
} 