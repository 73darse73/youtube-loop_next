import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('動画完全削除API開始:', id);
    
    const deletedVideo = await prisma.videoLoop.delete({
      where: { id }
    });
    
    console.log('動画完全削除成功:', deletedVideo.id);
    return NextResponse.json({ message: '動画を完全に削除しました' });
  } catch (error) {
    console.error('動画完全削除エラー:', error);
    return NextResponse.json(
      { error: '動画の完全削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 