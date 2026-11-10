"use client";

import clsx from "clsx";
import type { GiftPackLayer, GiftPackNode, GiftPackProject } from "@/types/gift-pack";
import { normalizeTvScreen } from "@/lib/gift-pack/tv-screen";
import { LayerCompositor } from "@/components/pack-player/LayerCompositor";

export type TvScreenControlProps = {
  paused: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  slideIndex: number;
  slideCount: number;
  canPrev: boolean;
  canNext: boolean;
};

export function GiftTvScreen({
  project,
  node,
  contentTimeMs,
  emerged,
  contentActive,
  beforeOpenPreview,
  controls,
  displayLayers,
  compactLayout,
}: {
  project: GiftPackProject;
  node: GiftPackNode;
  contentTimeMs: number;
  /** 0 = বক্সের কাছে লুকানো, 1 = পূর্ণ বেরিয়ে এসেছে */
  emerged: number;
  contentActive: boolean;
  beforeOpenPreview: boolean;
  controls?: TvScreenControlProps;
  displayLayers?: GiftPackLayer[];
  compactLayout?: boolean;
}) {
  const tv = normalizeTvScreen(node.tvScreen);
  if (!tv.enabled) return null;

  const sizeMul = compactLayout ? 0.78 : 1;
  const w = Math.min(tv.width * tv.scale * sizeMul, compactLayout ? 280 : 9999);
  const h = tv.height * tv.scale * sizeMul;
  const eased = emerged * (2 - emerged);
  const offsetX = (1 - eased) * -18;
  const offsetY = (1 - eased) * 24;
  const scale = 0.28 + 0.72 * eased;

  const showContent =
    contentActive || (beforeOpenPreview && tv.showBeforeOpen && emerged > 0.15);

  const glowStyle =
    tv.glow && emerged > 0.4
      ? {
          boxShadow: `0 0 ${12 + 24 * eased}px ${tv.glowColor}88, 0 12px 40px rgba(0,0,0,0.55)`,
        }
      : tv.shadow
        ? { boxShadow: "0 14px 36px rgba(0,0,0,0.45)" }
        : undefined;

  const posStyle = compactLayout
    ? {
        left: "50%",
        bottom: "6%",
        top: "auto" as const,
        width: w,
        maxWidth: "min(92vw, 300px)",
      }
    : {
        left: `${tv.posXPercent}%`,
        top: `${tv.posYPercent}%`,
        width: w,
      };

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-visible"
      style={{ perspective: `${tv.depth3d * 20}px` }}
    >
      <div
        className={clsx(
          "pointer-events-auto absolute transition-[transform,filter] duration-500 ease-out will-change-transform",
          compactLayout ? "origin-bottom -translate-x-1/2" : "origin-top-left",
          tv.style === "crt" && "tv-crt-scanlines"
        )}
        style={{
          ...posStyle,
          transform: compactLayout
            ? `translate(-50%, 0) scale(${0.45 + 0.55 * scale}) rotate(${tv.rotation * 0.6}deg)`
            : `
            translate(${offsetX}px, ${offsetY}px)
            scale(${scale})
            rotate(${tv.rotation}deg)
            rotateY(${tv.style === "modern" ? -4 : 0}deg)
          `,
          filter: emerged < 1 ? `brightness(${0.7 + 0.3 * eased})` : undefined,
          ...glowStyle,
        }}
      >
        <div
          className="rounded-lg p-[3px]"
          style={{
            background: `linear-gradient(145deg, ${tv.frameColor}, ${tv.bezelColor})`,
            border: `${tv.borderWidth}px solid ${tv.borderColor}`,
          }}
        >
          <div
            className="relative overflow-hidden rounded-md"
            style={{
              width: "100%",
              height: h,
              background: tv.screenBg,
            }}
          >
            {showContent ? (
              <div className="h-full w-full overflow-y-auto overflow-x-hidden">
                <LayerCompositor
                  project={{
                    ...project,
                    backgroundKind: "solid",
                    backgroundColor: tv.screenBg,
                    backgroundOpacity: 1,
                  }}
                  layers={displayLayers ?? node.layers}
                  contentTimeMs={contentTimeMs}
                  animateText={contentActive}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center">
                <span className="text-2xl opacity-40">📺</span>
                <p className="text-[10px] text-white/45">গিফট খুললে কনটেন্ট চালু হবে</p>
              </div>
            )}
          </div>
          {controls && (contentActive || showContent) && (
            <div className="mt-1 flex items-center justify-center gap-1.5 rounded-md bg-black/50 py-1.5">
              <button
                type="button"
                onClick={controls.onPrev}
                disabled={!controls.canPrev}
                className="touch-manipulation min-h-10 min-w-10 rounded-lg text-sm text-white disabled:opacity-30"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={controls.onPlayPause}
                className="touch-manipulation min-h-10 rounded-lg bg-violet-600 px-4 text-xs font-semibold text-white"
              >
                {controls.paused ? "Play" : "Pause"}
              </button>
              <button
                type="button"
                onClick={controls.onNext}
                disabled={!controls.canNext}
                className="touch-manipulation min-h-10 min-w-10 rounded-lg text-sm text-white disabled:opacity-30"
              >
                ▶
              </button>
              {controls.slideCount > 0 && (
                <span className="ml-1 text-[9px] text-white/40">
                  {controls.slideIndex + 1}/{controls.slideCount}
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className="mx-auto mt-0.5 h-1.5 w-[40%] rounded-full"
          style={{ background: tv.bezelColor }}
          aria-hidden
        />
      </div>
    </div>
  );
}
