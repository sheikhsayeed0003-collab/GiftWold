"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import type { EffectType } from "@/types/gift";

type Props = {
  effect: EffectType;
  active: boolean;
  burst?: boolean;
};

function HeartRain() {
  const hearts = "💗💖💕💝❤️";
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="heart-fall absolute text-2xl opacity-80"
          style={{
            left: `${(i * 17) % 100}%`,
            animationDelay: `${(i % 8) * 0.4}s`,
            animationDuration: `${4 + (i % 5)}s`,
          }}
        >
          {hearts[i % hearts.length]}
        </span>
      ))}
    </div>
  );
}

export function EffectOverlay({ effect, active, burst }: Props) {
  const fired = useRef(false);

  useEffect(() => {
    if (!burst || fired.current) return;
    if (effect === "confetti" || effect === "both") {
      fired.current = true;
      const duration = 2500;
      const end = Date.now() + duration;
      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.65 },
          colors: ["#f43f5e", "#fbbf24", "#a78bfa", "#22d3ee"],
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.65 },
          colors: ["#f43f5e", "#fbbf24", "#a78bfa", "#22d3ee"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    }
  }, [burst, effect]);

  useEffect(() => {
    if (!active || effect === "none") return;
    if (burst) return;
    if (effect === "confetti" || effect === "both") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [active, burst, effect]);

  if (!active) return null;
  if (effect !== "hearts" && effect !== "both") return null;
  return <HeartRain />;
}
