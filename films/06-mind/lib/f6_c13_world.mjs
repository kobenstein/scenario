// Film 6 · c13 · the three worlds of "And the last one is yours." (owned by c13)
//   A  the morning hall of c04 at dawn (imports c04's room: wall, bench, sitter geometry, the lotus on the water); here: the dawn light
//      through the window (the plate's light), the sitter lit by it with breath like morning mist, the water, the labels
//   B  a dark table at night: two comfort cards under a small lamp, the PERSON / AI tags, two people behind the table, the ember that
//      passes with a hand on a shoulder, cool text lines falling like cheap confetti, the light of the one ember filling the frame
//   C  the ward at three in the morning: teal walls, a bed in three-quarter view, the patient under a blanket, the nurse on a chair
//      holding the hand, one warm night light on the wall, a monitor with the steady cool pulse line, the rules sheet, a curtain
// Every export is a pure function of t and its options; static layers are cached by key (f6_kit layer()).
import { W, H, rgba, clamp, lin, mix, sm, eout, ein, prng, drift, canvas, text, hatch } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { figure, POSES, reachArm, life, handPos } from './figure.mjs';
import { paperSheet, scribble } from './paper.mjs';
import { F6, layer, once, ember, breathe, reveal, pane, coolLine } from './f6_kit.mjs';
import { WIN, FIG, FLOOR_Y, LOTUS } from './f6_c04_room.mjs';

const TAU = Math.PI * 2;
export const QUART = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));
export const EXPO_OUT = (x) => (x = clamp(x), x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
export const EXPO_IN = (x) => (x = clamp(x), x <= 0 ? 0 : Math.pow(2, 10 * (x - 1)));
const hex2 = (h) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
export const mixHex = (a, b, u) => { const A = hex2(a), B = hex2(b); return '#' + A.map((v, i) => Math.round(mix(v, B[i], clamp(u))).toString(16).padStart(2, '0')).join(''); };
export const aimCam = (px, py, z) => ({ x: px, y: py, z });
export const lerpCam = (A, B, u) => ({ x: mix(A.x, B.x, u), y: mix(A.y, B.y, u), z: Math.exp(mix(Math.log(A.z), Math.log(B.z), u)) });
export const worldBox = (m) => ({ x: -m.tx / m.k, y: -m.ty / m.k, w: W / m.k, h: H / m.k });
const caps = (g, s, x, y, size, col, o = {}) => text(g, s, x, y, { size, weight: 600, color: col, spacing: o.spacing ?? size * .3, align: o.align || 'left' });

// a caps label that is written by a mask reveal (u 0..1) and wiped back out (u falls); never fades. x, y = baseline left
export function label(ctx, s, x, y, u, { size = 17, col = rgba(F6.cream, .9), spacing, w = 700 } = {}) {
  if (u <= 0) return;
  reveal(ctx, x - 6, y - size * 1.4, w, size * 2.2, u, (g) => caps(g, s, x, y, size, col, { spacing: spacing ?? size * .32 }));
}

// ================================================================ a light that fills the frame (screen space): warm core, lamp tones,
// a stippled falloff that stays fine at any radius (the kit's bloom sprite goes blotchy when pushed). r = radius of the light, a 0..1
const DAWN = ['#fff6e2', '#ffd9a0', '#f4a77a'], LAMPT = ['#fff1d6', '#ffcf8a', '#e08a3c'];
const DOTS = once('c13:dots', () => { const q = prng(31), p = []; for (let i = 0; i < 2600; i++) { const d = Math.sqrt(q()), an = q() * TAU; p.push([Math.cos(an) * d, Math.sin(an) * d, d, q()]); } return p; });
export function lightFill(ctx, { x, y, r, a = 1, tone = 'lamp', op = 'lighter' }) {
  if (r <= 1 || a <= .003) return; const [c0, c1, c2] = tone === 'dawn' ? DAWN : LAMPT;
  ctx.save(); ctx.globalCompositeOperation = op;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(c0, .9 * a)); g.addColorStop(.22, rgba(c1, .55 * a)); g.addColorStop(.6, rgba(c2, .14 * a)); g.addColorStop(1, rgba(c2, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
  const dw = 1.3 + Math.min(1.2, r / 900);
  for (const [px, py, d, k] of DOTS) { const al = (1 - d) * (1 - d) * (.1 + .2 * k) * a; if (al < .01) continue; ctx.fillStyle = rgba(c1, al); ctx.fillRect(x + px * r - dw / 2, y + py * r - dw / 2, dw, dw); }
  ctx.restore();
}
// the same light drawn OPAQUE (source-over) as the plate-like surface the world grows out of: at k = 1 the frame is only this light
export function lightSheet(ctx, t, { x, y, r, k }) {
  if (k <= 0) return; const [c0, c1, c2] = LAMPT, br = 1 + .03 * Math.sin(t * 1.7) + .015 * Math.sin(t * 4.3);
  ctx.save(); ctx.globalAlpha = 1;
  // a disc of light (soft edge) whose strength grows with k: at k 1 it is opaque and covers the frame; outside it the frame shows through
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * br); g.addColorStop(0, rgba(c0, k)); g.addColorStop(.42, rgba(c1, k)); g.addColorStop(.86, rgba(c2, k)); g.addColorStop(1, rgba(c2, 0));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const q = prng(31 + Math.floor(t * 12)); ctx.fillStyle = rgba(c2, .32 * k);
  for (const [px, py, d, kk] of DOTS) { if (d < .35) continue; if (kk > (d - .35) * 1.4) continue; const s = .8 + q() * 1.1; ctx.fillRect(x + px * r + (q() - .5) * 2, y + py * r + (q() - .5) * 2, s, s); }
  ctx.restore();
}

// ================================================================ WORLD A · the hall at dawn
// the window's frame only (copied from f6_kit paneFrame 'window'; the glass itself is the plate, drawn by the scene clipped to the rect)
export function windowFrame(ctx, x, y, w, h) {
  const b = 22; ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  const fg = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); fg.addColorStop(0, '#1c1a2a'); fg.addColorStop(1, '#0d0c18'); ctx.fillStyle = fg; ctx.beginPath(); ctx.rect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b); ctx.rect(-w / 2, -h / 2, w, h); ctx.fill('evenodd');
  ctx.strokeStyle = 'rgba(200,210,240,.14)'; ctx.lineWidth = 1; ctx.strokeRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b);
  // the frame's inner edge is lit by the dawn behind the glass
  ctx.strokeStyle = 'rgba(255,230,190,.5)'; ctx.lineWidth = 2; ctx.strokeRect(-w / 2 - 1, -h / 2 - 1, w + 2, h + 2);
  ctx.fillStyle = '#15131f'; ctx.fillRect(-w / 2 - b, h / 2 + b - 8, w + 2 * b, 16); ctx.restore();
}
// the dawn's wash on the wall and the floor (cached): warm from the window at the right, a shaft falling onto the bench
const WX = -300, WY = -200, WW = 2600, WH = 1300;
export function dawnWash(ctx, a = 1) {
  const L = layer('c13:dawnwash', WW, WH, (g, c) => {
    g.translate(-WX, -WY);
    const r = g.createRadialGradient(WIN.x, WIN.y, 120, WIN.x, WIN.y, 1500); r.addColorStop(0, 'rgba(255,226,176,.46)'); r.addColorStop(.3, 'rgba(255,220,170,.2)'); r.addColorStop(1, 'rgba(255,220,170,0)'); g.fillStyle = r; g.fillRect(WX, WY, WW, WH);
    // the shaft: from the window's lower half to the floor at the left (the sitter and the bench stand in it)
    g.beginPath(); g.moveTo(WIN.x - WIN.w / 2, WIN.y - 60); g.lineTo(WIN.x - WIN.w / 2, WIN.y + WIN.h / 2); g.lineTo(120, FLOOR_Y + 60); g.lineTo(-100, FLOOR_Y - 180); g.closePath();
    const s = g.createLinearGradient(WIN.x, WIN.y, 200, FLOOR_Y); s.addColorStop(0, 'rgba(255,226,176,.2)'); s.addColorStop(.55, 'rgba(255,226,176,.07)'); s.addColorStop(1, 'rgba(255,226,176,0)'); g.fillStyle = s; g.fill();
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .4, g: 1.1, seed: 13, mid: false, boost: 1.2 });
  });
  ctx.save(); ctx.globalAlpha = a; ctx.drawImage(L, WX, WY); ctx.restore();
}
// the still dark water beyond the floor line (world space); the window's dawn lies on it as a warm smear; a faint sheen whose
// strength falls with the zoom so the push into the water lands on a plain dark surface
export function water(ctx, t, box, { sheen = 1 } = {}) {
  const y0 = FLOOR_Y, y1 = box.y + box.h + 10;
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 500); g.addColorStop(0, '#0d1226'); g.addColorStop(1, '#070a18'); ctx.fillStyle = g; ctx.fillRect(box.x - 10, y0, box.w + 20, y1 - y0);
  if (sheen > .003) { ctx.save(); ctx.beginPath(); ctx.rect(box.x - 10, y0, box.w + 20, y1 - y0); ctx.clip(); ctx.translate(1100 + 40 * Math.sin(t * .4), y0 + 300); ctx.rotate(.5);
    const s = ctx.createLinearGradient(-300, 0, 300, 0); s.addColorStop(0, 'rgba(216,247,255,0)'); s.addColorStop(.5, `rgba(216,247,255,${.05 * sheen})`); s.addColorStop(1, 'rgba(216,247,255,0)'); ctx.fillStyle = s; ctx.fillRect(-300, -1500, 600, 3000); ctx.restore(); }
}
// a light's reflection on the water (copied from c04 waterGlow: a soft vertical smear under x on the floor line)
export function waterGlow(ctx, x, w, len, col, a) {
  if (a <= .002) return; ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(x, FLOOR_Y); ctx.scale(w / 100, len / 100);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 100); g.addColorStop(0, rgba(col, a)); g.addColorStop(.5, rgba(col, a * .35)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 100, 0, TAU); ctx.fill(); ctx.restore();
}
// the sitter of c04 (same seat, same clothes) lit by the dawn from the window at the right: a cream rim, the form light from the window
export function sitterDawn(ctx, t) {
  figure(ctx, FIG.x, FIG.y, FIG.s, { ...POSES.sit, head: .1, sh: [.5, .42], el: [.95, 1] },
    { t, seed: FIG.seed, accent: '#8a5a3a', dress: { pants: '#2a2128' }, light: { x: WIN.x, y: WIN.y, col: '#ffe6bd', a: .7 }, rim: rgba('#ffe2b0', .85), rimSide: 1, shadow: false });
}
// breath like morning mist: on each exhale a pale puff leaves the mouth and drifts forward and up, thinning (figure.life's breath phase)
const fract = (x) => x - Math.floor(x), hashF = (x) => fract(Math.sin(x * 127.1 + 311.7) * 43758.5453);
export function mist(ctx, t, mouth, seed, a = 1) {
  const sd = seed * 1.37 + .5, om = TAU / 4.2 * (1 + .12 * (hashF(sd) - .5)), ph = sd * 2.3;
  const n = once('c13:mistnoise', () => vnoise(41));
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 2; k++) {   // the current exhale and the one before it (still thinning)
    const K = Math.floor((om * t + ph - Math.PI / 2) / TAU) - k, tk = (Math.PI / 2 + TAU * K - ph) / om, age = t - tk; if (age < 0 || age > 3.6) continue;
    const u = age / 3.6, dx = 12 + 90 * eout(u) + 16 * (n(age * .7, K) - .5), dy = -6 - 60 * u * u + 10 * (n(age * .9, K + 7) - .5);
    const r = 10 + 40 * u, al = a * Math.sin(Math.PI * Math.min(1, u * 1.2)) * (1 - u * .55);
    for (let j = 0; j < 4; j++) { const q = j / 4, px = mouth[0] + dx * (.5 + .5 * q) + (n(j * 3.1, K) - .5) * 14 * u, py = mouth[1] + dy * (.55 + .45 * q) + (n(j * 1.7 + 5, K) - .5) * 10 * u, rr = r * (.65 + .35 * q);
      const g = ctx.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, rgba('#efe9df', al * .8)); g.addColorStop(.55, rgba('#d8d2c8', al * .32)); g.addColorStop(1, rgba('#d8d2c8', 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, rr, 0, TAU); ctx.fill(); }
  }
  ctx.restore();
}
// a halo outside a rectangle (screen space): the dawn's light bleeding from the window into the room; the glass itself stays the plate
export function haloOutside(ctx, rect, { x, y, r, a, tone = 'dawn' }) {
  if (a <= .003) return; ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, H); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip('evenodd');
  lightFill(ctx, { x, y, r, a, tone }); ctx.restore();
}
// the lotus's petal openings for "Compassion can be practiced": three rings open on three breaths; staggered 60 ms per petal
export function lotusOpen(t, t0, { step = .85, per = .75 } = {}) {
  const open = []; const ring = [[0, 8], [8, 14], [14, 18]];
  ring.forEach(([i0, i1], k) => { for (let i = i0; i < i1; i++) open[i] = EXPO_OUT((t - (t0 + k * step + (i - i0) * .06)) / per); });
  return open;
}

// ================================================================ WORLD B · the table at night
export const TB = { yFar: 600, x0: -400, x1: 2400, yNear: 1500 };
export const LAMPB = { x: 1420, y: 600, s: 1.2, dir: .5 };
export const CARDS = [{ x: 700, y: 690, w: 330, h: 215, rot: -.045, seed: 3, tag: 'PERSON' }, { x: 1092, y: 712, w: 330, h: 215, rot: .035, seed: 3, tag: 'AI' }];
export const FA = { x: 560, y: 560, s: 2.0, seed: 6 }, FB = { x: 1010, y: 552, s: 1.95, seed: 9 };
const INK = '#2a2420', KC = 2;
const TBOX = [TB.x0, TB.yFar - 40, TB.x1 - TB.x0, TB.yNear - TB.yFar + 40];
export function tableB(ctx) {
  const L = layer('c13:table', TBOX[2], TBOX[3], (g, c) => {
    g.translate(-TBOX[0], -TBOX[1]); const n = vnoise(5), r = prng(8), yB = TB.yNear;
    const tg = g.createLinearGradient(0, TB.yFar, 0, yB); tg.addColorStop(0, '#1b1522'); tg.addColorStop(1, '#0d0a12'); g.fillStyle = tg; g.fillRect(TB.x0, TB.yFar, TB.x1 - TB.x0, yB - TB.yFar);
    const lg = g.createRadialGradient(LAMPB.x - 120, LAMPB.y + 80, 0, LAMPB.x - 120, LAMPB.y + 80, 1500); lg.addColorStop(0, 'rgba(255,190,120,.14)'); lg.addColorStop(.4, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = lg; g.fillRect(TB.x0, TB.yFar, TB.x1 - TB.x0, yB - TB.yFar);
    g.lineCap = 'round';
    for (let k = 0; k < 260; k++) { const yy = TB.yFar + r() * (yB - TB.yFar), light = r() < .4; g.strokeStyle = light ? `rgba(150,110,90,${.04 + r() * .09})` : `rgba(10,6,10,${.12 + r() * .2})`; g.lineWidth = .6 + r() * 1.4; g.beginPath(); for (let x = TB.x0; x <= TB.x1; x += 30) { const yv = yy + (n(x * .004, yy * .02) - .5) * 14; x === TB.x0 ? g.moveTo(x, yv) : g.lineTo(x, yv); } g.stroke(); }
    g.fillStyle = 'rgba(255,200,150,.12)'; g.fillRect(TB.x0, TB.yFar, TB.x1 - TB.x0, 2);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .22, g: 1, seed: 4, mid: false, boost: 1 });
  });
  ctx.drawImage(L, TBOX[0], TBOX[1]);
}
// the dark wall beyond the table (cached): the lamp's light on it, nothing else
export function wallB(ctx) {
  const L = layer('c13:wallB', 3000, 1300, (g, c) => {
    g.translate(400, 300); g.fillStyle = '#0c0a14'; g.fillRect(-400, -300, 3000, 1300);
    const lg = g.createRadialGradient(LAMPB.x - 60, LAMPB.y - 130, 0, LAMPB.x - 60, LAMPB.y - 130, 900); lg.addColorStop(0, 'rgba(255,180,110,.12)'); lg.addColorStop(.5, 'rgba(255,180,110,.03)'); lg.addColorStop(1, 'rgba(255,180,110,0)'); g.fillStyle = lg; g.fillRect(-400, -300, 3000, 1300);
    const r = prng(77); g.fillStyle = 'rgba(255,240,220,.035)'; for (let i = 0; i < 7000; i++) g.fillRect(-400 + r() * 3000, -300 + r() * 1300, 1.5, 1.5);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .2, g: 1, seed: 9, mid: false, boost: 1 });
  });
  ctx.drawImage(L, -400, -300);
}
export function lampB(ctx, t, a = 1) { return ember(ctx, t, { x: LAMPB.x, y: LAMPB.y, kind: 'lamp', s: LAMPB.s, dir: LAMPB.dir, a, r: 240 }); }
// a card's face (cached at 2×, card-local origin top-left): cream paper, four lines of the same handwriting on both cards
export function cardFace(i) {
  const c = CARDS[i];
  return layer('c13:card' + i, Math.ceil(c.w * KC) + 8, Math.ceil(c.h * KC) + 8, (g, cv) => {
    g.translate(4, 4); g.scale(KC, KC);
    paperSheet(g, 0, 0, c.w, c.h, { tone: '#efe4cc', seed: 11 + i, shadow: false, light: [c.w * 1.3, -c.h * .4], lines: 0 });
    // the same words on both: identical seeds (the handwriting is the same)
    const rows = [[26, 62, .82], [26, 92, .9], [26, 122, .7], [26, 152, .5]];
    rows.forEach(([x, y, k], j) => scribble(g, x, y, (c.w - 52) * k, 4.5, { seed: 60 + j, ink: rgba(INK, .62), lw: 1.1 }));
    g.strokeStyle = rgba(INK, .18); g.lineWidth = 1; for (const [, y] of rows) { g.beginPath(); g.moveTo(22, y + 6); g.lineTo(c.w - 22, y + 6); g.stroke(); }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(cv, { k: .12, g: 1, seed: 19 + i, mid: false, boost: 1 });
  });
}
// a card on the table at its place, carried in from above (slide 0..1), dimmed (dim 0..1: the warmth leaves it), with its tag pressed in
//   (press 0..1 over .25 s: scale 1.06 → 1 with the ink darkening), and a light sweep across its lines (glint 0..1)
export function card(ctx, t, i, { slide = 1, dim = 0, press = 0, glint = 0 }) {
  const c = CARDS[i], L = cardFace(i), u = EXPO_OUT(slide); if (slide <= 0) return;
  const y = c.y - (1 - u) * 900, rot = c.rot + (1 - u) * .25;
  ctx.save(); ctx.translate(c.x, y); ctx.rotate(rot);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 16 + 40 * (1 - u); ctx.shadowOffsetX = 6; ctx.shadowOffsetY = 10 + 50 * (1 - u); ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-c.w / 2 + 2, -c.h / 2 + 2, c.w - 4, c.h - 4); ctx.restore();
  ctx.drawImage(L, -c.w / 2 - 2, -c.h / 2 - 2, c.w + 4, c.h + 4);
  if (press > 0) {   // the tag: a small rounded frame with the word, pressed into the top right corner of the card
    const k = 1 + .06 * (1 - EXPO_OUT(press)), tx = c.w / 2 - 20, ty = -c.h / 2 + 34, tw = c.tag === 'AI' ? 44 : 84, th = 24;
    ctx.save(); ctx.translate(tx - tw / 2, ty); ctx.scale(k, k); ctx.strokeStyle = rgba(INK, .7 * EXPO_OUT(press)); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.roundRect(-tw / 2, -th / 2, tw, th, 4); ctx.stroke();
    caps(ctx, c.tag, 0, 5, 12, rgba(INK, .85 * EXPO_OUT(press)), { align: 'center', spacing: 2.4 }); ctx.restore();
  }
  if (glint > 0) {   // a bright band passing over the lines (foil: the words glint when they are called the same)
    const gx = -c.w / 2 + (c.w + 160) * glint - 80; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(gx - 60, 0, gx + 60, 0); g.addColorStop(0, 'rgba(255,240,200,0)'); g.addColorStop(.5, 'rgba(255,240,200,.28)'); g.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = g; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h); ctx.restore();
  }
  if (dim > 0) { ctx.fillStyle = rgba('#120e18', .55 * dim); ctx.fillRect(-c.w / 2 - 2, -c.h / 2 - 2, c.w + 4, c.h + 4); }
  ctx.restore();
}
// the lamp's cone on the card area is part of the lamp (ember 'lamp'); the dimming of card 2 is drawn as a shadow that falls on it
// the two people behind the table: A (left) turns to B (right) and speaks, then lays a hand on B's shoulder; B lifts the head
//   gesture 0..1 (A's open hand toward B), reach 0..1 (the hand on the shoulder), lift 0..1 (B's head comes up), speak (A's head toward B)
export function figuresB(ctx, t, { gesture = 0, reach = 0, lift = 0, speak = 0, emberA = 0, pass = 0 }) {
  const dark = 1 - clamp(emberA), lA = { x: LAMPB.x - 60, y: LAMPB.y - 100, col: F6.amberCore, a: .35 * (1 - dark) };   // they stand in the dark until the ember lights them
  const shadeA = .96 * dark;
  // B: standing, shoulders low, head bowed; lifts the head when the hand lands
  const headB = mix(.42, .04, EXPO_OUT(lift)), poseB = { sh: [.3, .24], el: [.5, .46], head: headB, lean: mix(.08, .02, EXPO_OUT(lift)), hands: ['relaxed', 'relaxed'], hair: 'bob' };
  figure(ctx, FB.x, FB.y, FB.s, poseB, { t, seed: FB.seed, accent: '#5a4a6a', dress: { pants: '#17142a', hair: '#2a1c1a' }, light: lA, rim: rgba(F6.amber, .5 * (1 - dark)), rimSide: 1, flip: true, shadow: false, shadeA, shadeCol: '#0c0a14' });
  // A: turned to B; the front arm opens toward B (gesture), then reaches B's shoulder (reach)
  const base = { sh: [.3, .2], el: [.45, .4], head: .08 + .1 * speak, turn: .25 * speak, lean: .02, hands: ['open', 'relaxed'] };
  const o = { t, seed: FA.seed };
  let pose = { ...base, sh: [mix(.3, .62, EXPO_OUT(gesture)), .2], el: [mix(.45, .38, EXPO_OUT(gesture)), .4] };
  const target = [FB.x - 10 * FB.s, FB.y - 62 * FB.s];
  if (reach > 0) { const r = reachArm(FA.x, FA.y, FA.s, pose, 0, false, o, target); const k = EXPO_OUT(reach); pose = { ...pose, sh: [mix(pose.sh[0], r.sh, k), pose.sh[1]], el: [mix(pose.el[0], r.el, k), pose.el[1]], lean: mix(.02, .12, k), hands: ['open', 'relaxed'] }; }
  figure(ctx, FA.x, FA.y, FA.s, pose, { ...o, accent: '#8a5a3a', dress: { pants: '#1a1626' }, light: lA, rim: rgba(F6.amber, .55 * (1 - dark)), rimSide: 1, shadow: false, shadeA, shadeCol: '#0c0a14' });
  // the ember in A's chest, and its light travelling along the arm to the hand on the shoulder (pass 0..1)
  const chest = [FA.x + 7 * FA.s, FA.y - 44 * FA.s];
  if (emberA > 0) ember(ctx, t, { x: chest[0], y: chest[1], kind: 'heart', r: 66 * FA.s * (.5 + .5 * emberA) * (1 - .55 * EXPO_OUT(pass)), a: emberA });
  if (pass > 0) {
    const hp = handPos(FA.x, FA.y, FA.s, pose, 0, false, o), P = [chest, [mix(chest[0], hp[0], .5), mix(chest[1], hp[1], .5) - 10 * FA.s], hp];
    const u = Math.min(1, pass * 1.0), q = u < .5 ? u * 2 : (u - .5) * 2, seg = u < .5 ? 0 : 1, px = mix(P[seg][0], P[seg + 1][0], q), py = mix(P[seg][1], P[seg + 1][1], q);
    ember(ctx, t, { x: px, y: py, kind: 'heart', r: 50 * FA.s, a: .9 });
  }
  return { chest, hand: handPos(FA.x, FA.y, FA.s, pose, 0, false, o), target };
}
// cool text lines falling like cheap confetti: short glyph runs (cool, glowing) that fall through the frame from t0 on, sway, land on the
// table / the floor and go dark. World space; depth 0 far (behind the people) … 1 near. n lines over 1.5 s.
const CONF = once('c13:confetti', () => { const r = prng(606), out = []; for (let i = 0; i < 40; i++) out.push({ x: -100 + r() * 2100, born: r() * 1.5, v: 300 + r() * 240, len: 80 + r() * 150, rot: (r() - .5) * .5, sw: 10 + r() * 30, ph: r() * TAU, land: 640 + r() * 420, near: r() < .5, glyphs: Array.from({ length: 22 }, () => [r(), r(), r()]) }); return out; });
export function confetti(ctx, t, t0, { near }) {
  if (t < t0) return; ctx.save(); ctx.lineCap = 'round';
  for (const c of CONF) {
    if (c.near !== near) continue; const age = t - t0 - c.born; if (age < 0) continue;
    const y0 = -120, yf = y0 + c.v * age + 80 * age * age, landed = yf >= c.land, y = landed ? c.land : yf, tl = landed ? (yf - c.land) / (c.v + 160 * age) : 0;
    const alive = landed ? clamp(1 - tl / .3) : 1, x = c.x + Math.sin(age * 2.1 + c.ph) * c.sw * (landed ? 0 : 1), rot = c.rot + Math.sin(age * 1.6 + c.ph) * .18 * (landed ? 0 : 1);
    if (alive <= 0 && tl > 1.2) continue;
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); const a = .25 + .75 * alive, col = alive > 0 ? F6.cool : '#2a3550';
    if (alive > 0) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(F6.cool, .14 * alive); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(c.len, 0); ctx.stroke(); ctx.globalCompositeOperation = 'source-over'; }
    ctx.strokeStyle = rgba(col, a * (alive > 0 ? .9 : .35)); ctx.lineWidth = 1.6;
    ctx.beginPath(); let xx = 0; for (const [g1, g2, g3] of c.glyphs) { const w = 3 + g1 * 7; if (xx + w > c.len) break; if (g2 < .2) { xx += w * .8; continue; } const h = 3 + g3 * 6; ctx.moveTo(xx, -h); ctx.lineTo(xx + (g3 < .3 ? 0 : w * .4), h * .5); if (g1 > .6) { ctx.moveTo(xx, 0); ctx.lineTo(xx + w, 0); } xx += w + 1.5; } ctx.stroke();
    if (alive > 0) { ctx.fillStyle = rgba(F6.coolCore, .9 * alive); ctx.fillRect(Math.min(c.len, xx) - 1, -5, 2, 10); }
    ctx.restore();
  }
  ctx.restore();
}

// ================================================================ WORLD C · the ward
export const WARD = { floorY: 760, wall0: '#1f5560', wall1: '#0d252c', floor0: '#0f2a30', floor1: '#07171c' };
export const LIGHTC = { x: 1330, y: 365 };                 // the night light on the wall above the head of the bed (the bulb)
export const BED = { HL: [1120, 580], HR: [1420, 620], FR: [1120, 850], FL: [800, 785] };   // head-left, head-right, foot-right, foot-left (mattress top)
export const NURSE = { x: 1470, y: 760, s: 2.05, seed: 12 };
export const MON = { x: 985, y: 470, w: 220, h: 150 };     // the monitor pane (centre)
export const WINC = { x: 330, y: 400, w: 340, h: 420 };
export const RULES = { x: 640, y: 300, w: 220, h: 160, rot: .012 };
export const CURTAIN = { x: 1700, y0: 110, w: 320 };
export function wardWall(ctx) {
  const L = layer('c13:wardwall', 3000, 1400, (g, c) => {
    g.translate(500, 400);
    const bg = g.createLinearGradient(0, -400, 0, WARD.floorY); bg.addColorStop(0, '#102d35'); bg.addColorStop(1, '#17424b'); g.fillStyle = bg; g.fillRect(-500, -400, 3000, 1400);
    const lg = g.createRadialGradient(LIGHTC.x, LIGHTC.y + 60, 0, LIGHTC.x, LIGHTC.y + 60, 1100); lg.addColorStop(0, 'rgba(255,200,130,.36)'); lg.addColorStop(.35, 'rgba(255,190,120,.12)'); lg.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = lg; g.fillRect(-500, -400, 3000, 1400);
    // the light's fan on the wall above and below the fixture (a wall lamp throws up and down)
    g.save(); g.globalCompositeOperation = 'lighter'; g.beginPath(); g.moveTo(LIGHTC.x - 30, LIGHTC.y + 18); g.lineTo(LIGHTC.x + 30, LIGHTC.y + 18); g.lineTo(LIGHTC.x + 330, WARD.floorY + 80); g.lineTo(LIGHTC.x - 330, WARD.floorY + 80); g.closePath();
    const fg = g.createLinearGradient(0, LIGHTC.y, 0, WARD.floorY); fg.addColorStop(0, 'rgba(255,200,130,.22)'); fg.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = fg; g.fill();
    g.beginPath(); g.moveTo(LIGHTC.x - 26, LIGHTC.y - 30); g.lineTo(LIGHTC.x + 26, LIGHTC.y - 30); g.lineTo(LIGHTC.x + 150, LIGHTC.y - 330); g.lineTo(LIGHTC.x - 150, LIGHTC.y - 330); g.closePath();
    const ug = g.createLinearGradient(0, LIGHTC.y - 30, 0, LIGHTC.y - 330); ug.addColorStop(0, 'rgba(255,200,130,.16)'); ug.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = ug; g.fill(); g.restore();
    // plaster grain, a tile line at the dado, the skirting
    const r = prng(55); g.fillStyle = 'rgba(220,240,240,.04)'; for (let i = 0; i < 9000; i++) g.fillRect(-500 + r() * 3000, -400 + r() * 1400, 1.5, 1.5);
    g.fillStyle = 'rgba(255,255,255,.06)'; g.fillRect(-500, 560, 3000, 2); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-500, 563, 3000, 1);
    g.fillStyle = '#0b1e24'; g.fillRect(-500, WARD.floorY - 18, 3000, 18); g.fillStyle = 'rgba(255,220,170,.08)'; g.fillRect(-500, WARD.floorY - 18, 3000, 1.5);
    // the floor: dark, the light's pool, a few seams in perspective
    const fl = g.createLinearGradient(0, WARD.floorY, 0, 1000); fl.addColorStop(0, '#0e2a30'); fl.addColorStop(1, '#061217'); g.fillStyle = fl; g.fillRect(-500, WARD.floorY, 3000, 400);
    g.save(); g.translate(LIGHTC.x - 40, WARD.floorY + 110); g.scale(1, .32); const pg = g.createRadialGradient(0, 0, 0, 0, 0, 760); pg.addColorStop(0, 'rgba(255,200,130,.18)'); pg.addColorStop(.5, 'rgba(255,200,130,.05)'); pg.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 760, 0, TAU); g.fill(); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.035)'; g.lineWidth = 1; for (let k = -6; k <= 10; k++) { g.beginPath(); g.moveTo(600 + k * 150, WARD.floorY); g.lineTo(600 + k * 360 - 500, 1000); g.stroke(); }
    for (let yy = WARD.floorY + 50; yy < 1000; yy += 70) { g.beginPath(); g.moveTo(-500, yy); g.lineTo(2500, yy); g.stroke(); }
    // intaglio hatching in the dark corners
    hatch(g, null, -.8, 7, .22, { box: [-500, -400, 900, 1400], col: '#000000', w: .8, wobble: .8 });
    hatch(g, null, -.8, 7, .18, { box: [2000, -400, 500, 1400], col: '#000000', w: .8, wobble: .8 });
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .24, g: 1, seed: 12, mid: false, boost: 1 });
  });
  ctx.drawImage(L, -500, -400);
}
// the window at the left: dark glass, the night; the night light's warmth reflected faintly
export function windowC(ctx, t) {
  pane(ctx, t, { x: WINC.x, y: WINC.y, w: WINC.w, h: WINC.h, frame: 'window', edge: .25, radius: 0, seed: 7, reflectA: 1, reflectDim: .2,
    reflect: (g) => { const dx = (LIGHTC.x - WINC.x), g2 = g.createRadialGradient(-dx * .35, 20, 0, -dx * .35, 20, 420); g2.addColorStop(0, 'rgba(255,200,130,.5)'); g2.addColorStop(1, 'rgba(255,200,130,0)'); g.fillStyle = g2; g.fillRect(-WINC.w, -WINC.h, WINC.w * 2, WINC.h * 2); } });
}
// the rules sheet pinned on the wall (cached at 2×): a cream notice, RULES in caps, lines of rules in unreadable handwriting
export function rulesSheet(ctx) {
  const R = RULES, L = layer('c13:rules', Math.ceil(R.w * KC) + 8, Math.ceil(R.h * KC) + 8, (g, c) => {
    g.translate(4, 4); g.scale(KC, KC);
    paperSheet(g, 0, 0, R.w, R.h, { tone: '#e9dfc8', seed: 21, shadow: false, light: [R.w * 1.6, R.h * .2], lines: 0 });
    caps(g, 'RULES', R.w / 2, 30, 11, rgba(INK, .85), { align: 'center', spacing: 4 });
    g.strokeStyle = rgba(INK, .3); g.lineWidth = 1; g.beginPath(); g.moveTo(24, 40); g.lineTo(R.w - 24, 40); g.stroke();
    for (let i = 0; i < 6; i++) { caps(g, String(i + 1) + '.', 22, 62 + i * 17, 7, rgba(INK, .6), { spacing: 0 }); scribble(g, 38, 60 + i * 17, (R.w - 70) * (.6 + .4 * ((i * 7) % 3) / 2), 5, { seed: 80 + i, ink: rgba(INK, .55), lw: .9 }); }
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .1, g: 1, seed: 23, mid: false, boost: 1 });
  });
  ctx.save(); ctx.translate(R.x, R.y); ctx.rotate(R.rot);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 10; ctx.shadowOffsetX = -4; ctx.shadowOffsetY = 5; ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(2, 2, R.w - 4, R.h - 4); ctx.restore();
  ctx.drawImage(L, -2, -2, R.w + 4, R.h + 4);
  // two pins
  for (const px of [14, R.w - 14]) { ctx.fillStyle = '#3a3a44'; ctx.beginPath(); ctx.arc(px, 10, 3.2, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,230,190,.6)'; ctx.beginPath(); ctx.arc(px + 1, 9, 1.2, 0, TAU); ctx.fill(); }
  ctx.restore();
}
// the night light: a small wall lamp, a half shade open downward, the bulb inside is the ember (breathes); returns the bulb point
export function nightLight(ctx, t, a = 1) {
  const { x, y } = LIGHTC;
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#1b2a30'; ctx.fillRect(-8, -42, 16, 26); ctx.fillStyle = '#243a42'; ctx.fillRect(-14, -46, 28, 6);   // the bracket on the wall
  const sg = ctx.createLinearGradient(-60, 0, 60, 0); sg.addColorStop(0, '#1a262c'); sg.addColorStop(.45, '#3a4a52'); sg.addColorStop(1, '#141e24');
  ctx.fillStyle = sg; ctx.beginPath(); ctx.moveTo(-26, -18); ctx.lineTo(26, -18); ctx.lineTo(58, 22); ctx.quadraticCurveTo(0, 36, -58, 22); ctx.closePath(); ctx.fill();   // the shade
  ctx.fillStyle = '#26363c'; ctx.beginPath(); ctx.ellipse(0, -18, 26, 7, 0, 0, TAU); ctx.fill();
  const br = breathe(t, 60, .2);
  const ig = ctx.createLinearGradient(0, 22, 0, 36); ig.addColorStop(0, rgba(F6.amberCore, .95 * a)); ig.addColorStop(1, rgba(F6.amber, .6 * a)); ctx.fillStyle = ig; ctx.beginPath(); ctx.ellipse(0, 26, 56, 10, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = rgba(F6.amberCore, a); ctx.beginPath(); ctx.ellipse(0, 22, 16 * br, 6 * br, 0, 0, TAU); ctx.fill();
  ctx.restore();
  const e = ember(ctx, t, { x, y: y + 24, kind: 'glow', r: 250, a: .9 * a, phase: .2 });
  return { x, y: y + 24, br: e.br };
}
// the bed in three-quarter view: frame, mattress with a sheet, the pillow at the head end, the patient under a blanket (breathing),
// the near arm on the blanket with the hand at the bed's edge. Returns the hand point.
export function bed(ctx, t, { breath = 1 } = {}) {
  const { HL, HR, FR, FL } = BED, b = Math.sin(t * TAU / 4.6) * breath;
  const lerp = (P, Q, u) => [mix(P[0], Q[0], u), mix(P[1], Q[1], u)];
  // the frame's shadow on the floor, the mattress side (near-right face) and the foot face
  ctx.save(); ctx.fillStyle = 'rgba(2,6,8,.5)'; ctx.beginPath(); ctx.moveTo(FL[0] - 20, FL[1] + 60); ctx.lineTo(FR[0] + 40, FR[1] + 70); ctx.lineTo(HR[0] + 60, HR[1] + 60); ctx.lineTo(HL[0] - 10, HL[1] + 56); ctx.closePath(); ctx.fill(); ctx.restore();
  const side = ctx.createLinearGradient(0, HR[1], 0, HR[1] + 60); side.addColorStop(0, '#1d3238'); side.addColorStop(1, '#0c1a1f');
  ctx.fillStyle = side; ctx.beginPath(); ctx.moveTo(HR[0], HR[1]); ctx.lineTo(FR[0], FR[1]); ctx.lineTo(FR[0], FR[1] + 52); ctx.lineTo(HR[0], HR[1] + 52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#122429'; ctx.beginPath(); ctx.moveTo(FL[0], FL[1]); ctx.lineTo(FR[0], FR[1]); ctx.lineTo(FR[0], FR[1] + 52); ctx.lineTo(FL[0], FL[1] + 52); ctx.closePath(); ctx.fill();
  // legs
  ctx.fillStyle = '#0d1c21'; for (const P of [FL, FR, HR]) ctx.fillRect(P[0] - 5, P[1] + 50, 10, 44);
  // the mattress top: a pale sheet, lit from the head end
  const top = ctx.createLinearGradient(HR[0], HR[1], FL[0], FL[1]); top.addColorStop(0, '#9fb6b8'); top.addColorStop(1, '#5a7478');
  ctx.fillStyle = top; ctx.beginPath(); ctx.moveTo(HL[0], HL[1]); ctx.lineTo(HR[0], HR[1]); ctx.lineTo(FR[0], FR[1]); ctx.lineTo(FL[0], FL[1]); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(255,240,220,.25)'; ctx.lineWidth = 1.5; ctx.stroke();
  // the pillow at the head end
  const p0 = lerp(HL, FL, .04), p1 = lerp(HR, FR, .04), p2 = lerp(HR, FR, .2), p3 = lerp(HL, FL, .2);
  ctx.fillStyle = '#c8d6d4'; ctx.beginPath(); ctx.moveTo(p0[0] + 16, p0[1] - 12); ctx.quadraticCurveTo(mix(p0[0], p1[0], .5), p0[1] - 26, p1[0] - 18, p1[1] - 10); ctx.quadraticCurveTo(p2[0] + 4, mix(p1[1], p2[1], .5), p2[0] - 14, p2[1]); ctx.lineTo(p3[0] + 14, p3[1]); ctx.quadraticCurveTo(p0[0] - 4, mix(p0[1], p3[1], .5), p0[0] + 16, p0[1] - 12); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(40,60,70,.35)'; ctx.lineWidth = 1; ctx.stroke();
  // the patient: head on the pillow (seen from the side, lying on the back), the blanket from the chest to the foot
  const head = lerp(lerp(HL, HR, .5), lerp(FL, FR, .5), .13), hs = 22;
  ctx.fillStyle = '#2a1c1a'; ctx.beginPath(); ctx.arc(head[0] - 6, head[1] - 10 - b, hs + 2, Math.PI * .9, Math.PI * 1.9); ctx.fill();   // hair on the pillow side
  ctx.fillStyle = '#d9b08e'; ctx.beginPath(); ctx.ellipse(head[0], head[1] - 8 - b * .3, hs, hs * .86, -.25, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(60,30,20,.5)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(head[0] - 2, head[1] - 12 - b * .3); ctx.lineTo(head[0] + 8, head[1] - 14 - b * .3); ctx.stroke();   // the closed eye
  ctx.fillStyle = '#c99a78'; ctx.beginPath(); ctx.ellipse(head[0] - 14, head[1] - 2 - b * .3, 4, 5.5, -.3, 0, TAU); ctx.fill();   // the ear
  // the blanket: a soft mound along the bed from the chest down to the foot, folds hatched on the shadow side; the chest rises with the breath
  const c0 = lerp(lerp(HL, FL, .24), lerp(HR, FR, .24), .05), c1 = lerp(lerp(HL, FL, .24), lerp(HR, FR, .24), .95), f0 = lerp(FL, FR, .03), f1 = lerp(FL, FR, .97);
  const bg = ctx.createLinearGradient(c1[0], c1[1], f0[0], f0[1]); bg.addColorStop(0, '#8aa0a2'); bg.addColorStop(1, '#4e6468');
  ctx.fillStyle = bg; ctx.beginPath(); ctx.moveTo(c0[0], c0[1] + 4); ctx.quadraticCurveTo(mix(c0[0], c1[0], .45), c0[1] - 40 - 2.2 * b, c1[0], c1[1] + 2);
  ctx.quadraticCurveTo(mix(c1[0], f1[0], .5) + 20, mix(c1[1], f1[1], .5) - 24, f1[0], f1[1] - 6); ctx.lineTo(f0[0], f0[1] - 6); ctx.quadraticCurveTo(mix(c0[0], f0[0], .5) - 10, mix(c0[1], f0[1], .5) - 10, c0[0], c0[1] + 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(30,45,50,.45)'; ctx.lineWidth = 1.2; ctx.stroke();
  // the body's ridge under the blanket (a lighter line along the legs) and folds
  ctx.strokeStyle = 'rgba(220,235,235,.22)'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(mix(c0[0], c1[0], .52), c0[1] - 18 - 1.5 * b); ctx.quadraticCurveTo(mix(c0[0], f0[0], .5) + 30, mix(c0[1], f0[1], .5) - 30, mix(f0[0], f1[0], .55), f0[1] - 22); ctx.stroke();
  ctx.strokeStyle = 'rgba(30,45,50,.35)'; ctx.lineWidth = 1; for (let k = 0; k < 5; k++) { const u = .2 + k * .16; ctx.beginPath(); ctx.moveTo(mix(c0[0], f0[0], u) + 12, mix(c0[1], f0[1], u) - 2); ctx.quadraticCurveTo(mix(c0[0], f0[0], u) + 120, mix(c0[1], f0[1], u) - 26, mix(c1[0], f1[0], u) - 10, mix(c1[1], f1[1], u) - 8); ctx.stroke(); }
  // the near arm on the blanket: from the shoulder (under the blanket's edge) along the near edge, the hand at the edge
  const sh = lerp(lerp(HL, HR, .78), lerp(FL, FR, .78), .2), hand = [HR[0] - 110, HR[1] + 92], el = [mix(sh[0], hand[0], .5) + 12, mix(sh[1], hand[1], .5) - 6];
  ctx.strokeStyle = '#b8c6c4'; ctx.lineWidth = 15; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sh[0], sh[1] - 2 * b); ctx.lineTo(el[0], el[1]); ctx.stroke();   // the sleeve
  ctx.strokeStyle = '#d9b08e'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(el[0], el[1]); ctx.lineTo(hand[0], hand[1]); ctx.stroke();   // the forearm
  ctx.fillStyle = '#d9b08e'; ctx.beginPath(); ctx.ellipse(hand[0], hand[1], 9, 7, .4, 0, TAU); ctx.fill();
  ctx.restore && 0;
  return { hand, head };
}
// the chair beside the bed (its backrest at the right, behind the nurse) and the nurse sitting on it, turned to the bed, holding the hand
//   lean 0..1 (she leans in a little), reach: the hand point she holds
export function chair(ctx) {
  const { x, y, s } = NURSE; ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = 'rgba(2,6,8,.45)'; ctx.beginPath(); ctx.ellipse(-10 * s, 46 * s, 40 * s, 7 * s, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#1a2b31'; ctx.fillRect(-26 * s, 2 * s, 36 * s, 5 * s);                      // the seat (under the hips, toward the bed)
  ctx.fillStyle = '#0f1d22'; for (const lx of [-24 * s, 6 * s]) ctx.fillRect(lx, 7 * s, 3.5 * s, 38 * s);   // legs
  ctx.fillStyle = '#1e323a'; ctx.fillRect(6 * s, -38 * s, 5 * s, 42 * s); ctx.fillRect(2 * s, -40 * s, 12 * s, 4 * s);   // the backrest behind her
  ctx.restore();
}
export function nurse(ctx, t, { lean = 0, target, light }) {
  const { x, y, s, seed } = NURSE, o = { t, seed };
  const base = { hip: [1.4, 1.5], kn: [1.4, 1.5], sh: [.5, .42], el: [.9, .95], lean: .08 + .08 * lean, head: .22 + .08 * lean, hands: ['open', 'relaxed'], hair: 'bun' };
  const r = reachArm(x, y, s, base, 0, true, o, target);
  const pose = { ...base, sh: [r.sh, base.sh[1]], el: [r.el, base.el[1]] };
  figure(ctx, x, y, s, pose, { ...o, accent: '#bfd7d8', dress: { pants: '#2b3f48', hair: '#3a2420', shoes: '#f0f0ee' }, light, rim: rgba(F6.amber, .8), rimSide: -1, flip: true, shadow: false });
  return handPos(x, y, s, pose, 0, true, o);
}
// the monitor on its stand: a small pane with the steady cool pulse line (a trace scrolling at a constant speed, one beat per second)
export function pulseShape(q) { return -.22 * Math.exp(-Math.pow((q + 1.1) / .3, 2)) + Math.exp(-Math.pow(q / .17, 2)) - .3 * Math.exp(-Math.pow((q - .45) / .22, 2)) + .28 * Math.exp(-Math.pow((q - 1.3) / .4, 2)); }
export function monitor(ctx, t, { glint = 0 } = {}) {
  const M = MON;
  ctx.fillStyle = '#121f24'; ctx.fillRect(M.x - 5, M.y + M.h / 2, 10, 280); ctx.fillStyle = '#0d181c'; ctx.beginPath(); ctx.ellipse(M.x, M.y + M.h / 2 + 280, 46, 10, 0, 0, TAU); ctx.fill();
  pane(ctx, t, { x: M.x, y: M.y, w: M.w, h: M.h, frame: 'thin', radius: 4, edge: .7, seed: 3, screenA: 1, spill: true,
    screen: (g, w, h) => {
      const sp = 140, per = 140, base = h * .58, amp = h * .22, pts = [];
      for (let x = 8; x <= w - 8; x += 3) { const ph = ((x + t * sp) % per + per) % per; pts.push([x, base - amp * pulseShape((ph - per * .4) / 14)]); }
      coolLine(g, t, { pts, u: 1, w: 1.2, glow: .9 + glint * 1.2, a: .9 + glint * .1, head: false, ticks: false });
      g.fillStyle = rgba(F6.cool, .5); g.font = '600 9px "Inter"'; g.fillText('60', w - 34, 18);
    } });
}
// the curtain on a rail at the right edge (near plane): teal-grey fabric in vertical folds, pulled back
export function curtain(ctx) {
  const C = CURTAIN, L = layer('c13:curtain', C.w + 40, 1000, (g, c) => {
    g.translate(20, 0); const r = prng(9);
    for (let i = 0; i < 9; i++) { const x0 = i * C.w / 9, w = C.w / 9; const fg = g.createLinearGradient(x0, 0, x0 + w, 0); fg.addColorStop(0, '#15303a'); fg.addColorStop(.45, '#2b5460'); fg.addColorStop(1, '#0f252d'); g.fillStyle = fg; g.fillRect(x0, 0, w + 1, 1000); }
    g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, 0, C.w, 1000 * .02);
    g.setTransform(1, 0, 0, 1, 0, 0); stipple(c, { k: .2, g: 1, seed: 8, mid: false, boost: 1 }); hatch(g, null, 1.45, 6, .18, { box: [0, 0, C.w + 40, 1000], col: '#000000', w: .7, wobble: .6 });
  });
  ctx.fillStyle = '#0a161a'; ctx.fillRect(C.x - 400, C.y0 - 10, 900, 8);   // the rail
  ctx.drawImage(L, C.x - 20, C.y0);
  const sh = ctx.createLinearGradient(C.x - 60, 0, C.x, 0); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = sh; ctx.fillRect(C.x - 60, C.y0, 60, 1000);
}
// dust in the night light (near plane, world space)
const MOTESC = once('c13:motes', () => { const r = prng(505); return Array.from({ length: 22 }, () => ({ x: LIGHTC.x - 300 + r() * 600, y: LIGHTC.y - 100 + r() * 500, s: .8 + r() * 1.3, ph: r() * TAU, v: 3 + r() * 6 })); });
export function motesC(ctx, t) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const m of MOTESC) { const y = m.y - ((t * m.v + m.ph * 40) % 500), x = m.x + 12 * Math.sin(t * .5 + m.ph), d = Math.hypot(x - LIGHTC.x, y - LIGHTC.y), a = clamp(1 - d / 380) * (.3 + .3 * Math.sin(t * 2 + m.ph)); if (a <= .02) continue; ctx.fillStyle = rgba(F6.amberCore, a * .5); ctx.beginPath(); ctx.arc(x, y, m.s, 0, TAU); ctx.fill(); }
  ctx.restore();
}
