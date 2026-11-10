"use client";

import clsx from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";
import { usePackEditor } from "@/context/PackEditorContext";
import type { GiftPackLayer, LayerTrack } from "@/types/gift-pack";

const TRACKS: { id: LayerTrack; label: string }[] = [
  { id: "gift", label: "Gift" },
  { id: "text", label: "Text" },
  { id: "image", label: "Photo" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
  { id: "animation", label: "Anim" },
  { id: "background", label: "BG" },
];

type DragMode = "move" | "resize-end" | null;

export function TimelinePanel({ compact = false }: { compact?: boolean }) {
  const {
    project,
    selectedNode,
    patchProject,
    selectedLayerId,
    selectLayer,
    updateLayer,
    playheadMs,
    setPlayheadMs,
    duplicateLayer,
    splitLayerAtPlayhead,
    removeLayer,
    pushHistory,
  } = usePackEditor();

  const duration = project.timelineDurationMs;
  const layers = selectedNode?.layers ?? [];
  const trackRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const dragRef = useRef<{
    layerId: string;
    mode: DragMode;
    startX: number;
    origStart: number;
    origDur: number;
  } | null>(null);

  const playAnchor = useRef(0);
  useEffect(() => {
    if (!playing) return;
    const startMs = playAnchor.current;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const t = startMs + (performance.now() - t0);
      if (t >= duration) {
        setPlayheadMs(duration);
        setPlaying(false);
        return;
      }
      setPlayheadMs(Math.round(t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, duration, setPlayheadMs]);

  const pxToMs = useCallback(
    (dx: number) => {
      const w = trackRef.current?.clientWidth ?? 600;
      return (dx / w) * duration;
    },
    [duration]
  );

  const onPointerDownClip = (
    e: React.PointerEvent,
    layer: GiftPackLayer,
    mode: DragMode
  ) => {
    e.stopPropagation();
    selectLayer(layer.id);
    pushHistory();
    dragRef.current = {
      layerId: layer.id,
      mode,
      startX: e.clientX,
      origStart: layer.startMs,
      origDur: layer.durationMs,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const delta = pxToMs(e.clientX - d.startX);
    if (d.mode === "move") {
      const start = Math.max(0, Math.min(duration - d.origDur, Math.round(d.origStart + delta)));
      updateLayer(d.layerId, { startMs: start }, { recordHistory: false });
    } else if (d.mode === "resize-end") {
      const dur = Math.max(200, Math.min(duration - d.origStart, Math.round(d.origDur + delta)));
      updateLayer(d.layerId, { durationMs: dur }, { recordHistory: false });
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const seekFromClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ms = Math.round((x / rect.width) * duration);
    setPlayheadMs(Math.max(0, Math.min(duration, ms)));
  };

  const itemsForTrack = (trackId: LayerTrack) =>
    layers.filter(
      (l) =>
        l.track === trackId ||
        (trackId === "gift" && l.type === "effect") ||
        (trackId === "animation" && l.type === "sticker")
    );

  return (
    <footer className="border-t border-white/10 bg-[#08050f] p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/45">Timeline</span>
          <button
            type="button"
            onClick={() => {
              setPlaying((p) => {
                if (!p) playAnchor.current = playheadMs;
                return !p;
              });
            }}
            className="touch-manipulation min-h-9 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white"
          >
            {playing ? "Pause" : "Play"}
          </button>
          <span className="text-[10px] tabular-nums text-white/50">
            {playheadMs} / {duration} ms
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {selectedLayerId && (
            <>
              <button
                type="button"
                onClick={() => duplicateLayer(selectedLayerId)}
                className="touch-manipulation min-h-9 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white"
              >
                Duplicate
              </button>
              <button
                type="button"
                onClick={() => splitLayerAtPlayhead(selectedLayerId, playheadMs)}
                className="touch-manipulation min-h-9 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white"
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => removeLayer(selectedLayerId)}
                className="rounded bg-rose-500/30 px-2 py-0.5 text-[10px] text-rose-100"
              >
                Delete
              </button>
            </>
          )}
          <label className="flex items-center gap-2 text-[10px] text-white/50">
            দৈর্ঘ্য
            <input
              type="number"
              min={3000}
              max={120000}
              step={500}
              value={duration}
              onChange={(e) => patchProject({ timelineDurationMs: Number(e.target.value) })}
              className="w-20 rounded border border-white/10 bg-black/40 px-1 py-0.5 text-white"
            />
          </label>
        </div>
      </div>
      <div className="overflow-x-auto scroll-smooth [-webkit-overflow-scrolling:touch]" ref={trackRef}>
        <div
          className={clsx(
            "relative mb-1 h-3 min-w-full cursor-crosshair rounded-lg bg-white/5 md:min-w-[600px]",
            compact && "min-h-[44px]"
          )}
          onClick={seekFromClick}
        >
          <div
            className="absolute top-0 h-full w-0.5 bg-rose-400"
            style={{ left: `${(playheadMs / duration) * 100}%` }}
          />
        </div>
        <div className={clsx("min-w-full md:min-w-[600px]", compact && "min-w-[520px]")} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
          {TRACKS.map((track) => {
            const items = itemsForTrack(track.id);
            return (
              <div key={track.id} className={clsx("mb-1 flex items-center gap-2", compact ? "h-10" : "h-8")}>
                <span className="w-14 shrink-0 text-[10px] text-white/40">{track.label}</span>
                <div
                  className="relative h-6 flex-1 rounded bg-white/5"
                  onClick={seekFromClick}
                >
                  {items.map((l) => {
                    const active = l.id === selectedLayerId;
                    return (
                      <div
                        key={l.id}
                        role="button"
                        tabIndex={0}
                        className={clsx(
                          "absolute top-0 flex h-full cursor-grab items-center overflow-hidden rounded px-1 text-[9px] text-white active:cursor-grabbing",
                          l.type === "text" && "bg-violet-600/85",
                          l.type === "image" && "bg-sky-600/85",
                          l.type === "video" && "bg-fuchsia-600/85",
                          l.type === "audio" && "bg-emerald-600/85",
                          active && "ring-2 ring-amber-300",
                          !l.visible && "opacity-40"
                        )}
                        style={{
                          left: `${(l.startMs / duration) * 100}%`,
                          width: `${Math.max((l.durationMs / duration) * 100, 2)}%`,
                        }}
                        title={`${l.name} · ${l.startMs}ms`}
                        onPointerDown={(e) => onPointerDownClip(e, l, "move")}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectLayer(l.id);
                        }}
                      >
                        {l.name}
                        <span
                          className="absolute right-0 top-0 h-full w-1.5 cursor-ew-resize bg-white/40"
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            onPointerDownClip(e, l, "resize-end");
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
