#!/bin/bash
# Concatenate the render parts, burn subtitles, mux the mix; then cut phone-size chapters for the preview page.
set -e
cd /home/user/scenario/episodes/01-superintelligence-rising
R=film/render
printf "file 'part_0.mp4'\nfile 'part_184.mp4'\nfile 'part_368.mp4'\nfile 'part_552.mp4'\n" > $R/list.txt
ffmpeg -v error -y -f concat -safe 0 -i $R/list.txt -c copy $R/picture.mp4
ffmpeg -v error -y -i $R/picture.mp4 -i mix/mix.wav -vf "ass=mix/subs.ass:fontsdir=fonts"   -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -c:a aac -b:a 256k -shortest -movflags +faststart $R/episode01.mp4
mkdir -p /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film
CUTS=(0 61.359 144.958 233.129 288.496 338.545 404.4 490.6 552.434 609.24 658.8 734.3)
for i in $(seq 0 10); do
  a=${CUTS[$i]}; b=${CUTS[$((i+1))]}; n=$(printf %02d $i)
  d=$(python3 -c "print($b-$a)"); kb=$(python3 -c "print(int(13.2*8192/($b-$a))-96)")
  ffmpeg -v error -y -ss $a -t $d -i $R/episode01.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k     -pass 1 -passlogfile /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/pl$n -an -f mp4 /dev/null
  ffmpeg -v error -y -ss $a -t $d -i $R/episode01.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k     -pass 2 -passlogfile /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/pl$n -c:a aac -b:a 96k -movflags +faststart /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/c$n.mp4
  ffmpeg -v error -y -ss $(python3 -c "print($a+2)") -i $R/episode01.mp4 -frames:v 1 -vf scale=1280:720 -q:v 4 /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/c$n.jpg
  echo chapter $n $(du -h /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/c$n.mp4 | cut -f1)
done &
wait
rm -f /tmp/claude-0/-home-user-scenario/c435e3e2-72be-5ecd-a9bb-ba7113955896/scratchpad/hookpage/film/pl*
echo done
