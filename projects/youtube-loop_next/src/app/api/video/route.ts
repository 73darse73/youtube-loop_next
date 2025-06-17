import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const videos = await prisma.videoLoop.findMany({
      where: {
        deletedAt: null // 削除されていない動画のみ取得
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

    // ローカル開発用のダミーユーザーID
    const dummyUserId = 'local-dev-user';
    console.log('データベース操作開始:', { videoId, startTime, endTime, title, userId: dummyUserId });

    try {
      // ダミーユーザーを作成または取得
      let user = await prisma.user.findUnique({
        where: { id: dummyUserId }
      });

      if (!user) {
        console.log('ダミーユーザーを作成中...');
        user = await prisma.user.create({
          data: {
            id: dummyUserId,
            email: 'local-dev@example.com',
            name: 'Local Development User'
          }
        });
        console.log('ダミーユーザー作成完了:', user.id);
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