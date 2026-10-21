// c15 · the one take: camera path and composition (see the plan table in scenes/sc15.mjs)
// Two bases under one camera. Phase A (from the H4 plate to mid-day): drawHill draws the whole frame (its sky, ridges, water, town) and
// everything of ours goes over it. Phase B (from mid-day to the deep-sky plate): our deep sky + ridges, then drawHill without its sky.
// The swap happens while the day sky (opaque) covers every pixel of sky, so both bases give the same picture there. In Phase A the camera
// never tilts (ty 0, maslow4's own parallax model); in Phase B ty is a true tilt (all layers and the sky move together).
import { W, H, clamp, mix } from '../engine.mjs';
import { drawHill, VIEWS, hillOutline } from './maslow4.mjs';
import { figureBack } from './figure.mjs';
import { LC, toS, hillCam, camPath, span, smt, sio, eoX, skyDeep, drawRidges, glowAt, rgba, mixH, HZ, vg } from './v2_c15_kit.mjs';
import { drawLand, drawCrowd, drawFrieze } from './v2_c15_land.mjs';
import { drawSets, frameOn, G, P } from './v2_c15_sets.mjs';

const TAU = Math.PI * 2;
export const TY_END = 780;                       // the tilt at which the deep-sky plate fills the frame exactly (skyDeep offset 0)
export const YOU = { x: 944, y: 214.3, cx: 944, cy: 205.66, s: 1 - 1 / 22, ty: 260 };   // you on the summit, and the camera that frames you
const HERO = { x: 1564.9, kind: 'hoe' };          // the one in the valley who looks up (a ghost on the near terraces, layer .6)

export function anchors(T, HI, HO) {
  const S = (p, n) => T.S('07a', p, n), E = (p, n) => T.E('07a', p, n);
  const A = {
    hb: HI.b, ha: HO.a, end: HO.a - 1 / 30,
    think: S('Think'), every: S('everyone'), lived: S('lived'), livedE: E('lived'),
    most: S('Most of'), up: S('up here'), hereE: E('up here'),
    not: S('Not because'), shallow: S('shallow'), shallowE: E('shallow'),
    because: S('Because survival'), days: S('days'), daysE: E('days'),
    harvest: S('harvest'), harvestE: E('harvest'), rent: S('rent'), rentE: E('rent'), shift: S('next shift'), shiftE: E('next shift'), punch: S('shift'),
    there: S('There was'), wonder: S('wonder'), wonderE: E('wonder'),
    asking: S('Asking'), few: S('the few'), fewE: E('the few'),
    first: S('For the first'), belong: S('belong'), every2: S('everyone', 1), every2E: E('everyone', 1),
    lagos0: S('To a cook'), cook: S('cook'), lagos: S('Lagos'), lagosE: E('Lagos'),
    peru0: S('To a farmer'), farmer: S('farmer'), peru: S('Peru'), peruE: E('Peru'),
    you0: S('To you'), youE: E('To you'),
  };
  // the day: the sky turns to day while the hero looks up, the sun crosses once, dusk falls on the harvest
  A.day0 = A.because + .05; A.day1 = A.because + .6; A.dusk0 = A.daysE - .3; A.dusk1 = A.harvest + .2;
  A.swap = (A.day1 + A.dusk0) / 2;
  return A;
}

// ---------------------------------------------------------------- the camera (keys anchored to the words; frameOn = strip framing)
const F = (X, Y, sx, sy, z, ty = 0) => frameOn(X, Y, sx, sy, z, ty);
let PATH = null, PA = null;
function path(A) {
  if (PA === A) return PATH;
  const H4 = VIEWS.H4.cam, s0 = 1 - 1 / H4.z, gw = G(2505), you = { x: YOU.cx, y: YOU.cy, s: YOU.s };
  const K = [
    [A.hb, { x: H4.x, y: H4.y, s: s0 }],                                   // 15.01 the summit view (= the plate)
    [A.hb + .3, { x: H4.x + 5, y: H4.y + 1, s: s0 - .004 }],
    [A.livedE - .1, { x: 1250, y: 330, s: .32 }],                          // 15.02 the frieze: everyone who has ever lived
    [A.hereE, { x: 1296, y: 428, s: .42 }],                                // 15.03 the valleys below the summit, bent at work
    [A.shallowE + .05, { x: 1305, y: 469, s: .52 }],                       // 15.04 one of them straightens and looks up
    [A.swap, { x: 1450, y: 470, s: .40 }],                                 // 15.05 the sun crosses once
    [A.harvest, F(2398, G(2398), 900, 860, 14)],                       // 15.06 the harvest
    [A.harvestE - .3, F(2403, G(2403), 900, 860, 15)],
    [A.rent + .1, F(2457, P.win.y + 10, 960, 560, 24)],                    // 15.07 the rent
    [A.rentE - .05, F(2458, P.win.y + 10, 960, 560, 26)],
    [A.punch - .2, F(2519, gw - 18, 960, 560, 22)],                        // 15.08 the next shift
    [A.shiftE - .1, F(2520, gw - 18, 960, 560, 24)],
    [A.there + .3, F(2553, G(2553) - 10, 960, 720, 13)],                   // 15.09 no room left to wonder
    [A.wonderE - .1, F(2553, G(2553) - 10, 960, 720, 15.5)],
    [A.asking + .5, F(2648, G(2648) - 60, 960, 540, 5.5)],                 // 15.10 the few: one lit tower window
    [A.few, F(2648, G(2648) - 82, 960, 540, 24)],
    [A.fewE, F(2648, G(2648) - 82, 960, 540, 26)],
    [A.belong, F(2600, 762, 960, 990, 3.6)],                               // 15.11 ★ every window lights
    [A.every2E - .1, F(2606, 762, 960, 990, 3.7)],
    [A.lagos - .2, F(2806, G(2806) - 11, 960, 600, 13)],                   // 15.12 Lagos
    [A.lagosE - .05, F(2808, G(2806) - 11, 960, 600, 14)],
    [A.peru0 + .1, F(2870, G(2870) - 14, 960, 600, 7)],
    [A.farmer + .12, F(2936, G(2936) - 10, 960, 620, 12)],                 // 15.13 Peru
    [A.peru, F(2937, G(2936) - 10, 960, 620, 12.5)],
    [A.peruE - .2, { ...F(2937.5, G(2936) - 10, 960, 620, 12.7), ty: 1060 }],   // his gaze: tilt up into the stars
    [A.peruE - .14, { ...you, s: .5, ty: 1060 }],                          // (sky only: the camera glides to the summit)
    [A.peruE - .02, { ...you, ty: 800 }],
    [A.you0 + .38, { ...you, ty: YOU.ty }],                                // you, on the summit, looking up
    [A.youE + .1, { ...you, x: you.x + .6, ty: YOU.ty + 10 }],
    [A.end, { ...you, x: you.x + .8, ty: TY_END }],                        // up into the deep sky (= the plate)
  ];
  PATH = camPath(K.map(([t, c]) => ({ t, x: c.x, y: c.y, s: c.s, ty: c.ty || 0 })));
  PA = A; return PATH;
}
export const camAt = (t, A) => path(A)(t);

// ---------------------------------------------------------------- drawHill without its sky (Phase B): a context that ignores every
// paint call until maslow4 sets its world transform (the first uniform scale), i.e. through sky() and waterBase()
const PAINT = new Set(['fill', 'fillRect', 'stroke', 'strokeRect', 'drawImage', 'fillText', 'strokeText', 'putImageData', 'clearRect']);
let PROXY = null, PSTATE = { on: false }, PTARGET = null;
function noSkyCtx(ctx) {
  if (PTARGET !== ctx) {
    const st = { on: false }, cache = new Map(), noop = () => { };
    PROXY = new Proxy(ctx, {
      get(tg, p) {
        if (p === 'scale') return (a, b) => { if (st.on && a === b) st.on = false; return tg.scale(a, b); };
        if (st.on && PAINT.has(p)) return noop;
        const v = tg[p];
        if (typeof v !== 'function') return v;
        let f = cache.get(p); if (!f) { f = v.bind(tg); cache.set(p, f); } return f;
      },
      set(tg, p, v) { tg[p] = v; return true; },
    });
    PSTATE = st; PTARGET = ctx;
  }
  PSTATE.on = true; return PROXY;
}
// maslow4 waterBase (copied): the water below the hill's horizon line, screen space
function waterBase(ctx, hc, n) {
  const hy = (HZ - hc.y) * hc.z + H / 2; if (hy >= H) return;
  const y0 = Math.max(hy, -10), g = ctx.createLinearGradient(0, hy, 0, hy + 300 * hc.z);
  g.addColorStop(0, mixH('#5e5082', '#141440', n)); g.addColorStop(.12, mixH('#433a70', '#0e0e32', n)); g.addColorStop(.45, mixH('#2a2454', '#090a24', n)); g.addColorStop(1, mixH('#1a1638', '#05060f', n));
  ctx.fillStyle = g; ctx.fillRect(0, y0, W, H - y0);
}

// ---------------------------------------------------------------- the day sky and the sun (at infinity: only the tilt moves them)
function daySky(ctx, C, dA, u) {
  const hy = 812 + (C.ty || 0), e = 1 - Math.sin(Math.PI * clamp(u));            // e: dawn / dusk at the two ends of the crossing
  const zen = mixH('#7d8fb8', '#55507e', e * .7), mid = mixH('#c9c6cc', '#d89a8c', e), low = mixH('#f1dcc2', '#ffb27a', e);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = dA;
  ctx.fillStyle = vg(ctx, hy - 1000, hy, [[0, zen], [.62, mid], [1, low]]); ctx.fillRect(0, 0, W, H);
  // engraved sky: long thin horizontal lines, stable on screen (a print's sky shading)
  ctx.strokeStyle = rgba('#3a3050', .07); ctx.lineWidth = 1; ctx.beginPath();
  for (let y = 6; y < Math.min(H, hy); y += 5) { ctx.moveTo(0, y + .5); ctx.lineTo(W, y + .5); } ctx.stroke();
  ctx.globalAlpha = 1;
  const sx = mix(260, W + 160, u), sy = hy + 40 - 660 * Math.sin(Math.PI * clamp(u));
  glowAt(ctx, sx, sy, 560, '#ffe2b0', .5 * dA); glowAt(ctx, sx, sy, 150, '#fff4dc', .75 * dA);
  ctx.globalAlpha = dA; ctx.fillStyle = '#fffaf0'; ctx.beginPath(); ctx.arc(sx, sy, 27, 0, TAU); ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- screen labels (LAGOS, PERU): letter-spaced caps, a wipe in and out
function label(ctx, t, t0, t1, txt) {
  const a = span(t, t0, t0 + .4), b = span(t, t1 - .3, t1); if (a <= 0 || b >= 1) return;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = '600 25px Inter'; const sp = 9, ws = [...txt].map((c) => ctx.measureText(c).width), w = ws.reduce((s, v) => s + v + sp, -sp);
  const x = 112, y = 870, x0 = x + (w + 40) * sio(b), x1 = x + (w + 40) * eoX(a);
  ctx.beginPath(); ctx.rect(x0 - 2, y - 40, Math.max(0, x1 - x0 + 4), 60); ctx.clip();
  ctx.fillStyle = 'rgba(255,179,92,.9)'; ctx.fillRect(x, y - 36, 34, 2);
  ctx.fillStyle = '#f3efe2'; ctx.textBaseline = 'alphabetic'; let cx = x; [...txt].forEach((c, i) => { ctx.fillText(c, cx, y); cx += ws[i] + sp; });
  ctx.restore();
}

// ---------------------------------------------------------------- the frame
let HOUT = null;
function skyRegion(ctx, C) {
  // the sky part of the frame: above the hill's waterline and outside the hill (even-odd), screen space
  if (!HOUT) HOUT = hillOutline();
  const L = LC(C, 1), wy = toS(L, 0, HZ)[1];
  ctx.beginPath(); ctx.rect(0, 0, W, clamp(wy, 0, H)); ctx.clip();
  ctx.beginPath(); ctx.rect(-10, -10, W + 20, H + 20);
  for (let i = 0; i < HOUT.length; i++) { const [X, Y] = toS(L, HOUT[i][0], HOUT[i][1]); i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.closePath(); ctx.clip('evenodd');
}
export function take(ctx, t, A, HO) {
  if (t >= A.end - 1e-3) { HO.plate(ctx, t); return; }
  const C = camAt(t, A), phaseB = t >= A.swap;
  // the day and the night
  const dA = smt(span(t, A.day0, A.day1)) * (1 - smt(span(t, A.dusk0, A.dusk1))), sunU = sio(span(t, A.day0 + .02, A.dusk1 - .1));
  const n = 1 - .8 * dA, glow = smt(span(t, A.dusk0 - .3, A.dusk0 + .2)) * (1 - smt(span(t, A.harvestE - .25, A.rent + .1)));
  // ★: windows light in a wave, the bent straighten and look up, the summit's own windows come on
  const star = span(t, A.first + .35, A.every2E + .2), straight = smt(span(t, A.belong - .45, A.every2E + .1)), lit4 = smt(span(t, A.belong - .2, A.belong + .9));
  const st = { ...VIEWS.H4.st, labels: 1 - smt(span(t, A.hb + .1, A.hb + .75)), lit: [1, 1, 1, 1, lit4], night: n };
  const hc = hillCam(C);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (!phaseB) drawHill(ctx, t, hc, st);
  else {
    skyDeep(ctx, t, (C.ty || 0) - TY_END, { yh: 812 + (C.ty || 0) });
    drawRidges(ctx, C, n);
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); waterBase(ctx, hc, n); ctx.restore();
    drawHill(noSkyCtx(ctx), t, hc, st);
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // the sky part: the day sky and sun, the far ridges again over it, the frieze of everyone, the far lands
  ctx.save(); skyRegion(ctx, C);
  if (dA > 0) { daySky(ctx, C, dA, sunU); drawRidges(ctx, C, n); }
  const wave = (x) => clamp((t - A.think - .15 - (x - 950) * .0011) / 1.1);
  drawFrieze(ctx, t, C, { u: wave, a: .78, look: straight });
  for (const k of ['far3', 'far2', 'mid14']) drawLand(ctx, t, C, k, { night: n });
  ctx.restore();
  // you, on the summit (only near the end)
  if (t > A.peruE - .3) {
    const L = LC(C, 1), [X, Y] = toS(L, YOU.x, YOU.y);
    if (Y - 200 < H && Y > -40) {
      const up = smt(span(t, A.you0 + .1, A.youE));
      ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
      figureBack(ctx, X, Y, L.z * .046, { t, seed: 15, hold: 'none', headTilt: mix(.08, -.38, up), dress: { coat: '#2a3150', pants: '#15162a' }, accent: '#c8843a', light: { x: X + 520, y: Y - 760, col: '#dfe6ff', a: .85 }, rimFloor: 3 });
      ctx.restore();
    }
  }
  // the valleys (near ridges, with their people), then the strip with the sets
  const heroU = smt(span(t, A.not + .3, A.not + 1.05)) * (1 - smt(span(t, A.because + .55, A.because + 1.4)));
  const warm = { x: 300, y: 80, col: '#ffcf86', a: .5 };
  for (const k of ['near8', 'near6']) {
    drawLand(ctx, t, C, k, { night: n, sun: dA > 0 ? { u: dA * .8 } : null });
    drawCrowd(ctx, t, C, k, { a: .85, straight, hero: k === 'near6' ? { ...HERO, u: heroU, warm } : null });
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  drawSets(ctx, t, C, A, { night: n, glow, star, warm: glow > .01 ? { x: 1900, y: 380, col: '#ffcf86', a: .65 * glow } : null });
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  label(ctx, t, A.lagos - .05, A.lagosE + .3, 'LAGOS');
  label(ctx, t, A.peru - .05, A.peruE - .15, 'PERU');
  ctx.restore();
}
