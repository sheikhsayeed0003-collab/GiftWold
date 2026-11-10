"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text } from "@react-three/drei";
import { useRef } from "react";
import clsx from "clsx";
import type { Group } from "three";
import type { GiftPackLayer, GiftPackNode, GiftPackProject } from "@/types/gift-pack";
import { formatSequenceLabel } from "@/lib/gift-pack/sequence";
import { GiftTvScreen, type TvScreenControlProps } from "./GiftTvScreen";

function SceneBox({ node, opened }: { node: GiftPackNode; opened?: boolean }) {
  const g = useRef<Group>(null);
  useFrame((_, d) => {
    if (g.current) g.current.rotation.y = node.rotationY + d * 0.15;
  });
  const s = node.scale;
  const lidY = opened ? 1.1 : 0.62;
  return (
    <group ref={g} scale={s}>
      <RoundedBox args={[1.8, 1.2, 1.8]} radius={0.1} castShadow receiveShadow>
        <meshStandardMaterial color={node.boxColor} metalness={0.35} roughness={0.35} />
      </RoundedBox>
      <mesh position={[0, lidY, 0]} scale={[1.02, 0.18, 1.02]}>
        <boxGeometry />
        <meshStandardMaterial color={node.ribbonColor} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.15, 1.25, 1.85]} />
        <meshStandardMaterial color={node.ribbonColor} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.85, 0.15, 1.85]} />
        <meshStandardMaterial color={node.ribbonColor} />
      </mesh>
      {node.templateId === "heart" && (
        <Text position={[0, 0.15, 0.95]} fontSize={0.35} color="#fff">
          ♥
        </Text>
      )}
      {node.sequenceNumber != null && node.sequenceNumber > 0 && (
        <Text position={[0, 0.1, 0.92]} fontSize={0.5} color="#ffffff" anchorX="center">
          {formatSequenceLabel(node.sequenceNumber)}
        </Text>
      )}
    </group>
  );
}

export type ViewportTvProps = {
  project: GiftPackProject;
  contentTimeMs: number;
  emerged: number;
  contentActive: boolean;
  beforeOpenPreview?: boolean;
  tvControls?: TvScreenControlProps;
  displayLayers?: GiftPackLayer[];
};

export function Viewport3D({
  node,
  opened,
  onOpenRequest,
  tv,
  compactTv,
}: {
  node: GiftPackNode | null;
  opened?: boolean;
  onOpenRequest?: () => void;
  tv?: ViewportTvProps;
  /** ফোন/ট্যাবে TV ছোট ও নিচে */
  compactTv?: boolean;
}) {
  if (!node) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-white/40">
        বক্স নির্বাচন করুন
      </div>
    );
  }
  return (
    <div
      role={onOpenRequest && !opened ? "button" : undefined}
      tabIndex={onOpenRequest && !opened ? 0 : undefined}
      onClick={onOpenRequest && !opened ? onOpenRequest : undefined}
      onKeyDown={(e) => {
        if (onOpenRequest && !opened && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpenRequest();
        }
      }}
      className={clsx(
        "relative h-full w-full min-h-[240px] sm:min-h-[280px]",
        onOpenRequest && !opened && "cursor-pointer"
      )}
    >
      <Canvas className="!absolute inset-0" camera={{ position: [2.5, 1.8, 3.2], fov: 42 }} shadows>
        <color attach="background" args={["#0a0612"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 2]} intensity={1.2} castShadow />
        <pointLight position={[-2, 1, -1]} intensity={0.6} color="#f472b6" />
        <SceneBox node={node} opened={opened} />
        <OrbitControls enablePan enableZoom enableRotate={!onOpenRequest} />
      </Canvas>
      {tv && (
        <GiftTvScreen
          project={tv.project}
          node={node}
          contentTimeMs={tv.contentTimeMs}
          emerged={tv.emerged}
          contentActive={tv.contentActive}
          beforeOpenPreview={tv.beforeOpenPreview ?? true}
          controls={tv.tvControls}
          displayLayers={tv.displayLayers}
          compactLayout={compactTv}
        />
      )}
      {onOpenRequest && !opened && (
        <p className="pointer-events-none absolute bottom-3 left-0 right-0 z-20 text-center text-xs text-white/50">
          ক্লিক বা টাচ করে খুলুন · টিভিতে প্রিভিউ
        </p>
      )}
    </div>
  );
}
