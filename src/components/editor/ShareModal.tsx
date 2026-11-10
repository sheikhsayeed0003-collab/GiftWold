"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import confetti from "canvas-confetti";

type Props = {
  open: boolean;
  url: string;
  onClose: () => void;
};

export function ShareModal({ open, url, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.55 },
      colors: ["#fb7185", "#e879f9", "#a78bfa", "#fbbf24"],
    });
  }, [open]);

  if (!open) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 24, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="gradient-border w-full max-w-md rounded-3xl p-[1px] shadow-2xl"
      >
        <div className="rounded-3xl bg-[#140a22] p-8">
          <div className="mb-2 text-center text-4xl">🎉</div>
          <h2 className="text-gradient mb-2 text-center text-2xl font-bold">
            তোমার গিফট প্রস্তুত!
          </h2>
          <p className="mb-6 text-center text-sm text-white/55">
            লিংক শেয়ার করো বা QR স্ক্যান করাও
          </p>
          <div className="mb-6 flex justify-center rounded-2xl bg-gradient-to-br from-white to-rose-50 p-5 shadow-inner">
            <QRCodeSVG value={url} size={168} level="M" fgColor="#1a0a2e" />
          </div>
          <div className="mb-5 break-all rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-rose-100/90">
            {url}
          </div>
          <div className="mb-3 flex gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-emerald-600/90 py-2 text-center text-xs text-white"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-blue-600/90 py-2 text-center text-xs text-white"
            >
              Facebook
            </a>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={copy}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 hover:brightness-110"
            >
              লিংক কপি
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center rounded-xl border border-white/20 bg-white/5 py-3 text-sm font-medium text-white hover:bg-white/10"
            >
              গিফট খুলুন
            </a>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full text-sm text-white/45 transition hover:text-white/75"
          >
            বন্ধ করুন
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
