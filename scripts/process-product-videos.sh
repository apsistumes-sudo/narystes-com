#!/usr/bin/env bash
set -euo pipefail

mkdir -p public/products

# === MOBILE versions (vertical 9:16) ===

if [ -f bugatis_2page.mp4 ]; then
  ffmpeg -y -i bugatis_2page.mp4 \
    -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
    -an -movflags +faststart \
    -vf "scale=1080:1920:flags=lanczos" \
    public/products/divo_mobile.mp4
fi

if [ -f urus_2page.mp4 ]; then
  ffmpeg -y -i urus_2page.mp4 \
    -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
    -an -movflags +faststart \
    -vf "scale=1080:1920:flags=lanczos" \
    public/products/urus_mobile.mp4
fi

if [ -f lambo_2page.mp4 ]; then
  ffmpeg -y -i lambo_2page.mp4 \
    -vf "crop=950:1920:130:0,scale=1080:1920:flags=lanczos" \
    -c:v libx264 -preset slow -crf 21 -maxrate 5M -bufsize 10M \
    -an -movflags +faststart \
    public/products/aventador_mobile.mp4
fi

# === DESKTOP versions (horizontal 16:9) ===

# Bugatti desktop — no crop, natural framing
if [ -f bugati_web.mp4 ]; then
  ffmpeg -y -i bugati_web.mp4 \
    -vf "scale=1920:1080:flags=lanczos" \
    -c:v libx264 -preset slow -crf 20 -maxrate 6M -bufsize 12M \
    -an -movflags +faststart \
    public/products/divo.mp4
fi

# Urus desktop — no crop needed
if [ -f urus_web.mp4 ]; then
  ffmpeg -y -i urus_web.mp4 \
    -vf "scale=1920:1080:flags=lanczos" \
    -c:v libx264 -preset slow -crf 20 -maxrate 6M -bufsize 12M \
    -an -movflags +faststart \
    public/products/urus.mp4
fi

# Aventador desktop — no crop needed
if [ -f lambo_web.mp4 ]; then
  ffmpeg -y -i lambo_web.mp4 \
    -vf "scale=1920:1080:flags=lanczos" \
    -c:v libx264 -preset slow -crf 20 -maxrate 6M -bufsize 12M \
    -an -movflags +faststart \
    public/products/aventador.mp4
fi

# === POSTERS (last frame of each desktop video) ===

for slug in divo urus aventador; do
  if [ -f "public/products/${slug}.mp4" ]; then
    ffmpeg -y -sseof -0.1 -i "public/products/${slug}.mp4" \
      -vframes 1 -q:v 2 "public/products/${slug}_poster.jpg"
  fi
done

echo ""
echo "=== Generated files ==="
ls -lh public/products/
