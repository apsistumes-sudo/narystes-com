#!/usr/bin/env bash
set -euo pipefail

mkdir -p public/products

# Bugatti — clean already, just transcode for web (mobile 9:16)
ffmpeg -y -i bugatis_2page.mp4 \
  -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
  -an -movflags +faststart \
  -vf "scale=1080:1920:flags=lanczos" \
  public/products/divo_mobile.mp4

# Urus — clean already, just transcode for web (mobile 9:16)
ffmpeg -y -i urus_2page.mp4 \
  -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
  -an -movflags +faststart \
  -vf "scale=1080:1920:flags=lanczos" \
  public/products/urus_mobile.mp4

# Aventador — crop left ~12% to remove Urus fragment, then re-pad to 1080x1920 (mobile 9:16)
ffmpeg -y -i lambo_2page.mp4 \
  -vf "crop=950:1920:130:0,scale=1080:1920:flags=lanczos" \
  -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
  -an -movflags +faststart \
  public/products/aventador_mobile.mp4

# When 16:9 desktop source videos are available, add them here as:
#   public/products/divo.mp4
#   public/products/urus.mp4
#   public/products/aventador.mp4

# Generate poster JPG (last frame) for each — used as <video poster=...> fallback
for slug in divo urus aventador; do
  ffmpeg -y -sseof -0.1 -i "public/products/${slug}_mobile.mp4" \
    -vframes 1 -q:v 2 "public/products/${slug}_poster.jpg"
done

ls -lh public/products/
