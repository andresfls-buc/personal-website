"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function Skull() {
  const { scene } = useGLTF("/models/skull.glb");
  return (
    <group position={[0, -0.15, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/skull.glb");

export default function SkullScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 4.2], fov: 38 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        {/* Soft key + rim lighting */}
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1.2}
          color="#ffffff"
        />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.6}
          color="#cfd6ff"
        />
        <pointLight position={[0, -2, 3]} intensity={0.4} color="#fff5e0" />

        <Skull />

        <OrbitControls
          target={[0, -0.15, 0]}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.9}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.75}
          minDistance={4.2}
          maxDistance={4.2}
        />

        <ContactShadows
          position={[0, -1.35, 0]}
          opacity={0.45}
          scale={6}
          blur={2.6}
          far={3}
          color="#141414"
        />

        {/* Studio-ish reflections for the silver material */}
        <Environment preset="studio" environmentIntensity={0.85} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
