const PREFIX = "gw_box_open_count:";

export function openLimitStorageKey(scope: string): string {
  return `${PREFIX}${scope}`;
}

export function getOpenCount(scope: string): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(openLimitStorageKey(scope));
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
  } catch {
    return 0;
  }
}

/** maxOpens <= 0 means unlimited */
export function canOpenGiftBox(scope: string, maxOpens: number): boolean {
  if (maxOpens <= 0) return true;
  return getOpenCount(scope) < maxOpens;
}

export function recordGiftBoxOpen(scope: string): number {
  if (typeof window === "undefined") return 0;
  const next = getOpenCount(scope) + 1;
  try {
    localStorage.setItem(openLimitStorageKey(scope), String(next));
  } catch {
    /* ignore quota */
  }
  return next;
}

export function remainingOpens(scope: string, maxOpens: number): number | null {
  if (maxOpens <= 0) return null;
  return Math.max(0, maxOpens - getOpenCount(scope));
}
