// Code-drawn illustration world in the "style A" look (Stauffer-like risograph: flat layered silhouettes, indigo/cyan/amber,
// halftone shading, fog between layers, light cones, grain). Nothing here uses generated images: every element is drawn
// and can move. Static geometry is pre-rendered once per layer; lights, people, cars, fog and the camera move per frame.
import { W, H, C, rgba, clamp, lin, mix, eio, eout, sine, prng, canvas, addGlow } from '../engine.mjs';

export const P = { // palette
  ink: '#0a0c26', night: '#121540', deep: '#1b1f55', mid: '#262c6e', haze: '#3a4a92', fogc: '#5f8fc4',
  cyan: '#38d6ff', cyanSoft: '#7fe3ff', amber: '#ffae4a', amberDeep: '#c8661e', cream: '#f3efe2', rose: '#e58f8a', dusk: '#e9a07f',
};

// ---------- texture helpers ----------
const DOTS = (() => { const [c, x] = canvas(8, 8); x.fillStyle = '#fff'; x.beginPath(); x.arc(4, 4, 1.25, 0, 7); x.fill(); return c; })();
// speckle grain baked into a layer (risograph feel)
function speckle(x, w, h, n, hex, a, seed = 1) { const r = prng(seed); x.save(); x.globalCompositeOperation = 'source-atop'; x.fillStyle = hex; for (let i = 0; i < n; i++) { x.globalAlpha = a * r(); const s = r() < .9 ? 1.2 : 2.2; x.fillRect(r() * w, r() * h, s, s); } x.restore(); }

// ---------- sky ----------
export function skyGrad(ctx, { top = P.ink, mid = P.night, bottom = P.haze, warm = 0, t = 0, stars = .6, seed = 3 } = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top); g.addColorStop(.55, mid); g.addColorStop(1, warm ? P.dusk : bottom);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (warm) { const w = ctx.createLinearGradient(0, H * .3, 0, H); w.addColorStop(0, 'rgba(233,160,127,0)'); w.addColorStop(1, rgba(P.dusk, .8 * warm)); ctx.fillStyle = w; ctx.fillRect(0, 0, W, H); }
  if (stars > 0) { const r = prng(seed); for (let i = 0; i < 160; i++) { const x = r() * W, y = r() * H * .55, tw = .5 + .5 * Math.sin(t * (1 + r() * 2) + i); ctx.fillStyle = rgba(P.cream, stars * (.15 + .5 * r()) * tw * (1 - warm)); ctx.fillRect(x, y, 2, 2); } }
}

// ---------- city layer (pre-rendered) ----------
// A row of block silhouettes at one depth. Far layers: light, hazy, few windows; near layers: dark, more detail.
// returns { draw(ctx, t, camX, camY, zoom) } ; z = depth (1 = near, larger = farther, moves slower)
export function cityLayer({ seed = 1, z = 2, base = H * .78, hMin = 120, hMax = 420, wMin = 70, wMax = 170, col = P.mid, lit = .02, litCol = P.cyan, warmLit = .3, span = 3200, roof = .5, tower = 0, fogTo = P.haze, fogAmt = .45, winRows = 0, rim = null, gap = .8 }) {
  const r = prng(seed), Wd = span, [cv, x] = canvas(Wd, H);
  const blocks = []; let px = -40;
  while (px < Wd) {
    const w = wMin + r() * (wMax - wMin), h = (tower && r() < tower) ? hMax * (1.25 + r() * .7) : hMin + Math.pow(r(), 1.6) * (hMax - hMin);
    blocks.push({ x: px, w, h, roof: r() < roof, step: r() < .35 }); px += w * (gap + r() * .3);
  }
  // draw tallest first so shorter ones overlap in front (gives layered skyline)
  const order = [...blocks].sort((p, q) => q.h - p.h);
  const wins = [];
  order.forEach((b, i) => {
    const top = base - b.h, c = shade(col, (r() - .5) * .05);
    const g = x.createLinearGradient(0, top, 0, base + 60); g.addColorStop(0, c); g.addColorStop(1, mixHex(c, fogTo, fogAmt));
    x.fillStyle = g; x.fillRect(b.x, top, b.w, H - top);
    if (b.step) { x.fillRect(b.x + b.w * .2, top - b.h * .12, b.w * .6, b.h * .12 + 2); }
    if (b.roof) { const rw = 10 + r() * 22; x.fillRect(b.x + r() * (b.w - rw), top - 16 - r() * 18, rw, 40); if (r() < .35) x.fillRect(b.x + b.w * (.3 + r() * .4), top - 60 - r() * 40, 3, 80); }
    // lit edge on one side (moonlight / city glow)
    if (rim) { x.fillStyle = rgba(rim, .18); x.fillRect(b.x, top, 3, b.h); }
    // a few dark window slots + rare lit ones
    const cols = Math.max(2, Math.floor(b.w / 30)), rows = Math.floor(b.h / 40);
    for (let i2 = 0; i2 < cols; i2++) for (let j = 0; j < rows; j++) {
      const wx = b.x + 12 + i2 * (b.w - 24) / cols, wy = top + 20 + j * 40; if (wy > base - 40) continue;
      if (j < winRows || r() < .18) { x.fillStyle = shade(c, -.035); x.fillRect(wx, wy, 11, 17); }
      if (r() < lit) wins.push({ x: wx, y: wy, warm: r() < warmLit, ph: r() * 6.28, sp: .15 + r() * .5, on: r() });
    }
  });
  // halftone where the fog meets the blocks + riso speckle
  x.save(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = .13; x.fillStyle = x.createPattern(DOTS, 'repeat'); x.fillRect(0, base - 200, Wd, 500); x.restore();
  speckle(x, Wd, H, 12000, '#ffffff', .08, seed + 7); speckle(x, Wd, H, 9000, '#000000', .2, seed + 9);
  return {
    z, wins, blocks, base,
    draw(ctx, t, cx = 0, cy = 0, zoom = 1) {
      const k = 1 + (zoom - 1) / z, ox = -cx / z - (Wd - W) / 2, oy = -cy / z;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2 + ox, -H / 2 + oy);
      ctx.drawImage(cv, 0, 0);
      for (const w of wins) {
        const on = w.on < .8 ? 1 : (Math.sin(t * w.sp + w.ph) > -.2 ? 1 : 0);
        ctx.fillStyle = rgba(w.warm ? P.amber : litCol, .95 * on); ctx.fillRect(w.x, w.y, 11, 17);
        if (on) { ctx.fillStyle = rgba(w.warm ? P.amber : litCol, .12); ctx.fillRect(w.x - 6, w.y - 6, 23, 29); }
      }
      ctx.restore();
    },
  };
}
// ---------- a street canyon: two rows of houses receding to a vanishing point (pre-rendered) ----------
export function canyon({ seed = 21, vp = [1010, 470], ground = H * .93, n = 7, col = '#101338', far = '#2b3577', span = 1.0 }) {
  const r = prng(seed), [cv, x] = canvas(W + 400, H + 200), ox = 200;
  const lamps = [], wins = [];
  // road
  x.fillStyle = '#0c0e2c'; x.beginPath(); x.moveTo(ox - 200, ground + 60); x.lineTo(vp[0] + ox - 50, vp[1] + 40); x.lineTo(vp[0] + ox + 50, vp[1] + 40); x.lineTo(W + ox + 200, ground + 60); x.lineTo(W + ox + 200, H + 200); x.lineTo(ox - 200, H + 200); x.fill();
  x.fillStyle = '#141741'; x.beginPath(); x.moveTo(ox - 200, ground + 60); x.lineTo(vp[0] + ox - 50, vp[1] + 40); x.lineTo(vp[0] + ox - 40, vp[1] + 40); x.lineTo(ox + 60, ground + 60); x.fill(); x.beginPath(); x.moveTo(W + ox + 200, ground + 60); x.lineTo(vp[0] + ox + 50, vp[1] + 40); x.lineTo(vp[0] + ox + 40, vp[1] + 40); x.lineTo(W + ox - 60, ground + 60); x.fill();
  for (const side of [-1, 1]) {
    for (let i = n - 1; i >= 0; i--) {
      const d = i / n, sc = mix(1, .16, Math.pow(d, .8)), c = mixHex(col, far, Math.pow(d, .9) * .85);
      const fx = vp[0] + side * mix(980, 60, Math.pow(d, .75)) + ox, gy = mix(ground, vp[1] + 40, Math.pow(d, .9));
      const hw = 260 * sc, hh = (330 + r() * 240) * sc, inner = fx - side * hw;
      // facade facing the street (a trapezoid toward the VP) + front face
      x.fillStyle = c; x.beginPath(); x.moveTo(fx, gy); x.lineTo(fx, gy - hh); x.lineTo(inner, gy - hh * .93); x.lineTo(inner, gy); x.fill();
      x.fillStyle = shade(c, -.03); x.fillRect(Math.min(fx, fx + side * 180 * sc), gy - hh * 1.02, 180 * sc, hh * 1.02);
      // roof steps, bay window, cornice
      x.fillStyle = shade(c, -.02); x.fillRect(Math.min(fx, inner), gy - hh - 10 * sc, Math.abs(fx - inner), 12 * sc);
      if (r() < .6) { x.fillRect(inner - side * 30 * sc, gy - hh * .7, side * 30 * sc, hh * .22); }
      for (let k = 0; k < 3; k++) {
        const wy = gy - hh * (.82 - k * .26), wx = mix(fx, inner, .3 + r() * .3), ww = 34 * sc, wh = 52 * sc;
        x.fillStyle = shade(c, -.04); x.fillRect(wx - ww / 2, wy, ww, wh);
        if (r() < .22) wins.push({ x: wx - ww / 2 - ox, y: wy, w: ww, h: wh, warm: r() < .7, ph: r() * 6, d });
      }
      if (r() < .45) lamps.push({ x: inner - side * 40 * sc - ox, y: gy, h: 300 * sc, side, d });
    }
  }
  x.save(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = .12; x.fillStyle = x.createPattern(DOTS, 'repeat'); x.fillRect(0, vp[1], W + 400, H); x.restore();
  speckle(x, W + 400, H + 200, 14000, '#ffffff', .07, seed + 1); speckle(x, W + 400, H + 200, 9000, '#000000', .25, seed + 2);
  return {
    lamps, wins,
    draw(ctx, t, cx = 0, cy = 0, zoom = 1) {
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(zoom, zoom); ctx.translate(-W / 2 - cx - ox, -H / 2 - cy);
      ctx.drawImage(cv, 0, 0); ctx.translate(ox, 0);
      for (const w of wins) { const on = Math.sin(t * .3 + w.ph) > -.6; if (!on) continue; ctx.fillStyle = rgba(w.warm ? P.amber : P.cyan, .92); ctx.fillRect(w.x, w.y, w.w, w.h); ctx.fillStyle = rgba(w.warm ? P.amber : P.cyan, .1); ctx.fillRect(w.x - w.w * .4, w.y - w.h * .3, w.w * 1.8, w.h * 1.6); }
      ctx.restore();
    },
    toScreen(px, py, cx = 0, cy = 0, zoom = 1) { return [W / 2 + (px - cx - W / 2) * zoom, H / 2 + (py - cy - H / 2) * zoom]; },
  };
}
export function shade(hex, d) { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(clamp(v + d * 255, 0, 255)); return '#' + [f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join(''); }
export function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// ---------- fog band (soft, drifting) ----------
export function fogBand(ctx, t, y, h, { hex = P.fogc, a = .35, speed = 6, seed = 5 } = {}) {
  const r = prng(seed);
  for (let i = 0; i < 9; i++) {
    const cx = ((r() * W * 1.6 + t * speed * (.5 + r())) % (W * 1.6)) - W * .3, cy = y + (r() - .5) * h * .6, rx = 380 + r() * 520, ry = h * (.35 + r() * .4);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx); g.addColorStop(0, rgba(hex, a * (.5 + r() * .5))); g.addColorStop(1, rgba(hex, 0));
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, ry / rx); ctx.translate(-cx, -cy); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rx, 0, 7); ctx.fill(); ctx.restore();
  }
}

// ---------- light cone (street lamp, window beam) ----------
export function cone(ctx, x, y, len, ang, spread, hex = P.amber, a = .45) {
  const g = ctx.createLinearGradient(x, y, x + Math.sin(ang) * len, y + Math.cos(ang) * len);
  g.addColorStop(0, rgba(hex, a)); g.addColorStop(1, rgba(hex, 0));
  ctx.save(); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x - 6, y);
  ctx.lineTo(x + Math.sin(ang - spread) * len, y + Math.cos(ang - spread) * len); ctx.lineTo(x + Math.sin(ang + spread) * len, y + Math.cos(ang + spread) * len); ctx.lineTo(x + 6, y); ctx.fill();
  // halftone in the beam
  ctx.clip(); ctx.globalAlpha = a * .5; ctx.fillStyle = ctx.createPattern(DOTS, 'repeat'); ctx.fillRect(x - len, y, len * 2, len); ctx.restore();
  addGlow(ctx, x, y + 4, 40, .7, hex, '#fff3dd');
}
export function lampPost(ctx, x, yGround, h, t, { hex = P.amber, on = 1, col = '#0d0f2e' } = {}) {
  ctx.fillStyle = col; ctx.fillRect(x - 4, yGround - h, 8, h); ctx.fillRect(x - 4, yGround - h, 50, 7);
  ctx.beginPath(); ctx.moveTo(x + 36, yGround - h + 7); ctx.lineTo(x + 62, yGround - h + 7); ctx.lineTo(x + 56, yGround - h + 18); ctx.lineTo(x + 42, yGround - h + 18); ctx.fill();
  if (on > 0) cone(ctx, x + 49, yGround - h + 18, h * 1.02, 0, .32, hex, .42 * on * (.96 + .04 * Math.sin(t * 9)));
}
// power line poles + sagging wires (screen space with parallax offset ox)
export function wires(ctx, poles, ox = 0, { col = '#0b0d2a', sag = 60 } = {}) {
  ctx.strokeStyle = col; ctx.fillStyle = col;
  for (const p of poles) { ctx.fillRect(p.x + ox - 5, p.y, 10, H - p.y); ctx.fillRect(p.x + ox - 46, p.y + 18, 92, 7); }
  ctx.lineWidth = 2;
  for (let i = 0; i < poles.length - 1; i++) for (let k = -1; k <= 1; k++) {
    const a = poles[i], b = poles[i + 1], ax = a.x + ox + k * 40, bx = b.x + ox + k * 40;
    ctx.beginPath(); ctx.moveTo(ax, a.y + 20); ctx.quadraticCurveTo((ax + bx) / 2, (a.y + b.y) / 2 + sag + 20, bx, b.y + 20); ctx.stroke();
  }
}

// ---------- ground / hill ----------
export function hill(ctx, pts, { col = P.deep, rim = null, t = 0 } = {}) {
  ctx.beginPath(); ctx.moveTo(-10, H + 10); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(W + 10, H + 10); ctx.closePath();
  const ys = Math.min(...pts.map((p) => p[1]));
  const g = ctx.createLinearGradient(0, ys, 0, H); g.addColorStop(0, shade(col, .05)); g.addColorStop(1, shade(col, -.06));
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.clip(); ctx.globalAlpha = .14; ctx.fillStyle = ctx.createPattern(DOTS, 'repeat'); ctx.fillRect(0, ys, W, H - ys); ctx.restore();
  if (rim) { ctx.save(); ctx.strokeStyle = rim; ctx.lineWidth = 3; ctx.globalAlpha = .5; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
}
// grass tufts swaying along a ground line
export function grass(ctx, t, x0, x1, yf, { n = 90, col = '#151842', h = 26, seed = 4 } = {}) {
  const r = prng(seed); ctx.strokeStyle = col; ctx.lineWidth = 2.5;
  for (let i = 0; i < n; i++) { const x = mix(x0, x1, r()), y = yf(x), hh = h * (.5 + r()), sw = Math.sin(t * 1.3 + x * .02) * 6; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw * .3, y - hh * .5, x + sw, y - hh); ctx.stroke(); }
}

// ---------- people (code-drawn, flat, articulated) ----------
// x,y = feet on ground; h = height in px; phase = walk phase (radians) or null to stand; o.coat colour; o.phone glow
export function person(ctx, x, y, h, t, { phase = null, coat = P.amber, dark = '#121434', flip = false, phone = false, hood = true, look = 0, sit = false, typing = false, skin = '#c98f6a', hair = '#1a1530', breathe = 1, arm = null } = {}) {
  const s = h / 100; ctx.save(); ctx.translate(x, y); if (flip) ctx.scale(-1, 1); ctx.scale(s, s);
  const walk = phase !== null, bob = walk ? Math.abs(Math.cos(phase)) * 1.4 : Math.sin(t * 1.6) * .4 * breathe;
  ctx.fillStyle = 'rgba(4,5,18,.5)'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 3, 0, 0, 7); ctx.fill();
  const hipY = sit ? -38 : -45 - bob;
  const leg = (ph, back) => {
    ctx.strokeStyle = back ? shade(dark, -.04) : dark; ctx.lineWidth = 6; ctx.lineCap = 'round';
    if (sit) { ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(19, hipY + 1); ctx.lineTo(back ? 17 : 21, -2); ctx.stroke(); return; }
    const a = walk ? Math.sin(phase + ph) * .5 : (back ? -.04 : .05), kb = walk ? Math.max(0, -Math.cos(phase + ph)) * .75 : 0;
    const kx = Math.sin(a) * 23, ky = hipY + Math.cos(a) * 23, fx = kx + Math.sin(a - kb) * 23, fy = Math.min(ky + Math.cos(a - kb) * 23, 0);
    ctx.beginPath(); ctx.moveTo(0, hipY); ctx.lineTo(kx, ky); ctx.lineTo(fx, fy); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(fx - 1, fy); ctx.lineTo(fx + 6, fy); ctx.stroke();
  };
  leg(Math.PI, true); leg(0, false);
  const sh = hipY - 38, sway = walk ? Math.sin(phase * 2) * .6 : 0;
  // back arm (behind the coat)
  // arms hang from the shoulder joint at the side of the body: upper arm + slightly bent forearm + hand,
  // swinging opposite to the legs; a > 0 = forward (towards the face)
  const limb = (a, bend, col) => {
    const ex = 1 + Math.sin(a) * 17, ey = sh + 4 + Math.cos(a) * 17, hx = ex + Math.sin(a + bend) * 16, hy = ey + Math.cos(a + bend) * 16;
    ctx.strokeStyle = col; ctx.lineWidth = 5.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(1, sh + 4); ctx.lineTo(ex, ey); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(hx + Math.sin(a + bend) * 2, hy + Math.cos(a + bend) * 2, 2.7, 0, 7); ctx.fill();
  };
  if (!phone && !typing) { const a = walk ? Math.sin(phase) * .5 : -.06; limb(a, walk ? .15 + Math.max(0, a) * .5 : .18, shade(coat, -.3)); }
  // coat: a slightly A-shaped long coat with rounded, sloping shoulders
  ctx.fillStyle = coat; ctx.beginPath(); ctx.moveTo(-7, sh + 5); ctx.bezierCurveTo(-7, sh - 1, -3, sh - 3, 1.5, sh - 3); ctx.bezierCurveTo(6, sh - 3, 9, sh - 1, 9, sh + 5);
  ctx.quadraticCurveTo(10, hipY - 6, 10, hipY); ctx.lineTo(12 + sway, hipY + 16); ctx.lineTo(-13 + sway, hipY + 16); ctx.lineTo(-12, hipY + 4); ctx.quadraticCurveTo(-10, sh + 12, -7, sh + 5); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.fillStyle = shade(coat, -.2); ctx.fillRect(2, sh, 20, 70); ctx.globalAlpha = .28; ctx.fillStyle = ctx.createPattern(DOTS, 'repeat'); ctx.fillRect(-20, sh + 18, 44, 50); ctx.restore();
  // front arm
  ctx.strokeStyle = shade(coat, -.12); ctx.lineWidth = 5.5;
  if (arm) arm(ctx, sh);
  else if (phone || typing) {
    const tp = typing ? Math.sin(t * 13) * 1.5 : 0;
    ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(1, sh + 4); ctx.lineTo(4, sh + 21); ctx.lineTo(15, sh + 15 + tp); ctx.stroke();
    ctx.fillStyle = skin; ctx.beginPath(); ctx.arc(16.5, sh + 14.5 + tp, 2.7, 0, 7); ctx.fill();
    if (phone) { ctx.fillStyle = '#0b0d22'; ctx.fillRect(15, sh + 10, 5, 8); addGlow(ctx, 19, sh + 10, 20, .75, P.cyan, '#e8fbff'); }
  } else if (sit) limb(.3, 1.05, shade(coat, -.12));   // hand rests on the lap
  else { const a = walk ? Math.sin(phase + Math.PI) * .5 : .08 + Math.sin(t * 1.6) * .02 * breathe; limb(a, walk ? .15 + Math.max(0, a) * .5 : .22, shade(coat, -.12)); }
  // neck, head; head tilts down when on the phone
  const tilt = (phone || typing) ? .35 : look * .2, hx = 1.5 + tilt * 4, hy = sh - 9;
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(tilt);
  if (hood) { ctx.fillStyle = shade(coat, -.08); ctx.beginPath(); ctx.ellipse(-1, 0, 8.6, 9.6, 0, 0, 7); ctx.fill(); ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(3.2, 1.2, 4.2, 6, 0, 0, 7); ctx.fill(); }
  else { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(.5, 0, 6.4, 7.8, 0, 0, 7); ctx.fill(); ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(-1.5, -2.5, 7, 6.4, -.3, Math.PI * .75, Math.PI * 2.05); ctx.fill(); }
  ctx.restore();
  ctx.restore();
}

// a car with headlights driving along y (screen), direction d
export function car(ctx, x, y, s, d = 1, { col = '#0f1236' } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(d * s, s);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-40, -14); ctx.lineTo(-22, -16); ctx.lineTo(-12, -28); ctx.lineTo(16, -28); ctx.lineTo(28, -16); ctx.lineTo(42, -13); ctx.lineTo(42, 0); ctx.fill();
  ctx.restore();
  cone(ctx, x + d * 42 * s, y - 9 * s, 160 * s, d * Math.PI / 2 + d * .05, .14, '#fff1cf', .35);
  addGlow(ctx, x - d * 40 * s, y - 9 * s, 14 * s, .7, '#ff5a4a', '#ffd0c8');
}

// ---------- the glowing line in the sky ----------
export function skyLine(ctx, t, t0, { x0 = 900, y0 = 560, x1 = 1900, y1 = 80, dur = 4, hex = P.cyan, bend = 3.2 } = {}) {
  const u = eio(lin(t0, t0 + dur, t)); if (u <= 0) return;
  const pts = []; for (let i = 0; i <= 160 * u; i++) { const v = i / 160; pts.push([mix(x0, x1, v), y0 - (Math.exp(bend * v) - 1) / (Math.exp(bend) - 1) * (y0 - y1)]); }
  for (const [w, a] of [[26, .08], [12, .18], [4, .95]]) { ctx.save(); ctx.strokeStyle = rgba(w > 4 ? hex : '#e9fbff', a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.globalCompositeOperation = 'screen'; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
  const [hx, hy] = pts[pts.length - 1]; addGlow(ctx, hx, hy, 60, .8, hex, '#ffffff');
}

// final grade: vignette + grain, to sit every code scene in the same print look
export function finish(ctx, t, { vig = .5, warm = 0 } = {}) {
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .35, W / 2, H / 2, H * 1.05); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(4,5,18,${vig})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

// ---------- a near row of low houses with gables, bay windows, stoops (pre-rendered, frontal) ----------
export function houseRow({ seed = 31, base = H * .86, z = 1.2, col = '#10133a', span = 2800, hMin = 230, hMax = 360, lit = .25 }) {
  const r = prng(seed), [cv, x] = canvas(span, H); const wins = []; let px = -60;
  while (px < span) {
    const w = 170 + r() * 150, h = hMin + r() * (hMax - hMin), top = base - h, c = shade(col, (r() - .5) * .04);
    x.fillStyle = c; x.fillRect(px, top, w, H - top);
    // roof: gable or flat with cornice
    if (r() < .5) { x.beginPath(); x.moveTo(px - 6, top); x.lineTo(px + w / 2, top - w * .28); x.lineTo(px + w + 6, top); x.fill(); }
    else { x.fillRect(px - 8, top - 14, w + 16, 14); }
    // bay window column
    const bx = px + w * (.15 + r() * .2), bw = w * .32;
    x.fillStyle = shade(c, .025); x.fillRect(bx, top + 30, bw, h - 90);
    for (let k = 0; k < 2; k++) {
      const wy = top + 50 + k * 110, on = r() < lit;
      x.fillStyle = shade(c, -.035); x.fillRect(bx + 12, wy, bw - 24, 70);
      if (on) wins.push({ x: bx + 12, y: wy, w: bw - 24, h: 70, warm: r() < .75, ph: r() * 6 });
      const wx2 = px + w * .7, on2 = r() < lit * .7;
      x.fillStyle = shade(c, -.035); x.fillRect(wx2, wy + 6, w * .18, 60);
      if (on2) wins.push({ x: wx2, y: wy + 6, w: w * .18, h: 60, warm: r() < .6, ph: r() * 6 });
    }
    // door + stoop
    x.fillStyle = shade(c, -.05); x.fillRect(px + w * .62, base - 80, 40, 80); x.fillRect(px + w * .58, base - 10, 60, 10);
    px += w + 4;
  }
  x.save(); x.globalCompositeOperation = 'source-atop'; x.globalAlpha = .12; x.fillStyle = x.createPattern(DOTS, 'repeat'); x.fillRect(0, base - 160, span, 400); x.restore();
  speckle(x, span, H, 9000, '#ffffff', .06, seed + 1); speckle(x, span, H, 8000, '#000000', .25, seed + 2);
  return {
    z, base,
    draw(ctx, t, cx = 0, cy = 0, zoom = 1) {
      const k = 1 + (zoom - 1) / z, ox = -cx / z - (span - W) / 2, oy = -cy / z;
      ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(k, k); ctx.translate(-W / 2 + ox, -H / 2 + oy);
      ctx.drawImage(cv, 0, 0);
      for (const w of wins) { const on = Math.sin(t * .25 + w.ph) > -.75; if (!on) continue; const c = w.warm ? P.amber : P.cyan;
        ctx.fillStyle = rgba(c, .95); ctx.fillRect(w.x, w.y, w.w, w.h); ctx.fillStyle = rgba(shade(c, -.35), .9); ctx.fillRect(w.x + w.w / 2 - 1.5, w.y, 3, w.h); ctx.fillRect(w.x, w.y + w.h * .45, w.w, 3);
        // light spill on the pavement
        const g = ctx.createLinearGradient(0, w.y + w.h, 0, base + 60); g.addColorStop(0, rgba(c, .1)); g.addColorStop(1, rgba(c, 0)); ctx.fillStyle = g; ctx.fillRect(w.x - 10, w.y + w.h, w.w + 20, base + 60 - w.y - w.h); }
      ctx.restore();
    },
    // screen position of a point given in layer coords
    at(px, py, cx = 0, cy = 0, zoom = 1) { const k = 1 + (zoom - 1) / z, ox = -cx / z - (span - W) / 2, oy = -cy / z; return [W / 2 + (px + ox - W / 2) * k, H / 2 + (py + oy - H / 2) * k, k]; },
  };
}
