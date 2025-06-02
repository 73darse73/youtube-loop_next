import { NextResponse } from 'next/server';
import type { Video, VideoData } from '@/features/video/api/types';
import { PrismaClient } from '@prisma/client';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// 仮のデータストア（実際のアプリケーションではデータベースを使用）
let videos: Video[] = [];

export async function GET() {
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { videoId, startTime, endTime } = body;

    const videoLoop = await prisma.videoLoop.create({
      data: {
        videoId,
        startTime,
        endTime,
        userId: session.user.id,
        isPublic: false,
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