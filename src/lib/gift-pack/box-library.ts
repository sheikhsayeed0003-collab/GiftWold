import type { GiftBoxTemplateId, OpeningAnimationId } from "@/types/gift-pack";

export type BoxLibraryItem = {
  id: GiftBoxTemplateId;
  nameBn: string;
  emoji: string;
  defaultBoxColor: string;
  defaultRibbonColor: string;
  defaultOpening: OpeningAnimationId;
  premium?: boolean;
};

export const BOX_LIBRARY: BoxLibraryItem[] = [
  { id: "classic", nameBn: "সাধারণ", emoji: "🎁", defaultBoxColor: "#e11d48", defaultRibbonColor: "#fda4af", defaultOpening: "click" },
  { id: "heart", nameBn: "হার্ট", emoji: "💖", defaultBoxColor: "#db2777", defaultRibbonColor: "#f9a8d4", defaultOpening: "hearts" },
  { id: "romantic", nameBn: "রোমান্টিক", emoji: "🌹", defaultBoxColor: "#9f1239", defaultRibbonColor: "#fecdd3", defaultOpening: "ribbon_pull" },
  { id: "birthday", nameBn: "জন্মদিন", emoji: "🎂", defaultBoxColor: "#7c3aed", defaultRibbonColor: "#fde047", defaultOpening: "confetti" },
  { id: "funny", nameBn: "ফানি", emoji: "😄", defaultBoxColor: "#f59e0b", defaultRibbonColor: "#fef08a", defaultOpening: "shake" },
  { id: "surprise", nameBn: "সারপ্রাইজ", emoji: "✨", defaultBoxColor: "#0ea5e9", defaultRibbonColor: "#bae6fd", defaultOpening: "fast_open" },
  { id: "luxury", nameBn: "লাক্সারি", emoji: "👑", defaultBoxColor: "#1c1917", defaultRibbonColor: "#fbbf24", defaultOpening: "slow_open", premium: true },
  { id: "nested", nameBn: "নেস্টেড", emoji: "📦", defaultBoxColor: "#4f46e5", defaultRibbonColor: "#a5b4fc", defaultOpening: "lid_open" },
  { id: "animated", nameBn: "অ্যানিমেটেড", emoji: "🌀", defaultBoxColor: "#06b6d4", defaultRibbonColor: "#a5f3fc", defaultOpening: "particles", premium: true },
];
