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

export type SpotifyTrack = {
  id: string;
  name: string;
  artists: string[];
  externalUrl: string | null;
  durationMs: number | null;
};

export type SpotifyPlaylistData = {
  snapshotId: string | null;
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
