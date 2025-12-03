import type { TRPCError } from "@trpc/server";
import { Cache, Duration, Effect, Option } from "effect";

import { matchSpotifyTracksWithDeezer } from "./deezer";
import {
  fetchSpotifyPlaylistData,
  fetchSpotifyPlaylistSnapshotId,
} from "./spotify";
import type { DeezerPlaylistPayload, DeezerTrackPayload } from "./types";

type DerivedPlaylistCacheEntry = {
  snapshotId: string | null;
  playlist: DeezerPlaylistPayload;
};

const spotifyDerivedPlaylistCache = Effect.runSync(
  Cache.make<string, DerivedPlaylistCacheEntry, TRPCError>({
    capacity: 4,
    timeToLive: Duration.infinity,
    lookup: (spotifyPlaylistId) => derivePlaylistFromSpotify(spotifyPlaylistId),
  }),
);

const derivePlaylistFromSpotify = (playlistId: string) =>
  Effect.gen(function* (_) {
    const spotifyData = yield* _(fetchSpotifyPlaylistData(playlistId));
    const matchedTracks = yield* _(
      matchSpotifyTracksWithDeezer(spotifyData.tracks),
    );

    const tracks = spotifyData.tracks.map(
      (track, index): DeezerTrackPayload => {
        const matched = matchedTracks[index];

        if (matched) {
          return matched;
        }

        return {
          id: `spotify:${track.id}`,
          name: track.name,
          artists: track.artists,
          externalUrl: track.externalUrl,
          previewUrl: null,
          durationMs: track.durationMs,
          imageUrl: spotifyData.info.imageUrl,
        } satisfies DeezerTrackPayload;
      },
    );

    const playlist: DeezerPlaylistPayload = {
      id: spotifyData.info.id,
      name: spotifyData.info.name,
      description: spotifyData.info.description,
      externalUrl:
        spotifyData.info.externalUrl ??
        `https://open.spotify.com/playlist/${playlistId}`,
      imageUrl: spotifyData.info.imageUrl,
      curatorName: spotifyData.info.ownerName,
      totalTracks: tracks.length,
      tracks,
    };

    return {
      snapshotId: spotifyData.snapshotId,
      playlist,
    } satisfies DerivedPlaylistCacheEntry;
  });

export const getDerivedPlaylist = (playlistId: string) =>
  Effect.gen(function* (_) {
    const cachedEntryOption = yield* _(
      spotifyDerivedPlaylistCache.getOption(playlistId),
    );

    if (Option.isSome(cachedEntryOption)) {
      const cachedEntry = cachedEntryOption.value;
      const latestSnapshotId = yield* _(
        fetchSpotifyPlaylistSnapshotId(playlistId),
      );

      if (latestSnapshotId !== cachedEntry.snapshotId) {
        yield* _(spotifyDerivedPlaylistCache.invalidate(playlistId));
        const refreshedEntry = yield* _(
          spotifyDerivedPlaylistCache.get(playlistId),
        );
        return refreshedEntry.playlist;
      }

      return cachedEntry.playlist;
    }

    const entry = yield* _(spotifyDerivedPlaylistCache.get(playlistId));
    return entry.playlist;
  });
