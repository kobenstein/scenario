// Film 67 · builder B1 · ONE continuous take for c02 + c03 + c04 ('The man is Alexandr Wang' → "That leaves Wang's boldest").
// The three scene files (scenes/sc02.mjs, sc03.mjs, sc04.mjs) draw the SAME take function, so the inner seams c02|c03 and c03|c04 are
// identical frames by construction (one camera path, one state per t). Group seams: plateWang (in) and plateReferee (out), lib/f67_world.mjs.
// Shot tables: in the scene files. Anchors: phrases only (T.G / T.clip). Owned by B1 (the lead's lib files are only imported).
//
// World additions (land card, all inside B1's view only, outside the lead's plates):
//   THE LAB DOOR of Meta Superintelligence Labs (x 4600) with its sign · THE AUTHOR'S CORNER (x 2990–3250: a free-standing wall flat
//   over the ribbon with the AI's lit window, a wall calendar (no clock), an old light bulb, a small desk) · THE TWIN BOARD (a cardboard
//   copy of the chalkboard, slides out from behind it in c04 and back) · screen cards: community / MIT re-check / the rule book / the
//   rival proof (night cards over the veil) · C0 (Alpöge, picture only) grows out of the lit window.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadImage } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f67_kit.mjs';
import * as S from './f67_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, halo, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, LAMP, EARTH, rise } = F;
const TAU = Math.PI * 2;
const GY = S.GY;

// ------------------------------------------------------------------------------------------------ clip info from films/67-assets/clips/clips.md
// (F.CLIPS is the lead's provisional table; B1 owns C1 and C2 and sets them from clips.md here. Reported to the lead.)
Object.assign(F.CLIPS.C1, { name: 'Alexandr Wang', role: 'Chief AI Officer, Meta', year: '2026', src: 'Core Memory Podcast' });
Object.assign(F.CLIPS.C2, { name: 'James Maynard', role: 'Mathematician, Fields Medal 2022', year: '2026', src: 'New Scientist' });
export const C0INFO = { name: 'Levent Alpöge', role: 'MATHEMATICIAN · 2023', src: 'NUMBER THEORY WEB SEMINAR' };

// ------------------------------------------------------------------------------------------------ C0 frames (picture only, muted)
// films/67-assets/clips/C0-alpoege.mp4 (1184×720, iPad slides + small webcam tile): the title slide (Sums of two cubes / Levent Alpöge)
// cropped to 16:9 with his webcam tile (top right of the source) composited at 1.5× into the plate's top right. 5.4 s from 0.4 s.
const C0DIR = '/tmp/claude-0/f67/b1/c0/';
const C0SRC = new URL('../../../67-assets/clips/C0-alpoege.mp4', import.meta.url).pathname;
let C0IMG = null;
async function prepC0() {
  if (C0IMG) return C0IMG;
  C0IMG = [];
  try {
    if (!fs.existsSync(C0DIR + 'f00150.jpg') && fs.existsSync(C0SRC)) {
      fs.mkdirSync(C0DIR, { recursive: true });
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-ss', '0.4', '-t', '5.4', '-i', C0SRC, '-filter_complex',
        '[0:v]split[a][b];[a]crop=960:540:0:52[s];[b]crop=224:126:960:0,scale=336:189[w];[s][w]overlay=W-w-16:16,fps=30', '-q:v', '3', C0DIR + 'f%05d.jpg']);
    }
    const files = fs.existsSync(C0DIR) ? fs.readdirSync(C0DIR).filter((f) => /^f\d{5}\.jpg$/.test(f)).sort() : [];
    for (const f of files) C0IMG.push(await loadImage(fs.readFileSync(C0DIR + f)));
  } catch (e) { console.warn('[b1] C0 frames unavailable:', e.message); }
  return C0IMG;
}
// a clip plate like F.clipPlate, for a clip without a VO slot (C0): grows from `from` (screen rect) into R and back
function c0Plate(ctx, t, t0, morph, from, lab) {
  const R = { x: 330, y: 205, w: 1260, h: 709 };
  const m = sineIO(clamp(morph)); if (m <= 0) return;
  const cx = lerp(from.x + from.w / 2, R.x + R.w / 2, m), cy = lerp(from.y + from.h / 2, R.y + R.h / 2, m), w = lerp(from.w, R.w, m), h = lerp(from.h, R.h, m);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  const shape = () => { ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - h / 2, w, h, lerp(4, 14, m)); };
  ctx.save(); shape(); ctx.clip();
  ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);
  const n = C0IMG?.length ?? 0;
  if (n) { const k = clamp(Math.floor((t - t0) * 30), 0, n - 1), fr = C0IMG[k], s = Math.max(w / fr.width, h / fr.height); ctx.drawImage(fr, cx - fr.width * s / 2, cy - fr.height * s / 2, fr.width * s, fr.height * s); }
  else E.glowText(ctx, 'C0 · LEVENT ALPÖGE · FOOTAGE GOES HERE', cx, cy, { size: 26, align: 'center', col: P.halo2, glow: false, spacing: .16 });
  ctx.fillStyle = rgba(COOL.halo, .12 * (1 - m)); ctx.fillRect(cx - w / 2, cy - h / 2, w, h);   // the window's cool light fades off the picture as it grows
  ctx.restore();
  ctx.strokeStyle = P.cream; ctx.lineWidth = lerp(2, 3, m); shape(); ctx.stroke();
  const lu = clamp(lab) * span(m, .85, 1);
  if (lu > 0) {
    const by = R.y - 34, nw = F.measure(C0INFO.name, 44, true);
    F.maskLine(ctx, [[C0INFO.name, 0]], R.x, by, 44, rise(lu), { glow: true });
    F.maskLine(ctx, [[C0INFO.role, 0]], R.x + nw + 26, by - 4, 22, rise(lu), { serif: false, weight: 600, col: P.halo2, glow: false });
    F.goldText(ctx, [[`ORIGINAL FOOTAGE (${C0INFO.src})`, .45]], R.x + R.w, by - 4, 22, rise(span(lu, .15, 1)), { serif: false, weight: 600, align: 'right' });
  }
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ helpers
const L = (u, v, s = 1, sx, sy) => S.landCam(u, v, s, sx, sy);
const RIBC = E.catmull(S.RIB, 12), RIBL = [0]; for (let i = 1; i < RIBC.length; i++) RIBL.push(RIBL[i - 1] + Math.hypot(RIBC[i][0] - RIBC[i - 1][0], RIBC[i][1] - RIBC[i - 1][1]));
const ribAt = (f) => { const d = clamp(f) * RIBL[RIBL.length - 1]; let i = 1; while (i < RIBC.length - 1 && RIBL[i] < d) i++; const q = clamp((d - RIBL[i - 1]) / Math.max(1e-6, RIBL[i] - RIBL[i - 1])); return [lerp(RIBC[i - 1][0], RIBC[i][0], q), lerp(RIBC[i - 1][1], RIBC[i][1], q)]; };
const ribX = (x) => { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (ribAt(m)[0] < x) lo = m; else hi = m; } return (lo + hi) / 2; };
const inOut = (t, a0, a1, b0, b1) => span(t, a0, a1) * (1 - span(t, b0, b1));
const sio = (t, a0, a1, b0, b1) => sineIO(span(t, a0, a1)) * (1 - sineIO(span(t, b0, b1)));
function scr(c, u, v) { const p = S.landPt(c, u, v); return p ?? [W / 2, H / 2, 1]; }
function scrRect(c, x0, y0, x1, y1) { const a = scr(c, x0, y0), b = scr(c, x1, y1); return { x: a[0], y: a[1], w: b[0] - a[0], h: b[1] - a[1] }; }

// THE LAB DOOR + SIGN (Meta Superintelligence Labs, x 4600): the word SUPERINTELLIGENCE lights gold (g 0..1)
const DOOR = { x: 4600, w: 90, h: 110 };
function labDoor(ctx, t, g) {
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(DOOR.x - DOOR.w / 2 - 8, GY - DOOR.h - 8, DOOR.w + 16, DOOR.h + 8);
  ctx.fillStyle = E.lin(ctx, 0, GY - DOOR.h, 0, GY, [[0, mixHex(COOL.body, P.night1, .35)], [1, mixHex(COOL.deep, P.night0, .3)]]); ctx.fillRect(DOOR.x - DOOR.w / 2, GY - DOOR.h, DOOR.w, DOOR.h);
  ctx.fillStyle = rgba(P.night0, .6); ctx.fillRect(DOOR.x - 2, GY - DOOR.h, 4, DOOR.h);
  halo(ctx, DOOR.x, GY - DOOR.h * .5, 120, .16, COOL.halo, COOL.core);
  const sy = GY - DOOR.h - 26; ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.fillRect(DOOR.x - 172, sy - 26, 344, 36);
  ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 1.5; ctx.strokeRect(DOOR.x - 172, sy - 26, 344, 36);
  const size = 17, w1 = F.measure('META ', size, false, 700) + 5 * size * .08, w2 = F.measure('SUPERINTELLIGENCE ', size, false, 700) + 18 * size * .08, w3 = F.measure('LABS', size, false, 700) + 4 * size * .08;
  const x0 = DOOR.x - (w1 + w2 + w3) / 2;
  E.glowText(ctx, 'META', x0, sy - 2, { size, weight: 700, spacing: .08, col: CREAM, glow: false });
  if (g > 0) halo(ctx, x0 + w1 + w2 / 2, sy - 8, 130, .5 * g, GOLD.halo, GOLD.core);
  E.glowText(ctx, 'SUPERINTELLIGENCE', x0 + w1, sy - 2, { size, weight: 700, spacing: .08, col: mixHex(CREAM2, GOLD.hot, g), glow: g > .3 });
  E.glowText(ctx, 'LABS', x0 + w1 + w2, sy - 2, { size, weight: 700, spacing: .08, col: CREAM, glow: false });
}
// THE AUTHOR'S CORNER (x 2990–3250 over the ribbon): wall flat on legs, the AI's lit window (lines run faster than anyone reads), wall
// calendar (weeks leaf: OCT 6 → NOV 16), an old light bulb, a small desk. o: { flare, bulb, leaf 0..1, fast }
const CORNER = { x0: 2960, x1: 3170, top: GY - 330, bot: GY - 26, win: { x: 3078, y: GY - 300, w: 82, h: 128 }, cal: { x: 2976, y: GY - 300, w: 62, h: 82 }, bulb: { x: 3050, y: GY - 238 }, desk: { x0: 2984, x1: 3108, y: GY - 72 } };
const WEEKS = [['OCT', '6'], ['OCT', '13'], ['OCT', '20'], ['OCT', '27'], ['NOV', '3'], ['NOV', '10'], ['NOV', '16']];
function corner(ctx, t, o) {
  const C = CORNER, wall = mixHex(P.night1, P.ind1, .55);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .25); ctx.fillRect(C.x0 + 14, C.bot, 8, GY - C.bot); ctx.fillRect(C.x1 - 22, C.bot, 8, GY - C.bot);
  ctx.fillStyle = wall; ctx.fillRect(C.x0, C.top, C.x1 - C.x0, C.bot - C.top);
  ctx.fillStyle = rgba(GOLD.line, .05); ctx.fillRect(C.x0, C.top, C.x1 - C.x0, 3);
  // the AI's window: cool light, short lines streaming up fast
  const w = C.win, fl = clamp(o.flare ?? 0);
  ctx.fillStyle = mixHex(COOL.deep, COOL.body, .35 + .35 * fl); ctx.fillRect(w.x, w.y, w.w, w.h);
  ctx.save(); ctx.beginPath(); ctx.rect(w.x + 6, w.y + 6, w.w - 12, w.h - 12); ctx.clip();
  const r = prng(17), sp = 34 * (o.fast ?? 1);
  for (let i = 0; i < 26; i++) { const len = 14 + r() * 50, yy = w.y + w.h - ((i * 9 + t * sp) % (w.h + 20)), xx = w.x + 8 + r() * 10; ctx.fillStyle = rgba(COOL.core, .55 + .3 * r()); ctx.fillRect(xx, yy, Math.min(len, w.w - 20), 2.2); }
  ctx.restore();
  ctx.strokeStyle = wall; ctx.lineWidth = 4; ctx.strokeRect(w.x, w.y, w.w, w.h); ctx.fillStyle = wall; ctx.fillRect(w.x + w.w / 2 - 2, w.y, 4, w.h);
  halo(ctx, w.x + w.w / 2, w.y + w.h / 2, 150 + 140 * fl, .16 + .4 * fl, COOL.halo, COOL.core);
  // the wall calendar (paper, week sheets leaf from the top)
  const c = C.cal, lf = clamp(o.leaf ?? 0) * 6, k = Math.min(6, Math.floor(lf)), ph = lf - k;
  ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(c.x + c.w / 2 - 3, c.y - 10, 6, 10);
  const sheet = (i, sy) => { ctx.fillStyle = PAPER.lit; ctx.fillRect(c.x, c.y, c.w, c.h * sy); if (sy < .6) return; ctx.fillStyle = mixHex(GOLD.deep, P.night1, .2); ctx.fillRect(c.x, c.y, c.w, 18);
    E.glowText(ctx, WEEKS[i][0], c.x + c.w / 2, c.y + 14, { size: 12, weight: 700, align: 'center', col: PAPER.lit, glow: false, spacing: .1 });
    E.glowText(ctx, WEEKS[i][1], c.x + c.w / 2, c.y + 62, { size: 34, serif: true, align: 'center', col: PAPER.ink, glow: false }); };
  sheet(Math.min(6, k + 1 > 6 ? 6 : k + (ph > 0 ? 1 : 0)), 1);
  if (ph > 0 && k < 6) sheet(k, Math.cos(ph * Math.PI / 2));
  // the old bulb (off → flicker → on: a warm people's light)
  const b = C.bulb, on = clamp(o.bulb ?? 0);
  ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x, C.top); ctx.lineTo(b.x, b.y - 12); ctx.stroke();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(b.x - 5, b.y - 14, 10, 7);
  ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue2, .4), LAMP.core, on); ctx.beginPath(); ctx.ellipse(b.x, b.y, 9, 11, 0, 0, TAU); ctx.fill();
  if (on > 0) halo(ctx, b.x, b.y, 110, .55 * on, P.halo2, LAMP.core);
  // the desk
  const d = C.desk; ctx.fillStyle = mixHex(P.night0, EARTH.deep, .5); ctx.fillRect(d.x0, d.y, d.x1 - d.x0, 8); ctx.fillRect(d.x0 + 8, d.y, 6, GY - d.y); ctx.fillRect(d.x1 - 14, d.y, 6, GY - d.y);
  if (on > 0) { ctx.fillStyle = rgba(LAMP.body, .18 * on); ctx.fillRect(d.x0, d.y - 2, d.x1 - d.x0, 3); }
}
// THE TWIN BOARD: a cardboard copy of the chalkboard (same heading RIEMANN). x = centre; fold 0..1 = its face falls back and shows the
// cardboard behind it with only A = A; clipX = the twin is hidden right of this x (it slides out from behind the real board)
const TWCH = (() => { const r = prng(61), a = []; for (let i = 0; i < 60; i++) a.push([r(), r(), .3 + r() * .7, r()]); return a; })();
function twinBoard(ctx, t, x, fold, clipX, lab, aeq) {
  const B = S.BOARD, x0 = x - B.w / 2, y0 = B.y - B.h, sp = { x: x + (B.spot.x - B.x), y: B.spot.y };
  ctx.save(); ctx.beginPath(); ctx.rect(-9000, -9000, clipX + 9000, 20000); ctx.clip();
  // the cardboard behind (struts + A = A)
  ctx.fillStyle = mixHex(EARTH.body, P.night1, .45); ctx.fillRect(x0, y0, B.w, B.h);
  ctx.fillStyle = mixHex(EARTH.deep, P.night0, .4); for (let i = 0; i < 4; i++) ctx.fillRect(x0 + 80 + i * 240, y0, 14, B.h); ctx.fillRect(x0, y0 + B.h * .5, B.w, 12);
  ctx.fillStyle = mixHex(EARTH.deep, P.night0, .3); ctx.fillRect(x0 + 60, B.y, 18, GY - B.y); ctx.fillRect(x0 + B.w - 78, B.y, 18, GY - B.y);
  if (aeq > 0) F.goldText(ctx, [['A = A', 0]], sp.x - 120, sp.y + 30, 110, rise(aeq), { serif: true, align: 'center', col: CREAM });
  // the face (the copy), falling back around its bottom edge
  const k = Math.cos(clamp(fold) * Math.PI / 2);
  if (k > .01) {
    ctx.save(); ctx.translate(0, B.y); ctx.scale(1, k); ctx.translate(0, -B.y);
    ctx.fillStyle = mixHex(P.night0, '#1c2a26', .55); ctx.fillRect(x0 - 26, y0 - 26, B.w + 52, B.h + 52);
    ctx.fillStyle = E.lin(ctx, x0, y0, x0 + B.w, B.y, [[0, '#1d302b'], [.6, '#16241f'], [1, '#101b18']]); ctx.fillRect(x0, y0, B.w, B.h);
    for (const [u, v, l, q] of TWCH) { const xx = x0 + 30 + u * (B.w - 120), yy = y0 + 40 + v * (B.h - 80); if (Math.abs(xx - sp.x) < 170 && Math.abs(yy - sp.y) < 100) continue;
      ctx.strokeStyle = rgba(CREAM, .2 + .14 * q); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xx, yy); for (let j = 1; j <= 6; j++) ctx.lineTo(xx + (40 + l * 110) * j / 6, yy + Math.sin(j * 2.1 + q * 9) * 5); ctx.stroke(); }
    ctx.strokeStyle = rgba(CREAM, .22); ctx.setLineDash([6, 6]); ctx.lineWidth = 2; ctx.strokeRect(sp.x - B.spot.w / 2, sp.y - B.spot.h / 2, B.spot.w, B.spot.h); ctx.setLineDash([]);
    if (lab > 0) F.goldText(ctx, [['RIEMANN HYPOTHESIS', 0]], sp.x, sp.y + B.spot.h / 2 + 46, 26, rise(lab), { serif: false, weight: 700, spacing: .06, align: 'center', col: CREAM });
    ctx.restore();
  }
  ctx.restore();
}
// a speech bubble / a medal that bounces off the referee (cream, small)
function bubble(ctx, x, y, s, rot, kind) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.fillStyle = rgba(CREAM, .9);
  if (kind === 'medal') { ctx.beginPath(); ctx.arc(0, 0, s * .45, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(P.night1, .6); ctx.beginPath(); ctx.arc(0, 0, s * .28, 0, TAU); ctx.fill(); ctx.fillStyle = rgba(CREAM, .9); ctx.fillRect(-s * .12, -s * 1.1, s * .24, s * .6); }
  else { ctx.beginPath(); ctx.roundRect(-s * .7, -s * .45, s * 1.4, s * .9, s * .25); ctx.fill(); ctx.beginPath(); ctx.moveTo(-s * .3, s * .4); ctx.lineTo(-s * .5, s * .75); ctx.lineTo(-s * .05, s * .4); ctx.fill();
    E.glowText(ctx, kind, 0, s * .2, { size: s * .55, weight: 700, align: 'center', col: P.night1, glow: false }); }
  ctx.restore();
}
// the rule book shelf (screen): a night card with book spines; the dusty volume RIEMANN HYPOTHESIS (paper) slides out on `take`
function shelfCard(ctx, t, u, take, x, y, w, h) {
  const box = F.paperCard(ctx, t, x, y, w, h, { u, style: 'night', head: 'THE REFEREE’S RULE BOOK', headSize: 24 }); if (!box) return null;
  const k = expoOut(u), r = prng(23), base = y + h - 34 + (1 - k) * 40;
  ctx.save(); ctx.globalAlpha *= clamp(u * 3);
  ctx.fillStyle = mixHex(P.night0, EARTH.deep, .5); ctx.fillRect(x + 30, base, w - 60, 8);
  let xx = x + 44; let hit = null;
  for (let i = 0; i < 40; i++) {
    const bw = 26 + r() * 16, bh = 130 + r() * 70, isR = i === 13;
    if (isR) { const lift = 70 * sineIO(take), bx = xx, bh2 = 200; hit = [bx + 21, base - bh2 - lift];
      ctx.fillStyle = mixHex(PAPER.shade, PAPER.lit, .5); ctx.fillRect(bx, base - bh2 - lift, 42, bh2);
      for (let q = 0; q < 26; q++) { ctx.fillStyle = rgba(PAPER.faint, .35); ctx.fillRect(bx + r() * 40, base - bh2 - lift + r() * bh2, 2, 2); }   // dust
      ctx.save(); ctx.translate(bx + 28, base - 14 - lift); ctx.rotate(-Math.PI / 2); E.glowText(ctx, 'RIEMANN HYPOTHESIS', 0, 0, { size: 15, weight: 700, spacing: .06, col: PAPER.ink, glow: false }); ctx.restore();
      xx += 48; continue; }
    ctx.fillStyle = mixHex(P.ind1, P.blue1, r()); ctx.fillRect(xx, base - bh, bw, bh);
    ctx.fillStyle = rgba(CREAM, .18); ctx.fillRect(xx + 5, base - bh + 14, bw - 10, 2); ctx.fillRect(xx + 5, base - 22, bw - 10, 2);
    xx += bw + 4; if (xx > x + w - 80) break;
  }
  ctx.restore();
  return hit;
}
// a small scene card: the community at their laptops (lights go gold one by one)
function communityCard(ctx, t, u, lit, x, y, w, h) {
  const box = F.paperCard(ctx, t, x, y, w, h, { u, head: 'WITHIN A DAY', headSize: 24 }); if (!box) return;
  const k = expoOut(u); ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(0, (1 - k) * 40);
  for (let i = 0; i < 7; i++) {
    const px = x + 80 + i * (w - 160) / 6, py = y + h - 70, on = clamp(lit * 7 - i);
    E.person(ctx, px, py, 120, { dir: i % 2 ? -1 : 1, light: .6, look: -.2, armR: [1.1, 1.6] });
    ctx.fillStyle = mixHex(P.night0, P.blue2, .3); ctx.fillRect(px - 30, py - 40, 60, 6);
    ctx.fillStyle = mixHex(COOL.deep, GOLD.hot, on); ctx.fillRect(px - 24, py - 70, 48, 30);
    if (on > 0) halo(ctx, px, py - 55, 60, .4 * on, GOLD.halo, GOLD.core);
  }
  F.maskLine(ctx, [[F.SOURCES.community, 0]], x + 34, y + h - 22, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: PAPER.faint, glow: false });
  ctx.restore();
}
// the MIT re-check: a row of 12 lamps, most turn gold, a few stay cream and pulse
function mitCard(ctx, t, u, most, few, x, y, w, h) {
  const box = F.paperCard(ctx, t, x, y, w, h, { u, style: 'night', head: 'INDEPENDENT RE-CHECK', headSize: 24 }); if (!box) return;
  const k = expoOut(u); ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(0, (1 - k) * 40);
  const OPEN = [3, 8, 10];
  for (let i = 0; i < 12; i++) {
    const lx = x + 70 + i * (w - 140) / 11, ly = y + 140, open = OPEN.includes(i), g = open ? 0 : clamp(most * 12 - [0, 2, 4, 6, 1, 3, 5, 7, 9, 11, 8, 10][i]);
    const pulse = open ? .5 + .5 * Math.sin(t * 2.4 + i) : 0;
    ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.arc(lx, ly, 18, 0, TAU); ctx.fill();
    if (g > 0) { ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, g); ctx.beginPath(); ctx.arc(lx, ly, 15 * g, 0, TAU); ctx.fill(); halo(ctx, lx, ly, 40, .3 * g, GOLD.halo, GOLD.core); }
    if (open && few > 0) { ctx.strokeStyle = rgba(CREAM, (.5 + .45 * pulse) * few); ctx.lineWidth = 2 + pulse; ctx.beginPath(); ctx.arc(lx, ly, 15, 0, TAU); ctx.stroke(); }
  }
  if (most > 0) F.maskLine(ctx, [['MOST RUNS PASSED', 0]], x + 34, y + 214, 24, rise(clamp(most * 1.5)), { serif: false, weight: 700, col: GOLD.text, glow: false });
  if (few > 0) F.maskLine(ctx, [['A FEW STILL OPEN', 0]], x + 34, y + 252, 24, rise(few), { serif: false, weight: 700, col: CREAM, glow: false });
  F.maskLine(ctx, [['ANDREW SUTHERLAND, MIT · AS OF NOV 22', 0]], x + 34, y + h - 22, 22, rise(span(u, .5, 1)), { serif: false, weight: 600, col: P.halo2, glow: false });
  ctx.restore();
}
// the rival proof (screen card): a lectern with a handwritten manuscript, a person beside it, the referee's seat next to it EMPTY
function rivalCard(ctx, t, u, man, x, y, w, h) {
  const box = F.paperCard(ctx, t, x, y, w, h, { u, style: 'night', head: 'SAME DAY', src: 'REPORTED BY SCIENTIFIC AMERICAN' }); if (!box) return;
  const k = expoOut(u); ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(0, (1 - k) * 40);
  const gy = y + h - 64, lx = x + 210;
  ctx.fillStyle = rgba(GOLD.line, .08); ctx.fillRect(x + 30, gy, w - 60, 2);
  // lectern
  ctx.fillStyle = mixHex(P.night0, EARTH.deep, .55); ctx.fillRect(lx - 8, gy - 170, 16, 170); ctx.fillRect(lx - 50, gy - 6, 100, 6);
  ctx.save(); ctx.translate(lx, gy - 176); ctx.rotate(-.22); ctx.fillRect(-80, -8, 160, 14);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-70, -26, 140, 18 + 0 * man); ctx.restore();
  // the manuscript: handwritten pages above the lectern, lines written by hand (man 0..1)
  ctx.save(); ctx.translate(lx - 10, gy - 300); ctx.rotate(-.05 + .01 * Math.sin(t * .7));
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-70, 0, 150, 104); ctx.fillStyle = PAPER.shade; ctx.fillRect(-64, 6, 150, 104); ctx.fillStyle = PAPER.lit; ctx.fillRect(-70, 0, 150, 104);
  ctx.strokeStyle = rgba(PAPER.ink, .7); ctx.lineWidth = 1.6;
  for (let i = 0; i < 7; i++) { const lw = 120 * clamp(man * 7 - i); if (lw <= 0) break; ctx.beginPath(); ctx.moveTo(-60, 16 + i * 12); for (let q = 0; q <= 12; q++) ctx.lineTo(-60 + lw * q / 12, 16 + i * 12 + Math.sin(q * 2.7 + i) * 2.2); ctx.stroke(); }
  ctx.restore();
  E.person(ctx, lx + 70, gy, 150, { dir: -1, light: .6, look: .3, armR: [1.3, 1.7] });
  // the referee's seat, empty
  const cx = x + w - 170; ctx.strokeStyle = mixHex(P.night1, P.blue2, .6); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 40, gy); ctx.lineTo(cx - 14, gy - 160); ctx.moveTo(cx + 40, gy); ctx.lineTo(cx + 14, gy - 160); ctx.moveTo(cx - 30, gy - 72); ctx.lineTo(cx + 30, gy - 72); ctx.stroke();
  ctx.fillStyle = mixHex(P.night1, P.blue2, .6); ctx.fillRect(cx - 28, gy - 166, 56, 9); ctx.fillRect(cx + 18, gy - 204, 6, 40);
  F.maskLine(ctx, [['A RIVAL PROOF CLAIM', 0]], x + w - 34 - F.measure('A RIVAL PROOF CLAIM', 26, false, 700) - 26 * .9, y + 52, 26, rise(span(u, .3, 1)), { serif: false, weight: 700, col: CREAM, glow: false });
  F.maskLine(ctx, [['BY A HUMAN', 0]], x + w - 34 - F.measure('BY A HUMAN', 26, false, 700) - 26 * .5, y + 88, 26, rise(span(man, .4, 1)), { serif: false, weight: 700, col: GOLD.text, glow: false });
  F.maskLine(ctx, [['STILL A CLAIM', 0]], cx - 90, gy - 230, 22, rise(clamp(man * 1.5 - 1)), { serif: false, weight: 600, col: CREAM2, glow: false });
  ctx.restore();
}
// shadows on the file (3.06): a person's (head + shoulders) and a shapeless one (from the AI's window)
function shadows(ctx, t, fx, fy, a, b) {
  ctx.save(); ctx.beginPath(); ctx.rect(CORNER.desk.x0 - 6, fy - 70, CORNER.desk.x1 - CORNER.desk.x0 + 12, 80); ctx.clip();
  if (a > 0) { const x = lerp(fx - 120, fx - 10, sineIO(a)); ctx.fillStyle = rgba(P.night0, .5 * clamp(a * 2)); ctx.beginPath(); ctx.ellipse(x, fy - 34, 13, 16, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x - 40, fy + 20); ctx.quadraticCurveTo(x - 36, fy - 16, x, fy - 16); ctx.quadraticCurveTo(x + 36, fy - 16, x + 40, fy + 20); ctx.fill(); }
  if (b > 0) { const x = lerp(fx + 130, fx + 14, sineIO(b)); ctx.fillStyle = rgba(mixHex(P.night0, COOL.deep, .3), .45 * clamp(b * 2)); ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const an = i / 24 * TAU, rr = 26 + 7 * Math.sin(an * 3 + t * 1.3) + 5 * Math.sin(an * 5 - t * .9); const px = x + Math.cos(an) * rr * 1.2, py = fy - 10 + Math.sin(an) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fill(); }
  ctx.restore();
}

// ================================================================================================================ THE TAKE
const CACHE = new WeakMap();
export async function b1Take(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  E.prepareEditorial?.();
  await prepC0();
  const a0 = T.G('The man is Alexandr Wang'), G = (p, after = a0) => T.G(p, 0, after), GE = (p, after = a0) => T.GE(p, 0, after);
  const a = {};
  // c02
  a.man = a0; a.runs = G('He runs a lab'); a.msl = G('Meta Superintelligence Labs', a.runs); a.bomb = G('That bomb comparison'); a.noSrc = G('He gives no source', a.bomb);
  a.still = G('And still, his essay'); a.lazy = G('lazy thinking', a.still); a.inev = G('inevitable', a.lazy); a.look = G('But look at who is speaking');
  a.job = G("Building superintelligence is Wang's"); a.promo = G('promotes his own lab', a.job); a.here = G('Here he is, months earlier');
  a.C1 = T.clip('C1'); a.yet = G('And yet this proof came'); a.comp = G('competitor', a.yet); a.maybe = G('Maybe he means every word'); a.helps = G('It also helps him');
  a.matters = G('his lab matters more', a.helps); a.both = G('Both can be true'); a.word = G('So his word is not enough'); a.itself = G('Check the claim itself', a.word);
  // c03
  a.first = G('First check', a.itself); a.real = G('is his evidence real', a.first); a.pub = G('What was published'); a.note = G('short note', a.pub); a.lines = G('seventeen million', a.pub);
  a.noHuman = G('No human reads that'); a.notYou = G('Not you, not the man'); a.referee = G('It was written for a referee'); a.lean = G('a program called Lean', a.referee);
  a.every = G('checks every logical step', a.lean); a.talked = G('talked into anything', a.lean); a.ruling = G("The referee's ruling"); a.correct = G('correct', a.ruling);
  a.day = G('Within a day'); a.mit = G('an independent check is running', a.day); a.most = G('Most runs have passed'); a.few = G('A few are still open');
  a.box1 = G('First box: gold'); a.gold1 = G('gold', a.box1); a.holds = G('The evidence is real, and so far'); a.keeps = G('And if it keeps holding'); a.answer = G("One mathematician's answer");
  a.C2 = T.clip('C2');
  // c04
  a.game = G('But a referee only rules'); a.two = G('Check two', a.game); a.rightQ = G('does the code prove the right thing', a.two); a.worry = G("One critic's worry");
  a.defn = G('true by definition', a.worry); a.grand = G('Something that sounds grand'); a.nothing = G('says nothing', a.grand); a.author = G("But the author didn't write");
  a.book = G("referee's rule book", a.author); a.else = G('put there by someone else', a.author); a.reject = G('The people who build the referee reject');
  a.goes = G('The argument goes on'); a.box2 = G('Second box', a.goes); a.whose = G('But whose work is it'); a.three = G('Check three', a.whose);
  a.comes = G('The proof comes from'); a.bulb = G('the light bulb', a.comes); a.six = G('about six weeks', a.comes); a.gains = G('That company gains');
  a.credit = G('gets the credit', a.gains); a.listen = G('So listen to the mathematician himself'); a.doesnt = G("He doesn't fully understand"); a.publishing = G('Publishing it anyway');
  a.frankly = G('frankly completely outrageous', a.publishing); a.own = G("You don't say that about your own idea"); a.box3 = G('Third box: gold'); a.gold3 = G('gold', a.box3);
  a.compare = G('Compare that with a second proof'); a.human = G('By a human', a.compare); a.claim = G('So far, that one is still a claim'); a.checked = G("The machine's proof has been checked");
  a.nobody = G('nobody can read it', a.checked); a.end = T.G("That leaves Wang's boldest");
  const take = { a, draw: scene(a, T) };
  CACHE.set(T, take);
  return take;
}

function scene(a, T) {
  const tIn = a.man + S.SEAM_HALF, tPlate = a.end - S.SEAM_HALF, tCreep = tPlate - 2.4;
  const wang = (t) => { const k = 1 + S.CREEP * (t - (a.man - S.SEAM_HALF)); return S.WANG_CAM(k, S.trk(k)); };
  const refC = (t) => { const k = 1 + S.CREEP * (t - tPlate); return S.REFEREE_CAM(k, S.trk(k) * .3); };
  const C1 = a.C1, C2 = a.C2, c0s = a.listen - .1, c0e = c0s + 5.2;
  const CH = S.CHAIR;
  // ---------------------------------------------------------------- the camera (one take, c02 → c04)
  const K = [
    [tIn, wang(tIn)], [tIn + 1.5, wang(tIn + 1.5)], [a.runs + .6, wang(a.runs + .6)], [a.runs + 2.4, E.aim(S.Z_HEAD, W / 2 + 260, H / 2 + 40, .8)], [a.runs + 4.0, L(3300, 520, .56)],
    [a.bomb + 1.8, L(4600, 690, 1.7)], [a.still - .2, L(4605, 686, 1.76)], [a.look + .2, L(4610, 682, 1.8)],
    [a.job + 1.4, L(4620, 600, 1.42)], [a.here - .1, L(4626, 610, 1.48)], [C1.start, L(4600, GY - 52, 3.3)], [C1.end, L(4600, GY - 52, 3.42)],
    [a.comp + .4, L(4980, 640, 1.34)], [a.word + .3, L(4992, 626, 1.42)], [a.itself + 2.6, L(2150, 600, 1.12)],
    // c03
    [a.real + 1.9, L(2090, 606, 1.07)], [a.lines + 2.4, L(2760, 650, .95)], [a.notYou - .2, L(2640, 762, 2.1)], [a.referee, L(2660, 766, 2.2)],
    [a.lean + 1.1, E.aim(S.Z_LAND, CH.x, GY - 190, 1.85, 600, 560)], [a.ruling + .1, E.aim(S.Z_LAND, CH.x, GY - 200, 1.95, 640, 540)], [a.correct + .3, E.aim(S.Z_LAND, CH.x, GY - 220, 2.05, 700, 540)],
    [a.day + 1.8, E.aim(S.Z_LAND, CH.x, GY - 220, 1.6, 600, 600)], [a.box1 - .4, E.aim(S.Z_LAND, CH.x, GY - 222, 1.66, 610, 600)], [a.holds + 3, E.aim(S.Z_LAND, CH.x, GY - 200, 1.52, 620, 600)],
    [a.keeps + 1.8, L(3700, 760, 2.2)], [C2.start, L(3720, GY - 12, 2.7)], [C2.end, L(3730, GY - 12, 2.8)],
    // c04
    [a.game + 1.7, L(3420, 640, 1.34)], [a.two + 1.0, L(1900, 600, .95)], [a.defn, L(1560, 612, 1.14)], [a.grand + 1.5, L(1500, 620, 1.2)],
    [a.author + 1.9, L(2330, 560, 1.36)], [a.else + .8, L(2380, 566, 1.42)], [a.reject + 2.4, L(3060, 700, 1.9)], [a.box2 + 3, L(3066, 706, 2.0)],
    [a.whose + 2.2, L(3046, GY - 82, 3.1)], [a.three + 1.5, L(3048, GY - 84, 3.2)], [a.comes + 1.9, L(3080, 640, 2.1)], [a.six + 1, L(3090, 650, 2.2)],
    [c0s - .4, L(3118, 610, 2.45)], [a.publishing - .3, L(3112, 620, 2.4)], [a.own + 1, L(3090, 650, 2.15)], [a.gold3 + .5, L(3090, 640, 1.9)],
    [a.compare + 2.6, E.aim(S.Z_LAND, CH.x, GY - 190, 1.55, 470, 560)], [a.claim + 1.2, E.aim(S.Z_LAND, CH.x + 10, GY - 186, 1.6, 440, 556)],
    [tCreep, refC(tCreep)],
  ];
  const camRaw = (t) => (t >= tCreep ? refC(t) : F.camPath(t, K));
  const cam = (t) => E.camDrift(camRaw(t), t, 4 * smooth(span(t, tIn, tIn + 2)) * (1 - smooth(span(t, tCreep - 1.5, tCreep))), 7);

  // ---------------------------------------------------------------- c02 timings
  const portU = (t) => span(t, a.man + .5, a.man + 2.0) * (1 - span(t, a.runs - .2, a.runs + .9));
  const nameU = (t) => span(t, a.man + .9, a.man + 2.2) * (1 - span(t, a.runs + .2, a.runs + 1));
  const postU = (t) => 1 - sineIO(span(t, a.runs + .2, a.runs + 1.8));
  const signG = (t) => span(t, a.msl + .3, a.msl + 1.3) * (1 - .6 * span(t, a.bomb, a.bomb + 1.5));
  const veil2 = (t) => .5 * sio(t, a.bomb + .2, a.bomb + 1.2, a.look - .1, a.look + 1.0);
  const crHw = (t) => span(t, a.bomb + .5, a.bomb + 1.6) * (1 - span(t, a.still - .1, a.still + .7));
  const crLazy = (t) => span(t, a.still + .5, a.still + 1.7) * (1 - span(t, a.look - .2, a.look + .7));
  const balU = (t) => span(t, a.bomb + .9, a.bomb + 1.8) * (1 - span(t, a.still - .3, a.still + .5));
  const noSrcU = (t) => span(t, a.noSrc + .1, a.noSrc + .9) * (1 - span(t, a.still - .3, a.still + .3));
  const bill = (t) => span(t, a.promo - .3, a.promo + 1.6);
  const doorM = (t) => sineIO(span(t, C1.start - 1.3, C1.start)) * (1 - sineIO(span(t, C1.end, C1.end + 1.1)));
  const other = (t) => span(t, a.comp - .2, a.comp + .9);
  const star1 = (t) => F.bump(t, a.comp - .1, 2.4);
  const clap = (t) => span(t, a.maybe - .3, a.maybe + .2) * (1 - span(t, a.helps + .4, a.helps + 1));
  const conv = (t) => span(t, a.maybe + .6, a.maybe + 1.5) * (1 - span(t, a.itself + 1, a.itself + 2.2));
  const intr = (t) => span(t, a.helps + .2, a.helps + 1.1) * (1 - span(t, a.itself + 1, a.itself + 2.2));
  const bothU = (t) => span(t, a.both, a.both + .9) * (1 - span(t, a.itself + 1, a.itself + 2.2));
  // the checklist: slides to the centre (1.09), big on 'First check' (2.01), back to its corner; big again for box 1 (2.07 ★)
  const big = (t) => Math.max(sio(t, a.word + .2, a.itself + 1.2, a.real + 2.0, a.real + 3.9), sio(t, a.box1 - 1.2, a.box1 - .1, a.holds + .5, a.holds + 2.4));
  const veilBig = (t) => .42 * sio(t, a.word, a.itself + .8, a.real + 2, a.real + 3.9);
  // ---------------------------------------------------------------- c03 timings
  const pagesU = (t) => span(t, a.note - .3, a.note + .8) * (1 - span(t, a.noHuman + .4, a.noHuman + 1.4));
  const ribU = (t) => (t < a.lines - .6 ? 0 : sineIO(span(t, a.lines - .6, a.lines + 3.0)));
  const lab17 = (t) => span(t, a.lines + .6, a.lines + 1.4) * (1 - span(t, a.referee - .3, a.referee + .3));
  const walk = (t) => sineIO(span(t, a.pub + .4, a.noHuman - .2));
  const youX = (t) => (t < a.pub ? 1760 : lerp(1760, 2560, walk(t)));
  const authX = (t) => (t < a.author ? lerp(1905, 2690, walk(t)) : lerp(2690, 3140, sineIO(span(t, a.author + .4, a.author + 4.4))));
  const leafU = (t) => sio(t, a.noHuman - .3, a.noHuman + .4, a.notYou + 1.2, a.notYou + 2.0);
  const scanU = (t) => span(t, a.every - .3, a.every + 2.6);
  const leanL = (t) => span(t, a.lean + .2, a.lean + 1) * (1 - span(t, a.ruling - .4, a.ruling + .1));
  const card = (t) => Math.max(span(t, a.correct - .65, a.correct + .45) * (1 - span(t, a.day + .2, a.day + 1.2)), span(t, a.checked + .3, a.checked + 1.4));
  const veil3 = (t) => .5 * sio(t, a.day + .1, a.day + 1.2, a.holds + .6, a.holds + 2.4);
  const comU = (t) => span(t, a.day + .2, a.day + 1.1) * (1 - span(t, a.box1 - 1.4, a.box1 - .8));
  const comLit = (t) => span(t, a.day + 1.0, a.mit - .3);
  const mitU = (t) => span(t, a.mit + .1, a.mit + 1.0) * (1 - span(t, a.box1 - 1.3, a.box1 - .7));
  const mostU = (t) => span(t, a.most, a.most + 1.2), fewU = (t) => span(t, a.few, a.few + .6);
  const qBig = (t) => span(t, a.real - .1, a.real + .6) * (1 - span(t, a.real + 2.0, a.real + 2.5));
  const ribM = (t) => sineIO(span(t, C2.start - 1.2, C2.start)) * (1 - sineIO(span(t, C2.end, C2.end + 1.0)));
  // ---------------------------------------------------------------- c04 timings
  const twinX = (t) => lerp(S.BOARD.x, 1250, sineIO(span(t, a.two + .1, a.two + 2.0))) + (1250 - S.BOARD.x) * -sineIO(span(t, a.author + .2, a.author + 2.0));
  const twinOn = (t) => t > a.two && t < a.author + 2.2;
  const fold = (t) => span(t, a.defn - .3, a.defn + .9) * (1 - span(t, a.author - .5, a.author + .2));
  const aeq = (t) => span(t, a.defn + .4, a.defn + 1.2) * (1 - span(t, a.author - .4, a.author + .1));
  const tautL = (t) => span(t, a.worry + .2, a.worry + 1) * (1 - span(t, a.author - .5, a.author));
  const veil4 = (t) => .5 * sio(t, a.author + 1.2, a.author + 2.4, a.reject - .2, a.reject + 1.2) + .55 * sio(t, a.publishing - .4, a.publishing + .3, a.own + .3, a.own + 1.2);
  const shelfU = (t) => span(t, a.author + 1.6, a.author + 2.6) * (1 - span(t, a.reject - .3, a.reject + .3));
  const takeB = (t) => span(t, a.else - .2, a.else + 1.0);
  const sh1 = (t) => span(t, a.whose + .4, a.whose + 1.8) * (1 - span(t, a.comes, a.comes + .8)), sh2 = (t) => span(t, a.whose + 1.4, a.three + .6) * (1 - span(t, a.comes, a.comes + .8));
  const alpL = (t) => span(t, a.comes + .4, a.comes + 1.2) * (1 - span(t, a.bulb - .2, a.bulb + .4));
  const bulbOn = (t) => (t < a.bulb + .2 ? 0 : t < a.bulb + .8 ? (Math.sin((t - a.bulb) * 60) > .1 ? .7 : .1) : span(t, a.bulb + .8, a.bulb + 1.1));
  const leaf = (t) => span(t, a.six - .5, a.six + 1.6);
  const sixL = (t) => span(t, a.six + .2, a.six + 1) * (1 - span(t, c0s - .8, c0s - .2));
  const flare = (t) => .8 * F.bump(t, a.gains + .3, 2.6) + .5 * span(t, c0s - .9, c0s);
  const c0M = (t) => sineIO(span(t, c0s - .3, c0s + .9)) * (1 - sineIO(span(t, c0e - 1.0, c0e)));
  const c0hide = (t) => span(t, c0s - 1.0, c0s - .3) * (1 - span(t, c0e - .2, c0e + .6));
  const quoteU = (t) => span(t, a.publishing - .2, a.publishing + .6) * (1 - span(t, a.own + .2, a.own + .8));
  const hold = (t) => span(t, a.doesnt + .4, a.doesnt + 1.6);                        // the author lifts the file and holds it away
  const fly3 = (t) => sineIO(span(t, a.box3 - 1.5, a.box3));                        // the file flies up into box 3 (★)
  const burst3 = (t) => F.bump(t, a.box3 - .05, 1.6);
  const rivalU = (t) => span(t, a.compare + .4, a.compare + 1.4) * (1 - span(t, tCreep - .1, tCreep + .6));
  const manU = (t) => span(t, a.compare + 1.0, a.human + 1.0) + .5 * span(t, a.claim, a.claim + .8);
  const youO = (t) => {
    const w = walk(t); if (t > a.pub && w > 0 && w < 1) return { walk: (youX(t) - 1760) / 12, view: 'side', look: .2 };
    const lf = leafU(t); return { armR: [lerp(.2, 1.2, lf), lerp(.1, 1.5, lf)], look: lerp(.9, -.4, lf) + .4 * span(t, a.lean, a.lean + 1.5) };
  };

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t >= tPlate) { S.plateReferee(ctx, t, T); return; }
    if (t < tIn) { S.plateWang(ctx, t, T); return; }
    const c = cam(t);
    const dimH = .5 * smooth(span(t, a.runs, a.msl + 1.5)) + .55 * portU(t);
    const towerDark = lerp(.68, .8, span(t, a.runs, a.msl + 1));
    const fileOnDesk = t < a.doesnt + .4;
    const aX = authX(t), aWalk = (t > a.pub && t < a.noHuman - .2) || (t > a.author + .4 && t < a.author + 4.4);
    const aHold = hold(t) * (1 - fly3(t) * 0);
    S.landWorld(ctx, c, t, {
      head: { dim: dimH },
      post: postU(t), windows: 1 - span(t, a.msl + 1, a.msl + 3),
      board: { chalk: 1, spot: 1 },
      tower: { u: 1, dark: towerDark, pour: .3 * (1 - span(t, a.runs, a.msl)), from: [S.BOARD.spot.x, S.BOARD.spot.y] },
      ribbon: ribU(t) > 0 ? { u: ribU(t) } : null,
      chair: { referee: 1, card: card(t), look: .1 + .5 * span(t, a.lean, a.lean + 1) * (1 - span(t, a.day, a.day + 1)) },
      labs: .5, billboard: bill(t), otherLab: other(t),
      you: t < tCreep - 3 ? { x: youX(t), o: youO(t) } : false,
      land: (cx) => {
        if (t < a.itself + 3) labDoor(cx, t, signG(t));
        F.file(cx, t, S.BOARD.spot.x, S.BOARD.spot.y, 40, { glow: 1, seed: 5 });   // THE FILE on the board's spot (the ribbon's origin)
        corner(cx, t, { flare: flare(t), bulb: bulbOn(t), leaf: leaf(t), fast: 1 + 2 * span(t, a.comes, a.comes + 2) });
        // the twin board (c04: slides out from behind the real board and back)
        if (twinOn(t)) twinBoard(cx, t, twinX(t), fold(t), S.BOARD.x - S.BOARD.w / 2 - 26, 1, aeq(t));
        // the author (no face, no name): walks with you to the ribbon (c03), to his corner (c04), holds the file away from himself
        if (t < tCreep - 3) {
          const look = t > a.comes ? .4 + .3 * Math.sin(t * .4) : lerp(.6, -.4, leafU(t));
          const armR = aHold > 0 ? [lerp(1.2, 1.75, aHold), lerp(1.9, 1.7, aHold)] : [1.2, 1.9];
          const hh = E.person(cx, aX, GY, 70, { dir: t > a.author ? -1 : 1, light: .7, look, armR, ...(aWalk ? { walk: aX / 12, view: 'side' } : {}) });
          // the file on his desk → in his hand at arm's length → flies to box 3 (handled in screen space)
          const fx = CORNER.desk.x0 + 60, fy = CORNER.desk.y - 16;
          if (t > a.author && fly3(t) <= 0) {
            const hx = hh?.R ? hh.R[0] : aX - 30, hy = hh?.R ? hh.R[1] : GY - 40, p = sineIO(aHold);
            F.file(cx, t, lerp(fx, hx - 6, p), lerp(fy, hy - 10, p) - 30 * Math.sin(Math.PI * p), 26, { glow: 1, seed: 5, rot: .15 * p });
            if (fileOnDesk) shadows(cx, t, fx, fy, sh1(t), sh2(t));
          }
        }
        // the pages of the short note flutter out of the file (2.02)
        const pu = pagesU(t);
        if (pu > 0) for (let i = 0; i < 4; i++) { const sp = S.BOARD.spot, k = sineIO(clamp(pu * 1.3 - i * .1)), x = sp.x + lerp(0, -150 + i * 34, k), y = sp.y + lerp(0, -110 + Math.abs(i - 1.5) * 18, k) + 5 * Math.sin(t * 1.3 + i);
          cx.save(); cx.translate(x, y); cx.rotate(-.25 + i * .14 + .05 * Math.sin(t + i)); cx.fillStyle = PAPER.lit; cx.fillRect(-15, -20, 30, 40); cx.fillStyle = rgba(PAPER.faint, .6); for (let q = 0; q < 5; q++) cx.fillRect(-10, -13 + q * 6, 20, 1.5); cx.restore(); }
        // the scan light runs along the ribbon to the referee (Lean checks every step)
        const su = scanU(t); if (su > 0 && su < 1) { const p = ribAt(lerp(0, ribX(CH.x - 40), sineIO(su))); halo(cx, p[0], p[1], 34, .9, GOLD.halo, GOLD.core); }
        // ★ 1.08: the file glows in the OTHER lab's window
        const s1 = star1(t); if (s1 > 0) halo(cx, S.LABS.other, GY - 120, 260 * s1, .35 * s1, GOLD.halo, GOLD.core);
        // Wang (small, no face) by the fence, applauding
        if (t > C1.end - 1 && t < a.itself + 3) { const cl = clap(t), ph = Math.sin(t * 14) * cl; E.person(cx, 4900, GY, 64, { dir: 1, light: .6, look: .3, armR: [1.1 + .5 * cl + .15 * ph, 2.0 + .5 * cl], armL: [-(1.1 + .5 * cl) + .15 * ph, -(2.0 + .5 * cl)] }); }
        // CONVICTION · INTEREST in chalk under the billboard (the headline over his own lab)
        const cu = conv(t), iu = intr(t), bu = bothU(t);
        if (cu > 0) F.goldText(cx, [['CONVICTION', 0]], 4470, GY - 290, 30, rise(cu), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM });
        if (iu > 0) F.goldText(cx, [['INTEREST', 0]], 4740, GY - 290, 30, rise(iu), { serif: false, weight: 700, spacing: .08, align: 'center', col: CREAM });
        if (bu > 0) { cx.fillStyle = rgba(CREAM, .7); cx.fillRect(4380, GY - 278, 180 * smooth(bu), 3); cx.fillRect(4670, GY - 278, 140 * smooth(span(bu, .2, 1)), 3); }
        // bubbles and medals bounce off the referee (can't be talked into anything)
        if (t > a.talked - .9 && t < a.ruling + .6) for (let i = 0; i < 3; i++) {
          const t0 = a.talked - .8 + i * .55, p = clamp((t - t0) / 1.4); if (p <= 0 || p >= 1) continue;
          const hx = CH.x - 10, hy = GY - CH.h - 70, sx = hx - 260, sy = hy - 60 + i * 40, hit = .42;
          const x = p < hit ? lerp(sx, hx - 24, p / hit) : hx - 24 - (p - hit) * 160, y = p < hit ? lerp(sy, hy, p / hit) - 40 * Math.sin(Math.PI * p / hit) : hy + 340 * (p - hit) ** 2 - 60 * (p - hit);
          bubble(cx, x, y, 34, (p - hit) * 4, ['!', 'medal', '?'][i]);
        }
      },
    });
    // ---------------------------------------------------------------- screen space
    // 1.01 the portrait print (ONCE) rises out of the post header's avatar + the nameplate
    const pu = portU(t);
    if (pu > 0) { const pr = S.postRect(c); if (pr) F.portrait(ctx, t, pr.x + pr.w * .8, pr.y + 6, 430, { u: pu }); F.nameplate(ctx, t, 130, 772, nameU(t)); }
    // 1.03 / 1.04 the crops over the veil: homework (+ the balance, SOURCE: —), then lazy thinking
    const v2 = veil2(t) + veilBig(t) + veil3(t) + veil4(t);
    if (v2 > 0) F.veil(ctx, Math.min(.62, v2));
    if (crHw(t) > 0 || crLazy(t) > 0) {
      const x = 180, y = 290, w = 1560;
      if (crHw(t) > 0) { const q = F.xQuote(ctx, t, 'homework', x, y, w, { u: crHw(t), hiU: span(t, a.bomb + 1.4, a.bomb + 2.3) });
        const nu = noSrcU(t); if (nu > 0 && q) { const yy = y + q.full + 58; F.goldSpan(ctx, [[x + 10, yy + 10], [x + 380, yy + 10]], 0, smooth(nu), { w: 1.2, spark: false });
          F.goldText(ctx, [['SOURCE: ', .6], ['—', 0]], x + 10, yy, 30, rise(nu), { serif: false, weight: 700, spacing: .08 }); } }
      if (crLazy(t) > 0) F.xQuote(ctx, t, 'lazy', x, y, w, { u: crLazy(t), hiU: span(t, a.lazy - .05, a.lazy + 1.0) });
      const bu = balU(t);
      if (bu > 0) F.balance(ctx, t, 1500, 620, 150, { u: bu, tilt: .85,
        left: (cx, px, py) => F.notebook(cx, t, px, py, 84, { a: clamp(bu * 3) }), right: (cx, px, py) => F.file(cx, t, px, py - 26, 38, { glow: 1, a: clamp(bu * 3) }) });
    }
    // C1: the plate grows out of the lab door and goes back into it
    const dm = doorM(t); if (dm > 0) F.clipPlate(ctx, t, T, 'C1', { from: scrRect(c, DOOR.x - DOOR.w / 2, GY - DOOR.h, DOOR.x + DOOR.w / 2, GY), morph: dm });
    // c03 labels
    const l17 = lab17(t); if (l17 > 0) { const p = scr(c, 2900, GY - 10); F.goldLabel(ctx, p[0], p[1] - 10, F.SOURCES.lines17, F.SOURCES.lines17Sub, l17, { dx: 60, dy: -110, size: 32 }); }
    const cw = span(t, a.correct - .2, a.correct + .5) * (1 - span(t, a.day, a.day + .6)); if (cw > 0) { const p = scr(c, CH.x + 30, GY - CH.h - 150); F.goldText(ctx, [['CORRECT', 1]], p[0], p[1], 48, rise(cw), { serif: false, weight: 800, spacing: .08, glow: true }); }
    const ll = leanL(t); if (ll > 0) { const p = scr(c, CH.x + 20, GY - CH.h - 40); F.goldLabel(ctx, p[0], p[1], 'LEAN', 'PROOF CHECKER · A PROGRAM', ll, { dx: 120, dy: -90, size: 32 }); }
    const cu = comU(t); if (cu > 0) communityCard(ctx, t, cu, comLit(t), 110, 280, 820, 380);
    const mu = mitU(t); if (mu > 0) mitCard(ctx, t, mu, mostU(t), fewU(t), 990, 280, 820, 380);
    if (t > a.holds - .5 && t < a.keeps + .5) F.source(ctx, t, a.holds - .2, a.keeps + .3, F.SOURCES.clay);
    const rm = ribM(t); if (rm > 0) F.clipPlate(ctx, t, T, 'C2', { from: scrRect(c, 3650, GY - 40, 3790, GY + 14), morph: rm });
    // c04
    const tl = tautL(t); if (tl > 0) { const p = scr(c, twinX(t) + S.BOARD.w / 2 + 10, GY - 420); F.goldLabel(ctx, p[0], p[1], 'OBJECTION: “TAUTOLOGY”', 'AMY NIELSEN', tl, { dx: 50, dy: -50, size: 32 }); }
    const shu = shelfU(t); let hit = null;
    if (shu > 0) {
      const sl = scr(c, S.BOARD.spot.x, S.BOARD.spot.y + S.BOARD.spot.h / 2 + 40);
      hit = shelfCard(ctx, t, shu, takeB(t), 440, 230, 1040, 420);
      if (hit) F.goldSpan(ctx, [[sl[0], sl[1]], [lerp(sl[0], hit[0], .5), Math.min(sl[1], hit[1]) - 80], [hit[0], hit[1] - 8]], 0, smooth(span(t, a.book - .3, a.book + .9)) * (1 - span(t, a.reject - .5, a.reject)), { w: 1.4, a: .9 });
      if (takeB(t) > 0) F.source(ctx, t, a.else, a.reject, F.SOURCES.mathlib);
    }
    const al = alpL(t); if (al > 0) { const p = scr(c, CORNER.x1 - 70, GY - 82); F.goldLabel(ctx, p[0], p[1], 'LEVENT ALPÖGE', 'ANTHROPIC · CLAUDE', al, { dx: 120, dy: -170, size: 32 }); }
    const s6 = sixL(t); if (s6 > 0) { const p = scr(c, CORNER.cal.x + 10, CORNER.cal.y + 40); const [l1, l2] = F.SOURCES.sixWeeks.split(' · '); F.goldLabel(ctx, p[0], p[1], l1, l2, s6, { dx: -90, dy: -120, size: 32 }); }
    const cm = c0M(t); if (cm > 0) c0Plate(ctx, t, c0s, cm, scrRect(c, CORNER.win.x, CORNER.win.y, CORNER.win.x + CORNER.win.w, CORNER.win.y + CORNER.win.h), inOut(t, c0s + .9, c0s + 1.6, c0e - 1.4, c0e - .9));
    const qu = quoteU(t); if (qu > 0) F.quoteCard(ctx, t, T, { text: F.SOURCES.outrageous, x: 340, y: 250, w: 1240, size: 86, credit: F.SOURCES.outrageousSrc, spoken: ['frankly', 'outrageous'], after: a.publishing - .5, mode: 'hi', u: qu });
    // ★ 3.10: the file flies out of his hand into box 3 (it fills by itself on 'Third box: gold')
    const f3 = fly3(t);
    if (f3 > 0 && t < a.box3 + .2) {
      const h0 = scr(c, authX(t) - 40, GY - 62), bx = F.checkBox(2), x = lerp(h0[0], bx.x + bx.w / 2, f3), y = lerp(h0[1], bx.y + bx.h / 2, f3) - 260 * Math.sin(Math.PI * f3);
      F.file(ctx, t, x, y, lerp(26 * h0[2], 30, f3), { glow: 1, seed: 5, rot: .5 * Math.sin(Math.PI * f3) });
    }
    const b3 = burst3(t); if (b3 > 0) { const bx = F.checkBox(2); halo(ctx, bx.x + bx.w / 2, bx.y + bx.h / 2, 160 * b3, .5 * b3, GOLD.halo, GOLD.core); }
    const ru = rivalU(t); if (ru > 0) rivalCard(ctx, t, ru, manU(t), 1010, 200, 800, 600);
    // the checklist (every frame; hides itself in C1/C2, here also in C0)
    const bg = big(t);
    F.checklist(ctx, t, T, { big: bg, lit: t > a.word && t < a.real ? 0 : undefined, a: 1 - c0hide(t) });
    const qb = qBig(t) * (bg > .6 ? 1 : 0);
    if (qb > 0) { F.goldText(ctx, [['CHECK 1 OF 5', .9]], W / 2, 450, 26, rise(qb), { serif: false, weight: 700, spacing: .08, align: 'center' });
      F.goldText(ctx, [['IS HIS EVIDENCE REAL?', 0]], W / 2, 506, 40, rise(span(qb, .2, 1)), { serif: false, weight: 700, spacing: .04, align: 'center', col: CREAM }); }
  };
}
