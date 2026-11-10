import { Suspense } from "react";
import { PackEditor } from "@/components/pack-editor/PackEditor";
import { AmbientBackground } from "@/components/ui/AmbientBackground";

export const instant = false;

export default function CreateGiftPage() {
  return (
    <div className="relative mx-auto max-w-[1600px] flex-1 px-1 py-2 pb-[env(safe-area-inset-bottom)] sm:px-2 sm:py-4 md:px-4">
      <AmbientBackground />
      <Suspense fallback={<div className="py-20 text-center text-white/50">এডিটর লোড…</div>}>
        <PackEditor />
      </Suspense>
    </div>
  );
}
