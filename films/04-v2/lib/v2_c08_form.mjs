// C08 · the official form (8.01–8.08): the cream paper of the plate is the form's paper; at its head the engraved park vignette
// (v2_c08_vignette.mjs); under it the AGE ruler, the name rows, the STATUS box (typewriter UNEMPLOYED → dotted smoke → RETIRED in foil),
// more rows, a signature, a rubber stamp, fine print; a woven guilloche border. The sheet lies on a dark wooden counter under a lamp.
// Units: FU (1000 × 1414 = A4, 1 FU = 0.21 mm). Plate px ↔ FU: p = (FU − C0) · K0 + (W/2, H/2) (vignette.mjs K0, C0).
//   formPrint()                      static print layer (transparent canvas, 2.4 px/FU) — border, labels, rules, scribbles, ruler, stamp
//   paperLight(t, grow)              the paper's light [x, y, R] in plate px: the plate's own light → the counter lamp
//   paperAt(t, grow)(x, y)           css colour of the paper at FU (x, y) (knock-outs)
//   drawDesk(ctx, map, t, o)         the counter top around the sheet (map: desk FU → screen; o.view = FU bbox to cull)
//   drawForm(ctx, t, M, st)          the whole sheet under the affine M (FU → screen): paper, print, vignette, typing, marker, RETIRED
//   formTexture(t, st)               the sheet as one canvas (1 px/FU) for the 3D hall
import { Path2D, GlobalFonts } from '@napi-rs/canvas';
import { W, H, rgba, clamp, mix, prng, drift, canvas, text, memo, hash, noise1, TAU, ss, eo3, eoX, qio, seg, hexMix, fract, paperPlateM, PLATE_FIB } from './v2_c08_core.mjs';
import { VIG, INK, K0, C0, drawVignette, drawTips, SUN } from './v2_c08_vignette.mjs';
import { gBorder, microtext, microRing, FOIL, rosette } from './certificate.mjs';
import { scribble } from './paper.mjs';

GlobalFonts.registerFromPath('/usr/share/fonts/truetype/freefont/FreeMonoBold.ttf', 'C08 Typewriter');
export const FORM = { w: 1000, h: 1414 };
export const RULER = { x0: 190, x1: 880, y: 712, a0: 58, a1: 68 };       // y: the ruler's top edge; ages 58..68
export const ageX = (a) => RULER.x0 + (a - RULER.a0) / (RULER.a1 - RULER.a0) * (RULER.x1 - RULER.x0);
export const STATUS = { x0: 104, y0: 552, x1: 896, y1: 676, base: 640 };
const PRINT = '#2a231d', GREEN = '#3f6157', BLUEINK = '#1d2a5a', STAMP = '#9a3328', TYPE = '#16131a';
const CC = [W / 2, H / 2];
export const fuToPlate = (x, y) => [(x - C0[0]) * K0 + CC[0], (y - C0[1]) * K0 + CC[1]];
// the plate→screen matrix for a form→screen matrix M
export function plateM(M) { const a = M[0] / K0, b = M[1] / K0, c = M[2] / K0, d = M[3] / K0; const ox = C0[0] - CC[0] / K0, oy = C0[1] - CC[1] / K0; return [a, b, c, d, M[0] * ox + M[2] * oy + M[4], M[1] * ox + M[3] * oy + M[5]]; }

// ---------------------------------------------------------------- paper light (plate px): the plate's own light grows into the lamp's pool
const LAMP_FU = [-260, -160, 1900];
export function paperLight(t, grow) {
  const p0 = [W * .32 + 30 * drift(t, 1, 2), H * .25, 1700], lp = fuToPlate(LAMP_FU[0], LAMP_FU[1]), p1 = [lp[0], lp[1], LAMP_FU[2] * K0];
  const g = clamp(grow);
  return [mix(p0[0], p1[0], g), mix(p0[1], p1[1], g), Math.exp(mix(Math.log(p0[2]), Math.log(p1[2]), g))];
}
const STOPS = [[0, [0xf3, 0xec, 0xda]], [.6, [0xe3, 0xd6, 0xb8]], [1, [0xcd, 0xbb, 0x94]]];
export function paperAt(t, grow) {
  const L = paperLight(t, grow);
  return (x, y) => {
    const p = fuToPlate(x, y), d = clamp(Math.hypot(p[0] - L[0], p[1] - L[1]) / L[2]);
    let i = 0; while (i < STOPS.length - 2 && d > STOPS[i + 1][0]) i++;
    const [a, ca] = STOPS[i], [b, cb] = STOPS[i + 1], u = (d - a) / (b - a);
    return `rgb(${Math.round(mix(ca[0], cb[0], u))},${Math.round(mix(ca[1], cb[1], u))},${Math.round(mix(ca[2], cb[2], u))})`;
  };
}
// fibres over the whole sheet (plate px, same statistics as the plate's own), excluding the plate rectangle (those are PLATE_FIB)
const FORM_FIB = memo('c08formfib', () => {
  const r = prng(8080), f = [], [x0, y0] = fuToPlate(0, 0), [x1, y1] = fuToPlate(1000, 1414), n = Math.round(420 * (x1 - x0) * (y1 - y0) / (W * H));
  for (let i = 0; i < n; i++) { const x = mix(x0, x1, r()), y = mix(y0, y1, r()), a = (r() - .5) * 2.4, L = 6 + r() * 26, k = r(); if (x > -30 && x < W + 30 && y > -30 && y < H + 30) continue; f.push([x, y, a, L, k]); }
  return f;
});

// ---------------------------------------------------------------- the counter top (desk FU; the sheet lies at 0..1000 × 0..1414)
export const DESK = { x0: -5200, x1: 6200, y0: -2600, y1: 2650 };     // ≈ 2.4 m × 1.1 m
const GRAIN = memo('c08grain', () => {
  const r = prng(3131), out = [];
  for (let y = DESK.y0; y < DESK.y1; y += 16 + r() * 22) {
    const pts = [], ph = r() * 100, amp = 6 + r() * 16, k = r();
    for (let x = DESK.x0; x <= DESK.x1; x += 120) pts.push([x, y + amp * noise1(x * .0016 + ph, 3) + 30 * noise1(x * .00031 + ph, 5)]);
    out.push({ pts, k, w: .8 + r() * 2.6 });
  }
  return out;
});
// map: (x, y) FU → [sx, sy]; o: { view: [x0,y0,x1,y1] FU to cull grain, lamp 0..1 (the pool), scale (px per FU, for line widths) }
export function drawDesk(ctx, map, t, o = {}) {
  const v = o.view || [DESK.x0, DESK.y0, DESK.x1, DESK.y1], k = o.scale ?? 1;
  const q = [map(v[0], v[1]), map(v[2], v[1]), map(v[2], v[3]), map(v[0], v[3])];
  ctx.save();
  ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(q[i][0], q[i][1]); ctx.closePath(); ctx.clip();
  // dark walnut, warm in the lamp's pool (pool centre under the lamp, top left of the sheet)
  const c0 = map(LAMP_FU[0], LAMP_FU[1]), c1 = map(LAMP_FU[0] + 2600, LAMP_FU[1]), R = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
  const g = ctx.createRadialGradient(c0[0], c0[1], 0, c0[0], c0[1], R * 1.15);
  g.addColorStop(0, '#7a4d2a'); g.addColorStop(.35, '#55331d'); g.addColorStop(.7, '#2e1d14'); g.addColorStop(1, '#141019');
  ctx.fillStyle = g; ctx.fillRect(-W, -H, W * 3, H * 3);
  // grain
  ctx.lineCap = 'round';
  for (const L of GRAIN) {
    const y = L.pts[0][1]; if (y < v[1] - 60 || y > v[3] + 60) continue;
    ctx.beginPath(); let st = false;
    for (const [x, yy] of L.pts) { if (x < v[0] - 200 || x > v[2] + 200) { st = false; continue; } const s = map(x, yy); st ? ctx.lineTo(s[0], s[1]) : ctx.moveTo(s[0], s[1]); st = true; }
    ctx.strokeStyle = L.k < .6 ? 'rgba(18,10,6,.35)' : 'rgba(150,100,60,.16)'; ctx.lineWidth = Math.max(.5, L.w * k); ctx.stroke();
  }
  ctx.restore();
}
// the sheet's contact shadow on the counter (under the paper, offset away from the lamp)
function sheetShadow(ctx, M) {
  ctx.save(); ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]);
  ctx.shadowColor = 'rgba(8,4,2,.55)'; ctx.shadowBlur = 14 * Math.hypot(M[0], M[1]); ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.fillStyle = 'rgba(8,4,2,.5)'; ctx.fillRect(6, 9, 1000, 1414);
  ctx.restore();
}

// ---------------------------------------------------------------- the static print layer
const PR = 2.4;
export function formPrint() {
  return memo('c08print', () => {
    const [c, g] = canvas(Math.ceil(1000 * PR), Math.ceil(1414 * PR));
    // woven guilloche border (second ink), drawn in px for crispness
    gBorder(g, 26 * PR, 26 * PR, 948 * PR, 1362 * PR, { band: 30 * PR, lines: 9, waves: 150, col: GREEN, w: .55 * PR, a: .85, radius: 10 * PR });
    g.setTransform(PR, 0, 0, PR, 0, 0);
    // a second, inner hairline frame
    g.strokeStyle = rgba(PRINT, .8); g.lineWidth = .6; g.strokeRect(70, 70, 860, 1274);
    // corner rosettes
    for (const [x, y] of [[48, 48], [952, 48], [48, 1366], [952, 1366]]) rosette(g, x, y, { R: 9, A: 3, B: 1.4, n: 12, m: 5, lines: 14, col: GREEN, w: .35, a: .9 });
    // microtext under the vignette frame
    microtext(g, VIG.x0, VIG.y1 + 20, VIG.x1 - VIG.x0, 'STATUS · DATE · AGE · ', { size: 5.2, col: PRINT, a: .7, spacing: .5 });
    // ---- the AGE ruler: an engraved strip with a guilloche wave, ticks every quarter year, numbers 60 · 63 · 65 · 67
    const R = RULER, y0 = R.y, y1 = R.y + 34;
    g.fillStyle = rgba('#d8c9a6', .55); g.fillRect(R.x0 - 14, y0, R.x1 - R.x0 + 28, y1 - y0);
    g.strokeStyle = rgba(PRINT, .9); g.lineWidth = .8; g.strokeRect(R.x0 - 14, y0, R.x1 - R.x0 + 28, y1 - y0);
    g.lineWidth = .35; g.strokeStyle = rgba(GREEN, .75);
    for (let k = 0; k < 4; k++) { g.beginPath(); for (let x = R.x0 - 12; x <= R.x1 + 12; x += 1.5) { const yy = y0 + 17 + 9 * Math.sin(x * .09 + k * 1.6) * Math.sin(x * .013 + k); x === R.x0 - 12 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
    g.strokeStyle = PRINT;
    for (let a = R.a0; a <= R.a1 + 1e-6; a += .25) {
      const x = ageX(a), major = Math.abs(a - Math.round(a)) < 1e-6, half = Math.abs(a - Math.round(a) - .5) < 1e-6 || Math.abs(a - Math.round(a) + .5) < 1e-6;
      g.lineWidth = major ? 1.1 : .55; g.beginPath(); g.moveTo(x, y1); g.lineTo(x, y1 - (major ? 15 : half ? 9 : 5)); g.stroke();
    }
    for (const a of [60, 63, 65, 67]) text(g, String(a), ageX(a), y1 + 30, { size: 26, font: 'Instrument Serif', color: PRINT, align: 'center', weight: 400 });
    text(g, 'AGE', R.x0 - 86, y0 + 24, { size: 15, weight: 600, color: PRINT, spacing: 3.5 });
    // ---- rows of fields
    const label = (s, x, y) => text(g, s, x, y, { size: 11.5, weight: 600, color: rgba(PRINT, .85), spacing: 2.6 });
    const rule = (x0, x1, y) => { g.strokeStyle = rgba(PRINT, .7); g.lineWidth = .7; g.beginPath(); g.moveTo(x0, y); g.lineTo(x1, y); g.stroke(); };
    const scrib = (x, y, w, seed) => scribble(g, x, y, w, 15, { seed, ink: BLUEINK, lw: 1.5 });
    label('SURNAME', 104, 808); rule(104, 470, 844); scrib(116, 834, 230, 31);
    label('GIVEN NAMES', 520, 808); rule(520, 896, 844); scrib(532, 834, 280, 37);
    // STATUS box (double rule)
    const S = STATUS; g.strokeStyle = rgba(PRINT, .9); g.lineWidth = 1.2; g.strokeRect(S.x0, S.y0, S.x1 - S.x0, S.y1 - S.y0); g.lineWidth = .5; g.strokeRect(S.x0 + 5, S.y0 + 5, S.x1 - S.x0 - 10, S.y1 - S.y0 - 10);
    label('STATUS', S.x0 + 18, S.y0 + 26);
    label('DATE OF BIRTH', 104, 892); rule(104, 470, 928); scrib(116, 918, 170, 43);
    label('REFERENCE', 520, 892); rule(520, 896, 928); scrib(532, 918, 210, 47);
    label('ADDRESS', 104, 976); rule(104, 896, 1012); scrib(116, 1002, 520, 53); rule(104, 896, 1058); scrib(116, 1048, 300, 59);
    label('DATE', 104, 1122); rule(104, 360, 1158); scrib(116, 1148, 140, 61);
    label('SIGNATURE', 420, 1122); rule(420, 896, 1158); scribble(g, 440, 1146, 300, 26, { seed: 67, ink: BLUEINK, lw: 1.7 });
    // a round rubber stamp, slightly crooked, uneven red ink
    g.save(); g.translate(770, 1250); g.rotate(-.22); g.strokeStyle = rgba(STAMP, .82); g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 58, 0, TAU); g.stroke(); g.lineWidth = 1.4; g.beginPath(); g.arc(0, 0, 44, 0, TAU); g.stroke();
    microRing(g, 0, 0, 51, 'RECEIVED', { size: 9, col: STAMP, a: .85 });
    scribble(g, -30, 6, 60, 12, { seed: 71, ink: STAMP, lw: 2 });
    g.globalCompositeOperation = 'destination-out'; { const r = prng(73); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(0,0,0,${.25 + r() * .5})`; g.beginPath(); g.arc((r() - .5) * 130, (r() - .5) * 130, r() * 3.2, 0, TAU); g.fill(); } }
    g.restore();
    // a guilloche seal bottom left (second ink) and the fine print
    rosette(g, 190, 1262, { R: 52, A: 9, B: 4, n: 18, m: 7, lines: 30, col: GREEN, w: .35, a: .85 });
    for (let i = 0; i < 4; i++) microtext(g, 300, 1222 + i * 13, 360, 'THIS FORM IS VALID ONLY WITH A STAMP AND A SIGNATURE · ', { size: 5.4, col: PRINT, a: .6, spacing: .4 });
    g.setTransform(1, 0, 0, 1, 0, 0); g.getImageData(0, 0, 1, 1);
    return c;
  });
}
// the vignette's frame (vector: sharp at any zoom)
function vigFrame(ctx, k) {
  ctx.strokeStyle = PRINT; ctx.lineWidth = Math.max(.4 / k, 1.3); ctx.strokeRect(VIG.x0 - 7, VIG.y0 - 7, VIG.x1 - VIG.x0 + 14, VIG.y1 - VIG.y0 + 14);
  ctx.lineWidth = Math.max(.3 / k, .5); ctx.strokeRect(VIG.x0 - 2.5, VIG.y0 - 2.5, VIG.x1 - VIG.x0 + 5, VIG.y1 - VIG.y0 + 5);
}

// ---------------------------------------------------------------- typewriter: UNEMPLOYED, struck letter by letter
const WORD = 'UNEMPLOYED', TSIZE = 58;
const typeLayout = () => memo('c08type', () => {
  const [, g] = canvas(10, 10); g.font = `${TSIZE}px "C08 Typewriter"`; const cw = g.measureText('M').width, tot = cw * WORD.length;
  const x0 = (STATUS.x0 + STATUS.x1) / 2 - tot / 2 + 30, r = prng(919);
  return WORD.split('').map((ch, i) => ({ ch, x: x0 + i * cw, y: STATUS.base + (r() - .5) * 2.2, rot: (r() - .5) * .03, ink: r(), cw }));
});
// dot cloud of each letter (FU offsets from the letter origin), for the smoke
const typeDots = () => memo('c08typedots', () => {
  const S = 3, Wd = Math.ceil(TSIZE * 1.0 * S), Hd = Math.ceil(TSIZE * 1.1 * S), out = [];
  for (const L of typeLayout()) {
    const [c, g] = canvas(Wd, Hd); g.font = `${TSIZE * S}px "C08 Typewriter"`; g.fillStyle = '#000'; g.fillText(L.ch, 0, TSIZE * .85 * S);
    const D = g.getImageData(0, 0, Wd, Hd).data, pts = [], st = 3.1 * S, r = prng(L.ch.charCodeAt(0) * 7 + out.length);
    for (let y = 0; y < Hd; y += st) for (let x = ((y / st) % 2) * st * .5; x < Wd; x += st) { if (D[(Math.floor(y) * Wd + Math.floor(x)) * 4 + 3] > 120) pts.push([x / S, y / S - TSIZE * .85, r(), r()]); }
    out.push(pts);
  }
  return out;
});
// o: { strikes: [t_i], smoke: [t_i] (letter i turns to smoke at t_i; null = never) }
function drawTyped(ctx, t, o) {
  const Ls = typeLayout(), D = typeDots();
  ctx.save(); ctx.font = `${TSIZE}px "C08 Typewriter"`; ctx.textBaseline = 'alphabetic';
  Ls.forEach((L, i) => {
    const ts = o.strikes[i]; if (t < ts) return;
    const sm = o.smoke ? o.smoke[i] : null;
    if (sm == null || t < sm) {
      ctx.save(); ctx.translate(L.x, L.y); ctx.rotate(L.rot);
      const fresh = clamp((t - ts) / .07), sc = mix(1.06, 1, eoX(fresh));
      ctx.scale(sc, sc);
      ctx.fillStyle = hexMix(TYPE, '#4a4048', L.ink * .45); ctx.fillText(L.ch, 0, 0);
      // the ribbon's texture: a few pale specks knocked out of the stroke
      ctx.restore();
      return;
    }
    // smoke: the letter's dots lift off and drift up and to the right, thinning
    const u = (t - sm), pts = D[i];
    ctx.fillStyle = TYPE;
    for (const [dx, dy, r1, r2] of pts) {
      const q = clamp((u - r1 * .35) / 1.5); if (q >= 1) continue;
      let x = L.x + dx, y = L.y + dy;
      if (q > 0) { const dist = q * q * (60 + 120 * r2), n = 4, st = dist / n; for (let k = 0; k < n; k++) { const f = Math.sin(x * .021 + t * .5) + Math.sin(y * .017 - t * .4 + x * .006), an = -1.35 + f * .5; x += Math.cos(an) * st; y += Math.sin(an) * st; } }
      const rad = (.95 + q * 1.6) * (1 - q * .4); ctx.globalAlpha = Math.pow(1 - q, 1.3); ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  });
  ctx.restore();
}
// ---------------------------------------------------------------- RETIRED: foil pressed in from left to right, a glint at the front
const RWORD = 'RETIRED', RSIZE = 74;
const retLayout = () => memo('c08ret', () => {
  const [, g] = canvas(10, 10); g.font = `400 ${RSIZE}px "Instrument Serif"`; try { g.letterSpacing = '9px'; } catch { }
  const w = g.measureText(RWORD).width; return { x: (STATUS.x0 + STATUS.x1) / 2 - w / 2 + 30, y: STATUS.base + 4, w };
});
function drawRetired(ctx, t, o) {
  const u = o.u; if (u <= 0) return;
  const L = retLayout(), x0 = L.x - 8, x1 = L.x + L.w + 8, front = mix(x0, x1, u);
  ctx.save();
  ctx.font = `400 ${RSIZE}px "Instrument Serif"`; try { ctx.letterSpacing = '9px'; } catch { }
  ctx.beginPath(); ctx.rect(x0 - 20, STATUS.y0 + 8, front - x0 + 20, STATUS.y1 - STATUS.y0 - 16); ctx.clip();
  const gr = ctx.createLinearGradient(L.x, L.y - RSIZE, L.x + L.w * .35, L.y + 10); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c));
  ctx.fillStyle = gr; ctx.fillText(RWORD, L.x, L.y);
  // a fine dark edge (the foil's emboss)
  ctx.lineWidth = .7; ctx.strokeStyle = rgba('#5a2a0e', .55); ctx.strokeText(RWORD, L.x, L.y);
  ctx.restore();
  // the pressing glint at the front
  if (u < 1) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const gg = ctx.createRadialGradient(front, L.y - RSIZE * .35, 0, front, L.y - RSIZE * .35, RSIZE * .9); gg.addColorStop(0, rgba('#fff1d6', .75)); gg.addColorStop(.3, rgba('#ffb35c', .3)); gg.addColorStop(1, rgba('#ffb35c', 0));
    ctx.fillStyle = gg; ctx.fillRect(front - RSIZE, L.y - RSIZE * 1.4, RSIZE * 2, RSIZE * 2); ctx.restore();
  }
  // the final glint sweeping across the finished foil
  if (o.glint != null && o.glint > 0 && o.glint < 1) {
    ctx.save(); ctx.font = `400 ${RSIZE}px "Instrument Serif"`; try { ctx.letterSpacing = '9px'; } catch { }
    const gx = mix(x0 - 120, x1 + 120, o.glint);
    ctx.globalCompositeOperation = 'source-atop';
    const gl = ctx.createLinearGradient(gx - 70, 0, gx + 70, 0); gl.addColorStop(0, 'rgba(255,240,210,0)'); gl.addColorStop(.5, 'rgba(255,248,232,.95)'); gl.addColorStop(1, 'rgba(255,240,210,0)');
    // draw only on the letters: clip to the text by drawing it as a mask
    ctx.restore();
    ctx.save(); ctx.font = `400 ${RSIZE}px "Instrument Serif"`; try { ctx.letterSpacing = '9px'; } catch { }
    ctx.beginPath(); ctx.rect(gx - 70, STATUS.y0, 140, STATUS.y1 - STATUS.y0); ctx.clip();
    ctx.fillStyle = gl; ctx.fillText(RWORD, L.x, L.y); ctx.restore();
  }
}
// ---------------------------------------------------------------- the ruler's marker (a small foil pointer) at age a
function drawMarker(ctx, a, k) {
  if (a == null) return;
  const x = ageX(a), y = RULER.y;
  ctx.save();
  ctx.strokeStyle = rgba('#7a3b17', .9); ctx.lineWidth = Math.max(.6, 1.2 / Math.max(1, k * .5)); ctx.beginPath(); ctx.moveTo(x, y - 2); ctx.lineTo(x, y + 34); ctx.stroke();
  const gr = ctx.createLinearGradient(x - 10, y - 26, x + 10, y - 2); FOIL.forEach((c, i) => gr.addColorStop(i / (FOIL.length - 1), c));
  ctx.fillStyle = gr; ctx.beginPath(); ctx.moveTo(x, y - 1); ctx.lineTo(x - 11, y - 22); ctx.lineTo(x + 11, y - 22); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba('#5a2a0e', .7); ctx.lineWidth = .8; ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- the whole sheet
// st: { grow (paper light → lamp), fib (fibre alpha), plate (1 at H.b: the screen vignette of the plate), vig: {…drawVignette st},
//       strikes, smoke, ret: { u, glint }, age, jolt [dx, dy] FU, desk (true) }
export function drawForm(ctx, t, M, st) {
  const k = Math.hypot(M[0], M[1]), PM = plateM(M);
  // what part of the sheet is on screen (FU), for culling
  const inv = (sx, sy) => { const det = M[0] * M[3] - M[1] * M[2], x = sx - M[4], y = sy - M[5]; return [(M[3] * x - M[2] * y) / det, (-M[1] * x + M[0] * y) / det]; };
  const cs = [inv(0, 0), inv(W, 0), inv(W, H), inv(0, H)], vx0 = Math.min(...cs.map((c) => c[0])), vx1 = Math.max(...cs.map((c) => c[0])), vy0 = Math.min(...cs.map((c) => c[1])), vy1 = Math.max(...cs.map((c) => c[1]));
  const offSheet = vx0 < 0 || vy0 < 0 || vx1 > 1000 || vy1 > 1414;
  if (offSheet && st.desk !== false) {
    drawDesk(ctx, (x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]], t, { view: [vx0 - 50, vy0 - 50, vx1 + 50, vy1 + 50], scale: k });
    sheetShadow(ctx, M);
  }
  // paper: the plate replica, clipped to the sheet
  const L = paperLight(t, st.grow);
  ctx.save();
  if (offSheet) {   // (napi-rs applies the transform at clip() time: build the sheet's outline in screen space)
    const P = (x, y) => [M[0] * x + M[2] * y + M[4], M[1] * x + M[3] * y + M[5]], q = [P(0, 0), P(1000, 0), P(1000, 1414), P(0, 1414)];
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.beginPath(); ctx.moveTo(q[0][0], q[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(q[i][0], q[i][1]); ctx.closePath(); ctx.clip();
  }
  const [ax0, ay0] = fuToPlate(Math.max(-20, vx0 - 5), Math.max(-20, vy0 - 5)), [ax1, ay1] = fuToPlate(Math.min(1020, vx1 + 5), Math.min(1434, vy1 + 5));
  paperPlateM(ctx, t, PM, { light: L, fibA: st.fib ?? 1, more: 0, rosA: 1, area: [ax0, ay0, ax1, ay1] });
  // the rest of the sheet's fibres (outside the plate rectangle), culled to the view
  const fa = st.fib ?? 1;
  if (fa > .02) {
    ctx.save(); ctx.setTransform(PM[0], PM[1], PM[2], PM[3], PM[4], PM[5]); ctx.lineCap = 'round';
    for (const [x, y, a, Ln, kk] of FORM_FIB) { if (x < ax0 - 40 || x > ax1 + 40 || y < ay0 - 40 || y > ay1 + 40) continue; ctx.strokeStyle = rgba(kk < .5 ? '#8a7350' : '#fffaf0', (.07 + .06 * kk) * fa); ctx.lineWidth = .7 + kk * .6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * Ln, y + Math.sin(a) * Ln); ctx.stroke(); }
    ctx.restore();
  }
  ctx.restore();
  // print + vignette + typing in FU
  ctx.save(); ctx.setTransform(M[0], M[1], M[2], M[3], M[4], M[5]);
  if (st.jolt) ctx.translate(st.jolt[0], st.jolt[1]);
  const showPrint = vx0 < VIG.x0 + 2 || vy0 < VIG.y0 + 2 || vx1 > VIG.x1 - 2 || vy1 > VIG.y1 - 2;
  if (showPrint) { ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'medium'; ctx.drawImage(formPrint(), 0, 0, 1000, 1414); vigFrame(ctx, k); }
  const paper = paperAt(t, st.grow);
  const vr = drawVignette(ctx, t, { ...st.vig, k, rs: clamp(k, 1.6, 3.2), paper });
  if (st.strikes) drawTyped(ctx, t, st);
  if (st.ret) drawRetired(ctx, t, st.ret);
  if (st.age != null) drawMarker(ctx, st.age, k);
  ctx.restore();
  if (vr.tips.length) drawTips(ctx, vr.tips, M, t, 13);
  // the plate's own screen vignette (1 at H.b) eases out as the camera leaves the paper
  if (st.plate > 0) {
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
    const v = ctx.createRadialGradient(W / 2, H / 2, H * .45, W / 2, H / 2, W * .75); v.addColorStop(0, 'rgba(60,40,20,0)'); v.addColorStop(1, `rgba(60,40,20,${.22 * st.plate})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
}
// the sheet as a texture (1 px/FU), for the 3D hall (built once at a given time)
const TEX = new Map();
export function formTexture(t, st, res = 1) {
  const key = res + ':' + t.toFixed(2); if (TEX.has(key)) return TEX.get(key);
  const [c, g] = canvas(Math.ceil(1000 * res), Math.ceil(1414 * res));
  drawForm(g, t, [res, 0, 0, res, 0, 0], { ...st, desk: false, plate: 0 });
  g.getImageData(0, 0, 1, 1);
  if (TEX.size > 3) TEX.delete(TEX.keys().next().value);
  TEX.set(key, c); return c;
}
export { WORD, typeLayout };
