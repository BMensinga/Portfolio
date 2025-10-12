'use client'

import {
  SunIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudLightningIcon,
  CloudyIcon,
  CloudSunIcon,
  CloudFogIcon,
  CloudDrizzleIcon,
  CloudHailIcon,
} from "lucide-react";
import type { ComponentProps } from 'react';

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

type WeatherIconProps = ComponentProps<typeof SunIcon> & {
  kind: WeatherKind;
};

const iconMap: Record<WeatherKind, typeof SunIcon> = {
  clear: SunIcon,
  'mostly-clear': CloudSunIcon,
  'partly-cloudy': CloudSunIcon,
  overcast: CloudyIcon,
  fog: CloudFogIcon,
  drizzle: CloudDrizzleIcon,
  rain: CloudRainIcon,
  'freezing-rain': CloudHailIcon,
  snow: CloudSnowIcon,
  thunderstorm: CloudLightningIcon,
};

const labelMap: Record<WeatherKind, string> = {
  clear: 'Clear skies',
  'mostly-clear': 'Mostly clear',
  'partly-cloudy': 'Partly cloudy',
  overcast: 'Overcast',
  fog: 'Foggy',
  drizzle: 'Drizzle',
  rain: 'Rain',
  'freezing-rain': 'Freezing rain',
  snow: 'Snow',
  thunderstorm: 'Thunderstorm',
};

export function WeatherIcon({ kind, ...props }: WeatherIconProps) {
  const Icon = iconMap[kind];

  return <Icon aria-label={labelMap[kind]} {...props} />;
}
