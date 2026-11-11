import { nanoid } from "nanoid";
import type { GiftConfig } from "@/types/gift";
import type { GiftPackProject } from "@/types/gift-pack";
import { isGiftPackProject } from "@/types/gift-pack";
import { prisma } from "@/lib/db";
import { getGift as getLegacyGift } from "@/lib/gift-store";

function recipientEmailFromConfig(
  config: GiftPackProject | Omit<GiftConfig, "id" | "createdAt">
): string | null {
  if (isGiftPackProject(config)) {
    const e = config.recipientEmail?.trim().toLowerCase();
    return e || null;
  }
  return null;
}

export async function saveGiftToDb(
  config: GiftPackProject | Omit<GiftConfig, "id" | "createdAt">,
  opts: { userId?: string; published?: boolean; isPublic?: boolean }
) {
  const id = nanoid(10);
  const slug = id;
  const recipientEmail = recipientEmailFromConfig(config);
  const payload = isGiftPackProject(config)
    ? { ...config, id: slug, createdAt: new Date().toISOString(), recipientEmail: recipientEmail ?? config.recipientEmail }
    : { ...config, id: slug, createdAt: new Date().toISOString() };

  const isPublic = recipientEmail ? false : (opts.isPublic ?? false);

  await prisma.gift.create({
    data: {
      slug,
      userId: opts.userId,
      config: JSON.stringify(payload),
      published: opts.published ?? true,
      isPublic,
      recipientEmail,
    },
  });
  return slug;
}

export async function getGiftRecordBySlug(slug: string) {
  return prisma.gift.findUnique({ where: { slug } });
}

export async function getGiftBySlug(slug: string): Promise<GiftPackProject | GiftConfig | null> {
  const row = await getGiftRecordBySlug(slug);
  if (row) {
    try {
      return JSON.parse(row.config) as GiftPackProject | GiftConfig;
    } catch {
      return null;
    }
  }
  return getLegacyGift(slug);
}

export async function listReceivedGifts(recipientEmail: string, limit = 20) {
  const email = recipientEmail.trim().toLowerCase();
  if (!email) return [];
  return prisma.gift.findMany({
    where: { published: true, recipientEmail: email },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: { slug: true, config: true, createdAt: true, userId: true },
  });
}

export async function listPublicGifts(limit = 12) {
  return prisma.gift.findMany({
    where: { published: true, isPublic: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      slug: true,
      createdAt: true,
      config: true,
    },
  });
}

export async function countUserGifts(userId: string) {
  return prisma.gift.count({ where: { userId } });
}

export async function countUserPublished(userId: string) {
  return prisma.gift.count({ where: { userId, published: true } });
}
