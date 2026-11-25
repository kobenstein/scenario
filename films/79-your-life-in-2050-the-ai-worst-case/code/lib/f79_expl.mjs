// Film 79 · EXPLAINER graphics for the mechanism (EXPL rows; REGELN §13: graphics carry understanding). Night-blue ground, cream type,
// AMBER = you / human work, COLD CARMINE = the machine, neutral blue-grey = "the rest". Text in text inks, never in the series colour.
// dataviz (validated 25.11., surface #0b1238): carmine #e0284f vs rest #6a74a8 → CVD ΔE 14.4, normal 24.5, contrast ≥ 3:1 (rest is gray on
// purpose: highlight-vs-rest); amber #ffb35c vs rest → ΔE 37.8. Every value is direct-labelled. Numbers exactly as the faktencheck:
//   labour share 53.0 % · BLS Productivity and Costs Q3 2026 (5.11.2026) · lowest since the series began in 1947 · PRELIMINARY (revision 8.12.)
//   PJM: $29.4 bn of $63.6 bn = 46 % of capacity charges over the last four auctions traced to data centres · ESTIMATE of the independent
//   market monitor (Monitoring Analytics) · not audited costs, there is a counter-scenario. Say "estimate" on screen.
// Each graphic is a function (ctx, t, o): o.u 0..1 builds it (the scene maps u to the spoken words), o.out 0..1 lets it fall apart into the next.
import * as K from './f79_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, rad, lin, expoOut, quartIO, sineIO, glowText, CARM, AMBER } = K;
export const REST = '#6a74a8', INK = { text: P.cream, sub: '#a9b2d8', faint: rgba('#a9b2d8', .55) };
const T = (c, s, x, y, o = {}) => glowText(c, s, x, y, { size: 24, weight: 600, col: INK.text, glow: false, spacing: .12, ...o });
// an arrow along a quadratic curve, drawn up to u; o.col, o.w, o.dash, o.head
function arrow(c, p0, p1, bend, u, o = {}) {
  if (u <= 0) return; const mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2 - bend, N = 40, pts = [];
  for (let i = 0; i <= N; i++) { const s = i / N, a = (1 - s) * (1 - s), b = 2 * (1 - s) * s, d = s * s; pts.push([a * p0[0] + b * mx + d * p1[0], a * p0[1] + b * my + d * p1[1]]); }
  c.save(); c.strokeStyle = o.col || AMBER.body; c.lineWidth = o.w ?? 5; c.lineCap = 'round'; if (o.dash) c.setLineDash(o.dash); if (o.glow) { c.shadowColor = o.col; c.shadowBlur = 14; }
  K.strokeIn(c, pts, u); c.setLineDash([]);
  if (u > .97 && o.head !== false) { const [x, y] = pts[N], [px, py] = pts[N - 3], a = Math.atan2(y - py, x - px); c.fillStyle = o.col || AMBER.body; c.beginPath(); c.moveTo(x, y); c.lineTo(x - 20 * Math.cos(a - .45), y - 20 * Math.sin(a - .45)); c.lineTo(x - 20 * Math.cos(a + .45), y - 20 * Math.sin(a + .45)); c.fill(); }
  c.restore(); return pts;
}
function employer(c, x, y, s, a = 1) { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = lin(c, -90, 0, 90, 0, [[0, '#2a3470'], [1, '#1a2054']]); c.fillRect(-90, -120, 180, 120); c.fillRect(30, -170, 34, 60);
  c.fillStyle = rgba('#e8eefc', .5); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) c.fillRect(-72 + k * 40, -104 + r * 34, 22, 18); c.restore(); }
function government(c, x, y, s, a = 1) { c.save(); c.globalAlpha *= a; c.translate(x, y); c.scale(s, s); c.fillStyle = '#2a3470'; c.beginPath(); c.moveTo(-110, -110); c.lineTo(0, -170); c.lineTo(110, -110); c.fill();
  c.fillStyle = '#1a2054'; c.fillRect(-110, -110, 220, 14); c.fillRect(-120, -12, 240, 14); c.fillStyle = rgba('#e8eefc', .55); for (let k = 0; k < 5; k++) c.fillRect(-88 + k * 42, -94, 14, 82); c.restore(); }
function tableSeat(c, t, x, y, seat, a = 1) {   // a table seen from the side; seat 1 = your chair at it, 0 = pushed away and empty
  c.save(); c.globalAlpha *= a; c.fillStyle = '#3a4480'; c.fillRect(x - 160, y - 70, 320, 12); c.fillRect(x - 140, y - 58, 10, 58); c.fillRect(x + 130, y - 58, 10, 58);
  const cx = x - 200 - (1 - seat) * 170, rot = (1 - seat) * -.25; c.translate(cx, y); c.rotate(rot); c.fillStyle = mixHex(AMBER.body, '#3a4480', 1 - seat * .85);
  c.fillRect(-30, -46, 60, 8); c.fillRect(-30, -110, 8, 110); c.fillRect(22, -46, 8, 46); c.restore(); }
// THE NEED MECHANISM. o.p 0 → 1: "then" (your WORK to the employer, your TAXES to the state, both need you → your seat at the table)
// → "now" (the machine does the work and pays the taxes, your lines go dark, the chair slides away, a thin ALLOWANCE line comes back).
// o.u build-in (0..1), o.a (alpha), o.labels (default true)
export function need(ctx, t, o = {}) {
  const u = o.u ?? 1, p = clamp(o.p ?? (o.phase ?? 0)), pe = quartIO(p);
  K.dusk(ctx, t, { glow: [lerp(520, 900, pe), 620] });
  K.scr(ctx, (c) => {
    c.globalAlpha = o.a ?? 1;
    const you = [430, 860], emp = [1500, 420], gov = [1500, 820], tab = [960, 1000], mac = [960, 600];
    employer(c, emp[0], emp[1], 1, span(u, .05, .3)); government(c, gov[0], gov[1], 1, span(u, .1, .35));
    T(c, 'EMPLOYER', emp[0], emp[1] + 44, { align: 'center', a: span(u, .2, .4) }); T(c, 'GOVERNMENT', gov[0], gov[1] + 44, { align: 'center', a: span(u, .25, .45) });
    K.you(c, t, you[0], you[1], 300, { dir: 1, look: lerp(.3, -.2, pe), back: 0 });
    // then: your lines
    const ya = 1 - span(p, .25, .6);
    arrow(c, [you[0] + 70, you[1] - 210], [emp[0] - 120, emp[1] - 60], 120, span(u, .3, .55) * ya + (ya < 1 ? 0 : 0), { col: rgba(AMBER.body, ya), glow: ya > .5 });
    arrow(c, [you[0] + 70, you[1] - 160], [gov[0] - 140, gov[1] - 50], 40, span(u, .4, .65) * ya, { col: rgba(AMBER.body, ya), glow: ya > .5 });
    if (ya > 0) { T(c, 'WORK', 900, 360, { a: span(u, .45, .6) * ya, col: AMBER.core, size: 30 }); T(c, 'TAXES', 980, 700, { a: span(u, .55, .7) * ya, col: AMBER.core, size: 30 }); }
    // the return: they need you → they listen → your seat at the table
    const back = span(u, .7, .95) * (1 - span(p, .1, .4));
    arrow(c, [emp[0] - 40, emp[1] + 70], [tab[0] + 120, tab[1] - 90], -60, back, { col: rgba(INK.text, .7), w: 2.5, dash: [8, 10] });
    arrow(c, [gov[0] - 60, gov[1] + 70], [tab[0] + 150, tab[1] - 80], -20, back, { col: rgba(INK.text, .7), w: 2.5, dash: [8, 10] });
    tableSeat(c, t, tab[0], tab[1], 1 - quartIO(span(p, .55, .9)), span(u, .7, .85));
    T(c, 'YOUR SEAT AT THE TABLE', tab[0] - 100, tab[1] + 40, { align: 'center', a: span(u, .8, .95) * (1 - span(p, .5, .7)), size: 22 });
    // now: the machine (a carmine ring) takes both lines over
    if (p > 0) {
      const ma = span(p, 0, .3); K.ring(c, t, mac[0], mac[1], 70 * expoOut(ma), ma);
      arrow(c, [mac[0] + 70, mac[1] - 40], [emp[0] - 120, emp[1] - 30], 80, span(p, .25, .55), { col: CARM.hot, glow: true });
      arrow(c, [mac[0] + 70, mac[1] + 40], [gov[0] - 140, gov[1] - 40], -40, span(p, .35, .65), { col: CARM.hot, glow: true });
      T(c, 'WORK', 1180, 410, { a: span(p, .45, .6), col: CARM.core, size: 30 }); T(c, 'TAXES', 1180, 820, { a: span(p, .55, .7), col: CARM.core, size: 30 });
      arrow(c, [gov[0] - 160, gov[1] + 40], [you[0] + 80, you[1] - 60], -120, span(p, .75, 1), { col: rgba(INK.sub, .8), w: 2, dash: [3, 9] });
      T(c, 'ALLOWANCE', 820, 940, { a: span(p, .85, 1), col: INK.sub, size: 22 });
    }
  });
}
// LABOUR SHARE: one bar, 0–100 % of U.S. output; the workers' part fills to 53.0 % (amber), the rest neutral; a HALF tick; the hero number.
export function laborShare(ctx, t, o = {}) {
  const u = o.u ?? 1;
  K.dusk(ctx, t, { glow: [W * .45, H * .55] });
  K.scr(ctx, (c) => {
    c.globalAlpha = o.a ?? 1;
    const x0 = 260, x1 = 1660, y = 600, h = 70, v = 53.0, xv = lerp(x0, x1, v / 100), f = expoOut(span(u, .15, .7));
    T(c, "WORKERS' SHARE OF U.S. OUTPUT", x0, 330, { a: span(u, 0, .2), size: 28, spacing: .16 });
    T(c, 'LABOR SHARE · NONFARM BUSINESS SECTOR', x0, 370, { a: span(u, .05, .25), size: 20, col: INK.sub });
    c.fillStyle = REST; c.beginPath(); c.roundRect(x0, y, (x1 - x0) * span(u, 0, .2), h, 4); c.fill();
    c.fillStyle = '#0b1238'; c.fillRect(lerp(x0, xv, f) , y - 2, 2, h + 4);   // 2 px surface gap at the boundary
    c.fillStyle = lin(c, x0, 0, xv, 0, [[0, AMBER.deep], [1, AMBER.body]]); c.beginPath(); c.roundRect(x0, y, (xv - x0) * f, h, 4); c.fill();
    for (const [pc, lab] of [[0, '0 %'], [50, 'HALF'], [100, '100 %']]) { const x = lerp(x0, x1, pc / 100), a = span(u, .2, .35); c.fillStyle = rgba(INK.text, .5 * a); c.fillRect(x - 1, y + h + 8, 2, pc === 50 ? 30 : 16); T(c, lab, x, y + h + 66, { align: 'center', size: 20, col: INK.sub, a }); }
    c.fillStyle = rgba(INK.text, .55); c.fillRect(lerp(x0, x1, .5) - 1, y - 18, 2, h + 36);   // the half line through the bar
    const n = (v * f).toFixed(1);
    glowText(c, `${n} %`, lerp(x0, xv, f) - 10, y - 46, { size: 120, serif: true, col: INK.text, align: 'right', a: span(u, .2, .4) });
    T(c, 'LOWEST SINCE THE SERIES BEGAN IN 1947', xv + 24, y - 40, { a: span(u, .7, .85), size: 22, col: INK.text });
    T(c, 'BLS · PRODUCTIVITY AND COSTS · Q3 2026 · PRELIMINARY', x0, 900, { a: span(u, .8, 1), size: 18, col: INK.faint, spacing: .14 });
  });
}
// PJM: one stacked bar of $63.6 bn capacity charges (last four auctions); the part traced to data centres ($29.4 bn, 46 %) in carmine,
// a row of houses below that each carry a carmine slice (every customer pays a share). ESTIMATE on screen.
export function pjm(ctx, t, o = {}) {
  const u = o.u ?? 1;
  K.dusk(ctx, t, { glow: [W * .4, H * .5] });
  K.scr(ctx, (c) => {
    c.globalAlpha = o.a ?? 1;
    const x0 = 260, x1 = 1660, y = 470, h = 90, tot = 63.6, dc = 29.4, xd = lerp(x0, x1, dc / tot), f = expoOut(span(u, .25, .65));
    T(c, "AMERICA'S BIGGEST GRID (PJM)", x0, 280, { a: span(u, 0, .2), size: 28, spacing: .16 });
    T(c, 'COST OF KEEPING ENOUGH POWER PLANTS READY · LAST FOUR AUCTIONS', x0, 320, { a: span(u, .05, .25), size: 20, col: INK.sub });
    c.fillStyle = REST; c.beginPath(); c.roundRect(x0, y, (x1 - x0) * expoOut(span(u, .05, .3)), h, 4); c.fill();
    if (f > 0) { c.fillStyle = lin(c, x0, 0, xd, 0, [[0, CARM.mid], [1, CARM.body]]); c.beginPath(); c.roundRect(x0, y, (xd - x0) * f, h, 4); c.fill(); c.fillStyle = '#0b1238'; c.fillRect(x0 + (xd - x0) * f, y - 2, 2, h + 4); }
    T(c, '$63.6 BN TOTAL', x1, y - 22, { align: 'right', a: span(u, .2, .35), size: 24 });
    glowText(c, '46 %', x0, y + h + 110, { size: 110, serif: true, col: INK.text, a: span(u, .5, .7) });
    T(c, '$29.4 BN TRACED TO DATA CENTRES', x0 + 250, y + h + 70, { a: span(u, .55, .72), size: 24 });
    T(c, 'ESTIMATE · PJM INDEPENDENT MARKET MONITOR (MONITORING ANALYTICS) · 2026', x0 + 250, y + h + 106, { a: span(u, .6, .78), size: 18, col: INK.faint, spacing: .1 });
    // every household pays a share
    const hy = 900; for (let k = 0; k < 9; k++) { const a = span(u, .75 + k * .02, .85 + k * .02); if (a <= 0) continue; const x = x0 + 40 + k * 160;
      c.globalAlpha = a; c.fillStyle = '#2a3470'; c.fillRect(x - 40, hy - 60, 80, 60); c.beginPath(); c.moveTo(x - 50, hy - 60); c.lineTo(x, hy - 100); c.lineTo(x + 50, hy - 60); c.fill();
      c.fillStyle = CARM.body; c.fillRect(x - 40, hy - 60 + 60 * (1 - .46), 80 * .46, 60 * .46); c.globalAlpha = 1; }
    T(c, 'EVERY CUSTOMER ON THE GRID PAYS A SHARE', x0, hy + 50, { a: span(u, .9, 1), size: 20, col: INK.sub });
  });
}
