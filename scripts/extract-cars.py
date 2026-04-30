#!/usr/bin/env python3
"""Extract three cars from the hero poster as separate transparent PNGs.

Uses birefnet-general for best edge quality. Validates each output.
"""
from pathlib import Path
from rembg import new_session, remove
from PIL import Image, ImageFilter, ImageEnhance
import sys

SOURCE = Path("public/web_hero_poster.jpg")
if not SOURCE.exists():
    print(f"ERROR: {SOURCE} not found.", file=sys.stderr)
    sys.exit(1)

OUT_DIR = Path("public/cars")
OUT_DIR.mkdir(exist_ok=True, parents=True)

# birefnet-general gives much sharper edges than u2net or isnet
print("Loading birefnet-general model (first run downloads ~400MB)...")
session = new_session("birefnet-general")

img = Image.open(SOURCE).convert("RGB")
w, h = img.size
print(f"Source poster: {w}x{h}")

# Generous overlapping crop regions
regions = {
    "divo":      (0,             int(h * 0.20), int(w * 0.45), h),
    "urus":      (int(w * 0.25), int(h * 0.20), int(w * 0.75), h),
    "aventador": (int(w * 0.55), int(h * 0.20), w,             h),
}

for car_id, box in regions.items():
    print(f"\n=== Processing {car_id} ===")
    crop = img.crop(box)
    cw, ch = crop.size
    print(f"  Crop size: {cw}x{ch}")

    tmp = OUT_DIR / f"_tmp_{car_id}.jpg"
    crop.save(tmp, quality=95)

    with open(tmp, "rb") as f:
        output_bytes = remove(f.read(), session=session)

    out_path = OUT_DIR / f"{car_id}.png"
    with open(out_path, "wb") as f:
        f.write(output_bytes)
    tmp.unlink()

    result = Image.open(out_path)
    if result.mode != "RGBA":
        print(f"  WARN: {car_id}.png is not RGBA")
    alpha = result.getchannel("A")
    non_transparent_pixels = sum(1 for p in alpha.getdata() if p > 50)
    total = alpha.width * alpha.height
    coverage = non_transparent_pixels / total
    print(f"  Coverage: {coverage:.1%} of pixels are visible (car silhouette)")
    if coverage < 0.05:
        print(f"  ERROR: {car_id}.png is mostly transparent -- extraction failed")
    elif coverage > 0.80:
        print(f"  ERROR: {car_id}.png is mostly opaque -- background removal failed")
    else:
        print(f"  OK: {out_path}")

# Generate clean parking-lot background
print("\n=== Generating clean parking background ===")
base = Image.open(SOURCE).convert("RGB")
top = base.crop((0, 0, w, int(h * 0.40)))
bottom = base.crop((0, int(h * 0.40), w, h)).filter(ImageFilter.GaussianBlur(50))
bottom = ImageEnhance.Brightness(bottom).enhance(0.55)

clean = Image.new("RGB", (w, h))
clean.paste(top, (0, 0))
clean.paste(bottom, (0, int(h * 0.40)))
clean.save("public/parking_clean.jpg", quality=92)
print(f"OK: public/parking_clean.jpg ({w}x{h})")

print("\nDone. Inspect public/cars/*.png to verify quality.")
