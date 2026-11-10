export type BoxStyle = "classic" | "ribbon" | "minimal" | "neon";

export type EffectType = "none" | "confetti" | "hearts" | "both";

export type FontFamily = "playfair" | "dancing" | "noto-bengali" | "inter";

export interface GiftBoxItem {
  id: string;
  label: string;
  message: string;
}

export interface GiftConfig {
  id?: string;
  title: string;
  recipientName: string;
  senderName: string;
  backgroundColor: string;
  boxStyle: BoxStyle;
  fontFamily: FontFamily;
  effect: EffectType;
  musicUrl: string;
  coverImage: string;
  boxes: GiftBoxItem[];
  createdAt?: string;
}

export const defaultGiftConfig = (): GiftConfig => ({
  title: "তোমার জন্য একটা উপহার",
  recipientName: "",
  senderName: "",
  backgroundColor: "#1a0a2e",
  boxStyle: "classic",
  fontFamily: "noto-bengali",
  effect: "confetti",
  musicUrl: "",
  coverImage: "",
  boxes: [
    {
      id: "1",
      label: "১",
      message: "তুমি আমার কাছে সবচেয়ে মূল্যবান মানুষ।",
    },
    {
      id: "2",
      label: "২",
      message: "এই ছোট্ট উপহারটা তোমার হাসি ধরে রাখুক।",
    },
    {
      id: "3",
      label: "৩",
      message: "চিরকাল ভালো থেকো — ভালোবাসা সহ।",
    },
  ],
});
