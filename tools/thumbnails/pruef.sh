#!/bin/bash
# pruef.sh <bild-2560.png> <outdir> [markt1.jpg ... markt5.jpg]
# Prüfbilder für die Selbstkritik: 360 px (Handy-Startseite), 168 px (Seitenleiste),
# Blinzel-Test (klein, unscharf, grau) und optional eine Feed-Collage mit 5 Markt-Thumbnails.
set -e
src=$1; out=$2; shift 2; mkdir -p "$out"; b=$(basename "$src" .png)
ffmpeg -loglevel error -y -i "$src" -vf "scale=360:202:flags=lanczos" "$out/$b-360.png"
ffmpeg -loglevel error -y -i "$src" -vf "scale=168:94:flags=lanczos" "$out/$b-168.png"
ffmpeg -loglevel error -y -i "$src" -vf "scale=168:94,gblur=sigma=1.2,scale=640:360:flags=neighbor,format=gray" "$out/$b-blinzel.png"
if [ $# -ge 5 ]; then
  ffmpeg -loglevel error -y -i "$1" -i "$2" -i "$src" -i "$3" -i "$4" -i "$5" -filter_complex \
  "[0]scale=360:202[a];[1]scale=360:202[b];[2]scale=360:202[c];[3]scale=360:202[d];[4]scale=360:202[e];[5]scale=360:202[f];\
[a][b][c][d][e][f]xstack=inputs=6:layout=0_0|370_0|740_0|0_212|370_212|740_212:fill=white" "$out/$b-feed.png"
fi
echo "$out/$b-360.png $out/$b-168.png $out/$b-blinzel.png"
