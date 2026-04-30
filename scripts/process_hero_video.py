"""
Process web.mp4 → web_hero.mp4 + web_hero_poster.jpg

Usage:
  python scripts/process_hero_video.py [stop_point] [speed]

  stop_point  — second where cars stop (default: 5.0)
  speed       — approach speedup multiplier (default: 2.0)

Examples:
  python scripts/process_hero_video.py          # 5s stop point, 2x speed
  python scripts/process_hero_video.py 4.5 1.5  # 4.5s stop, 1.5x speed
"""
import subprocess
import sys

SRC   = "public/web.mp4"
OUT   = "public/web_hero.mp4"
POSTER = "public/web_hero_poster.jpg"

stop  = float(sys.argv[1]) if len(sys.argv) > 1 else 5.0
speed = float(sys.argv[2]) if len(sys.argv) > 2 else 2.0

print(f"Source:      {SRC}")
print(f"Stop point:  {stop}s")
print(f"Speed:       {speed}x")

# Probe duration
result = subprocess.run(
    ["ffprobe", "-v", "error", "-show_entries", "format=duration",
     "-of", "default=noprint_wrappers=1:nokey=1", SRC],
    capture_output=True, text=True
)
duration = float(result.stdout.strip())
print(f"Duration:    {duration:.2f}s")
print(f"Output:      ~{stop/speed + (duration - stop):.2f}s total\n")

# Process: speed up approach, keep stop at normal speed
subprocess.run([
    "ffmpeg", "-y", "-i", SRC,
    "-filter_complex",
    f"[0:v]trim=start=0:end={stop},setpts=PTS/{speed}[approach];"
    f"[0:v]trim=start={stop},setpts=PTS-STARTPTS[hold];"
    f"[approach][hold]concat=n=2:v=1:a=0[outv]",
    "-map", "[outv]",
    "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", "22",
    "-movflags", "+faststart",
    OUT
], check=True)

print(f"\nVideo: {OUT}")

# Poster = last frame
subprocess.run([
    "ffmpeg", "-y", "-sseof", "-0.1", "-i", OUT,
    "-vframes", "1", "-q:v", "2",
    POSTER
], check=True)

print(f"Poster: {POSTER}")
print("\nDone! Update STOP_TIME in components/HeroParking.tsx to match the new stop point.")
print(f"Suggested STOP_TIME = {stop/speed:.1f}")
