// s07_a · chapter 07, first part (VO 07a): "Think of everyone who has ever lived." … "To you."
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, lin, sm, eio, eout, ein, quart, drift, PX, PY, LW, LH, cache, wl, camT, drawL, proj,
  stip, skyLayer, twinkle, ridgeLayer, fogLayer, lightLayer, figSprite, drawFig, tintSprite, groundShadow, txt, placeLabel, vig } from './s07_kit.mjs';
import { layer, roughPath, roughPoly, roughRect, roughLine, hatch, house, vnoise, fbm, maskLinear, limb } from './art.mjs';

const CREAM = '#f3efe2', HOT = '#ffd9a0', AMBER = '#ffb35c', MOON = [1390, 452];

// ================================================================== shared props
// heron in flight, silhouette with a cream rim (it carries in from chapter 06)
export function heron(ctx, x, y, s, t, { a = 1, dir = 1, col = '#0b0c22', rim = CREAM } = {}) {
  const ph = Math.sin(t * 4.2), wing = ph * .55;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s * dir, s); ctx.rotate(-.18);
  const body = () => {
    ctx.beginPath(); ctx.ellipse(0, 0, 26, 8, 0, 0, 7);                        // body
    ctx.moveTo(22, -2); ctx.quadraticCurveTo(34, -10, 30, -2); ctx.quadraticCurveTo(28, 4, 38, 2); ctx.lineTo(54, 3); ctx.lineTo(38, 6); ctx.quadraticCurveTo(26, 8, 22, 4); // tucked neck + bill
    ctx.moveTo(-24, 1); ctx.lineTo(-62, 4); ctx.lineTo(-62, 6); ctx.lineTo(-24, 5);  // trailing legs
    // wings: big arcs, beating
    ctx.moveTo(10, -4); ctx.quadraticCurveTo(-6, -40 * wing - 6, -34, -70 * wing - 4); ctx.quadraticCurveTo(-20, -30 * wing, -14, -2); ctx.closePath();
  };
  ctx.fillStyle = rgba(rim, .5); ctx.save(); ctx.translate(1.2, -1.2); body(); ctx.fill(); ctx.restore();
  ctx.fillStyle = col; body(); ctx.fill();
  ctx.restore();
}
// forearm + hand seen close (sleeve capsule, palm, curled fingers). a0 = elbow end (often off screen), h = hand centre.
export function arm(ctx, ex, ey, hx, hy, { w = 70, sleeve = '#3a3560', cuff = null, skin = '#d9b08e', rim = null, rimSide = 1, curl = .6, ang = null, fingers = 4, scale = 1, grip = 0 } = {}) {
  const a = ang ?? Math.atan2(hy - ey, hx - ex), L = Math.hypot(hx - ex, hy - ey), s = scale;
  ctx.save(); ctx.translate(ex, ey); ctx.rotate(a);
  const wr = L - 46 * s; // wrist
  const shape = (pad) => {
    ctx.beginPath(); ctx.moveTo(-10, -w / 2 - pad); ctx.quadraticCurveTo(wr * .5, -w * .46 - pad, wr, -w * .3 - pad); ctx.lineTo(wr, w * .3 + pad); ctx.quadraticCurveTo(wr * .5, w * .46 + pad, -10, w / 2 + pad); ctx.closePath();
  };
  // hand: palm + fingers (drawn before the sleeve so the cuff overlaps the wrist)
  const hand = (col, pad = 0) => {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.ellipse(wr + 30 * s, 0, 34 * s + pad, 25 * s + pad, 0, 0, 7); ctx.fill();
    for (let i = 0; i < fingers; i++) {
      const fy = (-15 + i * 10.5) * s, len = (30 - Math.abs(i - 1.3) * 4) * s, c = curl + grip * .35;
      ctx.save(); ctx.translate(wr + 56 * s, fy); ctx.rotate(c * .9);
      ctx.beginPath(); ctx.ellipse(len * .45, 0, len * .55 + pad, 6 * s + pad, 0, 0, 7); ctx.fill();
      ctx.translate(len * .85, 0); ctx.rotate(c * 1.1); ctx.beginPath(); ctx.ellipse(len * .3, 0, len * .4 + pad, 5.3 * s + pad, 0, 0, 7); ctx.fill();
      ctx.restore();
    }
    ctx.save(); ctx.translate(wr + 22 * s, -22 * s); ctx.rotate(-.7 + grip * .3); ctx.beginPath(); ctx.ellipse(16 * s, 0, 20 * s + pad, 7.5 * s + pad, 0, 0, 7); ctx.fill(); ctx.restore(); // thumb
  };
  if (rim) { ctx.save(); ctx.translate(0, -rimSide * 2.2); hand(rgba(rim, .85)); shape(0); ctx.fillStyle = rgba(rim, .85); ctx.fill(); ctx.restore(); }
  hand(skin);
  // knuckle shading
  ctx.fillStyle = rgba('#000000', .12); ctx.beginPath(); ctx.ellipse(wr + 34 * s, 10 * s, 26 * s, 12 * s, 0, 0, 7); ctx.fill();
  shape(0); ctx.fillStyle = sleeve; ctx.fill();
  ctx.fillStyle = cuff || shade(sleeve, -.05); ctx.fillRect(wr - 12, -w * .32, 12, w * .64);
  ctx.restore();
}
// coin (ellipse disc with edge) for the rent shot
function coin(ctx, x, y, r, tilt = .35, col = '#d9a54a') {
  ctx.fillStyle = shade(col, -.25); ctx.beginPath(); ctx.ellipse(x, y + 3, r, r * tilt, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, r, r * tilt, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = rgba('#fff0c8', .55); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y, r * .72, r * tilt * .72, 0, 0, 7); ctx.stroke();
}

export const sine = (x) => -(Math.cos(Math.PI * x) - 1) / 2;

// ================================================================== the night meadow world (7.01, 7.13, reused later)
const ridgeFar = (x) => 612 - 70 * Math.exp(-Math.pow((x - 300) / 260, 2)) - 120 * Math.exp(-Math.pow((x - 1700) / 200, 2)) - 40 * Math.exp(-Math.pow((x - 900) / 140, 2)) + (fbm(vnoise(4), x * .004, 1, 3) - .5) * 40;
export const ridgeMid = (x) => 700 - 46 * Math.exp(-Math.pow((x - 1080) / 520, 2)) + (fbm(vnoise(6), x * .003, 2, 3) - .5) * 26 + (x - 960) * .02;
export const PATH = (q) => { const y = mix(H + PY, ridgeMid(1060) + 3, q); return [mix(760, 1060, Math.pow(q, .7)) + Math.sin(q * 5) * 40 * (1 - q), y, mix(260, 10, Math.pow(q, .55))]; };
export function meadowWorld() {
  const mid = ridgeLayer(ridgeMid, { col: '#13173c', hc: '#8a88cc', ha: .32, seed: 5, light: { x: MOON[0], y: MOON[1] + 150, col: '#a8a4f0', a: .3, r: 1000 }, rim: '#ece8ff', rimA: .6, gap: 6, hatchN: 34, grassCol: '#8a88d0', grassN: 9000 });
  { const x = mid.getContext('2d'); x.save();
    const P = []; for (let q = 0; q <= 1.0001; q += .02) P.push(PATH(q));
    const poly = [...P.map(([a, b, w]) => [a - w / 2, b]), ...P.map(([a, b, w]) => [a + w / 2, b]).reverse()];
    roughPoly(x, poly, '#2c2e66', { amp: 2.5, seed: 9 });
    x.save(); x.beginPath(); roughPath(x, poly, { amp: 2.5, seed: 9 }); x.clip();
    const g = x.createLinearGradient(1300, 700, 700, 1100); g.addColorStop(0, rgba('#b8b4f0', .4)); g.addColorStop(1, rgba('#b8b4f0', 0)); x.fillStyle = g; x.fillRect(500, 600, 1000, 700);
    hatch(x, [500, 690, 900, 600], { angle: -.1, gap: 5, col: '#c8c4ff', a: .2, seed: 3 });
    const r = prng(12); for (let i = 0; i < 2500; i++) { const q = Math.pow(r(), .7), [px, py, w] = PATH(q); x.fillStyle = rgba('#e8e4ff', .15 + .35 * r()); x.fillRect(px + (r() - .5) * w, py + (r() - .5) * 8, 1.4, 1.4); }
    x.restore(); x.restore(); }
  const near = (() => { const [c, x] = wl(); const r = prng(19);
    // foreground: tall grass blades and seed heads as dark silhouettes along the bottom, rim-lit by the moon
    for (let i = 0; i < 1400; i++) { const bx = -PX + r() * LW, by = H + PY - Math.pow(r(), 2) * 160, h = 40 + r() * 170, bend = (r() - .3) * 40;
      x.strokeStyle = r() < .5 ? '#06071a' : '#0b0d28'; x.lineWidth = 1.5 + r() * 2.5; x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + bend * .3, by - h * .6, bx + bend, by - h); x.stroke();
      if (r() < .3) { x.strokeStyle = rgba('#d8d2ff', .45); x.lineWidth = 1; x.beginPath(); x.moveTo(bx + 1.5, by - h * .4); x.quadraticCurveTo(bx + bend * .3 + 1.5, by - h * .6, bx + bend + 1.5, by - h); x.stroke(); }
      if (r() < .08) { x.fillStyle = '#0b0d28'; x.beginPath(); x.ellipse(bx + bend, by - h - 8, 3.5, 11, bend * .01, 0, 7); x.fill(); x.fillStyle = rgba('#d8d2ff', .5); x.beginPath(); x.ellipse(bx + bend + 2, by - h - 9, 1.4, 8, bend * .01, 0, 7); x.fill(); } }
    return c; })();
  return {
    sky: skyLayer({ stops: [[0, '#03041a'], [.42, '#0c1040'], [.62, '#20256a'], [.72, '#3a3a82'], [1, '#141640']], glowAt: MOON, glowCol: '#d8d2ff', glowA: .32, glowR: 1100, stars: 1, seed: 11, band: { x0: 0, y0: -60, k: .32, w: 260, a: .22 } }),
    peaks: ridgeLayer(ridgeFar, { col: '#26295f', hc: '#aaa6e6', ha: .22, seed: 3, light: { x: MOON[0], y: MOON[1], col: '#bdb8ff', a: .35, r: 900 }, rim: '#d8d2ff', rimA: .35, hatchN: 14, gap: 5 }),
    sea: fogLayer({ y0: 560, y1: 770, col: '#c9c4f0', a: .6, seed: 21, cover: .78, soft: .45, k: .45, sx: .0035, sy: .03, edgeTop: .35, edgeBot: .5 }),
    sea2: fogLayer({ y0: 610, y1: 820, col: '#7c7fc6', a: .55, seed: 22, cover: .7, soft: .4, k: .4, sx: .004, sy: .03 }),
    mid, near,
    pool: lightLayer(1150, 760, 700, { col: '#b8b4f0', core: '#e8e4ff', a: .18, sy: .3, seed: 13 }),
  };
}
function moon(ctx, t, cm, k = 1) {
  const [mx, my] = proj(cm, .06, MOON[0], MOON[1]), R = 44 * k;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(mx, my, 0, mx, my, 280); g.addColorStop(0, rgba('#fffbe8', .5)); g.addColorStop(.2, rgba('#d8d2ff', .18 + .02 * Math.sin(t * .8))); g.addColorStop(1, rgba('#d8d2ff', 0)); ctx.fillStyle = g; ctx.fillRect(mx - 280, my - 280, 560, 560); ctx.restore();
  ctx.fillStyle = '#fbf6e6'; ctx.beginPath(); ctx.arc(mx, my, R, 0, 7); ctx.fill(); ctx.fillStyle = rgba('#c9c3e8', .35); ctx.beginPath(); ctx.arc(mx - 12 * k, my + 8 * k, 11 * k, 0, 7); ctx.arc(mx + 14 * k, my - 10 * k, 7 * k, 0, 7); ctx.fill();
}
export function meadowBack(ctx, t, cm, L, t0) {
  drawL(ctx, L.sky, cm, .04); twinkle(ctx, t, cm, { seed: 3, n: 80, p: .04, y1: 560 }); moon(ctx, t, cm);
  drawL(ctx, L.peaks, cm, .12);
  const fx = (t - t0) * 9; ctx.save(); camT(ctx, cm, .2); ctx.drawImage(L.sea2, -PX - fx * .6, -PY); ctx.drawImage(L.sea, -PX + fx, -PY); ctx.restore();
}
const ANC = [ // ancestor poses (faint figures along the horizon): walking, carrying, elder, child, woman, hooded
  { pose: { lean: .05, head: -.1, hip: [.25, -.2], kn: [.05, .25], sh: [.3, -.3], el: [.3, .2], coat: 1 } },
  { pose: { lean: .12, head: .05, hip: [.15, -.12], kn: [.1, .2], sh: [-.9, -.2], el: [-1.2, .3], bulk: 1.1 } },
  { pose: { lean: .15, head: .1, hip: [.12, -.1], kn: [.1, .15], sh: [.5, -.1], el: [.6, .4], coat: 1, hair: 'grey' } },
  { pose: { lean: 0, head: -.3, hip: [.05, -.05], sh: [.1, -.1], el: [.2, .2], hair: 'curly' }, k: .62 },
  { pose: { lean: 0, head: -.2, hip: [.03, -.04], sh: [.15, -.15], el: [.25, .3], skirt: true, hair: 'long' } },
  { pose: { lean: -.04, head: -.45, hip: [.02, -.02], sh: [.1, -.08], el: [.4, .35], hood: true, coat: 1 } },
];
function ancestors(t) {
  return cache('s07-meadow', 'anc', t, () => ANC.map((A, i) => {
    const sp = figSprite(.36 * (A.k || 1), A.pose, { dress: { coat: '#e8e2ff', pants: '#d8d2f8', shoes: '#c8c2f0', skin: '#f3efe2', hair: '#e0dcff', skirt: '#e8e2ff' } });
    const g = tintSprite(sp, '#efeaff', 1); stip(g.c, { k: .7, g: 1, seed: 40 + i, mid: false, boost: 1.4 }); return g;
  }));
}

// ================================================================== 7.01 "Think of everyone who has ever lived."
export function shot01(T, t0) {
  const tEvery = T.S('07a', 'everyone'), tEnd = T.S('07a', 'Most of them') - .2;
  const cam = (t) => { const u = sine(lin(t0, tEnd + .6, t)); return { x: mix(-150, 60, u) + drift(t, 6, 1), y: mix(40, 0, u) + drift(t, 4, 2), z: mix(1.0, 1.08, u) }; };
  const people = (() => { const r = prng(77), a = []; for (let i = 0; i < 46; i++) { const x = -160 + i * 50 + (r() - .5) * 26; a.push({ x, k: .75 + r() * .45, v: Math.floor(r() * ANC.length), ph: r() * 6, fl: r() < .5, d: Math.abs(x - 1060) }); } return a; })();
  return {
    t: t0, tr: 'zoom', d: 1.2, x: W / 2, y: H * .55, depth: 2.5,
    carrier: (t) => proj(cam(t), .45, ...PATH(.55)),
    draw(ctx, t) {
      const L = cache('s07-meadow', 'world', t, meadowWorld), cm = cam(t);
      meadowBack(ctx, t, cm, L, t0);
      // heron from chapter 06, gliding away over the cloud sea
      { const u = lin(t0 - .8, t0 + 3.4, t); if (u < 1) { const [hx, hy] = proj(cm, .2, mix(860, 1240, u), mix(500, 300, eout(u))); heron(ctx, hx, hy, mix(.9, .35, u), t, { a: 1 - sm(lin(.6, 1, u)) }); } }
      drawL(ctx, L.mid, cm, .45); drawL(ctx, L.pool, cm, .45, { op: 'lighter', a: .8 });
      // ancestors along the crest: they appear from the centre outward on "everyone", faint, breathing
      { const sp = ancestors(t); ctx.save(); camT(ctx, cm, .45);
        for (const p of people) { const on = sm(lin(tEvery - .4 + p.d * .0011, tEvery + .9 + p.d * .0011, t)); if (on <= 0) continue;
          const y = ridgeMid(p.x) + 3;
          drawFig(ctx, sp[p.v], p.x + drift(t, 3, p.ph), y + (1 - on) * 8, t, { k: p.k, ph: p.ph, alpha: on * (.4 + .2 * Math.sin(t * .6 + p.ph)), flipX: p.fl }); }
        ctx.restore(); }
      drawL(ctx, L.near, cm, 1.15);
      vig(ctx, .5);
    },
  };
}

// ================================================================== 7.02 "Most of them never made it up here." (a few old footprints; the path ends in grass)
export function shot02(T, t0) {
  const tNever = T.S('07a', 'never'), t1 = T.S('07a', 'Not because');
  const VP = [1010, 330];
  const pathX = (q) => VP[0] + Math.sin(q * 3.1) * 140 * q - 60 * q;  // q: 0 at the far end, 1 near
  return {
    t: t0, tr: 'zoom', d: 1.0,
    draw(ctx, t) {
      const L = cache('s07-path', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#05061c'], [.3, '#151a50'], [.42, '#34357a'], [.5, '#1a1c4a'], [1, '#0a0b22']], glowAt: [1550, 200], glowCol: '#d8d2ff', glowA: .35, glowR: 900, stars: .8, seed: 14 });
        const [g, x] = wl(); const hz = VP[1] + 18;
        const gg = x.createLinearGradient(0, hz, 0, H + PY); gg.addColorStop(0, '#24265a'); gg.addColorStop(.25, '#14163c'); gg.addColorStop(1, '#07081c'); x.fillStyle = gg; x.fillRect(-PX, hz, LW, LH);
        { const lg = x.createRadialGradient(1500, hz, 0, 1500, hz, 1200); lg.addColorStop(0, rgba('#b8b4f0', .25)); lg.addColorStop(1, rgba('#b8b4f0', 0)); x.fillStyle = lg; x.fillRect(-PX, hz, LW, LH); }
        const r = prng(5), n = vnoise(6);
        const pw = (yy) => mix(6, 620, Math.pow((yy - hz) / (H + PY - hz), 1.15));
        const qOf = (yy) => (yy - hz) / (H + PY - hz);
        const pts = []; for (let yy = hz + 70; yy <= H + PY; yy += 6) pts.push([pathX(qOf(yy)), yy, pw(yy)]);
        const poly = [...pts.map(([a, b, w]) => [a - w / 2 * (1 + (n(b * .02, 1) - .5) * .25), b]), ...pts.map(([a, b, w]) => [a + w / 2 * (1 + (n(b * .02, 2) - .5) * .25), b]).reverse()];
        x.save(); x.beginPath(); roughPath(x, poly, { amp: 3, seed: 4 }); x.clip();
        const pg = x.createLinearGradient(0, hz + 70, 0, H + PY); pg.addColorStop(0, rgba('#55579a', 0)); pg.addColorStop(.2, '#4c4e92'); pg.addColorStop(1, '#2a2b60'); x.fillStyle = pg; x.fillRect(-PX, hz, LW, LH);
        { const lg = x.createLinearGradient(1400, 0, 600, 0); lg.addColorStop(0, rgba('#d8d4ff', .25)); lg.addColorStop(1, rgba('#d8d4ff', 0)); x.fillStyle = lg; x.fillRect(-PX, hz, LW, LH); }
        for (let i = 0; i < 14000; i++) { const yy = hz + 70 + Math.pow(r(), 1.3) * (H + PY - hz - 70), xx = pathX(qOf(yy)) + (r() - .5) * pw(yy); x.fillStyle = rgba(r() < .7 ? '#e4e0ff' : '#0e0f30', .1 + .35 * r()); const s = 1 + qOf(yy) * 2.5; x.fillRect(xx, yy, s, s * .6); }
        // pebbles
        for (let i = 0; i < 160; i++) { const yy = hz + 90 + Math.pow(r(), 1.2) * (H + PY - hz - 90), q = qOf(yy), xx = pathX(q) + (r() - .5) * pw(yy) * .9, s = 2 + q * 16 * r(); x.fillStyle = '#1a1b48'; x.beginPath(); x.ellipse(xx, yy, s, s * .55, 0, 0, 7); x.fill(); x.fillStyle = rgba('#d8d4ff', .4); x.beginPath(); x.ellipse(xx + s * .2, yy - s * .2, s * .5, s * .25, 0, 0, 7); x.fill(); }
        x.restore();
        // grass: perspective blades everywhere outside the path, overhanging its edges; tufts close the far end
        for (let i = 0; i < 26000; i++) { const yy = hz + Math.pow(r(), 1.6) * (H + PY - hz), q = qOf(yy), xx = -PX + r() * LW, inPath = Math.abs(xx - pathX(q)) < pw(yy) * .42 && yy > hz + 120; if (inPath && r() < .97) continue;
          const l = 2 + q * 34 * (.4 + r()), lit = xx > pathX(q) ? .35 : .2;
          x.strokeStyle = r() < lit ? '#aeaaf0' : (r() < .5 ? '#2c2e6a' : '#191b46'); x.globalAlpha = (.25 + .55 * r()) * (.3 + .7 * Math.min(1, q * 4)); x.lineWidth = .7 + q * 2.4; x.beginPath(); x.moveTo(xx, yy); x.quadraticCurveTo(xx + (r() - .5) * l * .2, yy - l * .6, xx + (r() - .45) * l * .5, yy - l); x.stroke(); }
        x.globalAlpha = 1;
        for (let i = 0; i < 1600; i++) { const yy = hz + 40 + r() * 200, xx = pathX(qOf(yy)) + (r() - .5) * 200; x.strokeStyle = r() < .3 ? '#8e8ad8' : '#22245a'; x.globalAlpha = .7; x.lineWidth = 1; x.beginPath(); x.moveTo(xx, yy); x.lineTo(xx + (r() - .5) * 3, yy - 3 - r() * 9); x.stroke(); }
        x.globalAlpha = 1;
        roughPoly(x, [[-PX, hz + 2], ...Array.from({ length: 60 }, (_, i) => [-PX + i * LW / 59, hz - 6 - 34 * Math.exp(-Math.pow((i - 40) / 9, 2)) - (fbm(vnoise(3), i * .2, 1) - .5) * 14]), [W + PX, hz + 2]], '#11133c', { amp: 1, seed: 2 });
        const mist = fogLayer({ y0: hz - 40, y1: hz + 160, col: '#a6a2e0', a: .45, seed: 31, cover: .7, soft: .5, k: .35 });
        return { sky, g, mist, hz, qOf, pw };
      });
      const u = lin(t0 - .6, t1 + .6, t), cm = { x: drift(t, 5, 3), y: mix(30, -20, sine(u)), z: mix(1.0, 1.14, sine(u)) };
      drawL(ctx, L.sky, cm, .05, { cy: VP[1] }); twinkle(ctx, t, cm, { seed: 8, n: 40, p: .05, y1: 300 });
      drawL(ctx, L.g, cm, 1, { cy: VP[1] }); drawL(ctx, L.mist, cm, .9, { a: .85, cy: VP[1] });
      // footprints: a few old pairs leading up; the farther the fainter; on "never" they fade one by one from the top
      ctx.save(); camT(ctx, cm, 1, W / 2, VP[1]);
      const prints = [.95, .83, .72, .62, .53, .45, .38];
      prints.forEach((q, i) => {
        const yy = L.hz + q * (H + PY - L.hz), w = L.pw(yy), sc = w / 300, px = pathX(q) + (i % 2 ? 1 : -1) * w * .11;
        const a = (.85 - i * .08) * (1 - sm(lin(tNever - .2 + (6 - i) * .1, tNever + .5 + (6 - i) * .1, t)));
        if (a <= 0) return;
        ctx.save(); ctx.translate(px, yy); ctx.scale(sc, sc * .38); ctx.rotate(i % 2 ? .1 : -.1);
        ctx.fillStyle = rgba('#0a0b26', a * .8);
        ctx.beginPath(); ctx.ellipse(0, -18, 15, 26, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(1, 26, 12, 14, 0, 0, 7); ctx.fill();   // sole + heel
        for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(-9 + k * 6, -48 + Math.abs(k - 1) * 2, 3.4, 0, 7); ctx.fill(); }
        ctx.fillStyle = rgba('#e4e0ff', a * .35); ctx.beginPath(); ctx.ellipse(-6, -30, 8, 6, 0, 0, 7); ctx.fill();
        ctx.restore();
      });
      ctx.restore();
      vig(ctx, .55);
    },
  };
}

// ================================================================== 7.03 "Not because they were shallow." (one turns back halfway up)
const slope = (x) => 980 - (x + 200) * .42 + (fbm(vnoise(12), x * .004, 1, 3) - .5) * 40;
export function shot03(T, t0) {
  const tTurn = T.S('07a', 'shallow') - .15;
  const FX = 930;
  return {
    t: t0, tr: 'up', d: .8,
    draw(ctx, t) {
      const L = cache('s07-slope', 'w', t, () => ({
        sky: skyLayer({ stops: [[0, '#04051a'], [.5, '#151a52'], [1, '#2c2e72']], glowAt: [1650, 60], glowCol: '#e2ddff', glowA: .42, glowR: 900, stars: .9, seed: 17 }),
        far: ridgeLayer((x) => 760 - x * .18 + (fbm(vnoise(13), x * .003, 1, 3) - .5) * 90, { col: '#1d2058', hc: '#9e9ae0', ha: .22, seed: 13, light: { x: 1650, y: 60, col: '#c6c0ff', a: .3 }, hatchN: 12 }),
        mist: fogLayer({ y0: 560, y1: 820, col: '#a8a4e0', a: .4, seed: 41, cover: .65, soft: .5, k: .4 }),
        hill: ridgeLayer(slope, { col: '#0c0e2c', hc: '#8682c8', ha: .32, seed: 12, light: { x: 1700, y: 0, col: '#bdb8ff', a: .3, r: 1300 }, rim: '#ece8ff', rimA: .7, gap: 6, hatchN: 30, grassCol: '#7c79c0', grassN: 5000 }),
        a: figSprite(.62, { lean: -.02, head: -.38, hip: [.04, -.05], kn: [0, .04], sh: [.15, -.12], el: [.35, .4], coat: 1, hood: true }, { dress: { coat: '#4b4a86', pants: '#15142c', skin: '#cdb2a0', hair: '#1c1420' }, light: { x: 900, y: -900, col: '#dcd6ff', a: .55 }, rim: '#eeeaff', rimW: 1.6 }),
        b: figSprite(.62, { lean: .1, head: .32, hip: [.2, -.12], kn: [.05, .2], sh: [.25, -.05], el: [.4, .45], coat: 1, hood: true }, { dress: { coat: '#4b4a86', pants: '#15142c', skin: '#cdb2a0', hair: '#1c1420' }, light: { x: 900, y: -900, col: '#dcd6ff', a: .45 }, rim: '#eeeaff', rimW: 1.6, flip: true }),
        summit: lightLayer(1700, -40, 700, { col: '#c8c2ff', core: '#f6f2ff', a: .35, seed: 14 }),
      }));
      const u = lin(t0 - .5, t0 + 2.6, t), cm = { x: mix(-40, 40, sine(u)) + drift(t, 5, 2), y: mix(-30, 20, sine(u)), z: 1.05 + .03 * u };
      drawL(ctx, L.sky, cm, .05); twinkle(ctx, t, cm, { seed: 9, n: 50, p: .05, y1: 600 });
      drawL(ctx, L.far, cm, .3); drawL(ctx, L.mist, cm, .4, { a: .8 });
      drawL(ctx, L.hill, cm, 1); drawL(ctx, L.summit, cm, .6, { op: 'lighter', a: .7 + .1 * Math.sin(t) });
      ctx.save(); camT(ctx, cm, 1);
      const fy = slope(FX) + 6, turn = lin(tTurn, tTurn + .5, t), sq = Math.cos(Math.PI * eio(turn));
      ctx.save(); ctx.translate(FX, fy); ctx.rotate(Math.PI - .55 + turn * .05); const sg = ctx.createLinearGradient(0, 0, 420, 0); sg.addColorStop(0, 'rgba(3,3,14,.75)'); sg.addColorStop(1, 'rgba(3,3,14,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(210, 0, 210, 9, 0, 0, 7); ctx.fill(); ctx.restore();
      const sp = turn < .5 ? L.a : L.b, kx = Math.max(.08, Math.abs(sq));
      ctx.save(); ctx.translate(FX, fy); ctx.scale(kx, 1); drawFig(ctx, sp, 0, 0, t, { ph: 1 }); ctx.restore();
      // after the turn the figure starts down the slope
      ctx.restore();
      vig(ctx, .5);
    },
  };
}

// ================================================================== 7.04 "Because survival ate their days." (a woman kneels at a quern by an oil lamp)
export function shot04(T, t0) {
  const tSurv = T.S('07a', 'survival'), tEnd = T.S('07a', 'The harvest');
  const Q = [930, 800], LAMP = [430, 850], NPH = 16;
  const phase = (t) => (t - t0) * .55 + sm(lin(tSurv - .2, tSurv + .9, t)) * .35;   // turns of the stone
  return {
    t: t0, tr: 'down', d: .7,
    draw(ctx, t) {
      const L = cache('s07-mill', 'w', t, () => {
        const [g, x] = wl();
        // mud wall + earthen floor, the lamp is the only light
        x.fillStyle = '#24160e'; x.fillRect(-PX, -PY, LW, 720 + PY);
        hatch(x, [-PX, -PY, LW, 720 + PY], { angle: 1.35, gap: 7, col: '#000', a: .3, seed: 3 });
        roughPoly(x, [[-PX, 700], [W + PX, 690], [W + PX, H + PY], [-PX, H + PY]], '#3a2616', { amp: 2, seed: 4 });
        hatch(x, [-PX, 690, LW, 600], { angle: -.06, gap: 6, col: '#120a04', a: .3, seed: 5 });
        // sacks and a basket against the wall
        for (const [sx, sw, sh] of [[1390, 170, 230], [1540, 150, 190], [1660, 160, 210]]) { roughPoly(x, [[sx, 712], [sx + 12, 712 - sh * .8], [sx + sw * .3, 712 - sh], [sx + sw * .75, 712 - sh * .95], [sx + sw - 8, 712 - sh * .7], [sx + sw, 712]], '#5a3e26', { amp: 3, seed: sx }); }
                const lg = x.createRadialGradient(LAMP[0], LAMP[1] - 30, 0, LAMP[0], LAMP[1] - 30, 1300); lg.addColorStop(0, rgba('#ffb35c', .75)); lg.addColorStop(.35, rgba('#c86a2a', .3)); lg.addColorStop(1, rgba('#000', 0)); x.globalCompositeOperation = 'screen'; x.fillStyle = lg; x.fillRect(-PX, -PY, LW, LH); x.globalCompositeOperation = 'source-over';
        stip(g, { k: .35, seed: 2 });
        // flour drifts around the base
        const r = prng(9); for (let i = 0; i < 6000; i++) { const a = r() * 6.283, d = 250 * (1 + Math.pow(r(), 2) * .5); x.fillStyle = rgba('#f5e6c8', .08 + .3 * r()); x.fillRect(Q[0] + Math.cos(a) * d, Q[1] + 50 + Math.sin(a) * d * .3, 1.6, 1.6); }
        // stone texture (top view; rotated per frame and squashed)
        const R = 220, [s, sx] = layer(2 * R + 8, 2 * R + 8); sx.translate(R + 4, R + 4);
        const sg = sx.createRadialGradient(-R * .5, -R * .1, 0, 0, 0, R * 1.1); sg.addColorStop(0, '#d6a874'); sg.addColorStop(.6, '#8a5c38'); sg.addColorStop(1, '#4a2f1c'); sx.fillStyle = sg;
        sx.beginPath(); roughPath(sx, Array.from({ length: 64 }, (_, i) => [Math.cos(i / 64 * 6.283) * R, Math.sin(i / 64 * 6.283) * R]), { amp: 2.5, seed: 3 }); sx.fill(); sx.save(); sx.clip();
        hatch(sx, [-R, -R, 2 * R, 2 * R], { angle: .9, gap: 4, col: '#2a170c', a: .35, seed: 7 });
        for (let i = 0; i < 1800; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; sx.fillStyle = rgba(r() < .5 ? '#f0d0a0' : '#2a170c', .3 * r()); sx.fillRect(Math.cos(a) * d, Math.sin(a) * d, 2, 2); }
        sx.strokeStyle = rgba('#2a170c', .45); sx.lineWidth = 2.5; for (let k = 0; k < 8; k++) { const a = k / 8 * 6.283; sx.beginPath(); sx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40); sx.lineTo(Math.cos(a + .5) * R * .95, Math.sin(a + .5) * R * .95); sx.stroke(); }
        sx.restore(); sx.fillStyle = '#1a0f08'; sx.beginPath(); sx.arc(0, 0, 34, 0, 7); sx.fill(); sx.fillStyle = '#e8d2a8'; sx.beginPath(); sx.arc(0, 0, 20, 0, 7); sx.fill();
        stip(s, { k: .35, seed: 5 });
        // the woman: kneeling, pushing; arm poses for one turn (cached)
        const woman = []; for (let i = 0; i < NPH; i++) { const a = i / NPH * 6.283;
          woman.push(figSprite(2.3, { lean: .38 + .08 * Math.sin(a), head: .3, hip: [0, .05], kn: [1.57, 1.5], sh: [1.35 + .3 * Math.sin(a), 1.2 + .28 * Math.sin(a)], el: [-.3 - .25 * Math.cos(a), -.2 - .25 * Math.cos(a)], skirt: true, hood: true },
            { dress: { coat: '#7a3e22', pants: '#3a2214', skin: '#a8754e', hair: '#2a1a10', skirt: '#4a2614', shoes: '#2a1a10' }, flip: true, light: { x: -900, y: -120, col: '#ffcf8a', a: .45 }, rim: '#ffcf8a', rimSide: -1, rimW: 2.6, shadeA: .2 })); }
        return { g, s, R, woman };
      });
      const u = lin(t0 - .4, tEnd + .4, t), cm = { x: drift(t, 6, 4) + mix(-20, 20, u), y: mix(-10, 10, sine(u)), z: 1.02 + .05 * sine(u) };
      drawL(ctx, L.g, cm, 1);
      const ph = phase(t), a = ph * 6.283;
      ctx.save(); camT(ctx, cm, 1);
      // quern: base stone + upper stone (thickness, rotating top)
      const R = L.R, ry = .3;
      groundShadow(ctx, Q[0] + 60, Q[1] + 70, 330, .6);
      ctx.fillStyle = '#3d2a1c'; ctx.beginPath(); ctx.ellipse(Q[0], Q[1] + 46, R * 1.08, R * 1.08 * ry, 0, 0, 7); ctx.fill(); ctx.fillRect(Q[0] - R * 1.08, Q[1] + 10, R * 2.16, 36);
      ctx.beginPath(); ctx.ellipse(Q[0], Q[1] + 10, R * 1.08, R * 1.08 * ry, 0, 0, 7); ctx.fillStyle = '#5a3e28'; ctx.fill();
      ctx.fillStyle = '#6e4a2e'; ctx.fillRect(Q[0] - R, Q[1] - 40, R * 2, 40); ctx.beginPath(); ctx.ellipse(Q[0], Q[1], R, R * ry, 0, 0, Math.PI); ctx.fill();
      { const g = ctx.createLinearGradient(Q[0] - R, 0, Q[0] + R, 0); g.addColorStop(0, rgba('#ffcf8a', .45)); g.addColorStop(.5, rgba('#000', 0)); g.addColorStop(1, rgba('#000', .45)); ctx.fillStyle = g; ctx.fillRect(Q[0] - R, Q[1] - 40, R * 2, 40 + R * ry); }
      ctx.save(); ctx.translate(Q[0], Q[1] - 40); ctx.scale(1, ry); ctx.rotate(a); ctx.drawImage(L.s, -R - 4, -R - 4); ctx.restore();
      // the woman (her arms cycle with the stone) and the peg in her hands
      const i = Math.floor(((ph % 1) + 1) % 1 * NPH) % NPH, sp = L.woman[i], WX = 1330, WY = 905;
      const hx = WX + (sp.hand(0)[0] - sp.fx), hy = WY + (sp.hand(0)[1] - sp.fy);
      // the peg stands on the stone's rim where her hand is
      ctx.fillStyle = '#4a2e18'; roughRect(ctx, hx - 9, hy - 20, 18, Q[1] - 40 + 10 - hy + 20 + Math.sin(a) * 6, '#5a3820', { amp: .5, seed: 3 }); ctx.fillStyle = rgba('#ffcf8a', .5); ctx.fillRect(hx - 9, hy - 20, 4, Q[1] - 20 - hy);
      groundShadow(ctx, WX - 20, WY + 6, 200, .55);
      drawFig(ctx, sp, WX, WY, t, { ph: 2, sway: .3 });
      // grain trickling from her other hand into the eye
      { const r = prng(3); for (let k = 0; k < 30; k++) { const f = (r() + (t - t0) * (1.4 + r())) % 1; ctx.fillStyle = rgba('#f3dfb5', .85 * (1 - f)); ctx.fillRect(Q[0] - 8 + r() * 16, Q[1] - 230 + f * 190, 2.5, 3.5); } }
      // lamp: clay lamp, flame flicker
      ctx.fillStyle = '#5a3418'; ctx.beginPath(); ctx.ellipse(LAMP[0], LAMP[1] + 20, 46, 16, 0, 0, 7); ctx.fill(); ctx.fillRect(LAMP[0] - 46, LAMP[1] + 4, 92, 16);
      const fl = 1 + .12 * Math.sin(t * 13) + .08 * Math.sin(t * 7.3);
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; const lg = ctx.createRadialGradient(LAMP[0] + 30, LAMP[1] - 20, 0, LAMP[0] + 30, LAMP[1] - 20, 330 * fl); lg.addColorStop(0, rgba('#fff1cf', .6)); lg.addColorStop(.15, rgba('#ffb35c', .25)); lg.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = lg; ctx.fillRect(LAMP[0] - 400, LAMP[1] - 400, 800, 800); ctx.restore();
      ctx.fillStyle = '#fff1cf'; ctx.beginPath(); ctx.ellipse(LAMP[0] + 32, LAMP[1] - 6 * fl, 6, 16 * fl, .1 * Math.sin(t * 5), 0, 7); ctx.fill();
      ctx.restore();
      vig(ctx, .6, '#0a0503');
    },
  };
}

// ================================================================== 7.05 "The harvest." (a reaper, backlit, the sickle sweeps)
export function shot05(T, t0) {
  const tH = T.S('07a', 'harvest'), SUN = [1220, 590];
  return {
    t: t0, tr: 'right', d: .55, sun: SUN,
    draw(ctx, t) {
      const L = cache('s07-harv', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#2a1f4a'], [.35, '#7a3f52'], [.55, '#d9783e'], [.66, '#f6b860'], [.72, '#f2c47a'], [1, '#8a4a2a']], glowAt: SUN, glowCol: '#ffd59a', glowA: .7, glowR: 800, stars: 0, seed: 23 });
        const far = ridgeLayer((x) => 640 + (fbm(vnoise(23), x * .003, 1, 3) - .5) * 26, { col: '#a8683c', hc: '#ffd59a', ha: .3, seed: 23, light: { x: SUN[0], y: SUN[1], col: '#ffe0a8', a: .6 }, hatchN: 10, gap: 4 });
        const wheat = (y0, y1, n, sz, seed) => { const [w, x] = wl(); const r = prng(seed);
          for (let i = 0; i < n; i++) { const yy = y0 + Math.pow(r(), 1.3) * (y1 - y0), dpt = (yy - y0) / (y1 - y0), xx = -PX + r() * LW, hh = sz * (.6 + .6 * dpt) * (.7 + .5 * r()), lean = (r() - .5) * .3, d2 = Math.hypot(xx - SUN[0], (yy - SUN[1]) * 1.6);
            const lit = clamp(1 - d2 / 900);
            x.strokeStyle = mixHex('#4a2412', '#b8682a', r() * .5 + lit * .4); x.lineWidth = .8 + sz * .012; x.beginPath(); x.moveTo(xx, yy); x.quadraticCurveTo(xx + lean * hh * .3, yy - hh * .5, xx + lean * hh, yy - hh); x.stroke();
            x.fillStyle = mixHex('#8a4a20', '#ffd98a', lit * .8 + r() * .2); x.beginPath(); x.ellipse(xx + lean * hh, yy - hh - sz * .05, sz * .018 + 1, sz * .06 + 2, lean, 0, 7); x.fill();
            if (lit > .3) { x.fillStyle = rgba('#fff1cf', lit * .6); x.beginPath(); x.ellipse(xx + lean * hh + 1, yy - hh - sz * .06, sz * .008 + .6, sz * .045 + 1, lean, 0, 7); x.fill(); } }
          return w; };
        const reaper = []; for (let k = 0; k <= 10; k++) { const q = k / 10;
          reaper.push(figSprite(2.5, { lean: .55, head: .45, hip: [.4, -.3], kn: [.5, .6], sh: [mix(-.5, 1.7, q), .6], el: [mix(.5, .2, q), .5], hair: 'cap', bulk: 1.05 },
            { dress: { coat: '#4a2a1c', pants: '#2a1a14', skin: '#8a5a3a', hair: '#2a1a10', hairBack: '#2a1a10' }, light: { x: 400, y: -60, col: '#ffcf7a', a: .7 }, shadeA: .62, shadeCol: '#1a0a06', rim: '#ffe0a0', rimW: 3.2, rimSide: 1,
              prop: (g, a0) => { g.save(); g.translate(a0.hx, a0.hy); g.rotate(-a0.ang); g.strokeStyle = '#2a1a10'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, -4); g.lineTo(0, 16); g.stroke(); g.strokeStyle = '#f0ece0'; g.lineWidth = 3.6; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 16); g.bezierCurveTo(6, 44, 40, 44, 38, 14); g.stroke(); g.restore(); } })); }
        return { sky, far, w1: wheat(640, 900, 8000, 80, 31), w2: wheat(990, H + PY, 900, 150, 32), reaper };
      });
      const land = 1 - eout(lin(t0 - .3, t0 + .45, t)), cm = { x: -300 * land + (t - t0) * 26 + drift(t, 4, 5), y: 0, z: 1.04 };
      drawL(ctx, L.sky, cm, .05);
      { const [sx, sy] = proj(cm, .05, SUN[0], SUN[1]); ctx.fillStyle = '#fff4d8'; ctx.beginPath(); ctx.arc(sx, sy, 78, 0, 7); ctx.fill(); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 420); g.addColorStop(0, rgba('#fff1cf', .55)); g.addColorStop(1, rgba('#ffb35c', 0)); ctx.fillStyle = g; ctx.fillRect(sx - 420, sy - 420, 840, 840); ctx.restore(); }
      drawL(ctx, L.far, cm, .25); drawL(ctx, L.w1, cm, .5);
      const sw = eio(lin(tH - .3, tH + .3, t)), k = Math.round(sw * 10);
      ctx.save(); camT(ctx, cm, .9); drawFig(ctx, L.reaper[k], 700, 1080, t, { ph: 2 });
      if (sw > .4) { const r = prng(4); for (let i = 0; i < 30; i++) { const f = eout(lin(tH + i * .008, tH + .7, t)), x0 = 860 + r() * 220, y0 = 960 - r() * 50; ctx.save(); ctx.translate(x0, y0 + f * 30); ctx.rotate(-.1 - f * 1.2 * (.6 + r() * .6)); ctx.strokeStyle = '#c98a3a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -150 - r() * 50); ctx.stroke(); ctx.fillStyle = '#ffd98a'; ctx.beginPath(); ctx.ellipse(0, -180, 6, 18, 0, 0, 7); ctx.fill(); ctx.restore(); } }
      ctx.restore();
      drawL(ctx, L.w2, cm, 1.1);
      vig(ctx, .45, '#1a0806');
    },
  };
}

// ================================================================== 7.06 "The rent." (on a doorstep under the street lamp, coins counted onto a stack)
export function shot06(T, t0) {
  const tR = T.S('07a', 'rent'), LAMP = [1560, 150], STACK = [1130, 812];
  return {
    t: t0, tr: 'zoom', d: .5, depth: 4,
    draw(ctx, t) {
      const L = cache('s07-rent', 'w', t, () => {
        const [g, x] = wl();
        x.fillStyle = '#140e10'; x.fillRect(-PX, -PY, LW, LH);
        // brick facade, a dark door, the stone step, the pavement
        roughRect(x, -PX, -PY, LW, 800 + PY, '#2a1a16', { amp: 1, seed: 1 });
        const r = prng(2); for (let row = 0; row < 30; row++) { const y = -PY + row * 30; x.strokeStyle = rgba('#000', .4); x.lineWidth = 1.5; x.beginPath(); x.moveTo(-PX, y); x.lineTo(W + PX, y + 1); x.stroke(); for (let c = 0; c < 30; c++) { const xx = -PX + c * 90 + (row % 2) * 45 + (r() - .5) * 4; x.beginPath(); x.moveTo(xx, y); x.lineTo(xx, y + 30); x.stroke(); } }
        roughRect(x, 420, -PY, 380, 770 + PY, '#120a08', { amp: 1, seed: 3 }); roughRect(x, 400, -PY, 22, 770 + PY, '#3a2418', { amp: .6, seed: 4 }); roughRect(x, 800, -PY, 22, 770 + PY, '#3a2418', { amp: .6, seed: 5 });
        for (const [px, py] of [[460, 80], [620, 80], [460, 420], [620, 420]]) roughRect(x, px, py, 140, 300, '#1a100c', { amp: .5, seed: px + py });
        roughPoly(x, [[-PX, 770], [W + PX, 765], [W + PX, 830], [-PX, 840]], '#6a5a4e', { amp: 1.5, seed: 6 });
        roughPoly(x, [[-PX, 840], [W + PX, 830], [W + PX, 880], [-PX, 890]], '#3a2e28', { amp: 1.5, seed: 7 });
        roughPoly(x, [[-PX, 890], [W + PX, 880], [W + PX, H + PY], [-PX, H + PY]], '#1e1814', { amp: 1.5, seed: 8 });
        hatch(x, [-PX, 760, LW, 600], { angle: -.03, gap: 5, col: '#0a0604', a: .35, seed: 9 });
        // lamp post (right) and the sodium light raking across the wall
        roughRect(x, LAMP[0] + 30, LAMP[1], 22, 900, '#0e0a0a', { amp: .6, seed: 10 }); roughPoly(x, [[LAMP[0] - 20, LAMP[1] - 30], [LAMP[0] + 80, LAMP[1] - 30], [LAMP[0] + 60, LAMP[1] + 10], [LAMP[0], LAMP[1] + 10]], '#0e0a0a', { amp: .6, seed: 11 });
        x.globalCompositeOperation = 'screen'; const lg = x.createRadialGradient(LAMP[0] + 30, LAMP[1] + 20, 0, LAMP[0] + 30, LAMP[1] + 20, 1400); lg.addColorStop(0, rgba('#ffd59a', .9)); lg.addColorStop(.12, rgba('#ff9a40', .5)); lg.addColorStop(.5, rgba('#c05a1a', .18)); lg.addColorStop(1, rgba('#000', 0)); x.fillStyle = lg; x.fillRect(-PX, -PY, LW, LH); x.globalCompositeOperation = 'source-over';
        stip(g, { k: .4, seed: 3 });
        const sit = (q) => figSprite(2.3, { lean: .22, head: .5, hip: [1.5, 1.4], kn: [1.5, 1.4], sh: [mix(.9, 1.45, q), .8], el: [mix(1.1, .25, q), 1.2], coat: 1, hair: 'short' },
          { dress: { coat: '#3a3a52', pants: '#1a1824', skin: '#b98a62', hair: '#1a1210' }, light: { x: 900, y: -700, col: '#ffb35c', a: .6 }, rim: '#ffcf8a', rimW: 2.4, shadeA: .1,
            prop: (gg, a0, a1) => { gg.fillStyle = '#e0aa50'; gg.beginPath(); gg.ellipse(a1.hx + 2, a1.hy - 4, 7, 3, 0, 0, 7); gg.fill(); gg.beginPath(); gg.ellipse(a1.hx + 5, a1.hy - 6, 7, 3, 0, 0, 7); gg.fill(); } });
        return { g, poses: [sit(0), sit(.5), sit(1)] };
      });
      const u = lin(t0 - .3, t0 + 1.3, t), cm = { x: drift(t, 5, 1) + u * 20, y: 0, z: mix(1.1, 1.04, eout(u)) };
      drawL(ctx, L.g, cm, 1);
      ctx.save(); camT(ctx, cm, 1);
      const n = 7, last = tR + .05; let reach = 0;
      for (let i = 0; i < n; i++) { const tl = last - (n - 1 - i) * .16, f = clamp((t - tl + .12) / .12); if (f <= 0) { reach = Math.max(reach, 1 - Math.abs(t - tl + .06) / .12); continue; } coin(ctx, STACK[0] + (i % 2) * 2 - 1, STACK[1] - i * 8 - (1 - f) * 30, 26, .38); }
      coin(ctx, STACK[0] + 70, STACK[1] + 10, 24, .36, '#c08a3a');
      const sp = L.poses[reach > .66 ? 2 : reach > .2 ? 1 : 0];
      drawFig(ctx, sp, 940, 872, t, { ph: 3, sway: .4 });
      ctx.restore();
      // the lamp head glow (hero)
      { const [lx, ly] = proj(cm, 1, LAMP[0] + 30, LAMP[1] + 4); ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, 160); g.addColorStop(0, rgba('#fff1cf', .9)); g.addColorStop(.2, rgba('#ffb35c', .35)); g.addColorStop(1, rgba('#ff9a40', 0)); ctx.fillStyle = g; ctx.fillRect(lx - 160, ly - 160, 320, 320); ctx.restore(); }
      vig(ctx, .55, '#080402');
    },
  };
}

// ================================================================== 7.07 "The next shift." (6 am, a nurse on a corridor bench ties her shoe)
export function shot07(T, t0) {
  const tS = T.S('07a', 'shift'), VP = [1230, 470];
  return {
    t: t0, tr: 'left', d: .5,
    draw(ctx, t) {
      const L = cache('s07-ward', 'w', t, () => {
        const [g, x] = wl();
        const ew = [VP[0] - 95, VP[1] - 120, 190, 220];
        roughPoly(x, [[-PX, -PY], [W + PX, -PY], [ew[0] + ew[2], ew[1]], [ew[0], ew[1]]], '#24363f', { amp: 1, seed: 1 });
        roughPoly(x, [[-PX, -PY], [ew[0], ew[1]], [ew[0], ew[1] + ew[3]], [-PX, H + PY]], '#2c4049', { amp: 1, seed: 2 });
        roughPoly(x, [[W + PX, -PY], [ew[0] + ew[2], ew[1]], [ew[0] + ew[2], ew[1] + ew[3]], [W + PX, H + PY]], '#1f3039', { amp: 1, seed: 3 });
        roughPoly(x, [[-PX, H + PY], [ew[0], ew[1] + ew[3]], [ew[0] + ew[2], ew[1] + ew[3]], [W + PX, H + PY]], '#3e5054', { amp: 1, seed: 4 });
        // end window: first light outside (rose-pale), frame cross
        const wg = x.createLinearGradient(0, ew[1], 0, ew[1] + ew[3]); wg.addColorStop(0, '#e9c6b4'); wg.addColorStop(1, '#a6c2c6'); x.fillStyle = wg; x.fillRect(ew[0] + 26, ew[1] + 26, ew[2] - 52, ew[3] - 70);
        x.fillStyle = '#24363f'; x.fillRect(VP[0] - 2, ew[1] + 26, 4, ew[3] - 70); x.fillRect(ew[0] + 26, ew[1] + 100, ew[2] - 52, 4);
        // wall rail + doors with small windows; floor tiles in perspective; ceiling lights with floor reflections
        const persp = (q, y) => [mix(ew[0], -PX - 200, q), mix(ew[1] + (y - ew[1]) * (ew[3] / 220), y, q)];
        x.strokeStyle = rgba('#8ab0b0', .35); x.lineWidth = 3; x.beginPath(); x.moveTo(ew[0], ew[1] + 110); x.lineTo(-PX, 560); x.stroke();
        for (let k = 1; k < 6; k++) { const q = Math.pow(.6, k), dx = mix(ew[0], -PX - 400, q), dt = mix(ew[1] + 40, 60, q), db = mix(ew[1] + ew[3], H + 260, q), dw = 160 * q;
          roughPoly(x, [[dx, dt], [dx + dw, dt + 14 * q], [dx + dw, db - 16 * q], [dx, db]], '#20323a', { amp: .5, seed: 10 + k }); roughPoly(x, [[dx + dw * .3, dt + 40 * q], [dx + dw * .7, dt + 44 * q], [dx + dw * .7, dt + 120 * q], [dx + dw * .3, dt + 118 * q]], '#9ab8b8', { amp: .3, seed: 20 + k }); }
        for (let k = 0; k < 14; k++) { const q = Math.pow(.78, k); x.strokeStyle = rgba('#000', .15); x.lineWidth = 1.2; x.beginPath(); x.moveTo(mix(ew[0], -PX - 300, q), mix(ew[1] + ew[3], H + PY, q)); x.lineTo(mix(ew[0] + ew[2], W + PX + 300, q), mix(ew[1] + ew[3], H + PY, q)); x.stroke(); }
        for (let k = 0; k < 7; k++) { const q = Math.pow(.62, k), cx = mix(VP[0], 820, q), cy = mix(ew[1], -80, q), w = 340 * q, h = 44 * q; x.fillStyle = '#eafcf8'; x.globalAlpha = .95; x.beginPath(); x.ellipse(cx, cy, w / 2, h / 2, 0, 0, 7); x.fill();
          x.globalAlpha = .1; x.beginPath(); x.ellipse(cx, mix(ew[1] + ew[3], H + 260, q), w / 2, h * 1.8, 0, 0, 7); x.fill(); x.globalAlpha = 1; }
        // the bench along the left wall
        roughPoly(x, [[300, 845], [980, 760], [990, 785], [300, 878]], '#5a6a6a', { amp: .8, seed: 30 }); roughPoly(x, [[300, 878], [990, 785], [990, 800], [300, 900]], '#2a383c', { amp: .8, seed: 31 });
        for (const lx of [340, 940]) roughRect(x, lx, 860 - (lx - 300) * .13, 12, 120, '#1a2428', { amp: .5, seed: lx });
        hatch(x, [-PX, -PY, 1000, LH], { angle: -.9, gap: 8, col: '#0a141a', a: .18, seed: 6 });
        stip(g, { k: .3, seed: 7 });
        const cool = lightLayer(820, -60, 1100, { col: '#a8e8e0', core: '#e6fbf6', a: .35, sy: .8, seed: 8 });
        const pose = (q) => ({ lean: mix(.72, .5, q), head: mix(.4, .25, q), hip: [1.5, 1.3], kn: [1.5, 1.6], sh: [mix(1.5, 1.0, q), mix(1.3, .7, q)], el: [mix(.1, .9, q), mix(.2, 1.1, q)], hair: 'bun' });
        const nurse = [0, .5, 1].map((q) => figSprite(2.0, pose(q), { dress: { coat: '#6fa7b0', pants: '#5d929c', shoes: '#e8eef0', skin: '#a8785a', hair: '#1a100c' }, light: { x: 400, y: -900, col: '#e6fbf6', a: .5 }, rim: '#e6fbf6', rimW: 2.4 }));
        return { g, cool, nurse };
      });
      const land = 1 - eout(lin(t0 - .25, t0 + .5, t)), cm = { x: 300 * land + drift(t, 5, 2) - (t - t0) * 14, y: 0, z: 1.04 };
      drawL(ctx, L.g, cm, 1); drawL(ctx, L.cool, cm, 1, { op: 'screen' });
      ctx.save(); camT(ctx, cm, 1);
      const q = eio(lin(tS - .25, tS + .15, t)), sp = L.nurse[q < .33 ? 0 : q < .8 ? 1 : 2];
      groundShadow(ctx, 630, 910, 180, .5);
      drawFig(ctx, sp, 600, 905, t, { ph: 3, sway: .3 });
      ctx.restore();
      vig(ctx, .5, '#03080a');
    },
  };
}

// ================================================================== 7.08 "There was simply no room left to wonder." (three small lit windows, a vast sky nobody looks at)
export const STAR08 = [1480, 190];
export function shot08(T, t0, minis) {
  const tW = T.S('07a', 'wonder'), tE = T.S('07a', 'Asking what');
  const PAN = [[700, 862], [960, 880], [1215, 858]], PW = 124, PH = 78;
  const cam = (t) => { const u = lin(t0 - .5, tW + .8, t); return { x: drift(t, 4, 6), y: mix(170, 0, quart(u)), z: mix(2.6, 1, quart(u)) }; };
  return {
    t: t0, tr: 'out', d: 1.0, depth: 5,
    panel: (t) => proj(cam(t), 1, PAN[2][0], PAN[2][1], W / 2, 880),
    draw(ctx, t) {
      const L = cache('s07-wonder', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#020312'], [.55, '#0a0d34'], [.8, '#1c1f56'], [1, '#0a0b22']], stars: 1.4, seed: 29, band: { x0: 300, y0: -100, k: .25, w: 300, a: .3 } });
        const land = ridgeLayer((x) => 905 + (fbm(vnoise(29), x * .003, 1, 3) - .5) * 40 - 26 * Math.exp(-Math.pow((x - 960) / 500, 2)), { col: '#06071a', hc: '#3a3a7a', ha: .3, seed: 29, hatchN: 14, rim: '#5a5aa0', rimA: .4 });
        // three low cottages, one window each
        const [h, x] = wl();
        PAN.forEach(([px, py], i) => { const w = 300 + i * 20, top = py - 120; roughPoly(x, [[px - w / 2, py + 120], [px - w / 2, top + 40], [px - w * .1, top - 40 - i * 10], [px + w / 2, top + 30], [px + w / 2, py + 120]], '#05061a', { amp: 1.5, seed: 50 + i }); roughRect(x, px + w * .25, top - 30, 18, 50, '#05061a', { amp: .6, seed: 60 + i }); });
        const pan = minis.map((f) => f());
        return { sky, land, h, pan };
      });
      const cm = cam(t);
      drawL(ctx, L.sky, cm, .15, { cy: 880 }); twinkle(ctx, t, cm, { seed: 13, n: 120, p: .15, y1: 760 });
      // the star that becomes the study window (7.09)
      { const [sx, sy] = proj(cm, .15, STAR08[0], STAR08[1], W / 2, 880), a = .7 + .3 * Math.sin(t * 1.7) + sm(lin(tE - 1.2, tE, t)) * .6; ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 40); g.addColorStop(0, rgba('#fff1cf', a)); g.addColorStop(.25, rgba('#ffd59a', a * .3)); g.addColorStop(1, rgba('#ffd59a', 0)); ctx.fillStyle = g; ctx.fillRect(sx - 40, sy - 40, 80, 80); ctx.restore(); }
      drawL(ctx, L.land, cm, 1, { cy: 880 }); drawL(ctx, L.h, cm, 1, { cy: 880 });
      ctx.save(); camT(ctx, cm, 1, W / 2, 880);
      PAN.forEach(([x, y], i) => {
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y + 40, 0, x, y + 40, 200); g.addColorStop(0, rgba(['#ffb35c', '#ff9a40', '#a8e8e0'][i], .22)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 200, y - 160, 400, 400); ctx.restore();
        ctx.drawImage(L.pan[i], x - PW / 2, y - PH / 2, PW, PH);
        ctx.strokeStyle = '#05061a'; ctx.lineWidth = 5; ctx.strokeRect(x - PW / 2, y - PH / 2, PW, PH);
      });
      ctx.restore();
      vig(ctx, .45);
    },
  };
}
export function miniOf(shot, tt, w = 300, h = 188) {
  return () => { const [full, fx] = layer(W, H); fx.fillStyle = '#000'; fx.fillRect(0, 0, W, H); shot.draw(fx, tt, { a: tt - 1, b: tt + 1 }); const [m, mx] = layer(w, h); mx.drawImage(full, 0, 0, w, h); return m; };
}

// ================================================================== 7.09 "Asking what your life is for was a privilege of the few." (one lit study window high on a dark tower)
export const WIN09 = [1010, 300];
export function shot09(T, t0) {
  const tFew = T.S('07a', 'few'), tEnd = T.S('07a', 'For the first');
  const cam = (t) => { const u = lin(t0 - .5, tEnd + .5, t); return { x: drift(t, 4, 7) + mix(-30, 10, u), y: mix(170, -20, sine(u)), z: mix(1.0, 1.25, sine(u)) }; };
  const WW = 150, WH = 200;
  return {
    t: t0, tr: 'zoom', d: 1.0, depth: 7,
    win: (t) => proj(cam(t), 1, WIN09[0], WIN09[1] + 60),
    draw(ctx, t) {
      const L = cache('s07-tower', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#03041a'], [.6, '#10144a'], [1, '#262a68']], glowAt: [400, 100], glowCol: '#bdb8ff', glowA: .25, glowR: 900, stars: 1, seed: 33 });
        const [g, x] = wl();
        const Q = [[700, -PY - 40], [1330, -PY - 40], [1420, H + PY], [600, H + PY]];
        roughPoly(x, Q, '#17183e', { amp: 2, seed: 2 });
        x.save(); x.beginPath(); roughPath(x, Q, { amp: 2, seed: 2 }); x.clip();
        { const sg = x.createLinearGradient(600, 0, 1420, 0); sg.addColorStop(0, rgba('#8a86d0', .18)); sg.addColorStop(.4, rgba('#000', 0)); sg.addColorStop(1, rgba('#000', .35)); x.fillStyle = sg; x.fillRect(560, -PY, 900, LH); }
        const r = prng(3); for (let row = 0; row < 40; row++) { const y = -PY + row * 34 + 10; x.strokeStyle = rgba('#000', .35); x.lineWidth = 1.4; x.beginPath(); x.moveTo(560, y); x.lineTo(1460, y + 2); x.stroke(); for (let c = 0; c < 14; c++) { const xx = 600 + c * 64 + (row % 2) * 32 + (r() - .5) * 6; x.beginPath(); x.moveTo(xx, y); x.lineTo(xx, y + 34); x.stroke(); } }
        hatch(x, [560, -PY, 900, LH], { angle: -1.2, gap: 6, col: '#000', a: .25, seed: 4 });
        const lg = x.createRadialGradient(WIN09[0], WIN09[1] + 60, 0, WIN09[0], WIN09[1] + 60, 560); lg.addColorStop(0, rgba('#ffb35c', .5)); lg.addColorStop(1, rgba('#ffb35c', 0)); x.globalCompositeOperation = 'screen'; x.fillStyle = lg; x.fillRect(-PX, -PY, LW, LH); x.globalCompositeOperation = 'source-over';
        for (const [sx, sy] of [[820, 760], [1160, 640], [900, 1000], [1240, 1060], [780, 380], [1220, 120]]) roughRect(x, sx, sy, 16, 54, '#08081c', { amp: .4, seed: sx });
        x.restore();
        // window: arched, deep reveal; inside a warm study: shelves, a lamp
        const [wx0, wy0] = [WIN09[0] - WW / 2, WIN09[1] - 40];
        x.fillStyle = '#0a0a1c'; x.beginPath(); x.moveTo(wx0 - 16, wy0 + WH + 12); x.lineTo(wx0 - 16, wy0 + 60); x.arc(WIN09[0], wy0 + 60, WW / 2 + 16, Math.PI, 0); x.lineTo(wx0 + WW + 16, wy0 + WH + 12); x.closePath(); x.fill();
        x.save(); x.beginPath(); x.moveTo(wx0, wy0 + WH); x.lineTo(wx0, wy0 + 60); x.arc(WIN09[0], wy0 + 60, WW / 2, Math.PI, 0); x.lineTo(wx0 + WW, wy0 + WH); x.closePath(); x.clip();
        const ig = x.createRadialGradient(WIN09[0] + 40, WIN09[1] + 80, 0, WIN09[0] + 40, WIN09[1] + 80, 180); ig.addColorStop(0, '#fff1cf'); ig.addColorStop(.3, '#ffb35c'); ig.addColorStop(1, '#6a2a10'); x.fillStyle = ig; x.fillRect(wx0, wy0, WW, WH);
        for (let i = 0; i < 11; i++) roughRect(x, wx0 + 6 + i * 13, wy0 + 30, 9, 28 + (i % 3) * 5, ['#6a2a14', '#3a1a0c', '#8a4a20'][i % 3], { amp: .3, seed: i });
        roughRect(x, wx0, wy0 + 64, WW, 7, '#3a1a0c', { amp: .4, seed: 30 });
        roughRect(x, wx0, wy0 + 150, WW, 9, '#3a1a0c', { amp: .4, seed: 31 });   // desk
        x.restore();
        x.fillStyle = '#0a0a1c'; x.fillRect(WIN09[0] - 2, wy0, 4, WH);   // mullion
        const reader = figSprite(.62, { lean: .3, head: .55, hip: [1.5, 1.4], kn: [1.5, 1.4], sh: [1.0, .8], el: [1.1, 1.3], hair: 'short' }, { dress: { coat: '#4a1e0c', pants: '#2a120a', skin: '#e0b088', hair: '#1a0c06' }, light: { x: 80, y: -20, col: '#fff1cf', a: .6 }, rim: '#fff1cf', rimW: 1.4 });
        const glow = lightLayer(WIN09[0], WIN09[1] + 60, 400, { col: '#ffb35c', core: '#fff1cf', a: .3, seed: 6 });
        const roofs = (() => { const [c, xx] = wl(); const r2 = prng(8); for (let i = 0; i < 26; i++) house(xx, r2, -PX + i * 95 + r2() * 30, H + PY, 80 + r2() * 40, 140 + r2() * 120, { wall: '#0a0b22', lit: () => 0, door: false }); return c; })();
        return { sky, g, reader, glow, roofs };
      });
      const cm = cam(t);
      drawL(ctx, L.sky, cm, .1); twinkle(ctx, t, cm, { seed: 21, n: 70, p: .1 });
      drawL(ctx, L.g, cm, 1);
      ctx.save(); camT(ctx, cm, 1);
      ctx.save(); ctx.beginPath(); ctx.rect(WIN09[0] - WW / 2, WIN09[1] - 40, WW, WH); ctx.clip();
      drawFig(ctx, L.reader, WIN09[0] - 30, WIN09[1] + 170, t, { ph: 4, sway: .3 });
      // the open book on the desk, a page turning
      { const bx = WIN09[0] + 14, by = WIN09[1] + 108; ctx.fillStyle = '#f6e6c4'; ctx.beginPath(); ctx.moveTo(bx - 22, by); ctx.lineTo(bx, by + 3); ctx.lineTo(bx + 22, by); ctx.lineTo(bx + 22, by + 4); ctx.lineTo(bx - 22, by + 4); ctx.fill(); const pg = (t * .35) % 1; ctx.beginPath(); ctx.moveTo(bx, by + 3); ctx.lineTo(bx + 22 * Math.cos(pg * Math.PI), by - 10 * Math.sin(pg * Math.PI)); ctx.lineTo(bx + 22 * Math.cos(pg * Math.PI), by - 10 * Math.sin(pg * Math.PI) + 3); ctx.closePath(); ctx.fill(); }
      ctx.restore();
      ctx.restore();
      drawL(ctx, L.glow, cm, 1, { op: 'lighter', a: .8 + .25 * Math.sin(Math.PI * lin(tFew - .3, tFew + .9, t)) });
      drawL(ctx, L.roofs, cm, 1.15);
      vig(ctx, .55);
    },
  };
}

// ================================================================== 7.10 "For the first time, it could belong to everyone." (the window multiplies across a whole night city)
export function shot10(T, t0) {
  const tE = T.S('07a', 'everyone'), tF = T.S('07a', 'For the first');
  const ROWS = [[560, .24, .3], [610, .32, .4], [675, .42, .52], [760, .56, .66], [870, .74, .82], [1010, .98, 1]];
  const build = () => {
    const sky = skyLayer({ stops: [[0, '#03041a'], [.5, '#10144a'], [.72, '#2a2a6a'], [1, '#1a1a48']], stars: 1, seed: 37 });
    const rows = [], wins = [];
    ROWS.forEach(([base, sc, p], k) => {
      const [c, x] = wl(); const r = prng(41 + k); let xx = -PX - 60;
      const wall = mixHex('#2a2c66', '#0a0b26', k / 5);
      while (xx < W + PX + 60) { const w = (90 + r() * 120) * sc, h = (200 + r() * 300) * sc;
        const res = house(x, r, xx + w / 2, base + r() * 16 * sc, w, h, { wall, side: (xx + w / 2 < 960 ? .18 : -.18), lit: () => 0, floorH: 32 * sc, colW: 26 * sc, wscale: sc, door: false });
        for (const wn of res.win) if (!wn.door) wins.push({ x: wn.x, y: wn.y, w: wn.w, h: wn.h, k, p, r: r(), r2: r() });
        xx += w + r() * 12 * sc; }
      rows.push({ c, p, fog: k < 5 ? fogLayer({ y0: base - 90 * sc, y1: base + 30, col: '#5a5aa8', a: .5 - k * .06, seed: 44 + k, cover: .65, k: .3 }) : null });
    });
    // the source: the window closest to the centre on row 3
    let src = null, best = 1e9; for (const wn of wins) if (wn.k === 3) { const d = Math.hypot(wn.x - 960, wn.y - 560); if (d < best) { best = d; src = wn; } }
    const up = figSprite(.5, { head: -.55, sh: [.1, -.1], el: [.3, .3] }, { dress: { coat: '#e59a3a', pants: '#14141e', skin: '#e9c3a0' }, rim: '#ffd59a' });
    const lv = figSprite(.5, { head: .1, sh: [.1, -.1], el: [.3, .3] }, { dress: { coat: '#e59a3a', pants: '#14141e', skin: '#e9c3a0' }, rim: '#ffd59a' });
    const r = prng(45), watchers = wins.filter((wn) => wn.k >= 4 && wn.w > 18 && r() < .3);
    const haze = lightLayer(960, 760, 1100, { col: '#ffb35c', core: '#ffd59a', a: .35, sy: .45, seed: 46 });
    return { sky, rows, wins, src, up, lv, watchers, haze };
  };
  const cam = (t) => { const u = lin(t0 - .5, tE + 1, t); return { x: drift(t, 5, 8) + mix(0, 50, u), y: mix(-20, -50, sine(u)), z: mix(1.15, 1, sine(u)) }; };
  const C0 = cache('s07-city', 'w', t0, build);
  const srcScreen = proj(cam(t0), C0.src.p, C0.src.x, C0.src.y + C0.src.h / 2);
  return {
    t: t0, tr: 'out', d: 1.0, depth: 6, x: srcScreen[0], y: srcScreen[1],
    draw(ctx, t) {
      const L = cache('s07-city', 'w', t, build), cm = cam(t), S = L.src;
      const amt = sm(lin(tF, tE + .6, t));
      drawL(ctx, L.sky, cm, .06); twinkle(ctx, t, cm, { seed: 23, n: 90, p: .06, y1: 480 });
      drawL(ctx, L.haze, cm, .5, { op: 'lighter', a: amt });
      const lit = (wn) => { if (wn === S) return 1; if (wn.r2 > (wn.k > 3 ? .42 : .55)) return 0; const d = Math.hypot(wn.x - S.x, (wn.y - S.y) * 1.6) / (ROWS[wn.k][1] * .7 + .3); return sm(lin(tF + .1 + d * .0017 + wn.r * .2, tF + .5 + d * .0017 + wn.r * .2, t)); };
      for (const [i, R] of L.rows.entries()) {
        drawL(ctx, R.c, cm, R.p);
        ctx.save(); camT(ctx, cm, R.p);
        for (const wn of L.wins) { if (wn.k !== i) continue; const a = lit(wn); if (a <= 0) continue; ctx.fillStyle = mixHex('#5a2a12', wn.r < .3 ? '#fff1cf' : '#ffb35c', a); ctx.fillRect(wn.x - wn.w / 2, wn.y, wn.w, wn.h);
          if (wn.w > 7) { ctx.fillStyle = rgba('#3a1a0c', .8); ctx.fillRect(wn.x - .7, wn.y, 1.4, wn.h); ctx.fillRect(wn.x - wn.w / 2, wn.y + wn.h * .42, wn.w, 1.4); }
          if (wn.w > 8) { ctx.globalAlpha = .16 * a; ctx.fillStyle = '#ffb35c'; ctx.fillRect(wn.x - wn.w * 1.3, wn.y - wn.h * .4, wn.w * 2.6, wn.h * 1.8); ctx.globalAlpha = 1; } }
        if (i >= 4) for (const wn of L.watchers) { if (wn.k !== i) continue; const a = lit(wn); if (a < .5) continue; const upq = sm(lin(tE - .5 + wn.r * .5, tE + .1 + wn.r * .5, t)); ctx.save(); ctx.beginPath(); ctx.rect(wn.x - wn.w / 2, wn.y, wn.w, wn.h); ctx.clip();
          const k = wn.w / 26, fx = wn.x + (wn.r - .5) * wn.w * .3, fy = wn.y + wn.h + 70 * k;
          ctx.globalAlpha = 1 - upq; drawFig(ctx, L.lv, fx, fy, t, { k, ph: wn.r * 9, flipX: wn.r < .5 }); ctx.globalAlpha = upq; drawFig(ctx, L.up, fx, fy, t, { k, ph: wn.r * 9, flipX: wn.r < .5 }); ctx.restore(); }
        ctx.restore();
        if (R.fog) drawL(ctx, R.fog, cm, R.p, { a: .9 });
      }
      vig(ctx, .5);
    },
  };
}

// ================================================================== 7.11 "To a cook in Lagos."
export function shot11(T, t0) {
  const tL = T.S('07a', 'Lagos'), t1 = T.S('07a', 'To a farmer');
  return {
    t: t0, tr: 'right', d: .55,
    draw(ctx, t) {
      const L = cache('s07-lagos', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#0a0a26'], [.5, '#2a1f4a'], [.75, '#6a3a4a'], [1, '#3a2030']], glowAt: [800, 900], glowCol: '#ff9a50', glowA: .3, glowR: 900, stars: .6, seed: 47 });
        const [f, fx] = wl(); const r = prng(48); let xx = -PX;
        while (xx < W + PX) { const w = 30 + r() * 70, h = 30 + r() * 90 * (r() < .1 ? 3 : 1); roughRect(fx, xx, 690 - h, w, h + 60, '#1e1636', { amp: .5, seed: xx | 0 }); for (let k = 0; k < w * h / 160; k++) { fx.fillStyle = r() < .7 ? rgba('#ffb35c', .5 + .5 * r()) : rgba('#fff1cf', .7); fx.fillRect(xx + 3 + r() * (w - 6), 690 - h + 4 + r() * (h - 4), 2, 2); } xx += w + r() * 6; }
        fx.fillStyle = '#120c22'; fx.fillRect(-PX, 730, LW, 40); const lg = fx.createLinearGradient(0, 750, 0, 820); lg.addColorStop(0, rgba('#ffb35c', .3)); lg.addColorStop(1, rgba('#ffb35c', 0)); fx.fillStyle = lg; fx.fillRect(-PX, 750, LW, 70);
        const haze = fogLayer({ y0: 560, y1: 760, col: '#c87a5a', a: .3, seed: 49, cover: .6 });
        const [g, x] = wl();
        roughPoly(x, [[-PX, 860], [W + PX, 840], [W + PX, H + PY], [-PX, H + PY]], '#3a2a30', { amp: 1.5, seed: 50 });
        hatch(x, [-PX, 840, LW, 500], { angle: -.04, gap: 6, col: '#000', a: .3, seed: 51 });
        roughRect(x, -PX, 815, LW, 32, '#4a3438', { amp: 1, seed: 52 }); hatch(x, [-PX, 815, LW, 32], { angle: 1.4, gap: 5, col: '#000', a: .3, seed: 57 });
        // stair house with the open kitchen door (warm), a corrugated roof
        roughRect(x, 1360, 330, 300, 520, '#2a1e26', { amp: 1.2, seed: 53 }); roughPoly(x, [[1330, 340], [1690, 300], [1700, 330], [1340, 360]], '#4a3a3a', { amp: 1, seed: 58 });
        const dg = x.createRadialGradient(1500, 700, 0, 1500, 700, 300); dg.addColorStop(0, '#fff1cf'); dg.addColorStop(1, '#c86a2a'); x.fillStyle = dg; x.fillRect(1430, 520, 130, 330);
        roughRect(x, 1424, 516, 6, 336, '#1a1218', { amp: .3, seed: 59 });
        // water tank on stilts
        roughRect(x, 160, 360, 230, 170, '#2e222a', { amp: 1, seed: 55 }); hatch(x, [160, 360, 230, 170], { angle: 1.57, gap: 9, col: '#000', a: .3, seed: 61 }); for (const lx of [180, 360]) roughRect(x, lx, 530, 12, 300, '#1a1218', { amp: .5, seed: lx });
        // laundry line with hanging cloths
        x.strokeStyle = '#1a1218'; x.lineWidth = 2; x.beginPath(); x.moveTo(400, 560); x.quadraticCurveTo(860, 640, 1360, 560); x.stroke();
        for (let i = 0; i < 6; i++) { const lx = 470 + i * 140, ly = 560 + Math.sin((lx - 400) / 960 * Math.PI) * 38, cw = 80 + (i % 3) * 22, ch = 110 + (i % 2) * 40, col = ['#c4482a', '#e59a3a', '#2a5a7a', '#e8d6a0', '#7a3a6a', '#d06a30'][i];
          roughPoly(x, [[lx, ly], [lx + cw, ly + 4], [lx + cw - 3, ly + ch], [lx + cw * .7, ly + ch - 8], [lx + cw * .4, ly + ch + 4], [lx + 4, ly + ch - 4]], col, { amp: 1.5, seed: 70 + i });
          x.save(); x.globalAlpha = .35; for (let k = 1; k < 4; k++) { x.strokeStyle = shade(col, -.2); x.lineWidth = 2; x.beginPath(); x.moveTo(lx + cw * k / 4, ly + 4); x.lineTo(lx + cw * k / 4 + 3, ly + ch - 6); x.stroke(); } x.restore();
          x.fillStyle = '#1a1218'; x.fillRect(lx + 6, ly - 4, 5, 10); x.fillRect(lx + cw - 12, ly - 2, 5, 10); }
        stip(g, { k: .3, seed: 9 });
        const spill = lightLayer(1500, 900, 600, { col: '#ffb35c', core: '#fff1cf', a: .5, sy: .35, seed: 10 });
        const cook = figSprite(2.0, { lean: -.06, head: -.55, sh: [.95, .7], el: [1.0, 1.1], hip: [.04, -.05], kn: [0, .05], hair: 'bun', skirt: true }, { dress: { coat: '#e2702a', pants: '#3a1a10', skin: '#6a3e26', hair: '#120a08', skirt: '#c4482a' }, light: { x: 500, y: -40, col: '#fff1cf', a: .65 }, rim: '#ffd59a', rimW: 2.6, flip: true,
          prop: (gg, a0, a1) => { const bx = (a0.hx + a1.hx) / 2, by = (a0.hy + a1.hy) / 2 - 4; gg.fillStyle = '#e8e0d0'; gg.beginPath(); gg.ellipse(bx, by, 15, 7, 0, 0, Math.PI); gg.fill(); gg.fillStyle = '#f0a040'; gg.beginPath(); gg.ellipse(bx, by, 14, 3, 0, 0, 7); gg.fill(); } });
        return { sky, f, haze, g, spill, cook };
      });
      const land = 1 - eout(lin(t0 - .3, t0 + .5, t)), cm = { x: -260 * land + (t - t0) * 12 + drift(t, 4, 3), y: 0, z: 1.03 };
      drawL(ctx, L.sky, cm, .05); drawL(ctx, L.f, cm, .3); drawL(ctx, L.haze, cm, .35, { a: .8 });
      drawL(ctx, L.g, cm, 1); drawL(ctx, L.spill, cm, 1, { op: 'lighter', a: .9 });
      ctx.save(); camT(ctx, cm, 1);
      const cx = 1230 - 70 * eout(lin(t0 - .2, t0 + 1.0, t));
      groundShadow(ctx, cx, 990, 140, .5);
      drawFig(ctx, L.cook, cx, 990, t, { ph: 5 });
      { const bx = cx - 48, by = 990 - 88 * 2 - 40; ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 16; i++) { const ph = ((t - t0) * .5 + i / 16) % 1, x = bx + Math.sin(ph * 6 + i) * 22 * ph, y = by - ph * 300; const g = ctx.createRadialGradient(x, y, 0, x, y, 24 + 46 * ph); g.addColorStop(0, rgba('#f6e6d0', .24 * (1 - ph))); g.addColorStop(1, rgba('#f6e6d0', 0)); ctx.fillStyle = g; ctx.fillRect(x - 80, y - 80, 160, 160); } ctx.restore(); }
      ctx.restore();
      placeLabel(ctx, t, tL - .1, 140, 150, 'Lagos', 'NIGERIA', { a1: t1 + .3 });
      vig(ctx, .5, '#0a0408');
    },
  };
}

// ================================================================== 7.12 "To a farmer in Peru." (terraces on a mountain spur at blue dawn)
export function shot12(T, t0) {
  const tP = T.S('07a', 'Peru'), t1 = T.S('07a', 'To you');
  return {
    t: t0, tr: 'fog', d: .7,
    draw(ctx, t) {
      const L = cache('s07-peru', 'w', t, () => {
        const sky = skyLayer({ stops: [[0, '#0e1a3a'], [.4, '#2a4a7a'], [.62, '#7a9cc0'], [.72, '#e6c4a6'], [1, '#6a7a8a']], glowAt: [1520, 600], glowCol: '#ffe0b8', glowA: .45, glowR: 900, stars: .35, seed: 53 });
        const mnt = ridgeLayer((x) => 560 - 250 * Math.exp(-Math.pow((x - 520) / 300, 2)) - 170 * Math.exp(-Math.pow((x - 1560) / 240, 2)) + (fbm(vnoise(53), x * .006, 1, 4) - .5) * 70, { col: '#34466a', hc: '#c8d8ec', ha: .16, seed: 53, light: { x: 1520, y: 560, col: '#ffe0b8', a: .35 }, rim: '#ffe6cc', rimA: .6, hatchN: 14, gap: 4 });
        const mist = fogLayer({ y0: 520, y1: 720, col: '#d8e2ee', a: .55, seed: 54, cover: .7, soft: .5 });
        // terraces: nested arcs of a spur that points at us (∩), green-gold steps with dark stone risers
        const [g, x] = wl(); const r = prng(55);
        for (let k = 0; k < 16; k++) { const q = k / 15, y0 = mix(600, 1180, Math.pow(q, 1.25)), bend = mix(60, 420, q), off = Math.sin(k * 1.1) * 30 + 140;
          const top = (xx) => y0 + bend * Math.pow(Math.abs(xx - 960 - off) / 1300, 1.6);
          const pts = [[-PX, H + PY + 200]]; for (let xx = -PX; xx <= W + PX; xx += 10) pts.push([xx, top(xx)]); pts.push([W + PX, H + PY + 200]);
          const lit = mixHex('#5f7a3a', '#c8b860', r() * .5 + (1 - q) * .3);
          roughPoly(x, pts, lit, { amp: 1, seed: 60 + k });
          x.save(); x.beginPath(); roughPath(x, pts, { amp: 1, seed: 60 + k }); x.clip();
          { const sg = x.createLinearGradient(-PX, 0, W + PX, 0); sg.addColorStop(0, rgba('#0a1424', .45)); sg.addColorStop(.6, rgba('#0a1424', 0)); sg.addColorStop(1, rgba('#ffe0b8', .18)); x.fillStyle = sg; x.fillRect(-PX, -PY, LW, LH * 2); }
          hatch(x, [-PX, top(960 + off) - 20, LW, 140 * (q + .3)], { angle: .02, gap: 3 + q * 4, col: '#f0e6b0', a: .2, seed: k });
          for (let i = 0; i < 60 * (q + .2); i++) { const xx = -PX + r() * LW, yy = top(xx) + 8 + r() * 20 * (q + .3); x.fillStyle = rgba('#2a3a1c', .5); x.beginPath(); x.arc(xx, yy, 1.5 + q * 3, 0, 7); x.fill(); }
          x.restore();
          // the stone riser just below this terrace's edge
          const riser = []; for (let xx = -PX; xx <= W + PX; xx += 10) riser.push([xx, top(xx)]); for (let xx = W + PX; xx >= -PX; xx -= 10) riser.push([xx, top(xx) + 6 + q * 26]);
          roughPoly(x, riser, mixHex('#3a3a40', '#5a5650', r() * .4), { amp: .8, seed: 80 + k });
          x.save(); x.beginPath(); roughPath(x, riser, { amp: .8, seed: 80 + k }); x.clip(); hatch(x, [-PX, top(960 + off) - 10, LW, 200], { angle: 1.45, gap: 4 + q * 5, col: '#14141a', a: .4, seed: k + 3 }); x.restore();
        }
        stip(g, { k: .25, seed: 11 });
        const farmer = figSprite(1.8, { lean: -.05, head: -.5, hip: [.06, -.08], kn: [0, .05], sh: [.55, .35], el: [.9, 1.0], hair: 'cap', bulk: 1.05 }, { dress: { coat: '#c4482a', pants: '#2a2a3a', skin: '#a87050', hair: '#1a1210', hairBack: '#1a1210' }, light: { x: 800, y: -100, col: '#ffe0b8', a: .6 }, rim: '#ffe8c8', rimW: 2.4,
          prop: (gg, a0) => { gg.strokeStyle = '#4a3020'; gg.lineWidth = 4; gg.beginPath(); gg.moveTo(a0.hx + 4, a0.hy - 30); gg.lineTo(a0.hx + 8, a0.hy + 96); gg.stroke(); gg.fillStyle = '#6a6a70'; gg.beginPath(); gg.moveTo(a0.hx + 2, a0.hy + 92); gg.lineTo(a0.hx + 26, a0.hy + 98); gg.lineTo(a0.hx + 6, a0.hy + 104); gg.closePath(); gg.fill(); } });
        return { sky, mnt, mist, g, farmer };
      });
      const u = lin(t0 - .4, t1 + .4, t), cm = { x: drift(t, 5, 9) + mix(50, -40, u), y: mix(-20, 10, u), z: 1.04 };
      drawL(ctx, L.sky, cm, .05); drawL(ctx, L.mnt, cm, .2); drawL(ctx, L.mist, cm, .3, { a: .9 });
      drawL(ctx, L.g, cm, 1);
      ctx.save(); camT(ctx, cm, 1); groundShadow(ctx, 1120, 880, 120, .45); drawFig(ctx, L.farmer, 1120, 880, t, { ph: 6 }); ctx.restore();
      placeLabel(ctx, t, tP - .1, 140, 150, 'Peru', 'ANDES', { a1: t1 + .3 });
      vig(ctx, .4, '#0a1018');
    },
  };
}

// ================================================================== 7.13 "To you." (back on the night meadow; dandelion clocks in the foreground)
export const DANDE = [1560, 600];
export function shot13(T, t0, tEnd) {
  const cam = (t) => { const u = lin(t0 - .5, tEnd + .5, t); return { x: mix(0, 30, u) + drift(t, 4, 2), y: mix(30, 10, u), z: mix(1.02, 1.1, sine(u)) }; };
  const YOU = [1000, 960];
  return {
    t: t0, tr: 'left', d: .55,
    seed: (t) => proj(cam(t), 1.3, DANDE[0], DANDE[1]),
    draw(ctx, t) {
      const L = cache('s07-meadow', 'world', t, meadowWorld);
      const Y = cache('s07-meadow', 'you', t, () => figSprite(1.55, { lean: -.03, head: -.42, hip: [.03, -.05], kn: [0, .04], sh: [.2, -.15], el: [.45, .5], hood: true, coat: 1 }, { dress: { coat: '#e59a3a', pants: '#14141e', shoes: '#0b0a12', skin: '#e9c3a0', hair: '#2a1a14' }, flip: true, light: { x: 500, y: -500, col: '#e8e4ff', a: .5 }, rim: '#f3efe2', rimSide: 1, rimW: 2.2 }));
      const land = 1 - eout(lin(t0 - .3, t0 + .55, t)), c0 = cam(t), cm = { ...c0, x: c0.x + 280 * land };
      meadowBack(ctx, t, cm, L, t0);
      drawL(ctx, L.mid, cm, .45); drawL(ctx, L.pool, cm, .45, { op: 'lighter', a: .8 });
      ctx.save(); camT(ctx, cm, .8); groundShadow(ctx, YOU[0], YOU[1], 90, .55); drawFig(ctx, Y, YOU[0], YOU[1], t, { ph: 7 }); ctx.restore();
      drawL(ctx, L.near, cm, 1.15);
      ctx.save(); camT(ctx, cm, 1.3); dandelions(ctx, t, 1); ctx.restore();
      vig(ctx, .5);
    },
  };
}
// a clump of dandelion clocks, cream seed heads catching the moon. pluck = share of seeds already gone from head 0
export function dandelions(ctx, t, k = 1, { only = -1, pluck = 0 } = {}) {
  const heads = [[DANDE[0], DANDE[1], 1], [DANDE[0] + 110, DANDE[1] + 90, .8], [DANDE[0] - 90, DANDE[1] + 130, .7]];
  heads.forEach(([x, y, s], i) => {
    if (only >= 0 && i !== only) return;
    const sw = k * (Math.sin(t * 1.3 + i) * .04 + Math.sin(t * 2.7 + i * 2) * .015);
    ctx.save(); ctx.translate(x, y + 560 * s); ctx.rotate(sw);
    ctx.strokeStyle = '#1a1c48'; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-14 * s, -280 * s, 0, -560 * s); ctx.stroke();
    ctx.strokeStyle = rgba('#d8d2ff', .4); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(2 * s, -100 * s); ctx.quadraticCurveTo(-12 * s, -300 * s, 2 * s, -560 * s); ctx.stroke();
    ctx.translate(0, -560 * s);
    const r = prng(90 + i), R = 62 * s;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.6); g.addColorStop(0, rgba('#e8e4ff', .25)); g.addColorStop(1, rgba('#e8e4ff', 0)); ctx.fillStyle = g; ctx.fillRect(-R * 1.7, -R * 1.7, R * 3.4, R * 3.4); ctx.restore();
    for (let j = 0; j < 150; j++) { const a = r() * 6.283, b = Math.acos(2 * r() - 1), dx = Math.sin(b) * Math.cos(a), dy = Math.cos(b), lit = .5 + .5 * (dx * .6 - dy * .5); if (i === 0 && pluck > 0 && j / 150 < pluck) continue;
      ctx.strokeStyle = rgba('#f3efe2', (.15 + .35 * r()) * (.5 + lit)); ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(dx * R, dy * R); ctx.stroke(); ctx.fillStyle = rgba('#fbf8ee', (.35 + .5 * r()) * (.4 + .8 * lit)); ctx.beginPath(); ctx.arc(dx * R, dy * R, 2.6 * s, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#2a2c5a'; ctx.beginPath(); ctx.arc(0, 0, 9 * s, 0, 7); ctx.fill();
    ctx.restore();
  });
}
