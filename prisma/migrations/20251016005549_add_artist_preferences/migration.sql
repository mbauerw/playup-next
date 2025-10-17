-- CreateTable
CREATE TABLE "public"."artist_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "playlistHistoryId" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "artist_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "artist_preferences_userId_idx" ON "public"."artist_preferences"("userId");

-- CreateIndex
CREATE INDEX "artist_preferences_artistId_idx" ON "public"."artist_preferences"("artistId");

-- CreateIndex
CREATE INDEX "artist_preferences_playlistHistoryId_idx" ON "public"."artist_preferences"("playlistHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "artist_preferences_userId_artistId_playlistHistoryId_key" ON "public"."artist_preferences"("userId", "artistId", "playlistHistoryId");

-- AddForeignKey
ALTER TABLE "public"."artist_preferences" ADD CONSTRAINT "artist_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."artist_preferences" ADD CONSTRAINT "artist_preferences_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."artist_preferences" ADD CONSTRAINT "artist_preferences_playlistHistoryId_fkey" FOREIGN KEY ("playlistHistoryId") REFERENCES "public"."playlist_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;
