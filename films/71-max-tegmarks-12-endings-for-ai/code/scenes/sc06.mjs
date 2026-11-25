// Film 71 · c06 (B1): ENDING 7/12 ENSLAVED GOD + M subscribe 1. One continuous take (docs/shots.md 7.01 – M.04):
//   (c05 ended pushing into door 7 of the Leitbild, its crack of light) the camera flies through door 7 onto the yard (W): the machine
//   (the cool orb) in a cage, a padlock clicks shut · ENSLAVED GOD · products fall out of the cage onto a belt: WEALTH · TECHNOLOGY · the
//   belt runs into a split room (SCENARIO): the left half warm, the table full, you stretch · the right half grey and empty · in the
//   doorway a stranger with a key, his face out of frame, the key glints · the key flies out, the room folds flat into its ceiling line,
//   which becomes the baseline of two bars: 1× TODAY, 2× IN 10 YEARS (the top half cool: AI) · GENESIS MISSION · DOE · the cool half
//   breaks into 17 dots that light and link (17 OF 17 LABS, switch tag JUL 2026) · the network glides beside the cage: NO CAGE · NO GOD,
//   both struck through · the cage folds, the key takes its place, a line from the key to the network · down to the row: the dots fly
//   into door 7, it opens split light / dark, the key between: WHO HOLDS THE KEY? · M: the key comes to the centre, turns; THE GOOD
//   TAKEOFF and SUBSCRIBE grow out of its bow, FOR EVERYBODY · it turns once more · the button glows, is pressed, the key flies into the
//   HUD key pocket → plateRow(6) (B2 goes on from there).
import { createCanvas } from '@napi-rs/canvas';
import * as F from '../lib/f71_kit.mjs';
import * as S from '../lib/f71_world.mjs';
import * as B from '../lib/b1_extra.mjs';
import { V7, turnSlots } from './sc05.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, prng, bump, CREAM, CREAM2, COOL, LAMP, PAPER, DATA, TXT } = F;
const TAU = Math.PI * 2;

// ---------------------------------------------------------------- the yard world of ending 7 (yard units; the row lies below at y 484..660)
const CG = { x: 900, y: -330 }, CW = 300, CH = 340, ORB = 70;             // the cage with the machine
const BELT = { y: 0, x0: 820, x1: 1500 };                                 // the belt from the cage into the room
const RM = { x0: 1500, x1: 2700, y0: -600, y1: 0, mid: 2100 };            // the split room (a cut-away box), ceiling at y0
const DW = { x: 2100, w: 180, h: 480 };                                    // the doorway in its back wall, on the split
const STR = { x: 2100, h: 470 };                                           // the stranger (taller than the frame shows: face out of frame)
const BAR = { base: -600, x1: 1880, x2: 2320, w: 150, u: 200 };           // the two bars stand on the room's ceiling line
const NET0 = { x: 2480, y: -860 }, NET1 = { x: 1560, y: -330 }, NR = 200; // the network of the 17 labs
const D7 = { x: F.rowX(7), y: F.ROW.y - F.ROW.h * 1.06 / 2 };             // door 7's centre in the row
const PS = 64;                                                            // product size
const NODES = (() => { const r = prng(7707); return Array.from({ length: 17 }, (_, i) => { const rr = NR * Math.sqrt((i + .5) / 17), a = i * 2.39996 + .3; return { ox: Math.cos(a) * rr, oy: Math.sin(a) * rr * .82, sx: BAR.x2 - BAR.w / 2 + 18 + (i % 4) * 38, sy: BAR.base - BAR.u * 2 + 20 + Math.floor(i / 4) * 40, ph: r() * TAU }; }); })();
const LINKS = (() => { const L = new Set(); NODES.forEach((p, i) => { NODES.map((q, j) => [j, Math.hypot(p.ox - q.ox, p.oy - q.oy)]).filter(([j]) => j !== i).sort((a, b) => a[1] - b[1]).slice(0, 2).forEach(([j]) => L.add(i < j ? `${i}-${j}` : `${j}-${i}`)); }); return [...L].map((s) => s.split('-').map(Number)); })();
// the stranger's hand (fixed pose) for the key
const HAND = (() => { const c = createCanvas(8, 8).getContext('2d'); const h = F.person(c, STR.x, 0, STR.h, { light: .25, armR: [.55, 1.95], armL: [-.1, -.05] }); return h && h.R ? h.R : [STR.x + STR.h * .2, -STR.h * .55]; })();

export default function (T, R) {
  const G = (p, n = 0) => T.G(p, n, R.a - .1);
  const A = {
    a: R.a, locked: G('locked up'), name: G("Tegmark's name for that"), ensl: G('Enslaved'), caged: G('Caged, it produces'), wealth: G('wealth'), tech: G('technology'),
    wake: G('You wake up in paradise'), opp: G('Or in the opposite'), stranger: G('A stranger with a key'), keyw: G('key', 0, G('A stranger with a key')), decides: G('decides which'),
    amer: G("America's government wants AI"), double: G('double'), scient: G('scientists'), ten: G('ten years'), july: G('By July, every national lab'), every: G('every national lab'), joined: G('joined'),
    nocage: G('No cage'), nogod: G('no god'), idea: G('But the same idea'), tool: G('tool of whoever'), whoever: G('whoever controls'), who: G('So who holds the key'),
    channel: G('This channel exists'), reason: G('for one reason'), everybody: G('everybody'), notjust: G('Not just for whoever holds'), want: G('Want that too'), subscribe: G('Then subscribe'),
  };
  const PLATE = R.b - S.SEAM_HALF;
  // ---------------------------------------------------------------- the flight through door 7 (Leitbild coords) → the yard
  const ZE = 32, FLY1 = A.a + 1.7, RC = { x: 900, y: -330, s: 1.45 };
  const open7L = (t) => .16 + .84 * sineIO(span(t, A.a + .05, FLY1 - .45));
  function flyView(t) { const u = span(t, A.a, FLY1), e = u * u * (3 - 2 * u); return { x: V7.x, y: V7.y, s: Math.exp(lerp(Math.log(V7.s), Math.log(ZE), e)) }; }
  // ---------------------------------------------------------------- the yard camera
  const VBELT = { x: 925, y: -318, s: 1.47 }, VB = { x: 2100, y: -790, s: 1.2 }, VNET = { x: 2300, y: -880, s: 1.2 }, VNC = { x: 1220, y: -360, s: 1.15 }, VK = { x: 1210, y: -350, s: 1.18 };
  const VDOOR = { x: D7.x, y: 500, s: 2.0 }, VM = { x: D7.x, y: 410, s: 1.6 };
  const ROOMV = { x: 2100, y: -300, s: 1.55 };
  const cam = B.holdKeys([
    [FLY1, RC], [A.caged + .2, { x: 925, y: -318, s: 1.47 }], [A.wake + .5, ROOMV, { d: 4.6 }], [A.opp + .8, { x: 2160, y: -300, s: 1.57 }],
    [A.stranger + 1.1, { x: 2165, y: -150, s: 2.4 }], [A.amer - .05, { x: 2160, y: -150, s: 2.5 }], [A.amer + 1.5, VB], [A.nocage - .9, { x: 2120, y: -800, s: 1.23 }], [A.nocage + .3, VNC],
    [A.who - 1.1, { x: 1200, y: -335, s: 1.24 }], [A.who + 1.2, VDOOR, { d: 2.3 }], [A.channel, { ...VDOOR, y: 495, s: 2.04 }], [A.channel + 1.6, VM], [A.subscribe + .1, { ...VM, y: 404, s: 1.66 }],
    [PLATE, { x: W / 2, y: 560, s: 1 }],
  ]);
  const view = (t) => F.viewPath(t, cam);
  // ---------------------------------------------------------------- timing helpers
  const cageU = (t) => span(t, A.a + .95, A.locked + .05);
  const cageFold = (t) => sineIO(span(t, A.idea + .1, A.idea + 1.1));
  const beltU = (t) => expoOut(span(t, A.caged - .35, A.caged + .5)) * (1 - sineIO(span(t, A.opp + .9, A.stranger + .3)));
  const roomFold = (t) => sineIO(span(t, A.amer + .05, A.amer + .95));
  const litL = (t) => sineIO(span(t, A.wake - .2, A.wake + .4)), litR = (t) => sineIO(span(t, A.opp - .1, A.opp + .4));
  const strIn = (t) => sineIO(span(t, A.stranger - .25, A.stranger + .55));
  const spread = (t, i) => sineIO(span(t, A.july + .1 + i * .04, A.july + 1.2 + i * .04));
  const netMove = (t) => sineIO(span(t, A.nocage - 1.0, A.nocage + .25));
  const intoDoor = (t, i) => sineIO(span(t, A.who - 1.1 + i * .025, A.who + .3 + i * .025));
  const open7R = (t) => sineIO(span(t, A.who + .7, A.who + 1.5)) * (1 - sineIO(span(t, A.subscribe + .25, A.subscribe + 1.25)));
  const u6 = (t) => sineIO(span(t, A.subscribe + .2, PLATE - .05));
  // products: emerge from the orb, fall onto the belt, ride it, hop through the wall onto the table
  const NP = 9, VBELTU = 480, prodT = (i) => A.caged + .15 + i * .36;
  const tableSpot = (i) => [1745 + (i % 5) * 62 + (i >= 5 ? 31 : 0), -200 - PS * .42 - (i >= 5 ? PS * .8 : 0)];
  function prodState(t, i) {
    const t0 = prodT(i); if (t < t0) return null;
    const q = t - t0, kind = [0, 1, 2][i % 3];
    if (q < .4) { const u = q / .4; return { kind, x: CG.x + 10 * Math.sin(i), y: lerp(CG.y, -PS * .42, u * u), s: PS * expoOut(span(q, 0, .16)), on: 'belt', rot: .2 * (1 - u) }; }
    const tb = (BELT.x1 - CG.x) / VBELTU;
    if (q < .4 + tb) { const sq = q - .4, bounce = Math.exp(-sq * 9) * Math.abs(Math.sin(sq * 18)) * 10; return { kind, x: CG.x + VBELTU * sq, y: -PS * .42 - bounce, s: PS, on: 'belt', rot: 0 }; }
    const h = span(q, .4 + tb, .85 + tb), [tx, ty] = tableSpot(i), e = sineIO(h);
    return { kind, x: lerp(BELT.x1, tx, e), y: lerp(-PS * .42, ty, e) - 140 * Math.sin(Math.PI * h), s: PS, on: h >= 1 ? 'table' : 'hop', rot: 0 };
  }
  // ---------------------------------------------------------------- the world (yard coords)
  function cage(ctx, t) {
    const f = cageFold(t); if (f >= 1) return;
    ctx.save(); ctx.translate(CG.x, CG.y); ctx.scale(1 - f, 1 - f); ctx.translate(-CG.x, -CG.y);
    const bob = 4 * Math.sin(t * 1.1);
    B.machineDisc(ctx, t, CG.x, CG.y + bob, ORB, { glow: 1 + .4 * bump(t, A.name, 1.2) });
    B.cage(ctx, t, CG.x, CG.y, CW, CH, cageU(t), { n: 9, lw: 7 });
    const pl = span(t, A.locked - .05, A.locked + .35);
    if (pl > 0) { const d = expoOut(span(pl, 0, .6)), y = CG.y + 40 - (1 - d) * 90 + Math.sin(Math.PI * span(pl, .55, 1)) * 5; B.padlock(ctx, CG.x, y, 66, { a: clamp(pl * 4), open: 1 - span(pl, .5, .8) });
      const cl = bump(t, A.locked + .2, .5); if (cl > 0) halo(ctx, CG.x, y + 20, 120, .3 * cl, LAMP.body, LAMP.core); }
    ctx.restore();
  }
  function belt(ctx, t) {
    const u = beltU(t); if (u <= 0) return;
    const x1 = lerp(BELT.x0, BELT.x1, u);
    ctx.save(); ctx.strokeStyle = rgba(CREAM, .7); ctx.lineWidth = 3; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(BELT.x0, 2); ctx.lineTo(x1, 2); ctx.moveTo(BELT.x0, 22); ctx.lineTo(x1, 22); ctx.stroke();
    ctx.lineWidth = 2; ctx.strokeStyle = rgba(CREAM, .45);
    for (let x = BELT.x0 + 20; x < x1 - 8; x += 56) { ctx.beginPath(); ctx.arc(x, 12, 8, 0, TAU); ctx.stroke(); const a = t * 6 + x * .1; ctx.beginPath(); ctx.moveTo(x - Math.cos(a) * 8, 12 - Math.sin(a) * 8); ctx.lineTo(x + Math.cos(a) * 8, 12 + Math.sin(a) * 8); ctx.stroke(); }
    ctx.restore();
  }
  function products(ctx, t, where) {
    for (let i = 0; i < NP; i++) { const p = prodState(t, i); if (!p) continue; if ((where === 'table') !== (p.on === 'table')) continue; if (p.on === 'belt' && beltU(t) < .99 && p.x > lerp(BELT.x0, BELT.x1, beltU(t))) continue; B.product(ctx, t, p.kind, p.x, p.y, p.s, { rot: p.rot }); }
  }
  function room(ctx, t) {
    const fo = roomFold(t), lL = litL(t), lR = litR(t);
    // the ceiling line: it stays as the bars' baseline
    const bw = bars.baseW(t);
    if (fo < 1) {
      ctx.save(); ctx.translate(0, RM.y0); ctx.scale(1, Math.max(.001, 1 - fo)); ctx.translate(0, -RM.y0);
      const dark = mixHex(P.night1, P.ind1, .55);
      // walls: left warm, right grey (both dark until their light comes)
      const wl = lin(ctx, 0, RM.y0, 0, RM.y1, [[0, mixHex(dark, mixHex(LAMP.deep, P.night1, .2), lL)], [1, mixHex(dark, mixHex(LAMP.deep, P.halo2, .3), lL)]]);
      ctx.fillStyle = wl; ctx.fillRect(RM.x0, RM.y0, RM.mid - RM.x0, RM.y1 - RM.y0);
      const grey = mixHex(P.night1, '#8a8c95', .32);
      ctx.fillStyle = lin(ctx, 0, RM.y0, 0, RM.y1, [[0, mixHex(dark, mixHex(grey, P.night0, .35), lR)], [1, mixHex(dark, grey, lR)]]); ctx.fillRect(RM.mid, RM.y0, RM.x1 - RM.mid, RM.y1 - RM.y0);
      // floor strip
      ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(RM.x0, RM.y1 - 50, RM.x1 - RM.x0, 50);
      // the left window: the morning (the hero light of the paradise half)
      ctx.fillStyle = mixHex(mixHex(P.night1, P.ind2, .5), LAMP.core, lL); ctx.fillRect(1560, -480, 130, 210);
      if (lL > 0) { halo(ctx, 1625, -375, 300, .45 * lL, LAMP.body, LAMP.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba(LAMP.body, .12 * lL); ctx.beginPath(); ctx.moveTo(1560, -270); ctx.lineTo(1690, -270); ctx.lineTo(1900, 0); ctx.lineTo(1640, 0); ctx.closePath(); ctx.fill(); ctx.restore(); }
      ctx.strokeStyle = rgba(mixHex(LAMP.deep, P.night0, .5), .9); ctx.lineWidth = 6; ctx.strokeRect(1560, -480, 130, 210); ctx.beginPath(); ctx.moveTo(1625, -480); ctx.lineTo(1625, -270); ctx.stroke();
      // the right window: never lit
      ctx.fillStyle = mixHex(P.night1, mixHex(grey, P.night0, .2), lR); ctx.fillRect(2510, -480, 130, 210); ctx.strokeStyle = rgba(P.night0, .6); ctx.strokeRect(2510, -480, 130, 210);
      // tables
      const table = (x0, x1, col) => { ctx.fillStyle = col; ctx.fillRect(x0, -200, x1 - x0, 14); ctx.fillRect(x0 + 16, -186, 10, 186); ctx.fillRect(x1 - 26, -186, 10, 186); };
      table(1700, 2040, mixHex(P.night0, LAMP.deep, .3 + .5 * lL));
      table(2260, 2580, mixHex(P.night0, mixHex(grey, P.night0, .4), .3 + .7 * lR));
      if (lR > 0) { ctx.strokeStyle = rgba(CREAM, .25 * lR); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(2420, -208, 46, 7, 0, 0, TAU); ctx.stroke(); }   // one empty plate
      products(ctx, t, 'table');
      // you, waking up: a stretch
      const st = sineIO(span(t, A.wake + .05, A.wake + .8)) * (1 - sineIO(span(t, A.wake + 1.7, A.wake + 2.4)));
      ctx.save(); ctx.globalAlpha *= .12 + .88 * lL;
      F.du(ctx, 1610, 0, 300, { hood: false, light: 1, look: .3 + .2 * st, back: .2, armR: [lerp(.18, 2.85, st), lerp(.1, 3.0, st)], armL: [lerp(-.18, -2.85, st), lerp(-.1, -3.0, st)] });
      ctx.restore();
      // the doorway on the split: a pale back light, the stranger
      const dl = sineIO(span(t, A.opp + .3, A.stranger + .1));
      ctx.fillStyle = lin(ctx, 0, -DW.h, 0, 0, [[0, mixHex(P.night0, mixHex(CREAM2, P.night1, .45), dl)], [1, mixHex(P.night0, mixHex(CREAM2, P.night1, .25), dl)]]); ctx.fillRect(DW.x - DW.w / 2, -DW.h, DW.w, DW.h);
      const si = strIn(t);
      if (si > 0) {
        const ar = sineIO(span(t, A.keyw - .65, A.keyw - .15));   // he raises the hand with the key
        ctx.save(); if (si < 1) { ctx.beginPath(); ctx.rect(DW.x - 700, -DW.h - 200, 700 + DW.w / 2, DW.h + 200); ctx.clip(); }
        F.person(ctx, STR.x + (1 - si) * 160, 0, STR.h, { light: .25, walk: si < 1 ? t * 5 : undefined, dir: si < 1 ? -1 : 1, view: si < 1 ? 'side' : undefined, armR: [lerp(.1, .55, ar), lerp(.05, 1.95, ar)], armL: [-.1, -.05] });
        ctx.restore();
      }
      ctx.strokeStyle = rgba(CREAM, .35); ctx.lineWidth = 3; ctx.strokeRect(DW.x - DW.w / 2, -DW.h, DW.w, DW.h);
      // the split, the box outline
      ctx.strokeStyle = rgba(CREAM, .3); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(RM.mid, RM.y0); ctx.lineTo(RM.mid, -DW.h); ctx.stroke();
      ctx.strokeStyle = rgba(CREAM, .55); ctx.lineWidth = 3; ctx.strokeRect(RM.x0, RM.y0, RM.x1 - RM.x0, RM.y1 - RM.y0);
      ctx.restore();
    }
    if (bw > 0) { ctx.save(); ctx.strokeStyle = rgba(CREAM, .85); ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.shadowColor = rgba(F.GOLD.halo, .35 * fo); ctx.shadowBlur = 10; ctx.beginPath(); ctx.moveTo(RM.mid - bw / 2, RM.y0); ctx.lineTo(RM.mid + bw / 2, RM.y0); ctx.stroke(); ctx.restore(); }
  }
  // the bars on the ceiling line
  const bars = {
    baseW: (t) => { const w = lerp(RM.x1 - RM.x0, 820, sineIO(span(t, A.amer + .5, A.amer + 1.3))); return w * (1 - sineIO(span(t, A.july + .9, A.july + 1.7))); },
    h1: (t) => BAR.u * expoOut(span(t, A.amer + .75, A.amer + 1.45)) * (1 - sineIO(span(t, A.july + .9, A.july + 1.6))),
    h2a: (t) => BAR.u * expoOut(span(t, A.amer + .87, A.amer + 1.57)) * (1 - sineIO(span(t, A.july + .95, A.july + 1.65))),
    h2b: (t) => BAR.u * expoOut(span(t, A.double - .05, A.double + .75)),
    split: (t) => span(t, A.july + .1, A.july + .7),
  };
  function drawBars(ctx, t) {
    const h1 = bars.h1(t), h2a = bars.h2a(t), h2b = bars.h2b(t) * (1 - bars.split(t));
    const bar = (x, y0, h, col) => { if (h <= .5) return; ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(x - BAR.w / 2, y0 - h, BAR.w, h, [6, 6, 0, 0]); ctx.fill(); };
    bar(BAR.x1, BAR.base, h1, DATA.human);
    bar(BAR.x2, BAR.base, h2a, DATA.human);
    if (h2b > .5) { const sp = bars.split(t), y0 = BAR.base - h2a - 3, hh = h2b; ctx.save(); halo(ctx, BAR.x2, y0 - hh / 2, 160, .25, COOL.halo, COOL.core); bar(BAR.x2, y0, hh, DATA.machine); ctx.restore(); }
  }
  function netPos(t, i) {
    const n = NODES[i], sp = spread(t, i), m = netMove(t), cx = lerp(NET0.x, NET1.x, m), cy = lerp(NET0.y, NET1.y, m) - 120 * Math.sin(Math.PI * m);
    const wob = 6 * Math.sin(t * .8 + n.ph), rot = .05 * Math.sin(t * .3);
    const tx = cx + n.ox * Math.cos(rot) - n.oy * Math.sin(rot) + wob, ty = cy + n.ox * Math.sin(rot) + n.oy * Math.cos(rot) + wob * .6;
    let x = lerp(n.sx, tx, sp), y = lerp(n.sy, ty, sp) - 60 * Math.sin(Math.PI * sp);
    const k = intoDoor(t, i); if (k > 0) { x = lerp(x, D7.x, k); y = lerp(y, D7.y, k); }
    return [x, y, k];
  }
  function network(ctx, t) {
    if (t < A.july + .05) return;
    const pts = NODES.map((_, i) => netPos(t, i));
    const linkU = (j) => span(t, A.every + j * .06, A.every + .5 + j * .06);
    ctx.save(); ctx.lineCap = 'round';
    const la = 1 - span(t, A.who - 1.1, A.who - .8);
    LINKS.forEach(([i, j], q) => { const u = linkU(q % 17) * la; if (u <= 0) return; const [ax, ay] = pts[i], [bx, by] = pts[j];
      ctx.strokeStyle = rgba(DATA.machine, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(lerp(ax, bx, expoOut(u)), lerp(ay, by, expoOut(u))); ctx.stroke(); });
    pts.forEach(([x, y, k], i) => { if (k >= 1) return; const lit = span(t, A.july + .9 + i * .05, A.july + 1.3 + i * .05), r = lerp(13, 15, lit) * (1 - k * .8);
      if (lit > 0) halo(ctx, x, y, 46, .32 * lit * (1 - k), COOL.halo, COOL.core);
      ctx.fillStyle = mixHex(mixHex(DATA.machine, P.night1, .45), DATA.machine, lit); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
      if (lit > 0) { ctx.fillStyle = rgba(COOL.core, .8 * lit); ctx.beginPath(); ctx.arc(x, y, r * .38, 0, TAU); ctx.fill(); } });
    ctx.restore();
  }
  // strike-through lines: NO CAGE · NO GOD
  function strikes(ctx, t) {
    const out = span(t, A.idea - .05, A.idea + .45);
    const s1 = expoOut(span(t, A.nocage + .05, A.nocage + .4)) * (1 - out), s2 = expoOut(span(t, A.nogod + .05, A.nogod + .4)) * (1 - out);
    const ln = (x0, y0, x1, y1, u) => { if (u <= 0) return; ctx.save(); ctx.strokeStyle = rgba(CREAM, .92); ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.shadowColor = rgba(P.night0, .6); ctx.shadowBlur = 8; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(lerp(x0, x1, u), lerp(y0, y1, u)); ctx.stroke(); ctx.restore(); };
    ln(CG.x - 200, CG.y - 220, CG.x + 200, CG.y + 220, s1);
    ln(NET1.x - 230, NET1.y - 230, NET1.x + 230, NET1.y + 230, s2);
  }
  // the row: the station is 7 until the subscribe press, then it settles into the plate (n = 6 defaults)
  const st7 = (m) => ({ lit: m === 7 ? 1 : m > 7 ? .22 : .6, scale: m === 7 ? 1.06 : 1, beam: m === 7 ? .8 : .3 });
  const st6 = (m) => ({ lit: m === 6 ? 1 : m > 6 ? .22 : .6, scale: m === 6 ? 1.06 : 1, beam: m === 6 ? .8 : .3 });
  const splitInner = (c, box) => {
    const hw = box.w / 2;
    c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, mixHex(LAMP.core, LAMP.body, .3)], [1, mixHex(LAMP.body, LAMP.deep, .3)]]); c.fillRect(box.x0, box.y0, hw, box.h);
    c.fillStyle = lin(c, 0, box.y0, 0, box.y0 + box.h, [[0, mixHex(P.night1, '#6c6e78', .35)], [1, mixHex(P.night0, '#6c6e78', .15)]]); c.fillRect(box.x0 + hw, box.y0, hw, box.h);
  };
  function row(ctx, t, v, hud) {
    const u = u6(t), o7 = open7R(t);
    S.rowScene(ctx, t, T, {
      n: 6, v, yard: false, hud,
      lit: (m) => lerp(st7(m).lit, st6(m).lit, u), scale: (m) => lerp(st7(m).scale, st6(m).scale, u), beam: (m) => lerp(st7(m).beam, st6(m).beam, u),
      open: (m) => (m === 7 ? B.nz(o7) : undefined), inner: (m) => (m === 7 && o7 > .002 ? splitInner : undefined),
      parked: keyOwn(t) ? 'key' : undefined,
    });
  }
  const rowVisible = (v) => v.y + H / 2 / v.s > 360;
  function yardWorld(ctx, t, v, hud = 0) {
    const fin = span(t, A.subscribe, PLATE), lx = lerp(v.x, F.rowX(6), fin), ly = lerp(v.y - 60, 560, fin);
    F.yard(ctx, t, v, { lx, ly, pool: .8, rails: 1 });
    F.inView(ctx, v, () => { drawBars(ctx, t); room(ctx, t); belt(ctx, t); products(ctx, t, 'belt'); cage(ctx, t); strikes(ctx, t); });
    if (rowVisible(v)) row(ctx, t, v, hud);
    F.inView(ctx, v, () => network(ctx, t));
  }
  // ---------------------------------------------------------------- the key (screen px): hand → parked → the cage's place → door 7 → centre → the HUD pocket
  const PK = [250, 430], KEYW = 190;
  const turn = (t) => Math.PI * sineIO(span(t, A.channel + .4, A.everybody + .6)) + Math.PI * sineIO(span(t, A.notjust + .05, A.notjust + 1.1));
  const keyLand = A.subscribe + .9, keyHand = A.subscribe + 1.3;
  const keyOwn = (t) => t >= A.subscribe + .3 && t < keyHand;   // our flying copy replaces the HUD pocket glyph
  function keyState(t, v) {
    if (t < A.keyw - .25) return null;
    const hs = F.toScreen(v, HAND[0] + 6, HAND[1] - 4);
    const inHand = { x: hs[0], y: hs[1], s: 70 * v.s * expoOut(span(t, A.keyw - .25, A.keyw + .15)), rot: -.5 + .05 * Math.sin(t * 1.3), flip: 1, glint: bump(t, A.keyw, 1.0) };
    const lift = sineIO(span(t, A.amer - .15, A.amer + .75));
    const parked = { x: PK[0] + 6 * Math.sin(t * .9), y: PK[1] + 8 * Math.sin(t * .7), s: 120, rot: -.18 + .04 * Math.sin(t * .6), flip: 1, glint: 0 };
    if (t < A.idea + .2) { if (lift <= 0) return inHand; return arc(inHand, parked, lift, 160); }
    const [cx, cy] = F.toScreen(v, CG.x, CG.y + 4 * Math.sin(t * 1.1));
    const atCage = { x: cx, y: cy, s: KEYW * v.s, rot: 0, flip: 1, glint: .3 * bump(t, A.idea + 1.2, 1.2) };
    const toCage = sineIO(span(t, A.idea + .2, A.idea + 1.25));
    if (t < A.who - 1.1) return arc(parked, atCage, toCage, 120);
    const dk = sineIO(span(t, A.who - 1.1, A.who + 1.2)), wx = lerp(CG.x, D7.x, dk), wy = lerp(CG.y, D7.y + 6 * Math.sin(t * .9), dk), [dx, dy] = F.toScreen(v, wx, wy);
    const atDoor = { x: dx, y: dy, s: lerp(KEYW, 118, dk) * v.s, rot: lerp(0, -Math.PI / 2, dk), flip: 1, glint: .4 * bump(t, A.who + 1.0, 1.4) };
    const toC = sineIO(span(t, A.channel - .1, A.channel + 1.2));
    const centre = { x: 960 + 5 * Math.sin(t * .5), y: 395 + 6 * Math.sin(t * .7), s: 300, rot: 0, flip: Math.cos(turn(t)), glint: .5 * bump(t, A.want, 1.1) };
    const c1 = toC > 0 ? arc(atDoor, centre, toC, 60) : atDoor;
    const fly = sineIO(span(t, A.subscribe + .35, keyLand));
    if (fly <= 0) return c1;
    const [px, py] = F.hudPocket('key');
    return arc(c1, { x: px, y: py, s: 30, rot: 0, flip: 1, glint: 0 }, fly, 140);
  }
  function arc(a, b, u, lift) { return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u) - lift * Math.sin(Math.PI * u), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), rot: lerp(a.rot, b.rot, u), flip: lerp(a.flip, b.flip, u), glint: lerp(a.glint, b.glint, u) }; }
  function drawKey(ctx, t, k) {
    if (!k || k.s < 1) return;
    ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(k.x, k.y); ctx.rotate(k.rot);
    const f = Math.abs(k.flip) < .04 ? (k.flip < 0 ? -.04 : .04) : k.flip; ctx.scale(1, f);
    F.keyGlyph(ctx, t, 0, 0, k.s, { glint: k.glint }); ctx.restore();
  }
  // ---------------------------------------------------------------- the M plate (screen): title + button grow out of the bow
  function subscribe(ctx, t, k) {
    if (t < A.channel || !k) return;
    const bow = [k.x - (k.s * .8) / 2, k.y];
    const fold = sineIO(span(t, A.subscribe + .45, A.subscribe + .95));
    const grow = (g, X, Y, fn) => { const e = expoOut(clamp(g)) * (1 - fold); if (e <= .002) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.translate(lerp(bow[0], X, e), lerp(bow[1], Y, e)); ctx.scale(e, e); fn(); ctx.restore(); };
    grow(span(t, A.channel + .35, A.channel + 1.4), 960, 215, () => F.big(ctx, 'THE GOOD TAKEOFF', 0, 0, 84, 1, { gold: .15 }));
    const press = span(t, A.subscribe + .12, A.subscribe + .28) * (1 - span(t, A.subscribe + .36, A.subscribe + .55));
    grow(span(t, A.reason - .1, A.reason + .9), 960, 525, () => B.subButton(ctx, 0, 0, 1, { press, glow: bump(t, A.want - .05, 1.15) + .4 * press }));
    const fe = span(t, A.everybody - .05, A.everybody + .6) * (1 - fold);
    F.label(ctx, 'FOR EVERYBODY', 960, 285, fe, { size: 30, gold: .75, spacing: .2 });
  }
  // ---------------------------------------------------------------- draw
  function draw(ctx, t) {
    if (t < FLY1) {
      const vL = flyView(t), Z = vL.s, o7 = open7L(t);
      S.plain(ctx, t, vL, { stars: 1 });
      const base = turnSlots(t, {});
      S.leitbild(ctx, t, { v: vL, bg: false, beams: 1, stars: 0, you: { ...S.YOU0, a: 1, look: .35 },
        slots: (i) => {
          const o = base(i); if (i !== 6) return o;
          return { ...o, open: o7, inner: (c, box) => {
            const [x0, y0] = F.toScreen(vL, box.x0, box.y0), sb = { x0, y0, w: box.w * vL.s, h: box.h * vL.s };
            c.save(); c.setTransform(1, 0, 0, 1, 0, 0);
            B.through(c, t, sb, Z, ZE, RC, (cc, tt, rv) => yardWorld(cc, tt, rv, 0));
            const la = 1 - sineIO(span(o7, .17, .8));   // the crack's light gives way to what is behind it
            if (la > 0) { c.globalAlpha *= la; c.fillStyle = lin(c, 0, sb.y0, 0, sb.y0 + sb.h, [[0, mixHex(S.slotDoor(6).col, '#ffffff', .75)], [1, mixHex(S.slotDoor(6).col, '#ffffff', .35)]]); c.fillRect(sb.x0, sb.y0, sb.w, sb.h); }
            c.restore();
          } };
        } });
      F.inView(ctx, vL, () => { for (let i = 0; i < 12; i++) { const r = F.THUMB_ORDER[i]; if (r < 8) continue; const d = S.thumbSlot(i); F.miniTag(ctx, d.x, d.y - d.h - 22, 1, r); } });
      F.counterHud(ctx, t, T);
      return;
    }
    const v = view(t), rv = rowVisible(v);
    yardWorld(ctx, t, v, 1);
    // ---------------- texts (screen px at reference views: they ride the camera)
    B.inRef(ctx, v, cam[1][1], () => {
      const out = span(t, A.caged + .6, A.caged + 1.2), ru = expoOut(span(t, A.name + .15, A.name + .9)) * (1 - sineIO(out));
      if (ru > 0) F.lightLine(ctx, [[960 - 250 * ru, 214], [960 + 250 * ru, 214]], 1, { w: 2, a: .6, glow: false });
      F.big(ctx, 'ENSLAVED GOD', W / 2, 190, 76, span(t, A.ensl - .05, A.ensl + .6) * (1 - out), { gold: 0 });
    });
    B.inRef(ctx, v, VBELT, () => {
      const out = span(t, A.wake + .3, A.wake + .8);
      const [wx, wy] = B.refPt(VBELT, 1040, -95), [tx, ty] = B.refPt(VBELT, 1330, -95);
      F.label(ctx, 'WEALTH', wx, wy, span(t, A.wealth - .05, A.wealth + .5) * (1 - out), { size: 30 });
      F.label(ctx, 'TECHNOLOGY', tx, ty, span(t, A.tech - .05, A.tech + .5) * (1 - out), { size: 30 });
    });
    F.scenarioTag(ctx, span(t, A.wake - .1, A.wake + .4) * (1 - span(t, A.amer - .2, A.amer + .3)));
    B.inRef(ctx, v, VB, () => {
      const gOut = span(t, A.nocage - 1.0, A.nocage - .4);
      F.big(ctx, TXT.e7.genesis, W / 2, 168, 72, span(t, A.amer + .2, A.amer + .9) * (1 - gOut), { gold: 0 });
      F.label(ctx, TXT.e7.goal, W / 2, 226, span(t, A.scient - .1, A.scient + .5) * (1 - span(t, A.july - .3, A.july + .2)), { size: 26, col: CREAM2 });
      const bOut = span(t, A.july + .8, A.july + 1.3);
      const [x1, y1] = B.refPt(VB, BAR.x1, BAR.base - BAR.u), [x2, y2] = B.refPt(VB, BAR.x2, BAR.base - BAR.u * 2), [, yb] = B.refPt(VB, 0, BAR.base);
      F.big(ctx, '1×', x1, y1 - 22, 50, span(t, A.amer + 1.2, A.amer + 1.8) * (1 - bOut), { gold: 0, glow: false });
      F.big(ctx, '2×', x2, y2 - 22, 50, span(t, A.double + .45, A.double + 1.0) * (1 - span(t, A.july, A.july + .4)), { gold: 0, glow: false });
      F.label(ctx, 'TODAY', x1, yb + 46, span(t, A.amer + 1.0, A.amer + 1.6) * (1 - bOut), { size: 24, col: CREAM2 });
      F.label(ctx, 'IN 10 YEARS', x2, yb + 46, span(t, A.ten - .1, A.ten + .5) * (1 - bOut), { size: 24, col: CREAM2 });
    });
    F.source(ctx, t, A.amer + .5, A.july + .9, TXT.e7.src);
    B.inRef(ctx, v, VB, () => {
      const [nx, ny] = B.refPt(VB, NET0.x, NET0.y + NR * .82 + 70);
      F.label(ctx, '17 OF 17 LABS', nx, ny, span(t, A.every + .6, A.every + 1.2) * (1 - span(t, A.nocage - .7, A.nocage - .25)), { size: 30 });
    });
    const tg = span(t, A.july + .05, A.july + .6), tOut = span(t, A.nocage - 1.0, A.nocage - .4);
    if (tg > 0 && tOut < 1) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); F.switchTag(ctx, t, 560, 330, F.END[7].tag, tg, { out: tOut }); ctx.restore(); }
    B.inRef(ctx, v, VNC, () => {
      const [nc, nn] = TXT.e7.nocage.split(' · '), out = span(t, A.idea - .05, A.idea + .45);
      const [cx, cy] = B.refPt(VNC, CG.x, CG.y - CH / 2 - 80), [gx, gy] = B.refPt(VNC, NET1.x, CG.y - CH / 2 - 80);
      F.label(ctx, nc, cx, cy, span(t, A.nocage, A.nocage + .5) * (1 - out), { size: 32 });
      F.label(ctx, nn, gx, gy, span(t, A.nogod, A.nogod + .5) * (1 - out), { size: 32 });
    });
    B.inRef(ctx, v, VK, () => {
      const out = span(t, A.who - .3, A.who + .2), lu = span(t, A.tool - .2, A.tool + .6) * (1 - sineIO(out));
      const [ax, ay] = B.refPt(VK, CG.x + KEYW * .45, CG.y), [bx, by] = B.refPt(VK, NET1.x - NR * .95, NET1.y);
      if (lu > 0) F.lightLine(ctx, [[ax, ay], [bx, by]], expoOut(lu), { w: 3, a: .8 });
      F.label(ctx, 'TOOL OF WHOEVER HOLDS THE KEY', W / 2, ay - 70, span(t, A.whoever - .1, A.whoever + .5) * (1 - out), { size: 28 });
    });
    F.big(ctx, TXT.e7.key, W / 2, 190, 76, span(t, A.who + .2, A.who + .9) * (1 - span(t, A.channel - .2, A.channel + .3)), { gold: 0 });
    // ---------------- the key, the subscribe plate
    const k = t < keyHand ? keyState(t, v) : null;
    subscribe(ctx, t, k);
    if (!rv) F.counterHud(ctx, t, T, { parked: keyOwn(t) ? 'key' : undefined });
    drawKey(ctx, t, k);
  }
  return [{ t: R.a, draw, print: F.PRINT71 }, { t: PLATE, draw: (ctx, t) => S.plateRow(ctx, t, T, 6), print: F.PRINT71 }];
}
