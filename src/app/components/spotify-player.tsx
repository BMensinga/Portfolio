import { Card } from "~/app/components/card";
import { SkipBackwardIcon } from "~/app/components/icons/music-player/skip-backward";
import { SkipForwardIcon } from "~/app/components/icons/music-player/skip-forward";
import { PauseIcon } from "~/app/components/icons/music-player/pause";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";

export function SpotifyPlayer() {
  return (
    <Card>
      <div className={'flex flex-col gap-6'}>
        <div className={'flex justify-between'}>
          <div className={'flex flex-col gap-2'}>
            <div className={'w-32 h-32 bg-white rounded-lg'}>

            </div>
            <div className={'flex flex-col'}>
              <p className={'text-sm font-semibold text-ink'}>Senza Fine</p>
              <span className={'text-sm font-normal text-ink-muted'}>ALOTT</span>
            </div>
          </div>
          <div className={'w-14 h-14 bg-black rounded-[14px] flex items-center justify-center'}>
            <SpotifyIcon />
          </div>
        </div>
        <div className={'bg-white rounded-full border border-border flex gap-9 py-4 px-12 justify-center'}>
          <SkipBackwardIcon />
          <PauseIcon />
          <SkipForwardIcon />
        </div>
      </div>
    </Card>
  )
}