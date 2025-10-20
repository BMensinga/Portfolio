import { TRPCError } from '@trpc/server';
import { Effect } from 'effect';
import { z } from 'zod';

import { authorizedProcedure, createTRPCRouter } from '~/server/api/trpc';
import { env } from '~/env';
import { getDerivedPlaylist } from '~/server/services/music/playlist-cache';

export { type DeezerPlaylistPayload, type DeezerTrackPayload } from '~/server/services/music/types';

const playlistInputSchema = z.object({
  spotifyPlaylistId: z.string().min(1).optional(),
});

export const musicRouter = createTRPCRouter({
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

      return Effect.runPromise(getDerivedPlaylist(spotifyPlaylistId));
    }),
});
