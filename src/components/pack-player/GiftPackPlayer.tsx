"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import clsx from "clsx";
import type { GiftPackNode, GiftPackProject, GiftPackLayer } from "@/types/gift-pack";
import type { AudioLayerData } from "@/types/gift-pack";
import { formatSequenceLabel, getSequenceRoots } from "@/lib/gift-pack/sequence";
import { Viewport3D } from "@/components/pack-editor/Viewport3D";
import { getTvContentSlides, normalizeTvScreen } from "@/lib/gift-pack/tv-screen";
import { useIsMobile } from "@/hooks/useMediaQuery";
import {
  canOpenGiftBox,
  getOpenCount,
  recordGiftBoxOpen,
  remainingOpens,
} from "@/lib/gift-box/open-limit";
import { resolveMaxOpenLimit, resolveRevealMessage } from "@/lib/gift-pack/reveal-message";
import { GiftRevealOverlay } from "@/components/gift-box/GiftRevealOverlay";

export function GiftPackPlayer({
  project,
  preview = false,
}: {
  project: GiftPackProject;
  preview?: boolean;
}) {
  const sequence = useMemo(() => getSequenceRoots(project.roots), [project.roots]);
  const [step, setStep] = useState(0);
  const [opened, setOpened] = useState(false);
  const [showLayers, setShowLayers] = useState(false);
  const [contentTimeMs, setContentTimeMs] = useState(0);
  const [slideTimeMs, setSlideTimeMs] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [tvEmerged, setTvEmerged] = useState(0);
  const [tvPaused, setTvPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [openLocked, setOpenLocked] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [revealText, setRevealText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const current = sequence[step] ?? null;
  const total = sequence.length;
  const isLast = step >= total - 1;
  const maxOpens = current ? resolveMaxOpenLimit(current) : 0;
  const openScope = current
    ? `${project.id ?? "preview"}_${current.id}`
    : "preview";

  useEffect(() => {
    if (preview || !current) {
      setOpenLocked(false);
      return;
    }
    const limited = maxOpens > 0 && !canOpenGiftBox(openScope, maxOpens);
    setOpenLocked(limited);
  }, [current, maxOpens, openScope, preview, step]);
  const tv = useMemo(() => normalizeTvScreen(current?.tvScreen), [current?.tvScreen]);

  const slides = useMemo(
    () => (current ? getTvContentSlides(current.layers) : []),
    [current]
  );

  const layersForTv: GiftPackLayer[] = useMemo(() => {
    if (!current) return [];
    const audio = current.layers.filter((l) => l.type === "audio");
    if (slides.length === 0) {
      return current.layers.filter(
        (l) => l.type !== "audio" || (l.data as AudioLayerData).trigger !== "on_open"
      );
    }
    const slide = slides[slideIdx];
    if (!slide) return audio;
    const vis = current.layers.find((l) => l.id === slide.id);
    return vis ? [...audio, vis] : audio;
  }, [current, slideIdx, slides]);

  const tvContentMs = useMemo(() => {
    if (slides.length === 0) return contentTimeMs;
    const s = slides[slideIdx];
    return (s?.startMs ?? 0) + slideTimeMs;
  }, [contentTimeMs, slideIdx, slideTimeMs, slides]);

  const resetOpenState = useCallback(() => {
    setOpened(false);
    setShowLayers(false);
    setContentTimeMs(0);
    setSlideTimeMs(0);
    setSlideIdx(0);
    setTvEmerged(0);
    setTvPaused(false);
  }, []);

  const burst = useCallback((effect: GiftPackNode["openEffect"]) => {
    if (effect === "confetti" || effect === "both") {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  }, []);

  const openBox = useCallback(() => {
    if (!current || opened || completed || openLocked) return;
    if (!preview && maxOpens > 0 && !canOpenGiftBox(openScope, maxOpens)) {
      setOpenLocked(true);
      return;
    }
    if (!preview && maxOpens > 0) recordGiftBoxOpen(openScope);
    setRevealText(resolveRevealMessage(current));
    setShowReveal(true);
    setOpened(true);
    burst(current.openEffect);

    if (current.opening === "shake" && containerRef.current) {
      containerRef.current.classList.add("animate-shake");
      setTimeout(() => containerRef.current?.classList.remove("animate-shake"), 600);
    }

    const audioLayer = current.layers.find((l) => l.type === "audio" && (l.data as AudioLayerData).trigger === "on_open");
    if (audioLayer && audioRef.current) {
      const d = audioLayer.data as AudioLayerData;
      if (d.src) {
        audioRef.current.src = d.src;
        audioRef.current.volume = d.volume;
        void audioRef.current.play().catch(() => {});
      }
    }

    const delay =
      current.opening === "slow_open" ? 900 : current.opening === "fast_open" ? 200 : 450;
    setTimeout(() => {
      setShowLayers(true);
      setContentTimeMs(0);
      setSlideTimeMs(0);
    }, delay);
  }, [burst, completed, current, maxOpens, openLocked, openScope, opened, preview]);

  useEffect(() => {
    if (!showLayers) return;
    const start = performance.now();
    const duration = tv.emergeDurationMs;
    let raf = 0;
    const tick = () => {
      const t = performance.now() - start;
      setTvEmerged(Math.min(1, t / duration));
      if (t < duration) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showLayers, step, tv.emergeDurationMs]);

  useEffect(() => {
    if (!showLayers || tvPaused) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - t0;
      setContentTimeMs(elapsed);
      setSlideTimeMs(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [showLayers, tvPaused, step, slideIdx]);

  useEffect(() => {
    if (project.globalAudio?.src && opened && audioRef.current) {
      const g = project.globalAudio;
      audioRef.current.src = g.src;
      audioRef.current.volume = g.volume;
      audioRef.current.loop = g.loop;
      void audioRef.current.play().catch(() => {});
    }
  }, [opened, project.globalAudio]);

  const goNext = useCallback(() => {
    if (!opened) return;
    if (isLast) {
      setCompleted(true);
      return;
    }
    resetOpenState();
    setStep((s) => s + 1);
  }, [isLast, opened, resetOpenState]);

  const goPrev = useCallback(() => {
    if (step <= 0) return;
    setCompleted(false);
    resetOpenState();
    setStep((s) => s - 1);
  }, [resetOpenState, step]);

  const tvEmergeVisual = opened
    ? tvEmerged
    : tv.showBeforeOpen
      ? 0.38
      : 0.15;

  const tvSlidePrev = useCallback(() => {
    setSlideIdx((i) => Math.max(0, i - 1));
    setSlideTimeMs(0);
  }, []);

  const tvSlideNext = useCallback(() => {
    setSlideIdx((i) => Math.min(slides.length - 1, i + 1));
    setSlideTimeMs(0);
  }, [slides.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && opened) goNext();
      else if (e.key === "ArrowLeft" && opened) goPrev();
      else if ((e.key === "Enter" || e.key === " ") && !opened && current) {
        e.preventDefault();
        openBox();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goNext, goPrev, openBox, opened]);

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStart.current.x;
    touchStart.current = null;
    if (Math.abs(dx) < 50) return;
    if (dx < 0) {
      if (opened) goNext();
    } else goPrev();
  };

  if (total === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-white/60">
        কোনো গিফট বক্স নেই
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-4xl">🎉</p>
        <h2 className="text-2xl font-bold text-white">তোমার সব গিফট দেখা শেষ!</h2>
        <p className="text-white/60">Gift Completed · {formatSequenceLabel(total)}টি বক্স</p>
      </div>
    );
  }

  if (!current) return null;

  const num = current.sequenceNumber ?? step + 1;

  const openLabel =
    current.opening === "ribbon_pull"
      ? "রিবন টানুন"
      : current.opening === "touch"
        ? "টাচ করে খুলুন"
        : "গিফট খুলুন";

  return (
    <div
      ref={containerRef}
      className="relative min-h-[100dvh] w-full select-none px-3 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 sm:py-8"
      style={{ background: project.backgroundColor }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <audio ref={audioRef} className="hidden" preload="auto" />

      <h1 className="mb-1 text-center text-xl font-bold text-white sm:text-2xl">{project.title}</h1>
      {project.recipientName && (
        <p className="mb-4 text-center text-sm text-white/70">প্রিয় {project.recipientName}</p>
      )}

      <p className="mb-2 text-center text-sm text-white/50">
        গিফট {formatSequenceLabel(num)} / {formatSequenceLabel(total)}
      </p>

      <div className="mx-auto mb-2 flex max-w-lg flex-wrap justify-center gap-1">
        {sequence.map((n, i) => (
          <span
            key={n.id}
            className={clsx(
              "flex h-7 min-w-7 items-center justify-center rounded-md border text-xs",
              i === step
                ? "border-rose-400 bg-rose-500/30 text-white"
                : i < step
                  ? "border-white/10 bg-white/5 text-white/40"
                  : "border-white/10 text-white/25"
            )}
          >
            {formatSequenceLabel(n.sequenceNumber ?? i + 1)}
          </span>
        ))}
      </div>

      {openLocked ? (
        <div className="mx-auto mb-4 max-w-lg rounded-2xl border border-white/15 bg-white/5 px-4 py-6 text-center">
          <p className="font-bengali text-base text-white/90">You have already opened your gift!</p>
          <p className="mt-1 text-sm text-white/50">আপনি এই গিফট বক্স সর্বোচ্চ খোলার সীমায় পৌঁছেছেন।</p>
        </div>
      ) : null}

      {!openLocked ? (
      <div className="mx-auto h-[min(62dvh,420px)] max-w-lg sm:h-[min(58vh,380px)]">
        <Viewport3D
          node={current}
          opened={opened}
          compactTv={isMobile}
          onOpenRequest={!opened && !openLocked ? openBox : undefined}
          tv={{
            project,
            contentTimeMs: tvContentMs,
            emerged: tvEmergeVisual,
            contentActive: showLayers || (tv.showBeforeOpen && !opened),
            beforeOpenPreview: tv.showBeforeOpen,
            displayLayers: layersForTv,
            tvControls: showLayers
              ? {
                  paused: tvPaused,
                  onPlayPause: () => setTvPaused((p) => !p),
                  onNext: tvSlideNext,
                  onPrev: tvSlidePrev,
                  slideIndex: slideIdx,
                  slideCount: slides.length,
                  canPrev: slideIdx > 0,
                  canNext: slideIdx < slides.length - 1,
                }
              : undefined,
          }}
        />
      </div>
      ) : null}

      {!preview && maxOpens > 0 && !openLocked ? (
        <p className="mt-1 text-center text-[10px] text-white/40">
          বাকি খোলার সুযোগ: {remainingOpens(openScope, maxOpens) ?? "—"}
        </p>
      ) : null}

      <p className="mt-2 text-center text-[10px] text-violet-300/70">
        📺 গিফটের কনটেন্ট TV Screen-এ দেখানো হচ্ছে
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0}
          className="touch-manipulation min-h-12 rounded-full border border-white/20 px-5 py-3 text-sm text-white disabled:opacity-30"
        >
          Previous
        </button>

        {!opened && !openLocked ? (
          <button
            type="button"
            onClick={openBox}
            className="touch-manipulation min-h-12 rounded-full bg-rose-500 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-900/40"
          >
            {openLabel}
          </button>
        ) : opened ? (
          <button
            type="button"
            onClick={goNext}
            className="touch-manipulation min-h-12 rounded-full bg-violet-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/40"
          >
            {isLast ? "সম্পূর্ণ হয়েছে" : "Next"}
          </button>
        ) : null}
      </div>

      <GiftRevealOverlay
        open={showReveal}
        message={revealText}
        title={current?.name}
        onClose={() => {
          setShowReveal(false);
          if (!preview && maxOpens > 0 && getOpenCount(openScope) >= maxOpens) setOpenLocked(true);
        }}
      />

      <p className="mt-3 text-center text-[10px] text-white/35 md:hidden">
        সোয়াইপ: ডানে = Next · বামে = Previous
      </p>
      <p className="mt-1 hidden text-center text-[10px] text-white/35 md:block">
        কীবোর্ড: ← Previous · → Next · Enter = খুলুন
      </p>
    </div>
  );
}
