"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GiftPackProject } from "@/types/gift-pack";
import {
  applyRecipientName,
  resolveWishConfig,
  wishMusicSrc,
} from "@/lib/gift-pack/wish";
import { formatTogether, useTogetherCounter } from "@/hooks/useTogetherCounter";
import { WishBackground } from "./WishBackground";
import { WishHeartsScene } from "./WishHeartsScene";

type Phase = "password" | "closed" | "opening" | "opened";

type Props = {
  project: GiftPackProject;
  preview?: boolean;
  onOpenPack?: () => void;
  showPackCta?: boolean;
};

function formatSignOff(text: string, recipient: string, sender: string) {
  let s = applyRecipientName(text, recipient);
  s = s.replace(/\{sender\}/gi, sender.trim() || "তোমার");
  s = s.replace(/\{br\}/gi, "\n");
  return s;
}

export function WishGiftExperience({ project, preview, onOpenPack, showPackCta }: Props) {
  const wish = useMemo(() => resolveWishConfig(project), [project]);
  const name = project.recipientName;
  const sender = project.senderName ?? "";

  const musicUrl = useMemo(() => wishMusicSrc(project, wish), [project, wish]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [phase, setPhase] = useState<Phase>(
    wish.linkPassword?.trim() && !preview ? "password" : "closed"
  );
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [muted, setMuted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const counter = useTogetherCounter(wish.counterStart, wish.counterLabel);

  const headline = applyRecipientName(wish.headline, name);
  const greeting = applyRecipientName(wish.greeting, name);
  const message = applyRecipientName(wish.message, name);
  const signOff = formatSignOff(wish.signOff, name, sender);
  const tapHint = wish.tapHint;

  useEffect(() => {
    if (!musicUrl) return;
    const el = new Audio(musicUrl);
    el.loop = true;
    el.volume = 0.75;
    audioRef.current = el;
    return () => {
      el.pause();
      audioRef.current = null;
    };
  }, [musicUrl]);

  const syncPlay = useCallback(
    async (play: boolean) => {
      const el = audioRef.current;
      if (!el || !musicUrl) {
        setMusicPlaying(false);
        return;
      }
      try {
        if (play && !muted) {
          await el.play();
          setMusicPlaying(true);
        } else {
          el.pause();
          setMusicPlaying(false);
        }
      } catch {
        setMusicPlaying(false);
      }
    },
    [musicUrl, muted]
  );

  useEffect(() => {
    if (phase === "opened" && musicUrl) void syncPlay(true);
  }, [phase, musicUrl, syncPlay]);

  useEffect(() => {
    if (muted) void syncPlay(false);
    else if (phase === "opened") void syncPlay(true);
  }, [muted, phase, syncPlay]);

  const submitPassword = () => {
    if (pwInput.trim() === wish.linkPassword?.trim()) {
      setPhase("closed");
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  const openGift = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    window.setTimeout(() => setPhase("opened"), 900);
  };

  const togglePreviewMusic = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!musicUrl) return;
    await syncPlay(!musicPlaying);
  };

  return (
    <div className="wish-experience relative min-h-[100dvh] w-full overflow-hidden text-white">
      <WishBackground template={wish.template} />
      <WishHeartsScene active={phase === "opened"} />

      {wish.showSoundToggle && musicUrl ? (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 touch-manipulation rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs backdrop-blur-md"
        >
          {muted ? "শব্দ বন্ধ" : "শব্দ চালু"}
        </button>
      ) : null}

      <AnimatePresence mode="wait">
        {phase === "password" ? (
          <motion.div
            key="pw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-20 flex min-h-[100dvh] items-center justify-center p-4"
          >
            <div className="glass-panel w-full max-w-sm rounded-2xl p-5">
              <p className="font-bengali text-sm text-white/70">এই গিফটটি পাসওয়ার্ড সুরক্ষিত</p>
              <input
                type="password"
                value={pwInput}
                onChange={(e) => setPwInput(e.target.value)}
                className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 text-sm"
                placeholder="পাসওয়ার্ড"
                onKeyDown={(e) => e.key === "Enter" && submitPassword()}
              />
              {pwError ? (
                <p className="mt-2 text-xs text-rose-300">ভুল পাসওয়ার্ড</p>
              ) : null}
              <button
                type="button"
                onClick={submitPassword}
                className="btn-shimmer mt-4 w-full rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 py-2.5 text-sm font-medium"
              >
                প্রবেশ
              </button>
            </div>
          </motion.div>
        ) : null}

        {(phase === "closed" || phase === "opening") && (
          <motion.div
            key="tap"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="relative z-20 flex min-h-[100dvh] flex-col items-center justify-center px-4 pb-16 pt-12"
          >
            <p className="mb-6 text-center font-playfair text-2xl text-gradient md:text-3xl">{headline}</p>
            <motion.div
              role="button"
              tabIndex={0}
              onClick={openGift}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openGift();
                }
              }}
              className="wish-tap-card gradient-border box-active-glow relative w-full max-w-md cursor-pointer touch-manipulation rounded-3xl p-1 text-left"
              animate={phase === "opening" ? { scale: 1.05, rotateX: 8 } : { scale: 1 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <div className="glass-panel relative overflow-hidden rounded-[1.35rem] px-6 py-10">
                <p className="text-center font-bengali text-lg text-white/90">{tapHint}</p>
                <div className="wish-gradient-bar mt-8 h-2 w-full rounded-full" />
                {musicUrl ? (
                  <button
                    type="button"
                    onClick={togglePreviewMusic}
                    className="absolute left-1/2 top-[58%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/50 text-2xl shadow-lg backdrop-blur-md"
                    aria-label={musicPlaying ? "বিরতি" : "চালান"}
                  >
                    {musicPlaying ? "❚❚" : "▶"}
                  </button>
                ) : (
                  <p className="mt-6 text-center text-4xl opacity-80">🎁</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "opened" ? (
          <motion.div
            key="opened"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-20 mx-auto flex min-h-[100dvh] max-w-lg flex-col px-4 pb-10 pt-14"
          >
            <h1 className="text-center font-playfair text-2xl text-gradient md:text-3xl">{headline}</h1>

            {counter ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-md">
                <p className="text-[11px] uppercase tracking-wider text-white/50">{counter.label}</p>
                <p className="mt-1 font-mono text-lg text-rose-200">{formatTogether(counter)}</p>
              </div>
            ) : null}

            <div className="mt-6 flex-1 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-panel rounded-3xl p-6 font-bengali"
              >
                <p className="text-lg text-rose-200/95">{greeting}</p>
                <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-white/90">{message}</p>
                <p className="mt-6 whitespace-pre-wrap text-sm text-white/75">{signOff}</p>
              </motion.div>
            </div>

            {showPackCta && onOpenPack ? (
              <button
                type="button"
                onClick={onOpenPack}
                className="mt-6 w-full rounded-2xl border border-violet-400/40 bg-violet-600/80 py-3 text-sm font-medium touch-manipulation"
              >
                ৩ডি গিফট বক্স খুলুন →
              </button>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
