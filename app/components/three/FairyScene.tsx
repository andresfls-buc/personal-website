"use client";

import { Suspense, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface FairyProps {
  scrollDeltaRef?: RefObject<number>;
}

const GLOW_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const GLOW_FRAGMENT_SHADER = `
  uniform vec3 color;
  uniform float intensity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float falloff = smoothstep(0.5, 0.0, d);
    falloff = pow(falloff, 1.8);
    gl_FragColor = vec4(color, falloff * intensity);
  }
`;

function Glow() {
  const uniforms = useMemo(
    () => ({
      color: { value: new THREE.Color("#ffd28a") },
      intensity: { value: 0.9 },
    }),
    []
  );

  return (
    <Billboard>
      <mesh scale={0.32}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={GLOW_VERTEX_SHADER}
          fragmentShader={GLOW_FRAGMENT_SHADER}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </Billboard>
  );
}

const WING_FLAP = [
  { name: "Wing_Large_L", speed: 10, amplitude: 0.32, phase: 0 },
  { name: "Wing_Large_R", speed: 10, amplitude: 0.32, phase: 0 },
  { name: "Wing_Small_L", speed: 13, amplitude: 0.4, phase: 0.4 },
  { name: "Wing_Small_R", speed: 13, amplitude: 0.4, phase: 0.4 },
];

function Fairy({ scrollDeltaRef }: FairyProps) {
  const { scene } = useGLTF("/models/fairy.glb");
  const groupRef = useRef<THREE.Group>(null);
  const emissiveMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const wings = useRef<{ obj: THREE.Object3D; baseRotX: number; speed: number; amplitude: number; phase: number }[]>([]);

  // scroll "energy" (always >= 0, decays when idle) drives the speed and
  // amplitude of a true left/right oscillator — using magnitude rather than
  // signed scroll delta means she swings both ways no matter which
  // direction you scroll, instead of railing to one side
  const energy = useRef(0);
  const phase = useRef(0);
  const spinY = useRef(0);
  const turnSmooth = useRef(0);

  if (emissiveMats.current.length === 0) {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat?.emissive) {
          mat.emissiveIntensity = 4.5;
          emissiveMats.current.push(mat);
        }
      }
    });
  }

  if (wings.current.length === 0) {
    WING_FLAP.forEach((w) => {
      const obj = scene.getObjectByName(w.name);
      if (obj) wings.current.push({ obj, baseRotX: obj.rotation.x, ...w });
    });
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // scrolling (either direction) pumps energy into the oscillator; it
    // decays back to a calm idle level when scrolling stops
    if (scrollDeltaRef) {
      energy.current += Math.abs(scrollDeltaRef.current) * 0.012;
      scrollDeltaRef.current = 0;
    }
    energy.current *= 0.94;
    energy.current = THREE.MathUtils.clamp(energy.current, 0, 1.6);

    const swingSpeed = 1.6 + energy.current * 3.2;
    phase.current += swingSpeed * dt;

    // kept small on purpose: this only nudges her position within the local
    // camera frame. The big left/right travel across the page comes from
    // FairyCompanion roaming the whole wrapper — if this amplitude is too
    // large she swings outside the camera frustum and gets clipped by the
    // canvas edge (looks like she's "hitting a square")
    const swingAmp = 0.015 + energy.current * 0.02;
    const swingX = Math.sin(phase.current) * swingAmp;
    const swingVelX = Math.cos(phase.current) * swingAmp * swingSpeed;

    if (groupRef.current) {
      // gentle idle drift layered under the scroll-driven swing
      const wanderX = Math.sin(t * 0.5) * 0.025 + Math.sin(t * 1.3 + 1) * 0.01;
      const wanderY = Math.sin(t * 0.7 + 0.5) * 0.02 + Math.cos(t * 1.1) * 0.01;

      groupRef.current.position.x = wanderX + swingX;
      groupRef.current.position.y = wanderY - Math.abs(swingX) * 0.3;

      // the "alive" left/right feel mostly comes from banking and turning
      // in place, which can't push the mesh out of frame
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        -swingVelX * 5 - Math.cos(t * 0.5) * 0.025,
        0.25
      );
      // slow continuous turntable spin so she isn't always facing straight
      // on, with the scroll-driven turn layered on top (kept in its own
      // accumulator so it can't feed back into itself via the lerp)
      spinY.current += dt * 0.3;
      turnSmooth.current = THREE.MathUtils.lerp(turnSmooth.current, swingX * 6, 0.2);
      groupRef.current.rotation.y = spinY.current + turnSmooth.current;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        energy.current * 0.12,
        0.2
      );
    }

    // wings flutter continuously, just a bit faster while scrolling
    const flapBoost = 1 + energy.current * 0.3;
    wings.current.forEach(({ obj, baseRotX, speed, amplitude, phase: wingPhase }) => {
      obj.rotation.x = baseRotX + Math.sin(t * speed * flapBoost + wingPhase) * amplitude;
    });
  });

  return (
    <group ref={groupRef} scale={0.9}>
      <Glow />
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/fairy.glb");

export default function FairyScene({ scrollDeltaRef }: FairyProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 0.62], fov: 40 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NoToneMapping }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={1.1} color="#ffffff" />
        <pointLight position={[0, 0.1, 0.4]} intensity={3} color="#ffd9a0" />

        <Fairy scrollDeltaRef={scrollDeltaRef} />

        <Preload all />
      </Suspense>
    </Canvas>
  );
}
