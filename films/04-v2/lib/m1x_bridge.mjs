// Film 4 v2 · the minute (c01–c04): the three chunk-boundary bridges, no blends. Owner: m1-c02 (minute repair 2026-10-20; the
// other chunks import, nobody else edits). Since the repair sheet12 also takes M.sy, o.lift and o.vig (all optional, defaults = old look). Plan: /mnt/project-files/scenario/film-04-v2/bild/minute-fix-plan.md
//
// A bridge is ONE function that both neighbouring chunks draw over the same window [a, b]; the cut between the two chunk files sits at
// `cut` inside it, so it cannot be seen. Outside the window each chunk draws its own world and lands on / leaves the bridge picture
// continuously (same position, size and zero velocity at a and b).
//
//   bridgeWin(key, T) → { key, a, cut, b }       'c01>c02' | 'c02>c03' | 'c03>c04' (times from VO words)
//   bridge(key)(ctx, t, T)                       the full frame for t in [a, b]; also exported as b12, b23, b34
//   lightAt(ctx, t, x, y, r, o)                  the in-world light used by b23 / b34 and by c01's two light passes (screen space):
//                                                (x, y) its centre on screen, r its source radius in px; o.tone ('lamp' | 'cream' |
//                                                'dawn' | 'gold'), o.core (0..1 opacity of the source disc), o.bloom (0..1 halo),
//                                                o.seed (ray / dust pattern). With r >= R_FULL at (W/2, H/2) it covers the whole frame.
//   R_FULL                                       1500 px (the opaque part, 0.78 r, then reaches every corner)
//   b12K(T)                                      c01's wall-shot anchors (scenes/sc01.mjs K9 must be exactly this)
//   pose12(t, T) → { x, y, s, r }                the sheet: screen centre of the vignette, vignette scale (VIG units → px), rotation
//   sheet12(ctx, t, T, M, o)                     the floating sheet at pose M with c01's live wall as its vignette; o.wash 0..1 = the
//                                                paper veil c02 lays over the picture while its lines leave as dots ("daydream")
//   warm(T)                                      builds every cache the bridges use and awaits the Image decodes (await it in the
//                                                scene's default export, which becomes async)
//
// Determinism: every picture is a pure function of t (prng with fixed seeds, no Math.random). No offscreen buffer is drawn per frame
// (the @napi-rs drawImage(<Canvas>) leak): cached layers go through toImg / best.
import { W, H, rgba, clamp, mix, lin, sm, prng, drift } from '../engine.mjs';
import { toImg, best, ready, qio } from './sc01_m1_open.mjs';
import { wallShot } from './sc01_m1_world.mjs';
import { nightBG, motes, VIG, SHEET, sheetLayer } from './sc02_m1.mjs';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the windows (VO-anchored)
export function bridgeWin(key, T) {
  if (key === 'c01>c02') {   // pull out of c01's wall: it is the picture on a sheet floating in the dark (silence after "guess." → "daydream")
    const cut = T.S('00c', 'It sounds');
    return { key, a: T.E('00b', 'guess') + .42, cut, b: T.S('00c', 'daydream') - .03 };   // a 2.0 s camera pull (DNA: camera moves 1–2 s)
  }
  if (key === 'c02>c03') {   // inside the light above the stairs = the light in the works hall's door ("will." → "But that's not")
    const cut = T.S('01a', "But that's not");
    return { key, a: cut - .12, cut, b: cut + .18 };
  }
  if (key === 'c03>c04') {   // inside the light of your window = the light plate I is made of (c04's first entry stays at "AI" − .2)
    const cut = T.seg('01b').start - .2;
    return { key, a: cut - .15, cut, b: cut + .15 };
  }
  throw new Error('bridgeWin: unknown key ' + key);
}

// ---------------------------------------------------------------- the light (screen space)
const TONES = {
  lamp: ['#fff4dc', '#ffc978', '#e8893a'],    // b23: the warm light above the stairs = the works hall's lit door
  cream: ['#fffaf0', '#f8e6c0', '#e2b77e'],   // b34: your window's light = plate I's paper
  dawn: ['#fff6e2', '#ffd9a0', '#f4a77a'],    // c01 row → roof (the far light becomes the dawn sun; = handoff4 light 'dawn')
  gold: ['#fff3d6', '#ffc070', '#e0784a'],    // c01 map → lake (the landing glow becomes the low sun)
};
export const R_FULL = 1500;
// engraved rays: fine tapered hairlines around the source (an etched sun), two lengths, turning slowly
const RAYN = 132;
const RAYS = (() => { const r = prng(9001), out = []; for (let i = 0; i < RAYN; i++) { const long = i % 2 === 0; out.push({ a: i / RAYN * TAU + (r() - .5) * .012, l0: long ? .13 + r() * .04 : .2 + r() * .06, l1: long ? .78 + r() * .3 : .42 + r() * .2, w: (long ? 1.7 : 1.1) * (.8 + r() * .4), al: .55 + r() * .45, wob: r() * TAU }); } return out; })();
const DUSTN = 520;
const DUST = (() => { const r = prng(4711), out = []; for (let i = 0; i < DUSTN; i++) out.push({ a: r() * TAU, u0: r(), v: .05 + r() * .09, z: 1.1 + r() * 1.5, al: .35 + r() * .65, rot: (r() - .5) * .05 }); return out; })();

export function lightAt(ctx, t, x, y, r, o = {}) {
  const [c0, c1, c2] = TONES[o.tone] || TONES.lamp, core = clamp(o.core ?? 1), bloom = clamp(o.bloom ?? 1), seed = o.seed ?? 0;
  if (r <= .5) return;
  const R = r * (1 + .014 * Math.sin(t * 1.9 + seed) + .006 * Math.sin(t * 4.7 + seed * 2));   // the light breathes
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  // 1 · halo on the world around it (additive)
  if (bloom > 0) {
    ctx.globalCompositeOperation = 'lighter';
    const g = ctx.createRadialGradient(x, y, R * .4, x, y, R * 2.6); g.addColorStop(0, rgba(c1, .5 * bloom)); g.addColorStop(.35, rgba(c2, .16 * bloom)); g.addColorStop(1, rgba(c2, 0));
    const bx0 = Math.max(0, x - R * 2.6), by0 = Math.max(0, y - R * 2.6), bx1 = Math.min(W, x + R * 2.6), by1 = Math.min(H, y + R * 2.6);
    if (bx1 > bx0 && by1 > by0) { ctx.fillStyle = g; ctx.fillRect(bx0, by0, bx1 - bx0, by1 - by0); }
  }
  // 2 · the source: white-hot centre, warm falloff, opaque to 0.9 r, soft edge to r
  if (core > 0) {
    ctx.globalCompositeOperation = 'source-over';
    const g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, rgba('#ffffff', core)); g.addColorStop(.1, rgba(c0, core)); g.addColorStop(.5, rgba(c1, core)); g.addColorStop(.9, rgba(c2, core)); g.addColorStop(1, rgba(c2, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, R, 0, TAU); ctx.fill();
  }
  // 3 · engraved rays: tapered hairlines in the falloff's ink, turning slowly (an etched sun; it is never a still frame).
  //     Line width grows with the source but stays a hairline (1..2.4 px); fades in once the source is bigger than ~30 px.
  const ra = core * clamp((R - 30) / 220);
  if (ra > 0) {
    ctx.globalCompositeOperation = 'source-over';
    const spin = t * .045 + seed * .7, lw = clamp(R / 900, .55, 1.4);
    ctx.fillStyle = rgba(c2, .3 * ra); ctx.beginPath();
    for (const q of RAYS) {
      const a = q.a + spin + .004 * Math.sin(t * .7 + q.wob), ca = Math.cos(a), sa = Math.sin(a), hw = q.w * lw * (1 + .25 * Math.sin(t * 1.1 + q.wob));
      const r0 = R * q.l0, r1 = R * q.l1 * (1 + .03 * Math.sin(t * .8 + q.wob * 2));
      ctx.moveTo(x + ca * r0 - sa * hw * .15, y + sa * r0 + ca * hw * .15);
      ctx.lineTo(x + ca * (r0 + (r1 - r0) * .35) - sa * hw, y + sa * (r0 + (r1 - r0) * .35) + ca * hw);
      ctx.lineTo(x + ca * r1, y + sa * r1);
      ctx.lineTo(x + ca * (r0 + (r1 - r0) * .35) + sa * hw, y + sa * (r0 + (r1 - r0) * .35) - ca * hw);
      ctx.lineTo(x + ca * r0 + sa * hw * .15, y + sa * r0 - ca * hw * .15); ctx.closePath();
    }
    ctx.fill();
  }
  // 4 · engraved dust: stipple drifting outward through the falloff (the print look of light)
  const da = core * clamp((R - 180) / 500);
  if (da > 0) {
    ctx.globalCompositeOperation = 'source-over'; ctx.fillStyle = rgba(c2, .42 * da);
    const n = Math.round(DUSTN * clamp(R / 1200, .25, 1));
    for (let i = 0; i < n; i++) {
      const d = DUST[i], u = .22 + (((d.u0 + d.v * t + seed * .13) % 1) + 1) % 1 * 1.05, a = d.a + d.rot * t + seed;
      const f = sm(clamp((u - .3) / .15)) * (1 - sm(clamp((u - 1.05) / .2)));
      if (f <= .02) continue;
      const px = x + Math.cos(a) * u * R, py = y + Math.sin(a) * u * R; if (px < -4 || px > W + 4 || py < -4 || py > H + 4) continue;
      const z = d.z * 1.3; ctx.globalAlpha = f * d.al; ctx.fillRect(px - z / 2, py - z / 2, z, z);
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- c01 > c02: the wall is the picture on a floating sheet
export const DEPTH = W / VIG.w;   // 3.2: at this scale the vignette is exactly c01's full frame
export function b12K(T) {
  return { t0: T.S('00b', 'And the reason') - .3, reason: T.S('00b', 'reason'), guess: T.S('00b', 'guess'), end: T.S('00c', 'It sounds') + 1 };
}
const S12 = { s1: .87, c1: [854, 454], r1: -.032 };   // where the pull-out lands (c02's sheet framing of 2.01)
export function pose12(t, T) {
  const B = bridgeWin('c01>c02', T), u = qio(lin(B.a, B.b, t));
  const s0 = DEPTH, s1 = S12.s1, s = Math.exp(mix(Math.log(s0), Math.log(s1), u));
  const C0 = [W / 2, H / 2], C1 = S12.c1, Q = [(C1[0] * s0 - C0[0] * s1) / (s0 - s1), (C1[1] * s0 - C0[1] * s1) / (s0 - s1)];   // zoom about the fixed point Q
  const k = s / s0, sway = sm(lin(B.a + .4, B.b, t));
  return { x: Q[0] + (C0[0] - Q[0]) * k + drift(t, 4, 1) * sway, y: Q[1] + (C0[1] - Q[1]) * k + drift(t, 3, 2) * sway, s, r: S12.r1 * u + .006 * Math.sin(t * .6) * sway };
}
const sheetImg = () => { const L = sheetLayer(); toImg(L.c); return L; };
// M.sy (optional, default M.s): a separate vertical scale (the sheet tipping flat, foreshortened); o.lift (0..1, default 1): how high it
// floats (shadow offset and blur); o.vig(ctx, x0, y0, L): draws the vignette instead of c01's live wall (c02 uses it once the picture
// starts to leave as dots; L = the sheet layer). All three are optional: without them the picture is exactly as before.
export function sheet12(ctx, t, T, M, o = {}) {
  const L = sheetImg(), x0 = -VIG.w / 2, y0 = -VIG.h / 2, lift = o.lift ?? 1;
  ctx.save(); ctx.translate(M.x, M.y); ctx.rotate(M.r); ctx.scale(M.s, M.sy ?? M.s);
  // soft shadow under the floating sheet, then the sheet (deckled paper, engraved frames, microtext)
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40 * (lift === 1 ? 1 : mix(.2, 1, lift)); ctx.shadowOffsetX = 18 * lift; ctx.shadowOffsetY = 28 * lift; ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(x0 - SHEET.vx, y0 - SHEET.vy, SHEET.w, SHEET.h); ctx.restore();
  ctx.drawImage(best(L.c), x0 - SHEET.vx - L.pad, y0 - SHEET.vy - L.pad, L.c.width / L.K, L.c.height / L.K);
  if (o.vig) o.vig(ctx, x0, y0, L);
  else {
    // the vignette IS c01's wall shot, live (identity transform when M.s = DEPTH at the frame centre)
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, VIG.w, VIG.h); ctx.clip(); ctx.translate(x0, y0); ctx.scale(1 / DEPTH, 1 / DEPTH);
    wallShot(ctx, t, b12K(T));
    ctx.restore();
  }
  if (o.wash > 0) { ctx.fillStyle = rgba('#e6dcc3', clamp(o.wash)); ctx.fillRect(x0, y0, VIG.w, VIG.h); }
  ctx.restore();
}
// c02's ground under the sheet (exactly what sc02's draw paints there before the stage lights come up)
const ground12 = (ctx, t) => { nightBG(ctx, t, { dx: drift(t, 10, 2), dy: drift(t, 6, 3) }); motes(ctx, t, 11, 60, .6); };
export function b12(ctx, t, T) { ground12(ctx, t); sheet12(ctx, t, T, pose12(t, T)); }

// ---------------------------------------------------------------- c02 > c03 and c03 > c04: inside the light
export const B23 = { tone: 'lamp', seed: 23 }, B34 = { tone: 'cream', seed: 34 };
export function b23(ctx, t) { lightAt(ctx, t, W / 2, H / 2, R_FULL, B23); }
export function b34(ctx, t) { lightAt(ctx, t, W / 2, H / 2, R_FULL, B34); }

export function bridge(key) { return key === 'c01>c02' ? b12 : key === 'c02>c03' ? b23 : key === 'c03>c04' ? b34 : null; }

// ---------------------------------------------------------------- warm-up (caches + Image decodes)
let WARMED = null;
export function warm(T) {
  if (WARMED) return WARMED;
  WARMED = (async () => {
    const { canvas } = await import('../engine.mjs'); const [, g] = canvas();
    const B = bridgeWin('c01>c02', T);
    for (const t of [B.a, B.cut, B.b]) { g.save(); b12(g, t, T); g.restore(); }
    g.save(); b23(g, 44.6); g.restore(); g.save(); b34(g, 57.1); g.restore();
    await ready();
  })();
  return WARMED;
}
