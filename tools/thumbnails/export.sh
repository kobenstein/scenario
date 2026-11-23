#!/bin/bash
# export.sh <src-2560.png> <outdir> <basename>  -> basename-2560.png, -1280.png, -1280.jpg
set -e
src=$1; out=$2; b=$3; mkdir -p "$out"
cp "$src" "$out/$b-2560.png"
ffmpeg -loglevel error -y -i "$src" -vf "scale=1280:720:flags=lanczos,unsharp=3:3:0.4" "$out/$b-1280.png"
ffmpeg -loglevel error -y -i "$src" -vf "scale=1280:720:flags=lanczos,unsharp=3:3:0.4" -q:v 2 "$out/$b-1280.jpg"
