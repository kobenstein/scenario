// s06_home.mjs · chapter 06, the kitchen table at night (6.01–6.06).
// K1 table from above (pencil rolls, falls) · K2 floor, the empty wallet · K3 the unused stamp
// K4 you, alone at the table · K5 the map, your finger, the small cyan help
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, sine, drift, enter, lay, big, spr, bloomL, poolL, coneL, fogL, vgrad, radial, glowAt, fig, drawFig, stage, camAt, paper, vignetteL, tintAll } from './s06_kit.mjs';
import { stipple, roughPath, roughPoly, roughRect, roughLine, hatch, strokes, vnoise, fbm, castShadow, maskRadial, maskLinear, house } from './art.mjs';
import { clipScreen } from './kit.mjs';
import { text } from '../engine.mjs';

const AMB = '#ffb35c', HOT = '#ffd59a', CREAM = '#fff1d0', INK = '#0a0918';
const LAMP = [900, 420];                     // K1: the lamp pool centre on the table (top-down)
const EDGE = 905;                            // K1: near table edge (screen y)

// ---------------------------------------------------------------- shared props
// pencil sprite (top-down), lying along +x, length L; roll = phase of the hex facets
function pencilSprite(roll, s = 1) {
  const q = ((Math.round(roll / (Math.PI / 3) * 4) % 24) + 24) % 24;
  return spr(`pencil${q}:${s}`, () => {
    const L = 300 * s, D = 19 * s, [c, g] = lay(L + 8, D + 8); g.translate(4, 4 + D / 2);
    const ph = q / 24 * Math.PI / 3 * 6 / 6;   // facet phase
    // body: three visible facets, brightness from a top light
    const fac = [0, 1, 2].map((i) => { const a = (i - 1) * Math.PI / 3 + q / 4 * Math.PI / 3; return clamp(.55 + .45 * Math.cos(a + .5)); });
    const bodyL = L * .74, x0 = L * .17;
    for (let i = 0; i < 3; i++) { const y0 = -D / 2 + i * D / 3; g.fillStyle = mixHex('#7a4a14', '#f2b24a', fac[i]); g.fillRect(x0, y0, bodyL, D / 3 + .6); }
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(x0, -D / 2 + D / 3 - .5, bodyL, 1); g.fillRect(x0, -D / 2 + 2 * D / 3 - .5, bodyL, 1);
    // ferrule + eraser
    g.fillStyle = '#9a9aa8'; g.fillRect(x0 - 26 * s, -D / 2, 26 * s, D); g.fillStyle = 'rgba(40,40,60,.5)'; for (let k = 1; k < 4; k++) g.fillRect(x0 - 26 * s + k * 6 * s, -D / 2, 1.2, D);
    g.fillStyle = '#d98a86'; g.beginPath(); g.roundRect(0, -D / 2 + .5, x0 - 26 * s + 2, D - 1, 4 * s); g.fill();
    // sharpened cone + graphite
    const xs = x0 + bodyL; g.fillStyle = '#e9cfa6'; g.beginPath(); g.moveTo(xs, -D / 2); g.lineTo(L - 6 * s, -2 * s); g.lineTo(L - 6 * s, 2 * s); g.lineTo(xs, D / 2); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(120,70,30,.35)'; g.lineWidth = 1; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(xs + 2, -D / 2 + (k + .5) * D / 3); g.lineTo(xs + 18 * s, -D / 2 + (k + .5) * D / 3 * .9); g.stroke(); }
    g.fillStyle = '#2a2a36'; g.beginPath(); g.moveTo(L - 18 * s, -3 * s); g.lineTo(L, 0); g.lineTo(L - 18 * s, 3 * s); g.closePath(); g.fill();
    void ph; return { c, L, D };
  });
}
function drawPencil(ctx, x, y, ang, roll, { s = 1, lift = 0, lx = LAMP[0], ly = LAMP[1], shadowA = .45 } = {}) {
  const P = pencilSprite(roll, s);
  // soft shadow away from the lamp, separating as it lifts
  const dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy) || 1, off = 7 + lift * 60;
  ctx.save(); ctx.translate(x + dx / d * off, y + dy / d * off); ctx.rotate(ang); ctx.globalAlpha = shadowA * (1 - lift * .6);
  ctx.fillStyle = '#05040c'; ctx.filter = `blur(${2 + lift * 10}px)`; ctx.fillRect(-P.L / 2, -P.D / 2, P.L, P.D); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(1 + lift * .25, 1 + lift * .25); ctx.drawImage(P.c, -P.L / 2 - 4, -P.D / 2 - 4); ctx.restore();
}
// a top-down hand (sleeve from a side), index finger pointing along +x. Cached by colour + pose.
function handSprite(key, { sleeve = '#e59a3a', skin = '#e9c3a0', point = 1, grip = 0 } = {}) {
  return spr('hand:' + key, () => {
    const [c, g] = lay(560, 220); g.translate(30, 110);
    // sleeve (from the left), cuff
    g.fillStyle = shade(sleeve, -.08); g.beginPath(); g.moveTo(-40, -52); g.quadraticCurveTo(160, -50, 300, -36); g.lineTo(300, 40); g.quadraticCurveTo(160, 52, -40, 56); g.closePath(); g.fill();
    g.fillStyle = sleeve; g.beginPath(); g.moveTo(-40, -50); g.quadraticCurveTo(160, -48, 300, -34); g.lineTo(300, 10); g.quadraticCurveTo(160, 16, -40, 20); g.closePath(); g.fill();
    g.fillStyle = shade(sleeve, -.16); g.fillRect(286, -38, 16, 80);
    // back of the hand
    g.fillStyle = skin; g.beginPath(); g.ellipse(352, 2, 58, 40, 0, 0, 7); g.fill();
    g.fillStyle = shade(skin, -.08); g.beginPath(); g.ellipse(352, 14, 54, 26, 0, 0, Math.PI); g.fill();
    // curled fingers (knuckles) + thumb
    const fing = grip ? 4 : 3;
    for (let k = 0; k < fing; k++) { g.fillStyle = shade(skin, -.03 * k); g.beginPath(); g.ellipse(402 + (grip ? 8 : 0), -16 + k * 14 + (grip ? 0 : 14), 16, 8, .1, 0, 7); g.fill(); }
    g.fillStyle = skin; g.beginPath(); g.ellipse(372, -40, 30, 11, -.5, 0, 7); g.fill();
    if (point) { g.fillStyle = skin; g.beginPath(); g.moveTo(400, -22); g.quadraticCurveTo(470, -26, 512, -20); g.arc(512, -12, 8, -Math.PI / 2, Math.PI / 2); g.quadraticCurveTo(470, -4, 400, -2); g.closePath(); g.fill();
      g.fillStyle = shade(skin, .06); g.beginPath(); g.ellipse(509, -14, 5, 3.5, 0, 0, 7); g.fill(); }
    // light from above: a sheen along the top edge, shadow side
    g.globalCompositeOperation = 'source-atop';
    const lg = g.createLinearGradient(0, -60, 0, 60); lg.addColorStop(0, 'rgba(255,230,190,.28)'); lg.addColorStop(.5, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(6,5,16,.35)'); g.fillStyle = lg; g.fillRect(-60, -110, 620, 220);
    return { c, tip: [512 + 8 - 30 + 30, -12] };   // fingertip relative to the sprite origin (30,110)
  });
}
// draw a hand sprite so that its fingertip lands at (x,y), arm coming from angle ang (rad, direction the finger points)
function drawHand(ctx, H0, x, y, ang, { lift = 0, lx = 960, ly = 300, sc = 1 } = {}) {
  const tipX = 520 * sc, tipY = -12 * sc;
  const off = 12 + lift * 50, dx = x - lx, dy = y - ly, d = Math.hypot(dx, dy) || 1;
  ctx.save(); ctx.translate(x + dx / d * off, y + dy / d * off); ctx.rotate(ang); ctx.globalAlpha = .4; ctx.filter = 'blur(9px)'; ctx.drawImage(H0.c, -30 * sc - tipX, -110 * sc - tipY, 560 * sc, 220 * sc); ctx.restore();
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.drawImage(H0.c, -30 * sc - tipX, -110 * sc - tipY, 560 * sc, 220 * sc); ctx.restore();
}

// ---------------------------------------------------------------- K1 · the table from above
function tablePlate() {
  return big('s06:table', () => {
    const [c, g] = lay(), r = prng(61), n = vnoise(6);
    // floor below the near edge: dark boards
    g.fillStyle = '#0c0b1c'; g.fillRect(0, 0, W, H);
    for (let x = -40; x < W + 40; x += 118 + r() * 40) { g.fillStyle = rgba('#000000', .4); g.fillRect(x, EDGE, 2, H - EDGE); g.fillStyle = rgba('#3a3060', .12); g.fillRect(x + 2, EDGE, 1, H - EDGE); }
    // table top
    const top = [[-30, -30], [W + 30, -30], [W + 30, EDGE + 4], [-30, EDGE]];
    roughPoly(g, top, '#4a2f22', { amp: 1.2, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, top, { amp: 1.2, seed: 3 }); g.clip();
    // planks (5) with grain flowing along them, knots
    const seams = [0, 168, 352, 548, 735, EDGE + 10];
    for (let i = 0; i < seams.length - 1; i++) {
      const y0 = seams[i], y1 = seams[i + 1], tone = ['#4e3122', '#563726', '#4a2e21', '#5b3a28', '#503323'][i];
      g.fillStyle = tone; g.fillRect(-40, y0, W + 80, y1 - y0);
      const kx = 200 + r() * 1500, ky = mix(y0, y1, .3 + r() * .4);
      g.strokeStyle = '#c99260'; g.lineCap = 'round';
      for (let k = 0; k < 46; k++) {
        const base = mix(y0 + 4, y1 - 4, k / 45); g.globalAlpha = .06 + .14 * r(); g.lineWidth = .8 + r() * .8; g.beginPath();
        for (let x = -40; x <= W + 40; x += 10) {
          const dk = (x - kx) / 90, bump = Math.exp(-dk * dk) * 26 * Math.sign(base - ky) * Math.exp(-Math.abs(base - ky) / 60);
          const y = base + Math.sin(x * .0025 + k * .7 + i) * 6 + (n(x * .01, k + i * 50) - .5) * 3 + bump; x === -40 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.stroke();
      }
      g.globalAlpha = 1; g.strokeStyle = 'rgba(40,20,10,.6)'; g.lineWidth = 2; g.beginPath(); g.ellipse(kx, ky, 14, 6, 0, 0, 7); g.stroke();
      // seam: dark gap + lit lip
      g.fillStyle = 'rgba(12,6,8,.85)'; g.fillRect(-40, y1 - 2, W + 80, 3); g.fillStyle = 'rgba(255,200,140,.12)'; g.fillRect(-40, y1 + 1, W + 80, 1.4);
    }
    // the lamp: warm pool in the middle, cold indigo toward the edges (one hero light)
    radial(g, LAMP[0], LAMP[1], 1250, [[0, 'rgba(0,0,0,0)'], [.35, 'rgba(10,8,30,.25)'], [.75, 'rgba(10,8,34,.72)'], [1, 'rgba(8,7,26,.88)']], { sy: .8 });
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(LAMP[0], LAMP[1], 0, LAMP[0], LAMP[1], 760); rg.addColorStop(0, rgba('#ffcf8a', .55)); rg.addColorStop(.35, rgba(AMB, .32)); rg.addColorStop(1, rgba(AMB, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .5, g: 1.1, seed: 4 }); g.globalCompositeOperation = 'soft-light'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .55; g.drawImage(lc, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; }
    // shadow hatching in the far corners
    g.save(); g.globalAlpha = 1; hatch(g, [0, 0, 520, 420], { angle: .7, gap: 6, col: '#05040c', a: .35, seed: 7, broken: .35 }); hatch(g, [1450, 0, 470, 380], { angle: -.6, gap: 6, col: '#05040c', a: .32, seed: 8, broken: .35 }); g.restore();
    g.restore();
    // near edge: lit lip + the table's shadow on the floor
    roughLine(g, [[-30, EDGE], [W + 30, EDGE + 4]], { w: 3, col: rgba('#ffc98a', .5), seed: 3 });
    vgrad(g, 0, EDGE + 4, W, 120, [[0, 'rgba(0,0,0,.65)'], [1, 'rgba(0,0,0,0)']]);
    // objects (with soft shadows away from the lamp)
    const shadowOf = (x, y, fn, h = 14) => { const dx = x - LAMP[0], dy = y - LAMP[1], d = Math.hypot(dx, dy) || 1; g.save(); g.translate(dx / d * h, dy / d * h); g.filter = 'blur(7px)'; g.globalAlpha = .55; fn('#060409'); g.restore(); };
    // mug of tea
    { const x = 560, y = 330, R = 62;
      const body = (col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, R, 0, 7); g.fill(); g.beginPath(); g.ellipse(x + R + 14, y + 8, 22, 12, .3, 0, 7); g.fill(); };
      shadowOf(x, y, body, 22); body('#d9d2c4');
      g.fillStyle = '#efe9dc'; g.beginPath(); g.arc(x - 6, y - 6, R - 2, 0, 7); g.fill();
      g.fillStyle = '#5a2e14'; g.beginPath(); g.arc(x, y, R - 11, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,214,150,.55)'; g.beginPath(); g.ellipse(x + 14, y + 12, 18, 9, .6, 0, 7); g.fill();
      g.fillStyle = '#d9d2c4'; g.beginPath(); g.ellipse(x + R + 14, y + 8, 12, 5, .3, 0, 7); g.fillStyle = '#4a2f22'; g.fill(); }
    // reading glasses
    { const x = 1180, y = 600; const gl = (col, lw = 4) => { g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.ellipse(x - 48, y, 36, 28, .1, 0, 7); g.stroke(); g.beginPath(); g.ellipse(x + 40, y + 8, 36, 28, .1, 0, 7); g.stroke(); g.beginPath(); g.moveTo(x - 12, y - 2); g.quadraticCurveTo(x - 4, y - 12, x + 4, y + 2); g.stroke(); g.beginPath(); g.moveTo(x - 84, y - 6); g.lineTo(x - 150, y - 60); g.moveTo(x + 76, y + 2); g.lineTo(x + 120, y - 66); g.stroke(); };
      shadowOf(x, y, (c2) => gl(c2, 5), 10); gl('#1a1416'); g.fillStyle = 'rgba(255,230,190,.12)'; g.beginPath(); g.ellipse(x - 52, y - 6, 26, 14, .4, 0, 7); g.fill(); }
    // closed notebook with a band
    { const x = 1380, y = 250, ang = -.18;
      const nb = (col) => { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.beginPath(); g.roundRect(-150, -105, 300, 210, 8); g.fill(); g.restore(); };
      shadowOf(x, y, nb, 16); nb('#26394a'); g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = '#1d2c3a'; g.fillRect(-150, -105, 18, 210); g.fillStyle = '#c4482a'; g.fillRect(96, -105, 9, 210); g.fillStyle = 'rgba(255,220,170,.08)'; g.fillRect(-130, -100, 270, 60); g.restore(); }
    // a sprig of herbs in a little pot (life)
    { const x = 260, y = 690; const pot = (col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, 58, 0, 7); g.fill(); };
      shadowOf(x, y, pot, 20); pot('#8a4a2e'); g.fillStyle = '#2a1a14'; g.beginPath(); g.arc(x, y, 48, 0, 7); g.fill();
      const rr = prng(4); for (let k = 0; k < 22; k++) { const a = rr() * 6.28, d = 10 + rr() * 60; g.fillStyle = mixHex('#3a6a3a', '#8ab86a', rr()); g.save(); g.translate(x + Math.cos(a) * d * .7, y + Math.sin(a) * d * .7); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 16, 7, 0, 0, 7); g.fill(); g.restore(); } }
    // two coins? no: an envelope, unopened bills pushed away to the corner (still a home at night)
    { const x = 1640, y = 760, ang = .22; const ev = (col) => { g.save(); g.translate(x, y); g.rotate(ang); g.fillStyle = col; g.fillRect(-120, -70, 240, 140); g.restore(); };
      shadowOf(x, y, ev, 10); ev('#b9b2a6'); g.save(); g.translate(x, y); g.rotate(ang); g.strokeStyle = 'rgba(60,50,50,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-120, -70); g.lineTo(0, 10); g.lineTo(120, -70); g.stroke(); g.restore(); }
    return c;
  });
}
// dust in the lamp light (foreground parallax)
function dust(ctx, t, cx, cy, R, n = 40, seed = 3, col = '#ffe2b0') {
  const r = prng(seed);
  for (let i = 0; i < n; i++) {
    const a = r() * 6.28, d = Math.sqrt(r()) * R, sp = .2 + r() * .6, ph = r() * 7;
    const x = cx + Math.cos(a) * d + Math.sin(t * sp + ph) * 30 + t * 6 * (r() - .5), y = cy + Math.sin(a) * d * .7 + Math.cos(t * sp * .8 + ph) * 22 - ((t * 8 * sp) % 60);
    const al = (.25 + .5 * r()) * (1 - d / R) * (.6 + .4 * Math.sin(t * 2 + ph));
    ctx.fillStyle = rgba(col, al); const s = r() < .2 ? 2.4 : 1.4; ctx.fillRect(x, y, s, s);
  }
}

// the clip frame (Altman, portrait) as an offscreen card for the hand-over
function clipCard(t, T) {
  const [c, g] = spr('s06clipcard', () => lay(440, 782));
  g.clearRect(0, 0, 440, 782);
  try { clipScreen(g, t, T, 'A', 0, 0, 440, 782, { glow: false, bezel: false, radius: 12 }); } catch { g.fillStyle = '#121430'; g.fillRect(0, 0, 440, 782); }
  return c;
}

export function K1(ctx, t, s, A, T) {
  const P = tablePlate();
  const u = lin(376.35, 377.7, t);                       // clip -> table hand-over
  const cam = { x: 920 + drift(t, 8, 1), y: 600 + drift(t, 6, 2), z: mix(1.42, 1.28, sine(lin(376.4, 381.2, t))) };
  const m = camAt(cam, 1);
  ctx.save(); m.set(ctx); ctx.drawImage(P, 0, 0);
  // lamp breathing
  glowAt(ctx, LAMP[0], LAMP[1], 700, .1 + .02 * Math.sin(t * 1.7), AMB, '#ffe2b0');
  // the pencil: rests, rolls on "catch", nothing stops it, over the edge on "nothing"
  const t0 = A.catch - .02, tE = A.nothing + .2;
  const p = lin(t0, tE, t), y0 = 600;
  let y = y0 + (EDGE + 8 - y0) * Math.pow(p, 1.75), lift = 0, sc = 1, ang = .06 + .03 * p;
  const pre = 1 - lin(t0 - .5, t0, t);                       // anticipation: a tiny settle before it goes
  y -= pre * 2 * Math.sin(Math.max(0, t - (t0 - .5)) * 20) * lin(t0 - .5, t0 - .2, t);
  if (t > tE) { const f = t - tE; y = EDGE + 8 + 520 * f * f + 200 * f; sc = 1 - Math.min(.35, f * .8); lift = Math.min(1, f * 3); ang += f * 1.4; }
  const roll = (y - y0) / 9.5;
  if (t < tE + .9) { ctx.save(); ctx.translate(880, y); ctx.scale(sc, sc); ctx.translate(-880, -y); drawPencil(ctx, 880, y, ang, roll, { lift: lift * .4, shadowA: .5 * (1 - lift) }); ctx.restore(); }
  dust(ctx, t, LAMP[0], LAMP[1], 520, 46, 3);
  ctx.restore();
  // incoming: Altman's last frame tilts flat and becomes the table top
  if (u < 1) {
    const e = eio(u), card = clipCard(t, T), cw = 440, ch = 782;
    // the table fades up around it (lamp warms first)
    ctx.save(); ctx.globalAlpha = 1 - sm(lin(0, .75, u)); ctx.fillStyle = '#080816'; ctx.fillRect(0, 0, W, H); ctx.restore();
    // perspective strips: the top edge recedes as the card tips back onto the table
    const cx = 960, cy = mix(460, 470, e), tilt = e;            // 0 upright … 1 flat
    const hh = ch * mix(1, .02, tilt), topW = cw * mix(1, .55, tilt), botW = cw * mix(1, 1.3, tilt), grow = mix(1, 4.6, ein(clamp((u - .45) / .55)));
    const N = 40;
    ctx.save(); ctx.globalAlpha = 1 - sm(lin(.55, 1, u));
    for (let i = 0; i < N; i++) {
      const v0 = i / N, v1 = (i + 1) / N, vw = mix(topW, botW, (v0 + v1) / 2) * grow, sy0 = cy - hh / 2 * grow + hh * grow * v0;
      ctx.drawImage(card, 0, ch * v0, cw, ch / N + 1, cx - vw / 2, sy0, vw, hh * grow / N + 1);
    }
    // the card's face warms into wood light as it lands
    ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = rgba(AMB, .5 * e); ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  paper(ctx, .07, t);
}

// ---------------------------------------------------------------- K2 · the floor, an empty wallet
function floorPlate() {
  return big('s06:floor', () => {
    const [c, g] = lay(), r = prng(71), n = vnoise(8);
    g.fillStyle = '#211726'; g.fillRect(0, 0, W, H);
    // diagonal floorboards
    g.save(); g.translate(W / 2, H / 2); g.rotate(-.42); g.translate(-W, -H);
    for (let x = 0; x < W * 2; x += 150) {
      const tone = mixHex('#2c1d26', '#3a2630', r()); g.fillStyle = tone; g.fillRect(x, 0, 150, H * 2);
      g.strokeStyle = '#a07050'; g.lineCap = 'round';
      for (let k = 0; k < 16; k++) { g.globalAlpha = .05 + .08 * r(); g.lineWidth = 1; g.beginPath(); for (let y = 0; y < H * 2; y += 14) { const xx = x + 8 + k * 9 + Math.sin(y * .004 + k) * 3 + (n(k, y * .01) - .5) * 3; y ? g.lineTo(xx, y) : g.moveTo(xx, y); } g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = 'rgba(0,0,0,.7)'; g.fillRect(x, 0, 2.5, H * 2);
      for (let y = r() * 600; y < H * 2; y += 500 + r() * 600) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x, y, 150, 2); g.fillStyle = 'rgba(30,20,30,.9)'; g.beginPath(); g.arc(x + 20, y + 10, 2.5, 0, 7); g.arc(x + 130, y + 10, 2.5, 0, 7); g.fill(); }
    }
    g.restore();
    // the lamp spill from beyond the table edge (top of frame is under the table: dark)
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(980, 660, 0, 980, 660, 820); rg.addColorStop(0, rgba('#ffc47c', .42)); rg.addColorStop(.45, rgba(AMB, .18)); rg.addColorStop(1, rgba(AMB, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .55, g: 1.1, seed: 5 }); g.globalCompositeOperation = 'lighter'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over'; }
    // under-table shadow band across the top, with a soft edge (the table's edge line)
    { const pts = [[-20, -20], [W + 20, -20], [W + 20, 250], [-20, 300]]; g.save(); g.filter = 'blur(18px)'; roughPoly(g, pts, 'rgba(6,4,14,.82)', { amp: 4, seed: 3 }); g.restore(); }
    radial(g, 960, 600, 1300, [[0, 'rgba(0,0,0,0)'], [.6, 'rgba(8,6,20,.3)'], [1, 'rgba(8,6,20,.85)']], { sy: .7 });
    g.save(); hatch(g, [0, 0, W, 320], { angle: .5, gap: 6, col: '#05040c', a: .3, seed: 9, broken: .4 }); g.restore();
    return c;
  });
}
const WAL = [930, 640];
function wallet(ctx, u, t) {   // u: 0 open … 1 shut (left half folds over the right)
  const [x, y] = WAL, w = 230, h = 180, leather = '#7a4228', inner = '#5e3020';
  // shadow
  ctx.save(); ctx.filter = 'blur(10px)'; ctx.fillStyle = 'rgba(4,2,8,.6)'; ctx.fillRect(x - w * (1 - u) + 14, y - h / 2 + 16, w * (2 - u), h); ctx.restore();
  // right half (inside: card slots)
  roughRect(ctx, x, y - h / 2, w, h, inner, { amp: .8, seed: 2 });
  for (let k = 0; k < 3; k++) { const yy = y - h / 2 + 30 + k * 40; ctx.fillStyle = shade(inner, .05 + k * .02); ctx.beginPath(); ctx.moveTo(x + 14, yy); ctx.quadraticCurveTo(x + w / 2, yy - 8, x + w - 14, yy); ctx.lineTo(x + w - 14, y + h / 2 - 14); ctx.lineTo(x + 14, y + h / 2 - 14); ctx.closePath(); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = 1.5; ctx.stroke(); }
  ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,220,180,.35)'; ctx.lineWidth = 1.4; ctx.strokeRect(x + 8, y - h / 2 + 8, w - 16, h - 16); ctx.setLineDash([]);
  // spine
  ctx.fillStyle = shade(leather, -.12); ctx.fillRect(x - 5, y - h / 2, 10, h);
  // left half: open (inside, bill compartment, empty) or folding over
  const sx = Math.cos(Math.PI * u);           // 1 open (to the left), -1 shut (over the right half)
  ctx.save(); ctx.translate(x, y); ctx.scale(-sx, 1);
  const inside = sx > 0;
  roughRect(ctx, 0, -h / 2, w, h, inside ? inner : leather, { amp: .8, seed: 4 });
  if (inside) { ctx.fillStyle = shade(inner, -.06); ctx.fillRect(10, -h / 2 + 18, w - 20, 8); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(10, -h / 2 + 26, w - 20, 3); }
  else { ctx.fillStyle = 'rgba(255,210,160,.12)'; ctx.fillRect(0, -h / 2, w, 30); }
  ctx.setLineDash([5, 5]); ctx.strokeStyle = 'rgba(255,220,180,.35)'; ctx.lineWidth = 1.4; ctx.strokeRect(8, -h / 2 + 8, w - 16, h - 16); ctx.setLineDash([]);
  ctx.fillStyle = `rgba(0,0,0,${.35 * (1 - Math.abs(sx))})`; ctx.fillRect(0, -h / 2, w, h);
  ctx.restore();
}
export function K2(ctx, t, s, A) {
  const P = floorPlate();
  const cam = { x: 960 + drift(t, 7, 3), y: 560 + drift(t, 5, 1) - 30 * eout(lin(s.a, s.a + 1.2, t)), z: 1.08 + .03 * lin(s.a, s.b, t) };
  const m = camAt(cam, 1); ctx.save(); m.set(ctx); ctx.drawImage(P, 0, 0);
  const tLand = A.nothing + .95, tShut = A.money + .05;
  const shut = eio(lin(tShut, tShut + .42, t));
  wallet(ctx, shut, t);
  // the pencil drops in from above (approaching: big + blurred shadow), lands across the wallet, bounces, is knocked off
  {
    const f = clamp((t - (tLand - .45)) / .45);
    let px = 900, py = mix(-120, 610, ein(f)), sc = mix(1.5, 1, f), ang = mix(.9, .25, f), lift = 1 - f, roll = py / 9.5;
    if (t > tLand) { const b = t - tLand; py = 610 - Math.abs(Math.sin(b * 9)) * 22 * Math.exp(-b * 6); ang = .25 + b * .05; }
    if (t > tShut) { const k = eout(lin(tShut, tShut + .5, t)); px -= 380 * k; py += 120 * k; ang += 1.6 * k; roll += 18 * k; }
    ctx.save(); ctx.translate(px, py); ctx.scale(sc, sc); ctx.translate(-px, -py); drawPencil(ctx, px, py, ang, roll, { lift, lx: 980, ly: 300 }); ctx.restore();
  }
  dust(ctx, t, 980, 640, 500, 30, 5);
  ctx.restore();
  vignetteL(ctx, .2); paper(ctx, .07, t);
}

// ---------------------------------------------------------------- K3 · the stamp, never used
function deskPlate() {
  return big('s06:desk', () => {
    const [c, g] = lay(), r = prng(81), n = vnoise(9);
    // cool grey desk (permission = office grey), one cold window light from the upper left
    g.fillStyle = '#2b2e3a'; g.fillRect(0, 0, W, H);
    g.strokeStyle = '#9aa3b8'; for (let k = 0; k < 140; k++) { g.globalAlpha = .03 + .05 * r(); g.lineWidth = 1; g.beginPath(); const y0 = k * 8; for (let x = 0; x <= W; x += 16) { const y = y0 + Math.sin(x * .003 + k) * 4 + (n(x * .01, k) - .5) * 2; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.globalAlpha = 1;
    radial(g, 520, 260, 1500, [[0, 'rgba(210,222,240,.22)'], [.5, 'rgba(120,130,160,.06)'], [1, 'rgba(6,8,18,.6)']]);
    // the form: cream-grey paper, ruled, boxes, an empty stamp field
    g.save(); g.translate(860, 560); g.rotate(-.05);
    g.save(); g.filter = 'blur(12px)'; g.fillStyle = 'rgba(5,6,12,.55)'; g.fillRect(-420 + 16, -470 + 18, 840, 980); g.restore();
    roughRect(g, -420, -470, 840, 980, '#d6d2c6', { amp: 1, seed: 5 });
    g.fillStyle = '#3a3f52'; g.fillRect(-360, -410, 300, 14); g.fillStyle = '#9aa0ae'; g.fillRect(-360, -380, 180, 7);
    text(g, 'APPLICATION FOR APPROVAL', -360, -330, { size: 22, weight: 600, color: '#3a3f52', spacing: 4 });
    for (let k = 0; k < 9; k++) { const y = -270 + k * 52; g.fillStyle = 'rgba(58,63,82,.45)'; g.fillRect(-360, y, 720, 1.6); g.fillStyle = 'rgba(58,63,82,.5)'; g.fillRect(-360, y - 22, 90 + (k * 37) % 70, 6); }
    for (let k = 0; k < 4; k++) { g.strokeStyle = 'rgba(58,63,82,.6)'; g.lineWidth = 2; g.strokeRect(-360 + k * 190, 220, 22, 22); g.fillStyle = 'rgba(58,63,82,.45)'; g.fillRect(-326 + k * 190, 228, 100, 6); }
    // the empty field where a stamp would go
    g.setLineDash([10, 8]); g.strokeStyle = 'rgba(160,60,50,.65)'; g.lineWidth = 2.5; g.strokeRect(80, 300, 280, 150); g.setLineDash([]);
    text(g, 'OFFICIAL STAMP', 220, 478, { size: 14, weight: 600, color: 'rgba(160,60,50,.75)', spacing: 4, align: 'center' });
    g.restore();
    // an ink pad, closed, top right
    g.save(); g.translate(1520, 260); g.rotate(.12); g.save(); g.filter = 'blur(8px)'; g.fillStyle = 'rgba(5,6,12,.5)'; g.fillRect(-110 + 10, -70 + 12, 220, 140); g.restore(); roughRect(g, -110, -70, 220, 140, '#3a1a20', { amp: .6, seed: 7 }); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-100, -62, 200, 20); g.restore();
    return c;
  });
}
function stampSprite() {
  return spr('s06stamp', () => {
    const [c, g] = lay(240, 240); g.translate(120, 120);
    roughRect(g, -86, -56, 172, 112, '#6a4a32', { amp: .6, seed: 3 });           // wooden base
    g.fillStyle = 'rgba(255,220,180,.15)'; g.fillRect(-86, -56, 172, 18); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(-86, 40, 172, 16);
    g.fillStyle = '#4a3020'; g.beginPath(); g.arc(0, 0, 34, 0, 7); g.fill();          // neck
    g.fillStyle = '#7a5236'; g.beginPath(); g.arc(-3, -4, 42, 0, 7); g.fill();       // knob
    g.fillStyle = 'rgba(255,230,200,.25)'; g.beginPath(); g.ellipse(-14, -18, 18, 11, -.5, 0, 7); g.fill();
    return c;
  });
}
export function K3(ctx, t, s, A) {
  const P = deskPlate();
  const cam = { x: 980 + drift(t, 6, 2) - 40 * sine(lin(s.a, s.b, t)), y: 560 + drift(t, 5, 4), z: 1.1 };
  const m = camAt(cam, 1); ctx.save(); m.set(ctx); ctx.drawImage(P, 0, 0);
  // the stamp hovers over the empty field … and on "permission" is set down beside the form; the hand lets go
  const tp = A.permission;
  const hover = [1080, 900], rest = [1560, 640];
  const mv = eio(lin(tp - .05, tp + .5, t)), rel = eio(lin(tp + .55, tp + 1.0, t));
  const bob = Math.sin(t * 5) * 6 * (1 - mv);
  const sx = mix(hover[0], rest[0], mv) + bob * .3, sy = mix(hover[1], rest[1], mv) + bob - Math.sin(Math.PI * mv) * 40;
  const height = mix(1, 0, mv) * .6 + Math.sin(Math.PI * mv) * .5;          // lifted over the field, down at rest
  // shadow
  ctx.save(); ctx.filter = `blur(${6 + height * 16}px)`; ctx.globalAlpha = .55 - height * .2; ctx.fillStyle = '#04050c'; ctx.fillRect(sx - 86 + 30 + height * 70, sy - 56 + 34 + height * 80, 172, 112); ctx.restore();
  ctx.save(); ctx.translate(sx, sy); ctx.scale(1 + height * .12, 1 + height * .12); ctx.rotate(-.05 + mv * .3); ctx.drawImage(stampSprite(), -120, -120); ctx.restore();
  // the hand on the knob: comes with it, then withdraws to the right
  const Hd = handSprite('grey', { sleeve: '#59607a', skin: '#d9b08e', point: 0, grip: 1 });
  const hx = sx + 10 + rel * 900, hy = sy - 6 - rel * 240;
  drawHand(ctx, Hd, hx, hy, Math.PI + .35 + rel * .2, { lift: height + .2, lx: 520, ly: 260, sc: 1.05 });
  ctx.restore();
  // cool, grey: permission
  tintAll(ctx, '#0a0d1c', .12); vignetteL(ctx, .3); paper(ctx, .07, t);
}

// ---------------------------------------------------------------- K4 · you, alone at the kitchen table
const K4 = { lamp: [930, 330], tableY: 720, you: [1290, 742], youS: 1.9 };
function kitchenPlate() {
  return big('s06:kitchen', () => {
    const [c, g] = lay(), r = prng(91), n = vnoise(11);
    // back wall: deep indigo-violet, plaster hatch
    vgrad(g, 0, 0, W, H, [[0, '#120f2c'], [.6, '#1d1840'], [1, '#14112c']]);
    g.save(); hatch(g, [0, 0, W, 900], { angle: -.08, gap: 5, w: 1, col: '#3a3470', a: .12, seed: 2, broken: .5 }); g.restore();
    // window, left: night street outside, a neighbour's windows far, a few stars
    const wx = 240, wy = 150, ww = 470, wh = 450;
    roughRect(g, wx - 16, wy - 16, ww + 32, wh + 32, '#0d0b20', { amp: 1, seed: 3 });
    vgrad(g, wx, wy, ww, wh, [[0, '#0a1032'], [.7, '#1c2a5a'], [1, '#2c3a6a']]);
    { const rr = prng(5); for (let i = 0; i < 40; i++) { g.fillStyle = rgba('#d8e4ff', .2 + .5 * rr()); g.fillRect(wx + rr() * ww, wy + rr() * wh * .5, 1.4, 1.4); } }
    g.save(); g.beginPath(); g.rect(wx, wy, ww, wh); g.clip();
    { const rr = prng(6); let x = wx - 20; while (x < wx + ww) { const w = 50 + rr() * 80, h = 90 + rr() * 160; house(g, rr, x + w / 2, wy + wh + 4, w, h, { wall: mixHex('#0d1430', '#141c40', rr()), lit: (a, b, q) => q() < .22 ? .9 : 0, amp: .6, floorH: 30, colW: 26, trim: false, chimney: .5, side: 0 }); x += w + 4; } }
    g.restore();
    roughRect(g, wx + ww / 2 - 5, wy, 10, wh, '#0d0b20', { amp: .5, seed: 4 }); roughRect(g, wx, wy + wh * .45, ww, 9, '#0d0b20', { amp: .5, seed: 5 });
    roughRect(g, wx - 30, wy + wh + 10, ww + 60, 18, '#221c44', { amp: .7, seed: 6 });     // sill
    // a plant on the sill
    { const px = wx + 90, py = wy + wh + 10; roughRect(g, px - 26, py - 44, 52, 46, '#7a3e28', { amp: .6, seed: 7 }); const rr = prng(7); for (let k = 0; k < 14; k++) { const a = -Math.PI / 2 + (rr() - .5) * 2.2, l = 40 + rr() * 60; g.strokeStyle = mixHex('#1d3a2a', '#3a6a40', rr()); g.lineWidth = 5; g.beginPath(); g.moveTo(px, py - 44); g.quadraticCurveTo(px + Math.cos(a) * l * .5, py - 44 + Math.sin(a) * l * .8, px + Math.cos(a) * l, py - 44 + Math.sin(a) * l); g.stroke(); } }
    // shelf on the right with jars and cups, rim-lit by the lamp
    { const sy = 330; roughRect(g, 1440, sy, 420, 12, '#2a2350', { amp: .6, seed: 8 }); const rr = prng(9); let x = 1460; while (x < 1830) { const w = 26 + rr() * 34, h = 40 + rr() * 70; roughRect(g, x, sy - h, w, h, mixHex('#2c2552', '#3d3368', rr()), { amp: .6, seed: x }); g.fillStyle = rgba('#ffc58a', .35); g.fillRect(x, sy - h, 2, h); x += w + 6 + rr() * 10; }
      roughRect(g, 1440, sy + 170, 420, 12, '#2a2350', { amp: .6, seed: 10 }); x = 1470; while (x < 1830) { const w = 40 + rr() * 30, h = 26 + rr() * 34; roughRect(g, x, sy + 170 - h, w, h, mixHex('#3a2f62', '#4a3c78', rr()), { amp: .6, seed: x + 1 }); g.fillStyle = rgba('#ffc58a', .3); g.fillRect(x, sy + 170 - h, 2, h); x += w + 10; } }
    // floor
    vgrad(g, 0, 880, W, 200, [[0, '#1a1532'], [1, '#0c0a1c']]);
    for (let k = 0; k < 10; k++) { const y = 880 + Math.pow(k / 10, 1.6) * 200; g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(0, y, W, 1.5); }
    roughLine(g, [[0, 880], [W, 878]], { w: 4, col: '#0c0a1c', seed: 11 });
    // the lamp's light on the wall (hero), stippled falloff
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(K4.lamp[0], K4.lamp[1] + 60, 0, K4.lamp[0], K4.lamp[1] + 60, 900); rg.addColorStop(0, rgba('#ffc98a', .5)); rg.addColorStop(.3, rgba(AMB, .22)); rg.addColorStop(1, rgba(AMB, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .25, g: 1.1, seed: 12 }); g.globalCompositeOperation = 'lighter'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over'; }
    // the far chair (empty, pushed in) left of the table
    { const cx = 470, fy = 880; g.fillStyle = '#0f0c22'; roughRect(g, cx - 8, 560, 16, fy - 560, '#0f0c22', { amp: .6, seed: 13 }); roughRect(g, cx - 8, 560, 70, 14, '#0f0c22', { amp: .5, seed: 14 }); roughRect(g, cx - 4, 640, 60, 10, '#0f0c22', { amp: .5, seed: 15 }); roughRect(g, cx + 70, 780, 12, 100, '#0f0c22', { amp: .5, seed: 16 }); g.fillStyle = rgba('#ffc58a', .35); g.fillRect(cx + 8, 560, 2, 200); }
    return c;
  });
}
function tableFront() {   // table in front of the figure (side view), objects on it
  return big('s06:kitchenTable', () => {
    const [c, g] = lay(), y = K4.tableY;
    // top surface (seen a touch from above), front edge, legs
    roughPoly(g, [[560, y - 26], [1215, y - 26], [1240, y + 6], [532, y + 6]], '#6a4230', { amp: .8, seed: 1 });
    { const rg = g.createRadialGradient(K4.lamp[0], y - 10, 0, K4.lamp[0], y - 10, 520); rg.addColorStop(0, rgba('#ffd59a', .7)); rg.addColorStop(1, rgba('#ffd59a', 0)); g.save(); g.beginPath(); roughPath(g, [[560, y - 26], [1215, y - 26], [1240, y + 6], [532, y + 6]], { amp: .8, seed: 1 }); g.clip(); g.fillStyle = rg; g.fillRect(500, y - 40, 800, 60); g.restore(); }
    roughRect(g, 532, y + 6, 708, 30, '#2a1a1c', { amp: .8, seed: 2 }); g.fillStyle = rgba('#ffc98a', .4); g.fillRect(532, y + 6, 708, 2);
    for (const lx of [570, 1190]) roughRect(g, lx, y + 36, 22, 880 - y - 36, '#1c1220', { amp: .6, seed: lx });
    // papers, a mug and the folded map on the top
    roughPoly(g, [[820, y - 22], [1010, y - 25], [1032, y - 4], [800, y - 2]], '#e9dcc0', { amp: .4, seed: 3 });
    roughPoly(g, [[1010, y - 20], [1150, y - 22], [1160, y - 6], [1000, y - 5]], '#d8c6a0', { amp: .4, seed: 4 });
    roughRect(g, 660, y - 66, 42, 46, '#d9d2c4', { amp: .4, seed: 5 }); g.strokeStyle = '#d9d2c4'; g.lineWidth = 6; g.beginPath(); g.arc(646, y - 44, 13, 1.5, 4.8); g.stroke();
    g.fillStyle = rgba('#ffd59a', .45); g.fillRect(690, y - 66, 10, 44);
    // shadow under the table on the floor
    g.save(); g.filter = 'blur(16px)'; g.fillStyle = 'rgba(4,3,10,.55)'; g.beginPath(); g.ellipse(900, 885, 420, 26, 0, 0, 7); g.fill(); g.restore();
    return c;
  });
}
function lampLayer(ctx, t) {
  const [x, y] = K4.lamp, sw = Math.sin(t * .9) * .015;
  ctx.save(); ctx.translate(x, -20); ctx.rotate(sw); ctx.translate(-x, 20);
  roughLine(ctx, [[x, -20], [x, y - 38]], { w: 3, col: '#08061a', seed: 1 });
  roughPoly(ctx, [[x - 74, y + 10], [x + 74, y + 10], [x + 28, y - 40], [x - 28, y - 40]], '#1e3a32', { amp: .6, seed: 2 });
  ctx.fillStyle = rgba('#ffd59a', .5); ctx.fillRect(x - 74, y + 8, 148, 3);
  glowAt(ctx, x, y + 14, 70, .9, AMB, '#fff6e0');
  ctx.restore();
}
export function youAtTable(key = 'k4') {
  const P = { lean: .38, head: .5, sh: [1.05, .95], el: [.75, .85], hip: [1.52, 1.44], kn: [1.5, 1.42], hair: 'long' };
  return fig('you-sit-' + key, K4.youS, P, { flip: true, dress: { coat: '#e59a3a', pants: '#2a2c3a', shoes: '#14100c', skin: '#e9c3a0', hair: '#3a2214' }, light: { dx: -200, dy: -500, col: '#ffd9a0', a: .55 }, shadeA: .18, shadeCol: '#1a120a', rim: '#ffe0a8', rimSide: -1, rimW: 2.2 });
}
export function K4pool(cam) { const m = camAt(cam, 1); return [m.X(K4.lamp[0]), m.Y(K4.tableY - 14)]; }
export function K4hand(cam) { const F = youAtTable(), [hx, hy] = F.hand(0), m = camAt(cam, 1); return [m.X(K4.you[0] + hx), m.Y(K4.you[1] + hy)]; }
export const K4cam = (t, a) => ({ x: 1000 + drift(t, 6, 1) + 60 * sine(lin(a, a + 2.2, t)), y: 590 + drift(t, 4, 2), z: mix(1.1, 1.3, sine(lin(a, a + 2.2, t))) });
export function K4draw(ctx, t, s, A) {
  const cam = K4cam(t, s.a);
  stage(ctx, [
    { c: kitchenPlate(), p: .85 },
    { c: tableFront(), p: 1 },
    { p: 1, fn: (g) => {
      // the chair you sit on (behind you), then you (at the end of the table)
      const [x, y] = K4.you; roughRect(g, x + 62, y - 230, 18, 368, '#120e26', { amp: .6, seed: 21 }); roughRect(g, x - 60, y + 14, 140, 14, '#120e26', { amp: .5, seed: 22 }); roughRect(g, x - 54, y + 26, 12, 112, '#120e26', { amp: .5, seed: 23 }); g.fillStyle = rgba('#ffc58a', .3); g.fillRect(x + 62, y - 230, 2, 200);
      const F = youAtTable(); drawFig(g, F, x, y, t, { breath: 1.4, sway: .6, feet: false });
    } },
    { p: 1, fn: (g) => { lampLayer(g, t); dust(g, t, K4.lamp[0], 560, 360, 40, 9); } },
  ], cam);
  // the lamp cone (screen-space after the stage so it follows the camera)
  { const m = camAt(cam, 1); ctx.save(); m.set(ctx); ctx.globalAlpha = .9 + .1 * Math.sin(t * 1.7); ctx.drawImage(lampCone(), 0, 0); ctx.restore(); }
  vignetteL(ctx, .35); paper(ctx, .07, t);
}
function lampCone() { return big('s06:k4cone', () => { const [c, g] = lay(); coneL(g, K4.lamp[0], K4.lamp[1] + 12, { spread: .5, len: 470, col: '#ffd59a', a: .2, k: .6, seed: 31, soft: .4 }); return c; }); }

// ---------------------------------------------------------------- K5 · the map, the idea, the help
// The map's river is laid out so that, at the end of the push-in, it sits where the real river of V sits.
export let RIVER_SCREEN = null;   // set by s06.mjs: function q -> [x,y] (V's river centre line in screen space, at V's first frame)
const K5end = { x: 1000, y: 520, z: 2.0 };
function invCam(cam, p) { const m = camAt(cam, 1); return [(p[0] - W / 2) / m.k + (W / 2 + (cam.x - W / 2)), (p[1] - H / 2) / m.k + (H / 2 + (cam.y - H / 2))]; }
export function setRiver(fn) { RIVER_SCREEN = fn; }
function mapRiverPts() { const pts = []; for (let i = 0; i <= 80; i++) pts.push(invCam(K5end, RIVER_SCREEN(i / 80))); return pts; }
function mapPlate() {
  return big('s06:map', () => {
    const [c, g] = lay(), r = prng(101), n = vnoise(13);
    // table under the map (same wood as K1, lamp pool)
    g.drawImage(tablePlate(), 0, 0);
    // the map sheet: cream paper, slightly curled corners, folds
    const sheet = [[180, 60], [1760, 40], [1790, 1010], [150, 1040]];
    g.save(); g.filter = 'blur(14px)'; roughPoly(g, sheet.map(([x, y]) => [x + 18, y + 20]), 'rgba(5,4,10,.6)', { amp: 2, seed: 2 }); g.restore();
    roughPoly(g, sheet, '#e8dcc0', { amp: 1.5, seed: 3 });
    g.save(); g.beginPath(); roughPath(g, sheet, { amp: 1.5, seed: 3 }); g.clip();
    // terrain: contour lines from a height field (valley along the river)
    const RP = mapRiverPts();
    const dRiver = (x, y) => { let d = 1e9; for (let i = 0; i < RP.length; i += 2) { const dx = x - RP[i][0], dy = y - RP[i][1]; d = Math.min(d, dx * dx + dy * dy); } return Math.sqrt(d); };
    { const step = 6, gw = Math.ceil(W / step), gh = Math.ceil(H / step), hf = new Float32Array(gw * gh);
      for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const x = i * step, y = j * step; hf[j * gw + i] = Math.min(1, dRiver(x, y) / 520) * .75 + fbm(n, x * .004, y * .004, 4) * .45; }
      // marching-squares-lite: draw short segments where the field crosses levels
      g.strokeStyle = '#8a6a48'; g.lineWidth = 1.1;
      for (let L = 1; L < 14; L++) { const lv = L * .085; g.globalAlpha = L % 4 === 0 ? .55 : .28; g.beginPath();
        for (let j = 0; j < gh - 1; j++) for (let i = 0; i < gw - 1; i++) {
          const a = hf[j * gw + i], b = hf[j * gw + i + 1], c2 = hf[(j + 1) * gw + i + 1], d = hf[(j + 1) * gw + i];
          const pts = []; const e = (p, q, x0, y0, x1, y1) => { if ((p - lv) * (q - lv) < 0) { const u = (lv - p) / (q - p); pts.push([mix(x0, x1, u), mix(y0, y1, u)]); } };
          const x = i * step, y = j * step; e(a, b, x, y, x + step, y); e(b, c2, x + step, y, x + step, y + step); e(d, c2, x, y + step, x + step, y + step); e(a, d, x, y, x, y + step);
          if (pts.length >= 2) { g.moveTo(...pts[0]); g.lineTo(...pts[1]); }
        }
        g.stroke(); }
      g.globalAlpha = 1; }
    // forest stipple on the slopes, fields as hatched patches
    { const rr = prng(4); for (let i = 0; i < 2600; i++) { const x = 160 + rr() * 1620, y = 50 + rr() * 980, d = dRiver(x, y); if (d < 60 || d > 420 || rr() < .4) continue; g.fillStyle = rgba('#5a7a4a', .35 + .3 * rr()); g.beginPath(); g.arc(x, y, 1.6 + rr() * 2.2, 0, 7); g.fill(); } }
    for (let k = 0; k < 9; k++) { const x = 240 + r() * 1400, y = 120 + r() * 820; if (dRiver(x, y) < 90) continue; g.save(); g.translate(x, y); g.rotate(r() * 3); g.beginPath(); g.rect(-50, -30, 100 + r() * 60, 60 + r() * 30); g.clip(); hatch(g, [-60, -40, 200, 120], { angle: r() * 3, gap: 5, col: '#a07a4a', a: .5, seed: k, broken: .1 }); g.restore(); }
    // the river in ink (blue-grey), wider downstream
    for (const [w, col] of [[16, '#7a96a8'], [8, '#4a6a82']]) { g.strokeStyle = col; g.lineCap = 'round'; for (let i = 0; i < RP.length - 1; i++) { g.lineWidth = w * mix(.35, 1.4, i / RP.length); g.beginPath(); g.moveTo(...RP[i]); g.lineTo(...RP[i + 1]); g.stroke(); } }
    // the town on the slope (tiny ink blocks), roads
    { const [tx, ty] = RP[Math.floor(RP.length * .45)]; const rr = prng(6); for (let i = 0; i < 46; i++) { const x = tx + 120 + rr() * 200, y = ty - 140 + rr() * 170; g.fillStyle = rgba('#4a3a30', .7); g.fillRect(x, y, 8 + rr() * 12, 6 + rr() * 9); }
      g.strokeStyle = 'rgba(90,60,40,.55)'; g.lineWidth = 3; g.setLineDash([12, 6]); g.beginPath(); g.moveTo(tx + 60, ty + 40); g.bezierCurveTo(tx + 300, ty, tx + 600, ty + 200, tx + 900, ty + 120); g.stroke(); g.setLineDash([]); }
    // fold creases + edge darkening
    g.strokeStyle = 'rgba(120,90,60,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(960, 40); g.lineTo(975, 1040); g.moveTo(160, 540); g.lineTo(1790, 525); g.stroke();
    radial(g, 900, 480, 1300, [[0, 'rgba(0,0,0,0)'], [.55, 'rgba(60,30,10,.08)'], [1, 'rgba(30,14,6,.55)']]);
    g.restore();
    // lamp light warms the sheet (stippled)
    { const [lc, lx] = lay(); const rg = lx.createRadialGradient(900, 420, 0, 900, 420, 900); rg.addColorStop(0, rgba('#ffc98a', .28)); rg.addColorStop(1, rgba(AMB, 0)); lx.fillStyle = rg; lx.fillRect(0, 0, W, H); stipple(lc, { k: .5, seed: 14 }); g.globalCompositeOperation = 'soft-light'; g.drawImage(lc, 0, 0); g.globalCompositeOperation = 'source-over'; }
    return c;
  });
}
// pencil circle drawn by you ("one idea"): amber pencil loop around a river bend
function idea(ctx, u, cx, cy) {
  if (u <= 0) return; const N = 60, R = 120; ctx.save(); ctx.strokeStyle = '#d0782a'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.globalAlpha = .85; ctx.beginPath();
  for (let i = 0; i <= N * u * 1.08; i++) { const a = -2.2 + i / N * 6.6, rr = R * (1 + .06 * Math.sin(i * .5)) * (1 + i / N * .05); const x = cx + Math.cos(a) * rr * 1.25, y = cy + Math.sin(a) * rr * .85; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
  ctx.stroke(); ctx.restore();
}
export function K5(ctx, t, s, A) {
  const P = mapPlate(), RP = mapRiverPts();
  // camera: settle over the map, then the push down onto the river (handing over to the valley)
  const push = sine(lin(A.ago - .55, s.b, t));
  const cam = { x: mix(960, K5end.x, push) + drift(t, 6, 1) * (1 - push), y: mix(560, K5end.y, push) + drift(t, 5, 2) * (1 - push), z: mix(1.12, K5end.z, push) };
  const m = camAt(cam, 1); ctx.save(); m.set(ctx); ctx.drawImage(P, 0, 0);
  // one idea: the circle around a bend
  const bend = RP[Math.floor(RP.length * .62)];
  idea(ctx, eout(lin(A.idea - .45, A.idea + .35, t)), bend[0], bend[1]);
  // the help: a small cyan-white point that wakes beside your finger on "help" and traces the river, upstream and down
  const tH = A.help, tr = lin(tH + .25, A.ago - .1, t);
  // finger path: enters (one person), goes to the bend (one idea), then points upstream; the point follows / runs ahead
  const fA = [1350, 980], fB = [bend[0] + 150, bend[1] + 40], up = RP[Math.floor(RP.length * .25)];
  const enterU = eout(lin(A.person - .55, A.person + .25, t)), toBend = eio(lin(A.idea - .7, A.idea - .1, t)), toUp = eio(lin(tH + .1, A.ago - .3, t));
  let fx = mix(fA[0] + 400, fA[0], enterU), fy = mix(fA[1] + 160, fA[1], enterU);
  fx = mix(fx, fB[0], toBend); fy = mix(fy, fB[1], toBend);
  fx = mix(fx, up[0] + 70, toUp); fy = mix(fy, up[1] + 50, toUp);
  fx += Math.sin(t * 1.3) * 4; fy += Math.cos(t * 1.1) * 3;
  // cyan trace (drawn under the hand)
  if (t > tH) {
    const k = Math.floor(RP.length * .62), i0 = Math.round(mix(k, 0, eio(tr))), i1 = Math.round(mix(k, RP.length - 1, eio(lin(tH + .6, A.ago + .4, t))));
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const seg = (a, b) => { ctx.beginPath(); ctx.moveTo(...RP[a]); for (let i = a + 1; i <= b; i++) ctx.lineTo(...RP[i]); };
    ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(C.cyan, .25); ctx.lineWidth = 18; seg(i0, i1); ctx.stroke(); ctx.strokeStyle = rgba(C.cyan, .45); ctx.lineWidth = 7; seg(i0, i1); ctx.stroke();
    ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = C.cyanWhite; ctx.lineWidth = 2.6; seg(i0, i1); ctx.stroke();
    // little survey marks the help adds along the river (sample points)
    for (let i = i0; i <= i1; i += 7) { const [x, y] = RP[i]; ctx.strokeStyle = rgba(C.cyanWhite, .8); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  // the hand
  const Hd = handSprite('amber', { sleeve: '#e59a3a', skin: '#e9c3a0', point: 1 });
  drawHand(ctx, Hd, fx, fy, -2.45 + .15 * toUp, { lift: .1, lx: 900, ly: 300, sc: .95 });
  // the cyan point itself (the only machine colour): wakes on "help", hovers by the finger, runs ahead up the river
  if (t > tH - .1) {
    const w = eout(lin(tH - .1, tH + .3, t));
    const head = RP[Math.round(mix(Math.floor(RP.length * .62), 0, eio(tr)))];
    const px = mix(fx + 26, head[0], sm(lin(tH + .2, tH + .6, t))), py = mix(fy - 30, head[1], sm(lin(tH + .2, tH + .6, t))) + Math.sin(t * 6) * 3;
    glowAt(ctx, px, py, 60 * w, .7 * w, C.cyan, C.cyanWhite); ctx.fillStyle = rgba(C.cyanWhite, w); ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill();
  }
  ctx.restore();
  vignetteL(ctx, .3); paper(ctx, .07, t);
}
export const K5_END = K5end;
