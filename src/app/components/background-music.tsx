"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const playlist = ["/music-1.mp4", "/music-2.mp4"];
const DEFAULT_VOLUME = 0.24;
const DUPLICATE_TAP_GUARD_MS = 400;

export function BackgroundMusic() {
  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const activeSlotRef = useRef(0);
  const currentIndexRef = useRef(0);
  const standbyIndexRef = useRef(1);
  const pausedByUserRef = useRef(true);
  const lastToggleAtRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audioA = audioRefs.current[0];
    const audioB = audioRefs.current[1];
    const button = buttonRef.current;
    if (!audioA || !audioB || !button) {
      return;
    }

    const allAudios = [audioA, audioB];

    const configureAudio = (audio: HTMLAudioElement) => {
      audio.preload = "auto";
      audio.loop = false;
      audio.volume = DEFAULT_VOLUME;
      audio.setAttribute("playsinline", "true");
      audio.setAttribute("webkit-playsinline", "true");
      audio.setAttribute("x5-playsinline", "true");
    };

    const getAudio = (slot: number) => audioRefs.current[slot] ?? null;

    const getActiveAudio = () => getAudio(activeSlotRef.current);

    const getStandbyAudio = () => getAudio(activeSlotRef.current === 0 ? 1 : 0);

    const loadTrackIntoAudio = (audio: HTMLAudioElement, trackIndex: number) => {
      audio.src = playlist[trackIndex]!;
      audio.load();
    };

    const preloadFollowingTrack = () => {
      const standbyAudio = getStandbyAudio();
      if (!standbyAudio) {
        return;
      }

      const followingIndex = (currentIndexRef.current + 1) % playlist.length;
      standbyIndexRef.current = followingIndex;
      standbyAudio.pause();
      standbyAudio.currentTime = 0;
      loadTrackIntoAudio(standbyAudio, followingIndex);
    };

    const syncPlayState = () => {
      setIsPlaying(allAudios.some((audio) => !audio.paused));
    };

    for (const audio of allAudios) {
      configureAudio(audio);
    }

    currentIndexRef.current = 0;
    activeSlotRef.current = 0;
    loadTrackIntoAudio(audioA, currentIndexRef.current);
    preloadFollowingTrack();

    const handlePlay = () => {
      syncPlayState();
    };

    const handlePause = () => {
      syncPlayState();
    };

    const handleEnded = async (event: Event) => {
      if (pausedByUserRef.current || event.currentTarget !== getActiveAudio()) {
        return;
      }

      const currentAudio = getActiveAudio();
      const nextAudio = getStandbyAudio();
      if (!currentAudio || !nextAudio) {
        setIsPlaying(false);
        return;
      }

      currentAudio.pause();
      currentAudio.currentTime = 0;

      currentIndexRef.current = standbyIndexRef.current;
      activeSlotRef.current = activeSlotRef.current === 0 ? 1 : 0;
      nextAudio.currentTime = 0;
      nextAudio.volume = DEFAULT_VOLUME;

      try {
        await nextAudio.play();
        preloadFollowingTrack();
        syncPlayState();
      } catch {
        setIsPlaying(false);
      }
    };

    const handleNativeToggle = () => {
      void handleToggleRequest();
    };

    for (const audio of allAudios) {
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
    }
    button.addEventListener("click", handleNativeToggle);
    button.addEventListener("touchend", handleNativeToggle, { passive: true });
    button.addEventListener("pointerup", handleNativeToggle);

    return () => {
      for (const audio of allAudios) {
        audio.pause();
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      }
      button.removeEventListener("click", handleNativeToggle);
      button.removeEventListener("touchend", handleNativeToggle);
      button.removeEventListener("pointerup", handleNativeToggle);
    };
  }, []);

  async function togglePlayback() {
    const activeAudio = audioRefs.current[activeSlotRef.current];
    if (!activeAudio) {
      return;
    }

    const standbyAudio = audioRefs.current[activeSlotRef.current === 0 ? 1 : 0];
    if (standbyAudio && !standbyAudio.paused) {
      standbyAudio.pause();
      standbyAudio.currentTime = 0;
    }

    const audio = activeAudio;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      pausedByUserRef.current = true;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    pausedByUserRef.current = false;
    audio.volume = DEFAULT_VOLUME;

    try {
      await audio.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  async function handleToggleRequest() {
    const now = Date.now();
    if (now - lastToggleAtRef.current < DUPLICATE_TAP_GUARD_MS) {
      return;
    }

    lastToggleAtRef.current = now;
    await togglePlayback();
  }

  return (
    <>
      <audio
        ref={(node) => {
          audioRefs.current[0] = node;
        }}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        preload="auto"
        playsInline
      />

      <audio
        ref={(node) => {
          audioRefs.current[1] = node;
        }}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        preload="auto"
        playsInline
      />

      <button
        ref={buttonRef}
        type="button"
        onClick={() => void handleToggleRequest()}
        onPointerUp={() => void handleToggleRequest()}
        onTouchEnd={() => void handleToggleRequest()}
        aria-label={isPlaying ? "关闭背景音乐" : "打开背景音乐"}
        className="fixed bottom-4 left-4 z-50 h-[4.6rem] w-[4.6rem] touch-manipulation overflow-hidden bg-transparent active:scale-[0.98]"
      >
        <Image
          src="/music-toggle.png"
          alt=""
          fill
          unoptimized
          sizes="74px"
          className={`object-contain transition duration-300 ${isPlaying ? "animate-[spin_7s_linear_infinite] opacity-100" : "opacity-78 grayscale-[0.08]"}`}
        />
      </button>
    </>
  );
}
