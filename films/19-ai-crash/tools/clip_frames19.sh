#!/usr/bin/env bash
# Extract the clip frames for clipWindow (lib/f19_kit.mjs): 30 fps JPEGs of the used part (file_in → file_out from audio/clips.json)
# into films/19-ai-crash/clips/frames/<id>/f00001.jpg … (git-ignored). Run once per machine (and again when a clip is replaced):
#   bash tools/clip_frames19.sh [C1 C1b C3]
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT="${F19ROOT:-/mnt/project-files/scenario/film-ai-crash/}"
IDS="${*:-C1 C1b C3}"
for id in $IDS; do
  read -r fin fout < <(python3 -c "import json,sys;d=json.load(open('$ROOT/audio/clips.json'));c={k['id']:k for k in d['clips']}['$id'];print(c['file_in'],c['file_out'])")
  out="clips/frames/$id"; rm -rf "$out"; mkdir -p "$out"
  ffmpeg -hide_banner -loglevel error -y -ss "$fin" -to "$fout" -i "$ROOT/clips/$id.mp4" -vf "fps=30,scale=1280:-2" -q:v 3 "$out/f%05d.jpg"
  echo "$id: $(ls "$out" | wc -l) frames ($fin → $fout s)"
done
