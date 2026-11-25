#!/usr/bin/env python3
"""Film 63 · listen-check of the ElevenLabs takes by alignment (no ears in the cloud): two independent signals per take
 1) free recognition with the pocketsphinx en-us language model, aligned against the script words (difflib): runs of >= MISS script words
    the recogniser did not hear are flagged (a dropped or garbled phrase leaves such a run; single misses are normal ASR noise);
 2) the forced alignment of align_ps.py (<dl>/vo-<id>.json): words squeezed below 70 ms per syllable-ish or stretched over 1.6 s are flagged,
    and the speaking rate of the take (words/min) against the film median (a skipped line makes a take run fast).
Prints one line per take: recall of script words, flagged runs, odd words. Take ids on the command line = only those.
usage: check_takes.py <audio_dir> <dl_dir> [take ids...]"""
import difflib, json, re, statistics, subprocess, sys
from pocketsphinx import Decoder, Config, get_model_path
A, DL = sys.argv[1].rstrip('/'), sys.argv[2].rstrip('/'); only = set(sys.argv[3:]); MISS = 3
norm = lambda w: re.sub(r"[^a-z']", '', w.lower().replace('’', "'"))
cfg = Config(hmm=get_model_path('en-us/en-us'), lm=get_model_path('en-us/en-us.lm.bin'), dict=get_model_path('en-us/cmudict-en-us.dict'), loglevel='FATAL')
dec = Decoder(cfg)
segs = [s for s in json.load(open(f'{A}/segments.json')) if 'text' in s and (not only or s['id'] in only)]
rates = {}
for s in segs:
    W = json.load(open(f"{DL}/vo-{s['id']}.json"))['words']
    rates[s['id']] = len(W) / max(1e-3, W[-1][2] - W[0][1]) * 60
med = statistics.median(rates.values())
for s in segs:
    script = [norm(p) for w in re.sub(r'\[[^\]]*\]', ' ', s['text']).split() for p in w.split('-') if norm(p)]
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f"{DL}/vo-{s['id']}.mp3", '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    hyp = [norm(x.word.split('(')[0]) for x in dec.seg() if not x.word.startswith(('<', '[', '+'))]
    sm = difflib.SequenceMatcher(None, script, hyp, autojunk=False)
    hit = sum(b.size for b in sm.get_matching_blocks())
    runs, last = [], 0
    for b in sm.get_matching_blocks():
        if b.a - last >= MISS: runs.append(' '.join(script[last:b.a]))
        last = b.a + b.size
    W = json.load(open(f"{DL}/vo-{s['id']}.json"))['words']
    odd = [f"{w}:{e - a:.2f}" for w, a, e in W if (e - a) > 1.6 or (e - a) < 0.07 * max(1, len(re.findall(r'[aeiouy]+', w.lower())))]
    flag = 'CHECK' if runs or rates[s['id']] > med * 1.18 else 'ok'
    print(f"{s['id']} {flag:5s} recall {hit / len(script):.2f}  rate {rates[s['id']]:.0f} wpm (median {med:.0f})  missed runs {runs}  odd {odd}")
