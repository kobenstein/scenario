// raum.mjs · Test "one imaginative space" (Jakob 2026-10-20 08:07): the Film 4 hook (24 s) as ONE continuous world in
// Film 5's drawing style. No cuts and no scene switches: objects enter, stay, leave or transform, and the camera flies.
//
// Space plan (world units; the ground runs along y = 700, the income line floats at y = 250):
//   0.0  dawn. A floating strip of paper land: your house (x 300) and, along a road, the office tower (x 860).
//   1.5  "One day soon"             the camera drifts in; a small figure walks from the house toward the tower
//   3.4  "never have to work again" the tower's windows go dark one by one, it folds flat into the ground (leaves)
//   6.4  "Your income"              an amber envelope rises from your mailbox (stays)
//   7.3  "taken care of"            it opens; an amber line draws out of it and runs right (the explainer element)
//   8.7  "For the rest of your life" the camera flies along the line; age ticks 30 … 90 appear on it, the land below
//                                    changes with the seasons (spring → summer → autumn → winter)
//  11.8  "So what do you do?"        the camera rises high and looks back over the whole world
//  13.6  "Sleep in."                 the house window dims, a moon rises over it
//  14.7  "Travel."                   a paper plane leaves the house and arcs over the land to the lake
//  15.8  "Finally rest."             it lands and unfolds into a hammock between two trees; you lie in it
//  18.3  "But a few months in"       sun and moon circle over the lake: months pass
//  20.3  "hit a wall"                a paper wall rises out of the ground in front of the hammock (enters)
//  21.8  "the reason isn't …"        the camera climbs the wall: the income line runs on above it, unbroken.
//                                    It is not the money. A question mark is cut into the wall.
import { W, H, rgba, clamp, lin, mix, eout, eio, sm, prng, drift, canvas, text, addGlow, glow } from './engine.mjs';
import { filmFinish, fibreFill } from './lib/print.mjs';
import { paperSheet } from './lib/paper.mjs';
import { motes } from './lib/sc04_art.mjs';

export const DUR = 24.4;
const AMBER = '#ffb35c', HOT = '#ffe2b0', CREAM = '#f3efe2', INKBG = '#0c0c24';
const eoX = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * clamp(x)));
const eiX = (x) => (x <= 0 ? 0 : Math.pow(2, 10 * clamp(x) - 10));
const k = (a, b, t, f = eio) => f(lin(a, b, t));
const bump = (u) => Math.sin(Math.PI * clamp(u));
const GY = 700, LY = 250, AGE0 = 600, PER = 68;   // ground, income line, x of age 30, px per year
const ageX = (a) => AGE0 + (a - 30) * PER;          // age 90 → 4680
const LAKE = [1480, 2260], HAM = [1780, 1980];      // lake extent, hammock trees
const WALLX = 2080;

// ---------------------------------------------------------------- camera: one continuous flight
const KEYS = [
  [0, 560, 520, 1.18], [1.2, 560, 520, 1.18], [3.0, 620, 500, 1.3], [5.6, 560, 470, 1.3],
  [6.6, 420, 430, 1.42], [8.4, 700, 380, 1.15], [10.9, 4300, 420, 1.0],
  [12.9, 2150, 380, .43], [13.9, 1300, 470, .62], [15.0, 1400, 500, .8], [16.4, 1880, 590, 1.25], [17.8, 1880, 600, 1.4],
  [19.6, 1990, 560, 1.0], [21.6, 2110, 540, .88], [23.4, 2190, 400, .95], [24.4, 2200, 385, .98],
];
function cam(t) {
  let i = 0; while (i < KEYS.length - 2 && t > KEYS[i + 1][0]) i++;
  const [t0, x0, y0, z0] = KEYS[i], [t1, x1, y1, z1] = KEYS[i + 1], u = eio(clamp((t - t0) / (t1 - t0)));
  // zoom eases in log space so a big pull-back feels like an even flight
  return { x: mix(x0, x1, u) + drift(t, 5, 1), y: mix(y0, y1, u) + drift(t, 4, 2), z: Math.exp(mix(Math.log(z0), Math.log(z1), u)) * (1 + .006 * Math.sin(t * .5)) };
}
function view(g, c, p = 1) {   // p < 1: a far layer (moves less, scales less)
  const z = 1 + (c.z - 1) * p;
  g.setTransform(z, 0, 0, z, W / 2 - c.x * p * z, H / 2 - (c.y * p + (1 - p) * 400) * z);
}

// ---------------------------------------------------------------- land
const groundY = (x) => GY - 26 * Math.sin(x * .0042 + 1) - 14 * Math.sin(x * .011) - (x > LAKE[0] - 120 && x < LAKE[1] + 120 ? -6 : 0);
const season = (x) => x < 1600 ? 0 : x < 2600 ? 1 : x < 3700 ? 2 : 3;   // spring, summer, autumn, winter
const LEAF = [['#5f9a86', '#7fb8a0'], ['#3f7d6a', '#5d9c74'], ['#c9743a', '#e8a04f'], ['#c9d3e0', '#eef2f6']];
function land(g, t, c) {
  // far ridge (parallax .55) and mid ridge (.8)
  for (const [p, col, amp, seed] of [[.55, '#232554', 90, 3], [.8, '#2c2b5c', 60, 7]]) {
    view(g, c, p); const r = prng(seed);
    g.beginPath(); g.moveTo(-3000, 1400);
    for (let x = -3000; x <= 7000; x += 40) g.lineTo(x, GY - 120 * p - amp * (Math.sin(x * .0016 + seed) * .6 + Math.sin(x * .0041 + seed * 2) * .4));
    g.lineTo(7000, 1400); g.closePath(); g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 30; g.shadowOffsetY = -6; g.fillStyle = col; g.fill(); g.restore();
    g.beginPath(); g.moveTo(-3000, 1400); for (let x = -3000; x <= 7000; x += 40) g.lineTo(x, GY - 120 * p - amp * (Math.sin(x * .0016 + seed) * .6 + Math.sin(x * .0041 + seed * 2) * .4)); g.lineTo(7000, 1400); g.closePath(); fibreFill(g, .35);
  }
  view(g, c, 1);
  // the floating land strip: top surface + its paper thickness
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 40; g.shadowOffsetY = 24;
  g.beginPath(); g.moveTo(-500, groundY(-500)); for (let x = -500; x <= 5300; x += 20) g.lineTo(x, groundY(x)); g.lineTo(5300, GY + 260); g.lineTo(-500, GY + 260); g.closePath();
  const gr = g.createLinearGradient(0, GY - 40, 0, GY + 260); gr.addColorStop(0, '#3d3a70'); gr.addColorStop(.25, '#2a2853'); gr.addColorStop(1, '#141432'); g.fillStyle = gr; g.fill(); g.restore();
  g.beginPath(); g.moveTo(-500, groundY(-500)); for (let x = -500; x <= 5300; x += 20) g.lineTo(x, groundY(x)); g.lineTo(5300, GY + 260); g.lineTo(-500, GY + 260); g.closePath(); fibreFill(g, .45);
  // lit top rim of the land (the sheet's edge catches the light)
  g.strokeStyle = rgba('#ffd9b0', .45); g.lineWidth = 2.2; g.beginPath(); for (let x = -500; x <= 5300; x += 20) x === -500 ? g.moveTo(x, groundY(x)) : g.lineTo(x, groundY(x)); g.stroke();
  // the lake (a cut in the land showing the sky's light), with glints
  g.save(); g.beginPath(); g.moveTo(LAKE[0], groundY(LAKE[0]) + 4); g.bezierCurveTo(LAKE[0] + 80, GY + 50, LAKE[1] - 80, GY + 54, LAKE[1], groundY(LAKE[1]) + 4); g.closePath();
  const lg = g.createLinearGradient(0, GY - 10, 0, GY + 50); lg.addColorStop(0, '#6b6aa6'); lg.addColorStop(1, '#2d2c62'); g.fillStyle = lg; g.fill(); g.clip();
  const r = prng(4); g.fillStyle = rgba('#ffe7c8', .35); for (let i = 0; i < 30; i++) { const x = LAKE[0] + 60 + r() * (LAKE[1] - LAKE[0] - 120), y = GY + 6 + r() * 30; g.fillRect(x + Math.sin(t * 1.3 + i) * 6, y, 14 + r() * 30, 1.6); }
  g.restore();
  // road from the house to the tower
  g.strokeStyle = rgba('#8c86b8', .55); g.lineWidth = 5; g.setLineDash([16, 12]); g.beginPath(); for (let x = 360; x <= 860; x += 10) x === 360 ? g.moveTo(x, groundY(x) + 10) : g.lineTo(x, groundY(x) + 10); g.stroke(); g.setLineDash([]);
  // trees: each a small paper lollipop; leaf colour follows the season of its place on the line of life
  const rt = prng(17);
  for (let x = -380; x < 5200; x += 70 + rt() * 110) {
    if (x > 200 && x < 420 || x > 760 && x < 960 || x > LAKE[0] - 30 && x < LAKE[1] + 30) continue;
    const s = .7 + rt() * .6, sea = season(x), [c1, c2] = LEAF[sea], y = groundY(x), sway = Math.sin(t * .8 + x * .01) * 2;
    tree(g, x, y, s, c1, c2, sway, sea === 3);
  }
}
function tree(g, x, y, s, c1, c2, sway = 0, snow = false) {
  g.fillStyle = '#2a2140'; g.fillRect(x - 3 * s, y - 40 * s, 6 * s, 42 * s);
  g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 10; g.shadowOffsetY = 5;
  const gr = g.createLinearGradient(x - 30 * s, y - 100 * s, x + 30 * s, y - 40 * s); gr.addColorStop(0, c2); gr.addColorStop(1, c1);
  g.fillStyle = gr; g.beginPath(); g.ellipse(x + sway, y - 70 * s, 26 * s, 36 * s, 0, 0, 7); g.fill(); g.restore();
  if (snow) { g.fillStyle = rgba('#ffffff', .85); g.beginPath(); g.ellipse(x + sway, y - 98 * s, 18 * s, 8 * s, 0, 0, 7); g.fill(); }
  g.strokeStyle = rgba('#fff2dc', .35); g.lineWidth = 1.4; g.beginPath(); g.ellipse(x + sway, y - 70 * s, 26 * s, 36 * s, 0, Math.PI * 1.1, Math.PI * 1.75); g.stroke();
}

// ---------------------------------------------------------------- the house, the tower, the figure
function house(g, t) {
  const x = 300, y = groundY(300);
  g.save(); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 16; g.shadowOffsetX = -6; g.shadowOffsetY = 8;
  g.fillStyle = '#4a4378'; g.fillRect(x - 60, y - 90, 120, 92);
  g.fillStyle = '#2a2350'; g.beginPath(); g.moveTo(x - 76, y - 86); g.lineTo(x, y - 150); g.lineTo(x + 76, y - 86); g.closePath(); g.fill(); g.restore();
  g.strokeStyle = rgba('#ffd9b0', .5); g.lineWidth = 2; g.beginPath(); g.moveTo(x - 76, y - 86); g.lineTo(x, y - 150); g.stroke();
  // window: warm at dawn, dims for "Sleep in"
  const dim = k(13.5, 14.3, t), wl = 1 - .75 * dim;
  g.fillStyle = `rgba(255,${Math.round(190 - 40 * dim)},${Math.round(110 - 30 * dim)},${.95})`; g.fillRect(x - 36, y - 70, 32, 30);
  addGlow(g, x - 20, y - 55, 70, .45 * wl, AMBER, '#fff1d6');
  g.fillStyle = '#2a2350'; g.fillRect(x + 12, y - 52, 26, 52);   // door
  // mailbox
  g.fillStyle = '#5a5288'; g.fillRect(x + 66, y - 30, 4, 30); g.fillStyle = '#c97b3a'; g.beginPath(); g.roundRect(x + 56, y - 46, 26, 18, 6); g.fill();
  // "Sleep in": a crescent moon rises above the roof, a few slow z's
  const mo = k(13.5, 14.4, t, eoX) * (1 - k(17.0, 18.0, t));
  if (mo > 0) { const my = y - 210 - 40 * mo; g.save(); g.globalAlpha = mo; g.fillStyle = '#f3efe2'; g.beginPath(); g.arc(x + 40, my, 16, 0, 7); g.fill(); g.fillStyle = '#1a1940'; g.beginPath(); g.arc(x + 47, my - 5, 14, 0, 7); g.fill();
    for (let i = 0; i < 3; i++) { const q = ((t - 13.6) * .5 + i / 3) % 1; text(g, 'z', x - 30 + q * 30, y - 160 - q * 60, { size: 16 + i * 4, font: 'Instrument Serif', color: CREAM, alpha: mo * (1 - q) }); } g.restore(); }
}
function tower(g, t) {
  const x = 860, y = groundY(860), fold = k(4.3, 5.4, t, eiX);   // anticipation: it shivers, then folds flat into the ground
  if (fold >= 1) return;
  const shiver = Math.sin(t * 40) * 1.5 * bump(lin(3.9, 4.4, t)), h = 380 * (1 - fold), w = 130;
  g.save(); g.translate(x + shiver, y); g.transform(1, 0, -.35 * fold, 1, 0, 0);
  g.shadowColor = 'rgba(0,0,0,.55)'; g.shadowBlur = 20; g.shadowOffsetX = -8; g.shadowOffsetY = 8;
  g.fillStyle = '#3b3866'; g.fillRect(-w / 2, -h, w, h); g.shadowColor = 'transparent';
  g.fillStyle = '#2b2852'; g.fillRect(w / 2 - 22, -h, 22, h);
  // windows go dark one by one on "never have to work again" (top floors first)
  const rows = 11;
  for (let r = 0; r < rows; r++) for (let cI = 0; cI < 4; cI++) {
    const off = 2.4 + (r * 4 + cI) * .03, lit = 1 - k(off + .9, off + 1.2, t);
    const wy = -h + 20 + r * (h - 40) / rows; if (h < 60) break;
    g.fillStyle = lit > .5 ? rgba('#8fe6ff', .7 * lit + .1) : '#22204a'; g.fillRect(-w / 2 + 14 + cI * 22, wy, 12, Math.max(2, (h - 40) / rows - 10));
  }
  g.strokeStyle = rgba('#ffd9b0', .4); g.lineWidth = 2; g.beginPath(); g.moveTo(-w / 2, -h); g.lineTo(w / 2, -h); g.stroke();
  g.restore();
  text(g, 'WORK', x, y - 400 * (1 - fold) - 20, { size: 18, weight: 600, color: rgba(CREAM, .7 * (1 - k(4.2, 4.6, t))), align: 'center', spacing: 6 });
}
// a small round figure (no hands drawn: arms are soft sleeves), Kurzgesagt-like scale; pose: walk | stand
function figure(g, x, y, s, t, o = {}) {
  const step = o.walk ? Math.sin(t * 9) : 0, bob = o.walk ? Math.abs(Math.sin(t * 9)) * 1.6 : Math.sin(t * 1.4) * .6;
  g.save(); g.translate(x, y - bob); g.scale(s * (o.flip ? -1 : 1), s);
  g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, bob + 1, 12, 3, 0, 0, 7); g.fill();
  g.fillStyle = '#1b1a33'; g.beginPath(); g.roundRect(-6 + step * 3, -22, 5, 22, 2.5); g.roundRect(1 - step * 3, -22, 5, 22, 2.5); g.fill();
  g.fillStyle = AMBER; g.beginPath(); g.roundRect(-9, -50, 18, 32, 8); g.fill();
  g.fillStyle = '#d9893f'; g.beginPath(); g.roundRect(-11 + step * 2, -46, 6, 22, 3); g.fill();   // sleeve, in front of the body
  g.fillStyle = '#e9c3a0'; g.beginPath(); g.arc(0, -60, 9, 0, 7); g.fill();
  g.fillStyle = '#2a1a14'; g.beginPath(); g.arc(-1.5, -63, 9, Math.PI * .9, Math.PI * 2.05); g.fill();
  g.restore();
}

// ---------------------------------------------------------------- the income line (explainer element living in the world)
function incomeLine(g, t, c) {
  const env = [356, groundY(356) - 40];
  // envelope rises from the mailbox, hovers, opens
  const up = k(6.3, 7.2, t, eoX), open = k(7.1, 7.5, t);
  const ex = env[0] + 20 * up, ey = mix(env[1], LY + 40, up) + Math.sin(t * 1.6) * 3 * up;
  const draw = k(7.4, 10.6, t, (x) => x * x * (3 - 2 * x)), x1 = mix(ex + 20, ageX(90), draw);
  if (up > 0) {
    // the line itself (behind the envelope): amber, glowing, with age ticks
    if (draw > 0) {
      g.save(); g.lineCap = 'round'; g.globalCompositeOperation = 'lighter'; g.strokeStyle = rgba('#ffcf8f', .25); g.lineWidth = 18; g.beginPath(); g.moveTo(ex, ey); g.quadraticCurveTo(ex + 120, LY, ex + 240, LY); g.lineTo(x1, LY); g.stroke(); g.restore();
      g.strokeStyle = HOT; g.lineWidth = 4.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(ex, ey); g.quadraticCurveTo(ex + 120, LY, ex + 240, LY); g.lineTo(x1, LY); g.stroke();
      for (let a = 30; a <= 90; a += 10) { const ax = ageX(a); if (ax > x1) break; const kk = k((ax - ex) / (ageX(90) - ex) * 3.2 + 7.5, (ax - ex) / (ageX(90) - ex) * 3.2 + 7.9, t, eoX);
        g.fillStyle = rgba(CREAM, .85 * kk); g.fillRect(ax - 1.5, LY + 8, 3, 16 * kk); text(g, String(a), ax, LY + 60, { size: 40, font: 'Instrument Serif', color: CREAM, alpha: kk * (1 - .6 * k(19, 20, t)), align: 'center' }); }
      const lab = k(7.6, 8.2, t) * (1 - .6 * k(19, 20, t)); text(g, 'YOUR INCOME, EVERY MONTH', ex + 260, LY - 26, { size: 18, weight: 600, color: CREAM, alpha: lab, spacing: 5 });
      text(g, 'AGE', ageX(90) + 50, LY + 56, { size: 16, weight: 600, color: '#a49fc4', alpha: k(10.2, 10.8, t), spacing: 5 });
      if (draw < 1) addGlow(g, x1, LY, 60, .9, AMBER, '#fff1d6');
      // monthly payments: small amber drops fall gently from the line onto the land below (it keeps arriving)
      const r = prng(9); for (let i = 0; i < 40; i++) { const px = ex + 260 + r() * (x1 - ex - 260), ph = (t * .35 + r()) % 1, py = mix(LY + 10, groundY(px) - 10, ph);
        if (t < 8.2) continue; g.fillStyle = rgba(AMBER, .55 * (1 - ph) * k(8.2, 9, t)); g.beginPath(); g.arc(px, py, 3, 0, 7); g.fill(); }
    }
    // envelope (amber paper) with flap
    if (open < 1 || true) {
      const fade = 1 - k(8.4, 9.2, t);
      if (fade > 0) { g.save(); g.globalAlpha = fade; g.translate(ex, ey); g.rotate(-.06 + .04 * Math.sin(t)); g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 14; g.shadowOffsetY = 8;
        g.fillStyle = '#e8a04f'; g.fillRect(-30, -20, 60, 40); g.shadowColor = 'transparent';
        g.fillStyle = '#c77d33'; g.beginPath(); g.moveTo(-30, -20); g.lineTo(0, -20 - 26 * open + 22 * (1 - open)); g.lineTo(30, -20); g.closePath(); g.fill();
        g.strokeStyle = rgba('#fff1d6', .6); g.lineWidth = 1.2; g.strokeRect(-30, -20, 60, 40); g.restore(); }
      addGlow(g, ex, ey, 90, .5 * up * (1 - k(9, 10, t) * .6), AMBER, '#fff1d6');
    }
  }
}

// ---------------------------------------------------------------- travel, rest, the months, the wall
function plane(g, t) {
  const u = k(14.6, 16.0, t, (x) => x * x * (3 - 2 * x)); if (u <= 0 || u >= 1) return;
  const x0 = 300, y0 = groundY(300) - 100, x1 = (HAM[0] + HAM[1]) / 2, y1 = groundY(x1) - 50;
  const x = mix(x0, x1, u), y = mix(y0, y1, u) - 380 * bump(u), dx = x1 - x0, dy = (y1 - y0) - 380 * Math.PI * Math.cos(Math.PI * u), ang = Math.atan2(dy, dx);
  // a dotted trail behind it
  g.save(); g.setLineDash([6, 10]); g.strokeStyle = rgba(CREAM, .6); g.lineWidth = 2; g.beginPath();
  for (let i = 0; i <= 40; i++) { const q = u * i / 40, px = mix(x0, x1, q), py = mix(y0, y1, q) - 380 * bump(q); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore();
  g.save(); g.translate(x, y); g.rotate(ang); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 10; g.shadowOffsetY = 10;
  g.fillStyle = CREAM; g.beginPath(); g.moveTo(26, 0); g.lineTo(-20, -15); g.lineTo(-10, 0); g.lineTo(-20, 15); g.closePath(); g.fill();
  g.shadowColor = 'transparent'; g.fillStyle = '#cfc6b0'; g.beginPath(); g.moveTo(26, 0); g.lineTo(-10, 0); g.lineTo(-20, 15); g.closePath(); g.fill(); g.restore();
}
function lakeside(g, t) {
  const [a, b] = HAM, ya = groundY(a), yb = groundY(b);
  tree(g, a, ya, 1.25, LEAF[1][0], LEAF[1][1], Math.sin(t * .8) * 2); tree(g, b, yb, 1.15, LEAF[1][0], LEAF[1][1], Math.sin(t * .8 + 1) * 2);
  // the plane lands and unfolds into the hammock (cream paper), then you are in it, swaying
  const un = k(15.9, 16.7, t, eoX); if (un <= 0) return;
  const sway = Math.sin(t * 1.1) * 6 * un, mid = (a + b) / 2, hy = ya - 46;
  g.save(); g.globalAlpha = un;
  g.strokeStyle = '#d8cfba'; g.lineWidth = 2; g.beginPath(); g.moveTo(a + 8, hy - 20); g.quadraticCurveTo(mid + sway, hy + 50 * un, b - 8, hy - 20); g.stroke();
  g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 12; g.shadowOffsetY = 10;
  g.fillStyle = CREAM; g.beginPath(); g.moveTo(a + 30, hy - 6); g.quadraticCurveTo(mid + sway, hy + 56 * un, b - 30, hy - 6); g.quadraticCurveTo(mid + sway, hy + 34 * un, a + 30, hy - 6); g.fill();
  g.restore();
  // you, lying: head, amber body curve (no limbs to fuss over), breathing
  const lie = k(16.4, 17.0, t); if (lie <= 0) return;
  const br = Math.sin(t * 1.3) * 1.2;
  g.save(); g.globalAlpha = lie; g.translate(mid + sway, hy + 28);
  g.fillStyle = AMBER; g.beginPath(); g.ellipse(4, -6 - br * .5, 42, 10 + br * .3, -.04, Math.PI, 0); g.fill();
  g.fillStyle = '#e9c3a0'; g.beginPath(); g.arc(-44, -12, 9, 0, 7); g.fill(); g.fillStyle = '#2a1a14'; g.beginPath(); g.arc(-46, -14, 9, Math.PI * .6, Math.PI * 1.7); g.fill();
  g.restore();
}
function skyCycle(g, t) {
  // "a few months in": sun and moon circle over the lake, faster and faster (time passing), then stop
  const u = k(18.2, 20.2, t, (x) => x); if (u <= 0 || t > 20.6) return;
  const fade = bump(lin(18.2, 20.6, t)), cx = (LAKE[0] + LAKE[1]) / 2, cy = GY - 40, R = 420;
  const turns = 3 * u * u, ang = Math.PI + turns * Math.PI * 2;
  for (const [off, col, r] of [[0, '#ffd59a', 26], [Math.PI, '#e9ecf5', 18]]) {
    const x = cx + Math.cos(ang + off) * R, y = cy + Math.sin(ang + off) * R * .55; if (y > cy) continue;
    g.save(); g.globalAlpha = fade; addGlow(g, x, y, r * 4, .4, col === '#ffd59a' ? AMBER : '#cfd8ff', col); g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore();
  }
  // a thin arc trail and month marks
  g.save(); g.globalAlpha = .5 * fade; g.strokeStyle = CREAM; g.setLineDash([3, 9]); g.lineWidth = 1.5; g.beginPath(); g.ellipse(cx, cy, R, R * .55, 0, Math.PI, 0); g.stroke(); g.restore();
  const m = Math.min(3, Math.floor(turns + .2)); text(g, m >= 3 ? 'MONTH 3' : m >= 2 ? 'MONTH 2' : 'MONTH 1', cx, cy - R * .55 - 30, { size: 18, weight: 600, color: CREAM, alpha: fade * .8, align: 'center', spacing: 6 });
}
function wall(g, t) {
  const rise = k(20.05, 20.6, t, eoX); if (rise <= 0) return;
  const pre = bump(lin(19.75, 20.1, t));   // anticipation: the ground bulges first
  const settle = t > 20.6 ? 6 * Math.sin((t - 20.6) * 14) * Math.exp(-(t - 20.6) * 6) : 0;
  const x0 = WALLX - 30, x1 = WALLX + 420, y = groundY(WALLX) + 6, h = 360 * rise + settle;   // a broad paper wall, its top stays below the income line
  if (pre > 0 && rise < .05) { g.fillStyle = '#3d3a70'; g.beginPath(); g.ellipse((x0 + x1) / 2, y, 240, 12 * pre, 0, Math.PI, 0); g.fill(); }
  const top = (x) => y - h + 6 * Math.sin(x * .05) + 4 * Math.sin(x * .13);   // torn paper edge
  const path = () => { g.beginPath(); g.moveTo(x0, y + 30); for (let xx = x0; xx <= x1; xx += 12) g.lineTo(xx, top(xx)); g.lineTo(x1, y + 30); g.closePath(); };
  g.save(); g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 50; g.shadowOffsetX = -36; g.shadowOffsetY = 6;
  g.fillStyle = '#2c2a56'; path(); g.fill(); g.restore();
  g.save(); path(); fibreFill(g, .5); g.clip();
  // paper courses, offset like bricks, lit from the low sun on the left
  g.strokeStyle = rgba('#0b0a20', .35); g.lineWidth = 2;
  for (let yy = y, r = 0; yy > y - h; yy -= 38, r++) { g.beginPath(); g.moveTo(x0, yy); g.lineTo(x1, yy); g.stroke(); for (let xx = x0 + (r % 2) * 45; xx < x1; xx += 90) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx, yy - 38); g.stroke(); } }
  const lg = g.createLinearGradient(x0, 0, x0 + 160, 0); lg.addColorStop(0, rgba('#ffd9b0', .22)); lg.addColorStop(1, rgba('#ffd9b0', 0)); g.fillStyle = lg; g.fillRect(x0, y - h - 20, 160, h + 60);
  g.restore();
  g.strokeStyle = rgba('#ffd9b0', .55); g.lineWidth = 2; g.beginPath(); for (let xx = x0; xx <= x1; xx += 12) xx === x0 ? g.moveTo(xx, top(xx)) : g.lineTo(xx, top(xx)); g.stroke();
  // "the reason isn't the one you'd guess": a question mark is cut into the wall face as the camera climbs
  const q = k(22.3, 23.0, t, eoX); if (q > 0) { const qx = (x0 + x1) / 2, qy = y - h * .45; addGlow(g, qx, qy, 120, .35 * q, AMBER, '#fff1d6'); text(g, '?', qx, qy + 40, { size: 150, font: 'Instrument Serif', color: HOT, alpha: q, align: 'center' }); }
  // and right above it the income line runs on unbroken: a soft pulse where it passes over the wall
  const p = k(22.0, 22.6, t) * (1 - k(23.6, 24.4, t) * .5); if (p > 0) addGlow(g, (x0 + x1) / 2, LY, 110, .7 * p, AMBER, '#fff1d6');
  const lab = k(22.6, 23.2, t); text(g, 'THE MONEY STILL ARRIVES', (x0 + x1) / 2, LY - 30, { size: 16, weight: 600, color: CREAM, alpha: lab, spacing: 5, align: 'center' });
}

// ---------------------------------------------------------------- the space itself
function space(g, t, c) {
  g.setTransform(1, 0, 0, 1, 0, 0);
  const night = k(13.4, 14.4, t) * (1 - k(15.4, 16.6, t));   // "Sleep in" darkens the space briefly
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#090a20'); gr.addColorStop(.55, '#16163a'); gr.addColorStop(1, '#22204a'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // the dawn: a big low sun far behind everything (parallax .2), warm at first, then the light settles
  view(g, c, .2); const sx = 1400, sy = 640 - 160 * k(0, 6, t, (x) => x * (2 - x));
  addGlow(g, sx, sy, 900, .3 * (1 - .5 * night), AMBER, '#ffe9c8'); glow(g, sx, sy, 60, .9 * (1 - .4 * night), '#ffd59a', '#fff4dc');
  // faint stars in the far space
  view(g, c, .1); const r = prng(5); for (let i = 0; i < 160; i++) { const x = r() * 4000 - 1000, y = r() * 1200 - 400; g.fillStyle = rgba('#d8f7ff', (.1 + .3 * r()) * (.5 + .5 * Math.sin(t * (.5 + r()) + i))); g.fillRect(x, y, 1.6, 1.6); }
}

export async function build() {
  const [cv, g] = canvas(W, H);
  return {
    duration: DUR,
    frame(t) {
      const c = cam(t);
      g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
      space(g, t, c);
      land(g, t, c);
      view(g, c, 1);
      house(g, t); tower(g, t);
      // you walk toward the tower at first, stop when it folds, turn back home
      const wk = k(1.4, 4.0, t, (x) => x), back = k(5.0, 6.2, t, (x) => x);
      const fx = 360 + 300 * wk - 280 * back;
      if (t < 13.4) figure(g, fx, groundY(fx), 1.25, t, { walk: (t > 1.4 && t < 4.0) || (t > 5.0 && t < 6.2), flip: t > 4.6 });
      lakeside(g, t);
      wall(g, t);
      incomeLine(g, t, c);
      skyCycle(g, t);
      plane(g, t);
      g.setTransform(1, 0, 0, 1, 0, 0);
      motes(g, t, W * .6, H * .4, 900, .5);
      filmFinish(g, t, { vig: .42 });
      return cv;
    },
  };
}
