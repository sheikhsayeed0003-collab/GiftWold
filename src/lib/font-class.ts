import type { FontFamily } from "@/types/gift";

export function fontClassFor(family: FontFamily): string {
  switch (family) {
    case "playfair":
      return "font-playfair";
    case "dancing":
      return "font-dancing";
    case "noto-bengali":
      return "font-bengali";
    default:
      return "font-sans";
  }
}
