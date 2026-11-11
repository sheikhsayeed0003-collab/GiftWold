"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { isGiftPackProject, type GiftPackProject } from "@/types/gift-pack";
import type { GiftConfig } from "@/types/gift";
import { GiftExperience } from "@/components/gift/GiftExperience";
import { shouldShowWishExperience } from "@/lib/gift-pack/wish";
import { WishGiftExperience } from "@/components/wish/WishGiftExperience";

const GiftPackPlayer = dynamic(
  () => import("./GiftPackPlayer").then((m) => m.GiftPackPlayer),
  { ssr: false }
);

function PackGiftReceiver({ data, preview }: { data: GiftPackProject; preview?: boolean }) {
  const [showPack, setShowPack] = useState(false);
  const mode = data.experienceMode ?? "pack3d";
  const wishFirst = shouldShowWishExperience(data) && !showPack;

  if (wishFirst) {
    return (
      <WishGiftExperience
        project={data}
        preview={preview}
        showPackCta={mode === "both"}
        onOpenPack={() => setShowPack(true)}
      />
    );
  }
  return <GiftPackPlayer project={data} preview={preview} />;
}

export function GiftReceiver({
  data,
  preview,
}: {
  data: GiftPackProject | GiftConfig;
  preview?: boolean;
}) {
  if (isGiftPackProject(data)) {
    return <PackGiftReceiver data={data} preview={preview} />;
  }
  return <GiftExperience gift={data} />;
}
