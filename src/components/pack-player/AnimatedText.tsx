"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { TextAnimationId, TextLayerData } from "@/types/gift-pack";

export function AnimatedText({
  data,
  active,
}: {
  data: TextLayerData;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || !active) return;
    const el = ref.current;
    gsap.killTweensOf(el);
    const d = data.animDurationMs / 1000;
    const delay = data.animDelayMs / 1000;

    const run = () => {
      switch (data.animation) {
        case "typewriter":
          el.textContent = "";
          gsap.to({}, {
            duration: d,
            delay,
            onUpdate() {
              const prog = this.progress();
              const len = Math.floor(data.content.length * prog);
              el.textContent = data.content.slice(0, len);
            },
          });
          break;
        case "fade_in":
          gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: d, delay });
          break;
        case "zoom_in":
          gsap.fromTo(el, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: d, delay });
          break;
        case "bounce":
          gsap.fromTo(el, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: d, delay, ease: "bounce.out" });
          break;
        case "shake":
          gsap.fromTo(el, { x: 0 }, { x: 8, duration: 0.08, repeat: 8, yoyo: true, delay });
          break;
        case "slide_up":
          gsap.fromTo(el, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: d, delay });
          break;
        case "slide_down":
          gsap.fromTo(el, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: d, delay });
          break;
        case "float":
          gsap.to(el, { y: -10, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut", delay });
          break;
        case "glitch":
          gsap.fromTo(el, { skewX: 8 }, { skewX: 0, duration: 0.1, repeat: 12, yoyo: true, delay });
          break;
        default:
          gsap.fromTo(el, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: d, delay });
      }
    };
    el.textContent = data.content;
    run();
  }, [active, data]);

  return (
    <div
      ref={ref}
      className="max-w-md px-4 py-3 text-center"
      style={{
        color: data.color,
        fontSize: data.fontSize,
        background: data.bgColor,
        textAlign: data.align,
        opacity: data.opacity ?? 1,
        fontWeight: data.bold ? "bold" : undefined,
        fontStyle: data.italic ? "italic" : undefined,
        letterSpacing: data.letterSpacing,
        lineHeight: data.lineHeight,
        textShadow: data.shadow ? "0 2px 12px rgba(0,0,0,0.5)" : undefined,
        WebkitTextStroke: data.outline ? "1px rgba(0,0,0,0.4)" : undefined,
        border:
          data.borderWidth && data.borderWidth > 0
            ? `${data.borderWidth}px solid ${data.borderColor ?? "#fff"}`
            : undefined,
        transform: `rotate(${data.rotation}deg)`,
      }}
    />
  );
}
