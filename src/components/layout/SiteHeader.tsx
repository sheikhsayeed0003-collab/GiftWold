import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/current-user";
import { isOwnerOrAdmin } from "@/lib/auth/current-user";
import { LogoutButton } from "./LogoutButton";

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050308]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
        <Link href="/" className="font-bengali text-xl font-bold md:text-2xl">
          <span className="text-gradient">Gift World</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/#pricing" className="hover:text-white">
            প্যাকেজ
          </Link>
          <Link href="/#templates" className="hover:text-white">
            টেমপ্লেট
          </Link>
          <Link href="/#gallery" className="hover:text-white">
            গ্যালারি
          </Link>
          <Link href="/contact" className="hover:text-white">
            যোগাযোগ
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10 sm:inline"
              >
                ড্যাশবোর্ড
              </Link>
              {isOwnerOrAdmin(user.role) && (
                <Link
                  href="/admin"
                  className="hidden rounded-xl px-3 py-2 text-sm text-amber-200/90 hover:bg-white/10 sm:inline"
                >
                  অ্যাডমিন
                </Link>
              )}
              <Link
                href="/create"
                className="rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                গিফট বানাও
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-3 py-2 text-sm text-white/80 hover:bg-white/10"
              >
                লগইন
              </Link>
              <Link
                href="/register"
                className="rounded-xl border border-white/15 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
              >
                অ্যাকাউন্ট
              </Link>
              <Link
                href="/create"
                className="rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white"
              >
                শুরু করুন
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
