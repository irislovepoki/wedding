"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const playlist = ["/music-1.mp4", "/music-2.mp4"];
const DEFAULT_VOLUME = 0.24;
const DUPLICATE_TAP_GUARD_MS = 400;

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const currentIndexRef = useRef(0);
  const pausedByUserRef = useRef(true);
  const lastToggleAtRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    const button = buttonRef.current;
    if (!audio || !button) {
      return;
    }

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = DEFAULT_VOLUME;
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.setAttribute("x5-playsinline", "true");
    audio.src = playlist[0]!;
    audio.load();

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = async () => {
      if (pausedByUserRef.current) {
        return;
      }

      const nextIndex = (currentIndexRef.current + 1) % playlist.length;
      currentIndexRef.current = nextIndex;
      audio.src = playlist[nextIndex]!;
      audio.load();

      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
    };

    const handleNativeToggle = () => {
      void handleToggleRequest();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    button.addEventListener("click", handleNativeToggle);
    button.addEventListener("touchend", handleNativeToggle, { passive: true });
    button.addEventListener("pointerup", handleNativeToggle);

    return () => {
      audio.pause();
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      button.removeEventListener("click", handleNativeToggle);
      button.removeEventListener("touchend", handleNativeToggle);
      button.removeEventListener("pointerup", handleNativeToggle);
    };
  }, []);

  async function togglePlayback() {
    const audio = audioRef.current;
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
        ref={audioRef}
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
