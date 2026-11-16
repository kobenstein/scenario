// "Which one we're heading for comes down to a few choices. Some of them got made this summer."
// A big round table in a dim hall, seen from above. Twelve people lean in and talk. Above them hangs a large
// cyan ring of light: the thing they are deciding about. On "made" one of them stands and raises a hand.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, label, out } = L;
const { figure } = require('./s_timeline');

const T0 = 54.5, T1 = 61.36;

let PAT = null;
function grainFill(ctx, pathFn, fill, grain = 0.5, box = null) {
  ctx.save(); ctx.beginPath(); pathFn(ctx); ctx.fillStyle = fill; ctx.fill();
  if (grain > 0) {
    if (!PAT) PAT = ctx.createPattern(L.tex().dark, 'repeat');
    ctx.clip(); ctx.globalAlpha = grain; ctx.fillStyle = PAT;
    if (box) ctx.fillRect(box[0], box[1], box[2], box[3]); else ctx.fillRect(-300, -300, W + 600, H + 600);
  }
  ctx.restore();
}

const CX = 960, CY = 715, RX = 455, RY = 165;        // table top
const RING = [960, 215, 300, 54];                     // the ring of light: centre, radii
const RAISER = 10;                                    // index of the person who stands up
const R = rng(54);
const PALS = [['#f0a25a', '#b8622a', '#4a1e0c'], ['#ffc27c', '#cf7a36', '#5a2a12'], ['#d9824a', '#9a4a22', '#3a160a'], ['#e8964e', '#a85424', '#401a0a']];
const PEOPLE = Array.from({ length: 12 }, (_, k) => {
  const th = (15 + k * 30) * Math.PI / 180, cs = Math.cos(th), sn = Math.sin(th);
  return { k, th, cs, sn, x: CX + (RX + 62) * cs, y: sn < 0 ? CY + (RY + 4) * sn + 40 : CY + (RY + 50) * sn + 10, s: lerp(0.6, 1.0, (sn + 1) / 2), ph: R() * 10, gest: R() * 6, pal: PALS[k % 4], front: sn < 0 };
});
const PAPERS = PEOPLE.map(p => ({ u: 0.66 + R() * 0.08, rot: (R() - 0.5) * 0.6, dx: (R() - 0.5) * 40, glass: R() < 0.75, gs: R() < 0.5 ? -1 : 1 }));
const MOTES = Array.from({ length: 40 }, () => [R(), R(), R()]);

function ringDraw(ctx, t, pulse) {
  const [x, y, rx, ry] = RING, tilt = 0.02 * Math.sin(t * 0.4), bob = Math.sin(t * 0.8) * 4;
  // hanging wires
  ctx.strokeStyle = 'rgba(143,230,255,0.18)'; ctx.lineWidth = 1.2;
  for (const a of [0.3, 1.25, 2.2, 3.6]) { const px = x + Math.cos(a) * rx, py = y + bob + Math.sin(a) * ry; ctx.beginPath(); ctx.moveTo(px, -100); ctx.lineTo(px, py); ctx.stroke(); }
  // light falling from the ring onto the table
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const k of [1.0, 0.8, 0.6, 0.4]) {
    ctx.fillStyle = lin(ctx, 0, y, 0, CY + 40, [[0, rgba(C.cyan, 0.035 * pulse)], [1, rgba(C.cyan, 0.0)]]);
    ctx.beginPath(); ctx.moveTo(x - rx * k, y + bob); ctx.lineTo(x + rx * k, y + bob); ctx.lineTo(CX + RX * 0.95 * k, CY + 40); ctx.lineTo(CX - RX * 0.95 * k, CY + 40); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  ctx.save(); ctx.translate(x, y + bob); ctx.rotate(tilt);
  light(ctx, 0, 0, rx * 1.6, C.cyan, 0.26 * pulse);
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [w, a, col] of [[60, 0.05, C.cyan], [34, 0.10, C.cyan], [18, 0.22, C.cyan], [9, 0.5, C.cyan], [3.5, 0.95, C.cyanW]]) {
    ctx.strokeStyle = rgba(col, a * pulse); ctx.lineWidth = w; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
  }
  // a brighter arc travelling around the ring
  const a0 = t * 0.9;
  ctx.strokeStyle = rgba(C.cyanW, 0.6 * pulse); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, a0, a0 + 0.9); ctx.stroke();
  ctx.strokeStyle = rgba(C.cyanW, 0.35 * pulse); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, a0 + Math.PI, a0 + Math.PI + 0.5); ctx.stroke();
  ctx.restore();
  ctx.restore();
}

function person(ctx, p, t, st, pass) {
  const { s, cs, sn } = p, b = Math.sin(t * 1.6 + p.ph);
  const front = p.front;                        // far side of the table, facing us
  const w = 0.72 + 0.28 * Math.abs(sn);
  // talking: every few seconds a hand lifts and turns
  const g = (t + p.gest) % 4.2, gest = g < 1.2 ? Math.sin((g / 1.2) * Math.PI) : 0;
  const lookRaiser = p.k === RAISER ? 0 : ramp(t, 58.55, 59.1);
  const toCentre = -cs * 0.55, toRaiser = clamp((PEOPLE[RAISER].x - p.x) / 500, -0.9, 0.9);
  const turn = lerp(toCentre + 0.12 * Math.sin(t * 0.5 + p.ph), toRaiser, lookRaiser) * (front ? 1 : -1);
  const lean = -cs * 0.14 + 0.03 * Math.sin(t * 0.7 + p.ph);
  let hx = p.x, hy = p.y + b * 1.2 * s;
  const opts = { s, w, br: b, facing: front ? 'front' : 'back', lean, turn, tilt: 0.08 * Math.sin(t * 1.3 + p.ph) * gest + (front ? 0.12 : 0), lx: cs > 0 ? -1 : 1, pal: p.pal, grain: 0.38 };
  if (front) {
    // hands on the table in front of them, one lifting when they talk
    const dir = -Math.sign(cs || 1);
    const hand = (side, g2) => ({ tx: hx + side * 30 * s * w + dir * 14 * s - g2 * side * 8 * s, ty: hy + 8 * s - g2 * 42 * s, bend: side < 0 ? -1 : 1 });
    opts.arms = [hand(-1, cs > 0 ? 0 : gest), hand(1, cs > 0 ? gest : 0)];
    if (st !== undefined) {
      // the one who stands: hips rise, the right arm goes up and stays up
      const up = ramp(t, 58.3, 58.75), arm = ramp(t, 58.35, 58.9);
      hy -= 40 * s * out(up); opts.lean = lerp(lean, 0.02, up); opts.tilt = lerp(opts.tilt, -0.15, up); opts.turn = lerp(turn, 0.15, up);
      
      const raise = { tx: lerp(hx + 30 * s, hx + 52 * s + Math.sin(t * 2.2) * 3 * s, out(arm)) + Math.sin(arm * Math.PI) * 70 * s, ty: lerp(hy - 8 * s, hy - 300 * s + Math.sin(t * 1.7) * 4 * s, out(arm)), bend: 1 };
      opts.arms = [{ tx: hx - 34 * s, ty: hy + 8 * s + 50 * s * up, bend: -1 }, arm > 0 ? raise : opts.arms[1]];
    }
    // the chair back behind them
    if (pass !== 'arms') grainFill(ctx, c => { const cw = 62 * s * w; c.moveTo(hx - cw, hy); c.lineTo(hx - cw * 0.92, hy - 150 * s); c.quadraticCurveTo(hx, hy - 172 * s, hx + cw * 0.92, hy - 150 * s); c.lineTo(hx + cw, hy); c.closePath(); },
      lin(ctx, 0, hy - 160 * s, 0, hy, [[0, '#211c48'], [1, '#0c0a20']]), 0.5, [hx - 80 * s, hy - 180 * s, 160 * s, 190 * s]);
  } else {
    // near side, seen from behind: elbows out on the table
    opts.arms = [{ a1: 2.35 - 0.2 * (cs < 0 ? gest : 0), a2: -0.45 - (cs < 0 ? gest * 0.5 : 0), behind: true }, { a1: 0.8 + 0.2 * (cs > 0 ? gest : 0), a2: -2.7 + (cs > 0 ? gest * 0.5 : 0), behind: true }];
    opts.rim = C.cyan; opts.rimA = 0.35; opts.rimDx = 0; opts.rimDy = -3;
  }
  opts.x = hx; opts.y = hy;
  if (pass === 'arms') opts.only = 'arms'; else if (pass === 'body') opts.noArms = true;
  figure(ctx, opts);
  if (!front) {
    // their chair back, between us and them
    const cw = 58 * s * w, cy = hy + 6 * s;
    grainFill(ctx, c => { c.moveTo(hx - cw, cy + 90 * s); c.lineTo(hx - cw * 0.95, cy - 42 * s); c.quadraticCurveTo(hx, cy - 58 * s, hx + cw * 0.95, cy - 42 * s); c.lineTo(hx + cw, cy + 90 * s); c.closePath(); },
      lin(ctx, 0, cy - 50 * s, 0, cy + 90 * s, [[0, '#2a2458'], [0.25, '#16133a'], [1, '#07071a']]), 0.5, [hx - 80 * s, cy - 70 * s, 160 * s, 170 * s]);
    ctx.strokeStyle = rgba(C.cyan, 0.22); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hx - cw * 0.95, cy - 42 * s); ctx.quadraticCurveTo(hx, cy - 58 * s, hx + cw * 0.95, cy - 42 * s); ctx.stroke();
  }
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 11) * 6, dy = drift(t, 1, 12) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H * 0.55); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H * 0.55 + dy * par); fn(); ctx.restore(); };
  const made = ramp(t, 58.3, 58.9);
  const pulse = 0.92 + 0.08 * Math.sin(t * 2.1) + 0.05 * Math.sin(t * 7.3);

  // the hall: tall dark windows and columns, a floor falling into shadow
  layer(0.3, () => {
    grainFill(ctx, c => c.rect(-300, -300, W + 600, 820), lin(ctx, 0, 0, 0, 520, [[0, '#080a20'], [1, '#141638']]), 0.55, [-300, -300, W + 600, 820]);
    for (let k = 0; k < 7; k++) {
      const x = 120 + k * 290;
      grainFill(ctx, c => c.rect(x, 40, 150, 420), lin(ctx, 0, 40, 0, 460, [[0, '#0e1a40'], [1, '#1a2a58']]), 0.5, [x, 40, 150, 420]);
      ctx.fillStyle = 'rgba(5,6,18,0.9)'; ctx.fillRect(x + 72, 40, 6, 420); ctx.fillRect(x, 200, 150, 5);
      ctx.fillStyle = rgba(C.cyan, 0.04 + 0.02 * Math.sin(t * 0.6 + k)); ctx.fillRect(x + 8, 48, 60, 146);
      grainFill(ctx, c => c.rect(x + 175, -40, 90, 560), lin(ctx, x + 175, 0, x + 265, 0, [[0, '#121232'], [1, '#07071a']]), 0.5, [x + 175, -40, 90, 560]);
    }
    grainFill(ctx, c => c.rect(-300, 470, W + 600, 900), lin(ctx, 0, 470, 0, H, [[0, '#1a1a44'], [0.5, '#121236'], [1, '#07071a']]), 0.55, [-300, 470, W + 600, 900]);
    light(ctx, CX, CY, 900, C.cyanD, 0.18 * pulse);
    // haze drifting through the hall
    for (let k = 0; k < 5; k++) { const x = ((k * 520 + t * 14) % 2600) - 340, y = 420 + k * 30; ctx.save(); ctx.translate(x, y); ctx.scale(3, 1);
      ctx.fillStyle = rad(ctx, 0, 0, 0, 140, [[0, 'rgba(120,130,200,0.06)'], [1, 'rgba(120,130,200,0)']]); ctx.fillRect(-140, -140, 280, 280); ctx.restore(); }
  });

  const far = PEOPLE.filter(p => p.front).sort((a, b) => a.y - b.y), near = PEOPLE.filter(p => !p.front).sort((a, b) => a.y - b.y);
  layer(0.7, () => {
    // shadow pool under the table
    ctx.fillStyle = rad(ctx, CX, CY + 60, 0, RX * 1.3, [[0, 'rgba(4,4,16,0.6)'], [1, 'rgba(4,4,16,0)']]);
    ctx.save(); ctx.translate(CX, CY + 60); ctx.scale(1, 0.4); ctx.translate(-CX, -(CY + 60)); ctx.fillRect(CX - RX * 1.4, CY + 60 - RX * 1.4, RX * 2.8, RX * 2.8); ctx.restore();
    far.forEach(p => person(ctx, p, t, p.k === RAISER ? 1 : undefined, 'body'));
    // table: thick round slab
    grainFill(ctx, c => { c.ellipse(CX, CY + 26, RX, RY, 0, 0, Math.PI); c.lineTo(CX - RX, CY); c.ellipse(CX, CY, RX, RY, 0, Math.PI, 0, true); c.closePath(); }, lin(ctx, CX - RX, 0, CX + RX, 0, [[0, '#0e0c26'], [0.5, '#1a1640'], [1, '#0e0c26']]), 0.5, [CX - RX, CY - 10, 2 * RX, RY + 50]);
    const top = c => c.ellipse(CX, CY, RX, RY, 0, 0, Math.PI * 2);
    grainFill(ctx, top, rad(ctx, CX, CY - 30, 40, RX, [[0, '#3a3470'], [0.7, '#262052'], [1, '#1a1640']]), 0.5, [CX - RX, CY - RY, 2 * RX, 2 * RY]);
    ctx.save(); ctx.beginPath(); top(ctx); ctx.clip();
    // cold light from the ring, warm light rising from the table on "made"
    light(ctx, CX, CY - 20, RX * 0.9, C.cyan, 0.16 * pulse * (1 - 0.4 * made));
    ctx.save(); ctx.translate(CX, CY); ctx.scale(1, RY / RX); light(ctx, 0, 0, RX * 1.05, C.amber, 0.06 + 0.36 * made); light(ctx, 0, 0, RX * 0.45, '#ffd9a0', 0.03 + 0.16 * made); ctx.restore();
    ctx.restore();
    ctx.strokeStyle = rgba(C.cyanW, 0.18); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(CX, CY, RX, RY, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    // papers and water glasses at every seat
    PEOPLE.forEach((p, i) => {
      const P = PAPERS[i], px = CX + (RX * P.u) * p.cs + P.dx * 0.3, py = CY + (RY * P.u) * p.sn;
      const sc = lerp(0.75, 1.05, (p.sn + 1) / 2);
      ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc * 0.5); ctx.rotate(P.rot + p.th + Math.PI / 2);
      ctx.fillStyle = 'rgba(4,4,16,0.35)'; ctx.fillRect(-22, -28, 46, 60);
      grainFill(ctx, c => c.rect(-24, -32, 46, 60), lin(ctx, 0, -32, 0, 28, [[0, '#ebe4d0'], [1, '#b0a89c']]), 0.25, [-30, -40, 60, 76]);
      ctx.fillStyle = 'rgba(40,36,70,0.5)'; for (let j = 0; j < 4; j++) ctx.fillRect(-18, -24 + j * 10, 30 - (j % 2) * 10, 3);
      ctx.restore();
      if (P.glass) {
        const gx = px + P.gs * 34 * sc, gy = py - 6 * sc;
        ctx.fillStyle = rgba(C.cyanW, 0.18); ctx.fillRect(gx - 5 * sc, gy - 16 * sc, 10 * sc, 16 * sc);
        ctx.fillStyle = rgba(C.cyan, 0.32); ctx.fillRect(gx - 5 * sc, gy - 8 * sc, 10 * sc, 8 * sc);
        ctx.strokeStyle = rgba(C.cyanW, 0.5); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(gx, gy - 16 * sc, 5 * sc, 1.8 * sc, 0, 0, Math.PI * 2); ctx.stroke();
        light(ctx, gx, gy - 10 * sc, 14 * sc, C.cyanW, 0.25);
      }
    });
    far.forEach(p => person(ctx, p, t, p.k === RAISER ? 1 : undefined, 'arms'));
    near.forEach(p => person(ctx, p, t));
  });

  // the ring, hanging over all of them
  layer(0.45, () => {
    ringDraw(ctx, t, pulse);
    // fine motes drifting down through its light
    for (const [a, b, c] of MOTES) {
      const ph = (b + t * (0.05 + c * 0.05)) % 1, x = RING[0] + (a - 0.5) * RING[2] * 1.8 + Math.sin(t * 0.7 + a * 9) * 10, y = RING[1] + 30 + ph * 420;
      ctx.fillStyle = rgba(C.cyanW, 0.35 * Math.sin(ph * Math.PI)); ctx.beginPath(); ctx.arc(x, y, 1.2 + c * 1.5, 0, Math.PI * 2); ctx.fill();
    }
  });

  label(ctx, t, 58.9, 61.3, 'This summer', 'the first choices were made', 110, 130);
}

module.exports = { T0, T1, draw };
