// Film 8 · chunk c11 world (builder B3). The night valley of c01 (lib/f8_kit nightLand, c01's LAND list and hero workshop, copied so
// the world is the same one) plus what c11 adds to it: the anatomy plate with separately controllable layers (a copy of the kit's
// anatomyPlate, see platePart), the knoll in the foreground (depth −0.3: it is behind the camera while the camera is close, it enters by
// parallax when the camera pulls back), towers of cold white light, the field of many small lights, the orchestras over the roofs.
//
// World units: the camera is c01's { x, y, dist }; landCam(cam, d) maps a point at depth d. The hero workshop stands at (1000, 868), d 0.
import { W, H, rgba, clamp, mix, eio, eout, sm, prng } from '../engine.mjs';
import { F8, landCam, ridgeY, workshop, weave, plateGround, conductor, instances, mistBand, eoutX, qio, life } from './f8_kit.mjs';
import { cached } from './f8_c09_world.mjs';

const TAU = Math.PI * 2;
export const HERO = { x: 1000, y: 868, s: .32 };
export const P_STAR = [986, 853.5];                                 // the node of the brain network c01 dived into (c01>c02)

// ---------------------------------------------------------------- sprites (a copy of the kit's stippled sprite; the kit keeps its own private)
function sprite(key, R, core, col, deep, stops = [.12, .45]) {
  return cached('c11spr:' + key, R * 2, R * 2, (g) => {
    const rg = g.createRadialGradient(R, R, 0, R, R, R); rg.addColorStop(0, rgba(core, 1)); rg.addColorStop(stops[0], rgba(col, .6)); rg.addColorStop(stops[1], rgba(deep, .16)); rg.addColorStop(1, rgba(deep, 0));
    g.fillStyle = rg; g.fillRect(0, 0, R * 2, R * 2);
    const d = g.getImageData(0, 0, R * 2, R * 2), p = d.data, r = prng(R * 7 + 3);
    for (let i = 3; i < p.length; i += 4) { const a = p[i] / 255; if (a <= 0) continue; const kk = .55 * 4 * a * (1 - a), on = r() < a ? Math.min(1, a * 2.4) : 0; p[i] = 255 * (a * (1 - kk) + kk * on); }
    g.putImageData(d, 0, 0);
  });
}
const SPR = {
  green: () => sprite('green', 128, F8.greenCore, F8.green, F8.greenDeep),
  gold: () => sprite('gold', 160, F8.goldCore, F8.gold, F8.goldDeep),
  amber: () => sprite('amber', 200, F8.amberCore, F8.amber, '#c4512e'),
  cold: () => sprite('cold', 200, '#ffffff', '#cfdcff', '#5a6fb8', [.1, .4]),
  // small soft dots (no stipple: they are drawn a few px wide)
  dotG: () => cached('c11dotG', 32, 32, (g) => { const rg = g.createRadialGradient(16, 16, 0, 16, 16, 16); rg.addColorStop(0, rgba(F8.greenCore, 1)); rg.addColorStop(.25, rgba(F8.green, .7)); rg.addColorStop(1, rgba(F8.greenDeep, 0)); g.fillStyle = rg; g.fillRect(0, 0, 32, 32); }),
  dotA: () => cached('c11dotA', 32, 32, (g) => { const rg = g.createRadialGradient(16, 16, 0, 16, 16, 16); rg.addColorStop(0, rgba('#fff1d6', 1)); rg.addColorStop(.3, rgba(F8.amber, .55)); rg.addColorStop(1, rgba('#c4512e', 0)); g.fillStyle = rg; g.fillRect(0, 0, 32, 32); }),
};
export function spr(ctx, which, x, y, r, a = 1) {
  if (a <= .003 || r < .5 || x + r < 0 || x - r > W || y + r < 0 || y - r > H) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(1, a); ctx.drawImage(SPR[which](), x - r, y - r, r * 2, r * 2); ctx.restore();
}
export function worldWarm() { for (const k in SPR) SPR[k](); }

// ---------------------------------------------------------------- c01's land (copied from scenes/sc01.mjs: same prng, same picks)
export const LAND = [];
{ const r = prng(81), per = [70, 60, 46, 22];
  for (let i = 0; i < 4; i++) for (let j = 0; j < per[i]; j++) {
    const sx = 40 + r() * (W - 80); if (i === 3 && Math.abs(sx - 1000) < 260) continue;
    const d = [5.4, 2.6, 1.15, .42][i] + r() * .2, sy = ridgeY(i, sx) + 8 + r() * [26, 30, 40, 60][i] * (1 / (1 + i * .2));
    LAND.push({ ridge: i, sx, sy, d, f: .8 + r() * .35, lit: 0 });
  }
}
{ const RISE = [[3, 1420], [2, 330], [3, 620], [1, 760], [2, 1650], [3, 1320], [2, 880]];
  RISE.forEach(([ri, sx]) => { let best = null, bd = 1e9; for (const L of LAND) if (L.ridge === ri && Math.abs(L.sx - sx) < bd) { bd = Math.abs(L.sx - sx); best = L; } best.lit = 1; best.riser = true; best.f = ri === 3 ? 1.25 : 1.6; });
  const late = [LAND.find((L) => L.ridge === 2 && L.sx > 1150 && L.sx < 1350 && !L.lit), LAND.find((L) => L.ridge === 1 && L.sx > 380 && L.sx < 700 && !L.lit)];
  late.forEach((L) => { if (L) L.lit = 1; });
}
// the end camera (E.01): every light must sit below y 628 there (the end-screen fields above stay quiet)
export const CAM_E = { x: 1700, y: 160, dist: 1.25 };
{ const r = prng(1107);
  for (const L of LAND) {
    const P = landCam(CAM_E, L.d), y = P.RY(L.sy), x = P.RX(L.sx);
    L.ok = !(y < 640 && x > -50 && x < W + 50);                       // a workshop that would light up inside the end-screen fields stays dark
    L.on = [0, .15, .38, .62][3 - L.ridge] + r() * .28;                 // the wave on "millions": near ridges first, out to the horizon
    L.br = r() * TAU; L.n = L.ridge === 1 ? 3 : L.ridge === 0 ? 0 : 5; L.dl = r() * .3; L.seed = r() * 100;
  }
}

// ---------------------------------------------------------------- the field of many small lights (on the slopes, behind each ridge's crest)
const FIELD = [[], [], [], []];
{ const r = prng(2207), N = [1500, 950, 520, 160], span = [36, 64, 100, 120];
  for (let i = 0; i < 4; i++) for (let j = 0; j < N[i]; j++) {
    const sx = -680 + r() * 3280, sy = ridgeY(i, sx) + 7 + Math.pow(r(), 1.4) * span[i], d = [6, 3, 1.4, .55][i];
    const P = landCam(CAM_E, d), ey = P.RY(sy); if (ey < 632) { r(); r(); r(); continue; }
    FIELD[i].push({ sx, sy, d, on: .25 + (i === 3 ? 0 : (3 - i) * .22) + r() * .35, sz: [1, 1.3, 1.8, 2.4][i] * (.7 + r() * .6), ph: r() * TAU, w: r() < .5 ? '#ffd89a' : '#ffbe70' });
  }
}
// lights of ridge i (drawn right after the ridge, so the nearer ridges hide them); on = 0..1 global, t0 = the wave's start time
export function fieldRow(ctx, t, cam, i, t0) {
  const L = FIELD[i]; if (!L.length || t < t0) return;
  const P = landCam(cam, L[0].d);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const p of L) {
    const u = clamp((t - t0 - p.on) / .35); if (u <= 0) continue;
    const x = P.RX(p.sx), y = P.RY(p.sy); if (x < -4 || x > W + 4 || y < -4 || y > H + 4) continue;
    const s = p.sz * Math.min(1.6, P.s), b = u * (.75 + .25 * Math.sin(t * .9 + p.ph));
    ctx.fillStyle = rgba(p.w, b); ctx.fillRect(x - s / 2, y - s / 2, s, s);
    if (p.sz > 1.6 && i >= 2) { ctx.fillStyle = rgba(F8.amber, .12 * b); ctx.fillRect(x - s * 1.5, y - s * 1.5, s * 3, s * 3); }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the land's workshops on ridge i (c01's look), lit by the wave from t0
export function landRow(ctx, t, cam, i, o = {}) {
  const list = [];
  for (const L of LAND) {
    if (L.ridge !== i) continue;
    const P = landCam(cam, L.d), x = P.RX(L.sx), y = P.RY(L.sy), k = P.k * HERO.s * L.f; if (x < -100 || x > W + 100 || y < -50 || y > H + 300) continue;
    let lit = L.lit * (o.base ?? 1); if (o.t0 != null && L.ok) lit = Math.max(lit, clamp((t - o.t0 - L.on) / .4));
    if (!L.ok) lit = Math.min(lit, L.lit * (o.base ?? 1));
    lit *= .88 + .12 * Math.sin(t * .7 + L.br);                       // the windows breathe
    list.push({ x, y, s: k, lit, L });
  }
  instances(ctx, t, { list, threads: 0 });
  // c01's roof threads of the risers (they sink back into their roofs in c11)
  const th = clamp(o.threads ?? 0);
  if (th > 0) for (const it of list) if (it.L.riser) {
    const x = it.x - 92 * it.s, y = it.y - 104 * it.s, len = th * 520 * Math.min(1.4, .45 + landCam(cam, 0).k * 3) * (it.L.ridge === 3 ? 1 : .8);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createLinearGradient(0, y, 0, y - len); g.addColorStop(0, rgba(F8.goldCore, .8)); g.addColorStop(.7, rgba(F8.gold, .35)); g.addColorStop(1, rgba(F8.gold, 0));
    ctx.strokeStyle = g; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - len); ctx.stroke(); ctx.restore();
  }
  return list;
}
// orchestras: over every lit workshop a small swarm; rise 0 = they hover low round the roof, 1 = an arc of players above it
export function orchestras(ctx, t, rows, o = {}) {
  const im = SPR.dotG(); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const it of rows) {
    const L = it.L, n = L.n; if (!n || it.lit < .05 || !L.ok) continue;
    const a = clamp((t - (o.t0 ?? 0) - L.on - .25) / .5) * clamp(it.lit * 1.4); if (a <= 0) continue;
    const ru = eio(clamp((t - (o.rise ?? 1e9) - L.dl * .5) / .75)), k = it.s, rx = it.x - 2 * k, ry = it.y - 104 * k;
    for (let j = 0; j < n; j++) {
      const ph = L.seed + j * 2.4, q = (j + .5) / n - .5;
      const lowX = rx + Math.cos(t * .9 + ph) * 80 * k, lowY = ry - 10 * k + Math.sin(t * 1.1 + ph) * 12 * k;
      const hiX = rx + q * 170 * k + Math.sin(t * 1.3 + ph) * 6 * k, hiY = ry - 95 * k + Math.abs(q) * 40 * k + Math.sin(t * 2 + ph) * 7 * k - (o.lift ?? 0) * 60 * k;
      const x = mix(lowX, hiX, ru), y = mix(lowY, hiY, ru), r = Math.max(1.6, 26 * k) * (.85 + .15 * Math.sin(t * 3 + ph)) * (1 + .5 * (o.flash ?? 0));
      if (x < -10 || x > W + 10 || y < -10 || y > H + 10) continue;
      ctx.globalAlpha = Math.min(1, a * (.8 + .2 * Math.sin(t * 2.3 + ph))); ctx.drawImage(im, x - r, y - r, r * 2, r * 2);
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the knoll (depth −0.3, in front of the hero plane), crest at (1700, 264.5)
export const KNOLL = { d: -.3, x: 1700, y: 264.5 };
export const knollY = (wx) => { const off = Math.abs(wx - KNOLL.x), ex = Math.max(0, off - 100), left = wx < KNOLL.x;
  // a rounded top, a shoulder running out to the right; on the left it falls away steeply (the valley the camera rose out of)
  return KNOLL.y + 20 * Math.min(1, off / 100) ** 2 + 280 * (1 - Math.exp(-ex / 230)) + .02 * ex + (left && ex > 200 ? .006 * (ex - 200) ** 2 : 0) + 6 * Math.sin(wx * .021) * clamp(ex / 120); };
// workshops on the knoll's flanks (lit by the wave on "millions"; none on the crest: the end screen's button sits there)
export const KWS = [-420, -330, 300, 430, 580, 760, 950].map((off, i) => { const r = prng(1500 + i * 7), wx = KNOLL.x + off;
  return { wx, wy: knollY(wx) + 12 + r() * 18, f: .42 + r() * .16, ok: true, lit: 0, on: r() * .12, n: 6, dl: r() * .3, seed: r() * 100, br: r() * TAU, ridge: 9 }; });
const KTREES = (() => { const r = prng(1600), out = []; for (let i = 0; i < 26; i++) { const off = 170 + r() * 1100, wx = KNOLL.x + (r() < .2 ? -Math.min(off, 360) : off); out.push([wx, 10 + r() * 24]); } return out; })();
const KR = 1400;
export function knoll(ctx, t, cam, o = {}) {
  const D = cam.dist + KNOLL.d; if (D < .02) return null;
  const P = landCam(cam, KNOLL.d), xl = P.X(KNOLL.x - KR), xr = P.X(KNOLL.x + KR), top = P.Y(KNOLL.y);
  if (xr < -20 || xl > W + 20 || top > H + 10) return null;
  const st = Math.max(2, 5 * D), path = () => { ctx.beginPath(); let first = true;
    for (let wx = KNOLL.x - KR; wx <= KNOLL.x + KR; wx += st) { const x = P.X(wx); if (x < -60 || x > W + 60) continue; const y = Math.min(H + 40, P.Y(knollY(wx))); if (first) { ctx.moveTo(x, H + 40); first = false; } ctx.lineTo(x, y); }
    ctx.lineTo(Math.min(W + 60, xr), H + 40); ctx.closePath(); };
  path(); if (!isFinite(top)) return null;
  const g = ctx.createLinearGradient(0, top, 0, top + 700 * P.k); g.addColorStop(0, '#0b0d26'); g.addColorStop(1, '#04050f'); ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); const y0 = Math.max(0, top);
  const lg = ctx.createLinearGradient(0, top, 0, top + 260 * P.k); lg.addColorStop(0, 'rgba(120,110,200,.10)'); lg.addColorStop(1, 'rgba(120,110,200,0)'); ctx.fillStyle = lg; ctx.fillRect(0, y0, W, H);
  ctx.strokeStyle = 'rgba(150,140,220,.07)'; ctx.lineWidth = 1; ctx.beginPath(); for (let x = -660; x < W + 40; x += 6) { ctx.moveTo(x, y0); ctx.lineTo(x + 600, y0 + 1040); } ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.beginPath(); for (let x = -660; x < W + 40; x += 6) { ctx.moveTo(x + 3, y0); ctx.lineTo(x - 597, y0 + 1040); } ctx.stroke(); ctx.restore();
  ctx.fillStyle = '#0b0d26'; ctx.beginPath(); for (const [wx, hh] of KTREES) { const x = P.X(wx), y = P.Y(knollY(wx)) + 2, h = hh * P.k * .9; if (x < -20 || x > W + 20 || y > H + 20) continue; ctx.moveTo(x - h * .28, y + 3); ctx.lineTo(x, y - h); ctx.lineTo(x + h * .28, y + 3); } ctx.fill();
  ctx.strokeStyle = rgba('#7c74c8', .5); ctx.lineWidth = 1.6; ctx.beginPath(); let first = true;
  for (let wx = KNOLL.x - KR; wx <= KNOLL.x + KR; wx += st) { const x = P.X(wx), y = P.Y(knollY(wx)); if (y > H + 40 || x < -60 || x > W + 60) { first = true; continue; } if (first) { ctx.moveTo(x, y); first = false; } else ctx.lineTo(x, y); }
  ctx.stroke();
  // its workshops
  const list = [];
  for (const L of KWS) { const x = P.X(L.wx), y = P.Y(L.wy), k = P.k * HERO.s * L.f; if (x < -150 || x > W + 150 || y < -50 || y > H + 300) continue;
    let lit = o.t0 != null ? clamp((t - o.t0 - L.on) / .4) : 0; lit *= .88 + .12 * Math.sin(t * .7 + L.br); list.push({ x, y, s: k, lit, L }); }
  instances(ctx, t, { list, threads: 0 });
  return list;
}
// the conductor on the crest, seen from behind; turn 0..1 turns the head into profile (a lit face sliver, a nose against the sky)
export function crestConductor(ctx, t, cam, o = {}) {
  const P = landCam(cam, KNOLL.d); if (cam.dist + KNOLL.d < .02) return null;
  const x = P.X(KNOLL.x - 6), y = P.Y(knollY(KNOLL.x - 6)) + 1, s = .234 * P.k;
  if (x < -100 || x > W + 100 || y < -50 || y > H + 300) return null;
  const clipY = o.clipY;                                              // he climbs over the crest from behind: clipped to the sky above the crest line
  if (clipY != null) { ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, y + 1); ctx.clip(); }
  const rise = clamp(o.rise ?? 1), yy = y + (1 - eoutX(rise)) * 190 * s;
  const r = conductor(ctx, t, x, yy, s, { view: 'back', pose: o.pose || 'stand', from: o.from, u: o.u ?? 1, glow: o.glow ?? .4, rim: o.rim ?? 1, light: { x: x + 400, y: yy - 600 } });
  const tu = clamp(o.turn ?? 0);
  if (tu > 0) {
    const Lf = life(t, 8), sy = -Lf.b * .9, hx = Lf.turn * 1.5, hy = -167 + sy;
    ctx.save(); ctx.translate(x, yy); ctx.scale(s, s);
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, 9.3, 11.2, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = '#6e4c38'; ctx.beginPath(); ctx.ellipse(hx + 9.3 - 7 * eio(tu), hy + 1.5, 7 * eio(tu), 9.5, 0, 0, TAU); ctx.fill(); ctx.restore();
    // nose and chin against the sky, amber rim on the face edge
    const nx = hx + 9.3 + .5 * eio(tu); ctx.fillStyle = '#6e4c38'; ctx.beginPath(); ctx.moveTo(nx - 1.2, hy - 3); ctx.lineTo(nx + 2.6 * eio(tu), hy + 1.2); ctx.lineTo(nx - 1, hy + 2.6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(F8.amber, .9 * tu); ctx.lineWidth = Math.max(1.4, 2.2 * s) / s; ctx.beginPath(); ctx.ellipse(hx, hy, 9.3, 11.2, 0, -1.15, .95); ctx.stroke();
    ctx.restore();
  }
  if (clipY != null) ctx.restore();
  return { ...r, x, y: yy, s };
}

// ---------------------------------------------------------------- towers of cold white light (standing on ridge i at reference sx)
export const TOWERS = [{ ridge: 3, sx: 200, h: 720, w: 40 }, { ridge: 1, sx: 378, h: 420, w: 30 }, { ridge: 1, sx: 621, h: 360, w: 26 }];
TOWERS.forEach((T) => { T.d = [6, 3, 1.4, .55][T.ridge]; T.sy = ridgeY(T.ridge, T.sx) + 6; });
export function tower(ctx, t, cam, T, grow, scale = 1, o = {}) {
  const g = clamp(grow); if (g <= 0) return null;
  const P = landCam(cam, T.d), bx = P.RX(T.sx), by = P.RY(T.sy), s = P.s, hh = T.h * scale * s * g, w0 = T.w * s * (.6 + .4 * scale), w1 = w0 * .62;
  if (bx < -200 || bx > W + 200 || by - hh > H) return { x: bx, y: by };
  const top = by - hh;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  // the cold halo round the shaft (narrow, so it leaves the frame with the shaft)
  const hg = ctx.createLinearGradient(bx - w0 * 1.8, 0, bx + w0 * 1.8, 0); hg.addColorStop(0, 'rgba(120,150,255,0)'); hg.addColorStop(.5, rgba('#8fa8ff', .22 * (o.a ?? 1))); hg.addColorStop(1, 'rgba(120,150,255,0)');
  ctx.fillStyle = hg; ctx.fillRect(bx - w0 * 1.8, top - 20 * s, w0 * 3.6, hh + 20 * s);
  ctx.restore();
  // the shaft: floors of cold light, brighter to the top
  ctx.beginPath(); ctx.moveTo(bx - w0 / 2, by); ctx.lineTo(bx - w1 / 2, top); ctx.lineTo(bx + w1 / 2, top); ctx.lineTo(bx + w0 / 2, by); ctx.closePath();
  const sg = ctx.createLinearGradient(0, by, 0, top); sg.addColorStop(0, '#8ea4e8'); sg.addColorStop(.6, '#d6e0ff'); sg.addColorStop(1, '#f6f9ff'); ctx.fillStyle = sg; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(40,50,110,.45)'; ctx.lineWidth = Math.max(.6, .9 * s); ctx.beginPath();
  const fl = Math.max(4, 16 * s * scale); for (let y = by - fl; y > top; y -= fl) { ctx.moveTo(bx - w0, y); ctx.lineTo(bx + w0, y); } ctx.moveTo(bx, by); ctx.lineTo(bx, top); ctx.stroke(); ctx.restore();
  // the growth front / the beacon at the top
  spr(ctx, 'cold', bx, top, (g < 1 ? 70 : 40) * s * (.5 + .5 * scale), g < 1 ? .9 : .55 * (o.a ?? 1));
  spr(ctx, 'cold', bx, by - 6 * s, 60 * s * (.4 + .6 * scale), .35);
  return { x: bx, y: by, top };
}

// ---------------------------------------------------------------- the anatomy plate (copy of f8_kit anatomyPlate, layers controlled one by one)
// o: x, y, s (screen), lift { roof, front, side } 0..1, paper, frame, plateRect, memA (the network's presence 0..1), memGlow, stitches, pulse,
//    leaders, labels { memory, hands, will }, labelX/Y/Gap, will (hand raised 0..1), fig { a 0..1 (mask reveal radius share), cx, cy },
//    ws (workshop options), handsGlow
export function platePart(ctx, t, o = {}) {
  const x = o.x, y = o.y, k = o.s, seed = 1, lift = o.lift;
  plateGround(ctx, t, clamp(o.paper ?? 0), clamp(o.frame ?? 0), seed, o.plateRect);
  const organ = { memory: [x - 62 * k, y - 46 * k], hands: [x - 4 * k, y - 34 * k], will: [x + 101 * k, y - 26 * k] };
  const op = Math.max(lift.front, lift.roof * .6, lift.side), memA = clamp(o.memA ?? 1), mg = o.memGlow || 0;
  const interior = (g, tt, L) => {
    const bg = g.createRadialGradient(organ.memory[0] + 30 * k, L.y + L.h * .45, 0, organ.memory[0] + 30 * k, L.y + L.h * .45, L.w * .7); bg.addColorStop(0, '#3a2a1a'); bg.addColorStop(.5, '#16121e'); bg.addColorStop(1, '#07081a');
    g.fillStyle = bg; g.fillRect(L.x, L.y, L.w, L.h);
    g.strokeStyle = rgba('#d8c08a', .25); g.lineWidth = Math.max(1, .5 * k); g.beginPath(); g.moveTo(L.x, L.y + L.h - 6 * k); g.lineTo(L.x + L.w, L.y + L.h - 6 * k); g.stroke();
    if (memA > 0) {
      weave(g, tt, { x: L.x + 4 * k, y: L.y + 3 * k, w: L.w - 8 * k, h: L.h - 10 * k, depth: 2, cols: 30, rows: 8, a: .3 * memA * (1 + mg * .6), seed: seed + 2, thick: 1.6, old: .5, persp: .12, shimmer: .6, shape: 'cloud' });
      weave(g, tt, { x: organ.memory[0] - 52 * k, y: L.y + 3 * k, w: 104 * k, h: 56 * k, depth: 2, cols: 22, rows: 14, a: 1.5 * memA * (1 + mg * .8), seed: seed + 3, thick: 2.2, old: .5, persp: .1, stitches: o.stitches || [], shimmer: 1, pulse: o.pulse, shape: 'brain' });
      spr(g, 'gold', organ.memory[0], organ.memory[1], 70 * k * (1 + mg * .5), memA * (.1 + .25 * mg));
    }
    spr(g, 'green', organ.hands[0], organ.hands[1], 60 * k, .3 * clamp(o.handsGlow ?? 1));
  };
  if (op > 0) spr(ctx, 'amber', organ.will[0] - 4 * k, y - 2 * k, 46 * k, .28 * op);
  const ws = workshop(ctx, t, x, y, k, { seed, ...(o.ws || {}), lift, interior: op > 0 ? interior : null, figure: false });
  // the figure in the door (as the kit's workshop draws it), with an optional mask reveal round the arriving light
  const wil = clamp(o.will ?? 0), F = o.fig || {}, fwd = lift.front, fx = x + 101 * k;
  if ((F.a ?? 1) > 0) {
    const masked = (F.a ?? 1) < 1; if (masked) { ctx.save(); ctx.beginPath(); ctx.arc(F.cx, F.cy, Math.max(.1, F.a * 80 * k), 0, TAU); ctx.clip(); }
    const fig = conductor(ctx, t, fx - fwd * 6 * k, y + fwd * 5 * k, .216 * k * (1 + .4 * fwd), { view: 'back', pose: 'handRaised', from: 'stand', u: wil, seed: 8, glow: o.figGlow ?? wil * .9, rim: .9 + wil * .4, light: { x: x + 140 * k, y: y - 80 * k } });
    organ.handPos = fig.hand;
    if (masked) ctx.restore();
  }
  if (wil > 0 || o.willPulse) spr(ctx, 'amber', organ.will[0] + 4 * k, organ.will[1] - 14 * k, 34 * k * (1 + .4 * (o.willPulse || 0)), .3 * Math.max(wil, .3) * (1 + (o.willPulse || 0)));
  organ.hand = [organ.will[0] + 8 * k, organ.will[1] - 20 * k];
  const LX = o.labelX ?? x + 150 * k, labels = o.labels || {}, ld = clamp(o.leaders ?? 0), names = [['memory', 'MEMORY'], ['hands', 'HANDS'], ['will', 'WILL']];
  if (ld > 0) names.forEach(([key, lab], i) => {
    const u = clamp(ld * 3 - i * .9), p = organ[key], ty = (o.labelY ?? y - 120 * k) + i * (o.labelGap ?? 44 * k), pts = [p, [mix(p[0], LX, .55), ty], [LX, ty]];
    if (u <= 0) return; const e = eio(u);
    ctx.save(); ctx.strokeStyle = rgba('#d9cfb0', .8); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    const L1 = Math.hypot(pts[1][0] - p[0], pts[1][1] - p[1]), L2 = LX - pts[1][0], d = (L1 + L2) * e;
    if (d <= L1) ctx.lineTo(mix(p[0], pts[1][0], d / L1), mix(p[1], pts[1][1], d / L1)); else { ctx.lineTo(pts[1][0], pts[1][1]); ctx.lineTo(pts[1][0] + d - L1, ty); }
    ctx.stroke(); ctx.fillStyle = '#e9dfc4'; ctx.beginPath(); ctx.arc(p[0], p[1], 3, 0, TAU); ctx.fill();
    if (e >= 1) { ctx.beginPath(); ctx.arc(LX, ty, 3, 0, TAU); ctx.fill(); }
    ctx.restore();
    const lu = clamp(labels[key] ?? 0);
    if (lu > 0) { ctx.save(); ctx.beginPath(); ctx.rect(LX + 14, ty - 26, 260 * eoutX(lu), 40); ctx.clip(); ctx.fillStyle = '#efe4c6'; ctx.font = '600 26px "Inter"'; try { ctx.letterSpacing = '7px'; } catch { } ctx.textBaseline = 'middle'; ctx.fillText(lab, LX + 20, ty); ctx.restore(); }
  });
  return { ...organ, rect: ws.rect, ws, lift };
}

// a gold filament with a bright head (the memory's threads flying in), points in screen space, q0..q1 the drawn part of the path
export function threadPath(ctx, pts, q0, q1, o = {}) {
  if (q1 <= q0) return; const n = pts.length - 1, at = (q) => { const f = clamp(q) * n, i = Math.min(n - 1, Math.floor(f)), u = f - i; return [mix(pts[i][0], pts[i + 1][0], u), mix(pts[i][1], pts[i + 1][1], u)]; };
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
  const seg = 14; for (let j = 0; j < seg; j++) { const a = mix(q0, q1, j / seg), b = mix(q0, q1, (j + 1) / seg), [ax, ay] = at(a), [bx, by] = at(b), f = (j + 1) / seg;
    ctx.strokeStyle = rgba(F8.gold, (o.a ?? .8) * (.15 + .85 * f)); ctx.lineWidth = (o.w ?? 1.6) * (.5 + .5 * f); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); }
  ctx.restore();
  if (o.head) { const [hx, hy] = at(q1); spr(ctx, 'gold', hx, hy, o.head, .9); }
}
export { mistBand };
