'use client'

import { LinkedinIcon } from '~/app/components/icons/linkedin';
import Link from 'next/link';
import { ExternalLinkIcon } from '~/app/components/icons/external-link';
import { Card } from '~/app/components/cards/card';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { cn } from '~/app/libs/utils';

export function LinkedinCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const clipPath = useMemo(
    () => (isExpanded ? 'circle(160% at 88% 8%)' : 'circle(0% at calc(100% - 52px) 56px)'),
    [isExpanded],
  );

  return (
    <Card className={'relative overflow-hidden'}>
      <motion.div
        className={'pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[#0A66C2]'}
        initial={false}
        animate={{ clipPath }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        aria-hidden={'true'}
      />
      <div className={'z-10 flex flex-col gap-4 transition-colors duration-150'}>
        <div className={'flex flex-col gap-2'}>
          <div className={'flex justify-between gap-4'}>
            <div className={'flex gap-2'}>
              <div className={'flex h-12 w-12 items-center justify-center rounded-full bg-white transition-colors duration-300'}>
                <span className={cn('text-xs transition-colors duration-150', isExpanded ? 'text-brand' : 'text-ink-muted')}>
                  Image
                </span>
              </div>
              <div className={'flex flex-col'}>
                <p className={cn('text-sm font-medium', isExpanded ? 'text-white' : 'text-ink')}>
                  Bas Mensinga
                </p>
                <span
                  className={cn('text-xs font-normal', isExpanded ? 'text-white/80' : 'text-ink-muted')}
                >
                  @bas-mensinga
                </span>
              </div>
            </div>
            <Link
              href={'https://www.linkedin.com/in/bas-mensinga'}
              className={'relative flex h-14 w-14 items-center justify-center rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent bg-[#0A66C2]'}
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
                <LinkedinIcon />
              </div>
            </Link>
          </div>
          <p className={cn('text-sm font-normal transition-colors duration-150', isExpanded ? 'text-white/85' : 'text-ink')}>
            Currently at
            {' '}
            <Link
              href={'https://dictu.nl'}
              className={cn(
                'transition-colors duration-300',
                isExpanded ? '!text-white underline' : 'text-brand',
              )}
            >
              @DICTU
            </Link>
          </p>
        </div>
        <div className={'relative h-6'}>
          <Link
            href={'https://www.linkedin.com/in/bas-mensinga'}
            className={'border-border absolute -left-3 flex h-8 w-8 items-center justify-center rounded-full border bg-white transition-colors duration-150'}
            onMouseEnter={() => setIsExpanded(true)}
            onFocus={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            onBlur={() => setIsExpanded(false)}
          >
            <ExternalLinkIcon />
          </Link>
        </div>
      </div>
    </Card>
  );
}
