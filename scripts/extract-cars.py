#!/usr/bin/env python3
"""Extract three cars cleanly. Tighter crops + connected-component filtering."""
from pathlib import Path
from rembg import new_session, remove
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import sys

SOURCE = Path("public/web_hero_poster.jpg")
if not SOURCE.exists():
    print(f"ERROR: {SOURCE} not found", file=sys.stderr)
    sys.exit(1)

OUT_DIR = Path("public/cars")
OUT_DIR.mkdir(exist_ok=True, parents=True)

print("Loading birefnet-general model...")
session = new_session("birefnet-general")

img = Image.open(SOURCE).convert("RGB")
w, h = img.size
print(f"Source: {w}x{h}")

# TIGHT crops — no overlap. Each crop contains ONLY one car.
# Format: (left, top, right, bottom) as fractions of width/height
regions = {
    "divo":      (0.00, 0.30, 0.36, 1.00),  # Bugatti — left third
    "urus":      (0.36, 0.25, 0.64, 1.00),  # Urus — middle third (narrower)
    "aventador": (0.64, 0.30, 1.00, 1.00),  # Aventador — right third
}

def keep_largest_blob(rgba_img: Image.Image) -> Image.Image:
    """Keep only the largest connected blob in the alpha channel.
    Removes stray fragments of neighboring cars."""
    arr = np.array(rgba_img)
    alpha = arr[:, :, 3]
    mask = alpha > 30  # threshold for "visible"

    from collections import deque
    labels = np.zeros_like(mask, dtype=np.int32)
    current_label = 0
    blob_sizes = {}

    H, W = mask.shape
    for y in range(H):
        for x in range(W):
            if mask[y, x] and labels[y, x] == 0:
                current_label += 1
                size = 0
                q = deque([(y, x)])
                while q:
                    cy, cx = q.popleft()
                    if cy < 0 or cy >= H or cx < 0 or cx >= W:
                        continue
                    if not mask[cy, cx] or labels[cy, cx] != 0:
                        continue
                    labels[cy, cx] = current_label
                    size += 1
                    q.extend([(cy+1, cx), (cy-1, cx), (cy, cx+1), (cy, cx-1)])
                blob_sizes[current_label] = size

    if not blob_sizes:
        return rgba_img

    largest_label = max(blob_sizes, key=blob_sizes.get)
    largest_size = blob_sizes[largest_label]
    total_visible = sum(blob_sizes.values())
    print(f"    {len(blob_sizes)} blob(s) found, largest = {largest_size/total_visible:.0%} of visible pixels")

    # Zero out alpha for any pixel not in the largest blob
    keep_mask = labels == largest_label
    arr[:, :, 3] = np.where(keep_mask, alpha, 0)
    return Image.fromarray(arr)

for car_id, (l, t, r, b) in regions.items():
    print(f"\n=== {car_id} ===")
    box = (int(w * l), int(h * t), int(w * r), int(h * b))
    crop = img.crop(box)
    print(f"  Crop: {crop.size}")

    tmp = OUT_DIR / f"_tmp_{car_id}.jpg"
    crop.save(tmp, quality=95)

    with open(tmp, "rb") as f:
        output_bytes = remove(f.read(), session=session)

    raw = OUT_DIR / f"_raw_{car_id}.png"
    with open(raw, "wb") as f:
        f.write(output_bytes)

    rgba = Image.open(raw).convert("RGBA")
    cleaned = keep_largest_blob(rgba)

    out_path = OUT_DIR / f"{car_id}.png"
    cleaned.save(out_path, optimize=True)

    tmp.unlink()
    raw.unlink()

    final_alpha = np.array(cleaned)[:, :, 3]
    coverage = (final_alpha > 50).sum() / final_alpha.size
    print(f"  Final coverage: {coverage:.1%}")
    if coverage < 0.05:
        print(f"  WARN: too transparent -- extraction likely failed")
    elif coverage > 0.70:
        print(f"  WARN: too opaque -- background not removed properly")
    else:
        print(f"  OK: {out_path}")

# Clean parking background
print("\n=== parking_clean.jpg ===")
base = Image.open(SOURCE).convert("RGB")
top = base.crop((0, 0, w, int(h * 0.40)))
bottom = base.crop((0, int(h * 0.40), w, h)).filter(ImageFilter.GaussianBlur(50))
bottom = ImageEnhance.Brightness(bottom).enhance(0.55)
clean = Image.new("RGB", (w, h))
clean.paste(top, (0, 0))
clean.paste(bottom, (0, int(h * 0.40)))
clean.save("public/parking_clean.jpg", quality=92)
print(f"OK: public/parking_clean.jpg")

print("\nDone. Verify each PNG contains only ONE car.")
