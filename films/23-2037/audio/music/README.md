# Film 23 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-06)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null (to the file end), {opts}]; mix.py reads them.
opts: "repeat": [t1, t2] lengthens a cue by t2-t1 (plays to t2, 2-s crossfade back to t1); "ride": slow gain rider strength (default 0.4).
Prompts in prompts.json, request ids in jobs.txt (project folder film-erster-tag/2037/audio/music/, next to the mp3s).
One cue per clock chapter (timing.json "chapters"), warmer and more intimate than Film 18 (one family day), same palette (drone, pads, felt piano, glass, distant wordless choir), key of D:
M1 0:00 hook + 06:15 (offset 2 s: Lyria's own fade-in skipped, full presence from 0:00; decays under "your kid losing an argument")
· M2 1:12 07:30 the kid and her tutor (the kid's celesta theme enters on "your kid losing an argument. With a genius.", decays into 09:00)
· M3 2:05.8 09:00 night shift of science · M4 3:08.3 12:00 the agent · M5 3:58.2 16:00 your dad (since 06.11. "repeat": [41.75, 52.0]
  adds 10.25 s, so it carries under the first subscribe line (4:54.7-5:03.6) and decays into 19:00)
· M6 5:04.34 19:00 dinner: Lyria stops at ~3 min (178 s), so "repeat": [15.75, 87.75] adds 72 s inside the sparse first part (spectrally closest pair);
  its warm bloom lands on 7:52-8:50 (Grandpa's earbuds ... K4 ... "Millions of people did the same."), decay under "Because people kept asking."
· M7 9:01.34 22:30 + end screen: enters under "Because people kept asking." / "One person still doesn't know about your scan.";
  "repeat": [22.75, 37.75] adds 15 s (8 s before 06.11. + the second subscribe line, 9:53.9-9:59.3) so its swell lands on the last line
  (10:01.1) and its decay fills the 15-s end screen to 10:19.9.
Clip slots K1 5:51.40 / K3 7:16.18 / K4 8:16.20: music 10 dB down under each slot (mix.py CLIP_DUCK), whether or not clips/<K>.wav exists yet.
Quote mode (mix-quote.m4a): same music and ducking; the narrator reads each quote into its slot (audio/quotes.py).
Vocal check: fal-ai/whisper on all seven files returns only the usual no-speech hallucinations ("Thank you for watching", "take a picture of the tree" loops);
Lyria's lyrics field is empty placeholders ([[A0]] ...). No SFX.
Level: cue RMS -26 dB, ducked -6 dB under speech; VO 4:1 compressor above -24 dBFS (mix.py VO_AF), voice +2 dB (VO_BOOST) -> music ~14 dB under the voice
during speech; mix.m4a -14.0 LUFS / about -2.0 dBTP (encode loop in mix.py keeps it at -14.0 +-0.05 LUFS and <= -1.5 dBTP).
