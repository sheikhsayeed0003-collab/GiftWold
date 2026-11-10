import type { PackagePlan, SiteSettings, User } from "@prisma/client";

export function parseJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw) as unknown;
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function userHasActivePremium(
  user: User & { plan: PackagePlan | null }
) {
  if (!user.plan || user.plan.isFree) return false;
  if (!user.planExpiresAt) return true;
  return user.planExpiresAt.getTime() > Date.now();
}

export function canUserPublish(
  user: User & { plan: PackagePlan | null },
  settings: SiteSettings,
  publishedCount: number
) {
  if (user.role === "OWNER" || userHasActivePremium(user)) return true;
  return publishedCount < settings.freePublishLimit;
}

export function canUserCreateGift(
  user: User & { plan: PackagePlan | null },
  settings: SiteSettings,
  giftCount: number
) {
  if (user.role === "OWNER" || userHasActivePremium(user)) return true;
  return giftCount < settings.freeGiftsLimit;
}
