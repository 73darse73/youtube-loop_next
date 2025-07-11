import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    // Supabaseクライアントを作成
    const supabase = createServerSupabaseClient();
    
    // 現在のセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    const videos = await prisma.videoLoop.findMany({
      where: {
        deletedAt: null, // 削除されていない動画のみ取得
        userId: userId, // 現在のユーザーの動画のみ取得
      } as any,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(videos);
  } catch (error) {
    console.error('動画一覧取得エラー詳細:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      error: error
    });
    return NextResponse.json(
      { error: '動画一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('=== 動画保存API開始 ===');
    
    // Supabaseクライアントを作成
    const supabase = createServerSupabaseClient();
    
    // 現在のセッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    const body = await request.json();
    const { videoId, startTime, endTime, title } = body;
    console.log('リクエストデータ:', { videoId, startTime, endTime, title, userId });

    if (!videoId || typeof startTime !== 'number' || typeof endTime !== 'number') {
      console.log('バリデーションエラー: 無効なデータ');
      return NextResponse.json(
        { error: '無効なデータです' },
        { status: 400 }
      );
    }

    console.log('データベース操作開始:', { videoId, startTime, endTime, title, userId });

    try {
      // ユーザーが存在するかチェック
      let user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.log('ユーザーを作成中...');
        user = await prisma.user.create({
          data: {
            id: userId,
            email: session.user.email || 'unknown@example.com',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Unknown User'
          }
        });
        console.log('ユーザー作成完了:', user.id);
      } else {
        console.log('既存ユーザーを使用:', user.id);
      }

      console.log('VideoLoop作成開始...');
      const videoLoop = await prisma.videoLoop.create({
        data: {
          videoId,
          startTime,
          endTime,
          title: title || null,
          userId: user.id,
          isPublic: false,
        },
      });

      console.log('動画ループ作成成功:', videoLoop.id);
      console.log('返却するデータ:', videoLoop);
      return NextResponse.json(videoLoop);
    } catch (dbError) {
      console.error('データベース操作エラー詳細:', {
        name: dbError instanceof Error ? dbError.name : 'Unknown',
        message: dbError instanceof Error ? dbError.message : 'Unknown error',
        stack: dbError instanceof Error ? dbError.stack : 'No stack trace',
        error: dbError
      });
      
      return NextResponse.json(
        { 
          error: 'データベース操作に失敗しました',
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
      { 
        error: '動画ループの保存中にエラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 