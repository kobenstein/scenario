#!/bin/bash
# f26_footage.sh <cut clip dir> <out dir> : C1..C5 -> <out>/<id>/f00001.jpg ... 1680x945, 30 fps (what clipPlate loads via $F26CLIPS).
# Non-16:9 sources (C1 portrait, C5 322x240) are fitted (never stretched) onto a darkened, blurred copy of themselves; lanczos upscale.
set -e; IN=$1; OUT=$2
for id in C1 C2 C3 C4 C5; do
  mkdir -p $OUT/$id; rm -f $OUT/$id/*.jpg
  ffmpeg -v error -y -i $IN/$id.mp4 -filter_complex "[0:v]fps=30,split[a][b];[a]scale=1680:945:force_original_aspect_ratio=increase:flags=bicubic,crop=1680:945,gblur=sigma=40,eq=brightness=-0.25[bg];[b]scale=1680:945:force_original_aspect_ratio=decrease:flags=lanczos[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2" -q:v 2 -start_number 1 $OUT/$id/f%05d.jpg
  echo $id $(ls $OUT/$id | wc -l)
done
