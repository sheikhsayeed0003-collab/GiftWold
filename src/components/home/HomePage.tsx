import Link from "next/link";
import { prisma } from "@/lib/db";
import { listPublicGifts } from "@/lib/gifts/repository";
import { getCurrentUser } from "@/lib/auth/current-user";
import { PricingCards, type PackageDto } from "./PricingCards";
import { GIFT_INSPIRATIONS } from "@/data/gift-inspiration";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { HomeHero3D } from "./HomeHero3D";

export async function HomePage() {
  const [packages, settings, gallery, user] = await Promise.all([
    prisma.packagePlan.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findFirst({ where: { id: 1 } }),
    listPublicGifts(8),
    getCurrentUser(),
  ]);

  const pkgDtos: PackageDto[] = packages.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameBn: p.nameBn,
    priceUsd: p.priceUsd,
    durationDays: p.durationDays,
    isFree: p.isFree,
    featuresBn: JSON.parse(p.featureListBn) as string[],
  }));

  return (
    <div className="relative flex-1">
      <AmbientBackground />
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-8 md:py-24">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-rose-300/80">
            3D Gift Studio
          </p>
          <h1 className="mt-3 font-bengali text-4xl font-bold leading-tight text-white md:text-5xl">
            <span className="text-gradient">Gift World</span>
            <br />
            {settings?.homepageTaglineBn ?? "নিজের মতো করে 3D গিফট বক্স"}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-white/60">
            {settings?.homepageHeroBn}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-2xl bg-gradient-to-r from-rose-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25"
            >
              গিফট তৈরি করুন
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-white/15 px-6 py-3 text-sm text-white/85 hover:bg-white/5"
            >
              ফ্রি অ্যাকাউন্ট
            </Link>
          </div>
        </div>
        <HomeHero3D
          message={
            settings?.heroGiftBoxMessage ??
            "Welcome! You unlocked a secret surprise from Gift World ✨"
          }
          maxOpens={settings?.heroGiftBoxMaxOpens ?? 3}
        />
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="font-bengali text-3xl font-bold text-white">ফ্রি ও প্রিমিয়াম</h2>
        <p className="mt-2 text-white/55">Owner প্যানেল থেকে দাম ও সুবিধা যেকোনো সময় বদলানো যায়</p>
        <div className="mt-10">
          <PricingCards
            packages={pkgDtos}
            whatsappNumber={settings?.whatsappNumber ?? ""}
            user={
              user
                ? { name: user.name, email: user.email, phone: user.phone }
                : null
            }
          />
        </div>
      </section>

      <section id="templates" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="font-bengali text-3xl font-bold text-white">টেমপ্লেট ও আইডিয়া</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GIFT_INSPIRATIONS.slice(0, 6).map((t) => (
            <Link
              key={t.id}
              href="/create"
              className="glass-panel rounded-2xl p-5 transition hover:bg-white/[0.08]"
            >
              <span className="text-2xl">{t.emoji}</span>
              <h3 className="mt-2 font-semibold text-white">{t.name}</h3>
              <p className="mt-1 text-sm text-white/50 line-clamp-2">{t.hook}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
        <h2 className="font-bengali text-3xl font-bold text-white">সাম্প্রতিক গিফট</h2>
        {gallery.length === 0 ? (
          <p className="mt-4 text-white/45">এখনো পাবলিশ করা গিফট নেই — প্রথম হোন!</p>
        ) : (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((g) => {
              let title = "Gift";
              try {
                title = (JSON.parse(g.config) as { title?: string }).title ?? title;
              } catch {
                /* ignore */
              }
              return (
                <li key={g.slug}>
                  <Link
                    href={`/g/${g.slug}`}
                    className="glass-panel block rounded-2xl p-4 hover:bg-white/[0.08]"
                  >
                    <p className="font-medium text-white">{title}</p>
                    <p className="mt-1 text-xs text-white/40">/g/{g.slug}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
