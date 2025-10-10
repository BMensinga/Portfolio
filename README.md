# Portfolio

A personal portfolio built with the Next.js app router, showcasing interactive cards, rich animations, and server-backed data. It features a Spotify-inspired music experience that pulls preview snippets from Deezer under the hood, along with real-time weather data and other dynamic UI elements.

## Highlights

- **Spotify-style music card** – enter any Spotify playlist ID and the backend resolves tracks against Deezer so visitors can play public previews.
- **Custom weather display** – fetches current conditions from Open-Meteo and maps raw weather codes into friendly UI states.
- **Motion-first UI** – volume controls, track transitions, and hover states are built with Motion for precise, state-aware animations.
- **Type-safe backend** – tRPC + Effect handle routing, caching, and retries with strong typing from Zod and TypeScript end-to-end.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **State / Data:** tRPC, Effect, @tanstack/react-query
- **Styling & Animations:** Tailwind, Motion
- **Tooling:** ESLint, Prettier, TypeScript

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file and copy the values from `.env.example`:

```env
TRPC_AUTH_TOKEN=your-secure-token

SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_PLAYLIST_ID=the-playlist-to-show
```

- **TRPC_AUTH_TOKEN** protects the server routes. The same token is sent from server components when calling tRPC.
- **Spotify credentials** are used only to read playlist metadata via the client-credentials flow.

### 3. Run the development server

```bash
npm run dev
```

Open <http://localhost:3000> to view the site. The Spotify-like card should hydrate with the configured playlist, and the hero bar will display live weather data.

## Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Build the production bundle |
| `npm run start` | Run the production server locally |
| `npm run typecheck` | Type-check the project with `tsc --noEmit` |
| `npm run lint` | Run ESLint |

## Architecture Notes

- **Caching:** Weather responses and playlist lookups are cached to avoid repeated upstream calls. Spotify tokens are cached until expiry.
- **Playlist ingestion:** The backend fetches tracks from Spotify, then searches Deezer for previews (Spotify has deprecated their preview functionality of songs). The matching keys are cached so repeated lookups are instant.
- **Weather mapping:** Weather codes are normalized to a fixed set of UI-friendly categories before rendering, centralizing the mapping logic.

## Deployment

The project ships as a standard Next.js app.

## License

Released under the [MIT License](./LICENSE) © Bas Mensinga.

## Credits

- Weather data provided by [Open-Meteo](https://open-meteo.com/).
- Track metadata powered by [Spotify Web API](https://developer.spotify.com/documentation/web-api/) with previews served via [Deezer](https://developers.deezer.com/api).
- UI icons are mostly provided by Lucide.
