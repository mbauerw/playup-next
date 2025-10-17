-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spotifyId" TEXT,
    "spotifyAccessToken" TEXT,
    "spotifyRefreshToken" TEXT,
    "spotifyTokenExpiry" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."artists" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "genres" TEXT[],
    "imageUrl" TEXT,
    "followerCount" INTEGER,
    "spotifyUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."albums" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "albumType" TEXT NOT NULL,
    "totalTracks" INTEGER NOT NULL,
    "releaseDate" TEXT,
    "releaseDatePrecision" TEXT,
    "imageUrl" TEXT,
    "spotifyUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tracks" (
    "id" TEXT NOT NULL,
    "spotifyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "popularity" INTEGER,
    "durationMs" INTEGER NOT NULL,
    "discNumber" INTEGER NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL,
    "isPlayable" BOOLEAN NOT NULL DEFAULT true,
    "previewUrl" TEXT,
    "isLocal" BOOLEAN NOT NULL DEFAULT false,
    "isrc" TEXT,
    "ean" TEXT,
    "upc" TEXT,
    "albumId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."track_artists" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."album_artists" (
    "id" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "album_artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spotifyPlaylistId" TEXT NOT NULL,
    "playlistName" TEXT NOT NULL,
    "description" TEXT,
    "snapshotId" TEXT NOT NULL,
    "isPublic" BOOLEAN,
    "collaborative" BOOLEAN,
    "followerCount" INTEGER,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "playlist_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."created_playlists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "playlistName" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "collaborative" BOOLEAN NOT NULL DEFAULT false,
    "spotifyPlaylistId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "created_playlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."playlist_entries" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "playlistHistoryId" TEXT,
    "createdPlaylistId" TEXT,
    "addedAt" TIMESTAMP(3) NOT NULL,
    "position" INTEGER NOT NULL,
    "addedBy" TEXT,

    CONSTRAINT "playlist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."listening_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "playedAt" TIMESTAMP(3) NOT NULL,
    "msPlayed" INTEGER,
    "context" TEXT,

    CONSTRAINT "listening_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_spotifyId_key" ON "public"."users"("spotifyId");

-- CreateIndex
CREATE UNIQUE INDEX "artists_spotifyId_key" ON "public"."artists"("spotifyId");

-- CreateIndex
CREATE INDEX "artists_spotifyId_idx" ON "public"."artists"("spotifyId");

-- CreateIndex
CREATE INDEX "artists_name_idx" ON "public"."artists"("name");

-- CreateIndex
CREATE UNIQUE INDEX "albums_spotifyId_key" ON "public"."albums"("spotifyId");

-- CreateIndex
CREATE INDEX "albums_spotifyId_idx" ON "public"."albums"("spotifyId");

-- CreateIndex
CREATE INDEX "albums_name_idx" ON "public"."albums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_spotifyId_key" ON "public"."tracks"("spotifyId");

-- CreateIndex
CREATE INDEX "tracks_spotifyId_idx" ON "public"."tracks"("spotifyId");

-- CreateIndex
CREATE INDEX "tracks_albumId_idx" ON "public"."tracks"("albumId");

-- CreateIndex
CREATE INDEX "tracks_name_idx" ON "public"."tracks"("name");

-- CreateIndex
CREATE INDEX "track_artists_trackId_idx" ON "public"."track_artists"("trackId");

-- CreateIndex
CREATE INDEX "track_artists_artistId_idx" ON "public"."track_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "track_artists_trackId_artistId_key" ON "public"."track_artists"("trackId", "artistId");

-- CreateIndex
CREATE INDEX "album_artists_albumId_idx" ON "public"."album_artists"("albumId");

-- CreateIndex
CREATE INDEX "album_artists_artistId_idx" ON "public"."album_artists"("artistId");

-- CreateIndex
CREATE UNIQUE INDEX "album_artists_albumId_artistId_key" ON "public"."album_artists"("albumId", "artistId");

-- CreateIndex
CREATE INDEX "playlist_history_userId_idx" ON "public"."playlist_history"("userId");

-- CreateIndex
CREATE INDEX "playlist_history_spotifyPlaylistId_idx" ON "public"."playlist_history"("spotifyPlaylistId");

-- CreateIndex
CREATE INDEX "playlist_history_capturedAt_idx" ON "public"."playlist_history"("capturedAt");

-- CreateIndex
CREATE INDEX "created_playlists_userId_idx" ON "public"."created_playlists"("userId");

-- CreateIndex
CREATE INDEX "created_playlists_spotifyPlaylistId_idx" ON "public"."created_playlists"("spotifyPlaylistId");

-- CreateIndex
CREATE INDEX "playlist_entries_trackId_idx" ON "public"."playlist_entries"("trackId");

-- CreateIndex
CREATE INDEX "playlist_entries_playlistHistoryId_idx" ON "public"."playlist_entries"("playlistHistoryId");

-- CreateIndex
CREATE INDEX "playlist_entries_createdPlaylistId_idx" ON "public"."playlist_entries"("createdPlaylistId");

-- CreateIndex
CREATE INDEX "playlist_entries_position_idx" ON "public"."playlist_entries"("position");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_entries_trackId_playlistHistoryId_key" ON "public"."playlist_entries"("trackId", "playlistHistoryId");

-- CreateIndex
CREATE UNIQUE INDEX "playlist_entries_trackId_createdPlaylistId_key" ON "public"."playlist_entries"("trackId", "createdPlaylistId");

-- CreateIndex
CREATE INDEX "listening_history_userId_idx" ON "public"."listening_history"("userId");

-- CreateIndex
CREATE INDEX "listening_history_trackId_idx" ON "public"."listening_history"("trackId");

-- CreateIndex
CREATE INDEX "listening_history_playedAt_idx" ON "public"."listening_history"("playedAt");

-- AddForeignKey
ALTER TABLE "public"."tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_artists" ADD CONSTRAINT "track_artists_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."track_artists" ADD CONSTRAINT "track_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."album_artists" ADD CONSTRAINT "album_artists_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "public"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."album_artists" ADD CONSTRAINT "album_artists_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "public"."artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_history" ADD CONSTRAINT "playlist_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."created_playlists" ADD CONSTRAINT "created_playlists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_entries" ADD CONSTRAINT "playlist_entries_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_entries" ADD CONSTRAINT "playlist_entries_playlistHistoryId_fkey" FOREIGN KEY ("playlistHistoryId") REFERENCES "public"."playlist_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."playlist_entries" ADD CONSTRAINT "playlist_entries_createdPlaylistId_fkey" FOREIGN KEY ("createdPlaylistId") REFERENCES "public"."created_playlists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listening_history" ADD CONSTRAINT "listening_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."listening_history" ADD CONSTRAINT "listening_history_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "public"."tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
