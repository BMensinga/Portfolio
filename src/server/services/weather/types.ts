export type WeatherUnits = 'metric' | 'imperial';

export type WeatherQuery = {
  latitude: number;
  longitude: number;
  timezone: string;
  units: WeatherUnits;
};

export type WeatherKind =
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
  units: WeatherUnits;
  kind: WeatherKind;
};
