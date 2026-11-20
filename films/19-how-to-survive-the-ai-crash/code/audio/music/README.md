# Film 19 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-06)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null (to the file end), {opts}]; mix.py reads them.
opts: "repeat": [t1, t2] lengthens a cue by t2-t1 (plays to t2, 2-s crossfade back to t1); "ride": slow gain rider strength (default 0.4).
dips.json rows: [from s, to s, dB, ramp s]: extra music dip on top of the ducking (Film 19: -8 dB under "This isn't financial advice. ... in the panic." 167.7-172.7).
Prompts in prompts.json, request ids in jobs.txt (project folder film-ai-crash/audio/music/, next to the mp3s).
One cue per chapter (stations of timing.json "levels"):
M0 0:00 hook + clock + what's inside the bubble (s00-s04, C1; 124.8 s file, lengthened by 6.5 s with repeat 95-101.5, decays under "Day thirty-one" 2:10)
· M1 2:09 day 31 (the pause, Fidelity, disclaimer) + day 48 tariff crash (s05-s08, C1b; 91.6 s + 5 s repeat; prompt has a near-silent passage at 0:35-0:52 = film 2:44-3:01, plus the -8 dB dip)
· M2 3:44.8 protections 2-3, day 282, day 517, day 929 hangover, protection 4 (s09-s13; 160.9 s, decays under "...only protects themselves?" 6:25)
· M3 6:26 the safety nets + the hole (s14-s18; 130.5 s, decays before "Day one thousand." 8:35)
· M4 8:34.5 day 1,000 (C3) + ending + 15.9-s end screen (s19-s21; offset 5.5 s so the file's own fade ends with the film at 10:10.1; music ~-51 dB in the last second).
Style: mystical and contemplative (drone, pads, felt piano, glass harmonica, distant wordless choir pad), no drums, no vocals, not uplifting. No SFX.
Vocal check: fal-ai/whisper over the full mix returns only the VO/clip words plus one music hallucination over the end screen ("The world is full of life."); Lyria lyrics field = placeholders only.
Level: cue RMS -26 dB, ducked -6 dB under speech and clips (VO -20 dB RMS + VO_BOOST 2 dB) -> voice ~14 dB over music (median, p10 7 dB);
mix: VO_BOOST=2 python3 audio/mix.py <audio_dir> <wav_dir> -> -14.0 LUFS / -1.0 dBTP (mix.wav), mix.m4a -14.0 LUFS / -1.6 dBTP.
Splice 2026-11-07: +7.0 s gap at 391.74 inside M3 -> M3 repeat [5.25, 12.25] (crossfade at film 398.25, best spectral match 7 s apart), so M3 after 398.25 keeps its old position +7; M4 moved 514.5 -> 521.5 (offset 5.5, ends with the film at 10:17.1). Dip unchanged. mix.m4a -14.0 LUFS / -1.4 dBTP.
