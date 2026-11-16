#!/usr/bin/env bash
# Cut the finished film into chapter parts (< 14 MB each, 720p, two-pass) for the comment player (vorschau-player).
# Cuts sit 0.3 s before each chapter's first word (whole seconds), from audio/timing.json.  usage: preview_parts.sh <film.mp4> <out_dir> [part numbers]
set -euo pipefail
SRC=$1; DST=$2; mkdir -p "$DST"; A=${AV:-/mnt/project-files/scenario/film-05-share}
read -r -a CUTS <<< "$(python3 - "$A/audio/timing.json" "$SRC" <<'PY'
import json, sys, subprocess, math
T = json.load(open(sys.argv[1])); segs = T['sections']
starts = ['H0a', '00a', '01a', '02a', '02b', '02c', '03a', '04a', '05a', '06a', '07a']
st = lambda k: segs[k]['start']
dur = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', sys.argv[2]]))
cuts = [0] + [math.floor(st(k) - .3) for k in starts[1:]] + [round(dur, 3)]
print(' '.join(map(str, cuts)))
PY
)"
N=$(( ${#CUTS[@]} - 1 ))
for i in ${3:-$(seq 0 $((N-1)))}; do
  a=${CUTS[$i]}; b=${CUTS[$((i+1))]}; n=$(printf %02d "$i")
  d=$(python3 -c "print($b-$a)"); kb=$(python3 -c "print(min(4000, int(13.2*8192/($b-$a))-96))")
  ffmpeg -v error -y -ss "$a" -t "$d" -i "$SRC" -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -pass 1 -passlogfile "$DST/pl$n" -an -f mp4 /dev/null
  ffmpeg -v error -y -ss "$a" -t "$d" -i "$SRC" -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -pass 2 -passlogfile "$DST/pl$n" -c:a aac -b:a 96k -movflags +faststart "$DST/part$n.mp4"
  ffmpeg -v error -y -ss "$(python3 -c "print($a+2.5)")" -i "$SRC" -frames:v 1 -vf scale=1280:720 -q:v 4 "$DST/part$n.jpg"
  echo "part $n  $a–$b s  $(du -h "$DST/part$n.mp4" | cut -f1)"
done
rm -f "$DST"/pl*
echo "cuts: ${CUTS[*]}"
