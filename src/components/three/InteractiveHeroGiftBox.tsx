"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  canOpenGiftBox,
  getOpenCount,
  recordGiftBoxOpen,
} from "@/lib/gift-box/open-limit";
import { GiftRevealOverlay } from "@/components/gift-box/GiftRevealOverlay";

const HERO_SCOPE = "site_hero";

function GiftMesh({ opened, onPointerDown }: { opened: boolean; onPointerDown: () => void }) {
  const group = useRef<Group>(null);
  const lid = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (group.current && !opened) group.current.rotation.y += delta * 0.35;
    if (lid.current) {
      const targetY = opened ? 1.35 : 0.62;
      const targetX = opened ? -1.1 : 0;
      const targetZ = opened ? 0.25 : 0;
      lid.current.position.y += (targetY - lid.current.position.y) * 0.12;
      lid.current.rotation.x += (targetX - lid.current.rotation.x) * 0.12;
      lid.current.position.z += (targetZ - lid.current.position.z) * 0.1;
    }
  });

  return (
    <group ref={group} onPointerDown={onPointerDown}>
      <RoundedBox args={[1.6, 1.2, 1.6]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial color="#e11d48" metalness={0.35} roughness={0.25} />
      </RoundedBox>
      <mesh ref={lid} position={[0, 0.62, 0]} scale={[1.62, 0.2, 1.62]}>
        <boxGeometry />
        <meshStandardMaterial color="#fda4af" metalness={0.2} roughness={0.4} emissive="#fb7185" emissiveIntensity={opened ? 0.35 : 0} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 1.25, 1.65]} />
        <meshStandardMaterial color="#ffe4e6" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.65, 0.18, 1.65]} />
        <meshStandardMaterial color="#ffe4e6" />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.45} />
      </mesh>
      {opened ? (
        <pointLight position={[0, 0.4, 0.5]} intensity={2.2} color="#fda4af" distance={4} />
      ) : null}
    </group>
  );
}

type Props = {
  message: string;
  maxOpens: number;
};

export function InteractiveHeroGiftBox({ message, maxOpens }: Props) {
  const [opened, setOpened] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const [locked, setLocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const limited = maxOpens > 0 && !canOpenGiftBox(HERO_SCOPE, maxOpens);
    setLocked(limited);
    if (limited && getOpenCount(HERO_SCOPE) >= maxOpens) setOpened(true);
    setHydrated(true);
  }, [maxOpens]);

  const tryOpen = () => {
    if (locked || opened) return;
    if (maxOpens > 0 && !canOpenGiftBox(HERO_SCOPE, maxOpens)) {
      setLocked(true);
      return;
    }
    setOpened(true);
    recordGiftBoxOpen(HERO_SCOPE);
    setTimeout(() => setShowReveal(true), 450);
  };

  if (!hydrated) {
    return <div className="h-[320px] animate-pulse rounded-3xl bg-white/5 md:h-[380px]" />;
  }

  if (locked && !showReveal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex h-[320px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center md:h-[380px]"
      >
        <p className="font-bengali text-lg text-white/80">You have already opened your gift!</p>
        <p className="mt-2 text-sm text-white/45">আপনি ইতিমধ্যে আপনার গিফট খুলেছেন ✨</p>
      </motion.div>
    );
  }

  return (
    <div className="relative h-[320px] w-full max-w-lg md:h-[380px]">
      <AnimatePresence>
        {!locked ? (
          <motion.div
            key="box"
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 0.92, filter: "blur(6px)" }}
            transition={{ duration: 0.45 }}
          >
            <Canvas camera={{ position: [0, 1.2, 4.2], fov: 42 }} shadows dpr={[1, 2]}>
              <color attach="background" args={["#00000000"]} />
              <ambientLight intensity={0.55} />
              <directionalLight position={[4, 6, 2]} intensity={1.2} castShadow />
              <pointLight position={[-3, 2, -2]} intensity={0.8} color="#a78bfa" />
              <GiftMesh opened={opened} onPointerDown={tryOpen} />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate={!opened} autoRotateSpeed={0.6} />
            </Canvas>
            {!opened ? (
              <p className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-xs text-rose-200/80">
                বক্সে ক্লিক করে খুলুন
              </p>
            ) : null}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <GiftRevealOverlay
        open={showReveal}
        message={message}
        title="🎁 সারপ্রাইজ"
        onClose={() => {
          setShowReveal(false);
          setOpened(false);
          if (maxOpens > 0 && getOpenCount(HERO_SCOPE) >= maxOpens) setLocked(true);
        }}
      />
    </div>
  );
}
