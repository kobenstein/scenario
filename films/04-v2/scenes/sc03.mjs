// Chunk c03 · Film 4 minute 1 in the Film 5 machinery · shots 3.01–3.04 (bild/shots.md) · "But that's not" → 01b
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
// PLAN (minute fix, no blends). One continuous night landscape (lib/sc03_world.mjs), one camera, one draw function: the four shots are
// one plan sequence; the entries only split it for print and sound, so the cuts at 46.52, 50.28 and 53.16 sit inside one picture.
//  shot │ words (accent)                                        │ image                                             │ flows on
//  3.01 │ But that's not the **hard part**.                      │ out of c02's light (the bridge b23, full frame):  │ continuous: the truck
//       │                                                        │ the camera pulls back, the light shrinks into the │ right picks up a share
//       │                                                        │ white-hot door of the works hall, the hall grows  │ light at the outlet
//       │                                                        │ around it (stairs left, lights leave the outlet)  │
//  3.02 │ The hard part is whether what it **earns** **reaches   │ truck right with one light along the aqueduct     │ the gap
//       │ you**.                                                 │ (night land); on "reaches you" the aqueduct      │
//       │                                                        │ breaks off: the light falls into the gap (dots)   │
//  3.03 │ That's the biggest **"if"** in this film.              │ the fallen dots wind up into a dotted ring over   │ the seal's rim
//       │                                                        │ the gap; the burin engraves the IF seal round,    │
//       │                                                        │ finished on "if" (c02's language, 2.05)           │
//  3.04 │ For the next few minutes, let's **say** it **does**.   │ the seal unravels: its rim opens and swings down  │ the window light =
//       │                                                        │ into the dotted arch of a bridge; the deck draws  │ the bridge b34 (cream,
//       │                                                        │ on; the burin engraves it solid left to right on  │ full frame) at 56.95;
//       │                                                        │ "does"; the next light crosses, your window       │ c04 makes it plate I's
//       │                                                        │ lights up and the camera flies into its light     │ paper
// ★ none in c03 (the ★ of the minute are 1.03 and 4.04). Hard accents: "if" (seal) and "does" (bridge solid) = 2.
// Boundaries (lib/m1x_bridge.mjs): in = b23 from the cut to B23.b, then the in-world light (same lightAt, same tone and seed) at the
//   hall's door shrinks with the pull-back; out = the window's lightAt (tone cream, seed 34) grows with the push-in until it is exactly
//   b34 at B34.a (same position, size, zero velocity); the last entry draws b34 until c04 takes over at B34.cut.
// Sound (accents in speech pauses): whoosh_airy as the camera sets off (pause after "part."), drop as the light falls (pause after
//   "you."), shimmer_rings as the seal is finished, foil_glint in the pause after "film.", pencil under the burin, bloom when the window lights.
// ─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
import { W, H, rgba, clamp, lin, mix, sm, eio, eout, prng, drift, addGlow } from '../engine.mjs';
import { ring } from '../lib/certificate.mjs';
import { ghostLine, burinTip } from '../lib/ghost.mjs';
import { shareLight } from '../lib/share.mjs';
import { bridgeWin, lightAt, R_FULL, B23, B34, b23, b34 } from '../lib/m1x_bridge.mjs';
import { GEO, AMBER, CORE, warmWorld, drawWorld, drawValleyFog, drawLive, drawWindow, DOORL, doorPath, doorFrame, camT, toScreen, bridgeLines, bridgeFill, BRIDGE, ifSeal } from '../lib/sc03_world.mjs';

const TAU = Math.PI * 2;
const qio = (x) => { x = clamp(x); return x < .5 ? 8 * x ** 4 : 1 - Math.pow(-2 * x + 2, 4) / 2; };
const ss = (a, b, t) => sm(lin(a, b, t));                       // clamped smoothstep between two times
const lerpCam = (A, B, k) => ({ cx: mix(A.cx, B.cx, k), cy: mix(A.cy, B.cy, k), s: Math.exp(mix(Math.log(A.s), Math.log(B.s), k)) });

// arc-length helpers for the hand-made dotted lines (the dots keep their place on the line through every phase: no jump)
function cumLen(P) { const d = [0]; for (let i = 1; i < P.length; i++) d.push(d[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return d; }
function pointAt(P, d, s) {
  let lo = 0, hi = d.length - 1; if (s <= 0) return [P[0][0], P[0][1], Math.atan2(P[1][1] - P[0][1], P[1][0] - P[0][0])];
  if (s >= d[hi]) return [P[hi][0], P[hi][1], Math.atan2(P[hi][1] - P[hi - 1][1], P[hi][0] - P[hi - 1][0])];
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (d[m] < s) lo = m; else hi = m; }
  const q = (s - d[lo]) / ((d[hi] - d[lo]) || 1); return [mix(P[lo][0], P[hi][0], q), mix(P[lo][1], P[hi][1], q), Math.atan2(P[hi][1] - P[lo][1], P[hi][0] - P[lo][0])];
}
const DOT = 8, DR = 1.4;   // dot pitch and dot radius of every ghost line in c03 (world units)
function dots(ctx, pts, s0, s1, o) {   // the ghost dots of one line between arc lengths s0..s1 (dot k sits at k·DOT, always)
  const d = o.d || cumLen(pts); if (s1 <= s0) return;
  ctx.fillStyle = rgba(o.col || '#ffd9a0', (o.a ?? 1) * .85); const rad = DR;
  ctx.beginPath();
  for (let k = Math.ceil(s0 / DOT); k * DOT <= s1; k++) { const [x, y] = pointAt(pts, d, k * DOT); ctx.moveTo(x + rad, y); ctx.arc(x, y, rad, 0, TAU); }
  ctx.fill();
}

export default async (T, R) => {
  await warmWorld([210]);
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const word = (ph) => { const ws = T.W('01a', ph.split(' ')[0], null).filter((w) => w.s >= S(ph) - 1e-3); return ws[ph.split(' ').length - 1]; };
  const B23w = bridgeWin('c02>c03', T), B34w = bridgeWin('c03>c04', T);
  const A = {
    s301: B23w.cut, hard: S('hard part'), partE: E('hard part'),
    s302: S('The hard part is'), earns: S('earns'), reaches: S('reaches you'), you: word('reaches you').s, youE: E('reaches you'),
    s303: S("That's the biggest"), biggest: S('biggest'), iff: word('biggest if').s, iffE: word('biggest if').e, filmE: E('this film'),
    s304: S('For the next'), say: S('say it'), does: word('it does').s, doesE: E('it does'), end: B34w.a,
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
  function drawLights(ctx, t) {
    for (const L of lightsAt(t)) {
      if (L.state === 'fall') {
        // the light dissolves into dots as it falls: a dotted trail along its arc, the light shrinks and goes out in the mist
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

  // ---------------- 3.01: out of the light (b23) — it is the light in the works hall's open door ----------------
  // At B23.b the camera is so close to the door (scale 13) that its opening fills the frame and the light in it (lightAt, tone lamp,
  // seed 23, at the frame centre, radius R_FULL) is exactly b23. One dolly back, eased from rest: a zoom about a fixed point Q, so the
  // light leaves the frame centre without a jump and the hall lands where 3.01 frames it. The light's core is clipped to the opening
  // (the facade hides the source), its halo lights the facade; its world radius settles from R_FULL/13 to RW1 as the camera leaves,
  // always opaque over every visible point of the opening and always shrinking on screen.
  const tO0 = B23w.b, tO1 = A.s302 + .2;
  const S0 = 13, S1 = .93, C1 = { cx: 880, cy: 528 }, RW0 = R_FULL / S0, RW1 = 180;
  const kq = 1 / S1 - 1 / S0, QV = [(DOORL.x - C1.cx) / kq, (DOORL.y - C1.cy) / kq], Q = [DOORL.x + QV[0] / S0, DOORL.y + QV[1] / S0];
  const pull = (t) => { const s = Math.exp(mix(Math.log(S0), Math.log(S1), ss(tO0, tO1, t))); return { cx: Q[0] - QV[0] / s, cy: Q[1] - QV[1] / s, s }; };
  const doorRW = (s) => RW0 * Math.exp(Math.log(RW1 / RW0) * sm(clamp(Math.log(S0 / s) / 1.1)));
  const doorBloom = (t) => mix(1, .55, ss(tO0 + .3, tO1, t));
  const c1 = (t) => { const p = pull(t), v = ss(tO1, tO1 + 1.2, t) * lin(tO1, tO1 + 1.2, t); return { cx: p.cx + 70 * v, cy: p.cy, s: p.s * (1 - .02 * v) }; };
  const DOOR = GEO.door, DSP = DOOR.top + (DOOR.x1 - DOOR.x0) / 2;
  const inDoor = (x, y) => x >= DOOR.x0 && x <= DOOR.x1 && y <= DOOR.bot && (y >= DSP || Math.hypot(x - (DOOR.x0 + DOOR.x1) / 2, y - DSP) <= (DOOR.x1 - DOOR.x0) / 2);

  // ---------------- 3.02 – 3.04 cameras ----------------
  const c2 = (t) => { const x = heroX(t); return { cx: x + 160, cy: chanY(x) + 190, s: .92 }; };
  const GAP = { cx: 4360, cy: 590, s: .98 };
  const c3 = (t) => { const u = ss(A.s303 - .15, A.s304 + .1, t), v = lin(A.s304 + .1, A.doesE + .2, t); return { cx: mix(GAP.cx, 4340, u), cy: mix(GAP.cy, 560, u) + 10 * v, s: GAP.s * Math.exp(Math.log(1.2 / GAP.s) * u + .035 * v) }; };
  // the push into your window ends at rest exactly in b34 at B34.a: window centre at the frame centre, its light R_FULL wide
  const WINp = GEO.win, SE = 4, WIN = { cx: WINp.x, cy: WINp.y, s: SE };
  const tP1 = A.end, tP0 = tP1 - 1.45, tLit = Math.min(tArrive, tP1 - .6);
  const pushK = (t) => qio(lin(tP0, tP1, t));
  const winR = (t) => (R_FULL / SE) * (.08 * eout(lin(tLit, tLit + .35, t)) + .92 * ss(tLit + .1, tP1, t));   // the window light's world radius
  const cam = (t) => {
    let c = lerpCam(c1(t), c2(t), qio(lin(A.s302 - .3, A.s302 + 1.0, t)));
    c = lerpCam(c, c3(t), qio(lin(A.reaches + .1, A.youE + .2, t)));
    c = lerpCam(c, WIN, pushK(t));
    const kd = ss(tO0, tO0 + .9, t) * (1 - pushK(t));   // the hand-held drift fades in out of b23 and out into b34
    return { cx: c.cx + kd * drift(t, 6, 1) / c.s, cy: c.cy + kd * drift(t, 4, 2) / c.s, s: c.s };
  };

  // ---------------- 3.03: the seal ----------------
  const SEAL = { x: (AQ1 + GEO.gap.x1) / 2, y: 470, r: 150 }, SR = 210;
  const rimR = (a) => SEAL.r * 1.03 * (1 + .035 * Math.cos(36 * a));
  const rimAt = (f) => { const a = Math.PI / 2 + f * TAU, q = rimR(a); return [Math.cos(a) * q, Math.sin(a) * q]; };   // f 0 = bottom, clockwise
  const RIM = Array.from({ length: 361 }, (_, i) => rimAt(i / 360));
  const tRing0 = A.biggest - .1, tRing1 = A.iff - .08;            // the fallen dots wind up into the ring (from the bottom, clockwise)
  const tEng0 = A.biggest + .2, tEng1 = A.iff + .38;               // the burin engraves the seal round behind them, finished on "if"
  const tUnw0 = A.s304 + .05, tUnw1 = A.s304 + 1.2;               // 3.04: the seal unravels into the arch of the bridge
  const sealPose = (t) => ({ x: SEAL.x, y: SEAL.y + Math.sin(t * 1.3) * 3, rot: -.06 + .02 * Math.sin(t * .7) });
  const toWorld = (M, p) => { const c = Math.cos(M.rot), s = Math.sin(M.rot); return [M.x + p[0] * c - p[1] * s, M.y + p[0] * s + p[1] * c]; };

  // the bridge's lines (world), all oriented left → right; the arch's extrados (ring) is where the seal's rim lands
  const BL = bridgeLines(), NR = BL.ring.length - 1, MID = NR / 2;
  const ringD = cumLen(BL.ring);
  // the rim → arch morph: the rim is cut at its top; its left half (bottom → left → top) swings down onto the arch from the crown to the
  // left spring, its right half onto the crown → right spring. Points near the bottom (already at the crown) move first.
  const SW = .7;
  const archIdx = (f) => (f <= .5 ? MID - 2 * MID * f : MID + 2 * MID * (1 - f));
  const archPt = (i) => { const i0 = Math.max(0, Math.min(NR - 1, Math.floor(i))), q = i - i0; return [mix(BL.ring[i0][0], BL.ring[i0 + 1][0], q), mix(BL.ring[i0][1], BL.ring[i0 + 1][1], q)]; };
  const morphQ = (f, p) => eio(clamp(p * (1 + SW) - (Math.min(f, 1 - f) * 2) * SW));
  // f on the rim for a given arc length s along BL.ring (so every dot of the finished arch has its own fixed origin on the rim)
  const fOfS = (s) => { let lo = 0, hi = NR; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ringD[m] < s) lo = m; else hi = m; } const i = lo + (s - ringD[lo]) / ((ringD[hi] - ringD[lo]) || 1); return i <= MID ? (MID - i) / (2 * MID) : 1 - (i - MID) / (2 * MID); };
  const RINGDOTS = []; for (let k = 0; k * DOT <= ringD[NR]; k++) RINGDOTS.push(fOfS(k * DOT));

  function drawSeal(ctx, t) {
    if (t < tRing0 || t >= tUnw1) return;   // from tUnw1 on the rim's dots are the bridge's ring (drawBridge), at the same places
    const M = sealPose(t), ru = eio(lin(tRing0, tRing1, t)), eng = eio(lin(tEng0, tEng1, t)), p = lin(tUnw0, tUnw1, t);
    // the seal body: engraved round behind the burin (sector from the bottom), later unravelled from below (a cap above a rising chord)
    const chord = p <= 0 ? null : Math.cos(Math.PI * Math.min(1, p * (1 + SW) / SW));   // y of the chord (in units of r) where the rim has left
    if (eng > 0 && (chord == null || chord > -1)) {
      ctx.save(); ctx.translate(M.x, M.y); ctx.rotate(M.rot);
      addGlow(ctx, 0, 0, SEAL.r * 2.6, .2 * eng * (chord == null ? 1 : (1 + chord) / 2), AMBER, CORE);
      const sc = SEAL.r / SR; ctx.scale(sc, sc);
      const clip = (g, r) => {
        const R2 = r * 1.2; g.beginPath();
        if (chord != null) g.rect(-R2, -R2, 2 * R2, R2 + chord * r);   // the cap above the chord (y grows downward)
        else if (eng < 1) { g.moveTo(0, 0); g.arc(0, 0, R2, Math.PI / 2, Math.PI / 2 + eng * TAU); g.closePath(); }
        else g.rect(-R2, -R2, 2 * R2, 2 * R2);
      };
      ifSeal(ctx, 0, 0, SR, t, { clip, glint: t > tEng1 - .1 ? lin(tEng1 - .1, tEng1 + 1.1, t) : null });
      ctx.restore();
    }
    // the guilloche ring runs out once as the seal is finished
    const age = t - tEng1; if (age > 0 && age < 1.6) ring(ctx, M.x, M.y, SEAL.r * (1.05 + age * .55), SEAL.r * (1.05 + age * .55), { lines: 5, band: 12, wave: 26, a: .7 * (1 - age / 1.6), col: '#ffe2a8', glowA: .08, lw: 1 });
    // the rim as a dotted ghost line (every dot has one fixed place f on the rim and one on the bridge's ring): drawn on from the
    // bottom (the fallen dots wind up), eaten by the burin (the seal is engraved), then swinging down into the arch
    ctx.save(); ctx.fillStyle = rgba('#ffd9a0', .85); ctx.beginPath();
    for (let k = 0; k < RINGDOTS.length; k++) {
      const f = RINGDOTS[k]; let x, y;
      if (p <= 0) { if (f < eng || f > ru) continue; [x, y] = toWorld(M, rimAt(f)); }
      else { const q = morphQ(f, p), [rx, ry] = toWorld(M, rimAt(f)), [ax, ay] = pointAt(BL.ring, ringD, k * DOT); x = mix(rx, ax, q); y = mix(ry, ay, q); }
      ctx.moveTo(x + DR, y); ctx.arc(x, y, DR, 0, TAU);
    }
    ctx.fill();
    if (p <= 0 && eng > 0 && eng < 1) { const a = Math.PI / 2 + eng * TAU, [x, y] = toWorld(M, rimAt(eng)); burinTip(ctx, x, y, a + Math.PI / 2 + M.rot, t, { size: 14 }); }
    if (p > 0) {
      // foil sparks where the rim leaves the body (along the rising chord)
      const ch = Math.cos(Math.PI * Math.min(1, p * (1 + SW) / SW));
      if (ch > -1) { const r = prng(77 + Math.floor(t * 30)), yc = ch * SEAL.r, hw = Math.sqrt(Math.max(0, SEAL.r * SEAL.r - yc * yc));
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 26; i++) { const xx = (r() * 2 - 1) * hw, [x, y] = toWorld(M, [xx, yc + r() * 6]); ctx.fillStyle = rgba(r() < .6 ? '#ffd9a0' : CORE, .5 + r() * .5); const z = 1 + r() * 1.6; ctx.fillRect(x - z / 2, y + r() * 14, z, z); }
        addGlow(ctx, M.x, M.y + yc, hw * 1.2 + 20, .18, AMBER, CORE); ctx.restore(); }
    }
    ctx.restore();
  }

  // ---------------- 3.04: the bridge — ghost (dots, drawn on left → right) → burin (left → right) → stone ----------------
  const tDraw0 = tUnw0 + .45, tDraw1 = tUnw1 + .15;                 // the deck and the inner lines draw on as dotted ghosts
  const tBur0 = Math.min(A.say - .35, tSolid - 1.0), tBur1 = tSolid;  // the burin runs from the aqueduct's end to the house
  const XB0 = BRIDGE.x0 - 8, XB1 = BRIDGE.x1 + 8;
  const front = (t) => mix(XB0, XB1, eio(lin(tBur0, tBur1, t)));      // the burin front (world x)
  const lines = [
    { P: BL.deck, tip: true }, { P: BL.deckB }, { P: BL.arch }, ...BL.spand.map((P) => ({ P, short: true })), ...BL.vous.map((P) => ({ P, short: true })),
  ].map((L) => ({ ...L, d: cumLen(L.P), x0: Math.min(L.P[0][0], L.P[L.P.length - 1][0]), xm: (L.P[0][0] + L.P[L.P.length - 1][0]) / 2 }));
  const ringLine = { P: BL.ring, d: ringD, tip: true };
  // arc length of a left → right line where it crosses x = X
  const sAtX = (L, X) => { const P = L.P, d = L.d; if (X <= P[0][0]) return 0; if (X >= P[P.length - 1][0]) return d[d.length - 1];
    let lo = 0, hi = P.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P[m][0] < X) lo = m; else hi = m; } return d[lo] + (d[hi] - d[lo]) * (X - P[lo][0]) / ((P[hi][0] - P[lo][0]) || 1); };

  function drawBridge(ctx, t) {
    if (t < tDraw0 - .05 && t < tUnw1) return;
    const X = t < tBur0 ? -1e9 : front(t), done = t >= tBur1, settle = ss(tBur1 + .1, tBur1 + .9, t);
    // the stone appears behind the burin (cut out of the dark as it passes), never faded in
    if (X > XB0) { bridgeFill(ctx, 1, done ? null : X - 4); if (!done) addGlow(ctx, X - 4, (BRIDGE.deck + 800) / 2, 150, .22, AMBER, CORE); }
    const bright = { col: '#ffd9a0', w: 2, a: .95 * (1 - settle), glow: AMBER, ghost: 0 }, ink = { col: '#0b0d26', w: 1.3, a: .75 * settle, ghost: 0 };
    const all = [ringLine, ...lines];
    for (let i = 0; i < all.length; i++) {
      const L = all[i], len = L.d[L.d.length - 1];
      // ghost draw-on (left → right, the short lines once the draw-on front passes them); the ring comes from the seal (drawSeal)
      let u = 1;
      if (L !== ringLine) { const xf = mix(XB0, XB1 + 120, eio(lin(tDraw0, tDraw1, t))); u = L.short ? clamp((xf - L.xm) / 60) : clamp((xf - L.P[0][0]) / (L.P[L.P.length - 1][0] - L.P[0][0])); }
      else if (t < tUnw1) continue;
      if (u <= 0) continue;
      const sSolid = X < XB0 ? 0 : L.short ? (X >= L.xm + 30 ? len : X <= L.xm - 10 ? 0 : len * clamp((X - L.xm + 10) / 40)) : sAtX(L, X);
      if (sSolid > 0) { if (settle < 1) ghostLine(ctx, L.P, { ...bright, u: sSolid / len }); if (settle > 0) ghostLine(ctx, L.P, { ...ink, u: sSolid / len }); }
      if (sSolid < len * u) dots(ctx, L.P, sSolid, len * u, { d: L.d });
      if (L.tip && sSolid > 0 && sSolid < len) { const [x, y, ang] = pointAt(L.P, L.d, sSolid); burinTip(ctx, x, y, ang, t, { size: 18, seed: i + 1 }); }
    }
    // the moment it is solid: a warm flash along the deck
    const f = Math.exp(-Math.pow((t - tBur1 - .15) / .25, 2)); if (f > .01) for (const [x, y] of [[BRIDGE.x0 + 60, BRIDGE.deck], [(BRIDGE.x0 + BRIDGE.x1) / 2, BRIDGE.deck + 30], [BRIDGE.x1 - 60, BRIDGE.deck]]) addGlow(ctx, x, y, 160, .35 * f, AMBER, CORE);
  }

  // ---------------- one frame of the plan sequence ----------------
  const corners = (c) => { const hw = W / 2 / c.s, hh = H / 2 / c.s; return [[c.cx - hw, c.cy - hh], [c.cx + hw, c.cy - hh], [c.cx - hw, c.cy + hh], [c.cx + hw, c.cy + hh]]; };
  const opaque = (x, y, r) => r * .9 * .98 > Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 2;   // the light's opaque core covers the frame
  function frame(ctx, t) {
    if (t < tO0) { b23(ctx, t); return; }                   // inside c02's light (the bridge picture, identical on both sides of the cut)
    const c = cam(t);
    // the two lights the camera passes through: the hall's open door (3.01) and your window (end of 3.04), both lightAt in screen space
    const [dx, dy] = toScreen(c, DOORL.x, DOORL.y), dr = doorRW(c.s) * c.s, doorOn = dx + 2.6 * dr > 0 && dy + 2.6 * dr > 0 && dy - 2.6 * dr < H && dx - 2.6 * dr < W;
    const [wx, wy] = toScreen(c, WINp.x, WINp.y), wr = t > tLit ? winR(t) * c.s : 0;
    const inside = (doorOn && opaque(dx, dy, dr) && corners(c).every(([x, y]) => inDoor(x, y))) || opaque(wx, wy, wr);
    if (!inside) {
      drawWorld(ctx, c, t, { live: t < tO1 + .2 });
      ctx.save(); camT(ctx, c);
      drawLive(ctx, t, c);
      const warm = eout(lin(tArrive, tArrive + .7, t));
      drawWindow(ctx, t, warm);
      if (warm > 0 && t - tArrive < 1) addGlow(ctx, HX, chanY(HX), 120 * (1 - (t - tArrive)), .5 * (1 - (t - tArrive)), AMBER, CORE);
      drawBridge(ctx, t);
      drawLights(ctx, t);
      ctx.restore();
      drawValleyFog(ctx, c, t);
      ctx.save(); camT(ctx, c); drawSeal(ctx, t); ctx.restore();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (doorOn && dr > .5) {   // the door's light: halo over the world, source clipped to the opening, the door's frame and sill over it
      lightAt(ctx, t, dx, dy, dr, { ...B23, core: 0, bloom: doorBloom(t) });
      ctx.save(); camT(ctx, c); ctx.beginPath(); doorPath(ctx); ctx.clip(); lightAt(ctx, t, dx, dy, dr, { ...B23, bloom: 0 }); ctx.restore();
      ctx.save(); camT(ctx, c); doorFrame(ctx); ctx.restore();
    }
    if (wr > .5) lightAt(ctx, t, wx, wy, wr, B34);
  }
  const draw = (ctx, t) => frame(ctx, t);

  return [
    { t: B23w.cut, tr: 'cut', d: .04, draw, print: { riso: .25 },
      sound: [{ f: 'whoosh_airy', t: A.partE + .02, v: .35 }] },
    { t: A.s302, tr: 'cut', d: .04, draw, print: { riso: .3 },
      sound: [{ f: 'drop', t: A.youE + .03, v: .45 }] },
    { t: A.s303, tr: 'cut', d: .04, draw, print: { riso: .25 },
      sound: [{ f: 'shimmer_rings', t: tEng1 - .05, v: .3 }, { f: 'foil_glint', t: A.filmE + .05, v: .35 }] },
    { t: A.s304, tr: 'cut', d: .04, draw, print: { riso: .25 },
      sound: [{ f: 'pencil', t: tBur0 + .05, v: .25 }, { f: 'bloom', t: tLit - .05, v: .45 }] },
    // inside your window's light: exactly the bridge picture c04 starts from (lib/m1x_bridge.mjs b34)
    { t: B34w.a, tr: 'cut', d: .04, draw: (ctx, t) => b34(ctx, t), print: { riso: .3 } },
  ];
};
