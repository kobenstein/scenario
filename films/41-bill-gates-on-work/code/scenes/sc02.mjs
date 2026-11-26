// Film 41 · c02 · his picture of the machine (B1) · 'What changed is his picture' → 'For Gates, the first work' (docs/shots.md 1.01–1.15)
// One continuous take of designed graphics on the stage, joined by carriers (no cut, no crossfade):
//   plateMachine (seam from c01) · 1.01 the frame holds HIS PICTURE (disc = machine, dot = person, same size) · 1.02 CBS tag, the disc
//   pulses, a faint PAST disc slides out from behind it · 1.03 the frame opens to the screen, its line bends into a hill, the dot becomes
//   you, the disc rises behind you past the HUMAN line · 1.04 the disc shrinks into a cyan block on a stone, the hill flattens into
//   water with stepping stones; you hop on · 1.05 the step repeats, the thumb-up icon comes back from the top right: MANAGEABLE
//   · 1.06 ★ the machine follows each hop faster until it lands beside you; a cold wave runs through every stone ahead
//   · 1.07 the stones become far windows, the icon grows into the hand in the sky and turns its thumb down · 1.08/1.09 the quote card
//   grows out of the fist, "but I'm not" underlined · 1.10 the portrait print rises, the card hangs under the nameplate
//   · 1.11 a gold dot leaves the nameplate · 1.12–1.14 it draws THE TIMELINE big (three stops, the last one ringed) · 1.15 NOW, the
//   timeline shrinks to its corner → from 107.95 s the c03 draw (sc03.mjs) carries on: a gold line drops from NOW into the night office.
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f41_kit.mjs';
import * as S from '../lib/f41_world.mjs';
import { buildC03 } from './sc03.mjs';
import { lab, gs } from './sc04.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, halo, lin } = E;
const { GOLD, CREAM, CREAM2, MACH, AMBER, SOURCES: SRC } = F;
const TAU = Math.PI * 2;
const ANG = 2.55;
const fistToWrist = (x, y, L) => [x - Math.cos(ANG) * .5 * L, y - Math.sin(ANG) * .5 * L];
const lerpL = (a, b, u) => Math.exp(lerp(Math.log(a), Math.log(b), u));
const bumpT = (t, t0, d) => Math.sin(Math.PI * span(t, t0, t0 + d));
const softRamp = (x) => (x <= 0 ? 0 : x < 1 ? x * x / 2 : x - .5);   // C1-continuous ramp (a camera that starts gently)

const CACHE = new WeakMap();
export function buildC02(T) {
  if (CACHE.has(T)) return CACHE.get(T);
  const G = (p, after = -1) => T.G(p, 0, after);
  const k = {};
  k.a = G('What changed is his picture'); k.his = G('his picture', k.a); k.pic = G('picture', k.his); k.mach = G('machine', k.his);
  k.weeks = G('Just weeks ago'); k.diff = G('different', k.weeks); k.past = G('past ones', k.weeks);
  k.exc = G('It exceeds human'); k.excW = G('exceeds', k.exc); k.human = G('human', k.excW); k.intel = G('intelligence', k.human);
  k.earlier = G('Earlier machines took'); k.took = G('took over', k.earlier); k.tasks = G('tasks', k.took); k.peopleM = G('people moved', k.earlier); k.moved = G('moved', k.peopleM); k.onW = G('on to work', k.moved); k.couldnt = G("couldn't", k.earlier);
  k.why = G("That's why he called"); k.manage = G('manageable', k.why);
  k.thisTime = G('This time, wherever'); k.wherever = G('wherever', k.thisTime); k.pmove = G('people move', k.thisTime); k.moveW = G('move', k.pmove + .1); k.theM = G('the machine can', k.thisTime); k.can = G('can follow', k.theM); k.follow = G('follow', k.can);
  k.saw = G("That's what Bill Gates saw"); k.sawW = G('saw', k.saw);
  k.says = G("He says he'd love"); k.butNot = G("But he's not convinced"); k.not = G('not', k.butNot);
  k.rep = G('He has put his reputation'); k.repW = G('reputation', k.rep); k.onIt = G('on it', k.repW);
  k.where = G('So where does it begin'); k.does = G('does', k.where); k.begin = G('begin', k.where);
  k.tl = F.timelineTimes(T).on; k.warning = G('warning', k.tl - .3); k.aTl = G('a timeline', k.tl - .3);
  k.three = G('Three stops'); k.stops = G('stops', k.three);
  k.last = G('The last is the one'); k.worries = G('worries', k.last); k.him = G('him most', k.worries); k.most = G('most', k.him);
  k.first = G('The first is now'); k.firstW = G('first is', k.first); k.now = G('now', k.firstW + .2);
  k.end = G('For Gates, the first work');
  k.hand = k.end - .46;                                   // from here the c03 draw owns the frame (identical frames across the cut)
  const C3 = buildC03(T), c03 = C3.draw;

  // ------------------------------------------------------------------ plate geometry (lib/f41_world.mjs plateMachine)
  const B = S.MACH_FRAME, PC = [B.x + B.w / 2, B.y + B.h / 2];
  const creepE = (t) => Math.max(0, t - (k.a - S.SEAM_HALF));   // the plate's creep goes on: a slow push into his picture until the frame opens
  const creepK = (t) => 1 + S.CREEP * creepE(t);
  const pXY = (t, x, y) => { const kk = creepK(t); return [(x - PC[0]) * kk + PC[0], (y - PC[1]) * kk + PC[1]]; };
  const gyP = B.y + B.h * .66, rP = B.h * .1, mxP = B.x + B.w * .38, pxP = B.x + B.w * .62;

  // ------------------------------------------------------------------ the stepping stones (1.04–1.06)
  const SX = (i) => 240 + 220 * i, STONE_Y = 800, STONE_W = 150;
  const PH = [[k.moved, 4, .42], [k.why + .28, 5, .4], [k.manage - .3, 6, .4], [k.wherever, 7, .36], [k.pmove, 8, .3], [k.moveW, 9, .28]];   // your hops: start, stone, duration
  const MH = [[k.why + .7, 4, .45], [k.manage + .15, 5, .45], [k.wherever + .42, 6, .32], [k.pmove + .24, 7, .24], [k.moveW + .16, 8, .2], [k.follow - .3, 9, .3]];
  const hopPos = (t, hops, i0, h0) => {   // → [stone index (fractional), lift]
    let idx = i0, lift = 0;
    for (const [ts, to, d] of hops) {
      if (t < ts) break;
      const u = span(t, ts, ts + d); idx = lerp(idx, to, sineIO(u)); lift = Math.max(lift, h0 * 4 * u * (1 - u));
      if (u >= 1) idx = to;
    }
    return [idx, lift];
  };
  const scrollAt = (t) => { let sp = 3; for (const [ts, to] of PH) sp += sineIO(span(t, ts, ts + .95)) * (to - (to - 1)); return 220 * softRamp((sp - 4.2) / 1) ; };
  const youOnStone = (t) => { const [i, l] = hopPos(t, PH, 3, 70); return [SX(i) + 34 - scrollAt(t), STONE_Y - l, i]; };
  const machOnStone = (t) => { const [i, l] = hopPos(t, MH, 3, 40); return [SX(i) - 40 - scrollAt(t), STONE_Y - l, i]; };

  // ------------------------------------------------------------------ the hand (the icon) 1.05 → 1.07 → 1.10
  const ICON = [1500, 290], ICON_L = 88;
  function handState(t) {
    const m1 = quartIO(span(t, k.why - .25, k.why + .85));
    let fist = [lerp(2150, ICON[0], m1), lerp(-160, ICON[1], m1) - 60 * Math.sin(Math.PI * m1)], L = ICON_L;
    fist[1] += 6 * Math.sin(t * 1.3);   // it hangs and breathes
    const m2 = quartIO(span(t, k.saw - .35, k.saw + .85)), SF = S.skyFist();
    fist = [lerp(fist[0], SF[0], m2), lerp(fist[1], SF[1], m2)]; L = lerpL(L, S.SKY_HAND.L, m2);
    const turn = span(t, k.saw + .45, k.sawW + .45);
    let lum = lerp(.75, 1, m2); lum = lerp(lum, .3, span(t, k.says - .3, k.says + .6));
    const out = quartIO(span(t, k.rep - .65, k.rep + .55));   // the hand withdraws up-right (unhurried: no lurch)
    fist = [fist[0] + 560 * out, fist[1] - 520 * out];
    return { fist, L, turn, lum, arm: lerp(1.1, 3.8, clamp((L - 120) / 80)), a: span(t, k.why - .25, k.why + .1), gone: out >= 1 || t < k.why - .25, arrow: span(t, k.saw + .4, k.sawW + .5) * (1 - span(t, k.says - .4, k.says)), ghost: span(t, k.sawW, k.sawW + .7) * (1 - span(t, k.says - .4, k.says)) };
  }
  const drawHand = (ctx, t) => {
    const h = handState(t); if (h.gone) return null;
    const w = fistToWrist(h.fist[0], h.fist[1], h.L);
    return F.hand(ctx, t, w[0], w[1], h.L, { turn: h.turn, lum: h.lum, arm: h.arm, a: h.a, arrow: h.arrow, ghost: 0, dust: .6 * clamp((h.L - 100) / 80) });
  };

  // ------------------------------------------------------------------ the quote card (1.08–1.10)
  const QC = { x: 410, y: 214, w: 1100, size: 52 };
  const qWords = SRC.convinced.split(/\s+/), qLines = []; { let cur = []; for (const wd of qWords) { const nx = [...cur, wd]; if (cur.length && F.measure(nx.join(' '), QC.size, true) > QC.w - 108) { qLines.push(cur); cur = [wd]; } else cur = nx; } if (cur.length) qLines.push(cur); }
  const QH = 24 + qLines.length * QC.size * 1.22 + 92;
  const qcCenter = [QC.x + QC.w / 2, QC.y + QH / 2];
  // the last three words ("but I'm not.”"): their span on the last line (card space)
  const lastLine = qLines[qLines.length - 1], nW = 3, ulX0 = 54 + lastLine.slice(0, lastLine.length - nW).reduce((s, w) => s + F.measure(w, QC.size, true) + QC.size * .26, 0);
  const ulX1 = 54 + lastLine.reduce((s, w) => s + F.measure(w, QC.size, true) + QC.size * .26, 0) - QC.size * .26, ulY = 24 + qLines.length * QC.size * 1.22 + 12;
  const PORT = { x: 470, y: 830, h: 560 }, NAME = [790, 352];
  function cardXf(t) {   // card transform: grows out of the fist (1.08), shrinks under the nameplate (1.10), drops out (1.11)
    const g = expoOut(span(t, k.says - .35, k.says + .55)), fist = handState(Math.min(t, k.says + .6)).fist;
    let cx = lerp(fist[0], qcCenter[0], g), cy = lerp(fist[1], qcCenter[1], g), s = lerp(.06, 1, g);
    const m = quartIO(span(t, k.rep - .6, k.rep + .55)); cx = lerp(cx, NAME[0] + QC.w * .27, m); cy = lerp(cy, 470 + QH * .27, m); s = lerp(s, .54, m);
    const drop = expoIn(span(t, k.where - .15, k.where + .55)); cy += 620 * drop;
    return { cx, cy, s, a: span(t, k.says - .35, k.says - .1) * (1 - drop) };
  }

  // ------------------------------------------------------------------ the gold dot → the timeline (1.11–1.15)
  const TLX0 = W / 2 - 640 / 2 * 1.9, TLDY = 330, TLY = 150 + TLDY, stopX = (i) => TLX0 + [0, 270, 470][i] * 1.9;
  const dotPath = [[NAME[0] - 18, NAME[1] - 10], [760, 760], [240, 760], [TLX0 - 19, TLY]];
  const bez = (u) => { const [a, b, c, d] = dotPath, v = 1 - u; return [0, 1].map((j) => v * v * v * a[j] + 3 * v * v * u * b[j] + 3 * v * u * u * c[j] + u * u * u * d[j]); };
  const dotU = (t) => quartIO(span(t, k.where + .1, Math.min(k.where + 1.45, k.tl - .2)));   // it lands where the line will begin, then waits
  const tlBig = (t) => 1 - quartIO(span(t, k.now + .25, k.now + 1.45));

  // ------------------------------------------------------------------ pieces
  function plateFrame(ctx, t) {   // 1.01–1.03: the frame (creeping), its line, the disc and the dot; the frame opens to the screen
    if (t > k.earlier + .9) return;
    const open = quartIO(span(t, k.exc - .55, k.exc + .45));
    const [fx0, fy0] = pXY(t, B.x, B.y), [fx1, fy1] = pXY(t, B.x + B.w, B.y + B.h);
    const x0 = lerp(fx0, -80, open), y0 = lerp(fy0, -80, open), x1 = lerp(fx1, W + 80, open), y1 = lerp(fy1, H + 80, open);
    if (open < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - open; ctx.fillStyle = mixHex(P.night0, P.ind0, .4); ctx.beginPath(); ctx.roundRect(x0, y0, x1 - x0, y1 - y0, 8 * creepK(t)); ctx.fill();
      ctx.strokeStyle = P.cream; ctx.lineWidth = 2 * creepK(t); ctx.stroke(); ctx.restore();
    }
  }
  // ground: the plate's cream line → a hill (1.03) → the water line (1.04) → the sky's ground (1.07)
  const hillY = (x, amp, base) => base - amp * Math.exp(-(((x - 900) / 430) ** 2));
  function ground(t) {
    const open = quartIO(span(t, k.exc - .55, k.exc + .45)), flat = quartIO(span(t, k.earlier - .45, k.earlier + .6)), sky = quartIO(span(t, k.saw - .3, k.saw + .8));
    return { open, flat, sky, amp: 72 * open * (1 - flat), base: lerp(lerp(862, STONE_Y + 14, flat), 872, sky) };
  }
  function drawGroundBack(ctx, t) {   // the line (and the hill / water fill) — drawn after the disc (the disc sits behind the hill)
    const g = ground(t);
    if (t > k.rep + 1) return;
    const [lx0, ly] = pXY(t, B.x + B.w * .14, gyP), [lx1] = pXY(t, B.x + B.w * .86, gyP);
    const xa = lerp(lx0, -40, g.open), xb = lerp(lx1, W + 40, g.open), drop = 300 * quartIO(span(t, k.rep - .6, k.rep + .7));
    const pts = []; for (let i = 0; i <= 48; i++) { const x = lerp(xa, xb, i / 48); pts.push([x, lerp(ly, hillY(x, g.amp, g.base), g.open) + drop]); }
    // fill below (hill → water → ground)
    ctx.save(); ctx.globalAlpha *= g.open;
    ctx.fillStyle = lin(ctx, 0, g.base - 80, 0, H, [[0, mixHex(mixHex(P.night1, P.ind1, .45), P.night1, g.flat * (1 - g.sky))], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); pts.forEach((p) => ctx.lineTo(p[0], p[1])); ctx.lineTo(W + 40, H + 40); ctx.lineTo(-40, H + 40); ctx.closePath(); ctx.fill();
    if (g.flat > 0 && g.sky < 1) {   // water: slow ripple lines
      ctx.globalAlpha *= g.flat * (1 - g.sky);
      for (let j = 0; j < 7; j++) { const y = g.base + 30 + j * 34 + drop, ph = t * (.4 + j * .07) + j; ctx.strokeStyle = rgba(P.blue1, .35 - j * .03); ctx.lineWidth = 2;
        ctx.beginPath(); for (let x = -20; x <= W + 20; x += 40) { const yy = y + 4 * Math.sin(x / 90 + ph); x === -20 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } ctx.stroke(); }
    }
    ctx.restore();
    ctx.save(); ctx.strokeStyle = rgba(CREAM, lerp(.45, .3, g.open) * (1 - g.sky * .5)); ctx.lineWidth = 2 * lerp(creepK(t), 1, g.open); ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.restore();
    // the sky's far windows (other people's jobs) light up along the ground (1.07)
    if (g.sky > 0) {
      const r = E.prng(4141);
      for (let i = 0; i < 26; i++) { const x = r() * W, y = 872 - 36 - r() * 18 + drop, s = 5 + r() * 5, on = .5 + .5 * Math.sin(t * (.3 + r() * .4) + i); if (Math.abs(x - 960) < 180) continue;
        ctx.fillStyle = rgba(AMBER.body, (.35 + .3 * on) * span(g.sky, .3 + (i % 5) * .1, .8 + (i % 5) * .04)); ctx.fillRect(x, y, s, s * 1.2); }
    }
  }
  function disc(ctx, t) {   // the machine: plate disc → rises past HUMAN (1.03) → shrinks into the cyan block on a stone (1.04 …)
    if (t > k.saw + 1.2) return;
    const g = ground(t), br = 1 + .04 * Math.sin(t * 1.3), by = B.h * .035 * Math.sin(t * 1.1);
    const [px, py] = pXY(t, mxP, gyP - rP * br + by); let r = rP * br * creepK(t);
    // 1.02: it pulses on "different"
    r *= 1 + .12 * bumpT(t, k.diff - .05, .5) + .08 * bumpT(t, k.past, .45);
    let x = lerp(px, 560, g.open), y = lerp(py, 806, g.open); r = lerp(r, 64, g.open);
    const rise = sineIO(span(t, k.excW - .15, k.intel + .55)); x = lerp(x, 600, rise); y = lerp(y, 330, rise); r = lerp(r, 214, rise);
    // 1.04: it shrinks and lands on your stone as a block (square-ish), squashes on landing
    const land = quartIO(span(t, k.earlier + .05, k.took + .15)), [bx, byy] = machOnStone(t);
    x = lerp(x, bx, land); y = lerp(y, byy - 36, land); r = lerp(r, 36, land);
    const sq = land >= 1 ? .14 * Math.exp(-(t - k.took - .15) * 7) * Math.sin((t - k.took - .15) * 26) : 0;
    const sky = quartIO(span(t, k.saw - .3, k.saw + .7));
    if (sky > 0) { x = lerp(x, 1072, sky); y = lerp(y, 858 - 300 * quartIO(span(t, k.rep - .6, k.rep + .7)), sky); r = lerp(r, 6, sky); }
    const corner = lerp(r, 12, land) * (1 - sky) + sky * 2;
    // the plate draws its halo at the line (not the bobbing centre) and the gradient over [gy − 2r, gy]: match it exactly until the frame opens
    const [hx0, hy0] = pXY(t, mxP, gyP - rP), gk = creepK(t), g0 = pXY(t, 0, gyP - 2 * rP)[1] - y, g1 = pXY(t, 0, gyP)[1] - y, op = g.open;
    const hx = lerp(hx0, x, Math.max(op, land)), hy = lerp(hy0, y, Math.max(op, land));
    ctx.save();
    halo(ctx, hx, hy, r * (3 - land), .35 + .25 * bumpT(t, k.diff - .05, .6), MACH.halo, MACH.core);
    ctx.translate(x, y + r * sq); ctx.scale(1 + sq, 1 - sq);
    ctx.fillStyle = lin(ctx, 0, lerp(g0, -r, op), 0, lerp(g1, r, op), [[0, MACH.hot], [1, mixHex(MACH.mid, MACH.deep, .35 * land)]]); ctx.beginPath();
    if (op <= 0 && land <= 0) ctx.arc(0, 0, r, 0, TAU); else ctx.roundRect(-r, -r, r * 2, r * 2, Math.min(r, corner));
    ctx.fill();
    ctx.restore();
    // 1.02: a faint PAST disc slides out from behind it (earlier machines: smaller)
    const pu = expoOut(span(t, k.past - .25, k.past + .5)) * (1 - span(t, k.exc - .6, k.exc - .2));
    if (pu > 0) {
      const [qx, qy] = pXY(t, mxP - 120 * pu, gyP - 34);
      ctx.save(); ctx.globalAlpha *= pu; ctx.strokeStyle = rgba(CREAM2, .8); ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.arc(qx, qy, 34 * creepK(t), 0, TAU); ctx.stroke(); ctx.restore();
      lab(ctx, 'PAST', qx, qy + 64, span(t, k.past, k.past + .5), { size: 22, align: 'center', out: span(t, k.exc - .7, k.exc - .35) });
    }
  }
  function person(ctx, t) {   // the amber dot → you on the hill → you on the stones → you on the ground under the sky
    if (t > k.rep + 1) return;
    const g = ground(t), py = B.h * .035 * Math.sin(t * 1.1 + 1.6), [dx, dy] = pXY(t, pxP, gyP - rP + py), r = rP * creepK(t);
    // the dot: moves to the hill crest and becomes your head while you rise from behind the crest
    const crest = [900, hillY(900, 72, 862)], rise = expoOut(span(t, k.exc - .05, k.exc + .65));
    const hx = lerp(dx, crest[0], g.open), hy = lerp(dy, crest[1] - 150 * .9, g.open), hr = lerp(r, 13, g.open);
    const da = 1 - rise;
    if (da > 0) {   // plate-exact until the frame opens: halo at (px, gy − r), gradient over [gy − 2r, gy]
      const op = g.open, [ax, ay] = pXY(t, pxP, gyP - rP), y0 = pXY(t, 0, gyP - 2 * rP)[1], y1 = pXY(t, 0, gyP)[1];
      ctx.save(); ctx.globalAlpha *= da; halo(ctx, lerp(ax, hx, op), lerp(ay, hy, op), hr * 3, .35, AMBER.body, AMBER.core);
      ctx.fillStyle = lin(ctx, 0, lerp(y0, hy - hr, op), 0, lerp(y1, hy + hr, op), [[0, AMBER.hot], [1, AMBER.shade]]); ctx.beginPath(); ctx.arc(hx, hy, hr, 0, TAU); ctx.fill(); ctx.restore(); }
    if (rise <= 0) return;
    // where you stand: crest → your stone → the ground under the sky
    const flat = g.flat, [sx, sy] = youOnStone(t), sky = quartIO(span(t, k.saw - .3, k.saw + .8));
    let x = lerp(crest[0], sx, flat), y = lerp(crest[1] + 160 * (1 - rise), sy, flat), h = lerp(150, 104, flat);
    x = lerp(x, 960, sky); y = lerp(y, 890, sky); h = lerp(h, 112, sky);
    y += 300 * quartIO(span(t, k.rep - .6, k.rep + .7));
    const look = Math.max(.25 * flat * (1 - sky), span(t, k.saw - .2, k.saw + .6) * (1 - span(t, k.rep - .4, k.rep)), .35 * span(t, k.excW, k.intel));
    ctx.save();
    if (g.open < 1 || rise < 1) { ctx.beginPath(); ctx.rect(-50, -50, W + 100, crest[1] + 2 + (flat > 0 ? 400 : 0)); ctx.clip(); }
    halo(ctx, x, y - h * .5, h * 1.3, .22, AMBER.body, AMBER.core);
    E.du(ctx, x, y, h, { look, pose: look > .5 ? 'look' : 'stand' });
    ctx.restore();
  }
  function stones(ctx, t) {   // 1.04–1.06 (and they shrink into the far windows, 1.07)
    if (t < k.earlier - .4 || t > k.saw + 1) return;
    const sc = scrollAt(t), [, , mi] = machOnStone(t), [, , yi] = youOnStone(t), sky = quartIO(span(t, k.saw - .3, k.saw + .75));
    for (let i = 0; i < 14; i++) {
      const x = SX(i) - sc; if (x < -120 || x > W + 120) continue;
      const born = expoOut(span(t, k.earlier - .3 + Math.abs(i - 3) * .06, k.earlier + .35 + Math.abs(i - 3) * .06)); if (born <= 0) continue;
      const taken = clamp(mi - i + 1), cold = Math.max(taken, span(t, k.follow + .05 + (i - 9) * .07, k.follow + .35 + (i - 9) * .07) * (i > 9 ? 1 : 0));
      const flash = i > 9 ? bumpT(t, k.follow + .05 + (i - 9) * .07, .5) : 0, here = Math.abs(yi - i) < .5 ? 1 : 0;
      const dip = (i === 3 ? 7 * Math.exp(-Math.max(0, t - k.took - .15) * 6) * (t > k.took + .15 ? 1 : 0) : 0);
      let w = STONE_W * born, h = 24 * born, y = STONE_Y + 12 + (1 - born) * 30 + dip, xx = x;
      if (sky > 0) { const r = E.prng(900 + i); xx = lerp(x, 120 + ((i * 397) % 1680), sky); y = lerp(y, 846 - r() * 16, sky); w = lerp(w, 8, sky); h = lerp(h, 10, sky); }
      const top = mixHex(mixHex(AMBER.body, AMBER.hot, .3 + .3 * here), MACH.hot, cold), bot = mixHex(mixHex(AMBER.shade, P.night1, .3), MACH.deep, cold);
      if (sky < 1) halo(ctx, xx, y, 120 * born * (1 - sky), (.18 + .15 * flash) * (1 - sky), cold > .5 ? MACH.halo : AMBER.body, cold > .5 ? MACH.core : AMBER.core);
      ctx.fillStyle = lin(ctx, 0, y - h / 2, 0, y + h / 2, [[0, top], [1, bot]]); ctx.beginPath(); ctx.roundRect(xx - w / 2, y - h / 2, w, h, Math.min(8, h / 2)); ctx.fill();
      if (flash > 0) { ctx.strokeStyle = rgba(MACH.core, .9 * flash); ctx.lineWidth = 2; ctx.stroke(); }
      if (sky < 1) { ctx.fillStyle = rgba(top, .12 * (1 - sky)); ctx.fillRect(xx - w / 2, y + h / 2 + 4, w, 18 * born); }   // its reflection
    }
    // ★ the cold ripple over the water from where the machine lands beside you
    if (t > k.follow && t < k.follow + 2) {
      const [mx] = machOnStone(t), u = span(t, k.follow, k.follow + 2), R = 40 + u * 1500;
      ctx.save(); ctx.strokeStyle = rgba(MACH.core, .55 * (1 - u)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(mx + 37, STONE_Y + 20, R, R * .12, 0, 0, TAU); ctx.stroke(); ctx.restore();
    }
  }
  function words(ctx, t) {
    // 1.01 / 1.02 around the frame
    const fo = k.exc - .5, frameTop = pXY(Math.min(t, fo), 0, B.y)[1], frameBot = pXY(Math.min(t, fo), 0, B.y + B.h)[1];
    F.say(ctx, t, [['HIS', k.his], ['PICTURE', k.pic]], W / 2, frameTop - 36, { size: 64, align: 'center', out: k.weeks - .2 });
    F.say(ctx, t, [['WHY', k.weeks + .9], ['THIS', k.weeks + 1.25], ['ONE', k.weeks + 1.45], ['IS', k.diff - .2], ['DIFFERENT', k.diff]], W / 2, frameTop - 36, { size: 64, align: 'center', gold: [4], out: fo });
    const [mx, my] = pXY(Math.min(t, fo), mxP, gyP), [px] = pXY(Math.min(t, fo), pxP, gyP);
    lab(ctx, 'THE MACHINE', mx, my + 58, span(t, k.mach - .1, k.mach + .4), { size: 22, align: 'center', col: MACH.body, out: span(t, fo - .2, fo + .15) });
    lab(ctx, 'A PERSON', px, my + 58, span(t, k.mach + .1, k.mach + .6), { size: 22, align: 'center', col: AMBER.hot, out: span(t, fo - .15, fo + .2) });
    lab(ctx, SRC.cbs, W / 2, frameBot + 52, span(t, k.weeks + .1, k.weeks + .7), { size: 24, align: 'center', col: CREAM, out: span(t, fo - .1, fo + .3) });
    // 1.03
    const hu = sineIO(span(t, k.human - .35, k.human + .45)), hOut = expoIn(span(t, k.earlier - .3, k.earlier + .2));
    if (hu > 0 && hOut < 1) {
      ctx.save(); ctx.globalAlpha *= 1 - hOut; ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 2.5; ctx.setLineDash([14, 10]); ctx.lineDashOffset = -t * 12;
      ctx.beginPath(); ctx.moveTo(110, 640); ctx.lineTo(lerp(110, 1810, hu), 640); ctx.stroke(); ctx.restore();
      lab(ctx, 'HUMAN', 112, 622, hu, { size: 24, col: CREAM, out: hOut });
    }
    F.say(ctx, t, [['EXCEEDS', k.excW]], 1170, 330, { size: 118, gold: [0], out: k.earlier - .25 });
    F.say(ctx, t, [['HUMAN', k.human], ['INTELLIGENCE', k.intel]], 1174, 410, { size: 60, out: k.earlier - .2 });
    // 1.04
    F.say(ctx, t, [['EARLIER', k.earlier + .05], ['MACHINES', k.earlier + .3], ['TOOK', k.took], ['TASKS', k.tasks]], 1780, 230, { size: 58, align: 'right', out: k.why - .45 });
    F.say(ctx, t, [['PEOPLE', k.peopleM], ['MOVED', k.moved], ['ON', k.onW]], 1780, 310, { size: 58, align: 'right', gold: [2], out: k.why - .4 });
    // 1.05 under the icon
    F.say(ctx, t, [['“MANAGEABLE”', k.manage]], ICON[0], ICON[1] + 150, { serif: true, size: 64, align: 'center', gold: [0], out: k.thisTime - .1 });
    // 1.06
    F.say(ctx, t, [['THIS', k.thisTime], ['TIME', k.thisTime + .2]], 140, 250, { size: 72, out: k.saw - .2 });
    F.say(ctx, t, [['THE', k.theM], ['MACHINE', k.theM + .06], ['CAN', k.can], ['FOLLOW', k.follow]], 140, 336, { size: 72, gold: [3], out: k.saw - .15 });
    // 1.10
    F.say(ctx, t, [['HIS', k.repW - .12], ['REPUTATION', k.repW], ['ON', k.onIt], ['IT', k.onIt + .1]], NAME[0], 760, { size: 52, gold: [1], out: k.where - .2 });
    // 1.11–1.15 (the timeline is big in the centre: y 480)
    F.say(ctx, t, [['WHERE', k.where + .25], ['DOES', k.does], ['IT', k.does + .2], ['BEGIN?', k.begin]], W / 2, 270, { size: 64, align: 'center', out: k.tl + .1 });
    F.say(ctx, t, [['HIS', k.warning - .2], ['WARNING', k.warning], ['HAS', k.aTl - .2], ['A', k.aTl], ['TIMELINE', k.aTl + .05]], W / 2, 690, { size: 56, align: 'center', gold: [4], out: k.three - .25 });
    F.say(ctx, t, [['THREE', k.three], ['STOPS', k.stops]], W / 2, 690, { size: 56, align: 'center', out: k.last - .2 });
    F.say(ctx, t, [['WORRIES', k.worries], ['HIM', k.him], ['MOST', k.most]], stopX(2), 690, { size: 48, align: 'center', out: k.first - .2 });
    F.say(ctx, t, [['THE', k.first], ['FIRST', k.firstW], ['IS', k.firstW + .7], ['NOW', k.now]], stopX(0) - 20, 690, { size: 56, gold: [3], out: k.now + .2 });
  }
  function card(ctx, t) {
    if (t < k.says - .4 || t > k.where + .7) return;
    const c = cardXf(t); if (c.a <= 0) return;
    ctx.save(); ctx.globalAlpha *= c.a; ctx.translate(c.cx, c.cy); ctx.scale(c.s, c.s); ctx.translate(-qcCenter[0], -qcCenter[1]);
    F.quoteCard(ctx, t, T, { text: SRC.convinced, x: QC.x, y: QC.y, w: QC.w, size: QC.size, credit: SRC.convincedSrc, spoken: ["He says he'd love", 'not convinced'], after: k.says - .2, mode: 'hi', rot: 0 });
    const ul = sineIO(span(t, k.butNot - .05, k.not + .45));   // 1.09: "but I'm not" underlined in gold
    if (ul > 0) gs(ctx, [[QC.x + ulX0, QC.y + ulY], [QC.x + ulX1, QC.y + ulY]], 0, ul, { w: 3.2, spark: ul < 1 });
    ctx.restore();
  }
  function print(ctx, t) {   // 1.10: the portrait print (ONCE in the film) + nameplate; sinks on 1.11
    if (t < k.rep - .3 || t > k.tl) return;
    const u = sineIO(span(t, k.rep - .25, k.rep + .95)) * (1 - expoIn(span(t, k.where - .1, k.where + .6)));
    F.portrait(ctx, t, PORT.x, PORT.y, PORT.h, { u });
    F.nameplate(ctx, t, NAME[0], NAME[1], span(t, k.rep + .1, k.rep + .8) * (1 - span(t, k.where + .1, k.where + .6)), 'BILL GATES', SRC.cofounder);
    F.source(ctx, t, k.rep + .3, k.where + .5, F.photoCredit());
  }
  function dot(ctx, t) {   // 1.11: the gold dot leaves the nameplate's bar and travels to where the timeline starts
    if (t < k.where - .05 || t > k.tl + .5) return;
    const u = dotU(t), [x, y] = bez(u), a = span(t, k.where - .05, k.where + .2) * (1 - span(t, k.tl + .05, k.tl + .45));
    const tr = []; for (let j = 0; j <= 10; j++) tr.push(bez(Math.max(0, u - .14 * j / 10)));
    gs(ctx, tr.reverse(), 0, 1, { w: 2.2, a: .55 * a, spark: false });
    const land = k.where + 1.45, wait = t > land ? Math.sin(Math.PI * (((t - land) / .7) % 1)) * span(t, land, land + .2) * (1 - span(t, k.tl - .1, k.tl + .2)) : 0;   // a breathing beacon on 'begin?'
    if (wait > 0) { const ru = ((t - land) / .7) % 1; ctx.save(); ctx.strokeStyle = rgba(GOLD.core, .5 * (1 - ru) * a); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 10 + 40 * expoOut(ru), 0, TAU); ctx.stroke(); ctx.restore(); }
    halo(ctx, x, y, 46 + 16 * wait, .8 * a, GOLD.halo, GOLD.core); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GOLD.core; ctx.beginPath(); ctx.arc(x, y, 7, 0, TAU); ctx.fill(); ctx.restore();
  }
  function tlMarks(ctx, t) {   // 1.13 the three stops flash in a stagger · 1.14 a ring round the last
    const big = tlBig(t); if (t < k.three - .2 || big <= 0) return;
    for (let i = 0; i < 3; i++) { const f = bumpT(t, k.three + i * .13, .55); if (f > 0) halo(ctx, stopX(i), TLY, 70, .7 * f, GOLD.halo, GOLD.core); }
    const ru = sineIO(span(t, k.last + .1, k.last + .9)) * (1 - span(t, k.first - .3, k.first + .1));
    if (ru > 0) { const pts = []; for (let j = 0; j <= 48; j++) { const a = -Math.PI / 2 + TAU * j / 48; pts.push([stopX(2) + Math.cos(a) * 40, TLY + Math.sin(a) * 40]); } gs(ctx, pts, 0, ru, { w: 2, spark: ru < 1 }); }
  }

  const draw = (ctx, t) => {
    if (t >= k.hand) return c03(ctx, t);
    F.stage(ctx, t);
    plateFrame(ctx, t);
    const flatLine = ground(t).open <= 0;   // the plate draws its line under the disc; once the frame opens the hill covers the disc
    if (flatLine) drawGroundBack(ctx, t);
    disc(ctx, t);
    if (!flatLine) drawGroundBack(ctx, t);
    stones(ctx, t);
    person(ctx, t);
    drawHand(ctx, t);
    print(ctx, t);
    card(ctx, t);
    dot(ctx, t);
    F.timeline(ctx, t, T, { big: tlBig(t), dy: TLDY * tlBig(t) });
    tlMarks(ctx, t);
    words(ctx, t);
    C3.dropLine(ctx, t);   // the gold line already leaves NOW (c03 carries it on)
  };
  const out = { k, draw };
  CACHE.set(T, out);
  return out;
}

export default (T, R) => {
  const { draw } = buildC02(T);
  return [
    { t: R.a, draw: (ctx, t) => S.plateMachine(ctx, t, T), print: F.PRINT41 },   // the seam plate (identical to c01's last .5 s)
    { t: R.a + S.SEAM_HALF, draw, print: F.PRINT41 },
  ];
};
