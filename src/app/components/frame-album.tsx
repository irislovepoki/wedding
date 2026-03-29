"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type AlbumPhoto = {
  src: string;
  alt: string;
  objectPosition: string;
  fit: "contain" | "cover";
};

type ZoomState = {
  scale: number;
  x: number;
  y: number;
};

type GestureState =
  | {
      mode: "pinch";
      startDistance: number;
      startScale: number;
      startMidX: number;
      startMidY: number;
      baseX: number;
      baseY: number;
    }
  | {
      mode: "pan";
      startX: number;
      startY: number;
      baseX: number;
      baseY: number;
    }
  | null;

const MIN_SCALE = 1;
const MAX_SCALE = 4;

function createDefaultZoomState(): ZoomState {
  return { scale: 1, x: 0, y: 0 };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(touches: React.TouchList) {
  const firstTouch = touches[0];
  const secondTouch = touches[1];
  if (!firstTouch || !secondTouch) {
    return 0;
  }

  return Math.hypot(
    secondTouch.clientX - firstTouch.clientX,
    secondTouch.clientY - firstTouch.clientY,
  );
}

function getMidpoint(touches: React.TouchList) {
  const firstTouch = touches[0];
  const secondTouch = touches[1];
  if (!firstTouch || !secondTouch) {
    return { x: 0, y: 0 };
  }

  return {
    x: (firstTouch.clientX + secondTouch.clientX) / 2,
    y: (firstTouch.clientY + secondTouch.clientY) / 2,
  };
}

export function FrameAlbum({
  photos,
  className,
  bleedClassName = "-inset-[1.8%]",
}: {
  photos: AlbumPhoto[];
  className: string;
  bleedClassName?: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>(createDefaultZoomState);
  const gestureRef = useRef<GestureState>(null);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeIndex]);

  function closeViewer() {
    setActiveIndex(null);
    setZoomState(createDefaultZoomState());
    gestureRef.current = null;
  }

  function openViewer(index: number) {
    setActiveIndex(index);
    setZoomState(createDefaultZoomState());
    gestureRef.current = null;
  }

  function clampOffsets(scale: number, x: number, y: number, rect: DOMRect) {
    if (scale <= MIN_SCALE) {
      return { x: 0, y: 0 };
    }

    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;

    return {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY),
    };
  }

  function handleViewerTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    if (event.touches.length === 2) {
      const midpoint = getMidpoint(event.touches);
      gestureRef.current = {
        mode: "pinch",
        startDistance: getDistance(event.touches),
        startScale: zoomState.scale,
        startMidX: midpoint.x - rect.left - rect.width / 2,
        startMidY: midpoint.y - rect.top - rect.height / 2,
        baseX: zoomState.x,
        baseY: zoomState.y,
      };
      return;
    }

    if (event.touches.length === 1 && zoomState.scale > MIN_SCALE) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      gestureRef.current = {
        mode: "pan",
        startX: touch.clientX,
        startY: touch.clientY,
        baseX: zoomState.x,
        baseY: zoomState.y,
      };
    }
  }

  function handleViewerTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    const gesture = gestureRef.current;
    if (!gesture) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    if (gesture.mode === "pinch" && event.touches.length === 2) {
      event.preventDefault();

      const distance = getDistance(event.touches);
      if (distance <= 0 || gesture.startDistance <= 0) {
        return;
      }

      const nextScale = clamp(
        gesture.startScale * (distance / gesture.startDistance),
        MIN_SCALE,
        MAX_SCALE,
      );
      const midpoint = getMidpoint(event.touches);
      const currentMidX = midpoint.x - rect.left - rect.width / 2;
      const currentMidY = midpoint.y - rect.top - rect.height / 2;
      const nextX =
        currentMidX - (gesture.startMidX - gesture.baseX) * (nextScale / gesture.startScale);
      const nextY =
        currentMidY - (gesture.startMidY - gesture.baseY) * (nextScale / gesture.startScale);
      const clampedOffsets = clampOffsets(nextScale, nextX, nextY, rect);

      setZoomState({
        scale: nextScale,
        x: clampedOffsets.x,
        y: clampedOffsets.y,
      });
      return;
    }

    if (gesture.mode === "pan" && event.touches.length === 1) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      event.preventDefault();
      const nextX = gesture.baseX + touch.clientX - gesture.startX;
      const nextY = gesture.baseY + touch.clientY - gesture.startY;
      const clampedOffsets = clampOffsets(zoomState.scale, nextX, nextY, rect);

      setZoomState({
        scale: zoomState.scale,
        x: clampedOffsets.x,
        y: clampedOffsets.y,
      });
    }
  }

  function handleViewerTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length === 1 && zoomState.scale > MIN_SCALE) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      gestureRef.current = {
        mode: "pan",
        startX: touch.clientX,
        startY: touch.clientY,
        baseX: zoomState.x,
        baseY: zoomState.y,
      };
      return;
    }

    gestureRef.current = null;

    if (zoomState.scale <= 1.01) {
      setZoomState(createDefaultZoomState());
    }
  }

  const activePhoto = activeIndex === null ? null : photos[activeIndex] ?? null;

  return (
    <>
      <div className={`absolute z-0 overflow-hidden ${className}`}>
        <div className={`absolute ${bleedClassName}`}>
          <div className="album-scroll flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                className="relative h-full min-w-full shrink-0 snap-center overflow-hidden bg-transparent text-left"
                onClick={() => openViewer(index)}
                aria-label={`查看${photo.alt}`}
              >
                <Image
                  src="/polaroid-paper.png"
                  alt=""
                  fill
                  unoptimized
                  sizes="84vw"
                  className="object-cover"
                />
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  unoptimized
                  sizes="84vw"
                  className={photo.fit === "contain" ? "object-contain" : "object-cover"}
                  style={{
                    objectPosition: photo.objectPosition,
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {activePhoto ? (
        <div className="fixed inset-0 z-[120] bg-[rgba(28,8,11,0.94)] backdrop-blur-[2px]">
          <button
            type="button"
            className="absolute right-4 top-4 z-10 rounded-full border border-[#d7b27a]/35 bg-[rgba(84,28,33,0.86)] px-3 py-1 text-sm text-[#f4e0bb]"
            onClick={closeViewer}
          >
            关闭
          </button>

          <div
            className="absolute inset-0 flex items-center justify-center overflow-hidden px-4 py-16"
            style={{ touchAction: "none" }}
            onTouchStart={handleViewerTouchStart}
            onTouchMove={handleViewerTouchMove}
            onTouchEnd={handleViewerTouchEnd}
            onTouchCancel={() => {
              gestureRef.current = null;
              setZoomState(createDefaultZoomState());
            }}
          >
            <div
              className="relative h-full w-full max-h-[88vh] max-w-[92vw] transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${zoomState.x}px, ${zoomState.y}px, 0) scale(${zoomState.scale})`,
              }}
            >
              <Image
                src={activePhoto.src}
                alt={activePhoto.alt}
                fill
                unoptimized
                sizes="92vw"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
