import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// 全ての動画ループを取得するAPI
export async function GET() {
  try {
    console.log('Supabaseに接続を試行中...');
    
    const { data: videoLoops, error } = await supabase
      .from('video_loops')
      .select('*')
      .limit(10);

    if (error) {
      console.error('Supabaseエラー:', error);
      return NextResponse.json(
        { 
          error: 'データベースエラーが発生しました',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('Supabaseから取得したデータ:', videoLoops);
    return NextResponse.json(videoLoops || []);
  } catch (error) {
    console.error('動画ループの取得に失敗しました:', error);
    return NextResponse.json(
      { 
        error: '動画ループの取得に失敗しました',
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// 新しい動画ループを作成するAPI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { videoId, startTime, endTime, title, description, isPublic = false } = body;

    // 必須パラメータのバリデーション
    if (!videoId || startTime === undefined || endTime === undefined) {
      return NextResponse.json(
        { error: 'videoId, startTime, endTimeは必須です' },
        { status: 400 }
      );
    }

    // 時間の妥当性チェック
    if (startTime < 0 || endTime < 0 || startTime >= endTime) {
      return NextResponse.json(
        { error: '開始時間と終了時間が正しくありません' },
        { status: 400 }
      );
    }

    console.log('Supabaseにデータを挿入中...');
    
    // UUIDを生成
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const { data: newVideoLoop, error } = await supabase
      .from('video_loops')
      .insert({
        id: id,
        videoId: videoId,
        startTime: startTime,
        endTime: endTime,
        title,
        description,
        isPublic: isPublic,
        playCount: 0,
        createdAt: now,
        updatedAt: now
      })
      .select('*')
      .single();

    if (error) {
      console.error('Supabaseエラー:', error);
      return NextResponse.json(
        { 
          error: 'データベースエラーが発生しました',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    console.log('Supabaseに挿入されたデータ:', newVideoLoop);
    return NextResponse.json(newVideoLoop, { status: 201 });
  } catch (error) {
    console.error('動画ループの作成に失敗しました:', error);
    return NextResponse.json(
      { 
        error: '動画ループの作成に失敗しました',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 