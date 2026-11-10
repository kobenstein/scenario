// c03 · No. 9 the voice: the leaning stone (cut on action from the studio header) falls; translate / voice light on its face · it is
// the top slab of the Microsoft ranking: INTERPRETERS · TRANSLATORS (cool) … WRITERS · HISTORIANS … ROOFERS · DREDGE OPERATORS (warm)
// · the shortest slab is the lit window of an empty voice booth; a cool waveform of this very sentence, no person · it settles into a
// line that becomes the horizon · No. 8 the office routine: form, invoice, calendar · ten mini stones, nine COULD, one DID, SO FAR ·
// job cuts citing A.I.: 2025 54,836 → 2026 121,401 · back along the row: 10, 9, 8 lie · No. 7 still stands (image, music, cut).
// Builder B1 · plan: docs/shots.md 3.01–3.15 · ONE entry (the first frame is the W cut from c02, see lib/f25_b1_cut.mjs).
//
// | ID   | anchor                               | picture                                                      | camera                    |
// |------|--------------------------------------|--------------------------------------------------------------|---------------------------|
// | 3.01 | Number nine. The voice.              | No. 9 (matched to the leaning header slab) falls flat; title  | match → glide             |
// | 3.02 | Translators, interpreters, voice …   | translate · voice glyphs light on the lying face              | push                      |
// | 3.03 | Microsoft studied                    | the stone is the top slab; slabs grow below it                | tilt down                 |
// | 3.04 | Interpreters and translators landed  | top two cool + labels                                         | drift                     |
// | 3.05 | Writers and historians               | their labels                                                  | drift down                |
// | 3.06 | Roofers and dredge operators         | the bottom two warm + labels; source line                     | drift down                |
// | 3.07 | Jakob stopped booking                | the shortest slab is a lit window → the empty voice booth      | window fly-in ≥ 2.5 s     |
// | 3.08 | The voice you're hearing             | a cool waveform of this sentence in front of the microphone   | push                      |
// | 3.09 | So if even a voice                   | it settles into a line → the horizon of the rank row          | pull out ≥ 2.5 s          |
// | 3.10 | Number eight. Forms. Invoices. …     | No. 8 falls; form · invoice · calendar on their words          | glide                     |
// | 3.11 | In office and admin work             | ten mini stones, nine get COULD                               | tilt up                   |
// | 3.12 | In practice … So far.                | one tips: DID · SO FAR                                        | drift                     |
// | 3.13 | But companies aren't waiting         | the tipped stone is the 2025 slab; 2026 more than twice      | drift                     |
// | 3.14 | So the desk is going early           | back along the rank row: 10, 9, 8 lie                         | pull back (focus)         |
// | 3.15 | Surely the creative work is safe?    | No. 7 stands: image, music, cut light                         | push → n7Cam              |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f25_kit.mjs';
import * as S from '../lib/f25_seams.mjs';
import * as B from '../lib/f25_b1_lib.mjs';
import * as SC from '../lib/f25_b1_scenes.mjs';
import { headerCut, n7, n7Cam, n7Creep, n7Fall, no7Face } from '../lib/f25_b1_cut.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, halo } = E;
const { rise, maskLine, F0 } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { a0: R.a, end: R.b };
  a.voice = G('The voice', a.a0); a.transl = G('Translators', a.a0); a.vact = G('voice actors', a.a0);
  a.ms = G('Microsoft studied', a.a0); a.top = G('Interpreters and translators landed', a.ms); a.overlap = G('The work A.I. overlaps', a.top);
  a.writers = G('Writers and historians', a.top); a.roofers = G('Roofers and dredge', a.writers);
  a.booking = G('Jakob stopped booking', a.roofers); a.hearing = G("The voice you're hearing", a.booking); a.ifEven = G('So if even a voice', a.hearing);
  a.words = T.GW("The voice you're hearing", 'person', a.booking);
  a.n8 = G('Number eight', a.ifEven); a.forms = G('Forms', a.n8); a.invoices = G('Invoices', a.n8); a.sched = G('Scheduling', a.n8);
  a.admin = G('In office and admin', a.n8); a.nine = G('nine out of ten', a.admin); a.practice = G('In practice', a.admin); a.sofar = G('So far', a.practice);
  a.waiting = G("But companies aren't", a.sofar); a.alone = G('This year alone', a.waiting); a.twice = G('twice as many', a.alone);
  a.desk = G('So the desk is going', a.alone); a.surely = G('Surely the creative', a.desk); a.stuff = G('The stuff people', a.surely);
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT25 }];
};

const C = (u, v, s) => E.aim(F0, u, v, s);
const F9 = B.field(9), F8 = B.field(8), F7 = B.field(7);
const LIE = Math.PI / 2 - .015;
// the Microsoft slabs below the lying No. 9 (field frame of No. 9): the stone itself is the top slab
const SX = -B.STONE_H, ROWS = [
  { y: 66, v: .97, col: 'cool', label: 'TRANSLATORS', at: 'top' },
  { y: 150, v: .86, col: 'stone', label: 'WRITERS', at: 'writers' },
  { y: 234, v: .83, col: 'stone', label: 'HISTORIANS', at: 'writers' },
  { y: 392, v: .075, col: 'warm', label: 'ROOFERS', at: 'roofers' },
  { y: 476, v: .05, col: 'warm', label: 'DREDGE OPERATORS', at: 'roofers' },
];
const STH = 56, SLEN = B.STONE_H;
const DRED = ROWS[4], WINB = { x: SX, y: DRED.y - STH / 2, w: SLEN * DRED.v, h: STH };
const WINB_C = [WINB.x + WINB.w / 2, WINB.y + WINB.h / 2];
// ten mini stones above the lying No. 8 (field frame of No. 8)
const MX0 = -700, MP = 112, MY = -380, MH = 170, TIP = 2;
const GL8 = ['form', 'invoice', 'calendar', 'form', 'invoice', 'calendar', 'form', 'invoice', 'calendar', 'form'];
const SL = { x: -700, y1: -300, y2: -196, th: 50, l1: 300, l2: 300 * 121401 / 54836 };

function scene(a, T) {
  const cut = headerCut(T), tc = cut.tc;
  const t9 = tc, hit9 = B.leanHit(cut.tL, tc), t8 = a.n8 + .15, t7n = n7(T);
  // the match camera: No. 9's pivot sits where the slab's pivot was, the stone a little taller than the standing slab
  const sMatch = 1.12 * cut.slabH / B.STONE_H;
  const raw0 = B.fieldCam(F9, 0, 0, sMatch, cut.screen[0], cut.screen[1]);
  const d0 = B.cSub(E.camDrift(raw0, tc, .6, 11), raw0);
  const K0 = B.cSub(raw0, d0);                                       // so that camDrift(K0, tc) = raw0 exactly
  const homeB = B.fieldCam(F9, WINB_C[0], WINB_C[1], 1080 / (WINB.h - 6));
  const Lb = (u, v, s) => B.cAdd(C(u, v, s), homeB);
  const WC9 = [F9.x + WINB_C[0] * F9.sc, F9.y + WINB_C[1] * F9.sc];   // the booth window on No. 9's card (design)
  const P8 = [F8.x - 239 * F8.sc, F8.y - 70 * F8.sc], P7 = [F7.x + 70 * F7.sc, F7.y - 240 * F7.sc];
  const slabsA = B.fieldCam(F9, -400, 330, 1.0);

  const K1 = [[tc, K0], [a.transl - .1, B.fieldCam(F9, -230, -150, 1.05)], [a.ms + .6, B.fieldCam(F9, -340, 60, .9)], [a.top + .4, B.fieldCam(F9, -390, 110, .94)],
    [a.writers + .2, B.fieldCam(F9, -400, 200, .97)], [a.roofers + .2, slabsA]];
  const tHome = a.booking + 1.6;
  const K2 = [[a.roofers + .2, slabsA], [tHome, homeB]];
  const outB = Lb(885, 455, 1.0);
  const K3 = [[tHome, homeB], [a.hearing + .25, Lb(940, 515, 1.08)], [a.ifEven - .15, Lb(912, 482, 1.18)], [a.ifEven + 1.3, outB]];
  const view8 = B.fieldCam(F8, 140, -250, .72);
  const K4 = [[a.ifEven + 1.3, outB], [a.n8 - .1, view8]];
  const K5 = [[a.n8 - .1, view8], [a.forms - .1, B.fieldCam(F8, -140, -210, .95)], [a.sched + .7, B.fieldCam(F8, -230, -150, 1.05)],
    [a.admin + .8, B.fieldCam(F8, -190, -440, .88)], [a.practice + .6, B.fieldCam(F8, -230, -430, .92)], [a.waiting + .8, B.fieldCam(F8, -360, -330, .9)],
    [a.desk - .3, B.fieldCam(F8, -340, -300, .95)]];
  const over = C(1240, 610, .8);
  const K6 = [[a.desk - .3, K5[K5.length - 1][1]], [a.desk + 2.2, over]];
  const K7 = [[a.desk + 2.2, over], [a.surely + 1.8, B.fieldCam(F7, 90, -250, .78)], [a.end, n7Cam()]];
  const cam = (t) => {
    if (t < K1[K1.length - 1][0]) return B.camPathZ(t, K1, F9.Z);
    if (t < tHome) return B.camFocusPath(t, K2, F9.Z, WC9);
    if (t < K3[K3.length - 1][0]) return B.camPathZ(t, K3, homeB.z + 1700);
    if (t < K4[K4.length - 1][0]) return B.camFocusPath(t, K4, F9.Z, WC9);
    if (t < K5[K5.length - 1][0]) return B.camPathZ(t, K5, F8.Z);
    if (t < K6[K6.length - 1][0]) return B.camFocusPath(t, K6, F8.Z, P8);
    const cf = B.camFocusPath(t, K7, F7.Z, P7), w = smooth(span(t, a.end - 1.8, a.end));
    if (w <= 0) return cf;
    const cr = n7Creep(t, T);
    return { ...cf, x: lerp(cf.x, cr.x, w), y: lerp(cf.y, cr.y, w), z: lerp(cf.z, cr.z, w) };
  };

  // ------------------------------------------------------------------ the waveform of "The voice you're hearing right now is not a person."
  const env = (t) => { let e = 0; for (const w of a.words) e = Math.max(e, Math.sin(Math.PI * span(t, w.s - .03, w.e + .03))); return e; };
  const flat = (t) => 1 - smooth(span(t, a.ifEven - .1, a.ifEven + .7));
  const WAVE = { Z: 1400, x0: 520, x1: 1300, y: 470, n: 46 };
  function wave(ctx, c, t) {
    const on = smooth(span(t, a.hearing - .5, a.hearing + .1)); if (on <= 0) return;
    E.card(ctx, c, WAVE.Z, () => {
      const fl = flat(t), dx = (WAVE.x1 - WAVE.x0) / (WAVE.n - 1);
      halo(ctx, (WAVE.x0 + WAVE.x1) / 2, WAVE.y, 420, .12 * on, F.COOL.halo, F.COOL.body);
      ctx.fillStyle = F.COOL.body;
      for (let k = 0; k < WAVE.n; k++) {
        const x = WAVE.x0 + k * dx, mid = 1 - Math.abs(k - WAVE.n / 2) / (WAVE.n / 2);
        const e = env(t - Math.abs(k - WAVE.n / 2) * .01) * (.35 + .65 * Math.abs(Math.sin(k * 1.73 + t * 8.1) * Math.sin(k * .61 + t * 3.3)));
        const h = Math.max(3, (6 + 150 * e * (.3 + .7 * mid)) * fl * on + 3 * (1 - fl));
        ctx.globalAlpha = .9 * on; ctx.beginPath(); ctx.roundRect(x - 3, WAVE.y - h / 2, 6, h, 3); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (fl < 1) { ctx.strokeStyle = rgba(F.COOL.line, .9 * (1 - fl)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(WAVE.x0 - 3, WAVE.y); ctx.lineTo(WAVE.x1 + 3, WAVE.y); ctx.stroke(); }
    });
  }
  // the carrier: the flattened waveform becomes a screen-wide line that settles onto the horizon of the rank row
  function waveLine(ctx, t, c, hy) {
    const u0 = a.ifEven + .7; if (t < u0 || t > a.n8 + .2) return;
    const cl = B.local(c, homeB), p0 = E.project(cl, WAVE.Z, WAVE.x0, WAVE.y), p1 = E.project(cl, WAVE.Z, WAVE.x1, WAVE.y); if (!p0 || !p1) return;
    const w = sineIO(span(t, u0 + .3, a.n8 - .3)), ga = 1 - smooth(span(t, a.n8 - .45, a.n8 + .1));
    const y = lerp(p0[1], hy, w), xa = lerp(p0[0], -10, w), xb = lerp(p1[0], W + 10, w);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = rgba(F.COOL.halo, .25 * ga); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xb, y); ctx.stroke();
    ctx.strokeStyle = rgba(F.COOL.line, .9 * ga); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
  }

  // ------------------------------------------------------------------ the rank world
  function world(ctx, t) {
    const c = E.camDrift(cam(t), t, .6, 11);
    // inside the booth (the slab window is behind the camera)
    if (!B.inFront(c, F9)) { SC.booth(ctx, B.local(c, homeB), t, { wave: (cx, cl) => wave(cx, cl, t) }); return { c, hy: null }; }
    let hy = null;
    B.rankWorld(ctx, c, t, {
      fall: (n) => (n === 10 ? LIE : n === 9 ? B.leanAngle(t, cut.tL, tc) : n === 8 ? B.fallAngle(t, t8) : n === 7 ? n7Fall(t, T) : 0),
      each: (n) => (n === 9 ? { glyphA: 1 - smooth(span(t, hit9 - .1, hit9 + .5)) } : n === 8 ? { glyphA: 1 - smooth(span(t, B.fallHit(t8) - .1, B.fallHit(t8) + .5)) } : n === 7 ? { glyph: null } : null),
      after: (n, ang) => { if (n === 9) on9(ctx, t, c, ang); else if (n === 8) on8(ctx, t, ang); else if (n === 7) no7Face(ctx, t, T, ang); },
    });
    hy = E.project(c, F.Z_HOR + Math.max(0, c.z - 1000), 0, F.HOR)?.[1] ?? null;
    return { c, hy };
  }
  // No. 9's card: glyphs, the slabs, the booth window
  function on9(ctx, t, c, ang) {
    const landed = smooth(span(t, hit9 - .15, hit9 + .5));
    const lit = (tw) => smooth(span(t, tw - .05, tw + .35));
    const ga = landed * (1 - smooth(span(t, a.ms + .2, a.ms + .9)));
    if (ga > 0) B.faceGlyphs(ctx, t, ang, [['translate', .7, lit(a.transl)], ['voice', .3, lit(a.vact)]].map(([g, al, l]) => [g, al, l, undefined, ga]), { size: 82 });
    // the stone turns cool: it is the top of the ranking (INTERPRETERS)
    const cu = smooth(span(t, a.top - .1, a.top + .6)) * (1 - smooth(span(t, a.ifEven + 1.4, a.ifEven + 2.4)));
    if (cu > 0) { ctx.save(); ctx.globalAlpha = .85 * cu; ctx.fillStyle = E.lin(ctx, 0, -B.STONE_W, 0, 0, [[0, mixHex(F.COOL.body, P.cream, .25)], [1, F.COOL.deep]]);
      const fp = B.faceWindow(ang, { ix: 0, iy: 0, r: 2 }); ctx.fill(fp); ctx.restore(); halo(ctx, -SLEN, -B.STONE_W / 2, 200, .2 * cu, F.COOL.halo, F.COOL.body); }
    const lab = (tw, t1) => rise(span(t, tw + .1, tw + .8)) * (1 - expoIn(span(t, t1, t1 + .5)));
    const lu0 = lab(a.top, a.booking - .2);
    if (lu0 > 0) B.rightLine(ctx, [['INTERPRETERS', 0]], SX - 26, -B.STONE_W / 2 + 14, 38, lu0, { col: F.COOL.text });
    // slabs grow below it (left ends aligned with the stone's top end), retract into it on the way out of the booth
    const back = (k) => expoIn(span(t, a.ifEven + 2.2 + (4 - k) * .1, a.ifEven + 2.9 + (4 - k) * .1));
    ROWS.forEach((r, k) => {
      const g = span(t, a.ms + .2 + k * .14, a.ms + 1.4 + k * .14) * (1 - back(k)); if (g <= 0) return;
      const tw = a[r.at], cl = smooth(span(t, tw, tw + .6));
      F.slab(ctx, t, SX, r.y, SLEN * r.v, STH, { col: 'stone', u: g });
      if (cl > 0 && r.col !== 'stone') F.slab(ctx, t, SX, r.y, SLEN * r.v, STH, { col: r.col, u: g, a: cl });
      const lu = lab(tw, a.booking - .2);
      if (lu > 0) B.rightLine(ctx, [[r.label, 0]], SX - 26, r.y + 13, 34, lu, { col: r.col === 'cool' ? F.COOL.text : r.col === 'warm' ? F.WARM.text : P.cream });
    });
    // the dots between (many jobs in between)
    const dg = span(t, a.ms + .9, a.ms + 1.6) * (1 - back(2));
    for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(P.halo2, .6 * dg); ctx.beginPath(); ctx.arc(SX + 30 + k * 36, 312, 6, 0, Math.PI * 2); ctx.fill(); }
    // the dredge slab's face becomes the lit window of the booth
    const wu = smooth(span(t, a.booking - 1.9, a.booking - 1.1)) * (1 - smooth(span(t, a.ifEven + 2.1, a.ifEven + 2.8)));
    if (wu > 0) {
      // at home the window opens wider than the slab (a mask reveal of the booth), so that it covers the whole frame before the
      // camera passes the face plane (cards closer than 30 are not drawn) and the booth takes over full frame without a jump
      const op = Math.min(smooth(span(t, tHome - .45, tHome + .8)), 1 - smooth(span(t, a.ifEven + 1.3, a.ifEven + 2.3)));
      const ww = lerp(WINB.w - 4, 120, op), wh = lerp(WINB.h - 6, 76, op);
      const wp = new Path2D(); wp.rect(WINB_C[0] - ww / 2, WINB_C[1] - wh / 2, ww, wh);
      B.litWindow(ctx, wp, WINB_C[0], WINB_C[1], 60, wu, { glow: 1.4 });
      const m = ctx.getTransform(); ctx.save(); ctx.clip(wp); ctx.globalAlpha = wu; SC.booth(ctx, B.local(c, homeB), t, { wave: (cx, cl) => wave(cx, cl, t) }); ctx.restore(); ctx.setTransform(m);
      const veil = (1 - smooth(span(t, a.booking - 1.0, a.booking + .2))) + 0;
      if (veil > 0) { ctx.save(); ctx.clip(wp); ctx.fillStyle = rgba(P.core1, .9 * Math.min(1, veil) * wu); ctx.fillRect(WINB.x - 10, WINB.y - 10, WINB.w + 20, WINB.h + 20); ctx.restore(); }
    }
  }
  // No. 8's card: form / invoice / calendar on the lying face · ten mini stones (COULD / DID) · the job-cut slabs
  function on8(ctx, t, ang) {
    const landed = smooth(span(t, B.fallHit(t8) - .15, B.fallHit(t8) + .5));
    const lit = (tw) => smooth(span(t, tw - .05, tw + .35));
    if (landed > 0) B.faceGlyphs(ctx, t, ang, [['form', .78, lit(a.forms)], ['invoice', .5, lit(a.invoices)], ['calendar', .22, lit(a.sched)]].map(([g, al, l]) => [g, al, l, undefined, landed]), { size: 80 });
    // the baseline, then ten stones rise; nine get the cool dashed COULD outline
    const out = (k) => expoIn(span(t, a.waiting + k * .05, a.waiting + .7 + k * .05));
    const rb = span(t, a.admin - .2, a.admin + .7) * (1 - span(t, a.waiting + .3, a.waiting + 1.1));
    if (rb > 0) F.rule(ctx, MX0 - 40, MY, MX0 - 40 + (MP * 10) * expoOut(rb), MY, 1, { w: 2.5, a: .55 });
    const tipT = a.practice + .35, tipHit = tipT + .55;
    for (let k = 0; k < 10; k++) {
      const e = span(t, a.admin + .1 + k * .07, a.admin + .8 + k * .07); if (e <= 0) continue;
      const could = k < 9 ? smooth(span(t, a.nine + k * .08, a.nine + .5 + k * .08)) : 0;
      const x = MX0 + k * MP;
      if (k === TIP) continue;
      const o = out(k); if (o >= 1) continue;
      ctx.save(); ctx.translate(0, o * MH * 1.1); ctx.beginPath(); ctx.rect(x - 60, MY - MH * 1.3, MH, MH * 1.3 + 2); ctx.clip();
      B.mini(ctx, t, x, MY, MH, { a: e, could: could * (1 - o), glyph: GL8[k], glyphWarm: .4 });
      ctx.restore();
    }
    // the one that did: tips over (a fraction), lies, then becomes the 2025 slab
    {
      const k = TIP, x = MX0 + k * MP, e = span(t, a.admin + .1 + k * .07, a.admin + .8 + k * .07);
      const could = smooth(span(t, a.nine + k * .08, a.nine + .5 + k * .08));
      const fall = Math.min(LIE, Math.max(0, .5 * 9 * Math.max(0, t - tipT) ** 2));
      const mo = sineIO(span(t, a.waiting + .2, a.waiting + 1.4));
      if (e > 0 && mo < 1) B.mini(ctx, t, x, MY, MH, { a: e * (1 - smooth(span(mo, .5, 1))), could: could * (1 - smooth(span(t, tipT, tipHit))), fall, glyph: GL8[k], glyphWarm: .4 });
      const lu = rise(span(t, tipHit, tipHit + .7)) * (1 - expoIn(span(t, a.waiting, a.waiting + .5)));
      if (lu > 0) maskLine(ctx, [['DID', 0]], x - MH * .5, MY - MH - 30, 44, lu, { serif: false, weight: 600, col: F.COOL.text, glow: false, align: 'center' });
      const su = rise(span(t, a.sofar - .05, a.sofar + .6)) * (1 - expoIn(span(t, a.waiting, a.waiting + .5)));
      if (su > 0) maskLine(ctx, [['SO FAR', 0]], x - MH * .55, MY + 62, 30, su, { serif: false, weight: 600, col: F.WARM.text, glow: false, align: 'center' });
      // 2025 slab (morph from the lying stone) and the 2026 slab (more than twice as long)
      if (mo > 0) {
        const L1 = lerp(MH, SL.l1, mo), x1 = lerp(x - MH, SL.x, mo), y1 = lerp(MY - MH * .15, SL.y1, mo), th = lerp(MH * .3, SL.th, mo);
        const g1 = 1 - expoIn(span(t, a.desk, a.desk + .8));
        if (g1 > 0) {
          F.slab(ctx, t, x1, y1, L1 * g1, th, { col: 'stone' });
          F.slab(ctx, t, x1, y1, L1 * g1, th, { col: 'cool', a: smooth(span(mo, .4, 1)) });
          const u2 = span(t, a.alone + .1, a.twice + .6) * g1;
          if (u2 > 0) F.slab(ctx, t, SL.x, SL.y2, SL.l2, SL.th, { col: 'cool', u: u2 });
          const ly = rise(span(t, a.waiting + 1.2, a.waiting + 1.9)) * g1, l2 = rise(span(t, a.alone + .1, a.alone + .8)) * g1;
          if (ly > 0) { B.rightLine(ctx, [['2025', 0]], SL.x - 24, SL.y1 + 12, 34, ly, { col: P.cream }); maskLine(ctx, [['54,836', 0]], SL.x + SL.l1 + 40, SL.y1 + 14, 42, ly, {}); }
          if (l2 > 0) B.rightLine(ctx, [['2026', 0]], SL.x - 24, SL.y2 + 12, 34, l2, { col: P.cream });
          const v2 = rise(span(t, a.twice + .3, a.twice + 1.0)) * g1;
          if (v2 > 0) maskLine(ctx, [['121,401', 1]], SL.x + SL.l2 + 40, SL.y2 + 14, 42, v2, {});
        }
      }
    }
    const cl = rise(span(t, a.nine + .7, a.nine + 1.4)) * (1 - expoIn(span(t, a.waiting, a.waiting + .5)));
    if (cl > 0) maskLine(ctx, [['COULD', 0]], MX0 + MP * 9 + 120, MY - MH - 30, 44, cl, { serif: false, weight: 600, col: F.COOL.text, glow: false });
  }

  return (ctx, t) => {
    const { c, hy } = world(ctx, t);
    if (hy != null) waveLine(ctx, t, c, hy);
    // titles, sources, rail
    F.rankTitle(ctx, t, 110, 330, 9, 'THE VOICE', rise(span(t, a.voice - .1, a.voice + .7)) * (1 - expoIn(span(t, a.ms - .3, a.ms + .3))), { size: 120 });
    F.rankTitle(ctx, t, 110, 330, 8, 'THE OFFICE ROUTINE', rise(span(t, a.n8 + .1, a.n8 + .9)) * (1 - expoIn(span(t, a.admin - .3, a.admin + .3))), { size: 120 });
    F.source(ctx, t, a.roofers + .2, a.booking - .3, F.SOURCES.microsoft);
    F.source(ctx, t, a.admin + .4, a.waiting - .2, F.SOURCES.anthropic);
    F.source(ctx, t, a.waiting + 1.0, a.desk + .4, F.SOURCES.challenger);
    F.rankRail(ctx, t, T);
  };
}
