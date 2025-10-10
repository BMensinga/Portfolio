'use client'

import { Globe } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "~/app/libs/utils";
import Link from "next/link";
import { useMenuBarVisibility } from "~/app/providers/menu-bar-visibility-provider";
import { useState } from "react";
import { useCurrentTime } from "~/app/hooks/use-current-time";
import { ClockIcon } from "~/app/components/icons/clock";
import { WeatherIcon } from "~/app/components/icons/weather";
import type { WeatherPayload } from "~/server/api/routers/weather";

type MenuBarProps = {
  weather?: WeatherPayload | null;
};

export function MenuBar({ weather }: MenuBarProps) {
  const time = useCurrentTime();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const { scrollYProgress } = useScroll();
  const { isIntroInView } = useMenuBarVisibility();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const shouldCollapse = latest > 0.02;
    setIsScrolled((prev) => (prev === shouldCollapse ? prev : shouldCollapse));
  });

  return (
    <header className={'w-full fixed z-30 pointer-events-none flex justify-center'}>
      <motion.div
        className={cn(
          'transition-all duration-300 m-0 py-4 px-4 2xl:mx-auto border-border pointer-events-auto grow',
          isScrolled
            ? 'max-w-screen-lg mt-2 rounded-xl py-3 mx-2 border'
            : 'max-w-[100dvw] border-b',
          isIntroInView
            ? 'bg-white/25 backdrop-blur-2xl'
            : 'bg-white'
        )}
      >
        <div className={'flex flex-col sm:flex-row gap-2 justify-between mx-auto'}>
          <Link href={'/'} className={'text-2xl font-medium text-brand hover:text-brand/90'}>
            Bas Mensinga
          </Link>
          <div className={'flex gap-2'}>
            <div className={cn(
              'rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center transition-all duration-300',
              isIntroInView
                ? 'bg-white/50'
                : 'bg-surface-alt'
            )}>
              <Globe className={'size-3.5 text-ink-muted'}/>
              <span className={'text-ink-muted font-normal text-xs sm:text-sm'}>Gouda • The Netherlands</span>
            </div>
            <div className={'w-px py-1 flex'}><span className={'bg-divider rounded-full h-full w-px'} /></div>
            <div className={'flex gap-2'}>
              <div className={cn(
                'rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center transition-all duration-300',
                isIntroInView
                  ? 'bg-white/50'
                  : 'bg-surface-alt'
              )}>
                <ClockIcon className={'size-3.5 text-ink-muted'}/>
                <time className={'flex gap-px items-center justify-center text-ink-muted font-normal text-xs sm:text-sm'}>
                  <span className={'tabular-nums'}>{hours}</span>
                  <span className={'time-colon pb-0.5'}>:</span>
                  <span className={'tabular-nums'}>{minutes}</span>
                </time>
              </div>
              <div className={cn(
                'rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center transition-all duration-300',
                isIntroInView
                  ? 'bg-white/50'
                  : 'bg-surface-alt'
              )}>
                <WeatherIcon kind={weather?.kind ?? 'clear'} className={'size-3.5 text-ink-muted'} />
                <div className={'flex flex-col leading-none'}>
                  <span className={'text-ink-muted font-normal tabular-nums text-xs sm:text-sm'}>
                    {weather ? `${Math.round(weather.temperature ?? 0)}°C` : '—'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
