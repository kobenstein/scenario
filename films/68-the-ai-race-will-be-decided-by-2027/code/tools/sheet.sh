#!/bin/bash
# contact sheet: tools/sheet.sh <name> <t1,t2,...>  -> /tmp/claude-0/f68/sheets/<name>.jpg (4 columns, 480 px tiles)
set -e; cd "$(dirname "$0")/.."
D=/tmp/claude-0/f68/sheets/$1; rm -rf $D; mkdir -p $D
node render.mjs --snap "$2" --dir $D --scale 0.25 > /dev/null
ffmpeg -v error -y -pattern_type glob -i "$D/t*.jpg" -vf "drawtext=text='':fontsize=1,tile=4x$(( ($(ls $D | wc -l) + 3) / 4 )):padding=4" -frames:v 1 /tmp/claude-0/f68/sheets/$1.jpg
echo /tmp/claude-0/f68/sheets/$1.jpg
