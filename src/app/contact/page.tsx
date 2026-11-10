import { prisma } from "@/lib/db";
import { whatsappOrderUrl } from "@/lib/whatsapp";

export const instant = false;

export default async function ContactPage() {
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } });
  const wa = settings?.whatsappNumber ?? "";
  const msg = encodeURIComponent("হ্যালো Gift World, আমার একটা প্রশ্ন আছে।");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
      <h1 className="font-bengali text-3xl font-bold text-white">যোগাযোগ</h1>
      <p className="mt-4 text-white/60">
        ইমেইল:{" "}
        <a className="text-rose-300" href={`mailto:${settings?.contactEmail}`}>
          {settings?.contactEmail}
        </a>
      </p>
      <a
        href={whatsappOrderUrl(wa, decodeURIComponent(msg))}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white"
      >
        WhatsApp এ লিখুন
      </a>
    </div>
  );
}
