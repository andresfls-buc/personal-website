# Elden Ring Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current black hole hero and warm design system with a full Elden Ring / Berserk dark fantasy aesthetic — dark backgrounds, aged gold accents, Cinzel typography, and a Blender-built 3D hero scene with an animated flag.

**Architecture:** Blender MCP builds the static 3D scene (rocky crag, silhouette figure, dead trees, mountains, flag mesh) and exports it as a GLB. Three.js loads the GLB and animates the flag via a vertex shader wave. The site-wide design system (colors + Cinzel font) is updated in `globals.css` and `layout.tsx`.

**Tech Stack:** Blender MCP (`execute_blender_code`, `get_viewport_screenshot`), Three.js / @react-three/fiber, @react-three/postprocessing (Bloom), next/font/google (Cinzel), GSAP, Tailwind CSS v4.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/globals.css` | Modify | Replace color tokens, add Cinzel to `--font-display` |
| `app/layout.tsx` | Modify | Add Cinzel to `next/font/google`, update body classes |
| `app/sections/Hero.tsx` | Rewrite | Dark hero with HeroScene background + text overlay |
| `app/sections/About.tsx` | Modify | Apply new color tokens |
| `app/components/three/HeroScene.tsx` | Create | GLB loader, flag wave shader, bloom |
| `public/models/hero_scene.glb` | Create | Exported from Blender via MCP |

---

## Task 1: Design System — Colors + Typography

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace color tokens in `app/globals.css`**

Find the `@theme inline` block and replace all color variables:

```css
@theme inline {
  --color-background:     #0a0806;
  --color-background-alt: #110e09;
  --color-card:           #1a1510;
  --color-foreground:     #e8dcc8;
  --color-foreground-2:   #a89880;
  --color-foreground-3:   #6b5e4a;
  --color-border:         #2a2318;
  --color-border-strong:  #3d3426;
  --color-accent:         #c9a84c;
  --color-accent-hover:   #e0bc5a;
  --color-accent-soft:    #2a2010;
}
```

- [ ] **Step 2: Update `--font-display` in `globals.css`**

In the CSS vars block (where `--font-display` is defined), update it to point to Cinzel. It will be set via layout.tsx — just ensure the var name stays `--font-display`.

- [ ] **Step 3: Add Cinzel to `app/layout.tsx`**

Add Cinzel alongside Outfit in the font import:

```tsx
import { Outfit, Cinzel } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
});
```

Update the `<html>` tag className to include both font variables:
```tsx
<html lang="en" className={`${cinzel.variable} ${outfit.variable}`}>
```

Update the `<body>` className:
```tsx
<body className="bg-background font-sans text-foreground antialiased">
```

- [ ] **Step 4: Verify fonts load**

Run `npm run dev` and open `localhost:3000`. Open DevTools → Computed styles on any heading — confirm `font-family` shows Cinzel. Confirm page background is near-black (`#0a0806`).

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx
git commit -m "feat: elden ring design system — dark colors + Cinzel typography"
```

---

## Task 2: Build Blender Environment (Sky, Ground, Mountains, Trees)

**Files:**
- Uses Blender MCP: `execute_blender_code`, `get_viewport_screenshot`

- [ ] **Step 1: Clear Blender scene and build environment**

Execute via `mcp__blender__execute_blender_code`:

```python
import bpy
import math

# Clear default scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# ── World: dark sky with amber horizon glow ──────────────────────────────
world = bpy.context.scene.world
world.use_nodes = True
nt = world.node_tree
nt.nodes.clear()

tex_coord = nt.nodes.new('ShaderNodeTexCoord')
mapping = nt.nodes.new('ShaderNodeMapping')
grad = nt.nodes.new('ShaderNodeTexGradient')
grad.gradient_type = 'LINEAR'
color_ramp = nt.nodes.new('ShaderNodeValToRGB')
color_ramp.color_ramp.elements[0].position = 0.0
color_ramp.color_ramp.elements[0].color = (0.04, 0.03, 0.02, 1)
color_ramp.color_ramp.elements.new(0.6)
color_ramp.color_ramp.elements[1].color = (0.18, 0.10, 0.02, 1)
color_ramp.color_ramp.elements[2].color = (0.79, 0.66, 0.30, 1)
bg = nt.nodes.new('ShaderNodeBackground')
bg.inputs['Strength'].default_value = 2.0
output = nt.nodes.new('ShaderNodeOutputWorld')
nt.links.new(tex_coord.outputs['Generated'], mapping.inputs['Vector'])
nt.links.new(mapping.outputs['Vector'], grad.inputs['Vector'])
nt.links.new(grad.outputs['Color'], color_ramp.inputs['Fac'])
nt.links.new(color_ramp.outputs['Color'], bg.inputs['Color'])
nt.links.new(bg.outputs['Background'], output.inputs['Surface'])

# ── Shared dark emission material factory ─────────────────────────────────
def make_emit(name, rgb=(0.05, 0.04, 0.03), strength=0.8):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    mat.node_tree.nodes.clear()
    emit = mat.node_tree.nodes.new('ShaderNodeEmission')
    emit.inputs['Color'].default_value = (*rgb, 1)
    emit.inputs['Strength'].default_value = strength
    out = mat.node_tree.nodes.new('ShaderNodeOutputMaterial')
    mat.node_tree.links.new(emit.outputs['Emission'], out.inputs['Surface'])
    return mat

# ── Ground ────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=60, location=(0, 5, 0))
g = bpy.context.active_object
g.name = 'Ground'
g.data.materials.append(make_emit('GroundMat', (0.03, 0.02, 0.01)))

# ── Mountains ─────────────────────────────────────────────────────────────
import bmesh
def make_peak(name, x, y, w, h):
    verts = [(-w/2,0,0),(w/2,0,0),(0,0,h),(-w/2,2,0),(w/2,2,0),(0,2,h)]
    faces = [(0,1,2),(3,4,5),(0,3,5,2),(1,4,5,2),(0,1,4,3)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (x, y, 0)
    obj.data.materials.append(make_emit(name+'M', (0.06,0.05,0.03)))
    return obj

make_peak('MtnA', 7, 14, 4.5, 4.0)
make_peak('MtnB', 10, 15, 3.0, 5.5)
make_peak('MtnC', 13, 16, 3.5, 3.5)
make_peak('MtnD', -7, 13, 5.0, 3.5)
make_peak('MtnE', -11, 15, 3.5, 4.5)

# ── Castle silhouette ──────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(size=1, location=(11, 17, 3.0))
castle = bpy.context.active_object
castle.name = 'Castle'
castle.scale = (0.5, 0.2, 1.8)
castle.data.materials.append(make_emit('CastleMat', (0.08,0.06,0.04)))

# ── Dead trees ────────────────────────────────────────────────────────────
def make_tree(name, x, y, s=1.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.07*s, depth=2.8*s,
        location=(x, y, 1.4*s))
    t = bpy.context.active_object
    t.name = name
    t.data.materials.append(make_emit(name+'M', (0.07,0.05,0.03)))
    for i, (ax, ay, az, l) in enumerate([
        (0.7,0,0.3,1.1*s),(−0.5,0,−0.2,0.9*s),(0.3,0.2,0.8,0.7*s)]):
        bpy.ops.mesh.primitive_cylinder_add(
            radius=0.04*s, depth=l,
            location=(x+math.sin(ax)*l*0.5, y, 1.8*s+i*0.3*s))
        b = bpy.context.active_object
        b.name = f'{name}_b{i}'
        b.rotation_euler = (ax, ay, az)
        b.data.materials.append(make_emit(name+f'BM{i}', (0.07,0.05,0.03)))

make_tree('Tree1', -5, 5, 1.2)
make_tree('Tree2', -7, 9, 0.9)
make_tree('Tree3',  6, 6, 1.0)
make_tree('Tree4',  8, 5, 0.8)
make_tree('Tree5', -3, 11, 0.7)

print("Environment built OK")
```

- [ ] **Step 2: Screenshot to verify environment**

Call `mcp__blender__get_viewport_screenshot` and review. Mountains should appear dark against amber horizon glow. Trees scattered left and right.

- [ ] **Step 3: Fix any geometry issues based on screenshot**

If mountains are clipping or trees are floating, adjust `location` z-values or `depth` in the script and re-run the relevant object creation code.

---

## Task 3: Build Character, Crag, Sword, Flag

**Files:**
- Uses Blender MCP: `execute_blender_code`

- [ ] **Step 1: Build rocky crag and silhouette figure**

Execute via `mcp__blender__execute_blender_code`:

```python
import bpy
import bmesh

def get_mat(name):
    return bpy.data.materials.get(name) or bpy.data.materials['GroundMat']

dark = bpy.data.materials.get('GroundMat')

# ── Rocky Crag ────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(size=2.0, location=(-0.5, 0.5, 1.8))
crag = bpy.context.active_object
crag.name = 'RockyCrag'
crag.scale = (1.1, 0.75, 2.0)
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(crag.data)
for v in bm.verts:
    if v.co.z > 0.2:
        v.co.x += v.co.z * 0.15 + v.co.y * 0.1
        v.co.z += abs(v.co.x) * 0.3
bmesh.update_edit_mesh(crag.data)
bpy.ops.object.mode_set(mode='OBJECT')
crag.data.materials.append(dark)

# ── Figure: torso ─────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_capsule_add(radius=0.22, depth=0.65,
    location=(-0.25, -0.4, 0.75))
torso = bpy.context.active_object
torso.name = 'Fig_Torso'
torso.rotation_euler = (0.45, 0, 0.08)
torso.data.materials.append(dark)

# ── Figure: head ──────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_uv_sphere_add(radius=0.17,
    location=(-0.10, -0.60, 1.38))
head = bpy.context.active_object
head.name = 'Fig_Head'
head.data.materials.append(dark)

# ── Figure: legs (stretched forward, seated) ──────────────────────────────
bpy.ops.mesh.primitive_capsule_add(radius=0.11, depth=1.1,
    location=(0.55, -1.05, 0.22))
lr = bpy.context.active_object
lr.name = 'Fig_LegR'
lr.rotation_euler = (1.25, 0.08, 0)
lr.data.materials.append(dark)

bpy.ops.mesh.primitive_capsule_add(radius=0.11, depth=1.0,
    location=(0.20, -1.10, 0.28))
ll = bpy.context.active_object
ll.name = 'Fig_LegL'
ll.rotation_euler = (1.30, -0.08, 0.08)
ll.data.materials.append(dark)

# ── Figure: cloak ─────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=2.0, location=(-0.3, -0.2, 0.9))
cloak = bpy.context.active_object
cloak.name = 'Cloak'
cloak.scale = (0.85, 1.5, 1)
cloak.rotation_euler = (0.35, 0, 0.12)
cloak.data.materials.append(dark)

# ── Sword ─────────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cube_add(size=1, location=(1.6, -1.6, 0.06))
sword = bpy.context.active_object
sword.name = 'Sword'
sword.scale = (0.035, 3.0, 0.007)
sword.rotation_euler = (0, 0, 0.14)
smat = bpy.data.materials.new('SwordMat')
smat.use_nodes = True
smat.node_tree.nodes.clear()
e = smat.node_tree.nodes.new('ShaderNodeEmission')
e.inputs['Color'].default_value = (0.22, 0.19, 0.14, 1)
e.inputs['Strength'].default_value = 1.5
o = smat.node_tree.nodes.new('ShaderNodeOutputMaterial')
smat.node_tree.links.new(e.outputs['Emission'], o.inputs['Surface'])
sword.data.materials.append(smat)

print("Character and props built OK")
```

- [ ] **Step 2: Build flag pole and flag mesh**

Execute via `mcp__blender__execute_blender_code`:

```python
import bpy

dark = bpy.data.materials.get('GroundMat')

# ── Flag Pole ─────────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_cylinder_add(radius=0.055, depth=4.0,
    location=(5.0, 8.0, 2.0))
pole = bpy.context.active_object
pole.name = 'FlagPole'
pole.data.materials.append(dark)

# ── Flag mesh (plane, subdivided — animated in Three.js via shader) ───────
bpy.ops.mesh.primitive_plane_add(size=1.0, location=(5.65, 8.0, 3.55))
flag = bpy.context.active_object
flag.name = 'Flag'
flag.scale = (1.5, 0.8, 1.0)
# Subdivide so Three.js shader has vertex density to work with
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.subdivide(number_cuts=15)
bpy.ops.object.mode_set(mode='OBJECT')
fmat = bpy.data.materials.new('FlagMat')
fmat.use_nodes = True
fmat.node_tree.nodes.clear()
e = fmat.node_tree.nodes.new('ShaderNodeEmission')
e.inputs['Color'].default_value = (0.10, 0.08, 0.05, 1)
e.inputs['Strength'].default_value = 0.9
o = fmat.node_tree.nodes.new('ShaderNodeOutputMaterial')
fmat.node_tree.links.new(e.outputs['Emission'], o.inputs['Surface'])
flag.data.materials.append(fmat)

print("Flag pole and flag mesh built OK")
```

- [ ] **Step 3: Position camera**

Execute via `mcp__blender__execute_blender_code`:

```python
import bpy

# Remove any existing cameras
for obj in list(bpy.data.objects):
    if obj.type == 'CAMERA':
        bpy.data.objects.remove(obj, do_unlink=True)

bpy.ops.object.camera_add(location=(-2.5, -7.5, 2.0))
cam = bpy.context.active_object
cam.name = 'HeroCamera'
cam.rotation_euler = (1.38, 0, -0.22)
cam.data.lens = 38
bpy.context.scene.camera = cam

# Set render resolution for preview
bpy.context.scene.render.resolution_x = 1920
bpy.context.scene.render.resolution_y = 1080

print("Camera set OK")
```

- [ ] **Step 4: Screenshot from camera angle**

Call `mcp__blender__get_viewport_screenshot`. Verify: figure is visible against the crag (left), flag pole is in mid-right distance, mountains on horizon.

- [ ] **Step 5: Adjust composition if needed**

If the figure is not well-framed or the scene feels empty, re-run camera or object placement code with adjusted coordinates. Aim for the composition matching the reference image: character lower-left, horizon line at mid-height, flag mid-right.

---

## Task 4: Export GLB

**Files:**
- Create: `public/models/hero_scene.glb`

- [ ] **Step 1: Export scene as GLB**

Execute via `mcp__blender__execute_blender_code`:

```python
import bpy
import os

out = '/Users/andreslandazabal/personal-website/public/models/hero_scene.glb'

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format='GLB',
    export_animations=False,
    export_cameras=False,
    export_lights=False,
    use_selection=False,
    export_apply=True,
    export_draco_mesh_compression_enable=False,
)

size = os.path.getsize(out)
print(f"Exported: {out} ({size/1024:.0f} KB)")
```

- [ ] **Step 2: Verify GLB file exists**

```bash
ls -lh /Users/andreslandazabal/personal-website/public/models/hero_scene.glb
```

Expected: file exists, size between 200 KB and 2 MB.

- [ ] **Step 3: Commit GLB**

```bash
git add public/models/hero_scene.glb
git commit -m "feat: add hero_scene.glb blender export"
```

---

## Task 5: HeroScene Three.js Component

**Files:**
- Create: `app/components/three/HeroScene.tsx`

- [ ] **Step 1: Create `HeroScene.tsx`**

```tsx
"use client";

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Preload } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

// ── Flag wave vertex shader ───────────────────────────────────────────────
const FLAG_VERT = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    // Wave amplitude grows from left (pinned) to right edge
    float pinWeight = smoothstep(0.0, 0.4, uv.x);
    float wave = sin(pos.x * 2.5 - uTime * 2.2) * 0.12
               + sin(pos.x * 4.0 - uTime * 3.1 + pos.y * 2.0) * 0.06;
    pos.z += wave * pinWeight;
    pos.y += wave * pinWeight * 0.3;
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

// ── Scene loader ──────────────────────────────────────────────────────────
function Scene() {
  const { scene } = useGLTF("/models/hero_scene.glb");
  const flagMatRef = useRef<THREE.ShaderMaterial | null>(null);

  useEffect(() => {
    // Find the Flag mesh and swap its material for the wave shader
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.name === "Flag") {
        const mat = new THREE.ShaderMaterial({
          uniforms: {
            uTime:  { value: 0 },
            uColor: { value: new THREE.Color(0.10, 0.08, 0.05) },
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

// ── Canvas export ─────────────────────────────────────────────────────────
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [-2.5, 2.0, 7.5], fov: 38 }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      dpr={[1, 2]}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#0a0806"]} />
      <fog attach="fog" args={["#0a0806", 18, 45]} />
      <Scene />
      <EffectComposer>
        <Bloom
          intensity={1.8}
          luminanceThreshold={0.05}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
      <Preload all />
    </Canvas>
  );
}

useGLTF.preload("/models/hero_scene.glb");
```

- [ ] **Step 2: Commit**

```bash
git add app/components/three/HeroScene.tsx
git commit -m "feat: HeroScene three.js component with flag wave shader"
```

---

## Task 6: Rewrite Hero Section

**Files:**
- Rewrite: `app/sections/Hero.tsx`

- [ ] **Step 1: Rewrite `Hero.tsx`**

```tsx
"use client";

import { useEffect, useRef, Suspense } from "react";
import dynamic from "next/dynamic";
import { gsap } from "@/lib/gsap";

const HeroScene = dynamic(
  () => import("@/app/components/three/HeroScene"),
  { ssr: false }
);

export default function Hero() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(textRef.current, { opacity: 0, y: 30 });
      gsap.to(textRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.4,
        delay: 0.5,
        ease: "power3.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-screen w-full items-end justify-center pb-20">
      {/* ── Full-bleed 3D background ──────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0a0806]" />}>
          <HeroScene />
        </Suspense>
      </div>

      {/* ── Text overlay — bottom center ─────────────────────────────── */}
      <div
        ref={textRef}
        className="pointer-events-none relative z-10 flex flex-col items-center text-center"
      >
        <span className="mb-4 font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-accent">
          AI Software Engineer
        </span>
        <h1 className="font-display font-bold leading-[1.05] tracking-[0.05em] text-foreground [font-size:clamp(2.8rem,7vw,6rem)]">
          Andres<br />Landazabal
        </h1>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Start dev server and verify hero renders**

```bash
npm run dev
```

Open `localhost:3000`. Confirm:
- Near-black background
- 3D scene visible (dark silhouette, mountains, flag)
- Name "Andres Landazabal" in Cinzel, gold eyebrow above it
- Flag mesh is animating (waving)
- Bloom glow on scene

- [ ] **Step 3: Commit**

```bash
git add app/sections/Hero.tsx
git commit -m "feat: elden ring hero section — HeroScene + Cinzel text overlay"
```

---

## Task 7: Update About Section Colors

**Files:**
- Modify: `app/sections/About.tsx`

- [ ] **Step 1: Read current About.tsx**

Open `app/sections/About.tsx` and identify any hardcoded color classes or light-theme references (e.g. `bg-background-alt`, `text-foreground`, `border-border`). These Tailwind tokens will automatically pick up the new dark values from `globals.css` — check only for any hardcoded hex values or explicit light-mode colors.

- [ ] **Step 2: Replace any hardcoded light colors**

If any explicit `#f7f5f2`, `#141414`, or similar light-theme hex values exist as inline styles or class strings, replace them with the equivalent token:
- `#f7f5f2` → `bg-background`
- `#141414` → `text-foreground` (now `#e8dcc8`)
- `#5046e5` accent references → `text-accent` or `bg-accent` (now `#c9a84c`)

- [ ] **Step 3: Verify About section renders dark**

Scroll down past the hero on `localhost:3000`. Confirm About section shows dark background with warm gold accent.

- [ ] **Step 4: Commit**

```bash
git add app/sections/About.tsx
git commit -m "fix: about section — apply elden ring dark color tokens"
```

---

## Self-Review

**Spec coverage:**
- ✅ Color tokens replaced (Task 1)
- ✅ Cinzel typography (Task 1)
- ✅ Blender scene — crag, figure, sword, trees, mountains, castle, flag (Tasks 2-3)
- ✅ Camera angle (Task 3)
- ✅ GLB export (Task 4)
- ✅ HeroScene with flag wave animation (Task 5)
- ✅ Hero.tsx rewrite with text overlay (Task 6)
- ✅ About.tsx color updates (Task 7)

**Note on flag animation:** Cloth sim via Blender does not export cleanly to GLB as vertex animation. Flag wave is handled by a Three.js vertex shader instead — same visual result, more performant and reliable.
