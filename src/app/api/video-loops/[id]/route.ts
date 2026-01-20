import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.videoLoop.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ message: '動画ループを削除しました' });
  } catch (error) {
    console.error('動画ループの削除中にエラーが発生しました:', error);
    return NextResponse.json(
      { error: '動画ループの削除中にエラーが発生しました' },
      { status: 500 }
    );
  }
} 