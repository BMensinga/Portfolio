'use client'

import { FogProvider } from '~/app/providers/fog-provider';
import { Card } from '~/app/components/cards/card';
import { Link } from "~/i18n/navigation";
import { Fog } from '~/app/components/fog';
import { motion, useScroll, useTransform } from 'motion/react';
import { useCurrentTime } from '~/app/hooks/use-current-time';
import { ClockIcon } from "~/app/components/icons/clock";
import { useTranslations } from 'next-intl';
import { GithubIcon } from "~/app/components/icons/github";

export function Footer() {
  const time = useCurrentTime();
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const tCommon = useTranslations('common');

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
            <Card className={'!pb-0 mx-2 sm:mx-0'}>
              <div className={'flex justify-between p-4 lg:p-12 pb-0 md:pb-4'}>
                <div className={'flex gap-2 items-center justify-center'}>
                  {/*<Button*/}
                  {/*  asChild*/}
                  {/*  variant={'solid'}*/}
                  {/*  size={'md'}*/}
                  {/*  className={'rounded-full'}*/}
                  {/*>*/}
                  {/*  <Link href={'mailto:hey@basmensinga.nl'}>{tCommon('cta.contact')}</Link>*/}
                  {/*</Button>*/}
                  <Link
                    href={'https://github.com/BMensinga/Portfolio'}
                    className={'text-ink-muted hover:text-ink-muted/80 focus:text-ink-muted/80'}
                  >
                    <GithubIcon />
                  </Link>
                </div>
                <div className={'flex gap-2 items-center justify-center'}>
                  <ClockIcon className={'size-3.5 text-ink-muted'} />
                  <time className={'flex gap-px items-center justify-center text-ink-muted font-normal text-sm'}>
                    <span className={'tabular-nums'}>{hours}</span>
                    <span className={'time-colon pb-0.5'}>:</span>
                    <span className={'tabular-nums'}>{minutes}</span>
                  </time>
                </div>
              </div>
              <div className={'flex justify-center overflow-hidden relative h-12 sm:h-16 md:h-20'}>
                <motion.h2
                  className={'bg-gradient-to-b from-brand to-brand/0 text-transparent text-4xl top-6 sm:text-6xl sm:top-6 md:text-7xl md:top-8 lg:text-[96px] lg:leading-normal lg:-top-2 xl:text-[128px] xl:leading-normal xl:-top-9 font-medium z-30 bg-clip-text absolute'}
                  style={{ letterSpacing }}
                >
                  {tCommon('name')}
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
