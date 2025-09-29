'use client'

import { Card } from "~/app/components/card";
import { SkipBackwardIcon } from "~/app/components/icons/music-player/skip-backward";
import { SkipForwardIcon } from "~/app/components/icons/music-player/skip-forward";
import { PauseIcon } from "~/app/components/icons/music-player/pause";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "~/app/libs/utils";

export function SpotifyCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const clipPath = useMemo(
    () => (isExpanded ? 'circle(160% at 88% 8%)' : 'circle(0% at calc(100% - 52px) 56px)'),
    [isExpanded],
  );


  return (
    <Card className={'relative'}>
      <motion.div
        className={'pointer-events-none absolute inset-0 z-0 rounded-2xl bg-black'}
        initial={false}
        animate={{ clipPath }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden={'true'}
      />
      <div className={'flex flex-col gap-6'}>
        <div className={'flex justify-between'}>
          <div className={'flex flex-col gap-2 z-10'}>
            <div className={'w-32 h-32 bg-white rounded-lg'}>

            </div>
            <div className={'flex flex-col'}>
              <p className={cn('text-sm font-semibold',
                isExpanded ? 'text-white' : 'text-ink'
              )}>
                Senza Fine
              </p>
              <span className={cn('text-sm font-normal',
                isExpanded ? 'text-white/80' : 'text-ink-muted'
              )}>
                ALOTT
              </span>
            </div>
          </div>
          <Link
            href={'https://www.linkedin.com/in/bas-mensinga'}
            className={'relative flex h-14 w-14 items-center justify-center rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent bg-black'}
            onMouseEnter={() => setIsExpanded(true)}
            onFocus={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onBlur={() => setIsExpanded(false)}
          >
            <motion.div
              className={'absolute inset-0 -z-0'}
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
            />
            <div className={'z-10 pointer-events-none'}>
              <SpotifyIcon />
            </div>
          </Link>
        </div>
        <div className={'bg-white rounded-full border border-border flex gap-9 py-4 px-12 justify-center z-10'}>
          <SkipBackwardIcon />
          <PauseIcon />
          <SkipForwardIcon />
        </div>
      </div>
    </Card>
  )
}