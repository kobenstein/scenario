// Film 6 · c14 · the city of lit windows behind the hook room's window (owned by c14). Pure functions of t; static layers cached (f6_kit layer()).
//   city(ctx, t, cam, o)        the whole city in screen space under a city camera { x, y, z } (camMap parallax per plane): sky · far skyline ·
//                               mid block · the facade across the street with ten big windows (some lived in: a couple holding hands, someone
//                               laughing into a phone, someone reading) · haze. o = { dim 0..1 (the windows dim to the night), lightOn (0..1, one
//                               dark window lights up), emberA (the ember window's extra breath), seedT }
//   EW                          the centre of the ember window (the couple's) in city space: the ember of 14.11 lands on it
//   endCard(ctx, t, u, o)       "Who is the person you'd call?" written by a warm line (the counterpart of the title the cool line wrote in c01)
// The skyline generator is my own compact version of lib/city.mjs cityLayer (same idea: towers with setbacks, hatch, haze) with the windows on a
// separate layer, so they can breathe and dim without re-painting the facades.
import { W, H, rgba, clamp, lin, mix, sm, eout, prng, canvas, text, hatch } from '../engine.mjs';
import { stipple, vnoise } from './art.mjs';
import { fibreFill } from './print.mjs';
import { figure, POSES, reachArm, handPos, life } from './figure.mjs';
import { F6, layer, once, ember, breathe, view, camMap, coolLine } from './f6_kit.mjs';

const TAU = Math.PI * 2;
const QUART = (x) => (x = clamp(x), x < .5 ? 8 * x * x * x * x : 1 - 8 * Math.pow(1 - x, 4));

// ---------------------------------------------------------------- the facade across the street: ten windows, row centres and column centres
export const FAC = { top: 212, cols: [152, 512, 872, 1232, 1592], rows: [395, 752], w: 222, h: 268 };
export const EW = [FAC.cols[3], FAC.rows[1]];                                   // the ember window: the couple holding hands
// kind per window [col][row]: 'dark' | 'plain' (lamp + plant) | 'curtain' | 'shelves' | 'phone' | 'reading' | 'couple' | 'late' (lights up at o.lightOn)
const KIND = [['dark', 'reading'], ['plain', 'dark'], ['phone', 'shelves'], ['late', 'couple'], ['curtain', 'dark']];
const SW = 2400, SH = 1400, SX = -240, SY = -160;                                 // the layers are larger than the frame (room for the drift)

// ---------------------------------------------------------------- sky (parallax .35)
function skyLayer() {
  return layer('c14:sky', SW, SH, (g, c) => {
    const lg = g.createLinearGradient(0, 0, 0, SH); lg.addColorStop(0, '#04050f'); lg.addColorStop(.45, '#080c22'); lg.addColorStop(.75, '#121636'); lg.addColorStop(1, '#1d1a44');
    g.fillStyle = lg; g.fillRect(0, 0, SW, SH);
    const r = prng(431); for (let i = 0; i < 260; i++) { const x = r() * SW, y = r() * SH * .55, s = r() < .9 ? .9 + r() : 1.8 + r(); g.fillStyle = `rgba(236,240,255,${.12 + .5 * r() * (1 - y / (SH * .55))})`; g.fillRect(x, y, s, s); }
    // a faint band of stipple (the milky haze of a city sky), the glow of the city on the horizon
    const hz = g.createRadialGradient(SW * .45, SH * .62, 0, SW * .45, SH * .62, SW * .5); hz.addColorStop(0, 'rgba(120,96,70,.22)'); hz.addColorStop(.6, 'rgba(60,50,90,.1)'); hz.addColorStop(1, 'rgba(60,50,90,0)');
    g.fillStyle = hz; g.fillRect(0, 0, SW, SH);
    stipple(c, { k: .22, g: 1, seed: 3, mid: false, boost: 1 });
  });
}

// ---------------------------------------------------------------- skylines: facades (opaque) and windows (separate), cached by key
function skyline(key, o) {
  return once('c14:skyline:' + key, () => {
    const r = prng(o.seed), w = SW, h = SH, ground = o.ground, B = [];
    for (let x = -40; x < w + 40;) {
      const bw = o.wMin + r() * (o.wMax - o.wMin), tall = r() < .1 ? 1.5 : 1, bh = (o.hMin + (o.hMax - o.hMin) * Math.pow(r(), 1.5)) * tall;
      B.push({ x, w: bw, h: bh, top: ['flat', 'flat', 'setback', 'setback', 'slant', 'crown'][Math.floor(r() * 6)], tone: r(), seed: Math.floor(r() * 1e6), ant: r() < .14 });
      x += bw * (.8 + r() * .3);
    }
    B.sort((p, q) => q.h - p.h);
    const [fc, fg] = canvas(w, h), [wc, wg] = canvas(w, h), tw = [];
    for (const b of B) {
      const rr = prng(b.seed), x0 = b.x, x1 = b.x + b.w, y0 = ground - b.h;
      fg.beginPath(); fg.moveTo(x0, ground);
      if (b.top === 'setback') { const s1 = b.w * (.14 + rr() * .1), hh = b.h * (.12 + rr() * .1); fg.lineTo(x0, y0 + hh); fg.lineTo(x0 + s1, y0 + hh); fg.lineTo(x0 + s1, y0); fg.lineTo(x1 - s1, y0); fg.lineTo(x1 - s1, y0 + hh); fg.lineTo(x1, y0 + hh); }
      else if (b.top === 'slant') { const up = rr() < .5; fg.lineTo(x0, y0 + (up ? b.w * .3 : 0)); fg.lineTo(x1, y0 + (up ? 0 : b.w * .3)); }
      else if (b.top === 'crown') { const cw2 = b.w * .3; fg.lineTo(x0, y0); fg.lineTo(x0 + b.w / 2 - cw2 / 2, y0); fg.lineTo(x0 + b.w / 2, y0 - b.w * .4); fg.lineTo(x0 + b.w / 2 + cw2 / 2, y0); fg.lineTo(x1, y0); }
      else { fg.lineTo(x0, y0); fg.lineTo(x1, y0); }
      fg.lineTo(x1, ground); fg.closePath();
      const tone = (b.tone - .5) * .18, col = b.tone < .5 ? o.col : o.col2;
      const n = parseInt(col.slice(1), 16), f = (v) => Math.round(clamp(v * (1 + tone), 0, 255)), face = `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
      const grd = fg.createLinearGradient(0, y0, 0, ground); grd.addColorStop(0, face); grd.addColorStop(1, col); fg.fillStyle = grd; fg.fill();
      fg.save(); fg.clip(); fg.strokeStyle = `rgba(3,5,14,${.2 * o.hatchA})`; fg.lineWidth = .7; fg.beginPath(); for (let xx = x0 + 1; xx < x1; xx += 3 + rr() * 2) { fg.moveTo(xx, y0 - 60); fg.lineTo(xx + (rr() - .5) * 2, ground); } fg.stroke(); fg.restore();
      if (b.ant) { fg.strokeStyle = 'rgba(14,18,36,1)'; fg.lineWidth = 1.2; const ax = x0 + b.w * (.3 + rr() * .4), ah = 14 + rr() * 40; fg.beginPath(); fg.moveTo(ax, y0); fg.lineTo(ax, y0 - ah); fg.stroke(); }
      // windows (separate layer): a grid, some whole floors lit, warm and a few cool, a few dim
      const [ww, wh] = o.winSize, [gx, gy] = o.winGap;
      for (let yy = y0 + gy * 1.3; yy < ground - gy; yy += gy) {
        const floorLit = rr() < .12, warmFloor = rr() < .8;
        for (let xx = x0 + gx * .6; xx < x1 - ww - 1; xx += gx) {
          const on = floorLit ? rr() < .7 : rr() < o.winP; if (!on) continue;
          const warm = floorLit ? warmFloor : rr() < .78, a = .4 + .6 * rr();
          wg.fillStyle = warm ? `rgba(255,${196 + (rr() * 36 | 0)},${124 + (rr() * 40 | 0)},${a})` : `rgba(${196 + (rr() * 30 | 0)},${216 + (rr() * 20 | 0)},255,${a * .7})`;
          wg.fillRect(xx, yy, ww, wh);
          if (rr() < o.twinkle) tw.push([xx + ww / 2, yy + wh / 2, rr() * TAU, .4 + rr() * .8, Math.max(ww, wh)]);
        }
      }
    }
    // haze at the base of the skyline (the evening air lit from the street), cut to the facades
    const hz = o.hazeH, hg = fg.createLinearGradient(0, ground - hz, 0, ground); hg.addColorStop(0, rgba(o.haze, 0)); hg.addColorStop(1, rgba(o.haze, o.hazeA));
    fg.globalCompositeOperation = 'source-atop'; fg.fillStyle = hg; fg.fillRect(0, ground - hz, w, hz); fg.globalCompositeOperation = 'source-over';
    stipple(fc, { k: .22, g: 1, seed: o.seed + 5, mid: false, boost: 1 });
    return { fac: fc, win: wc, tw, ground };
  });
}
const farSky = () => skyline('far', { seed: 21, ground: 560 - SY, hMin: 90, hMax: 300, wMin: 34, wMax: 110, col: '#0e1530', col2: '#0b1127', hatchA: .5, winSize: [2.4, 3.4], winGap: [6, 9], winP: .12, haze: '#2a3466', hazeH: 130, hazeA: .7, twinkle: .25 });
const midSky = () => skyline('mid', { seed: 33, ground: 640 - SY, hMin: 200, hMax: 470, wMin: 80, wMax: 200, col: '#121a38', col2: '#0f162e', hatchA: .8, winSize: [5, 7], winGap: [12, 16], winP: .1, haze: '#2a3466', hazeH: 160, hazeA: .55, twinkle: .18 });

// ---------------------------------------------------------------- the facade across the street (parallax 1): the wall, the window frames, the interiors
function facadeLayer() {
  return layer('c14:facade', SW, SH, (g, c) => {
    g.translate(-SX, -SY);
    const T0 = FAC.top, r = prng(9);
    // the wall: dark brick-plaster, lit faintly from below (the street) and from the windows
    const wg = g.createLinearGradient(0, T0, 0, SY + SH); wg.addColorStop(0, '#1a1830'); wg.addColorStop(.5, '#15132a'); wg.addColorStop(1, '#0f0d1f'); g.fillStyle = wg; g.fillRect(SX, T0, SW, SY + SH - T0);
    g.save(); g.beginPath(); g.rect(SX, T0, SW, SY + SH - T0); fibreFill(g, .06); g.restore();
    // brick courses (engraved, faint) and the cornice at the top, a slab line between the rows
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 1; g.beginPath(); for (let y = T0 + 14; y < SY + SH; y += 11) { g.moveTo(SX, y); g.lineTo(SX + SW, y); } g.stroke();
    g.strokeStyle = 'rgba(0,0,0,.1)'; g.beginPath(); for (let y = T0 + 14, k = 0; y < SY + SH; y += 11, k++) for (let x = SX + (k % 2) * 22; x < SX + SW; x += 44) { g.moveTo(x, y); g.lineTo(x, y + 11); } g.stroke();
    g.fillStyle = '#262440'; g.fillRect(SX, T0 - 10, SW, 12); g.fillStyle = 'rgba(255,220,180,.12)'; g.fillRect(SX, T0 - 11, SW, 1.5); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(SX, T0 + 2, SW, 8);
    const slabY = (FAC.rows[0] + FAC.rows[1]) / 2 + 6; g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(SX, slabY, SW, 4); g.fillStyle = 'rgba(255,220,180,.05)'; g.fillRect(SX, slabY - 1, SW, 1);
    hatch(g, null, -.85, 6, .05, { box: [SX, T0, SW, SY + SH - T0], col: '#000000', w: .8, wobble: .6 });
    // the windows: a stone reveal, a sill, the interior (lit kinds) or dark glass
    FAC.cols.forEach((cx, ci) => FAC.rows.forEach((cy, ri) => {
      const kind = KIND[ci][ri], x = cx - FAC.w / 2, y = cy - FAC.h / 2, w = FAC.w, h = FAC.h;
      g.fillStyle = '#0a0a18'; g.fillRect(x - 10, y - 10, w + 20, h + 20);                                            // the reveal (deep)
      g.fillStyle = '#34324e'; g.fillRect(x - 14, y + h + 8, w + 28, 9); g.fillStyle = 'rgba(255,225,190,.14)'; g.fillRect(x - 14, y + h + 8, w + 28, 1.5);   // the sill
      if (kind === 'dark' || kind === 'late') {
        const dg = g.createLinearGradient(x, y, x + w, y + h); dg.addColorStop(0, '#0b0f26'); dg.addColorStop(1, '#06071a'); g.fillStyle = dg; g.fillRect(x, y, w, h);
        g.fillStyle = 'rgba(200,220,255,.05)'; g.fillRect(x + w * .25, y, w * .12, h);                                 // a faint reflection of the sky
        if (kind === 'late') interior(g, x, y, w, h, 'plain', r, true);                                                  // the room is there, unlit (it lights up later)
      } else interior(g, x, y, w, h, kind, r, false);
      // the frame: mullion and transom, painted wood, lit by the room
      g.fillStyle = kind === 'dark' || kind === 'late' ? '#1b1a2e' : '#3a3450'; g.fillRect(x + w / 2 - 3, y, 6, h); g.fillRect(x, y + h * .38 - 3, w, 6);
      g.strokeStyle = kind === 'dark' || kind === 'late' ? '#22213a' : '#4a4460'; g.lineWidth = 8; g.strokeRect(x - 4, y - 4, w + 8, h + 8);
      g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 2; g.strokeRect(x - 9, y - 9, w + 18, h + 18);
    }));
    stipple(c, { k: .22, g: 1, seed: 11, mid: false, boost: 1 });
  });
}
// one lit interior (static part): warm wall, a curtain, a lamp, furniture by kind. x, y top-left of the glass
function interior(g, x, y, w, h, kind, r, unlit) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const warm = unlit ? ['#171528', '#100f1f', '#0b0a18'] : ['#f3cf98', '#c98a52', '#6a3a26'];
  const bg = g.createRadialGradient(x + w * .5, y + h * .3, 0, x + w * .5, y + h * .3, w * 1.1); bg.addColorStop(0, warm[0]); bg.addColorStop(.55, warm[1]); bg.addColorStop(1, warm[2]); g.fillStyle = bg; g.fillRect(x, y, w, h);
  // the back wall's texture, a picture frame or shelves
  g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1; g.beginPath(); for (let yy = y + 8; yy < y + h; yy += 9) { g.moveTo(x, yy); g.lineTo(x + w, yy); } g.stroke();
  const ink = unlit ? 'rgba(0,0,0,.35)' : 'rgba(60,30,20,.55)';
  if (kind === 'shelves') { g.fillStyle = ink; for (let k = 0; k < 4; k++) { const sy = y + 36 + k * 44; g.fillRect(x + 20, sy, w - 40, 4); const rr = prng(50 + k); let bx = x + 24; while (bx < x + w - 40) { const bw = 6 + rr() * 10, bh = 22 + rr() * 14; g.fillStyle = `rgba(${40 + (rr() * 90 | 0)},${30 + (rr() * 50 | 0)},${30 + (rr() * 40 | 0)},${unlit ? .5 : .85})`; g.fillRect(bx, sy - bh, bw, bh); bx += bw + 2; } g.fillStyle = ink; } }
  if (kind === 'plain' || kind === 'late') { // a pendant lamp and a plant on a table
    g.fillStyle = ink; g.fillRect(x + w * .62 - 1, y, 2, 54); g.beginPath(); g.moveTo(x + w * .62 - 24, y + 78); g.lineTo(x + w * .62 + 24, y + 78); g.lineTo(x + w * .62 + 12, y + 54); g.lineTo(x + w * .62 - 12, y + 54); g.closePath(); g.fillStyle = unlit ? '#1c1a2e' : '#e9c9a0'; g.fill();
    if (!unlit) { g.fillStyle = '#fff1d6'; g.beginPath(); g.ellipse(x + w * .62, y + 80, 20, 5, 0, 0, TAU); g.fill(); }
    g.fillStyle = ink; g.fillRect(x + 24, y + h - 70, 70, 5); g.fillRect(x + 30, y + h - 65, 4, 65); g.fillRect(x + 84, y + h - 65, 4, 65);
    plant(g, x + 58, y + h - 72, 1, unlit);
  }
  if (kind === 'curtain') { // drapes nearly drawn, a slit of warm light
    g.fillStyle = unlit ? '#1a1830' : '#b8784a'; g.fillRect(x, y, w * .44, h); g.fillRect(x + w * .58, y, w * .42, h);
    g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; g.beginPath(); for (let k = 0; k < 7; k++) { const fx = x + 8 + k * (w * .44 - 12) / 6; g.moveTo(fx, y); g.quadraticCurveTo(fx + 6, y + h / 2, fx, y + h); } for (let k = 0; k < 6; k++) { const fx = x + w * .58 + 8 + k * (w * .42 - 12) / 5; g.moveTo(fx, y); g.quadraticCurveTo(fx - 6, y + h / 2, fx, y + h); } g.stroke();
  }
  if (kind === 'reading') { // an armchair under a floor lamp (the reader is drawn live)
    g.fillStyle = ink; g.fillRect(x + w * .74 - 1.5, y + 50, 3, h - 50); g.beginPath(); g.moveTo(x + w * .74 - 30, y + 50); g.lineTo(x + w * .74 + 30, y + 50); g.lineTo(x + w * .74 + 20, y + 20); g.lineTo(x + w * .74 - 20, y + 20); g.closePath(); g.fillStyle = unlit ? '#1c1a2e' : '#e9c9a0'; g.fill();
    g.fillStyle = unlit ? '#141226' : '#7a3b34'; g.beginPath(); g.roundRect(x + 28, y + h - 128, 110, 70, [14, 14, 3, 3]); g.fill(); g.beginPath(); g.roundRect(x + 18, y + h - 70, 130, 44, 8); g.fill();
  }
  if (kind === 'couple') { // a sofa, a low lamp on a side table
    g.fillStyle = unlit ? '#141226' : '#5e4a7a'; g.beginPath(); g.roundRect(x + 20, y + h - 120, w - 40, 60, [16, 16, 4, 4]); g.fill(); g.beginPath(); g.roundRect(x + 12, y + h - 66, w - 24, 42, 8); g.fill();
    g.fillStyle = ink; g.fillRect(x + w - 40, y + h - 150, 3, 60); g.fillStyle = unlit ? '#1c1a2e' : '#f1d2a8'; g.beginPath(); g.moveTo(x + w - 58, y + h - 150); g.lineTo(x + w - 20, y + h - 150); g.lineTo(x + w - 26, y + h - 176); g.lineTo(x + w - 52, y + h - 176); g.closePath(); g.fill();
  }
  if (kind === 'phone') { // a kitchen counter at the back, a plant on the sill
    g.fillStyle = ink; g.fillRect(x + 16, y + h * .5, w - 32, 5); g.fillRect(x + 16, y + h * .5, 4, h * .5); g.fillRect(x + w - 20, y + h * .5, 4, h * .5);
    plant(g, x + w - 44, y + h - 10, .8, unlit);
  }
  // the ceiling and the floor darken the glass's top and bottom a little
  const vg = g.createLinearGradient(0, y, 0, y + h); vg.addColorStop(0, 'rgba(20,10,10,.3)'); vg.addColorStop(.2, 'rgba(20,10,10,0)'); vg.addColorStop(.85, 'rgba(20,10,10,0)'); vg.addColorStop(1, 'rgba(20,10,10,.4)'); g.fillStyle = vg; g.fillRect(x, y, w, h);
  g.restore();
}
function plant(g, x, y, s, unlit) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = unlit ? '#15132a' : '#8a5a3a'; g.beginPath(); g.moveTo(-16, 0); g.lineTo(16, 0); g.lineTo(12, -26); g.lineTo(-12, -26); g.closePath(); g.fill();
  g.fillStyle = unlit ? '#121a1e' : '#3f6a46'; for (let k = 0; k < 7; k++) { const an = -Math.PI / 2 + (k - 3) * .38, L = 34 + (k % 2) * 10; g.beginPath(); g.moveTo(0, -26); g.quadraticCurveTo(Math.cos(an) * L * .5 - 10, -26 + Math.sin(an) * L * .5, Math.cos(an) * L, -26 + Math.sin(an) * L); g.quadraticCurveTo(Math.cos(an) * L * .5 + 10, -26 + Math.sin(an) * L * .5, 0, -26); g.fill(); }
  g.restore();
}
// a thin veil of night air over the facade (cached): a soft stipple haze rising from the street
function hazeLayer() {
  return layer('c14:haze', W, H, (g, c) => {
    const n = vnoise(27), r = prng(28);
    for (let i = 0; i < 2600; i++) { const x = r() * W, y = H * .45 + Math.pow(r(), .7) * H * .6, a = .04 + .08 * n(x * .004, y * .004); g.fillStyle = `rgba(120,110,150,${a})`; g.fillRect(x, y, 1.4, 1.4); }
  });
}

// ---------------------------------------------------------------- the people in the windows (live): alive, breathing, no stock pose
const DRESS = [{ coat: '#2f3f6a', pants: '#1a1830', skin: '#b98762', hair: '#1c1420' }, { coat: '#7a4a3a', pants: '#1a1830', skin: '#e9c3a0', hair: '#2a1a16' }, { coat: '#3a5a4a', pants: '#1a1830', skin: '#8d5f40', hair: '#16111a' }, { coat: '#6a4a7a', pants: '#1a1830', skin: '#d9b08e', hair: '#1c1420' }];
const laugh = (t, seed) => { // bursts of laughter: three quick bobs every 5–8 s, eased, with a tail
  const p = 5.2 + 2.6 * ((Math.sin(seed * 3.1) + 1) / 2), u = ((t / p + seed * .37) % 1 + 1) % 1, k = clamp(u / .22), env = Math.sin(Math.PI * k);
  return { env, bob: env * Math.sin(u * p * TAU * 3.6) };
};
function people(g, t, o) {
  const lit = 1 - (o.dim ?? 0);
  // the couple on the sofa (the ember window): facing each other, hands joined between them
  { const [cx, cy] = EW, x = cx - FAC.w / 2, y = cy - FAC.h / 2, s = .66, fy = y + FAC.h - 62, L = { x: cx + 60, y: y + 90, col: '#fff1d6', a: .5 * lit };
    const ax = cx - 42, bx = cx + 44, mid = [cx + 2, fy - 50 * s];
    const base = { ...POSES.perch, sh: [.6, .5], el: [.9, 1.0] };
    const oa = { t, seed: 31, dress: DRESS[0], light: L, rim: rgba('#fff1d6', .5 * lit), rimSide: 1, shadow: false }, ob = { t, seed: 32, dress: DRESS[1], light: L, rim: rgba('#fff1d6', .55 * lit), rimSide: -1, flip: true, shadow: false };
    const ra = reachArm(ax, fy, s, base, 0, false, oa, mid), rb = reachArm(bx, fy, s, base, 0, true, ob, mid);
    const pa = { ...base, sh: [ra.sh, base.sh[1]], el: [ra.el, base.el[1]], turn: .35, head: .12 }, pb = { ...base, sh: [rb.sh, base.sh[1]], el: [rb.el, base.el[1]], turn: .35, head: .1 };
    figure(g, ax, fy, s, pa, oa); figure(g, bx, fy, s, pb, ob);
  }
  // the one laughing into a phone (standing by the counter), the head goes back with each burst, the shoulders bob
  { const cx = FAC.cols[2], cy = FAC.rows[0], y = cy - FAC.h / 2, s = .72, fy = y + FAC.h - 96, lg = laugh(t, 7);
    const L = { x: cx + 70, y: y + 40, col: '#fff1d6', a: .5 * lit };
    const pose = { ...POSES.stand, sh: [1.05, .25], el: [2.25, .4], head: -.16 - .14 * lg.env, turn: .5, dy: -1.6 * lg.bob, smile: .6 + .4 * lg.env, hands: ['fist', 'relaxed'] };
    figure(g, cx - 26, fy + 1.6 * lg.bob, s, pose, { t, seed: 41, dress: DRESS[2], light: L, rim: rgba('#fff1d6', .5 * lit), rimSide: 1, shadow: false,
      prop: (q, fa) => { q.save(); q.translate(fa.hx, fa.hy); q.rotate(-.9); q.fillStyle = '#1a1a2a'; q.beginPath(); q.roundRect(-3.5, -9, 7, 15, 1.5); q.fill(); q.fillStyle = rgba('#cfe4ff', .7 * lit); q.fillRect(-2.5, -8, 5, 12); q.restore(); } });
  }
  // the reader in the armchair under the floor lamp, a book held low
  { const cx = FAC.cols[0], cy = FAC.rows[1], y = cy - FAC.h / 2, x = cx - FAC.w / 2, s = .62, fy = y + FAC.h - 100, L = { x: x + FAC.w * .74, y: y + 50, col: '#fff1d6', a: .5 * lit };
    const pose = { ...POSES.sit, sh: [.7, .55], el: [1.35, 1.3], head: .3, turn: -.1 };
    figure(g, x + 78, fy, s, pose, { t, seed: 53, dress: DRESS[3], light: L, rim: rgba('#fff1d6', .45 * lit), rimSide: 1, shadow: false,
      prop: (q, fa) => { q.save(); q.translate(fa.hx - 2, fa.hy - 4); q.rotate(-.35); q.fillStyle = '#e8dcc0'; q.fillRect(-11, -1, 22, 15); q.fillStyle = '#7a3b34'; q.fillRect(-12, -2, 24, 2); q.restore(); } });
  }
}

// ---------------------------------------------------------------- the city under its camera
//   cam { x, y, z }; o = { dim 0..1, lightOn 0..1, emberA (0..1 extra breath on the ember window), a (whole-picture alpha, default 1) }
export function city(ctx, t, cam, o = {}) {
  const dim = clamp(o.dim ?? 0), lit = 1 - dim, br = breathe(t, 60, 0);
  view(ctx, cam, .35, (g) => g.drawImage(skyLayer(), SX, SY));
  for (const [S, p, kk] of [[farSky(), .6, 'far'], [midSky(), .8, 'mid']]) {
    view(ctx, cam, p, (g) => {
      g.drawImage(S.fac, SX, SY);
      if (lit > 0) { g.globalAlpha = lit * (.92 + .08 * br); g.drawImage(S.win, SX, SY); g.globalAlpha = 1; }
      // some windows breathe on their own: a soft bloom that comes and goes (the living city)
      if (lit > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (const [x, y, ph, f, sz] of S.tw) { const k = .5 + .5 * Math.sin(t * f + ph); if (k < .35) continue; const rr = sz * (kk === 'far' ? 2.2 : 2.6); const rg = g.createRadialGradient(x + SX, y + SY, 0, x + SX, y + SY, rr); rg.addColorStop(0, rgba('#ffd9a8', .35 * k * lit)); rg.addColorStop(1, rgba('#ffd9a8', 0)); g.fillStyle = rg; g.fillRect(x + SX - rr, y + SY - rr, rr * 2, rr * 2); } g.restore(); }
      if (dim > 0) { g.fillStyle = rgba('#05060f', .45 * dim); g.fillRect(SX, SY, SW, S.ground + SY); }
    });
  }
  view(ctx, cam, 1, (g) => {
    g.drawImage(facadeLayer(), SX, SY);
    // the late window lights up: its unlit room is already there; the light rises in it (no alpha fade of an object: light grows)
    const on = clamp(o.lightOn ?? 0);
    if (on > 0) { const cx = FAC.cols[3], cy = FAC.rows[0], x = cx - FAC.w / 2, y = cy - FAC.h / 2; g.save(); g.beginPath(); g.rect(x, y, FAC.w, FAC.h); g.clip(); g.globalCompositeOperation = 'lighter'; const k = eout(on) * lit; const lg2 = g.createRadialGradient(x + FAC.w * .62, y + 80, 0, x + FAC.w * .62, y + 80, FAC.w * 1.1); lg2.addColorStop(0, rgba('#ffd9a0', .95 * k)); lg2.addColorStop(.5, rgba('#d08a4a', .55 * k)); lg2.addColorStop(1, rgba('#6a3a26', .25 * k)); g.fillStyle = lg2; g.fillRect(x, y, FAC.w, FAC.h); g.restore(); }
    people(g, t, { dim });
    // the windows' light into the night: each lit window breathes at its own phase (±3 %), the ember window a little stronger
    g.save(); g.globalCompositeOperation = 'lighter';
    FAC.cols.forEach((cx, ci) => FAC.rows.forEach((cy, ri) => {
      const kind = KIND[ci][ri]; if (kind === 'dark') return; let a = kind === 'late' ? eout(on) : kind === 'curtain' ? .5 : 1; if (a <= 0) return;
      const b = breathe(t, 60, (ci * 7 + ri * 3) * .13), e = ci === 3 && ri === 1 ? 1 + .6 * (o.emberA ?? 0) : 1, R = 300 * b * e;
      const rg = g.createRadialGradient(cx, cy, 0, cx, cy, R); rg.addColorStop(0, rgba('#ffd9a8', .22 * a * lit * e)); rg.addColorStop(.3, rgba('#ffb35c', .09 * a * lit)); rg.addColorStop(1, rgba('#c4512e', 0)); g.fillStyle = rg; g.fillRect(cx - R, cy - R, R * 2, R * 2);
      // the glass itself brightens with the breath
      g.fillStyle = rgba('#fff1d6', .06 * (b - .97) / .06 * a * lit); g.fillRect(cx - FAC.w / 2, cy - FAC.h / 2, FAC.w, FAC.h);
    }));
    g.restore();
    if (dim > 0) { FAC.cols.forEach((cx, ci) => FAC.rows.forEach((cy, ri) => { if (KIND[ci][ri] === 'dark') return; g.fillStyle = rgba('#07081a', .9 * dim); g.fillRect(cx - FAC.w / 2, cy - FAC.h / 2, FAC.w, FAC.h); })); g.fillStyle = rgba('#05060f', .35 * dim); g.fillRect(SX, SY, SW, SH); }
  });
  ctx.drawImage(hazeLayer(), 0, 0);
  // the frame's own dark edge: the night presses in at the corners (print vignette comes from the finish; this keeps the sky deep)
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * .5, W / 2, H / 2, W * .8); vg.addColorStop(0, 'rgba(3,4,12,0)'); vg.addColorStop(1, 'rgba(3,4,12,.4)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
}

// ---------------------------------------------------------------- the end card: written by a warm line (the title in c01 was written by the cool line)
//   u 0..1 the writing; o = { y 500, size 76, shade 0..1 (a soft dark field behind the words so they read over the windows) }
export const END_TEXT = "Who is the person you'd call?";
export function endCard(ctx, t, u, o = {}) {
  u = clamp(u); if (u <= 0) return;
  const y = o.y ?? 500, size = o.size ?? 76, sh = o.shade ?? u;
  if (sh > 0) { const g = ctx.createRadialGradient(W / 2, y - size * .3, 0, W / 2, y - size * .3, 760); g.addColorStop(0, rgba('#05060f', .55 * sh)); g.addColorStop(.6, rgba('#05060f', .28 * sh)); g.addColorStop(1, rgba('#05060f', 0)); ctx.save(); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); }
  coolLine(ctx, t, { write: { text: END_TEXT, x: W / 2, y, size, align: 'center', lead: 170, lag: 44, fill: .96, outline: .9 }, u, col: F6.amber, core: '#fff6e6', glow: .75, w: 1.3 });
}
