'use client'

import { Code } from "lucide-react";
import { Link } from "~/i18n/navigation";
import { Fog } from "~/app/components/fog";
import { FogProvider } from "~/app/providers/fog-provider";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useMenuBarVisibility } from "~/app/providers/menu-bar-visibility-provider";
import { Button } from "~/app/components/button";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { GithubIcon } from "~/app/components/icons/github";

export function Intro() {
  const ref = useRef(null)
  const isInView = useInView(ref)
  const { setIntroInView } = useMenuBarVisibility()
  const t = useTranslations('intro')
  const tCommon = useTranslations('common')

  useEffect(() => {
    setIntroInView(isInView)
  }, [isInView, setIntroInView])

  return (
    <FogProvider>
      <div className={"bg-brand-soft relative flex h-164 sm:h-144 items-center"}>
        <div className={"z-20 container flex flex-col gap-6 mx-4 sm:mx-auto"}>
          <h1 className={"text-ink flex flex-wrap items-center gap-3 text-4xl font-medium"}>
            {t('greeting', { name: tCommon('name') })}
            <span className={"outline-brand/10 flex h-12 w-12 sm:h-16 sm:w-16 -rotate-[6deg] items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"}>
              <Image
                src={'/images/profile-pic.webp'}
                width={128}
                height={128}
                alt={t('profileAlt')}
                className={"h-11 w-11 sm:h-15 sm:w-15 rounded-md"}
              />
            </span>
            {t('role')}
          </h1>
          <h2 className={"text-ink-muted flex flex-wrap items-center gap-3 text-2xl font-medium"}>
            {t('headline.prefix')}
            <span
              className={"outline-brand/10 flex h-9 w-9 sm:h-12 sm:w-12 rotate-12 items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0"}
            >
              <Code className={"text-brand h-6 w-6 sm:h-8 sm:w-8 stroke-[2.5]"} />
            </span>
            {t('headline.suffix')}
          </h2>
          {/*<Button asChild variant={'solid'} size={'md'} className={'rounded-full'}>*/}
          {/*  <Link href={'mailto:hey@basmensinga.nl'}>{tCommon('cta.contact')}</Link>*/}
          {/*</Button>*/}
        </div>
        <Fog />
        <div className={'flex flex-col absolute top-0 h-full w-full'}>
          <div className={'w-full h-full'} ref={ref} />
          <div className={'h-16 w-full bg-linear-to-b from-transparent to-white'} />
        </div>
      </div>
    </FogProvider>
  )
}
