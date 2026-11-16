# Film 19 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-06)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null (to the file end), {opts}]; mix.py reads them.
opts: "repeat": [t1, t2] lengthens a cue by t2-t1 (plays to t2, 2-s crossfade back to t1); "ride": slow gain rider strength (default 0.4).
Prompts in prompts.json, request ids + urls in jobs.txt (project folder film-singularity-friday/audio/music/, next to the mp3s).
One cue per chapter (chapters 1-7 of text-v4.md = timing.json "levels"), each placed in the gap before its chapter's first line:
M1 0:00 hook (full presence from 0:00, trimmed to 54 s, fades under the hook/loop gap 0:51-0:52)
· M2 0:51.3 the loop + clip slot C1 (natural decay into "To find out" 2:05)
· M3 2:04.3 the stopwatch + clip slots C2, C3 (the cue's quiet tail lies under C3 3:11-3:21; trimmed to 81 s)
· M4 3:21.6 a birthday / projection / GPS (lighter, music-box piano; decays under "Only if we can see it" 4:17)
· M5 4:16.0 see the road (trimmed to 45 s, fades under the change to "But seeing the road" 4:57)
· M6 4:56.8 many hands (decays under "To tell bigger from smaller" 6:19)
· M7 6:18.6 the birthday rule + ending + 15-s end screen (VO ends 7:47.2, end screen 7:48.1, film 8:03.1; the cue fades over its last 3 s).
Style: mystical and contemplative (drone, pads, felt piano, glass harmonica, distant wordless choir pad), no drums, no vocals, not uplifting. No SFX.
Vocal check: fal-ai/whisper over all seven cues returns only the usual music hallucinations ("Terima kasih telah menonton!", "you", "The"),
plus short nonsense on M2 and M6 (the choir pads); Lyria's lyrics field is empty placeholders ([[A0]] ...). Worth one listen on M2 / M6.
Level: cue RMS -26 dB, ducked -6 dB under speech (voice at -20 dB RMS + VO_BOOST 2 dB), and -12 dB under every clip slot
(clip-schritt.md: music strongly ducked under the O-Ton; the slots are silent until the clips are cut in);
final mix two-pass loudnorm -14 LUFS, mix.m4a -14.0 LUFS / -1.5 dBTP.
