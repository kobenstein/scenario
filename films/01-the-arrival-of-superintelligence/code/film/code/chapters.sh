#!/bin/bash
# Cut the finished episode into phone-size chapters (<14 MB each) for the preview page.
set -e
SRC=$1; DST=$2; mkdir -p $DST   # optional 3rd arg: chapter numbers to redo, e.g. "7"
CUTS=(0 61.359 144.958 233.129 288.496 338.545 404.4 490.6 552.434 609.24 658.8 734.3)
for i in ${3:-$(seq 0 10)}; do
  a=${CUTS[$i]}; b=${CUTS[$((i+1))]}; n=$(printf %02d $i)
  d=$(python3 -c "print($b-$a)"); kb=$(python3 -c "print(int(13.2*8192/($b-$a))-96)")
  ffmpeg -v error -y -ss $a -t $d -i $SRC -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -pass 1 -passlogfile $DST/pl$n -an -f mp4 /dev/null
  ffmpeg -v error -y -ss $a -t $d -i $SRC -vf scale=1280:720 -c:v libx264 -preset slow -b:v ${kb}k -maxrate $((kb*2))k -bufsize $((kb*2))k -pass 2 -passlogfile $DST/pl$n -c:a aac -b:a 96k -movflags +faststart $DST/c$n.mp4
  ffmpeg -v error -y -ss $(python3 -c "print($a+3)") -i $SRC -frames:v 1 -vf scale=1280:720 -q:v 4 $DST/c$n.jpg
  echo chapter $n $(du -h $DST/c$n.mp4 | cut -f1)
done
rm -f $DST/pl*
