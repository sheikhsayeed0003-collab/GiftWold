"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = {
  open: boolean;
  message: string;
  title?: string;
  onClose?: () => void;
};

export function GiftRevealOverlay({ open, message, title, onClose }: Props) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="gift-reveal-card gradient-border relative max-w-md rounded-3xl p-1"
          >
            <div className="glass-panel rounded-[1.35rem] px-6 py-8 text-center">
              <motion.div
                className="gift-reveal-glow mx-auto mb-4 h-16 w-16 rounded-full"
                animate={{ scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
                transition={{ repeat: Infinity, duration: 2.2 }}
              />
              {title ? (
                <p className="font-playfair text-lg text-gradient">{title}</p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap font-bengali text-base leading-relaxed text-white/95">
                {message}
              </p>
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 touch-manipulation rounded-xl bg-white/10 px-5 py-2 text-sm text-white hover:bg-white/15"
                >
                  বন্ধ করুন
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
