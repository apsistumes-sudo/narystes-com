import subprocess
import shutil
import sys
from pathlib import Path
from rembg import new_session, remove

SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("lambo.mp4")
SLUG = SRC.stem

FRAMES_RAW  = Path(f"tmp/{SLUG}_frames_raw")
FRAMES_RGBA = Path(f"tmp/{SLUG}_frames_rgba")
OUT_WEBM    = Path(f"public/{SLUG}_alpha.webm")

try:
    for d in (FRAMES_RAW, FRAMES_RGBA):
        d.mkdir(parents=True, exist_ok=True)

    print(f"[1/3] Extracting frames from {SRC} …")
    subprocess.run([
        "ffmpeg", "-y", "-i", str(SRC),
        "-vf", "scale=960:540",
        f"{FRAMES_RAW}/f_%04d.png"
    ], check=True, capture_output=True)

    frames = sorted(FRAMES_RAW.glob("*.png"))
    print(f"[2/3] Removing background from {len(frames)} frames …")
    session = new_session("isnet-general-use")
    for i, f in enumerate(frames, 1):
        out = FRAMES_RGBA / f.name
        out.write_bytes(remove(f.read_bytes(), session=session))
        if i % 10 == 0:
            print(f"  {i}/{len(frames)}")

    print("[3/3] Encoding WebM VP9 with alpha …")
    subprocess.run([
        "ffmpeg", "-y", "-framerate", "24",
        "-i", f"{FRAMES_RGBA}/f_%04d.png",
        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p",
        "-b:v", "2M", "-auto-alt-ref", "0",
        str(OUT_WEBM)
    ], check=True, capture_output=True)
    print(f"  WebM: {OUT_WEBM} ({OUT_WEBM.stat().st_size // 1024}KB)")

finally:
    shutil.rmtree("tmp", ignore_errors=True)

print(f"\nDone! -> {OUT_WEBM}")
print("Note: Safari 16+ supports VP9 WebM, so .mov fallback is not needed.")
