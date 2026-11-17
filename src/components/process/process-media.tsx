"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { ProcessStep } from "@/types/content";

export function ProcessMedia({
  step,
  active,
  reduced,
  fallbackSrc,
  priority,
}: {
  step: ProcessStep;
  active: boolean;
  reduced: boolean;
  fallbackSrc: string;
  priority?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const src = step.mediaUrl;
  const isVideo = step.mediaType === "video" && !!src;
  const isRaster = step.mediaType === "image" && !!src && !src.endsWith(".svg");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active && !reduced) {
      video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [active, reduced]);

  if (isVideo && src) {
    return (
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={src}
        muted
        playsInline
        loop
        preload="metadata"
        aria-label={step.mediaAlt}
      />
    );
  }

  if (step.mediaType === "lottie") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-dark text-sm text-white/50">
        {step.mediaAlt || step.title}
      </div>
    );
  }

  if (isRaster && src) {
    return (
      <Image
        src={src}
        alt={step.mediaAlt}
        fill
        unoptimized
        priority={priority}
        sizes="(min-width: 1024px) 58vw, 100vw"
        className="object-cover"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src || fallbackSrc} alt={step.mediaAlt} className="h-full w-full object-cover" />
  );
}
