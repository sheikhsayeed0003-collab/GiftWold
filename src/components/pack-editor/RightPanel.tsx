"use client";

import { usePackEditor } from "@/context/PackEditorContext";
import { LayerInspector } from "./LayerInspector";
import { TvScreenSettings } from "./TvScreenSettings";
import { WishEditorPanel } from "./WishEditorPanel";

const input =
  "w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white";

export function RightPanel() {
  const {
    selectedNode,
    updateSelectedNode,
    duplicateSelected,
    deleteSelected,
    patchProject,
    project,
  } = usePackEditor();

  if (!selectedNode) {
    return (
      <aside className="border-l border-white/10 bg-black/20 p-4 text-sm text-white/45">
        বাম থেকে গিফট নির্বাচন করুন
      </aside>
    );
  }

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto border-l border-white/10 bg-black/20 p-3">
      <section>
        <h3 className="text-xs font-semibold uppercase text-white/50">প্রজেক্ট</h3>
        <label className="mt-2 block text-[10px] text-white/45">শিরোনাম</label>
        <input
          className={input}
          value={project.title}
          onChange={(e) => patchProject({ title: e.target.value })}
        />
        <label className="mt-2 block text-[10px] text-white/45">প্রাপকের নাম</label>
        <input
          className={input}
          value={project.recipientName}
          onChange={(e) => patchProject({ recipientName: e.target.value })}
        />
        <label className="mt-2 block text-[10px] text-white/45">প্রাপকের ইমেইল (প্রাইভেট খোলা)</label>
        <input
          type="email"
          className={input}
          value={project.recipientEmail ?? ""}
          onChange={(e) => patchProject({ recipientEmail: e.target.value })}
          placeholder="প্রাপক যে ইমেইলে লগইন করবে"
        />
        <p className="mt-1 text-[10px] text-violet-300/70">
          ইমেইল দিলে শুধু প্রাপক খুলতে পারবে; পাঠক দেখবে; অন্যরা দেখবে না
        </p>
      </section>

      <WishEditorPanel />

      <section>
        <h3 className="text-xs font-semibold uppercase text-white/50">বক্স সেটিংস</h3>
        <input
          className={input + " mt-2"}
          value={selectedNode.name}
          onChange={(e) => updateSelectedNode({ name: e.target.value })}
        />
        <div className="mt-2 grid grid-cols-2 gap-2">
          <label className="text-[10px] text-white/45">
            বক্স রঙ
            <input
              type="color"
              value={selectedNode.boxColor}
              onChange={(e) => updateSelectedNode({ boxColor: e.target.value })}
              className="mt-1 h-8 w-full cursor-pointer"
            />
          </label>
          <label className="text-[10px] text-white/45">
            রিবন
            <input
              type="color"
              value={selectedNode.ribbonColor}
              onChange={(e) => updateSelectedNode({ ribbonColor: e.target.value })}
              className="mt-1 h-8 w-full cursor-pointer"
            />
          </label>
        </div>
        <label className="mt-2 block text-[10px] text-white/45">
          স্কেল {selectedNode.scale.toFixed(2)}
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={selectedNode.scale}
            onChange={(e) => updateSelectedNode({ scale: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="mt-1 block text-[10px] text-white/45">
          ঘূর্ণন (৩D)
          <input
            type="range"
            min={-3.14}
            max={3.14}
            step={0.1}
            value={selectedNode.rotationY}
            onChange={(e) => updateSelectedNode({ rotationY: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="mt-2 block text-[10px] text-white/45">রিভিল মেসেজ (পপ-আপ)</label>
        <textarea
          className={input + " min-h-[64px] resize-y"}
          value={selectedNode.revealMessage ?? ""}
          onChange={(e) => updateSelectedNode({ revealMessage: e.target.value })}
          placeholder="খালি = প্রথম টেক্সট লেয়ার"
        />
        <label className="mt-2 block text-[10px] text-white/45">
          Maximum Open Limit (ডিভাইস প্রতি)
          <input
            type="number"
            min={0}
            max={99}
            className={input + " mt-1"}
            value={selectedNode.maxOpenLimit ?? 0}
            onChange={(e) => updateSelectedNode({ maxOpenLimit: Number(e.target.value) })}
          />
          <span className="text-white/35">০ = অসীম</span>
        </label>
        <select
          className={input + " mt-2"}
          value={selectedNode.opening}
          onChange={(e) =>
            updateSelectedNode({
              opening: e.target.value as typeof selectedNode.opening,
            })
          }
        >
          <option value="click">Click to Open</option>
          <option value="touch">Touch to Open</option>
          <option value="ribbon_pull">Ribbon Pull</option>
          <option value="lid_open">Lid Open</option>
          <option value="slow_open">Slow Open</option>
          <option value="fast_open">Fast Open</option>
          <option value="shake">Shake</option>
          <option value="confetti">Confetti</option>
          <option value="hearts">Hearts</option>
        </select>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={duplicateSelected}
            className="flex-1 rounded-lg bg-white/10 py-1.5 text-[10px] text-white"
          >
            Duplicate box
          </button>
          <button
            type="button"
            onClick={deleteSelected}
            className="flex-1 rounded-lg bg-rose-500/20 py-1.5 text-[10px] text-rose-200"
          >
            Delete box
          </button>
        </div>
      </section>

      <TvScreenSettings />
      <LayerInspector />
    </aside>
  );
}
