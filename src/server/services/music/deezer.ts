import { TRPCError } from "@trpc/server";
import { Cache, Duration, Effect } from "effect";

import type { DeezerTrackPayload, SpotifyTrack } from "./types";
import { normalizeString } from "./utils";

const DEEZER_API_BASE = "https://api.deezer.com";

type DeezerTracklistResponse = {
  data?: DeezerTrack[];
};

type DeezerTrack = {
  id?: number;
  title?: string;
  link?: string | null;
  duration?: number | null;
  preview?: string | null;
  artist?: {
    id?: number;
    name?: string;
  } | null;
  contributors?: Array<{
    id?: number;
    name?: string;
  }> | null;
  album?: {
    cover?: string | null;
    cover_medium?: string | null;
    cover_big?: string | null;
    cover_xl?: string | null;
  } | null;
};

type DeezerTrackSearchKey = {
  name: string;
  artists: string[];
};

const deezerTrackSearchCache = Effect.runSync(
  Cache.make<string, DeezerTrackPayload | null, TRPCError>({
    capacity: 256,
    timeToLive: Duration.minutes(30),
    lookup: (key) => lookupDeezerTrack(JSON.parse(key) as DeezerTrackSearchKey),
  }),
);

export const matchSpotifyTracksWithDeezer = (tracks: SpotifyTrack[]) =>
  Effect.forEach(
    tracks,
    (track) => deezerTrackSearchCache.get(buildDeezerSearchKey(track)),
    { concurrency: 6 },
  );

const buildDeezerSearchKey = (track: SpotifyTrack) =>
  JSON.stringify({ name: track.name, artists: track.artists });

const lookupDeezerTrack = ({ name, artists }: DeezerTrackSearchKey) =>
  Effect.gen(function* (_) {
    const primaryArtist = artists[0] ?? "";
    const query = primaryArtist
      ? `artist:"${primaryArtist}" track:"${name}"`
      : `track:"${name}"`;

    const response = yield* _(
      Effect.tryPromise({
        try: () =>
          fetch(
            `${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=5`,
          ),
        catch: (cause) =>
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to reach Deezer search API",
            cause,
          }),
      }),
    );

    if (!response.ok) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: "BAD_REQUEST",
            message: `Deezer search failed with status ${response.status}`,
          }),
        ),
      );
    }

    const json = (yield* _(
      Effect.tryPromise({
        try: () => response.json(),
        catch: (cause) =>
          new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to parse Deezer search response",
            cause,
          }),
      }),
    )) as DeezerTracklistResponse;

    const candidates = json.data ?? [];
    if (candidates.length === 0) {
      return null;
    }

    const normalizedName = normalizeString(name);
    const normalizedArtists = artists.map(normalizeString).filter(Boolean);

    const preferred = candidates.find((candidate) => {
      if (!candidate?.title) return false;
      const candidateName = normalizeString(candidate.title);
      if (candidateName !== normalizedName) return false;

      if (normalizedArtists.length === 0) {
        return true;
      }

      const candidateArtists = buildArtistList(candidate).map(normalizeString);
      return normalizedArtists.some((artist) =>
        candidateArtists.includes(artist),
      );
    });

    const chosen = preferred ?? candidates[0];
    if (!chosen?.id || !chosen.title) {
      return null;
    }

    const artistsList = buildArtistList(chosen);

    return {
      id: String(chosen.id),
      name: chosen.title,
      artists: artistsList,
      externalUrl: chosen.link ?? null,
      previewUrl: chosen.preview ?? null,
      durationMs: chosen.duration != null ? chosen.duration * 1000 : null,
      imageUrl:
        chosen.album?.cover_xl ??
        chosen.album?.cover_big ??
        chosen.album?.cover_medium ??
        chosen.album?.cover ??
        null,
    } satisfies DeezerTrackPayload;
  });

const buildArtistList = (track: DeezerTrack) => {
  const contributors = track.contributors ?? [];
  const artists = new Set<string>();

  if (track.artist?.name) artists.add(track.artist.name);
  for (const contributor of contributors) {
    if (contributor?.name) artists.add(contributor.name);
  }

  return Array.from(artists);
};
