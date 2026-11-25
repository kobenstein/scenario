// Film 75 · THE LEITBILD (THE SUNRISE, thumbnail A) + the seam plates + the end screen (owned by the lead; builders import, never edit —
// wishes go in the report). The Leitbild appears ONLY at the 4 anchors (REGELN §13): hook H.01–H.02 · turn 3.03 "It's the clock you are
// carrying" · point 4.12 "the race is a product of choices. So is the gap." · end 5.06 + A.01 + E.01 (end screen). Everything else is the
// explainer stage THE WALL (lib/f75_explain.mjs).
//
// THE SUNRISE: a night sky with stars; a giant gold sphere (= godlike AI, F.sphere) rising behind a dark round hill, broad beams fanning out;
// on the hilltop YOU, small, seen from behind in the yellow coat, one arm raised holding a hand axe (Stone Age tool) against the light.
// Cards (true parallax through the 2.5D stage of f10_editorial): sky + stars Z_SKY · the sphere + beams Z_SUN · a far ridge Z_RIDGE ·
// the hill + you Z_HILL. Design coordinates = the 1920×1080 frame at the home camera (E.cam3()).
//
// sunrise(ctx, c, t, st)   st (all optional):
//   rise 0..1 (sphere height: 0 = below the hill, 1 = thumbnail; default 1) · rays 0..1 (default 1) · glow 0..1 · steps (sphere rings)
//   you { x, h, arm 0..1 (the arm with the axe raised; default 1), hold 'axe' | 'phone' | 'both' (phone in the other hand, lit cool),
//         ring { dashed, fill, a, spin } (your breath ring round your chest, seen from behind), a } | false
//   gap { u, label } THE GAP bracket on the sky between you (left end) and the sphere's rim (right end), label THE GAP
//   stars 0..1 · hillLight 0..1 (the light fans on the hill) · fg(ctx) on the hill card after you · sky(ctx) on the sky card
// Returns { sphere: [x, y, r] (screen), you: { head: [x, y], hand: [x, y], axe: [x, y] } (screen) }.
// Cameras: HOME() = thumbnail framing; PUSH(k) = slow push towards you (k 0..1: 0 = home, 1 = the hill 30 % bigger); keep anchors calm.
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f75_kit.mjs';
import * as X from './f75_explain.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad } = E;
const { GOLD, COOL, CREAM, OCHRE, COAT, HUD } = F;

// ------------------------------------------------------------------------------------------------ seams
// A plate is the EXACT picture at a group boundary. The handing side draws it for t in [T0 − .5, T0) (its last move converges to it), the
// receiving side draws the same plate for t in [T0, T0 + .5) and grows its next picture out of it. Plates keep a slow push (CREEP 4 %/s
// from T0 − .5); the receiving side continues it (view scale = creep(t, T, phrase)).
export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));

// ------------------------------------------------------------------------------------------------ THE SUNRISE
export const Z_SKY = 40000, Z_SUN = 30000, Z_RIDGE = 9000, Z_HILL = 2600;
export const SUN = { x: 960, y: 905, r: 470 };          // design px on the sun card (= screen px at home): thumbnail A
export const HILL = { top: 893, edge: 37, you: 940 };   // hill top y at the centre, drop at the frame edges, your x
export const hillY = (x) => HILL.top + HILL.edge * ((x - 960) / 960) ** 2;
export const HOME = () => E.cam3();
export const PUSH = (k = 0) => E.cam3({ x: -20 * k, y: 40 * k, z: 600 * sineIO(clamp(k)) });

export function sunrise(ctx, c, t, st = {}) {
  const rise = st.rise ?? 1, rays = st.rays ?? 1, glow = st.glow ?? 1;
  // sky
  E.card(ctx, c, Z_SKY, () => {
    const x0 = -W * 1.2, w0 = W * 3.4;
    ctx.fillStyle = lin(ctx, 0, -600, 0, 1000, [[0, P.night0], [.45, mixHex(P.night1, P.ind0, .6)], [.8, mixHex(P.ind1, P.blue0, .45)], [1, mixHex(P.blue0, GOLD.mid, .25 * rise)]]);
    ctx.fillRect(x0, -H, w0, H * 3);
    E.stars(ctx, 75, 260, t, [x0, -H * .6, w0, H * 1.3], .9 * (st.stars ?? 1));
    if (st.sky) st.sky(ctx);
  });
  // the sphere + beams (rises behind the hill)
  const sy = SUN.y + (1 - rise) * 640;
  let sphere = null;
  E.card(ctx, c, Z_SUN, (k) => {
    F.sphere(ctx, t, SUN.x, sy, SUN.r * (st.sunK ?? 1), { rays: rays * (.35 + .65 * rise), rayLen: 4.6, steps: st.steps ?? 0, dust: 2200, a: glow > 0 ? 1 : 0 });
  });
  { const p = E.project(c, Z_SUN, SUN.x, sy); if (p) sphere = [p[0], p[1], SUN.r * (st.sunK ?? 1) * p[2]]; }
  // a far ridge (soft, for depth)
  E.card(ctx, c, Z_RIDGE, () => {
    ctx.fillStyle = mixHex(P.night1, P.ind1, .45); ctx.beginPath(); ctx.moveTo(-1400, 1200);
    for (let x = -1400; x <= 3400; x += 80) ctx.lineTo(x, 905 + 22 * Math.sin(x * .004 + 1) + 12 * Math.sin(x * .011));
    ctx.lineTo(3400, 1200); ctx.closePath(); ctx.fill();
  });
  // the hill + you
  let you = null;
  E.card(ctx, c, Z_HILL, (k) => {
    const hp = new Path2D(); hp.moveTo(-1600, 3000); for (let x = -1600; x <= 3500; x += 40) hp.lineTo(x, hillY(x)); hp.lineTo(3500, 3000); hp.closePath();
    ctx.fillStyle = lin(ctx, 0, HILL.top, 0, 1400, [[0, mixHex(P.night1, P.ind1, .35)], [.35, P.night1], [1, P.night0]]); ctx.fill(hp);
    // the light fans on the hill (the beams continue as long light and shadow from your feet)
    const hl = (st.hillLight ?? 1) * rise;
    if (hl > 0) {
      ctx.save(); ctx.clip(hp); ctx.globalCompositeOperation = 'lighter';
      const fx = st.you?.x ?? HILL.you, fy = hillY(fx);
      for (let i = 0; i < 9; i++) { const q = Math.PI / 2 + (i - 4) * .26, w = .07;
        ctx.fillStyle = lin(ctx, fx, fy, fx + Math.cos(q) * 900, fy + Math.sin(q) * 900, [[0, rgba(GOLD.halo, .07 * hl * (i % 2 ? .45 : 1))], [1, rgba(GOLD.halo, 0)]]);
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.arc(fx, fy, 1400, q - w, q + w); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.save(); ctx.clip(hp);   // two long shadows from your feet
      for (const q of [Math.PI / 2 - .2, Math.PI / 2 + .16]) { ctx.fillStyle = lin(ctx, fx, fy, fx + Math.cos(q) * 600, fy + Math.sin(q) * 600, [[0, rgba(P.night0, .7 * hl)], [1, rgba(P.night0, 0)]]);
        ctx.beginPath(); ctx.moveTo(fx - 6, fy); ctx.lineTo(fx + Math.cos(q - .05) * 1200, fy + Math.sin(q - .05) * 1200); ctx.lineTo(fx + Math.cos(q + .05) * 1200, fy + Math.sin(q + .05) * 1200); ctx.lineTo(fx + 6, fy); ctx.closePath(); ctx.fill(); }
      ctx.restore();
    }
    // the rim of light on the hilltop (backlight)
    ctx.save(); ctx.strokeStyle = rgba(GOLD.line, .55 * rise); ctx.lineWidth = 2.2; ctx.shadowColor = rgba(GOLD.halo, .8); ctx.shadowBlur = 12;
    ctx.beginPath(); for (let x = SUN.x - SUN.r * 1.25; x <= SUN.x + SUN.r * 1.25; x += 20) { const y = hillY(x) + 1; x === SUN.x - SUN.r * 1.25 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
    if (st.you !== false) you = drawYou(ctx, t, st.you ?? {});
    if (st.fg) st.fg(ctx);
  });
  const toS = (pt) => { if (!pt) return null; const p = E.project(c, Z_HILL, pt[0], pt[1]); return p ? [p[0], p[1]] : null; };
  const out = { sphere, you: you && { head: toS(you.head), hand: toS(you.hand), axe: toS(you.axe), chest: toS(you.chest), foot: toS(you.foot) } };
  // THE GAP on the sky: from above your head to the sphere's left rim
  if (st.gap && (st.gap.u ?? 0) > 0 && out.you?.head && sphere) {
    const y = Math.max(130, Math.min(out.you.head[1] - 120, sphere[1] - sphere[2] - 70)), x0 = out.you.head[0] + 10, x1 = Math.max(x0 + 60, sphere[0] + sphere[2] * .2);
    F.gapBracket(ctx, t, x0, x1, y, st.gap.u, { label: st.gap.label ?? F.SOURCES.gap, size: 34, tick: 22, w: 3 });
  }
  return out;
}
function drawYou(ctx, t, y) {
  const a = y.a ?? 1; if (a <= 0) return null;
  const x = y.x ?? HILL.you, base = hillY(x), h = y.h ?? 175, arm = clamp(y.arm ?? 1), hold = y.hold ?? 'axe';
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, x, base - h * .55, h * 1.1, .18, GOLD.halo, GOLD.hot);   // the sphere behind you: a rim of light round the figure
  const armR = [lerp(.25, 2.75, arm), lerp(.1, 3.0, arm)], armL = hold === 'phone' || hold === 'both' ? [-.6, -1.5] : [-.18, -.06];
  const hands = E.du(ctx, x, base, h, { view: 'back', back: .9, light: -.4, look: .35 * arm, dir: 1, armR, armL, rim: mixHex(GOLD.line, P.core1, .4) });
  let axe = null;
  if ((hold === 'axe' || hold === 'both') && hands?.R) { const s = h * .2; axe = [hands.R[0] + s * .05, hands.R[1] - s * .38];
    F.handAxe(ctx, axe[0], axe[1], s, .35 * arm, { light: -1, glow: .4 * arm }); }
  if ((hold === 'phone' || hold === 'both') && hands?.L) F.phone(ctx, t, hands.L[0] - 2, hands.L[1] - h * .06, h * .16, { on: y.phoneOn ?? 1, rot: -.2, glow: .8 });
  const chest = [x, base - h * .66];
  if (y.ring) F.ringClock(ctx, t, chest[0], chest[1], h * .2, { dashed: y.ring.dashed ?? 1, fill: y.ring.fill ?? 0, a: y.ring.a ?? 1, glow: y.ring.glow ?? .4, spin: y.ring.spin });
  ctx.restore();
  return { head: [x, base - h * .88], hand: hands?.R, axe, chest, foot: [x, base] };
}

// ------------------------------------------------------------------------------------------------ THE GAUGES, big (the HUD scaled up)
// Same geometry as F.HUD (flint · cog · ring · THE GAP · counter), centred on (cx, cy), scaled k (2.4 ≈ full width). State from
// F.clockState(T, t) unless o.state. o.labels 0..1 (BRAIN · RULES · YOU · AI under the gauges), o.a, o.only [names] to draw a subset.
export const HUD_C = [430, 112];
export function clocksBig(ctx, t, T, cx, cy, k, o = {}) {
  const s = o.state ?? F.clockState(T, t), a = o.a ?? 1; if (a <= 0) return;
  const gw = lerp(HUD.gapW[1], HUD.gapW[0], (s.gap - .45) / .55), cxC = HUD.gap0 + gw + 18 + HUD.counter[2] / 2, on = (n) => !o.only || o.only.includes(n);
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.scale(k, k); ctx.translate(-HUD_C[0], -HUD_C[1]);
  if (on('flint')) F.flintClock(ctx, t, HUD.flint[0], HUD.flint[1], HUD.flint[2], { next: s.flintNext });
  if (on('cog')) F.cogClock(ctx, t, HUD.cog[0], HUD.cog[1], HUD.cog[2], { notch: s.rules.notch, dashed: s.rules.dashed, glow: .3 });
  if (on('ring')) F.ringClock(ctx, t, HUD.ring[0], HUD.ring[1], HUD.ring[2], { dashed: s.you.dashed, fill: s.you.fill, spin: s.you.spin, glow: .3 + s.you.fill });
  if (on('gap')) F.gapBracket(ctx, t, HUD.gap0, HUD.gap0 + gw, HUD.y - 6, 1, { size: 12, tick: 10, w: 1.2 });
  if (on('counter')) F.counterClock(ctx, t, cxC, HUD.counter[1], HUD.counter[2], { glow: .8 });
  const lu = o.labels ?? 1;
  if (lu > 0) [['BRAIN', HUD.flint[0]], ['RULES', HUD.cog[0]], ['YOU', HUD.ring[0]], ['AI', cxC]].forEach(([l, x], i) =>
    F.goldText(ctx, [[l, i === 3 ? .8 : 0]], x, HUD.label + 8, 10, F.rise(span(lu, i * .08, .7 + i * .08)), { serif: false, weight: 600, spacing: .12, align: 'center', col: i === 2 ? COAT.lit : P.cream }));
  ctx.restore();
}
// screen position of one big gauge (for flights between big and HUD)
export const bigPos = (name, cx, cy, k, s) => {
  const gw = s ? lerp(HUD.gapW[1], HUD.gapW[0], (s.gap - .45) / .55) : HUD.gapW[0];
  const p = name === 'counter' ? [HUD.gap0 + gw + 18 + HUD.counter[2] / 2, HUD.counter[1]] : name === 'gap' ? [HUD.gap0 + gw / 2, HUD.y] : HUD[name];
  return [cx + (p[0] - HUD_C[0]) * k, cy + (p[1] - HUD_C[1]) * k];
};

// ------------------------------------------------------------------------------------------------ the seam plates
//   Lead → B1 at T.G('To see what it is') (c01 → c02): plateSofa   THE EVENING on THE WALL: you on the sofa, the phone in your hand lit
//            (the headline on it, calm), the dashed breath ring on your chest; the HUD (all four gauges + THE GAP) top left, its labels
//            still on. View { x 960, y 1950, s creep }. B1 pushes into the phone ("go back to that headline").
//   B1 → B2  at T.G('This channel exists') (c05 → c06): plateClocks   THE GAUGES big on the wall (clocksBig, k 2.4 × creep, centre 960/560):
//            the cog SET (solid, one notch on), the ring still dashed, THE GAP full, the counter racing; HUD hidden (the gauges ARE the HUD).
//            No text but the four labels. B2 opens the subscribe beat (M.01) out of it.
//   B2 → B3  at T.G('Then you notice more') (c09 → c10): plateRace   the same big gauges: the ring spinning fast (you got faster), the cog
//            standing, THE GAP still wide. B3 lets the counter run away ("the race runs on") and then sets both clocks.
export const SOFA_VIEW = { x: 960, y: 1950, s: 1 };
export const SOFA_AT = { x: 960, y: 2350, s: 1 };    // sofa(ctx, t, x, floor y, scale) on the wall
export function sofaScene(ctx, t, o = {}) {
  return X.sofa(ctx, t, SOFA_AT.x, SOFA_AT.y, SOFA_AT.s, { look: .8, table: true, phone: { on: 1, draw: (c2, r) => F.headline(c2, t, r.x + r.w * .1, r.y + r.h * .16, r.w * .8, { u: 1, big: 1, bad: 1, a: o.headA ?? .85 }) },
    ring: o.ring ?? { dashed: 1, a: 1 }, ...o });
}
export function plateSofa(ctx, t, T) {
  const k = creep(t, T, 'To see what it is'), v = { ...SOFA_VIEW, s: k };
  X.wall(ctx, t, v, { lx: 1000, ly: 2000 });
  X.inView(ctx, v, () => sofaScene(ctx, t));
  F.clocksHud(ctx, t, T);
}
function plateGauges(ctx, t, T, phrase, nth = 0) {
  const k = creep(t, T, phrase, nth), v = { x: 960, y: 560, s: k };
  X.wall(ctx, t, v, { lx: 960, ly: 560 });
  X.inView(ctx, v, () => clocksBig(ctx, t, T, 960, 560, 2.4, { labels: 1 }));
}
export const plateClocks = (ctx, t, T) => plateGauges(ctx, t, T, 'This channel exists', 0);
export const plateRace = (ctx, t, T) => plateGauges(ctx, t, T, 'Then you notice more', 0);

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// Thumbnail A again, calm: the sphere fully risen, you on the hill with the hand axe raised AND the phone in the other hand, the breath
// ring on (solid: you set your clock), THE GAP small (≈ 45 %). Lower half calm for the two YouTube tiles + the subscribe circle.
export const END_TILES = { left: { x: 80, y: 600, w: 640, h: 360 }, right: { x: 1200, y: 600, w: 640, h: 360 }, sub: { x: 960, y: 900, r: 80 } };
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, q = Math.max(0, t - t0);
  const c = E.cam3({ x: 0, y: 30 - q * 1.2, z: 380 - q * 12 });
  sunrise(ctx, c, t, { rise: 1, rays: .9, you: { hold: 'both', arm: 1, ring: { dashed: 0, fill: .5 + .5 * Math.sin(t * .9), a: 1, glow: .5 } } });
}
