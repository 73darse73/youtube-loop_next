import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('=== データベース接続テスト開始 ===');
    
    // ユーザー数を取得
    const userCount = await prisma.user.count();
    console.log('ユーザー数:', userCount);
    
    // 動画数を取得
    const videoCount = await prisma.videoLoop.count();
    console.log('動画数:', videoCount);
    
    // 最新の動画を取得
    const latestVideo = await prisma.videoLoop.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    console.log('最新の動画:', latestVideo);
    
    return NextResponse.json({
      success: true,
      userCount,
      videoCount,
      latestVideo
    });
  } catch (error) {
    console.error('データベース接続テストエラー:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 