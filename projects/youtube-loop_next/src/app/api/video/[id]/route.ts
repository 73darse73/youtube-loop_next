import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('動画削除API開始:', id);
    
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
    
    // 動画が存在し、かつ現在のユーザーのものかチェック
    const video = await prisma.videoLoop.findUnique({
      where: { id }
    });
    
    if (!video) {
      return NextResponse.json(
        { error: '動画が見つかりません' },
        { status: 404 }
      );
    }
    
    if (video.userId !== userId) {
      return NextResponse.json(
        { error: 'この動画を削除する権限がありません' },
        { status: 403 }
      );
    }
    
    const deletedVideo = await prisma.videoLoop.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
    
    console.log('動画削除成功:', deletedVideo.id);
    return NextResponse.json({ message: '動画を削除しました' });
  } catch (error) {
    console.error('動画削除エラー:', error);
    return NextResponse.json(
      { error: '動画の削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 