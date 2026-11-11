"use client";

import dynamic from "next/dynamic";

const InteractiveHeroGiftBox = dynamic(
  () => import("@/components/three/InteractiveHeroGiftBox").then((m) => m.InteractiveHeroGiftBox),
  { loading: () => <div className="h-[320px] animate-pulse rounded-3xl bg-white/5 md:h-[380px]" /> }
);

export function HomeHero3D({
  message,
  maxOpens,
}: {
  message: string;
  maxOpens: number;
}) {
  return <InteractiveHeroGiftBox message={message} maxOpens={maxOpens} />;
}
