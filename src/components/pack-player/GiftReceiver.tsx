"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { isGiftPackProject, type GiftPackProject } from "@/types/gift-pack";
import type { GiftConfig } from "@/types/gift";
import { GiftExperience } from "@/components/gift/GiftExperience";
import { shouldShowWishExperience } from "@/lib/gift-pack/wish";
import { WishGiftExperience } from "@/components/wish/WishGiftExperience";
import type { GiftViewerRole } from "@/lib/gifts/access";
import { GiftSenderPreviewBanner } from "@/components/gift/GiftAccessGate";

const GiftPackPlayer = dynamic(
  () => import("./GiftPackPlayer").then((m) => m.GiftPackPlayer),
  { ssr: false }
);

export type GiftReceiverAccess = {
  canOpen: boolean;
  role: GiftViewerRole;
  messageBn?: string;
};

function PackGiftReceiver({
  data,
  preview,
  access,
}: {
  data: GiftPackProject;
  preview?: boolean;
  access?: GiftReceiverAccess;
}) {
  const canOpen = preview || (access?.canOpen ?? true);
  const isSenderView = access?.role === "sender";
  const [showPack, setShowPack] = useState(false);
  const mode = data.experienceMode ?? "pack3d";
  const wishFirst = shouldShowWishExperience(data) && !showPack;

  if (wishFirst) {
    return (
      <>
        {isSenderView ? <GiftSenderPreviewBanner message={access?.messageBn} /> : null}
        <WishGiftExperience
          project={data}
          preview={preview}
          canOpen={canOpen}
          showPackCta={mode === "both" && canOpen}
          onOpenPack={() => setShowPack(true)}
        />
      </>
    );
  }
  return (
    <>
      {isSenderView ? <GiftSenderPreviewBanner message={access?.messageBn} /> : null}
      <GiftPackPlayer project={data} preview={preview} canOpen={canOpen} />
    </>
  );
}

export function GiftReceiver({
  data,
  preview,
  access,
}: {
  data: GiftPackProject | GiftConfig;
  preview?: boolean;
  access?: GiftReceiverAccess;
}) {
  if (isGiftPackProject(data)) {
    return <PackGiftReceiver data={data} preview={preview} access={access} />;
  }
  return <GiftExperience gift={data} />;
}
