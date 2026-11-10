import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getGiftBySlug } from "@/lib/gifts/repository";
import { PageShell } from "@/components/ui/PageShell";
import { GiftReceiver } from "@/components/pack-player/GiftReceiver";

export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gift = await getGiftBySlug(id);
  if (!gift) return { title: "গিফট খুঁজে পাওয়া যায়নি" };
  return {
    title: gift.title,
    description: gift.recipientName
      ? `${gift.recipientName} এর জন্য বিশেষ উপহার`
      : "একটি বিশেষ ডিজিটাল উপহার",
  };
}

async function GiftView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gift = await getGiftBySlug(id);
  if (!gift) notFound();
  return <GiftReceiver data={gift} />;
}

export default function GiftPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center font-bengali text-white/60">
            <span className="animate-pulse">উপহার লোড হচ্ছে…</span>
          </div>
        }
      >
        <GiftView params={params} />
      </Suspense>
    </PageShell>
  );
}
