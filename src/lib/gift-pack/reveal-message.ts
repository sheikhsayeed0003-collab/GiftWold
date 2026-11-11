import type { GiftPackLayer, GiftPackNode } from "@/types/gift-pack";
import type { TextLayerData } from "@/types/gift-pack";

export function resolveRevealMessage(node: GiftPackNode): string {
  const custom = node.revealMessage?.trim();
  if (custom) return custom;
  const text = node.layers.find((l) => l.type === "text" && l.visible);
  if (text) return (text.data as TextLayerData).content;
  return node.name || "🎁 Surprise!";
}

export function resolveMaxOpenLimit(node: GiftPackNode): number {
  const n = node.maxOpenLimit;
  if (n == null || n < 0) return 0;
  return Math.floor(n);
}
