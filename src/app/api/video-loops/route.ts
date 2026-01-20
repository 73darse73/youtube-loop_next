import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoId, startTime, endTime } = body;

    const videoLoop = await prisma.videoLoop.create({
      data: {
        videoId,
        startTime,
        endTime,
        isPublic: true, // デフォルトで公開設定
      },
    });

    return NextResponse.json(videoLoop);
  } catch (error) {
    console.error('動画ループの保存中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '動画ループの保存中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const videoLoops = await prisma.videoLoop.findMany({
      where: {
        isPublic: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(videoLoops);
  } catch (error) {
    console.error('動画ループの取得中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '動画ループの取得中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 