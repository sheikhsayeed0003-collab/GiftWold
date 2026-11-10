"use client";

import { useEffect, useRef, useState } from "react";
import { usePackEditor } from "@/context/PackEditorContext";
import { PackPreviewModal } from "./PackPreviewModal";

type Props = {
  onPublish: () => void;
  publishing: boolean;
};

export function EditorToolbar({ onPublish, publishing }: Props) {
  const { undo, redo, canUndo, canRedo, project } = usePackEditor();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [autoOn, setAutoOn] = useState(true);
  const lastSaved = useRef("");

  const saveDraft = async () => {
    const res = await fetch("/api/gifts/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (res.ok) {
      setSaved(true);
      lastSaved.current = JSON.stringify(project);
    }
    setTimeout(() => setSaved(false), 2000);
  };

  useEffect(() => {
    if (!autoOn) return;
    const json = JSON.stringify(project);
    if (json === lastSaved.current) return;
    const t = setTimeout(() => {
      void saveDraft();
    }, 45000);
    return () => clearTimeout(t);
  }, [autoOn, project]);

  const btn =
    "rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:opacity-40";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-md">
        <p className="px-3 pt-2 text-center font-bengali text-sm font-bold text-gradient md:text-left">
          Gift Pack Editor
        </p>
        <div className="flex gap-1 overflow-x-auto px-2 pb-2 pt-1 [-webkit-overflow-scrolling:touch] scroll-smooth md:flex-wrap md:justify-end md:px-3">
          <button type="button" disabled={!canUndo} onClick={undo} className={btn + " shrink-0 bg-white/10 text-white touch-manipulation min-h-10"}>
            Undo
          </button>
          <button type="button" disabled={!canRedo} onClick={redo} className={btn + " shrink-0 bg-white/10 text-white touch-manipulation min-h-10"}>
            Redo
          </button>
          <button type="button" onClick={() => void saveDraft()} className={btn + " shrink-0 bg-white/10 text-white touch-manipulation min-h-10"}>
            {saved ? "সেভ হয়েছে" : "Save Draft"}
          </button>
          <button
            type="button"
            onClick={() => setAutoOn((v) => !v)}
            className={btn + " shrink-0 touch-manipulation min-h-10" + (autoOn ? " bg-emerald-600/40 text-emerald-100" : " bg-white/5 text-white/50")}
            title="Auto-save প্রতি ৪৫ সেকেন্ড"
          >
            Auto {autoOn ? "ON" : "OFF"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!project.sequenceReady) {
                alert("আগে Finish (শেষ) বাটনে ক্লিক করে গিফট ক্রম সাজান");
                return;
              }
              setPreviewOpen(true);
            }}
            className={btn + " shrink-0 border border-white/15 text-white touch-manipulation min-h-10"}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={onPublish}
            disabled={publishing}
            className={btn + " shrink-0 bg-gradient-to-r from-rose-500 to-violet-600 text-white touch-manipulation min-h-10"}
          >
            {publishing ? "Publish…" : "Publish"}
          </button>
        </div>
      </header>
      <PackPreviewModal open={previewOpen} project={project} onClose={() => setPreviewOpen(false)} />
    </>
  );
}
