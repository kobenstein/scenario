# Film 25 music (Lyria 3.5 on fal, google/lyria-3.5, 0.10 USD each, one track per chapter of text-v3)
STATUS 10.11.2026: NOT generated yet - the fal account jakob@kobenstein.com was out of credits (balance_exhausted) when the audio agent started. Prompts: prompts.json.
cues.json rows: {"f", "at" (take/slot id, "L<sec>" = chapter start, "END"), "dt", "fin", "fout", "end" (take/slot/"L<sec>"/END), "end_dt"}: mix.py anchors every cue on takes/chapters.
M0 HOOK (s00..s04, incl. J1) · M1 AKT 1 (L1) · M2 AKT 2 (L2) · M3 AKT 3 (L3) · M4 PLATZ 1 (L4) · M5 AKT 4 (L5 to K3) · M6 ENDE + end screen (s28 to END, fades over the last 10 s).
Style: mystical, thoughtful, drones/pads/felt piano/glass; no drums, no vocals, not uplifting. Level: cue RMS -26 dB, -6 dB under speech, a further -6 dB under every O-Ton/clip slot.
The mp3 files live in <scratch>/music (not in the repo): /tmp/claude-0/-home-user/e3b227b8-f27e-57b1-9ba9-fc035194c59d/scratchpad/f25/audio/music/.
Run: f25_make_segments.py; (fal TTS takes -> dl/<id>.mp3); f25_align.py audio dl; f25_oton_cues.py audio; build_vo.py audio <scratch>; mix.py audio <scratch>; subs.py audio <out dir>.
