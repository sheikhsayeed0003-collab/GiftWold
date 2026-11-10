import type { BoxStyle, EffectType, FontFamily } from "@/types/gift";

export const BOX_STYLES: {
  id: BoxStyle;
  name: string;
  preview: string;
}[] = [
  { id: "classic", name: "ক্লাসিক গিফট", preview: "from-rose-500 to-amber-500" },
  { id: "ribbon", name: "রিবন বক্স", preview: "from-fuchsia-600 to-pink-400" },
  { id: "minimal", name: "মিনিমাল", preview: "from-slate-600 to-slate-400" },
  { id: "neon", name: "নিয়ন গ্লো", preview: "from-cyan-500 to-violet-600" },
];

export const EFFECTS: { id: EffectType; name: string }[] = [
  { id: "none", name: "কোনো ইফেক্ট নেই" },
  { id: "confetti", name: "কনফেটি" },
  { id: "hearts", name: "হার্ট পতন" },
  { id: "both", name: "কনফেটি + হার্ট" },
];

export const FONTS: { id: FontFamily; name: string; className: string }[] = [
  { id: "noto-bengali", name: "নোটো বাংলা", className: "font-bengali" },
  { id: "playfair", name: "Playfair", className: "font-playfair" },
  { id: "dancing", name: "Dancing Script", className: "font-dancing" },
  { id: "inter", name: "Inter", className: "font-sans" },
];

export const BACKGROUND_PRESETS = [
  { name: "রয়্যাল নাইট", color: "#1a0a2e" },
  { name: "সানসেট গ্লো", color: "#2d1b4e" },
  { name: "মিডনাইট ব্লু", color: "#0f172a" },
  { name: "রোজ গার্ডেন", color: "#3b1530" },
  { name: "ফরেস্ট", color: "#0d2818" },
  { name: "ক্রিম ড্রিম", color: "#f5e6d3" },
];

export function boxStyleClasses(style: BoxStyle): string {
  switch (style) {
    case "classic":
      return "bg-gradient-to-br from-rose-400 via-rose-600 to-amber-500 shadow-[0_16px_40px_rgba(244,63,94,0.5)]";
    case "ribbon":
      return "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-400 shadow-[0_16px_40px_rgba(236,72,153,0.45)]";
    case "minimal":
      return "bg-gradient-to-br from-zinc-600 via-slate-600 to-zinc-700 shadow-xl";
    case "neon":
      return "bg-gradient-to-br from-cyan-400 via-violet-500 to-fuchsia-600 shadow-[0_0_48px_rgba(34,211,238,0.45)]";
  }
}
