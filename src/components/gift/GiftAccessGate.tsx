import Link from "next/link";

export function GiftAccessDenied({
  message,
  slug,
}: {
  message: string;
  slug: string;
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="text-4xl">🔒</p>
      <h1 className="mt-4 font-bengali text-xl font-semibold text-white">এই গিফট আপনার জন্য নয়</h1>
      <p className="mt-3 text-sm text-white/60">{message}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/login?next=${encodeURIComponent(`/g/${slug}`)}`}
          className="rounded-xl bg-rose-500 px-5 py-2.5 text-sm font-medium text-white"
        >
          প্রাপক হিসেবে লগইন
        </Link>
        <Link href="/" className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-white/80">
          হোম
        </Link>
      </div>
    </div>
  );
}

export function GiftSenderPreviewBanner({ message }: { message?: string }) {
  return (
    <div className="mx-auto mb-4 max-w-lg rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-center text-sm text-amber-100">
      {message ?? "আপনি পাঠক — প্রাপকই গিফট খুলতে পারবে। আপনি প্রিভিউ দেখছেন।"}
    </div>
  );
}
