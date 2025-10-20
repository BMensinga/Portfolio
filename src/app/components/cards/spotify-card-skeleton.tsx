import { Card } from "~/app/components/cards/card";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";
import { useTranslations } from "next-intl";

export function SpotifyCardSkeleton() {
  const t = useTranslations('spotify');

  return (
    <div className={'flex flex-col gap-2'}>
      <Card className={'relative h-fit'}>
        <div className={'flex justify-between'}>
          <div className={'flex flex-col gap-2'}>
            <div className={'h-32 w-32 rounded-lg bg-white/70 animate-pulse'} />
            <div className={'flex flex-col gap-0'}>
              <div className={'h-5 w-40 rounded-t rounded-br bg-white/70 animate-pulse'} />
              <div className={'h-4 w-32 rounded-b bg-white/70 animate-pulse'} />
            </div>
          </div>
          <div className={'h-14 w-14 flex items-center justify-center rounded-[14px] bg-black animate-pulse'}>
            <SpotifyIcon />
          </div>
        </div>
        <div className={'flex items-center justify-center gap-4'}>
          <div className={'bg-white/70/70 rounded-full border border-border flex items-center gap-6 py-2 px-2'}>
            <div className={'h-12 w-60 rounded-full bg-white/70 animate-pulse'} />
          </div>
          <div className={'hidden lg:flex items-center gap-3'}>
            <div className={'h-10 w-10 rounded-full bg-white/70 animate-pulse border border-border'} />
          </div>
        </div>
      </Card>
      <span className={'text-xs font-normal text-ink-muted'}>{t('disclaimer')}</span>
    </div>
  );
}
