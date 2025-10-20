import { TRPCError } from '@trpc/server';
import { Cache, Duration, Effect } from 'effect';

import type { WeatherKind, WeatherPayload, WeatherQuery, WeatherUnits } from './types';

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

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
} as const;

const UNIT_MAPPING = {
  metric: {
    temperature_unit: 'celsius',
    windspeed_unit: 'kmh',
  },
  imperial: {
    temperature_unit: 'fahrenheit',
    windspeed_unit: 'mph',
  },
} as const satisfies Record<WeatherUnits, Record<string, string>>;

const serializeQuery = (query: WeatherQuery) =>
  JSON.stringify([query.latitude, query.longitude, query.timezone, query.units]);

const deserializeQuery = (key: string): WeatherQuery => {
  const [latitude, longitude, timezone, units] = JSON.parse(key) as [
    number,
    number,
    string,
    WeatherUnits,
  ];

  return {
    latitude,
    longitude,
    timezone,
    units,
  };
};

const currentWeatherCache = Effect.runSync(
  Cache.make<string, WeatherPayload, TRPCError>({
    capacity: 64,
    timeToLive: Duration.minutes(5),
    lookup: (key) => fetchWeather(deserializeQuery(key)),
  }),
);

export const getCurrentWeather = (query: WeatherQuery) =>
  currentWeatherCache.get(serializeQuery(query));

const fetchWeather = (query: WeatherQuery) =>
  Effect.gen(function* (_) {
    const payload = yield* _(requestCurrentWeather(query));

    const currentWeather = payload.current_weather;
    if (!currentWeather) {
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
    } = currentWeather;

    return {
      temperature,
      weatherCode,
      observedAt,
      units: query.units,
      kind: mapWeatherCode(weatherCode),
    } satisfies WeatherPayload;
  });

type OpenMeteoResponse = {
  current_weather?: {
    temperature?: number;
    weathercode?: number;
    time?: string;
  } | null;
};

const requestCurrentWeather = (query: WeatherQuery) =>
  Effect.gen(function* (_) {
    const response = yield* _(
      Effect.tryPromise({
        try: () => fetch(buildWeatherUrl(query)),
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

    return yield* _(
      Effect.tryPromise({
        try: () => response.json() as Promise<OpenMeteoResponse>,
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse weather response',
            cause,
          }),
      }),
    );
  });

const buildWeatherUrl = (query: WeatherQuery) => {
  const url = new URL(OPEN_METEO_BASE_URL);
  url.search = new URLSearchParams({
    latitude: query.latitude.toString(),
    longitude: query.longitude.toString(),
    current_weather: 'true',
    timezone: query.timezone,
    ...UNIT_MAPPING[query.units],
  }).toString();
  return url.toString();
};

const mapWeatherCode = (code: number | null): WeatherKind => {
  if (code == null) {
    return 'clear';
  }

  return WEATHER_KIND_BY_CODE[code] ?? 'clear';
};
