'use client'
import { Clock, Cloud, Globe } from "lucide-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { cn } from "~/app/libs/utils";
import { useState } from "react";
import Link from "next/link";

export function MenuBar() {
  const time = new Date();
  
  const { scrollYProgress } = useScroll();
  const [hookedYPostion, setHookedYPosition] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    setHookedYPosition(latest);
  })

  console.log(scrollYProgress)

  return (
    <AnimatePresence>
      <header className={'w-full fixed z-30'}>
        <motion.div
          className={cn('bg-white w-full transition-all duration-150',
            scrollYProgress.get() ? 'container px-4 mt-2 rounded-lg shadow-sm py-3 mx-auto' : 'border-b border-[#E5E5E5] py-4 mt-0'
          )}
        >
          <div className={'flex justify-between container mx-auto'}>
            <Link href={'/'} className={'text-2xl font-medium'}>
              Bas Mensinga
            </Link>
            <div className={'flex gap-2'}>
              <div className={'bg-[#F2F2F2] rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
                <Globe className={'size-3.5 text-[#7D7D7D]'}/>
                <span className={'text-[#7D7D7D] font-normal text-sm'}>Gouda • Nederland</span>
              </div>
              <span className={'w-px h-full bg-[#BEBEBE] rounded-full'}/>
              <div className={'flex gap-2'}>
                <div className={'bg-[#F2F2F2] rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
                  <Clock className={'size-3.5 text-[#7D7D7D]'}/>
                  <span className={'text-[#7D7D7D] font-normal text-sm'}>{ time.toLocaleTimeString('nl-NL', {hour: '2-digit', minute: '2-digit'}) }</span>
                </div>
                <div className={'bg-[#F2F2F2] rounded-lg flex gap-2 py-0.5 px-1.5 items-center justify-center'}>
                  <Cloud className={'size-3.5 text-[#7D7D7D]'}/>
                  <span className={'text-[#7D7D7D] font-normal text-sm'}>20°C</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </header>
    </AnimatePresence>
  )
}