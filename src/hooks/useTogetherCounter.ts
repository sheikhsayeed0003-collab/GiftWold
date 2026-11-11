"use client";

import { useEffect, useState } from "react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export type TogetherParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  label: string;
};

export function useTogetherCounter(startIso: string | undefined, label: string): TogetherParts | null {
  const [parts, setParts] = useState<TogetherParts | null>(null);

  useEffect(() => {
    if (!startIso) {
      setParts(null);
      return;
    }
    const start = new Date(startIso).getTime();
    if (Number.isNaN(start)) {
      setParts(null);
      return;
    }
    const tick = () => {
      const diff = Math.max(0, Date.now() - start);
      const days = Math.floor(diff / 86400000);
      const hours = Math.floor((diff % 86400000) / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setParts({ days, hours, minutes, seconds, label });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startIso, label]);

  return parts;
}

export function formatTogether(parts: TogetherParts): string {
  return `${parts.days} দিন ${pad(parts.hours)}:${pad(parts.minutes)}:${pad(parts.seconds)}`;
}
