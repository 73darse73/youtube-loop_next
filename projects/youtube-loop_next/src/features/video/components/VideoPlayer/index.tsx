'use client';

import { useEffect, useRef, useState } from 'react';
import type { YouTubePlayer } from '../../types/youtube';

interface VideoPlayerProps {
  videoId: string;
  startTime?: number;
  endTime?: number;
  autoplay?: boolean;
}

export const VideoPlayer = ({
  videoId,
  startTime = 0,
  endTime,
  autoplay = false
}: VideoPlayerProps) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadYouTubeAPI = () => {
      try {
        if (window.YT) {
          initializePlayer();
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = initializePlayer;
      } catch (err) {
        console.error('YouTube APIの読み込みエラー:', err);
        if (isMounted) setError('YouTube APIの読み込みに失敗しました');
      }
    };

    const initializePlayer = () => {
      if (!isMounted || !playerRef.current) return;

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
            onReady: (event: any) => {
              if (!isMounted) return;
              console.log('プレーヤー準備完了');
              setPlayer(event.target);
              setIsPlayerReady(true);
              if (autoplay) {
                setIsPlaying(true);
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (
                event.data === window.YT.PlayerState.PAUSED ||
                event.data === window.YT.PlayerState.ENDED
              ) {
                setIsPlaying(false);
              }
              
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(startTime, true);
                setTimeout(() => {
                  if (isMounted) event.target.playVideo();
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
  }, [videoId, player, startTime, endTime, autoplay]);

  useEffect(() => {
    if (!player || !isPlayerReady || !videoId) return;

    try {
      const timeoutId = setTimeout(() => {
        try {
          if (autoplay) {
            player.loadVideoById({
              videoId,
              startSeconds: startTime,
              endSeconds: endTime || undefined
            });
            setIsPlaying(true);
          } else {
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

      return () => clearTimeout(timeoutId);
    } catch (error) {
      console.error('動画の更新エラー:', error);
      setError('動画の更新に失敗しました');
    }
  }, [videoId, player, startTime, endTime, isPlayerReady, autoplay]);

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
      <div ref={playerRef} className="w-full h-auto aspect-video bg-gray-100"></div>
      {error && (
        <div className="mt-2 text-red-500">
          {error.split("。").filter(Boolean).map((part, index) => (
            <p key={index} className={index === 0 ? "mb-1" : ""}>
              {part}{part.length > 0 ? "。" : ""}
            </p>
          ))}
        </div>
      )}
      {player && isPlayerReady && !error && (
        <div className="mt-2">
          <button 
            onClick={togglePlayPause}
            className={`${
              isPlaying ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-700'
            } text-white px-4 py-1 rounded-md text-sm transition-colors`}
          >
            {isPlaying ? '一時停止' : '再生'}
          </button>
        </div>
      )}
    </div>
  );
}; 