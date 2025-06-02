import { NextResponse } from 'next/server';
import type { Video } from '@/features/video/api/types';

// 仮のデータストア（実際のアプリケーションではデータベースを使用）
let videos: Video[] = [];

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  videos = videos.filter(video => video.id !== id);
  return NextResponse.json({ success: true });
} 