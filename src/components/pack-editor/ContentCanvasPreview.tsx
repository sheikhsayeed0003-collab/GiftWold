"use client";

import clsx from "clsx";
import { usePackEditor } from "@/context/PackEditorContext";
import type { ImageLayerData, TextLayerData, VideoLayerData } from "@/types/gift-pack";
import { normalizeImageData, normalizeTextData, normalizeVideoData } from "@/lib/gift-pack/layer-normalize";

function layerVisibleAt(layerStart: number, layerDur: number, t: number) {
  return t >= layerStart && t < layerStart + layerDur;
}

export function ContentCanvasPreview() {
  const { selectedNode, project, playheadMs } = usePackEditor();
  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-white/40">বক্স নির্বাচন করুন</div>
    );
  }

  const bg =
    project.backgroundKind === "gradient" && project.backgroundGradient
      ? project.backgroundGradient
      : project.backgroundColor;

  const layers = [...selectedNode.layers]
    .filter((l) => l.visible && layerVisibleAt(l.startMs, l.durationMs, playheadMs))
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl"
      style={{
        background: bg,
        opacity: project.backgroundOpacity ?? 1,
        filter: project.backgroundBlur ? `blur(${project.backgroundBlur}px)` : undefined,
      }}
    >
      {project.backgroundKind === "image" && project.backgroundImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.backgroundImage}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      )}
      <div className="relative flex h-full min-h-[240px] flex-col items-center justify-center p-4">
        {layers.map((layer) => {
          if (layer.type === "text") {
            const d = normalizeTextData(layer.data as TextLayerData);
            return (
              <p
                key={layer.id}
                className="mb-2 max-w-[90%] px-3 py-2 text-center"
                style={{
                  color: d.color,
                  fontSize: d.fontSize,
                  background: d.bgColor,
                  textAlign: d.align,
                  opacity: d.opacity,
                  fontWeight: d.bold ? "bold" : undefined,
                  fontStyle: d.italic ? "italic" : undefined,
                  letterSpacing: d.letterSpacing,
                  lineHeight: d.lineHeight,
                  border:
                    d.borderWidth && d.borderWidth > 0
                      ? `${d.borderWidth}px solid ${d.borderColor}`
                      : undefined,
                  transform: `translate(${d.x}px, ${d.y}px) rotate(${d.rotation}deg)`,
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
                className={clsx("mb-2", d.shadow && "shadow-lg shadow-black/40")}
                style={{
                  width: d.width,
                  height: d.height,
                  objectFit: d.objectFit,
                  opacity: d.opacity,
                  borderRadius: d.borderRadius,
                  border:
                    d.borderWidth && d.borderWidth > 0
                      ? `${d.borderWidth}px solid ${d.borderColor}`
                      : undefined,
                  transform: `translate(${d.x}px, ${d.y}px) rotate(${d.rotation}deg) scale(${d.scale ?? 1}) scaleX(${d.flipX ? -1 : 1}) scaleY(${d.flipY ? -1 : 1})`,
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
                muted={d.muted}
                playsInline
                className="mb-2 rounded-xl"
                style={{
                  width: d.width,
                  opacity: d.opacity,
                  transform: `translate(${d.x}px, ${d.y}px) rotate(${d.rotation ?? 0}deg)`,
                }}
              />
            );
          }
          return null;
        })}
        <p className="absolute bottom-2 right-2 text-[9px] text-white/30">playhead {playheadMs}ms</p>
      </div>
    </div>
  );
}
