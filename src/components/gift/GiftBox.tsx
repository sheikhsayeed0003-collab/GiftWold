"use client";

import { motion } from "framer-motion";
import type { BoxStyle } from "@/types/gift";
import { boxStyleClasses } from "@/lib/themes";
import clsx from "clsx";

type Props = {
  style: BoxStyle;
  label: string;
  open: boolean;
  active?: boolean;
  onTap: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "h-[5.5rem] w-[5.5rem]",
  md: "h-32 w-32",
  lg: "h-40 w-40",
};

function BoxBow({ style }: { style: BoxStyle }) {
  if (style === "minimal") return null;
  return (
    <div className="pointer-events-none absolute -top-3 left-1/2 z-20 -translate-x-1/2">
      <div className="relative h-5 w-8">
        <div className="absolute left-0 h-4 w-4 rotate-[-25deg] rounded-full bg-white/50 shadow-sm" />
        <div className="absolute right-0 h-4 w-4 rotate-[25deg] rounded-full bg-white/50 shadow-sm" />
        <div className="absolute left-1/2 top-1 h-3 w-3 -translate-x-1/2 rounded-full bg-white/70" />
      </div>
    </div>
  );
}

export function GiftBox({
  style,
  label,
  open,
  active,
  onTap,
  disabled,
  size = "md",
}: Props) {
  return (
    <div className="relative flex flex-col items-center pb-8">
      {active && !open && (
        <motion.span
          className="absolute -top-1 z-0 h-full w-full max-w-[120%] rounded-3xl bg-rose-500/20 blur-xl"
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      <motion.button
        type="button"
        disabled={disabled || open}
        onClick={onTap}
        className={clsx(
          "relative rounded-2xl transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-300/80",
          sizes[size],
          !open && !disabled && "cursor-pointer",
          open && "scale-95 opacity-50 cursor-default",
          active && !open && "box-active-glow z-10",
          disabled && !open && "opacity-35 grayscale"
        )}
        whileHover={!open && !disabled ? { scale: 1.06, y: -4 } : undefined}
        whileTap={!open && !disabled ? { scale: 0.94 } : undefined}
        aria-label={`গিফট বক্স ${label}`}
        style={{ perspective: 800 }}
      >
        <div
          className={clsx(
            "absolute inset-0 rounded-2xl ring-1 ring-white/25",
            boxStyleClasses(style)
          )}
        />
        <div className="absolute inset-[3px] rounded-[14px] bg-gradient-to-br from-white/25 via-transparent to-black/20 pointer-events-none" />
        <motion.div
          className={clsx(
            "absolute inset-x-1 top-0 h-[48%] rounded-t-[14px] border-b border-white/35",
            style === "neon" ? "bg-white/15" : "bg-white/25"
          )}
          animate={
            open
              ? { rotateX: -110, y: -12, opacity: 0 }
              : { rotateX: 0, y: 0, opacity: 1 }
          }
          style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        />
        {style !== "minimal" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-full w-[10%] rounded-sm bg-white/30 shadow-inner" />
            <div className="absolute h-[10%] w-full rounded-sm bg-white/30 shadow-inner" />
          </div>
        )}
        <BoxBow style={style} />
        <span
          className={clsx(
            "absolute inset-0 z-10 flex items-center justify-center font-bold text-white drop-shadow-lg",
            size === "sm" ? "text-base" : "text-xl"
          )}
        >
          {open ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl"
            >
              ✦
            </motion.span>
          ) : (
            label
          )}
        </span>
      </motion.button>
      {active && !open && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-1 text-xs font-medium text-rose-200/90"
        >
          ট্যাপ করে খোলো ✨
        </motion.p>
      )}
    </div>
  );
}
