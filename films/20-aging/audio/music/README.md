# Film 20 sound (2026-11-06) · VO Eleven v4, music Lyria 3.5, SFX Mirelo 2.0, all on fal

## Files
- Repo (`films/20-aging/audio/`): `vo-v4-tts.txt` (vo-v4.txt word for word + one direction tag per paragraph; `[CLIP Cn]` / `[ZITATKARTE …]` as their own paragraphs),
  `segments.json` (from `python3 tools/make_segments.py audio/vo-v4-tts.txt audio`: 41 takes s00-s40, slots C1-C3, Q1-Q3), `build_vo.py`, `subs.py`, `mix.py`,
  `sound_plan.json` (SFX), `music/cues.json`, `music/prompts.json`, `music/jobs.txt`.
- Project drive `/mnt/project-files/scenario/film-altern/audio/` (= <A>): `timing.json`, `segments.json`, `vo-sNN.mp3/.json` (takes + word timestamps),
  `vo_master.m4a`, `mix.m4a`, `sound_plan.json`, `music/M0-M4.mp3` + cues/prompts/jobs, `sfx/shimmer_a.mp3`. Subtitles: `film-altern/untertitel/subtitles.{srt,ass}`.
- WAVs (vo_master, stem_music, stem_sfx, premix, mix) only in a scratchpad (<W>).

## Voice
fal `elevenlabs/tts/eleven-v4`, voice akQnlreIUIoJxrTrosJj, stability 0.3, similarity_boost 0.75, seed 4301, timestamps on (STANDARD-STIMME.md).
Tags per paragraph: [calm, conversational] / [thoughtful] / [curious] / [softly]. `tools/save_tts.py <A> <wait_for_jobs output files>` writes the takes.
Pronunciation check (fal-ai/whisper on s04, s14, s21, s38): "escape velocity", "glaucoma" (2x), "Louisiana", "hepatitis C" (2x) all transcribed correctly.
"Olshansky" and "Salk" are not spoken in vo-v4 (the skeptic stays unnamed in the VO; Salk is only on quote card Q3).

## Timeline (timing.json, 617.7 s = 10:17.7)
Takes 0.9 s apart, stations 1.7 s; hook end (s02 "It's a race.") 0.8 s; longer breaths after "It's a price tag." (s34, 2.0 s) and "It's a decision." (s40, 1.5 s).
Clip slots C1 242.0, C2 340.4, C3 422.7 (10.0 s placeholders, `"placeholder": true`); card slots Q1 305.2 (5 s), Q2 384.1 (6 s), Q3 517.0 (6 s), no voice.
`endscreen` 602.7-617.7 (15 s, music runs out). `levels` = stations 0-8, `sections` = takes, `words` = word timings (`sec` = take id).

## Music (google/lyria-3.5, one cue per chapter, cue start/end anchored on takes, so they follow the real clip lengths)
M0 0:00 hook + station 1 · M1 station 2-3 (from s09 -1 s) · M2 station 4-5 (from s17, held until s26 +1.5 s by looping 60 s ff.) ·
M3 station 6-7 (from s26 -1.1 s) · M4 station 8 + end screen (from s34 -1 s to the film end, last 2 s fade).
Style: mystical (drone, pads, felt piano, glass harmonica, wordless choir pad, glass clock tick), no drums, no vocals (lyrics fields are only [[A0]] placeholders).
Level: cue RMS -26 dB, -6 dB under speech -> music ~13 dB under the voice (median); under a real clip -18 dB more (CLIP_DUCK_DB); under quote cards it stays up.
SFX: one Mirelo glass shimmer (`sfx/shimmer_a.mp3`), only where a quote card appears (no voice there), peak about -20 dBFS.

## Rebuild / when the clips arrive
1. Put the clips in `/mnt/project-files/scenario/film-altern/clips/C1.(wav|m4a|mp3|mp4|mov|webm|mkv)` (cut to the exact in/out; video files work directly), C2, C3.
2. Optional `<A>/clips.json`: {"C1": {"gain_db": 0, "af": "acompressor=...", "offset": 0, "cues": [[0.0, "first subtitle line"], [2.4, "..."]]}} (cues = subtitle lines, seconds from clip start).
3. `A=/mnt/project-files/scenario/film-altern/audio; W=<scratchpad>; python3 audio/build_vo.py $A $W && python3 audio/subs.py $A <out> && python3 audio/mix.py $A $W`
   build_vo takes the real clip lengths (everything after shifts, timing.json is rewritten), mix puts the clip audio at -18 dB RMS (+VO_BOOST 2) and ducks the music by 18 dB.
   Copy $W/mix.m4a to <A>. The VO takes are not regenerated.

## Loudness
mix.wav -14.0 LUFS / -1.5 dBTP (loudnorm TP -1.5, limiter -2.4 dBFS before the linear pass); mix.m4a (AAC 192k) -13.9 LUFS / -1.5 dBTP.

## Cost (fal, 2026-11-06)
TTS 8,299 chars x $0.08/1k = $0.66 · Lyria 5 x $0.10 = $0.50 · Mirelo 2 samples x 4 s x $0.01 = $0.08 · Whisper check ~$0.02 · total ~ $1.26.
