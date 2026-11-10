"use client";

import { usePackEditor } from "@/context/PackEditorContext";
import { defaultTvScreen, normalizeTvScreen } from "@/lib/gift-pack/tv-screen";
import type { GiftTvScreenConfig } from "@/types/gift-pack";

const input =
  "w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white";

export function TvScreenSettings() {
  const { selectedNode, updateSelectedNode } = usePackEditor();
  if (!selectedNode) return null;

  const tv = normalizeTvScreen(selectedNode.tvScreen);

  const patch = (p: Partial<GiftTvScreenConfig>) => {
    updateSelectedNode({ tvScreen: { ...tv, ...p } });
  };

  return (
    <section>
      <h3 className="text-xs font-semibold uppercase text-violet-300/80">📺 TV Screen</h3>
      <label className="mt-2 flex items-center gap-2 text-[10px] text-white/55">
        <input
          type="checkbox"
          checked={tv.enabled}
          onChange={(e) => patch({ enabled: e.target.checked })}
        />
        TV Screen চালু
      </label>
      {!tv.enabled ? null : (
        <div className="mt-2 space-y-2">
          <label className="block text-[10px] text-white/45">
            প্রস্থ (px) {Math.round(tv.width * tv.scale)}
            <input
              type="range"
              min={140}
              max={420}
              value={tv.width}
              onChange={(e) => patch({ width: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-[10px] text-white/45">
            উচ্চতা (px)
            <input
              type="range"
              min={100}
              max={320}
              value={tv.height}
              onChange={(e) => patch({ height: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-[10px] text-white/45">
            অবস্থান X {tv.posXPercent}%
            <input
              type="range"
              min={5}
              max={85}
              value={tv.posXPercent}
              onChange={(e) => patch({ posXPercent: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-[10px] text-white/45">
            অবস্থান Y {tv.posYPercent}%
            <input
              type="range"
              min={5}
              max={70}
              value={tv.posYPercent}
              onChange={(e) => patch({ posYPercent: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-[10px] text-white/45">
            ঘূর্ণন {tv.rotation}°
            <input
              type="range"
              min={-45}
              max={45}
              value={tv.rotation}
              onChange={(e) => patch({ rotation: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="block text-[10px] text-white/45">
            স্কেল {tv.scale.toFixed(2)}
            <input
              type="range"
              min={0.6}
              max={1.5}
              step={0.05}
              value={tv.scale}
              onChange={(e) => patch({ scale: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="text-[10px] text-white/45">
              ফ্রেম
              <input
                type="color"
                value={tv.frameColor}
                onChange={(e) => patch({ frameColor: e.target.value })}
                className="mt-1 h-8 w-full"
              />
            </label>
            <label className="text-[10px] text-white/45">
              বর্ডার
              <input
                type="color"
                value={tv.borderColor}
                onChange={(e) => patch({ borderColor: e.target.value })}
                className="mt-1 h-8 w-full"
              />
            </label>
          </div>
          <select
            className={input}
            value={tv.style}
            onChange={(e) => patch({ style: e.target.value as GiftTvScreenConfig["style"] })}
          >
            <option value="modern">Modern 3D</option>
            <option value="crt">CRT</option>
            <option value="slim">Slim</option>
          </select>
          <label className="flex gap-2 text-[10px] text-white/50">
            <input type="checkbox" checked={tv.glow} onChange={(e) => patch({ glow: e.target.checked })} />
            Glow
          </label>
          {tv.glow && (
            <input
              type="color"
              value={tv.glowColor}
              onChange={(e) => patch({ glowColor: e.target.value })}
              className="h-8 w-full"
            />
          )}
          <label className="flex gap-2 text-[10px] text-white/50">
            <input type="checkbox" checked={tv.shadow} onChange={(e) => patch({ shadow: e.target.checked })} />
            Shadow
          </label>
          <label className="block text-[10px] text-white/45">
            বের হওয়ার সময় (ms) {tv.emergeDurationMs}
            <input
              type="range"
              min={300}
              max={2000}
              step={50}
              value={tv.emergeDurationMs}
              onChange={(e) => patch({ emergeDurationMs: Number(e.target.value) })}
              className="w-full"
            />
          </label>
          <label className="flex gap-2 text-[10px] text-white/50">
            <input
              type="checkbox"
              checked={tv.showBeforeOpen}
              onChange={(e) => patch({ showBeforeOpen: e.target.checked })}
            />
            খোলার আগে টিভিতে প্রিভিউ
          </label>
          <button
            type="button"
            onClick={() => updateSelectedNode({ tvScreen: defaultTvScreen() })}
            className="w-full rounded-lg bg-white/10 py-1.5 text-[10px] text-white"
          >
            TV রিসেট
          </button>
        </div>
      )}
    </section>
  );
}
