'use client'

import { FogProvider } from '~/app/providers/fog-provider';
import { Card } from '~/app/components/cards/card';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Fog } from '~/app/components/fog';
import { motion, useScroll, useTransform } from 'motion/react';

export function Footer() {
  const time = new Date();
  const { scrollYProgress } = useScroll();
  const letterSpacing = useTransform(
    scrollYProgress,
    [0, 1],
    ['0.6em', '0.05em']
  );

  return (
    <footer>
      <FogProvider>
        <div className={'bg-brand-soft relative flex flex-col items-center'}>
          <div className={'z-20 container mx-auto flex flex-col gap-6 mb-6'}>
            <Card className={'pb-0'}>
              <div className={'flex justify-between p-12'}>
                <Link
                  href={'mailto:hey@basmensinga.nl'}
                  className={'bg-brand w-fit rounded-full px-4 py-1 text-white!'}
                >
                  Let's chat
                </Link>
                <div className={'flex gap-2 items-center justify-center'}>
                  <Clock className={'size-3.5 text-ink-muted'}/>
                  <span className={'text-ink-muted font-normal text-sm'}>{ time.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'}) }</span>
                </div>
              </div>
              <div className={'flex justify-center overflow-hidden relative h-20'}>
                <motion.h2
                  className={'bg-gradient-to-b from-brand to-brand/0 text-transparent text-[128px] font-medium z-30 bg-clip-text absolute -top-9'}
                  style={{ letterSpacing }}
                >
                  Bas Mensinga
                </motion.h2>
              </div>
            </Card>
          </div>
          <div className={'absolute top-0 left-0 h-full w-full bg-linear-to-b from-white from-25% to-transparent to-35%'} />
          <Fog />
        </div>
      </FogProvider>
    </footer>
  )
}

