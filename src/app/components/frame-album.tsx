"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
      index: number;
      mode: "pinch";
      startDistance: number;
      startScale: number;
      startMidX: number;
      startMidY: number;
      baseX: number;
      baseY: number;
    }
  | {
      index: number;
      mode: "pan";
      startX: number;
      startY: number;
      baseX: number;
      baseY: number;
    }
  | null;

const MIN_SCALE = 1;
const MAX_SCALE = 3;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getDistance(touches: React.TouchList) {
  const [firstTouch, secondTouch] = [touches[0], touches[1]];
  if (!firstTouch || !secondTouch) {
    return 0;
  }

  return Math.hypot(
    secondTouch.clientX - firstTouch.clientX,
    secondTouch.clientY - firstTouch.clientY,
  );
}

function getMidpoint(touches: React.TouchList) {
  const [firstTouch, secondTouch] = [touches[0], touches[1]];
  if (!firstTouch || !secondTouch) {
    return { x: 0, y: 0 };
  }

  return {
    x: (firstTouch.clientX + secondTouch.clientX) / 2,
    y: (firstTouch.clientY + secondTouch.clientY) / 2,
  };
}

function createDefaultZoomState(): ZoomState {
  return { scale: 1, x: 0, y: 0 };
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
  const [zoomStates, setZoomStates] = useState<ZoomState[]>(
    () => photos.map(() => createDefaultZoomState()),
  );
  const gestureRef = useRef<GestureState>(null);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);

  function updateZoomState(index: number, nextState: ZoomState) {
    setZoomStates((currentStates) =>
      currentStates.map((state, stateIndex) =>
        stateIndex === index ? nextState : state,
      ),
    );
  }

  function resetZoom(index: number) {
    updateZoomState(index, createDefaultZoomState());
    setZoomedIndex((currentIndex) => (currentIndex === index ? null : currentIndex));
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

  function handleTouchStart(
    index: number,
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    const rect = event.currentTarget.getBoundingClientRect();
    const currentZoom = zoomStates[index] ?? createDefaultZoomState();

    if (event.touches.length === 2) {
      const midpoint = getMidpoint(event.touches);
      const centerRelativeMidpoint = {
        x: midpoint.x - rect.left - rect.width / 2,
        y: midpoint.y - rect.top - rect.height / 2,
      };

      gestureRef.current = {
        index,
        mode: "pinch",
        startDistance: getDistance(event.touches),
        startScale: currentZoom.scale,
        startMidX: centerRelativeMidpoint.x,
        startMidY: centerRelativeMidpoint.y,
        baseX: currentZoom.x,
        baseY: currentZoom.y,
      };
      setZoomedIndex(index);
      return;
    }

    if (event.touches.length === 1 && currentZoom.scale > MIN_SCALE) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      gestureRef.current = {
        index,
        mode: "pan",
        startX: touch.clientX,
        startY: touch.clientY,
        baseX: currentZoom.x,
        baseY: currentZoom.y,
      };
    }
  }

  function handleTouchMove(
    index: number,
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    const gesture = gestureRef.current;
    if (!gesture || gesture.index !== index) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    if (gesture.mode === "pinch" && event.touches.length === 2) {
      event.preventDefault();

      const distance = getDistance(event.touches);
      if (distance <= 0 || gesture.startDistance <= 0) {
        return;
      }

      const ratio = distance / gesture.startDistance;
      const nextScale = clamp(gesture.startScale * ratio, MIN_SCALE, MAX_SCALE);
      const midpoint = getMidpoint(event.touches);
      const currentMidX = midpoint.x - rect.left - rect.width / 2;
      const currentMidY = midpoint.y - rect.top - rect.height / 2;

      const nextX =
        currentMidX - (gesture.startMidX - gesture.baseX) * (nextScale / gesture.startScale);
      const nextY =
        currentMidY - (gesture.startMidY - gesture.baseY) * (nextScale / gesture.startScale);
      const clampedOffsets = clampOffsets(nextScale, nextX, nextY, rect);

      updateZoomState(index, {
        scale: nextScale,
        x: clampedOffsets.x,
        y: clampedOffsets.y,
      });
      setZoomedIndex(index);
      return;
    }

    if (gesture.mode === "pan" && event.touches.length === 1) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      event.preventDefault();
      const currentZoom = zoomStates[index] ?? createDefaultZoomState();
      const nextX = gesture.baseX + touch.clientX - gesture.startX;
      const nextY = gesture.baseY + touch.clientY - gesture.startY;
      const clampedOffsets = clampOffsets(currentZoom.scale, nextX, nextY, rect);

      updateZoomState(index, {
        scale: currentZoom.scale,
        x: clampedOffsets.x,
        y: clampedOffsets.y,
      });
    }
  }

  function handleTouchEnd(
    index: number,
    event: React.TouchEvent<HTMLDivElement>,
  ) {
    const gesture = gestureRef.current;
    const currentZoom = zoomStates[index] ?? createDefaultZoomState();

    if (event.touches.length === 1 && currentZoom.scale > MIN_SCALE) {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      gestureRef.current = {
        index,
        mode: "pan",
        startX: touch.clientX,
        startY: touch.clientY,
        baseX: currentZoom.x,
        baseY: currentZoom.y,
      };
      return;
    }

    gestureRef.current = null;

    if (currentZoom.scale <= 1.01) {
      resetZoom(index);
      return;
    }

    if (gesture?.index === index) {
      setZoomedIndex(index);
    }
  }

  return (
    <div className={`absolute z-0 overflow-hidden ${className}`}>
      <div className={`absolute ${bleedClassName}`}>
        <div
          className={`album-scroll flex h-full w-full snap-x overflow-y-hidden scroll-smooth ${
            zoomedIndex === null
              ? "snap-mandatory overflow-x-auto"
              : "overflow-x-hidden"
          }`}
        >
          {photos.map((photo, index) => {
            const zoomState = zoomStates[index] ?? createDefaultZoomState();
            const isZoomed = zoomState.scale > MIN_SCALE;

            return (
              <div
                key={photo.src}
                className="relative h-full min-w-full shrink-0 snap-center overflow-hidden"
                style={{
                  touchAction: isZoomed ? "none" : "pan-x",
                }}
                onTouchStart={(event) => handleTouchStart(index, event)}
                onTouchMove={(event) => handleTouchMove(index, event)}
                onTouchEnd={(event) => handleTouchEnd(index, event)}
                onTouchCancel={() => resetZoom(index)}
              >
                <Image
                  src="/polaroid-paper.png"
                  alt=""
                  fill
                  unoptimized
                  sizes="84vw"
                  className="object-cover"
                />

                <div
                  className="absolute inset-0 transition-transform duration-150 ease-out"
                  style={{
                    transform: `translate3d(${zoomState.x}px, ${zoomState.y}px, 0) scale(${zoomState.scale})`,
                  }}
                >
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
