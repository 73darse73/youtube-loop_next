'use client';

import { useEffect, useRef, useState } from 'react';

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

// YouTubeプレーヤーのインターフェース
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
  [key: string]: unknown;
}

// YouTubeイベントの型定義
interface YTEvent {
  target: YTPlayer;
}

interface YTStateChangeEvent extends YTEvent {
  data: number;
}

// コンポーネントのProps
interface YouTubePlayerProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
}

export const YoutubePlayer = ({
  videoId,
  startTime = 0,
  endTime,
  autoplay = false
}: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<YTPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // YouTubeプレーヤーの初期化
  useEffect(() => {
    let isMounted = true;
    
    // APIをロードする関数
    const loadYouTubeAPI = () => {
      try {
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
      } catch (err) {
        console.error('YouTube APIの読み込みエラー:', err);
        if (isMounted) setError('YouTube APIの読み込みに失敗しました');
      }
    };

    // プレーヤーを初期化する関数
    const initializePlayer = () => {
      if (!isMounted || !playerRef.current) return;

      // 既存のプレーヤーを破棄
      if (player) {
        player.destroy();
        setIsPlayerReady(false);
      }

      try {
        new window.YT.Player(playerRef.current, {
          videoId: videoId || undefined,
          playerVars: {
            playsinline: 1,
            start: startTime,
            end: endTime,
            autoplay: autoplay ? 1 : 0,
          },
          events: {
            onReady: (event: YTEvent) => {
              if (!isMounted) return;
              console.log('プレーヤー準備完了');
              setPlayer(event.target);
              setIsPlayerReady(true);
              if (autoplay) {
                setIsPlaying(true);
              }
            },
            onStateChange: (event: YTStateChangeEvent) => {
              if (!isMounted) return;
              
              console.log('Player state changed:', event.data);
              
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
                console.log('Video ended, restarting from', startTime);
                // 動画終了時は常にループする
                // シーク位置を設定して再生
                event.target.seekTo(startTime, true);
                setTimeout(() => {
                  if (isMounted) {
                    console.log('Starting playback again');
                    event.target.playVideo();
                  }
                }, 100);
              }
            },
            onError: () => {
              if (isMounted) setError('動画の読み込み中にエラーが発生しました。\nidが間違っているか、動画が削除・非公開にされている可能性もあります。');
            }
          },
        });
      } catch (error) {
        console.error('プレーヤー初期化エラー:', error);
        if (isMounted) setError('プレーヤーの初期化に失敗しました');
      }
    };

    if (videoId) {
      setIsPlayerReady(false);
      setError(null);
      loadYouTubeAPI();
    }

    return () => {
      isMounted = false;
      if (player) {
        player.destroy();
      }
    };
  }, [videoId, startTime, endTime, autoplay]);

  // 動画の更新（videoId, startTime, endTimeなどが変更されたとき）
  useEffect(() => {
    if (!player || !isPlayerReady || !videoId) return;

    try {
      // 少し遅延をかけて実行（API準備完了を確実にするため）
      const timeoutId = setTimeout(() => {
        try {
          if (autoplay) {
            // 自動再生する場合
            player.loadVideoById({
              videoId,
              startSeconds: startTime,
              endSeconds: endTime || undefined
            });
            setIsPlaying(true);
          } else {
            // 自動再生しない場合
            player.cueVideoById({
              videoId,
              startSeconds: startTime,
              endSeconds: endTime || undefined
            });
          }
        } catch (error) {
          console.error('動画の読み込みエラー:', error);
          setError('動画の読み込みに失敗しました');
        }
      }, 500);

      // クリーンアップ
      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('動画の更新エラー:', error);
      setError('動画の更新に失敗しました');
    }
  }, [videoId, player, startTime, endTime, isPlayerReady, autoplay]);

  // 再生/一時停止を切り替える
  const togglePlayPause = () => {
    if (!player || !isPlayerReady) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  return (
    <div className="youtube-player-container">
      <div ref={playerRef} className="w-full h-auto aspect-video bg-gray-100 rounded-lg"></div>
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-700 text-sm">
          {error.split("。").filter(Boolean).map((part, index) => (
            <p key={index} className={index === 0 ? "mb-1" : ""}>
              {part}{part.length > 0 ? "。" : ""}
            </p>
          ))}
          </div>
        </div>
      )}
      {player && isPlayerReady && !error && (
        <div className="mt-4 flex justify-center">
          <button 
            onClick={togglePlayPause}
            className={`${
              isPlaying ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
            } text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105`}
          >
            {isPlaying ? '一時停止' : '再生'}
          </button>
        </div>
      )}
    </div>
  );
}; 