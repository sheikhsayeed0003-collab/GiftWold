import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const freePlan = await prisma.packagePlan.upsert({
    where: { slug: "free" },
    update: {},
    create: {
      slug: "free",
      name: "Free",
      nameBn: "ফ্রি প্যাকেজ",
      priceUsd: 0,
      durationDays: 0,
      isFree: true,
      isPremium: false,
      sortOrder: 0,
      features: JSON.stringify([
        "1 gift create",
        "1 publish",
        "limited templates",
        "basic animations",
        "shareable link",
      ]),
      featureListBn: JSON.stringify([
        "১টি গিফট তৈরি",
        "১টি পাবলিশ",
        "সীমিত টেমপ্লেট",
        "বেসিক অ্যানিমেশন",
        "লিংক শেয়ার",
      ]),
    },
  });

  const premiumPlans = [
    {
      slug: "starter",
      name: "Starter",
      nameBn: "স্টার্টার",
      priceUsd: 5,
      durationDays: 30,
      features: ["5 gifts", "all templates", "video upload", "premium effects"],
      featureListBn: ["৫টি গিফট", "সব টেমপ্লেট", "ভিডিও আপলোড", "প্রিমিয়াম ইফেক্ট"],
    },
    {
      slug: "pro",
      name: "Pro",
      nameBn: "প্রো",
      priceUsd: 10,
      durationDays: 30,
      features: ["unlimited gifts", "3D editor", "music library", "priority support"],
      featureListBn: ["অসীম গিফট", "৩D এডিটর", "মিউজিক লাইব্রেরি", "প্রায়োরিটি সাপোর্ট"],
    },
    {
      slug: "ultimate",
      name: "Ultimate",
      nameBn: "আল্টিমেট",
      priceUsd: 100,
      durationDays: 365,
      features: ["everything in Pro", "custom branding", "admin-assigned perks"],
      featureListBn: ["প্রোর সব কিছু", "কাস্টম ব্র্যান্ডিং", "বিশেষ সুবিধা"],
    },
  ];

  for (let i = 0; i < premiumPlans.length; i++) {
    const p = premiumPlans[i];
    await prisma.packagePlan.upsert({
      where: { slug: p.slug },
      update: {
        priceUsd: p.priceUsd,
        name: p.name,
        nameBn: p.nameBn,
        durationDays: p.durationDays,
        features: JSON.stringify(p.features),
        featureListBn: JSON.stringify(p.featureListBn),
        sortOrder: i + 1,
      },
      create: {
        slug: p.slug,
        name: p.name,
        nameBn: p.nameBn,
        priceUsd: p.priceUsd,
        durationDays: p.durationDays,
        sortOrder: i + 1,
        features: JSON.stringify(p.features),
        featureListBn: JSON.stringify(p.featureListBn),
      },
    });
  }

  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {},
  });

  const ownerEmail = process.env.OWNER_EMAIL ?? "owner@giftworld.local";
  const ownerPassword = process.env.OWNER_PASSWORD ?? "GiftWorld@Owner2026";
  const hash = await bcrypt.hash(ownerPassword, 12);

  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { role: UserRole.OWNER },
    create: {
      name: "Owner",
      email: ownerEmail,
      passwordHash: hash,
      role: UserRole.OWNER,
      planId: freePlan.id,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
