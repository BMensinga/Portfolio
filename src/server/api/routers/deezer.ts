import { Buffer } from 'node:buffer';

import { TRPCError } from '@trpc/server';
import { Cache, Duration, Effect } from 'effect';
import { z } from 'zod';

import { authorizedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { env } from '~/env';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';
const DEEZER_API_BASE = 'https://api.deezer.com';

const playlistInputSchema = z.object({
  spotifyPlaylistId: z.string().min(1).optional(),
});

export type DeezerPlaylistPayload = {
  id: string;
  name: string;
  description: string | null;
  externalUrl: string;
  imageUrl: string | null;
  curatorName: string | null;
  totalTracks: number;
  tracks: DeezerTrackPayload[];
};

export type DeezerTrackPayload = {
  id: string;
  name: string;
  artists: string[];
  externalUrl: string | null;
  previewUrl: string | null;
  durationMs: number | null;
  imageUrl: string | null;
};

type SpotifyTrack = {
  id: string;
  name: string;
  artists: string[];
  externalUrl: string | null;
  durationMs: number | null;
};

type SpotifyPlaylistData = {
  info: {
    id: string;
    name: string;
    description: string | null;
    externalUrl: string | null;
    imageUrl: string | null;
    ownerName: string | null;
  };
  tracks: SpotifyTrack[];
};

const buildDeezerSearchKey = (track: SpotifyTrack) =>
  JSON.stringify({ name: track.name, artists: track.artists });

const matchSpotifyTracksWithDeezer = (tracks: SpotifyTrack[]) =>
  Effect.forEach(
    tracks,
    (track) => deezerTrackSearchCache.get(buildDeezerSearchKey(track)),
    { concurrency: 6 },
  );

const resolveSpotifyUrl = (url: string) =>
  url.startsWith('http') ? url : `${SPOTIFY_API_BASE}${url}`;

const fetchSpotifyJson = <T>(
  url: string,
  token: string,
  options: { label: string; notFoundMessage?: string },
) =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        try: () =>
          fetch(resolveSpotifyUrl(url), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to reach ${options.label}`,
            cause,
          }),
      }),
    );

    if (response.status === 404 && options.notFoundMessage) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'NOT_FOUND',
            message: options.notFoundMessage,
          }),
        ),
      );
    }

    if (!response.ok) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'BAD_REQUEST',
            message: `${options.label} failed with status ${response.status}`,
          }),
        ),
      );
    }

    const json = (yield* _(
      Effect.tryPromise({
        try: () => response.json() as Promise<T>,
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Failed to parse ${options.label}`,
            cause,
          }),
      }),
    ));

    return json;
  });

const spotifyDerivedPlaylistCache = Effect.runSync(
  Cache.make<string, DeezerPlaylistPayload, TRPCError>({
    capacity: 4,
    timeToLive: Duration.minutes(10),
    lookup: (spotifyPlaylistId) => derivePlaylistFromSpotify(spotifyPlaylistId),
  }),
);

const spotifyTokenCache = Effect.runSync(
  Cache.make<string, string, TRPCError>({
    capacity: 1,
    timeToLive: Duration.minutes(50),
    lookup: () => fetchSpotifyAccessToken(),
  }),
);

const deezerTrackSearchCache = Effect.runSync(
  Cache.make<string, DeezerTrackPayload | null, TRPCError>({
    capacity: 256,
    timeToLive: Duration.minutes(30),
    lookup: (key) => lookupDeezerTrack(JSON.parse(key) as DeezerTrackSearchKey),
  }),
);

export const deezerRouter = createTRPCRouter({
  playlist: authorizedProcedure
    .input(playlistInputSchema.optional())
    .query(({ input }) => {
      const spotifyPlaylistId = input?.spotifyPlaylistId?.trim() ?? env.SPOTIFY_PLAYLIST_ID?.trim();

      if (!spotifyPlaylistId) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Spotify playlist id is not configured',
        });
      }

      return Effect.runPromise(spotifyDerivedPlaylistCache.get(spotifyPlaylistId));
    }),
});

const derivePlaylistFromSpotify = (playlistId: string) =>
  Effect.gen(function* (_) {
    const spotifyData = yield* _(fetchSpotifyPlaylistData(playlistId));
    const matchedTracks = yield* _(matchSpotifyTracksWithDeezer(spotifyData.tracks));

    const tracks = spotifyData.tracks.map((track, index) => {
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
    });

    return {
      id: spotifyData.info.id,
      name: spotifyData.info.name,
      description: spotifyData.info.description,
      externalUrl: spotifyData.info.externalUrl ?? `https://open.spotify.com/playlist/${playlistId}`,
      imageUrl: spotifyData.info.imageUrl,
      curatorName: spotifyData.info.ownerName,
      totalTracks: tracks.length,
      tracks,
    } satisfies DeezerPlaylistPayload;
  });

const fetchSpotifyAccessToken = () =>
  Effect.gen(function* (_) {
    const clientId = env.SPOTIFY_CLIENT_ID?.trim();
    const clientSecret = env.SPOTIFY_CLIENT_SECRET?.trim();

    if (!clientId || !clientSecret) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Spotify client credentials are not configured',
          }),
        ),
      );
    }

    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const response = yield* _(
      Effect.tryPromise({
        try: () =>
          fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
              Authorization: `Basic ${basicAuth}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
          }),
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reach Spotify token endpoint',
            cause,
          }),
      }),
    );

    if (!response.ok) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'BAD_REQUEST',
            message: `Spotify token request failed with status ${response.status}`,
          }),
        ),
      );
    }

    const json = (yield* _(
      Effect.tryPromise({
        try: () =>
          response.json() as Promise<{ access_token?: string }>,
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse Spotify token response',
            cause,
          }),
      }),
    )) as { access_token?: string };

    const token = json.access_token?.trim();
    if (!token) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Spotify token response did not include an access token',
          }),
        ),
      );
    }

    return token;
  });

const fetchSpotifyPlaylistData = (playlistId: string): Effect.Effect<SpotifyPlaylistData, TRPCError> =>
  Effect.gen(function* (_) {
    const token = yield* _(spotifyTokenCache.get('token'));
    const playlistJson = yield* _(
      fetchSpotifyJson<SpotifyPlaylistResponse>(
        `/playlists/${encodeURIComponent(playlistId)}`,
        token,
        {
          label: 'Spotify playlist endpoint',
          notFoundMessage: 'Spotify playlist not found',
        },
      ),
    );

    if (!playlistJson.id || !playlistJson.name) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Spotify playlist response missing expected fields',
          }),
        ),
      );
    }

    const tracks: SpotifyTrack[] = [];
    tracks.push(...extractSpotifyTracks(playlistJson.tracks?.items ?? []));

    const additionalTracks = yield* _(collectSpotifyTrackPages(playlistJson.tracks?.next ?? null, token));
    tracks.push(...additionalTracks);

    const imageUrl = playlistJson.images?.[0]?.url ?? null;

    return {
      info: {
        id: playlistJson.id,
        name: playlistJson.name,
        description: playlistJson.description ?? null,
        externalUrl: playlistJson.external_urls?.spotify ?? null,
        imageUrl,
        ownerName: playlistJson.owner?.display_name ?? null,
      },
      tracks,
    } satisfies SpotifyPlaylistData;
  });

const collectSpotifyTrackPages = (nextUrl: string | null, token: string) =>
  Effect.gen(function* (_) {
    if (!nextUrl) {
      return [] as SpotifyTrack[];
    }

    const tracks: SpotifyTrack[] = [];
    let cursor: string | null = nextUrl;

    while (cursor) {
      const pageJson: SpotifyPlaylistTracksPage = yield* _(
        fetchSpotifyJson<SpotifyPlaylistTracksPage>(cursor, token, {
          label: 'Spotify playlist page',
        }),
      );

      tracks.push(...extractSpotifyTracks(pageJson.items ?? []));
      cursor = pageJson.next ?? null;
    }

    return tracks;
  });

const extractSpotifyTracks = (items: SpotifyPlaylistTrackItem[]): SpotifyTrack[] =>
  items
    .map((item) => {
      const track = item?.track;
      if (!track || track.is_local || track.type !== 'track') {
        return null;
      }

      const name = track.name?.trim();
      if (!name) {
        return null;
      }

      const artists = (track.artists ?? [])
        .map((artist) => artist?.name?.trim())
        .filter((artist): artist is string => Boolean(artist));

      return {
        id: track.id ?? `unknown-${Math.random()}`,
        name,
        artists,
        externalUrl: track.external_urls?.spotify ?? null,
        durationMs: track.duration_ms ?? null,
      } satisfies SpotifyTrack;
    })
    .filter((track): track is SpotifyTrack => Boolean(track));

type DeezerTrackSearchKey = {
  name: string;
  artists: string[];
};

const lookupDeezerTrack = ({ name, artists }: DeezerTrackSearchKey) =>
  Effect.gen(function* (_) {
    const primaryArtist = artists[0] ?? '';
    const query = primaryArtist
      ? `artist:"${primaryArtist}" track:"${name}"`
      : `track:"${name}"`;

    const response = yield* _(
      Effect.tryPromise({
        try: () =>
          fetch(`${DEEZER_API_BASE}/search?q=${encodeURIComponent(query)}&limit=5`),
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reach Deezer search API',
            cause,
          }),
      }),
    );

    if (!response.ok) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'BAD_REQUEST',
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
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse Deezer search response',
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
      return normalizedArtists.some((artist) => candidateArtists.includes(artist));
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

const normalizeString = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const buildArtistList = (track: DeezerTrack) => {
  const contributors = track.contributors ?? [];
  const artists = new Set<string>();

  if (track.artist?.name) artists.add(track.artist.name);
  for (const contributor of contributors) {
    if (contributor?.name) artists.add(contributor.name);
  }

  return Array.from(artists);
};

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

type SpotifyPlaylistResponse = {
  id?: string;
  name?: string;
  description?: string | null;
  external_urls?: { spotify?: string };
  images?: Array<{ url?: string | null }>;
  owner?: { display_name?: string | null } | null;
  tracks?: SpotifyPlaylistTracksPage;
};

type SpotifyPlaylistTracksPage = {
  items?: SpotifyPlaylistTrackItem[];
  next?: string | null;
};

type SpotifyPlaylistTrackItem = {
  track?: {
    id?: string;
    name?: string | null;
    duration_ms?: number | null;
    external_urls?: { spotify?: string | null };
    artists?: Array<{ name?: string | null } | null> | null;
    is_local?: boolean | null;
    type?: string | null;
  } | null;
};
