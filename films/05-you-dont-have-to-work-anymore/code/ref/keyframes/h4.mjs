// H4 · §5 possibilities (Esteem / Self-actualization terrace, push-in): a street whose fronts are cut away. Behind every
// facade someone is doing the thing they chose: a potter, a violinist, an old carpenter teaching a child, a sign painter.
// Not spectacle; evening, warm rooms, neighbours stopping to look in.
import { W, H, C, rgba, canvas, vgrad, glow, stars, finish, figure, handPos, save, prng, mix, text, speckle } from './lib.mjs';
const FL = 850, CE = 440, S = 1.12, col = '#191233', rim = '#ffd9a8';
function room(ctx, x0, w, wall, t) {
  vgrad(ctx, [[0, wall[0]], [1, wall[1]]], x0, CE, w, FL - CE);
  ctx.fillStyle = 'rgba(20,12,30,.35)'; ctx.fillRect(x0, FL - 6, w, 6);
  // pendant lamp
  const lx = x0 + w * .55; ctx.strokeStyle = 'rgba(20,14,30,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(lx, CE); ctx.lineTo(lx, CE + 48); ctx.stroke();
  ctx.fillStyle = '#2a1d33'; ctx.beginPath(); ctx.moveTo(lx - 18, CE + 62); ctx.lineTo(lx + 18, CE + 62); ctx.lineTo(lx + 8, CE + 46); ctx.lineTo(lx - 8, CE + 46); ctx.fill();
  glow(ctx, lx, CE + 66, 300, .32, C.amber, C.amberHot);
  speckle(ctx, x0 + 20, CE + 70, w - 40, 260, 500, C.amberHot, .12, x0);
}
export function frame(t, out) {
  const [cv, ctx] = canvas();
  // sky + the next terrace above (retaining wall + houses), we are inside the hill town
  vgrad(ctx, [[0, '#141a4c'], [.6, '#3b2f6e'], [1, '#6a4a86']], 0, 0, W, 330);
  stars(ctx, t, { n: 90, y1: 160, a: .4, seed: 9 });
  ctx.fillStyle = '#1d1b4e'; const r = prng(5);
  for (let x = -20; x < W; ) { const w = 60 + r() * 90, h = 50 + r() * 60; ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x, 250 - h); ctx.lineTo(x + w / 2, 250 - h - 26); ctx.lineTo(x + w, 250 - h); ctx.lineTo(x + w, 250); ctx.fill();
    for (let k = 0; k < 3; k++) if (r() < .6) { ctx.fillStyle = rgba(C.amber, .8); ctx.fillRect(x + 12 + k * (w - 24) / 3, 250 - h + 16, 6, 8); ctx.fillStyle = '#1d1b4e'; } x += w + 6; }
  ctx.fillStyle = '#16153f'; ctx.fillRect(0, 250, W, 80); ctx.fillStyle = rgba(C.amberHot, .3); ctx.fillRect(0, 250, W, 2);  // retaining wall
  for (let x = 0; x < W; x += 46) { ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fillRect(x + (Math.floor(x / 46) % 2) * 23, 270, 1.5, 60); }
  // building mass: upper storey + roofs, rooms cut open below
  const rooms = [[110, 400, ['#6a4256', '#3e2742']], [540, 400, ['#4f3e66', '#2e2546']], [970, 410, ['#6b4a40', '#3b2834']], [1410, 400, ['#5a4060', '#33233f']]];
  ctx.fillStyle = '#100f30'; ctx.fillRect(0, 330, W, FL - 330);
  for (const [x0, w] of rooms) { ctx.fillStyle = '#100f30'; ctx.beginPath(); ctx.moveTo(x0 - 30, 340); ctx.lineTo(x0 + w / 2, 268 + (x0 % 3) * 8); ctx.lineTo(x0 + w + 30, 340); ctx.fill();
    for (let k = 0; k < 4; k++) { const on = (x0 / 10 + k) % 3 !== 0; ctx.fillStyle = on ? rgba(C.amber, .85) : 'rgba(40,40,90,.8)'; ctx.fillRect(x0 + 50 + k * (w - 100) / 3 - 10, 372, 18, 26); } }
  for (const [x0, w, wall] of rooms) room(ctx, x0, w, wall, t);
  // 1 · potter
  { const x0 = 110, hx = x0 + 120, hy = FL - 52;
    const shelf = (y) => { ctx.fillStyle = '#2a1a2a'; ctx.fillRect(x0 + 20, y, 150, 5); for (let i = 0; i < 4; i++) { ctx.fillStyle = ['#c98f6a', '#d9b48f', '#a86a5a'][i % 3]; ctx.beginPath(); ctx.ellipse(x0 + 42 + i * 36, y - 14, 10 - i % 2 * 3, 14, 0, 0, 7); ctx.fill(); } };
    shelf(560); shelf(630);
    ctx.fillStyle = '#2a1a2a'; ctx.fillRect(hx - 22, hy + 2, 44, 8); ctx.fillRect(hx - 4, hy + 10, 8, FL - hy - 10);   // stool
    const P = { lean: .3, head: .35, sh: [.95, .7], el: [.55, .75], hip: [1.5, 1.45], kn: [1.5, 1.4], hair: 'bun' };
    figure(ctx, hx, hy, S, P, { rim, rimSide: 1, col });
    const [px, py] = handPos(hx, hy, S, P, 0);
    ctx.fillStyle = '#2a1a2a'; ctx.fillRect(px - 2, py + 12, 30, FL - py - 12); ctx.fillStyle = '#3a2838'; ctx.beginPath(); ctx.ellipse(px + 13, py + 12, 46, 8, 0, 0, 7); ctx.fill();   // wheel
    ctx.fillStyle = '#c98f6a'; ctx.beginPath(); ctx.moveTo(px - 4, py + 10); ctx.bezierCurveTo(px - 10, py - 10, px + 2, py - 22, px + 4, py - 30); ctx.lineTo(px + 22, py - 30); ctx.bezierCurveTo(px + 24, py - 22, px + 36, py - 10, px + 30, py + 10); ctx.fill();
    ctx.strokeStyle = rgba(C.amberHot, .5); ctx.lineWidth = 1.5; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.ellipse(px + 13, py + 12, 50 + k * 6, 9 + k, 0, .2 + t + k, 1.2 + t + k); ctx.stroke(); }   // spin lines
      }
  // 2 · violinist + music stand
  { const x0 = 540, fx = x0 + 160, fy = FL - 88 * S;
    ctx.strokeStyle = '#21182c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0 + 310, FL); ctx.lineTo(x0 + 310, 650); ctx.moveTo(x0 + 292, FL); ctx.lineTo(x0 + 310, 790); ctx.lineTo(x0 + 328, FL); ctx.stroke();
    ctx.fillStyle = '#e8dcc4'; ctx.save(); ctx.translate(x0 + 310, 640); ctx.rotate(-.25); ctx.fillRect(-26, -20, 52, 34); ctx.restore();
    const P = { lean: -.06, head: -.25, sh: [.95, 1.75], el: [1.45, .35], hip: [.12, -.1], kn: [.05, .12], hair: 'short' };
    figure(ctx, fx, fy, S, P, { rim, rimSide: 1, col });
    const [nx, ny] = handPos(fx, fy, S, P, 1), [bx, by] = handPos(fx, fy, S, P, 0);
    const cx = fx + 10, cy = fy - 58 * S;   // under the chin
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.atan2(ny - cy, nx - cx));
    const L = Math.hypot(nx - cx, ny - cy); ctx.fillStyle = '#8a4a2e'; ctx.beginPath(); ctx.ellipse(10, 0, 18, 9, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5a2e1e'; ctx.fillRect(22, -2, L - 18, 4); ctx.restore();
    ctx.strokeStyle = rgba('#f0e2c8', .85); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(bx - 10, by - 30); ctx.lineTo(bx + 34, by + 30); ctx.stroke();  // bow
    for (let k = 0; k < 3; k++) { ctx.fillStyle = rgba(C.cream, .5 - k * .12); ctx.beginPath(); ctx.ellipse(nx + 30 + k * 26, ny - 30 - k * 18 + Math.sin(t * 2 + k) * 4, 3.5, 2.6, -.4, 0, 7); ctx.fill(); ctx.fillRect(nx + 33 + k * 26, ny - 44 - k * 18 + Math.sin(t * 2 + k) * 4, 1.2, 14); }
  }
  // 3 · old carpenter teaching a child at the bench
  { const x0 = 970, by = FL - 92;
    ctx.fillStyle = '#2a1a22'; for (let i = 0; i < 5; i++) ctx.fillRect(x0 + 40 + i * 30, 540, 4, 50 + i % 2 * 14);   // tools on the wall
    ctx.fillRect(x0 + 32, 536, 160, 4);
    const oP = { lean: .2, head: .3, sh: [1.15, .9], el: [.45, .7], hip: [.06, -.04], kn: [0, .06], hair: 'grey', bulk: 1.15 };
    figure(ctx, x0 + 95, FL - 88 * S * 1.05, S * 1.05, oP, { rim, rimSide: 1, col });
    const cP = { lean: .12, head: .2, sh: [1.2, 1.0], el: [.55, .6], hip: [.06, -.06], kn: [0, .05], hair: 'curly' };
    const cs = S * .72; figure(ctx, x0 + 190, FL - 88 * cs, cs, cP, { rim, rimSide: 1, col });
    const [hx, hy] = handPos(x0 + 190, FL - 88 * cs, cs, cP, 0);
    ctx.fillStyle = '#3a2430'; ctx.fillRect(x0 + 235, by, 160, 12); ctx.fillRect(x0 + 245, by + 12, 10, 80); ctx.fillRect(x0 + 370, by + 12, 10, 80);   // bench
    ctx.fillStyle = '#d9b48f'; ctx.fillRect(x0 + 240, by - 9, 150, 9);   // plank
    ctx.fillStyle = '#2a1a22'; ctx.fillRect(Math.max(hx - 6, x0 + 250), by - 19, 30, 10); ctx.fillRect(Math.max(hx - 6, x0 + 250) + 20, by - 27, 6, 10);   // plane
    ctx.strokeStyle = rgba('#f1d4a8', .8); ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(Math.max(hx - 6, x0 + 250) + 44 + k * 12, by - 16 - k * 5, 5 + k * 2, -Math.PI * .7, Math.PI * .7); ctx.stroke(); }
    ctx.fillStyle = rgba('#f1d4a8', .6); for (let k = 0; k < 9; k++) ctx.fillRect(x0 + 250 + k * 15, FL - 4, 6, 2);
  }
  // 4 · sign painter
  { const x0 = 1410, ex = x0 + 270;
    ctx.strokeStyle = '#2a1a22'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex - 50, FL); ctx.lineTo(ex, 560); ctx.lineTo(ex + 50, FL); ctx.stroke();
    ctx.fillStyle = '#efe4cc'; ctx.fillRect(ex - 95, 540, 190, 150);
    ctx.fillStyle = '#2b2a5e'; ctx.fillRect(ex - 85, 550, 170, 130);
    text(ctx, 'Open', ex - 66, 630, { size: 56, font: 'Instrument Serif', color: C.amberHot });
    ctx.fillStyle = C.rose; ctx.fillRect(ex - 66, 648, 84, 3); ctx.fillStyle = C.cyan; ctx.fillRect(ex - 66, 657, 46, 3);
    const P = { lean: .08, head: -.1, sh: [2.15, .8], el: [.35, 1.2], hip: [.1, -.08], kn: [.04, .1], hair: 'long', skirt: true };
    const fx = x0 + 105, fy = FL - 88 * S; figure(ctx, fx, fy, S, P, { rim, rimSide: 1, col });
    const [bx, by] = handPos(fx, fy, S, P, 0), [qx, qy] = handPos(fx, fy, S, P, 1);
    ctx.strokeStyle = '#3a2830'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + 26, by - 14); ctx.stroke(); ctx.fillStyle = C.amberHot; ctx.beginPath(); ctx.arc(bx + 27, by - 15, 3, 0, 7); ctx.fill();
    ctx.fillStyle = '#c9a77f'; ctx.beginPath(); ctx.ellipse(qx + 6, qy, 18, 9, -.3, 0, 7); ctx.fill(); for (const [dx, c] of [[-4, C.amber], [6, C.rose], [14, C.cyan]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(qx + dx, qy - 2, 2.6, 0, 7); ctx.fill(); }
  }
  // cut edges: thin warm line where the facade was removed
  for (const [x0, w] of rooms) { ctx.strokeStyle = rgba(C.amberHot, .45); ctx.lineWidth = 2; ctx.strokeRect(x0, CE, w, FL - CE); }
  // street in front
  vgrad(ctx, [[0, '#231d4a'], [1, '#0b0c26']], 0, FL, W, H - FL);
  ctx.fillStyle = rgba(C.amberHot, .25); ctx.fillRect(0, FL, W, 2);
  for (const [x0, w] of rooms) glow(ctx, x0 + w / 2, FL + 10, w * .7, .22, C.amber, C.amberHot, { sy: .35 });
  // neighbours on the street, stopping to look in (foreground, larger, backlit by the rooms)
  figure(ctx, 470, 935, 1.15, { lean: -.02, head: -.12, sh: [.3, .55], el: [.6, .5], hip: [.1, -.12], kn: [.05, .2], coat: true }, { rim, rimSide: -1, col: '#0d0b24', flip: true, rimW: 2 });
  figure(ctx, 1345, 940, 1.1, { lean: .04, head: -.15, sh: [.35, -.15], el: [.3, .4], hip: [.3, -.25], kn: [.1, .35], hair: 'bun', skirt: true }, { rim, rimSide: 1, col: '#0d0b24', rimW: 2 });
  // small level tag
  ctx.fillStyle = C.amber; ctx.fillRect(80, 64, 28, 2);
  text(ctx, 'ESTEEM · SELF-ACTUALIZATION', 80, 96, { size: 16, weight: 600, color: '#d6d1ea', spacing: 6 });
  finish(ctx, t, { grain: .05, vig: .55 });
  save(cv, out);
}
if (process.argv[1].endsWith('h4.mjs')) frame(0, process.argv[2] || 'h4.png');
