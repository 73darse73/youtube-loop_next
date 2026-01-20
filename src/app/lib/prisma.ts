import { PrismaClient } from '@prisma/client'

// PrismaClientのグローバルシングルトンインスタンス
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// 開発環境では複数のインスタンスが作成されるのを防ぐ
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 