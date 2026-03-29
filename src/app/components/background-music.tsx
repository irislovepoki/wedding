"use client";

import Image from "next/image";
import { useEffect, useEffectEvent, useRef, useState } from "react";

const playlist = [
  { src: "/music-1.mp4", startAt: 1 },
  { src: "/music-2.mp4", startAt: 1 },
];

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const indexRef = useRef(0);
  const pausedByUserRef = useRef(false);
  const shouldAutoplayAfterLoadRef = useRef(true);
  const pendingSeekRef = useRef(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const syncPlayState = useEffectEvent(() => {
    const audio = audioRef.current;
    setIsPlaying(Boolean(audio && !audio.paused));
  });

  const seekToTrackStart = useEffectEvent(() => {
    const audio = audioRef.current;
    const track = playlist[indexRef.current];
    if (!audio || !track) {
      return;
    }

    const duration = Number.isFinite(audio.duration) ? audio.duration : null;
    const targetTime =
      duration && duration > 0
        ? Math.min(track.startAt, Math.max(0, duration - 0.05))
        : track.startAt;

    if (targetTime > 0 && Math.abs(audio.currentTime - targetTime) > 0.08) {
      try {
        audio.currentTime = targetTime;
      } catch {
        return;
      }
    }
  });

  const playAudio = useEffectEvent(async () => {
    const audio = audioRef.current;
    if (!audio || pausedByUserRef.current) {
      return false;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      setIsReady(true);
      return true;
    } catch {
      syncPlayState();
      return false;
    }
  });

  const loadTrack = useEffectEvent((index: number, autoplay: boolean) => {
    const audio = audioRef.current;
    const track = playlist[index];
    if (!audio || !track) {
      return;
    }

    indexRef.current = index;
    pendingSeekRef.current = true;
    shouldAutoplayAfterLoadRef.current = autoplay;
    setIsReady(false);

    const nextSrc = new URL(track.src, window.location.origin).toString();
    if (audio.src === nextSrc) {
      seekToTrackStart();
      pendingSeekRef.current = false;
      if (autoplay) {
        void playAudio();
      }
      return;
    }

    audio.src = track.src;
    audio.load();
  });

  const advanceTrack = useEffectEvent(() => {
    const nextIndex = (indexRef.current + 1) % playlist.length;
    pausedByUserRef.current = false;
    loadTrack(nextIndex, true);
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    audio.preload = "auto";
    audio.loop = false;
    audio.volume = 0.24;
    audio.autoplay = true;
    audio.setAttribute("playsinline", "true");
    audio.setAttribute("webkit-playsinline", "true");
    audio.setAttribute("x5-playsinline", "true");

    const handleLoadedMetadata = () => {
      if (pendingSeekRef.current) {
        seekToTrackStart();
        pendingSeekRef.current = false;
      }

      setIsReady(true);

      if (shouldAutoplayAfterLoadRef.current && !pausedByUserRef.current) {
        void playAudio();
      }
    };

    const handleCanPlay = () => {
      if (shouldAutoplayAfterLoadRef.current && !pausedByUserRef.current) {
        void playAudio();
      }
    };

    const handleEnded = () => {
      void advanceTrack();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsReady(true);
    };

    const handlePause = () => {
      syncPlayState();
    };

    const attemptAutoplay = () => {
      if (pausedByUserRef.current) {
        return;
      }

      const currentTrack = playlist[indexRef.current];
      if (!currentTrack) {
        return;
      }

      const expectedSrc = new URL(currentTrack.src, window.location.origin).toString();
      if (audio.src !== expectedSrc) {
        loadTrack(indexRef.current, true);
        return;
      }

      shouldAutoplayAfterLoadRef.current = true;
      if (pendingSeekRef.current) {
        seekToTrackStart();
        pendingSeekRef.current = false;
      }
      void playAudio();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    const handleWeChatReady = () => {
      attemptAutoplay();
    };

    const handlePageShow = () => {
      attemptAutoplay();
    };

    loadTrack(0, true);
    document.addEventListener("WeixinJSBridgeReady", handleWeChatReady as EventListener);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      document.removeEventListener("WeixinJSBridgeReady", handleWeChatReady as EventListener);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [advanceTrack, loadTrack, playAudio, seekToTrackStart, syncPlayState]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    if (!audio.paused) {
      pausedByUserRef.current = true;
      shouldAutoplayAfterLoadRef.current = false;
      audio.pause();
      setIsPlaying(false);
      return;
    }

    pausedByUserRef.current = false;
    shouldAutoplayAfterLoadRef.current = false;
    if (pendingSeekRef.current) {
      seekToTrackStart();
      pendingSeekRef.current = false;
    }
    await playAudio();
  }

  return (
    <>
      <audio
        ref={audioRef}
        className="hidden"
        preload="auto"
        autoPlay
        playsInline
      />

      <button
        type="button"
        onClick={() => void togglePlayback()}
        aria-label={isPlaying ? "关闭背景音乐" : "打开背景音乐"}
        className="fixed bottom-4 left-4 z-50 h-[4.6rem] w-[4.6rem] overflow-hidden bg-transparent active:scale-[0.98]"
      >
        <Image
          src="/music-toggle.png"
          alt=""
          fill
          unoptimized
          sizes="74px"
          className={`object-contain transition duration-300 ${isPlaying ? "animate-[spin_7s_linear_infinite] opacity-100" : "opacity-78 grayscale-[0.08]"}`}
        />

        {!isReady && !isPlaying ? (
          <span className="absolute inset-x-0 bottom-1 text-center text-[9px] tracking-[0.14em] text-[#f9ebd0]">
            MUSIC
          </span>
        ) : null}
      </button>
    </>
  );
}
