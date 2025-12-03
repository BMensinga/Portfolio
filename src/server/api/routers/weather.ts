import { Effect } from "effect";
import { z } from "zod";

import { authorizedProcedure, createTRPCRouter } from "~/server/api/trpc";
import { getCurrentWeather } from "~/server/services/weather/weather";
import type { WeatherQuery } from "~/server/services/weather/types";

export {
  type WeatherPayload,
  type WeatherKind,
} from "~/server/services/weather/types";

const weatherInputSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().optional().default("auto"),
  units: z.enum(["metric", "imperial"]).optional().default("metric"),
});

export const weatherRouter = createTRPCRouter({
  current: authorizedProcedure.input(weatherInputSchema).query(({ input }) => {
    const query: WeatherQuery = {
      latitude: input.latitude,
      longitude: input.longitude,
      timezone: input.timezone.trim(),
      units: input.units,
    };

    return Effect.runPromise(getCurrentWeather(query));
  }),
});
