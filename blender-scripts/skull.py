"""
Creates a stylised silver skull and exports it as skull.glb to public/models/.

HOW TO RUN:
  1. Open Blender
  2. Switch to the "Scripting" workspace (top bar)
  3. Click "Open" and load this file, OR paste the contents into the editor
  4. Click "Run Script" (or press Alt+P)
  5. Check that public/models/skull.glb was created
"""

import bpy
import os
import math

# ── output path ───────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR  = os.path.join(SCRIPT_DIR, "..", "public", "models")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "skull.glb")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── helpers ───────────────────────────────────────────────────────────────────
def deselect_all():
    bpy.ops.object.select_all(action="DESELECT")

def set_active(obj):
    deselect_all()
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj

def apply_bool(target, cutter, operation="DIFFERENCE"):
    """Apply a boolean modifier from *cutter* onto *target*, then delete cutter."""
    set_active(target)
    mod = target.modifiers.new(name="Bool_tmp", type="BOOLEAN")
    mod.operation  = operation
    mod.object     = cutter
    mod.solver     = "FAST"
    bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.data.objects.remove(cutter, do_unlink=True)

def add_sphere(name, radius, location, scale=(1, 1, 1), segments=32, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radius, segments=segments, ring_count=rings, location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    return obj

def add_box(name, size, location, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_cube_add(size=size, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    bpy.ops.object.transform_apply(scale=True)
    return obj

# ── clear default scene ───────────────────────────────────────────────────────
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

# ─────────────────────────────────────────────────────────────────────────────
# CRANIUM
# Skull faces -Y. Cranium is a slightly flattened sphere shifted upward.
# ─────────────────────────────────────────────────────────────────────────────
cranium = add_sphere(
    "Skull", radius=1.0,
    location=(0, 0, 0.18),
    scale=(1.05, 0.9, 1.0),
    segments=64, rings=32,
)

# ── temporal depressions (side hollows) ──────────────────────────────────────
for sx in (-1, 1):
    cutter = add_sphere(
        "TempCut", radius=0.55,
        location=(sx * 1.08, 0.1, 0.25),
        scale=(0.6, 0.9, 0.7),
    )
    apply_bool(cranium, cutter)

# ── eye sockets ───────────────────────────────────────────────────────────────
for sx in (-1, 1):
    cutter = add_sphere(
        "EyeCut", radius=0.24,
        location=(sx * 0.31, -0.84, 0.1),
        scale=(1.05, 0.65, 0.9),
    )
    apply_bool(cranium, cutter)

# ── nasal cavity ──────────────────────────────────────────────────────────────
nose = add_sphere(
    "NoseCut", radius=0.14,
    location=(0, -0.91, -0.1),
    scale=(0.65, 0.55, 1.1),
)
apply_bool(cranium, nose)

# ── foramen magnum (opening at base) ─────────────────────────────────────────
foramen = add_sphere(
    "ForamenCut", radius=0.28,
    location=(0, 0.35, -0.85),
    scale=(1.0, 0.75, 0.6),
)
apply_bool(cranium, foramen)

# ─────────────────────────────────────────────────────────────────────────────
# JAW
# A flattened sphere, top half cut off, with a hollow cheek depression.
# ─────────────────────────────────────────────────────────────────────────────
jaw = add_sphere(
    "Jaw", radius=0.68,
    location=(0, -0.08, -0.75),
    scale=(0.98, 0.72, 0.52),
    segments=32, rings=16,
)

# remove the top half so it sits under the cranium
top_cutter = add_box("JawTopCut", size=3.0, location=(0, 0, -0.42))
apply_bool(jaw, top_cutter)

# hollow cheek depression on front
cheek = add_sphere(
    "CheekCut", radius=0.28,
    location=(0, -0.64, -0.72),
    scale=(1.6, 0.45, 0.7),
)
apply_bool(jaw, cheek)

# ─────────────────────────────────────────────────────────────────────────────
# UPPER TEETH  (arc of 5 boxes along cranium base)
# ─────────────────────────────────────────────────────────────────────────────
upper_teeth = []
n_teeth = 5
for i in range(n_teeth):
    t = (i / (n_teeth - 1)) - 0.5          # -0.5 … +0.5
    angle = t * math.radians(42)
    x = math.sin(angle) * 0.31
    y = -math.cos(angle) * 0.91
    tooth = add_box(
        f"UTooth_{i}", size=1.0,
        location=(x, y, -0.275),
        scale=(0.068, 0.058, 0.098),
    )
    upper_teeth.append(tooth)

# ─────────────────────────────────────────────────────────────────────────────
# LOWER TEETH  (arc of 5 boxes along jaw top)
# ─────────────────────────────────────────────────────────────────────────────
lower_teeth = []
for i in range(n_teeth):
    t = (i / (n_teeth - 1)) - 0.5
    angle = t * math.radians(38)
    x = math.sin(angle) * 0.28
    y = -math.cos(angle) * 0.86
    tooth = add_box(
        f"LTooth_{i}", size=1.0,
        location=(x, y, -0.44),
        scale=(0.065, 0.055, 0.088),
    )
    lower_teeth.append(tooth)

# ─────────────────────────────────────────────────────────────────────────────
# JOIN everything into one mesh
# ─────────────────────────────────────────────────────────────────────────────
all_parts = [cranium, jaw] + upper_teeth + lower_teeth
deselect_all()
for obj in all_parts:
    obj.select_set(True)
bpy.context.view_layer.objects.active = cranium
bpy.ops.object.join()
skull = bpy.context.active_object
skull.name = "Skull"

# ─────────────────────────────────────────────────────────────────────────────
# SILVER MATERIAL  — fully metallic, low-to-mid roughness, cool grey tint
# ─────────────────────────────────────────────────────────────────────────────
mat = bpy.data.materials.new(name="Silver")
mat.use_nodes = True
nodes = mat.node_tree.nodes
bsdf = nodes["Principled BSDF"]

bsdf.inputs["Base Color"].default_value = (0.80, 0.80, 0.83, 1.0)   # cool silver
bsdf.inputs["Metallic"].default_value   = 1.0
bsdf.inputs["Roughness"].default_value  = 0.22

# Blender 4.x renamed "Specular" → "Specular IOR Level"; handle both
for key in ("Specular IOR Level", "Specular"):
    if key in bsdf.inputs:
        bsdf.inputs[key].default_value = 1.0
        break

skull.data.materials.clear()
skull.data.materials.append(mat)

# ── smooth shading ────────────────────────────────────────────────────────────
set_active(skull)
bpy.ops.object.shade_smooth()

# add edge-split modifier to preserve sharp teeth edges
es = skull.modifiers.new(name="EdgeSplit", type="EDGE_SPLIT")
es.split_angle = math.radians(38)

# ── export as GLB ──────────────────────────────────────────────────────────────
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_PATH,
    export_format="GLB",
    use_selection=False,
    export_materials="EXPORT",
)

print(f"Silver skull exported -> {OUTPUT_PATH}")
