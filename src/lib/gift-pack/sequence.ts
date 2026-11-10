import type { GiftPackNode } from "@/types/gift-pack";

/** বাংলা সিফর ১–৯৯ (ডিসপ্লে) */
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatSequenceLabel(n: number): string {
  if (n <= 0) return "—";
  return String(n)
    .split("")
    .map((d) => BN_DIGITS[Number(d)] ?? d)
    .join("");
}

export function getSequenceRoots(roots: GiftPackNode[]): GiftPackNode[] {
  return [...roots]
    .map((r, index) => ({ r, index }))
    .sort((a, b) => {
      const sa = a.r.sequenceNumber ?? 0;
      const sb = b.r.sequenceNumber ?? 0;
      if (sa > 0 && sb > 0) return sa - sb;
      if (sa > 0) return sa - (b.index + 1);
      if (sb > 0) return a.index + 1 - sb;
      return a.index - b.index;
    })
    .map((x) => x.r);
}

export function applySequenceNumbers(roots: GiftPackNode[]): GiftPackNode[] {
  return roots.map((r, i) => ({
    ...r,
    sequenceNumber: i + 1,
    name: `গিফট ${i + 1}`,
  }));
}
