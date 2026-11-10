import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import { userHasActivePremium } from "@/lib/plans/limits";

export const instant = false;

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/dashboard");

  const gifts = await prisma.gift.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const premium = userHasActivePremium(user) || user.role === "OWNER";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-8">
      <h1 className="font-bengali text-3xl font-bold text-white">আমার ড্যাশবোর্ড</h1>
      <p className="mt-1 text-white/55">স্বাগতম, {user.name}</p>

      <span className="glass-panel mt-8 block rounded-2xl p-6">
        <h2 className="text-sm font-medium text-white/70">বর্তমান প্যাকেজ</h2>
        <p className="mt-2 text-xl font-semibold text-white">
          {user.plan?.nameBn ?? user.plan?.name ?? "—"}
          {premium && !user.plan?.isFree && (
            <span className="ml-2 text-sm text-emerald-300">প্রিমিয়াম সক্রিয়</span>
          )}
        </p>
        {user.planExpiresAt && (
          <p className="mt-1 text-sm text-white/45">
            মেয়াদ: {user.planExpiresAt.toLocaleDateString("bn-BD")}
          </p>
        )}
        {!premium && (
          <Link href="/#pricing" className="mt-4 inline-block text-sm text-rose-300 underline">
            প্রিমিয়াম আপগ্রেড করুন
          </Link>
        )}
      </span>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">আমার গিফট</h2>
        <Link href="/create" className="text-sm text-rose-300">
          + নতুন গিফট
        </Link>
      </div>
      <ul className="mt-4 space-y-3">
        {gifts.length === 0 ? (
          <li className="text-white/45">এখনো কোনো গিফট নেই</li>
        ) : (
          gifts.map((g) => {
            let title = "Gift";
            try {
              title = (JSON.parse(g.config) as { title?: string }).title ?? title;
            } catch {
              /* ignore */
            }
            return (
              <li key={g.id} className="glass-panel flex items-center justify-between rounded-xl px-4 py-3">
                <span className="text-white">{title}</span>
                <Link href={`/g/${g.slug}`} className="text-sm text-violet-300">
                  দেখুন
                </Link>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
