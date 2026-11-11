import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { userHasActivePremium } from "@/lib/plans/limits";
import { prisma } from "@/lib/db";
import { mediaKind, persistUserUpload } from "@/lib/storage/media-upload";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "আপলোডের জন্য লগইন করুন" }, { status: 401 });
  }

  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
  if (settings && !settings.uploadsEnabled) {
    return NextResponse.json({ error: "অ্যাডমিন আপলোড বন্ধ রেখেছে" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "ফাইল নেই" }, { status: 400 });
  }

  const kind = mediaKind(file.type, file.name);
  if (kind === "other") {
    return NextResponse.json(
      { error: "শুধু ছবি, ভিডিও বা অডিও ফাইল গ্রহণযোগ্য" },
      { status: 400 }
    );
  }

  const premium = userHasActivePremium(user) || user.role === "OWNER";
  const freeMb = settings?.freeUploadMaxMb ?? 10;
  const premiumMb = settings?.premiumUploadMaxMb ?? 50;
  const maxBytes = (premium ? premiumMb : freeMb) * 1024 * 1024;

  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: premium
          ? `ফাইল সর্বোচ্চ ${premiumMb}MB`
          : `ফ্রিতে সর্বোচ্চ ${freeMb}MB — প্রিমিয়াম নিন`,
      },
      { status: 403 }
    );
  }

  if (kind === "video" && !premium && settings && !settings.allowFreeVideoUpload) {
    return NextResponse.json(
      { error: "ভিডিও আপলোড এখন শুধু প্রিমিয়াম — অ্যাডমিন সেটিংস দেখুন" },
      { status: 403 }
    );
  }

  try {
    const { url, storage } = await persistUserUpload(user.id, file);
    return NextResponse.json({ url, storage });
  } catch (e) {
    console.error("upload failed", e);
    const msg =
      process.env.BLOB_READ_WRITE_TOKEN
        ? "স্টোরেজে সেভ ব্যর্থ"
        : "লোকাল আপলোড ব্যর্থ। Vercel-এ Blob চালু করুন বা ডিস্কে লিখার অনুমতি দিন";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
