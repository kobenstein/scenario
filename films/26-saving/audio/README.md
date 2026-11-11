# Film 26 audio
VO: 27 takes, elevenlabs/tts/eleven-v4, voice akQnlreIUIoJxrTrosJj, stability 0.3, similarity 0.75, seed 4301, direction tags from vo-v3 kept ([calm, conversational] / [thoughtful] / [warm]), no whisper tags; ~8.3k characters (~0.7 USD).
"artificial intelligence" is written out in vo-v3. s12 was sent as "Dah-rone Acemoglu" (the voice said "Darren"; Whisper now hears Daron); the script/subtitle text stays "Daron".
vo-v3 of 11.11. (second fact check): s07 "you now pay almost four", s11 "he moved on to retirement advice" (both re-recorded).
Slots (silent, real clips come with the assembly): C1 14.4 · C2 5.6 · C4 6.25 · C3 6.4 · C5 12.6 s (clips.json dauer_s), 0.7 s air before, 0.6 s after. Positions: slots.json / timing.json "slots".
Sections (timing.json sections[take].sec): H hook · 1 station 1 (C1) · 2 line 1 · 3 line 2 · 4 line 3 (C2, C4) · 5 line 4 (C3) · 6 line 5 · 7 the fix (C5) · 8 verdict. End screen 15 s after the closing call (timing.json end_screen).
Run: tools/f26_make_segments.py <vo-v3.txt> audio; fal TTS takes -> <scratch>/dl/<id>.mp3 (the mp3 takes are not in the repo); tools/f26_align.py audio <dl>; tools/f26_clip_cues.py audio; build_vo.py audio <scratch>; mix.py audio <scratch>; subs.py audio <out dir>
Clip cues (clips.json) are ESTIMATED over the planned length: re-time on the real footage, then set "dur" (and "offset") per clip and rerun build_vo.py, mix.py, subs.py. mix.py reads <ROOT>clips/<id>.wav.
Mix: VO -14 LUFS total, music cue -26 dB RMS, -6 dB under speech, further -6 dB under every clip slot (also while silent); clip audio at the voice's level.
