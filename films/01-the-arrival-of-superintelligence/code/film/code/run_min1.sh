#!/bin/bash
# Render minute 1 in 4 parallel parts, then add the mix and burned subtitles.
set -e
cd "$(dirname "$0")"; mkdir -p out
P=(0 15.3 30.15 45.3 61.36)
for i in 0 1 2 3; do node render.js --from ${P[$i]} --to ${P[$((i+1))]} --out out/p$i.mp4 > out/log$i.txt 2>&1 & done
wait
printf "file 'p0.mp4'\nfile 'p1.mp4'\nfile 'p2.mp4'\nfile 'p3.mp4'\n" > out/list.txt
ffmpeg -v error -y -f concat -safe 0 -i out/list.txt -c copy out/picture.mp4
EP=../..
ffmpeg -v error -y -i out/picture.mp4 -i $EP/mix/mix.wav -t 61.36 -vf "ass=$EP/mix/subs.ass:fontsdir=$EP/fonts" \
  -af "afade=t=out:st=60.4:d=0.96" -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart out/minute1.mp4
echo done
