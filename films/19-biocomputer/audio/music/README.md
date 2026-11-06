# Film 18 music (Lyria 3.5 on fal, google/lyria-3.5, 2026-11-05)
cues.json rows: [file, start s, fade in s, fade out s, offset in file s, length s or null (to the file end), {opts}]; mix.py reads them.
opts: "repeat": [t1, t2] lengthens a cue by t2-t1 (plays to t2, 2-s crossfade back to t1); "ride": slow gain rider strength (default 0.4).
Prompts in prompts.json, request ids in jobs.txt (project folder film-kapitalismus/audio/music/, next to the mp3s).
One cue per chapter (stations of the VO, timing.json "levels"), each placed so its natural decay falls into the station change:
M0 0:00 hook + station 2 (engine, price of thinking, crash story, pressure; full presence from 0:00, decays under "But that's not the real ending" 1:46)
· M1 1:45 stations 3-4 (the real ending is the price, Britannica, music, Chegg/Canva, the value; decays under the subscribe question 4:16-4:20)
· M2 4:19.8 station 5 (the doors: ground, power, chips; Nvidia, Loudoun, land; the bad ending; enters on "Watch where it goes.", decays under "the ground the machine stands on" 6:04-6:06)
· M3 6:06.5 stations 6-7 (The Landlord's Game, the second set of rules; starts near silence, warms, decays under "None of this takes ..." 8:39-8:50)
· M4 8:46 ending + 15-s end screen (VO ends 9:40.9, film 9:56.8; the cue swells a little after the last line, then decays to about -44 dB at the end).
Style: mystical and contemplative (drone, pads, felt piano, glass harmonica, distant wordless choir pad), no drums, no vocals. No SFX (as in Film 16).
Vocal check: fal-ai/whisper over all five cues returns only the usual music hallucinations ("Thank you for watching", "The") spread over 10-30-s spans,
no sung words; Lyria's lyrics field is empty placeholders ([[A0]] ...).
Level: cue RMS -26 dB, ducked -6 dB under speech (voice at -20 dB RMS + VO_BOOST 2 dB) -> music ~11-12 dB under the voice (median);
final mix two-pass loudnorm -14 LUFS, mix.m4a -14.0 LUFS / -1.5 dBTP.
