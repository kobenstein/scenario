// Chunk C3 · §1 the fortune to come, §2 TAKE · shots 1.02–2.08 (bild/shots.md v2 §3) · builder c03
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (gate 1). Times are VO anchors (T.S/T.E), never seconds. ★ none in C3; 11 MG shots in the share-certificate language.
//  shot  │ words (accent)                                │ hero onset                                   │ carrier into the next shot                          │ type
//  1.02  │ And the largest fortune … made **yet**.         │ burin tip = the light from c02, cuts 1 line  │ the camera glides down the ghost plate              │ plan seq.
//  1.03  │ So it belongs to **no one**.                    │ empty OWNER line, fibres blow over it        │ the camera pushes onto the line                     │ plan seq.
//  1.04  │ **Yet.**                                        │ one foil glint runs along the dotted line    │ pull back: the line is the strip between the hands  │ (b) out
//  1.14  │ … we don't have to **take** what anyone has.    │ a hand reaches across, pulls back, opens     │ the camera glides to the centre (the strip)         │ plan seq.
//  1.15  │ We just have to **agree**, **now**,             │ ghost sheet slides under the strip; 2 hands  │ the nib on the line                                 │ plan seq.
//                                                            take the pen; nib touches on "now"
//  1.15a │ how to share what's **coming**.                 │ dotted engraving spreads from the nib, a     │ the rosette                                         │ (b) zoom
//                                                            small rosette dawns over the sheet's edge
//  1.16  │ But how do you share a fortune that doesn't exist **yet**? │ 3 dotted cuts try and smoke away  │ the nib tip                                         │ (b) zoom
//  2.01  │ There are **three** ways.                       │ the nib draws a line that forks in three     │ the camera races down TAKE to the left (world → right) │ (c) whipR
//  2.02  │ The first is to **take**.                       │ a rust hand grips the big rosette            │ rosette + hand exit right, the bill slides in       │ (a) cut on the bill
//  2.03  │ Bernie Sanders has a **bill**.                  │ § A BILL, a page turns                       │ a paragraph lights → push in                        │ (b) zoom
//  2.04  │ A tax, paid in **new shares** … **half** …      │ shares engraved out of the rosette fly into  │ the box slides out right                            │ (a) right
//                                                            the fund; the rust half follows
//  2.05  │ … roughly **two in three** Americans …          │ 4 rows × 3: two of three raise a hand        │ a share rises from a raised hand                    │ (a) up
//  2.06  │ … into the **future** … created **later** …     │ dotted future rings; slices engrave solid    │ the outer ring → push in                            │ (b) zoom
//  2.07  │ But first, it takes **half** …                  │ the rosette stretches and tears in rust      │ the halves fall                                     │ (a) down
//  2.08  │ … **years in court** … the US **border**.       │ file stacks rise, the border glows and       │ the camera tears right to the fork (c03>c04)        │ (c) whipR
//                                                            stops a share that wants out
// Boundaries: in = carry('c02>c03') kind 'light': the foil "right" light becomes the burin tip (tip at C.pos(t) until it touches the plate).
//             out = carry('c03>c04') whipR d .3: 2.08 ends on an accelerating move to the right.
// Zooms (1.16, 2.01, 2.04, 2.07) use a light dip: the outgoing frame sinks into the dark around the carrier (radii follow the engine's
// zoom), the incoming one lights up from its centre, so the growing frame has no visible edge.
// Sound: the lead places gavel/press_notes; C3 adds only image-caused accents in speech pauses: foil_glint (1.04 glint), bloom (dawn
// reaches the hands); transition whooshes come from tools/sound_plan.mjs; the tear sits on the tear frame ("half") by design.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { Path2D } from '@napi-rs/canvas';
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, ein, prng, drift, canvas, text, addGlow } from '../engine.mjs';
import { carry } from '../lib/carry.mjs';
import { certificate, rosette, guilloche, gBorder, microtext, ring, seal, resample } from '../lib/certificate.mjs';
import { ghostLine, ghostPaths, smokeDots } from '../lib/ghost.mjs';
import { hand } from '../lib/hand.mjs';
import { pen } from '../lib/paper.mjs';
import { shareLight } from '../lib/share.mjs';
import { figureFlat, handPos } from '../lib/figure.mjs';
import { worldMap, region, country, project } from '../lib/map.mjs';
import { paths } from '../lib/paths.mjs';
import { stipple, fog as artFog, vnoise } from '../lib/art.mjs';
import { burin, fadedHand, deed, fundBox, miniCert, billSheet, fileStack, once, CREAM, AMBER, CORE, RUST } from '../lib/sc03_kit.mjs';

const TAU = Math.PI * 2;
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);                  // expo-ish out (landings)
const ei5 = (x) => Math.pow(clamp(x), 4);                          // expo-ish in (exits)
const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2; };   // quart in-out (moves)
const mix3 = (a, b, k) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (sh) => Math.round(mix((pa >> sh) & 255, (pb >> sh) & 255, clamp(k))); return '#' + [16, 8, 0].map((sh) => f(sh).toString(16).padStart(2, '0')).join(''); };
const PAPERC = '#e8d7b0', NIGHT = '#10123a', UMBRA = '#2a1c18', HONEY = '#e9a54b', INDIGO = '#0b0f2a', VERD = '#3fae9a';

// ---------- shared looks ----------
function bgLayer(key, c0, c1, c2, o = {}) {
  return once('bg' + key, () => { const [c, g] = canvas(W + 200, H + 140), rg = g.createRadialGradient(o.x ?? 900, o.y ?? 470, 0, o.x ?? 900, o.y ?? 520, 1500);
    rg.addColorStop(0, c0); rg.addColorStop(.5, c1); rg.addColorStop(1, c2); g.fillStyle = rg; g.fillRect(0, 0, c.width, c.height);
    if (o.ros) rosette(g, o.ros[0], o.ros[1], { R: o.ros[2], A: 50, B: 22, n: 40, m: 13, lines: 54, col: o.rosCol || '#b4bfe8', w: .55, a: o.rosA ?? .05 });
    stipple(c, { k: .45, g: 1, seed: 5 + key.length, mid: false, boost: 1 }); return c; });
}
function fogLayer(key, col, a, seed, y0 = 60, y1 = 1000) { return once('fog' + key, () => { const [c, g] = canvas(W + 400, H); artFog(g, { y0, y1, col, a, seed, sx: .0017, sy: .006, cover: .55, soft: .4, k: .55, x1: W + 400 }); return c; }); }
function drawFog(ctx, F, t, sp, a, dy = 0) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; ctx.drawImage(F, -((t * sp) % 400) - 200, dy); ctx.restore(); }
function vignette(ctx, a = .55, x = W * .52, y = H * .5) { const g = ctx.createRadialGradient(x, y, 380, x, y, 1250); g.addColorStop(0, 'rgba(3,4,12,0)'); g.addColorStop(1, `rgba(3,4,12,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function motes(ctx, t, seed, n, a, col = '255,226,190', box = [0, 0, W, H]) {
  const r = prng(seed); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) { const x0 = box[0] + r() * box[2], y0 = box[1] + r() * box[3], sp = 4 + r() * 12, x = box[0] + ((x0 - box[0] + t * sp) % box[2] + box[2]) % box[2], y = y0 + Math.sin(t * .5 + i) * 14 - t * 2 % box[3];
    ctx.fillStyle = `rgba(${col},${(.08 + .3 * r()) * a})`; const z = r() < .85 ? 1.3 : 2.4; ctx.fillRect(x, y, z, z); }
  ctx.restore();
}
function label(ctx, s, x, y, a, o = {}) { if (a <= 0) return; ctx.save(); if (o.shadow !== false) { ctx.shadowColor = 'rgba(2,3,12,.85)'; ctx.shadowBlur = 12; } text(ctx, s, x, y + (1 - a) * 14, { size: o.size ?? 20, weight: o.weight ?? 600, color: rgba(o.col || CREAM, a * (o.alpha ?? .92)), spacing: o.spacing ?? 5, align: o.align || 'left', font: o.font || 'Inter' }); ctx.restore(); }
function source(ctx, s, a) { label(ctx, s, 96, H - 196, a, { size: 16, weight: 500, col: '#c9c3dc', spacing: 2.5, alpha: .8 }); }
function dipOut(ctx, t, tB, d, x, y, depth = 5) { const k = sm(lin(tB - d / 2 - .35, tB, t)); if (k <= 0) return; const za = Math.pow(depth, eio(lin(tB - d / 2, tB + d / 2, t))), g = ctx.createRadialGradient(x, y, 60 / za, x, y, 300 / za);   // radii shrink with the engine's zoom so the lit spot stays the same on screen
  g.addColorStop(0, 'rgba(4,4,14,0)'); g.addColorStop(1, `rgba(4,4,14,${.94 * k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function dipIn(ctx, t, tB, d) { const k = 1 - sm(lin(tB - d / 2, tB + d / 2 + .3, t)); if (k <= 0) return; const g = ctx.createRadialGradient(W / 2, H / 2, 200, W / 2, H / 2, 640); g.addColorStop(0, 'rgba(4,4,14,0)'); g.addColorStop(1, `rgba(4,4,14,${.94 * k})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
// fabric on the K0 hand's flat sleeve (drawn over it, same transform): soft creases near the cuff, the far end sinks into the dark
// a guilloche ring as one closed polyline (for ghost rings)
function ringPts(cx, cy, R, amp, waves, ph, n = 420) { const pts = []; for (let i = 0; i <= n; i++) { const a = i / n * TAU, r = R + amp * Math.sin(a * waves + ph); pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } return pts; }
const subPts = (P, u0, u1) => { const n = P.length - 1, i0 = Math.max(0, Math.floor(u0 * n)), i1 = Math.min(n, Math.ceil(u1 * n)); return P.slice(i0, i1 + 1); };
const strokePoly = (ctx, P) => { if (P.length < 2) return; ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); for (let i = 1; i < P.length; i++) ctx.lineTo(P[i][0], P[i][1]); ctx.stroke(); };

export default (T, R) => {
  const W1 = (seg, ph, nth) => T.S(seg, ph, nth), E1 = (seg, ph, nth) => T.E(seg, ph, nth);
  const word = (seg, ph, nth) => { const ws = T.W(seg, ph.split(' ')[0], null).filter((w) => w.s >= T.S(seg, ph, nth) - 1e-3); return ws[ph.split(' ').length - 1] || ws[0]; };
  const CIN = carry('c02>c03', T, R), COUT = carry('c03>c04', T, R);
  // ---- anchors ----
  const A = {
    s102: CIN.into.t, largest: W1('01a', 'largest'), yet1: word('01a', 'made yet').s, yet1e: E1('01a', 'made yet'),
    s103: W1('01a', 'So it belongs'), noone: W1('01a', 'no one'), s104: W1('01a', 'Yet', 1), yet2e: E1('01a', 'Yet', 1),
    s114: W1('01a', 'Which means'), take1: word('01a', 'have to take').s, has: E1('01a', 'already has'),
    s115: W1('01a', 'We just'), agree: W1('01a', 'agree, now'), now: W1('01a', 'now,'),
    s115a: W1('01a', 'how to share'), coming: W1('01a', 'coming'), comingE: E1('01a', 'coming'),
    s116: W1('02a', 'But how do you'), fortune116: word('02a', 'a fortune that').s, yet3: word('02a', 'exist yet').s, yet3e: E1('02a', 'exist yet'),
    s201: W1('02a', 'There are three'), three: word('02a', 'are three').s, ways: word('02a', 'three ways').s,
    s202: W1('02a', 'The first is'), take2: word('02a', 'is to take').s,
    s203: W1('02a', 'Bernie Sanders'), bill: word('02a', 'a bill').s,
    s204: W1('02a', 'A tax'), newShares: W1('02a', 'new shares'), half1: W1('02a', 'half'), companies: E1('02a', 'AI companies'),
    s205: W1('02a', 'In polls'), twoInThree: W1('02a', 'two in three'), support: W1('02a', 'support it'),
    s206: W1('02a', 'It reaches'), future: word('02a', 'the future').s, later: word('02a', 'created later').s, well: E1('02a', 'as well'),
    s207: W1('02a', 'But first'), half2: W1('02a', 'half', 1), exists: E1('02a', 'already exists'),
    s208: W1('02a', 'Critics expect'), court: W1('02a', 'years in court'), courtE: E1('02a', 'years in court'), border: word('02a', 'US border').s, borderE: E1('02a', 'US border'),
    end: COUT.t,
  };

  // ════════════════ 1.02 – 1.04 · the ghost plate ════════════════
  // world = certificate units (centre 0,0; 1500 × 980). The fortune rosette (R 330) sits behind the title; the burin cuts its outer line.
  const ROS = { x: 10, y: -70 }, RG = { R: 330, A: 34, B: 16, n: 24, m: 9, lines: 30 };
  const camKeys = (() => {
    const P1 = { cx: ROS.x - 20, cy: ROS.y + 10, s: 1.02, r: -.045 }, P2 = { cx: 0, cy: 290, s: 1.6, r: -.02 }, P3 = { cx: -150, cy: 290, s: 4.3, r: -.005 };
    return { P1, P2, P3 };
  })();
  const PB = { t0: Math.max(A.largest - .05, CIN.t + .55), d: 1.35 }, GL = { t0: A.yet1e + .1, t1: Math.max(A.yet1e + 1.0, A.noone + .15) }, PU = { t0: A.s104 - .45, t1: A.s104 + .55 };
  // the cut: the plate's first line, a fine guilloche wave (rope-band profile: a sine plus a quarter of its 2.03 harmonic, low amplitude,
  // 80 waves round the circle) on the fortune rosette's mid circle, run counter-clockwise from angle a0. Its dotted ghost lies in the
  // plate layer; the burin makes it solid.
  const a0 = -1.95, NW = 80, AW = 2.8, SPAN = 2.27;
  const waveR = (th) => RG.R + AW * (.8 * Math.sin(NW * th) + .2 * Math.sin(2.03 * NW * th + .6));
  const CUT = (() => { const out = []; for (let k = 0; k <= 2400; k++) { const th = a0 - k / 2400 * SPAN, r = waveR(th); out.push([ROS.x + Math.cos(th) * r, ROS.y + Math.sin(th) * r]); } return resample(out, 1400); })();
  const cutAt = (u) => { const f = clamp(u) * (CUT.length - 1), i = Math.min(CUT.length - 2, Math.floor(f)), q = f - i; return [mix(CUT[i][0], CUT[i + 1][0], q), mix(CUT[i][1], CUT[i + 1][1], q)]; };
  const tCut0 = Math.min(CIN.t + .5, A.largest - .1), tCut1 = A.yet1 + .02, cutU = (t) => .42 * (1 - Math.pow(1 - lin(tCut0, tCut1, t), 1.6));
  // P0 is solved so that the cut's first point lies exactly under the carrier light at tCut0
  const camAt = (t, P0) => {
    let c;
    if (t < PB.t0) c = P0;
    else if (t < GL.t0) { const e = eo5((t - PB.t0) / PB.d); c = { cx: mix(P0.cx, camKeys.P1.cx, e), cy: mix(P0.cy, camKeys.P1.cy, e), s: Math.exp(mix(Math.log(P0.s), Math.log(camKeys.P1.s), e)), r: mix(P0.r, camKeys.P1.r, e) }; }
    else if (t < PU.t0) { const e = qio((t - GL.t0) / (GL.t1 - GL.t0)), P1 = camKeys.P1, P2 = camKeys.P2; c = { cx: mix(P1.cx, P2.cx, e), cy: mix(P1.cy, P2.cy, e), s: Math.exp(mix(Math.log(P1.s), Math.log(P2.s), e)), r: mix(P1.r, P2.r, e) }; }
    else { const e = qio((t - PU.t0) / (PU.t1 - PU.t0)), P2 = camKeys.P2, P3 = camKeys.P3; c = { cx: mix(P2.cx, P3.cx, e), cy: mix(P2.cy, P3.cy, e), s: Math.exp(mix(Math.log(P2.s), Math.log(P3.s), e)), r: mix(P2.r, P3.r, e) }; }
    return { ...c, cx: c.cx + drift(t, 6, 1) / c.s, cy: c.cy + drift(t, 4, 2) / c.s };
  };
  const P0 = (() => {
    const s0 = 2.25, r0 = -.07, e = eo5((tCut0 - PB.t0) / PB.d), P1 = camKeys.P1, sC = Math.exp(mix(Math.log(s0), Math.log(P1.s), e)), rC = mix(r0, P1.r, e);
    const tgt = CIN.pos(tCut0), w0 = CUT[0], dx = (tgt.x - 960) / sC, dy = (tgt.y - 540) / sC, c = Math.cos(-rC), sn = Math.sin(-rC);
    const ox = dx * c - dy * sn, oy = dx * sn + dy * c, cxC = w0[0] - ox - drift(tCut0, 6, 1) / sC, cyC = w0[1] - oy - drift(tCut0, 4, 2) / sC;   // centre needed at tCut0
    return { cx: (cxC - e * P1.cx) / (1 - e), cy: (cyC - e * P1.cy) / (1 - e), s: s0, r: r0 };
  })();
  const cam = (t) => camAt(t, P0);
  const toS = (C, x, y) => { const dx = x - C.cx, dy = y - C.cy, c = Math.cos(C.r), sn = Math.sin(C.r); return [960 + (dx * c - dy * sn) * C.s, 540 + (dx * sn + dy * c) * C.s]; };
  // cached ghost plate (certificate structure + the fortune rosette, dotted) at scale k
  const PK = 1.3, PW = Math.ceil((1500 + 240) * PK), PH = Math.ceil((980 + 240) * PK);
  const plateLayer = () => once('c03plate', () => {
    const [c, g] = canvas(PW, PH); g.translate(PW / 2, PH / 2);
    certificate(g, 0, { x: 0, y: 0, s: PK, rot: 0, ghost: 1, ghostCol: PAPERC, ghostW: 1.45, dot: 5.4, title: 'YOUR SHARE', a: .82, tips: 0 });
    g.save(); g.scale(PK, PK); rosette(g, ROS.x, ROS.y, { ...RG, ghost: 1, col: '#f0dcb4', w: 1.35 / PK, a: .78, dot: 5.4 / PK });
    { const pts = []; for (let i = 0; i <= 4000; i++) { const th = i / 4000 * TAU, r = waveR(th); pts.push([ROS.x + Math.cos(th) * r, ROS.y + Math.sin(th) * r]); }   // the first line's ghost
      ghostLine(g, pts, { ghost: 1, col: '#f6e6c4', w: 1.25 / PK, a: .8, dot: 3.4 / PK }); }
    g.restore();
    // the empty name line + its labels (dotted engraving), drawn live in the close-up; here only the small caps
    g.save(); g.scale(PK, PK); g.textAlign = 'center';
    g.font = '600 19px Inter'; try { g.letterSpacing = '6px'; } catch { } g.fillStyle = rgba(PAPERC, .62); g.fillText('THIS CERTIFIES THAT', 0, 226);
    g.restore();
    return c;
  });
  const [revC, revG] = canvas(W, H);
  const fibres = (() => { const r = prng(17), F = []; for (let i = 0; i < 22; i++) F.push({ y: r(), ph: r() * 10, sp: .5 + r(), len: 10 + r() * 26, bend: (r() - .5) * 1.6, z: .6 + r() * .9 }); return F; })();
  const glint104 = (t) => lin(A.s104 - .02, A.s104 + .75, t);     // the foil glint along the line (0 → 1, then out)
  function plateFrame(ctx, t) {
    const C = cam(t), s = C.s;
    ctx.drawImage(bgLayer('plate', '#1c1830', '#110f22', '#050410', { x: 980, y: 520 }), -100 + drift(t, 10, 3) * .4, -70 + drift(t, 8, 4) * .4);
    // the warm pool of the burin light on the plate
    const tip = (() => { if (t < tCut0) { const p = CIN.pos(t); return [p.x, p.y]; } return toS(C, ...cutAt(cutU(t))); })();
    const lift = sm(lin(A.yet1, A.yet1 + .4, t)), away = eio(lin(A.yet1 + .5, GL.t0 + 1.4, t));
    const light = (t < A.yet1 ? 1 : mix(1, .35, lift)) * (1 - away * .8);
    { const g = ctx.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], 620); g.addColorStop(0, rgba('#ffb35c', .2 * light)); g.addColorStop(.4, rgba('#c8742c', .07 * light)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    // the plate (cached ghost engraving), revealed from the light outward in the first second
    const P = plateLayer(), rev = clamp((t - CIN.t + .05) / 1.25);
    const drawPlate = (g) => { g.save(); g.translate(960, 540); g.rotate(C.r); g.scale(s / PK, s / PK); g.translate(-C.cx * PK - PW / 2, -C.cy * PK - PH / 2); g.drawImage(P, 0, 0); g.restore(); };
    const masked = (R0, inner, alpha, op) => { revG.globalCompositeOperation = 'source-over'; revG.clearRect(0, 0, W, H); drawPlate(revG); revG.globalCompositeOperation = 'destination-in';
      const g = revG.createRadialGradient(tip[0], tip[1], 0, tip[0], tip[1], R0); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(inner, 'rgba(0,0,0,.8)'); g.addColorStop(1, 'rgba(0,0,0,0)'); revG.fillStyle = g; revG.fillRect(0, 0, W, H);
      revG.globalCompositeOperation = 'source-over'; ctx.save(); ctx.globalAlpha = alpha; if (op) ctx.globalCompositeOperation = op; ctx.drawImage(revC, 0, 0); ctx.restore(); };
    // the plate is found by the light: it spreads out from the tip in the first second, then lies there, dim
    if (rev < 1) masked(40 + eout(rev) * 2300, .75, .88, null); else { ctx.save(); ctx.globalAlpha = .88; drawPlate(ctx); ctx.restore(); }
    // where the light falls the dotted engraving glows warmer and brighter
    if (light > .05) masked(560 * Math.max(.7, s / 1.6), .3, .9 * light * clamp(rev * 2), 'lighter');
    // world-space live parts
    ctx.save(); ctx.translate(960, 540); ctx.rotate(C.r); ctx.scale(s, s); ctx.translate(-C.cx, -C.cy);
    // the engraved part of the fortune rosette (solid, warm behind the burin, cooling to cream)
    const u = cutU(t); if (u > .001) {
      const Pts = subPts(CUT, 0, u).slice(0, -1).concat([cutAt(u)]), hot = Math.max(0, Pts.length - 90);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(AMBER, .18); ctx.lineWidth = 3.5 / s + 1.2; strokePoly(ctx, Pts); ctx.strokeStyle = rgba(AMBER, .32); ctx.lineWidth = 3.2 / s + 1.2; strokePoly(ctx, Pts.slice(hot)); ctx.restore();
      ctx.strokeStyle = rgba(CREAM, .95); ctx.lineWidth = 1.9 / s + .55; strokePoly(ctx, Pts);
      ctx.strokeStyle = rgba(CORE, .9); ctx.lineWidth = 1.2 / s + .4; strokePoly(ctx, Pts.slice(hot));
    }
    // the owner line: dotted engraving, live (dots grow with the push-in), with its small caps label
    { const y = 286, x0 = -330, x1 = 330, g = glint104(t), lw = 1.6, pitch = 7;
      ctx.save(); ctx.lineCap = 'round';
      for (let x = x0; x <= x1; x += pitch) { const q = (x - x0) / (x1 - x0), d = Math.abs(q - g * 1.25 + .12), fl = g > 0 && g < 1 ? Math.exp(-d * d / .0035) : 0, after = g > 0 ? clamp((g * 1.25 - .12 - q) * 3) * .35 : 0;
        ctx.fillStyle = fl > .02 ? rgba(fl > .5 ? CORE : AMBER, Math.min(1, .6 + fl)) : rgba(PAPERC, .62 + after * .4); const rr = lw * (1 + fl * 1.3 + after * .3); ctx.beginPath(); ctx.arc(x, y, rr, 0, TAU); ctx.fill();
      }
      ctx.font = '600 15px Inter'; try { ctx.letterSpacing = '7px'; } catch { } ctx.textAlign = 'center'; ctx.fillStyle = rgba(PAPERC, .62); ctx.fillText('OWNER', 0, y + 34);
      ctx.restore(); }
    ctx.restore();
    // the glint leaving to the right (screen space): a foil streak + light, the strip of 1.14 is waiting
    { const g = glint104(t); if (g > 0 && g < 1.2) { const q = g * 1.25 - .12, [gx, gy] = toS(C, mix(-330, 330, q), 286); ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const fade = 1 - sm(lin(.9, 1.2, g)), L = 420, lg = ctx.createLinearGradient(gx - L, gy, gx + 60, gy); lg.addColorStop(0, 'rgba(255,179,92,0)'); lg.addColorStop(.8, rgba(AMBER, .5 * fade)); lg.addColorStop(.93, rgba(CORE, .95 * fade)); lg.addColorStop(1, 'rgba(255,241,214,0)'); ctx.fillStyle = lg; ctx.fillRect(gx - L, gy - 1.6, L + 60, 3.2);
      const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 150); rg.addColorStop(0, rgba(CORE, .55 * fade)); rg.addColorStop(.18, rgba(AMBER, .22 * fade)); rg.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = rg; ctx.fillRect(gx - 150, gy - 150, 300, 300);
      ctx.save(); ctx.translate(gx, gy); ctx.scale(1, .06); const sg = ctx.createRadialGradient(0, 0, 0, 0, 0, 520); sg.addColorStop(0, rgba(CORE, .6 * fade)); sg.addColorStop(1, 'rgba(255,241,214,0)'); ctx.fillStyle = sg; ctx.fillRect(-520, -520, 1040, 1040); ctx.restore();
      ctx.restore(); } }
    // fibres in the air current over the line (1.03): they drift across; one touches the line on "no one" and lifts off again
    { const fa = sm(lin(A.s103 - .6, A.s103 + .2, t)) * (1 - sm(lin(A.s104 + .3, A.s104 + .9, t))); if (fa > 0) {
      const [lx0, ly] = toS(C, -330, 286), [lx1] = toS(C, 330, 286);
      ctx.save(); ctx.lineCap = 'round';
      fibres.forEach((f, i) => { const span = W + 400, x = ((t - A.s103 + f.ph) * 90 * f.sp * f.z) % span - 200, y = ly - 260 + f.y * 520 + Math.sin(t * 1.3 + f.ph * 3) * 24 * f.z;
        ctx.strokeStyle = rgba('#efe4cc', (.1 + .16 * f.z) * fa); ctx.lineWidth = .5 * f.z + .25; const L = f.len * f.z; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + L * .5, y + f.bend * 8, x + L, y + f.bend * 14 * Math.sin(t + i)); ctx.stroke(); });
      // the one that lands
      const k = lin(A.noone - .5, A.noone + 1.0, t); if (k > 0 && k < 1) { const land = sm(lin(0, .35, k)), off = ein(lin(.55, 1, k)), x = mix(lx0 + 180, (lx0 + lx1) / 2, land) + off * 520, y = mix(ly - 140, ly - 4, land) - off * 180;
        ctx.strokeStyle = rgba('#fff4dc', .85 * fa); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x - 18, y + 2); ctx.quadraticCurveTo(x, y - 6 + off * 10, x + 22, y + off * 14); ctx.stroke(); }
      ctx.restore(); } }
    // the burin (hand + graver), world-anchored once it touches the plate; it lifts on "yet" and leaves up-right
    { const ha = clamp((t - CIN.t + .1) / .45) * (1 - sm(lin(GL.t0 + .6, GL.t0 + 1.4, t)));
      if (ha > 0) {
        // a large engraver's hand close to the plate. The wrist follows the smooth mid circle, the tool pivots a little so its tip rides the fine wave.
        const sc = 1.15 * (C.s / 1.6) ** .45, outX = away * 520, outY = -away * 260, cutOn = t >= tCut0 && t < A.yet1 + .1;
        const REF = -2.62 + TAU; let ang = REF + .05 * Math.sin(t * 1.2);
        if (t >= tCut0) { const p = cutAt(cutU(t)), th = Math.atan2(p[1] - ROS.y, p[0] - ROS.x); let a1 = th - Math.PI / 2 + C.r; while (a1 - REF > Math.PI) a1 -= TAU; while (REF - a1 > Math.PI) a1 += TAU;
          const a2 = mix(ang, a1, .55 * sm(lin(tCut0, tCut0 + .45, t))), m = toS(C, ROS.x + Math.cos(th) * RG.R, ROS.y + Math.sin(th) * RG.R), Lw = 345 * sc;
          const wx = m[0] - Math.cos(a2) * Lw, wy = m[1] - Math.sin(a2) * Lw; ang = Math.atan2(tip[1] - wy, tip[0] - wx); }
        // the light at the tip = the carrier from c02 (shareLight); it calms down once the cut begins
        const la = t < tCut0 ? 1 : mix(1, .55, sm(lin(tCut0, tCut0 + .5, t))) * (1 - lift * .5);
        burin(ctx, tip[0] + outX, tip[1] + outY, ang, sc, t, { lift, cut: cutOn ? 1 : 0, a: ha, sleeve: '#3a2a3a', skin: '#a8734f', rim: '#ffd59a', glow: Math.max(la, cutOn ? .9 : 0) });
        shareLight(ctx, tip[0] + outX, tip[1] + outY - lift * 26 * sc, 14 * (t < tCut0 ? CIN.pos(t).s : 1) * mix(1, .6, lift), t, { a: la * ha });
      } }
    { const wk = 1 - sm(lin(CIN.t - .1, CIN.t + .8, t)); if (wk > 0) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = rgba('#d8b48c', wk); ctx.fillRect(0, 0, W, H); ctx.restore(); } }
    { const dk = (1 - away) * (1 - sm(lin(A.s103 - .2, A.s103 + .8, t))); if (dk > 0) { const g = ctx.createRadialGradient(tip[0], tip[1], 260, tip[0], tip[1], 1250); g.addColorStop(0, 'rgba(4,3,12,0)'); g.addColorStop(1, `rgba(4,3,12,${.62 * dk})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
    motes(ctx, t, 7, 70, .6);
    vignette(ctx, .62, W * .5, H * .48);
    { const ek = sm(lin(A.s114 - .9, A.s114 - .2, t)); if (ek > 0) { const g = ctx.createRadialGradient(W / 2, H * .55, 260, W / 2, H * .55, 1100); g.addColorStop(0, 'rgba(4,4,14,0)'); g.addColorStop(1, `rgba(4,4,14,${.9 * ek})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
  }

  // ════════════════ 1.14 – 1.15a · the table of what people already have ════════════════
  const STRIP = { x0: 780, x1: 1140, y: 520 };
  const SHEET = { x: 960, y: 392, w: 760, h: 470 };          // the ghost agreement sheet (its signature line = the strip)
  const sheetIn = (t) => eo5(lin(A.s115 - .1, A.s115 + .75, t));
  const handL = (t) => {   // ochre, from the left: reaches across on "which means … take", pulls back, opens
    const reach = sm(lin(A.s114 + .25, A.take1 - .1, t)) * (1 - eout(lin(A.take1 - .05, A.take1 + .55, t))), open = sm(lin(A.take1, A.take1 + .6, t));
    const toPen = qio(lin(A.agree - .35, A.agree + .45, t)), dn = eout(lin(A.now - .15, A.now + .15, t));
    let x = mix(330, 640, reach) + drift(t, 4, 1), y = mix(720, 660, reach) + drift(t, 3, 2), ang = mix(-.22, -.08, reach);
    x = mix(x, 820, toPen); y = mix(y, 600 - dn * 4, toPen); ang = mix(ang, -.62, toPen);
    return { x, y, ang, pose: toPen > .5 ? 'write' : (open > .5 ? 'open' : 'reach'), spread: open };
  };
  const handR = (t) => { const toPen = qio(lin(A.agree - .2, A.agree + .6, t)), x = mix(1610, 1220, toPen) + drift(t, 4, 5), y = mix(470, 470, toPen) + drift(t, 3, 6); return { x, y, ang: mix(Math.PI + .12, Math.PI - .18, toPen) }; };
  const nib = (t) => {   // the pen: lies on the sheet, picked up on "agree", nib on the strip on "now"
    const pick = qio(lin(A.agree - .1, A.agree + .55, t)), dn = eout(lin(A.now - .2, A.now + .12, t)), ss = sheetIn(t);
    const rest = [SHEET.x + 120, SHEET.y + 200 + (1 - ss) * 620], held = [mix(1000, 1006, dn), mix(STRIP.y - 60, STRIP.y, dn)];
    return { x: mix(rest[0], held[0], pick), y: mix(rest[1], held[1], pick), lift: pick * (1 - dn) * .8, ang: mix(-2.7, -2.25, pick) };
  };
  const ROS2 = { x: SHEET.x + 40, y: SHEET.y - SHEET.h / 2 + 6 };    // the dawn rosette rises over the sheet's top edge
  const rise = (t) => eout(lin(A.s115a + .15, A.coming + .3, t));
  const tableCam = (t) => {   // top view: glides to the centre during 1.15, tilts up a little for the dawn in 1.15a
    const g1 = qio(lin(A.has - .3, A.agree + .3, t)), g2 = qio(lin(A.s115a, A.comingE + .8, t));
    return { z: mix(1, 1.18, g1) * mix(1, .9, g2) + .006 * Math.sin(t * .4), cx: 960 + drift(t, 8, 1), cy: mix(540, 500, g1) + mix(0, -120, g2) + drift(t, 5, 2) };
  };
  const dawnY = (t) => ROS2.y + 130 - rise(t) * 150;
  const tableToS = (t, x, y) => { const c = tableCam(t); return [960 + (x - c.cx) * c.z, 540 + (y - c.cy) * c.z]; };
  function tableFrame(ctx, t) {
    const { z, cx, cy } = tableCam(t);
    ctx.drawImage(bgLayer('table', '#1b1a3a', '#0f1030', '#04040f', { x: 960, y: 480 }), -100 + drift(t, 6, 7) * .5, -70);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-cx, -cy);
    // the engraved ground: a faint intaglio grain
    ctx.save(); ctx.strokeStyle = 'rgba(160,170,220,.035)'; ctx.lineWidth = 1; for (let y = -200; y < H + 200; y += 9) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.bezierCurveTo(600, y + 6, 1300, y - 6, W + 200, y + 3); ctx.stroke(); } ctx.restore();
    // what people already have: solid engraved deeds on both sides
    const r = prng(5); const sh = (i) => drift(t, 2.2, i);
    deed(ctx, 'house', 300 + sh(1), 330 + sh(2), .9, -.12, {}); deed(ctx, 'share', 250 + sh(3), 740 + sh(4), .78, .09, {}); deed(ctx, 'book', 520 + sh(5), 880, .55, -.3, {});
    deed(ctx, 'book', 1660 + sh(6), 300, .62, .2, {}); deed(ctx, 'share', 1600 + sh(7), 690 + sh(8), .86, -.07, {}); deed(ctx, 'house', 1420 + sh(9), 900, .62, .14, {});
    // the strip: the dotted "yet" line from 1.04, lying in the middle (it becomes the sheet's signature line)
    const ss = sheetIn(t);
    if (ss > 0) {   // the ghost agreement sheet slides in from below, under the strip
      const sy = SHEET.y + (1 - ss) * 640, sx = SHEET.x;
      ctx.save(); ctx.globalAlpha = Math.min(1, ss * 1.5);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(sx - SHEET.w / 2 + 14, sy - SHEET.h / 2 + 18, SHEET.w, SHEET.h);
      const pg = ctx.createLinearGradient(0, sy - SHEET.h / 2, 0, sy + SHEET.h / 2); pg.addColorStop(0, 'rgba(232,215,176,.11)'); pg.addColorStop(1, 'rgba(232,215,176,.05)'); ctx.fillStyle = pg; ctx.fillRect(sx - SHEET.w / 2, sy - SHEET.h / 2, SHEET.w, SHEET.h);
      // dotted engraving of the sheet (border, a small header); brighter where the nib's wave has passed (1.15a)
      const wave = lin(A.now + .05, A.coming + .2, t);
      gBorder(ctx, sx - SHEET.w / 2, sy - SHEET.h / 2, SHEET.w, SHEET.h, { band: 26, lines: 5, waves: 120, col: PAPERC, w: 1, a: .5 + .45 * wave, ghost: 1, dot: 5.5, radius: 12 });
      ctx.font = '600 15px Inter'; try { ctx.letterSpacing = '8px'; } catch { } ctx.textAlign = 'center'; ctx.fillStyle = rgba(PAPERC, .45 + .4 * wave); ctx.fillText('AN AGREEMENT', sx, sy - SHEET.h / 2 + 92);
      ctx.restore();
    }
    // the strip / signature line (dotted, warm); after "now" the nib's contact turns its start solid
    { const y = STRIP.y + (1 - Math.min(1, ss + (ss > 0 ? 0 : 1))) * 0, k = 1 - .4 * ss;
      ctx.save(); for (let x = STRIP.x0; x <= STRIP.x1; x += 7) { const q = (x - STRIP.x0) / (STRIP.x1 - STRIP.x0), tw = .5 + .5 * Math.sin(t * 2.4 + q * 9); ctx.fillStyle = rgba(q < .02 ? CORE : PAPERC, .55 + .3 * tw * k); ctx.beginPath(); ctx.arc(x, y, 1.7, 0, TAU); ctx.fill(); }
      ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createLinearGradient(STRIP.x0, 0, STRIP.x1, 0); lg.addColorStop(0, rgba(AMBER, 0)); lg.addColorStop(.5, rgba(AMBER, .1 * k)); lg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = lg; ctx.fillRect(STRIP.x0 - 40, y - 14, STRIP.x1 - STRIP.x0 + 80, 28);
      ctx.restore(); }
    // 1.15a: from the nib the dotted engraving spreads (dots of light), and a small rosette dawns over the sheet's top edge
    const R2 = rise(t);
    if (R2 > 0) {
      const top = SHEET.y - SHEET.h / 2;
      ctx.save(); ctx.beginPath(); ctx.rect(-400, -400, W + 800, top + 400 - 2); ctx.clip();
      ctx.globalCompositeOperation = 'lighter';
      const ry = dawnY(t), gg = ctx.createRadialGradient(ROS2.x, ry, 0, ROS2.x, ry, 420); gg.addColorStop(0, rgba('#ffd59a', .5 * R2)); gg.addColorStop(.35, rgba(AMBER, .16 * R2)); gg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = gg; ctx.fillRect(ROS2.x - 420, ry - 420, 840, 840);
      rosette(ctx, ROS2.x, ry, { R: 120, A: 18, B: 8, n: 18, m: 7, lines: 26, col: '#ffe2b0', w: .8, a: .75 * R2, rot: t * .05, ghost: 1 - R2 * .6, dot: 5 });
      ring(ctx, ROS2.x, ry, 150, 150, { lines: 5, band: 12, wave: 22, col: '#fff1d6', glow: AMBER, a: .5 * R2, lw: .6, ph: t * .3 });
      ctx.restore();
      // the dawn light washes down over the sheet and reaches both hands on "coming" (a broad soft light, no beams)
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const reach = sm(lin(A.coming - .6, A.coming + .5, t)), RR = mix(260, 820, reach);
      const dg = ctx.createRadialGradient(ROS2.x, top, 0, ROS2.x, top, RR); dg.addColorStop(0, rgba('#ffd59a', .22 * R2)); dg.addColorStop(.55, rgba(AMBER, .08 * R2)); dg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = dg; ctx.fillRect(ROS2.x - RR, top - RR, RR * 2, RR * 2);
      ctx.restore();
      // the dotted engraving spreading from the nib (a ring of dots running outward over the sheet)
      const wv = lin(A.now + .05, A.coming + .4, t); if (wv > 0 && wv < 1) { const n0 = nib(t), rr = 30 + eout(wv) * 620; ctx.save(); ctx.beginPath(); ctx.rect(SHEET.x - SHEET.w / 2, SHEET.y - SHEET.h / 2, SHEET.w, SHEET.h); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
        ghostLine(ctx, ringPts(n0.x, n0.y, rr, 6, 22, t), { ghost: 1, col: '#ffe2b0', a: .6 * (1 - wv), dot: 7, w: 1.6 }); ctx.restore(); }
    }
    // the hands (left ochre, right petrol), the pen
    const hl = handL(t), hr = handR(t), warm = sm(lin(A.coming - .4, A.coming + .5, t));
    const rimL = warm > 0 ? '#ffd59a' : '#e9c08a', n0 = nib(t);
    pen(ctx, n0.x, n0.y, 1.05, { ang: n0.ang, t, lift: n0.lift });
    // the sleeves end in soft folds and dissolve into the dark ~150–250 px behind the wrist (no tube crosses the table)
    fadedHand(ctx, hl.x, hl.y, 1.55, { pose: hl.pose, ang: hl.ang, skin: '#c99a74', sleeve: '#c8843a', rim: rimL, light: [1, -.4], t, seed: 2, spread: hl.pose === 'open' ? 1.2 : undefined, res: z });
    fadedHand(ctx, hr.x, hr.y, 1.55, { pose: 'reach', ang: hr.ang, flip: true, skin: '#7a4f33', sleeve: '#1f5560', rim: warm > 0 ? '#ffd59a' : '#9fc8d0', light: [-1, -.4], t, seed: 5, res: z });
    // the nib's contact on "now": an ink bloom on the line
    { const k = lin(A.now - .05, A.now + .6, t); if (k > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, n0.x, n0.y, 50 + 40 * eout(k), .6 * (1 - k * .5), AMBER, CORE); ctx.restore(); } }
    if (warm > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, hl.x + 110, hl.y - 30, 260, .18 * warm, AMBER, '#ffe2b0'); addGlow(ctx, hr.x - 110, hr.y, 260, .18 * warm, AMBER, '#ffe2b0'); ctx.restore(); }
    ctx.restore();
    motes(ctx, t, 21, 50, .5);
    vignette(ctx, .6);
    { const [zx, zy] = tableToS(A.s116, ROS2.x, dawnY(A.s116)); dipOut(ctx, t, A.s116, .9, zx, zy); }
    { const dk = 1 - sm(lin(A.s114 - .1, A.s114 + .9, t)); if (dk > 0) { const [sx, sy] = tableToS(t, (STRIP.x0 + STRIP.x1) / 2, STRIP.y), g = ctx.createRadialGradient(sx, sy, mix(14, 120, 1 - dk), sx, sy, mix(150, 1400, 1 - dk)); g.addColorStop(0, 'rgba(4,4,14,0)'); g.addColorStop(1, `rgba(4,4,14,${.92 * dk})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); } }
  }

  // ════════════════ 1.16 · how do you share what doesn't exist yet ════════════════
  const R16 = { x: 960, y: 500, R: 300 };
  const nib16 = (t) => { const k = qio(lin(A.yet3e + .1, A.s201 - .05, t)); return { x: mix(1290, R16.x + 6, k) + drift(t, 10, 2) * (1 - k), y: mix(250, R16.y - 6, k) + drift(t, 8, 3) * (1 - k) }; };
  function frame116(ctx, t) {
    ctx.drawImage(bgLayer('e116', '#1a1d4a', '#0d1036', '#04051a', { x: 960, y: 480, ros: [960, 500, 640], rosA: .04 }), -100 + drift(t, 8, 1) * .6, -70 + drift(t, 6, 2) * .6);
    const z = 1 + .03 * lin(A.s116 - .4, A.s201, t);
    ctx.save(); ctx.translate(R16.x, R16.y); ctx.scale(z, z); ctx.translate(-R16.x, -R16.y);
    // the fortune: a dotted rosette breathing
    const br = .5 + .5 * Math.sin(t * 1.6), keep = sm(lin(A.yet3 - .1, A.yet3 + .4, t)) * (1 - sm(lin(A.yet3 + .6, A.yet3 + 1.4, t)));
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const gg = ctx.createRadialGradient(R16.x, R16.y, 0, R16.x, R16.y, 460); gg.addColorStop(0, rgba(AMBER, .12 + .1 * keep)); gg.addColorStop(1, rgba(AMBER, 0)); ctx.fillStyle = gg; ctx.fillRect(R16.x - 460, R16.y - 460, 920, 920); ctx.restore();
    rosette(ctx, R16.x, R16.y, { R: R16.R, A: 36, B: 16, n: 22, m: 9, lines: 22, ghost: 1, col: PAPERC, w: 1.3, a: .62 + .12 * br + .2 * keep, dot: 6.5, rot: t * .02 });
    // three dotted cut lines try, one after another, and smoke away
    const tries = [A.s116 + .15, A.fortune116 - .1, A.fortune116 + .75];
    tries.forEach((t0, i) => {
      const ang = [-2.2, -.45, 1.35][i], draw = eout(lin(t0, t0 + .45, t)), smoke = lin(t0 + .7, t0 + 1.6, t); if (draw <= 0 || smoke >= 1) return;
      const p0 = [R16.x + Math.cos(ang) * (R16.R + 120), R16.y + Math.sin(ang) * (R16.R + 120)], p1 = [R16.x + Math.cos(ang + Math.PI) * 40, R16.y + Math.sin(ang + Math.PI) * 40];
      const pts = []; for (let k = 0; k <= 60; k++) pts.push([mix(p0[0], p1[0], k / 60), mix(p0[1], p1[1], k / 60)]);
      ghostLine(ctx, pts, { u: draw, ghost: 1, smoke: smoke > 0 ? smoke : 0, col: '#ffcf96', w: 2.2, dot: 9, a: .9, t, seed: i + 3 });
      if (draw < 1) { const q = draw, hx = mix(p0[0], p1[0], q), hy = mix(p0[1], p1[1], q); addGlow(ctx, hx, hy, 30, .5, AMBER, CORE); }
    });
    ctx.restore();
    // the pen tip hovering above (the nib, lit)
    const n0 = nib16(t); pen(ctx, n0.x, n0.y, 1.2, { ang: -2.35 + .04 * Math.sin(t * .8), t, lift: .9 }); addGlow(ctx, n0.x, n0.y - 12, 34, .55, AMBER, CORE);
    label(ctx, 'THE FORTUNE THAT DOESN’T EXIST YET', 96, 150, sm(lin(A.s116 + .3, A.s116 + 1.0, t)) * (1 - sm(lin(A.s201 - .6, A.s201 - .2, t))), { size: 20, spacing: 6, col: '#ffd59a' });
    motes(ctx, t, 31, 60, .5);
    vignette(ctx, .58);
    dipIn(ctx, t, A.s116, .9); { const nn = nib16(A.s201); dipOut(ctx, t, A.s201, .8, nn.x, nn.y, 6); }
  }

  // ════════════════ 2.01 · three ways (the paths) ════════════════
  const FORK = { x: 760, y: 690 };
  const p201 = (t) => {
    const trunk = eout(lin(A.s201 - .25, A.three - .02, t)), split = eout(lin(A.three - .05, A.ways + .35, t)), race = ei5(lin(A.s202 - .55, A.s202 + .05, t));
    return { trunk, u: [split * mix(1, 1, 0), split, split], cam: { x: -race * 1500 + drift(t, 20, 1), y: race * 900, z: 1 + race * .35 } };
  };
  function frame201(ctx, t) {
    const P = p201(t);
    const r = paths(ctx, t, { view: 'persp', fork: FORK, cam: P.cam, u: P.u, trunk: mix(.84, 1, P.trunk), fog: .45, life: { take: .5 * P.u[0], print: .5 * P.u[1], agree: .6 * P.u[2] }, labelA: sm(lin(A.ways - .1, A.ways + .3, t)) });
    // the nib draws the trunk (from the push-in it arrives big and settles to the drawing head)
    if (P.trunk < 1) { const p = r.along('trunk', mix(.84, 1, P.trunk)), s = mix(1.9, 1.0, eout(lin(A.s201 - .45, A.s201 + .25, t))); pen(ctx, p.x, p.y, s, { ang: -2.1, t, lift: 0 }); addGlow(ctx, p.x, p.y, 40, .7, AMBER, CORE); }
    else { const k = lin(A.three, A.three + .6, t), p = r.along('trunk', 1); pen(ctx, p.x + k * 40, p.y - k * 30, mix(1, .9, k), { ang: -2.1, t, lift: k }); }
    motes(ctx, t, 41, 50, .45);
    vignette(ctx, .5);
    dipIn(ctx, t, A.s201, .8);
  }

  // ════════════════ 2.02 – 2.08 · TAKE ════════════════
  const ROSE = { R: 300, A: 38, B: 17, n: 22, m: 9, lines: 34 };
  function bigRosette(ctx, x, y, s, t, o = {}) {   // the big AI companies (engraved, cream with rust), cached; o.half 0..1 rust share of the right half
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, 470); gg.addColorStop(0, rgba(RUST, .16)); gg.addColorStop(.6, rgba(RUST, .05)); gg.addColorStop(1, rgba(RUST, 0)); ctx.fillStyle = gg; ctx.fillRect(-470, -470, 940, 940);
    ctx.globalCompositeOperation = 'lighter';
    rosette(ctx, 0, 0, { ...ROSE, col: '#f3e3cf', w: .75, a: .55, rot: (o.rot ?? 0), cache: true });
    rosette(ctx, 0, 0, { R: 150, A: 26, B: 10, n: 16, m: 7, lines: 24, col: '#f0a07c', w: .7, a: .5, rot: -(o.rot ?? 0) * 1.4, cache: true });
    ctx.restore();
  }
  // 2.02: arrival on the TAKE path, the big rosette, a rust hand grips its rim on "take"
  const ROS202 = { x: 1120, y: 520 };
  const bill = (t) => { const k = qio(lin(A.s203 - .75, A.s203 + .35, t)), settle = eout(lin(A.s203 + .3, A.s203 + 1.2, t)); return { x: mix(-520, 700, k) + settle * 0, y: mix(560, 560, k), s: mix(1.18, 1.08, k) - settle * .25, rot: mix(-.2, -.045, k) }; };
  function frame202(ctx, t) {
    const land = eo5(lin(A.s202 - .2, A.s202 + .6, t)), exitR = ei5(lin(A.s203 - 1.0, A.s203 - .3, t)) * 1500;
    ctx.drawImage(bgLayer('take', '#2a1830', '#130f2c', '#05040f', { x: 1100, y: 480, ros: [1100, 520, 700], rosCol: '#e0a080', rosA: .04 }), -100 + drift(t, 8, 1) * .6 - (1 - land) * 60, -70);
    // the TAKE band from above, running across under the rosette: the race of 2.01 lands on it and slows down (motion match)
    { const t0 = A.s202 - .2, tau = t < t0 ? (t - t0) : (1 - Math.exp(-(t - t0) * 3)) / 3 + (t - t0) * .02, dx = -.928, dy = .372, v0 = 2300;
      paths(ctx, t, { view: 'top', rot: .37, fork: { x: 960, y: 905 }, cam: { x: -1620 + dx * v0 * (tau - .353) - exitR / .88, y: 1257 + dy * v0 * (tau - .353), z: 2.1 }, u: [1, 0, 0], trunk: 0, fog: 0, bg: false, labels: false, life: { take: 0 }, a: .8 }); }
    const grip = eout(lin(A.take2 - .25, A.take2 + .15, t)), pull = sm(lin(A.take2 + .1, A.take2 + .9, t));
    ctx.save(); ctx.translate(exitR, 0);
    bigRosette(ctx, ROS202.x - pull * 26, ROS202.y, 1 + .015 * Math.sin(t * .7), t, { rot: t * .03 });
    label(ctx, 'THE BIG AI COMPANIES', 96, 150, sm(lin(A.s202 + .2, A.s202 + .8, t)), { size: 20, spacing: 6, col: '#f0b8a0' });
    // the hand: from the left, open → grip on the rim
    const hx = mix(-140, ROS202.x - 420, eout(lin(A.s202 + .2, A.take2 + .05, t))) - pull * 30, hy = ROS202.y + 40 + drift(t, 5, 3);
    fadedHand(ctx, hx, hy, 2.1, { pose: grip > .5 ? 'grip' : 'reach', close: grip * .4, ang: -.05, skin: '#b98762', sleeve: '#c4512e', rim: '#ffcf96', light: [1, -.5], t, seed: 7, fade0: 60, fade1: 115 });
    if (grip > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, hx + 150, hy - 10, 120, .3 * grip * (1 - pull * .6), RUST, '#ffd0b0'); ctx.restore(); }
    ctx.restore();
    // the bill slides in over everything (carrier into 2.03)
    const b = bill(t); if (t > A.s203 - .8) billSheet(ctx, b.x, b.y, b.s, b.rot, t, {});
    motes(ctx, t, 51, 40, .4, '255,200,170');
    vignette(ctx, .55);
  }
  // 2.03: the bill; a page turns; a paragraph lights (it is the tax paid in new shares) → push in
  const PARA = { t: A.s204 };
  const paraAt = (t) => { const b = bill(t), x = b.x + drift(t, 4, 2), y = b.y + drift(t, 3, 3); return [x + 37 * b.s * Math.sin(b.rot), y - 37 * b.s * Math.cos(b.rot)]; };
  function frame203(ctx, t) {
    ctx.drawImage(bgLayer('bill', '#22182c', '#110d24', '#04030c', { x: 700, y: 520 }), -100 + drift(t, 6, 1) * .5, -70);
    const b = bill(t), turn = eio(lin(A.bill - .55, A.bill + .35, t)), hi = sm(lin(A.bill + .35, A.s204 - .25, t));
    const r = billSheet(ctx, b.x + drift(t, 4, 2), b.y + drift(t, 3, 3), b.s, b.rot, t, { turn, hi });
    PARA.x = r.para[0]; PARA.y = r.para[1];
    const la = sm(lin(A.s203 + .15, A.s203 + .7, t));
    text(ctx, 'Bernie Sanders', 1250, 470 + (1 - la) * 16, { size: 64, font: 'Instrument Serif', color: rgba(CREAM, la) });
    label(ctx, 'US SENATOR  ·  BILL, JUNE 2026', 1254, 520, la, { size: 18, spacing: 4, col: '#f0b8a0' });
    ctx.save(); ctx.fillStyle = rgba(RUST, .9 * la); ctx.fillRect(1254, 545, 220 * la, 2); ctx.restore();
    motes(ctx, t, 61, 40, .4, '255,210,180');
    vignette(ctx, .55);
    { const [px, py] = paraAt(A.s204); dipOut(ctx, t, A.s204, .8, px, py); }
  }
  // 2.04: from the rosette new shares are engraved and fly into the PUBLIC FUND; the rust half follows on "half"
  const R204 = { x: 640, y: 500, s: .86 }, BOX = { x: 1440, y: 900, s: .86 };
  const shares204 = (() => { const out = []; for (let i = 0; i < 7; i++) out.push({ t0: A.newShares - .55 + i * .28, a: -1.2 + i * .42 }); return out; })();
  function frame204(ctx, t) {
    ctx.drawImage(bgLayer('fund', '#1e1838', '#0e0c28', '#04030c', { x: 900, y: 480, ros: [640, 500, 560], rosCol: '#e0a080', rosA: .03 }), -100 + drift(t, 8, 1) * .5, -70 + drift(t, 5, 2) * .5);
    const out = ei5(lin(A.s205 - .55, A.s205 + .1, t)), z = 1 + .02 * lin(A.s204, A.s205, t);
    ctx.save(); ctx.translate(960, 540); ctx.scale(z, z); ctx.translate(-960, -540);
    const fb = fundBox(ctx, BOX.x + out * 900, BOX.y, BOX.s, t, { fill: lin(A.newShares, A.companies, t), glow: .4 + .6 * sm(lin(A.half1, A.half1 + .8, t)) });
    // the rosette with its right half turning rust on "half", then that half travels into the box in steps
    const halfK = sm(lin(A.half1 - .15, A.half1 + .35, t)), steps = lin(A.half1 + .4, A.companies + .1, t), st = (Math.floor(steps * 3) + eio((steps * 3) % 1)) / 3;
    bigRosette(ctx, R204.x, R204.y, R204.s, t, { rot: t * .03 });
    if (halfK > 0) {
      const hx = mix(R204.x, fb.mouth[0] - 40, steps >= 1 ? 1 : st), hy = mix(R204.y, fb.mouth[1] - 10, steps >= 1 ? 1 : st), hs = mix(R204.s, .18, steps >= 1 ? 1 : st);
      ctx.save(); ctx.globalAlpha = 1 - sm(lin(.9, 1, steps));
      ctx.translate(hx, hy); ctx.scale(hs / R204.s, hs / R204.s); ctx.translate(-R204.x, -R204.y);
      ctx.beginPath(); ctx.rect(R204.x, R204.y - 400, 420 * Math.min(1, halfK * 1.5), 800); ctx.clip();
      ctx.fillStyle = rgba(RUST, .18 * halfK); ctx.beginPath(); ctx.arc(R204.x, R204.y, ROSE.R * R204.s * 1.12, -Math.PI / 2, Math.PI / 2); ctx.fill();
      ctx.globalCompositeOperation = 'lighter'; rosette(ctx, R204.x, R204.y, { ...ROSE, R: ROSE.R * R204.s, A: ROSE.A * R204.s, B: ROSE.B * R204.s, col: '#ff8a5c', w: 1, a: .7 * halfK, rot: t * .03, cache: false });
      ctx.restore();
      // the edge of the cut: a rust line down the middle
      if (steps < 1) { ctx.save(); ctx.strokeStyle = rgba('#ff9a6c', .8 * halfK); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R204.x, R204.y - 300 * R204.s); ctx.lineTo(R204.x, R204.y + 300 * R204.s); ctx.stroke(); ctx.restore(); }
    }
    // new shares: engraved out of the rosette's rim and flying in arcs into the box
    shares204.forEach((sh, i) => { const k = lin(sh.t0, sh.t0 + 1.25, t); if (k <= 0 || k >= 1) return;
      const born = eout(lin(0, .2, k)), fly = qio(lin(.15, 1, k)), sx = R204.x + Math.cos(sh.a) * 290 * R204.s, sy = R204.y + Math.sin(sh.a) * 290 * R204.s;
      const x = mix(sx, fb.mouth[0], fly), y = mix(sy, fb.mouth[1], fly) - Math.sin(fly * Math.PI) * 220;
      miniCert(ctx, x, y, mix(.2, .95, born) * mix(1, .8, fly), (1 - fly) * (i % 2 ? .4 : -.3) + fly * .2, { glow: 1 - fly });
      if (born < 1) addGlow(ctx, sx, sy, 50, .6 * (1 - born), AMBER, CORE); });
    ctx.restore();
    // labels: what the bill does (sourced)
    const la = sm(lin(A.s204 + .2, A.s204 + .9, t)), lb = sm(lin(A.half1 - .1, A.half1 + .5, t));
    label(ctx, 'A TAX, PAID IN NEW SHARES', 96, 150, la, { size: 20, spacing: 6, col: '#f0b8a0' });
    text(ctx, '50 %', 96, 270 + (1 - lb) * 14, { size: 110, font: 'Instrument Serif', color: rgba('#ff9a6c', lb) });
    label(ctx, 'OF THE BIG AI COMPANIES, ONCE', 100, 318, lb, { size: 18, spacing: 5, col: CREAM });
    source(ctx, 'American AI Sovereign Wealth Fund Act, introduced June 18, 2026', la);
    motes(ctx, t, 71, 50, .45);
    vignette(ctx, .55);
    dipIn(ctx, t, A.s204, .8);
  }
  // 2.05: polls: four rows of three; in each row two raise a hand on "two in three"
  const crowd = (() => { const out = [], r = prng(44); for (let row = 0; row < 4; row++) for (let c = 0; c < 3; c++) { const depth = row / 3, s = mix(1.55, .7, depth); out.push({ row, c, x: 960 + (c - 1) * mix(300, 170, depth) + (r() - .5) * 30 + (row % 2 ? 40 : -30), y: mix(830, 470, depth), s, raise: c !== (row + 1) % 3, seed: row * 3 + c + 1, delay: r() * .25, col: ['#2c3456', '#33305a', '#2a3a58', '#3a3150'][Math.floor(r() * 4)] }); } return out.sort((a, b) => b.row - a.row); })();
  const upOf = (f, t) => eout(lin(A.twoInThree + f.delay * .6 - .05, A.twoInThree + f.delay * .6 + .45, t)) * (f.raise ? 1 : 0);
  const poseOf = (u) => ({ sh: [mix(.18, .7, u), mix(.08, .55, u)], el: [mix(.32, 1.25, u), mix(.26, 1.2, u)], head: .1 * u });
  const crowdX = (f, t) => { const enter = eo5(lin(A.s205 - .3, A.s205 + .5, t)); return f.x + drift(t, 10, 2) * (1 - f.row * .2) - (1 - enter) * 300 * (1 - f.row * .2); };
  const HERO = crowd.find((f) => f.row === 0 && f.raise && f.c === 1) || crowd.find((f) => f.row === 0 && f.raise);
  const cardAt = (f, t) => { const u = upOf(f, t), [hx, hy] = handPos(crowdX(f, t), f.y, f.s, poseOf(u), 0, false, { t }); return [hx + 10 * f.s, hy - 14 * f.s]; };
  const rising = (t) => { const k = lin(A.s206 - .9, A.s206 + .5, t), t0 = A.s206 - .9, [sx, sy] = cardAt(HERO, t0); return { k, x: sx + k * 60, y: mix(sy, -260, ein(k)), s: mix(.42 * HERO.s, 1.1, sm(k)) }; };
  function frame205(ctx, t) {
    ctx.drawImage(bgLayer('poll', '#232650', '#11133a', '#05061a', { x: 960, y: 380 }), -100 + drift(t, 6, 1) * .5, -70);
    // the floor: an engraved chart plane in perspective
    ctx.save(); ctx.strokeStyle = 'rgba(170,180,230,.08)'; ctx.lineWidth = 1; for (let i = -10; i <= 10; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 40, 380); ctx.lineTo(960 + i * 260, H); ctx.stroke(); } for (const y of [420, 470, 540, 640, 780, 960]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } ctx.restore();
    { const g = ctx.createRadialGradient(960, 300, 0, 960, 300, 900); g.addColorStop(0, rgba('#ffd59a', .16)); g.addColorStop(1, 'rgba(255,213,154,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    const rs = rising(t);
    for (const f of crowd) {
      const up = upOf(f, t), pose = poseOf(up), fx = crowdX(f, t);
      figureFlat(ctx, fx, f.y, f.s, pose, { t, seed: f.seed, col: up > .3 ? mix3(f.col, '#4a3a5a', up) : f.col, rim: up > .3 ? '#ffd59a' : '#9fb0d8', rimSide: 1, shade: .55 });
      if (up > 0 && !(f === HERO && rs.k > 0)) { const [cx2, cy2] = cardAt(f, t); ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, cx2, cy2, 70 * f.s, .3 * up, AMBER, CORE); ctx.restore(); miniCert(ctx, cx2, cy2, .42 * f.s * mix(.6, 1, up), -.12, { glow: .5 * up, a: up, shadow: false }); }
    }
    const la = sm(lin(A.twoInThree - .1, A.twoInThree + .5, t)), lp = sm(lin(A.s205 + .15, A.s205 + .75, t));
    label(ctx, 'IN POLLS, ROUGHLY', 124, 136, lp, { size: 18, spacing: 6, col: '#ffd59a' });
    text(ctx, '2 in 3', 120, 250 + (1 - la) * 14, { size: 110, font: 'Instrument Serif', color: rgba('#ffd59a', la) });
    label(ctx, 'AMERICANS SUPPORT IT', 124, 298, la, { size: 18, spacing: 6 });
    source(ctx, 'Verasight poll, June 2026 (69 % in favour)', la);
    // a share rises from a raised hand (carrier into 2.06)
    if (rs.k > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, rs.x, rs.y, 90, .45, AMBER, CORE); ctx.restore(); miniCert(ctx, rs.x, rs.y, rs.s, -.12 + rs.k * .3, { glow: .6 }); }
    motes(ctx, t, 81, 50, .45);
    vignette(ctx, .55);
  }
  // 2.06: the rosette grows into dotted future rings; slices from them engrave solid on the way to the fund
  const R206 = { x: 820, y: 600 }, BOX6 = { x: 1540, y: 960, s: .7 };   // the rings keep clear of the two text lines top-left
  function frame206(ctx, t) {
    ctx.drawImage(bgLayer('future', '#1a1c48', '#0c0d30', '#04040f', { x: 760, y: 520 }), -100 + drift(t, 8, 1) * .5, -70);
    const grow = eo5(lin(A.future - .3, A.future + .9, t)), z = 1 - .04 * grow;
    ctx.save(); ctx.translate(R206.x, R206.y); ctx.scale(z, z); ctx.translate(-R206.x, -R206.y);
    const fb = fundBox(ctx, BOX6.x, BOX6.y, BOX6.s, t, { fill: .9, glow: .3 + .5 * sm(lin(A.later, A.well, t)) });
    bigRosette(ctx, R206.x, R206.y, .62, t, { rot: t * .03 });
    // future rings (ghost) growing outward
    const rings = [250, 330, 410];
    rings.forEach((Rr, i) => { const g = eo5(lin(A.future - .3 + i * .18, A.future + .7 + i * .18, t)); if (g <= 0) return;
      ghostLine(ctx, ringPts(R206.x, R206.y, Rr * mix(.7, 1, g), 9, 26 + i * 6, t * .2 + i), { ghost: 1, col: PAPERC, a: .8 * g, dot: 6.5, w: 1.9 });
      ghostLine(ctx, ringPts(R206.x, R206.y, Rr * mix(.7, 1, g) - 12, 7, 26 + i * 6, -t * .15 + i * 2), { ghost: 1, col: '#ffd59a', a: .3 * g, dot: 6.5, w: 1.2 }); });
    // the share from 2.05 drops into the outer ring
    { const k = lin(A.s206 - .45, A.s206 + .7, t), gone = sm(lin(A.s206 + .55, A.s206 + 1.0, t)); if (k > 0 && gone < 1) { const y = mix(-200, R206.y - 410, eo5(k)), x = R206.x + 40; miniCert(ctx, x, y, mix(1.1, .55, eo5(k)) * (1 - gone * .5), .18 - k * .2, { glow: 1 - k * .5, a: 1 - gone }); if (k >= 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, x, y, 90, .5 * (1 - gone), AMBER, CORE); ctx.restore(); } } }
    // slices of the future rings leave for the fund and engrave solid on the way (on "later")
    for (let i = 0; i < 3; i++) { const t0 = A.later - .5 + i * .45, k = lin(t0, t0 + 1.5, t); if (k <= 0 || k >= 1) continue;
      const Rr = rings[i], a0 = -.5 + i * .35, am = a0 + .25, fly = qio(lin(.1, 1, k)), cx = mix(R206.x + Math.cos(am) * Rr, fb.mouth[0], fly), cy = mix(R206.y + Math.sin(am) * Rr, fb.mouth[1], fly) - Math.sin(fly * Math.PI) * 160, sc = mix(1.25, .3, fly);
      const solid = sm(lin(.15, .7, k));
      { const Mx = Math.cos(am) * Rr, My = Math.sin(am) * Rr, poly = []; for (let j = 0; j <= 14; j++) { const a = a0 + j / 14 * .5; poly.push([Math.cos(a) * (Rr + 22), Math.sin(a) * (Rr + 22)]); } for (let j = 14; j >= 0; j--) { const a = a0 + j / 14 * .5; poly.push([Math.cos(a) * (Rr - 22), Math.sin(a) * (Rr - 22)]); }
        ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc); ctx.translate(-Mx, -My); ctx.beginPath(); poly.forEach(([px, py], j) => j ? ctx.lineTo(px, py) : ctx.moveTo(px, py)); ctx.closePath();
        ctx.fillStyle = rgba(AMBER, .08 + .2 * solid); ctx.fill(); ctx.strokeStyle = rgba(CORE, .25 + .6 * solid); ctx.lineWidth = 1.4 / sc; ctx.stroke(); ctx.restore(); }
      for (const dr of [-14, 0, 14]) { const pts = []; for (let j = 0; j <= 40; j++) { const a = a0 + j / 40 * .5, r0 = Rr + dr + 9 * Math.sin(a * (26 + i * 6)); pts.push([cx + (Math.cos(a) * r0 - Math.cos(am) * Rr) * sc, cy + (Math.sin(a) * r0 - Math.sin(am) * Rr) * sc]); }
        ghostLine(ctx, pts, { ghost: 1 - solid, col: dr ? '#f3e3cf' : '#ffd59a', w: (dr ? 1.6 : 2.8) * sc + .6, dot: 6, a: .95, glow: AMBER }); }
      if (solid > .2) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, cx, cy, 70 * sc + 20, .35 * solid * (1 - fly), AMBER, CORE); ctx.restore(); }
    }
    ctx.restore();
    const la = sm(lin(A.later - .2, A.later + .4, t)), lf = sm(lin(A.future - .2, A.future + .4, t));
    label(ctx, 'THE FUTURE, TOO', 96, 150, lf, { size: 20, spacing: 6, col: '#ffd59a' });
    text(ctx, 'also taxes shares created later', 96, 222 + (1 - la) * 14, { size: 54, font: 'Instrument Serif', color: rgba(CREAM, la) });
    motes(ctx, t, 91, 50, .45);
    vignette(ctx, .55);
    dipOut(ctx, t, A.s207, .8, R206.x + 410 * .96, R206.y);
  }
  // 2.07: the rosette resists: the hand pulls half of it away, the engraving stretches like cloth and tears in rust on "half"
  const R207 = { x: 900, y: 500, R: 330 }, G7 = guilloche({ R: R207.R, A: 40, B: 18, n: 22, m: 9, lines: 30, steps: 540 }), G7L = Array.from({ length: 30 }, (_, k) => G7.line(k));
  function frame207(ctx, t) {
    ctx.drawImage(bgLayer('tear', '#24162c', '#120d26', '#04030c', { x: 900, y: 480 }), -100 + drift(t, 6, 1) * .5, -70);
    const pull = sm(lin(A.s207 + .1, A.half2, t)), torn = eout(lin(A.half2, A.half2 + .35, t)), fall = ein(lin(A.exists - .4, A.s208 + .2, t));
    const stretch = pull * 70 * (1 - torn) + torn * 190, shake = (1 - torn) * pull * Math.sin(t * 40) * 2;
    ctx.save(); ctx.translate(drift(t, 6, 2), drift(t, 4, 3));
    // glow behind
    const gg = ctx.createRadialGradient(R207.x, R207.y, 0, R207.x, R207.y, 520); gg.addColorStop(0, rgba(RUST, .16 + .2 * pull)); gg.addColorStop(1, rgba(RUST, 0)); ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
    ctx.lineJoin = 'round'; ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 30; k++) {
      const L = G7L[k], col = k % 3 === 0 ? '#f0a07c' : '#f3e3cf';
      for (const side of [-1, 1]) {
        ctx.strokeStyle = rgba(side > 0 ? (torn > 0 ? '#ff9a6c' : col) : col, .5 + .2 * pull); ctx.lineWidth = .8; ctx.beginPath(); let started = false;
        for (let i = 0; i < L.length; i++) { const [lx, ly] = L[i]; const right = lx > 0; if ((side > 0) !== right && torn > .02) { started = false; continue; }
          // stretch: points right of centre are dragged right, more the closer they are to the centre line (cloth)
          const f = right ? 1 : 0, near = Math.exp(-Math.abs(lx) / 120), dx = right ? stretch * (1 - near * .3 * (1 - torn)) : -stretch * .12 * near * (1 - torn);
          const fy = fall * (right ? 900 : 760) * (right ? 1 : 1.1), x = R207.x + lx + dx + shake * f, y = R207.y + ly + fy;
          started ? ctx.lineTo(x, y) : (ctx.moveTo(x, y), started = true); }
        ctx.stroke(); if (torn <= .02) break;
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // tension lines between the halves (before the tear), the rust edge and fibres after
    if (pull > .1 && torn < 1) { ctx.save(); ctx.strokeStyle = rgba('#ffcfb0', .35 * pull * (1 - torn)); ctx.lineWidth = .7; for (let i = -14; i <= 14; i++) { const y = R207.y + i * 20; ctx.beginPath(); ctx.moveTo(R207.x - 20, y); ctx.lineTo(R207.x + stretch * .9, y + Math.sin(i) * 4); ctx.stroke(); } ctx.restore(); }
    if (torn > 0) { const r = prng(7); ctx.save(); ctx.strokeStyle = rgba(RUST, .95); ctx.lineWidth = 2.4; for (const side of [-1, 1]) { ctx.beginPath(); for (let i = 0; i <= 40; i++) { const y = R207.y - 360 + i * 18, x = R207.x + (side > 0 ? stretch : 0) + (r() - .5) * 16; const yy = y + fall * (side > 0 ? 900 : 836); i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
      ctx.globalCompositeOperation = 'lighter'; for (let i = 0; i < 40; i++) { const k = (t - A.half2) * (1 + r()) * 1.4, x = R207.x + stretch / 2 + (r() - .5) * 60 + k * (r() - .5) * 300, y = R207.y + (r() - .5) * 600 + k * k * 300; ctx.fillStyle = rgba(r() < .5 ? '#ff9a6c' : '#ffe0c8', (1 - clamp(k)) * .8); ctx.fillRect(x, y, 2, 2); } ctx.restore(); }
    ctx.restore();
    // the hand gripping the right rim, pulling
    const hx = R207.x + R207.R + 120 + stretch, hy = R207.y + 20 + fall * 900;
    fadedHand(ctx, hx, hy, 2.1, { pose: 'grip', close: .3, ang: Math.PI + .05, flip: true, skin: '#b98762', sleeve: '#c4512e', rim: '#ffcf96', light: [-1, -.4], t, seed: 9, fade0: 60, fade1: 115 });
    label(ctx, 'WHAT ALREADY EXISTS', 96, 150, sm(lin(A.s207 + .3, A.s207 + .9, t)) * (1 - fall), { size: 20, spacing: 6, col: '#f0b8a0' });
    motes(ctx, t, 101, 40, .4, '255,200,170');
    vignette(ctx, .55);
    dipIn(ctx, t, A.s207, .8);
  }
  // 2.08: the fund on the US paper map: file stacks rise ("years in court"), the border lights up and holds a share that wants out
  const MAPCAM = { ...region('USA', .62), rot: -.03, tilt: .52, x: 960, y: 560, f: 1500 };
  const mapLayer = () => once('c03map', () => { const [c, g] = canvas(W, H); g.fillStyle = '#120e14'; g.fillRect(0, 0, W, H); worldMap(g, MAPCAM, { t: 0, borders: true, light: [W * .62, H * .2], detail: '50m', highlight: ['USA'], dim: .45 }); g.globalCompositeOperation = 'multiply'; g.fillStyle = '#b3abc9'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over'; const vg = g.createRadialGradient(BOX8.x, BOX8.y, 300, BOX8.x, BOX8.y, 1250); vg.addColorStop(0, 'rgba(10,8,26,0)'); vg.addColorStop(1, 'rgba(10,8,26,.62)'); g.fillStyle = vg; g.fillRect(0, 0, W, H); return c; });
  const usBorder = (() => { const cn = country('USA', '50m'); let best = null; for (const p of cn.polys) { const r0 = p[0]; if (!(r0[0][0] > -130 && r0[0][1] < 50)) continue; if (!best || r0.length > best.length) best = r0; } return best.map(([lon, lat]) => { const [x, y] = project(MAPCAM, lon, lat); return [x, y]; }); })();
  const BOX8 = (() => { const [x, y] = project(MAPCAM, -97, 38.5); return { x, y }; })();
  const borderBits = (() => { const r = prng(12), out = []; for (let i = 0; i < 52; i++) { const j = Math.floor(r() * usBorder.length), [x, y] = usBorder[j]; out.push({ x: x + (r() - .5) * 14, y: y + (r() - .5) * 8, rot: (r() - .5) * 1.4, s: .22 + r() * .08 }); } return out; })();
  const stacks = [[-300, 40, 9], [-180, -80, 7], [210, -60, 8], [330, 50, 10], [-80, 130, 6], [120, 140, 7]];
  const southPt = (() => { const [x, y] = project(MAPCAM, -103.5, 29.6); return { x, y }; })();
  function frame208(ctx, t) {
    const enter = eo5(lin(A.s208 - .3, A.s208 + .7, t)), whip = ei5(lin(A.end - .55, A.end + .15, t));
    const z = 1.04 + .03 * lin(A.s208, A.end, t), ox = drift(t, 8, 1) + whip * 700, oy = drift(t, 5, 2) + (1 - enter) * -60;
    ctx.save(); ctx.translate(960 + ox, 560 + oy); ctx.scale(z, z); ctx.translate(-960, -560);
    ctx.drawImage(mapLayer(), 0, 0);
    if (whip > .02) { ctx.save(); ctx.globalAlpha = .2 * whip; for (let k = 1; k <= 3; k++) ctx.drawImage(mapLayer(), -k * 70 * whip, 0); ctx.restore(); }
    // the tiny share certificates from H.07 lying along the border
    for (const b of borderBits) miniCert(ctx, b.x, b.y, b.s, b.rot, { shadow: false, a: .9 });
    // the border lights up on "border" and holds a share that wants out
    const bg = sm(lin(A.border - .25, A.border + .2, t)), pulse = .8 + .2 * Math.sin(t * 6);
    if (bg > 0) { const G = once('c03borderglow', () => { const [c, g] = canvas(W, H); g.lineJoin = 'round'; g.globalCompositeOperation = 'lighter'; for (const [w, al] of [[16, .12], [6, .32], [2, .95]]) { g.strokeStyle = rgba(w < 3 ? CORE : AMBER, al); g.lineWidth = w; strokePoly(g, usBorder); } return c; });
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, bg * pulse); ctx.drawImage(G, 0, 0); ctx.restore(); }
    // the fund on the map, the stacks around it
    const stackH = (i) => eout(lin(A.court - .15 + i * .09, A.courtE + .3 + i * .09, t)) * stacks[i][2];
    stacks.forEach((s, i) => { if (s[1] < 0) fileStack(ctx, BOX8.x + s[0], BOX8.y + s[1], .62, stackH(i), t, { seed: i + 2 }); });
    const fb = fundBox(ctx, BOX8.x, BOX8.y + 30, .42, t, { fill: 1, glow: .35 });
    stacks.forEach((s, i) => { if (s[1] >= 0) fileStack(ctx, BOX8.x + s[0], BOX8.y + s[1], .7, stackH(i), t, { seed: i + 2 }); });
    // the rust half from 2.07 lands in the box at the start
    { const k = lin(A.s208 - .5, A.s208 + .45, t); if (k > 0 && k < 1) { const y = mix(-120, fb.mouth[1], ein(k)); ctx.save(); ctx.globalCompositeOperation = 'lighter'; rosette(ctx, fb.mouth[0], y, { R: 60, A: 9, B: 4, n: 12, m: 5, lines: 14, col: '#ff9a6c', w: .8, a: .8 * (1 - k * .6) }); ctx.restore(); } }
    // the share that wants out: leaves the box toward the southern border, is stopped and settles back a little
    { const k = lin(A.border - .9, A.border + .1, t), back = eout(lin(A.border + .1, A.border + .6, t)); if (k > 0) { const go = qio(k), x = mix(fb.mouth[0], southPt.x, go * mix(1, .93, back)), y = mix(fb.mouth[1], southPt.y - 6, go * mix(1, .93, back)) - Math.sin(go * Math.PI) * 50;
      miniCert(ctx, x, y, .42, -.2 + go * .3, { col: '#c4512e', glow: .5 }); if (k >= 1) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; addGlow(ctx, southPt.x, southPt.y, 70, .5 * (1 - back * .5), AMBER, CORE); ctx.restore(); } } }
    ctx.restore();
    // lamp light, labels
    { const g = ctx.createRadialGradient(W * .64, H * .1, 0, W * .6, H * .3, 1400); g.addColorStop(0, 'rgba(255,200,140,.18)'); g.addColorStop(1, 'rgba(255,170,100,0)'); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    const lc = sm(lin(A.court - .1, A.court + .5, t)) * (1 - whip), lb = sm(lin(A.border - .1, A.border + .4, t)) * (1 - whip);
    { const pa = Math.max(lc, lb); if (pa > 0) { ctx.save(); ctx.fillStyle = `rgba(10,10,30,${.72 * pa})`; ctx.beginPath(); ctx.roundRect(72, 112, 470, 62 + 42 * lb, 10); ctx.fill(); ctx.restore(); } }
    label(ctx, 'YEARS IN COURT?', 96, 150, lc, { size: 20, spacing: 6, col: '#f0b8a0' });
    label(ctx, 'ONLY INSIDE THE US', 96, 192, lb, { size: 20, spacing: 6, col: '#ffd59a' });
    // the tear back to the fork: smear to the right
    vignette(ctx, .55);
  }

  // ════════════════ the shot list ════════════════
  const cutIn = { tr: 'cut', d: .1 };
  return [
    { t: CIN.into.t, tr: CIN.into.tr, x: CIN.into.x, y: CIN.into.y, d: CIN.into.d, draw: (ctx, t) => plateFrame(ctx, t), print: { riso: .3 } },   // 1.02
    { t: A.s103, ...cutIn, draw: (ctx, t) => plateFrame(ctx, t), print: { riso: .3 } },                                                           // 1.03 (plan sequence)
    { t: A.s104, ...cutIn, draw: (ctx, t) => plateFrame(ctx, t), print: { riso: .3 }, sound: [{ f: 'foil_glint', t: A.s104 - .1, v: .2 }] },                                                           // 1.04
    { t: A.s114, tr: 'out', x: (STRIP.x0 + STRIP.x1) / 2, y: STRIP.y, depth: 5, d: .9, draw: (ctx, t) => tableFrame(ctx, t), print: { riso: .3 } },  // 1.14
    { t: A.s115, ...cutIn, draw: (ctx, t) => tableFrame(ctx, t), print: { riso: .3 } },                                                           // 1.15
    { t: A.s115a, ...cutIn, draw: (ctx, t) => tableFrame(ctx, t), print: { riso: .3 }, sound: [{ f: 'bloom', t: A.comingE + .25, v: .16 }] },                                                          // 1.15a
    { t: A.s116, tr: 'zoom', x: tableToS(A.s116, ROS2.x, dawnY(A.s116))[0], y: tableToS(A.s116, ROS2.x, dawnY(A.s116))[1], depth: 5, d: .9, draw: (ctx, t) => frame116(ctx, t) },                                   // 1.16
    { t: A.s201, tr: 'zoom', x: nib16(A.s201).x, y: nib16(A.s201).y, depth: 6, d: .8, draw: (ctx, t) => frame201(ctx, t) },                                             // 2.01
    { t: A.s202, tr: 'whipR', d: .3, draw: (ctx, t) => frame202(ctx, t) },                                                                       // 2.02
    { t: A.s203 - .3, tr: 'cut', d: .12, draw: (ctx, t) => frame203(ctx, t) },                                                                   // 2.03 (the bill carries over)
    { t: A.s204, tr: 'zoom', x: paraAt(A.s204)[0], y: paraAt(A.s204)[1], depth: 5, d: .8, draw: (ctx, t) => frame204(ctx, t) },   // 2.04
    { t: A.s205, tr: 'right', d: .55, draw: (ctx, t) => frame205(ctx, t) },                                                                      // 2.05
    { t: A.s206, tr: 'up', d: .5, draw: (ctx, t) => frame206(ctx, t) },                                                                          // 2.06
    { t: A.s207, tr: 'zoom', x: R206.x + 410 * .96, y: R206.y, depth: 5, d: .8, draw: (ctx, t) => frame207(ctx, t), sound: [{ f: 'tear', t: A.half2 + .02, v: .22 }] },                                  // 2.07
    { t: A.s208, tr: 'down', d: .5, draw: (ctx, t) => frame208(ctx, t) },                        // 2.08
  ];
};
