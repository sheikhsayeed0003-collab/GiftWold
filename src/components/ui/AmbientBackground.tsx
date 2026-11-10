"use client";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="noise-overlay" />
      {Array.from({ length: 40 }).map((_, i) => (
        <span
          key={i}
          className="star-dot"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${(i % 12) * 0.35}s`,
            opacity: 0.15 + (i % 5) * 0.08,
          }}
        />
      ))}
    </div>
  );
}
