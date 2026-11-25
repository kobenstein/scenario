// Film 78 · B1 · c04 'And yet, something bigger' → 'Not blindly' (121.7–183.9 s). Rows 3.01–3.15 (docs/shots.md):
//   3.01 out of the office window: the man small under a big sky, a light far on the horizon
//   3.02 a small heavy hatch half in the ground (the bunker: picture only, no quote, no card) + the light becomes a ring AS SMART AS US · SUMMER 2023
//   3.03 the hatch stands up as a lab door with a padlock: the lock opens, the room is empty, the light runs out into the open
//   3.04 ★ MIT TECHNOLOGY REVIEW · OCT 26, 2023 "There will be a before | and an after." — the gap tears open into the gold LINE
//   3.05 BEFORE | AFTER, a cream ? on the AFTER side · 3.06 the lectern from the hook rises, sound rings
//   3.07 pull back out of the lit door of Convocation Hall: TORONTO · JUNE 2025 · SAME HALL AS HIS DEGREE, rows of graduates
//   3.08 C2 grows out of the hall door and goes back into it · 3.09 fly into the door: the working figures, SOME → ALL OF IT
//   3.10 a figure learns (a page → a tool in its hand), a cool copy does the same: ANYTHING YOU CAN LEARN · 3.11 a cream ?
//   3.12 a head profile with a network of gold nodes: BIOLOGICAL COMPUTER · 3.13 the network copies into a chip in cool light: DIGITAL
//   3.14 the LINE again: the chip turns into the ring, which crumbles (NOT A HIDDEN MACHINE); ONE DAY rises on the AFTER side like a sun
//   3.15 the claim as a card on the line: AI WILL DO ALL THE THINGS WE CAN DO, a ? beside it (c05 opens an eye on it)
import * as E from './f10_editorial.mjs';
import * as F from './f78_kit.mjs';
import * as S from './f78_world.mjs';
import * as B from './b1_kit.mjs';
import { OFFICE, office } from './b1_c03.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo, lin, rad, prng } = E;
const { GOLD, CREAM, CREAM2, PAPER, COOL, mv, rise, measure } = F;
const TAU = Math.PI * 2;

// ------------------------------------------------------------------------------------------------ layout (design space)
export const GY4 = 860;                                                  // the open ground
export const LINE = { x: 960, y0: 120, y1: 960 };                        // THE LINE (same x as the hook's)
export const CLAIM = { x: 470, y: 318, w: 980, h: 168 };                 // 3.15 the claim card (c05 opens the eye on it)
export const SUN = { x: 1440, r: 120 };
const MANX = 640, MANH = 230;
const HATCH = { x: 1040 }, DOOR = { x: 960, y: 540, w: 190, h: 320 };   // the lab door stands on GY4
const PAGE = { x: 330, y: 200, w: 1260, h: 560 };                        // the magazine page
const EASE = (u) => .35 * u + .65 * sineIO(u);   // the door flights: a calmer peak speed (smooth.py)
const HALL = { cx: 960, gy: 900 }, HDOOR = { x: 884, y: 700, w: 152, h: 200 };   // Convocation Hall, its lit door (the fly opening)
const GRIDR = { x: 360, y: 190, w: 1200, h: 660 };                       // the working figures
const HEAD = { x: 700, y: 840, h: 600 }, CHIP = { x: 1300, y: 470, s: 300 };

// the node network (unit disk), shared by the head and the chip
const NODES = (() => { const r = prng(3412), out = []; while (out.length < 26) { const x = r() * 2 - 1, y = r() * 2 - 1; if (x * x + y * y > .92) continue; if (out.some((p) => Math.hypot(p[0] - x, p[1] - y) < .3)) continue; out.push([x, y]); } return out.sort((a, b) => a[0] - b[0]); })();
const EDGES = (() => { const e = new Set(); NODES.forEach((p, i) => { const d = NODES.map((q, j) => [Math.hypot(q[0] - p[0], q[1] - p[1]), j]).filter(([, j]) => j !== i).sort((a, b) => a[0] - b[0]); for (const [, j] of d.slice(0, 2)) e.add(i < j ? `${i}-${j}` : `${j}-${i}`); }); return [...e].map((k) => k.split('-').map(Number)); })();
function network(ctx, t, at, lit, o = {}) {   // at(i) → [x, y] | null; lit(i) 0..1
  const col = o.col ?? GOLD, rr = o.r ?? 7;
  ctx.save(); ctx.lineCap = 'round';
  for (const [a, b] of EDGES) { const pa = at(a), pb = at(b); if (!pa || !pb) continue; const u = Math.min(lit(a), lit(b)); if (u <= 0) continue; ctx.strokeStyle = rgba(col.line ?? col.body, .55 * u); ctx.lineWidth = o.w ?? 2; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(pb[0], pb[1]); ctx.stroke(); }
  NODES.forEach((_, i) => { const p = at(i), u = lit(i); if (!p || u <= 0) return; const pul = .75 + .25 * Math.sin(t * 3 + i * 1.7); halo(ctx, p[0], p[1], rr * 4.5, .35 * u * pul, col.halo, col.core); ctx.fillStyle = rgba(col.core, u); ctx.beginPath(); ctx.arc(p[0], p[1], rr * (.6 + .4 * u), 0, TAU); ctx.fill(); });
  ctx.restore();
}

// ------------------------------------------------------------------------------------------------ pieces
function hatch(ctx, x, y, u) {   // a small heavy hatch, half in the ground (slanted slab, a seam, a handle), rising out of the ground
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), dy = (1 - k) * 70;
  ctx.save(); ctx.beginPath(); ctx.rect(x - 200, y - 200, 400, 200); ctx.clip(); ctx.translate(0, dy);
  ctx.fillStyle = mixHex(P.night0, P.ind1, .45); ctx.beginPath(); ctx.moveTo(x - 80, y); ctx.lineTo(x - 62, y - 44); ctx.lineTo(x + 62, y - 44); ctx.lineTo(x + 80, y); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM2, .7); ctx.lineWidth = 2; ctx.stroke();
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 50, y - 30); ctx.lineTo(x + 50, y - 30); ctx.stroke();
  ctx.strokeStyle = rgba(CREAM2, .8); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y - 30, 12, Math.PI, TAU); ctx.stroke();
  ctx.restore();
}
function labDoor(ctx, t, u, lock, open, o = {}) {   // DOOR on GY4: frame, leaf (swings open to the left hinge), padlock on a hasp
  u = clamp(u); if (u <= 0) return;
  const k = expoOut(u), D = DOOR, dy = (1 - k) * (D.h + 30);
  ctx.save(); ctx.beginPath(); ctx.rect(D.x - 400, D.y - 400, D.w + 800, D.h + 400); ctx.clip(); ctx.translate(0, dy);
  // the room behind (empty, a faint floor)
  ctx.fillStyle = lin(ctx, 0, D.y, 0, D.y + D.h, [[0, mixHex(P.night0, P.ind0, .3)], [1, mixHex(P.night1, P.ind1, .4)]]); ctx.fillRect(D.x, D.y, D.w, D.h);
  ctx.fillStyle = rgba(CREAM2, .14); ctx.fillRect(D.x + 6, D.y + D.h * .78, D.w - 12, 2);
  // the light that was kept in there runs out into the open (cool spill on the ground, out to the right)
  const sp = clamp(o.spill ?? 0);
  if (sp > 0) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = lin(ctx, D.x, 0, D.x + 900, 0, [[0, rgba(COOL.halo, .32 * sp)], [1, rgba(COOL.halo, 0)]]);
    ctx.beginPath(); ctx.moveTo(D.x + D.w, D.y + D.h); ctx.lineTo(D.x + D.w + 900 * sineIO(sp), D.y + D.h + 70); ctx.lineTo(D.x + D.w + 900 * sineIO(sp), D.y + D.h + 4); ctx.lineTo(D.x, D.y + D.h); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  // the frame
  ctx.strokeStyle = rgba(CREAM, .75); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(D.x - 8, D.y + D.h); ctx.lineTo(D.x - 8, D.y - 8); ctx.lineTo(D.x + D.w + 8, D.y - 8); ctx.lineTo(D.x + D.w + 8, D.y + D.h); ctx.stroke();
  // the leaf: hinged left, swings toward us (narrows, darkens)
  const op = sineIO(clamp(open)), lw = D.w * (1 - .82 * op);
  ctx.fillStyle = mixHex(mixHex(P.ind1, P.blue1, .35), P.night0, .45 * op); ctx.beginPath(); ctx.moveTo(D.x, D.y); ctx.lineTo(D.x + lw, D.y - 14 * op); ctx.lineTo(D.x + lw, D.y + D.h + 14 * op); ctx.lineTo(D.x, D.y + D.h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = rgba(CREAM2, .6); ctx.lineWidth = 2; ctx.stroke();
  if (op < .5) { ctx.fillStyle = rgba(COOL.body, .5 * (1 - op * 2)); ctx.fillRect(D.x + lw * .3, D.y + 40, lw * .4, 60); }   // the little window in the leaf
  // the padlock on the hasp (right edge of the leaf): the shackle lifts, the lock drops to the ground
  const lx = D.x + lw - 26, ly = D.y + D.h * .5, lk = clamp(lock), fall = expoIn(span(lk, .35, 1));
  if (fall < 1) {
    ctx.save(); ctx.translate(lx, ly + fall * (D.h * .5 - 16)); ctx.rotate(fall * .5);
    ctx.strokeStyle = GOLD.line; ctx.lineWidth = 5; const sh = 14 * expoOut(span(lk, 0, .35));
    ctx.beginPath(); ctx.moveTo(-11, -6 - sh); ctx.arc(0, -16 - sh, 11, Math.PI, TAU); ctx.lineTo(11, -6 - (sh > 2 ? sh : 0)); ctx.stroke();
    ctx.fillStyle = GOLD.mid; ctx.beginPath(); ctx.roundRect(-17, -8, 34, 30, 5); ctx.fill(); ctx.fillStyle = GOLD.deep; ctx.fillRect(-2, 2, 4, 10);
    ctx.restore();
  }
  ctx.restore();
}
function magazine(ctx, t, R, o) {   // the page (paper): header, rule, the quote in two halves (left half ends at LINE.x - gap, right half begins at LINE.x + gap)
  ctx.fillStyle = rgba(P.night0, .4); ctx.fillRect(R.x + 12, R.y + 16, R.w, R.h);
  ctx.fillStyle = lin(ctx, R.x, R.y, R.x + R.w, R.y + R.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(R.x, R.y, R.w, R.h);
  ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(R.x, R.y, R.w, R.h);
  B.caps(ctx, F.SOURCES.mit, R.x + 70, R.y + 84, 28, o.head, { col: PAPER.ink });
  ctx.fillStyle = rgba(PAPER.edge, .9); ctx.fillRect(R.x + 70, R.y + 116, (R.w - 140) * sineIO(o.head), 2);
  // column hints (the magazine's text, as grey bars) under the quote
  ctx.fillStyle = rgba(PAPER.shade, .9 * o.head); for (let i = 0; i < 4; i++) { ctx.fillRect(R.x + 70, R.y + 430 + i * 26, (R.w - 140) * (i === 3 ? .55 : 1) * sineIO(clamp(o.head * 1.4 - i * .1)), 8); }
  return R;
}

// the hall: Convocation Hall at dusk (round hall, a curved colonnade, dome with lantern), its lit door HDOOR
function hall(ctx, t, o = {}) {
  const gy = HALL.gy, cx = HALL.cx, lt = clamp(o.lit ?? 1);
  B.ground(ctx, gy, 1);
  halo(ctx, cx, gy - 220, 900, .16, GOLD.halo, GOLD.hot);   // the warm uplight on the building
  // the drum
  const dx0 = cx - 470, dx1 = cx + 470, dTop = 400;
  ctx.fillStyle = lin(ctx, 0, dTop, 0, gy, [[0, mixHex(P.ind1, PAPER.shade, .32)], [1, mixHex(P.night1, GOLD.deep, .4)]]); ctx.fillRect(dx0, dTop, dx1 - dx0, gy - dTop);
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .5); ctx.fillRect(dx0 - 14, dTop - 16, dx1 - dx0 + 28, 20);   // cornice
  // tall windows in the drum (warm, lit from inside)
  for (let i = 0; i < 8; i++) { const x = dx0 + 60 + i * ((dx1 - dx0 - 120) / 7); if (Math.abs(x - cx) < 80) continue; ctx.fillStyle = rgba(GOLD.hot, .26 + .05 * Math.sin(t * .7 + i)); ctx.beginPath(); ctx.roundRect(x - 13, 440, 26, 74, [13, 13, 2, 2]); ctx.fill(); }
  // the dome: ribs, a lantern on top
  ctx.fillStyle = lin(ctx, 0, 190, 0, dTop, [[0, mixHex(P.ind1, P.blue1, .5)], [1, mixHex(P.ind1, PAPER.shade, .2)]]);
  ctx.beginPath(); ctx.ellipse(cx, dTop - 16, 420, 190, 0, Math.PI, TAU); ctx.fill();
  ctx.strokeStyle = rgba(CREAM2, .35); ctx.lineWidth = 2;
  for (let i = 1; i < 8; i++) { const a = Math.PI + i * Math.PI / 8; ctx.beginPath(); ctx.ellipse(cx, dTop - 16, Math.abs(Math.cos(a)) * 420, 190, 0, Math.cos(a) < 0 ? Math.PI : -Math.PI / 2, Math.cos(a) < 0 ? 1.5 * Math.PI : 0); ctx.stroke(); }
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .35); ctx.fillRect(cx - 34, 178, 68, 40); ctx.beginPath(); ctx.ellipse(cx, 178, 34, 22, 0, Math.PI, TAU); ctx.fill();
  halo(ctx, cx, 196, 60, .3 * lt, GOLD.halo, GOLD.hot);
  // the lit door (the inner shows through it when the caller flies; here: its warm glow and frame)
  halo(ctx, cx, HDOOR.y + HDOOR.h * .55, 260, .42 * lt, GOLD.halo, GOLD.hot);
  ctx.fillStyle = mixHex(GOLD.mid, GOLD.hot, .4); ctx.fillRect(HDOOR.x, HDOOR.y, HDOOR.w, HDOOR.h);
  // the curved colonnade in front (columns narrower toward the sides), entablature on top
  ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .42); ctx.fillRect(cx - 560, 548, 1120, 30);
  ctx.fillStyle = rgba(CREAM, .25); ctx.fillRect(cx - 560, 548, 1120, 3);
  const cols = []; for (let i = 0; i < 12; i++) { const th = -1.25 + i * (2.5 / 11); cols.push(th); }
  cols.sort((a, b) => Math.cos(a) - Math.cos(b));
  for (const th of cols) {
    const x = cx + 540 * Math.sin(th), w = 12 + 26 * Math.cos(th); if (Math.abs(x - cx) < HDOOR.w * .45) continue;
    ctx.fillStyle = lin(ctx, x - w / 2, 0, x + w / 2, 0, [[0, mixHex(PAPER.shade, GOLD.body, .25)], [.55, mixHex(P.ind1, PAPER.shade, .55)], [1, mixHex(P.night1, P.ind1, .6)]]);
    ctx.fillRect(x - w / 2, 578, w, gy - 578 - 18);
    ctx.fillStyle = mixHex(P.ind1, PAPER.shade, .45); ctx.fillRect(x - w / 2 - 4, 578, w + 8, 8); ctx.fillRect(x - w / 2 - 4, gy - 22, w + 8, 10);
  }
  // steps
  for (let i = 0; i < 3; i++) { ctx.fillStyle = mixHex(P.night1, PAPER.shade, .18 + i * .04); ctx.fillRect(cx - 600 - i * 30, gy - 12 + i * 8, 1200 + i * 60, 8); }
}
// rows of graduates seen from behind (mortarboards), rising from the bottom edge
function graduates(ctx, t, u) {
  u = clamp(u); if (u <= 0) return;
  const rows = [[1000, 15, .9], [1046, 13, 1.12], [1096, 11, 1.38]];
  rows.forEach(([y0, n, s], r) => {
    const k = expoOut(clamp(u * 1.4 - r * .2)), y = y0 + (1 - k) * 220, r0 = prng(90 + r);
    for (let i = 0; i < n; i++) {
      const x = 960 + (i - (n - 1) / 2) * (1800 / n) + (r0() - .5) * 40, hy = y + E.drift(t * .5, 2, i + r * 9);
      ctx.fillStyle = mixHex(P.night0, P.ind1, .25 + r * .03);
      ctx.beginPath(); ctx.ellipse(x, hy + 52 * s, 48 * s, 34 * s, 0, Math.PI, TAU); ctx.fill();   // shoulders
      ctx.beginPath(); ctx.arc(x, hy, 21 * s, 0, TAU); ctx.fill();                                     // head
      ctx.beginPath(); ctx.moveTo(x - 34 * s, hy - 16 * s); ctx.lineTo(x, hy - 27 * s); ctx.lineTo(x + 34 * s, hy - 16 * s); ctx.lineTo(x, hy - 6 * s); ctx.closePath(); ctx.fill();   // the cap
      ctx.strokeStyle = rgba(GOLD.line, .45); ctx.lineWidth = 1.5; ctx.stroke();
      ctx.strokeStyle = rgba(GOLD.body, .7); ctx.beginPath(); ctx.moveTo(x, hy - 16 * s); ctx.quadraticCurveTo(x + 20 * s, hy - 12 * s, x + 22 * s, hy + 6 * s); ctx.stroke();   // tassel
    }
  });
}
function headPath(ctx, x, y, h) {   // a head in profile facing right; (x, y) = bottom of the neck
  const p = (u, v) => [x + u * h, y + v * h];
  ctx.beginPath(); ctx.moveTo(...p(-.20, 0)); ctx.lineTo(...p(-.22, -.22));
  ctx.bezierCurveTo(...p(-.46, -.36), ...p(-.52, -.80), ...p(-.20, -.96));
  ctx.bezierCurveTo(...p(.06, -1.06), ...p(.31, -.95), ...p(.33, -.70));
  ctx.bezierCurveTo(...p(.34, -.63), ...p(.33, -.59), ...p(.35, -.56));
  ctx.lineTo(...p(.42, -.43)); ctx.lineTo(...p(.35, -.39)); ctx.lineTo(...p(.37, -.33)); ctx.lineTo(...p(.34, -.29)); ctx.lineTo(...p(.36, -.25));
  ctx.bezierCurveTo(...p(.34, -.17), ...p(.29, -.13), ...p(.19, -.13)); ctx.lineTo(...p(.12, -.12)); ctx.lineTo(...p(.12, 0)); ctx.closePath();
}
const headNode = (i) => [HEAD.x + (-.05 + NODES[i][0] * .27) * HEAD.h, HEAD.y + (-.68 + NODES[i][1] * .2) * HEAD.h];
const chipNode = (i, c = CHIP) => [c.x + NODES[i][0] * c.s * .4, c.y + NODES[i][1] * c.s * .4];
function chip(ctx, t, c, u, a = 1) {   // a square chip outline in cool light, pins on all sides; u draws the outline
  u = clamp(u); if (u <= 0 || a <= 0) return;
  const s = c.s, x0 = c.x - s / 2, y0 = c.y - s / 2;
  ctx.save(); ctx.globalAlpha *= a;
  halo(ctx, c.x, c.y, s * 1.1, .22 * u, COOL.halo, COOL.core);
  ctx.fillStyle = rgba(mixHex(P.night0, P.ind1, .5), .9 * u); ctx.beginPath(); ctx.roundRect(x0, y0, s, s, 18); ctx.fill();
  F.goldSpan(ctx, [[x0, y0], [x0 + s, y0], [x0 + s, y0 + s], [x0, y0 + s], [x0, y0]], 0, sineIO(u), { w: 2.4, spark: u < 1, col: COOL });
  const pins = sineIO(span(u, .5, 1));
  ctx.strokeStyle = rgba(COOL.line, .8 * pins); ctx.lineWidth = 4;
  for (let i = 0; i < 6; i++) { const f = (i + .5) / 6, L = 26 * pins;
    ctx.beginPath(); ctx.moveTo(x0 + s * f, y0); ctx.lineTo(x0 + s * f, y0 - L); ctx.moveTo(x0 + s * f, y0 + s); ctx.lineTo(x0 + s * f, y0 + s + L);
    ctx.moveTo(x0, y0 + s * f); ctx.lineTo(x0 - L, y0 + s * f); ctx.moveTo(x0 + s, y0 + s * f); ctx.lineTo(x0 + s + L, y0 + s * f); ctx.stroke(); }
  ctx.restore();
}
function tool(ctx, x, y, ang, s, col, u) {   // a simple hammer (handle + head) lit in a hand
  u = clamp(u); if (u <= 0) return;
  halo(ctx, x, y, s * 1.6, .45 * u, col.halo, col.core);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha *= u;
  ctx.fillStyle = col.body; ctx.fillRect(-s * .06, -s * .9, s * .12, s * 1.05);
  ctx.fillStyle = col.core; ctx.beginPath(); ctx.roundRect(-s * .32, -s * 1.02, s * .64, s * .22, s * .04); ctx.fill();
  ctx.restore();
}
function sheet(ctx, x, y, s, rot, a = 1) {   // a small page (what is learned)
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(x, y); ctx.rotate(rot);
  ctx.fillStyle = PAPER.lit; ctx.fillRect(-s * .4, -s * .5, s * .8, s); ctx.fillStyle = rgba(PAPER.shade, .9);
  for (let i = 0; i < 4; i++) ctx.fillRect(-s * .28, -s * .32 + i * s * .18, s * (i === 3 ? .3 : .56), s * .06);
  ctx.restore();
}
function qMark(ctx, x, y, size, u, o = {}) {   // a big cream ? (serif), rising
  u = clamp(u); if (u <= 0) return;
  ctx.save(); ctx.globalAlpha *= o.a ?? 1;
  halo(ctx, x, y - size * .35, size * 1.1, .14 * u, CREAM2, CREAM);
  F.goldText(ctx, [['?', 0]], x, y, size, rise(u), { serif: true, align: 'center', col: o.col ?? CREAM });
  ctx.restore();
}

export default function c04({ T, G }) {
  const tA = G('And yet, something bigger'), tWorry = G('did worry him', 0, tA);
  const tEarlier = G('Earlier that year'), tBunker = G('bunker', 0, tEarlier), tMachine = G('machine as smart', 0, tEarlier), tSmart = G('smart as us', 0, tEarlier);
  const tNever = G('But what worried him was never'), tNeverW = G('never locked', 0, tNever), tLocked = G('locked in a lab', 0, tNever), tLab = G('lab', 0, tLocked);
  const tThree = G('Three weeks before that Friday'), tMag = G('magazine', 0, tThree), tThere = G('There will be a before', 0, tThree), tAfter = G('an after', 0, tThere) + .12;
  const tWhat = G('Before and after what'), tWhatQ = G('what', 0, tWhat + .3);
  const tLater = G('He later said it out loud'), tLoud = G('out loud', 0, tLater);
  const tToronto = G('In Toronto, in the hall'), tDegree = G('own degree', 0, tToronto), tGrad = G('new class of graduates', 0, tToronto);
  const clip = T.clip('C2') || { start: 150.38, end: 157.35 }, cs = clip.start, ce = clip.end;
  const tSome = G('Not some of what you do'), tAll = G('All of it', 0, tSome);
  const tLearn = G('Anything you can learn'), tLearnW = G('learn', 0, tLearn), tAI = G('the AI could do', 0, tLearn), tWell = G('as well', 0, tAI);
  const tSure = G('How can he be so sure');
  const tReason = G('His reason'), tBio = G('biological computer', 0, tReason);
  const tWhy = G("So why shouldn't a digital one"), tDigital = G('digital one', 0, tWhy);
  const tSees = G('So that is what Ilya sees coming'), tHidden = G('Not a hidden machine'), tDay = G('A day', 0, tHidden + .5);
  const tClaim = G('A big claim'), tWord = G('take his word', 0, tClaim);
  const tEnd = G('Not blindly');

  const keys = [
    [tA + 2.5, { x: 960, y: 540, s: 1.0 }], [tEarlier + 1.0, { x: 990, y: 540, s: 1.0 }], [tSmart + .5, { x: 1080, y: 520, s: 1.04 }],
    [tLab + .5, { x: 1010, y: 575, s: 1.07 }], [tThree + 1.5, { x: 960, y: 520, s: 1.0 }], [tThere + .5, { x: 960, y: 490, s: 1.07 }],
    [tAfter + 1.1, { x: 960, y: 540, s: 1.0 }], [tLater + 1.2, { x: 1170, y: 560, s: 1.12 }], [tToronto + 3.5, { x: 960, y: 520, s: .97 }], [tGrad + .4, { x: 960, y: 560, s: .99 }],
    [cs - 1.2, { x: 960, y: 610, s: 1.05 }], [ce + .9, { x: 960, y: 640, s: 1.08 }], [tSome + 2.0, { x: 960, y: 540, s: 1.0 }],
    [tAll + .7, { x: 960, y: 520, s: 1.03 }], [tLearn + 1.3, { x: 960, y: 560, s: 1.0 }], [tWell + .4, { x: 960, y: 545, s: 1.04 }],
    [tSure + .6, { x: 960, y: 520, s: 1.05 }], [tReason + 1.3, { x: 920, y: 540, s: 1.0 }], [tBio + .6, { x: 880, y: 545, s: 1.04 }],
    [tWhy + 1.3, { x: 1000, y: 530, s: 1.0 }], [tSees + 1.5, { x: 960, y: 540, s: 1.0 }], [tHidden + .6, { x: 1050, y: 540, s: 1.04 }],
    [tDay + .9, { x: 1090, y: 560, s: 1.06 }], [tClaim + 1.3, { x: 960, y: 520, s: 1.01 }], [tEnd, { x: 975, y: 510, s: 1.045 }],
  ];
  const dusk = (t) => .25 * mv(t, tToronto, 2.2) * (1 - mv(t, ce + .3, 1.6));

  // the sky scene (3.01–3.03): ground, the man, the horizon light → the ring, the hatch → the door
  const qSky = B.words(T.GW('There will be', 'after', tThere - .1));
  const iBefore = qSky.findIndex((q) => /^before/i.test(q.w));
  const qL = qSky.slice(0, iBefore + 1), qR = qSky.slice(iBefore + 1);
  qL[0].w = '“' + qL[0].w; qR[qR.length - 1].w = qR[qR.length - 1].w.replace(/[.”"]+$/, '') + '.”';
  const qSize = 76, gap = 24, qLw = measure(qL.map((q) => q.w).join(' '), qSize, true);

  function sky(ctx, t, o = {}) {
    const dy = o.dy ?? 0;
    ctx.save(); ctx.translate(0, dy);
    B.ground(ctx, GY4, 1);
    halo(ctx, 1500, GY4, 900, .16, COOL.halo, COOL.core);   // the far light washes the horizon
    halo(ctx, MANX, GY4 - MANH * .5, MANH * 1.3, .22, GOLD.halo, GOLD.hot);
    // the light far on the horizon → it rises into the ring (AS SMART AS US) → after the door opens it runs out along the horizon
    const rU = mv(t, tMachine - .6, 1.7), rc = [lerp(1500, 1440, rU), lerp(GY4 - 6, 470, rU)], rr = lerp(16, 150, sineIO(rU));
    halo(ctx, rc[0], rc[1], lerp(260, 340, rU), .3 + .05 * Math.sin(t * 1.3), COOL.halo, COOL.core);
    if (rU < .5) { halo(ctx, rc[0], rc[1], 90, .55, COOL.halo, COOL.core); ctx.fillStyle = rgba(COOL.core, .95); ctx.beginPath(); ctx.arc(rc[0], rc[1], (rr + 6) * (1 - rU), 0, TAU); ctx.fill(); }
    if (rU > 0) F.ring(ctx, t, rc[0], rc[1], rr, { a: span(rU, .1, .6), think: .6 });
    B.caps(ctx, 'AS SMART AS US', 1440, 690, 30, span(t, tSmart - .25, tSmart + .45) * (1 - span(t, tThree - .3, tThree + .2)), { align: 'center', col: COOL.text });
    const run = span(t, tLab - .2, tLab + 1.2);
    if (run > 0) F.goldSpan(ctx, [[DOOR.x + DOOR.w, GY4], [2600, GY4]], 0, sineIO(run), { w: 2.2, col: COOL, a: .9 });
    // the hatch (bunker: picture only) → it stands up as the lab door
    const hU = mv(t, tBunker - .35, .9), toDoor = mv(t, tNever - .1, 1.2);
    hatch(ctx, HATCH.x, GY4, hU * (1 - toDoor));
    labDoor(ctx, t, toDoor, span(t, tNeverW - .1, tNeverW + .6), span(t, tLocked - .05, tLocked + .9), { spill: span(t, tLab - .3, tLab + 1.3) });
    // the man, small, looking at the light
    F.ilya(ctx, t, MANX, GY4, MANH, { dir: 1, look: .55, shadow: 70, lightX: 1500 });
    F.dateTag(ctx, HATCH.x, GY4 + 60, 'SUMMER 2023', span(t, tBunker - .2, tBunker + .5) * (1 - span(t, tNever + .4, tNever + 1)), { align: 'center' });
    ctx.restore();
  }
  // the lectern side of the LINE (3.05–3.06), also the inner of the pull-back out of the hall door
  function lineLectern(ctx, t, o = {}) {
    const fade = 1 - (o.fadeLine ?? 0);
    if (fade > 0) {
      ctx.save(); ctx.globalAlpha *= fade;
      ctx.fillStyle = rgba(P.night0, .28 * span(t, tWhat - .2, tWhat + .8)); ctx.fillRect(-1200, -600, LINE.x + 1200, 2400);   // BEFORE: night
      F.divider(ctx, t, LINE.x, LINE.y0, LINE.y1, 1, { glow: 1, left: 'BEFORE', right: 'AFTER', lab: span(t, tWhat - .1, tWhat + .7), size: 34 });
      ctx.restore();
    }
    // the ? on the AFTER side; it drops into the lectern as he speaks
    const qd = mv(t, tLater - .1, 1.1);
    if (qd < 1) qMark(ctx, lerp(1440, 1400, qd), lerp(560, 600, qd), lerp(230, 40, qd), span(t, tWhatQ - .15, tWhatQ + .4), { a: 1 - span(qd, .6, 1) });
    const lu = span(t, tLater - .3, tLater + .9);
    if (lu > 0) { F.lectern(ctx, t, S.HOOK.lectern.x, S.HOOK.lectern.y, S.HOOK.lectern.h, { spot: lu, rings: span(t, tLater + .4, tLoud + .4), rise: lu }); ctx.fillStyle = rgba(GOLD.line, .18 * lu); ctx.fillRect(S.HOOK.lectern.x - 260, S.HOOK.lectern.y, 520, 3); }
  }
  // the jobs grid (3.09–3.10): SOME lights three; ALL OF IT lights every one (a cascade out from the centre)
  const SOME = [1, 6, 11], ORDER = [5, 6, 9, 10, 2, 1, 4, 7, 8, 11, 0, 3].filter((i) => !SOME.includes(i));
  function jobs(ctx, t, o = {}) {
    const all = ORDER.filter((_, k) => t >= tAll - .05 + k * .06);
    const only = [...SOME, ...all];
    F.jobsGrid(ctx, t, GRIDR, { cols: 4, rows: 3, lit: 1, only: only.length >= 12 ? null : only, sink: o.sink ?? 0 });
    const cu = 1 - span(o.sink ?? 0, 0, .3);
    B.caps(ctx, 'SOME', 960, 150, 40, span(t, tSome + .15, tSome + .7) * (1 - span(t, tAll - .45, tAll - .1)), { align: 'center', col: CREAM });
    B.caps(ctx, 'ALL OF IT', 960, 150, 44, span(t, tAll - .1, tAll + .45) * cu, { align: 'center', g: 1 });
  }
  // the warm interior seen through the hall door (fly background)
  const doorBg = (u, dawn) => (c, t, cam) => { S.stage(c, t, cam, { dawn }); const wm = 1 - u ** 4; c.fillStyle = rgba(GOLD.deep, .6 * wm); c.fillRect(0, 0, W, H); halo(c, W / 2, H / 2, W * .5, .4 * wm, GOLD.halo, GOLD.hot); };

  // 3.14–3.15 (and c05's opening): the LINE with BEFORE | AFTER, the man on the BEFORE side, ONE DAY rising on the AFTER side, the claim card
  function lineWorld(ctx, t, st) {
    if (st.ground > 0) B.ground(ctx, GY4, st.ground);
    if (st.man > 0) { halo(ctx, 560, GY4 - MANH * .5, MANH * 1.3, .2 * st.man, GOLD.halo, GOLD.hot); ctx.save(); ctx.beginPath(); ctx.rect(-2000, -1000, 6000, GY4 + 1000); ctx.clip(); F.ilya(ctx, t, 560, GY4 + (1 - expoOut(st.man)) * MANH * 1.2, MANH, { dir: 1, look: .6, shadow: 60, lightX: SUN.x }); ctx.restore(); }
    if (st.sun > 0) {   // the day rising: a gold disc out of the horizon (clipped at it), a wide warm halo, ONE DAY
      const k = expoOut(st.sun), cy = GY4 + SUN.r * 1.1 - k * SUN.r * 1.35;
      halo(ctx, SUN.x, GY4 - 20, 620 * (.6 + .4 * k), .34 * k, GOLD.halo, GOLD.hot);
      ctx.save(); ctx.beginPath(); ctx.rect(LINE.x + 4, -1000, 4000, GY4 + 1000); ctx.clip();
      ctx.fillStyle = rad(ctx, SUN.x, cy, SUN.r, [[0, GOLD.core], [.6, GOLD.hot], [1, GOLD.body]]); ctx.beginPath(); ctx.arc(SUN.x, cy, SUN.r, 0, TAU); ctx.fill();
      ctx.restore();
      F.goldSpan(ctx, [[LINE.x, GY4], [2600, GY4]], 0, 1, { w: 1.6, spark: false, a: .7 * k });
    }
    if (st.day > 0 && (st.dayA ?? 1) > 0) B.caps(ctx, 'ONE DAY', SUN.x, 640, 52, st.day * (st.dayA ?? 1), { align: 'center', g: 1 });
    if (st.line > 0) F.divider(ctx, t, LINE.x, LINE.y0, LINE.y1, st.line, { glow: 1, left: 'BEFORE', right: 'AFTER', lab: st.lab ?? 0, size: 34 });
    if (st.card > 0) {   // the claim card lands on the line
      const k = expoOut(st.card), R = { ...CLAIM, y: CLAIM.y - (1 - k) * 160 + (st.cardDy ?? 0) };
      ctx.save(); ctx.globalAlpha *= clamp(st.card * 3) * (st.cardA ?? 1); ctx.translate(R.x + R.w / 2, R.y + R.h / 2); ctx.rotate((1 - k) * -.05 + (st.cardRot ?? 0)); ctx.scale(st.cardS ?? 1, st.cardS ?? 1); ctx.translate(-R.w / 2, -R.h / 2);
      ctx.fillStyle = rgba(P.night0, .45); ctx.fillRect(12, 16, R.w, R.h);
      ctx.fillStyle = lin(ctx, 0, 0, R.w, R.h, [[0, PAPER.lit], [1, PAPER.body]]); ctx.fillRect(0, 0, R.w, R.h);
      ctx.strokeStyle = rgba(PAPER.edge, .9); ctx.lineWidth = 2; ctx.strokeRect(0, 0, R.w, R.h);
      ctx.fillStyle = mixHex(PAPER.ink, GOLD.deep, .3); ctx.fillRect(0, 0, 12, R.h);
      B.caps(ctx, 'AI WILL DO ALL THE THINGS', R.w / 2, 72, 42, span(st.card, .3, .8), { align: 'center', col: PAPER.ink, spacing: .06 });
      B.caps(ctx, 'WE CAN DO', R.w / 2, 128, 42, span(st.card, .45, .95), { align: 'center', col: PAPER.ink, spacing: .06 });
      ctx.restore();
    }
    if (st.q > 0 && (st.qA ?? 1) > 0) qMark(ctx, 1560, 470 + 6 * Math.sin(t * 1.6), 170, st.q, { a: st.qA ?? 1 });
  }
  function lineState(t) {   // the state of the LINE world at t (c05 continues from lineState(tEnd))
    const day = span(t, tDay - .15, tDay + .6);
    return {
      ground: span(t, tSees + .2, tSees + 1.2), man: span(t, tSees + .4, tSees + 1.6), line: span(t, tSees + .05, tSees + 1.1), lab: span(t, tSees + .6, tSees + 1.4),
      sun: span(t, tDay - .4, tDay + 1.6), day, card: span(t, tClaim - .1, tClaim + 1.0), q: span(t, tWord - .1, tWord + .5),
    };
  }

  const draw = (ctx, t, cam) => {
    if (t < tA || t >= tEnd) return;
    // ============================================================== 3.01–3.03 · out of the window into the sky; the hatch, the ring, the door
    const flyU = span(t, tA, tA + 2.5), skyOut = sineIO(span(t, tThree - .3, tThree + 1.3));
    if (skyOut < 1) {
      if (flyU < 1) B.fly(ctx, t, cam, OFFICE.win, flyU, (c) => office(c, t, { wall: 1, people: 1, you: 1, mon: true, thread: 1, brk: 1 }), (c) => sky(c, t), {});
      else sky(ctx, t, { dy: skyOut * 1100 });
    }
    // ============================================================== 3.04 ★ the magazine page; the gap tears open into the LINE
    const pIn = span(t, tThree - .1, tThree + 1.5), tear = span(t, tAfter - .08, tAfter + 1.25);
    if (pIn > 0 && tear < 1) {
      const dy = -(1 - sineIO(pIn)) * 1000, k = sineIO(tear), R = { ...PAGE, y: PAGE.y + dy };
      for (const side of [-1, 1]) {
        ctx.save(); ctx.globalAlpha *= 1 - span(tear, .25, .85); ctx.translate(side * k * 760, k * 60); ctx.translate(LINE.x, R.y + R.h / 2); ctx.rotate(side * k * .12); ctx.translate(-LINE.x, -R.y - R.h / 2);
        const ov = k > 0 ? 0 : 3; ctx.beginPath(); if (side < 0) ctx.rect(-3000, -3000, LINE.x + 3000 + ov, 7000); else ctx.rect(LINE.x - ov, -3000, 7000, 7000); ctx.clip();
        magazine(ctx, t, R, { head: span(t, tThree + .5, tThree + 1.3) });
        const qu = span(t, tThere - .5, tThere + .2);
        if (side < 0) B.spokenQuote(ctx, t, qL, LINE.x - gap - qLw, R.y + 290, qSize, qu, { ink: PAPER.ink, lit: PAPER.ink, maxW: 2000 });
        else B.spokenQuote(ctx, t, qR, LINE.x + gap, R.y + 290, qSize, qu, { ink: PAPER.ink, lit: PAPER.ink, maxW: 2000 });
        if (side > 0) B.caps(ctx, 'ILYA SUTSKEVER', R.x + R.w - 70, R.y + 370, 24, span(t, tThere + .6, tThere + 1.2), { align: 'right', col: PAPER.faint });
        ctx.restore();
      }
    }
    // ============================================================== 3.05–3.06 · the LINE: BEFORE | AFTER, the ?, the lectern
    const lnU = span(t, tAfter - .1, tAfter + .9), back = span(t, tToronto - .75, tToronto + 4.25);
    if (lnU > 0 && back <= 0) {
      if (t < tWhat - .2) F.divider(ctx, t, LINE.x, LINE.y0, LINE.y1, lnU, { glow: 1 });
      else lineLectern(ctx, t);
    }
    // ============================================================== 3.07–3.09 · out of the hall door; C2 from the door and back; into the door
    const inU = span(t, ce + .7, tAll + .6);
    if (back > 0 && inU < 1) {
      const outer = (c) => { hall(c, t); graduates(c, t, span(t, tGrad - .5, tGrad + .9)); };
      if (back < 1) B.fly(ctx, t, cam, HDOOR, 1 - back, outer, (c) => lineLectern(c, t, { fadeLine: span(t, tToronto - .2, tToronto + 1.2) }), { bg: (c) => doorBg(1 - back, dusk(t))(c, t, cam), edge: false, ease: EASE });
      else if (inU <= 0) outer(ctx);
      else B.fly(ctx, t, cam, HDOOR, inU, outer, (c) => jobs(c, t), { bg: (c) => doorBg(inU, dusk(t))(c, t, cam), edge: false, ease: EASE, zoom: false });
      if (inU <= 0) {
        F.dateTag(ctx, 150, 150, F.SOURCES.toronto, span(t, tToronto + .9, tToronto + 1.6) * (1 - span(t, cs - 1.4, cs - .9)));
        B.caps(ctx, 'SAME HALL AS HIS DEGREE', 150, 214, 24, span(t, tDegree - .2, tDegree + .5) * (1 - span(t, cs - 1.4, cs - .9)), { col: CREAM2 });
      }
      // C2 grows out of the hall door, and goes back into it
      const m = span(t, cs - 1.5, cs) * (1 - span(t, ce, ce + 1.1));
      if (m > 0) F.clipPlate(ctx, t, T, 'C2', { from: S.rectToScreen(cam, HDOOR), morph: m, dark: 1 - span(m, .1, .6) });
    }
    // ============================================================== 3.09–3.11 · the working figures; a figure learns, a cool copy too; ?
    const fig = mv(t, tLearn - .35, 1.1), copyU = span(t, tAI - .45, tAI + .7), toHead = mv(t, tReason - .25, 1.3);
    if (inU >= 1 && toHead < 1) {
      jobs(ctx, t, { sink: span(t, tLearn - .4, tLearn + .9) });
      B.caps(ctx, 'ANYTHING YOU CAN LEARN', 960, 170, 44, span(t, tLearn - .05, tLearn + .6) * (1 - span(toHead, 0, .35)), { align: 'center', g: .5 });
      B.ground(ctx, GY4, fig * (1 - toHead));
      const sink = expoIn(toHead);
      const hA = B.figure(ctx, t, 700, GY4, 420, { u: fig, sink, top: .8, topCol: GOLD, glow: .28, glowCol: GOLD, fig: { dir: 1, look: .45, armR: [.9, 1.6], rim: GOLD.line } });
      // the copy: same pose, cool light (it rises out of the ground)
      if (copyU > 0) {
        const k = expoOut(copyU), yy = GY4 + (1 - k) * 420 * 1.15 + sink * 480;
        ctx.save(); ctx.beginPath(); ctx.rect(0, -500, W * 2, GY4 + 500); ctx.clip();
        B.topLight(ctx, 1220, GY4, 420, .8 * k * (1 - sink), COOL);
        const hB = B.coolFigure(ctx, t, 1220, yy, 420, { dir: -1, look: .45, armR: [.9, 1.6], a: clamp(copyU * 2) });
        ctx.restore();
        const pu = span(t, tAI - .1, tWell + .05);
        if (hB && pu < 1) sheet(ctx, lerp(1400, hB.R[0], sineIO(pu)), lerp(240, hB.R[1] - 20, sineIO(pu)), 70, (1 - pu) * .6, clamp(pu * 4) * (1 - sink));
        if (hB) tool(ctx, hB.R[0], hB.R[1], .35, 110, COOL, span(t, tWell - .05, tWell + .4) * (1 - sink));
      }
      if (hA) {
        const pu = span(t, tLearn + .05, tLearnW + .05);
        if (pu < 1) sheet(ctx, lerp(520, hA.R[0], sineIO(pu)), lerp(240, hA.R[1] - 20, sineIO(pu)), 70, (1 - pu) * -.6, clamp(pu * 4) * (1 - sink));
        tool(ctx, hA.R[0], hA.R[1], -.35, 110, GOLD, span(t, tLearnW - .05, tLearnW + .4) * (1 - sink));
      }
      // 3.11 the ? over the two (it flies on into the head)
      const qU = span(t, tSure - .1, tSure + .5);
      if (qU > 0) qMark(ctx, lerp(960, 690, toHead), lerp(420, 470, toHead), lerp(220, 60, toHead), qU, { a: 1 - span(toHead, .5, 1) });
    }
    // ============================================================== 3.12–3.13 · the head with gold nodes; the network copies into the chip
    const headU = mv(t, tReason - .3, 1.3), headOut = mv(t, tSees - .1, 1.6), chipU = span(t, tWhy - .15, tWhy + 1.1), copy = (i) => span(t, tWhy + .2 + i * .04, tWhy + .9 + i * .04);
    const toRing = mv(t, tSees + .1, 1.5);
    if (headU > 0 && headOut < 1) {
      const hx = -headOut * 900, ha = 1 - span(headOut, .5, 1);
      ctx.save(); ctx.translate(hx, (1 - expoOut(headU)) * 700); ctx.globalAlpha *= ha;
      halo(ctx, HEAD.x - 30, HEAD.y - HEAD.h * .6, HEAD.h * .9, .2, GOLD.halo, GOLD.hot);
      headPath(ctx, HEAD.x, HEAD.y, HEAD.h);
      ctx.fillStyle = lin(ctx, HEAD.x - 300, 0, HEAD.x + 260, 0, [[0, mixHex(P.night0, P.ind1, .4)], [1, mixHex(P.ind1, P.blue1, .45)]]); ctx.fill();
      ctx.strokeStyle = rgba(GOLD.line, .85); ctx.lineWidth = 3; ctx.stroke();
      network(ctx, t, headNode, (i) => span(t, tReason + .25 + i * .07, tReason + .65 + i * .07));
      B.caps(ctx, 'BIOLOGICAL COMPUTER', HEAD.x, HEAD.y + 70, 36, span(t, tBio - .2, tBio + .5), { align: 'center', g: 1 });
      ctx.restore();
    }
    if (chipU > 0 && toRing < 1) {
      const c = { ...CHIP, x: lerp(CHIP.x, SUN.x, toRing), y: lerp(CHIP.y, 470, toRing), s: CHIP.s * (1 - .3 * toRing) }, ca = 1 - span(toRing, .2, .8);
      chip(ctx, t, c, chipU, ca);
      // the copies: each node flies from the head into the chip (cool)
      ctx.save(); ctx.globalAlpha *= ca;
      network(ctx, t, (i) => { const u = copy(i); if (u <= 0) return null; const a = headNode(i), b = chipNode(i, c), k = sineIO(u); return [lerp(a[0] - headOut * 900, b[0], k), lerp(a[1], b[1], k) - Math.sin(k * Math.PI) * 120]; }, (i) => copy(i), { col: COOL });
      ctx.restore();
      B.caps(ctx, 'DIGITAL', c.x, c.y + c.s / 2 + 80, 36, span(t, tDigital - .2, tDigital + .5) * (1 - span(toRing, 0, .3)), { align: 'center', col: COOL.text });
    }
    // ============================================================== 3.14–3.15 · the LINE: the ring crumbles, ONE DAY rises; the claim card
    if (t >= tSees - .1) {
      const st = lineState(t);
      lineWorld(ctx, t, st);
      if (toRing > 0) {
        const cr = span(t, tHidden - .1, tHidden + 1.7);
        if (cr < 1) F.ring(ctx, t, SUN.x, 470, 150 * (.7 + .3 * toRing), { a: span(toRing, .2, .8), crumble: cr, think: .6 });
        B.caps(ctx, 'NOT A HIDDEN MACHINE', SUN.x, 700, 30, span(t, tHidden - .05, tHidden + .5) * (1 - span(t, tDay - .3, tDay + .2)), { align: 'center', col: CREAM2 });
      }
    }
  };
  return { keys, draw, dawn: dusk, lineWorld, lineState, times: { tEnd, tClaim, tDay } };
}
