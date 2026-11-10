"use client";

import { useState } from "react";
import clsx from "clsx";
import { usePackEditor } from "@/context/PackEditorContext";
import { BOX_LIBRARY } from "@/lib/gift-pack/box-library";
import { PACK_TEMPLATES } from "@/lib/gift-pack/templates";
import type { GiftBoxTemplateId, GiftPackNode } from "@/types/gift-pack";

function TreeNode({
  node,
  depth,
  selectedId,
  onSelect,
}: {
  node: GiftPackNode;
  depth: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node.id)}
        className={clsx(
          "mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs",
          selectedId === node.id ? "bg-rose-500/25 text-white" : "text-white/65 hover:bg-white/10"
        )}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <span>🎁</span>
        <span className="truncate">{node.name}</span>
      </button>
      {node.children.map((c) => (
        <TreeNode key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} />
      ))}
    </div>
  );
}

export function LeftPanel() {
  const {
    selectedNodeId,
    selectNode,
    createBoxCount,
    addRootBox,
    addChildBox,
    applyTemplate,
    updateSelectedNode,
    finishSequence,
    project,
  } = usePackEditor();
  const [count, setCount] = useState(3);
  const [pickTemplate, setPickTemplate] = useState<GiftBoxTemplateId>("classic");

  const applyLibToSelected = (id: GiftBoxTemplateId) => {
    setPickTemplate(id);
    const lib = BOX_LIBRARY.find((b) => b.id === id);
    if (!lib || !selectedNodeId) return;
    updateSelectedNode({
      templateId: lib.id,
      boxColor: lib.defaultBoxColor,
      ribbonColor: lib.defaultRibbonColor,
      opening: lib.defaultOpening,
    });
  };

  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto border-r border-white/10 bg-black/20 p-3">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">বক্স সংখ্যা</h3>
        <p className="text-[10px] text-white/40">কতগুলো গিফট বক্স তৈরি করতে চান?</p>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            min={1}
            max={50}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-sm text-white"
          />
          <button
            type="button"
            onClick={() => createBoxCount(count, pickTemplate)}
            className="flex-1 rounded-lg bg-violet-600 px-2 py-1.5 text-xs font-medium text-white"
          >
            গিফট বক্স তৈরি করুন
          </button>
        </div>
        {project.roots.length > 0 && !project.sequenceReady && (
          <button
            type="button"
            onClick={finishSequence}
            className="mt-2 w-full rounded-lg border border-amber-400/50 bg-amber-500/20 py-2 text-xs font-semibold text-amber-100"
          >
            Finish — ক্রমিক নম্বর সাজান
          </button>
        )}
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase text-white/50">৩D লাইব্রেরি</h3>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {BOX_LIBRARY.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => applyLibToSelected(b.id)}
              title={b.nameBn}
              className={clsx(
                "rounded-lg border p-2 text-center text-lg transition",
                pickTemplate === b.id
                  ? "border-rose-400 bg-rose-500/15"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              )}
            >
              {b.emoji}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase text-white/50">টেমপ্লেট</h3>
        <ul className="mt-2 space-y-1">
          {PACK_TEMPLATES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => applyTemplate(t.id)}
                className="w-full rounded-lg bg-white/5 px-2 py-2 text-left text-xs text-white/80 hover:bg-white/10"
              >
                <span className="font-medium">{t.nameBn}</span>
                <span className="block text-[10px] text-white/45">{t.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="min-h-0 flex-1">
        <div className="mb-2 flex gap-1">
          <button
            type="button"
            onClick={() => addRootBox(pickTemplate)}
            className="rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white"
          >
            + রুট
          </button>
          {selectedNodeId && (
            <button
              type="button"
              onClick={() => addChildBox(selectedNodeId, "nested")}
              className="rounded-lg bg-white/10 px-2 py-1 text-[10px] text-white"
            >
              + ভেতরে নেস্ট
            </button>
          )}
        </div>
        <h3 className="text-xs font-semibold text-white/50">গিফট ট্রি</h3>
        <div className="mt-2 max-h-48 overflow-y-auto">
          {project.roots.map((n) => (
            <TreeNode
              key={n.id}
              node={n}
              depth={0}
              selectedId={selectedNodeId}
              onSelect={selectNode}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
