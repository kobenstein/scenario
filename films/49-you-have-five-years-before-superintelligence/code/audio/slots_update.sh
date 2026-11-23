#!/usr/bin/env bash
# Film 49 · put the real clips into the slots WITHOUT re-recording the voice.
# Needs: <ROOT>clips/C13.mp4, C5.mp4, C16.mp4, C2.mp4 (cut exactly: the whole file is the clip; a missing file stays a silent placeholder slot)
#        optional <ROOT>clips-geprueft.json (checked wording + word times -> clip subtitles)
#        the takes in /tmp/claude-0/f49/audio/dl (vo-tNN.mp3 + .json). If the scratchpad was cleared: download them again from fal_urls.txt and run align_ps.py
#        (see README), the music from fal_urls.txt (M0-M5) and sfx (sfx_prompts.json 'make_steps' + sfx-bibliothek atmo/nightsky).
# Steps: clip sound -> timeline (slot lengths = real clip lengths, everything after a slot moves) -> clip cues -> mix -> subtitles -> mount.
# usage: slots_update.sh [hoerfassung version, default v9]
set -euo pipefail
A="$(cd "$(dirname "$0")" && pwd)"
W=/tmp/claude-0/f49/audio
cd "$A"
python3 clips_wav.py "$W/clipwav"
python3 build_vo.py . "$W"
python3 clips_json.py .
python3 mix.py . "$W"
python3 subs.py . untertitel/
bash publish.sh "${1:-v9}"
