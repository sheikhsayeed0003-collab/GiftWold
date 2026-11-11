"use client";

import { motion } from "framer-motion";

export function WishTreeScene() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center opacity-90">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative h-[min(42vh,320px)] w-[min(70vw,280px)]"
      >
        <motion.div
          className="absolute bottom-0 left-1/2 h-4 w-16 -translate-x-1/2 rounded-full bg-amber-900/80 blur-sm"
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <div
          className="absolute bottom-2 left-1/2 h-[85%] w-3 -translate-x-1/2 rounded-full"
          style={{
            background: "linear-gradient(180deg, #78350f, #451a03)",
            boxShadow: "0 0 24px rgba(251, 191, 36, 0.25)",
          }}
        />
        {[0, 1, 2, 3].map((layer) => (
          <motion.div
            key={layer}
            className="absolute left-1/2 rounded-full border border-emerald-300/20"
            style={{
              bottom: `${12 + layer * 18}%`,
              width: `${90 - layer * 14}%`,
              height: `${22 - layer * 3}%`,
              marginLeft: `-${(90 - layer * 14) / 2}%`,
              background:
                "radial-gradient(circle at 30% 30%, rgba(52, 211, 153, 0.55), rgba(6, 78, 59, 0.85))",
              boxShadow: "0 0 40px rgba(16, 185, 129, 0.35)",
            }}
            animate={{ y: [0, -4 - layer, 0] }}
            transition={{ repeat: Infinity, duration: 2.8 + layer * 0.3, ease: "easeInOut" }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="absolute rounded-full bg-amber-200/90 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                style={{
                  width: 5,
                  height: 5,
                  left: `${12 + i * 14}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
              />
            ))}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
