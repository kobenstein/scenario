// c03 · What's inside the bubble: data centers · Powell (C1) · spend vs. pay · debt 2 → 10 ¢ · China · costs nothing
// T.G('Mostly, data centers') → T.G('Day thirty-one') · builder B1 · plan docs/shots.md 3.01–3.11.
// ONE entry, one world: the inside of the bubble (the data-center hall under a night sky), seen by one 2D camera on word keys.
// | ID    | anchor                       | picture                                                      | moves                   |
// | 3.01★ | data centers                 | plateBubble → pull back off the skin: the hall, cranes, truck | pull back · crane swing |
// | 3.02  | spend more                   | four money stacks grow in turn (2023 … 2026)                  | stacks                  |
// | 3.03  | central banker · sudden drop | the crane stops; one hall window grows into the press stage   | stop · window           |
// | 3.04  | (C1)                         | Powell plays in the window; it grew from the stage's backdrop  | slow push               |
// | 3.05  | unlike the dot-coms · profits| two columns rise: IDEAS (hollow), PROFITS (gold)              | column · column         |
// | 3.06  | customers pay · fraction     | the columns tip into a scale beam; it tips left               | morph · tip             |
// | 3.07  | borrowed money               | IOU slips slide under the left pan                            | slips                   |
// | 3.08  | two cents · took ten         | the slips roll up into a coin of 100 cells: 2 → 10 cool       | cells                   |
// | 3.09  | slowdown · either way        | the coin slides aside, the cranes slow, a calendar flips DUE  | cranes · calendar       |
// | 3.10  | already burst · forty percent| pull back through the skin: China's bubble pops, its line falls| pull back · pop         |
// | 3.11  | pops here · costs nothing    | our bubble trembles; the HUD umbrella grows, gore 1 = $0;     | umbrella · drop         |
// |       |                              | gore 1 drops and becomes your phone's lit screen (flood)      |                         |
import { Path2D } from '@napi-rs/canvas';
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f19_kit.mjs';
import * as PR from '../lib/f19_props.mjs';
import { plateBubble, seamWindow, SEAM_HALF, hallRows, HALL, BUBBLE_PLATE } from '../lib/f19_seams.mjs';
import { cam2At, camLive, withCam, toScr, riseText, SRC, LBL, huds, night, screenFlood, FLOOD, clipVeil, clipWin, vWin } from '../lib/f19_b1_set.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, quartIO, expoOut, expoIn, lin, rad, halo, prng } = E;
// E.glowFill sets globalAlpha absolutely; this local one respects the alpha already in effect (fades fade the glow too)
const glowFill = (ctx, p, b, a, col) => E.glowFill(ctx, p, b, a * ctx.globalAlpha, col);
const { RED, COOL } = F;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = R.a - 1, n = 0) => T.G(p, n, after), GE = (p, after = R.a - 1) => T.GE(p, 0, after);
  const a = { T0: R.a, end: R.b };
  a.dc = G('data centers'); a.spend = G('spend more'); a.banker = G('central banker'); a.drop = G('sudden drop');
  a.c1 = T.clip('C1'); a.dot = G('unlike the dot-coms'); a.profits = G('real profits'); a.pay = G('customers pay'); a.fraction = G('fraction', a.pay);
  a.borrowed = G('borrowed money'); a.ratings = G('good credit ratings'); a.two = G('two cents'); a.ten = G('took ten');
  a.slow = G('slowdown'); a.either = G('either way'); a.reuters = G('Reuters'); a.burst = G('already burst'); a.forty = G('forty percent');
  a.pops = G('pops here'); a.nothing = G('costs nothing');
  return [{ t: R.a, draw: scene(T, a), print: F.PRINT19 }];
};

// ===================================================================================================== the world inside the bubble
const B = BUBBLE_PLATE;                                   // the bubble (world coords = plate coords at camera s 1)
const GY = 650;                                           // the ground line in front of the hall
const HB = { x0: 90, x1: 1830, y0: 395 };                 // the hall body around HALL's window rows
const CR = [{ x: -130, h: 730, jib: 760, dir: 1, ph: 0 }, { x: 2050, h: 735, jib: 640, dir: -1, ph: 2 }];
const STACKS = [1290, 1420, 1550, 1680].map((x, i) => ({ x, h: [110, 160, 225, 310][i], year: String(2023 + i) }));
const SY = 800;                                           // ground line of the explainer objects (in front of the hall)
const COL = [{ x: 780, label: 'DOT-COM: IDEAS' }, { x: 1140, label: 'TODAY: PROFITS' }];
const COLH = 330, COLW = 110;
const PIV = { x: 960, y: 450 }, HALF = 270;
const COIN = { x: 690, y: 600, r: 230 };
const CHINA = { x: 1450, y: 330, r: 150 };

function hallBody(ctx, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  ctx.fillStyle = lin(ctx, 0, HB.y0, 0, GY, [[0, mixHex(P.night1, P.ind1, .55)], [1, mixHex(P.night0, P.ind0, .6)]]);
  ctx.fillRect(HB.x0, HB.y0, HB.x1 - HB.x0, GY - HB.y0);
  for (let x = HB.x0 + 120; x < HB.x1 - 80; x += 260) { ctx.fillRect(x, HB.y0 - 26, 120, 26); ctx.fillStyle = rgba(COOL.edge, .25); ctx.fillRect(x, HB.y0 - 27, 120, 2); ctx.fillStyle = mixHex(P.night1, P.ind1, .55); }
  ctx.fillStyle = rgba(COOL.mid, .35); ctx.fillRect(HB.x0, HB.y0, HB.x1 - HB.x0, 2);
  ctx.restore();
}
function ground(ctx, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 900, [[0, mixHex(P.ind0, P.blue1, .25)], [.3, mixHex(P.night1, P.ind0, .5)], [1, P.night0]]);
  ctx.fillRect(-2600, GY, 7200, 3000);
  ctx.fillStyle = rgba(COOL.edge, .18); ctx.fillRect(-2600, GY, 7200, 2);
  ctx.restore();
}
// the hall's light (the hero of 3.01): brighter window rows + a cool glow on the ground
function hallLight(ctx, t, k) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= k;
  halo(ctx, 960, 560, 1050, .16, COOL.edge, COOL.mid);
  HALL.rows.forEach((y, r) => { for (let x = HALL.x0, i = 0; x < HALL.x1; x += HALL.step, i++) { const fl = .75 + .25 * Math.sin(t * 1.3 + i * 1.7 + r); ctx.fillStyle = rgba(COOL.core, .55 * fl); ctx.fillRect(x, y, HALL.w, HALL.h); } });
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 120, [[0, rgba(COOL.mid, .16)], [1, rgba(COOL.mid, 0)]]); ctx.fillRect(HB.x0 - 100, GY, HB.x1 - HB.x0 + 200, 120);
  ctx.restore();
}
// a tower crane in side view: lattice tower, jib (its apparent length = slewing), trolley, cable, hook with a crate
function crane(ctx, t, c, slew, hook, drop) {
  const top = GY - c.h, L = c.jib * Math.cos(slew), tx = c.x + c.dir * L * .82;
  ctx.save(); ctx.strokeStyle = mixHex(P.ind1, P.blue1, .5); ctx.lineWidth = 6; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(c.x - 16, GY); ctx.lineTo(c.x - 16, top); ctx.moveTo(c.x + 16, GY); ctx.lineTo(c.x + 16, top); ctx.stroke();
  ctx.lineWidth = 2.5; ctx.beginPath(); for (let y = GY; y > top; y -= 40) { ctx.moveTo(c.x - 16, y); ctx.lineTo(c.x + 16, y - 40); } ctx.stroke();
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(c.x - c.dir * 180 * Math.cos(slew), top); ctx.lineTo(c.x + c.dir * L, top); ctx.stroke();
  ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(c.x, top - 70); ctx.lineTo(c.x + c.dir * L, top); ctx.moveTo(c.x, top - 70); ctx.lineTo(c.x - c.dir * 180 * Math.cos(slew), top); ctx.stroke();
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .4); ctx.fillRect(c.x - c.dir * 180 * Math.cos(slew) - 30, top - 6, 60, 40);
  ctx.fillStyle = rgba(COOL.core, .8); ctx.beginPath(); ctx.arc(c.x, top - 70, 4, 0, 7); ctx.fill();   // the tower light
  halo(ctx, c.x, top - 70, 22, .35 + .2 * Math.sin(t * 3 + c.ph), COOL.edge, COOL.core);
  // cable + hook + crate (pendulum from the trolley)
  const len = drop, hx = tx + Math.sin(hook) * len, hy = top + Math.cos(hook) * len;
  ctx.strokeStyle = rgba(COOL.mid, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(tx, top); ctx.lineTo(hx, hy); ctx.stroke();
  if (len > 20) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-hook * .6); ctx.fillStyle = mixHex(P.ind1, P.blue1, .55); ctx.fillRect(-34, 0, 68, 44); ctx.strokeStyle = rgba(COOL.edge, .6); ctx.lineWidth = 2; ctx.strokeRect(-34, 0, 68, 44); ctx.restore(); }
  ctx.restore();
}
function truck(ctx, t, x) {
  ctx.save(); ctx.translate(x, GY + 70);
  ctx.fillStyle = mixHex(P.ind1, P.blue1, .35); ctx.fillRect(-90, -56, 130, 50); ctx.fillRect(44, -40, 46, 34);
  ctx.fillStyle = rgba(COOL.mid, .8); ctx.font = '600 14px Inter'; ctx.fillText('CHIPS', -70, -26);
  ctx.fillStyle = P.night0; for (const wx of [-60, 10, 66]) { ctx.beginPath(); ctx.arc(wx, -4, 12, 0, 7); ctx.fill(); }
  halo(ctx, 92, -24, 30, .5, P.halo0);
  ctx.restore();
}
function powerLine(ctx, t) {
  ctx.save(); ctx.strokeStyle = mixHex(P.ind1, P.blue1, .35); ctx.lineWidth = 4;
  const M = [[2010, 380], [2360, 300], [2700, 250]];
  for (const [x, top] of M) { ctx.beginPath(); ctx.moveTo(x - 30, GY); ctx.lineTo(x, top); ctx.lineTo(x + 30, GY); ctx.moveTo(x - 40, top + 30); ctx.lineTo(x + 40, top + 30); ctx.stroke(); }
  ctx.strokeStyle = rgba(COOL.mid, .35); ctx.lineWidth = 1.5;
  for (const dy of [30, 36]) { ctx.beginPath(); ctx.moveTo(1990, 470); for (const [x, top] of M) ctx.quadraticCurveTo(x - 190, top + dy + 60, x, top + dy); ctx.stroke(); }
  ctx.restore();
}
function moneyStack(ctx, t, s, u) {
  if (u <= 0) return;
  const h = s.h * expoOut(u), n = Math.max(1, Math.round(h / 22));
  ctx.save();
  const p = new Path2D(); p.rect(s.x - 46, SY - h, 92, h);
  glowFill(ctx, p, 22, .35 * clamp(u * 3), P.halo0);
  for (let i = 0; i < n; i++) { const y = SY - (i + 1) * (h / n); ctx.fillStyle = lin(ctx, s.x - 46, 0, s.x + 46, 0, [[0, P.halo1], [.5, P.core1], [1, P.halo1]]); ctx.fillRect(s.x - 46, y + 2, 92, h / n - 3); ctx.fillStyle = rgba(P.shade0, .7); ctx.fillRect(s.x - 8, y + 2, 16, h / n - 3); }
  ctx.restore();
}
// a column of the 3.05 comparison, as a rect with length L along its axis, thickness th, angle ang (0 = upright), centre (cx, cy)
function bar(ctx, cx, cy, L, th, ang, style, a = 1) {
  ctx.save(); ctx.globalAlpha *= a; ctx.translate(cx, cy); ctx.rotate(ang);
  const p = new Path2D(); p.roundRect(-th / 2, -L / 2, th, L, 6);
  if (style.fill > 0) { glowFill(ctx, p, 30, .45 * style.fill, P.halo0); ctx.globalAlpha *= style.fill; ctx.fillStyle = lin(ctx, -th / 2, 0, th / 2, 0, [[0, P.halo1], [.45, P.core1], [1, P.halo0]]); ctx.fill(p); ctx.globalAlpha /= style.fill; }
  if (style.line > 0) { ctx.strokeStyle = rgba(P.halo0, .9 * style.line); ctx.lineWidth = 4; ctx.setLineDash([]); ctx.stroke(p); }
  ctx.restore();
}
function register(ctx, x, y, s) {   // the cash register (WHAT CUSTOMERS PAY), (x, y) = its foot centre
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const body = new Path2D(); body.moveTo(-50, 0); body.lineTo(50, 0); body.lineTo(40, -50); body.lineTo(-40, -50); body.closePath();
  glowFill(ctx, body, 18, .4, P.halo0);
  ctx.fillStyle = lin(ctx, 0, -50, 0, 0, [[0, P.core1], [1, P.halo1]]); ctx.fill(body);
  ctx.fillStyle = P.halo1; ctx.fillRect(-20, -74, 40, 26); ctx.fillStyle = P.night1; ctx.fillRect(-15, -70, 30, 14);
  ctx.fillStyle = rgba(P.shade0, .8); for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) ctx.fillRect(-30 + j * 16, -42 + i * 11, 10, 6);
  ctx.restore();
}
function hallBlock(ctx, x, y, s) {   // a piece of the hall on the left pan (cool)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const p = new Path2D(); p.rect(-90, -84, 180, 84);
  glowFill(ctx, p, 26, .45, COOL.edge);
  ctx.fillStyle = mixHex(P.ind1, P.night1, .4); ctx.fill(p);
  ctx.fillStyle = COOL.core; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) ctx.fillRect(-78 + c * 34, -74 + r * 26, 22, 10);
  ctx.restore();
}
function pan(ctx, x, y) { ctx.save(); ctx.strokeStyle = rgba(P.halo0, .8); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x - 110, y); ctx.quadraticCurveTo(x, y + 34, x + 110, y); ctx.stroke(); ctx.restore(); }
function coin100(ctx, t, x, y, r, grow, cool) {   // 100 cells inside a coin: gold = all new bond dollars; cool = what the AI firms took
  if (grow <= 0) return;
  const R = r * expoOut(grow);
  ctx.save();
  const disc = new Path2D(); disc.arc(x, y, R, 0, 7);
  glowFill(ctx, disc, R * .35, .45, P.blue0); glowFill(ctx, disc, R * .1, .55, P.halo0);
  ctx.fillStyle = rad(ctx, x, y, R, [[0, mixHex(P.ind2, P.blue1, .4)], [1, P.ind1]]); ctx.fill(disc);
  ctx.strokeStyle = P.halo0; ctx.lineWidth = Math.max(2, R * .035); ctx.stroke(disc);
  ctx.strokeStyle = rgba(P.halo1, .5); ctx.lineWidth = Math.max(1, R * .012); ctx.beginPath(); ctx.arc(x, y, R * .9, 0, 7); ctx.stroke();
  const side = R * 1.22, cs = side / 10, g = cs * .16, x0 = x - side / 2, y0 = y - side / 2;
  for (let i = 0; i < 100; i++) {
    const k = clamp(grow * 1.8 - .8 - Math.floor(i / 10) * .02); if (k <= 0) continue;
    const cx = x0 + (i % 10) * cs + g / 2, cy = y0 + Math.floor(i / 10) * cs + g / 2, cl = clamp(cool(i));
    ctx.fillStyle = mixHex(mixHex(P.halo0, P.core1, .4), COOL.mid, cl); ctx.globalAlpha = k;
    ctx.fillRect(cx, cy, cs - g, cs - g);
    if (cl > 0) { ctx.globalAlpha = k * cl; halo(ctx, cx + (cs - g) / 2, cy + (cs - g) / 2, cs * 1.3, .35, COOL.edge, COOL.core); }
  }
  ctx.restore();
}
function calendar(ctx, t, x, y, s, flips) {   // a standing tear-off calendar, every leaf says DUE; flips = how many leaves have gone (float)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 170, h = 200;
  const leaf = (dx, dy, rot, a, n) => {
    ctx.save(); ctx.translate(dx, dy); ctx.rotate(rot); ctx.globalAlpha *= a;
    const p = new Path2D(); p.roundRect(-w / 2, -h, w, h, 8);
    ctx.fillStyle = lin(ctx, 0, -h, 0, 0, [[0, '#f7efd2'], [1, '#e3d3a8']]); ctx.fill(p);
    ctx.fillStyle = COOL.edge; ctx.fillRect(-w / 2, -h, w, 44);
    ctx.fillStyle = P.cream; ctx.font = '600 18px Inter'; ctx.textAlign = 'center'; ctx.letterSpacing = '0.14em'; ctx.fillText(`PAYMENT ${n}`, 0, -h + 29); ctx.letterSpacing = '0px';
    ctx.fillStyle = '#3a3550'; ctx.font = '78px "Instrument Serif"'; ctx.fillText('DUE', 0, -42);
    ctx.restore();
  };
  const glow = new Path2D(); glow.roundRect(-w / 2, -h, w, h, 8); glowFill(ctx, glow, 24, .45, P.halo0);
  const k = Math.floor(flips), f = flips - k;
  leaf(0, 0, 0, 1, k + 2);
  if (f > 0) leaf(f * 60, f * f * 260, f * 1.2, 1 - smooth(span(f, .6, 1)), k + 1);   // the leaf that goes: peels to the right and falls
  else leaf(0, 0, 0, 1, k + 1);
  ctx.restore();
}

function scene(T, a) {
  const T0 = a.T0, Tend = a.end, open1 = T0 + SEAM_HALF;
  const c1 = a.c1;
  // camera keys (world point at the frame centre, zoom)
  const WIDE = { x: 960, y: 470, s: .78 };
  const K = [
    [open1, { x: 960, y: 540, s: 1 }],
    [a.dc + 1.4, WIDE],                                                      // 3.01 pull back off the skin
    [a.spend + 1.2, { x: 1080, y: 500, s: .84 }],                             // 3.02 a slow truck to the stacks
    [a.drop - .2, { x: 990, y: 480, s: .8 }],                                 // 3.03 back to the hall
    [a.c1.end + .25, { x: 988, y: 488, s: .805 }],                            // (window, clip: breathing; the stage closes)
    [a.pay + .6, { x: 955, y: 565, s: .92 }],                                  // 3.05 → 3.06: the columns, the scale
    [a.borrowed - .2, { x: 900, y: 590, s: .95 }],                            // 3.07 the IOUs
    [a.ratings - .9, { x: 820, y: 600, s: 1.18 }],                            // 3.08 push to the coin
    [a.ten + .9, { x: 830, y: 600, s: 1.22 }],
    [a.slow + 1.0, WIDE],                                                    // 3.09 back to the wide hall
    [a.reuters - .7, { x: 980, y: 480, s: .76 }],
    [a.burst - .1, { x: 1900, y: 1150, s: .26 }],                             // 3.10 out through the skin
    [a.pops, { x: 1880, y: 1140, s: .265 }],
    [Tend, { x: 1860, y: 1130, s: .27 }],
  ];
  // crane slewing: speed piecewise (stops on "sudden drop", restarts after the clip, slows on "slowdown"); integrated numerically once
  const omega = (t) => { if (t < a.drop) return .22; if (t < a.drop + .35) return .22 * (1 - smooth(span(t, a.drop, a.drop + .35))); if (t < a.c1.end + .3) return 0; if (t < a.slow) return .22 * smooth(span(t, a.c1.end + .3, a.c1.end + 1.8)); return lerp(.22, .05, smooth(span(t, a.slow, a.slow + 1.4))); };
  const SL = []; { let v = 0; for (let t = T0; t <= Tend + .1; t += 1 / 60) { SL.push(v); v += omega(t) / 60; } }
  const slewAt = (t) => SL[Math.max(0, Math.min(SL.length - 1, Math.round((t - T0) * 60)))];
  const hookAt = (t, ph) => { const base = .05 * Math.sin(t * 1.9 + ph); const kick = t > a.drop ? .16 * Math.exp(-(t - a.drop) * 1.1) * Math.sin((t - a.drop) * 4.2) : 0; return base + kick; };
  // the window that grows into the press stage: a hall window near the centre (row 1, column 13)
  const winW = { x: HALL.x0 + HALL.step * 13, y: HALL.rows[1], w: HALL.w, h: HALL.h };
  const STAGE = { x: 300, y: 96, w: 1320, h: 742 };
  const stageOpen = (t) => sineIO(span(t, a.drop + .05, a.drop + 1.9)) * (1 - sineIO(span(t, c1.end + .62, c1.end + 2.3)));
  const backdrop = (r) => ({ x: r.x + r.w * .33, y: r.y + r.h * .16, w: r.w * .34, h: r.h * .3 });
  const clipRect = (t) => { const k = 1 + .035 * sineIO(span(t, c1.start, c1.end)); return { x: W / 2 - STAGE.w * k / 2, y: STAGE.y + STAGE.h / 2 - STAGE.h * k / 2, w: STAGE.w * k, h: STAGE.h * k }; };
  const dimAt = (t) => .62 * smooth(span(t, a.dot - .6, a.dot + .2)) * (1 - smooth(span(t, a.slow + .2, a.slow + 1.4)));

  return (ctx, t) => {
    if (seamWindow(t, T0)) { plateBubble(ctx, t); huds(ctx, t, T); return; }
    const rev = smooth(span(t, open1, open1 + 1.5));                    // the film thins: the hall, the ground, the light come through
    const c = camLive(cam2At(t, K), t, rev * (1 + 1.5 * smooth(span(t, a.c1.end, a.c1.end + 1)) * (1 - smooth(span(t, a.pay, a.pay + 1)))));
    night(ctx, t);
    // ------------------------------------------------------------------ outside the bubble: the route map lies faint below (3.10 on)
    const out = smooth(span(t, a.reuters - .4, a.burst + .2));
    if (out > 0) { const [, ry] = toScr(c, 960, 2050); F.routeMap(ctx, t, { u: 1, stops: [1, 1, 1, 1], names: [0, 0, 0, 0], dot: 30, a: .26 * out, y: Math.max(940, ry) }); }
    // ------------------------------------------------------------------ inside the bubble
    const trem = .2 * (1 - rev) + .55 * Math.exp(-Math.max(0, t - a.pops) * 1.4) * (t > a.pops ? 1 : 0);
    withCam(ctx, c, () => {
      const skin = new Path2D(); skin.arc(B.x, B.y, B.r, 0, 7);
      ctx.save(); ctx.clip(skin);
      ctx.fillStyle = rgba(COOL.deep, .08 * rev); ctx.fillRect(-2000, -2000, 6000, 6000);
      // the cranes stand behind the hall
      CR.forEach((cr, i) => {
        const drop = lerp(0, 330 + i * 60, smooth(span(t, open1 + .3, open1 + 2.4)));
        crane(ctx, t, cr, .35 + slewAt(t) * (i ? -1 : 1) + i, hookAt(t, cr.ph), drop);
      });
      powerLine(ctx, t);
      ground(ctx, rev);
      hallBody(ctx, t, rev);
      hallRows(ctx, t, .9);
      hallLight(ctx, t, rev * (1 - .5 * dimAt(t)));
      truck(ctx, t, -160 + (t - T0) * 14);
      // 3.02 the money stacks
      STACKS.forEach((s, i) => { const t0 = a.spend - 1.3 + i * .55; moneyStack(ctx, t, s, span(t, t0, t0 + .8)); riseText(ctx, s.year, s.x, SY + 44, t, t0 + .15, { size: 28, weight: 600, align: 'center', col: P.halo2, glow: false }); });
      // the explainer plane sits on a dimmed hall (a light change, nothing fades)
      const dim = dimAt(t);
      if (dim > 0) { ctx.fillStyle = rgba(P.night0, dim); ctx.fillRect(-2000, -2000, 6000, 6000); }
      explainers(ctx, t);
      ctx.restore();
      // the film of our bubble (on top of its inside)
      F.bubble(ctx, t, B.x, B.y, B.r, { tremble: trem });
    });
    // the flight back out through the skin: the film passes over the frame once
    const passK = Math.exp(-(((c.s - .52) / .1) ** 2)) * (t > a.reuters - 1 ? 1 : 0);
    if (passK > .01) F.skinFlood(ctx, t, .3 * passK);
    if (rev < 1) F.skinFlood(ctx, t, .55 * (1 - rev));
    // ------------------------------------------------------------------ 3.03–3.05 the press stage window, Powell inside it
    const so = stageOpen(t);
    let clipOpen = 0;
    if (so > 0) {
      const from = (() => { const [x, y] = toScr(c, winW.x, winW.y); return { x, y, w: winW.w * c.s, h: winW.h * c.s }; })();
      const r = vWin(ctx, t, STAGE, so, (cx, rr) => pressStage(cx, t, rr, 'FEDERAL RESERVE · OCT 29, 2025'), { from, mat: .9 });
      if (r) clipOpen = smooth(span(t, c1.start - .6, c1.start)) * (1 - smooth(span(t, c1.end, c1.end + .6)));
      if (clipOpen > 0) clipWin(ctx, t, T, 'C1', clipRect(t), { from: backdrop(STAGE) });
    }
    // ------------------------------------------------------------------ 3.10 China's bubble (screen space, outside ours)
    chinaBubble(ctx, t);
    // ------------------------------------------------------------------ 3.11 the umbrella grows out of the HUD; gore 1 = $0; gore 1 drops → the flood
    const up = quartIO(span(t, a.nothing - .35, a.nothing + .9)), back = quartIO(span(t, Tend - 1.5, Tend - .3));
    const dropU = span(t, Tend - 1.6, Tend - .14);
    if (dropU > 0 && t < Tend - .14) {
      // the panel that drops: from gore 1 of the big umbrella down to the phone, growing until it is the whole frame (area grows evenly)
      const [hx, hy] = F.hudGoreCenter(0), U = F.HUD_UMB, gx = 960 + (hx - U.x) * 300 / U.r, gy = 470 + (hy - U.y) * 300 / U.r;
      const e = quartIO(dropU), q = Math.sqrt(smooth(dropU));
      const cx = lerp(gx, 960, e), cy = lerp(gy, 540, e) + Math.sin(Math.PI * e) * 120;
      const w = lerp(150, FLOOD.w, q), h = lerp(108, FLOOD.h, q);
      screenFlood(ctx, t, { x: cx - w / 2, y: cy - h / 2, w, h });
    }
    let umbDrawn = false;
    if (up > 0 && back < 1) {
      const k = up * (1 - back), U = F.HUD_UMB, x = lerp(U.x, 960, k), y = lerp(U.y, 470, k), r = lerp(U.r, 300, k);
      const hum = .5 + .5 * Math.sin(t * 17);
      const lit0 = dropU > 0 ? 0 : smooth(span(t, a.nothing, a.nothing + .3)) * (.75 + .25 * hum);
      const g = F.umbrella(ctx, t, x, y, r, { open: 1, lit: [lit0, 0, 0, 0, 0], outline: .55, glow: .7 + .3 * k });
      umbDrawn = true;
      if (dropU <= 0 && lit0 > 0) { const [gx, gy] = g.gore(0); riseText(ctx, '$0', gx, gy + r * .12, t, a.nothing + .1, { size: Math.round(lerp(20, 74, k)), serif: true, align: 'center', col: P.night1, glow: false }); }
    }
    if (t >= Tend - .14) screenFlood(ctx, t, FLOOD);
    // ------------------------------------------------------------------ HUDs (hidden only inside the clip window; the umbrella is the big one while it is out)
    huds(ctx, t, T, { umb: umbDrawn ? 0 : 1 - clipOpen, day: 1 - clipOpen });
  };

  function explainers(ctx, t) {
    // 3.05 two columns rise from the ground; 3.06 they tip into the beam of a scale; 3.07 IOUs; 3.08 the coin
    const m = quartIO(span(t, a.pay - 1.0, a.pay + .35));                                  // columns → beam
    const sink = smooth(span(t, a.ratings - 3.4, a.ratings - 2.2));                         // the scale sinks away while the coin forms
    const tip = lerp(-.04, -.21, quartIO(span(t, a.fraction - .15, a.fraction + .9))) + .012 * Math.sin(t * 1.3);
    const colU = [span(t, a.dot - .1, a.dot + .75), span(t, a.profits - .1, a.profits + .75)];
    if (colU[0] > 0 && sink < 1) {
      ctx.save(); ctx.beginPath(); ctx.rect(-3000, -3000, 9000, 3000 + SY); ctx.clip(); ctx.translate(0, sink * 760);
      // the post rises under the pivot as the columns tip
      const post = expoOut(span(t, a.pay - .9, a.pay + .3));
      if (post > 0) { ctx.fillStyle = lin(ctx, PIV.x - 10, 0, PIV.x + 10, 0, [[0, P.halo1], [.5, P.core1], [1, P.halo1]]); ctx.fillRect(PIV.x - 9, lerp(SY, PIV.y, post), 18, (SY - PIV.y) * post); ctx.fillRect(PIV.x - 70, SY - 10, 140, 10 * post); }
      COL.forEach((col, i) => {
        const u = expoOut(colU[i]); if (u <= 0) return;
        const h = COLH * u, sx = i ? 1 : -1;
        const c0 = { x: col.x, y: SY - h / 2, L: h, th: COLW, ang: 0 };
        const half = { x: PIV.x + sx * HALF / 2, y: PIV.y, L: HALF, th: 18, ang: Math.PI / 2 };
        let cx = lerp(c0.x, half.x, m), cy = lerp(c0.y, half.y, m);
        const ang = lerp(0, half.ang, m) * (i ? -1 : 1) + tip * m;
        if (m > 0) { const dx = cx - PIV.x, dy = cy - PIV.y, ct = Math.cos(tip * m), st = Math.sin(tip * m); cx = PIV.x + dx * ct - dy * st; cy = PIV.y + dx * st + dy * ct; }
        bar(ctx, cx, cy, lerp(c0.L, half.L, m), lerp(c0.th, half.th, m), ang, { fill: i ? 1 : m, line: i ? 0 : 1 });
        // labels on the columns (sink when the columns tip)
        riseText(ctx, col.label, col.x, SY - COLH - 34, t, (i ? a.profits : a.dot) + .05, { ...LBL, align: 'center', out: a.pay - 1.1 });
      });
      riseText(ctx, 'POWELL, OCT 29, 2025', 960, SY + 50, t, a.profits + .5, { ...SRC, align: 'center', out: a.pay - 1.1 });
      if (m >= 1) {
        // pans hang from the beam ends; left: a piece of the hall (cool) · right: the register (WHAT CUSTOMERS PAY)
        const ends = [-1, 1].map((sx) => [PIV.x + sx * HALF * Math.cos(tip), PIV.y + sx * HALF * Math.sin(tip)]);
        const hang = expoOut(span(t, a.pay - .2, a.pay + .5)) * 150;
        ends.forEach(([ex, ey]) => { ctx.strokeStyle = rgba(P.halo0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex - 90, ey + hang); ctx.moveTo(ex, ey); ctx.lineTo(ex + 90, ey + hang); ctx.stroke(); pan(ctx, ex, ey + hang); });
        const lift = expoOut(span(t, a.pay - .05, a.pay + .8)), [lx, ly] = ends[0], [rx, ry] = ends[1];
        hallBlock(ctx, lerp(560, lx, lift), lerp(470, ly + hang + 10, lift), lerp(.6, 1, lift));
        const rl = expoOut(span(t, a.pay + .25, a.pay + 1.05));
        if (rl > 0) register(ctx, rx, lerp(ry + hang + 520, ry + hang + 10, rl), 1.15);
        riseText(ctx, 'WHAT CUSTOMERS PAY', rx + 40, ry + hang + 80, t, a.pay + .35, { ...LBL, size: 30, align: 'center', out: a.ratings - 3.4 });
      }
      ctx.restore();
    }
    // 3.07 the IOU slips slide in from the left under the left pan; 3.08 they roll up into the coin
    const roll = span(t, a.ratings - 3.4, a.ratings - 2.0);
    const stack = [];
    for (let i = 0; i < 7; i++) {
      const t0 = a.borrowed - 1.6 + i * .42, u = expoOut(span(t, t0, t0 + .7)); if (u <= 0) continue;
      const sx = PIV.x - HALF * Math.cos(-.21) - 10, sy = SY - 30 - i * 26;
      let x = lerp(-700, sx, u), y = sy, w = 170, tl = (i % 2 ? .04 : -.03) * u;
      if (roll > 0) { const e = quartIO(clamp(roll * 1.3 - i * .05)); x = lerp(x, COIN.x, e); y = lerp(y, COIN.y, e) - Math.sin(Math.PI * e) * 120; w = lerp(170, 30, e); if (e >= 1) continue; }
      PR.iouSlip(ctx, t, x, y, w, { tilt: tl, cool: .4 });
      stack.push([x, y]);
    }
    // the coin: 100 cells, each one cent of every new bond dollar
    const away = quartIO(span(t, a.slow - .7, a.slow + .5));
    const cx = lerp(COIN.x, 230, away), cy = lerp(COIN.y, 700, away), cr = lerp(COIN.r, 100, away);
    coin100(ctx, t, cx, cy, cr, span(t, a.ratings - 3.0, a.ratings - 1.6), (i) => i < 2 ? smooth(span(t, a.two + i * .12, a.two + i * .12 + .35)) : i < 10 ? smooth(span(t, a.ten + (i - 2) * .05, a.ten + (i - 2) * .05 + .35)) : 0);
    const tOut = a.slow - .8;
    riseText(ctx, 'NEW INVESTMENT-GRADE BONDS', COIN.x, COIN.y - COIN.r - 46, t, a.ratings, { ...LBL, size: 36, align: 'center', out: tOut });
    riseText(ctx, '2 %', 990, 590, t, a.two + .05, { size: 120, serif: true, out: a.ten - .35 });
    riseText(ctx, '2023', 994, 650, t, a.two + .15, { ...LBL, size: 32, col: P.halo2, out: a.ten - .35 });
    riseText(ctx, '10 %', 990, 590, t, a.ten + .05, { size: 120, serif: true, out: tOut });
    riseText(ctx, '2026 SO FAR', 994, 650, t, a.ten + .15, { ...LBL, size: 32, col: P.halo2, out: tOut });
    riseText(ctx, 'KANSAS CITY FED', 994, 700, t, a.two + .6, { ...SRC, out: tOut });
    // 3.09 the payment calendar beside the right crane: DUE, DUE, DUE in the cranes' beat
    const cu = expoOut(span(t, a.slow + .2, a.slow + 1.0));
    if (cu > 0) {
      const fl = t < a.either ? 0 : (t - a.either) / .62;
      const flips = Math.floor(fl) + smooth(fl - Math.floor(fl));
      ctx.save(); ctx.beginPath(); ctx.rect(-3000, -3000, 9000, 3000 + SY + 4); ctx.clip();
      calendar(ctx, t, 1610, lerp(SY + 240, SY, cu), 1.25, flips);
      ctx.restore();
    }
  }

  function chinaBubble(ctx, t) {
    const inU = sineIO(span(t, a.reuters - .5, a.reuters + 1.4)); if (inU <= 0) return;
    const x = lerp(W + CHINA.r + 40, CHINA.x, inU), y = CHINA.y + 18 * Math.sin(t * .9), r = CHINA.r;
    const pop = span(t, a.burst, a.burst + 1.1);
    if (pop < 1) {
      // inside: a small hall of chip stocks (cool), drawn before the film
      ctx.save(); const sk = new Path2D(); sk.arc(x, y, r, 0, 7); ctx.clip(sk); ctx.globalAlpha *= 1 - smooth(pop * 1.6);
      ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.fillRect(x - r * .7, y + r * .05, r * 1.4, r * .4);
      for (let k = 0; k < 6; k++) { ctx.fillStyle = rgba(COOL.core, .7); ctx.fillRect(x - r * .62 + k * r * .22, y + r * .14, r * .12, r * .06); }
      ctx.restore();
    }
    F.bubble(ctx, t, x, y, r, { pop, tremble: t > a.burst - .6 && pop <= 0 ? .8 : .15, seed: 11 });
    riseText(ctx, 'CHINA · STAR 50', CHINA.x, CHINA.y + r + 58, t, a.reuters + .8, { ...LBL, size: 32, align: 'center' });
    riseText(ctx, 'AI + CHIP STOCKS', CHINA.x, CHINA.y + r + 96, t, a.reuters + 1.0, { ...LBL, size: 26, align: 'center', col: P.halo2 });
    // the red line under it falls on "forty percent"
    const lu = span(t, a.forty - .55, a.forty + .5);
    if (lu > 0) {
      const x0 = CHINA.x - 190, x1 = CHINA.x + 190, y0 = 600, y1 = 690, n = 40, rr = prng(404);
      ctx.save(); ctx.strokeStyle = RED.line; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.shadowColor = rgba(RED.deep, .9); ctx.shadowBlur = 12;
      ctx.beginPath(); let tip = [x0, y0];
      for (let i = 0; i <= n * expoOut(lu); i++) { const s = i / n, yy = lerp(y0, y1, s ** 1.3) + (i && i < n ? (rr() - .5) * 16 : 0); tip = [lerp(x0, x1, s), yy]; i ? ctx.lineTo(...tip) : ctx.moveTo(...tip); }
      ctx.stroke(); ctx.restore();
      riseText(ctx, '≈ −40 %', CHINA.x, 800, t, a.forty + .1, { size: 84, weight: 600, align: 'center', col: RED.hot });
      riseText(ctx, 'IN UNDER 4 MONTHS · REUTERS, OCT 27, 2026', CHINA.x, 842, t, a.forty + .35, { ...SRC, align: 'center' });
    }
  }
}

// a drawn press stage inside a window: dark curtain, two flags, a lectern with its light, the seal backdrop (the clip grows from it)
export function pressStage(ctx, t, r, caption, o = {}) {
  ctx.save();
  ctx.fillStyle = rad(ctx, r.x + r.w / 2, r.y + r.h * .3, r.w * .7, [[0, mixHex(P.blue1, P.ind1, .3)], [1, P.night0]]); ctx.fillRect(r.x, r.y, r.w, r.h);
  const bd = { x: r.x + r.w * .33, y: r.y + r.h * .16, w: r.w * .34, h: r.h * .3 };
  const bp = new Path2D(); bp.roundRect(bd.x, bd.y, bd.w, bd.h, 6);
  glowFill(ctx, bp, 30, .4, P.halo0);
  ctx.fillStyle = lin(ctx, 0, bd.y, 0, bd.y + bd.h, [[0, mixHex(P.blue1, P.halo2, .25)], [1, mixHex(P.ind1, P.blue1, .5)]]); ctx.fill(bp);
  ctx.strokeStyle = rgba(P.halo0, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bd.x + bd.w / 2, bd.y + bd.h / 2, bd.h * .3, 0, 7); ctx.stroke();
  // flags
  for (const sx of [-1, 1]) {
    const fx = r.x + r.w / 2 + sx * r.w * .26, fy = r.y + r.h * .2;
    ctx.strokeStyle = mixHex(P.shade0, P.ind1, .3); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, r.y + r.h * .78); ctx.stroke();
    ctx.fillStyle = mixHex(P.ind2, P.blue1, .5); ctx.beginPath(); ctx.moveTo(fx, fy); ctx.quadraticCurveTo(fx + sx * 40, fy + 60 + 8 * Math.sin(t * 1.4 + sx), fx + sx * 6, fy + 200); ctx.lineTo(fx, fy + 200); ctx.closePath(); ctx.fill();
  }
  // lectern
  const lx = r.x + r.w / 2, ly = r.y + r.h * .58;
  ctx.fillStyle = mixHex(P.ind1, P.shade0, .25); ctx.beginPath(); ctx.moveTo(lx - r.w * .07, ly); ctx.lineTo(lx + r.w * .07, ly); ctx.lineTo(lx + r.w * .055, r.y + r.h * .86); ctx.lineTo(lx - r.w * .055, r.y + r.h * .86); ctx.closePath(); ctx.fill();
  halo(ctx, lx, ly - 4, r.w * .08, .5, P.halo0);
  ctx.fillStyle = mixHex(P.night1, P.ind0, .5); ctx.fillRect(r.x, r.y + r.h * .86, r.w, r.h * .14);
  if (o.slips) o.slips(ctx, lx, ly);
  E.glowText(ctx, caption, r.x + r.w / 2, r.y + r.h * .95, { size: Math.max(16, Math.round(r.w * .022)), weight: 600, align: 'center', col: P.halo0, spacing: .12, glow: false });
  ctx.restore();
}
