#!/usr/bin/env bash
# Film 23: render the whole film in pieces (<= 20 s, split inside chunks on whole frames) -> check frame counts -> join (silent master)
# -> final 1080p H.264 with the mix and burned subtitles -> 720p preview.
#   tools/finish23.sh <work_dir> [jobs=3] [stage: render|final|preview|all]
#   delete parts/pNN.mp4 to re-render only those pieces (existing pieces are kept).
#   CLIP_MODE=quote|footage|auto is passed through to the renderer (lib/f23_hud.mjs, the old screen).
set -euo pipefail
WD=${1:?work dir}; JOBS=${2:-3}; STAGE=${3:-all}
FILM=$(cd "$(dirname "$0")/.." && pwd); ROOT=${F23ROOT:-/mnt/project-files/scenario/film-erster-tag/2037/}
# quote mode: MIX=$ROOT/audio/mix-quote.m4a ASS=$ROOT/audio/untertitel/subtitles-quote.ass (the card is the text: no clip cues)
MIX=${MIX:-$ROOT/audio/mix.m4a}; ASS=${ASS:-$ROOT/audio/untertitel/subtitles.ass}
mkdir -p "$WD/parts"
cd "$FILM"
if [[ $STAGE == render || $STAGE == all ]]; then
  # pieces: chunk by chunk, each cut into equal whole-frame pieces of at most 600 frames; SECS = every chunk within 1 s of the piece
  node --input-type=module -e "
    import { build } from './film.mjs';
    const f = await build(), R = f.ranges, fps = 30, N = Math.round(f.duration * fps), ids = Object.keys(R), out = [];
    const bf = ids.map((id, i) => i ? Math.ceil(R[id].a * fps - 1e-6) : 0); bf.push(N);
    for (let i = 0; i < ids.length; i++) {
      const a = bf[i], b = bf[i + 1], n = Math.ceil((b - a) / 600);
      for (let k = 0; k < n; k++) {
        const p = a + Math.round((b - a) * k / n), q = a + Math.round((b - a) * (k + 1) / n);
        const secs = ids.filter((id) => R[id].a < q / fps + 1 && R[id].b > p / fps - 1).join(',');
        out.push(p + ' ' + q + ' ' + secs);
      }
    }
    console.log(out.join('\n'));" 2>/dev/null > "$WD/parts.txt"
  wc -l < "$WD/parts.txt"
  render_part() { local n=$1 p=$2 q=$3 secs=$4
    local a b; a=$(python3 -c "print($p/30)"); b=$(python3 -c "print($q/30)")
    if [ -s "$WD/parts/p$n.mp4" ]; then echo "part $n exists"; return 0; fi
    if SECS=$secs node --expose-gc render.mjs --out "$WD/parts/p$n.tmp.mp4" --from "$a" --to "$b" --crf 15 --preset fast > "$WD/parts/p$n.log" 2>&1; then
      mv "$WD/parts/p$n.tmp.mp4" "$WD/parts/p$n.mp4"; echo "part $n done $p-$q ($(tail -1 "$WD/parts/p$n.log"))"
    else echo "part $n FAILED (see $WD/parts/p$n.log)"; fi
  }
  i=0
  while read -r p q secs; do
    n=$(printf %02d $i); i=$((i+1))
    while [ "$(jobs -rp | wc -l)" -ge "$JOBS" ]; do wait -n || true; done
    render_part "$n" "$p" "$q" "$secs" &
  done < "$WD/parts.txt"
  wait
  # every piece must hold exactly its frames
  i=0; bad=0
  while read -r p q secs; do
    n=$(printf %02d $i); i=$((i+1))
    got=$(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$WD/parts/p$n.mp4" 2>/dev/null || echo 0)
    [ "$got" -eq $((q - p)) ] || { echo "part $n: $got frames, want $((q - p))"; bad=1; }
  done < "$WD/parts.txt"
  [ $bad -eq 0 ] || { echo "frame count mismatch, stop"; exit 1; }
  echo "all $i parts have their frames"
  ls "$WD"/parts/p??.mp4 | sort | sed "s|^|file '|; s|$|'|" > "$WD/parts/list.txt"
  ffmpeg -v error -y -f concat -safe 0 -i "$WD/parts/list.txt" -c copy "$WD/video.mp4"
  echo "video: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WD/video.mp4") s"
fi
if [[ $STAGE == final || $STAGE == all ]]; then
  cp "$ASS" "$WD/subs.ass"
  ffmpeg -v error -y -i "$WD/video.mp4" -i "$MIX" -vf "ass=$WD/subs.ass" -map 0:v -map 1:a \
    -c:v libx264 -preset slow -tune grain -crf 18 -maxrate 14000k -bufsize 20000k -pix_fmt yuv420p \
    -c:a aac -b:a 192k -shortest -movflags +faststart "$WD/final-1080p.mp4"
  echo "final: $(du -h "$WD/final-1080p.mp4" | cut -f1)  $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$WD/final-1080p.mp4") s"
fi
if [[ $STAGE == preview || $STAGE == all ]]; then
  ffmpeg -v error -y -i "$WD/final-1080p.mp4" -vf scale=1280:720 -c:v libx264 -preset medium -b:v 2600k -maxrate 4000k -bufsize 6000k \
    -c:a aac -b:a 128k -movflags +faststart "$WD/preview-720p.mp4"
  echo "preview: $(du -h "$WD/preview-720p.mp4" | cut -f1)"
fi
