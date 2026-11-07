// Film 23 · B2 · the light-wall graphics of c07 and c08 (one function of t, so the c07 → c08 seam is the same picture on both sides).
// Everything is light on the kitchen's light wall (no frame, no panel), drawn in wall units: local (u, v) with u 0..520 left → right,
// v 0..400 top → bottom (LIGHTWALL), inside kitchen o.wallFn. The CAM_WALL card zone (x 60–820, y 40–430) = u < 190, v < 190: kept calm
// while a card is open (E5, E6, E7 in c08).
//   7.02 the black hole the pea draws (orbit, ring, disc) + the ladder of '?' she climbed herself; it sinks, one '?' drops (scene)
//   7.05 ★ the day as one gold road through its station marks; the cool road forks off below; one big cool disc over both; threads to
//        many small people (gold road) / to one tower (cool road)
//   8.01 the K1 point drops onto the cool road; the gold road dims; three pictures stand on the cool road (paid check-ups, the cube
//        that spits answers, the agent tied to a shop)
//   8.03–8.05 the tower, the road, the testers' house, the city: the capsule, month ticks, five findings (one cracks), the pill
//        through a one-way door, every finding through the testers' gate, the cool disc too; it all sinks into the wall's lower edge
import * as E from './f10_editorial.mjs';
import * as K from './f23_kit.mjs';
const { P, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, quartIO, rgba, mixHex, rad, lin, halo } = E;
const { COOL, LIGHTWALL: LW } = K;

// ---------------------------------------------------------------- anchors (c07 + c08), global phrases after the chunk starts
export function wallAnchors(T) {
  const a0 = T.G("Seven o'clock", 0, T.G('This channel exists'));
  const G = (p, after = a0) => T.G(p, 0, after);
  const A = { a0 };
  A.pea = G('pea'); A.spoon = G('spoon', A.pea); A.waving = G('waving'); A.every = G('every part'); A.never = G('never told her a thing');
  A.then = G('Then she pulls'); A.homework = G('homework'); A.oneQ = G('One question'); A.wouldnt = G("wouldn't answer it"); A.ask = G('ask you', A.wouldnt);
  A.why = G('Why did it go well'); A.looks = G('looks up'); A.always = G('always like this'); A.known = G('never known anything else');
  A.no = G('No', A.known); A.another = G('another way'); A.smart = G("weren't smart enough"); A.plenty = G('plenty smart'); A.who = G("who they'd work for");
  A.saw = G('saw it clearly'); A.look = G('Look', A.saw); A.rec = G('old recording'); A.wallW = G('wall', A.rec);
  A.clip = T.clip('K1');
  A.baby = G('When you were a baby'); A.checks = G('Good check-ups'); A.paid = G('paid extra'); A.tutors = G('Tutors that just'); A.spat = G('spat out answers');
  A.agents = G('Agents that worked'); A.shop = G('worked for the shop'); A.looksAt = G('looks at you like'); A.making = G('making it up'); A.soWhy = G("So why didn't it");
  A.stubborn = G('stubborn'); A.antib = G('antibiotic in the news'); A.months = G('for months'); A.slow = G('so slow'); A.purpose = G('On purpose');
  A.backThen = G('Back then', A.purpose); A.brilliant = G('brilliant'); A.oneIn5 = G('one in five'); A.oneIn5b = G('One in five', A.oneIn5 + .5); A.pill = G('take a pill back');
  A.insisted = G('people insisted'); A.test = G('test it before you trust it'); A.outside = G('Outside the companies'); A.open = G('in the open');
  A.notJust = G('Not just the medicines'); A.machine = G('Every new machine'); A.reached = G('before it reached anyone');
  A.T0 = T.G('And today you say', 0, A.reached);
  return A;
}

// ---------------------------------------------------------------- drawing helpers (wall units)
export function lightPath(ctx, pts, u, o = {}) {   // a path of light drawn on to u 0..1; o: { cool, w, a, spark, from (u0) }
  if (u <= 0 || pts.length < 2) return null;
  const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const L = len[len.length - 1], d0 = L * clamp(o.from ?? 0), d1 = L * clamp(u), a = o.a ?? 1, w = o.w ?? 3, cool = o.cool;
  const at = (d) => { let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
  const sub = [at(d0)]; for (let i = 1; i < pts.length; i++) if (len[i] > d0 && len[i] < d1) sub.push(pts[i]); const head = at(d1); sub.push(head);
  ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const stroke = () => { ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); };
  ctx.strokeStyle = rgba(cool ? COOL.edge : P.halo0, .28 * a); ctx.lineWidth = w * 4; stroke();
  ctx.strokeStyle = rgba(cool ? COOL.core : P.core1, a); ctx.lineWidth = w; stroke();
  ctx.restore();
  if (o.spark !== false && u < 1 && u > 0) halo(ctx, head[0], head[1], w * 7, .9 * a, cool ? COOL.mid : P.halo0, cool ? COOL.core : P.core0);
  return head;
}
const pathAt = (pts, u) => { const len = [0]; for (let i = 1; i < pts.length; i++) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); const d = len[len.length - 1] * clamp(u); let i = 1; while (i < pts.length - 1 && len[i] < d) i++; const f = (d - len[i - 1]) / Math.max(1e-6, len[i] - len[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)]; };
const curve = (p0, p1, n = 24, bend = 0) => Array.from({ length: n + 1 }, (_, i) => { const v = i / n; return [lerp(p0[0], p1[0], v), lerp(p0[1], p1[1], v) + Math.sin(Math.PI * v) * bend]; });
const rise = (ctx, x, base, h, u, fn) => { if (u <= 0) return; ctx.save(); ctx.beginPath(); ctx.rect(x - 400, base - h * 1.4, 800, h * 1.4); ctx.clip(); ctx.translate(0, h * 1.25 * (1 - expoOut(u))); fn(); ctx.restore(); };   // grows up from a baseline (mask)
function tinyPerson(ctx, x, y, h, col, a = 1) {   // a small light silhouette standing on y
  ctx.fillStyle = rgba(col, a); ctx.beginPath(); ctx.arc(x, y - h * .82, h * .16, 0, 6.29); ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - h * .22, y); ctx.quadraticCurveTo(x - h * .24, y - h * .62, x, y - h * .63); ctx.quadraticCurveTo(x + h * .24, y - h * .62, x + h * .22, y); ctx.closePath(); ctx.fill();
}
function miniTower(ctx, x, y, w, h, t, a = 1, glow = 1) {   // the makers' tower as a light glyph (cool windows)
  ctx.fillStyle = rgba(mixHex(P.night1, COOL.deep, .5), .95 * a); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = rgba(COOL.mid, .8 * a); ctx.lineWidth = 2; ctx.strokeRect(x - w / 2, y - h, w, h);
  const rows = Math.max(4, Math.round(h / 16)), cols = 3;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const lit = (Math.sin(j * 3.1 + i * 1.7) * .5 + .5) > .3; if (!lit) continue; ctx.fillStyle = rgba(mixHex(COOL.mid, COOL.core, .5), (.55 + .3 * Math.sin(t * .8 + j + i)) * a * glow); ctx.fillRect(x - w / 2 + 5 + i * (w - 10) / cols, y - h + 6 + j * (h - 10) / rows, (w - 10) / cols - 4, (h - 10) / rows * .5); }
  ctx.fillStyle = rgba(COOL.core, .9 * a); ctx.beginPath(); ctx.arc(x, y - h - 10, 3 + .6 * Math.sin(t * 2), 0, 6.29); ctx.fill(); ctx.fillRect(x - 1, y - h - 10, 2, 10);
}
function miniHouse(ctx, x, y, w, t, o = {}) {   // the testers' house glyph: warm lamp, roof outline; o.open 0..1 (front folds down: three testers), o.warm
  const h = w * .62, a = o.a ?? 1, warm = o.warm ?? .6, op = smooth(o.open ?? 0);
  ctx.fillStyle = rad(ctx, x, y - h * .5, w * 1.1, [[0, rgba(P.halo0, (.18 + .25 * warm) * a)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - w * 1.1, y - h * 1.6, w * 2.2, h * 1.7);
  ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), a); ctx.fillRect(x - w / 2, y - h, w, h);
  ctx.strokeStyle = rgba(P.halo0, .9 * a); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - w * .6, y - h); ctx.lineTo(x, y - h - w * .35); ctx.lineTo(x + w * .6, y - h); ctx.stroke();
  ctx.fillStyle = lin(ctx, 0, y - h, 0, y, [[0, rgba(mixHex(P.ind1, P.halo1, .4 + .4 * warm), a)], [1, rgba(mixHex(P.night1, P.halo1, .3 + .3 * warm), a)]]); ctx.fillRect(x - w / 2 + 3, y - h + 3, w - 6, h - 3);
  for (const dx of [-.25, 0, .25]) tinyPerson(ctx, x + dx * w, y - 2, h * .5, mixHex(P.night1, P.ind1, .5), a);
  ctx.fillStyle = rgba(P.night1, a); ctx.fillRect(x - w * .38, y - h * .3, w * .76, 4);
  if (op < 1) {   // the front wall (hinged at the bottom) with its warm lamp window
    const fh = h * (1 - op); ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .55), a); ctx.fillRect(x - w / 2, y - fh, w, fh);
    if (fh > h * .4) { ctx.fillStyle = rgba(mixHex(P.core1, P.halo0, 1 - warm), a); ctx.fillRect(x - w * .15, y - fh + fh * .22, w * .3, fh * .32); }
  }
}
function cityGlyph(ctx, x, y, w, t, a = 1, lit = 1) {   // a few roofs with warm windows: "the city", "everyone"
  const blds = [[-.5, .55], [-.28, .8], [-.05, .6], [.18, .9], [.38, .65]];
  for (const [dx, hh] of blds) {
    const bx = x + dx * w, bw = w * .2, bh = w * .45 * hh;
    ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .4), a); ctx.fillRect(bx, y - bh, bw, bh);
    for (let j = 0; j < 3; j++) for (let i = 0; i < 2; i++) { ctx.fillStyle = rgba(P.core1, .85 * a * lit); ctx.fillRect(bx + bw * (.18 + i * .42), y - bh + 6 + j * bh * .3, bw * .22, bh * .12); }
  }
}
function crack(ctx, x, y, r, u) {   // a crack across a point
  if (u <= 0) return; ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - r * .9, y - r * .5); const m = [x - r * .1, y + r * .1], e = [x + r * .9, y + r * .55]; ctx.lineTo(lerp(x - r * .9, m[0], clamp(u * 2)), lerp(y - r * .5, m[1], clamp(u * 2))); if (u > .5) ctx.lineTo(lerp(m[0], e[0], (u - .5) * 2), lerp(m[1], e[1], (u - .5) * 2)); ctx.stroke();
}
export function point(ctx, x, y, r, warm = 1, a = 1) {   // a finding / a dot of light (warm gold → grey)
  ctx.fillStyle = rad(ctx, x, y, r * 3, [[0, rgba(mixHex(P.blue1, P.halo0, warm), .45 * a)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(x - r * 3, y - r * 3, r * 6, r * 6);
  ctx.fillStyle = rgba(mixHex(mixHex(P.blue1, P.cream, .32), P.core1, warm), a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
}

// ---------------------------------------------------------------- geometry of the pictures (local u, v)
export const HOLE = [210, 160];
const ORBIT = (n = 64) => Array.from({ length: n * 2 + 1 }, (_, i) => { const a = Math.PI * 2 * i / n + Math.PI * .85, k = 1 - .38 * i / (n * 2); return [HOLE[0] + Math.cos(a) * 150 * k, HOLE[1] + Math.sin(a) * 58 * k]; });
export const QSTEPS = [[330, 340], [372, 316], [414, 292], [456, 268]];
export const GOLD_ROAD = curve([22, 222], [498, 222], 40, -10);
export const COOL_ROAD = [[130, 222], ...curve([150, 238], [498, 318], 30, 18).slice(1)];
export const STATIONS = [[66, 'clinic'], [150, 'ask'], [244, 'tower'], [336, 'agent'], [428, 'buds']];
export const DISC = [290, 96];
const SCREEN_C = [K.SCREEN.x + K.SCREEN.w / 2 - LW.x, K.SCREEN.y + K.SCREEN.w * 9 / 32 - LW.y], DROP_U = 262;
// c08 diagram: tower right, testers' house middle, city left; the road along the bottom (v 338)
export const TOWER = [452, 340], HOUSE = [290, 340], CITY = [78, 340];
export const ROAD2 = curve([TOWER[0] - 30, 340], [CITY[0] + 40, 340], 40, 0);

// ---------------------------------------------------------------- the whole wall at time t (c07 + c08)
export function wallArt(ctx, t, A, o = {}) {
  ctx.save(); ctx.translate(LW.x, LW.y);
  ctx.beginPath(); ctx.rect(-10, -10, LW.w + 20, LW.h + 10); ctx.clip();   // the light area's lower edge is a real edge: things sink into it
  // ---- 7.02 the black hole (the pea's orbit) + the ladder of '?'
  {
    const sink = sineIO(span(t, A.then - .1, A.then + .9));
    if (t > A.every - 1 && sink < 1) {
      ctx.save(); ctx.translate(0, 420 * sink);
      const orb = sineIO(span(t, A.every - .55, A.every + 1.25));
      const ring = expoOut(span(t, A.every + .2, A.every + .9)), disk = expoOut(span(t, A.every + .55, A.every + 1.3));
      ctx.fillStyle = rad(ctx, HOLE[0], HOLE[1], 190, [[0, rgba(P.halo0, .16 * ring)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(HOLE[0] - 190, HOLE[1] - 190, 380, 380);
      if (disk > 0) { ctx.save(); ctx.translate(HOLE[0], HOLE[1]); ctx.rotate(-.12); ctx.scale(disk, 1); ctx.strokeStyle = rgba(P.halo0, .5); ctx.lineWidth = 16; ctx.beginPath(); ctx.ellipse(0, 0, 110, 26, 0, Math.PI, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(HOLE[0], HOLE[1], 40 * Math.max(ring, .02), 0, 6.29); ctx.fill();
      if (ring > 0) { ctx.strokeStyle = rgba(P.core1, ring); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(HOLE[0], HOLE[1], 44, -Math.PI / 2, -Math.PI / 2 + 6.283 * ring); ctx.stroke(); }
      if (disk > 0) { ctx.save(); ctx.translate(HOLE[0], HOLE[1]); ctx.rotate(-.12); ctx.scale(disk, 1); ctx.strokeStyle = rgba(P.core1, .85); ctx.lineWidth = 7; ctx.beginPath(); ctx.ellipse(0, 0, 110, 26, 0, 0, Math.PI); ctx.stroke(); ctx.restore(); }
      const head = lightPath(ctx, ORBIT(), orb, { w: 2.4, a: .85 });
      if (head && orb < 1) point(ctx, head[0], head[1], 6, 1);   // the pea, drawing its own orbit
      // the ladder of '?' she climbed herself
      QSTEPS.forEach(([u, v], i) => { if (i === 3 && t > A.then - .1) return; const k = span(t, A.never - .1 + i * .18, A.never + .35 + i * .18); K.qStep(ctx, u, v, 34, t, { u: k, lit: expoOut(span(t, A.never + .3 + i * .18, A.never + .7 + i * .18)) }); });
      ctx.restore();
    }
  }
  // ---- 7.05 ★ the fork, 8.01 the other road's pictures (hidden under the old screen during K1)
  const tF0 = A.no + .05, cl = A.clip, DROP0 = cl.end + .45, DROP1 = cl.end + .8;   // the K1 point (oldScreen 'gone' at end + .45) drops
  if (t > tF0 && t < A.stubborn + 3) {
    const out8 = sineIO(span(t, A.stubborn + 1.2, A.stubborn + 2.4));   // 8.02 → 8.03: the other road sinks; the new diagram comes
    ctx.save(); ctx.translate(0, 430 * out8);
    const g = sineIO(span(t, tF0, tF0 + 1.9));
    const dimG = 1 - .55 * span(t, cl.end + .7, cl.end + 1.5);          // after K1 the gold road steps back (dimmer, a little higher)
    const lift = sineIO(span(t, cl.end + 1.1, cl.end + 2.1));             // … and the cool road bends lower: room for its three pictures
    const CR = lift > 0 ? COOL_ROAD.map(([u, v]) => { const w = clamp((u - 130) / 368); return [u, v + lift * (-18 * (1 - w) + 42 * w)]; }) : COOL_ROAD;
    ctx.save(); ctx.translate(0, -18 * lift);
    lightPath(ctx, GOLD_ROAD, g, { w: 4, a: dimG });
    ctx.globalAlpha = dimG;
    STATIONS.forEach(([u, kind], i) => {
      const k = expoOut(span(t, tF0 + (u / 500) * 1.9, tF0 + (u / 500) * 1.9 + .45)); if (k <= 0) return;
      rise(ctx, u, 214, 60, k, () => {
        if (kind === 'clinic') { ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(u, 188, 14, 0, 6.29); ctx.stroke(); point(ctx, u, 188, 4, 1); }
        if (kind === 'ask') [0, 1, 2].forEach((j) => K.qStep(ctx, u - 20 + j * 18, 210 - j * 9, 18, t, { lit: 1 }));
        if (kind === 'tower') { miniTower(ctx, u - 16, 214, 18, 58, t, 1); miniHouse(ctx, u + 18, 214, 30, t, { warm: .8 }); }
        if (kind === 'agent') { K.agentLight(ctx, u - 6, 178, 9, t, { warm: 1 }); K.thread(ctx, [u - 6, 188], [u + 18, 210], t, { w: 1.8, sag: 4 }); tinyPerson(ctx, u + 20, 214, 26, P.core1); }
        if (kind === 'buds') K.earbuds(ctx, u, 196, 8, t, {});
      });
    });
    ctx.restore();
    // the cool road forks off below
    const f = sineIO(span(t, A.another - .05, A.another + 1.2));
    const cool8 = expoOut(span(t, DROP1, DROP1 + .75));                 // 8.01: the K1 point lands on it, it brightens
    lightPath(ctx, CR, f, { cool: true, w: 3.4 + 1.6 * cool8, a: .8 + .2 * cool8 });
    // the disc over both roads, the threads (gone under the screen before c08)
    const discOut = sineIO(span(t, cl.start - 1.25, cl.start - .6)), disc = expoOut(span(t, A.plenty - .05, A.plenty + 1.1)) * (1 - discOut);   // folds into the old screen's line
    const th = span(t, A.who, A.who + 1.2), tu = 1 - discOut;
    if (th > 0 && t < cl.start + .3) {   // the threads fold back into the disc; their people stay until the old screen covers them
      const y = lerp(250, DISC[1], Math.max(disc, .001));
      for (let i = 0; i < 6; i++) { const px = 260 + i * 42, k = clamp(th * 1.6 - i * .1); if (disc > 0) K.thread(ctx, [DISC[0] - 10 + i * 4, y + 40], [px, 216], t, { u: k * tu, w: 1.5, sag: 6 }); if (k >= 1) rise(ctx, px, 220, 26, tu, () => tinyPerson(ctx, px, 220, 22, P.core1)); }
      const k = clamp(th * 1.4 - .1); if (disc > 0) K.thread(ctx, [DISC[0] + 20, y + 40], [470, 280], t, { u: k * tu, w: 1.8, cool: true, sag: 6 }); if (k >= 1) rise(ctx, 476, 312, 76, tu, () => miniTower(ctx, 476, 312, 22, 64, t, 1));
    }
    if (disc > 0) {
      const y = lerp(250, DISC[1], disc);
      ctx.fillStyle = rad(ctx, DISC[0], y, 110, [[0, rgba(COOL.mid, .35 * disc)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(DISC[0] - 110, y - 110, 220, 220);
      for (let i = 0; i < 3; i++) { const ph = (t * .3 + i / 3) % 1; ctx.strokeStyle = rgba(COOL.mid, (1 - ph) * .5 * disc); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(DISC[0], y, 46 + 40 * ph, (46 + 40 * ph) * .3, 0, 0, 6.29); ctx.stroke(); }
      ctx.fillStyle = rad(ctx, DISC[0] - 12, y - 14, 44 * disc, [[0, COOL.core], [.5, COOL.mid], [1, COOL.edge]]); ctx.beginPath(); ctx.arc(DISC[0], y, 44 * disc, 0, 6.29); ctx.fill();
    }
    // 8.01: the three pictures on the cool road (rise from it, each on its phrase)
    if (t > cl.end) {
      const base = (u) => pathAt(CR, (u - 130) / 368)[1] - 4;
      // paid check-ups: a lit clinic window with a price tag, a queue of dark people beside it
      rise(ctx, 250, base(250), 60, span(t, A.checks - .05, A.checks + .5), () => {
        const b = base(266); ctx.fillStyle = lin(ctx, 0, b - 48, 0, b, [[0, P.core1], [1, P.halo0]]); ctx.fillRect(254, b - 48, 26, 40);
        ctx.fillStyle = rgba(P.shade0, .7); ctx.fillRect(266, b - 48, 2, 40);
        for (let i = 0; i < 4; i++) tinyPerson(ctx, 242 - i * 14, base(242 - i * 14), 24, mixHex(P.night1, P.ind1, .6));
        K.priceTag(ctx, 286, b - 46, 22, expoOut(span(t, A.paid - .05, A.paid + .4)));
      });
      // tutors that spat out answers: the cube pops open, answers tumble out
      rise(ctx, 345, base(345), 70, span(t, A.tutors - .05, A.tutors + .5), () => {
        const b = base(345), op = expoOut(span(t, A.spat - .05, A.spat + .35));
        K.answerCube(ctx, 341, b - 24, 30, t, { seal: 1 - op, open: op });
        for (let i = 0; i < 5; i++) { const k = span(t, A.spat + .05 + i * .12, A.spat + .8 + i * .12); if (k <= 0) continue; const x = 341 + 16 + i * 9 + k * 14, y = lerp(b - 50, b - 4, Math.min(1, k * k * 1.4)); ctx.fillStyle = rgba(P.core1, .95); ctx.fillRect(x - 3, y - 3, 6, 6); }
      });
      // agents that worked for the shop: an agent light whose thread is tied to a shop sign, not to a person
      rise(ctx, 440, base(440), 80, span(t, A.agents - .05, A.agents + .5), () => {
        const b = base(440);
        ctx.fillStyle = rgba(mixHex(P.night1, COOL.deep, .5), 1); ctx.fillRect(452, b - 44, 40, 28);
        ctx.fillStyle = rgba(COOL.mid, .9); for (let i = 0; i < 5; i++) ctx.fillRect(450 + i * 9, b - 50, 7, 6);
        ctx.fillRect(458, b - 16, 3, 16); ctx.fillRect(484, b - 16, 3, 16);
        K.agentLight(ctx, 410, b - 58, 10, t, { warm: 0 });
        K.thread(ctx, [412, b - 46], [452, b - 30], t, { u: expoOut(span(t, A.shop - .05, A.shop + .5)), cool: true, w: 1.8, sag: 5 });
      });
    }
    ctx.restore();
  }
  // ---- the K1 point drops from the old screen's centre onto the cool road (7.07 → 8.01)
  if (t >= DROP0 && t < DROP1 + .35) {
    const k = expoIn(span(t, DROP0, DROP1)), land = pathAt(COOL_ROAD, (DROP_U - 130) / 368);
    const y = lerp(SCREEN_C[1], land[1], k), x = lerp(SCREEN_C[0], land[0], k), hit = span(t, DROP1, DROP1 + .35);
    if (hit <= 0) { halo(ctx, x, y, 22, 1); point(ctx, x, y, 5, 1); }
    else { ctx.strokeStyle = rgba(COOL.core, .8 * (1 - hit)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(land[0], land[1], 10 + 60 * expoOut(hit), (10 + 60 * expoOut(hit)) * .3, 0, 0, 6.29); ctx.stroke(); }
  }
  // ---- 8.03 – 8.05 the tower, the testers' house, the city (bottom + right: the card zone stays calm)
  if (t > A.stubborn + 1.6) {
    const sinkAll = sineIO(span(t, A.reached - .05, A.reached + 1.5));
    ctx.save(); ctx.translate(0, 440 * sinkAll);
    const tIn = A.stubborn + 1.6;
    const tw = expoOut(span(t, tIn + .2, tIn + 1.0)), hs = expoOut(span(t, tIn + .5, tIn + 1.3)), cy = expoOut(span(t, tIn + .8, tIn + 1.6));
    const road = sineIO(span(t, tIn, tIn + 1.6));
    lightPath(ctx, ROAD2, road, { w: 4 });
    rise(ctx, TOWER[0], TOWER[1], 300, tw, () => miniTower(ctx, TOWER[0], TOWER[1] - 4, 52, 250, t, 1));
    const warm = .45 + .55 * expoOut(span(t, A.purpose - .05, A.purpose + .7));
    rise(ctx, HOUSE[0], HOUSE[1], 110, hs, () => miniHouse(ctx, HOUSE[0], HOUSE[1] - 4, 92, t, { warm, open: expoOut(span(t, A.open - .05, A.open + .9)) }));
    rise(ctx, CITY[0], CITY[1], 90, cy, () => cityGlyph(ctx, CITY[0], CITY[1] - 4, 130, t));
    // 'Outside the companies': the gap between the tower and the house glows (it is real distance)
    const gap = expoOut(span(t, A.outside - .05, A.outside + .5)) * (1 - span(t, A.reached - .3, A.reached + .2));
    if (gap > 0) { ctx.fillStyle = rad(ctx, (TOWER[0] + HOUSE[0]) / 2 + 10, 300, 90, [[0, rgba(P.halo0, .4 * gap)], [1, rgba(P.halo0, 0)]]); ctx.fillRect(HOUSE[0] + 40, 200, TOWER[0] - HOUSE[0] - 50, 150); ctx.strokeStyle = rgba(P.core1, .8 * gap); ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.moveTo(HOUSE[0] + 60, 312); ctx.lineTo(TOWER[0] - 40, 312); ctx.stroke(); ctx.setLineDash([]); }
    // 8.03: the capsule rides from the tower and stops at the testers' house; the month ticks unroll
    const cap = sineIO(span(t, A.antib + .2, A.antib + 2.2));
    const capOut = span(t, A.backThen - .2, A.backThen + .3);
    if (cap > 0 && capOut < 1) { const x = lerp(TOWER[0] - 40, HOUSE[0] + 58, cap); K.capsule(ctx, x, 326, 26 * (1 - expoIn(capOut)), t, { cool: lerp(.8, .2, span(t, A.purpose, A.purpose + .7)) }); }
    const ticks = span(t, A.months - .05, A.months + 1.3) * (1 - span(t, A.reached - .2, A.reached + .2));
    if (ticks > 0) K.monthTicks(ctx, curve([HOUSE[0] + 60, 362], [TOWER[0] - 40, 362], 8), 6, ticks * 6, { size: 7 });
    // 8.04 ★ five findings leave the tower in a row; the fifth cracks and goes grey; the pill and the one-way door
    const tB = A.backThen;
    for (let i = 0; i < 5; i++) {
      const go = sineIO(span(t, tB + .4 + i * .2, tB + 1.4 + i * .2)); if (go <= 0) continue;
      const tx = 416 - i * 15, ty = 286;   // the row above the road between tower and house
      // 8.05: through the gate: the four warm ones pass the house and go on to the city; the grey one stays at the gate
      const pass = i < 4 ? sineIO(span(t, A.test + i * .35, A.test + 1.4 + i * .35)) : 0;
      let x = lerp(TOWER[0] - 26, tx, go), y = lerp(TOWER[1] - 120, ty, go);
      if (pass > 0) { const p2 = pathAt([[tx, ty], [HOUSE[0] + 20, 318], [HOUSE[0] - 30, 318], [CITY[0] + 70 + i * 10, 300 - i * 6]], pass); x = p2[0]; y = p2[1]; }
      const grey = i === 4 ? span(t, A.oneIn5 + .1, A.oneIn5 + .6) : 0;
      const rej = i === 4 ? sineIO(span(t, A.test + 1.6, A.test + 2.6)) : 0;   // the grey one falls off the road
      if (rej > 0) { x += 10 * rej; y += 60 * rej * rej; }
      const vanish = i === 4 ? expoIn(span(t, A.test + 2.2, A.test + 2.8)) : 0;
      if (vanish >= 1) continue;
      const inside = pass > .38 && pass < .62 ? 1 - Math.sin(Math.PI * (pass - .38) / .24) * .7 : 1;   // behind the house's front while passing
      point(ctx, x, y, 7 * (1 - vanish), 1 - grey, inside);
      if (i === 4) crack(ctx, x, y, 7, span(t, A.oneIn5 + .05, A.oneIn5 + .4));
    }
    // the pill passes a one-way door between the house and the city; the door shuts behind it
    {
      const k = sineIO(span(t, A.pill - .35, A.pill + .9)), shut = expoOut(span(t, A.pill + .55, A.pill + .9)), gone = span(t, A.insisted - .2, A.insisted + .3);
      if (k > 0 && gone < 1) {
        const dx = 182, gh = 46 * (1 - expoIn(gone));
        ctx.strokeStyle = rgba(P.halo0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(dx, 340); ctx.lineTo(dx, 340 - gh); ctx.stroke();       // the post
        const leafA = k < .4 ? 0 : 1 - shut;   // 1 = open (horizontal along the road, pointing toward the city), 0 = shut (vertical)
        ctx.strokeStyle = rgba(P.core1, .95); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(dx, 340 - gh * .1); ctx.lineTo(dx - Math.sin(leafA * Math.PI / 2) * gh * .9, 340 - gh * .1 - Math.cos(leafA * Math.PI / 2) * gh * .9); ctx.stroke();
        const px = lerp(HOUSE[0] - 40, CITY[0] + 50, k); if (gone < 1) K.capsule(ctx, px, 326, 22 * (1 - expoIn(gone)), t, { cool: .1 });
      }
    }
    // 8.05: every new machine, too: a cool disc rolls from the tower into the testers' house, before the city
    {
      const k = sineIO(span(t, A.machine + .1, A.machine + 1.6)); if (k > 0) { const x = lerp(TOWER[0] - 30, HOUSE[0] + 10, k), r = 15; ctx.save(); ctx.translate(x, 340 - r - 3); ctx.rotate(-(x - TOWER[0]) / r); ctx.fillStyle = rad(ctx, 0, 0, r * 2.4, [[0, rgba(COOL.mid, .4)], [1, rgba(COOL.edge, 0)]]); ctx.fillRect(-r * 2.4, -r * 2.4, r * 4.8, r * 4.8); ctx.fillStyle = rad(ctx, -4, -4, r, [[0, COOL.core], [1, COOL.edge]]); ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.29); ctx.fill(); ctx.strokeStyle = rgba(COOL.deep, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-r * .7, 0); ctx.lineTo(r * .7, 0); ctx.stroke(); ctx.restore(); }
    }
    ctx.restore();
  }
  ctx.restore();
}
