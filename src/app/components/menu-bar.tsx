'use client'
import { Clock, Cloud, Globe } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "~/app/libs/utils";
import { useState } from "react";
import Link from "next/link";

export function MenuBar() {
  const time = new Date();
  const { scrollYProgress } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const shouldCollapse = latest > 0.02;
    setIsScrolled((prev) => (prev === shouldCollapse ? prev : shouldCollapse));
  });

  return (
    <header className={'w-full fixed z-30'}>
      <motion.div
        className={cn(
          'bg-white/80 transition-all duration-300 m-0 py-4 2xl:mx-auto border-border backdrop-blur-2xl',
          isScrolled
            ? 'max-w-screen-lg px-4 mt-2 rounded-xl py-3 mx-2 border'
            : 'max-w-[100dvw] border-b'
        )}
      >
        <div className={'flex justify-between container mx-auto'}>
          <Link href={'/'} className={'text-2xl font-medium'}>
            Bas Mensinga
          </Link>
          <div className={'flex gap-2'}>
            <div className={'bg-surface-alt rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
              <Globe className={'size-3.5 text-ink-muted'}/>
              <span className={'text-ink-muted font-normal text-sm'}>Gouda • The Netherlands</span>
            </div>
            <div className={'w-px h-full py-1 flex'}><span className={'bg-divider rounded-full h-full w-px'} /></div>
            <div className={'flex gap-2'}>
              <div className={'bg-surface-alt rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
                <Clock className={'size-3.5 text-ink-muted'}/>
                <span className={'text-ink-muted font-normal text-sm'}>{ time.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'}) }</span>
              </div>
              <div className={'bg-surface-alt rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
                <Cloud className={'size-3.5 text-ink-muted'}/>
                <span className={'text-ink-muted font-normal text-sm'}>20°C</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  )
}
