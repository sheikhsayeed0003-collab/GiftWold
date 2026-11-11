"use client";

import { useMemo } from "react";

export function WishHeartsScene({ active }: { active: boolean }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 19 + 7) % 100}%`,
        duration: `${6 + (i % 5)}s`,
        delay: `${(i % 9) * 0.35}s`,
        size: 10 + (i % 4) * 4,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-fall absolute text-rose-400/80"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
          }}
        >
          ♥
        </span>
      ))}
    </div>
  );
}
