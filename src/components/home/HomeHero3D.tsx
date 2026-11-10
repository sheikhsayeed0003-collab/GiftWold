"use client";

import dynamic from "next/dynamic";

const HeroGiftBox = dynamic(
  () => import("@/components/three/HeroGiftBox").then((m) => m.HeroGiftBox),
  { loading: () => <div className="h-[320px] animate-pulse rounded-3xl bg-white/5 md:h-[380px]" /> }
);

export function HomeHero3D() {
  return <HeroGiftBox />;
}
