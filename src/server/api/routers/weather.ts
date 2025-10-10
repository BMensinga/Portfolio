import { z } from 'zod';
import { Cache, Duration, Effect } from 'effect';

import { createTRPCRouter, authorizedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const weatherInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional().default('auto'),
  units: z.enum(['metric', 'imperial']).optional().default('metric'),
});

type WeatherInput = z.infer<typeof weatherInputSchema>;

type WeatherKind =
  | 'clear'
  | 'mostly-clear'
  | 'partly-cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'thunderstorm';

export type WeatherPayload = {
  temperature: number | null;
  weatherCode: number | null;
  observedAt: string | null;
  units: WeatherInput['units'];
  kind: WeatherKind;
};

const unitMapping = {
  metric: {
    temperature_unit: 'celsius',
    windspeed_unit: 'kmh',
  },
  imperial: {
    temperature_unit: 'fahrenheit',
    windspeed_unit: 'mph',
  },
} as const satisfies Record<WeatherInput['units'], Record<string, string>>;

const CACHE_DURATION_MS = 5 * 60 * 1000;

const serializeKey = (input: WeatherInput) =>
  JSON.stringify([input.latitude, input.longitude, input.timezone, input.units]);

const deserializeKey = (key: string): WeatherInput => {
  const [latitude, longitude, timezone, units] = JSON.parse(key) as [
    number,
    number,
    string,
    WeatherInput['units'],
  ];

  return {
    latitude,
    longitude,
    timezone,
    units,
  };
};

const weatherCache = Effect.runSync(
  Cache.make<string, WeatherPayload, TRPCError>({
    capacity: 64,
    timeToLive: Duration.millis(CACHE_DURATION_MS),
    lookup: (key) => fetchWeather(deserializeKey(key)),
  }),
);

export const weatherRouter = createTRPCRouter({
  current: authorizedProcedure.input(weatherInputSchema).query(({ input }) => {
    return Effect.runPromise(weatherCache.get(serializeKey(input)));
  }),
});

const WEATHER_KIND_BY_CODE: Record<number, WeatherKind> = {
  0: 'clear',
  1: 'mostly-clear',
  2: 'partly-cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'fog',
  51: 'drizzle',
  53: 'drizzle',
  55: 'drizzle',
  56: 'drizzle',
  57: 'drizzle',
  61: 'rain',
  63: 'rain',
  65: 'rain',
  66: 'freezing-rain',
  67: 'freezing-rain',
  71: 'snow',
  73: 'snow',
  75: 'snow',
  77: 'snow',
  80: 'rain',
  81: 'rain',
  82: 'rain',
  85: 'snow',
  86: 'snow',
  95: 'thunderstorm',
  96: 'thunderstorm',
  99: 'thunderstorm',
};

type OpenMeteoResponse = {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
    time?: string;
  } | null;
};

const buildWeatherUrl = (input: WeatherInput) => {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.search = new URLSearchParams({
    latitude: input.latitude.toString(),
    longitude: input.longitude.toString(),
    current_weather: 'true',
    timezone: input.timezone,
    ...unitMapping[input.units],
  }).toString();
  return url.toString();
};

const fetchWeather = (input: WeatherInput) =>
  Effect.gen(function* (_) {
    const payload = yield* _(requestCurrentWeather(input));

    if (!payload.current_weather) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'NOT_FOUND',
            message: 'No current weather data for the provided coordinates',
          }),
        ),
      );
    }

    const {
      temperature = null,
      weathercode: weatherCode = null,
      time: observedAt = null,
    } = payload.current_weather;

    return {
      temperature,
      weatherCode,
      observedAt,
      units: input.units,
      kind: mapWeatherCode(weatherCode),
    } satisfies WeatherPayload;
  });

const requestCurrentWeather = (input: WeatherInput) =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        try: () => fetch(buildWeatherUrl(input)),
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reach Open-Meteo',
            cause,
          }),
      }),
    );

    if (!response.ok) {
      return yield* _(
        Effect.fail(
          new TRPCError({
            code: 'BAD_REQUEST',
            message: `Open-Meteo responded with status ${response.status}`,
          }),
        ),
      );
    }

    return (
      yield* _(
      Effect.tryPromise({
        try: () => response.json() as Promise<OpenMeteoResponse>,
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse weather response',
            cause,
          }),
      }),
    ));
  });

const mapWeatherCode = (code: number | null): WeatherKind => {
  if (code == null) {
    return 'clear';
  }

  return WEATHER_KIND_BY_CODE[code] ?? 'clear';
};
