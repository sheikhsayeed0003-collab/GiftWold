import type { GiftPackLayer, GiftTvScreenConfig } from "@/types/gift-pack";

export function defaultTvScreen(): GiftTvScreenConfig {
  return {
    enabled: true,
    width: 232,
    height: 156,
    posXPercent: 58,
    posYPercent: 20,
    rotation: -8,
    scale: 1,
    frameColor: "#27272a",
    bezelColor: "#09090b",
    screenBg: "#050508",
    borderWidth: 3,
    borderColor: "#7c3aed",
    glow: true,
    glowColor: "#a78bfa",
    shadow: true,
    emergeDurationMs: 900,
    showBeforeOpen: true,
    style: "modern",
    depth3d: 14,
  };
}

export function normalizeTvScreen(cfg?: GiftTvScreenConfig): GiftTvScreenConfig {
  const d = defaultTvScreen();
  if (!cfg) return d;
  return {
    ...d,
    ...cfg,
    enabled: cfg.enabled !== false,
  };
}

export function getTvContentSlides(layers: GiftPackLayer[]) {
  return layers
    .filter((l) => l.visible && (l.type === "text" || l.type === "image" || l.type === "video"))
    .sort((a, b) => a.startMs - b.startMs);
}
