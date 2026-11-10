import type { CSSProperties } from "react";

export function giftBackgroundStyle(color: string): CSSProperties {
  const isLight = color === "#f5e6d3" || color === "#fff8f0";
  return {
    background: isLight
      ? `linear-gradient(165deg, ${color} 0%, #f0d9c4 40%, #e8c4a8 100%)`
      : `
        radial-gradient(ellipse 80% 50% at 50% -20%, ${color}cc, transparent),
        radial-gradient(ellipse 60% 40% at 100% 50%, rgba(244,63,94,0.15), transparent),
        radial-gradient(ellipse 50% 35% at 0% 80%, rgba(139,92,246,0.2), transparent),
        linear-gradient(180deg, ${color} 0%, #08040f 100%)
      `,
  };
}
