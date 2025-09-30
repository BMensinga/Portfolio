import { z } from 'zod';
import { Cache, Duration, Effect } from 'effect';

import { createTRPCRouter, authorizedProcedure } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

const weatherInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional().default('auto'),
  units: z.enum(['metric', 'imperial']).optional().default('metric'),
});

type WeatherInput = z.infer<typeof weatherInputSchema>;

export type WeatherPayload = {
  temperature: number | null;
  weatherCode: number | null;
  observedAt: string | null;
  units: WeatherInput['units'];
  kind: ReturnType<typeof mapWeatherCode>;
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

const fetchWeather = (input: WeatherInput) =>
  Effect.gen(function* (_) {
    const params = new URLSearchParams({
      latitude: input.latitude.toString(),
      longitude: input.longitude.toString(),
      current_weather: 'true',
      timezone: input.timezone,
      ...unitMapping[input.units],
    });

    const response = yield* _(
      Effect.tryPromise({
        try: () => fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`),
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to reach Open-Meteo',
            cause,
          }),
      }),
    );

    if (!response.ok) {
      yield* _(
        Effect.fail(
          new TRPCError({
            code: 'BAD_REQUEST',
            message: `Open-Meteo responded with status ${response.status}`,
          }),
        ),
      );
    }

    const json = (yield* _(
      Effect.tryPromise({
        try: () => response.json() as Promise<{
          current_weather?: {
            temperature?: number;
            weathercode?: number;
            time?: string;
          };
        }>,
        catch: (cause) =>
          new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to parse weather response',
            cause,
          }),
      }),
    )) as {
      current_weather?: {
        temperature?: number;
        weathercode?: number;
        time?: string;
      };
    };

    if (!json.current_weather) {
      yield* _(
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
      weathercode = null,
      time: observedAt = null,
    } = json.current_weather!;

    return {
      temperature,
      weatherCode: weathercode,
      observedAt,
      units: input.units,
      kind: mapWeatherCode(weathercode ?? null),
    } satisfies WeatherPayload;
  });

function mapWeatherCode(code: number | null) {
  if (code === null) {
    return 'clear' as const;
  }

  if (code === 0) return 'clear' as const;
  if (code === 1) return 'mostly-clear' as const;
  if (code === 2) return 'partly-cloudy' as const;
  if (code === 3) return 'overcast' as const;
  if (code === 45 || code === 48) return 'fog' as const;
  if ([51, 53, 55, 56, 57].includes(code)) return 'drizzle' as const;
  if ([61, 63, 65, 80, 81, 82].includes(code)) return 'rain' as const;
  if (code === 66 || code === 67) return 'freezing-rain' as const;
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow' as const;
  if ([95, 96, 99].includes(code)) return 'thunderstorm' as const;
  return 'clear' as const;
}
