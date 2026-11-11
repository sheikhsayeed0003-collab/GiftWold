import type { GiftExperienceMode, GiftPackProject, WishExperienceConfig } from "@/types/gift-pack";
import { defaultWishExperience } from "./defaults";

export function applyRecipientName(text: string, recipientName: string): string {
  const name = recipientName.trim() || "তোমার";
  return text.replace(/\{name\}/gi, name);
}

export function resolveWishConfig(project: GiftPackProject): WishExperienceConfig {
  const base = { ...defaultWishExperience(), ...project.wishExperience };
  const mode = project.experienceMode ?? "pack3d";
  if (mode === "wish" || mode === "both") {
    return { ...base, enabled: true };
  }
  return base;
}

export function shouldShowWishExperience(project: GiftPackProject): boolean {
  const mode: GiftExperienceMode = project.experienceMode ?? "pack3d";
  if (mode === "wish" || mode === "both") return true;
  return Boolean(project.wishExperience?.enabled);
}

export function wishMusicSrc(project: GiftPackProject, wish: WishExperienceConfig): string {
  if (wish.musicSrc?.trim()) return wish.musicSrc.trim();
  return project.globalAudio?.src?.trim() ?? "";
}
