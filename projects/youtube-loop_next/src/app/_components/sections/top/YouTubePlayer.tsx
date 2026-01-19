'use client';

import { useEffect, useRef, useState } from 'react';
import type { YTPlayer, YTEvent, YTStateChangeEvent } from '../../../../types/youtube';

// コンポーネントのプロパティ
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
                // 動画終了時は常にループする
                // シーク位置を設定して再生
                event.target.seekTo(startTime, true);
                setTimeout(() => {
                  if (isMounted) event.target.playVideo();
                }, 100);
              }
            },
            onError: (event: any) => {
              console.error('YouTube プレーヤーエラー:', event);
              if (isMounted) setError('動画の読み込み中にエラーが発生しました。\nidが間違っているか、動画が削除・非公開にされている可能性もあります。');
            }
          },
        });
      } catch (error) {
        console.error('プレーヤー初期化エラー:', error);
        if (isMounted) setError('プレーヤーの初期化に失敗しました');
      }
    };

    // videoIDがあればAPIをロード
    if (videoId) {
      setIsPlayerReady(false);
      setError(null); // エラー状態をリセット
      loadYouTubeAPI();
    }

    // クリーンアップ関数
    return () => {
      isMounted = false;
      if (player) {
        player.destroy();
      }
    };
  }, [videoId]); // videoIdが変わったときだけ再初期化

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

  // エラーがある場合はエラーメッセージを表示
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                動画の読み込みに失敗しました
              </h3>
              <div className="mt-2 text-sm text-red-700 whitespace-pre-line">
                {error}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* YouTubeプレーヤー */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <div
            ref={playerRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        
        {/* コントロール */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlayPause}
                disabled={!isPlayerReady}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPlaying ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    一時停止
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    再生
                  </>
                )}
              </button>
              
              {!isPlayerReady && (
                <div className="flex items-center text-gray-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                  読み込み中...
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-500">
              {startTime > 0 && `開始: ${startTime}秒`}
              {endTime && endTime > startTime && ` - 終了: ${endTime}秒`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}