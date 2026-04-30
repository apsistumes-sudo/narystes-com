#!/usr/bin/env python3
"""Prepare car images using rembg on manually-cleaned source files.

- masina1.jpeg -> public/cars/aventador.png
- masina.jpeg  -> split + rembg -> public/cars/divo.png + urus.png
"""
from pathlib import Path
from PIL import Image
from rembg import new_session, remove
import io
import sys

ROOT = Path(".")
OUT = Path("public/cars")
OUT.mkdir(exist_ok=True, parents=True)

aventador_src = ROOT / "masina1.jpeg"
dual_src = ROOT / "masina.jpeg"

if not aventador_src.exists():
    print(f"ERROR: {aventador_src} not found", file=sys.stderr)
    sys.exit(1)
if not dual_src.exists():
    print(f"ERROR: {dual_src} not found", file=sys.stderr)
    sys.exit(1)

print("Loading birefnet-general model (best edge quality)...")
session = new_session("birefnet-general")

def remove_bg(img: Image.Image) -> Image.Image:
    """Run rembg on a PIL image and return RGBA."""
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="PNG")
    out_bytes = remove(buf.getvalue(), session=session)
    return Image.open(io.BytesIO(out_bytes)).convert("RGBA")

# === Aventador ===
print("\n=== Aventador ===")
aventador_img = Image.open(aventador_src)
print(f"  Source: {aventador_img.size}")
result = remove_bg(aventador_img)
result.save(OUT / "aventador.png", optimize=True)
print(f"  OK: {OUT / 'aventador.png'} ({result.size})")

# === Bugatti + Urus split ===
dual_img = Image.open(dual_src)
w, h = dual_img.size
print(f"\nDual source: {w}x{h}")

# Tight non-overlapping crops verified to isolate one car each
BUGATTI_BOX = (0,             0, int(w * 0.54), h)
URUS_BOX    = (int(w * 0.60), 0, w,             int(h * 0.78))

print("\n=== Bugatti Divo ===")
bugatti_crop = dual_img.crop(BUGATTI_BOX)
print(f"  Crop: {bugatti_crop.size}")
result = remove_bg(bugatti_crop)
result.save(OUT / "divo.png", optimize=True)
print(f"  OK: {OUT / 'divo.png'} ({result.size})")

print("\n=== Urus ===")
urus_crop = dual_img.crop(URUS_BOX)
print(f"  Crop: {urus_crop.size}")
result = remove_bg(urus_crop)
result.save(OUT / "urus.png", optimize=True)
print(f"  OK: {OUT / 'urus.png'} ({result.size})")

print("\nDone. Each PNG should have clean transparent edges and no white halo.")
