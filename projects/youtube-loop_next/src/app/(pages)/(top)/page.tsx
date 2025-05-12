'use client';

import { useState, ChangeEvent } from 'react';
import YouTubePlayer from '@/_components/sections/top/YouTubePlayer';
import Input from '@/_components/ui/Input';
import Button from '@/_components/ui/Button';
import FormGroup from '@/_components/ui/FormGroup';

/**
 * YouTube動画IDのバリデーション
 */
const isValidYouTubeId = (id: string): boolean => /^[A-Za-z0-9_-]{11}$/.test(id);

/**
 * YouTube動画ループ再生アプリのメインページ
 */
export default function Page() {
  // フォーム入力の状態
  const [url, setUrl] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // バリデーションエラーの状態
  const [urlError, setUrlError] = useState<string | null>(null);
  const [startTimeError, setStartTimeError] = useState<string | null>(null);
  const [endTimeError, setEndTimeError] = useState<string | null>(null);

  // プレーヤーに渡す状態
  const [videoId, setVideoId] = useState('');
  const [currentStartTime, setCurrentStartTime] = useState(0);
  const [currentEndTime, setCurrentEndTime] = useState<number | undefined>(undefined);
  const [autoplay, setAutoplay] = useState(false);

  /**
   * 時間の値が有効かチェックする
   */
  const validateTimeValues = () => {
    if (startTime && endTime && parseInt(startTime) >= parseInt(endTime)) {
      setEndTimeError('終了時間は開始時間より大きくしてください');
      return false;
    }
    return true;
  };

  // 入力フィールドの変更ハンドラー
  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrl(value);
    
    // 空の場合はエラーなし
    if (!value) {
      setUrlError(null);
      return;
    }
    
    // 動画IDかYouTube URLかを検証
    if (isValidYouTubeId(value) || value.includes('youtube.com') || value.includes('youtu.be')) {
      setUrlError(null);
    } else {
      setUrlError('有効なYouTube URLまたは動画IDを入力してください');
    }
  };

  /**
   * 時間入力の共通ハンドラー
   */
  const handleTimeChange = (
    e: ChangeEvent<HTMLInputElement>, 
    setter: React.Dispatch<React.SetStateAction<string>>,
    errorSetter: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: string
  ) => {
    const value = e.target.value;
    
    // 数値または空のみ許可して入力値を更新
    if (value === '' || /^\d+$/.test(value)) {
      setter(value);
      errorSetter(null);
      
      // 他の時間値と比較
      setTimeout(validateTimeValues, 0);
    } else {
      // 数値以外の入力はエラー
      errorSetter(`${fieldName}には数値のみ入力できます`);
    }
  };

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleTimeChange(e, setStartTime, setStartTimeError, '開始時間');
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleTimeChange(e, setEndTime, setEndTimeError, '終了時間');
  };

  /**
   * YouTube URL/IDを検証して動画を再生する
   */
  const handlePlay = () => {
    // URLが空の場合はエラー表示
    if (!url) {
      setUrlError('有効なYouTubeのURLまたは動画IDを入力してください');
      return;
    }

    // 開始時間と終了時間のバリデーションエラーがある場合は処理を中断
    if (startTimeError || endTimeError || !validateTimeValues()) {
      return;
    }

    try {
      // URLから動画IDを抽出
      const id = extractVideoId(url);

      if (!id) {
        setUrlError('有効なYouTube URLまたは動画IDを入力してください');
        return;
      }

      // プレーヤーの状態を更新
      setVideoId(id);
      setCurrentStartTime(startTime ? parseInt(startTime) : 0);
      setCurrentEndTime(endTime ? parseInt(endTime) : undefined);
      setAutoplay(true);
    } catch (error) {
      console.error('URLの解析中にエラーが発生しました', error);
      setUrlError('URLの解析中にエラーが発生しました');
    }
  };

  /**
   * 様々なYouTube URL形式から動画IDを抽出する
   */
  const extractVideoId = (url: string): string => {
    // 11文字のYouTube動画ID形式の場合はそのまま返す
    if (isValidYouTubeId(url)) {
      return url;
    }
    
    let id = '';
    try {
      // 様々なURL形式に対応
      if (url.includes('youtube.com/watch')) {
        // 標準形式: https://www.youtube.com/watch?v=VIDEO_ID
        const urlObj = new URL(url);
        id = urlObj.searchParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        // 短縮形式: https://youtu.be/VIDEO_ID
        id = url.split('youtu.be/')[1]?.split(/[?&]/)[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        // 埋め込み形式: https://www.youtube.com/embed/VIDEO_ID
        id = url.split('embed/')[1]?.split(/[?&]/)[0] || '';
      }
    } catch (error) {
      console.error('URL解析エラー:', error);
      return '';
    }
    
    // 抽出したIDが有効な形式かチェック
    return isValidYouTubeId(id) ? id : '';
  };

  return (
    <div className="container mx-auto md:px-8 pb-4 md:pt-8 md:pb-8">
      {/* YouTubeプレーヤー */}
      <YouTubePlayer 
        videoId={videoId}
        startTime={currentStartTime}
        endTime={currentEndTime}
        autoplay={autoplay}
      />

      {/* 設定フォーム */}
      <FormGroup title="動画設定" className="my-4">
        <div className="mb-4">
          <Input
            id="url"
            label="動画のURLまたは動画ID"
            value={url}
            onChange={handleUrlChange}
            error={urlError}
            ariaDescribedby="url-formats"
          />
          <div id="url-formats" className="-mt-2">
            <p className="text-gray-600 text-sm mb-1 font-medium">以下のいずれかの形式に対応しています：</p>
            <ul className="text-gray-600 text-sm mb-3 pl-5 list-disc">
              <li>通常のURL: https://www.youtube.com/watch?v=abcdefghijk</li>
              <li>短縮URL: https://youtu.be/abcdefghijk</li>
              <li>埋め込みURL: https://www.youtube.com/embed/abcdefghijk</li>
              <li>動画ID直接入力: abcdefghijk</li>
            </ul>
          </div>
        </div>
        
        <div className="mb-4">
          <Input
            id="startTime"
            label="開始時間（秒）"
            value={startTime}
            onChange={handleStartTimeChange}
            type="text"
            error={startTimeError}
            aria-describedby="startTime-format"
          />
          <p id="startTime-format" className="text-gray-600 text-sm mt-1">数値のみ入力可能</p>
        </div>
        
        <div className="mb-4">
          <Input
            id="endTime"
            label="終了時間（秒）"
            value={endTime}
            onChange={handleEndTimeChange}
            type="text"
            error={endTimeError}
            aria-describedby="endTime-format"
          />
          <p id="endTime-format" className="text-gray-600 text-sm mt-1">数値のみ入力可能（省略可）</p>
        </div>
        
        <div className="mt-4">
          <Button 
            onClick={handlePlay}
            disabled={!url || !!urlError || !!startTimeError || !!endTimeError}
          >
            再生
          </Button>
        </div>
      </FormGroup>
    </div>
  );
}