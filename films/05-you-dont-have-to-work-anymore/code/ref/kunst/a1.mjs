// A1 · the labelled Maslow hill, base lit — art upgrade test.
// Low camera at the waterline: the hill towers, terraces read as ∩-arcs (seen from below), fog between the levels,
// the base town is the ONE hero light; it lights the fog from below and spills into the water. Tiny figure on a jetty.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, hatch, strokes, fog, cone, pool, bloom, house, person, castShadow, printFinish, vnoise, fbm, DRESS } from './art.mjs';
import { text, save } from './lib.mjs';
import { sagLine as sagLineA } from './art.mjs';

const cx = 620, apexY = 112, baseY = 800, hw = 900;           // the hill
const BANDS = [800, 548, 392, 282, 200, 112];                 // bottom → top boundaries of the five levels
const LV = ['Physiological · Safety', 'Belonging', 'Esteem', 'Self-actualization', 'Self-transcendence'];
const n1 = vnoise(4);
const u = (y) => clamp((y - apexY) / (baseY - apexY));
// flank half-width (concave peak, spreading foot) with a step-in at each terrace boundary
function half(y) {
  let h = hw * (0.035 + 0.965 * Math.pow(u(y), 1.5)) + hw * .1 * Math.pow(clamp((u(y) - .82) / .18), 2);
  for (let b = 1; b < 5; b++) { const d = BANDS[b] - y; if (d > 0 && d < 60 * u(BANDS[b]) + 8) h -= (1 - d / (60 * u(BANDS[b]) + 8)) * 22 * u(BANDS[b]); }
  return h;
}
const edge = (y, s) => cx + s * (half(y) + (n1(y * .03, s * 7) - .5) * 10 * u(y));
// terrace arcs seen from below: the middle bulges up (∩)
const bulge = (yb) => (baseY - yb) * .11;
const arcY = (yb, x) => { const h = half(yb), q = clamp((x - cx) / (h || 1), -1, 1); return yb - bulge(yb) * (1 - q * q); };

export function frame(out) {
  const [cv, ctx] = layer();
  // ---- sky: deep prussian night, a cold band of haze low down (not purple)
  const sg = ctx.createLinearGradient(0, 0, 0, baseY);
  sg.addColorStop(0, '#070a1f'); sg.addColorStop(.45, '#0f1838'); sg.addColorStop(.8, '#1d3157'); sg.addColorStop(1, '#2c4a6e');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, W, baseY + 40);
  { const r = prng(7); for (let i = 0; i < 260; i++) { const x = r() * W, y = Math.pow(r(), 1.6) * 520, m = r(); ctx.fillStyle = rgba('#cfe3ff', (.15 + .55 * m * m) * (1 - y / 600)); const s = m > .95 ? 2 : 1; ctx.fillRect(x, y, s, s); } }
  // high cloud strata with line hatching (Stauffer pins / a1 sky)
  { const [hc, hx] = layer(); hx.save(); hx.beginPath();
    for (const [y, x0, x1, th] of []) { hx.moveTo(x0, y); for (let x = x0; x <= x1; x += 20) hx.lineTo(x, y - th * (.5 + .5 * Math.sin(x * .008 + y))); for (let x = x1; x >= x0; x -= 20) hx.lineTo(x, y + th * .4); hx.closePath(); }
    hx.fillStyle = rgba('#2b3f68', .55); hx.fill(); hx.clip(); hatch(hx, [0, 100, W, 330], { angle: -0.03, gap: 4.5, w: 1, col: '#6f8cbc', a: .5, seed: 3, broken: .35 }); hx.restore();
    maskLinear(hc, 0, 0, W, 0, [[0, .7], [.14, 0], [.52, 0], [.7, .8], [1, .9]]); put(ctx, hc); }

  // ---- distant ridges right, behind the hill, in fog
  const ridge = (pts, col, seed) => { ctx.beginPath(); roughPath(ctx, [[W + 20, baseY + 20], ...pts, [700, baseY + 20]], { amp: 4, step: 12, seed }); ctx.fillStyle = col; ctx.fill(); };
  ridge([[W + 20, 610], [1720, 560], [1540, 640], [1380, 600], [1180, 690], [900, 740]], '#22375c', 3);
  ridge([[W + 20, 700], [1640, 690], [1450, 735], [1100, 770]], '#1a2b4b', 5);
  fog(ctx, { y0: 500, y1: baseY + 10, col: '#6f93c0', a: .7, seed: 11, cover: .7, soft: .5, k: .35, sx: .004, sy: .016 });

  // ---- the hill body
  const outline = [];
  for (let y = baseY + 30; y >= apexY + 8; y -= 5) outline.push([edge(y, -1), y]);
  outline.push([cx - 8, apexY - 4], [cx + 6, apexY - 6]);
  for (let y = apexY + 8; y <= baseY + 30; y += 5) outline.push([edge(y, 1), y]);
  const hillPath = (g) => { g.beginPath(); roughPath(g, outline, { amp: 1.5, seed: 9 }); };
  { const g = ctx.createLinearGradient(0, apexY, 0, baseY);
    g.addColorStop(0, '#22335a'); g.addColorStop(.35, '#151e3d'); g.addColorStop(1, '#0b1029');   // aerial perspective: top palest
    hillPath(ctx); ctx.fillStyle = g; ctx.fill(); }

  ctx.save(); hillPath(ctx); ctx.clip();
  // sky light on the left flank (cold, soft), the near flank darker
  { const g = ctx.createLinearGradient(cx - hw, 0, cx + hw * .3, 0); g.addColorStop(0, rgba('#5c7fb0', .28)); g.addColorStop(.55, rgba('#5c7fb0', 0)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  // generator hatching: lines running from the summit down the slopes, like pen strokes on a mountain
  { const [hc, hx] = layer();
    for (let b = 1; b < 5; b++) {           // contour hatching between the ledges: ∩-arcs, broken, denser toward the cold left flank
      const yTop = BANDS[b + 1], yBot = BANDS[b], N = [0, 8, 9, 9, 7][b];
      for (let j = 1; j < N; j++) { const yb = mix(yBot, yTop, j / N * .92), h = half(yb), rr = prng(b * 100 + j);
        hx.strokeStyle = '#9ab3dc'; hx.lineWidth = 1; hx.lineCap = 'round';
        let x = cx - h + rr() * 30; while (x < cx + h) { const L = 20 + rr() * 90 * (1 - (x - cx + h) / (2 * h)) + 10; hx.globalAlpha = (.12 + .3 * rr()) * (1 - (x - (cx - h)) / (2 * h)) ** .8; hx.beginPath(); for (let xx = x; xx < Math.min(x + L, cx + h); xx += 6) hx.lineTo(xx, arcY(yb, xx) + (n1(xx * .05, j) - .5) * 2.5); hx.stroke(); x += L + 6 + rr() * 30; } }
    }
    hx.globalAlpha = 1;
    strokes(hx, 26, (i, q, r) => { const s = (i / 26) * 2 - 1, y = mix(BANDS[4] + 10, BANDS[2], q); return [cx + s * half(y) * .96 + (n1(i * 3.1, q * 6) - .5) * 8, y]; }, { w: 1, col: '#8aa6d4', a: .14, seed: 4, steps: 40 });
    maskLinear(hc, 0, apexY, 0, baseY, [[0, 1], [.6, .8], [.8, .2], [1, 0]]); put(ctx, hc); }
  // terrace walls + ledge highlights (∩-arcs), each level one shade apart so the five read as stacked
  for (let b = 1; b < 5; b++) {
    const yb = BANDS[b], h = half(yb) + 30;
    ctx.beginPath(); for (let x = cx - h; x <= cx + h; x += 8) ctx.lineTo(x, arcY(yb, x)); for (let x = cx + h; x >= cx - h; x -= 8) ctx.lineTo(x, arcY(yb, x) + 9 + 6 * u(yb)); ctx.closePath(); ctx.fillStyle = rgba('#05081a', .55); ctx.fill();
    ctx.beginPath(); for (let x = cx - h; x <= cx + h; x += 8) ctx.lineTo(x, arcY(yb, x) - 1); ctx.strokeStyle = rgba('#9db6e0', .22 + .1 * (b > 2)); ctx.lineWidth = 1.4; ctx.stroke();
  }
  // ---- houses, level by level: back rows first, each house different; upper levels fade into fog
  const HS = [1.3, .6, .38, .25, .16];        // house scale per level (perspective)
  const r = prng(21);
  const litBase = (wx, wy, rr) => rr() < .86 ? .75 + rr() * .25 : 0;
  const walls = ['#211b30', '#2b1f2c', '#1d2140', '#2a1e2a', '#1a1d36', '#30232c', '#232843'];
  for (let b = 4; b >= 0; b--) {
    const y0 = BANDS[b], y1 = BANDS[b + 1], s = HS[b], rows = b >= 3 ? 1 : 2;
    const fogMix = [0, .12, .2, .28, .36][b], gapP = [0, .22, .38, .5, .55][b];
    for (let row = rows - 1; row >= 0; row--) {
      const yb = mix(y0 - 10 * s, y1 + 18, row / rows + (b === 4 ? .35 : 0)) - 4;
      const hh = half(yb) - 18 * s;
      let x = cx - hh + r() * 20 * s;
      while (x < cx + hh) {
        const w = (60 + r() * 70) * s, h = Math.min((70 + r() * 80) * s * (b === 4 ? .7 : 1), (y0 - y1) * (row === 0 ? .42 : .5));
        if (x + w > cx + hh + 10) break;
        if (b === 4 && Math.abs(x + w / 2 - cx) > hh * .45) { x += w; continue; }
        const gy = arcY(yb, x + w / 2) + 2;
        if (r() < gapP) { x += w * (1 + r() * 1.5); continue; }
        const wall = b === 0 ? walls[Math.floor(r() * walls.length)] : mixHex(['#1c2445', '#232a4d', '#1a2040', '#29294a', '#202a48'][Math.floor(r() * 5)], '#3a5078', fogMix);
        if (r() < .12 && b < 4) {      // trees: cypress / round crowns between houses
          ctx.fillStyle = mixHex('#0d1a24', '#4e6a96', fogMix * .9);
          if (r() < .5) { ctx.beginPath(); ctx.ellipse(x + w * .3, gy - h * .55, w * .16, h * .55, 0, 0, 7); ctx.fill(); }
          else { roughPoly(ctx, [[x, gy], [x + w * .1, gy - h * .5], [x + w * .4, gy - h * .75], [x + w * .7, gy - h * .5], [x + w * .8, gy]], null, { amp: 3 * s, seed: x | 0 }); ctx.fill(); }
          x += w * .8; continue;
        }
        const lit = b === 0 ? (wx, wy, rr) => rr() < .7 ? .7 + rr() * .3 : 0 : (wx, wy, rr) => rr() < .05 ? .35 : 0;
        house(ctx, r, x + w / 2, gy, w, h, { wall, lit, roofs: b === 0 ? ['gable', 'hip', 'flat', 'parapet', 'mansard', 'gable', 'sawtooth'] : undefined, skip: b === 0 ? .36 : .25, winOff: shade(wall, -.07), floorH: 30 * s + 6, colW: 26 * s + 4, sideCol: shade(wall, -.06), side: b === 0 ? (x + w / 2 < cx ? -.12 : .12) : 0, chimney: .5, bay: b < 2 ? .4 : .1,
          light: b === 0 ? { x: x + w / 2, y: gy + 20, col: C.amber, a: .6, r: h * .8 } : null, amp: .5 + s * .8 });
        x += w + (r() * 8 - 2) * s;
      }
    }
    // fog sits in front of each level's lower edge (depth layers)
    if (b >= 1) fog(ctx, { y0: arcY(y0, cx) - 120 * u(y0) - 20, y1: y0 + 14, col: '#6c8cba', a: .34 + .05 * b, seed: 30 + b, cover: .8, soft: .3, k: .25, sx: .0045, sy: .03, edgeTop: .95, edgeBot: .12 });
  }
  // base: the hero light — warm wash rising from the street onto the first terrace wall
  { const [lc, lx] = layer(); const g = lx.createLinearGradient(0, baseY, 0, BANDS[1] - 80); g.addColorStop(0, rgba(C.amber, .55)); g.addColorStop(.35, rgba(C.amber, .16)); g.addColorStop(1, rgba(C.amber, 0)); lx.fillStyle = g; lx.fillRect(0, BANDS[1] - 80, W, baseY - BANDS[1] + 80);
    maskRadial(lc, cx + 40, baseY, 0, hw * 1.05, [[0, 1], [.7, .6], [1, 0]], .5); stipple(lc, { k: .35, g: 1.2, seed: 5 }); put(ctx, lc, { op: 'lighter' }); }
  ctx.restore();

  // window glows on the base (additive bloom)
  // promenade at the foot: lamps with cones down onto the quay
  ctx.fillStyle = '#0a0d22'; roughRect(ctx, -10, baseY, W + 20, 30, '#0a0d22', { amp: 1.2, seed: 2 });
  const lamps = [];
  for (let x = cx - hw * .82; x < cx + hw * .95; x += 118 + (Math.sin(x) * 14)) lamps.push(x);
  for (const lxp of lamps) { roughLine(ctx, [[lxp, baseY + 2], [lxp, baseY - 64]], { w: 2.6, col: '#090b1c', seed: lxp | 0 }); ctx.fillStyle = '#090b1c'; ctx.fillRect(lxp - 6, baseY - 66, 14, 4); }
  for (const lxp of lamps) cone(ctx, lxp + 1, baseY - 62, { dir: 0, spread: .5, len: 92, col: C.amber, a: .55, k: .5, seed: lxp | 0, soft: .4 });
  bloom(ctx, cx + 40, baseY - 30, 900, { col: C.amber, core: C.amberHot, a: .26, k: .3, sy: .2, seed: 8 });
  for (const lxp of lamps) bloom(ctx, lxp + 1, baseY - 62, 26, { a: .9, k: .2, seed: 3 });
  // warm fog around the base (lit from below = volumetric)
  fog(ctx, { y0: BANDS[1] - 60, y1: baseY + 10, col: '#e8a466', a: .26, seed: 77, cover: .62, soft: .5, k: .3, sx: .006, sy: .03, op: 'lighter', mask: (c) => maskRadial(c, cx + 40, baseY, 0, hw * 1.1, [[0, 1], [.6, .7], [1, 0]], .45) });

  // ---- water: dark, amber streaks under the base, cold fog glints elsewhere
  const wy = baseY + 30;
  { const g = ctx.createLinearGradient(0, wy, 0, H); g.addColorStop(0, '#111b38'); g.addColorStop(1, '#060818'); ctx.fillStyle = g; ctx.fillRect(0, wy, W, H - wy); }
  { // smooth mirrored glow under the base + reflection columns under lit windows (broken horizontal strokes)
    const [rc, rx] = layer(); const g = rx.createLinearGradient(0, wy, 0, wy + 220); g.addColorStop(0, rgba(C.amber, .35)); g.addColorStop(1, rgba(C.amber, 0)); rx.fillStyle = g; rx.fillRect(0, wy, W, 220);
    maskRadial(rc, cx + 40, wy, 0, hw * 1.05, [[0, 1], [.75, .5], [1, 0]], .3); stipple(rc, { k: .2, seed: 6 }); put(ctx, rc, { op: 'lighter' });
    const rr = prng(12);
    for (let i = 0; i < 46; i++) { const x0 = cx - hw * .85 + rr() * hw * 1.85, a0 = .2 + rr() * .35; for (let y = wy + 3; y < wy + 60 + rr() * 200; y += 3 + rr() * 6) { const d = (y - wy) / 260; if (rr() < .35) continue; const w = (3 + rr() * 14) * (1 + d * 2); ctx.fillStyle = rgba(rr() < .7 ? C.amber : C.amberHot, a0 * (1 - d)); ctx.fillRect(x0 - w / 2 + Math.sin(y * .25 + i) * 4 * (1 + d * 3), y, w, 1.6); } }
    for (let i = 0; i < 160; i++) { const y = wy + 20 + Math.pow(rr(), 1.3) * (H - wy - 20), x = rr() * W; ctx.fillStyle = rgba('#7f9cc8', .08 + .1 * rr()); ctx.fillRect(x, y, 10 + rr() * 50, 1.2); }
  }
  // lamp reflections: vertical broken streaks
  for (const lxp of lamps) { const rr = prng(lxp | 0); for (let y = wy + 4; y < wy + 170; y += 4 + rr() * 5) { ctx.fillStyle = rgba(C.amberHot, .5 * (1 - (y - wy) / 170) * rr()); const w = 4 + rr() * 10; ctx.fillRect(lxp - w / 2 + Math.sin(y * .3) * 3, y, w, 1.5); } }

  // ---- foreground: a dark jetty from lower-left, one small figure in an amber coat looking up
  { ctx.fillStyle = '#05060f';
    roughPoly(ctx, [[-20, 900], [520, 952], [560, 970], [560, 990], [-20, 1000]], '#070814', { amp: 1.5, seed: 4 });
    for (let px = 10; px < 520; px += 64) roughLine(ctx, [[px, 901 + px * .1 - 1], [px + 1, 901 + px * .1 - 44]], { w: 2.4, col: '#05060f', seed: px });
    roughLine(ctx, sagLineA([0, 858], [520, 910], 4), { w: 2.2, col: '#05060f', seed: 3 });
    for (const px of [40, 170, 300, 430, 545]) roughRect(ctx, px, 940 + px * .05, 9, 140, '#05060f', { amp: 1, seed: px });
    roughRect(ctx, -20, 1000, 600, 100, '#05060f', { amp: 1, seed: 9 });
    // bollard + a coiled rope
    roughRect(ctx, 470, 926, 16, 26, '#05060f', { amp: .6, seed: 12 });
    // rim light on the jetty's top edge from the town
    ctx.strokeStyle = rgba(C.amber, .35); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 901); ctx.lineTo(520, 953); ctx.stroke();
    const fx = 330, fy = 933 - 88 * .72;
    person(ctx, fx, fy, .72, { lean: -.06, head: -.38, sh: [.18, -.12], el: [.35, .45], hip: [.05, -.08], kn: [.02, .06], hair: 'short', hood: true, coat: 1 },
      { dress: DRESS.amber, light: { x: 800, y: 720, col: C.amberHot, a: .5 }, rim: '#ffd9a0', rimSide: 1, rimW: 1.6 });
  }
  // ---- labels: right column, dotted leaders from the right flank of each level
  { const x = 1460, g = ctx.createLinearGradient(x - 300, 0, x + 120, 0); g.addColorStop(0, 'rgba(5,8,22,0)'); g.addColorStop(1, 'rgba(5,8,22,.5)'); ctx.fillStyle = g; ctx.fillRect(x - 300, 0, W, H);
    for (let b = 0; b < 5; b++) {
      const ym = b === 4 ? mix(BANDS[4], BANDS[5], .3) : mix(BANDS[b], BANDS[b + 1], .55), xr = edge(ym, 1) + 16, on = b === 0;
      ctx.strokeStyle = rgba(on ? C.amber : '#cdd7ee', on ? .7 : .4); ctx.lineWidth = 1.2; ctx.setLineDash([2, 5]); ctx.beginPath(); ctx.moveTo(xr, ym); ctx.lineTo(x - 18, ym); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = on ? C.amber : '#cdd7ee'; ctx.beginPath(); ctx.arc(xr, ym, on ? 4 : 3, 0, 7); ctx.fill();
      text(ctx, LV[b], x, ym + 12, { size: on ? 40 : 34, font: 'Instrument Serif', color: on ? '#ffe2b8' : '#cdd7ee', alpha: on ? 1 : .78 });
    }
    ctx.fillStyle = C.amber; ctx.fillRect(x, 62, 28, 2); text(ctx, 'MASLOW’S HIERARCHY OF NEEDS', x, 94, { size: 16, weight: 600, color: '#a9b6d6', spacing: 6 });
  }
  printFinish(ctx, { grain: .09, vig: .5 });
  save(cv, out);
}
frame(process.argv[2] || 'a1.png');
