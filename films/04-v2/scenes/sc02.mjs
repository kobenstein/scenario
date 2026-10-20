// Chunk C02 · Film 4 minute 1 in the Film 5 machinery · shots 2.01–2.07 (bild/shots.md) · "It sounds" (00c) → "But that's not" (01a)
// export default async (T, R) => [{ t, draw(ctx, t, s), tr, d, print, sound }, …]   (every frame a pure function of t)
//
// NO BLENDS (minute repair, 2026-10-20): the whole chunk is ONE take (lib/m1x_c02_take.mjs). Every entry below draws the same function
// with the same print object, so the hard cuts film.mjs makes between them are invisible; the two chunk boundaries are the shared
// bridges of lib/m1x_bridge.mjs (b12 from 25.47 to 26.40, b23 from 44.48 on).
//
// PLAN (gate 1). Anchors are VO words (T.S/T.E), never seconds; times only for reading.
//  shot │ words (accent)                                   │ picture                                             │ carried by
//  2.01 │ It sounds like a **daydream**.                    │ c01's wall is the picture on a sheet floating in the │ b12 (bridge), then the same sheet
//       │                                                  │ dark of a hall; on "daydream" its lines leave as     │ in c02's world (camera C0)
//       │                                                  │ dots and drift up as smoke                           │
//  2.02 │ But the people building AI are now saying it     │ the dots gather into a spotlight beam; the camera    │ dots → beam; the blank sheet
//       │ **on stage**.                                    │ pulls back: a lectern with a speaker, the big screen │ glides onto the lectern
//       │                                                  │ powers on (keynote rosette), the speaker points at it│
//  2.03 │ (clip M, Musk)                                   │ the camera pushes into the screen; it switches to the│ the screen (a line closes and
//       │                                                  │ clip (pillarboxed, blurred sides), lower third       │ opens on the clip's first frame)
//  2.04 │ He gives it **ten**, maybe **twenty** years.      │ the picture collapses into a hot line, the camera is │ the line (CRT off) = the ruler
//       │                                                  │ in the glass; the line opens into the ruler, a burin │
//       │                                                  │ cuts the years; amber bracket, dotted decade         │
//  2.05 │ And he adds a **condition**.                     │ the dotted years gather into the IF seal, it lands   │ the dotted bracket
//  2.06 │ If AI and robots keep getting **better**.        │ slabs slide out of the seal, one per beat; the camera│ the seal → the stairs
//       │                                                  │ climbs; the light above grows                        │
//  2.07 │ He thinks they **will**.                         │ the ghost steps are engraved solid up to the light;  │ the light = b23 (bridge to c03)
//       │                                                  │ the camera flies into it                             │
// ★ none (the chunk is a calm bridge; the hard accent is the seal landing).
// Sound (pauses where possible): whoosh_airy (dots rise), lamp (screen on), whoosh (push), screen_off + tape_measure (after the clip),
//   stamp (seal lands), whoosh_up (steps on "better"), foil_glint (on "will").
import { c02Take } from '../lib/m1x_c02_take.mjs';
import { b23 } from '../lib/m1x_bridge.mjs';

export default async (T, R) => {
  const K = c02Take(T, R); await K.warm();
  const { A, draw, print } = K;
  return [
    { t: A.t0, tr: 'cut', d: .1, draw, print, sound: [{ f: 'whoosh_airy', t: A.dayE - .08, v: .22 }] },   // b12 until the bridge's b, then the take
    { t: A.but, tr: 'cut', d: .1, draw, print, sound: [{ f: 'lamp', t: A.on0 + .02, v: .18 }, { f: 'whoosh', t: A.push0 - .05, v: .16 }] },
    { t: A.c0 - .3, tr: 'cut', d: .1, draw, print },
    { t: A.he, tr: 'cut', d: .1, draw, print, sound: [{ f: 'screen_off', t: A.off0 + .02, v: .22 }, { f: 'tape_measure', t: A.open0 + .05, v: .2 }] },
    { t: A.and, tr: 'cut', d: .1, draw, print, sound: [{ f: 'stamp', t: A.land, v: .34 }] },
    { t: A.if, tr: 'cut', d: .1, draw, print, sound: [{ f: 'whoosh_up', t: A.better - .15, v: .16 }] },
    { t: A.he2, tr: 'cut', d: .1, draw, print, sound: [{ f: 'foil_glint', t: A.willE + .02, v: .2 }] },
    { t: A.ba, tr: 'cut', d: .1, draw: (ctx, t) => b23(ctx, t), print },   // c02>c03: inside the light (c03 draws b23 from its cut on)
  ];
};
