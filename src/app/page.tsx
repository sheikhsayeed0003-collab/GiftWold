import { Suspense } from "react";
import { HomePage } from "@/components/home/HomePage";

export const instant = false;

export default function Home() {
  return (
    <Suspense
      fallback={<div className="flex min-h-[50vh] items-center justify-center text-white/50">লোড হচ্ছে…</div>}
    >
      <HomePage />
    </Suspense>
  );
}
