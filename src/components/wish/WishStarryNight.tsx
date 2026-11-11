"use client";

import { useMemo } from "react";

export function WishStarryNight() {
  const stars = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        left: `${(i * 37) % 100}%`,
        top: `${(i * 53) % 100}%`,
        delay: `${(i % 7) * 0.4}s`,
        size: i % 5 === 0 ? 3 : 2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,#2e1065_0%,#0c0616_45%,#050308_100%)]">
      <div className="ambient-orb ambient-orb-1 opacity-30" />
      <div className="ambient-orb ambient-orb-2 opacity-25" />
      {stars.map((s) => (
        <span
          key={s.id}
          className="star-dot"
          style={{
            left: s.left,
            top: s.top,
            animationDelay: s.delay,
            width: s.size,
            height: s.size,
          }}
        />
      ))}
      <div className="noise-overlay" />
    </div>
  );
}
