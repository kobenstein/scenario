// c06 · No. 8 methane: invisible, heats far faster than CO₂ · you'd need eyes over the whole planet · they're already up there:
// satellites built to watch fields and forests catch its shadow · an A.I. searches the pictures daily, experts check, the U.N. warns the
// country · Algeria: one leak visible for over a decade, months after the alerts it stopped (lamp 8 HALF) · but that's the exception:
// nearly nine in ten alerts get no answer · two years ago almost none · seeing isn't saving → the flood → THE TREE (plateTree).
// T.G('Methane is invisible') → T.G('Casey Harrell knows') · builder B1 · plan: docs/shots.md 8.01–8.11
// ONE continuous take: the desert at eye level (c05) → the camera takes off over the ground, the horizon bends into the Earth's limb
// (lib/f28_b1_desert.mjs eyeWorld, bend 0 → 1) → orbit: ring of eyes → satellites → the plume → the flow → the film strip → the letters
// pile up on the planet → one warm letter → light flood → out of lantern 8 onto THE TREE.
//
// | ID    | anchor (phrase)                 | picture (one idea)                                                                  | camera                |
// |-------|---------------------------------|-------------------------------------------------------------------------------------|-----------------------|
// | 8.01  | Methane is invisible            | take-off: the ground drops away, the horizon bends into the limb; the leak's shadow stays; METHANE ≈ 80× vs CO₂ | rise, pull back |
// | 8.02  | To catch every leak             | an impossible ring of eyes round the planet (dashed, cool), drawn left → right       | slow drift            |
// | 8.03  | They're already up there        | five eyes become satellites on a real orbit · REAL stamp · tag BUILT TO WATCH …       | truck right           |
// | 8.04  | Satellites built to watch       | the hero satellite's view cone drops onto the site: the plume's shadow shows          | push to the site      |
// | 8.05  | Every day, an A.I. searches     | pictures rise from the cone; the bead scans them → EXPERTS CHECK (warm loupe) → U.N. ALERT letter → down to THE COUNTRY | follow the letter |
// | 8.06  | In Algeria, one leak            | a film strip of the site 2013 … 2024 rises out of it, the plume in every frame        | hold, breathe         |
// | 8.07  | Months after the alerts         | the letter at the site opens warm; on "stopped" the plume breaks off (planet + a clean frame) · ≈ 500,000 CARS | push in   |
// | 8.08  | But that's the exception        | letters rain from the satellites and pile up unopened on the planet                   | pull back             |
// | 8.09  | Nearly nine in ten              | ten letters lift into a row: one opens warm, nine stay shut and dim                  | hold                  |
// | 8.10  | Two years ago                   | ALERTS ANSWERED: 2024 ≈ 1 % · 2025 12 %                                              | breathe               |
// | 8.11★ | Seeing isn't saving             | dive into the one warm letter → light flood → out of lantern 8 onto THE TREE → plateTree | dive, then pull out |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f28_kit.mjs';
import * as S from '../lib/f28_seams.mjs';
import * as B from '../lib/f28_b1_kit.mjs';
import * as D from '../lib/f28_b1_desert.mjs';
import { ride56, anchors05, eyeParts, BEAD_EYE } from './sc05.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, mixHex, prng, smooth } = E;
const TAU = Math.PI * 2;

const ZE = D.Z_EH, ZB = BEAD_EYE.Z;                                   // the planet card · the bead's card (the flow lives there too)
const CO = (u, v, s, sx, sy) => E.aim(ZE, u, v, s, sx, sy);
const PC = { x: W / 2, y: D.EHOR + D.PLANET_R };                      // planet centre (orbit) on ZE
const onPlanet = (ang, r) => [PC.x + r * Math.sin(ang), PC.y - r * Math.cos(ang)];   // ang from the top, + = right
// a camera path like F.camPath (monotone Hermite) but z in log distance to a far card (the orbit cameras sit beyond F0)
function camPathR(t, K, ref = ZE) {
  const n = K.length; if (n === 1) return { ...K[0][1] };
  const V = K.map(([, c]) => [c.x, c.y, Math.log(ref - c.z)]), T = K.map((k) => k[0]);
  if (t <= T[0]) t = T[0]; if (t >= T[n - 1]) t = T[n - 1];
  let i = 0; while (i < n - 2 && t > T[i + 1]) i++;
  const h = T[i + 1] - T[i], u = (t - T[i]) / h, out = [];
  for (let d = 0; d < 3; d++) {
    const sec = (j) => (V[j + 1][d] - V[j][d]) / (T[j + 1] - T[j]);
    const tan = (j) => { if (j === 0 || j === n - 1) return 0; const a = sec(j - 1), b = sec(j); if (a * b <= 0) return 0; const m = (a + b) / 2; return Math.sign(m) * Math.min(Math.abs(m), 3 * Math.abs(a), 3 * Math.abs(b)); };
    const p0 = V[i][d], p1 = V[i + 1][d], m0 = tan(i) * h, m1 = tan(i + 1) * h, u2 = u * u, u3 = u2 * u;
    out.push((2 * u3 - 3 * u2 + 1) * p0 + (u3 - 2 * u2 + u) * m0 + (-2 * u3 + 3 * u2) * p1 + (u3 - u2) * m1);
  }
  return E.cam3({ x: out[0], y: out[1], z: ref - Math.exp(out[2]) });
}
// screen point (sx, sy) under camera c → design point on card Z
function inv(c, Z, sx, sy) { const m = E.cardM(c, Z); return [(sx - m.e) / m.k, (sy - m.f) / m.k]; }
// a point on card Za flying to a point on card Zb (3D, z in log): returns a screen [x, y, k (px per design px of card Za's scale)]
function fly(c, Za, pa, Zb, pb, u) {
  const [Xa, Ya] = B.toWorld(pa[0], pa[1], Za), [Xb, Yb] = B.toWorld(pb[0], pb[1], Zb);
  const Z = Math.exp(lerp(Math.log(Za), Math.log(Zb), u)), p = B.P3(c, lerp(Xa, Xb, u), lerp(Ya, Yb, u), Z);
  return p;
}

// ---------------------------------------------------------------- the letter (an alert): cool and shut, or opened and warm
function letter(ctx, t, x, y, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0 || s < 1) return;
  const warm = clamp(o.warm ?? 0), open = clamp(o.open ?? 0), dim = clamp(o.dim ?? 0), w = s, h = s * .64;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(o.tilt ?? 0);
  if (warm > 0) halo(ctx, 0, -h * .2 * open, s * (1.3 + 1.2 * warm), .55 * warm, P.halo0, P.core0);
  else if ((o.glow ?? 1) > 0) halo(ctx, 0, 0, s * 1.1, .22 * (1 - dim) * (o.glow ?? 1), F.COOL.halo, F.COOL.body);
  // the sheet rises out of the opened envelope (warm)
  if (open > 0) { const sh = h * .9 * expoOut(open); ctx.fillStyle = lin(ctx, 0, -h / 2 - sh, 0, 0, [[0, P.core0], [1, mixHex(P.core1, P.halo0, .4)]]); ctx.fillRect(-w * .4, -h / 2 - sh + h * .1, w * .8, sh + h * .3);
    ctx.fillStyle = rgba(P.shade0, .5); for (let k = 0; k < 3; k++) ctx.fillRect(-w * .3, -h / 2 - sh + h * (.28 + k * .16), w * (.6 - .15 * (k === 2)), Math.max(1, h * .045)); }
  const c0 = mixHex(mixHex(F.COOL.body, P.cream, .5), P.halo2, warm), c1 = mixHex(F.COOL.body, P.halo0, warm), c2 = mixHex(mixHex(F.COOL.deep, F.COOL.body, .5), P.shade0, warm);
  const dk = (c) => mixHex(c, P.night1, .62 * dim);
  ctx.fillStyle = lin(ctx, -w / 2, -h / 2, w / 2, h / 2, [[0, dk(c0)], [.5, dk(c1)], [1, dk(c2)]]);
  ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, s * .04); ctx.fill();
  // the flap: shut (a V) or folded up (open)
  ctx.strokeStyle = rgba(dk(mixHex(F.COOL.deep, P.shade0, warm)), .8); ctx.lineWidth = Math.max(1, s * .03);
  const fy = lerp(h * .1, -h * 1.0, expoOut(open));
  ctx.beginPath(); ctx.moveTo(-w / 2 + s * .03, -h / 2 + s * .03); ctx.lineTo(0, fy); ctx.lineTo(w / 2 - s * .03, -h / 2 + s * .03); ctx.stroke();
  if (open > 0) { ctx.fillStyle = rgba(dk(c2), .9 * span(open, .2, .6)); ctx.beginPath(); ctx.moveTo(-w / 2, -h / 2); ctx.lineTo(0, fy); ctx.lineTo(w / 2, -h / 2); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = rgba(P.cream, .45 * (1 - dim)); ctx.fillRect(-w * .38, h * .18, w * .2, h * .05);
  ctx.restore();
}
// an eye (the impossible ring): almond + pupil, cool
function eyeGlyph(ctx, x, y, s, ang, a, t, k) {
  if (a <= 0) return;
  const op = .25 + .75 * clamp(Math.abs(Math.sin(t * .6 + k * 1.7)) * 1.4);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= a;
  ctx.strokeStyle = rgba(F.COOL.line, .85); ctx.lineWidth = Math.max(1, s * .1);
  ctx.beginPath(); ctx.moveTo(-s, 0); ctx.quadraticCurveTo(0, -s * .9 * op, s, 0); ctx.quadraticCurveTo(0, s * .9 * op, -s, 0); ctx.stroke();
  ctx.fillStyle = F.COOL.core; ctx.beginPath(); ctx.arc(0, 0, s * .26 * op, 0, TAU); ctx.fill();
  ctx.restore();
}
// a satellite picture (one frame of the strip): dark fields, the site, its plume (or not)
function picture(ctx, t, x, y, w, h, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a;
  ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.save(); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, mixHex(P.ind0, P.blue1, .35)], [1, mixHex(P.night1, P.ind0, .6)]]); ctx.fillRect(x - w / 2, y - h / 2, w, h);
  ctx.strokeStyle = rgba(P.blue1, .5); ctx.lineWidth = Math.max(1, w * .008);   // field edges
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(x - w / 2, y + k * h * .18 + w * .05 * Math.sin(k)); ctx.lineTo(x + w / 2, y + k * h * .18 - w * .06); ctx.stroke(); }
  for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(x + k * w * .22, y - h / 2); ctx.lineTo(x + k * w * .22 + w * .05, y + h / 2); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.night0, P.ind1, .5); ctx.fillRect(x - w * .22, y + h * .12, w * .1, h * .08);
  if ((o.plume ?? 1) > 0) D.plume(ctx, t, x - w * .18, y + h * .12, w / 1000, o.plume ?? 1, o.cut ?? 0);
  ctx.restore();
  ctx.strokeStyle = rgba(F.COOL.line, .8); ctx.lineWidth = Math.max(1, w * .015); ctx.strokeRect(x - w / 2, y - h / 2, w, h);
  if (o.ring) { ctx.strokeStyle = rgba(o.ringWarm ? P.halo0 : F.COOL.line, .95 * o.ring); ctx.lineWidth = Math.max(1.5, w * .03); ctx.beginPath(); ctx.arc(x - w * .1, y + h * .02, w * .32 * (1.4 - .4 * expoOut(o.ring)), 0, TAU); ctx.stroke(); }
  ctx.restore();
}
// a warm loupe (the experts' check): ring + handle
function loupe(ctx, x, y, r, a) {
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; halo(ctx, x, y, r * 2.2, .35, P.halo0, P.core1);
  ctx.strokeStyle = P.halo0; ctx.lineWidth = r * .16; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.lineCap = 'round'; ctx.lineWidth = r * .24; ctx.beginPath(); ctx.moveTo(x + r * .72, y + r * .72); ctx.lineTo(x + r * 1.5, y + r * 1.5); ctx.stroke();
  ctx.restore();
}

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after);
  const a = {};
  a.m = G('Methane is invisible'); a.heats = G('it heats the planet', a.m); a.faster = G('far faster', a.m); a.carbon = G('carbon dioxide', a.m);
  a.catch = G('To catch every leak', a.m); a.eyes = G('eyes over the whole', a.m); a.up = G("They're already up there", a.m); a.sats = G('Satellites built to watch', a.m);
  a.canc = G("can catch methane's", a.m); a.shadow = G("faint shadow", a.m); a.every = G('Every day, an A.I.', a.m); a.searches = G('searches their pictures', a.m);
  a.experts = G('Experts check', a.m); a.un = G('the U.N. warns', a.m); a.country = G('warns the country', a.m) + .4;
  a.algeria = G('In Algeria', a.m); a.visible = G('visible from space', a.m); a.decade = G('over a decade', a.m);
  a.months = G('Months after the alerts', a.m); a.stopped = G('it stopped', a.months); a.exception = G("But that's the exception", a.m);
  a.nine = G('Nearly nine in ten', a.m); a.ten = G('nine in ten alerts', a.m) + .5; a.noans = G('get no answer', a.m); a.two = G('Two years ago', a.m); a.none = G('almost none got', a.m);
  a.seeing = G("Seeing isn't saving", a.m); a.saving = G('saving', a.seeing); a.T0 = G('Casey Harrell knows');
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT28 }];
};

function scene(a, T) {
  const a5 = anchors05(T), { eyePart } = eyeParts(a5), R56 = ride56(T);
  const tR = R56.t0 + 1.2;                                            // the take-off leaves the ride here
  const bend = (t) => sineIO(span(t, a.m + .5, a.carbon + .9));
  // ---------------------------------------------------------------- the planet's things (design px on ZE)
  const SATR = D.PLANET_R + 150, RINGR = D.PLANET_R + 260, OMEGA = .011;
  const SAT0 = [-.74, -.41, -.08, .26, .6], HERO = 3;                  // satellites (angles at a.up); 3 = the hero over the site
  const satAng = (k, t) => SAT0[k] + OMEGA * (t - a.up);
  const satAt = (k, t) => { const u = expoOut(span(t, a.up - .2, a.up + 1.0)); const ang = satAng(k, t), r = lerp(RINGR, SATR, u); return onPlanet(ang, r); };
  const SITE = D.SITE, LSITE = 50;
  // ---------------------------------------------------------------- cameras
  const LROW = (k) => [W / 2 + (k - 4.5) * 110, 400];                  // the ten letters (ZE design)
  const WARM = 3, LW = LROW(WARM);
  const tp = a.saving - .15;                                           // the flood's peak
  const K = [[tR, R56.cam(tR)], [a.heats + .5, E.aim(E.F0, 1180, -120, .96)], [a.carbon + .5, CO(960, 480, 1.4)], [a.eyes + .9, CO(930, 470, 1.42)], [a.up + .6, CO(1080, 480, 1.45)],
    [a.shadow + .7, CO(SITE.x - 10, 640, 1.9)], [a.searches + .2, CO(1250, 520, 1.55)], [a.un + .3, CO(1300, 540, 1.58)], [a.country + .6, CO(SITE.x, 620, 1.72)],
    [a.algeria + 1.6, CO(1400, 560, 1.5)], [a.stopped + .8, CO(SITE.x + 20, 600, 1.78)], [a.exception + 1.5, CO(980, 520, 1.4)], [a.two, CO(960, 490, 1.38)],
    [a.seeing - .45, CO(LW[0], LW[1], 1.62)]];
  const KD = [[a.seeing - .45, CO(LW[0], LW[1], 1.62)], [tp, CO(LW[0], LW[1] - 8, 24), 's']];
  const TREE0 = (() => { const g = S.lanternGlass(8); return E.aim(E.F0, g.x, g.y, 30); })();
  const KT = [[tp, TREE0], [a.T0 - .5, S.TREE_CAM_TURN, 'o']];
  const camO = (t) => (t < tR ? R56.cam(t) : t < a.seeing - .45 ? camPathR(t, K) : E.camAt(t, KD, ZE));
  // the flow (on the bead's card ZB): laid out in screen px under the reference camera at 'searches'
  const CF = CO(1250, 520, 1.55), kB = E.cardM(CF, ZB).k;
  const TILE = (k) => inv(CF, ZB, 540 + k * 150, 370), TW = 122 / kB, FLAG = 3, CHECK = inv(CF, ZB, 1270, 380);
  const BEADR = inv(CF, ZB, 560, 220);
  const beadAt = (t) => {   // the bead's point on ZB: its sky spot → over the pictures (scan) → back up
    const b0 = [BEAD_EYE.x, BEAD_EYE.y];
    const go = sineIO(span(t, a.every + .2, a.searches + .1)), sc = sineIO(span(t, a.searches + .1, a.experts - .3)), back = sineIO(span(t, a.experts + .1, a.un + .8));
    const scanX = lerp(TILE(0)[0], TILE(4)[0], sc) - lerp(0, TILE(4)[0] - TILE(FLAG)[0], span(t, a.experts - .6, a.experts - .1));
    const over = [scanX, BEADR[1]], rest = inv(CO(1400, 560, 1.5), ZB, 1580, 210);
    const p = [lerp(b0[0], over[0], go), lerp(b0[1], over[1], go)];
    return { Z: ZB, x: lerp(p[0], rest[0], back), y: lerp(p[1], rest[1], back) };
  };

  // ---------------------------------------------------------------- the eye-level world bending into the planet
  const plumeA = (t) => lerp(.45, 1, span(t, a.canc, a.shadow + .3));
  const worldSt = (t) => ({ bend: bend(t), glow: lerp(.7, .2, bend(t)), plume: plumeA(t), plumeCut: sineIO(span(t, a.stopped, a.stopped + 1.6)), lights: .55 * span(t, a.carbon, a.catch + 1),
    nearA: t < tR ? 1 : 1 - span(camO(t).z, 250, 950), extraFar: (ctx, { cx, cy, R }) => planetThings(ctx, t, R) });
  function planetThings(ctx, t, R) {
    const orbit = span(bend(t), .97, 1);
    if (orbit <= 0) return;
    ctx.save(); ctx.globalAlpha *= orbit;
    // faint other plumes on the night side (only as shimmer)
    for (const [ang, s] of [[-.52, .1], [-.18, .08], [.44, .09]]) { const [x, y] = onPlanet(ang, D.PLANET_R - 40); D.plume(ctx, t, x, y, s, .35 * (1 - span(t, a.exception, a.exception + 1)), 0); }
    // 8.02 the impossible ring of eyes (dashed, cool) — drawn left → right, gone when the real satellites come
    const ru = sineIO(span(t, a.catch + .3, a.eyes + 1.4)), rout = span(t, a.up - .1, a.up + 1.2);
    if (ru > 0 && rout < 1) {
      const A0 = -1.25, A1 = lerp(A0, 1.25, ru);
      ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .55 * (1 - rout)); ctx.lineWidth = 2.5; ctx.setLineDash([16, 14]); ctx.lineDashOffset = -t * 20;
      ctx.beginPath(); ctx.arc(PC.x, PC.y, RINGR, -Math.PI / 2 + A0, -Math.PI / 2 + A1); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      for (let k = 0; k < 40; k++) { const ang = A0 + k * .0641; if (ang > A1) break; if (SAT0.some((s) => Math.abs(s - ang) < .03)) continue;
        const [x, y] = onPlanet(ang, RINGR); eyeGlyph(ctx, x, y, 24, ang, (1 - rout) * expoOut(span(A1 - ang, 0, .15)), t, k); }
    }
    // 8.03 the satellites: five of the eyes become satellites on a real orbit
    const su = span(t, a.up - .3, a.up + .6);
    if (ru > 0 || su > 0) SAT0.forEach((s0, k) => {
      if (s0 > lerp(-1.25, 1.25, ru) && su <= 0) return;
      const [x, y] = satAt(k, t), ang = satAng(k, t);
      if (su < 1) eyeGlyph(ctx, x, y, 24, ang, 1 - su, t, k);
      if (su > 0) { const hero = k === HERO, gx = hero ? 1 + .25 * span(t, a.sats, a.sats + 1) : 1;
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang); F.tool(ctx, 'satellite', 0, 0, 58 * gx * expoOut(su), { col: 'cool', a: su * (1 - .5 * span(t, a.exception + 1.5, a.exception + 2.5) * (hero ? 0 : 1)) }); ctx.restore(); }
    });
    // 8.04 the hero's view cone onto the site
    const cu = sineIO(span(t, a.canc - .3, a.canc + .6)) * (1 - span(t, a.every + .8, a.searches + .4));
    if (cu > 0) { const [x, y] = satAt(HERO, t), ex = lerp(x, SITE.x, cu), ey = lerp(y, SITE.y, cu), rw = 70 * cu;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, x, y, ex, ey, [[0, rgba(F.COOL.halo, .32)], [1, rgba(F.COOL.halo, .1)]]); ctx.beginPath(); ctx.moveTo(x - 6, y + 14); ctx.lineTo(ex - rw, ey); ctx.lineTo(ex + rw, ey); ctx.lineTo(x + 6, y + 14); ctx.closePath(); ctx.fill();
      ctx.fillStyle = E.rad(ctx, ex, ey, rw * 1.3, [[0, rgba(F.COOL.halo, .5 * cu)], [1, rgba(F.COOL.halo, 0)]]); ctx.beginPath(); ctx.ellipse(ex, ey, rw * 1.3, rw * .5, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = rgba(F.COOL.line, .5 * cu); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(ex, ey, rw, rw * .28, 0, 0, TAU); ctx.stroke(); ctx.restore();
      const q = D.plumeSite(1); D.plume(ctx, t, q.x, q.y, q.s, span(cu, .6, 1), sineIO(span(t, a.stopped, a.stopped + 1.6))); }
    // the country (8.05): a soft cool patch round the site (no borders, no map)
    const cyu = span(t, a.country - .5, a.country + .4) * (1 - span(t, a.exception, a.exception + 1));
    if (cyu > 0) { halo(ctx, SITE.x - 30, SITE.y + 30, 210, .35 * cyu, F.COOL.halo, F.COOL.body); ctx.save(); ctx.strokeStyle = rgba(F.COOL.line, .6 * cyu); ctx.lineWidth = 2; ctx.setLineDash([8, 9]); ctx.lineDashOffset = -t * 10;
      ctx.beginPath(); ctx.ellipse(SITE.x - 30, SITE.y + 34, 190, 70, -.12, 0, TAU); ctx.stroke(); ctx.setLineDash([]); ctx.restore(); }
    ctx.restore();
  }

  // ---------------------------------------------------------------- letters: the pile on the planet (8.08) and the row (8.09)
  const NPILE = 34, PILE = (() => { const r = prng(808), out = []; for (let k = 0; k < NPILE; k++) { const x = W / 2 + (r() - .5) * 380 * (1 - k / NPILE * .75), surf = PC.y - Math.sqrt(D.PLANET_R ** 2 - (x - PC.x) ** 2); out.push({ x, y: surf - 20 - k * 4.4 - (1 - Math.abs(x - PC.x) / 190) * k * 1.5, tilt: (r() - .5) * .6, src: k % 5, d: r() }); } return out; })();
  const ROWOF = (k) => [NPILE - 1, NPILE - 2, NPILE - 3, NPILE - 4, NPILE - 5, NPILE - 6, NPILE - 7, NPILE - 8, NPILE - 9, NPILE - 10][k];   // the top ten lift
  const launch = (k) => a.exception - .25 + k * .055;
  function letters(ctx, c, t) {
    if (t < a.exception - .3) return;
    E.card(ctx, c, ZE, () => {
      const rowIx = new Map(); for (let k = 0; k < 10; k++) rowIx.set(ROWOF(k), k);
      const sink = sineIO(span(t, a.seeing + .1, a.seeing + 1.1));
      for (let j = 0; j < NPILE; j++) {
        const L = PILE[j], t0 = launch(j), fu = span(t, t0, t0 + .95); if (fu <= 0) continue;
        const [sx, sy] = satAt(L.src, t0), e = sineIO(fu), land = expoOut(span(fu, .75, 1));
        let x = lerp(sx, L.x, e), y = lerp(sy, L.y, e) - Math.sin(Math.PI * e) * 60 - 8 * Math.sin(Math.PI * land) * (1 - land), s = lerp(24, 80, e), tilt = lerp(-.6, L.tilt, e);
        const ri = rowIx.get(j); let warm = 0, open = 0, dim = 0;
        if (ri !== undefined) {
          const lu = sineIO(span(t, a.nine + Math.abs(ri - 4.5) * .07, a.nine + .9 + Math.abs(ri - 4.5) * .07)), [rx, ry] = LROW(ri);
          x = lerp(x, rx, lu); y = lerp(y, ry + 3 * Math.sin(t * 1.3 + ri), lu); tilt = lerp(tilt, 0, lu); s = lerp(s, 90, lu);
          if (ri === WARM) { warm = smooth(span(t, a.ten, a.ten + .8)); open = expoOut(span(t, a.ten + .1, a.ten + 1.0)); }
          else { dim = span(t, a.noans, a.noans + .8) * .8; y += 30 * sineIO(span(t, a.noans + .1 + ri * .03, a.noans + 1.0 + ri * .03)) + 260 * sink * sink; }
        }
        const fade = ri === WARM ? 1 : 1 - span(sink, .5, 1) * (ri === undefined ? .6 : 1);
        letter(ctx, t, x, y, s, { tilt, warm, open, dim: dim + (ri === undefined ? .35 * span(t, a.nine, a.nine + 1) : 0), a: fade * span(fu, 0, .1) });
      }
    });
  }

  // ---------------------------------------------------------------- the film strip (8.06) on ZE
  const SY = 470, FW = 120, FH = 86, SX = (k) => 1400 + (k - 2.5) * (FW + 16), YEARS = ['2013', '2016', '2019', '2022', '2024', 'LATE 2024'];
  const frameIn = (k) => (k < 5 ? a.algeria + .35 + k * .5 : a.months + .1);
  function strip(ctx, c, t) {
    if (t < a.algeria + .3 || t > a.exception + 1.3) return;
    const back = sineIO(span(t, a.exception - .4, a.exception + .9));
    E.card(ctx, c, ZE, () => {
      for (let k = 0; k < 6; k++) {
        const u = sineIO(span(t, frameIn(k), frameIn(k) + .85)); if (u <= 0) continue;
        const ub = u * (1 - back), x = lerp(SITE.x, SX(k), ub), y = lerp(SITE.y, SY, ub) - 40 * Math.sin(Math.PI * ub), sc = lerp(.15, 1, ub);
        const cut = k === 5 ? sineIO(span(t, a.stopped, a.stopped + 1.6)) : 0;
        picture(ctx, t + k * 3.1, x, y, FW * sc, FH * sc, { a: span(u, 0, .15) * (1 - span(back, .85, 1)), plume: 1, cut, ring: k === 5 ? 0 : 0 });
        const yu = span(t, frameIn(k) + .5, frameIn(k) + 1.1) * (1 - span(back, 0, .25));
        if (yu > 0) E.glowText(ctx, YEARS[k], x, y + FH * sc / 2 + 24, { size: 17, align: 'center', spacing: .12, glow: false, col: k === 5 ? P.halo2 : F.COOL.text, a: F.rise(yu) });
      }
    });
  }

  // ---------------------------------------------------------------- the flow (8.05) on ZB: pictures → the bead scans → experts → letter → the country
  function flow(ctx, c, t) {
    if (t < a.every || t > a.algeria + 1) return;
    const [hx, hy] = satAt(HERO, t);
    // pictures rise from the site along the cone and settle into a row
    for (let k = 0; k < 5; k++) {
      const t0 = a.every + .1 + k * .16, u = sineIO(span(t, t0, t0 + 1.0)); if (u <= 0) continue;
      let p = fly(c, ZE, [SITE.x + (k - 2) * 12, SITE.y], ZB, TILE(k), u); if (!p) continue;
      const mk = E.cardM(c, ZB).k, scanned = span(beadAt(t).x, TILE(k)[0] - TW * .3, TILE(k)[0]) * span(t, a.searches, a.searches + .2);
      let x = p[0], y = p[1], s = TW * mk * lerp(.25, 1, u), al = 1;
      if (k === FLAG) { const mv = sineIO(span(t, a.experts - .1, a.experts + .7)); const q = E.project(c, ZB, CHECK[0], CHECK[1]); if (q) { x = lerp(x, q[0], mv); y = lerp(y, q[1], mv) - 26 * Math.sin(Math.PI * mv); } al = 1 - span(t, a.un, a.un + .35); }
      else al = 1 - span(t, a.experts + .2 + k * .05, a.experts + .9 + k * .05);
      if (al <= 0) continue;
      picture(ctx, t + k * 1.7, x, y, s, s * .72, { a: al, plume: k === FLAG ? 1 : 0, ring: k === FLAG ? span(t, a.experts - .7, a.experts - .2) : 0, ringWarm: t > a.experts + .7 });
      if (scanned > 0 && k !== FLAG) { ctx.save(); ctx.globalAlpha = al * .5 * scanned * (1 - span(t, a.experts - .3, a.experts + .3)); ctx.strokeStyle = F.COOL.line; ctx.lineWidth = 2; ctx.strokeRect(x - s / 2 - 4, y - s * .36 - 4, s + 8, s * .72 + 8); ctx.restore(); }
    }
    // the experts' warm loupe comes in from the right and checks the flagged picture
    const q = E.project(c, ZB, CHECK[0], CHECK[1]);
    if (q) {
      const lu = expoOut(span(t, a.experts + .2, a.experts + 1.0)) * (1 - span(t, a.un - .1, a.un + .3));
      loupe(ctx, lerp(q[0] + 260, q[0] - 6, lu) + 4 * Math.sin(t * 2), q[1] - 4 + 3 * Math.cos(t * 1.7), 52 * q[2] / kB, lu);
      const tl = span(t, a.experts + .3, a.experts + 1.0) * (1 - span(t, a.un + .2, a.un + .8));
      if (tl > 0) F.maskLine(ctx, [['EXPERTS CHECK', 1]], q[0], q[1] + 108, 26, F.rise(tl), { serif: false, weight: 600, align: 'center', glow: false });
      // the picture folds into an alert letter, which flies down to the country
      const fold = span(t, a.un - .05, a.un + .4), down = sineIO(span(t, a.un + .9, a.country + .2));
      if (fold > 0) {
        const p = down > 0 ? fly(c, ZB, CHECK, ZE, [SITE.x - 40, SITE.y - 22], down) : [q[0], q[1], q[2]];
        if (p) {
          const sz = lerp(92 * E.cardM(c, ZB).k / kB, LSITE * E.cardM(c, ZE).k, down);
          const op = expoOut(span(t, a.months + .1, a.months + 1.0)), wm = smooth(span(t, a.months, a.months + .8));
          letter(ctx, t, p[0], p[1], sz * lerp(.7, 1, expoOut(fold)), { a: span(fold, 0, .2), tilt: .3 * Math.sin(Math.PI * down), warm: wm, open: op });
          const ul = span(t, a.un + .1, a.un + .7) * (1 - span(t, a.un + .9, a.un + 1.3));
          if (ul > 0) F.label(ctx, p[0] + 40, p[1] - 20, 'U.N. ALERT', null, ul, { dx: 50, dy: -60, size: 26, col: 'cool' });
        }
      }
    }
  }
  // the letter sitting at the site after it landed (it opens warm on 'Months after the alerts'), and the country label
  function siteLetter(ctx, c, t) {
    if (t < a.country + .2 || t > a.exception + 1) return;
    const p = E.project(c, ZE, SITE.x - 40, SITE.y - 22); if (!p) return;
    const op = expoOut(span(t, a.months + .1, a.months + 1.0)), wm = smooth(span(t, a.months, a.months + .8)), out = span(t, a.exception - .2, a.exception + .6);
    letter(ctx, t, p[0], p[1], LSITE * p[2], { warm: wm, open: op, a: 1 - out });
    const cl = E.project(c, ZE, SITE.x - 160, SITE.y + 60);
    const lc = span(t, a.country - .3, a.country + .4) * (1 - span(t, a.algeria - .1, a.algeria + .2)), la = span(t, a.algeria, a.algeria + .6) * (1 - span(t, a.months - .4, a.months));
    if (cl && lc > 0) F.label(ctx, cl[0], cl[1], 'THE COUNTRY', null, lc, { dx: -60, dy: 70, size: 26, col: 'cool' });
    if (cl && la > 0) F.label(ctx, cl[0], cl[1], 'ALGERIA', null, la, { dx: -60, dy: 70, size: 26, col: 'cool' });
    const car = span(t, a.stopped + .5, a.stopped + 1.2) * (1 - span(t, a.exception + .2, a.exception + .9));
    const pc = E.project(c, ZE, SITE.x + 120, SITE.y - 40);
    if (pc && car > 0) F.label(ctx, pc[0], pc[1], '≈ 500,000 CARS', 'FOR A YEAR', car, { dx: 80, dy: -80, size: 30 });
  }

  // ---------------------------------------------------------------- screen-space explainers
  function slabs(ctx, t) {
    // 8.01: METHANE vs CO₂ (warming over 20 years)
    const mu = span(t, a.heats, a.faster + .6), cu = span(t, a.carbon - .1, a.carbon + .6), out = 1 - span(t, a.catch + .2, a.catch + .9);
    if (mu > 0 && out > 0) {
      F.slab(ctx, t, 900, 190, 720, 30, { col: 'cool', u: mu, label: 'METHANE', a: out });
      F.maskLine(ctx, [['≈ 80×', 0]], 1650, 202, 34, F.rise(span(mu, .6, 1)) * out, { serif: false, weight: 600, glow: false });
      F.slab(ctx, t, 900, 252, 9, 30, { col: 'stone', u: cu, label: 'CO₂', a: out * span(cu, 0, .2) });
      F.maskLine(ctx, [['1×', 0]], 940, 264, 30, F.rise(span(cu, .5, 1)) * out, { serif: false, weight: 600, glow: false, col: P.halo2 });
      F.maskLine(ctx, [['WARMING OVER 20 YEARS', 0]], 900, 318, 20, F.rise(span(t, a.carbon + .2, a.carbon + .9)) * out, { serif: false, weight: 600, glow: false, col: F.COOL.text });
    }
    // 8.10: ALERTS ANSWERED
    const su = span(t, a.two - .1, a.none + .6), so = 1 - span(t, a.seeing - .1, a.seeing + .6);
    if (su > 0 && so > 0) {
      F.maskLine(ctx, [['ALERTS ANSWERED', 0]], 820, 168, 24, F.rise(span(su, 0, .4)) * so, { serif: false, weight: 600, glow: false, col: P.halo2 });
      F.slab(ctx, t, 900, 220, 25, 28, { col: 'stone', u: span(t, a.two, a.two + .7), label: '2024', a: so });
      F.maskLine(ctx, [['≈ 1 %', 0]], 952, 231, 30, F.rise(span(t, a.none, a.none + .6)) * so, { serif: false, weight: 600, glow: false, col: P.cream });
      F.slab(ctx, t, 900, 280, 300, 28, { col: 'warm', u: span(t, a.none + .5, a.none + 1.3), label: '2025', a: so });
      F.maskLine(ctx, [['12 %', 0]], 1226, 291, 30, F.rise(span(t, a.none + 1.0, a.none + 1.6)) * so, { serif: false, weight: 600, glow: false, col: P.cream });
    }
  }

  return (ctx, t) => {
    if (t >= a.T0 - .5) { S.plateTree(ctx, t, T); return; }
    if (t >= tp) {
      // out of lantern 8's glass onto THE TREE (the crown half dark, the kitchen lantern near)
      S.treeWorld(ctx, E.camAt(t, KT), t, S.treeTurnState(t, T));
      F.lampRail(ctx, t, T);
      E.lightFlood(ctx, 1 - smooth(span(t, tp, a.T0 - .55)));
      return;
    }
    const drift = t < tR ? 1 : 1 - span(t, a.seeing, a.seeing + .8);
    const c = B.drifted(camO(t), E.F0, t, drift);
    eyePart(ctx, c, t, true, {
      st: worldSt,
      bead: (t) => (t < a.every + .2 ? BEAD_EYE : beadAt(t)),
      beamTo: (cc, t) => { const q = D.plumeSite(bend(t)); return E.project(cc, ZE, q.x, q.y + 10); },
      beamA: 1 - span(t, a.carbon - .4, a.carbon + .6),
    });
    // the bead's scan beam over the pictures (8.05)
    const sb = span(t, a.searches, a.searches + .3) * (1 - span(t, a.experts - .4, a.experts));
    if (sb > 0) { const b = beadAt(t), p = E.project(c, ZB, b.x, b.y); if (p) F.beam(ctx, t, p[0], p[1] + 12, p[0], p[1] + 100, sb, { w: 2, spark: false }); }
    strip(ctx, c, t);
    flow(ctx, c, t);
    siteLetter(ctx, c, t);
    letters(ctx, c, t);
    // 8.03 the tag on the hero satellite
    const tg = span(t, a.sats, a.sats + .6) * (1 - span(t, a.canc - .2, a.canc + .3));
    if (tg > 0) { const [x, y] = satAt(HERO, t), p = E.project(c, ZE, x + 40, y + 8); if (p) F.tag(ctx, t, p[0], p[1], 'BUILT TO WATCH FIELDS AND FORESTS', tg, { col: 'cool' }); }
    slabs(ctx, t);
    F.realStamp(ctx, t, a.up + .2, a.shadow + .4, 'mars');
    F.source(ctx, t, a.every + .4, a.months - .2, F.SOURCES.mars);
    F.source(ctx, t, a.nine + .4, a.seeing + .2, F.SOURCES.mars);
    F.lampRail(ctx, t, T);
    E.lightFlood(ctx, smooth(span(t, tp - 2.2, tp)));
  };
}
