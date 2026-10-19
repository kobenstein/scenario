// "Until recently, nobody could look inside and check."
// The model as a huge black cube. A small person walks up with a lamp and raises it; the warm light only
// slides over the cube's skin, it cannot get in. They move the lamp along the face, searching, nothing.
const L = require('./lib');
const { W, H, C, clamp, sm, ramp, lerp, drift, rng, lin, rad, rgba, light, out } = L;
const { figure, ik, capsule } = require('./s_timeline');
const { cube, grainFill, poly } = require('./s_k6_key');

const T0 = 344.15, T1 = 348.05;

const R = rng(344);
const DUST = Array.from({ length: 60 }, () => [R(), R(), R(), R()]);
const CUBE = [760, 330, 330];

function room(ctx, t) {
  grainFill(ctx, c => c.rect(-300, -300, W + 600, 1060), lin(ctx, 0, 0, 0, 720, [[0, '#070918'], [0.7, '#141640'], [1, '#221f4c']]), 0.55, [-300, -300, W + 600, 1060]);
  grainFill(ctx, c => c.rect(-300, 720, W + 600, 700), lin(ctx, 0, 720, 0, H, [[0, '#1a1744'], [1, '#07071a']]), 0.6, [-300, 720, W + 600, 700]);
  light(ctx, 760, 690, 900, C.violet, 0.25);
}

// the lamp the person holds (a small hand lantern); returns its flame position
function handLamp(ctx, hx, hy, t, sw) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(sw);
  ctx.strokeStyle = '#2a1608'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 16); ctx.stroke();
  ctx.fillStyle = '#3a1a0c'; ctx.fillRect(-15, 14, 30, 7); ctx.fillRect(-15, 58, 30, 7);
  grainFill(ctx, c => { c.moveTo(-12, 21); c.lineTo(12, 21); c.lineTo(14, 58); c.lineTo(-14, 58); c.closePath(); }, rad(ctx, 0, 40, 2, 22, [[0, '#fff3d6'], [0.5, '#ffc070'], [1, '#c9702e']]), 0.2, [-20, 10, 40, 60]);
  ctx.restore();
  return [hx - Math.sin(sw) * 40, hy + Math.cos(sw) * 40];
}

// a figure in a long coat: body from the rig, a coat laid over torso and thighs, then the arms.
// The arms are drawn here (not by the rig) so they hang from the coat's rounded shoulder caps at the outer
// edge of the torso: tapered sleeves, a cuff and a small rounded hand. Hand positions match the rig's.
function coated(ctx, f, coat = ['#d27a34', '#8a4019', '#3a160a']) {
  const arms = f.arms || [];
  const s = f.s, len = 118 * s * (f.len ?? 1), lean = f.lean || 0, cs = Math.cos(lean), sn = Math.sin(lean);
  const P = (x, y) => [f.x + x * cs - y * sn, f.y + x * sn + y * cs];
  const sw = 47 * s, hem = 74 * s * (f.hem ?? 1), fl = (f.flap || 0) * s;
  const pal = f.pal || ['#f0a25a', '#b8622a', '#4a1e0c'], skin = f.skin || ['#ffd29a', '#e0904a', '#7a3b17'];
  const box = [f.x - 200 * s, f.y - 260 * s, 400 * s, 400 * s];
  // ---- arms: same hand positions as the rig would give, re-solved from shoulder joints at the coat's edge
  const UA = 60 * s, FA = 56 * s, rsw = 46 * s * (f.w ?? 1) * (1 + (f.br || 0) * 0.012);
  const A = arms.map((sp, i) => {
    if (!sp) return null;
    const side = i === 0 ? -1 : 1, o = P(side * rsw * 0.78, -len * 0.88);
    let h, e0 = null;
    if (sp.tx !== undefined) h = [sp.tx, sp.ty];
    else { e0 = [o[0] + Math.cos(sp.a1) * UA, o[1] + Math.sin(sp.a1) * UA]; h = [e0[0] + Math.cos(sp.a2) * FA, e0[1] + Math.sin(sp.a2) * FA]; }
    const J = P(side * sw * 0.8, -len * 0.855);
    const sol = bd => { const [a1, a2] = ik(J[0], J[1], h[0], h[1], UA, FA, bd); const e = [J[0] + Math.cos(a1) * UA, J[1] + Math.sin(a1) * UA]; return { e, h: [e[0] + Math.cos(a2) * FA, e[1] + Math.sin(a2) * FA], a2 }; };
    let bend = sp.bend;
    if (bend === undefined) { const p1 = sol(1).e, p2 = sol(-1).e; bend = Math.hypot(p1[0] - e0[0], p1[1] - e0[1]) <= Math.hypot(p2[0] - e0[0], p2[1] - e0[1]) ? 1 : -1; }
    const r = sol(bend);
    // a back-view arm raised above the shoulder reaches away from us: its root goes behind the coat
    const up = f.facing === 'back' && !sp.behind ? clamp((J[1] - r.h[1] + 6 * s) / (44 * s)) : 0;
    return { J, ...r, side, behind: !!sp.behind, dark: sp.dark ?? sp.behind, up };
  });
  const sleeve = (L, a = 1) => {
    if (!L || a <= 0) return;
    const { J, e, h, a2 } = L;
    const fill = lin(ctx, J[0], J[1], h[0], h[1], L.dark ? [[0, pal[1]], [1, pal[2]]] : [[0, pal[0]], [0.6, pal[1]], [1, pal[2]]]);
    const cuffA = [h[0] - Math.cos(a2) * 11 * s, h[1] - Math.sin(a2) * 11 * s];
    const hc = [h[0] + Math.cos(a2) * 3 * s, h[1] + Math.sin(a2) * 3 * s];
    const parts = [
      [c => { capsule(c, J[0], J[1], 11.5 * s, e[0], e[1], 9.6 * s); }, fill],
      [c => { capsule(c, e[0], e[1], 9.6 * s, cuffA[0], cuffA[1], 8.6 * s); }, fill],
      [c => { capsule(c, cuffA[0], cuffA[1], 8.6 * s, h[0] - Math.cos(a2) * 4 * s, h[1] - Math.sin(a2) * 4 * s, 8.2 * s); }, rgba(pal[2], L.dark ? 0.75 : 0.55)],
      [c => c.ellipse(hc[0], hc[1], 7.6 * s, 6.4 * s, a2, 0, Math.PI * 2), lin(ctx, hc[0] - 6 * s, hc[1] - 6 * s, hc[0] + 6 * s, hc[1] + 6 * s, L.dark ? [[0, skin[1]], [1, skin[2]]] : [[0, skin[0]], [0.5, skin[1]], [1, skin[2]]])],
    ];
    ctx.save(); ctx.globalAlpha *= a;
    if (f.rim) { ctx.save(); ctx.translate(f.rimDx ?? -3, f.rimDy ?? -2); for (const [p] of parts) grainFill(ctx, p, rgba(f.rim, f.rimA ?? 0.9), 0); ctx.restore(); }
    for (const [p, fl2] of parts) grainFill(ctx, p, fl2, f.grain ?? 0.42, box);
    ctx.restore();
  };
  // arms behind the body (and back-view arms raised away from us) go first: torso, head and coat cover their roots
  A.filter(L => L && (L.behind || L.up > 0)).forEach(L => sleeve(L));
  const body = figure(ctx, { ...f, arms: [] });
  // ---- the coat: sloping shoulders into rounded caps, a little narrower under the arms, then the skirt
  const coatPath = c => {
    const q = (x, y) => P(x * sw, y * len);
    const m = (x, y) => { const p = q(x, y); c.moveTo(p[0], p[1]); }, l = (x, y) => { const p = q(x, y); c.lineTo(p[0], p[1]); };
    const qd = (ax, ay, bx, by) => { const a = q(ax, ay), b = q(bx, by); c.quadraticCurveTo(a[0], a[1], b[0], b[1]); };
    const bz = (ax, ay, bx, by, dx, dy) => { const a = q(ax, ay), b = q(bx, by), d = q(dx, dy); c.bezierCurveTo(a[0], a[1], b[0], b[1], d[0], d[1]); };
    m(-0.56, -1.02); qd(-0.78, -1.0, -0.93, -0.94); qd(-1.06, -0.88, -1.04, -0.76);
    bz(-1.0, -0.64, -0.95, -0.52, -0.97, -0.4);
    const h1 = P(-sw * 0.9 - fl, hem), h2 = P(sw * 0.9 - fl * 0.6, hem + 3 * s); c.lineTo(h1[0], h1[1]); c.lineTo(h2[0], h2[1]);
    l(0.97, -0.4); bz(0.95, -0.52, 1.0, -0.64, 1.04, -0.76); qd(1.06, -0.88, 0.93, -0.94); qd(0.78, -1.0, 0.56, -1.02);
    c.closePath();
  };
  if (f.rim) { ctx.save(); ctx.translate(f.rimDx ?? -3, f.rimDy ?? -2); grainFill(ctx, coatPath, rgba(f.rim, (f.rimA ?? 0.9)), 0); ctx.restore(); }
  grainFill(ctx, coatPath, lin(ctx, f.x + (f.lx ?? -1) * sw, f.y - len, f.x - (f.lx ?? -1) * sw, f.y + hem, [[0, coat[0]], [0.5, coat[1]], [1, coat[2]]]), 0.45, box);
  // centre seam / back vent, a belt line, and soft armhole seams under the shoulder caps
  const a = P(0, -len * 0.95), b = P(0, hem), c1 = P(-sw * 0.95, -len * 0.05), c2 = P(sw * 0.95, -len * 0.05);
  ctx.strokeStyle = rgba(coat[2], 0.6); ctx.lineWidth = 2.5 * s; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
  ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(c1[0], c1[1]); ctx.lineTo(c2[0], c2[1]); ctx.stroke();
  ctx.strokeStyle = rgba(coat[2], 0.35); ctx.lineWidth = 2 * s; ctx.lineCap = 'round';
  for (const sd of [-1, 1]) { const p0 = P(sd * sw * 0.66, -len * 0.97), p1 = P(sd * sw * 0.6, -len * 0.82), p2 = P(sd * sw * 0.74, -len * 0.66);
    ctx.beginPath(); ctx.moveTo(p0[0], p0[1]); ctx.quadraticCurveTo(p1[0], p1[1], p2[0], p2[1]); ctx.stroke(); }
  // collar
  const k1 = P(-sw * 0.6, -len * 1.01), k2 = P(sw * 0.6, -len * 1.01), k3 = P(0, -len * 0.9);
  grainFill(ctx, c => { c.moveTo(k1[0], k1[1]); c.lineTo(k2[0], k2[1]); c.lineTo(k3[0], k3[1]); c.closePath(); }, coat[2], 0);
  // arms in front of the coat (a raised back-view arm fades out of this layer as it goes up)
  A.filter(L => L && !L.behind).forEach(L => sleeve(L, 1 - L.up));
  return { head: body.head, shoulders: A.map(L => L && L.J), hands: A.map(L => L && L.h) };
}

function boxShot(ctx, t, opt = {}) {
  const z = lerp(1.0, 1.08, sm((t - T0) / (T1 - T0))) * (opt.zoom || 1);
  const dx = drift(t, 1, 3) * 6, dy = drift(t, 1, 5) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  // person: walks in from the right, stops, raises the lamp on "look", sweeps it on "check"
  const walk = clamp((t - T0) / 1.2), px = lerp(1640, 1440, out(walk)), step = (1 - out(walk));
  const raise = ramp(t, 346.2, 346.75), sweep = Math.sin(clamp((t - 347.1) / 1.4) * Math.PI * 1.5) * ramp(t, 347.0, 347.4);
  const b = Math.sin(t * 1.7);
  const hip = [px, 842 + b * 1.2 - Math.abs(Math.sin(t * 7)) * 6 * step];
  const hand = [px - lerp(60, 150, raise) - sweep * 40, hip[1] - lerp(70, 250, raise) + sweep * 50];
  const sw = Math.sin(t * 2.3) * 0.08 * (1 - raise) + Math.sin(t * 7) * 0.12 * step;
  // lamp light
  const fl = [hand[0] - Math.sin(sw) * 40, hand[1] + Math.cos(sw) * 40];
  const flick = 0.92 + 0.08 * Math.sin(t * 13) * Math.sin(t * 4.1);
  layer(0.4, () => room(ctx, t));
  layer(0.8, () => {
    const g = cube(ctx, CUBE[0], CUBE[1], CUBE[2], 0.25 + 0.1 * Math.sin(t * 1.3), t, opt.open || 0);
    // the lamp's light lands on the cube's right face only as a pool on its surface: it cannot get in
    ctx.save(); ctx.beginPath(); poly([g.B, g.R, g.RB, g.BB])(ctx); ctx.clip();
    const lp = [lerp(g.R[0], fl[0], 0.0) - 60 - sweep * 60, fl[1] + 30];
    light(ctx, lp[0], lp[1], lerp(160, 300, raise), C.amber, (0.12 + 0.32 * raise) * flick);
    ctx.restore();
    // a thin bright rim where the light grazes the edge, then black
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.amber, 0.35 * raise * flick); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(g.R[0], g.R[1]); ctx.lineTo(g.RB[0], g.RB[1]); ctx.stroke(); ctx.restore();
    light(ctx, fl[0], fl[1], 520, C.amber, 0.28 * flick);
    // floor pool of lamp light around the person
    ctx.save(); ctx.translate(px - 40, 960); ctx.scale(1, 0.25); light(ctx, 0, 0, 420, C.amber, 0.3 * flick); ctx.restore();
    // the person's long shadow toward the cube
    ctx.fillStyle = 'rgba(3,3,12,0.45)'; ctx.beginPath(); ctx.moveTo(px - 30, 966); ctx.lineTo(px + 30, 966); ctx.lineTo(px - 300, 1010); ctx.lineTo(px - 360, 990); ctx.closePath(); ctx.fill();
    // figure
    const ph = t * 7, st = step;
    const legs = [{ a1: 1.62 + Math.sin(ph) * 0.35 * st, a2: 1.6 + Math.max(0, Math.sin(ph)) * 0.5 * st }, { a1: 1.5 - Math.sin(ph) * 0.35 * st, a2: 1.55 + Math.max(0, -Math.sin(ph)) * 0.5 * st, behind: true }];
    coated(ctx, { x: hip[0], y: hip[1], s: 1.25, len: 0.98, facing: 'back', br: b, lean: -0.03 - 0.05 * raise, turn: lerp(-0.45, -0.75, raise) + sweep * 0.1, tilt: lerp(0.05, -0.18, raise), lx: -1, flap: 6 * st * Math.sin(ph),
      rim: C.amber, rimA: 0.55, rimDx: -4, rimDy: -2, pal: ['#e8964e', '#a85424', '#401a0a'],
      arms: [{ tx: hand[0], ty: hand[1], bend: 1 }, { tx: px + 34, ty: hip[1] + 14 + Math.sin(ph) * 10 * st, bend: -1 }], legs });
    handLamp(ctx, hand[0], hand[1], t, sw);
    light(ctx, fl[0], fl[1], 70, '#ffe2b0', 0.8 * flick);
  });
  // dust floating through the lamp light
  for (const [u, v, s, p] of DUST) {
    const x = 900 + u * 900 + Math.sin(t * 0.5 + p * 9) * 20, y = 200 + ((v + t * 0.015 * (0.5 + s)) % 1) * 760;
    const near = Math.exp(-Math.hypot(x - fl[0], y - fl[1]) / 260);
    ctx.fillStyle = rgba('#ffe2b0', 0.5 * near * (0.4 + s)); ctx.beginPath(); ctx.arc(x, y, 1 + s * 1.5, 0, Math.PI * 2); ctx.fill();
  }
}

function draw(ctx, t) { boxShot(ctx, t); }

module.exports = { T0, T1, draw, boxShot, CUBE, coated };
