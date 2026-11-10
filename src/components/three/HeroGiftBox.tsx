"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

function GiftMesh() {
  const group = useRef<Mesh>(null);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={group}>
      <RoundedBox args={[1.6, 1.2, 1.6]} radius={0.08} smoothness={4} castShadow>
        <meshStandardMaterial color="#e11d48" metalness={0.35} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 0.62, 0]} scale={[1.62, 0.2, 1.62]}>
        <boxGeometry />
        <meshStandardMaterial color="#fda4af" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.18, 1.25, 1.65]} />
        <meshStandardMaterial color="#ffe4e6" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.65, 0.18, 1.65]} />
        <meshStandardMaterial color="#ffe4e6" />
      </mesh>
      <Float speed={2} floatIntensity={0.6}>
        <mesh position={[0, 1.05, 0]}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial color="#fef3c7" emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

export function HeroGiftBox() {
  return (
    <div className="h-[320px] w-full max-w-lg md:h-[380px]">
      <Canvas camera={{ position: [0, 1.2, 4.2], fov: 42 }} shadows dpr={[1, 2]}>
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.55} />
        <directionalLight position={[4, 6, 2]} intensity={1.2} castShadow />
        <pointLight position={[-3, 2, -2]} intensity={0.8} color="#a78bfa" />
        <GiftMesh />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
    </div>
  );
}
