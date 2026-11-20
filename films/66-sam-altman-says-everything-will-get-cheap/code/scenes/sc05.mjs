// c05–c08 · B2 · stations 3–6 (THINGS · ENERGY · FOOD · HOUSING & LAND) · 'So far, every price' → 'So what does that do'.
// ONE continuous take for the whole group: this file holds the group (anchors, camera, world state, explainers); sc06/sc07/sc08 import it
// and return one entry each, so the inner chunk boundaries are the same function of t (identical frames on both sides).
// In: S.plateFactory (B1 → B2) for [R.a, R.a + .5) · Out: S.plateStairs (B2 → B3) for [R.b − .5, R.b). Plan: docs/shots.md 4.01–7.08.
// Strings: <ROOT>text-v3.md EINBLENDUNG lines (they win over F.SOURCES: '%' without the thin space, the phone lines as in text-v3).
//
// | ID     | anchor (phrase)                   | picture (one idea)                                                              | carrier → next | layer |
// |--------|-----------------------------------|---------------------------------------------------------------------------------|----------------|-------|
// | 4.01   | So far, every price               | out of plateFactory: tag 3 lights and swings; a heavy box drops out of the hatch | the box        | LAND  |
// | 4.02   | Elon Musk promises                | push in on the box on the belt; its lid opens …                                  | the lid        | SCENE |
// | 4.03   | slot:C2                           | … into the clip plate (C2, centre crop: no K logo, no "presented by")            | the plate      | CLIP  |
// | 4.04   | Any goods, for anyone             | the plate closes into the box; the belt starts, boxes stream                     | the boxes      | MIX   |
// | 4.05   | The robots are real               | robot arms clone along the factory window · 5,079,078 card                        | a box          | EXPL  |
// | 4.06   | And by the official numbers       | a phone grows out of a box on the belt, its screen line halves · −51% card       | the phone      | EXPL  |
// | 4.07   | But this year, analysts           | the line turns up (+27.6% card); the memory chip is pulled right by a cool beam  | the beam       | EXPL  |
// | 4.08 ★ | So the third tag does fall        | tag 3 close: drops, bumps back up, falls on · FALLS SLOWLY                       | the tag        | MIX   |
// | 4.09   | Because a thing is never          | tilt into the earth: MATERIALS · CHIPS · POWER; the cable lights and pulses      | the cable      | EXPL  |
// | 5.01   | Energy                            | follow the cable right to the power station; tag 4 comes down and lights         | tag 4          | LAND  |
// | 5.02   | Altman says where the falling     | the Gentle Singularity quote card (camera pulls wide behind it)                  | the cable      | EXPL  |
// | 5.03 ★ | That makes energy the floor       | the cable rises as a floor line, all tags sink onto it; it lifts: ENERGY +33%    | the floor      | EXPL  |
// | 5.04   | Unless AI can lower               | tags lift off, the floor sinks home; a small clean sun rises behind the station  | the sun        | MIX   |
// | 5.05   | slot:C3                           | the C3 plate grows out of the clean light and goes back into it                  | the sun        | CLIP  |
// | 5.06   | Radical abundance                 | RADICAL ABUNDANCE in gold · A FORECAST (cool) · ghost tags dip "further"         | the tags       | EXPL  |
// | 5.07   | For now, the fourth tag           | tag 4 rises a little · STAYS UP · FOR NOW; the sun sets                          | the cable      | MIX   |
// | 6.01   | One tag needs energy              | glide right: ENERGY · MACHINES · GROUND meet in the earth under the fields       | the labels     | MIX   |
// | 6.02   | Food. Remember                    | tag 5 comes down and lights · the food dollar again: 54¢ LABOR turns cool        | the bar        | EXPL  |
// | 6.03 ★ | But the ground under the food     | into the earth: the acre glows warm · U.S. CROPLAND: $6,020 AN ACRE              | the earth      | EXPL  |
// | 6.04   | So the fifth tag can fall         | tag 5 drops part of the way and is held · WORK OUT · GROUND STAYS                | the land       | MIX   |
// | 6.05   | Which leaves the tag              | glide right to the house on its plot                                             | the house      | LAND  |
// | 7.01   | Housing. The first word           | the turned tag comes down over the house and turns: HOUSING & LAND              | the tag        | MIX   |
// | 7.02   | Go back to his robot-built        | quote card, "on land you already own" lights gold                                | the plot       | EXPL  |
// | 7.03   | Even in his own picture           | the plot lights gold; you walk onto it, to the door                              | the house      | MIX   |
// | 7.04   | And in America                    | the house lifts off its ground · the bar THE HOUSE / THE GROUND ≈ 40%            | the walls      | EXPL  |
// | 7.05   | Robots can make walls cheap       | cool arms restack the walls fast; the ground does not grow                       | the quote      | MIX   |
// | 7.06   | Altman never hid this             | Three Observations quote card ("limited resources like land … rise" light)      | the tag        | EXPL  |
// | 7.07   | So the sixth tag stays hard       | tag 6 rises, earth weight at its foot · STAYS HARD                               | the tags       | MIX   |
// | 7.08 ★ | That makes Altman half right      | THUMBNAIL B: the tags come down into the rising row, tag 6 lands on the house and it becomes the gold house-tag → plateStairs | plateStairs | MIX |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f66_kit.mjs';
import * as S from '../lib/f66_world.mjs';
const { W, H, P, rgba, clamp, lerp, span, sineIO, expoOut, expoIn, smooth, mixHex, halo } = E;
const { rise, GOLD, COOL, EARTH, PAPER, LAMP } = F;
const TAU = Math.PI * 2, GY = S.GY;

export const PRINT = F.PRINT66;

// ------------------------------------------------------------------------------------------------ strings (text-v3 EINBLENDUNG)
const TXT = {
  robots: '5,079,078', robotsLabel: 'INDUSTRIAL ROBOTS IN OPERATION', robotsSrc: 'INTERNATIONAL FEDERATION OF ROBOTICS, SEPT 2026',
  phones: 'SMARTPHONES', phonesBig: '−51%', phonesSub: 'IN FIVE YEARS', phonesCpi: 'CONSUMER PRICE INDEX, QUALITY-ADJUSTED', phonesSrc: 'U.S. BLS, NOV 19, 2026',
  phones26: 'FORECAST 2026, AVERAGE SMARTPHONE PRICE', phones26Big: 'WORLDWIDE: +27.6% TO $581', phones26Src: 'IDC, AUG 2026',
  gentle: F.SOURCES.gentle, gentleSrc: F.SOURCES.gentleSrc,
  energy1: 'ENERGY +33%', energy2: 'IN FIVE YEARS', energySrc: 'U.S. BLS, NOV 19, 2026',
  foodSrc: F.SOURCES.foodSrc,
  crop1: 'U.S. CROPLAND:', cropBig: '$6,020', cropUnit: 'AN ACRE', crop2: 'FIRST TIME ABOVE $6,000', cropSrc: 'USDA, JULY 31, 2026',
  landQuote: F.SOURCES.landQuote, landQuoteSrc: F.SOURCES.landQuoteSrc,
  land40: 'LAND ≈ 40% OF U.S. HOME VALUE', land40Src: 'FHFA ESTIMATE (2022)',
  scarce: F.SOURCES.scarce, scarceSrc: F.SOURCES.scarceSrc,
};

// ------------------------------------------------------------------------------------------------ the group (memoised per timing)
const GROUPS = new WeakMap();
export function group(T) {
  if (GROUPS.has(T)) return GROUPS.get(T);
  E.prepareEditorial();
  const G = (p, after = -1) => T.G(p, 0, after), GE = (p, after = -1) => T.GE(p, 0, after);
  const word = (from, w, after = -1) => { const ws = T.GW(from, null, after), q = w.toLowerCase(); const x = ws.find((o) => o.w.toLowerCase().replace(/[^a-z0-9$]/g, '').startsWith(q)); return x ? x.s : ws[0].s; };
  const a = {};
  a.t0 = G('So far, every price'); a.drop = G('What about things you can drop', a.t0); a.foot = word('What about things you can drop on your foot', 'foot', a.t0);
  a.musk = G('Elon Musk promises', a.t0); a.said = word('Asked this summer whether some things should simply be free for everyone, he said', 'said', a.musk);
  a.c2 = T.clip('C2'); a.any = G('Any goods, for anyone', a.c2.start); a.look = G('So look at the goods', a.any);
  a.robots = G('The robots are real', a.look); a.five = G('more than five million', a.robots);
  a.official = G('And by the official numbers', a.robots); a.half = G('fell by half', a.official);
  a.thisYear = G('But this year, analysts', a.official); a.more = G('cost more again', a.thisYear); a.memory = G('the memory chips', a.thisYear);
  a.third = G('So the third tag does fall', a.memory); a.slowly = G('Slowly, and not', a.third); a.straight = G('straight line', a.slowly);
  a.never = G('Because a thing is never', a.third);
  a.mat = word("It's also materials, chips and power", 'materials', a.never); a.chips = word("It's also materials, chips and power", 'chips', a.never);
  a.pow = word("It's also materials, chips and power", 'power', a.never); a.under = G('And power sits under every tag', a.never);
  // c06
  a.energy = G('Energy', a.under); a.where = G('Altman says where the falling stops', a.energy);
  a.floor = G('That makes energy the floor', a.where); a.notFalling = G("And the floor isn't falling", a.floor); a.five5 = G('In five years, American energy', a.floor);
  a.third3 = G('about a third', a.five5); a.unless = G('Unless', a.third3); a.lower = G('can lower the floor itself', a.unless);
  a.demis = G('Demis Hassabis', a.unless); a.clean = G('crack clean energy', a.demis); a.name = G('He has a name for the world', a.demis);
  a.c3 = T.clip('C3'); a.radical = G('Radical abundance', a.c3.end - 1); a.forecast = G("It's a forecast", a.radical);
  a.ifTrue = G('But if it comes true', a.forecast); a.further = G('falls further', a.ifTrue); a.fourth = G('For now, the fourth tag stays up', a.ifTrue);
  // c07
  a.one = G('One tag needs energy', a.fourth);
  a.wEnergy = word('One tag needs energy, machines, and something no factory can make', 'energy', a.fourth);
  a.wMach = word('One tag needs energy, machines, and something no factory can make', 'machines', a.fourth);
  a.wSome = word('One tag needs energy, machines, and something no factory can make', 'something', a.fourth);
  a.food = G('Food. Remember', a.one); a.remember = G('Remember the food dollar', a.food); a.work = G('more than half is work', a.remember);
  a.take = G('Machines can take much', a.remember); a.ground = G('But the ground under the food', a.take); a.record = G('just set a record', a.ground);
  a.crop = G('American cropland has never', a.ground); a.fifth = G('So the fifth tag can fall', a.crop); a.workOut = G('the work comes out', a.fifth);
  a.stays = G('the ground stays in', a.fifth); a.leaves = G('Which leaves the tag', a.fifth);
  // c08
  a.housing = G('Housing. The first word', a.leaves); a.firstWord = G('The first word on his list', a.housing);
  a.goBack = G('Go back to his robot-built', a.housing); a.listen = G('Listen to how that sentence', a.goBack); a.onLand = G('on land you already own', a.listen);
  a.even = G('Even in his own picture', a.listen); a.paid = G('already paid for', a.even);
  a.america = G('And in America', a.even); a.forty = G('about forty cents', a.america); a.isnt = G("isn't the house", a.america); a.groundUnder = G("It's the ground under it", a.america);
  a.walls = G('Robots can make walls cheap', a.america); a.cant = G("They can't make more ground", a.walls);
  a.hid = G('Altman never hid this', a.walls); a.wrote = G('He wrote it himself', a.hid);
  a.sixth = G('So the sixth tag stays hard', a.hid); a.rise = G('It may even rise', a.sixth);
  a.halfR = G('That makes Altman half right', a.sixth); a.machT = G('Machines can take the work out', a.halfR); a.scarce = G("They can't take out what's scarce", a.halfR);
  a.knows = G('And he knows which half', a.halfR); a.end = G('So what does that do', a.knows);
  const g = { a, draw: scene(a, T) };
  GROUPS.set(T, g); return g;
}

// C2 holds its frame 277 while the plate closes (see the scene): load it now so a render piece that starts there has it too
export const preload = (T) => F.prepareClipFrames(T, group(T).a.c2.start + 276.5 / 30);
export default async (T, R) => {
  const g = group(T); await preload(T);
  return [{ t: R.a, draw: g.draw, print: PRINT }];
};

// ------------------------------------------------------------------------------------------------ helpers
const CL = (u, v, s = 1, sx, sy) => E.aim(S.Z_LAND, u, v, s, sx, sy);
const ST = S.STATIONS, TAG_H = S.TAG_W * 1.42;
const VT = S.VERDICT_TAGS;
const lerpCam = (A, B, w) => ({ ...A, x: lerp(A.x, B.x, w), y: lerp(A.y, B.y, w), z: lerp(A.z, B.z, w), f: lerp(A.f, B.f, w) });
const bump = F.bump;
// a soft landing with one small overshoot (dy in px; positive = below the target)
const settle = (u) => { u = clamp(u); if (u <= 0) return 0; const k = 1 - (1 - Math.min(1, u / .7)) ** 3; return k + .06 * Math.sin(Math.PI * span(u, .55, 1)); };
// the integral of smoothstep: a belt that starts softly (offset in seconds of full speed)
const ramp = (t, t0, r) => { const x = (t - t0) / r; if (x <= 0) return 0; return x < 1 ? r * (x ** 3 - x ** 4 / 2) : r * (x - .5); };

// a night card with a gold edge; every line ≥ 22 px (local: the kit's dataCard writes 15–21 px lines)
function numCard(ctx, t, x, y, w, o) {
  const u = clamp(o.u ?? 1); if (u <= 0) return null;
  const lines = [];
  let yy = 34;
  if (o.kind) yy += 50;
  if (o.title) { yy += 30; lines.push(['title', yy]); yy += 6; }
  if (o.title2) { yy += 32; lines.push(['title2', yy]); yy += 6; }
  if (o.big) { yy += (o.bigSize ?? 92) * .98; lines.push(['big', yy]); yy += 12; }
  if (o.sub) { yy += 32; lines.push(['sub', yy]); }
  if (o.sub2) { yy += 34; lines.push(['sub2', yy]); }
  const h = yy + 36;
  F.paperCard(ctx, t, x, y, w, h, { u, style: 'night', rot: o.rot ?? .004 });
  ctx.save(); ctx.globalAlpha *= clamp(u * 3); ctx.translate(x, y + (1 - expoOut(u)) * 40);
  if (o.kind) {
    const kc = o.kind === 'FORECAST' ? COOL.body : GOLD.body, tw = F.measure(o.kind, 22, false, 600) + 22 * o.kind.length * .14 + 34;
    ctx.fillStyle = rgba(kc, .16); ctx.strokeStyle = rgba(kc, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(32, 30, tw, 40, 20); ctx.fill(); ctx.stroke();
    E.glowText(ctx, o.kind, 32 + 17, 58, { size: 22, weight: 600, spacing: .14, col: kc, glow: false });
  }
  for (const [k, ly] of lines) {
    const d = { title: .2, title2: .28, big: .35, sub: .5, sub2: .58 }[k], uu = rise(span(u, d, d + .5));
    if (k === 'big') F.goldText(ctx, [[o.big, o.bigGold ?? 1]], 32, ly, o.bigSize ?? 92, uu, { serif: true });
    else F.maskLine(ctx, [[o[k], 0]], 34, ly, k === 'sub2' ? 22 : 24, uu, { serif: false, weight: 600, col: k.startsWith('title') ? P.halo2 : P.cream, glow: false });
  }
  ctx.restore();
  return { x, y, w, h };
}
// a flat robot arm (same build as the world's factory arms): base, two links, a gripper with a cool light
function arm(ctx, ax, by, t, ph, s = 1, a = 1, grow = 1) {
  if (grow <= 0) return;
  const a1 = -.9 + .35 * Math.sin(t * 1.3 + ph), a2 = 1.2 + .4 * Math.sin(t * 1.3 + ph + 1.1), L1 = 50 * s * grow, L2 = 42 * s * clamp(grow * 1.4 - .4);
  const p0 = [ax, by - 26 * s], p1 = [ax + Math.cos(a1) * L1, by - 30 * s + Math.sin(a1) * L1], p2 = [p1[0] + Math.cos(a1 + a2) * L2, p1[1] + Math.sin(a1 + a2) * L2];
  ctx.save(); ctx.globalAlpha *= a;
  ctx.strokeStyle = P.night0; ctx.lineCap = 'round'; ctx.lineWidth = 9 * s; ctx.beginPath(); ctx.moveTo(...p0); ctx.lineTo(...p1); if (L2 > 0) ctx.lineTo(...p2); ctx.stroke();
  ctx.fillStyle = P.night0; ctx.fillRect(ax - 14 * s, by - 30 * s, 28 * s, 10 * s);
  if (L2 > 0) { ctx.beginPath(); ctx.arc(p2[0], p2[1], 7 * s, 0, TAU); ctx.fill(); halo(ctx, p2[0], p2[1], 18 * s, .3 * grow, COOL.halo, COOL.core); }
  ctx.restore();
}
// a cardboard-ish box in the night palette (land px): x = centre, y = bottom; flaps 0..1 open; squash > 0 = flattened on impact
function box(ctx, x, y, w, h, o = {}) {
  const sq = o.squash ?? 0, ww = w * (1 + .14 * sq), hh = h * (1 - .14 * sq), fl = clamp(o.flaps ?? 0);
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  const body = mixHex(EARTH.top, P.ind1, .5), lit = mixHex(EARTH.line, P.ind2, .35);
  ctx.fillStyle = E.lin(ctx, -ww / 2, -hh, ww / 2, 0, [[0, lit], [1, body]]); ctx.fillRect(-ww / 2, -hh, ww, hh);
  ctx.fillStyle = rgba(P.night0, .35); ctx.fillRect(-ww / 2, -hh * .52, ww, hh * .08);   // the tape
  ctx.fillStyle = rgba(COOL.body, .5); ctx.fillRect(-ww * .36, -hh * .78, ww * .22, hh * .12);   // a label
  if (fl > 0) {   // two flaps open up and out (hinged at the top edges)
    for (const sgn of [-1, 1]) {
      ctx.save(); ctx.translate(sgn * ww / 2, -hh); ctx.rotate(sgn * (Math.PI * .82) * expoOut(fl)); ctx.fillStyle = lit; ctx.fillRect(sgn > 0 ? -ww / 2 : 0, -2, ww / 2, 4); ctx.restore();
    }
    if (o.glow) halo(ctx, 0, -hh, ww * 1.6, .55 * o.glow, P.halo2, P.cream);
  }
  ctx.restore();
}
// the phone (screen space): dark body, cool screen with a price line (halves), an uptick (gold, the price) and its memory chip
function phone(ctx, t, x, y, w, o) {
  const h = w * 1.95, r = w * .14;
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot ?? 0);
  ctx.fillStyle = rgba(P.night0, .45); ctx.beginPath(); ctx.roundRect(-w / 2 + 8, -h / 2 + 12, w, h, r); ctx.fill();
  ctx.fillStyle = mixHex(P.night0, P.ind1, .4); ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, r); ctx.fill();
  ctx.strokeStyle = rgba(COOL.line, .5); ctx.lineWidth = Math.max(1.5, w * .008); ctx.stroke();
  const sx = -w / 2 + w * .07, sy = -h / 2 + w * .1, sw = w * .86, sh = h - w * .2;
  ctx.fillStyle = E.lin(ctx, 0, sy, 0, sy + sh, [[0, mixHex(COOL.deep, P.ind2, .3)], [1, mixHex(P.night1, COOL.deep, .5)]]); ctx.beginPath(); ctx.roundRect(sx, sy, sw, sh, r * .6); ctx.fill();
  halo(ctx, 0, sy + sh * .3, sw * .9, .18, COOL.halo, COOL.core);
  // the price line: 5 years, falls to half (cool); then the uptick (gold) on "cost more again"
  const lu = clamp(o.line ?? 0), up = clamp(o.up ?? 0);
  const x0 = sx + sw * .12, x1 = sx + sw * .78, yTop = sy + sh * .28, yHalf = sy + sh * .62;
  const pts = []; for (let i = 0; i <= 20; i++) { const f = i / 20; pts.push([lerp(x0, x1, f), lerp(yTop, yHalf, f) + Math.sin(f * 9) * sh * .012]); }
  ctx.strokeStyle = rgba(COOL.line, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0, yTop); ctx.lineTo(x0, yHalf + sh * .1); ctx.lineTo(x1 + sw * .12, yHalf + sh * .1); ctx.stroke();
  if (lu > 0) {
    const n = Math.max(2, Math.round(20 * lu) + 1), sub = pts.slice(0, n);
    ctx.strokeStyle = COOL.core; ctx.lineWidth = Math.max(2, w * .018); ctx.lineJoin = 'round'; ctx.beginPath(); sub.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.stroke();
    const e = sub[sub.length - 1]; halo(ctx, e[0], e[1], w * .08, .7, COOL.halo, COOL.core);
  }
  if (up > 0) F.goldSpan(ctx, [[x1, yHalf], [x1 + sw * .14, yHalf - sh * .2]], 0, expoOut(up), { w: Math.max(2, w * .016) });
  ctx.restore();
  return { x, y, w, h, chip: [x + w * .2, y + h * .3] };
}
function chip(ctx, x, y, s, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y);
  ctx.fillStyle = P.night0; ctx.fillRect(-s / 2, -s / 2, s, s);
  ctx.fillStyle = rgba(COOL.body, .9); for (let i = 0; i < 4; i++) { const d = -s / 2 + s * (.2 + i * .2); ctx.fillRect(d - 1.5, -s / 2 - 7, 3, 7); ctx.fillRect(d - 1.5, s / 2, 3, 7); }
  ctx.strokeStyle = rgba(COOL.line, .8); ctx.lineWidth = 1.5; ctx.strokeRect(-s / 2 + 5, -s / 2 + 5, s - 10, s - 10);
  ctx.restore();
}
// a flat house (screen space, the walls-vs-ground explainer): x = centre, y = the foot of the walls
function flatHouse(ctx, t, x, y, w, o = {}) {
  const hw = w / 2, wh = w * .62, rows = 6, sweep = clamp(o.sweep ?? 0), cool = clamp(o.cool ?? 0);
  const wallC = mixHex(P.ind1, P.blue1, .35);
  for (let i = 0; i < rows; i++) {   // the cool sweep: each row is set again by the arms, bottom → top, fast
    const ri = clamp(sweep * rows - i), yy = y - (i + 1) * wh / rows, drop = ri > 0 && ri < 1 ? -(1 - expoOut(ri)) * 22 : 0;
    ctx.fillStyle = mixHex(mixHex(wallC, COOL.deep, .7 * ri * cool), COOL.body, .06 * (i % 2) + .35 * (ri > 0 && ri < 1 ? 1 - ri : 0) * cool); ctx.fillRect(x - hw, yy + drop, w, wh / rows + 1);
  }
  {
    ctx.fillStyle = wallC; ctx.beginPath(); ctx.moveTo(x - hw - w * .08, y - wh); ctx.lineTo(x, y - wh - w * .42); ctx.lineTo(x + hw + w * .08, y - wh); ctx.closePath(); ctx.fill();
    ctx.fillRect(x + w * .2, y - wh - w * .4, w * .1, w * .22);
    ctx.fillStyle = rgba(LAMP.body, .85); ctx.fillRect(x - w * .3, y - wh * .7, w * .2, w * .18); ctx.fillStyle = rgba(LAMP.body, .6); ctx.fillRect(x + w * .08, y - wh * .55, w * .16, wh * .55);
  }
}

// ------------------------------------------------------------------------------------------------ the scene
function scene(a, T) {
  const tA = a.t0 + S.SEAM_HALF, tP = a.end - S.SEAM_HALF;   // plate in, plate out
  const tSeed = a.c3.start;                                  // tags 1–3 change to the stairs seeds while off frame (behind the C3 plate)
  // ---------------------------------------------------------------- camera
  const creepIn = (t) => { const k = 1 + S.CREEP * (t - (a.t0 - S.SEAM_HALF)); return S.FACTORY_CAM(k, S.trk(k) * .3); };
  const K = [
    [tA, creepIn(tA)],
    [a.drop + .2, CL(3110, 655, 1.45)],
    [a.foot + .4, CL(3135, 680, 1.5)],
    [a.musk + 2.6, CL(3300, 800, 2.2)],
    [a.c2.start - .9, CL(3336, 840, 3.0)],
    [a.c2.end + .6, CL(3350, 838, 2.8)],
    [a.robots + 1.4, CL(3000, 700, 1.3)],
    [a.official + .6, CL(3070, 720, 1.34)],
    [a.third - 1.0, CL(3060, 690, 1.4)],
    [a.third + 1.1, CL(2950, 545, 2.3)],
    [a.straight + .7, CL(2956, 548, 2.4)],
    [a.never + 1.9, CL(3020, 1000, 1.45)],
    [a.under + .2, CL(3120, 985, 1.42)],
    [a.energy - .2, CL(3520, 880, 1.3)],
    [a.where + .9, CL(3870, 650, 1.45)],
    [a.floor - .3, CL(2900, 620, .8)],
    [a.third3 + 1.0, CL(2880, 626, .82)],
    [a.demis + .6, CL(3800, 620, 1.25)],
    [a.c3.start - .9, CL(3770, 660, 1.95)],
    [a.c3.end + .6, CL(3740, 640, 1.75)],
    [a.ifTrue + .3, CL(3110, 560, .84)],
    [a.fourth + .6, CL(3560, 570, 1.08)],
    [a.food - .3, CL(4800, 880, 1.22)],
    [a.food + 1.2, CL(4850, 760, 1.28)],
    [a.fifth - .3, CL(4846, 770, 1.3)],
    [a.fifth + 1.6, CL(4852, 690, 1.42)],
    [a.leaves - .1, CL(4866, 688, 1.44)],
    [a.housing + .5, CL(5800, 610, 1.55)],
    [a.goBack + .7, CL(5792, 640, 1.5)],
    [a.onLand + 1.0, CL(5786, 655, 1.5)],
    [a.even + 1.3, CL(5760, 855, 1.55)],
    [a.america + .4, CL(5752, 862, 1.6)],
    [a.sixth - .8, CL(5800, 560, 1.85)],
    [a.halfR + .2, CL(5806, 562, 1.86)],
    [tP, S.STAIRS_CAM(1, 0)],
  ];
  const creepOut = (t) => { const k = 1 + S.CREEP * (t - tP); return S.STAIRS_CAM(k, S.trk(k) * .3); };
  const camRaw = (t) => {
    if (t >= tP) return creepOut(t);
    const p = F.camPath(t, K);
    return t < tA + 2 ? lerpCam(creepIn(t), p, smooth(span(t, tA, tA + 2))) : p;
  };
  // the shake of the heavy box (a few px, decays fast)
  const shake = (t) => { const s = span(t, a.boxHit, a.boxHit + .5); return s > 0 && s < 1 ? (1 - s) ** 2 * Math.sin(s * 40) * 5 : 0; };
  const cam = (t) => {
    const c = E.camDrift(camRaw(t), t, 5 * smooth(span(t, tA, tA + 2.5)) * (1 - smooth(span(t, tP - 2.4, tP))), 7);
    return { ...c, y: c.y + shake(t) };
  };

  // ---------------------------------------------------------------- the box (4.01–4.04) and the belt outside the factory
  const HATCH = { x: 3238, y0: 752, y1: 812 }, WALL = 3250, LEDGE = 3292, BELT = { x0: 3262, x1: 3480, y: GY - 18 }, BW = 66, BH = 50, LANDX = 3336;
  a.boxOut = a.drop + .35; a.boxEdge = a.foot - .35; a.boxHit = a.foot + .05;
  const tBelt = a.any + .2, VB = 62, beltS = (t) => VB * ramp(t, tBelt, 1.6);
  function boxPos(t) {   // the first (Musk's) box
    if (t < a.boxOut) return null;
    if (t < a.boxEdge) { const u = expoOut(span(t, a.boxOut, a.boxEdge - .1)); return { x: lerp(WALL - BW / 2 - 4, LEDGE - 6, u), y: HATCH.y1, rot: 0, sq: 0 }; }
    if (t < a.boxHit) { const u = span(t, a.boxEdge, a.boxHit), tip = sineIO(span(u, 0, .45)); const fall = span(u, .35, 1) ** 2;
      return { x: lerp(LEDGE - 6, LANDX, smooth(span(u, .25, 1))), y: lerp(HATCH.y1, BELT.y, fall), rot: .35 * tip * (1 - fall) + .1 * fall, sq: 0 }; }
    const s = span(t, a.boxHit, a.boxHit + .45), sq = s < 1 ? Math.sin(Math.PI * Math.min(1, s * 2)) * (1 - s) : 0;
    return { x: LANDX + beltS(t), y: BELT.y, rot: .1 * (1 - expoOut(s)), sq };
  }
  const lidOpen = (t) => smooth(span(t, a.said - .4, a.c2.start - .1)) * (1 - smooth(span(t, a.c2.end + .6, a.c2.end + 1.3)));
  const plateMorph = (t, c) => sineIO(span(t, c.start - 1.4, c.start + .4)) * (1 - sineIO(span(t, c.end - 1.0, c.end + .78)));   // ≥ 1.8 s (big area); footage frames are cached up to end + .8
  function belt(ctx, t) {
    // the hatch in the factory's right wall (cool light, the belt inside ends here) and the belt outside, into a crate
    const ho = expoOut(span(t, a.drop - .5, a.boxOut)), bl = sineIO(span(t, tA, a.drop + .3)), bx1 = lerp(BELT.x0, BELT.x1, bl);
    if (ho > 0) { const hh = (HATCH.y1 - HATCH.y0) * ho; ctx.fillStyle = mixHex(P.ind1, COOL.deep, .6); ctx.fillRect(WALL - 28, HATCH.y1 - hh, 28, hh);
      halo(ctx, HATCH.x, HATCH.y1 - hh / 2, 36, .25 * ho, COOL.halo, COOL.core); }
    if (bl > 0) { ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(BELT.x0, BELT.y, bx1 - BELT.x0, 7);
      for (let x = BELT.x0 + 14; x < bx1 - 4; x += 52) ctx.fillRect(x, BELT.y + 7, 5, GY - BELT.y - 7);
      const ph = (beltS(t) % 18); ctx.fillStyle = rgba(COOL.line, .35); for (let x = BELT.x0 + ph; x < bx1 - 4; x += 18) ctx.fillRect(x, BELT.y + 2, 6, 2); }
    // the stream: a new box out of the hatch every 1.15 s once the belt runs (each falls onto the belt, then rides it)
    if (ho > 0) { ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.fillRect(WALL, HATCH.y1, (LEDGE + 8 - WALL) * ho, 6); }   // the ledge
    ctx.save(); ctx.beginPath(); ctx.rect(WALL, 0, BELT.x1 - WALL + 14, 2000); ctx.clip();   // boxes come out of the wall (mask)
    const n = Math.floor((t - tBelt - .6) / 1.15);
    for (let i = Math.max(1, n - 6); i <= n; i++) {
      const te = tBelt + .6 + i * 1.15, u = span(t, te, te + .7);
      let x, y, rot = 0;
      if (u < .45) { x = lerp(WALL - BW / 2 - 4, LEDGE - 6, expoOut(u / .45)); y = HATCH.y1; }
      else { const f = span(u, .45, 1) ** 2; x = lerp(LEDGE - 6, LANDX, smooth(span(u, .45, 1))); y = lerp(HATCH.y1, BELT.y, f); rot = .2 * (1 - f); }
      if (u >= 1) { x = LANDX + beltS(t) - beltS(te + .7); y = BELT.y; }
      if (x > BELT.x1 + 30) continue;
      box(ctx, x, y, BW, BH, { rot, squash: .4 * bump(t, te + .7, .3) });
    }
    const p = boxPos(t);
    if (p && p.x < BELT.x1 + 30) box(ctx, p.x, p.y, BW, BH, { rot: p.rot, squash: p.sq, flaps: lidOpen(t), glow: lidOpen(t) });
    ctx.restore();
    // the crate at the belt's end (its front hides the boxes that drop in)
    ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(BELT.x1 + 6, GY - 70, 96, 70); ctx.fillStyle = rgba(EARTH.line, .25); ctx.fillRect(BELT.x1 + 6, GY - 70, 96, 4);
  }
  const boxRect = (c, t) => { const p = boxPos(t); if (!p) return null; const q = E.project(c, S.Z_LAND, p.x - BW / 2, p.y - BH), r = E.project(c, S.Z_LAND, p.x + BW / 2, p.y); return q && r ? { x: q[0], y: q[1] - 4, w: r[0] - q[0], h: (r[1] - q[1]) * .5 } : null; };

  // ---------------------------------------------------------------- the factory's arms clone (4.05)
  const armsU = (t) => span(t, a.robots + .2, a.robots + 2.0) * (1 - smooth(span(t, a.third, a.third + 1.2)));
  function moreArms(ctx, t) {
    const u = armsU(t); if (u <= 0) return;
    const wx = 2690, wy = 740, ww = 520, wh = 110, xs = [.12, .22, .45, .55, .84, .93];
    ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
    xs.forEach((f, i) => { const g = expoOut(span(u, i * .1, i * .1 + .45)); arm(ctx, wx + ww * f, wy + wh, t, i * 1.3 + .4, .85, 1, g); });
    ctx.restore();
  }

  // ---------------------------------------------------------------- the earth layers (4.09): pebbles (materials), chips, the cable
  const matU = (t) => span(t, a.mat - .1, a.mat + .5), chipU = (t) => span(t, a.chips - .1, a.chips + .5);
  const powerU = (t) => lerp(0, 1, smooth(span(t, a.pow - .15, a.pow + .6))) - .7 * smooth(span(t, a.fourth, a.one + 3));
  const PEB = []; { const r = E.prng(551); for (let i = 0; i < 40; i++) PEB.push([2500 + r() * 1300, 1024 + r() * 40, 6 + r() * 12, r()]); }
  const CHP = []; { const r = E.prng(553); for (let i = 0; i < 16; i++) CHP.push([2560 + r() * 1200, 1090 + r() * 40, r()]); }
  function earthLayers(ctx, t) {
    const m = matU(t), c = chipU(t), out = 1 - span(t, a.energy + 1, a.energy + 3);
    if (m * out <= 0 && c * out <= 0) return;
    for (const [x, y, s, q] of PEB) { ctx.fillStyle = rgba(mixHex(EARTH.top, EARTH.line, .4 + .5 * (q > .4 ? 1 : .5)), m * out); ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y - s * .7); ctx.lineTo(x + s, y - s * .2); ctx.lineTo(x + s * .6, y + s * .5); ctx.closePath(); ctx.fill(); }
    for (const [x, y, q] of CHP) { ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .4), c * out); ctx.fillRect(x - 9, y - 9, 18, 18); ctx.fillStyle = rgba(COOL.body, .9 * c * out); ctx.fillRect(x - 5, y - 5, 10, 10); if (c * out > .1) halo(ctx, x, y, 22, .3 * c * out * (q > .5 ? 1 : .6), COOL.halo, COOL.core); }
  }

  // ---------------------------------------------------------------- the station tags
  const TDOWN = 760;   // a tag comes down from above the frame on its thread
  const t3light = (t) => smooth(span(t, tA, tA + .9));
  // tag 3 (index 2): falls slowly (4.08) → VERDICT dy 40
  const tag3dy = (t) => 62 * expoOut(span(t, a.third + .05, a.third + .75)) - 38 * sineIO(span(t, a.slowly + .1, a.slowly + .9)) + 16 * sineIO(span(t, a.straight - .1, a.straight + .9));
  // the floor (5.03): the cable rises to a floor line; the tags sink onto it; it lifts by a third; then it sinks home and the tags lift off
  const FLOOR0 = GY + 64, FLOOR1 = 708;
  const floorY = (t) => lerp(FLOOR0, FLOOR1, sineIO(span(t, a.floor - .15, a.floor + 1.2))) - 46 * sineIO(span(t, a.third3 - .3, a.third3 + 1.1))
    + (FLOOR0 - FLOOR1 + 46) * sineIO(span(t, a.unless + .3, a.unless + 2.5));
  const floorA = (t) => span(t, a.floor - .15, a.floor + .2) * (1 - span(t, a.unless + 2.3, a.unless + 2.6));
  const sinkU = (i, t) => settle(span(t, a.floor + .9 + i * .18, a.floor + 2.1 + i * .18)) * (1 - sineIO(span(t, a.unless + .3 + i * .1, a.unless + 2.1 + i * .1)));
  const floorDy = (i, base, t) => { const s = sinkU(i, t); return s > 0 ? s * (floorY(t) - TAG_H * .9 - S.TAG_Y - base) : 0; };
  // the ghost dip (5.06): "every other tag falls further"
  const ghostU = (t) => sineIO(span(t, a.further - .3, a.further + 1.0)) * (1 - sineIO(span(t, a.fourth + .1, a.fourth + 1.4)));
  // tag 4 (index 3)
  const t4down = (t) => span(t, a.energy - .3, a.energy + 1.3);
  const t4dy = (t) => -20 * sineIO(span(t, a.fourth + .1, a.fourth + 1.2));
  // tag 5 (index 4): comes down on "Food", drops part of the way, is held (→ dy 30)
  const t5down = (t) => span(t, a.food - .25, a.food + 1.2);
  const t5dy = (t) => 72 * expoIn(span(t, a.fifth + .05, a.fifth + .5)) ** .6 - 42 * expoOut(span(t, a.stays - .05, a.stays + .5)) + 4 * bump(t, a.stays + .3, .5);
  // tag 6 (index 5): comes down turned over the house, turns on "The first word", stays hard
  const t6down = (t) => span(t, a.housing - .4, a.housing + 1.2);
  const t6back = (t) => 1 - sineIO(span(t, a.firstWord - .1, a.firstWord + 1.2));
  const t6dy = (t) => -14 * sineIO(span(t, a.sixth + .1, a.sixth + 1.0)) - 16 * sineIO(span(t, a.rise, a.rise + .9));
  const t6heavy = (t) => sineIO(span(t, a.sixth + .1, a.sixth + 1.2));
  // the stairs (7.08): slot k ← station STAIRS.slots[k]; tags 1–4 come down from the sky into their slots, tag 5 glides over from its
  // station; tag 6 lands on the house and becomes the house-tag
  const SL = S.STAIRS, slotOf = (si) => SL.slots.indexOf(si);
  const flyT = (k) => a.halfR + .5 + [0, .55, 1.1, 2.3, 1.65][k];
  const flyU = (k, t) => span(t, flyT(k), flyT(k) + 1.7);
  const houseT0 = a.scarce - .9, houseU = (t) => span(t, houseT0, houseT0 + 2.0);
  const tSwap = houseT0 + 2.0;   // the world's house-tag takes over (identical picture)
  const stairState = (k) => { const si = SL.slots[k], w = SL.ws[k], h = w * 1.42; return { x: SL.xs[k], y: GY - h * .9, w, thread: 0, rot: 0, glow: .55 + .45 * k / 4, dust: [.75, .45, .18, 0, 0][k], seed: 90 + k, lines: [[String(si + 1), w * .36, 0, true]] }; };

  function hanging(t) {   // the world's station tags (land card), index 0..5; null = not drawn by the world
    const late = t >= tSeed, tags = [];
    const ghostless = (o) => o;
    // 1 (fallen) and 2 (split)
    for (const i of [0, 1]) tags[i] = flyU(slotOf(i), t) > 0 ? null : ghostless({ ...VT[i], seed: late ? 90 + i : 20 + i, dy: (VT[i].dy ?? 0) + floorDy(i, VT[i].dy ?? 0, t) });
    // 3 (things)
    { const lit = t3light(t), dim = span(t, a.energy - .4, a.energy + .8);
      const glow = lerp(lerp(.3, 1, lit), .6, dim), base = tag3dy(t);
      tags[2] = flyU(slotOf(2), t) > 0 ? null : { glow, dy: base + floorDy(2, 40, t), seed: late ? 92 : 22,
        swing: .2 * bump(t, tA, 1.6) * Math.sin((t - tA) * 4.2) + .07 * bump(t, a.boxHit + .06, .9) * Math.sin((t - a.boxHit) * 9) + .05 * bump(t, a.slowly, 1.4) * Math.sin(t * 5) };
    }
    // 4 (energy)
    { const d = t4down(t); if (d > 0 && flyU(slotOf(3), t) <= 0) {
      const glow = lerp(.3, 1, span(t, a.energy - .1, a.energy + .9)) - .3 * span(t, a.fourth + .8, a.one + 2) - .4 * span(t, a.demis, a.demis + 1.5) * (1 - span(t, a.fourth - .4, a.fourth + .4));
      tags[3] = { glow, dy: -TDOWN * (1 - settle(d)) + t4dy(t) + floorDy(3, 0, t), seed: 94, swing: .08 * (1 - d) };
    } }
    // 5 (food): it glides over to its slot in 7.08 (drawn by the land layer then)
    { const d = t5down(t); if (d > 0 && flyU(slotOf(4), t) <= 0) {
      const glow = lerp(.3, 1, span(t, a.food - .1, a.food + .9)) - .35 * span(t, a.leaves, a.housing + 1);
      tags[4] = { glow, dy: -TDOWN * (1 - settle(d)) + t5dy(t), seed: 93, swing: .08 * (1 - d) + .05 * bump(t, a.stays, 1) * Math.sin(t * 7) };
    } }
    tags[5] = null;   // tag 6 is drawn by the land layer (it lands on the house)
    tags[6] = null;
    return tags;
  }
  // tag 6 (land layer, drawn after the world's tags so it covers the house while it lands)
  function tag6(ctx, t) {
    const d = t6down(t); if (d <= 0 || t >= tSwap) return;
    const hu = sineIO(houseU(t)), HW = SL.house.w, hy = GY - HW * 1.42 * .9;
    const y0 = S.TAG_Y - TDOWN * (1 - settle(d)) + t6dy(t), w = lerp(S.TAG_W, HW, hu), y = lerp(y0, hy, hu);
    const glow = lerp(.3, 1, span(t, a.firstWord, a.firstWord + .8)) * (1 - .25 * span(t, a.hid, a.hid + 1) * (1 - span(t, a.sixth - .4, a.sixth + .4)));
    ctx.save();
    if (hu > 0) { ctx.beginPath(); ctx.rect(-1e4, -1e4, 2e4, 1e4 + GY); ctx.clip(); }   // the earth covers what is below the ground (as in the world)
    F.tag(ctx, t, SL.house.x, y, w, { back: t6back(t), glow: Math.max(glow, hu), heavy: t6heavy(t) * (1 - hu), house: hu, thread: 2400 * (1 - expoIn(span(hu, .5, .95))), seed: 66, rot: 0,
      swing: .1 * (1 - d) * Math.sin(t * 3), lines: hu < .5 ? [['HOUSING', 17, 0, false], ['& LAND', 17, 0, false]] : [], textU: (1 - t6back(t)) * (1 - span(hu, .1, .45)) });
    // the door lights as it lands (the world's house-tag has it)
    const dl = span(t, tSwap - .6, tSwap - .05);
    if (dl > 0) { ctx.fillStyle = rgba(GOLD.core, .9 * dl); ctx.fillRect(SL.house.x - 26, GY - 120, 52, 120); halo(ctx, SL.house.x, GY - 50, 120, .4 * dl, GOLD.halo, GOLD.core); }
    ctx.restore();
  }
  function flying(ctx, t) {   // 7.08: tags into the stairs
    for (let k = 0; k < 5; k++) {
      const u = flyU(k, t); if (u <= 0) continue;
      const si = SL.slots[k], fin = stairState(k), uu = settle(u);
      let x0, y0, w0 = S.TAG_W, from = { glow: .6, dust: 0, split: 0 };
      if (si === 4) { x0 = ST[4].x; y0 = S.TAG_Y + t5dy(t); from = { glow: .65, dust: 0, split: 0 }; }
      else { x0 = fin.x - 60; y0 = fin.y - 760; from = { ...VT[si], dust: VT[si].dust ?? 0, split: VT[si].split ?? 0 }; }
      const x = lerp(x0, fin.x, si === 4 ? sineIO(u) : expoOut(u)), y = lerp(y0, fin.y, uu) - (si === 4 ? 110 * Math.sin(Math.PI * clamp(u)) : 0);
      const w = lerp(w0, fin.w, sineIO(u));
      F.tag(ctx, t, x, y, w, { thread: si === 4 ? 2400 * (1 - expoIn(span(u, .4, .9))) : 2400 * (1 - expoIn(span(u, .55, .95))), rot: 0, swing: .12 * Math.sin(Math.PI * u) * (si === 4 ? -1 : 1),
        glow: lerp(from.glow, fin.glow, u), dust: lerp(from.dust, fin.dust, u), split: from.split * (1 - sineIO(span(u, .2, .8))), seed: fin.seed,
        lines: fin.lines, textU: span(u, .55, .85) });
    }
  }
  function ghosts(ctx, t) {
    const g = ghostU(t); if (g <= 0) return;
    for (const [i, base] of [[0, 70], [1, 0], [2, 40], [3, 0]]) {
      const x = ST[i].x, dy = base + t4dy(t) * (i === 3 ? 1 : 0);
      F.tag(ctx, t, x, S.TAG_Y + dy + 120 * g, S.TAG_W, { a: .32 * clamp(g * 3), glow: 0, thread: 0, dust: VT[i].dust ?? 0, split: VT[i].split ?? 0, seed: 90 + i });
      ctx.strokeStyle = rgba(GOLD.line, .35 * g); ctx.lineWidth = 1.5; ctx.setLineDash([5, 7]); ctx.beginPath(); ctx.moveTo(x, S.TAG_Y + dy + 10); ctx.lineTo(x, S.TAG_Y + dy + 120 * g); ctx.stroke(); ctx.setLineDash([]);
    }
  }
  // the floor line (5.03)
  function floorLine(ctx, t) {
    const fa = floorA(t); if (fa <= 0) return;
    const y = floorY(t);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.lin(ctx, 0, y - 26, 0, y + 26, [[0, rgba(COOL.halo, 0)], [.5, rgba(COOL.halo, .35 * fa)], [1, rgba(COOL.halo, 0)]]); ctx.fillRect(800, y - 26, 3700, 52);
    ctx.restore();
    ctx.fillStyle = rgba(COOL.core, .9 * fa); ctx.fillRect(800, y - 2.5, 3700, 5);
    for (let i = 0; i < 5; i++) { const px = 800 + ((t * 300 + i * 740) % 3700); halo(ctx, px, y, 36, .5 * fa, COOL.halo, COOL.core); }
  }
  // the clean sun (5.04–5.07): rises from behind the power station's hall, sets again
  const SUN = { x: 3784, r: 48 };
  const sunY = (t) => lerp(800, 600, sineIO(span(t, a.clean - 1.2, a.clean + 1.4))) + 230 * sineIO(span(t, a.fourth - 1.2, a.fourth + 1.4));
  const sunOn = (t) => t > a.clean - 1.2 && t < a.fourth + 1.5;
  function sun(ctx, t) {
    if (!sunOn(t)) return;
    const y = sunY(t), r = SUN.r * (1 + .03 * Math.sin(t * 1.3));
    const sx0 = ST[3].x - 250, sx1 = ST[3].x - 180;   // the two stacks stand in front of it
    ctx.save(); ctx.beginPath(); ctx.rect(SUN.x - 400, 0, 800, GY - 170); ctx.rect(sx0, GY - 380, 34, 400); ctx.rect(sx1, GY - 340, 34, 400); ctx.clip('evenodd');
    halo(ctx, SUN.x, y, r * 4.2, .35, COOL.halo, COOL.core);
    for (let i = 0; i < 10; i++) { const an = i / 10 * TAU + t * .05; ctx.strokeStyle = rgba(COOL.line, .14); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(SUN.x + Math.cos(an) * r * 1.3, y + Math.sin(an) * r * 1.3); ctx.lineTo(SUN.x + Math.cos(an) * r * 2.3, y + Math.sin(an) * r * 2.3); ctx.stroke(); }
    ctx.fillStyle = E.rad(ctx, SUN.x - r * .3, y - r * .3, r * 1.2, [[0, '#ffffff'], [.6, P.cream], [1, mixHex(P.cream, COOL.body, .6)]]); ctx.beginPath(); ctx.arc(SUN.x, y, r, 0, TAU); ctx.fill();
    ctx.restore();
  }
  // the earth glow under the fields (6.03) and the gold plot under the house (7.03)
  const cropU = (t) => span(t, a.ground + .4, a.ground + 2.4) * (1 - span(t, a.fifth + .2, a.fifth + 2));
  function acre(ctx, t) {
    const u = cropU(t); if (u <= 0) return;
    const x0 = 4440, x1 = 5240, y0 = GY + 8, y1 = GY + 230;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.rad(ctx, 4840, GY + 60, 520, [[0, rgba(EARTH.warm, .55 * sineIO(u))], [1, rgba(EARTH.warm, 0)]]); ctx.fillRect(x0 - 200, y0, x1 - x0 + 400, y1 - y0 + 80);
    ctx.restore();
    ctx.strokeStyle = rgba(EARTH.rim, .8 * sineIO(u)); ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.strokeRect(x0, y0, (x1 - x0) * sineIO(span(u, 0, .6)), y1 - y0); ctx.setLineDash([]);
  }
  const plotU = (t) => span(t, a.even + .2, a.even + 2.0) * (1 - span(t, a.america + .2, a.america + 1.4));
  function plot(ctx, t) {
    const u = plotU(t); if (u <= 0) return;
    const x0 = 5540, x1 = 6060, y1 = GY + 120;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = E.lin(ctx, 0, GY, 0, y1, [[0, rgba(GOLD.halo, .35 * u)], [1, rgba(GOLD.halo, .06 * u)]]); ctx.fillRect(x0, GY + 2, (x1 - x0) * sineIO(clamp(u * 1.3)), y1 - GY);
    ctx.restore();
    F.goldSpan(ctx, [[x0, GY + 2], [x0, y1], [x1, y1], [x1, GY + 2]], 0, sineIO(u), { w: 2.4 });
  }
  // you: walk onto the plot to the door (7.03), stand there (the plate's pose)
  const youX = (t) => lerp(5040, SL.house.x, smooth(span(t, a.onLand - .4, a.america + .2)));
  function you(ctx, t) {
    if (t < a.onLand - .4) return;
    const walking = t < a.america + .3, x = youX(t);
    if (walking) E.du(ctx, x, GY, 70, { light: 1, back: .3, dir: 1, walk: x * .11, view: 'side' });
    else E.du(ctx, x, GY, 70, { light: 1, back: .3, dir: 1, look: .5 });
  }

  // ---------------------------------------------------------------- explainer windows (screen space)
  const veilA = (t) => Math.max(
    .38 * smooth(span(t, a.robots - .1, a.robots + .8)) * (1 - smooth(span(t, a.official - .2, a.official + .4))),
    .62 * smooth(span(t, a.official - .2, a.official + .6)) * (1 - smooth(span(t, a.third - .4, a.third + .5))),
    .58 * smooth(span(t, a.where - .2, a.where + .7)) * (1 - smooth(span(t, a.floor - .5, a.floor + .3))),
    .5 * smooth(span(t, a.radical - .3, a.radical + .5)) * (1 - smooth(span(t, a.ifTrue, a.ifTrue + .8))),
    .55 * smooth(span(t, a.remember - .3, a.remember + .6)) * (1 - smooth(span(t, a.ground - .3, a.ground + .5))),
    .58 * smooth(span(t, a.goBack - .2, a.goBack + .6)) * (1 - smooth(span(t, a.even - .4, a.even + .4))),
    .78 * smooth(span(t, a.america - .2, a.america + .6)) * (1 - smooth(span(t, a.hid - .3, a.hid + .5))),
    .6 * smooth(span(t, a.hid - .3, a.hid + .5)) * (1 - smooth(span(t, a.sixth - .6, a.sixth + .3))),
  );
  const win = (t, t0, t1, i = .9, o = .5) => span(t, t0, t0 + i) * (1 - span(t, t1 - o * .2, t1 + o * .8));

  function explain(ctx, t, c) {
    // 4.05 · 5,079,078 robots
    { const u = win(t, a.robots + .3, a.official - .1, .9, .6); if (u > 0) { ctx.save(); F.float(ctx, t, .5); numCard(ctx, t, 1180, 140, 620, { u, kind: 'KNOWN', big: TXT.robots, bigSize: 104, sub: TXT.robotsLabel }); ctx.restore(); }
      F.source(ctx, t, a.robots + .6, a.official, TXT.robotsSrc); }
    // 4.06 / 4.07 · the phone (grows out of a box on the belt)
    const pu = span(t, a.official - .2, a.official + 1.7), pout = span(t, a.third - .6, a.third + .2);
    if (pu > 0 && pout < 1) {
      const bx = E.project(c, S.Z_LAND, LANDX + 180, BELT.y - 20) ?? [W / 2, H / 2], g = sineIO(pu), e = expoIn(pout);
      const x = lerp(bx[0], 470, g), y = lerp(bx[1], 520, g) + e * 700, w = lerp(40, 260, g);
      ctx.save(); F.float(ctx, t, .35);
      const ph = phone(ctx, t, x, y, w, { line: span(t, a.official + 1.2, a.half + .6), up: span(t, a.more - .1, a.more + .7), rot: -.04 * (1 - g) + .02 * Math.sin(t * .4) });
      // the memory chip: slides out of the phone, a cool beam pulls it right (to the data centres)
      const cu = span(t, a.memory - .5, a.memory + 1.6);
      const cx0 = ph.chip[0], cy0 = ph.chip[1];
      if (g > .9) {
        const cx = cx0 + expoIn(cu) * 1500 + 40 * expoOut(span(cu, 0, .25)), cy = cy0 - 60 * sineIO(span(cu, 0, .3));
        if (cu > 0) { const bu = span(t, a.memory - .9, a.memory - .2); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = E.lin(ctx, cx0, 0, W, 0, [[0, rgba(COOL.halo, 0)], [.3, rgba(COOL.halo, .4 * bu)], [1, rgba(COOL.halo, .1 * bu)]]); ctx.fillRect(cx0, cy - 10, W - cx0 + 50, 20); ctx.restore(); }
        if (cx < W + 40) chip(ctx, cx, cy, 30, 1 - e);
      }
      ctx.restore();
    }
    { const u = win(t, a.official + 1.4, a.thisYear + .1, .9, .5); if (u > 0) { ctx.save(); F.float(ctx, t, .4); numCard(ctx, t, 1000, 330, 820, { u, title: TXT.phones, big: TXT.phonesBig, bigSize: 110, sub: TXT.phonesSub, sub2: TXT.phonesCpi }); ctx.restore(); }
      F.source(ctx, t, a.official + 1.6, a.thisYear, TXT.phonesSrc); }
    { const u = win(t, a.thisYear + .3, a.third - .3, .9, .5); if (u > 0) { ctx.save(); F.float(ctx, t, .4); numCard(ctx, t, 1000, 300, 840, { u, kind: 'FORECAST', title: TXT.phones26, big: TXT.phones26Big, bigSize: 64 }); ctx.restore(); }
      F.source(ctx, t, a.thisYear + .5, a.third - .3, TXT.phones26Src); }
    // 5.02 · the Gentle Singularity
    { const u = win(t, a.where + .1, a.floor - .25, 1, .5); if (u > 0) { ctx.save(); F.float(ctx, t, .4); F.quoteCard(ctx, t, T, { u, text: TXT.gentle, x: 360, y: 230, w: 1200, size: 50 }); ctx.restore(); }
      F.source(ctx, t, a.where + .5, a.floor - .3, TXT.gentleSrc); }
    // 5.03 · ENERGY +33% rides the floor
    { const u = span(t, a.five5 - .1, a.five5 + .8) * (1 - span(t, a.unless + .2, a.unless + .9)); if (u > 0) {
      const p = E.project(c, S.Z_LAND, 2500, floorY(t)); if (p) { const x = 700, y = p[1] + 96;
        F.goldText(ctx, [[TXT.energy1, 1]], x, y, 70, rise(u), { serif: true, glow: true });
        F.maskLine(ctx, [[TXT.energy2, 0]], x + 4, y + 42, 24, rise(span(u, .25, 1)), { serif: false, weight: 600, col: P.cream, glow: false }); } }
      F.source(ctx, t, a.five5 + .2, a.unless + .4, TXT.energySrc); }
    // 5.06 · RADICAL ABUNDANCE · A FORECAST
    { const u = win(t, a.radical - .05, a.ifTrue + .3, .7, .6); if (u > 0) {
      F.goldText(ctx, [['RADICAL ABUNDANCE', 1]], W / 2, 330, 104, rise(u), { serif: true, align: 'center', glow: true });
      const fu = span(t, a.forecast - .05, a.forecast + .6) * (1 - span(t, a.ifTrue + .1, a.ifTrue + .7));
      if (fu > 0) { const tw = F.measure('A FORECAST', 26, false, 600) + 26 * 10 * .14 + 40, x = W / 2 - tw / 2, y = 388;
        ctx.save(); ctx.globalAlpha *= clamp(fu * 3); const k = expoOut(fu); ctx.translate(0, (1 - k) * 18);
        ctx.fillStyle = rgba(COOL.body, .16); ctx.strokeStyle = rgba(COOL.body, .9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(x, y, tw, 46, 23); ctx.fill(); ctx.stroke();
        E.glowText(ctx, 'A FORECAST', x + 20, y + 32, { size: 26, weight: 600, spacing: .14, col: COOL.body, glow: false }); ctx.restore(); } } }
    // 6.02 · the food dollar again: the labor part turns cool
    { const u = win(t, a.remember - .1, a.ground - .1, .9, .5); if (u > 0) {
      const cool = sineIO(span(t, a.take - .1, a.take + 1.2));
      ctx.save(); F.float(ctx, t, .35);
      F.dollarBar(ctx, t, 360, 600, 1200, { u, title: 'OF EVERY FOOD DOLLAR', segs: [
        { label: 'LABOR', share: .54, col: mixHex(PAPER.lit, COOL.body, cool), big: '54¢', u: span(u, .2, 1) },
        { label: 'OTHER', share: .34, col: PAPER.shade, u: span(u, .35, 1) },
        { label: 'FARM', share: .12, col: EARTH.warm, big: '12¢', u: span(u, .45, 1) }] });
      if (cool > 0) { const k = expoOut(span(t, a.take + .1, a.take + 1.2)); for (let i = 0; i < 3; i++) { const ax = 380 + 140 + i * 190; arm(ctx, ax, 600 - 2, t, i * 1.4, 1.0, clamp(cool * 2) * clamp(u * 3), k); } }
      ctx.restore(); }
      F.source(ctx, t, a.remember + .3, a.ground - .1, TXT.foodSrc); }
    // 6.03 ★ · cropland
    { const u = span(t, a.record - .2, a.record + .9) * (1 - span(t, a.fifth + .3, a.fifth + 1.0)); if (u > 0) {
      const p = E.project(c, S.Z_LAND, 4840, GY + 120) ?? [W / 2, 700], x = p[0], y = Math.min(p[1], 720);
      F.maskLine(ctx, [[TXT.crop1, 0]], x - 300, y - 150, 28, rise(span(t, a.ground + 1.4, a.ground + 2.2)) * (1 - span(t, a.fifth + .3, a.fifth + 1)), { serif: false, weight: 700, col: P.cream, glow: false });
      const r = F.goldText(ctx, [[TXT.cropBig, 1]], x - 304, y, 150, rise(u), { serif: true, glow: true });
      F.maskLine(ctx, [[TXT.cropUnit, 0]], x - 290 + (r?.w ?? 420), y - 6, 34, rise(span(u, .3, 1)), { serif: false, weight: 700, col: GOLD.text, glow: false });
      const su = span(t, a.crop + .1, a.crop + .9) * (1 - span(t, a.fifth + .3, a.fifth + 1.0));
      F.maskLine(ctx, [[TXT.crop2, 0]], x - 300, y + 54, 28, rise(su), { serif: false, weight: 700, col: P.cream, glow: false }); }
      F.source(ctx, t, a.record + .2, a.fifth + .4, TXT.cropSrc); }
    // 7.02 · the robot house quote (on land you already own lights)
    { const u = win(t, a.goBack + .1, a.even - .2, .9, .5); if (u > 0) { ctx.save(); F.float(ctx, t, .4); F.quoteCard(ctx, t, T, { u, text: TXT.landQuote, x: 330, y: 300, w: 1260, size: 58, spoken: ['on land you already own'], after: a.listen, mode: 'hi' }); ctx.restore(); }
      F.source(ctx, t, a.goBack + .5, a.even - .2, TXT.landQuoteSrc); }
    // 7.04 / 7.05 · walls vs ground
    { const u = win(t, a.america + .1, a.hid - .2, 1.0, .6); if (u > 0) {
      const lift = sineIO(span(t, a.isnt - .2, a.isnt + 1.6)) * (1 - sineIO(span(t, a.walls - .4, a.walls + .5)));
      const gx = 560, gy = 640, gw = 520, k = expoOut(u), ex = 1 - expoIn(span(t, a.hid - .3, a.hid + .5));
      ctx.save(); F.float(ctx, t, .3); ctx.globalAlpha *= clamp(u * 3) * ex; ctx.translate(0, (1 - k) * 50 + (1 - ex) * 60);
      // the ground block (warm; "it's the ground under it" lights its edge)
      const gl = span(t, a.groundUnder - .1, a.groundUnder + .8);
      ctx.fillStyle = E.lin(ctx, 0, gy, 0, gy + 150, [[0, mixHex(EARTH.top, EARTH.warm, .4 * gl)], [1, EARTH.deep]]); ctx.fillRect(gx - gw / 2, gy, gw, 150);
      ctx.fillStyle = rgba(EARTH.rim, .5 + .4 * gl); ctx.fillRect(gx - gw / 2, gy, gw, 4);
      ctx.strokeStyle = rgba(EARTH.line, .3); ctx.lineWidth = 2; for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(gx - gw / 2, gy + i * 50); ctx.lineTo(gx + gw / 2, gy + i * 50 + 6 * Math.sin(i)); ctx.stroke(); }
      if (gl > 0) F.goldSpan(ctx, [[gx - gw / 2, gy + 2], [gx - gw / 2, gy + 150], [gx + gw / 2, gy + 150], [gx + gw / 2, gy + 2]], 0, sineIO(gl), { w: 2.4, a: 1 - span(t, a.walls, a.walls + 1) * .6 });
      // the walls: lift off; then cool arms restack them fast ("walls cheap"); the ground does not grow
      flatHouse(ctx, t, gx, gy - 6 - 150 * lift, 300, { sweep: span(t, a.walls + .1, a.walls + 1.3), cool: 1 - span(t, a.cant + .4, a.hid) });
      const au = span(t, a.walls - .3, a.walls + .3) * (1 - span(t, a.cant + .6, a.hid));
      if (au > 0) { arm(ctx, gx - 230, gy, t * 2.2, 0, 1.25, 1, expoOut(au)); arm(ctx, gx + 230, gy, t * 2.2, 1.7, 1.25, 1, expoOut(au)); }
      // "They can't make more ground": a cool bracket tries to stretch the ground and springs back
      const tr = span(t, a.cant - .1, a.cant + 1.2);
      if (tr > 0 && tr < 1) { const s = Math.sin(Math.PI * tr) * 40; ctx.strokeStyle = rgba(COOL.line, .8 * Math.sin(Math.PI * tr)); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(gx + gw / 2 + 10, gy + 10); ctx.lineTo(gx + gw / 2 + 10 + s, gy + 75); ctx.lineTo(gx + gw / 2 + 10, gy + 140); ctx.stroke(); }
      ctx.restore();
      ctx.save(); F.float(ctx, t, .3); ctx.globalAlpha *= ex;
      F.dollarBar(ctx, t, 960, 470, 820, { u, title: TXT.land40, segs: [
        { label: 'THE HOUSE', share: .6, col: mixHex(PAPER.shade, COOL.body, .6 * span(t, a.walls, a.walls + .6)), u: span(u, .2, 1) },
        { label: 'THE GROUND', share: .4, col: EARTH.warm, big: '≈ 40%', gold: 1, u: span(t, a.forty - .1, a.forty + .9) }] });
      ctx.restore(); }
      F.source(ctx, t, a.america + .5, a.hid - .2, TXT.land40Src); }
    // 7.06 · Three Observations
    { const u = win(t, a.hid + .1, a.sixth - .3, .9, .5); if (u > 0) { ctx.save(); F.float(ctx, t, .4); F.quoteCard(ctx, t, T, { u, text: TXT.scarce, x: 330, y: 250, w: 1260, size: 54, spoken: ['the price of limited', 'dramatically'], after: a.wrote, mode: 'hi' }); ctx.restore(); }
      F.source(ctx, t, a.hid + .4, a.sixth - .3, TXT.scarceSrc); }
  }
  // verdicts under the tags (screen space, projected from the land)
  function verdicts(ctx, t, c) {
    const V = [
      [2, 'FALLS SLOWLY', a.third + .7, a.never + .6, () => 40],
      [3, 'STAYS UP · FOR NOW', a.fourth + .5, a.one + 1.5, () => t4dy(t)],
      [4, 'WORK OUT · GROUND STAYS', a.workOut, a.leaves + .9, () => t5dy(t)],
      [5, 'STAYS HARD', a.sixth + .5, a.halfR + 1.0, () => t6dy(t)],
    ];
    for (const [i, txt, t0, t1, dy] of V) {
      const u = span(t, t0, t0 + .8), o = span(t, t1 - .2, t1 + .5); if (u <= 0 || o >= 1) continue;
      const p = E.project(c, S.Z_LAND, ST[i].x, S.TAG_Y + dy() + TAG_H * .9 + 34); if (!p) continue;
      const sz = clamp(26 * p[2] / 1.6, 26, 34);
      ctx.save(); ctx.globalAlpha *= 1 - expoIn(o); F.verdict(ctx, t, p[0], Math.min(p[1] + sz, 860), txt, u, { size: sz }); ctx.restore();
    }
  }
  // the earth labels (4.09) and the three labels under the fields (6.01)
  function labels(ctx, t, c) {
    const L = [
      ['MATERIALS', 2860, 1030, a.mat, a.energy + .4, 60, -60],
      ['CHIPS', 3130, 1100, a.chips, a.energy + .4, 60, -40],
      ['POWER', 3330, GY + 64, a.pow, a.energy + .4, 60, -60],
    ];
    for (const [txt, x, y, t0, t1, dx, dy] of L) {
      const u = span(t, t0 - .05, t0 + .8) * (1 - span(t, t1, t1 + .6)); if (u <= 0) continue;
      const p = E.project(c, S.Z_LAND, x, y); if (p) F.goldLabel(ctx, p[0], p[1], txt, null, u, { dx, dy, size: 28 });
    }
    // ENERGY (along the cable from the left) · MACHINES (from the factory, left) · GROUND (rises out of the earth): they meet
    const M = [['ENERGY', a.wEnergy, -1], ['MACHINES', a.wMach, 0], ['GROUND', a.wSome, 1]], out = span(t, a.food + .2, a.food + 1.0);
    if (out < 1) M.forEach(([txt, t0, k]) => {
      const u = span(t, t0 - .1, t0 + .7); if (u <= 0) return;
      const meet = sineIO(span(t, a.wSome + .4, a.wSome + 2.0)), lx = lerp(4850 + k * 300, 4850, meet * .55), ly = GY + 70 + (k + 1) * 46 * meet;
      const p = E.project(c, S.Z_LAND, lx, ly); if (!p) return;
      const k2 = txt === 'GROUND' ? 1 : .75;
      F.goldText(ctx, [[txt, k2]], p[0], Math.min(p[1], 860), 32, rise(u) * (1 - expoIn(out)), { serif: false, weight: 700, spacing: .1, align: 'center' });
    });
  }

  // ---------------------------------------------------------------- one frame
  return (ctx, t) => {
    if (t < tA) { S.plateFactory(ctx, t, T); return; }
    if (t >= tP) { S.plateStairs(ctx, t, T); return; }
    const c = cam(t), landed = t >= tSwap;
    S.landWorld(ctx, c, t, {
      you: false, cool: t < a.housing ? 1 : 0, power: Math.max(0, powerU(t)),
      tags: hanging(t), houseTag: landed ? 1 : 0,
      land: (cx) => {
        sun(cx, t); belt(cx, t); moreArms(cx, t); earthLayers(cx, t); acre(cx, t); plot(cx, t); floorLine(cx, t); ghosts(cx, t);
        flying(cx, t); tag6(cx, t); you(cx, t);
      },
    });
    // the clip plates (C2 out of the box, C3 out of the clean light)
    // C2: the source cuts to a split screen at its frame 278 (9.23 s): the plate holds frame 277 from there while it closes
    { const m = plateMorph(t, a.c2); if (m > 0) { const r = boxRect(c, t) ?? { x: W / 2, y: H / 2, w: 40, h: 20 }, w2 = a.c2;
      F.clipPlate(ctx, Math.min(t, w2.start + 276.5 / 30), T, 'C2', { from: r, morph: m, label: span(t, w2.start + .2, w2.start + 1.1) * (1 - span(t, w2.end - 1.1, w2.end - .3)) }); } }
    { const m = plateMorph(t, a.c3); if (m > 0) { const p = E.project(c, S.Z_LAND, SUN.x, sunY(t)) ?? [W / 2, H / 2, 1]; F.clipPlate(ctx, t, T, 'C3', { from: [p[0], p[1], SUN.r * p[2]], morph: m }); } }
    F.veil(ctx, veilA(t));
    verdicts(ctx, t, c); labels(ctx, t, c);
    explain(ctx, t, c);
    F.board(ctx, t, T);
  };
}
