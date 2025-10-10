'use client'

import { Code } from "lucide-react";
import Link from "next/link";
import { Fog } from "~/app/components/fog";
import { FogProvider } from "~/app/providers/fog-provider";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useMenuBarVisibility } from "~/app/providers/menu-bar-visibility-provider";
import { Button } from "~/app/components/button";
import Image from "next/image";

export function Intro() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { setIntroInView } = useMenuBarVisibility()

  useEffect(() => {
    setIntroInView(isInView)
  }, [isInView, setIntroInView])

  return (
    <FogProvider>
      <div className={"bg-brand-soft relative flex h-[576px] items-center"}>
        <div className={"z-20 container flex flex-col gap-6 mx-4 sm:mx-auto"}>
          <h1 className={"text-ink flex items-center gap-3 text-4xl font-medium"}>
            Hey, I am Bas.
            <span className={"outline-brand/10 flex h-16 w-16 -rotate-[6deg] items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"}>
              <Image
                src={'/images/profile-pic.webp'}
                width={128}
                height={128}
                alt={'Profile picture of Bas Mensinga'}
                className={"h-15 w-15 rounded-md"}
              />
            </span>
            I am a Software engineer.
          </h1>
          <h2 className={"text-ink-muted flex items-center gap-3 text-2xl font-medium"}>
            I build software
            <span
              className={"outline-brand/10 flex h-12 w-12 rotate-12 items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"}
            >
              <Code className={"text-brand h-8 w-8 stroke-[2.5]"} />
            </span>
            that makes complex things feel simple.
          </h2>
          <Button asChild variant={'solid'} size={'md'} className={'rounded-full'}>
            <Link href={'mailto:hey@basmensinga.nl'}>Let's chat</Link>
          </Button>
        </div>
        <Fog />
        <div className={'flex flex-col absolute top-0 h-full w-full'}>
          <div className={'w-full h-full'} ref={ref}/>
          <div className={'h-16 w-full bg-linear-to-b from-transparent to-white'} />
        </div>
      </div>
    </FogProvider>
  )
}
