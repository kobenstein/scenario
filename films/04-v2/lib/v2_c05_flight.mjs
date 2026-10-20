// Chunk c05 · the flight over the city (shots 5.07, 5.08): the viaduct with the packed commuter train, the factory with its worn stone
// steps and the pair of work shoes whose laces the plane's wake lifts. Same world and camera as v2_c05_city.mjs (metres, y down, the
// camera looks along +z). Drawn between the far rows and the near row by drawOutside (S.mid).
import { rgba, clamp, mix, prng, poly3, mixHex, shade, TAU } from './v2_c05_kit.mjs';

export const VIA = { z: 36, zf: 40.4, deck: 4.0, top: 3.3, x0: -44, x1: 44, foot: 16, span: 10, pier: 1.8, spring: 9.0 };
export const TRAIN = { z: 36.3, zf: 39.1, top: .3, bot: 3.65, car: 18, gap: .9, n: 5 };
export const FAC = { z: 44, ground: 12, x0: -14, x1: 12, eave: -1.5, door: { x0: -1.0, x1: 1.4, cy: 8.6, r: 1.2 } };
export const STEPS = [{ z0: 42.35, z1: 42.9, y: 11.83 }, { z0: 42.9, z1: 43.45, y: 11.66 }, { z0: 43.45, z1: 44, y: 11.49 }];
export const SHOES = { x: .12, z: 43.62, y: 11.49 };
const SX0 = -2.2, SX1 = 2.6;

// draw in metres on the frontal plane Z (undistorted with this camera); returns the visible rect on that plane
function onPlane(ctx, cam, Z, f) {
  if (Z - cam.z < .3) return;
  const o = cam.P(0, 0, Z); if (!o) return; const k = o[2];
  const vis = [(0 - o[0]) / k, (0 - o[1]) / k, (1920 - o[0]) / k, (1080 - o[1]) / k];
  ctx.save(); ctx.translate(o[0], o[1]); ctx.scale(k, k); f(k, vis); ctx.restore();
}

// ---------------------------------------------------------------- the viaduct and the train
function trainCar(ctx, k, xa, xb, first, seed) {
  const T = TRAIN, r = prng(seed);
  // body: teal, a cream band, darker skirt; the front car has a rounded nose with a dark windscreen
  ctx.fillStyle = '#2f5464'; ctx.beginPath();
  if (first) { ctx.moveTo(xa + 1.4, T.top); ctx.lineTo(xb, T.top); ctx.lineTo(xb, T.bot); ctx.lineTo(xa, T.bot); ctx.lineTo(xa, T.top + 1.9); ctx.quadraticCurveTo(xa + .1, T.top + .2, xa + 1.4, T.top); }
  else { ctx.moveTo(xa, T.top + .25); ctx.quadraticCurveTo(xa, T.top, xa + .25, T.top); ctx.lineTo(xb - .25, T.top); ctx.quadraticCurveTo(xb, T.top, xb, T.top + .25); ctx.lineTo(xb, T.bot); ctx.lineTo(xa, T.bot); }
  ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip();
  const g = ctx.createLinearGradient(0, T.top, 0, T.bot); g.addColorStop(0, rgba('#ffe6c0', .28)); g.addColorStop(.35, rgba('#ffe6c0', 0)); g.addColorStop(1, rgba('#0e1a22', .35)); ctx.fillStyle = g; ctx.fillRect(xa, T.top, xb - xa, T.bot - T.top);
  ctx.fillStyle = '#d9cfb6'; ctx.fillRect(xa, 2.42, xb - xa, .14);
  ctx.fillStyle = '#1f3440'; ctx.fillRect(xa, 3.05, xb - xa, .6);
  ctx.restore();
  // windows (lit) with the standing commuters packed inside
  const win = (x0, w, y0, y1) => {
    const lg = ctx.createLinearGradient(0, y0, 0, y1); lg.addColorStop(0, '#fff0c8'); lg.addColorStop(1, '#f4b870');
    ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(x0, y0, w, y1 - y0, .09); ctx.fill();
    ctx.save(); ctx.clip();
    const n = 2 + Math.floor(r() * 2.6);
    for (let i = 0; i < n; i++) {
      const cx = x0 + (i + .5 + (r() - .5) * .5) * w / n, hy = y0 + .32 + r() * .14, down = r() < .35;
      ctx.fillStyle = mixHex('#2a2230', '#4a3a3a', r() * .5);
      ctx.beginPath(); ctx.ellipse(cx, hy + .52, .25, .34, 0, 0, TAU); ctx.fill();                 // shoulders
      ctx.beginPath(); ctx.ellipse(cx + (down ? .03 : 0), hy + (down ? .05 : 0), .105, .125, down ? .35 : 0, 0, TAU); ctx.fill(); // head
      if (r() < .45) { ctx.lineWidth = .07; ctx.lineCap = 'round'; ctx.strokeStyle = ctx.fillStyle; ctx.beginPath(); ctx.moveTo(cx + .16, hy + .32); ctx.lineTo(cx + .2, y0 + .02); ctx.stroke(); }   // an arm up to the rail
    }
    ctx.fillStyle = rgba('#fff6e0', .25); ctx.fillRect(x0, y0, w, .06);
    ctx.restore();
  };
  for (let x = xa + (first ? 2.4 : 1.1); x < xb - 1.4; x += 1.62) { if (Math.abs(x - (xa + 4.2)) < 1.0 || Math.abs(x - (xb - 4.4)) < 1.0) continue; win(x, 1.18, 1.0, 1.98); }
  for (const dx of [xa + 3.7, xb - 4.9]) { ctx.fillStyle = '#24404e'; ctx.fillRect(dx, .78, 1.3, 2.62); win(dx + .16, .98, 1.0, 2.0); ctx.fillStyle = rgba('#0c141a', .5); ctx.fillRect(dx + .64, .8, .03, 2.6); }
  if (first) { ctx.fillStyle = '#1a2630'; ctx.beginPath(); ctx.moveTo(xa + .12, T.top + 1.75); ctx.quadraticCurveTo(xa + .25, T.top + .35, xa + 1.5, T.top + .22); ctx.lineTo(xa + 1.75, 1.6); ctx.lineTo(xa + .12, 1.75); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba('#9fb8c8', .35); ctx.beginPath(); ctx.moveTo(xa + .5, T.top + 1.2); ctx.lineTo(xa + 1.2, T.top + .45); ctx.lineTo(xa + 1.4, T.top + .5); ctx.lineTo(xa + .7, T.top + 1.25); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#fff2d0'; ctx.beginPath(); ctx.arc(xa + .3, 2.85, .1, 0, TAU); ctx.fill(); }
}
export function drawViaduct(ctx, t, cam, S) {
  if (VIA.z - cam.z < .3) return;
  const V = VIA, T = TRAIN, front = S.trainX ?? 1e9;
  // seen from above: the far parapet, the deck with its rails, the train's roofs
  if (cam.y < V.deck - .2) {
    onPlane(ctx, cam, V.zf, () => { ctx.fillStyle = '#9a8676'; ctx.fillRect(V.x0, V.top, V.x1 - V.x0, V.deck - V.top); ctx.fillStyle = '#c4ae96'; ctx.fillRect(V.x0, V.top, V.x1 - V.x0, .12); });
    poly3(ctx, cam, [[V.x0, V.deck, V.z], [V.x1, V.deck, V.z], [V.x1, V.deck, V.zf], [V.x0, V.deck, V.zf]], '#6e625e');
    ctx.strokeStyle = '#3a3438'; ctx.lineWidth = 2;
    for (const zz of [37.0, 38.4]) { const a = cam.P(V.x0, V.deck - .02, zz), b = cam.P(V.x1, V.deck - .02, zz); if (a && b) { ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
  }
  if (front < 200) for (let i = 0; i < T.n; i++) {
    const xa = front + i * (T.car + T.gap), xb = xa + T.car;
    if (cam.y < T.top - .1) { poly3(ctx, cam, [[xa + (i ? .2 : 1.4), T.top, T.z], [xb - .2, T.top, T.z], [xb - .2, T.top, T.zf], [xa + (i ? .2 : 1.4), T.top, T.zf]], '#a7aeb2');
      const a = cam.P(xa + 1, T.top, (T.z + T.zf) / 2), b = cam.P(xb - 1, T.top, (T.z + T.zf) / 2); if (a && b) { ctx.strokeStyle = rgba('#5a6268', .7); ctx.lineWidth = Math.max(1, .05 * a[2]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
    onPlane(ctx, cam, T.z, (k) => { trainCar(ctx, k, xa, xb, i === 0, 40 + i); if (i < T.n - 1) { ctx.fillStyle = '#1a1c22'; ctx.fillRect(xb, .7, T.gap, 2.6); } });
  }
  // the near face: stone arches (evenodd holes), courses, voussoirs, the cornice and the parapet
  onPlane(ctx, cam, V.z, (k, vis) => {
    const x0 = Math.max(V.x0, vis[0] - 1), x1 = Math.min(V.x1, vis[2] + 1); if (x1 <= x0) return;
    ctx.beginPath(); ctx.rect(x0, V.top, x1 - x0, V.foot - V.top);
    const arches = [];
    for (let xa = V.x0 + V.pier; xa < V.x1; xa += V.span) { const xb = xa + V.span - V.pier, r = (xb - xa) / 2, cx = (xa + xb) / 2; if (xb < x0 - 1 || xa > x1 + 1) continue; arches.push([cx, r]);
      ctx.moveTo(xa, V.foot); ctx.lineTo(xa, V.spring); ctx.arc(cx, V.spring, r, Math.PI, 0); ctx.lineTo(xb, V.foot); ctx.closePath(); }
    const g = ctx.createLinearGradient(0, V.top, 0, V.foot); g.addColorStop(0, '#d2b496'); g.addColorStop(.25, '#b8967c'); g.addColorStop(1, '#7a6060');
    ctx.fillStyle = g; ctx.fill('evenodd');
    ctx.save(); ctx.clip('evenodd');
    ctx.strokeStyle = rgba('#4a3638', .28); ctx.lineWidth = Math.max(.6 / k, .025);
    ctx.beginPath(); for (let y = V.deck + .5; y < V.foot; y += .5) { if (y < vis[1] - 1 || y > vis[3] + 1) continue; ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke();
    ctx.strokeStyle = rgba('#4a3638', .35); ctx.beginPath();
    for (const [cx, r] of arches) for (let a = 0; a <= 18; a++) { const an = Math.PI + a / 18 * Math.PI, c = Math.cos(an), s = Math.sin(an); ctx.moveTo(cx + c * r, V.spring + s * r); ctx.lineTo(cx + c * (r + .75), V.spring + s * (r + .75)); }
    ctx.stroke();
    // the arch soffits in shade (the inner rim)
    ctx.strokeStyle = rgba('#3a2a30', .45); ctx.lineWidth = .22; ctx.beginPath(); for (const [cx, r] of arches) { ctx.moveTo(cx - r + .11, V.foot); ctx.lineTo(cx - r + .11, V.spring); ctx.arc(cx, V.spring, r - .11, Math.PI, 0); ctx.lineTo(cx + r - .11, V.foot); } ctx.stroke();
    ctx.restore();
    ctx.fillStyle = '#e2c8a8'; ctx.fillRect(x0, V.deck - .08, x1 - x0, .2);
    ctx.fillStyle = rgba('#3a2a30', .3); ctx.fillRect(x0, V.deck + .12, x1 - x0, .12);
    ctx.fillStyle = '#e8d2b4'; ctx.fillRect(x0, V.top, x1 - x0, .13);
  });
}

// ---------------------------------------------------------------- the factory: brick front, tall arched windows, the door, the steps
function facade(ctx, k, vis) {
  const F = FAC, x0 = Math.max(F.x0, vis[0] - 1), x1 = Math.min(F.x1, vis[2] + 1), D = F.door; if (x1 <= x0) return;
  // the sawtooth roof and the chimney
  ctx.fillStyle = '#4a3c46'; ctx.beginPath(); ctx.moveTo(F.x0, F.eave); for (let x = F.x0; x < F.x1; x += 4) { ctx.lineTo(x + 3, F.eave - 2.6); ctx.lineTo(x + 3, F.eave); ctx.lineTo(Math.min(F.x1, x + 4), F.eave); } ctx.lineTo(F.x1, F.eave); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba('#d8e2ea', .35); for (let x = F.x0; x < F.x1; x += 4) ctx.fillRect(x + 2.86, F.eave - 2.45, .1, 2.3);
  ctx.fillStyle = '#7e4a3a'; ctx.fillRect(7.6, -17, 1.6, 15.6); ctx.fillStyle = '#5c3a32'; ctx.fillRect(7.45, -17.6, 1.9, .7); ctx.fillRect(7.6, -12, 1.6, .25);
  // the wall
  const g = ctx.createLinearGradient(0, F.eave, 0, F.ground); g.addColorStop(0, '#a8644a'); g.addColorStop(1, '#84503e'); ctx.fillStyle = g; ctx.fillRect(F.x0, F.eave, F.x1 - F.x0, F.ground - F.eave);
  // bricks where they read (each its own tone), otherwise the course lines only
  const y0 = Math.max(F.eave, vis[1] - .2), y1 = Math.min(F.ground, vis[3] + .2), bh = .077, bw = .235;
  if (k * bh > 5) {
    const r = prng(9); for (let y = Math.floor(y0 / bh) * bh; y < y1; y += bh) { const row = Math.round(y / bh), off = (row & 1) * bw / 2;
      for (let x = Math.floor((x0 - off) / bw) * bw + off; x < x1; x += bw) { const h = ((row * 7919 + Math.round(x / bw) * 104729) % 97) / 97; ctx.fillStyle = rgba(h < .5 ? '#5a2a20' : '#e0a080', .05 + .12 * Math.abs(h - .5)); ctx.fillRect(x + .006, y + .006, bw - .012, bh - .012); } }
    void r;
    ctx.strokeStyle = rgba('#e8d0b8', .38); ctx.lineWidth = .011; ctx.beginPath();
    for (let y = Math.floor(y0 / bh) * bh; y < y1; y += bh) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); const row = Math.round(y / bh), off = (row & 1) * bw / 2; for (let x = Math.floor((x0 - off) / bw) * bw + off; x < x1; x += bw) { ctx.moveTo(x, y); ctx.lineTo(x, y + bh); } }
    ctx.stroke();
  } else { ctx.strokeStyle = rgba('#e8d0b8', .14); ctx.lineWidth = Math.max(.6 / k, .02); ctx.beginPath(); for (let y = F.eave + .3; y < F.ground; y += .3) { ctx.moveTo(x0, y); ctx.lineTo(x1, y); } ctx.stroke(); }
  // pilasters and the cornice
  ctx.fillStyle = rgba('#3a1a14', .14); for (let x = F.x0 + 1.9; x < F.x1; x += 3.8) if (Math.abs(x - .2) > 2.2) ctx.fillRect(x, F.eave, .5, F.ground - F.eave - .6);
  ctx.fillStyle = '#c8a888'; ctx.fillRect(F.x0, F.eave, F.x1 - F.x0, .32); ctx.fillStyle = rgba('#2a1a18', .3); ctx.fillRect(F.x0, F.eave + .32, F.x1 - F.x0, .1);
  // tall arched windows (iron glazing bars, the sky in the glass), soot below the sills
  for (const [cx, w, sill] of [[-10.1, 2.2, 7.1], [-6.3, 2.2, 7.1], [.2, 2.8, 6.5], [4.7, 2.2, 7.1], [8.5, 2.2, 7.1]]) {
    const top = 1.6, r = w / 2;
    ctx.fillStyle = '#c4a486'; ctx.beginPath(); ctx.moveTo(cx - r - .18, sill); ctx.lineTo(cx - r - .18, top + r); ctx.arc(cx, top + r, r + .18, Math.PI, 0); ctx.lineTo(cx + r + .18, sill); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx - r, sill); ctx.lineTo(cx - r, top + r); ctx.arc(cx, top + r, r, Math.PI, 0); ctx.lineTo(cx + r, sill); ctx.closePath();
    const gg = ctx.createLinearGradient(0, top, 0, sill); gg.addColorStop(0, '#8a90a8'); gg.addColorStop(.5, '#4a4c62'); gg.addColorStop(1, '#2c2a3a'); ctx.fillStyle = gg; ctx.fill();
    ctx.save(); ctx.clip(); ctx.strokeStyle = '#2a2026'; ctx.lineWidth = .045; ctx.beginPath(); for (let x = cx - r; x <= cx + r + .01; x += w / 5) { ctx.moveTo(x, top); ctx.lineTo(x, sill); } for (let y = top + .4; y < sill; y += .55) { ctx.moveTo(cx - r, y); ctx.lineTo(cx + r, y); } ctx.stroke(); ctx.restore();
    ctx.fillStyle = '#d8bea0'; ctx.fillRect(cx - r - .3, sill, w + .6, .2);
    const sg = ctx.createLinearGradient(0, sill + .2, 0, sill + 2.2); sg.addColorStop(0, rgba('#2a1a18', .25)); sg.addColorStop(1, rgba('#2a1a18', 0)); ctx.fillStyle = sg; ctx.fillRect(cx - r + .2, sill + .2, w - .4, 2);
  }
  // the door: stone surround, arched head with a keystone, two leaves of green planks with iron studs
  const dx0 = D.x0, dx1 = D.x1, dc = (dx0 + dx1) / 2, dr = (dx1 - dx0) / 2, yb = STEPS[2].y;
  ctx.fillStyle = '#cdb496'; ctx.beginPath(); ctx.moveTo(dx0 - .32, yb); ctx.lineTo(dx0 - .32, D.cy); ctx.arc(dc, D.cy, dr + .32, Math.PI, 0); ctx.lineTo(dx1 + .32, yb); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#e0c8a8'; ctx.beginPath(); ctx.moveTo(dc - .2, D.cy - dr - .36); ctx.lineTo(dc + .2, D.cy - dr - .36); ctx.lineTo(dc + .14, D.cy - dr + .1); ctx.lineTo(dc - .14, D.cy - dr + .1); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(dx0, yb); ctx.lineTo(dx0, D.cy); ctx.arc(dc, D.cy, dr, Math.PI, 0); ctx.lineTo(dx1, yb); ctx.closePath();
  ctx.fillStyle = '#34463a'; ctx.fill(); ctx.save(); ctx.clip();
  ctx.strokeStyle = rgba('#1a241e', .6); ctx.lineWidth = .025; ctx.beginPath(); for (let x = dx0 + .2; x < dx1; x += .2) { ctx.moveTo(x, D.cy - dr); ctx.lineTo(x, yb); } ctx.stroke();
  ctx.fillStyle = '#1a201c'; ctx.fillRect(dc - .02, D.cy - dr, .04, yb - D.cy + dr);
  ctx.fillStyle = '#2a2a2a'; for (const y of [9.0, 10.3, 11.1]) for (let x = dx0 + .12; x < dx1; x += .22) { ctx.beginPath(); ctx.arc(x, y, .025, 0, TAU); ctx.fill(); }
  const lg = ctx.createLinearGradient(dx1, 0, dx0, 0); lg.addColorStop(0, rgba('#ffd8a8', .18)); lg.addColorStop(1, rgba('#ffd8a8', 0)); ctx.fillStyle = lg; ctx.fillRect(dx0, D.cy - dr, dx1 - dx0, yb);
  ctx.restore();
  ctx.fillStyle = '#9a8a70'; ctx.fillRect(dc + .32, 9.7, .07, .3);     // the latch
  // the plinth (stone) along the foot of the wall
  ctx.fillStyle = '#9c8c7c'; ctx.fillRect(F.x0, F.ground - .55, dx0 - .32 - F.x0 - (SX1 - SX0) * 0, .55); ctx.fillRect(dx1 + .32, F.ground - .55, F.x1 - dx1 - .32, .55);
}
// worn tread: the front edge sags where the feet went (centred a little right of the door's middle)
const sag = (x) => .036 * Math.exp(-(((x - .3) / .5) ** 2));
function steps(ctx, t, cam) {
  const N = 26, xs = Array.from({ length: N + 1 }, (_, i) => SX0 + (SX1 - SX0) * i / N);
  for (let i = STEPS.length - 1; i >= 0; i--) {
    const s = STEPS[i], below = i ? STEPS[i - 1].y : FAC.ground;
    // tread (seen from above), its hollow, then the riser
    if (cam.y < s.y) {
      const pts = [[SX0, s.y, s.z1], [SX1, s.y, s.z1], ...xs.slice().reverse().map((x) => [x, s.y + sag(x), s.z0])];
      const p = poly3(ctx, cam, pts); if (p) { const g = ctx.createLinearGradient(0, Math.min(...p.map((q) => q[1])), 0, Math.max(...p.map((q) => q[1]))); g.addColorStop(0, '#b4a690'); g.addColorStop(1, '#cbbda4'); ctx.fillStyle = g; ctx.fill(); }
      const c = cam.P(.3, s.y + .02, s.z0 + .16), c2 = cam.P(.3 + .5, s.y + .02, s.z0 + .16), c3 = cam.P(.3, s.y + .02, s.z0 + .36);
      if (c && c2 && c3) { const rx = Math.abs(c2[0] - c[0]), ry = Math.max(1, Math.abs(c3[1] - c[1])); ctx.save(); ctx.translate(c[0], c[1]); ctx.scale(1, ry / rx); const hg = ctx.createRadialGradient(0, 0, 0, 0, 0, rx); hg.addColorStop(0, rgba('#6e604e', .32)); hg.addColorStop(.6, rgba('#6e604e', .14)); hg.addColorStop(1, rgba('#6e604e', 0)); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(0, 0, rx, 0, TAU); ctx.fill(); ctx.restore(); }
    }
    const rp = [...xs.map((x) => [x, s.y + sag(x), s.z0]), [SX1, below, s.z0], [SX0, below, s.z0]];
    const q = poly3(ctx, cam, rp); if (q) { ctx.fillStyle = '#8c7e6a'; ctx.fill(); }
    // the polished lip of the edge
    const lip = xs.map((x) => cam.P(x, s.y + sag(x) + .004, s.z0)); if (lip.every(Boolean)) { ctx.strokeStyle = rgba('#efe2c8', .55); ctx.lineWidth = Math.max(1, lip[0][2] * .008); ctx.beginPath(); lip.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke(); }
  }
}
// ---------------------------------------------------------------- the work shoes (profile, toe to the left), laces lifted by the wake
function boot(ctx, k, lift, t, seed, dark) {
  ctx.save(); ctx.scale(k, k);
  const lea = dark ? '#4e3626' : '#6b4a32', hi = dark ? '#6a4c36' : '#8e6a4c';
  // sole
  ctx.fillStyle = '#2a2220'; ctx.beginPath(); ctx.moveTo(-.152, -.012); ctx.quadraticCurveTo(-.158, 0, -.14, 0); ctx.lineTo(.145, 0); ctx.lineTo(.148, -.026); ctx.lineTo(-.15, -.026); ctx.closePath(); ctx.fill();
  // upper
  ctx.fillStyle = lea; ctx.beginPath(); ctx.moveTo(-.15, -.026); ctx.quadraticCurveTo(-.158, -.07, -.09, -.078); ctx.quadraticCurveTo(-.045, -.084, -.02, -.098);
  ctx.lineTo(.035, -.165); ctx.quadraticCurveTo(.09, -.172, .132, -.158); ctx.quadraticCurveTo(.15, -.09, .148, -.026); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip();
  const g = ctx.createLinearGradient(.02, -.17, -.06, -.02); g.addColorStop(0, rgba('#ffd8a8', .22)); g.addColorStop(1, rgba('#1a0e08', .25)); ctx.fillStyle = g; ctx.fillRect(-.16, -.18, .32, .16);
  ctx.fillStyle = rgba(hi, .55); ctx.beginPath(); ctx.ellipse(-.115, -.05, .03, .016, -.3, 0, TAU); ctx.fill();   // the scuffed toe
  ctx.strokeStyle = rgba('#20140c', .45); ctx.lineWidth = .003; ctx.beginPath(); ctx.moveTo(-.09, -.078); ctx.quadraticCurveTo(-.1, -.05, -.096, -.028);
  for (const c of [[-.07, -.08, -.06, -.045], [-.055, -.086, -.044, -.05]]) { ctx.moveTo(c[0], c[1]); ctx.quadraticCurveTo(c[0] - .006, (c[1] + c[3]) / 2, c[2], c[3]); }
  ctx.moveTo(.02, -.03); ctx.lineTo(.145, -.03); ctx.stroke();
  ctx.restore();
  // tongue
  ctx.fillStyle = shade(lea, -.05); ctx.beginPath(); ctx.moveTo(-.022, -.1); ctx.quadraticCurveTo(-.012, -.18, .012, -.19); ctx.quadraticCurveTo(.04, -.185, .04, -.168); ctx.lineTo(.02, -.13); ctx.closePath(); ctx.fill();
  // eyelets and the crossed lace
  const eye = [0, 1, 2, 3, 4].map((i) => [-.016 + i * .0125, -.1 - i * .015]);
  ctx.strokeStyle = '#d6c6a4'; ctx.lineWidth = .0045; ctx.lineCap = 'round'; ctx.beginPath();
  for (let i = 0; i < eye.length - 1; i++) { ctx.moveTo(eye[i][0] - .006, eye[i][1]); ctx.lineTo(eye[i + 1][0] + .006, eye[i + 1][1]); }
  ctx.stroke(); ctx.fillStyle = '#b8a888'; for (const [x, y] of eye) { ctx.beginPath(); ctx.arc(x, y, .0028, 0, TAU); ctx.fill(); }
  // the loose bow and its two ends: hanging down the side, or lifted and fluttering in the wake
  const top = eye[4], r = prng(seed), fl = (i) => Math.sin(t * (24 + 5 * i) + seed) * .014 * lift;
  ctx.beginPath(); ctx.ellipse(top[0] + .006, top[1] - .006, .014, .008, -.4, 0, TAU); ctx.stroke();
  for (let i = 0; i < 2; i++) {
    const hang = [top[0] + .012 + i * .012, top[1] + .07 + i * .012], up = [top[0] + .085 + i * .02, top[1] - .045 - i * .02 + r() * .01];
    const e = [mix(hang[0], up[0], lift) + fl(i), mix(hang[1], up[1], lift) + fl(i + 2)];
    const c = [mix(top[0] + .02, top[0] + .05, lift) + fl(i + 1) * .6, mix(top[1] + .03, top[1] - .012, lift)];
    ctx.beginPath(); ctx.moveTo(top[0] + .006, top[1]); ctx.quadraticCurveTo(c[0], c[1], e[0], e[1]); ctx.stroke();
  }
  ctx.restore();
}
function shoes(ctx, t, cam, lift) {
  const S = SHOES;
  for (const [dx, dz, dark, seed] of [[.2, .26, true, 3], [0, 0, false, 7]]) {
    const p = cam.P(S.x + dx, S.y, S.z + dz); if (!p) continue;
    // contact shadow
    ctx.fillStyle = rgba('#2a2018', .3); ctx.beginPath(); ctx.ellipse(p[0] + .01 * p[2], p[1], .16 * p[2], .012 * p[2], 0, 0, TAU); ctx.fill();
    ctx.save(); ctx.translate(p[0], p[1]); boot(ctx, p[2], clamp(lift), t, seed, dark); ctx.restore();
  }
}
export function drawFactory(ctx, t, cam, S) {
  if (FAC.z - cam.z < .3) return;
  if (cam.y < FAC.ground) {
    const p = poly3(ctx, cam, [[-30, FAC.ground, 36.6], [30, FAC.ground, 36.6], [30, FAC.ground, FAC.z], [-30, FAC.ground, FAC.z]]);
    if (p) { const g = ctx.createLinearGradient(0, Math.min(...p.map((q) => q[1])), 0, Math.max(...p.map((q) => q[1]))); g.addColorStop(0, '#8e7a6e'); g.addColorStop(1, '#6e5c58'); ctx.fillStyle = g; ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = rgba('#3a2c2c', .25); ctx.lineWidth = 1; ctx.beginPath();
      for (let z = 37; z < FAC.z; z += .22) { const a = cam.P(-30, FAC.ground, z), b = cam.P(30, FAC.ground, z); if (a && b) { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); } } ctx.stroke(); ctx.restore(); }
  }
  onPlane(ctx, cam, FAC.z, (k, vis) => facade(ctx, k, vis));
  steps(ctx, t, cam);
  shoes(ctx, t, cam, S.laces ?? 0);
}
export function drawMid(ctx, t, cam, S) { drawFactory(ctx, t, cam, S); drawViaduct(ctx, t, cam, S); }
