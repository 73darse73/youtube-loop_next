import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const deletedVideos = await prisma.videoLoop.findMany({
      where: {
        deletedAt: {
          not: null // 削除された動画のみ取得
        }
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