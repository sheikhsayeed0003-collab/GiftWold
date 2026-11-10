import { NextResponse } from "next/server";
import type { GiftConfig } from "@/types/gift";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import {
  countUserGifts,
  countUserPublished,
  saveGiftToDb,
} from "@/lib/gifts/repository";
import { userHasActivePremium } from "@/lib/plans/limits";
import { countPackNodes, isGiftPackProject, type GiftPackProject } from "@/types/gift-pack";
import { BOX_LIBRARY } from "@/lib/gift-pack/box-library";

function projectUsesPremiumFeatures(project: GiftPackProject) {
  const walk = (nodes: GiftPackProject["roots"]): boolean => {
    for (const n of nodes) {
      const lib = BOX_LIBRARY.find((b) => b.id === n.templateId);
      if (lib?.premium) return true;
      if (n.layers.some((l) => l.type === "video")) return true;
      if (walk(n.children)) return true;
    }
    return false;
  };
  return walk(project.roots);
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "পাবলিশের জন্য লগইন বা অ্যাকাউন্ট খুলুন" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
    if (!settings) {
      return NextResponse.json({ error: "সেটিংস লোড হয়নি" }, { status: 500 });
    }

    const [giftCount, publishedCount] = await Promise.all([
      countUserGifts(user.id),
      countUserPublished(user.id),
    ]);

    const premium = userHasActivePremium(user) || user.role === "OWNER";

    if (isGiftPackProject(body)) {
      const project = body as GiftPackProject;
      if (!project.title?.trim() || !project.roots?.length) {
        return NextResponse.json({ error: "শিরোনাম ও অন্তত ১টি বক্স প্রয়োজন" }, { status: 400 });
      }
      if (!project.sequenceReady) {
        return NextResponse.json(
          { error: "পাবলিশের আগে Finish (শেষ) বাটনে ক্লিক করে ক্রমিক নম্বর সাজান" },
          { status: 400 }
        );
      }

      const totalNodes = countPackNodes(project.roots);
      const freeNodeLimit = 3;
      if (!premium && totalNodes > freeNodeLimit) {
        return NextResponse.json(
          { error: `ফ্রি প্যাকেজে সর্বোচ্চ ${freeNodeLimit}টি বক্স। প্রিমিয়াম নিন।` },
          { status: 403 }
        );
      }
      if (!premium && projectUsesPremiumFeatures(project)) {
        return NextResponse.json(
          { error: "ভিডিও বা প্রিমিয়াম বক্স ফ্রি প্যাকেজে নেই" },
          { status: 403 }
        );
      }
      if (!premium && publishedCount >= settings.freePublishLimit) {
        return NextResponse.json(
          { error: `ফ্রি প্যাকেজে সর্বোচ্চ ${settings.freePublishLimit}টি পাবলিশ` },
          { status: 403 }
        );
      }
      if (!premium && giftCount >= settings.freeGiftsLimit) {
        return NextResponse.json(
          { error: `ফ্রি প্যাকেজে সর্বোচ্চ ${settings.freeGiftsLimit}টি প্রজেক্ট` },
          { status: 403 }
        );
      }

      const id = await saveGiftToDb(project, { userId: user.id, published: true });
      return NextResponse.json({ id, gift: { ...project, id } });
    }

    const legacy = body as Omit<GiftConfig, "id" | "createdAt">;
    if (legacy.title && legacy.boxes?.length) {
      const id = await saveGiftToDb(legacy as GiftConfig, { userId: user.id, published: true });
      return NextResponse.json({ id, gift: legacy });
    }

    return NextResponse.json(
      { error: "নতুন Gift Pack Editor (v2) দিয়ে প্রজেক্ট পাঠান" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ error: "সেভ করতে সমস্যা হয়েছে" }, { status: 500 });
  }
}
