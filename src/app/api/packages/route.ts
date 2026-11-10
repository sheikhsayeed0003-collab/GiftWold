import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [packages, settings] = await Promise.all([
    prisma.packagePlan.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findFirst({ where: { id: 1 } }),
  ]);

  return NextResponse.json({
    whatsappNumber: settings?.whatsappNumber ?? "",
    packages: packages.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      nameBn: p.nameBn,
      priceUsd: p.priceUsd,
      durationDays: p.durationDays,
      isFree: p.isFree,
      isPremium: p.isPremium,
      features: JSON.parse(p.features) as string[],
      featuresBn: JSON.parse(p.featureListBn) as string[],
    })),
    freeLimits: {
      gifts: settings?.freeGiftsLimit ?? 1,
      publish: settings?.freePublishLimit ?? 1,
    },
  });
}
