"use client";

import clsx from "clsx";
import { usePackEditor } from "@/context/PackEditorContext";
import { formatSequenceLabel } from "@/lib/gift-pack/sequence";

export function SequenceNumberBar() {
  const {
    project,
    sequenceRoots,
    selectedNodeId,
    selectBySequenceNumber,
    finishSequence,
    reorderSequenceRoot,
  } = usePackEditor();

  if (sequenceRoots.length === 0) return null;

  return (
    <div className="mb-2 space-y-2">
      {!project.sequenceReady && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2">
          <p className="flex-1 text-xs text-amber-100/90">
            {sequenceRoots.length}টি বক্স তৈরি হয়েছে — সম্পাদনা শেষে ক্রম সাজাতে Finish চাপুন
          </p>
          <button
            type="button"
            onClick={finishSequence}
            className="touch-manipulation min-h-11 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-black"
          >
            Finish (শেষ)
          </button>
        </div>
      )}

      {project.sequenceReady && (
        <p className="text-center text-[10px] text-emerald-400/90">
          ক্রমিক নম্বর সাজানো হয়েছে — নম্বরে ক্লিক করে এডিট · ◀▶ দিয়ে ক্রম বদলান
        </p>
      )}

      <div className="flex gap-1.5 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] scroll-smooth md:flex-wrap md:justify-center md:overflow-visible">
        {sequenceRoots.map((node, i) => {
          const num = node.sequenceNumber ?? i + 1;
          const active = node.id === selectedNodeId;
          return (
            <div key={node.id} className="flex items-center gap-0.5">
              {project.sequenceReady && (
                <button
                  type="button"
                  disabled={i === 0}
                  onClick={() => reorderSequenceRoot(i, i - 1)}
                  className="h-7 w-5 rounded text-[9px] text-white/40 disabled:opacity-20"
                  aria-label="আগে নিন"
                >
                  ◀
                </button>
              )}
            <button
              type="button"
              onClick={() => selectBySequenceNumber(num)}
              className={clsx(
                "touch-manipulation h-11 min-w-11 shrink-0 rounded-xl border text-sm font-semibold transition active:scale-95",
                active
                  ? "border-rose-400 bg-rose-500 text-white shadow-md shadow-rose-500/30"
                  : "border-white/15 bg-white/5 text-white/80 hover:bg-white/15"
              )}
              title={node.name}
            >
              {formatSequenceLabel(num)}
            </button>
              {project.sequenceReady && (
                <button
                  type="button"
                  disabled={i === sequenceRoots.length - 1}
                  onClick={() => reorderSequenceRoot(i, i + 1)}
                  className="h-7 w-5 rounded text-[9px] text-white/40 disabled:opacity-20"
                  aria-label="পরে নিন"
                >
                  ▶
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
