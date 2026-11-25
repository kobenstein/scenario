#!/usr/bin/env bash
# Film 77 · rebuild the whole sound after (a) real clip files, (b) changed sentences, (c) new clip lengths.  ~2 min, no TTS unless a sentence changed.
# usage: rebuild.sh            (clips in /tmp/claude-0/f77/clips/Cn.mp4 = $F77CLIPROOT/clips, takes in /tmp/claude-0/f77/audio/dl)
#   real clip lengths:  edit NOTHING but clips_cfg.json if a trim must be set by hand (in/out), otherwise just put Cn.mp4 into the clips folder and run this script.
#   changed sentence:   edit vo-v4.txt (or give the new text to make_segments.py), run `python3 make_segments.py <vo.txt>`, re-record ONLY the take(s) whose text changed
#                       (compare with: python3 make_segments.py ... ; segments.json 'say'/'text'), save as dl/vo-<id>.mp3, then this script. align_ps.py runs on the given take ids only.
set -e
A="$(cd "$(dirname "$0")" && pwd)"; W=${F77WAV:-/tmp/claude-0/f77/audio}; ROOT=${F77ROOT:-/mnt/project-files/scenario/film-77-turing}; CLIPROOT=${F77CLIPROOT:-/tmp/claude-0/f77}   # Cn.mp4 are read from $CLIPROOT/clips/
cd "$A"
TAKES="$@"                               # optional: ids of re-recorded takes, e.g.  rebuild.sh t08 t12
python3 make_segments.py ${F77VO:-$ROOT/vo-v4.txt} >/dev/null
python3 align_ps.py . $W/dl $TAKES      # no ids = all takes
python3 clips_wav.py $W/clipwav $CLIPROOT # cut Cn.mp4 -> clipwav/Cn.wav + .json (missing mp4 = silent placeholder slot)
python3 build_vo.py . $W                # timing.json + slots.json + vo_only.wav
python3 clips_json.py . $W/clipwav      # clips.json (subtitle cues)
python3 mix.py . $W                     # mix.wav (-14 LUFS), mix_preview.mp3
python3 subs.py . $A                    # subtitles.ass / .srt
mkdir -p $ROOT/audio && cp timing.json slots.json clips.json subtitles.ass subtitles.srt $ROOT/audio/ && cp $W/mix_preview.mp3 $ROOT/audio/
echo done
