"""
Pipeline test — creates a simple sphere and exports it as test_sphere.glb
to public/models/. Run this in Blender's Scripting workspace to verify
the full Blender → website pipeline works.

HOW TO RUN:
  1. Open Blender
  2. Switch to the "Scripting" workspace (top bar)
  3. Click "Open" and load this file, OR paste the contents into the editor
  4. Click "Run Script" (or press Alt+P)
  5. Check that public/models/test_sphere.glb was created
"""

import bpy
import os

# ── absolute path to public/models/ ──────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "..", "public", "models")
OUTPUT_PATH = os.path.join(OUTPUT_DIR, "test_sphere.glb")

# ── clear default scene ───────────────────────────────────────────────────────
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()

# ── create a UV sphere ────────────────────────────────────────────────────────
bpy.ops.mesh.primitive_uv_sphere_add(radius=1.0, location=(0, 0, 0))
sphere = bpy.context.active_object
sphere.name = "TestSphere"

# ── simple material ───────────────────────────────────────────────────────────
mat = bpy.data.materials.new(name="SphereMat")
bsdf = mat.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.8, 0.5, 0.2, 1.0)  # orange-ish
bsdf.inputs["Roughness"].default_value = 0.4
sphere.data.materials.append(mat)

# ── export as GLB ─────────────────────────────────────────────────────────────
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_PATH,
    export_format="GLB",
    use_selection=False,
    export_materials="EXPORT",
)

print(f"✓ Exported to: {OUTPUT_PATH}")
