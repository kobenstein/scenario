// s01_flow · G1 the flow diagram (1.05): cyan points (machine work) make amber value; a fork bends most of it into
// one narrow channel; one dot follows the thin branch to "you"; the "if" grows to fill the sky; on "does" the channel
// opens and the flow reaches every station evenly; the "if" rises like a released balloon.
import { W, H, C, rgba, clamp, mix, prng, mixHex, layer, stipple, printFinish } from './art.mjs';
import { lin, sm, eio, eout, ein, drift, text } from '../engine.mjs';
import { memo, spot, fig, drawIf, keys } from './s01_kit.mjs';

const AMB = '#ffb35c', HOT = '#fff1d6', CY = '#8fe6ff', CYW = '#d8f7ff', CREAM = '#f3efe2';
const FORK = [1040, 600], GATE = 600, STX = [480, 680, 880, 1080, 1280, 1480, 1680], GROUND = 950, YOU = 3;
const hash = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
function bezPts(p0, p1, p2, p3, n = 40) { const o = []; for (let i = 0; i <= n; i++) { const t = i / n, u = 1 - t; o.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]); } return o; }
function mkPath(pts) { const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return { pts, cum, len: cum[cum.length - 1] }; }
function at(P, s) { if (s <= 0) { const [a, b] = P.pts; const d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [a[0] + (b[0] - a[0]) / d * s, a[1] + (b[1] - a[1]) / d * s, (b[0] - a[0]) / d, (b[1] - a[1]) / d]; }
  let lo = 0, hi = P.cum.length - 1; if (s >= P.len) { const a = P.pts[hi - 1], b = P.pts[hi], d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [b[0], b[1], (b[0] - a[0]) / d, (b[1] - a[1]) / d]; }
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (P.cum[m] < s) lo = m; else hi = m; }
  const a = P.pts[lo], b = P.pts[hi], u = (s - P.cum[lo]) / (P.cum[hi] - P.cum[lo] || 1), d = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [mix(a[0], b[0], u), mix(a[1], b[1], u), (b[0] - a[0]) / d, (b[1] - a[1]) / d]; }
const HANDY = GROUND - 88 * .62 + 2;
const PATHS = (() => {
  const common = mkPath([[GATE + 40, 600], [FORK[0], FORK[1]]]);
  const main = mkPath(bezPts(FORK, [1180, 600], [1260, 520], [1330, 420]).concat(bezPts([1330, 420], [1380, 340], [1420, 120], [1470, -420]).slice(1)));
  const st = STX.map((x) => mkPath(bezPts(FORK, [FORK[0] + 90, FORK[1] + 10], [x, mix(FORK[1], HANDY, .35)], [x + 14, HANDY])));
  const input = mkPath([[-700, 600], [GATE + 40, 600]]);
  return { common, main, st, input };
})();
// channel width along the main branch (narrow neck)
const mainW = (s) => mix(34, 7, sm(clamp(s / 260)));

export function drawFlow(T) {
  const S = (p, n) => T.S('01a', p, n), E = (p, n) => T.E('01a', p, n);
  const tA = S('But') - .1, tHard = S('The hard'), tReach = S('reaches'), tYou = S('you'), tBig = S('biggest'), tFor = S('For'), tDoes = S('does');
  const tOpen = tDoes - .12, RATE = 46, V = 300;
  const iT = Math.round((tReach - .15 - PATHS.common.len / V) * RATE);      // the dot we follow
  const choice = (i) => { const tf = i / RATE + PATHS.common.len / V; if (i === iT) return YOU; if (tf < tOpen) { if (Math.abs(i - iT) < 4) return -1; return hash(i) < .93 ? -1 : YOU; } return i % 7; };
  const tArrive = iT / RATE + (PATHS.common.len + PATHS.st[YOU].len) / V;
  const camAt = (t) => keys(t, [[tA - .6, [520, 560, 1.28]], [tHard - .2, [700, 560, 1.15]], [tReach - .3, [1060, 600, 1.0]], [tBig - .5, [1060, 640, 1.05]], [tBig + .7, [980, 300, .6]], [tFor, [990, 330, .64]], [tDoes - .3, [1080, 500, .86]], [tDoes + 1.6, [1080, 480, .8]]]);
  return (ctx, t) => {
    // ---------- camera (follows the tracked dot on "reaches you")
    let [cx, cy, cz] = camAt(t);
    const dotS = (t - iT / RATE) * V - PATHS.common.len;
    const follow = sm(lin(tReach - .3, tReach + .2, t)) * (1 - sm(lin(tYou + .55, tBig - .1, t)));
    if (follow > 0) { const [dx, dy] = dotS < 0 ? at(PATHS.common, dotS + PATHS.common.len) : at(PATHS.st[YOU], dotS); cx = mix(cx, dx, follow); cy = mix(cy, Math.min(dy, HANDY - 30), follow); cz = mix(cz, 1.75, follow); }
    cx += drift(t, 8, 1); cy += drift(t, 5, 2);
    const X = (x) => W / 2 + (x - cx) * cz, Y = (y) => H / 2 + (y - cy) * cz;
    // ---------- ground
    { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060820'); g.addColorStop(.6, '#0d1036'); g.addColorStop(1, '#151845'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    ctx.drawImage(dust(), -((t * 6) % 200) - 100 - (cx - 960) * .1, -(cy - 540) * .1);
    const open = eio(lin(tOpen, tOpen + .9, t)), warm = sm(lin(tOpen + .3, tOpen + 1.6, t));
    // stations' ground line (dotted) + soft glow over the flow
    ctx.strokeStyle = rgba(CREAM, .22); ctx.setLineDash([2 * cz, 7 * cz]); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(X(300), Y(GROUND)); ctx.lineTo(X(1860), Y(GROUND)); ctx.stroke(); ctx.setLineDash([]);
    spot(ctx, X(820), Y(600), 520 * cz, .16, AMB, '#ffcf8a', { sy: .45 });
    spot(ctx, X(200), Y(600), 420 * cz, .12, CY, CYW, { sy: .4 });
    // ---------- channel walls (cream hairlines): common band, main branch narrowing to a neck, thin branch
    const wall = (P, wf, a, from = 0, to = P.len) => { if (a <= 0) return; ctx.strokeStyle = rgba(CREAM, a); ctx.lineWidth = 1.4; for (const sgn of [-1, 1]) { ctx.beginPath(); for (let s = from; s <= to; s += 8) { const [x, y, dx, dy] = at(P, s), w = wf(s); const px = x - dy * w * sgn, py = y + dx * w * sgn; s === from ? ctx.moveTo(X(px), Y(py)) : ctx.lineTo(X(px), Y(py)); } ctx.stroke(); } };
    wall(PATHS.common, () => 34, .4);
    wall(PATHS.main, (s) => mainW(s) + open * s * .35, .55 * (1 - open), 0, 900);
    wall(PATHS.st[YOU], () => 4, .5 * (1 - open));
    // after "does": guides fanning to every station
    if (open > 0) for (let k = 0; k < 7; k++) { ctx.strokeStyle = rgba(AMB, .25 * open); ctx.setLineDash([3, 6]); ctx.lineWidth = 1.2; ctx.beginPath(); const P = PATHS.st[k]; const n = Math.floor(P.pts.length * open); P.pts.slice(0, Math.max(2, n)).forEach(([x, y], j) => j ? ctx.lineTo(X(x), Y(y)) : ctx.moveTo(X(x), Y(y))); ctx.stroke(); ctx.setLineDash([]); }
    // the gate where machine work becomes value
    { const gx = X(GATE), a = .7 + .2 * Math.sin(t * 3); ctx.strokeStyle = rgba(CREAM, .5); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(gx, Y(540)); ctx.lineTo(gx, Y(660)); ctx.stroke(); spot(ctx, gx + 20 * cz, Y(600), 90 * cz, .5 * a, AMB, HOT); }
    // ---------- cyan input
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = Math.floor((t - 5) * 30); i <= t * 30; i++) { const s = (t - i / 30) * 340; if (s < 0 || s > PATHS.input.len) continue; const [x, y] = at(PATHS.input, s), lane = (hash(i + 99) - .5) * 52, px = X(x), py = Y(y + lane);
      if (px < -20 || px > W + 20) continue; const a = 1 - sm(lin(PATHS.input.len - 60, PATHS.input.len, s)); ctx.fillStyle = rgba(CYW, .9 * a); ctx.fillRect(px - 2.2 * cz, py - 2.2 * cz, 4.4 * cz, 4.4 * cz); if (i % 3 === 0) spot(ctx, px, py, 14 * cz, .4 * a, CY, CYW); }
    // ---------- amber value particles
    let trackPos = null;
    for (let i = Math.floor((t - 8) * RATE); i <= t * RATE; i++) {
      if (i < 0) continue; const s = (t - i / RATE) * V; if (s < 0) continue;
      const lane = (hash(i) - .5) * 52; let x, y, w = 1;
      if (s < PATHS.common.len) { [x, y] = at(PATHS.common, s); y += lane * mix(1, .8, s / PATHS.common.len); }
      else { const k = choice(i), s2 = s - PATHS.common.len;
        if (k < 0) { if (s2 > PATHS.main.len) continue; let dx, dy; [x, y, dx, dy] = at(PATHS.main, s2); const f = mainW(s2) / 34 * .8; x -= dy * lane * f; y += dx * lane * f; w = 1 - sm(lin(700, 1100, s2)); }
        else { const P = PATHS.st[k]; if (s2 > P.len + .6 * V) continue; let dx, dy; [x, y, dx, dy] = at(P, Math.min(s2, P.len)); const f = (1 - Math.min(1, s2 / 120)) * .8; x -= dy * lane * f * .5; y += dx * lane * f * .5; w = 1 - sm(lin(P.len, P.len + .6 * V, s2)); if (s2 >= P.len) { y += (s2 - P.len) * .05; } } }
      const px = X(x), py = Y(y); if (px < -30 || px > W + 30 || py < -30 || py > H + 30) continue;
      const big = i === iT; const r = (big ? 4.2 : 2.6) * cz;
      ctx.fillStyle = rgba(big ? HOT : '#ffd08a', w); ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill();
      if (i % 2 === 0 || big) spot(ctx, px, py, (big ? 46 : 16) * cz, (big ? .9 : .35) * w, AMB, HOT);
      if (big) trackPos = [px, py];
    }
    ctx.restore();
    // ---------- the stations: people waiting with open hands; warm when the flow reaches them
    for (let k = 0; k < 7; k++) {
      const x = STX[k], got = k === YOU ? sm(lin(tArrive - .1, tArrive + .5, t)) * .8 : 0, lit = Math.max(got, warm * sm(lin(tOpen + .5 + Math.abs(k - 3) * .06, tOpen + 1.2 + Math.abs(k - 3) * .06, t)));
      const px = X(x), py = Y(GROUND - 88 * .62), s = .62 * cz;
      if (px < -100 || px > W + 100) continue;
      spot(ctx, px, Y(GROUND), 120 * cz, .1 + .5 * lit, AMB, '#ffcf8a', { sy: .25 });
      const pose = { lean: mix(.06, -.02, lit), head: mix(.25, -.05, lit) + Math.sin(t * .8 + k) * .03, sh: [.95, .85], el: [.55, .5], hip: [.05, -.05], kn: [0, 0], hair: ['short', 'long', 'bun', 'curly', 'cap', 'long', 'short'][k] };
      const coat = ['#3a5070', '#6a3a50', '#2f5a4a', '#e59a3a', '#4a4a6a', '#8a3a2a', '#5a6a3a'][k];
      const o = { key: 'st' + k, dress: { coat, pants: '#1a1830', skin: ['#e0b48e', '#c98f6a', '#e9c3a0', '#d9a77e', '#b07a56', '#e9c3a0', '#c98f6a'][k], hair: '#2a1a14' }, shadeA: .55 * (1 - lit), shadeCol: '#0a0b2a', light: { x: px, y: py - 300 }, rim: '#ffcf8a', rimW: 1.6 * s };
      fig(ctx, px, py, s, pose, o);
      if (lit > 0) { const [hx, hy] = [px + 14 * cz, Y(HANDY)]; spot(ctx, hx, hy, 40 * cz, .7 * lit, AMB, HOT); }
    }
    // ---------- labels (Inter caps)
    const la = (t0, t1) => eout(lin(t0, t0 + .5, t)) * (1 - lin(t1, t1 + .4, t));
    text(ctx, 'AI · ROBOTS', X(150), Y(530), { size: 18, weight: 600, color: CY, alpha: la(tA - .4, tBig), spacing: 5 });
    text(ctx, 'WHAT IT EARNS', X(700), Y(538), { size: 18, weight: 600, color: AMB, alpha: la(tA + .3, tBig), spacing: 5 });
    text(ctx, 'YOU', X(STX[YOU] + 10), Y(GROUND + 46), { size: 18, weight: 600, color: CREAM, align: 'center', alpha: la(tYou - .3, tFor), spacing: 6 });
    text(ctx, 'EVERYONE', X(1080), Y(GROUND + 46), { size: 18, weight: 600, color: CREAM, align: 'center', alpha: la(tDoes + .6, 99), spacing: 6 });
    // ---------- the "if": hangs above; grows to fill the sky on "biggest"; rises like a balloon after "does"
    { const grow = eio(lin(tBig - .3, tBig + .9, t)) * (1 - .25 * eio(lin(tFor, tDoes, t)));
      let ix = mix(X(960), 830, grow), iy = mix(Y(200), 395, grow), sc = mix(300 * cz, 370, grow);
      const gin = eio(lin(tA + .15, tA + 1.3, t)); ix = mix(960, ix, gin); iy = mix(150, iy, gin); sc = mix(170, sc, gin);
      const rise = lin(tDoes + .5, tDoes + 1.9, t);
      ix += Math.sin(rise * 5) * 30 * rise; iy -= ein(rise) * 1100; sc *= 1 - .15 * rise;
      drawIf(ctx, ix + drift(t, 4, 3), iy + drift(t, 3, 4), sc, 1, 1, { t, glowK: .8 + .4 * grow });
    }
    printFinish(ctx, { grain: .07, vig: .42 });
  };
}
// faint stippled dust on the indigo ground (diagram paper)
const dust = () => memo('flow.dust', () => { const [c, g] = layer(W + 400, H + 200); const r = prng(3); for (let i = 0; i < 2200; i++) { const m = r(); g.fillStyle = rgba('#c9c7ff', .04 + .12 * m * m); g.fillRect(r() * (W + 400), r() * (H + 200), m > .97 ? 2 : 1, m > .97 ? 2 : 1); } return c; });
