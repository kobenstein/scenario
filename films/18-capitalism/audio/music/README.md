# Film 16 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-10-28)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null (to the file end), {opts}]; mix.py reads them.
opts: "repeat": [t1, t2] lengthens a cue by t2-t1 (plays to t2, 2-s crossfade back to t1); "ride": slow gain rider strength (default 0.4).
Prompts in prompts.json, request ids in jobs.txt (project folder film-verfassung/audio/music/).
M0 hook + level 1 (from 0:00 at full presence, crossfades into M1 at the level-2 start 0:55) · M1 levels 2-3 · M2 levels 4-5 (more tension, the plug;
its loud middle sits under s09 "pause Claude", it thins out under the apology s11) · M3 level 6 real test (sparse) · M4 level 7 + ending + 15-s end screen.
Style: mystical and contemplative (drone, pads, felt piano, glass harmonica, distant wordless choir), no drums, no vocals. No SFX yet.
Each Lyria cue is placed so its natural decay (last ~5-8 s) falls into the level change; M4 is lengthened by 10.75 s (repeat 70.24-80.99,
the most similar 2-s windows in its steady middle) so its natural ending lands on the film end (end screen music until ~9:40, then decays).
Level: cue RMS -26 dB, ducked -6 dB under speech (voice at -20 dB RMS), i.e. ~10 dB under the voice; final mix two-pass loudnorm -14 LUFS / -1 dBTP.
