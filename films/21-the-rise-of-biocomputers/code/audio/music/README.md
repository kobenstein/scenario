# Film 19 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-06)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null, {opts}]; mix.py reads them ("repeat": [t1, t2] lengthens a cue by t2-t1).
Prompts in prompts.json (M3 was re-submitted with plainer wording after a content-filter refusal; the used prompt is in jobs.txt notes / fal history), request ids in jobs.txt.
M0 0:00 hook + where the cells come from (decays 1:36-1:40) · M1 1:39 Pong trick + product (+8 s repeat 80-88; Kagan clip C2 2:49.7-3:00.7; decays 3:35-3:56) · M2 3:47 why / 20 watts + the match (soft glass pulse from ~0:45 into the cue; +8 s repeat 100-108; decays 6:15-6:38)
· M3 6:29 is anyone in there (soft, glassy; Smirnova clip C3 7:47.1-8:01.1) · M4 8:00 ending + 15-s end screen (VO ends 9:27, film 9:42.9).
Style: mystical, fascinated, drones/pads/felt piano/glass harmonica/wordless choir pad; no drums, no vocals. No SFX.
Level: cue RMS -24 dB, ducked -6 dB under speech and under the clip slots; VO_BOOST=2 -> music ~10-12 dB under the voice; mix.wav -14.0 LUFS / -1.3 dBTP.
Run: build_vo.py audio /tmp/.../audio; VO_BOOST=2 mix.py audio /tmp/.../audio; subs.py audio <untertitel dir>. Word times of the takes come from tools/f19_align.py (pocketsphinx forced alignment), not from TTS timestamps.

vo-v4 (2026-11-08): no [softly] any more (Jakob 8.11.: no whispering): s05, s19, s20, s24 re-generated with [calm, conversational] / [thoughtful]
(s05 -1.6 s, s19 -0.7 s, s20 +0.3 s, s24 -0.4 s); channel call cta1 after "four years." (+9.6 s from 224 s on), end call cta2 after "up to us".
Cue starts now: M1 97.4, M2 235.0, M3 397.0, M4 488.0 (+4 s, repeat 40-44, so its decay ends with the film: 594.6 s; VO ends 582.1 s).
M1 decays under the channel call. Clip audio (C2, C3): <F19CLIPS>/<id>.wav, at slot start + offset (clips.json), at the voice's level
(-18 dB RMS), music ducked -6 dB over the slot.
