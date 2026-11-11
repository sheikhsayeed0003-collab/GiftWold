"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/current-user";

async function requireOwner() {
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.OWNER) throw new Error("FORBIDDEN");
  return user;
}

export async function updateSiteSettings(formData: FormData) {
  await requireOwner();
  await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
      freeGiftsLimit: Number(formData.get("freeGiftsLimit") ?? 1),
      freePublishLimit: Number(formData.get("freePublishLimit") ?? 1),
      maxRegistrationsPerDevice: Number(formData.get("maxRegistrationsPerDevice") ?? 3),
      homepageTaglineBn: String(formData.get("homepageTaglineBn") ?? ""),
      homepageHeroBn: String(formData.get("homepageHeroBn") ?? ""),
      contactEmail: String(formData.get("contactEmail") ?? ""),
      heroGiftBoxMessage: String(formData.get("heroGiftBoxMessage") ?? ""),
      heroGiftBoxMaxOpens: Math.max(0, Number(formData.get("heroGiftBoxMaxOpens") ?? 3)),
      freeUploadMaxMb: Math.max(1, Number(formData.get("freeUploadMaxMb") ?? 10)),
      premiumUploadMaxMb: Math.max(1, Number(formData.get("premiumUploadMaxMb") ?? 50)),
      allowFreeVideoUpload: formData.get("allowFreeVideoUpload") === "on",
      uploadsEnabled: formData.get("uploadsEnabled") === "on",
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updatePackage(formData: FormData) {
  await requireOwner();
  const id = String(formData.get("id"));
  await prisma.packagePlan.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      nameBn: String(formData.get("nameBn")),
      priceUsd: Number(formData.get("priceUsd")),
      durationDays: Number(formData.get("durationDays")),
      active: formData.get("active") === "on",
      featureListBn: JSON.stringify(
        String(formData.get("featuresBn"))
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean)
      ),
    },
  });
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function grantUserPremium(formData: FormData) {
  await requireOwner();
  const userId = String(formData.get("userId"));
  const planSlug = String(formData.get("planSlug"));
  const plan = await prisma.packagePlan.findUnique({ where: { slug: planSlug } });
  if (!plan) throw new Error("Plan not found");
  const expires =
    plan.durationDays > 0
      ? new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000)
      : null;
  await prisma.user.update({
    where: { id: userId },
    data: { planId: plan.id, planExpiresAt: expires },
  });
  revalidatePath("/admin");
}
