#!/bin/bash
# Render the whole episode in 12 parts (4 at a time), then add the mix and burned subtitles.
set -e
cd "$(dirname "$0")"; mkdir -p out/full
P=(0 61.36 120 180 240 300 360 420 480 540 600 667.1 734.21)
for i in $(seq 0 11); do echo "$i ${P[$i]} ${P[$((i+1))]}"; done | \
  xargs -P 4 -L 1 sh -c 'node render.js --from $1 --to $2 --out out/full/p$(printf %02d $0).mp4 > out/full/log$0.txt 2>&1'
ls out/full/p*.mp4 | sort | sed "s/^out\/full\//file '/;s/$/'/" > out/full/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/full/list.txt -c copy out/full/picture.mp4
EP=../..
ffmpeg -v error -y -i out/full/picture.mp4 -i $EP/mix/mix.wav -vf "ass=$EP/mix/subs.ass:fontsdir=$EP/fonts" \
  -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart out/full/episode01.mp4
echo done
