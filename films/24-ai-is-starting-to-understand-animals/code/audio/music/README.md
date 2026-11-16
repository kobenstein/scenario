# Film 24 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-09, 5 x 0.10 USD)
cues.json rows: {"f", "at" (take/slot id), "dt", "fin", "fout", "end" (take id or END), "end_dt"}: mix.py anchors every cue on takes, so slot changes move it along.
M0 "It's the second pig" to end of s08 (hook after the pig calls, team, founder, baby, autocomplete; 152 s file) · M1 s09 to s14 (the tour: Kenya, Spain, Caribbean, Bahamas, finches; 180 s) ·
M2 s15 to cta1 (the wall: toddlers, humpback, mid channel call; 97 s) · M3 s18 to s21 (whale songs, pigs, meat paradox; 121 s) · M4 s22 to the film end (scenario, back to today, end screen; 157 s, fades over the last 10 s).
No music under the two pig calls (M0 starts after P2). Style: mystical, fascinated, drones/pads/felt piano/glass harmonica/wordless choir pad; no drums, no vocals.
Level: cue RMS -26 dB, -6 dB under speech and under every slot -> ~12 dB under the voice. mix.wav -14.0 LUFS, -1.2 dBTP.
Request ids: M0 01a1c02c-5318-7eb1-ae84-a05ba182a032 · M1 01a1c02c-530f-7b10-a1d7-1fa54476fc77 · M2 01a1c02c-539e-7af3-8e92-d23f320be854 · M3 01a1c02c-53d6-7473-baac-305eafcbdc8b · M4 01a1c02c-539e-7731-a326-11b47da0652e
SFX (audio/sfx, from sfx-bibliothek, no new generation): moor_wind (s10), dawn_birds (s11), underwater (s12-s13), ocean_night (s18), dawn (s22), kitchen (s24-s25); -30 dB RMS, ducked under speech.
Run: build_vo.py audio <scratch>; mix.py audio <scratch>; subs.py audio <out dir>; the real pig/clip wavs go to <data root>/clips/ (pig1-positive.wav, pig2-negative.wav, C1.wav ...) and clips.json 'dur'/'offset'.
