-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_loops" (
    "id" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "startTime" DOUBLE PRECISION NOT NULL,
    "endTime" DOUBLE PRECISION NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "video_loops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoLoopId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "video_loop_tags" (
    "id" TEXT NOT NULL,
    "videoLoopId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "video_loop_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "video_loops_videoId_idx" ON "video_loops"("videoId");

-- CreateIndex
CREATE INDEX "video_loops_userId_idx" ON "video_loops"("userId");

-- CreateIndex
CREATE INDEX "video_loops_isPublic_idx" ON "video_loops"("isPublic");

-- CreateIndex
CREATE INDEX "video_loops_createdAt_idx" ON "video_loops"("createdAt");

-- CreateIndex
CREATE INDEX "video_loops_deletedAt_idx" ON "video_loops"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_videoLoopId_key" ON "favorites"("userId", "videoLoopId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "video_loop_tags_videoLoopId_tagId_key" ON "video_loop_tags"("videoLoopId", "tagId");

-- AddForeignKey
ALTER TABLE "video_loops" ADD CONSTRAINT "video_loops_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_videoLoopId_fkey" FOREIGN KEY ("videoLoopId") REFERENCES "video_loops"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_loop_tags" ADD CONSTRAINT "video_loop_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "video_loop_tags" ADD CONSTRAINT "video_loop_tags_videoLoopId_fkey" FOREIGN KEY ("videoLoopId") REFERENCES "video_loops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
