"use client";

import { Globe } from "lucide-react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { cn } from "~/app/libs/utils";
import { Link, usePathname } from "~/i18n/navigation";
import { useMenuBarVisibility } from "~/app/providers/menu-bar-visibility-provider";
import { useState } from "react";
import { useCurrentTime } from "~/app/hooks/use-current-time";
import { ClockIcon } from "~/app/components/icons/clock";
import { WeatherIcon } from "~/app/components/icons/weather";
import type { WeatherPayload } from "~/server/api/routers/weather";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "~/i18n/routing";
import { Button } from "~/app/components/button";
type MenuBarProps = {
  weather?: WeatherPayload | null;
};

export function MenuBar({ weather }: MenuBarProps) {
  const time = useCurrentTime();
  const hours = time ? time.getHours().toString().padStart(2, "0") : "--";
  const minutes = time ? time.getMinutes().toString().padStart(2, "0") : "--";
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const currentLocale = useLocale();
  const otherLocales = routing.locales.filter(
    (locale) => locale !== currentLocale,
  );

  const { scrollYProgress } = useScroll();
  const { isIntroInView } = useMenuBarVisibility();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest: number) => {
    const shouldCollapse = latest > 0.02;
    setIsScrolled((prev) => (prev === shouldCollapse ? prev : shouldCollapse));
  });

  return (
    <header
      className={"pointer-events-none fixed z-30 flex w-full justify-center"}
    >
      <motion.div
        className={cn(
          "border-border pointer-events-auto m-0 grow px-4 py-4 transition-all duration-300 2xl:mx-auto",
          isScrolled
            ? "mx-2 mt-2 max-w-screen-lg rounded-xl border py-3"
            : "max-w-[100dvw] border-b",
          isIntroInView ? "bg-white/25 backdrop-blur-2xl" : "bg-white",
        )}
      >
        <div
          className={
            "mx-auto flex flex-col justify-between gap-x-4 gap-y-2 sm:flex-row"
          }
        >
          <div className={"flex grow justify-between gap-4"}>
            <Link
              href={"/"}
              className={
                "text-brand hover:text-brand/80 focus:text-brand/80 text-2xl font-medium"
              }
            >
              {tCommon("name")}
            </Link>
            {otherLocales.map((locale) => (
              <Button key={locale} asChild variant={"solid"} size={"md"}>
                <Link href={pathname ?? "/"} locale={locale}>
                  {tCommon("switchLocale", { locale })}
                </Link>
              </Button>
            ))}
          </div>
          <div className={"flex justify-between gap-2 sm:justify-start"}>
            <div
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg px-1.5 py-0.5 transition-all duration-300",
                isIntroInView ? "bg-white/50" : "bg-surface-alt",
              )}
            >
              <Globe className={"text-ink-muted size-3.5"} />
              <span className={"text-ink-muted text-xs font-normal sm:text-sm"}>
                {tCommon("location")}
              </span>
            </div>
            <div className={"hidden w-px py-1 sm:flex"}>
              <span className={"bg-divider h-full w-px rounded-full"} />
            </div>
            <div className={"flex gap-2"}>
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-1.5 py-0.5 transition-all duration-300",
                  isIntroInView ? "bg-white/50" : "bg-surface-alt",
                )}
              >
                <ClockIcon className={"text-ink-muted size-3.5"} />
                <time
                  className={
                    "text-ink-muted flex items-center justify-center gap-px text-xs font-normal sm:text-sm"
                  }
                >
                  <span className={"tabular-nums"}>{hours}</span>
                  <span className={"time-colon pb-0.5"}>:</span>
                  <span className={"tabular-nums"}>{minutes}</span>
                </time>
              </div>
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-1.5 py-0.5 transition-all duration-300",
                  isIntroInView ? "bg-white/50" : "bg-surface-alt",
                )}
              >
                <WeatherIcon
                  kind={weather?.kind ?? "clear"}
                  className={"text-ink-muted size-3.5"}
                />
                <div className={"flex w-8 flex-col items-center leading-none"}>
                  <span
                    className={
                      "text-ink-muted w-full overflow-hidden text-xs font-normal text-ellipsis tabular-nums sm:text-sm"
                    }
                  >
                    {weather
                      ? `${Math.round(weather.temperature ?? 0)}°C`
                      : tCommon("weatherUnavailable")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </header>
  );
}
