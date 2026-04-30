#!/usr/bin/env python3
"""Extract three cars from the hero poster as separate transparent PNGs."""
from pathlib import Path
from rembg import new_session, remove
from PIL import Image, ImageFilter, ImageEnhance

SOURCE = Path("public/web_hero_poster.jpg")
OUT_DIR = Path("public/cars")
OUT_DIR.mkdir(exist_ok=True)

session = new_session("isnet-general-use")

img = Image.open(SOURCE)
w, h = img.size
print(f"Source: {w}x{h}")

regions = {
    "divo":      (0,             int(h * 0.30), int(w * 0.40), h),
    "urus":      (int(w * 0.28), int(h * 0.25), int(w * 0.72), h),
    "aventador": (int(w * 0.60), int(h * 0.30), w,             h),
}

for car_id, box in regions.items():
    crop = img.crop(box)
    crop_path = OUT_DIR / f"_crop_{car_id}.jpg"
    crop.save(crop_path)
    with open(crop_path, "rb") as f:
        input_bytes = f.read()
    output_bytes = remove(input_bytes, session=session)
    out_path = OUT_DIR / f"{car_id}.png"
    with open(out_path, "wb") as f:
        f.write(output_bytes)
    crop_path.unlink()
    print(f"  OK {out_path}")

# Generate clean parking background
base = Image.open(SOURCE)
w, h = base.size
top = base.crop((0, 0, w, int(h * 0.45)))
bottom = base.crop((0, int(h * 0.45), w, h)).filter(ImageFilter.GaussianBlur(40))
bottom = ImageEnhance.Brightness(bottom).enhance(0.7)
clean = Image.new("RGB", (w, h))
clean.paste(top, (0, 0))
clean.paste(bottom, (0, int(h * 0.45)))
clean.save("public/parking_clean.jpg", quality=92)
print("OK public/parking_clean.jpg")

print("Done.")
