"use client";

import { useState } from "react";
import clsx from "clsx";
import { usePackEditor } from "@/context/PackEditorContext";
import { TEXT_ANIMATIONS } from "@/lib/gift-pack/text-animations";
import { uploadBlob, uploadFiles } from "@/lib/editor/upload-client";
import { normalizeImageData, normalizeTextData, normalizeVideoData } from "@/lib/gift-pack/layer-normalize";
import type { AudioLayerData, ImageLayerData, TextLayerData, VideoLayerData } from "@/types/gift-pack";
import { ImageCropModal } from "./ImageCropModal";
import { VoiceRecordButton } from "./VoiceRecordButton";

const input =
  "w-full rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white";

export function LayerInspector() {
  const {
    selectedNode,
    project,
    selectedLayerId,
    selectLayer,
    addLayerToSelected,
    addMediaLayers,
    updateLayer,
    removeLayer,
    duplicateLayer,
    moveLayerZ,
    patchProject,
  } = usePackEditor();

  const [cropLayerId, setCropLayerId] = useState<string | null>(null);

  if (!selectedNode) return null;

  const selectedLayer = selectedNode.layers.find((l) => l.id === selectedLayerId) ?? null;

  const multiUpload = async (type: "image" | "video", files: FileList | null) => {
    if (!files?.length) return;
    try {
      const urls = await uploadFiles(Array.from(files));
      if (urls.length === 1 && selectedLayer?.type === type) {
        updateLayer(selectedLayer.id, { data: { ...selectedLayer.data, src: urls[0] } });
      } else {
        addMediaLayers(type, urls);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : "আপলোড ব্যর্থ");
    }
  };

  const cropSrc =
    cropLayerId && selectedLayer?.type === "image"
      ? (selectedLayer.data as ImageLayerData).src
      : "";

  return (
    <>
      <section>
        <h3 className="text-xs font-semibold uppercase text-white/50">ব্যাকগ্রাউন্ড</h3>
        <select
          className={input + " mt-2"}
          value={project.backgroundKind ?? "solid"}
          onChange={(e) =>
            patchProject({
              backgroundKind: e.target.value as NonNullable<typeof project.backgroundKind>,
            })
          }
        >
          <option value="solid">Solid</option>
          <option value="gradient">Gradient</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        {(project.backgroundKind === "solid" || !project.backgroundKind) && (
          <input
            type="color"
            value={project.backgroundColor}
            onChange={(e) => patchProject({ backgroundColor: e.target.value })}
            className="mt-2 h-9 w-full"
          />
        )}
        {project.backgroundKind === "gradient" && (
          <input
            className={input + " mt-2"}
            value={project.backgroundGradient ?? "linear-gradient(135deg,#1e1b4b,#831843)"}
            onChange={(e) => patchProject({ backgroundGradient: e.target.value })}
            placeholder="CSS gradient"
          />
        )}
        {(project.backgroundKind === "image" || project.backgroundKind === "video") && (
          <input
            type="file"
            accept={project.backgroundKind === "image" ? "image/*" : "video/*"}
            className="mt-2 text-[10px] text-white/60"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const url = await uploadFiles([f]).then((u) => u[0]);
              patchProject(
                project.backgroundKind === "image"
                  ? { backgroundImage: url }
                  : { backgroundVideo: url }
              );
            }}
          />
        )}
        <label className="mt-2 block text-[10px] text-white/45">
          Opacity
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.05}
            value={project.backgroundOpacity ?? 1}
            onChange={(e) => patchProject({ backgroundOpacity: Number(e.target.value) })}
            className="w-full"
          />
        </label>
        <label className="mt-1 block text-[10px] text-white/45">
          Blur
          <input
            type="range"
            min={0}
            max={24}
            value={project.backgroundBlur ?? 0}
            onChange={(e) => patchProject({ backgroundBlur: Number(e.target.value) })}
            className="w-full"
          />
        </label>
      </section>

      <section>
        <div className="flex flex-wrap items-center justify-between gap-1">
          <h3 className="text-xs font-semibold uppercase text-white/50">লেয়ার</h3>
          <div className="flex flex-wrap gap-1">
            <button type="button" onClick={() => addLayerToSelected("text")} className="text-[10px] text-white/60">
              +T
            </button>
            <button type="button" onClick={() => addLayerToSelected("image")} className="text-[10px] text-white/60">
              +Img
            </button>
            <button type="button" onClick={() => addLayerToSelected("video")} className="text-[10px] text-white/60">
              +Vid
            </button>
            <button type="button" onClick={() => addLayerToSelected("audio")} className="text-[10px] text-white/60">
              +Aud
            </button>
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          multiple
          className="mt-2 w-full text-[10px] text-white/55"
          onChange={(e) => void multiUpload("image", e.target.files)}
        />
        <input
          type="file"
          accept="video/*"
          multiple
          className="mt-1 w-full text-[10px] text-white/55"
          onChange={(e) => void multiUpload("video", e.target.files)}
        />
        <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
          {selectedNode.layers.map((layer) => (
            <li key={layer.id}>
              <button
                type="button"
                onClick={() => selectLayer(layer.id)}
                className={clsx(
                  "w-full rounded-lg px-2 py-1 text-left text-[10px]",
                  layer.id === selectedLayerId
                    ? "bg-violet-600/40 text-white"
                    : "bg-white/5 text-white/70"
                )}
              >
                {layer.name} · {layer.type}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selectedLayer && (
        <section className="rounded-xl border border-white/10 p-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-white/80">{selectedLayer.name}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => moveLayerZ(selectedLayer.id, "up")} className="text-[9px] text-white/50">
                ▲
              </button>
              <button type="button" onClick={() => moveLayerZ(selectedLayer.id, "down")} className="text-[9px] text-white/50">
                ▼
              </button>
              <button type="button" onClick={() => duplicateLayer(selectedLayer.id)} className="text-[9px] text-white/50">
                Dup
              </button>
              <button type="button" onClick={() => removeLayer(selectedLayer.id)} className="text-[9px] text-rose-300">
                Del
              </button>
            </div>
          </div>
          <label className="mt-2 flex items-center gap-2 text-[10px] text-white/50">
            <input
              type="checkbox"
              checked={selectedLayer.visible}
              onChange={(e) => updateLayer(selectedLayer.id, { visible: e.target.checked })}
            />
            দৃশ্যমান
          </label>
          <label className="mt-1 block text-[10px] text-white/45">
            শুরু (ms)
            <input
              type="number"
              min={0}
              max={project.timelineDurationMs}
              value={selectedLayer.startMs}
              onChange={(e) => updateLayer(selectedLayer.id, { startMs: Number(e.target.value) })}
              className={input + " mt-0.5"}
            />
          </label>
          <label className="mt-1 block text-[10px] text-white/45">
            Duration (ms)
            <input
              type="number"
              min={200}
              max={project.timelineDurationMs}
              value={selectedLayer.durationMs}
              onChange={(e) => updateLayer(selectedLayer.id, { durationMs: Number(e.target.value) })}
              className={input + " mt-0.5"}
            />
          </label>

          {selectedLayer.type === "text" && (
            <TextControls layerId={selectedLayer.id} data={normalizeTextData(selectedLayer.data as TextLayerData)} />
          )}
          {selectedLayer.type === "image" && (
            <ImageControls
              layerId={selectedLayer.id}
              data={normalizeImageData(selectedLayer.data as ImageLayerData)}
              onCrop={() => setCropLayerId(selectedLayer.id)}
            />
          )}
          {selectedLayer.type === "video" && (
            <VideoControls layerId={selectedLayer.id} data={normalizeVideoData(selectedLayer.data as VideoLayerData)} />
          )}
          {selectedLayer.type === "audio" && (
            <AudioControls layerId={selectedLayer.id} data={selectedLayer.data as AudioLayerData} />
          )}
        </section>
      )}

      <ImageCropModal
        open={!!cropLayerId && !!cropSrc}
        src={cropSrc}
        initialCrop={normalizeImageData((selectedLayer?.data ?? {}) as ImageLayerData).crop ?? { x: 0, y: 0, w: 1, h: 1 }}
        onClose={() => setCropLayerId(null)}
        onApply={async (blob, crop) => {
          if (!cropLayerId) return;
          const url = await uploadBlob(blob, `crop-${Date.now()}.jpg`);
          updateLayer(cropLayerId, {
            data: { ...(selectedLayer?.data as ImageLayerData), src: url, crop },
          });
          setCropLayerId(null);
        }}
      />
    </>
  );
}

function TextControls({ layerId, data }: { layerId: string; data: TextLayerData }) {
  const { updateLayer } = usePackEditor();
  const patch = (p: Partial<TextLayerData>) =>
    updateLayer(layerId, { data: { ...data, ...p } });
  return (
    <div className="mt-2 space-y-1">
      <textarea className={input + " min-h-[56px]"} value={data.content} onChange={(e) => patch({ content: e.target.value })} />
      <div className="flex gap-2">
        <label className="text-[10px] text-white/50">
          <input type="checkbox" checked={!!data.bold} onChange={(e) => patch({ bold: e.target.checked })} /> Bold
        </label>
        <label className="text-[10px] text-white/50">
          <input type="checkbox" checked={!!data.italic} onChange={(e) => patch({ italic: e.target.checked })} /> Italic
        </label>
      </div>
      <input type="color" value={data.color} onChange={(e) => patch({ color: e.target.value })} className="h-8 w-full" />
      <input
        type="range"
        min={12}
        max={72}
        value={data.fontSize}
        onChange={(e) => patch({ fontSize: Number(e.target.value) })}
        className="w-full"
      />
      <select className={input} value={data.animation} onChange={(e) => patch({ animation: e.target.value as TextLayerData["animation"] })}>
        {TEXT_ANIMATIONS.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nameBn}
          </option>
        ))}
      </select>
      <label className="text-[10px] text-white/45">
        anim delay (ms)
        <input type="number" value={data.animDelayMs} onChange={(e) => patch({ animDelayMs: Number(e.target.value) })} className={input} />
      </label>
      <label className="text-[10px] text-white/45">
        anim duration (ms)
        <input type="number" value={data.animDurationMs} onChange={(e) => patch({ animDurationMs: Number(e.target.value) })} className={input} />
      </label>
    </div>
  );
}

function ImageControls({
  layerId,
  data,
  onCrop,
}: {
  layerId: string;
  data: ImageLayerData;
  onCrop: () => void;
}) {
  const { updateLayer } = usePackEditor();
  const patch = (p: Partial<ImageLayerData>) => updateLayer(layerId, { data: { ...data, ...p } });
  return (
    <div className="mt-2 space-y-1">
      <input
        type="file"
        accept="image/*"
        className="text-[10px] text-white/60"
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          const url = await uploadFiles([f]).then((x) => x[0]);
          patch({ src: url });
        }}
      />
      {data.src && (
        <button type="button" onClick={onCrop} className="w-full rounded bg-white/10 py-1 text-[10px] text-white">
          Crop / Resize ক্ষেত্র
        </button>
      )}
      <label className="text-[10px] text-white/45">
        প্রস্থ {data.width}px
        <input type="range" min={80} max={480} value={data.width} onChange={(e) => patch({ width: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-[10px] text-white/45">
        উচ্চতা {data.height}px
        <input type="range" min={80} max={480} value={data.height} onChange={(e) => patch({ height: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-[10px] text-white/45">
        ঘূর্ণন {data.rotation}°
        <input type="range" min={-180} max={180} value={data.rotation} onChange={(e) => patch({ rotation: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-[10px] text-white/45">
        Opacity
        <input type="range" min={0.1} max={1} step={0.05} value={data.opacity ?? 1} onChange={(e) => patch({ opacity: Number(e.target.value) })} className="w-full" />
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={() => patch({ flipX: !data.flipX })} className="flex-1 rounded bg-white/10 py-1 text-[10px]">
          Flip X
        </button>
        <button type="button" onClick={() => patch({ flipY: !data.flipY })} className="flex-1 rounded bg-white/10 py-1 text-[10px]">
          Flip Y
        </button>
      </div>
      <select className={input} value={data.transition ?? "fade"} onChange={(e) => patch({ transition: e.target.value as ImageLayerData["transition"] })}>
        <option value="none">No transition</option>
        <option value="fade">Fade</option>
        <option value="slide">Slide</option>
        <option value="zoom">Zoom</option>
      </select>
    </div>
  );
}

function VideoControls({ layerId, data }: { layerId: string; data: VideoLayerData }) {
  const { updateLayer } = usePackEditor();
  const patch = (p: Partial<VideoLayerData>) => updateLayer(layerId, { data: { ...data, ...p } });
  return (
    <div className="mt-2 space-y-1">
      <input type="file" accept="video/*" className="text-[10px]" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        patch({ src: await uploadFiles([f]).then((x) => x[0]) });
      }} />
      <label className="flex gap-2 text-[10px] text-white/50">
        <input type="checkbox" checked={data.muted} onChange={(e) => patch({ muted: e.target.checked })} /> Mute
      </label>
      <label className="text-[10px] text-white/45">
        Speed {data.playbackRate ?? 1}x
        <input type="range" min={0.5} max={2} step={0.1} value={data.playbackRate ?? 1} onChange={(e) => patch({ playbackRate: Number(e.target.value) })} className="w-full" />
      </label>
      <label className="text-[10px] text-white/45">
        Trim start (ms)
        <input type="number" value={data.trimStartMs ?? 0} onChange={(e) => patch({ trimStartMs: Number(e.target.value) })} className={input} />
      </label>
      <label className="text-[10px] text-white/45">
        Trim end (ms, ০ = শেষ)
        <input type="number" value={data.trimEndMs ?? 0} onChange={(e) => patch({ trimEndMs: Number(e.target.value) })} className={input} />
      </label>
    </div>
  );
}

function AudioControls({ layerId, data }: { layerId: string; data: AudioLayerData }) {
  const { updateLayer } = usePackEditor();
  const patch = (p: Partial<AudioLayerData>) => updateLayer(layerId, { data: { ...data, ...p } });
  return (
    <div className="mt-2 space-y-1">
      <input type="file" accept="audio/*" className="text-[10px]" onChange={async (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        patch({ src: await uploadFiles([f]).then((x) => x[0]) });
      }} />
      <VoiceRecordButton onRecorded={(url) => patch({ src: url })} />
      {data.src && (
        <audio src={data.src} controls className="w-full" preload="metadata" />
      )}
      <label className="text-[10px] text-white/45">
        Volume
        <input type="range" min={0} max={1} step={0.05} value={data.volume} onChange={(e) => patch({ volume: Number(e.target.value) })} className="w-full" />
      </label>
      <select className={input} value={data.trigger} onChange={(e) => patch({ trigger: e.target.value as AudioLayerData["trigger"] })}>
        <option value="on_open">খোলার সময়</option>
        <option value="timeline">টাইমলাইন</option>
        <option value="manual">ম্যানুয়াল</option>
      </select>
      <label className="text-[10px] text-white/45">
        Fade in (ms)
        <input type="number" value={data.fadeInMs} onChange={(e) => patch({ fadeInMs: Number(e.target.value) })} className={input} />
      </label>
      <label className="text-[10px] text-white/45">
        Fade out (ms)
        <input type="number" value={data.fadeOutMs} onChange={(e) => patch({ fadeOutMs: Number(e.target.value) })} className={input} />
      </label>
      <label className="flex gap-2 text-[10px] text-white/50">
        <input type="checkbox" checked={data.loop} onChange={(e) => patch({ loop: e.target.checked })} /> Loop
      </label>
    </div>
  );
}
