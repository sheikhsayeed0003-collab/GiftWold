"use client";

import dynamic from "next/dynamic";
import { isGiftPackProject, type GiftPackProject } from "@/types/gift-pack";
import type { GiftConfig } from "@/types/gift";
import { GiftExperience } from "@/components/gift/GiftExperience";

const GiftPackPlayer = dynamic(
  () => import("./GiftPackPlayer").then((m) => m.GiftPackPlayer),
  { ssr: false }
);

export function GiftReceiver({ data }: { data: GiftPackProject | GiftConfig }) {
  if (isGiftPackProject(data)) {
    return <GiftPackPlayer project={data} />;
  }
  return <GiftExperience gift={data} />;
}
