"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  Preload,
  useGLTF,
} from "@react-three/drei";
import * as THREE from "three";

function Skull({ scrollRotationRef }: { scrollRotationRef?: RefObject<number> }) {
  const { scene } = useGLTF("/models/skull.glb");
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current && scrollRotationRef) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        scrollRotationRef.current,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]} scale={1.1}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/skull.glb");

interface SkullSceneProps {
  scrollRotationRef?: RefObject<number>;
}

export default function SkullScene({ scrollRotationRef }: SkullSceneProps) {
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
        {/* Ember key (warm, from the upper-right "rose window") + cold arcane rim */}
        <ambientLight intensity={0.18} color="#5c3326" />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1.6}
          color="#e8a85c"
        />
        <directionalLight
          position={[-3, 2, -3]}
          intensity={0.55}
          color="#424a55"
        />
        <pointLight position={[0, -1.5, 3]} intensity={0.7} color="#a85841" />

        <Skull scrollRotationRef={scrollRotationRef} />

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
          opacity={0.7}
          scale={6}
          blur={2.8}
          far={3}
          color="#000000"
        />

        {/* Warm low-key reflections so the silver reads as candle-lit metal */}
        <Environment preset="sunset" environmentIntensity={0.4} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
