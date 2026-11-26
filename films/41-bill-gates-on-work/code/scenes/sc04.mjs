// Film 41 · c04 · stop 2, the hands · who is talking (B1) · "That's the usual comfort" → 'Then the numbers' (docs/shots.md 2.12–3.18)
// The c03 draw hands over to this draw at k.from (0.4 s before 'Which sounds like good news', the timeline big) so the c03 → c04 cut
// is between identical frames. 2.12 lives here because its picture carries over the chunk boundary.
//   2.12 stop 2 glows, its light drops into a hanging lamp over a bench with a pair of work gloves · 3.01 THE USUAL COMFORT rests on them
//   · 3.02 the lamp's cord becomes the split: a desk phone a cyan light answers | the bench slides right, a brick wall builds, wheat rises
//   · 3.03 the split folds up into stop 2 of the big timeline, a bracket counts 2 → 8 YEARS · 3.04 ★ the bracket opens into THE SITE at
//   dusk: tiny cold humanoid robots lay bricks and walk the field; a slow pull-back · 3.05 the site cabin's window grows into the C2 plate
//   · 3.06 C2 · the plate shrinks into his sentence as a caption · 3.07 HOUSES · FOOD · HANDS tiles rise from the caption · 3.08 the
//   caption rewinds: IF WE DON'T CHOOSE · 3.09 its underline becomes the centre line of a road; the forecast cloud dissolves, the road
//   forks: A DECISION · 3.10 the fork straightens into three levers BUILD · BUY · SWITCH ON, pulled by small amber hands · 3.11 the third
//   lever folds into the ON switch (H.12), no halt · 3.12 the knob clones into two dials HOW FAST · WHERE: A CHOICE · 3.13 the timeline
//   big, IS HE RIGHT? · 3.14 the "?" pulls the portrait print back up · 3.15 GATES → MICROSOFT ⟷ THE COMPANY BEHIND CHATGPT
//   · 3.16 PROFITS flow back, his warning card · 3.17 a hand pushes the card, it springs back heavier · 3.18 a rule drops, small blocks
//   bounce off, the big one steps over; the rule lies down as the gold baseline of plateNumbers (seam to c05).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, EARTH, PAPER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));

// ------------------------------------------------------------------ small paths (built once)
const PATHS = new Map();
function gloveP() {
  if (PATHS.has('glove')) return PATHS.get('glove');
  const hp = E.handPath({ pose: 'open', spread: .45 }), cl = new Path2D(); cl.rect(-.62, -1.2, 3.2, 2.4);
  const p = hp.op(cl, PathOp.Intersect), cuff = new Path2D(); cuff.rect(-.62, -.5, .5, 1.02); const r = { p, cuff: cuff.op(hp, PathOp.Intersect) };
  PATHS.set('glove', r); return r;
}
function houseP() { if (PATHS.has('house')) return PATHS.get('house'); const p = new Path2D(); p.moveTo(-.5, -.02); p.lineTo(0, -.48); p.lineTo(.5, -.02); p.lineTo(.4, -.02); p.lineTo(.4, .44); p.lineTo(-.4, .44); p.lineTo(-.4, -.02); p.closePath(); const d = new Path2D(); d.roundRect(-.1, .14, .2, .3, [.1, .1, 0, 0]); const r = p.op(d, PathOp.Difference); PATHS.set('house', r); return r; }
function wheatP() {
  if (PATHS.has('wheat')) return PATHS.get('wheat');
  let p = new Path2D(); const st = new Path2D(); st.moveTo(0, .48); st.quadraticCurveTo(.03, 0, 0, -.42); p = st.stroke({ width: .05, cap: 1, join: 1 });
  for (let i = 0; i < 5; i++) for (const s of [-1, 1]) { const g = new Path2D(); g.ellipse(s * .07, -.34 + i * .12, .055, .1, s * .5, 0, TAU); p = p.op(g, PathOp.Union); }
  const top = new Path2D(); top.ellipse(0, -.45, .045, .09, 0, 0, TAU); p = p.op(top, PathOp.Union);
  PATHS.set('wheat', p); return p;
}
const xf = (p, m) => { const q = new Path2D(); q.addPath(p, m); return q; };

// F.goldSpan sets globalAlpha absolutely, so it ignores a parent fade: carry the current alpha into it
export const gs = (ctx, pts, u0, u1, o = {}) => F.goldSpan(ctx, pts, u0, u1, { ...o, a: (o.a ?? 1) * ctx.globalAlpha });
// F.label measures without its letter spacing, so its clip cuts the tail of longer labels ("THE MACHIN"). Same look, true width:
export function lab(ctx, s, x, y, u, o = {}) {
  u = clamp(u); const out = clamp(o.out ?? 0); if (u <= 0 || out >= 1) return null;
  const size = o.size ?? 24, sp = .12;
  ctx.save(); ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = `${sp}em`; const w = ctx.measureText(s).width; ctx.restore();
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  ctx.save(); ctx.globalAlpha *= (o.a ?? 1); ctx.beginPath(); ctx.rect(x0 - size * .3, y - size * 1.3, w + size * .6, size * 1.64); ctx.clip();
  ctx.font = `600 ${size}px Inter`; ctx.letterSpacing = `${sp}em`; ctx.textBaseline = 'alphabetic';
  const g = clamp(o.gold ?? 0); if (g > 0 && o.glow !== false) { ctx.shadowColor = rgba(GOLD.halo, .6 * g); ctx.shadowBlur = size * .3; }
  ctx.fillStyle = mixHex(o.col ?? CREAM2, GOLD.body, g);
  ctx.fillText(s, x0, y + (1 - expoOut(u)) * size * 1.1 + expoIn(out) * size * 1.1);
  ctx.restore();
  return { x0, x1: x0 + w, y, w };
}

const CACHE = new WeakMap();
export function buildC04(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = -1) => T.G(p, 0, after);
  const k = {};
  k.good0 = G('Which sounds like good news'); k.from = k.good0 - .4; k.good = G('good news', k.good0); k.news = G('news', k.good); k.forW = G('for anyone', k.good); k.works = G('works with', k.forW); k.handsW = G('hands', k.works);
  k.start = G("That's the usual comfort"); k.usual = G('usual', k.start); k.comfort = G('comfort', k.usual);
  k.phone = G('A machine can answer'); k.canW = G('can', k.phone); k.answer = G('answer', k.phone); k.phoneW = G('phone', k.answer);
  k.cant = G("It can't lay bricks"); k.cantW = G("can't", k.cant); k.lay = G('lay', k.cant); k.bricks = G('bricks', k.lay); k.orW = G('or bring', k.bricks); k.bring = G('bring', k.orW); k.harvest = G('harvest', k.bring);
  k.gives = G('Gates gives that comfort'); k.two = G('two to eight', k.gives); k.eight = G('eight', k.two); k.years = G('years', k.eight);
  k.second = G("That's the second stop"); k.window = G('his window for humanoid'); k.humanoid = G('humanoid', k.window); k.robots = G('robots', k.humanoid); k.building = G('building sites', k.robots); k.farms = G('farms', k.building);
  k.fall = G('This fall, on a podcast'); k.podcast = G('podcast', k.fall); k.leads = G('leads', k.podcast);
  const C2 = T.clip('C2');
  k.houses = G('Houses', C2.start); k.food = G('Food', k.houses); k.workDone = G('Work done with hands', k.food); k.handsW2 = G('hands', k.workDone);
  k.goBack = G('But go back to how'); k.back = G('back', k.goBack); k.begins = G('begins', k.back);
  k.ifW = G("If we don't choose", k.begins); k.we = G('we', k.ifW); k.dont = G("don't", k.we); k.choose = G('choose', k.dont);
  k.weather = G("He isn't describing the weather"); k.isnt = G("isn't", k.weather); k.weatherW = G('weather', k.isnt); k.decS = G("He's describing a decision"); k.decision = G('decision', k.decS);
  k.built = G('Machines like these are built'); k.builtW = G('built', k.built); k.bought = G('bought', k.builtW); k.switched = G('switched on', k.bought); k.byPeople = G('by people', k.switched); k.people = G('people', k.byPeople);
  k.halt = G("Gates doesn't expect a halt"); k.expect = G('expect', k.halt); k.haltW = G('halt', k.expect);
  k.howFast = G('But how fast they come'); k.fast = G('fast', k.howFast); k.where = G('where', k.fast); k.choice = G('choice', k.where);
  k.before = G('Before the last stop on his'); k.fair = G('fair question', k.before); k.question = G('question', k.fair); k.isHe = G('Is he even right'); k.heW = G('he', k.isHe); k.right = G('right', k.heW);
  k.who = G("Start with who's talking"); k.whos = G("who's", k.who); k.talking = G('talking', k.whos);
  k.cof = G('Bill Gates co-founded Microsoft'); k.cofW = G('co-founded', k.cof); k.msft = G('Microsoft', k.cofW); k.one = G('one of the biggest', k.msft); k.biggest = G('biggest', k.one); k.share = G('shareholders', k.biggest); k.company = G('company behind', k.share); k.chatgpt = G('ChatGPT', k.company);
  k.warn = G('So he is warning about'); k.warningW = G('warning', k.warn); k.tech = G('technology', k.warningW); k.profits = G('profits', k.tech);
  k.harder = G('That makes the warning harder'); k.harderW = G('harder', k.harder); k.wave = G('wave away', k.harderW); k.away = G('away', k.wave);
  k.skeptic = G('Though a skeptic would add'); k.strict = G('strict rules', k.skeptic); k.rules = G('rules', k.strict); k.often = G('often', k.rules); k.suit = G('suit the biggest', k.rules); k.biggestW = G('biggest', k.suit); k.players = G('players', k.biggestW);
  k.numbers = G('Then the numbers'); k.plate0 = k.numbers - S.SEAM_HALF; k.conv = k.plate0 - .02;   // from conv on, the frame IS plateNumbers

  // ------------------------------------------------------------------ the timeline (big three times: 2.12 tail, 3.03, 3.13)
  const tlBig = (t) => Math.max(t < k.good0 + 1.6 ? 1 - quartIO(span(t, k.good0 - .4, k.good0 + .5)) : 0,
    quartIO(span(t, k.gives - .25, k.gives + .6)) * (1 - quartIO(span(t, k.second + .05, k.second + 1))),
    quartIO(span(t, k.before - .2, k.before + .6)) * (1 - quartIO(span(t, k.who - .7, k.who + .2))));
  const DY = 200;
  const tlStop = (i, t) => { const b = sineIO(clamp(tlBig(t))), sc = lerp(1, 1.9, b), x0 = lerp(W - 720, W / 2 - 320 * 1.9, b), y = lerp(92, 150, b) + DY * tlBig(t); return [x0 + [0, 270, 470][i] * sc, y, sc]; };

  // ------------------------------------------------------------------ 2.12 / 3.01 / 3.02 THE BENCH, THE GLOVES, THE SPLIT
  const LAMP = [960, 320];
  const split = (t) => quartIO(span(t, k.phone - .4, k.phone + .55));
  const splitOut = (t) => expoIn(span(t, k.gives - .4, k.gives + .35));
  function benchGroup(t) {   // where the bench sits: centre → the right panel (3.02); sinks with the split (3.03)
    const s = split(t), out = splitOut(t);
    return { cx: lerp(960, 1450, s), y: lerp(720, 852, s) + 620 * out, sc: lerp(1, .58, s) };
  }
  function lampLight(t) { return expoOut(span(t, k.good0 + .55, k.good0 + 1.4)); }
  function bench(ctx, t) {
    if (t > k.gives + .5) return;
    const g = benchGroup(t), L = lampLight(t) * (1 - .35 * split(t));
    // the drop of light from stop 2 into the lamp
    const d = sineIO(span(t, k.from + .1, k.good0 + .7));
    if (d > 0 && d < 1) { const [sx, sy] = tlStop(1, k.from + .1), x = lerp(sx, LAMP[0], d), y = lerp(sy, LAMP[1], d); halo(ctx, x, y, 50, .8, AMBER.body, AMBER.core); gs(ctx, [[sx, sy], [x, y]], Math.max(0, d - .3) / Math.max(d, 1e-3), 1, { w: 2, spark: false, a: .7 * (1 - d) }); }
    if (L <= 0) return;
    // the cord and the lamp shade (the cord becomes the split line in 3.02)
    // the drop of light hits the lamp and sets it swinging (a decaying pendulum; still by the split)
    const t0 = k.good0 + .6, sw = t > t0 ? 44 * Math.exp(-(t - t0) / 8) * Math.sin((t - t0) * 1.7) * (1 - split(t)) : 0;
    const s = split(t), cx0 = lerp(LAMP[0], g.cx, s), lx = cx0 + sw, ly = lerp(LAMP[1], g.y - 330 * g.sc, s) - Math.abs(sw) * .04;
    ctx.save(); ctx.globalAlpha *= L;
    ctx.strokeStyle = rgba(CREAM2, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx0, -10); ctx.lineTo(lx, ly - 30 * g.sc); ctx.stroke();
    // the cone of light on the bench
    ctx.fillStyle = lin(ctx, 0, ly, 0, g.y, [[0, rgba(AMBER.core, .3)], [1, rgba(AMBER.body, .06)]]);
    ctx.beginPath(); ctx.moveTo(lx - 30 * g.sc, ly); ctx.lineTo(g.cx + sw * 1.6 - 380 * g.sc, g.y + 10); ctx.lineTo(g.cx + sw * 1.6 + 380 * g.sc, g.y + 10); ctx.lineTo(lx + 30 * g.sc, ly); ctx.closePath(); ctx.fill();
    halo(ctx, g.cx + sw * 1.2, g.y - 20 * g.sc, 520 * g.sc, .3, AMBER.body, AMBER.core);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .4); ctx.beginPath(); ctx.moveTo(lx - 46 * g.sc, ly); ctx.lineTo(lx - 16 * g.sc, ly - 34 * g.sc); ctx.lineTo(lx + 16 * g.sc, ly - 34 * g.sc); ctx.lineTo(lx + 46 * g.sc, ly); ctx.closePath(); ctx.fill();
    halo(ctx, lx, ly + 4, 60 * g.sc, .9, AMBER.body, AMBER.core);
    // the bench: top surface (seen from a little above), front edge, legs
    const bw = 680 * g.sc, top = g.y - 64 * g.sc, cx = g.cx;
    ctx.fillStyle = lin(ctx, 0, top, 0, g.y, [[0, mixHex(EARTH.warm, AMBER.hot, .25)], [1, EARTH.body]]); ctx.beginPath(); ctx.moveTo(cx - bw / 2 + 30 * g.sc, top); ctx.lineTo(cx + bw / 2 - 30 * g.sc, top); ctx.lineTo(cx + bw / 2, g.y); ctx.lineTo(cx - bw / 2, g.y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = EARTH.deep; ctx.fillRect(cx - bw / 2, g.y, bw, 26 * g.sc);
    ctx.fillStyle = rgba(EARTH.rim, .8); ctx.fillRect(cx - bw / 2, g.y, bw, 2.5 * g.sc);
    ctx.fillStyle = mixHex(EARTH.deep, P.night0, .4); ctx.fillRect(cx - bw * .42, g.y + 26 * g.sc, 22 * g.sc, 130 * g.sc); ctx.fillRect(cx + bw * .42 - 22 * g.sc, g.y + 26 * g.sc, 22 * g.sc, 130 * g.sc);
    // the gloves (worn leather, lying on the bench top, squashed by the view from above)
    const gl = gloveP();
    [[cx - 110 * g.sc, g.y - 30 * g.sc, -.35, 1], [cx + 70 * g.sc, g.y - 36 * g.sc, .25, -1]].forEach(([x, y, a, fl], i) => {
      const m = E.handMatrix(x, y, a + .02 * Math.sin(t * .5 + i), 62 * g.sc, fl), sq = { a: m.a, b: m.b * .5, c: m.c, d: m.d * .5, e: m.e, f: m.f };
      const p = xf(gl.p, sq), cf = xf(gl.cuff, sq);
      ctx.fillStyle = rgba(P.night0, .4); ctx.save(); ctx.translate(6 * g.sc, 8 * g.sc); ctx.fill(p); ctx.restore();
      ctx.fillStyle = lin(ctx, x - 80 * g.sc, y - 30 * g.sc, x + 100 * g.sc, y + 30 * g.sc, [[0, mixHex(AMBER.hot, EARTH.warm, .35)], [1, mixHex(EARTH.warm, EARTH.body, .5)]]); ctx.fill(p);
      ctx.fillStyle = mixHex(EARTH.body, EARTH.deep, .3); ctx.fill(cf);
    });
    ctx.restore();
  }
  function phone(ctx, t) {   // 3.02 left: a desk phone; a cyan light lifts the handset and answers
    const s = split(t), out = splitOut(t); if (s <= 0 || t > k.gives + .5) return;
    const x = 480, y = 640 + 620 * out + (1 - expoOut(span(t, k.phone - .3, k.phone + .4))) * 300;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 958, 900); ctx.clip();
    const ring = t < k.answer - .05 ? Math.sin(t * 60) * 2.5 * span(t, k.phone + .2, k.phone + .3) : 0, lift = expoOut(span(t, k.answer - .05, k.answer + .5)), cold = lift;
    halo(ctx, x, y - 60, 260, .25 + .3 * cold, cold > .3 ? MACH.halo : AMBER.body, cold > .3 ? MACH.core : AMBER.core);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.moveTo(x - 120, y + 50); ctx.lineTo(x - 90, y - 30); ctx.lineTo(x + 90, y - 30); ctx.lineTo(x + 120, y + 50); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .45); ctx.lineWidth = 2; ctx.stroke();
    for (let i = 0; i < 9; i++) { ctx.fillStyle = rgba(CREAM2, .45); ctx.beginPath(); ctx.arc(x - 30 + (i % 3) * 30, y - 8 + Math.floor(i / 3) * 18, 5, 0, TAU); ctx.fill(); }
    // the handset: rings (tiny shake), then rises in a cyan light
    ctx.save(); ctx.translate(x + ring, y - 46 - 90 * lift); ctx.rotate(-.18 * lift);
    if (cold > 0) halo(ctx, 0, 0, 160, .6 * cold, MACH.halo, MACH.core);
    ctx.fillStyle = lin(ctx, 0, -22, 0, 22, [[0, mixHex(mixHex(P.ind2, P.blue1, .4), MACH.hot, cold)], [1, mixHex(P.night1, MACH.mid, cold)]]); ctx.beginPath(); ctx.roundRect(-125, -16, 250, 32, 16); ctx.fill();
    ctx.beginPath(); ctx.roundRect(-135, -10, 50, 40, 12); ctx.roundRect(85, -10, 50, 40, 12); ctx.fill();
    ctx.restore();
    if (cold > 0) for (let j = 0; j < 3; j++) { const r = 40 + j * 26 + ((t - k.answer) * 40 % 26); ctx.strokeStyle = rgba(MACH.core, .5 * cold * (1 - j / 3)); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + 150, y - 140 - 90 * lift, r, -.7, .7); ctx.stroke(); }
    if (ring && t > k.phone + .2) for (let j = 0; j < 2; j++) { ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y - 60, 160 + j * 24, -2.3, -.84); ctx.stroke(); }
    ctx.restore();
  }
  function handWork(ctx, t) {   // 3.02 right: a brick wall builds (on "bricks"), a person lays it, wheat rises (on "harvest")
    const s = split(t), out = splitOut(t); if (s <= 0 || t > k.gives + .5) return;
    const dy = 620 * out;
    ctx.save(); ctx.beginPath(); ctx.rect(962, 0, W, 900); ctx.clip(); ctx.translate(0, dy);
    // the field (wheat), back to front
    for (let i = 0; i < 26; i++) {
      const x = 1000 + i * 36 + (i % 2) * 10, u = expoOut(span(t, k.harvest - .45 + i * .02, k.harvest + .35 + i * .02)); if (u <= 0) continue;
      const hh = 120 + 30 * ((i * 7) % 4) / 3, y = 790 + (1 - u) * 160;
      ctx.save(); ctx.translate(x, y); ctx.rotate(.05 * Math.sin(t * 1.1 + i * .7)); ctx.fillStyle = mixHex(AMBER.body, GOLD.mid, .4 + .2 * (i % 3) / 2); ctx.fill(xf(wheatP(), { a: hh, b: 0, c: 0, d: hh, e: 0, f: -hh * .5 })); ctx.restore();
    }
    halo(ctx, 1440, 600, 420, .22 * span(t, k.bricks - .3, k.bricks + .4), AMBER.body, AMBER.core);
    // the wall: 5 rows × 7, dropping in by rows on "bricks"
    const BW = 64, BH = 30, wx0 = 1180, wy0 = 690;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 7 - (r % 2); c++) {
      const tt = k.bricks - .35 + (r * 7 + c) * .022, u = expoOut(span(t, tt, tt + .35)); if (u <= 0) continue;
      const x = wx0 + c * (BW + 4) + (r % 2) * (BW / 2 + 2), y = wy0 - (r + 1) * (BH + 4) - (1 - u) * 90;
      ctx.globalAlpha = clamp(u * 2); ctx.fillStyle = lin(ctx, 0, y, 0, y + BH, [[0, mixHex(AMBER.body, EARTH.rim, .5)], [1, mixHex(EARTH.warm, EARTH.body, .4)]]); ctx.beginPath(); ctx.roundRect(x, y, BW, BH, 3); ctx.fill(); ctx.globalAlpha = 1;
    }
    // the bricklayer (a person, rim-lit warm), rises with the wall
    const pu = expoOut(span(t, k.lay - .4, k.lay + .4)); if (pu > 0) { const reach = .5 + .5 * Math.sin(t * 2.2); E.person(ctx, 1700, 790 + (1 - pu) * 260, 230, { rim: AMBER.body, armR: [lerp(1.6, 2.3, reach), lerp(1.7, 2.6, reach)], look: .1, dir: -1 }); }
    ctx.restore();
  }
  function divider(ctx, t) {   // the lamp's cord continues down: the split (3.02), folds up into stop 2 (3.03)
    const s = split(t); if (s <= 0 || t > k.gives + .7) return;
    const u = sineIO(span(t, k.phone - .2, k.phone + .5)), up = quartIO(span(t, k.gives - .35, k.gives + .5)), [sx, sy] = tlStop(1, t);
    const x = lerp(960, sx, up), y0 = lerp(130, sy + 16, up), y1 = lerp(lerp(130, 880, u), sy + 16, up);
    ctx.strokeStyle = rgba(CREAM, .55 * (1 - span(up, .85, 1))); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x, y1); ctx.stroke();
  }

  // ------------------------------------------------------------------ 3.03 the bracket · 3.04 ★ THE SITE · 3.05 the cabin window → C2
  const bracketBox = (t) => { const [sx, sy, sc] = tlStop(1, Math.min(t, k.second)); return { x0: sx - 90 * sc, x1: sx + 90 * sc, y: sy + 150 }; };
  const openU = (t) => quartIO(span(t, k.second + .1, k.second + 1.3));
  const CABIN_WIN = { x: 196, y: 742, w: 92, h: 62 };
  const siteZoom = (t) => lerp(1.14, 1, sineIO(span(t, k.second + .1, k.fall + .4)));
  const siteFade = (t) => 1 - span(t, C2.start + .6, C2.start + 3.2);   // hidden behind the plate (only its edges show)
  const ROB_SITE = [{ x: 372, y: 640, h: 44, pose: 'reach' }, { x: 548, y: 640, h: 46, pose: 'lift' }, { x: 712, y: 523, h: 36, pose: 'reach' }];
  const ROB_FIELD = [0, 1, 2, 3].map((i) => ({ lane: [1, 3, 5, 7][i], z0: [.15, .42, .28, .6][i], v: [.035, .028, .04, .03][i] }));
  const VP = [1450, 606];
  function site(ctx, t) {
    const u = openU(t); if (u <= 0 || t > C2.start + 3.4) return;
    const bb = bracketBox(t), x0 = lerp(bb.x0, -40, u), x1 = lerp(bb.x1, W + 40, u), y0 = lerp(bb.y - 4, -40, u), y1 = lerp(bb.y + 20, H + 40, u);
    const fade = siteFade(t);
    ctx.save(); ctx.globalAlpha *= fade; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, lerp(6, 0, u)); ctx.clip();
    const z = siteZoom(t); ctx.translate(960, 600); ctx.scale(z, z); ctx.translate(-960, -600);
    // dusk sky: night → violet → a low warm band at the horizon
    ctx.fillStyle = lin(ctx, 0, -80, 0, 620, [[0, P.night0], [.55, mixHex(P.ind1, '#3b2f6e', .65)], [.9, mixHex('#3b2f6e', AMBER.shade, .5)], [1, mixHex(AMBER.shade, AMBER.body, .3)]]); ctx.fillRect(-200, -200, W + 400, 820);
    E.stars(ctx, 77, 50, t, [-((t * 4) % W), 0, W, 360], .35); E.stars(ctx, 77, 50, t, [W - ((t * 4) % W), 0, W, 360], .35);
    // far ridge, ground
    ctx.fillStyle = mixHex(P.night1, P.ind1, .55); ctx.beginPath(); ctx.moveTo(-200, 612); for (let x = -200; x <= W + 200; x += 80) ctx.lineTo(x, 600 - 14 * Math.sin(x / 210) - 8 * Math.sin(x / 77)); ctx.lineTo(W + 200, 640); ctx.lineTo(-200, 640); ctx.closePath(); ctx.fill();
    ctx.fillStyle = lin(ctx, 0, 606, 0, H, [[0, mixHex(EARTH.deep, P.night1, .4)], [1, P.night0]]); ctx.fillRect(-200, 606, W + 400, H);
    // the field: furrows to the vanishing point, faint warm crop rows
    for (let i = 0; i < 12; i++) { const bx = 820 + i * 130; ctx.strokeStyle = rgba(EARTH.rim, .28); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(VP[0] + (bx - VP[0]) * .02, 610); ctx.lineTo(bx, H + 40); ctx.stroke(); }
    // the site: slab, scaffold, part-built walls, a crane
    ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.fillRect(250, 640, 640, 14);
    ctx.strokeStyle = rgba(mixHex(CREAM2, P.blue1, .4), .7); ctx.lineWidth = 3;
    for (const x of [290, 470, 650, 830]) { ctx.beginPath(); ctx.moveTo(x, 640); ctx.lineTo(x, 430); ctx.stroke(); }
    for (const y of [527, 430]) { ctx.beginPath(); ctx.moveTo(280, y); ctx.lineTo(840, y); ctx.stroke(); }
    for (let r = 0; r < 4; r++) for (let c = 0; c < 9; c++) { if (r > 1 && c > 4) continue; ctx.fillStyle = mixHex(EARTH.warm, P.ind2, .45 + .1 * ((r + c) % 2)); ctx.fillRect(300 + c * 38 + (r % 2) * 19, 616 - r * 22, 35, 19); }
    ctx.strokeStyle = mixHex(P.night1, P.blue1, .5); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(940, 640); ctx.lineTo(940, 250); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(800, 262); ctx.lineTo(1220, 262); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(CREAM2, .5); const hook = 1090 + 40 * Math.sin(t * .25); ctx.beginPath(); ctx.moveTo(hook, 262); ctx.lineTo(hook, 400 + 20 * Math.sin(t * .3)); ctx.stroke();
    // the robots: small, distant, cold; their light comes on on "humanoid robots"
    const lightOn = (x) => expoOut(span(t, k.humanoid - .1 + (x - 300) / 1600 * .7, k.humanoid + .4 + (x - 300) / 1600 * .7));
    ROB_SITE.forEach((r, i) => { const on = lightOn(r.x), sw = Math.sin(t * 1.4 + i * 2);
      E.robot(ctx, r.x, r.y, r.h, { pose: r.pose, armR: r.pose === 'reach' ? [2.2 + .3 * sw, 2.5 + .3 * sw] : undefined, rim: mixHex(P.blue1, MACH.body, on), body: P.night1, joint: on > .2 ? rgba(MACH.core, on) : undefined, light: -1 });
      if (on > 0) halo(ctx, r.x, r.y - r.h * .94, 18 + 14 * on, .7 * on, MACH.halo, MACH.core); });
    ROB_FIELD.forEach((r, i) => {
      const zz = (r.z0 + (t - k.second) * r.v) % 1, depth = .15 + .85 * zz, bx = 820 + r.lane * 130, x = lerp(VP[0], bx, depth), y = lerp(610, H + 40, depth) - 20, h = 70 * depth * 1.1, on = lightOn(x);
      if (y > H - 30) return;
      E.robot(ctx, x, y, h, { pose: 'walk', walk: t * 3 + i * 1.3, rim: mixHex(P.blue1, MACH.body, on), body: P.night1, joint: on > .2 ? rgba(MACH.core, on) : undefined, light: -1, dir: i % 2 ? -1 : 1 });
      if (on > 0) halo(ctx, x, y - h * .94, 10 + 18 * on * depth, .7 * on, MACH.halo, MACH.core);
    });
    // the site cabin (foreground left) with its one lit window (the clip plate grows out of it)
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.fillRect(120, 712, 260, 150); ctx.fillStyle = mixHex(P.night1, P.blue1, .3); ctx.fillRect(108, 700, 284, 16);
    halo(ctx, CABIN_WIN.x + CABIN_WIN.w / 2, CABIN_WIN.y + CABIN_WIN.h / 2, 140, .5, AMBER.body, AMBER.core);
    ctx.fillStyle = lin(ctx, 0, CABIN_WIN.y, 0, CABIN_WIN.y + CABIN_WIN.h, [[0, AMBER.hot], [1, AMBER.body]]); ctx.fillRect(CABIN_WIN.x, CABIN_WIN.y, CABIN_WIN.w, CABIN_WIN.h);
    ctx.restore();
    if (u < 1) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .7 * (1 - u)); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 6); ctx.stroke(); ctx.restore(); }
    // labels on the picture (screen space, they follow the zoom)
    const sp = (x, y) => [(x - 960) * z + 960, (y - 600) * z + 600];
    const [lx, ly] = sp(560, 420), [fx, fy] = sp(1450, 590);
    lab(ctx, 'BUILDING SITES', lx, ly - 24, span(t, k.building - .1, k.building + .5) * fade, { size: 26, col: CREAM, align: 'center', out: span(t, k.fall - .3, k.fall + .1) });
    lab(ctx, 'FARMS', fx, fy - 30, span(t, k.farms - .1, k.farms + .5) * fade, { size: 26, col: CREAM, align: 'center', out: span(t, k.fall - .25, k.fall + .15) });
  }
  const winRect = (t) => { const z = siteZoom(t), w = CABIN_WIN; return { x: (w.x - 960) * z + 960, y: (w.y - 600) * z + 600, w: w.w * z, h: w.h * z }; };
  const CAP = { x: 160, y: 236, w: 1600, h: 196 };
  const capOn = (t) => t >= C2.end + .5;
  function plate(ctx, t) {
    if (t < k.fall - .3 || t > C2.end + .55) return;
    const grow = quartIO(span(t, k.fall - .25, k.fall + 1.15)), shrink = quartIO(span(t, C2.end - .55, C2.end + .5));
    const from = shrink > 0 ? CAP : winRect(t), morph = shrink > 0 ? 1 - shrink : grow;
    const dark = Math.max(1 - span(t, C2.start - .55, C2.start + .2), span(t, C2.end - .75, C2.end - .05));   // the footage comes up / goes down over ~.7 s (no lurch)
    F.clipPlate(ctx, t, T, 'C2', { from, morph, dark: dark * (t < C2.start ? lerp(1, .75, span(t, k.fall + .2, k.fall + 1.6)) : 1), label: span(t, C2.start + .2, C2.start + 1.1) * (1 - span(t, C2.end - .8, C2.end - .3)) });
  }

  // ------------------------------------------------------------------ 3.06–3.08 his sentence as a caption · the tiles · the rewind
  const CAP_TEXT = 'If we don’t choose to massively slow down or stop, then we will have robots that can build houses, grow food, do surgery,';
  const CAP_SIZE = 46, CAP_PAD = 56;
  const capLines = (() => { const ws = CAP_TEXT.split(' '), L = []; let cur = []; for (const w of ws) { const nx = [...cur, w]; if (cur.length && F.measure(nx.join(' '), CAP_SIZE, true) > CAP.w - CAP_PAD * 2) { L.push(cur); cur = [w]; } else cur = nx; } if (cur.length) L.push(cur); return L; })();
  const capWords = []; capLines.forEach((ln, li) => { let x = CAP.x + CAP_PAD; ln.forEach((w) => { const ww = F.measure(w, CAP_SIZE, true); capWords.push({ w, x, y: CAP.y + 74 + li * CAP_SIZE * 1.3, ww, li }); x += ww + CAP_SIZE * .26; }); });
  const wIdx = (s) => capWords.findIndex((o) => o.w.toLowerCase().startsWith(s));
  const iHouses = wIdx('houses'), iFood = wIdx('food'), iGrow = wIdx('grow'), iBuild = wIdx('build'), iSurgery = wIdx('surgery');
  const capOut = (t) => expoIn(span(t, k.weather - .45, k.weather + .15));
  // rewind: a gold playhead runs from the end back to the start ("go back to how his sentence begins")
  const rew = (t) => sineIO(span(t, k.back - .1, k.begins + .1));
  const capPos = (u) => { const n = capWords.length, f = (1 - u) * n; return f; };   // words with index ≥ f are "unread" after the rewind
  function caption(ctx, t) {
    if (!capOn(t) || t > k.weather + .4) return;
    const out = capOut(t);
    ctx.save(); ctx.translate(0, 0);
    ctx.globalAlpha *= 1 - out;
    ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(CAP.x, CAP.y, CAP.w, CAP.h, 8); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    const wu = span(t, C2.end + .45, C2.end + .9), r = rew(t), f = capPos(r);
    const lit = (i) => { const o = capWords[i]; if (i < 4) return span(t, [k.ifW, k.we, k.dont, k.choose][i] - .05, [k.ifW, k.we, k.dont, k.choose][i] + .2); return 0; };
    capWords.forEach((o, i) => {
      const goldW = (i === iBuild || i === iHouses ? span(t, k.houses - .1, k.houses + .25) : i === iGrow || i === iFood ? span(t, k.food - .1, k.food + .25) : 0) * (1 - span(t, k.goBack - .2, k.goBack + .3));
      const faded = r > 0 && i >= f ? .4 : 1, g = Math.max(goldW, lit(i));
      const col = mixHex(mixHex(CREAM2, P.cream, faded > .5 ? 1 : .2), GOLD.body, g);
      ctx.save(); ctx.globalAlpha *= (1 - out) * (r > 0 && i >= f ? .45 : 1) * (i >= 4 && t > k.ifW - .2 ? lerp(1, .55, span(t, k.ifW - .2, k.ifW + .3)) : 1);
      F.goldText(ctx, [[o.w, g]], o.x, o.y + out * 60, CAP_SIZE, rise(span(wu, i * .01, .6 + i * .01)), { serif: true, col: mixHex(faded > .5 ? P.cream : CREAM2, P.cream, 0), glow: g > .3 });
      ctx.restore();
    });
    if (r > 0 && r < 1) { const i = Math.min(capWords.length - 1, Math.floor(f)), o = capWords[i], fr = f - i, x = o.x + o.ww * fr; halo(ctx, x, o.y - 14, 50, .7, GOLD.halo, GOLD.core); gs(ctx, [[x, o.y - 46], [x, o.y + 14]], 0, 1, { w: 2.4, spark: false }); }
  }
  const rise = (x) => 1 - (1 - clamp(x)) ** 3;
  // the underline under IF WE DON'T CHOOSE (3.08) → the road's centre line (3.09)
  const ulA = [capWords[0].x, capWords[0].y + 16], ulB = [capWords[3].x + capWords[3].ww, capWords[3].y + 16];
  const ROAD = { top: [960, 600], bl: [520, H + 20], br: [1400, H + 20], hor: 470, left: [700, 480], right: [1220, 480] };
  const toRoad = (t) => quartIO(span(t, k.weather - .3, k.weather + .7));
  function underline(ctx, t) {
    const u = sineIO(span(t, k.choose - .05, k.choose + .5)); if (u <= 0 || t > k.built + .5) return;
    const m = toRoad(t), lev = quartIO(span(t, k.built - .2, k.built + .7));
    const a = [lerp(ulA[0], ROAD.bl[0] * .5 + ROAD.br[0] * .5, m), lerp(ulA[1], H - 10, m)], b = [lerp(ulB[0], ROAD.top[0], m), lerp(ulB[1], ROAD.top[1], m)];
    if (m <= 0) gs(ctx, [ulA, ulB], 0, u, { w: 3, spark: u < 1 });
    else if (lev < 1) {   // the centre line in dashes, flowing toward the horizon
      ctx.save(); ctx.globalAlpha *= 1 - lev; ctx.setLineDash([26, 22]); ctx.lineDashOffset = t * 60; ctx.strokeStyle = GOLD.line; ctx.lineWidth = lerp(3, 4, m); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.restore();
    }
  }
  // the three tiles (3.07) rise out of their words
  const TILES = [{ at: () => k.houses, from: iHouses, x: 560, glyph: 'house', label: 'HOUSES' }, { at: () => k.food, from: iFood, x: 960, glyph: 'wheat', label: 'FOOD' }, { at: () => k.workDone, from: iSurgery, x: 1360, glyph: 'hand', label: 'WORK DONE WITH HANDS' }];
  function tiles(ctx, t) {
    if (t < k.houses - .5 || t > k.goBack + .8) return;
    const out = expoIn(span(t, k.goBack - .15, k.goBack + .45));
    TILES.forEach((ti, i) => {
      const t0 = ti.at(), u = quartIO(span(t, t0 - .25, t0 + .5)); if (u <= 0) return;
      const o = capWords[ti.from], x = lerp(o.x + o.ww / 2, ti.x, u), y = lerp(o.y - 14, 640, u) + out * 420, s = lerp(30, 200, u);
      F.tile(ctx, t, x, y, s, { lift: u, v: 1, a: 1 - out });
      const gs = s * .56, col = AMBER.shade;
      ctx.save(); ctx.globalAlpha *= 1 - out;
      if (ti.glyph === 'house') { ctx.fillStyle = col; ctx.fill(xf(houseP(), { a: gs, b: 0, c: 0, d: gs, e: x, f: y })); }
      else if (ti.glyph === 'wheat') { ctx.fillStyle = col; ctx.fill(xf(wheatP(), { a: gs, b: 0, c: 0, d: gs, e: x, f: y })); }
      else F.glyph(ctx, 'hand', x, y, gs, col, 1);
      ctx.restore();
      lab(ctx, ti.label, ti.x, 800, span(t, t0, t0 + .5), { size: 26, col: CREAM, align: 'center', out: span(t, k.goBack - .2, k.goBack + .2) });
    });
  }

  // ------------------------------------------------------------------ 3.09 the road, the cloud, the fork
  function road(ctx, t) {
    const m = toRoad(t), lev = quartIO(span(t, k.built - .2, k.built + .7)); if (m <= 0 || lev >= 1) return;
    const e = sineIO(span(t, k.weather + .1, k.weather + .8)), fork = quartIO(span(t, k.decS + .3, k.decision + .15));
    ctx.save(); ctx.globalAlpha *= 1 - lev;
    // the horizon
    ctx.strokeStyle = rgba(CREAM2, .3 * e); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lerp(960, 100, e), ROAD.hor); ctx.lineTo(lerp(960, W - 100, e), ROAD.hor); ctx.stroke();
    // the trunk (edges draw out from the centre line)
    const tl = [lerp(ROAD.top[0] - 4, ROAD.top[0] - 38, e), ROAD.top[1]], tr = [lerp(ROAD.top[0] + 4, ROAD.top[0] + 38, e), ROAD.top[1]];
    const bl = [lerp(960, ROAD.bl[0], e), ROAD.bl[1]], br = [lerp(960, ROAD.br[0], e), ROAD.br[1]];
    ctx.fillStyle = lin(ctx, 0, ROAD.top[1], 0, H, [[0, rgba(P.ind1, .55)], [1, rgba(mixHex(P.night1, P.blue1, .3), .85)]]);
    ctx.beginPath(); ctx.moveTo(...tl); ctx.lineTo(...tr); ctx.lineTo(...br); ctx.lineTo(...bl); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .5 * e); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...tl); ctx.lineTo(...bl); ctx.moveTo(...tr); ctx.lineTo(...br); ctx.stroke();
    // the far stretch: straight on to the horizon, or the two branches of the fork
    for (const [s, end] of [[-1, ROAD.left], [1, ROAD.right]]) {
      const ex = lerp(960 + s * 14, end[0], fork), ey = lerp(ROAD.hor, end[1], fork);
      ctx.fillStyle = rgba(P.ind1, .55 * e); ctx.beginPath(); ctx.moveTo(ROAD.top[0] + s * 38, ROAD.top[1]); ctx.lineTo(ROAD.top[0] + s * 2, ROAD.top[1]); ctx.lineTo(ex + s * 2 * (1 - fork) - s * 8 * fork, ey); ctx.lineTo(ex + s * 10, ey); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba(CREAM, .45 * e); ctx.beginPath(); ctx.moveTo(ROAD.top[0] + s * 38, ROAD.top[1]); ctx.lineTo(ex + s * 10, ey); ctx.stroke();
      if (fork > 0) gs(ctx, [[960, ROAD.top[1]], [lerp(960, end[0], fork), lerp(ROAD.top[1], end[1], fork)]], 0, 1, { w: 2.4, spark: fork < 1, a: .9 });
    }
    if (fork > 0) halo(ctx, 960, ROAD.top[1], 110, .5 * fork, GOLD.halo, GOLD.core);
    ctx.restore();
    // the forecast cloud: rises over the horizon on "weather", dissolves into specks on "a decision"
    const cu = expoOut(span(t, k.weatherW - .35, k.weatherW + .45)), dis = span(t, k.decS - .05, k.decS + 1.1);
    if (cu > 0 && dis < 1) {
      const cx = 960, cy = 300 + (1 - cu) * 340, r = E.prng(3131);   // starts wholly below the horizon
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, ROAD.hor); ctx.clip();
      const solid = 1 - span(dis, 0, .4);
      if (solid > 0) {   // the cloud thins as its specks blow away (no one-frame switch)
        ctx.save(); ctx.globalAlpha *= solid;
        halo(ctx, cx, cy, 300, .18, P.blue0, P.ind1);
        ctx.fillStyle = lin(ctx, 0, cy - 90, 0, cy + 60, [[0, mixHex(CREAM2, P.cream, .3)], [1, mixHex(CREAM2, P.blue1, .5)]]);
        ctx.beginPath(); for (const [dx, dy, rr] of [[-150, 20, 62], [-70, -30, 84], [40, -50, 96], [140, 0, 70], [0, 30, 80], [-100, 40, 50], [110, 40, 55]]) { ctx.moveTo(cx + dx + rr, cy + dy); ctx.arc(cx + dx, cy + dy, rr, 0, TAU); } ctx.fill();
        ctx.strokeStyle = rgba(CREAM2, .45); ctx.lineWidth = 3; for (let i = 0; i < 9; i++) { const x = cx - 160 + i * 40, y0 = cy + 90 + ((t * 120 + i * 37) % 60); ctx.beginPath(); ctx.moveTo(x, y0); ctx.lineTo(x - 8, y0 + 22); ctx.stroke(); }
        ctx.restore();
      }
      if (dis > 0) {
        for (let i = 0; i < 260; i++) { const a = r() * TAU, rr = Math.sqrt(r()) * 170, x = cx + Math.cos(a) * rr * 1.4, y = cy + Math.sin(a) * rr * .55, sp = .6 + r(), dx = Math.cos(a) * 260 * dis * sp, dy = -120 * dis * sp + Math.sin(a) * 60 * dis;
          ctx.fillStyle = rgba(CREAM2, .8 * (1 - dis) * span(dis, 0, .25) * (.5 + .5 * r())); ctx.fillRect(x + dx, y + dy, 3, 3); }
      }
      ctx.restore();
    }
  }

  // ------------------------------------------------------------------ 3.10–3.12 the levers, the switch, the dials
  const LEV = [660, 960, 1260], LEV_Y0 = 390, LEV_Y1 = 690, LEV_T = () => [k.builtW, k.bought, k.switched];
  const levOn = (t) => quartIO(span(t, k.built - .2, k.built + .7));
  const levOut = (t) => expoIn(span(t, k.halt - .35, k.halt + .3));
  const pull = (t, i) => { const tw = LEV_T()[i]; return quartIO(span(t, tw - .05, tw + .45)); };
  function smallHand(ctx, x, y, ang, L, a = 1) {   // a small amber hand (a person's), gripping
    if (!PATHS.has('armHand')) { const ext = new Path2D(); ext.moveTo(-3.3, -.66); ext.lineTo(-20, -.66); ext.lineTo(-20, .76); ext.lineTo(-3.3, .76); ext.closePath(); PATHS.set('armHand', E.handPath({ pose: 'hold' }).op(ext, PathOp.Union)); }
    const m = E.handMatrix(x, y, ang, L, 1), p = xf(PATHS.get('armHand'), m);   // the arm runs on out of frame (no floating forearm)
    ctx.save(); ctx.globalAlpha *= a; halo(ctx, x, y, L * 2.2, .3, AMBER.body, AMBER.core);
    ctx.fillStyle = lin(ctx, x - L, y - L, x + L, y + L, [[0, AMBER.hot], [1, mixHex(AMBER.body, AMBER.shade, .4)]]); ctx.fill(p); ctx.restore();
  }
  function levers(ctx, t) {
    const on = levOn(t); if (on <= 0 || t > k.howFast + .5) return;
    const out = levOut(t), fold = quartIO(span(t, k.halt - .25, k.halt + .6));
    // the desk (rises out of the fork's place)
    ctx.save(); ctx.globalAlpha *= 1 - out;
    const pw = 1000 * on, ph = 420 * on; ctx.fillStyle = rgba(mixHex(P.night1, P.ind1, .5), .9); ctx.beginPath(); ctx.roundRect(960 - pw / 2, 330 + 420 - ph + out * 500, pw, ph, 14); ctx.fill();
    ctx.strokeStyle = rgba(CREAM, .25); ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
    // the three tracks: from the fork (left branch, trunk, right branch) into vertical slots
    const from = [[ROAD.left, ROAD.top], [ROAD.top, [960, H]], [ROAD.right, ROAD.top]];
    LEV.forEach((x, i) => {
      if (i === 2 && fold > 0) return;   // the third one is drawn by switch3()
      const [p0, p1] = from[i], a0 = [lerp(p0[0], x, on), lerp(p0[1], LEV_Y0, on) + out * 500], a1 = [lerp(p1[0], x, on), lerp(p1[1], LEV_Y1, on) + out * 500];
      ctx.save(); ctx.globalAlpha *= 1 - out;
      ctx.strokeStyle = rgba(GOLD.line, .8 * (1 - on)); ctx.lineWidth = 3; if (on < 1) { ctx.beginPath(); ctx.moveTo(...a0); ctx.lineTo(...a1); ctx.stroke(); }
      if (on > .5) { ctx.globalAlpha *= span(on, .5, 1); ctx.fillStyle = mixHex(P.night0, P.ind1, .3); ctx.beginPath(); ctx.roundRect(x - 14, a0[1], 28, a1[1] - a0[1], 14); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.stroke(); }
      ctx.restore();
      if (on >= 1) lever1(ctx, t, i, x, out);
      lab(ctx, SRC.levers[i], x, LEV_Y1 + 60 + out * 500, span(t, LEV_T()[i] - .1, LEV_T()[i] + .4), { size: 26, col: CREAM, align: 'center', out: out });
    });
  }
  function lever1(ctx, t, i, x, out) {   // a knob on a stick; a small amber hand rises, grips it and pulls it down on its word
    const p = pull(t, i), ky = lerp(LEV_Y0 + 30, LEV_Y1 - 30, p) + out * 500, tw = LEV_T()[i];
    ctx.save(); ctx.globalAlpha *= 1 - out;
    ctx.strokeStyle = mixHex(CREAM2, P.blue1, .3); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, ky); ctx.lineTo(x, ky - 64); ctx.stroke();
    const lit = p; halo(ctx, x, ky - 70, 70, .2 + .5 * lit, AMBER.body, AMBER.core);
    ctx.fillStyle = lin(ctx, 0, ky - 98, 0, ky - 42, [[0, mixHex(CREAM, AMBER.core, lit)], [1, mixHex(P.blue1, AMBER.body, lit)]]); ctx.beginPath(); ctx.arc(x, ky - 70, 28, 0, TAU); ctx.fill();
    ctx.restore();
    const hu = quartIO(span(t, tw - .75, tw - .05)), hOut = sineIO(span(t, tw + .5, tw + 1.2));   // the arm comes up from below along its own line (no sweep)
    if (hu > 0 && hOut < 1) smallHand(ctx, x - 12, lerp(H + 420, ky + 44, hu) + hOut * 420, -Math.PI / 2 + .22, 42, 1 - out);
  }
  const SW = [960, 560], SWW = 380;
  function switch3(ctx, t) {   // 3.11: the third lever folds into the ON switch (H.12); it wobbles toward OFF and springs back
    const fold = quartIO(span(t, k.halt - .25, k.halt + .6)); if (fold <= 0 || t > k.before + .3) return;   // (the dials live here until 'Before')
    const split2 = quartIO(span(t, k.howFast - .15, k.howFast + .6)), sOut = expoIn(span(t, k.howFast - .1, k.howFast + .5));
    const vx = LEV[2], h = SWW * .42;
    const cx = lerp(vx, SW[0], fold), cy = lerp((LEV_Y0 + LEV_Y1) / 2, SW[1], fold), w = lerp(28, SWW, fold), hh = lerp(LEV_Y1 - LEV_Y0, h, fold);
    let on = 1; const wob = span(t, k.expect - .1, k.expect + 1.1); if (wob > 0 && wob < 1) on = 1 - .4 * Math.sin(Math.PI * clamp(wob * 2)) * (wob < .5 ? 1 : 0) + (wob >= .5 ? .07 * Math.exp(-(wob - .5) * 8) * Math.sin((wob - .5) * 30) : 0);
    ctx.save(); ctx.translate(0, 200 * sOut); ctx.globalAlpha *= 1 - sOut;
    const lv = span(fold, .7, 1);   // the folding lever hands over to the kit switch over the last 30 % of the fold (no one-frame swap)
    if (sOut >= 1) { /* the switch has gone */ } else { if (fold < 1) { ctx.save(); ctx.globalAlpha *= 1 - lv;
      ctx.fillStyle = mixHex(P.night1, P.ind1, .6); ctx.beginPath(); ctx.roundRect(cx - w / 2, cy - hh / 2, w, hh, Math.min(w, hh) / 2); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2.5; ctx.stroke();
      const kx = lerp(vx, SW[0] + SWW / 2 - h / 2, fold), ky = lerp(LEV_Y1 - 100, SW[1], fold), kr = lerp(28, h * .4, fold);
      halo(ctx, kx, ky, kr * 2.4, .4, AMBER.body, AMBER.core); ctx.fillStyle = lin(ctx, 0, ky - kr, 0, ky + kr, [[0, mixHex(AMBER.core, CREAM, .3)], [1, mixHex(AMBER.body, AMBER.shade, .3)]]); ctx.beginPath(); ctx.arc(kx, ky, kr, 0, TAU); ctx.fill();
    ctx.restore(); }
      if (lv > 0) F.lever(ctx, t, SW[0], SW[1], SWW, clamp(on, 0, 1.1), { a: lv * (1 - split2) }); }
    ctx.restore();
    // 3.12: the knob clones into the two dials
    if (split2 > 0) {
      const kx = SW[0] + SWW / 2 - h / 2;
      DIAL.forEach((d, i) => { const x = lerp(kx, d.x, split2), y = SW[1], r = lerp(h * .4, d.r, split2); dial(ctx, t, x, y, r, i, split2); });
    }
  }
  const DIAL = [{ x: 700, r: 110 }, { x: 1220, r: 110 }];
  const dialTurn = (t, i) => quartIO(span(t, [k.fast, k.where][i] - .15, [k.fast, k.where][i] + .55));
  function dial(ctx, t, x, y, r, i, u) {
    const out = expoIn(span(t, k.before - .45, k.before + .2)); if (out >= 1) return;
    y += out * 500;
    const a0 = -Math.PI * 1.25, a1 = Math.PI * .25, ang = lerp(a0 + .3, i ? -Math.PI * .7 : -Math.PI * .15, dialTurn(t, i)) + .02 * Math.sin(t * 1.7 + i);
    ctx.save(); ctx.globalAlpha *= 1 - out;
    halo(ctx, x, y, r * 2, .2 * u, AMBER.body, AMBER.core);
    ctx.fillStyle = mixHex(mixHex(AMBER.core, AMBER.body, .5), mixHex(P.night1, P.ind1, .6), clamp(u * 2.2)); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2.5; ctx.stroke();   // the face darkens out of the knob's amber
    if (u > .4) { ctx.globalAlpha *= span(u, .4, 1); for (let j = 0; j <= 10; j++) { const a = lerp(a0, a1, j / 10); ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = j % 5 ? 2 : 3.5; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r * .78, y + Math.sin(a) * r * .78); ctx.lineTo(x + Math.cos(a) * r * .92, y + Math.sin(a) * r * .92); ctx.stroke(); }
      ctx.strokeStyle = rgba(AMBER.body, .9); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r * .85, a0, ang); ctx.stroke(); }
    ctx.strokeStyle = AMBER.hot; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(ang) * r * .66, y + Math.sin(ang) * r * .66); ctx.stroke();
    ctx.fillStyle = lin(ctx, 0, y - r * .3, 0, y + r * .3, [[0, mixHex(AMBER.core, CREAM, .3)], [1, mixHex(AMBER.body, AMBER.shade, .3)]]); ctx.beginPath(); ctx.arc(x, y, r * .26, 0, TAU); ctx.fill();
    ctx.restore();
    // the hand that turns it: arrives before its word, turns with the pointer, leaves
    const tw = [k.fast, k.where][i], hu = quartIO(span(t, tw - .85, tw - .15)), ho = sineIO(span(t, tw + .6, tw + 1.3));
    if (hu > 0 && ho < 1) { const tw2 = .25 * (dialTurn(t, i) - .5); smallHand(ctx, x - 8 + 30 * tw2, lerp(H + 420, y + r * .26 + 40, hu) + ho * 420 + out * 500, -Math.PI / 2 + .2 + tw2, 38, 1 - out); }   // grips the knob from below; the wrist turns with it
    lab(ctx, SRC.dials[i], x, y + r + 60, span(t, tw - .1, tw + .4), { size: 28, col: CREAM, align: 'center', out });
  }

  // ------------------------------------------------------------------ 3.13–3.17 IS HE RIGHT? · the print · the diagram · the warning card
  const PR = { x: 330, y: 830, h: 520 }, NP = [620, 330];
  const prOn = (t) => sineIO(span(t, k.who - .25, k.who + .85)) * (1 - expoIn(span(t, k.skeptic - .35, k.skeptic + .35)));
  const diaOut = (t) => expoIn(span(t, k.skeptic - .3, k.skeptic + .3));
  const MS = { x: 1010, y: 560, w: 300, h: 96 }, CO = { x: 1560, y: 560, w: 400, h: 124 };
  function node(ctx, t, b, lines, u, o = {}) {
    u = clamp(u); if (u <= 0) return;
    const out = diaOut(t), k2 = expoOut(u), y = b.y + out * 500;
    ctx.save(); ctx.globalAlpha *= clamp(u * 3) * (1 - out);
    ctx.translate(b.x, y); ctx.scale(1, lerp(.2, 1, k2));
    if (o.glow > 0) halo(ctx, 0, 0, b.w * .8, .35 * o.glow, MACH.halo, MACH.core);
    ctx.fillStyle = mixHex(P.night1, P.ind2, .55); ctx.beginPath(); ctx.roundRect(-b.w / 2, -b.h / 2, b.w, b.h, 12); ctx.fill();
    ctx.strokeStyle = mixHex(rgba(CREAM, .7), MACH.body, 0); ctx.strokeStyle = o.glow > 0 ? mixHex(CREAM, MACH.body, o.glow) : rgba(CREAM, .7); ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
    lines.forEach((ln, i) => F.heavy(ctx, ln, b.x, y - (lines.length - 1) * 20 + i * 42 + 15, lines.length > 1 ? 34 : 44, rise(span(u, .3 + i * .1, 1)), { align: 'center', a: 1 - out }));
  }
  const card = { x: 140, y: 620, w: 380, h: 190 };
  function warnCard(ctx, t) {
    const u = quartIO(span(t, k.warningW - .4, k.warningW + .5)); if (u <= 0) return;
    const out = diaOut(t);
    // 3.17: the push (contact → spring back, settling heavier and lower)
    const tc = k.harderW - .35, hand = handPush(t), dt = t - tc;
    const disp = dt > 0 ? 120 * Math.exp(-dt * 3.2) * Math.cos(dt * 9) * (dt < .12 ? dt / .12 : 1) : 0, rot = disp * .0022, heavy = span(t, tc + .3, tc + 1.2);
    ctx.save(); ctx.translate(disp, 14 * heavy + out * 500);
    ctx.translate(card.x + card.w / 2, card.y + card.h); ctx.rotate(rot); ctx.translate(-card.x - card.w / 2, -card.y - card.h);
    if (heavy > 0) { ctx.fillStyle = rgba(P.night0, .5 * heavy); ctx.beginPath(); ctx.ellipse(card.x + card.w / 2, card.y + card.h + 16, card.w * .55, 18, 0, 0, TAU); ctx.fill(); }
    F.paperCard(ctx, t, card.x, card.y, card.w, card.h, { u, head: 'HIS WARNING', lines: [[SRC.fewer, 40, heavy, false]], a: 1 - out });
    if (heavy > 0) { ctx.strokeStyle = rgba(GOLD.line, .8 * heavy); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(card.x, card.y, card.w, card.h, 6); ctx.stroke(); }
    ctx.restore();
    if (hand) { const p = xf(E.handPath({ pose: 'open', spread: .3 }), E.handMatrix(hand[0], hand[1], -.08, 70, 1)); ctx.save(); ctx.fillStyle = rgba(mixHex(CREAM2, P.blue1, .35), .92); ctx.fill(p); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 2; ctx.stroke(p); ctx.restore(); }
  }
  function handPush(t) {   // a flat hand comes in from the left edge, shoves the card, withdraws
    const tc = k.harderW - .35, a = expoIn(span(t, tc - .45, tc)), b = expoOut(span(t, tc + .05, tc + .6)); if (a <= 0 || b >= 1) return null;
    const x = lerp(-280, card.x - 150, a) - 340 * b, y = card.y + card.h * .55;
    return [x, y];
  }
  function diagram(ctx, t) {
    if (t < k.who - .2 || t > k.skeptic + .5) return;
    const out = diaOut(t), pu = prOn(t);
    F.portrait(ctx, t, PR.x, PR.y, PR.h, { u: pu });
    F.nameplate(ctx, t, NP[0], NP[1], span(t, k.who + .2, k.who + .9) * (1 - span(t, k.skeptic - .3, k.skeptic + .2)), 'BILL GATES', SRC.cofounder);
    F.source(ctx, t, k.who + .3, k.skeptic, F.photoCredit());
    // GATES → MICROSOFT (co-founded)
    const l1 = sineIO(span(t, k.cofW - .2, k.msft + .1)), yo = out * 500;
    if (l1 > 0) { gs(ctx, [[NP[0] - 18, NP[1] + 40 + yo], [NP[0] - 18, MS.y + yo], [MS.x - MS.w / 2 - 6, MS.y + yo]], 0, l1, { w: 2.6, a: 1 - out });
      lab(ctx, 'CO-FOUNDED', (NP[0] + MS.x - MS.w / 2) / 2 + 10, MS.y - 16 + yo, span(t, k.cofW, k.cofW + .5), { size: 22, col: GOLD.text, align: 'center', out }); }
    node(ctx, t, MS, ['MICROSOFT'], span(t, k.msft - .25, k.msft + .35));
    // MICROSOFT ⟷ THE COMPANY BEHIND CHATGPT (one of the biggest shareholders)
    const l2 = sineIO(span(t, k.one - .1, k.share + .1)), lx0 = MS.x + MS.w / 2 + 8, lx1 = CO.x - CO.w / 2 - 8;
    if (l2 > 0) { gs(ctx, [[lx0, MS.y + yo], [lerp(lx0, lx1, l2), MS.y + yo]], 0, 1, { w: 2.6, a: 1 - out, spark: l2 < 1 });
      for (const [x, s] of [[lx0, 1], [lx1, -1]]) if (s > 0 || l2 >= 1) { ctx.save(); ctx.globalAlpha *= 1 - out; ctx.fillStyle = GOLD.line; ctx.beginPath(); ctx.moveTo(x, MS.y + yo); ctx.lineTo(x + s * 14, MS.y - 8 + yo); ctx.lineTo(x + s * 14, MS.y + 8 + yo); ctx.closePath(); ctx.fill(); ctx.restore(); }
      lab(ctx, SRC.shareholder, (lx0 + lx1) / 2 + 60, MS.y + 120 + yo, span(t, k.biggest - .1, k.share + .3), { size: 24, col: CREAM, align: 'center', out }); }
    node(ctx, t, CO, ['THE COMPANY', 'BEHIND CHATGPT'], span(t, k.company - .25, k.chatgpt + .2), { glow: span(t, k.tech - .2, k.tech + .4) * (1 - out) });
    // 3.16: PROFITS flow back from the technology to MICROSOFT
    const fl = span(t, k.profits - .9, k.profits + 2.6);
    if (fl > 0 && fl < 1) for (let i = 0; i < 9; i++) { const q = ((t - (k.profits - .9)) * .9 + i / 9) % 1, x = lerp(lx1, lx0, q), a = Math.sin(Math.PI * q) * Math.sin(Math.PI * fl) * (1 - out); halo(ctx, x, MS.y + yo, 22, .8 * a, GOLD.halo, GOLD.core); }
    F.say(ctx, t, [['PROFITS', k.profits]], (lx0 + lx1) / 2, MS.y - 40, { size: 46, align: 'center', gold: [0], out: k.skeptic - .35 });
    warnCard(ctx, t);
  }
  // the "?" of IS HE RIGHT? travels to where the print rises (3.14)
  function questionMark(ctx, t, rightEnd) {
    if (t < k.right - .3 || t > k.who + .9) return;
    const m = quartIO(span(t, k.who - .55, k.who + .25)), u = span(t, k.right - .25, k.right + .3), sink = expoIn(span(t, k.who + .1, k.who + .7));
    const x = lerp(rightEnd[0], PR.x + 250, m), y = lerp(rightEnd[1], 470, m) + sink * 240, size = lerp(130, 150, m);
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, m > .9 ? 520 : H); ctx.clip();
    F.heavy(ctx, '?', x, y, size, rise(u), { col: CREAM });
    ctx.restore();
  }

  // ------------------------------------------------------------------ 3.18 the rule, the blocks → plateNumbers
  const NC = S.NUM_CHART, BASE_Y = NC.y + NC.h, BAR_X = NC.x + NC.w + 60, BAR_H = 230, BASE_X1 = W - 140;
  const barDrop = (t) => span(t, k.skeptic + .2, k.skeptic + .62);
  const lay = (t) => quartIO(span(t, k.players - .1, k.conv - .05));
  function barrier(ctx, t) {
    const d = barDrop(t); if (d <= 0) return;
    const fall = expoIn(d), bounce = d >= 1 ? 10 * Math.exp(-(t - k.skeptic - .62) * 9) * Math.abs(Math.sin((t - k.skeptic - .62) * 20)) : 0;
    const L = lay(t), ang = -Math.PI / 2 * (1 - L), len = lerp(BAR_H, BASE_X1 - BAR_X, L);
    const foot = [BAR_X, BASE_Y - bounce], top0 = -BAR_H - 500 * (1 - fall);
    // the ground (retracts into the foot of the rule as it lies down)
    const gu = sineIO(span(t, k.skeptic + .55, k.skeptic + 1.2)) * (1 - L);
    if (gu > 0) { ctx.strokeStyle = rgba(CREAM, .3 * gu); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lerp(BAR_X, 160, gu), BASE_Y); ctx.lineTo(lerp(BAR_X, 1780, gu), BASE_Y); ctx.stroke(); }
    const pts = L > 0 ? [foot, [foot[0] + Math.cos(ang) * len, foot[1] + Math.sin(ang) * len]] : [[BAR_X, BASE_Y + top0 + BAR_H - BAR_H], [BAR_X, BASE_Y + top0 + BAR_H - bounce]];
    if (L <= 0) { const y0 = BASE_Y - BAR_H - 500 * (1 - fall) - bounce; gs(ctx, [[BAR_X, y0], [BAR_X, Math.min(BASE_Y - bounce, y0 + BAR_H)]], 0, 1, { w: 5, spark: false }); }
    else gs(ctx, pts, 0, 1, { w: lerp(5, 2, L), a: lerp(1, .8, L), spark: false });
    if (d >= 1 && t < k.strict + .2) halo(ctx, BAR_X, BASE_Y, 90, .6 * bumpT(t, k.skeptic + .6, .5), GOLD.halo, GOLD.core);
  }
  const SMALL = [0, 1, 2].map((i) => ({ tc: k.strict + .1 + i * .38, s: 54 - i * 6 }));
  function blocks(ctx, t) {
    if (t < k.strict - .6 || t > k.conv) return;
    const sink = expoIn(span(t, k.players - .15, k.players + .35));
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, BASE_Y); ctx.clip(); ctx.translate(0, sink * 200);
    SMALL.forEach((b, i) => {   // they slide in, hit the rule, recoil (contact → bounce 60 ms), rest
      const xc = BAR_X - 6 - b.s / 2; let x;
      if (t < b.tc) { const u = span(t, b.tc - .6, b.tc); if (u <= 0) return; x = xc - 560 * (1 - u) * (1 - u); }
      else { const dt = t - b.tc; x = xc - (70 + i * 64) * (1 - Math.exp(-6 * dt)) - 14 * Math.exp(-5 * dt) * Math.sin(16 * dt); }
      const fl = bumpT(t, b.tc, .3); if (fl > 0) halo(ctx, BAR_X, BASE_Y - b.s / 2, 60, .6 * fl, GOLD.halo, GOLD.core);
      ctx.fillStyle = lin(ctx, 0, BASE_Y - b.s, 0, BASE_Y, [[0, mixHex(CREAM2, P.blue1, .2)], [1, mixHex(P.blue1, P.ind2, .4)]]); ctx.beginPath(); ctx.roundRect(x - b.s / 2, BASE_Y - b.s, b.s, b.s, 6); ctx.fill();
    });
    // the big one steps over (an arc over the rule), lands on the other side
    const bu = span(t, k.suit - .5, k.suit + .2), hop = quartIO(span(t, k.suit + .15, k.biggestW + .35)), bw = 150, bh = 170;
    if (bu > 0) {
      const x = hop > 0 ? lerp(BAR_X - bw / 2 - 10, BAR_X + bw / 2 + 120, hop) : lerp(BAR_X - 760, BAR_X - bw / 2 - 10, expoOut(bu)), lift = Math.sin(Math.PI * hop) * (BAR_H - bh + 70), rot = Math.sin(Math.PI * hop) * .12;
      ctx.save(); ctx.translate(x, BASE_Y - bh / 2 - lift); ctx.rotate(rot);
      halo(ctx, 0, 0, 220, .22, P.halo2, CREAM);
      ctx.fillStyle = lin(ctx, 0, -bh / 2, 0, bh / 2, [[0, mixHex(CREAM, CREAM2, .3)], [1, mixHex(CREAM2, P.blue1, .5)]]); ctx.beginPath(); ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 10); ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
  function chartBack(ctx, t) {   // the −19 % chart returns small at the left (lib/f41_world.mjs gapChart), as in plateNumbers
    const u = sineIO(span(t, k.players - .2, k.conv - .1)); if (u <= 0) return;
    S.gapChart(ctx, t, NC, { u });
  }

  // ------------------------------------------------------------------ words
  function words(ctx, t, said) {
    F.say(ctx, t, [['GOOD', k.good], ['NEWS', k.news]], 140, 250, { size: 92, out: k.start - .4 });
    F.say(ctx, t, [['FOR', k.forW], ['WORK', k.works], ['WITH', k.works + .29], ['YOUR', k.handsW - .12], ['HANDS?', k.handsW]], 140, 330, { size: 50, gold: [4], out: k.start - .35 });
    F.say(ctx, t, [['THE', k.start + .1], ['USUAL', k.usual], ['COMFORT', k.comfort]], W / 2, 560, { size: 92, align: 'center', gold: [2], out: k.phone - .45 });
    F.say(ctx, t, [['A', k.phone], ['MACHINE', k.phone + .05], ['CAN', k.canW]], 480, 270, { size: 46, align: 'center', out: k.gives - .4 });
    F.say(ctx, t, [['ANSWER', k.answer], ['A', k.answer + .3], ['PHONE', k.phoneW]], 480, 350, { size: 72, align: 'center', out: k.gives - .35 });
    F.say(ctx, t, [["IT", k.cant], ["CAN'T", k.cantW]], 1440, 270, { size: 46, align: 'center', out: k.gives - .4 });
    F.say(ctx, t, [['LAY', k.lay], ['BRICKS', k.bricks]], 1440, 350, { size: 72, align: 'center', out: k.gives - .35 });
    F.say(ctx, t, [['OR', k.orW], ['BRING', k.bring], ['IN', k.bring + .3], ['A', k.harvest - .05], ['HARVEST', k.harvest]], 1440, 420, { size: 50, align: 'center', out: k.gives - .3 });
    // 3.03 under the big timeline: the bracket counts 2 → 8
    const bb = bracketBox(t), bu = span(t, k.gives + .45, k.two + .05) * (1 - span(t, k.second + .05, k.second + .4)), n = Math.round(lerp(2, 8, span(t, k.two, k.years)));
    if (bu > 0 && openU(t) <= 0) F.bracket(ctx, bb.x0, bb.x1, bb.y, bu, null, { size: 30 });   // the bracket widens over the window; it names it once it is whole
    F.say(ctx, t, [['GATES', k.gives + .02], ['GIVES', k.gives + .4], ['THAT', k.gives + .65], ['COMFORT', k.gives + .89]], W / 2, 760, { size: 56, align: 'center', gold: [3], out: k.second - .2 });
    F.say(ctx, t, [['HUMANOID', k.humanoid], ['ROBOTS', k.robots]], 140, 250, { size: 72, out: k.fall - .3 });
    // 3.05 over the dark plate
    F.say(ctx, t, [['THIS', k.fall + .55], ['FALL', k.fall + .7], ['·', k.podcast + .1], ['A', k.podcast + .18], ['PODCAST', k.podcast + .3]], W / 2, 560, { size: 92, align: 'center', out: C2.start - .45 });
    lab(ctx, 'DECODER WITH NILAY PATEL · OCT 22, 2026', W / 2, 640, span(t, k.podcast + .5, k.podcast + 1.1), { size: 28, col: CREAM2, align: 'center', out: span(t, C2.start - .4, C2.start) });
    // 3.08 the big echo
    F.say(ctx, t, [['IF', k.ifW], ['WE', k.we], ["DON'T", k.dont], ['CHOOSE', k.choose]], W / 2, 690, { size: 130, align: 'center', gold: [3], out: k.weather - .45 });
    // 3.09
    F.say(ctx, t, [['NOT', k.isnt], ['THE', k.weatherW - .08], ['WEATHER', k.weatherW]], 140, 250, { size: 64, out: k.decS - .1 });
    F.say(ctx, t, [['A', k.decision - .06], ['DECISION', k.decision]], W / 2, 420, { size: 84, align: 'center', gold: [1], out: k.built - .3 });
    // 3.10–3.12
    F.say(ctx, t, [['BY', k.byPeople], ['PEOPLE', k.people]], W / 2, 260, { size: 84, align: 'center', gold: [1], out: k.halt - .3 });
    F.say(ctx, t, [['NO', k.expect], ['HALT', k.haltW]], W / 2, 330, { size: 92, align: 'center', out: k.howFast - .3 });
    F.say(ctx, t, [['A', k.choice - .08], ['CHOICE', k.choice]], W / 2, 330, { size: 92, align: 'center', gold: [1], out: k.before - .35 });
    // 3.13 (the timeline big)
    F.say(ctx, t, [['BEFORE', k.before], ['THE', k.before + .28], ['LAST', k.before + .37], ['STOP', k.before + .73]], W / 2, 640, { size: 56, align: 'center', out: k.fair - .8 });
    F.say(ctx, t, [['A', k.fair - .05], ['FAIR', k.fair], ['QUESTION', k.question]], W / 2, 640, { size: 56, align: 'center', out: k.isHe - .62, col: CREAM2 });
    const r = F.say(ctx, t, [['IS', k.isHe], ['HE', k.heW], ['RIGHT', k.right]], W / 2 - 40, 700, { size: 130, align: 'center', out: k.who - .55 });
    questionMark(ctx, t, [r.x1 + 10, 700]);
    F.say(ctx, t, [["WHO'S", k.whos], ['TALKING?', k.talking]], NP[0], 230, { size: 60, out: k.cofW - .2 });
    // 3.17
    F.say(ctx, t, [['HARDER', k.harderW], ['TO', k.wave - .1], ['WAVE', k.wave], ['AWAY', k.away]], 1280, 820, { size: 60, align: 'center', gold: [0], out: k.skeptic - .3 });
    // 3.18
    lab(ctx, 'A SKEPTIC WOULD ADD', 1780, 236, span(t, k.skeptic + .05, k.skeptic + .6), { size: 26, col: CREAM2, align: 'right', out: span(t, k.players - .3, k.players + .05) });
    F.say(ctx, t, [['STRICT', k.strict], ['RULES', k.rules]], 1780, 318, { size: 64, align: 'right', out: k.players - .2 });
    F.say(ctx, t, [['OFTEN', k.often], ['SUIT', k.suit], ['THE', k.suit + .3], ['BIGGEST', k.biggestW]], 1780, 396, { size: 64, align: 'right', gold: [3], out: k.players - .15 });
  }
  function tlRing(ctx, t) {   // 2.12 the second stop glows (its light drops into the lamp) · 3.13 a dashed ring round the dim third stop
    const g = bumpT(t, k.from, 1.6); if (g > 0) { const [x, y] = tlStop(1, t); halo(ctx, x, y, 70, .7 * g, AMBER.body, AMBER.core); }
    const ru = sineIO(span(t, k.before + .5, k.before + 1.3)) * (1 - span(t, k.who - .9, k.who - .5));
    if (ru > 0) { const [x, y, sc] = tlStop(2, t); ctx.save(); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.lineDashOffset = t * 10; ctx.beginPath(); ctx.arc(x, y, 22 * sc, -Math.PI / 2, -Math.PI / 2 + TAU * ru); ctx.stroke(); ctx.restore(); }
  }

  const draw = (ctx, t) => {
    if (t >= k.conv) return S.plateNumbers(ctx, t, T);   // converged: the frame is the seam plate
    F.stage(ctx, t);
    bench(ctx, t);
    phone(ctx, t);
    handWork(ctx, t);
    divider(ctx, t);
    site(ctx, t);
    plate(ctx, t);
    caption(ctx, t);
    underline(ctx, t);
    tiles(ctx, t);
    road(ctx, t);
    levers(ctx, t);
    switch3(ctx, t);
    diagram(ctx, t);
    chartBack(ctx, t);
    barrier(ctx, t);
    blocks(ctx, t);
    F.timeline(ctx, t, T, { big: tlBig(t), dy: DY * tlBig(t) });
    tlRing(ctx, t);
    words(ctx, t);
  };
  const out = { k, draw };
  CACHE.set(T, out);
  return out;
}

export default (T, R) => {
  const { draw } = buildC04(T);
  return [
    { t: R.a, draw, print: F.PRINT41 },
    { t: R.b - S.SEAM_HALF, draw: (ctx, t) => S.plateNumbers(ctx, t, T), print: F.PRINT41 },   // the seam plate (c05 draws the same for .5 s)
  ];
};
