"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const FLAG_VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    float pinWeight = smoothstep(0.0, 0.5, uv.x);
    float wave = sin(pos.x * 2.8 - uTime * 2.4) * 0.10
               + sin(pos.x * 5.0 - uTime * 3.5 + pos.y * 2.5) * 0.05;
    pos.z += wave * pinWeight;
    pos.y += wave * pinWeight * 0.25;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const FLAG_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(uColor, 1.0);
  }
`;

function Scene() {
  const { scene } = useGLTF("/models/hero_scene.glb");
  const flagMatRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name === "Flag") {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime:  { value: 0 },
            uColor: { value: new THREE.Color(0.12, 0.09, 0.06) },
          },
          vertexShader:   FLAG_VERT,
          fragmentShader: FLAG_FRAG,
          side: THREE.DoubleSide,
        });
        obj.material = mat;
        flagMatRef.current = mat;
      }
    });
  }, [scene]);

  useFrame((_, dt) => {
    if (flagMatRef.current) {
      flagMatRef.current.uniforms.uTime.value += dt;
    }
  });

  return <primitive object={scene} />;
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [-2.0, 1.8, 7.0], fov: 38 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#0a0806"]} />
      <fog attach="fog" args={["#0a0806", 20, 50]} />
      <Scene />
      <EffectComposer>
        <Bloom
          intensity={1.6}
          luminanceThreshold={0.08}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
      <Preload all />
    </Canvas>
  );
}

useGLTF.preload("/models/hero_scene.glb");
