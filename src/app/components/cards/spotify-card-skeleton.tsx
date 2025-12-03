import { Card } from "~/app/components/cards/card";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";
import { useTranslations } from "next-intl";

export function SpotifyCardSkeleton() {
  const t = useTranslations("spotify");

  return (
    <div className={"flex flex-col gap-2"}>
      <Card className={"relative h-fit"}>
        <div className={"flex justify-between"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"h-32 w-32 animate-pulse rounded-lg bg-white/70"} />
            <div className={"flex flex-col gap-0"}>
              <div
                className={
                  "h-5 w-40 animate-pulse rounded-t rounded-br bg-white/70"
                }
              />
              <div className={"h-4 w-32 animate-pulse rounded-b bg-white/70"} />
            </div>
          </div>
          <div
            className={
              "flex h-14 w-14 animate-pulse items-center justify-center rounded-[14px] bg-black"
            }
          >
            <SpotifyIcon />
          </div>
        </div>
        <div className={"flex items-center justify-center gap-4"}>
          <div
            className={
              "bg-white/70/70 border-border flex items-center gap-6 rounded-full border px-2 py-2"
            }
          >
            <div
              className={"h-12 w-60 animate-pulse rounded-full bg-white/70"}
            />
          </div>
          <div className={"hidden items-center gap-3 lg:flex"}>
            <div
              className={
                "border-border h-10 w-10 animate-pulse rounded-full border bg-white/70"
              }
            />
          </div>
        </div>
      </Card>
      <span className={"text-ink-muted text-xs font-normal"}>
        {t("disclaimer")}
      </span>
    </div>
  );
}
