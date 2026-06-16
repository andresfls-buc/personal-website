"use client";

import { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stars, Preload, OrbitControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// ─── GLSL Shaders ──────────────────────────────────────────────────────────

const DISK_VERT = /* glsl */ `
  varying vec3 vLocal;
  void main() {
    vLocal = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const DISK_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  varying vec3 vLocal;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i),                   hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float val = 0.0, amp = 0.5;
    for (int i = 0; i < 6; i++) {
      val += amp * noise(p);
      p = p * 2.1 + vec2(1.7, 1.3);
      amp *= 0.5;
    }
    return val;
  }

  void main() {
    float r = length(vLocal.xy);
    float t = (r - uInner) / (uOuter - uInner);
    if (t < 0.0 || t > 1.0) discard;

    float angle = atan(vLocal.y, vLocal.x);

    float omega = 0.6 / pow(r, 1.5);
    float swept = angle - uTime * omega;

    vec2 uv = vec2((swept / 6.28318) + 0.5, t);
    float g1 = fbm(uv * vec2(10.0, 3.0) + uTime * 0.02);
    float g2 = fbm(uv * vec2(7.0,  2.0) - uTime * 0.015 + vec2(4.2, 1.7));
    float gas = g1 * 0.65 + g2 * 0.35;

    float beam = pow(clamp(cos(angle) * 0.45 + 0.78, 0.25, 1.0), 3.0);

    vec3 cHot  = vec3(3.0, 2.5, 1.8);
    vec3 cWarm = vec3(1.6, 0.45, 0.06);
    vec3 cCool = vec3(0.4, 0.03, 0.01);

    vec3 col;
    if (t < 0.25) {
      col = mix(cHot, cWarm, t / 0.25);
    } else {
      col = mix(cWarm, cCool, (t - 0.25) / 0.75);
    }

    col *= (gas * 1.4 + 0.05) * beam;

    float alpha = gas * 1.1
      * smoothstep(0.0, 0.07, t)
      * smoothstep(1.0, 0.88, t);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

// ─── Accretion Disk ────────────────────────────────────────────────────────

function AccretionDisk({ inner, outer }: { inner: number; outer: number }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime:  { value: 0 },
          uInner: { value: inner },
          uOuter: { value: outer },
        },
        vertexShader:   DISK_VERT,
        fragmentShader: DISK_FRAG,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [inner, outer]
  );

  useFrame((_, dt) => {
    mat.uniforms.uTime.value += dt;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={mat}>
      <ringGeometry args={[inner, outer, 256, 8]} />
    </mesh>
  );
}

// ─── Photon Ring ───────────────────────────────────────────────────────────

function PhotonRing({ r }: { r: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[r - 0.04, r + 0.04, 256, 1]} />
      <meshBasicMaterial
        color={new THREE.Color(3, 2, 1)}
        transparent
        opacity={0.55}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Gravitational Lensing Ghost ───────────────────────────────────────────

function LensingGhost() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.35, 0.05, 16, 256]} />
        <meshBasicMaterial
          color={new THREE.Color(3.5, 1.6, 0.2)}
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.38, 0.12, 16, 256]} />
        <meshBasicMaterial
          color={new THREE.Color(2.0, 0.8, 0.1)}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Black Hole Assembly ───────────────────────────────────────────────────

function BlackHole() {
  const group = useRef<THREE.Group>(null!);

  useFrame((_, dt) => {
    group.current.rotation.y += dt * 0.015;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshBasicMaterial color="black" side={THREE.DoubleSide} />
      </mesh>

      <mesh>
        <sphereGeometry args={[1.09, 64, 64]} />
        <meshBasicMaterial
          color={new THREE.Color(2.2, 0.8, 0.12)}
          transparent
          opacity={0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <PhotonRing r={1.5} />
      <AccretionDisk inner={2.0} outer={5.5} />
      <LensingGhost />
    </group>
  );
}

// ─── Scene Controller: OrbitControls + scroll-driven zoom ─────────────────

const CAM_START = new THREE.Vector3(0, 1.8, 11);
const CAM_END   = new THREE.Vector3(0, 0.0, 1.05);
const LOOK_AT   = new THREE.Vector3(0, 0, 0);

function SceneController({ zoomRef }: { zoomRef?: React.RefObject<number> }) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useFrame(() => {
    const t = zoomRef?.current ?? 0;
    const zooming = t > 0.01;

    if (controlsRef.current) controlsRef.current.enabled = !zooming;

    if (zooming) {
      camera.position.lerpVectors(CAM_START, CAM_END, t);
      camera.lookAt(LOOK_AT);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.5}
      minPolarAngle={Math.PI * 0.15}
      maxPolarAngle={Math.PI * 0.85}
    />
  );
}

// ─── Canvas export ────────────────────────────────────────────────────────

export default function BlackHoleScene({ zoomRef }: { zoomRef?: React.RefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 1.8, 11], fov: 44 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#000000"]} />
      <Suspense fallback={null}>
        <Stars
          radius={120}
          depth={60}
          count={6000}
          factor={5}
          saturation={0}
          fade
          speed={0.5}
        />
        <BlackHole />
        <SceneController zoomRef={zoomRef} />
        <EffectComposer>
          <Bloom
            intensity={2.5}
            luminanceThreshold={0.12}
            luminanceSmoothing={0.85}
            mipmapBlur
          />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}
