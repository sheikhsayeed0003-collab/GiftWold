"use client";

import { useEffect, useRef } from "react";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789♥♦♣♠";
const PINK_WORDS = ["BIRTHDAY", "WISH", "LOVE", "GIFT", "♥"];

export function MatrixRain({ dense }: { dense?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    let cols: number[] = [];
    const fontSize = dense ? 14 : 18;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const columnCount = Math.floor(w / fontSize);
      cols = Array.from({ length: columnCount }, () => Math.random() * h);
    };

    const draw = () => {
      ctx.fillStyle = "rgba(8, 4, 20, 0.12)";
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < cols.length; i++) {
        const isWord = Math.random() < 0.02;
        const ch = isWord
          ? PINK_WORDS[Math.floor(Math.random() * PINK_WORDS.length)]
          : CHARSET[Math.floor(Math.random() * CHARSET.length)];
        const x = i * fontSize;
        const y = cols[i];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillStyle = isWord ? "rgba(251, 113, 133, 0.95)" : "rgba(167, 139, 250, 0.75)";
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) cols[i] = 0;
        cols[i] += fontSize * (dense ? 0.9 : 1.1);
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [dense]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
      aria-hidden
    />
  );
}
