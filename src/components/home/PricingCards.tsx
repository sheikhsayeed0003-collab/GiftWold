"use client";

import { whatsappOrderUrl, buildPremiumOrderMessage } from "@/lib/whatsapp";

export type PackageDto = {
  id: string;
  slug: string;
  name: string;
  nameBn: string | null;
  priceUsd: number;
  durationDays: number;
  isFree: boolean;
  featuresBn: string[];
};

type Props = {
  packages: PackageDto[];
  whatsappNumber: string;
  user?: {
    name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
};

export function PricingCards({ packages, whatsappNumber, user }: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {packages.map((p) => (
        <article
          key={p.id}
          className={`glass-panel gradient-border flex flex-col rounded-3xl p-6 ${
            p.slug === "pro" ? "ring-1 ring-violet-400/40" : ""
          }`}
        >
          <p className="text-xs uppercase tracking-wider text-white/45">
            {p.isFree ? "ফ্রি" : "প্রিমিয়াম"}
          </p>
          <h3 className="mt-1 font-bengali text-xl font-bold text-white">
            {p.nameBn ?? p.name}
          </h3>
          <p className="mt-3 text-3xl font-semibold text-white">
            {p.isFree ? "৳০" : `$${p.priceUsd}`}
            {!p.isFree && p.durationDays > 0 && (
              <span className="text-sm font-normal text-white/45"> / {p.durationDays}দিন</span>
            )}
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm text-white/65">
            {p.featuresBn.map((f) => (
              <li key={f}>✓ {f}</li>
            ))}
          </ul>
          {p.isFree ? (
            <a
              href="/register"
              className="mt-6 block rounded-xl bg-white/10 py-2.5 text-center text-sm font-medium text-white hover:bg-white/15"
            >
              ফ্রি শুরু করুন
            </a>
          ) : (
            <a
              href={whatsappOrderUrl(
                whatsappNumber,
                buildPremiumOrderMessage({
                  packageName: p.name,
                  packageNameBn: p.nameBn,
                  priceUsd: p.priceUsd,
                  featuresBn: p.featuresBn,
                  userName: user?.name ?? "গিফট ওয়ার্ল্ড ব্যবহারকারী",
                  userEmail: user?.email,
                  userPhone: user?.phone,
                })
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-2.5 text-center text-sm font-semibold text-white"
            >
              অর্ডার করুন
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
