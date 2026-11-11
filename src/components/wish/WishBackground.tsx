"use client";

import type { WishVisualTemplate } from "@/types/gift-pack";
import { MatrixRain } from "./MatrixRain";
import { WishStarryNight } from "./WishStarryNight";
import { WishTreeScene } from "./WishTreeScene";

export function WishBackground({ template }: { template: WishVisualTemplate }) {
  if (template === "matrix" || template === "poem") {
    return (
      <div className="absolute inset-0 bg-[#0a0614]">
        <MatrixRain dense={template === "poem"} />
        <WishGlowOverlay />
      </div>
    );
  }
  if (template === "tree") {
    return (
      <div className="absolute inset-0">
        <WishStarryNight />
        <WishTreeScene />
      </div>
    );
  }
  return (
    <div className="absolute inset-0">
      <WishStarryNight />
    </div>
  );
}

function WishGlowOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-40"
      style={{
        background:
          "radial-gradient(circle at 50% 40%, rgba(244, 63, 94, 0.25), transparent 55%), radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.2), transparent 50%)",
      }}
    />
  );
}
