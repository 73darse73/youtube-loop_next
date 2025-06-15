import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('動画削除API開始:', id);
    
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