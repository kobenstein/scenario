#!/usr/bin/env bash
# Film 72 · PHASE B = the real clips -> master (one block; stops at the first error). Run from anywhere: bash tools/f72_phaseB.sh
# Phase A (done before): tools/f72_clips.py render --no-clips (c01 c02 c04 c06 c08 c09 c10 c11 c13 at 1080p30 in /tmp/claude-0/f72/work/).
# What it does: 1 fetch + copy the clips · 2 sound step (README re-run block, GAIN from ebur128, mix again) · 3 clip frames · 4 render what is missing or moved
# (the 4 clip chunks c03 c05 c07 c12; the render marker re-renders any other chunk whose frame range / words moved) · 5 master = chunk files + mix.m4a (stream copy,
# NOTHING burned in; subtitles stay separate) · 6 verify (594.98 s, 17849 frames, -14 LUFS, TP <= -1) · 7 split into 90 MB fal parts + sha256.
# NOT in the block (agent tool step): upload the parts with fal upload_file (prepare_upload + curl PUT), then `python3 tools/f72_clips.py teile --urls urls.txt`.
set -euo pipefail
REPO=/home/user/scenario; FILM=$REPO/films/72-why-ai-billionaires-are-building-bunkers/code
ROOT=/mnt/project-files/scenario/film-bunker; S=/tmp/claude-0/f72; W=$S/audio
mkdir -p $S/clipsrc $ROOT/clips $ROOT/audio/untertitel $W

# 1 clips: origin/f72-clips -> ROOT/clips (network mount: re-read after ~10 s)
cd $REPO && git fetch origin f72-clips
rm -rf $S/clipsrc/films && git archive origin/f72-clips films/72-assets/clips | tar -x -C $S/clipsrc
for c in C1 C2 C3 C2b; do test -s $S/clipsrc/films/72-assets/clips/$c.mp4 || { echo "clip $c.mp4 missing in origin/f72-clips"; exit 1; }; done
cp $S/clipsrc/films/72-assets/clips/*.mp4 $ROOT/clips/ && sleep 12
for c in C1 C2 C3 C2b; do cmp $S/clipsrc/films/72-assets/clips/$c.mp4 $ROOT/clips/$c.mp4; ffprobe -v error -show_entries format=duration:stream=codec_type -of csv=p=0 $ROOT/clips/$c.mp4 | tr '\n' ' '; echo $c; done
cp $ROOT/audio/timing.json $S/timing_before.json

# 2 sound step with the real clips (audio/README.md "Neulauf"), then GAIN from ebur128 and the mix once more
cd $FILM/audio
python3 make_segments.py && python3 clips_wav.py $W/clipwav && python3 build_vo.py . $W && python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W
python3 ../tools/f72_gain.py --apply
python3 clip_cues.py $W/clipwav && python3 clips_json.py && python3 mix.py . $W
python3 ../tools/f72_gain.py            # control: every clip within +-1 LU of the VO around it (no 'would write' change expected)
python3 subs.py . untertitel && cp untertitel/subtitles.* $ROOT/audio/untertitel/
python3 - <<'EOF'
import json; a = json.load(open('/tmp/claude-0/f72/timing_before.json')); b = json.load(open('/mnt/project-files/scenario/film-bunker/audio/timing.json'))
print('timing: duration', a['duration'], '->', b['duration'], '| slots', [(s['id'], s['start'], s['end']) for s in b['slots'] if s['kind'] == 'clip'])
EOF
sleep 12

# 3 clip frames, 4 render (resumable: only the clip chunks + whatever moved), check
cd $FILM
python3 tools/f72_clips.py clips
python3 tools/f72_clips.py render -j 4
python3 tools/f72_clips.py check
for c in c03 c05 c07 c12; do python3 tools/calm.py $S/work/$c.mp4 --scale 1280:720 --sub 170 | tail -1; python3 tools/still72.py $S/work/$c.mp4 | tail -1; python3 tools/smooth.py $S/work/$c.mp4 | head -4; done

# 5 + 6 master (stream copy + mix.m4a, verify inside: aborts if length / frames / loudness are off), contact sheet -> ROOT/bild/f72_kontakt.jpg
python3 tools/f72_clips.py assemble --name f72 --fresh --calm

# 7 split into fal parts (cat of the parts must equal the master)
python3 tools/f72_clips.py split --name f72
ls -l $S/final/f72-master-1080p.mp4 $S/final/parts | head -30
