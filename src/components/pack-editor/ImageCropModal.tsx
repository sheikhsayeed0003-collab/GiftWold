"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CropRect = { x: number; y: number; w: number; h: number };

export function ImageCropModal({
  src,
  initialCrop,
  open,
  onClose,
  onApply,
}: {
  src: string;
  initialCrop: CropRect;
  open: boolean;
  onClose: () => void;
  onApply: (blob: Blob, crop: CropRect) => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<CropRect>(initialCrop);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) setCrop(initialCrop);
  }, [open, initialCrop]);

  const apply = useCallback(async () => {
    const img = imgRef.current;
    if (!img || !img.complete) return;
    setBusy(true);
    try {
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const sx = Math.round(crop.x * nw);
      const sy = Math.round(crop.y * nh);
      const sw = Math.max(1, Math.round(crop.w * nw));
      const sh = Math.max(1, Math.round(crop.h * nh));
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob"))), "image/jpeg", 0.92);
      });
      onApply(blob, crop);
      onClose();
    } catch (e) {
      alert(e instanceof Error ? e.message : "ক্রপ ব্যর্থ");
    } finally {
      setBusy(false);
    }
  }, [crop, onApply, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-white/15 bg-[#0c0616] p-4">
        <h3 className="text-sm font-semibold text-white">ছবি ক্রপ</h3>
        <p className="mt-1 text-[10px] text-white/45">স্লাইডার দিয়ে ক্ষেত্র ঠিক করুন — Apply এ নতুন ছবি তৈরি হয়</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} src={src} alt="" className="mx-auto mt-3 max-h-48 rounded-lg" crossOrigin="anonymous" />
        <label className="mt-3 block text-[10px] text-white/50">
          X {Math.round(crop.x * 100)}%
          <input
            type="range"
            min={0}
            max={Math.max(0, 1 - crop.w)}
            step={0.01}
            value={crop.x}
            onChange={(e) => setCrop((c) => ({ ...c, x: Number(e.target.value) }))}
            className="w-full"
          />
        </label>
        <label className="mt-1 block text-[10px] text-white/50">
          Y {Math.round(crop.y * 100)}%
          <input
            type="range"
            min={0}
            max={Math.max(0, 1 - crop.h)}
            step={0.01}
            value={crop.y}
            onChange={(e) => setCrop((c) => ({ ...c, y: Number(e.target.value) }))}
            className="w-full"
          />
        </label>
        <label className="mt-1 block text-[10px] text-white/50">
          প্রস্থ {Math.round(crop.w * 100)}%
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={crop.w}
            onChange={(e) => {
              const w = Number(e.target.value);
              setCrop((c) => ({ ...c, w, x: Math.min(c.x, 1 - w) }));
            }}
            className="w-full"
          />
        </label>
        <label className="mt-1 block text-[10px] text-white/50">
          উচ্চতা {Math.round(crop.h * 100)}%
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={crop.h}
            onChange={(e) => {
              const h = Number(e.target.value);
              setCrop((c) => ({ ...c, h, y: Math.min(c.y, 1 - h) }));
            }}
            className="w-full"
          />
        </label>
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-lg bg-white/10 py-2 text-xs text-white">
            বাতিল
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => void apply()}
            className="flex-1 rounded-lg bg-violet-600 py-2 text-xs font-medium text-white disabled:opacity-50"
          >
            {busy ? "…" : "Apply ক্রপ"}
          </button>
        </div>
      </div>
    </div>
  );
}
