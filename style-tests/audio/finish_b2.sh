#!/usr/bin/env bash
# B2 final: sound mix (mix_b2.py) + burned-in subtitles (subs_b2.py) -> B2-papier-diorama-mit-ton.mp4 (+ .srt)
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
DIR=/mnt/project-files/scenario/stil-tests
VIN="${1:-$DIR/B2-papier-diorama-motion.mp4}"
VOUT="${2:-$DIR/B2-papier-diorama-mit-ton.mp4}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

python3 "$HERE/subs_b2.py" "$HERE/george.words.json" "$DIR/B2-papier-diorama" 0.6
# Burn subtitles first (libass, x264 CRF 20), then mix + mux the audio onto that video stream.
ffmpeg -hide_banner -loglevel error -y -i "$VIN" -an \
  -vf "ass=$DIR/B2-papier-diorama.ass:fontsdir=$HERE/fonts" \
  -c:v libx264 -crf 20 -preset slow -pix_fmt yuv420p "$TMP/subbed.mp4"
python3 "$HERE/mix_b2.py" "$TMP/subbed.mp4" "$VOUT"
