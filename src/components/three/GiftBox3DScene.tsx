"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Group } from "three";
import type { BoxStyle } from "@/types/gift";

const COLORS: Record<BoxStyle, string> = {
  classic: "#f43f5e",
  ribbon: "#d946ef",
  minimal: "#64748b",
  neon: "#22d3ee",
};

function Box({ color, accent }: { color: string; accent: string }) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.y += d * 0.4;
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[1.4, 1, 1.4]} radius={0.06} smoothness={3}>
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.52, 0]} scale={[1.42, 0.15, 1.42]}>
        <boxGeometry />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

export function GiftBox3DScene({
  boxColor,
  style,
}: {
  boxColor: string;
  style: BoxStyle;
}) {
  const main = COLORS[style];
  return (
    <div className="h-48 w-full">
      <Canvas camera={{ position: [0, 0.8, 3.2], fov: 45 }}>
        <color attach="background" args={[boxColor]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 2]} intensity={1.1} />
        <Box color={main} accent="#fff" />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
