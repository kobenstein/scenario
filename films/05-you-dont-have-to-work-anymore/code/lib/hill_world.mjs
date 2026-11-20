// hill_world.mjs · the labelled Maslow hill, built ONCE as cached layers (port of the approved art test ref/kunst/a1.mjs),
// then driven per frame by a 2.5D camera: sky (p .06/.3) · ridges (p .55) · hill (p 1, unlit + lit copies, mip-mapped,
// SS 2) · front quay + water (p 1) · per-level glow layers (additive) · reflections · jetty (p 1.5) · labels (screen).
// Lit state per terrace animates house by house: every house's bbox is copied from the lit copy with its own alpha.
// World units = a1's 1920x1080 frame (cam {x:960,y:540,z:1} reproduces the a1 composition).
import { C, rgba, clamp, mix, prng, mixHex, shade, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, strokes, house, vnoise, DRESS } from './art.mjs';
import { cv, toImg, fx, fogW, bloomW, coneW, mLin, mRad, mBoth, mips, drawLayer, proj, setRegion, fig, q, drift } from './hill_art.mjs';
import { text } from '../engine.mjs';

export const cx = 620, apexY = 112, baseY = 800, hw = 900;
export const BANDS = [800, 548, 392, 282, 200, 112];
export const LV = ['Physiological · Safety', 'Belonging', 'Esteem', 'Self-actualization', 'Self-transcendence'];
const n1 = vnoise(4);
export const u = (y) => clamp((y - apexY) / (baseY - apexY));
export function half(y) {
  let h = hw * (0.035 + 0.965 * Math.pow(u(y), 1.5)) + hw * .1 * Math.pow(clamp((u(y) - .82) / .18), 2);
  for (let b = 1; b < 5; b++) { const d = BANDS[b] - y; if (d > 0 && d < 60 * u(BANDS[b]) + 8) h -= (1 - d / (60 * u(BANDS[b]) + 8)) * 22 * u(BANDS[b]); }
  return h;
}
export const edge = (y, s) => cx + s * (half(y) + (n1(y * .03, s * 7) - .5) * 10 * u(y));
export const bulge = (yb) => (baseY - yb) * .11;
export const arcY = (yb, x) => { const h = half(yb), qq = clamp((x - cx) / (h || 1), -1, 1); return yb - bulge(yb) * (1 - qq * qq); };
export const levelMid = (b) => b === 4 ? mix(BANDS[4], BANDS[5], .3) : mix(BANDS[b], BANDS[b + 1], .55);

const HILL = { x: -360, y: 80, w: 1980, h: 790 };      // hill canvas rect (world)
const SS = 2;
const outline = [];
for (let y = baseY + 30; y >= apexY + 8; y -= 5) outline.push([edge(y, -1), y]);
outline.push([cx - 8, apexY - 4], [cx + 6, apexY - 6]);
for (let y = apexY + 8; y <= baseY + 30; y += 5) outline.push([edge(y, 1), y]);
export const hillPath = (g) => { g.beginPath(); roughPath(g, outline, { amp: 1.5, seed: 9 }); };
const lamps = []; for (let x = cx - hw * .82; x < cx + hw * .95; x += 118 + (Math.sin(x) * 14)) lamps.push(x);
export const LAMPS = lamps;

// ------------------------------------------------------------------ the hill itself (mode 0 = unlit, 1 = lit)
function paintHill(ctx, S, mode, houses) {
  { const g = ctx.createLinearGradient(0, apexY, 0, baseY);
    g.addColorStop(0, '#22335a'); g.addColorStop(.35, '#151e3d'); g.addColorStop(1, '#0b1029');
    hillPath(ctx); ctx.fillStyle = g; ctx.fill(); }
  ctx.save(); hillPath(ctx); ctx.clip();
  { const g = ctx.createLinearGradient(cx - hw, 0, cx + hw * .3, 0); g.addColorStop(0, rgba('#5c7fb0', .28)); g.addColorStop(.55, rgba('#5c7fb0', 0)); ctx.fillStyle = g; ctx.fillRect(HILL.x, HILL.y, HILL.w, HILL.h); }
  fx(ctx, S, [cx - hw - 60, apexY - 10, 2 * hw + 120, baseY - apexY + 40], (hx) => {
    for (let b = 1; b < 5; b++) {
      const yTop = BANDS[b + 1], yBot = BANDS[b], N = [0, 8, 9, 9, 7][b];
      for (let j = 1; j < N; j++) { const yb = mix(yBot, yTop, j / N * .92), h = half(yb), rr = prng(b * 100 + j);
        hx.strokeStyle = '#9ab3dc'; hx.lineWidth = 1; hx.lineCap = 'round';
        let x = cx - h + rr() * 30; while (x < cx + h) { const L = 20 + rr() * 90 * (1 - (x - cx + h) / (2 * h)) + 10; hx.globalAlpha = (.12 + .3 * rr()) * (1 - (x - (cx - h)) / (2 * h)) ** .8; hx.beginPath(); for (let xx = x; xx < Math.min(x + L, cx + h); xx += 6) hx.lineTo(xx, arcY(yb, xx) + (n1(xx * .05, j) - .5) * 2.5); hx.stroke(); x += L + 6 + rr() * 30; } }
    }
    hx.globalAlpha = 1;
    strokes(hx, 26, (i, qq) => { const s = (i / 26) * 2 - 1, y = mix(BANDS[4] + 10, BANDS[2], qq); return [cx + s * half(y) * .96 + (n1(i * 3.1, qq * 6) - .5) * 8, y]; }, { w: 1, col: '#8aa6d4', a: .14, seed: 4, steps: 40 });
  }, { mask: mLin(0, apexY, 0, baseY, [[0, 1], [.6, .8], [.8, .2], [1, 0]]) });
  // terrace walls + ledges: stone wall band + a pale ledge line (five clearly separated terraces)
  for (let b = 1; b < 5; b++) {
    const yb = BANDS[b], h = half(yb) + 30, th = 9 + 6 * u(yb);
    ctx.beginPath(); for (let x = cx - h; x <= cx + h; x += 8) ctx.lineTo(x, arcY(yb, x)); for (let x = cx + h; x >= cx - h; x -= 8) ctx.lineTo(x, arcY(yb, x) + th); ctx.closePath(); ctx.fillStyle = rgba('#05081a', .6); ctx.fill();
    // stone joints in the wall
    { const rr = prng(300 + b); ctx.strokeStyle = rgba('#7f97c4', .13); ctx.lineWidth = .8; for (let x = cx - h + rr() * 14; x < cx + h; x += 10 + rr() * 16) { const y0 = arcY(yb, x); ctx.beginPath(); ctx.moveTo(x, y0 + 2); ctx.lineTo(x + (rr() - .5) * 2, y0 + th - 1); ctx.stroke(); } }
    ctx.beginPath(); for (let x = cx - h; x <= cx + h; x += 8) ctx.lineTo(x, arcY(yb, x) - 1); ctx.strokeStyle = rgba('#9db6e0', .24 + .1 * (b > 2)); ctx.lineWidth = 1.4; ctx.stroke();
  }
  // houses, level by level (back rows first). Lit callbacks always consume two rng calls so both modes share geometry.
  const HS = [1.3, .6, .38, .25, .16];
  const r = prng(21);
  const walls = ['#211b30', '#2b1f2c', '#1d2140', '#2a1e2a', '#1a1d36', '#30232c', '#232843'];
  for (let b = 4; b >= 0; b--) {
    const y0 = BANDS[b], y1 = BANDS[b + 1], s = HS[b], rows = b >= 3 ? 1 : 2;
    const fogMix = [0, .12, .2, .28, .36][b], gapP = [0, .22, .38, .5, .55][b];
    for (let row = rows - 1; row >= 0; row--) {
      const yb = mix(y0 - 10 * s, y1 + 18, row / rows + (b === 4 ? .35 : 0)) - 4;
      const hh = half(yb) - 18 * s;
      let x = cx - hh + r() * 20 * s;
      while (x < cx + hh) {
        const w = (60 + r() * 70) * s, h = Math.min((70 + r() * 80) * s * (b === 4 ? .7 : 1), (y0 - y1) * (row === 0 ? .42 : .5));
        if (x + w > cx + hh + 10) break;
        if (b === 4 && Math.abs(x + w / 2 - cx) > hh * .45) { x += w; continue; }
        const gy = arcY(yb, x + w / 2) + 2;
        if (r() < gapP) { x += w * (1 + r() * 1.5); continue; }
        const wall = b === 0 ? walls[Math.floor(r() * walls.length)] : mixHex(['#1c2445', '#232a4d', '#1a2040', '#29294a', '#202a48'][Math.floor(r() * 5)], '#3a5078', fogMix);
        if (r() < .12 && b < 4) {
          ctx.fillStyle = mixHex('#0d1a24', '#4e6a96', fogMix * .9);
          if (r() < .5) { ctx.beginPath(); ctx.ellipse(x + w * .3, gy - h * .55, w * .16, h * .55, 0, 0, 7); ctx.fill(); }
          else { roughPoly(ctx, [[x, gy], [x + w * .1, gy - h * .5], [x + w * .4, gy - h * .75], [x + w * .7, gy - h * .5], [x + w * .8, gy]], null, { amp: 3 * s, seed: x | 0 }); ctx.fill(); }
          x += w * .8; continue;
        }
        const lit = b === 0
          ? (mode ? (wx, wy, rr) => { const a = rr(), c = rr(); return a < .74 ? .72 + .28 * c : (a < .8 ? .3 : 0); } : (wx, wy, rr) => { const a = rr(), c = rr(); return a < .07 ? .45 + .3 * c : 0; })
          : (mode ? (wx, wy, rr) => { const a = rr(), c = rr(); return a < .66 ? .62 + .38 * c : 0; } : (wx, wy, rr) => { const a = rr(), c = rr(); return a < .05 ? .3 : 0; });
        const res = house(ctx, r, x + w / 2, gy, w, h, { wall, lit, roofs: b === 0 ? ['gable', 'hip', 'flat', 'parapet', 'mansard', 'gable', 'sawtooth'] : undefined, skip: b === 0 ? .36 : .25, winOff: shade(wall, -.07), floorH: 30 * s + 6, colW: 26 * s + 4, sideCol: shade(wall, -.06), side: b === 0 ? (x + w / 2 < cx ? -.12 : .12) : 0, chimney: .5, bay: b < 2 ? .4 : .1,
          light: mode ? { x: x + w / 2, y: gy + 20, col: C.amber, a: b === 0 ? .6 : .5, r: h * .8 } : null, amp: .5 + s * .8 });
        if (houses) houses.push({ b, row, x0: res.L - w * .16 - 2, y0: res.top - h * .35 - 3, x1: res.R + w * .16 + 2, y1: gy + 3, hx: x + w / 2, gy, w, h, top: res.top, win: res.win.map((q) => ({ x: q.x, y: q.y, w: q.w, h: q.h, door: !!q.door, l: q.l })) });
        x += w + (r() * 8 - 2) * s;
      }
    }
    if (b >= 1) fogW(ctx, S, { x0: cx - hw - 60, x1: cx + hw + 60, y0: arcY(y0, cx) - 120 * u(y0) - 20, y1: y0 + 14, col: '#6c8cba', a: .34 + .05 * b, seed: 30 + b, cover: .8, soft: .3, k: .25, sx: .0045, sy: .03, edgeTop: .95, edgeBot: .12 });
  }
  ctx.restore();
}

// ------------------------------------------------------------------ cached layers
let LY = null;
function mk(rect, S, paint) {
  const [c, g] = cv(rect.w * S, rect.h * S); g.setTransform(S, 0, 0, S, -rect.x * S, -rect.y * S);
  setRegion([rect.x, rect.y, rect.x + rect.w, rect.y + rect.h]); paint(g, S); setRegion(null);
  return c;
}
// async: build every cached layer and wait for the Image decodes (call before the first frame)
export async function prepareHill() {
  const ly = layers(), all = [];
  const push = (L) => { if (L && L.m) for (const m of L.m) all.push(m.c); else if (L && L.decode) all.push(L); };
  for (const v of Object.values(ly)) { const arr = Array.isArray(v) ? v : [v]; for (const L of arr) { push(L); if (L && L.U && L.L) { push(L.U); push(L.L); } } }
  await Promise.all(all.map((im) => im.decode ? im.decode() : null));
  ly.ready = true; return ly;
}
export function layers() {
  if (LY) return LY;
  const t0 = Date.now();
  const houses = [];
  const U = mk(HILL, SS, (g, S) => paintHill(g, S, 0, houses));
  const L = mk(HILL, SS, (g, S) => paintHill(g, S, 1, null));
  for (const h of houses) h.o = Math.abs(h.hx - cx) / half(h.gy);
  // summit insert at high resolution (Hill 4 push-in to the three people)
  const INS = [{ rect: { x: 500, y: 88, w: 240, h: 150 }, ss: 7 }, { rect: { x: 330, y: 520, w: 700, h: 320 }, ss: 5 }];
  for (const I of INS) { I.U = mk(I.rect, I.ss, (g, S) => paintHill(g, S, 0, null)); I.L = mk(I.rect, I.ss, (g, S) => paintHill(g, S, 1, null)); }
  // ridges + cold haze (behind the hill), wide
  const RID = { x: -1700, y: 360, w: 5300, h: 520 };
  const R = mk(RID, 1, (ctx, S) => {
    const ridge = (pts, col, seed) => { ctx.beginPath(); roughPath(ctx, pts, { amp: 4, step: 12, seed }); ctx.fillStyle = col; ctx.fill(); };
    ridge([[3600, baseY + 40], [3600, 640], [2600, 600], [2200, 560], [1720, 560], [1540, 640], [1380, 600], [1180, 690], [900, 740], [700, baseY + 40]], '#22375c', 3);
    ridge([[3600, baseY + 40], [3600, 720], [2500, 700], [1640, 690], [1450, 735], [1100, 770], [700, baseY + 40]], '#1a2b4b', 5);
    ridge([[-1700, baseY + 40], [-1700, 650], [-1200, 610], [-800, 660], [-500, 640], [-150, 720], [200, 760], [500, baseY + 40]], '#1f3256', 6);
    ridge([[-1700, baseY + 40], [-1700, 730], [-900, 712], [-400, 748], [300, baseY + 40]], '#17284a', 7);
    fogW(ctx, S, { x0: RID.x, x1: RID.x + RID.w, y0: 500, y1: baseY + 10, col: '#6f93c0', a: .7, seed: 11, cover: .7, soft: .5, k: .35, sx: .004, sy: .016 });
  });
  // per-level glow (additive), SS 1: the hero wash of each terrace + its lit ledge
  const G = [];
  { const rect = { x: -600, y: 330, w: 2500, h: 640 };
    G.push({ rect, c: mk(rect, 1, (ctx, S) => {
      ctx.save(); hillPath(ctx); ctx.clip();
      fx(ctx, S, [cx - hw - 100, BANDS[1] - 80, 2 * hw + 200, baseY - BANDS[1] + 120], (g) => { const gr = g.createLinearGradient(0, baseY, 0, BANDS[1] - 80); gr.addColorStop(0, rgba(C.amber, .55)); gr.addColorStop(.35, rgba(C.amber, .16)); gr.addColorStop(1, rgba(C.amber, 0)); g.fillStyle = gr; g.fillRect(cx - hw - 100, BANDS[1] - 80, 2 * hw + 200, baseY - BANDS[1] + 120); }, { st: { k: .35, g: 1.2, seed: 5 }, mask: mRad(cx + 40, baseY, hw * 1.05, [[0, 1], [.7, .6], [1, 0]], .5), op: 'lighter' });
      ctx.restore();
      for (const lxp of lamps) coneW(ctx, S, lxp + 1, baseY - 62, { dir: 0, spread: .5, len: 92, col: C.amber, a: .55, k: .5, seed: lxp | 0, soft: .4 });
      bloomW(ctx, S, cx + 40, baseY - 30, 900, { col: C.amber, core: C.amberHot, a: .26, k: .3, sy: .2, seed: 8 });
      for (const lxp of lamps) bloomW(ctx, S, lxp + 1, baseY - 62, 26, { a: .9, k: .2, seed: 3 });
      fogW(ctx, S, { x0: -600, x1: 1900, y0: BANDS[1] - 60, y1: baseY + 10, col: '#e8a466', a: .26, seed: 77, cover: .62, soft: .5, k: .3, sx: .006, sy: .03, op: 'lighter', mask: mRad(cx + 40, baseY, hw * 1.1, [[0, 1], [.6, .7], [1, 0]], .45) });
    }) });
  }
  for (let b = 1; b < 5; b++) {
    const yb = BANDS[b], yt = BANDS[b + 1], h = half(yb), rect = { x: cx - h - 140, y: yt - 120, w: 2 * h + 280, h: yb - yt + 200 };
    G.push({ rect, c: mk(rect, 1, (ctx, S) => {
      ctx.save(); hillPath(ctx); ctx.clip();
      fx(ctx, S, [cx - h - 40, yt - 30, 2 * h + 80, yb - yt + 50], (g) => { const gr = g.createLinearGradient(0, yb, 0, yt - 30); gr.addColorStop(0, rgba(C.amber, .5)); gr.addColorStop(.45, rgba(C.amber, .14)); gr.addColorStop(1, rgba(C.amber, 0)); g.fillStyle = gr; g.fillRect(cx - h - 40, yt - 30, 2 * h + 80, yb - yt + 50); }, { st: { k: .4, g: 1.2, seed: 50 + b }, mask: mRad(cx, yb, h * 1.05, [[0, 1], [.75, .55], [1, 0]], .55), op: 'lighter' });
      ctx.restore();
      bloomW(ctx, S, cx, mix(yb, yt, .4), h * 1.05, { col: C.amber, core: C.amberHot, a: .2, k: .35, sy: .32, seed: 60 + b });
      // the lit ledge: warm line along the terrace's front wall
      fx(ctx, S, [cx - h - 40, arcY(yb, cx) - 14, 2 * h + 80, yb - arcY(yb, cx) + 30], (g) => { hillPath(g); g.clip(); g.beginPath(); for (let x = cx - h - 26; x <= cx + h + 26; x += 6) g.lineTo(x, arcY(yb, x) - 1); g.strokeStyle = rgba(C.amberHot, .42); g.lineWidth = 1.3; g.stroke(); g.strokeStyle = rgba(C.amber, .12); g.lineWidth = 6; g.stroke(); }, { op: 'lighter', mask: mRad(cx, yb, h * 1.15, [[0, 1], [.8, .8], [1, 0]], .3) });
      if (b === 4) bloomW(ctx, S, cx, apexY + 30, 160, { col: C.amber, core: C.amberHot, a: .3, k: .35, sy: .6, seed: 70 });
    }) });
  }
  // front: quay strip, lamp posts, water (cold) — wide
  const FR = { x: -1800, y: baseY - 72, w: 5600, h: 1000 }, wy = baseY + 30;
  const F = mk(FR, 1, (ctx) => {
    { const g = ctx.createLinearGradient(0, wy, 0, FR.y + FR.h); g.addColorStop(0, '#111b38'); g.addColorStop(.5, '#080b20'); g.addColorStop(1, '#05060f'); ctx.fillStyle = g; ctx.fillRect(FR.x, wy, FR.w, FR.h); }
    roughRect(ctx, FR.x, baseY, FR.w, 30, '#0a0d22', { amp: 1.2, seed: 2 });
    ctx.fillStyle = rgba('#8aa0c8', .12); ctx.fillRect(FR.x, baseY, FR.w, 1.2);
    for (const lxp of lamps) { roughLine(ctx, [[lxp, baseY + 2], [lxp, baseY - 64]], { w: 2.6, col: '#090b1c', seed: lxp | 0 }); ctx.fillStyle = '#090b1c'; ctx.fillRect(lxp - 6, baseY - 66, 14, 4); }
    const rr = prng(12);
    for (let i = 0; i < 420; i++) { const y = wy + 20 + Math.pow(rr(), 1.3) * (FR.y + FR.h - wy - 20), x = FR.x + rr() * FR.w; ctx.fillStyle = rgba('#7f9cc8', .07 + .1 * rr()); ctx.fillRect(x, y, 10 + rr() * 50, 1.2); }
  });
  // reflections (additive): base glow + window streak columns + lamp streaks; upper levels' mirrored glints
  const RF = mk(FR, 1, (ctx, S) => {
    fx(ctx, S, [cx - hw * 1.2, wy, hw * 2.6, 240], (g) => { const gr = g.createLinearGradient(0, wy, 0, wy + 220); gr.addColorStop(0, rgba(C.amber, .35)); gr.addColorStop(1, rgba(C.amber, 0)); g.fillStyle = gr; g.fillRect(cx - hw * 1.2, wy, hw * 2.6, 240); }, { st: { k: .2, seed: 6 }, mask: mRad(cx + 40, wy, hw * 1.05, [[0, 1], [.75, .5], [1, 0]], .3), op: 'lighter' });
    const rr = prng(12);
    for (let i = 0; i < 46; i++) { const x0 = cx - hw * .85 + rr() * hw * 1.85, a0 = .2 + rr() * .35; for (let y = wy + 3; y < wy + 60 + rr() * 200; y += 3 + rr() * 6) { const d = (y - wy) / 260; if (rr() < .35) continue; const w = (3 + rr() * 14) * (1 + d * 2); ctx.fillStyle = rgba(rr() < .7 ? C.amber : C.amberHot, a0 * (1 - d)); ctx.fillRect(x0 - w / 2 + Math.sin(y * .25 + i) * 4 * (1 + d * 3), y, w, 1.6); } }
    for (const lxp of lamps) { const r2 = prng(lxp | 0); for (let y = wy + 4; y < wy + 170; y += 4 + r2() * 5) { ctx.fillStyle = rgba(C.amberHot, .5 * (1 - (y - wy) / 170) * r2()); const w = 4 + r2() * 10; ctx.fillRect(lxp - w / 2 + Math.sin(y * .3) * 3, y, w, 1.5); } }
  });
  const RU = mk(FR, 1, (ctx) => {
    const rr = prng(44);
    for (let b = 1; b < 5; b++) { const ym = wy + (wy - levelMid(b)) * .62, hh = half(levelMid(b));
      for (let i = 0; i < 30 - b * 4; i++) { const x0 = cx + (rr() * 2 - 1) * hh * .8, a0 = .1 + rr() * .22; for (let y = ym - 18; y < ym + 18 + rr() * 30; y += 3 + rr() * 5) { if (rr() < .4) continue; const w = 2 + rr() * 9; ctx.fillStyle = rgba(rr() < .7 ? C.amber : C.amberHot, a0 * (1 - (y - wy) / 900)); ctx.fillRect(x0 - w / 2 + Math.sin(y * .2 + i) * 3, y, w, 1.4); } } }
  });
  // stars (screen-ish space, parallax .06)
  const [ST, sg] = cv(2600, 1500);
  { const r = prng(7); for (let i = 0; i < 620; i++) { const x = r() * 2600, y = r() * 1500, m = r(); sg.fillStyle = rgba('#d6e6ff', .1 + .6 * m * m * m); const s = m > .97 ? 2 : m > .85 ? 1.4 : 1; sg.fillRect(x, y, s, s); } }
  // jetty (Hill 1 foreground, parallax 1.5)
  const JR = { x: -80, y: 830, w: 700, h: 320 };
  const J = mk(JR, 1, (ctx) => {
    roughPoly(ctx, [[-60, 900], [520, 952], [560, 970], [560, 990], [-60, 1000]], '#070814', { amp: 1.5, seed: 4 });
    for (let px = 10; px < 520; px += 64) roughLine(ctx, [[px, 901 + px * .1 - 1], [px + 1, 901 + px * .1 - 44]], { w: 2.4, col: '#05060f', seed: px });
    roughLine(ctx, sagLine([-60, 852], [520, 910], 4), { w: 2.2, col: '#05060f', seed: 3 });
    for (const px of [40, 170, 300, 430, 545]) roughRect(ctx, px, 940 + px * .05, 9, 200, '#05060f', { amp: 1, seed: px });
    roughRect(ctx, -60, 1000, 640, 150, '#05060f', { amp: 1, seed: 9 });
    roughRect(ctx, 470, 926, 16, 26, '#05060f', { amp: .6, seed: 12 });
    ctx.strokeStyle = rgba(C.amber, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-60, 893); ctx.lineTo(520, 953); ctx.stroke();
  });
  // drifting fog sheets (cold), animated by translation only
  const FG = { x: -1800, y: 380, w: 5600, h: 520 };
  const FGc = mk(FG, 1, (ctx, S) => { fogW(ctx, S, { x0: FG.x, x1: FG.x + FG.w, y0: 420, y1: 880, col: '#7c9cc8', a: .28, seed: 91, cover: .55, soft: .45, k: .3, sx: .0022, sy: .02, edgeTop: .6, edgeBot: .4 }); });
  const lay = (c, r) => ({ m: mips(c, 2), ...r });
  LY = { U: lay(U, HILL), L: lay(L, HILL), INS: INS.map((I) => ({ rect: I.rect, ss: I.ss, U: { m: [{ c: toImg(I.U), s: 1 }], ...I.rect }, L: { m: [{ c: toImg(I.L), s: 1 }], ...I.rect } })), R: lay(R, RID), G: G.map((g) => lay(g.c, g.rect)), F: lay(F, FR), RF: lay(RF, FR), RU: lay(RU, FR), ST: toImg(ST), J: lay(J, JR), FG: lay(FGc, FG), houses };
  LY.byLevel = [0, 1, 2, 3, 4].map((b) => houses.filter((h) => h.b === b));
  if (process.env.HILL_DEBUG) console.error(`hill layers built in ${Date.now() - t0} ms, ${houses.length} houses`);
  return LY;
}

// ------------------------------------------------------------------ sky palettes (world-anchored gradient stops)
const PAL = {
  night: [['#070a1f', -500], ['#0b1230', 0], ['#0f1838', 360], ['#1d3157', 640], ['#2c4a6e', baseY]],
  deep: [['#04051a', -700], ['#070826', -100], ['#0e1238', 300], ['#1d2152', 620], ['#2c2a62', baseY]],
  dusk: [['#151a45', -500], ['#2a2a62', 0], ['#5a4078', 330], ['#b0708c', 620], ['#e9a58a', baseY]],
};
export function skyPal(name, name2, u2) { const A = PAL[name], B = name2 ? PAL[name2] : null; return A.map(([c, y], i) => [B ? mixHex(c, B[i][0], u2) : c, y]); }

// ------------------------------------------------------------------ per-frame draw
// S = { cam, sky: [[col, worldY]..], stars, house(h) -> 0..1, glow: [5] (optional), jetty, fogA, tint, after(ctx, M) }
export function drawHill(ctx, t, S) {
  const Ly = layers(), cam = S.cam;
  const M = proj(cam, 1), Msky = proj(cam, .3), Mr = proj(cam, .55);
  // sky
  { const stops = S.sky || skyPal('night'), y0 = Msky.Y(stops[0][1]), y1 = Msky.Y(stops[stops.length - 1][1]);
    const g = ctx.createLinearGradient(0, y0, 0, y1); for (const [c, y] of stops) g.addColorStop(clamp((Msky.Y(y) - y0) / (y1 - y0 || 1)), c);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1920, 1080); }
  if (S.skyFx) S.skyFx(ctx, M, Msky);
  if ((S.stars ?? 1) > 0) { const Mst = proj(cam, .06); ctx.save(); ctx.globalAlpha = S.stars ?? 1; const k = Mst.k; ctx.drawImage(Ly.ST, Mst.X(960 - 1300), Mst.Y(540 - 900), 2600 * k, 1500 * k); ctx.restore();
    const r = prng(19); ctx.save(); for (let i = 0; i < 60; i++) { const x = r() * 2600 - 340, y = r() * 900 - 380, m = r(), ph = r() * 7, a = (S.stars ?? 1) * (.3 + .5 * m) * (.5 + .5 * Math.sin(t * (1.1 + m) + ph)); ctx.fillStyle = rgba('#e8f0ff', a); const X = Mst.X(x), Y = Mst.Y(y); ctx.fillRect(X, Y, 1.6, 1.6); } ctx.restore(); }
  drawLayer(ctx, Ly.R, Mr);
  { const Mf = proj(cam, .7); const dx = t * 9; drawLayer(ctx, Ly.FG, { ...Mf, ox: Mf.ox + dx * Mf.k, X: (x) => Mf.X(x + dx) }, { a: (S.fogA ?? 1) * .8 }); }
  if (S.behindHill) S.behindHill(ctx, M);
  // hill: unlit copy, then each house from the lit copy with its own alpha
  drawLayer(ctx, Ly.U, M);
  const insA = Ly.INS.map((I) => { const a = clamp((M.k - 2.3) / .6); if (a <= 0) return 0; const r = I.rect; return (M.X(r.x + r.w) < 0 || M.X(r.x) > 1920 || M.Y(r.y + r.h) < 0 || M.Y(r.y) > 1080) ? 0 : a; });
  Ly.INS.forEach((I, i) => { if (insA[i] > 0) drawLayer(ctx, I.U, M, { a: insA[i] }); });
  const lv = [0, 0, 0, 0, 0], cnt = [0, 0, 0, 0, 0];
  for (const h of Ly.houses) {
    const a = S.house ? S.house(h, t) : 0; lv[h.b] += a; cnt[h.b]++;
    if (a <= .003) continue;
    const sx0 = M.X(h.x0), sx1 = M.X(h.x1), sy0 = M.Y(h.y0), sy1 = M.Y(h.y1);
    if (sx1 < 0 || sx0 > 1920 || sy1 < 0 || sy0 > 1080) continue;
    drawLayer(ctx, Ly.L, M, { a, sub: [h.x0, h.y0, h.x1, h.y1] });
    Ly.INS.forEach((I, i) => { const r = I.rect; if (insA[i] > 0 && h.x1 > r.x && h.x0 < r.x + r.w && h.y1 > r.y && h.y0 < r.y + r.h) drawLayer(ctx, I.L, M, { a: a * insA[i], sub: [h.x0, h.y0, h.x1, h.y1] }); });
  }
  const glow = S.glow || lv.map((v, b) => v / (cnt[b] || 1));
  S._glow = glow;
  drawLayer(ctx, Ly.F, M);
  for (let b = 0; b < 5; b++) if (glow[b] > .003) drawLayer(ctx, Ly.G[b], M, { a: clamp(glow[b] * (S.glowMul ?? 1) * (1 + .03 * Math.sin(t * 1.3 + b))), op: 'lighter' });
  // water: reflections shimmer in horizontal strips
  { const a0 = glow[0], aU = (glow[1] + glow[2] + glow[3] + glow[4]) / 4;
    if (a0 > .003 || aU > .003) {
      const wy = baseY + 30, n = 14;
      for (let i = 0; i < n; i++) { const y0 = wy + i * 30, y1 = y0 + 30, dx = Math.sin(t * 1.3 + i * 1.7) * (1.5 + i * .5);
        const Ms = { ...M, ox: M.ox + dx * M.k };
        if (a0 > .003) drawLayer(ctx, Ly.RF, Ms, { a: a0, op: 'lighter', sub: [-1e4, y0, 1e4, y1] });
        if (aU > .003) drawLayer(ctx, Ly.RU, Ms, { a: aU * .9, op: 'lighter', sub: [-1e4, y0, 1e4, y1] }); }
      drawLayer(ctx, Ly.RU, M, { a: aU * .9, op: 'lighter', sub: [-1e4, wy + n * 30, 1e4, 3000] });
    } }
  if (S.after) S.after(ctx, M);
  if (S.jetty > 0) drawLayer(ctx, Ly.J, proj(cam, 1.5), { a: S.jetty });
  return M;
}

// labels: right-hand column, dotted leaders from the right flank. L = { a, title (0..1 type-on), lit[5] (cream amount),
// cur (level index), curA (0..1 grow to 58 px), x }
export function drawLabels(ctx, M, t, L) {
  const a0 = L.a ?? 1; if (a0 <= 0) return;
  const x = L.x ?? 1460;
  { const g = ctx.createLinearGradient(x - 300, 0, x + 120, 0); g.addColorStop(0, 'rgba(5,8,22,0)'); g.addColorStop(1, `rgba(5,8,22,${.5 * a0})`); ctx.fillStyle = g; ctx.fillRect(x - 300, 0, 1920, 1080); }
  const ys = [], sizes = [];
  for (let b = 0; b < 5; b++) { const cur = L.cur === b ? (L.curA ?? 0) : 0; sizes[b] = mix(34, 58, cur) + 6 * (L.lit?.[b] ?? 0) * (1 - cur) * (b === 0 ? 1 : .0); ys[b] = M.Y(levelMid(b)) + drift(t, 1.2, b); }
  // keep a minimum gap (zoomed-out views squeeze the levels)
  const lab = ys.slice();
  for (let b = 1; b < 5; b++) { const gap = (sizes[b] + sizes[b - 1]) * .62 + 10; if (lab[b] > lab[b - 1] - gap) lab[b] = lab[b - 1] - gap; }
  for (let b = 0; b < 5; b++) {
    const lit = clamp(L.lit?.[b] ?? 0), only = L.only ? (L.only[b] ?? 0) : 1, vis = clamp(1 - Math.max(0, -lab[b] + 60) / 80) * clamp(1 - Math.max(0, lab[b] - 1040) / 60);
    const a = a0 * only * vis * (L.la?.[b] ?? 1); if (a <= .01) continue;
    const ym = ys[b], xr = Math.max(-20, M.X(edge(levelMid(b), 1)) + 16 * Math.min(1.6, M.k));
    const lilac = '#cfd0ee', col = mixHex(lilac, C.amber, lit);
    ctx.save(); ctx.strokeStyle = rgba(col, (.4 + .3 * lit) * a); ctx.lineWidth = 1.2; ctx.setLineDash([2, 5]); ctx.lineDashOffset = -t * 4;
    if (xr < x - 30) { ctx.beginPath(); ctx.moveTo(xr, ym); ctx.lineTo(x - 18, lab[b]); ctx.stroke(); }
    ctx.restore();
    if (xr < x - 30 && xr > -10) { ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(xr, ym, (lit > .5 ? 4 : 3) * (1 + .08 * Math.sin(t * 2 + b) * lit), 0, 7); ctx.fill();
      if (lit > .05) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(xr, ym, 0, xr, ym, 16); g.addColorStop(0, rgba(C.amber, .5 * lit * a)); g.addColorStop(1, rgba(C.amber, 0)); ctx.fillStyle = g; ctx.fillRect(xr - 16, ym - 16, 32, 32); ctx.restore(); } }
    text(ctx, LV[b], x, lab[b] + sizes[b] * .33, { size: sizes[b], font: 'Instrument Serif', color: mixHex(lilac, '#ffe8c4', lit), alpha: a * (.78 + .22 * lit) });
  }
  // title (types on letter by letter)
  const tt = L.title ?? 1;
  if (tt > 0) { const s = 'MASLOW’S HIERARCHY OF NEEDS', n = Math.floor(s.length * clamp(tt)); ctx.fillStyle = rgba(C.amber, a0 * clamp(tt * 4)); ctx.fillRect(x, 62, 28 * clamp(tt * 3), 2);
    text(ctx, s.slice(0, n), x, 94, { size: 16, weight: 600, color: '#a9b6d6', spacing: 6, alpha: a0 }); }
}
export { proj };
