import { NextResponse } from 'next/server';
import { liteClient } from '@/lib/lite/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const deleted = searchParams.get('deleted') === 'true';
    
    // liteクライアントから動画一覧を取得
    const videos = await liteClient.getVideos();
    
    // 削除済みフィルタリング（liteでは削除フラグは実装しないので全件返す）
    return NextResponse.json(videos);
  } catch (error) {
    console.error('動画一覧取得エラー:', error);
    return NextResponse.json(
      { error: '動画一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== 動画保存API開始 ===');
    
    const body = await request.json();
    const { videoId, startTime, endTime, title } = body;
    console.log('リクエストデータ:', { videoId, startTime, endTime, title });

    if (!videoId || typeof startTime !== 'number' || typeof endTime !== 'number') {
      console.log('バリデーションエラー: 無効なデータ');
      return NextResponse.json(
        { error: '無効なデータです' },
        { status: 400 }
      );
    }

    try {
      // ローカル開発用のダミーユーザーID
      const dummyUserId = 'local-dev-user';
      console.log('データ保存開始:', { videoId, startTime, endTime, title, userId: dummyUserId });

      const video = await liteClient.saveVideo({
        video_id: videoId,
        start_time: startTime,
        end_time: endTime,
        user_id: dummyUserId,
      });

      console.log('動画保存成功:', video.id);
      return NextResponse.json(video);
    } catch (dbError) {
      console.error('データ保存エラー詳細:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace',
        error: dbError
      });
      
      return NextResponse.json(
        { 
          error: 'データ保存に失敗しました',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('=== 動画保存APIエラー ===');
    console.error('エラー詳細:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      { error: '動画の保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 