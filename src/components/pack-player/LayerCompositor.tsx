"use client";

import { useEffect, useRef } from "react";
import clsx from "clsx";
import type { GiftPackLayer, GiftPackProject } from "@/types/gift-pack";
import type { AudioLayerData, ImageLayerData, TextLayerData, VideoLayerData } from "@/types/gift-pack";
import { normalizeImageData, normalizeTextData, normalizeVideoData } from "@/lib/gift-pack/layer-normalize";
import { AnimatedText } from "./AnimatedText";

function visibleAt(layer: GiftPackLayer, t: number) {
  return layer.visible && t >= layer.startMs && t < layer.startMs + layer.durationMs;
}

export function LayerCompositor({
  project,
  layers,
  contentTimeMs,
  animateText,
}: {
  project: GiftPackProject;
  layers: GiftPackLayer[];
  contentTimeMs: number;
  animateText?: boolean;
}) {
  const audioRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const unlockedRef = useRef(false);

  useEffect(() => {
    const audios = layers.filter((l) => l.type === "audio" && visibleAt(l, contentTimeMs));
    for (const layer of audios) {
      const d = layer.data as AudioLayerData;
      if (!d.src) continue;
      if (d.trigger === "timeline" && !visibleAt(layer, contentTimeMs)) continue;

      let el = audioRefs.current.get(layer.id);
      if (!el) {
        el = new Audio(d.src);
        audioRefs.current.set(layer.id, el);
      }
      el.volume = d.volume;
      el.playbackRate = d.playbackRate ?? 1;
      el.loop = d.loop;
      const rel = contentTimeMs - layer.startMs + (d.startMs ?? 0);
      if (unlockedRef.current && el.paused) {
        el.currentTime = Math.max(0, rel / 1000);
        void el.play().catch(() => {});
      }
    }
    return () => {
      audioRefs.current.forEach((a) => {
        a.pause();
      });
    };
  }, [contentTimeMs, layers]);

  const markUnlocked = () => {
    unlockedRef.current = true;
  };

  const bg =
    project.backgroundKind === "gradient" && project.backgroundGradient
      ? project.backgroundGradient
      : project.backgroundColor;

  const sorted = [...layers]
    .filter((l) => visibleAt(l, contentTimeMs))
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="relative w-full"
      onPointerDown={markUnlocked}
      onClick={markUnlocked}
    >
      <div
        className="relative min-h-[120px] w-full overflow-hidden rounded-xl"
        style={{
          background: bg,
          opacity: project.backgroundOpacity ?? 1,
        }}
      >
        {project.backgroundKind === "image" && project.backgroundImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.backgroundImage}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: project.backgroundBlur ? `blur(${project.backgroundBlur}px)` : undefined }}
          />
        )}
        {project.backgroundKind === "video" && project.backgroundVideo && (
          <video
            src={project.backgroundVideo}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        )}
        <div className="relative flex flex-col items-center gap-3 p-4">
          {sorted.map((layer) => {
            if (layer.type === "text") {
              const d = normalizeTextData(layer.data as TextLayerData);
              if (animateText) {
                return <AnimatedText key={layer.id} data={d} active />;
              }
              return (
                <p
                  key={layer.id}
                  className="max-w-md px-4 py-3 text-center"
                  style={{
                    color: d.color,
                    fontSize: d.fontSize,
                    background: d.bgColor,
                    textAlign: d.align,
                    opacity: d.opacity,
                    fontWeight: d.bold ? "bold" : undefined,
                    fontStyle: d.italic ? "italic" : undefined,
                    transform: `rotate(${d.rotation}deg)`,
                  }}
                >
                  {d.content}
                </p>
              );
            }
            if (layer.type === "image") {
              const d = normalizeImageData(layer.data as ImageLayerData);
              if (!d.src) return null;
              return (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={layer.id}
                  src={d.src}
                  alt=""
                  className={clsx(d.shadow && "shadow-lg")}
                  style={{
                    width: d.width,
                    height: d.height,
                    objectFit: d.objectFit,
                    opacity: d.opacity,
                    borderRadius: d.borderRadius,
                    transform: `rotate(${d.rotation}deg) scale(${d.scale ?? 1}) scaleX(${d.flipX ? -1 : 1}) scaleY(${d.flipY ? -1 : 1})`,
                  }}
                />
              );
            }
            if (layer.type === "video") {
              const d = normalizeVideoData(layer.data as VideoLayerData);
              if (!d.src) return null;
              return (
                <video
                  key={layer.id}
                  src={d.src}
                  controls
                  playsInline
                  muted={d.muted}
                  className="max-w-md rounded-xl"
                  style={{ width: d.width, opacity: d.opacity }}
                />
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
