"use client";

import { Code } from "lucide-react";
import { Fog } from "~/app/components/fog";
import { FogProvider } from "~/app/providers/fog-provider";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useMenuBarVisibility } from "~/app/providers/menu-bar-visibility-provider";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Intro() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const { setIntroInView } = useMenuBarVisibility();
  const t = useTranslations("intro");
  const tCommon = useTranslations("common");

  useEffect(() => {
    setIntroInView(isInView);
  }, [isInView, setIntroInView]);

  return (
    <FogProvider>
      <div
        className={"bg-brand-soft relative flex h-164 items-center sm:h-144"}
      >
        <div className={"z-20 container mx-4 flex flex-col gap-6 sm:mx-auto"}>
          <h1
            className={
              "text-ink flex flex-wrap items-center gap-3 text-4xl font-medium"
            }
          >
            {t("greeting", { name: tCommon("name") })}
            <span
              className={
                "outline-brand/10 flex h-12 w-12 -rotate-[6deg] items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0 sm:h-16 sm:w-16"
              }
            >
              <Image
                src={"/images/profile-pic.webp"}
                width={128}
                height={128}
                alt={t("profileAlt")}
                className={"h-11 w-11 rounded-md sm:h-15 sm:w-15"}
              />
            </span>
            {t("role")}
          </h1>
          <h2
            className={
              "text-ink-muted flex flex-wrap items-center gap-x-3 text-2xl font-medium sm:gap-y-3"
            }
          >
            {t("headline.prefix")}
            <span
              className={
                "outline-brand/10 mb-1 flex h-9 w-9 rotate-12 items-center justify-center rounded-lg bg-white outline-2 transition-transform duration-150 hover:rotate-0 sm:mb-0 sm:h-12 sm:w-12"
              }
            >
              <Code
                className={"text-brand h-6 w-6 stroke-[2.5] sm:h-8 sm:w-8"}
              />
            </span>
            {t("headline.suffix")}
          </h2>
          {/*<Button asChild variant={'solid'} size={'md'} className={'rounded-full'}>*/}
          {/*  <Link href={'mailto:hey@basmensinga.nl'}>{tCommon('cta.contact')}</Link>*/}
          {/*</Button>*/}
        </div>
        <Fog />
        <div className={"absolute top-0 flex h-full w-full flex-col"}>
          <div className={"h-full w-full"} ref={ref} />
          <div
            className={"h-16 w-full bg-linear-to-b from-transparent to-white"}
          />
        </div>
      </div>
    </FogProvider>
  );
}
