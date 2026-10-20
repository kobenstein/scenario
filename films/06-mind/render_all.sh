#!/usr/bin/env bash
# Full render: N parallel chunks -> concat -> mux mix.wav -> burn subtitles.  usage: render_all.sh <out_dir> [chunks]
set -euo pipefail
cd "$(dirname "$0")"
OUT=${1:?out dir}; N=${2:-4}; A=${AV:-/tmp/claude-0/-home-user-scenario/7d9687bd-7149-579e-92ec-09522995c0c5/scratchpad/film6}; FILM=${FILM:-./film.mjs}; export FILM
mkdir -p "$OUT/parts"
DUR=$(node -e "import('$FILM').then(async m=>console.log((await m.build()).duration))")
for i in $(seq 0 $((N-1))); do
  F=$(python3 -c "print(round($DUR*$i/$N*30)/30)"); T=$(python3 -c "print(round($DUR*($i+1)/$N*30)/30)")
  node render.mjs --out "$OUT/parts/p$i.mp4" --from $F --to $T --crf 14 --preset veryfast > "$OUT/parts/p$i.log" 2>&1 &
done
wait
for i in $(seq 0 $((N-1))); do echo "file 'p$i.mp4'"; done > "$OUT/parts/list.txt"
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$OUT/parts/list.txt" -c copy "$OUT/parts/video.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$OUT/parts/video.mp4" -i "$A/audio/mix.wav" \
  -vf "ass=$A/subtitles.ass" -c:v libx264 -crf 19 -preset medium -tune grain -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 256k -shortest "$OUT/film05_share.mp4"
echo done
