#!/usr/bin/env bash
# Film 10 (from Film 11): render the whole film in parallel parts -> concat -> sound plan + mix -> burned subtitles + 2-pass final -> preview parts.
#   tools/finish_f10.sh <work_dir> [jobs=4] [stage: render|mix|final|preview|all]
# Parts are cut inside the chunk handoff plates (every frame is a pure function of t); each part builds only the chunks it needs (SECS).
set -euo pipefail
WD=${1:?work dir}; JOBS=${2:-1}; STAGE=${3:-all}
FILM=/home/user/scenario/films/10-robots; ROOT=${F10ROOT:-/tmp/claude-0/-home-user-scenario/8f7dada6-ac99-5c7e-b4ef-eebec3e810be/scratchpad/film10}; A=$ROOT/audio
mkdir -p "$WD/parts" "$WD/preview"
# burned subtitles, channel standard since 2026-10-21: ~72 px on 1080p, one line of max 34 characters (audio/subs.py)
STYLE="FontName=DejaVu Sans,FontSize=19,PrimaryColour=&H00E2EFF3,OutlineColour=&H80000000,BorderStyle=1,Outline=1.4,Shadow=0,MarginV=20"
cd "$FILM"
if [[ $STAGE == render || $STAGE == all ]]; then
  node --input-type=module -e "
    import { build } from './film.mjs'; import { HAND, handoff } from './lib/f10_core.mjs';
    const f = await build(); const T = f.T, R = f.ranges, ids = Object.keys(R);
    const cuts = [0, ...Object.keys(HAND).map((k) => { try { return handoff(T, k); } catch { return null; } }).filter((h) => h && isFinite(h.t) && (!process.env.TO || h.t < +process.env.TO)).map((h) => Math.round(h.t * 30) / 30), (+process.env.TO || T.duration)].sort((a, b) => a - b);
    const lines = [];
    for (let i = 0; i + 1 < cuts.length; i++) {
      const a = cuts[i], b = cuts[i + 1];
      const want = ids.filter((id) => R[id].a < b + 1 && R[id].b > a - 1);
      lines.push(a.toFixed(4) + ' ' + b.toFixed(4) + ' ' + want.join(','));
    }
    console.log(lines.join('\n'));" 2>/dev/null > "$WD/parts.txt"
  # the engine leaks memory per frame, so parts are split further into pieces of at most MAXLEN s (default 20; frames are pure functions of t)
  python3 - "$WD/parts.txt" "${MAXLEN:-20}" <<'PY'
import sys, math
p, m = sys.argv[1], float(sys.argv[2]); out = []
for l in open(p):
    a, b, secs = l.split(); a, b = float(a), float(b); n = max(1, math.ceil((b - a) / m - 1e-9))
    cs = [a + (b - a) * k / n for k in range(n + 1)]; cs = [round(c * 30) / 30 for c in cs]
    out += [f'{cs[k]:.4f} {cs[k + 1]:.4f} {secs}' for k in range(n)]
open(p, 'w').write('\n'.join(out) + '\n')
PY
  cat "$WD/parts.txt"
  render_part() { local n=$1 a=$2 b=$3 secs=$4
    [ -s "$WD/parts/p$n.mp4" ] && { echo "part $n exists"; return 0; }
    if SECS=$secs node --expose-gc render.mjs --out "$WD/parts/p$n.tmp.mp4" --from "$a" --to "$b" --crf 14 --preset fast > "$WD/parts/p$n.log" 2>&1; then
      mv "$WD/parts/p$n.tmp.mp4" "$WD/parts/p$n.mp4"; echo "part $n done $a-$b ($(tail -1 "$WD/parts/p$n.log"))"
    else echo "part $n FAILED (see $WD/parts/p$n.log)"; fi
  }
  i=0
  while read -r a b secs; do
    n=$(printf %02d $i); i=$((i+1))
    while [ "$(jobs -rp | wc -l)" -ge "$JOBS" ]; do wait -n || true; done
    # UNTIL=<s>: render only the pieces that end by then (pre-render finished chunks while later ones are still being built)
    if [ -n "${UNTIL:-}" ] && awk "BEGIN{exit !($b > ${UNTIL})}"; then continue; fi
    if [ -n "${FROM:-}" ] && awk "BEGIN{exit !($a < ${FROM})}"; then continue; fi
    render_part "$n" "$a" "$b" "$secs" &
  done < "$WD/parts.txt"
  wait
  [ -n "${UNTIL:-}${FROM:-}" ] && { echo "UNTIL/FROM set: stop after the pieces"; exit 0; }
  [ "$(ls "$WD"/parts/p??.mp4 | wc -l)" -eq "$(wc -l < "$WD/parts.txt")" ] || { echo "missing parts, stop"; exit 1; }
  ls "$WD"/parts/p??.mp4 | sort | sed "s|^|file '|; s|$|'|" > "$WD/parts/list.txt"
  ffmpeg -v error -y -f concat -safe 0 -i "$WD/parts/list.txt" -c copy "$WD/video.mp4"
  echo "video: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WD/video.mp4") s"
fi
if [[ $STAGE == mix || $STAGE == all ]]; then
  node tools/sound_plan_f10.mjs "$A/sound_plan.json"
  python3 audio/mix.py "$A"
  python3 audio/subs.py "$A" "$A"
fi
if [[ $STAGE == final || $STAGE == all ]]; then
  VF="subtitles=$A/subtitles.srt:force_style='$STYLE'"
  ffmpeg -v error -y -i "$WD/video.mp4" -i "$A/mix.wav" -vf "$VF" -c:v libx264 -preset slow -tune grain -b:v 4600k -maxrate 9000k -bufsize 12000k \
    -pass 1 -passlogfile "$WD/x264" -an -f mp4 /dev/null
  ffmpeg -v error -y -i "$WD/video.mp4" -i "$A/mix.wav" -vf "$VF" -c:v libx264 -preset slow -tune grain -b:v 4600k -maxrate 9000k -bufsize 12000k \
    -pass 2 -passlogfile "$WD/x264" -map 0:v -map 1:a -c:a aac -b:a 192k -shortest -movflags +faststart "$WD/final.mp4"
  rm -f "$WD"/x264*
  echo "final: $(du -h "$WD/final.mp4" | cut -f1)  $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WD/final.mp4") s"
fi
if [[ $STAGE == preview || $STAGE == all ]]; then
  # 720p player parts straight from the silent master + mix, subtitles burned per part (no need to wait for the 2-pass final)
  mapfile -t P < <(awk '{print $1" "$2}' "$WD/parts.txt")
  for i in "${!P[@]}"; do
    read -r a b <<< "${P[$i]}"; n=$(printf %02d "$i"); d=$(python3 -c "print($b-$a)")
    kb=$(python3 -c "print(min(4000, int(13.2*8192/($b-$a))-96))")
    ffmpeg -v error -y -ss "$a" -t "$d" -i "$WD/video.mp4" -ss "$a" -t "$d" -i "$A/mix.wav" \
      -vf "setpts=PTS+$a/TB,subtitles=$A/subtitles.srt:force_style='$STYLE',setpts=PTS-STARTPTS,scale=1280:720" \
      -map 0:v -map 1:a -c:v libx264 -preset medium -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -c:a aac -b:a 96k -movflags +faststart "$WD/preview/part$n.mp4"
    ffmpeg -v error -y -ss "$(python3 -c "print($a+1.5)")" -i "$WD/video.mp4" -frames:v 1 -vf scale=1280:720 -q:v 4 "$WD/preview/part$n.jpg"
    echo "preview $n  $a–$b s  $(du -h "$WD/preview/part$n.mp4" | cut -f1)"
  done
fi
