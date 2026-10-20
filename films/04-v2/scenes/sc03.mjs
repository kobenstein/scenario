// Chunk c03 · Film 4 minute 1 in the Film 5 machinery · shots 3.01–3.04 (bild/shots.md) · "But that's not" → 01b
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (gate 1). One continuous night landscape (lib/sc03_world.mjs), one camera: the four shots are one plan sequence, cut on the words.
//  shot │ words (accent)                                        │ hero onset                                       │ carrier → next              │ tr in
//  3.01 │ But that's not the **hard part**.                      │ the camera lands at the foot of c02's staircase   │ the newest light leaves the  │ down (from c02's tilt)
//       │                                                        │ (tilt continues down): the works hall, amber      │ outlet → the camera follows  │
//       │                                                        │ windows, share lights born at the outlet          │ it right                     │
//  3.02 │ The hard part is whether what it **earns** **reaches   │ truck right with the light along the aqueduct     │ the gap                      │ take (same world)
//       │ you**.                                                 │ (wide night land); on "reaches you" the aqueduct  │                              │
//       │                                                        │ breaks off: the light falls into the gap (dotted) │                              │
//  3.03 │ That's the biggest **"if"** in this film.              │ the fallen dots wind up into a dotted ring over   │ the seal's ring              │ take
//       │                                                        │ the gap, on "if" the engraved IF seal settles;    │                              │
//       │                                                        │ slow push                                         │                              │
//  3.04 │ For the next few minutes, let's **say** it **does**.   │ the seal's ring unwinds into a dotted bridge,     │ the warm window (c04 irises  │ take
//       │                                                        │ the burin engraves it solid on "does"; the next   │ out of it at screen centre)  │
//       │                                                        │ light crosses, the window warms, push to window   │                              │
// ★ none in c03 (the ★ of the minute are 1.03 and 4.04). Hard accents: "if" (seal) and "does" (bridge solid) = 2.
// Boundaries: in = tr 'down' (c02 tilts up the stairs; we arrive at their foot, the tilt continues down inside the shot).
//             out = c04 enters with tr 'iris' into the window light; from ~57.5 s the window sits at screen (960, 540), warm.
// Sound (accents in speech pauses): whoosh_airy as the camera sets off (pause after "part."), drop as the light falls (pause after
//   "you."), shimmer_rings as the seal settles, foil_glint in the pause after "film.", pencil under the burin, bloom when the window warms.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, text, addGlow } from '../engine.mjs';
import { ring, unwind, resample } from '../lib/certificate.mjs';
import { ghostLine, ghostPaths, smokeDots } from '../lib/ghost.mjs';
import { shareLight } from '../lib/share.mjs';
import { GEO, AMBER, CORE, CREAM, worldLayers, drawWorld, drawValleyFog, drawLive, drawWindow, camT, toScreen, bridgeLines, bridgeFill, BRIDGE, ifSeal } from '../lib/sc03_world.mjs';

const TAU = Math.PI * 2;
const eo5 = (x) => 1 - Math.pow(1 - clamp(x), 5);
const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
const lerpCam = (A, B, k) => ({ cx: mix(A.cx, B.cx, k), cy: mix(A.cy, B.cy, k), s: Math.exp(mix(Math.log(A.s), Math.log(B.s), k)) });

export default (T, R) => {
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const word = (ph) => { const ws = T.W('01a', ph.split(' ')[0], null).filter((w) => w.s >= S(ph) - 1e-3); return ws[ph.split(' ').length - 1]; };
  const A = {
    s301: R.first, hard: S('hard part'), partE: E('hard part'),
    s302: S('The hard part is'), earns: S('earns'), reaches: S('reaches you'), you: word('reaches you').s, youE: E('reaches you'),
    s303: S("That's the biggest"), biggest: S('biggest'), iff: word('biggest if').s, iffE: word('biggest if').e, filmE: E('this film'),
    s304: S('For the next'), say: S('say it'), does: word('it does').s, doesE: E('it does'), end: R.b,
  };

  // ---------------- the lights: born at the outlet every P s, constant flow along the channel ----------------
  const V = 760, P = .455, X0 = GEO.outlet.x, AQ1 = GEO.aq.x1, HX = GEO.house.x0;
  const tFallHero = A.you + .05;                                   // the followed light reaches the broken end on "you"
  const tSolid = A.does + .02;                                     // the bridge is solid
  const te = (k) => tFallHero + k * P;                              // light k reaches the end of the aqueduct
  const tb = (k) => te(k) - (AQ1 - X0) / V;                         // light k is born at the outlet
  const kCross = Math.ceil((tSolid - tFallHero) / P);               // first light that crosses the bridge
  const tArrive = te(kCross) + (HX - AQ1) / V;                      // ... and reaches the house
  const heroX = (t) => AQ1 - V * (tFallHero - t);
  const chanY = (x) => (x <= AQ1 ? GEO.top(x) : BRIDGE.deck) - 5;

  function lightsAt(t) {
    const out = [], k0 = Math.floor((t - 3.2 - tFallHero) / P) - 1, k1 = Math.ceil((t - tb(0)) / P) + 1;
    for (let k = k0; k <= k1; k++) {
      const tk = tb(k); if (t < tk) continue;
      const x = X0 + V * (t - tk);
      if (x <= AQ1) { out.push({ k, x, y: chanY(x), born: tk, state: 'run' }); continue; }
      if (te(k) < tSolid) {   // falls into the gap
        const d = t - te(k); if (d > 1.25) continue;
        const fx = (dd) => AQ1 + V * (1 - Math.exp(-2.4 * dd)) / 2.4, fy = (dd) => chanY(AQ1) - 26 * Math.sin(Math.min(dd, .25) / .25 * Math.PI / 2) * (1 - dd * 2) + .5 * 1350 * dd * dd;
        out.push({ k, x: fx(d), y: fy(d), d, fx, fy, state: 'fall' });
      } else if (x < HX + 10) out.push({ k, x, y: chanY(x), state: 'bridge' });
    }
    return out;
  }
  function drawLights(ctx, t, s) {
    for (const L of lightsAt(t)) {
      if (L.state === 'fall') {
        // the light dissolves into dots as it falls: a dotted trail along its arc, the light shrinks and thins out
        const r = prng(L.k * 7 + 3);
        for (let i = 1; i <= 22; i++) { const dd = L.d - i * .035; if (dd < 0) break; const a = (1 - i / 23) * clamp(1.15 - L.d / 1.25); ctx.fillStyle = rgba(i < 4 ? CORE : AMBER, a); const z = (4.2 - i * .12); ctx.beginPath(); ctx.arc(L.fx(dd) + (r() - .5) * 4 * dd, L.fy(dd), Math.max(.6, z), 0, TAU); ctx.fill(); }
        const k = clamp(1 - L.d / .9); if (k > 0) shareLight(ctx, L.x, L.y, 15 * mix(.35, 1, k), t, { a: k * .95 });
        continue;
      }
      // a short warm wake in the channel behind the light (it flows)
      const age = t - (L.born ?? -9), wl = Math.min(110, Math.max(0, age * V * .9));
      if (wl > 4) { const g = ctx.createLinearGradient(L.x - wl, 0, L.x, 0); g.addColorStop(0, rgba(AMBER, 0)); g.addColorStop(1, rgba(AMBER, .55)); ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(L.x - wl, chanY(L.x - wl) + 1); ctx.lineTo(L.x, L.y + 1); ctx.stroke(); }
      addGlow(ctx, L.x, L.y + 40, 170, .1, AMBER, CORE);   // its light on the stone and in the mist below
      shareLight(ctx, L.x, L.y, 15, t, { born: L.born, pulse: .6 });
    }
  }

  // ---------------- camera ----------------
  // 3.01: the camera comes down c02's staircase (its upper steps sit at the top left as the 'down' slide brings this shot in) and lands
  // at the foot, facing the hall; then a slow drift right
  const c1 = (t) => { const u = qio(lin(A.s301 - .5, A.s301 + 1.45, t)), v = lin(A.s301 + 1.45, A.s302 + .5, t);
    return { cx: mix(2150, 830, u) + 60 * v, cy: mix(150, 525, u), s: mix(.86, .93, u) - .02 * v }; };
  const c2 = (t) => { const x = heroX(t); return { cx: x + 160, cy: chanY(x) + 190, s: .92 }; };
  const GAP = { cx: 4360, cy: 590, s: .98 };
  const c3 = (t) => { const u = sm(lin(A.s303 - .15, A.s304 + .1, t)), v = lin(A.s304 + .1, A.doesE + .2, t); return { cx: mix(GAP.cx, 4340, u), cy: mix(GAP.cy, 560, u) + 10 * v, s: GAP.s * Math.exp(Math.log(1.2 / GAP.s) * u + .035 * v) }; };
  const WIN = { cx: GEO.win.x, cy: GEO.win.y, s: 2.7 };
  const tPush0 = Math.max(A.doesE + .05, tArrive - .25), tPush1 = Math.min(A.end - .25, tPush0 + 1.3);
  const cam = (t) => {
    let c = lerpCam(c1(t), c2(t), qio(lin(A.s302 - .2, A.s302 + 1.0, t)));
    c = lerpCam(c, c3(t), qio(lin(A.reaches + .1, A.youE + .2, t)));
    c = lerpCam(c, WIN, qio(lin(tPush0, tPush1, t)));
    return { cx: c.cx + drift(t, 6, 1) / c.s, cy: c.cy + drift(t, 4, 2) / c.s, s: c.s };
  };

  // ---------------- the seal and the bridge ----------------
  const SEAL = { x: (AQ1 + GEO.gap.x1) / 2, y: 470, r: 150 }, SR = 210;   // seal raster radius SR, drawn scaled to r
  const ringPts = (() => { const out = []; for (let i = 0; i <= 360; i++) { const a = Math.PI / 2 + i / 360 * TAU, q = SEAL.r * 1.03 * (1 + .035 * Math.cos(36 * a)); out.push([SEAL.x + Math.cos(a) * q, SEAL.y + Math.sin(a) * q]); } return out; })();
  const tRing0 = A.biggest - .1, tRing1 = A.iff + .02, tLand = A.iff;
  const tUnw0 = A.s304 + .05, tUnw1 = A.s304 + 1.05;
  const tBur0 = Math.min(A.say - .35, tSolid - 1.0), tBur1 = tSolid;
  const B = bridgeLines();
  const archFrom = (u) => unwind(ringPts, B.ring, u, { n: 420, sweep: .5 });

  function drawSeal(ctx, t) {
    if (t < tRing0 || t > tUnw1 + .3) return;
    // 1) the fallen dots wind up into a dotted ring around the gap
    const ru = eio(lin(tRing0, tRing1, t)), land = eo5(lin(tLand, tLand + .6, t)), fade = 1 - sm(lin(tUnw0 + .05, tUnw0 + .45, t));
    if (t < tUnw0 && ru < 1) ghostLine(ctx, ringPts, { u: ru, col: '#ffd9a0', w: 2.2, dot: 8, a: .95, t });
    // 2) the seal settles on "if"
    if (t >= tLand && fade > 0) {
      const sc = SEAL.r / SR * mix(1.16, 1, land), bob = Math.sin(t * 1.3) * 3, rot = -.06 + .02 * Math.sin(t * .7);
      ctx.save(); ctx.globalAlpha = clamp((t - tLand) / .22) * fade; ctx.translate(SEAL.x, SEAL.y + bob); ctx.scale(sc, sc);
      addGlow(ctx, 0, 0, SR * 1.9, .22, AMBER, CORE);
      ifSeal(ctx, 0, 0, SR, t, { rot, glint: t > tLand ? lin(tLand + .1, tLand + 1.2, t) : null });
      ctx.restore();
      // a guilloche ring runs out once as it settles
      const age = t - tLand; if (age < 1.6) ring(ctx, SEAL.x, SEAL.y, SEAL.r * (1.05 + age * .55), SEAL.r * (1.05 + age * .55), { lines: 5, band: 12, wave: 26, a: .7 * (1 - age / 1.6), col: '#ffe2a8', glowA: .08, lw: 1 });
    }
    // 3) "For the next few minutes": the seal's edge unwinds into the dotted bridge arch
    if (t >= tUnw0) {
      const u = eio(lin(tUnw0, tUnw1, t));
      if (u < 1) ghostLine(ctx, archFrom(u), { col: '#ffd9a0', w: 2.2, dot: 8, a: .95, t });
    }
  }
  function drawBridge(ctx, t) {
    if (t < tUnw1 - .25) return;
    const show = lin(tUnw1 - .25, tUnw1 + .35, t), bur = t < tBur0 ? null : clamp((t - tBur0) / (tBur1 - tBur0)), solidA = sm(lin(tBur1 - .3, tBur1 + .35, t));
    bridgeFill(ctx, solidA);
    const lines = [B.ring, B.deck, B.deckB, B.arch, ...B.spand, ...B.vous];
    const settle = sm(lin(tBur1 + .1, tBur1 + .9, t));   // once solid, the bright engraving settles into dark ink cut into the stone
    const o = { col: '#ffd9a0', w: 2, dot: 8, a: .95 * Math.max(show, 0) * (1 - settle), t, glow: AMBER, tips: 2, stagger: .55, tipSize: 18 };
    if (bur == null) ghostPaths(ctx, lines, { ...o, u: 1 });
    else if (settle < 1) ghostPaths(ctx, lines, { ...o, burin: bur });
    if (settle > 0) ghostPaths(ctx, lines, { ...o, col: '#0b0d26', glow: null, w: 1.3, a: .75 * settle, ghost: 0 });
    if (bur >= 1) { const f = Math.exp(-Math.pow((t - tBur1 - .15) / .25, 2)); if (f > .01) for (const [x, y] of [[BRIDGE.x0 + 60, BRIDGE.deck], [(BRIDGE.x0 + BRIDGE.x1) / 2, BRIDGE.deck + 30], [BRIDGE.x1 - 60, BRIDGE.deck]]) addGlow(ctx, x, y, 160, .35 * f, AMBER, CORE); }
  }

  // ---------------- one frame of the plan sequence ----------------
  function frame(ctx, t) {
    const c = cam(t);
    drawWorld(ctx, c, t);
    ctx.save(); camT(ctx, c);
    drawLive(ctx, t, c);
    const warm = eout(lin(tArrive, tArrive + .7, t));
    drawWindow(ctx, t, warm);
    if (warm > 0 && t - tArrive < 1) addGlow(ctx, HX, chanY(HX), 120 * (1 - (t - tArrive)), .5 * (1 - (t - tArrive)), AMBER, CORE);
    drawBridge(ctx, t);
    drawLights(ctx, t, c.s);
    ctx.restore();
    drawValleyFog(ctx, c, t);
    ctx.save(); camT(ctx, c); drawSeal(ctx, t); ctx.restore();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
  const draw = (ctx, t) => frame(ctx, t);

  return [
    { t: A.s301, tr: 'down', d: .8, draw, print: { riso: .3 },
      sound: [{ f: 'whoosh_airy', t: A.partE + .02, v: .35 }] },
    { t: A.s302, tr: 'cut', d: .04, draw, print: { riso: .3 },
      sound: [{ f: 'drop', t: A.youE + .03, v: .45 }] },
    { t: A.s303, tr: 'cut', d: .04, draw, print: { riso: .25 },
      sound: [{ f: 'shimmer_rings', t: A.iff - .05, v: .3 }, { f: 'foil_glint', t: A.filmE + .05, v: .35 }] },
    { t: A.s304, tr: 'cut', d: .04, draw, print: { riso: .25 },
      sound: [{ f: 'pencil', t: tBur0 + .05, v: .25 }, { f: 'bloom', t: Math.max(A.doesE + .02, tArrive - .1), v: .45 }] },
  ];
};
