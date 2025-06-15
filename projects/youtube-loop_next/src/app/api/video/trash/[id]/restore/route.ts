import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('動画復元API開始:', id);
    
    const restoredVideo = await prisma.videoLoop.update({
      where: { id },
      data: { deletedAt: null }
    });
    
    console.log('動画復元成功:', restoredVideo.id);
    return NextResponse.json({ message: '動画を復元しました' });
  } catch (error) {
    console.error('動画復元エラー:', error);
    return NextResponse.json(
      { error: '動画の復元中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 