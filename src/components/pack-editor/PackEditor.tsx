"use client";

import clsx from "clsx";
import { useState } from "react";
import { PackEditorProvider, usePackEditor } from "@/context/PackEditorContext";
import { EditorToolbar } from "./EditorToolbar";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { TimelinePanel } from "./TimelinePanel";
import { Viewport3D } from "./Viewport3D";
import { ContentCanvasPreview } from "./ContentCanvasPreview";
import { SequenceNumberBar } from "./SequenceNumberBar";
import { ShareModal } from "@/components/editor/ShareModal";
import { MobileEditorNav, type MobileEditorTab } from "./MobileEditorNav";
import { useIsMobile } from "@/hooks/useMediaQuery";

function EditorBody() {
  const { project, selectedNode, playheadMs } = usePackEditor();
  const [publishing, setPublishing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [centerView, setCenterView] = useState<"3d" | "content">("3d");
  const [mobileTab, setMobileTab] = useState<MobileEditorTab>("studio");
  const isMobile = useIsMobile();

  const publish = async () => {
    if (!project.sequenceReady) {
      alert("আগে Finish (শেষ) বাটনে ক্লিক করে গিফট ক্রম সাজান");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      const data = await res.json();
      if (res.status === 401) {
        window.location.href = "/login?next=/create";
        return;
      }
      if (!res.ok) throw new Error(data.error || "Publish failed");
      const origin = window.location.origin;
      setShareUrl(`${origin}/g/${data.id}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "পাবলিশ ব্যর্থ");
    } finally {
      setPublishing(false);
    }
  };

  const studio = (
    <main className="flex min-h-0 flex-1 flex-col border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-2 md:border-x">
      <div className="mb-2 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setCenterView("3d")}
          className={clsx(
            "touch-manipulation min-h-11 rounded-xl px-4 py-2 text-xs font-medium transition active:scale-[0.98]",
            centerView === "3d" ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "bg-white/10 text-white/70"
          )}
        >
          3D + TV
        </button>
        <button
          type="button"
          onClick={() => setCenterView("content")}
          className={clsx(
            "touch-manipulation min-h-11 rounded-xl px-4 py-2 text-xs font-medium transition active:scale-[0.98]",
            centerView === "content" ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30" : "bg-white/10 text-white/70"
          )}
        >
          কনটেন্ট
        </button>
      </div>
      <SequenceNumberBar />
      <div className="min-h-[min(48dvh,400px)] flex-1 overflow-hidden rounded-xl border border-white/10 md:min-h-0">
        {centerView === "3d" ? (
          <Viewport3D
            node={selectedNode}
            compactTv={isMobile}
            tv={
              selectedNode
                ? {
                    project,
                    contentTimeMs: playheadMs,
                    emerged: 1,
                    contentActive: true,
                    beforeOpenPreview: true,
                  }
                : undefined
            }
          />
        ) : (
          <ContentCanvasPreview />
        )}
      </div>
    </main>
  );

  return (
    <div className="flex min-h-[calc(100dvh-3.25rem)] flex-col overflow-hidden rounded-none border border-white/10 bg-[#06040a]/95 shadow-2xl sm:rounded-xl md:max-h-[920px]">
      <EditorToolbar onPublish={publish} publishing={publishing} />
      {isMobile ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {mobileTab === "studio" && <div className="flex min-h-0 flex-1 flex-col">{studio}</div>}
          {mobileTab === "boxes" && (
            <div className="flex-1 overflow-y-auto overscroll-contain pb-20">
              <LeftPanel />
            </div>
          )}
          {mobileTab === "layers" && (
            <div className="flex-1 overflow-y-auto overscroll-contain pb-20">
              <RightPanel />
            </div>
          )}
          {mobileTab === "timeline" && (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden pb-20">
              <div className="min-h-[36dvh] shrink-0 border-b border-white/10">{studio}</div>
              <TimelinePanel compact />
            </div>
          )}
          <MobileEditorNav active={mobileTab} onChange={setMobileTab} />
        </div>
      ) : (
        <>
          <div className="grid min-h-0 flex-1 grid-cols-1 md:grid-cols-[200px_1fr_260px] lg:grid-cols-[220px_1fr_300px]">
            <LeftPanel />
            {studio}
            <RightPanel />
          </div>
          <TimelinePanel />
        </>
      )}
      <ShareModal open={!!shareUrl} url={shareUrl ?? ""} onClose={() => setShareUrl(null)} />
    </div>
  );
}

export function PackEditor() {
  return (
    <PackEditorProvider>
      <EditorBody />
    </PackEditorProvider>
  );
}
