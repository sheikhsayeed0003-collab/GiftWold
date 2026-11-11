import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth/current-user";
import { prisma } from "@/lib/db";
import { updatePackage, updateSiteSettings, grantUserPremium } from "./actions";

export const instant = false;

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== UserRole.OWNER) redirect("/dashboard");

  const [settings, packages, users, gifts] = await Promise.all([
    prisma.siteSettings.findFirst({ where: { id: 1 } }),
    prisma.packagePlan.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.gift.count(),
  ]);

  const input =
    "w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white";

  return (
    <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 md:px-8">
      <div>
        <p className="text-xs uppercase tracking-wider text-amber-300/80">Owner Panel</p>
        <h1 className="font-bengali text-3xl font-bold text-white">Gift World অ্যাডমিন</h1>
      </div>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white">সাইট সেটিংস</h2>
        <form action={updateSiteSettings} className="mt-4 grid gap-3 md:grid-cols-2">
          <label className="text-sm text-white/60">
            WhatsApp নম্বর
            <input
              name="whatsappNumber"
              defaultValue={settings?.whatsappNumber}
              className={input + " mt-1"}
            />
          </label>
          <label className="text-sm text-white/60">
            যোগাযোগ ইমেইল
            <input name="contactEmail" defaultValue={settings?.contactEmail} className={input + " mt-1"} />
          </label>
          <label className="text-sm text-white/60">
            ফ্রি গিফট সীমা
            <input
              name="freeGiftsLimit"
              type="number"
              defaultValue={settings?.freeGiftsLimit}
              className={input + " mt-1"}
            />
          </label>
          <label className="text-sm text-white/60">
            ফ্রি পাবলিশ সীমা
            <input
              name="freePublishLimit"
              type="number"
              defaultValue={settings?.freePublishLimit}
              className={input + " mt-1"}
            />
          </label>
          <label className="text-sm text-white/60">
            ডিভাইসে সাইনআপ সীমা
            <input
              name="maxRegistrationsPerDevice"
              type="number"
              defaultValue={settings?.maxRegistrationsPerDevice}
              className={input + " mt-1"}
            />
          </label>
          <label className="col-span-full text-sm text-white/60">
            হোমপেজ ট্যাগলাইন
            <input
              name="homepageTaglineBn"
              defaultValue={settings?.homepageTaglineBn}
              className={input + " mt-1"}
            />
          </label>
          <label className="col-span-full text-sm text-white/60">
            হিরো বর্ণনা
            <textarea
              name="homepageHeroBn"
              defaultValue={settings?.homepageHeroBn}
              className={input + " mt-1 min-h-[80px]"}
            />
          </label>
          <h3 className="col-span-full pt-2 text-sm font-semibold text-emerald-200/90">মিডিয়া আপলোড (অ্যাডমিন)</h3>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="uploadsEnabled" defaultChecked={settings?.uploadsEnabled ?? true} />
            আপলোড সক্রিয়
          </label>
          <label className="text-sm text-white/60">
            ফ্রি সর্বোচ্চ (MB)
            <input
              name="freeUploadMaxMb"
              type="number"
              min={1}
              defaultValue={settings?.freeUploadMaxMb ?? 10}
              className={input + " mt-1"}
            />
          </label>
          <label className="text-sm text-white/60">
            প্রিমিয়াম সর্বোচ্চ (MB)
            <input
              name="premiumUploadMaxMb"
              type="number"
              min={1}
              defaultValue={settings?.premiumUploadMaxMb ?? 50}
              className={input + " mt-1"}
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              name="allowFreeVideoUpload"
              defaultChecked={settings?.allowFreeVideoUpload ?? true}
            />
            ফ্রি ইউজার ভিডিও আপলোড
          </label>
          <h3 className="col-span-full pt-2 text-sm font-semibold text-rose-200/90">৩ডি ডেমো গিফট বক্স (হোমপেজ)</h3>
          <label className="col-span-full text-sm text-white/60">
            ভেতরের বার্তা (খোলার পর পপ-আপ)
            <textarea
              name="heroGiftBoxMessage"
              defaultValue={settings?.heroGiftBoxMessage}
              className={input + " mt-1 min-h-[72px]"}
            />
          </label>
          <label className="text-sm text-white/60">
            Maximum Open Limit (ডিভাইস প্রতি)
            <input
              name="heroGiftBoxMaxOpens"
              type="number"
              min={0}
              max={99}
              defaultValue={settings?.heroGiftBoxMaxOpens ?? 3}
              className={input + " mt-1"}
            />
            <span className="mt-1 block text-[10px] text-white/40">০ = অসীম খোলা</span>
          </label>
          <button
            type="submit"
            className="col-span-full rounded-xl bg-rose-500 py-2 text-sm font-medium text-white"
          >
            সেভ সেটিংস
          </button>
        </form>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white">প্রিমিয়াম প্যাকেজ ({packages.length})</h2>
        <div className="mt-6 space-y-8">
          {packages.map((p) => (
            <form key={p.id} action={updatePackage} className="rounded-2xl border border-white/10 p-4">
              <input type="hidden" name="id" value={p.id} />
              <div className="grid gap-3 md:grid-cols-3">
                <input name="name" defaultValue={p.name} className={input} placeholder="Name EN" />
                <input name="nameBn" defaultValue={p.nameBn ?? ""} className={input} placeholder="নাম বাংলা" />
                <input name="priceUsd" type="number" step="0.01" defaultValue={p.priceUsd} className={input} />
                <input name="durationDays" type="number" defaultValue={p.durationDays} className={input} />
                <label className="flex items-center gap-2 text-sm text-white/70">
                  <input type="checkbox" name="active" defaultChecked={p.active} /> সক্রিয়
                </label>
              </div>
              <textarea
                name="featuresBn"
                defaultValue={(JSON.parse(p.featureListBn) as string[]).join("\n")}
                className={input + " mt-3 min-h-[100px]"}
                placeholder="প্রতি লাইনে একটি সুবিধা"
              />
              <button type="submit" className="mt-3 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white">
                আপডেট প্যাকেজ
              </button>
            </form>
          ))}
        </div>
      </section>

      <section className="glass-panel rounded-3xl p-6">
        <h2 className="text-lg font-semibold text-white">ব্যবহারকারী — প্রিমিয়াম ম্যানুয়াল ({users.length})</h2>
        <p className="mt-1 text-sm text-white/45">মোট পাবলিশড গিফট: {gifts}</p>
        <ul className="mt-4 space-y-3">
          {users.map((u) => (
            <li key={u.id} className="rounded-xl border border-white/10 p-3 text-sm text-white/80">
              <p>
                {u.name} · {u.email ?? u.phone} · {u.role}
              </p>
              <form action={grantUserPremium} className="mt-2 flex flex-wrap gap-2">
                <input type="hidden" name="userId" value={u.id} />
                <select name="planSlug" className={input + " max-w-[140px]"} defaultValue="pro">
                  <option value="pro">pro</option>
                  <option value="starter">starter</option>
                  <option value="ultimate">ultimate</option>
                </select>
                <button type="submit" className="rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white">
                  প্রিমিয়াম দিন
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
