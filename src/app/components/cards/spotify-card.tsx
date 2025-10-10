'use client'

import { Card } from "~/app/components/cards/card";
import { SkipBackwardIcon } from "~/app/components/icons/music-player/skip-backward";
import { SkipForwardIcon } from "~/app/components/icons/music-player/skip-forward";
import { PauseIcon } from "~/app/components/icons/music-player/pause";
import { PlayIcon } from "~/app/components/icons/music-player/play";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { cn } from "~/app/libs/utils";
import type { DeezerPlaylistPayload } from "~/server/api/routers/deezer";

type SpotifyCardProps = {
  playlist?: DeezerPlaylistPayload | null;
};

export function SpotifyCard({ playlist }: SpotifyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<"next" | "previous">('next');
  const [previousShiftCounter, setPreviousShiftCounter] = useState(0);
  const [nextShiftCounter, setNextShiftCounter] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipPath = useMemo(
    () => (isExpanded ? 'circle(160% at 88% 8%)' : 'circle(0% at calc(100% - 52px) 56px)'),
    [isExpanded],
  );

  const playableTracks = useMemo(
    () => (playlist?.tracks ?? []).filter((track) => Boolean(track.previewUrl)),
    [playlist],
  );
  const playableTracksLength = playableTracks.length;
  const isPlayable = playableTracksLength > 0;

  const activeTrack = isPlayable
    ? playableTracks[Math.min(trackIndex, playableTracksLength - 1)]
    : playlist?.tracks.at(0) ?? null;
  const trackArtists = activeTrack?.artists.join(', ') ?? playlist?.curatorName ?? 'No artist known';
  const linkHref = playlist?.externalUrl ?? 'https://www.deezer.com/';
  const hasPlaylist = Boolean(playlist);
  const artworkSrc = activeTrack?.imageUrl ?? playlist?.imageUrl ?? null;

  useEffect(() => {
    if (playableTracksLength === 0) {
      setTrackIndex(0);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    setTrackIndex((prev) => (prev < playableTracksLength ? prev : 0));
  }, [playableTracksLength]);

  useEffect(() => {
    if (!isPlayable || !playableTracks[trackIndex]?.previewUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const previewUrl = playableTracks[trackIndex].previewUrl!;
    const previousInstance = audioRef.current;
    if (previousInstance) {
      previousInstance.pause();
    }

    const audio = new Audio(previewUrl);
    audioRef.current = audio;

    const advanceTrack = () => {
      setTransitionDirection('next');
      if (playableTracksLength <= 1) {
        setIsPlaying(false);
        return;
      }
      setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    };

    const handleError = () => {
      setTransitionDirection('next');
      if (playableTracksLength <= 1) {
        setIsPlaying(false);
        return;
      }
      setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    };

    audio.addEventListener('ended', advanceTrack);
    audio.addEventListener('error', handleError);

    return () => {
      audio.pause();
      audio.removeEventListener('ended', advanceTrack);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlayable, playableTracks, playableTracksLength, trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise) {
        void playPromise.catch(() => {
          setIsPlaying(false);
        });
      }
      setIsExpanded(true)
    } else {
      audio.pause();
      setIsExpanded(false)
    }
  }, [isPlaying, trackIndex]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTogglePlayback = useCallback(() => {
    if (!isPlayable) return;
    setIsPlaying((prev) => !prev);
  }, [isPlayable]);

  const handleNext = useCallback(() => {
    if (!isPlayable) return;
    setTransitionDirection('next');
    setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    setNextShiftCounter((count) => count + 1);
  }, [isPlayable, playableTracksLength]);

  const handlePrevious = useCallback(() => {
    if (!isPlayable) return;
    setTransitionDirection('previous');
    setTrackIndex((prev) => (prev - 1 + playableTracksLength) % playableTracksLength);
    setPreviousShiftCounter((count) => count + 1);
  }, [isPlayable, playableTracksLength]);

  const controlsDisabled = !isPlayable;

  return (
    <div className={'flex flex-col gap-2'}>
      <Card className={'relative h-fit'}>
        <motion.div
          className={'pointer-events-none absolute inset-0 z-0 rounded-2xl bg-[#20D760] overflow-hidden'}
          initial={false}
          animate={{ clipPath }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden={'true'}
        />
        <div className={'flex flex-col gap-6'}>
          <div className={'flex justify-between'}>
            <div className={'flex flex-col gap-2 z-10'}>
              <div className={'w-32 h-32 rounded-lg'}>
                <AnimatePresence mode={'wait'}>
                  {artworkSrc ? (
                    <motion.img
                      key={artworkSrc}
                      src={artworkSrc}
                      alt={`${activeTrack?.name ?? playlist?.name ?? 'Playlist'} cover artwork`}
                      className={'size-full object-cover rounded-lg'}
                      loading={'lazy'}
                      initial={{ opacity: 0, x: transitionDirection === 'next' ? 24 : -24, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: transitionDirection === 'next' ? -24 : 24, scale: 0.96 }}
                      transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                    />
                  ) : (
                    <motion.div
                      key={'no-artwork'}
                      className={'flex size-full items-center justify-center text-ink-muted text-xs uppercase tracking-wide rounded-lg'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      No artwork
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={'flex flex-col'}>
                <AnimatePresence mode={'wait'}>
                  <motion.p
                    key={activeTrack?.id ?? playlist?.id ?? 'no-track'}
                    className={cn('text-sm font-semibold text-ink',
                      isExpanded ? 'text-white' : 'text-ink'
                    )}
                    initial={{ opacity: 0, y: transitionDirection === 'next' ? 12 : -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: transitionDirection === 'next' ? -12 : 12 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {activeTrack?.name ?? playlist?.name ?? 'Playlist unavailable'}
                  </motion.p>
                </AnimatePresence>
                <AnimatePresence mode={'wait'}>
                  <motion.span
                    key={`${activeTrack?.id ?? playlist?.id ?? 'no-track'}-artists`}
                    className={cn('text-sm font-normal text-ink-muted',
                      isExpanded ? 'text-white/80' : 'text-ink-muted'
                    )}
                    initial={{ opacity: 0, y: transitionDirection === 'next' ? 8 : -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: transitionDirection === 'next' ? -8 : 8 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {trackArtists}
                  </motion.span>
                </AnimatePresence>
                {!isPlayable && (
                  <span className={cn('text-xs font-medium text-ink-muted', isExpanded ? 'text-white/70' : 'text-ink-muted')}>
                    Preview unavailable for this playlist
                  </span>
                )}
              </div>
            </div>
            <Link
              href={linkHref}
              className={cn(
                'relative flex h-14 w-14 items-center justify-center rounded-[14px] outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent bg-black transition-opacity',
                !hasPlaylist && 'pointer-events-none opacity-60',
              )}
              onMouseEnter={() => setIsExpanded(true)}
              onFocus={() => setIsExpanded(true)}
              onMouseLeave={() => !isPlaying && setIsExpanded(false)}
              onBlur={() => !isPlaying && setIsExpanded(false)}
              aria-disabled={!hasPlaylist}
              title={hasPlaylist ? 'Open playlist on Deezer' : 'Deezer playlist unavailable'}
            >
              <motion.div
                className={'absolute inset-0 -z-0'}
                initial={false}
                animate={{ opacity: isExpanded ? 1 : 0 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              />
              <div className={'z-10 pointer-events-none'}>
                <SpotifyIcon />
              </div>
            </Link>
          </div>
          <div className={'bg-white/50 backdrop-blur-2xl rounded-full border border-border flex items-center gap-6 py-2 px-12 justify-center z-10 mx-auto'}>
            <motion.button
              type={'button'}
              onClick={handlePrevious}
              disabled={controlsDisabled}
              className={'relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer'}
              aria-label={'Play previous preview'}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.span
                key={previousShiftCounter}
                initial={{ x: -6, opacity: 0.85 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className={'flex items-center justify-center'}
              >
                <SkipBackwardIcon />
              </motion.span>
            </motion.button>
            <motion.button
              type={'button'}
              onClick={handleTogglePlayback}
              disabled={controlsDisabled}
              className={'flex h-12 w-12 items-center justify-center rounded-full border border-border/70 bg-white text-ink transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer'}
              aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
              whileTap={{ scale: 0.92 }}
            >
              {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </motion.button>
            <motion.button
              type={'button'}
              onClick={handleNext}
              disabled={controlsDisabled}
              className={'relative flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer'}
              aria-label={'Play next preview'}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.span
                key={nextShiftCounter}
                initial={{ x: 6, opacity: 0.85 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
                className={'flex items-center justify-center'}
              >
                <SkipForwardIcon />
              </motion.span>
            </motion.button>
          </div>
        </div>
      </Card>
      <span className={'text-xs font-normal text-ink-muted'}>Not affiliated with Spotify or any of the featured individuals. Album art and song previews from Deezer.</span>
    </div>
  )
}
