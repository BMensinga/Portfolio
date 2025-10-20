import { Buffer } from 'node:buffer';

import { TRPCError } from '@trpc/server';
import { Cache, Duration, Effect } from 'effect';

import { env } from '~/env';

import type { SpotifyPlaylistData, SpotifyTrack } from './types';

type SpotifyPlaylistResponse = {
  id?: string;
  name?: string;
  description?: string | null;
  external_urls?: { spotify?: string };
  snapshot_id?: string | null;
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

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

const resolveSpotifyUrl = (url: string) => (url.startsWith('http') ? url : `${SPOTIFY_API_BASE}${url}`);

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

const spotifyTokenCache = Effect.runSync(
  Cache.make<string, string, TRPCError>({
    capacity: 1,
    timeToLive: Duration.minutes(50),
    lookup: () => fetchSpotifyAccessToken(),
  }),
);

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

export const fetchSpotifyPlaylistSnapshotId = (playlistId: string) =>
  Effect.gen(function* (_) {
    const token = yield* _(spotifyTokenCache.get('token'));
    const json = yield* _(
      fetchSpotifyJson<{ snapshot_id?: string | null }>(
        `/playlists/${encodeURIComponent(playlistId)}?fields=snapshot_id`,
        token,
        {
          label: 'Spotify playlist snapshot',
          notFoundMessage: 'Spotify playlist not found',
        },
      ),
    );

    return json.snapshot_id?.trim() ?? null;
  });

export const fetchSpotifyPlaylistData = (playlistId: string) =>
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
      snapshotId: playlistJson.snapshot_id?.trim() ?? null,
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
