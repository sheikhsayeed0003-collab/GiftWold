import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getGiftBySlug, getGiftRecordBySlug } from "@/lib/gifts/repository";
import { PageShell } from "@/components/ui/PageShell";
import { GiftReceiver } from "@/components/pack-player/GiftReceiver";
import { getCurrentUser } from "@/lib/auth/current-user";
import { resolveGiftAccess } from "@/lib/gifts/access";
import { GiftAccessDenied } from "@/components/gift/GiftAccessGate";

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
  const [row, gift, viewer] = await Promise.all([
    getGiftRecordBySlug(id),
    getGiftBySlug(id),
    getCurrentUser(),
  ]);
  if (!gift) notFound();

  if (row) {
    const access = resolveGiftAccess(
      {
        userId: row.userId,
        published: row.published,
        isPublic: row.isPublic,
        recipientEmail: row.recipientEmail,
      },
      viewer
        ? { id: viewer.id, email: viewer.email, role: viewer.role }
        : null
    );
    if (!access.canView) {
      return (
        <GiftAccessDenied message={access.messageBn ?? "এই গিফট দেখার অনুমতি নেই"} slug={id} />
      );
    }
    return (
      <GiftReceiver
        data={gift}
        access={{ canOpen: access.canOpen, role: access.role, messageBn: access.messageBn }}
      />
    );
  }

  return <GiftReceiver data={gift} access={{ canOpen: true, role: "public" }} />;
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
