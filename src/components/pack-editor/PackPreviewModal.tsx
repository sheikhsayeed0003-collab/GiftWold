"use client";

import type { GiftPackProject } from "@/types/gift-pack";
import { GiftReceiver } from "@/components/pack-player/GiftReceiver";

export function PackPreviewModal({
  open,
  project,
  onClose,
}: {
  open: boolean;
  project: GiftPackProject;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-stretch justify-center bg-black/90 p-0 sm:items-center sm:p-4">
      <div className="relative flex h-[100dvh] w-full max-w-4xl flex-col overflow-hidden border-white/15 bg-[#0c0616] sm:h-[85vh] sm:rounded-2xl sm:border">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-10 touch-manipulation min-h-11 rounded-xl bg-black/60 px-4 py-2 text-sm text-white sm:right-3 sm:top-3"
        >
          বন্ধ
        </button>
        <div className="flex-1 overflow-auto">
          <GiftReceiver data={project} preview />
        </div>
      </div>
    </div>
  );
}
