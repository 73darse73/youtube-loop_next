-- AlterTable
ALTER TABLE "video_loops" ADD COLUMN "deletedAt" DATETIME;

-- CreateIndex
CREATE INDEX "video_loops_deletedAt_idx" ON "video_loops"("deletedAt");
