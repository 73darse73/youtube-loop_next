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
    
    const deletedVideos = await prisma.videoLoop.findMany({
      where: {
        deletedAt: {
          not: null // 削除された動画のみ取得
        },
        userId: userId, // 現在のユーザーの動画のみ取得
      },
      orderBy: {
        deletedAt: 'desc',
      },
    });

    return NextResponse.json(deletedVideos);
  } catch (error) {
    console.error('削除された動画一覧取得エラー:', error);
    return NextResponse.json(
      { error: '削除された動画一覧の取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 