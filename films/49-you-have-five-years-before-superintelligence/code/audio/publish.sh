#!/usr/bin/env bash
# Film 49 · copy the small results to the network mount <ROOT>audio/ (+ Hoerfassung) and check them (mount rule: write, wait ~10 s, re-read).
# Text files: same size. mp3: the file store adds a C2PA manifest (ID3 GEOB frame, ~6 KB) on upload, so the size grows; the check compares the DECODED audio (md5).
# usage: publish.sh [version]   (version of the Hoerfassung, default v8)
set -euo pipefail
A="$(cd "$(dirname "$0")" && pwd)"
W=/tmp/claude-0/f49/audio
ROOT="${F49ROOT:-/mnt/project-files/scenario/film-vorbereiten/}"; ROOT="${ROOT%/}/"
V="${1:-v8}"
HF="/mnt/project-files/hoerfassungen/#49 You Have Five Years - Hoerfassung ${V}.mp3"
# Hoerfassung = the full mix (voice, clip sound once the clips exist, music, SFX) as 128k mp3
ffmpeg -nostdin -v error -y -i "$W/mix.wav" -c:a libmp3lame -b:a 128k "$W/hoerfassung-${V}.mp3"
ffmpeg -nostdin -v error -y -i "$W/mix.wav" -c:a libmp3lame -b:a 128k "$W/mix_preview_128.mp3"
mkdir -p "${ROOT}audio/untertitel"
declare -A MAP=(
  ["$A/timing.json"]="${ROOT}audio/timing.json"
  ["$A/slots.json"]="${ROOT}audio/slots.json"
  ["$A/untertitel/subtitles.srt"]="${ROOT}audio/untertitel/subtitles.srt"
  ["$A/untertitel/subtitles.ass"]="${ROOT}audio/untertitel/subtitles.ass"
  ["$W/mix_preview_128.mp3"]="${ROOT}audio/mix_preview.mp3"
  ["$W/hoerfassung-${V}.mp3"]="${ROOT}hoerfassung-${V}.mp3"
)
for src in "${!MAP[@]}"; do cp "$src" "${MAP[$src]}"; done
cp "$W/hoerfassung-${V}.mp3" "$HF"
sleep 10
ok=1
same() {   # same() <src> <dst>
  if [[ "$1" == *.mp3 ]]; then
    a=$(ffmpeg -nostdin -v error -i "$1" -map 0:a -f md5 - 2>/dev/null); b=$(ffmpeg -nostdin -v error -i "$2" -map 0:a -f md5 - 2>/dev/null || echo none)
  else a=$(stat -c %s "$1"); b=$(stat -c %s "$2" 2>/dev/null || echo 0); fi
  if [ "$a" = "$b" ]; then echo "ok   $(stat -c %s "$2")  $2"; else echo "FAIL $a != $b  $2"; ok=0; fi
}
for src in "${!MAP[@]}"; do same "$src" "${MAP[$src]}"; done
same "$W/hoerfassung-${V}.mp3" "$HF"
[ $ok = 1 ] || { echo "mount check failed: copy again"; exit 1; }
