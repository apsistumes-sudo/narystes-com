#!/usr/bin/env python3
"""Prepare car images from user-provided source files.

- masina1.jpeg → public/cars/aventador.png (just convert format)
- masina.jpeg  → split into two:
    - public/cars/divo.png (left half, Bugatti)
    - public/cars/urus.png (right half, Urus)
"""
from pathlib import Path
from PIL import Image
import sys

ROOT = Path(".")
OUT = Path("public/cars")
OUT.mkdir(exist_ok=True, parents=True)

# === Aventador: just convert masina1.jpeg to PNG ===
aventador_src = ROOT / "masina1.jpeg"
if not aventador_src.exists():
    print(f"ERROR: {aventador_src} not found", file=sys.stderr)
    sys.exit(1)

img = Image.open(aventador_src).convert("RGBA")
w0, h0 = img.size
print(f"Source aventador: {w0}x{h0}")
data = img.getdata()
new_data = []
for px in data:
    r, g, b, a = px
    if r > 240 and g > 240 and b > 240:
        new_data.append((255, 255, 255, 0))
    else:
        new_data.append(px)
img.putdata(new_data)
img.save(OUT / "aventador.png", optimize=True)
print(f"OK: public/cars/aventador.png ({img.size})")

# === Bugatti + Urus: split masina.jpeg ===
dual_src = ROOT / "masina.jpeg"
if not dual_src.exists():
    print(f"ERROR: {dual_src} not found", file=sys.stderr)
    sys.exit(1)

dual = Image.open(dual_src).convert("RGBA")
w, h = dual.size
print(f"Source dual image: {w}x{h}")

# Bugatti on left, Urus on right (slightly smaller, upper-right)
BUGATTI_BOX = (0,             0, int(w * 0.54), h)
URUS_BOX    = (int(w * 0.60), 0, w,             int(h * 0.78))

def white_to_transparent(im: Image.Image) -> Image.Image:
    im = im.convert("RGBA")
    data = im.getdata()
    out = []
    for r, g, b, a in data:
        if r > 240 and g > 240 and b > 240:
            out.append((255, 255, 255, 0))
        else:
            out.append((r, g, b, a))
    im.putdata(out)
    return im

bugatti = white_to_transparent(dual.crop(BUGATTI_BOX))
bugatti.save(OUT / "divo.png", optimize=True)
print(f"OK: public/cars/divo.png ({bugatti.size})")

urus = white_to_transparent(dual.crop(URUS_BOX))
urus.save(OUT / "urus.png", optimize=True)
print(f"OK: public/cars/urus.png ({urus.size})")

print("\nDone. Verify each PNG opens correctly and contains only one car.")
