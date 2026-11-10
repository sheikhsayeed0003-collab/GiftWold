"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GiftConfig } from "@/types/gift";
import { GiftBox } from "./GiftBox";
import { EffectOverlay } from "@/components/effects/EffectOverlay";
import { fontClassFor } from "@/lib/font-class";
import { giftBackgroundStyle } from "@/lib/background-style";
import clsx from "clsx";

type Props = {
  gift: GiftConfig;
  preview?: boolean;
};

function isAudioUrl(url: string) {
  return /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(url);
}

export function GiftExperience({ gift, preview }: Props) {
  const [openedCount, setOpenedCount] = useState(0);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [effectBurst, setEffectBurst] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const fontClass = fontClassFor(gift.fontFamily);
  const allOpen = openedCount >= gift.boxes.length;
  const lightBg = gift.backgroundColor === "#f5e6d3";

  const currentBox = gift.boxes[openedCount];

  const handleOpen = useCallback(() => {
    if (!currentBox) return;
    setShowMessage(currentBox.message);
    setEffectBurst(true);
    setTimeout(() => setEffectBurst(false), 100);
    setTimeout(() => {
      setOpenedCount((c) => c + 1);
      setShowMessage(null);
    }, 2400);
  }, [currentBox]);

  const effectActive =
    gift.effect !== "none" && (openedCount > 0 || showMessage !== null);

  const musicNode = useMemo(() => {
    if (!gift.musicUrl?.trim()) return null;
    if (isAudioUrl(gift.musicUrl)) {
      return (
        <audio ref={audioRef} className="hidden" src={gift.musicUrl} preload="auto" />
      );
    }
    return (
      <a
        href={gift.musicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-white/80 underline underline-offset-4"
      >
        সঙ্গীত শুনুন
      </a>
    );
  }, [gift.musicUrl]);

  return (
    <div
      className={clsx(
        "relative flex min-h-full w-full flex-col items-center overflow-hidden px-4 py-10",
        preview ? "min-h-[400px] py-8" : "min-h-screen py-14",
        fontClass,
        lightBg ? "text-slate-900" : "text-white"
      )}
      style={giftBackgroundStyle(gift.backgroundColor)}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      <EffectOverlay
        effect={gift.effect}
        active={effectActive}
        burst={effectBurst}
      />

      {gift.coverImage && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative mb-6"
        >
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-500/50 to-violet-500/50 blur-md" />
          <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-white/40 shadow-2xl ring-4 ring-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gift.coverImage}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={clsx(
          "relative z-10 mb-2 max-w-lg text-center text-3xl font-semibold leading-tight tracking-tight md:text-4xl",
          fontClass,
          !lightBg && "drop-shadow-[0_2px_24px_rgba(0,0,0,0.4)]"
        )}
      >
        {gift.title}
      </motion.h1>

      {gift.recipientName && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={clsx(
            "relative z-10 mb-6 text-center text-base",
            lightBg ? "text-slate-600" : "text-white/75"
          )}
        >
          প্রিয় <span className="font-medium text-rose-300">{gift.recipientName}</span>
          {gift.senderName ? (
            <span className="opacity-80"> · {gift.senderName} থেকে</span>
          ) : null}
        </motion.p>
      )}

      <div className="relative z-10 mb-4 flex gap-2">
        {gift.boxes.map((_, index) => (
          <motion.div
            key={index}
            className={clsx(
              "h-1.5 rounded-full transition-all duration-500",
              index < openedCount
                ? "w-8 bg-gradient-to-r from-rose-400 to-violet-400"
                : index === openedCount
                  ? "w-12 bg-white/50"
                  : "w-4 bg-white/15"
            )}
            layout
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-wrap items-end justify-center gap-6 md:gap-10">
        {gift.boxes.map((box, index) => (
          <GiftBox
            key={box.id}
            style={gift.boxStyle}
            label={box.label}
            open={index < openedCount}
            active={index === openedCount && !allOpen}
            disabled={index > openedCount}
            onTap={index === openedCount ? handleOpen : () => {}}
            size={preview ? "sm" : "md"}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {showMessage && (
          <motion.div
            key={showMessage}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="gradient-border relative z-20 mt-10 max-w-md rounded-2xl p-[1px]"
          >
            <div
              className={clsx(
                "rounded-2xl px-8 py-6 text-center text-lg leading-relaxed backdrop-blur-xl",
                lightBg ? "bg-white/85 text-slate-800" : "bg-black/40 text-white"
              )}
            >
              <span className="mb-2 block text-2xl">💌</span>
              {showMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {allOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mt-12 text-center"
        >
          <p className={clsx("text-2xl", fontClass)}>সব উপহার উন্মোচিত হয়েছে</p>
          <p className={clsx("mt-2 text-sm opacity-70", lightBg && "text-slate-600")}>
            ভালোবাসা সবসময় থাকুক ✨
          </p>
        </motion.div>
      )}

      <div className="relative z-10 mt-10 flex flex-col items-center gap-2">
        {gift.musicUrl && isAudioUrl(gift.musicUrl) && !preview && (
          <button
            type="button"
            onClick={() => {
              setMusicPlaying(true);
              void audioRef.current?.play();
            }}
            className="rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm backdrop-blur-md transition hover:bg-white/20"
          >
            {musicPlaying ? "♫ সঙ্গীত চলছে..." : "♫ সঙ্গীত চালু করুন"}
          </button>
        )}
        {musicNode}
      </div>
    </div>
  );
}
