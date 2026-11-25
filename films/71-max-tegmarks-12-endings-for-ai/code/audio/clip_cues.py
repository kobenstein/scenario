#!/usr/bin/env python3
"""Film 71 (from Film 69) · subtitle cues for the five clips: pocketsphinx forced alignment of the wording on the clip sound (<clipwav>/<id>.wav = the whole cut <scratch>/cut/Cn.mp4,
cut_clips.py) -> clips_meta.json (speaker, source, transcript, cues [[seconds from the clip start, line <= 34]]). clips_json.py then turns clips_meta.json + timing.json into clips.json.
Wording = text-v2.md [CLIP] lines (iMac line check, films/71-assets/clips/clips-geprueft-imac.json), cut as in cut_clips.py:
  C2 starts on the last 'My' of the stutter: 'My P(doom) is very low.' (Whisper on the cut: 'My PDOM is very low', syllables at 0.04 / 0.30 / 0.62 s)
  C4 'So, the goal of of these companies': the stutter is spoken (SPOKEN_EXTRA) but not subtitled.
  C1: the iMac (YouTube auto subs) and text-v2 have 'lost control OF AI systems'; the audio says 'OVER': Whisper twice (window + cut) and the pocketsphinx
      acoustic score (word 'over' 1e-12 vs 'of' 1e-39) agree. The subtitle follows the audio: 'lost control over AI systems' (flagged in README / report).
CUES = the subtitle lines (exact wording, numbers as digits); SPOKEN = how a token is said where it differs (alignment only).
usage: clip_cues.py [clipwav_dir]"""
import json, os, re, subprocess, sys
import numpy as np
from pocketsphinx import Decoder, Config, get_model_path
HERE = os.path.dirname(os.path.abspath(__file__))

CW = (sys.argv[1] if len(sys.argv) > 1 else '/tmp/claude-0/f71/audio/clipwav').rstrip('/')
SRC = {c['id']: c for c in json.load(open(os.path.normpath(os.path.join(HERE, '../../../71-assets/clips/clips-geprueft-imac.json')), encoding='utf8'))['clips']}
CUT = json.load(open(os.path.join(HERE, 'cut_clips.json')))['clips']
CUES = {'C1': ['This is in the rearview mirror.', 'Clearly, multiple companies', 'lost control over AI systems', 'this summer.'],
        'C2': ['My P(doom) is very low.', "It's sub 1%,", "it's 0.01%", 'or something like that.'],
        'C4': ['So, the goal of these companies', 'is to build a new species', "that's much more capable than us."],
        'C5': ['We may have to pace', 'the rate of AI development', 'to give ourselves enough time', 'for society to harden', 'around some of these', 'new capability levels.'],
        'C6': ['We know that the future of AI', 'is not inevitable.', "It's for us to decide."]}
WORDING = {'C1': 'This is in the rearview mirror. Clearly, multiple companies lost control over AI systems this summer.',
           'C2': "My P(doom) is very low. It's sub 1%, it's 0.01% or something like that.",
           'C4': "So, the goal of these companies is to build a new species that's much more capable than us.",
           'C5': 'We may have to pace the rate of AI development to give ourselves enough time for society to harden around some of these new capability levels.',
           'C6': "We know that the future of AI is not inevitable. It's for us to decide."}
SPEAKER = {'C1': ('Max Tegmark', 'MIT physicist, co-founder, Future of Life Institute', 'MAX TEGMARK · MIT physicist, co-founder, Future of Life Institute · ORIGINAL FOOTAGE', 'CSER, University of Cambridge (2026-09-16)'),
           'C2': ('Dean Ball', 'then Foundation for American Innovation, now OpenAI', 'DEAN BALL · then Foundation for American Innovation, now OpenAI · NOV 2025 · ORIGINAL FOOTAGE', 'Doom Debates (2025-11-20)'),
           'C4': ('Max Tegmark', 'MIT physicist, co-founder, Future of Life Institute', 'MAX TEGMARK · MIT physicist, co-founder, Future of Life Institute · ORIGINAL FOOTAGE', 'Dr Brian Keating (2026-10-23)'),
           'C5': ('Sam Altman', 'CEO, OpenAI', 'SAM ALTMAN · CEO, OpenAI · JUL 2026 · ORIGINAL FOOTAGE', 'Invest Like the Best (2026-07-28)'),
           'C6': ('Max Tegmark', 'co-founder, Future of Life Institute', 'MAX TEGMARK · co-founder, Future of Life Institute · PRO-HUMAN ASSEMBLY, WASHINGTON · SEP 15, 2026 · ORIGINAL FOOTAGE', 'Future of Life Institute (2026-09-15)')}
SPOKEN = {'P(doom)': 'p doom', '1%,': 'one percent', '0.01%': 'zero point zero one percent', 'AI': 'a_i'}
SPOKEN_EXTRA = {'C4': {'goal': ['of']}}   # an extra spoken token after this word (the stutter 'goal of of')
# gain_db: the clips are RMS-matched to the voice in mix.py; GAIN pulls each to within +-1 LU of the VO around it (ebur128 on the first real-clip mix)
GAIN = {'C1': -1.3, 'C2': -0.5, 'C4': 0.0, 'C5': -0.6, 'C6': -3.4}   # dB, clip vs the VO around it in the mix (first real-clip mix: +1.3 / +0.5 / +0.15 / +0.6 / +2.45 LU; C6 hall tail needed one dB more)
EXTRA = {'rearview': 'R IH R V Y UW', 'a_i': 'EY AY', 'doom': 'D UW M', 'p': 'P IY'}
norm = lambda w: re.sub(r"[^a-z_']", '', w.lower().replace('’', "'"))
NW = lambda t: [re.sub(r'[^\w%.()]', '', w).lower().strip('.') for w in t.split()]
cfg = Config(hmm=get_model_path('en-us/en-us'), dict=get_model_path('en-us/cmudict-en-us.dict'), lm=None, loglevel='FATAL')
dec = Decoder(cfg)
for w, p in EXTRA.items():
    try: dec.add_word(w, p, False)
    except RuntimeError: pass
meta = {}
for cid, lines in CUES.items():
    c = SRC[cid]
    words = ' '.join(lines).split()
    assert NW(' '.join(lines)) == NW(WORDING[cid]), (cid, 'cue lines != wording')
    print(cid, 'iMac line:', c['line'])
    assert all(len(l) <= 34 for l in lines), cid
    sub, first = [], []   # sub-tokens for the aligner; index of the first sub-token of every cue line
    for l in lines:
        first.append(len(sub))
        for w in l.split():
            for p in SPOKEN.get(w, SPOKEN.get(w.strip('.,'), w)).split(): sub.append(norm(p))
            for p in SPOKEN_EXTRA.get(cid, {}).get(w.strip('.,'), []): sub.append(norm(p))
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f'{CW}/{cid}.wav', '-f', 's16le', '-ac', '1', '-ar', '16000', '-'])
    dec.set_align_text(' '.join(sub)); dec.start_utt(); dec.process_raw(raw, full_utt=True); dec.end_utt()
    seg = [(x.word, x.start_frame / 100, (x.end_frame + 1) / 100) for x in dec.seg() if x.word not in ('<s>', '</s>', '<sil>') and not x.word.startswith(('[', '<', '+'))]
    assert len(seg) == len(sub), (cid, len(seg), len(sub))
    # a cue starts at its first word, but never inside a pause (10-ms RMS frames below -46 dBFS for >= 40 ms): then at the end of that pause
    x = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    quiet = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + 160] ** 2) + 1e-12) for i in range(0, len(x) - 160, 160)])) < -46
    def unpause(t):
        i = int(t * 100)
        while i < len(quiet) and quiet[i]: i += 1
        return i / 100
    cues = [[round(max(0.0, unpause(seg[k][1]) - 0.05), 2), l] for k, l in zip(first, lines)]
    sp, role, lt, src = SPEAKER[cid]; dur = CUT[cid]['dur']
    meta[cid] = {'speaker': sp, 'role': role, 'source': src, 'url': f"https://www.youtube.com/watch?v={c['video']}", 'credit': src.split(' (')[0],
                 'lower_third': lt, 'transcript': WORDING[cid], 'cues': cues, 'cue_end': round(min(seg[-1][2] + 0.4, dur - 0.05), 2),
                 'word_end': round(seg[-1][2], 2), 'gain_db': GAIN[cid], 'source_file': CUT[cid]['source'], 'source_in_s': CUT[cid]['in_s'], 'source_out_s': CUT[cid]['out_s']}
    print(cid, dur, 's · first word', round(seg[0][1], 2), '· last word ends', round(seg[-1][2], 2), '·', [(t, l) for t, l in cues])
json.dump(meta, open(os.path.join(HERE, 'clips_meta.json'), 'w'), indent=1, ensure_ascii=False)
