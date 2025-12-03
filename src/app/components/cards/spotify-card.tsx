"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type PointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { Card } from "~/app/components/cards/card";
import { SkipBackwardIcon } from "~/app/components/icons/music-player/skip-backward";
import { SkipForwardIcon } from "~/app/components/icons/music-player/skip-forward";
import { PauseIcon } from "~/app/components/icons/music-player/pause";
import { PlayIcon } from "~/app/components/icons/music-player/play";
import { SpotifyIcon } from "~/app/components/icons/music-player/spotify";
import { Link } from "~/i18n/navigation";
import { cn } from "~/app/libs/utils";
import type { DeezerPlaylistPayload } from "~/server/api/routers/music";
import { useTranslations } from "next-intl";

type SpotifyCardProps = {
  playlist?: DeezerPlaylistPayload | null;
};

export function SpotifyCard({ playlist }: SpotifyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<
    "next" | "previous"
  >("next");
  const [previousShiftCounter, setPreviousShiftCounter] = useState(0);
  const [nextShiftCounter, setNextShiftCounter] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [lastVolumeBeforeMute, setLastVolumeBeforeMute] = useState(0.8);
  const [isVolumePopoverVisible, setIsVolumePopoverVisible] = useState(false);
  const isVolumeDraggingRef = useRef(false);
  const volumeRef = useRef(volume);
  const volumeTrackRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const clipPath = useMemo(
    () =>
      isExpanded
        ? "circle(160% at 88% 8%)"
        : "circle(0% at calc(100% - 52px) 56px)",
    [isExpanded],
  );
  const t = useTranslations("spotify");

  const playableTracks = useMemo(
    () => (playlist?.tracks ?? []).filter((track) => Boolean(track.previewUrl)),
    [playlist],
  );
  const playableTracksLength = playableTracks.length;
  const isPlayable = playableTracksLength > 0;

  const activeTrack = isPlayable
    ? playableTracks[Math.min(trackIndex, playableTracksLength - 1)]
    : (playlist?.tracks.at(0) ?? null);
  const trackArtists =
    activeTrack?.artists.join(", ") ??
    playlist?.curatorName ??
    t("unknownArtist");
  const linkHref = playlist?.externalUrl ?? "https://www.deezer.com/";
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
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    if (!isPlayable || !playableTracks[trackIndex]?.previewUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    const previewUrl = playableTracks[trackIndex].previewUrl;
    const previousInstance = audioRef.current;
    if (previousInstance) {
      previousInstance.pause();
    }

    const audio = new Audio(previewUrl);
    audio.volume = Math.min(Math.max(volumeRef.current, 0), 1);
    audioRef.current = audio;

    const advanceTrack = () => {
      setTransitionDirection("next");
      if (playableTracksLength <= 1) {
        setIsPlaying(false);
        return;
      }
      setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    };

    const handleError = () => {
      setTransitionDirection("next");
      if (playableTracksLength <= 1) {
        setIsPlaying(false);
        return;
      }
      setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    };

    audio.addEventListener("ended", advanceTrack);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", advanceTrack);
      audio.removeEventListener("error", handleError);
    };
  }, [isPlayable, playableTracks, playableTracksLength, trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      playPromise
        .then(() => {
          setIsExpanded(true);
        })
        .catch(() => {
          setIsPlaying(false);
        });
    } else {
      audio.pause();
      setIsExpanded(false);
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = Math.min(Math.max(volume, 0), 1);
    }
  }, [volume]);

  const handleTogglePlayback = useCallback(() => {
    if (!isPlayable) return;
    setIsPlaying((prev) => !prev);
  }, [isPlayable]);

  const handleNext = useCallback(() => {
    if (!isPlayable) return;
    setTransitionDirection("next");
    setTrackIndex((prev) => (prev + 1) % playableTracksLength);
    setNextShiftCounter((count) => count + 1);
  }, [isPlayable, playableTracksLength]);

  const handlePrevious = useCallback(() => {
    if (!isPlayable) return;
    setTransitionDirection("previous");
    setTrackIndex(
      (prev) => (prev - 1 + playableTracksLength) % playableTracksLength,
    );
    setPreviousShiftCounter((count) => count + 1);
  }, [isPlayable, playableTracksLength]);

  const toggleMute = useCallback(() => {
    if (volume === 0) {
      const restored = lastVolumeBeforeMute > 0 ? lastVolumeBeforeMute : 0.5;
      setVolume(restored);
      return;
    }

    setLastVolumeBeforeMute(volume > 0 ? volume : lastVolumeBeforeMute);
    setVolume(0);
  }, [volume, lastVolumeBeforeMute]);

  const setVolumeFromRatio = useCallback(
    (ratio: number) => {
      const normalized = Math.min(Math.max(ratio, 0), 1);
      setVolume(normalized);

      if (normalized > 0) {
        setLastVolumeBeforeMute(normalized);
      }
    },
    [setLastVolumeBeforeMute],
  );

  const updateVolumeFromClientY = useCallback(
    (clientY: number) => {
      const track = volumeTrackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const offset = rect.bottom - clientY;
      const ratio = rect.height === 0 ? 0 : offset / rect.height;
      setVolumeFromRatio(ratio);
    },
    [setVolumeFromRatio],
  );

  const handleVolumePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const target = event.currentTarget;
      target.setPointerCapture(event.pointerId);
      isVolumeDraggingRef.current = true;
      updateVolumeFromClientY(event.clientY);
    },
    [updateVolumeFromClientY],
  );

  const handleVolumePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
      updateVolumeFromClientY(event.clientY);
    },
    [updateVolumeFromClientY],
  );

  const handleVolumePointerUp = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
      isVolumeDraggingRef.current = false;
    },
    [],
  );

  const showVolumeControls = useCallback(() => {
    setIsVolumePopoverVisible(true);
  }, []);

  const hideVolumeControls = useCallback(() => {
    if (isVolumeDraggingRef.current) return;
    setIsVolumePopoverVisible(false);
  }, []);

  const handleVolumeBlur = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
        hideVolumeControls();
      }
    },
    [hideVolumeControls],
  );

  const controlsDisabled = !isPlayable;
  const effectiveVolume = volume;
  const volumePercent = Math.round(effectiveVolume * 100);
  const VolumeIconComponent =
    effectiveVolume === 0
      ? VolumeX
      : effectiveVolume <= 0.35
        ? Volume
        : effectiveVolume <= 0.7
          ? Volume1
          : Volume2;
  const controlsLabels = {
    previous: t("controls.previous"),
    next: t("controls.next"),
    play: t("controls.play"),
    pause: t("controls.pause"),
  };

  return (
    <div className={"flex flex-col gap-2"}>
      <Card className={"relative h-fit"}>
        <motion.div
          className={
            "pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-2xl bg-[#20D760]"
          }
          initial={false}
          animate={{ clipPath }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          aria-hidden={"true"}
        />
        <div className={"flex flex-col gap-6"}>
          <div className={"z-10 flex flex-col gap-2"}>
            <div className={"flex justify-between"}>
              <div className={"h-32 w-32 rounded-lg"}>
                <AnimatePresence mode={"wait"}>
                  {artworkSrc ? (
                    <motion.img
                      key={artworkSrc}
                      src={artworkSrc}
                      alt={`${activeTrack?.name ?? playlist?.name ?? "Playlist"} cover artwork`}
                      className={"size-full rounded-lg object-cover"}
                      loading={"lazy"}
                      initial={{
                        opacity: 0,
                        x: transitionDirection === "next" ? 24 : -24,
                        scale: 0.96,
                      }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: transitionDirection === "next" ? -24 : 24,
                        scale: 0.96,
                      }}
                      transition={{ duration: 0.25, ease: [0.33, 1, 0.68, 1] }}
                    />
                  ) : (
                    <motion.div
                      key={"no-artwork"}
                      className={
                        "text-ink-muted flex size-full items-center justify-center rounded-lg text-xs tracking-wide uppercase"
                      }
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {t("noArtwork")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link
                href={linkHref}
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-[14px] bg-black transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                  !hasPlaylist && "pointer-events-none opacity-60",
                )}
                onMouseEnter={() => setIsExpanded(true)}
                onFocus={() => setIsExpanded(true)}
                onMouseLeave={() => !isPlaying && setIsExpanded(false)}
                onBlur={() => !isPlaying && setIsExpanded(false)}
                aria-disabled={!hasPlaylist}
                title={
                  hasPlaylist ? t("openOnSpotify") : t("playlistUnavailable")
                }
              >
                <motion.div
                  className={"absolute inset-0 -z-0"}
                  initial={false}
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                />
                <div className={"pointer-events-none z-10"}>
                  <SpotifyIcon />
                </div>
              </Link>
            </div>
            <div className={"flex flex-col"}>
              <AnimatePresence mode={"wait"}>
                <motion.p
                  key={activeTrack?.id ?? playlist?.id ?? "no-track"}
                  className={cn(
                    "text-ink text-sm font-semibold",
                    isExpanded ? "text-white" : "text-ink",
                  )}
                  initial={{
                    opacity: 0,
                    y: transitionDirection === "next" ? 12 : -12,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: transitionDirection === "next" ? -12 : 12,
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  {activeTrack?.name ??
                    playlist?.name ??
                    t("playlistUnavailable")}
                </motion.p>
              </AnimatePresence>
              <AnimatePresence mode={"wait"}>
                <motion.span
                  key={`${activeTrack?.id ?? playlist?.id ?? "no-track"}-artists`}
                  className={cn(
                    "text-ink-muted text-sm font-normal",
                    isExpanded ? "text-white/80" : "text-ink-muted",
                  )}
                  initial={{
                    opacity: 0,
                    y: transitionDirection === "next" ? 8 : -8,
                  }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{
                    opacity: 0,
                    y: transitionDirection === "next" ? -8 : 8,
                  }}
                  transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                >
                  {trackArtists}
                </motion.span>
              </AnimatePresence>
              {!isPlayable && (
                <span
                  className={cn(
                    "text-ink-muted text-xs font-medium",
                    isExpanded ? "text-white/70" : "text-ink-muted",
                  )}
                >
                  {t("previewUnavailable")}
                </span>
              )}
            </div>
          </div>
          <div className={"flex items-center justify-center gap-4"}>
            <div
              className={
                "border-border flex items-center justify-center gap-6 rounded-full border bg-white/50 px-8 py-2 backdrop-blur-2xl lg:px-4 xl:px-8"
              }
            >
              <motion.button
                type={"button"}
                onClick={handlePrevious}
                disabled={controlsDisabled}
                className={
                  "text-ink-muted hover:text-ink focus-visible:ring-ink relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                }
                aria-label={controlsLabels.previous}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.span
                  key={previousShiftCounter}
                  initial={{ x: -6, opacity: 0.85 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className={"flex items-center justify-center"}
                >
                  <SkipBackwardIcon />
                </motion.span>
              </motion.button>
              <motion.button
                type={"button"}
                onClick={handleTogglePlayback}
                disabled={controlsDisabled}
                className={
                  "border-border/70 text-ink hover:text-ink focus-visible:ring-ink flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border bg-white transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                }
                aria-label={
                  isPlaying ? controlsLabels.pause : controlsLabels.play
                }
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </motion.button>
              <motion.button
                type={"button"}
                onClick={handleNext}
                disabled={controlsDisabled}
                className={
                  "text-ink-muted hover:text-ink focus-visible:ring-ink relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-30"
                }
                aria-label={controlsLabels.next}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.span
                  key={nextShiftCounter}
                  initial={{ x: 6, opacity: 0.85 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                  className={"flex items-center justify-center"}
                >
                  <SkipForwardIcon />
                </motion.span>
              </motion.button>
            </div>
            <div
              className={"group relative hidden items-center sm:flex"}
              onMouseEnter={showVolumeControls}
              onMouseLeave={hideVolumeControls}
              onFocusCapture={showVolumeControls}
              onBlurCapture={handleVolumeBlur}
            >
              <motion.button
                type={"button"}
                onClick={toggleMute}
                className={
                  "border-border text-ink group-focus-visible:ring-ink flex h-10 w-10 items-center justify-center rounded-full border bg-white/70 transition group-hover:bg-white group-focus-visible:ring-offset-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                }
                whileTap={{ scale: 0.94 }}
                aria-label={
                  effectiveVolume === 0 ? t("volume.unmute") : t("volume.mute")
                }
              >
                <VolumeIconComponent className={"text-ink-muted h-5 w-5"} />
              </motion.button>
              <AnimatePresence>
                {isVolumePopoverVisible && (
                  <div className={"absolute bottom-full z-20 pb-3"}>
                    <motion.div
                      key={"volume-slider"}
                      initial={{ opacity: 0, y: 12, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 12, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                      className={
                        "border-border pointer-events-auto flex w-10 flex-col items-center gap-2 rounded-xl border bg-white/90 px-3 py-3 shadow-xl backdrop-blur"
                      }
                    >
                      <span className={"text-ink-muted text-xs font-medium"}>
                        {volumePercent}%
                      </span>
                      <div
                        ref={volumeTrackRef}
                        className={
                          "bg-ink/10 relative h-32 w-1.5 cursor-pointer overflow-hidden rounded-full select-none"
                        }
                        onPointerDown={handleVolumePointerDown}
                        onPointerMove={handleVolumePointerMove}
                        onPointerUp={handleVolumePointerUp}
                        onPointerCancel={handleVolumePointerUp}
                      >
                        <motion.div
                          className={
                            "bg-ink absolute bottom-0 left-0 w-full tabular-nums"
                          }
                          animate={{ height: `${volumePercent}%` }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Card>
      <span className={"text-ink-muted text-xs font-normal"}>
        {t("disclaimer")}
      </span>
    </div>
  );
}
