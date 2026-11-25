// Film 74 · c09 GIVEN BACK (9.01–P.18): young forest where the cornfields ran, the field map drawing together round the town, the clean river,
// a wolf on the hill, the path back into your street at dusk and the empty box YOU, the full square (the motorbike man sands a chair,
// a grandmother folds dumplings), the fear of 2026 on paper, the price tags falling to zero but one: SOMEBODY'S TIME, a meal, a crooked chair,
// someone who shows up, and the question mark the machines handed back.
import * as K from '../lib/f74_kit.mjs';
import * as S from '../lib/f74_street.mjs';
import * as PL from '../lib/f74_places.mjs';
import { hourAt } from './hud.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const backOut = (x) => { const c = 1.7, y = x - 1; return 1 + (c + 1) * y * y * y + c * y * y; };
// ---------------------------------------------------------------- props
function wolf(g, x, y, s, howl, col) {   // a wolf in profile facing left; howl 0..1 lifts the head
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col;
  g.beginPath(); g.ellipse(0, -70, 78, 30, -.04, 0, 7); g.fill();                         // body
  for (const [lx, a] of [[-52, .08], [-34, -.06], [42, .1], [58, -.05]]) { g.save(); g.translate(lx, -60); g.rotate(a); g.fillRect(-6, 0, 12, 62); g.restore(); }   // legs
  g.beginPath(); g.moveTo(72, -82); g.quadraticCurveTo(120, -70, 132, -30); g.quadraticCurveTo(110, -52, 70, -62); g.fill();   // tail, down
  g.save(); g.translate(-64, -88); g.rotate(-.35 - howl * .75);                         // neck and head
  g.beginPath(); g.moveTo(14, 26); g.lineTo(-4, -26); g.lineTo(-30, -36); g.lineTo(-74, -30); g.lineTo(-74, -20); g.lineTo(-30, -6); g.lineTo(-10, 30); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-14, -34); g.lineTo(-6, -58); g.lineTo(4, -30); g.fill(); g.restore();
  g.restore();
}
function table(g, t, x, y, w, L, o = {}) {   // a square table seen from the front: the cloth hides the legs of whoever sits behind it
  g.fillStyle = mixHex('#f4efe0', L.light, .1); g.beginPath(); g.ellipse(x, y, w / 2, w * .1, 0, 0, 7); g.fill();
  g.fillStyle = lin(g, 0, y, 0, y + 100, [[0, mixHex('#ece4d0', L.light, .05)], [1, mixHex('#c9bfa8', L.shade, .25)]]); g.beginPath(); g.moveTo(x - w / 2, y); g.lineTo(x + w / 2, y); g.lineTo(x + w / 2 - 8, y + 96); g.lineTo(x - w / 2 + 8, y + 96); g.closePath(); g.fill();
  g.fillStyle = rgba(L.ink, .25); g.beginPath(); g.ellipse(x, y + 104, w * .55, 10, 0, 0, 7); g.fill();
  if (o.candle !== false) { K.halo(g, x, y - 24, 110, .35 * (.85 + .15 * Math.sin(t * 6 + x))); g.fillStyle = '#fff2c4'; g.beginPath(); g.arc(x, y - 22, 7, 0, 7); g.fill(); }
}
function chairCrooked(g, x, y, s, col, crook = 1) {   // a wooden chair; its back leans, one slat askew (a person's mistakes in it)
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = col; g.lineCap = 'round';
  g.fillRect(-60, -110, 120, 14); g.fillRect(-56, -96, 12, 96); g.fillRect(44, -96, 12, 96);
  g.save(); g.translate(-50, -110); g.rotate(-.08 * crook); g.fillRect(-6, -150, 12, 150); g.restore(); g.save(); g.translate(50, -110); g.rotate(-.02 * crook); g.fillRect(-6, -146, 12, 146); g.restore();
  g.lineWidth = 12; g.beginPath(); g.moveTo(-58, -236 + 6 * crook); g.lineTo(52, -250); g.stroke(); g.beginPath(); g.moveTo(-54, -186); g.lineTo(54, -196 + 14 * crook); g.stroke();
  g.restore();
}
function dumpling(g, x, y, s, u) { if (u <= 0) return; g.save(); g.translate(x, y); g.scale(s * K.expoOut(u), s * K.expoOut(u)); g.fillStyle = '#f6efe0'; g.beginPath(); g.moveTo(-22, 6); g.quadraticCurveTo(0, -26, 22, 6); g.closePath(); g.fill(); g.strokeStyle = rgba('#b8a888', .8); g.lineWidth = 2; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 6, -10 + Math.abs(k) * 3); g.lineTo(k * 6 + 2, -4 + Math.abs(k) * 3); g.stroke(); } g.restore(); }
// a price tag on a string: label, a gauge (how dear) instead of an amount; o.gold for the one that stays
function tag(g, t, x, y, label, gauge, o = {}) {
  const sw = Math.sin(t * 1.3 + x * .01) * .06, wd = o.w ?? 230;
  g.save(); g.translate(x, y); g.rotate(sw + (o.rot ?? 0)); g.globalAlpha *= o.a ?? 1;
  g.strokeStyle = rgba('#2a2440', .8); g.lineWidth = 2; g.beginPath(); g.moveTo(0, -(o.str ?? 80)); g.lineTo(0, 0); g.stroke();
  g.fillStyle = o.gold ? lin(g, -wd / 2, 0, wd / 2, 0, [[0, K.GOLD.core], [1, K.GOLD.body]]) : K.PAPER.lit; g.beginPath(); g.moveTo(-wd / 2 + 30, 0); g.lineTo(wd / 2, 0); g.lineTo(wd / 2, 110); g.lineTo(-wd / 2, 110); g.lineTo(-wd / 2, 30); g.closePath(); g.fill();
  g.strokeStyle = rgba(K.PAPER.edge, .9); g.stroke(); g.fillStyle = '#2a2440'; g.beginPath(); g.arc(-wd / 2 + 26, 24, 6, 0, 7); g.fill();
  g.fillStyle = K.PAPER.ink; g.font = '800 26px Inter'; g.textAlign = 'center'; g.letterSpacing = '0.06em'; g.fillText(label, 10, 56); g.letterSpacing = '0em';
  g.fillStyle = rgba(K.PAPER.ink2, .3); g.fillRect(-wd / 2 + 24, 76, wd - 48, 14); g.fillStyle = o.gold ? '#8a4a18' : K.PAPER.red; g.fillRect(-wd / 2 + 24, 76, (wd - 48) * clamp(gauge), 14);
  if (o.gold) K.halo(g, 0, 55, wd, .25);
  g.restore();
}
// the empty box YOU of station 3 (screen space)
function youBox(g, t, x, y, u, q) {
  if (u <= 0) return; g.save(); g.translate(x, y + 8 * Math.sin(t * .9)); g.scale(K.expoOut(u), K.expoOut(u));
  g.strokeStyle = rgba('#e8eefc', .95); g.lineWidth = 5; g.beginPath(); g.roundRect(-80, -80, 160, 160, 14); g.stroke(); g.fillStyle = rgba('#0b1440', .25); g.fill();
  if (q > 0) K.glowText(g, '?', 0, 40, { size: 120, serif: true, align: 'center', col: '#ffe7a8', a: q });
  K.glowText(g, 'YOU', 0, 130, { size: 32, weight: 700, align: 'center', col: P.cream, glow: false, spacing: .14 });
  g.restore();
}
export default function c09(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 9.01–9.02 · YOUNG FOREST to the horizon · the map of 2026: fields draw together round the town, the rest turns to forest
  const camF = (t) => camK(t, [[RT('9.01') - 1, cam3({ z: -500, y: -260 })], [RT('9.03') + .6, cam3({ z: -120, y: -300, x: 120 })]], .7);
  const MAP = { cols: 14, rows: 8 };
  const S901 = {
    id: '9.01',
    draw(ctx, t, s) {
      const L = look(R, t), c = camF(t), t2 = s.r('9.02');
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 4, seed: 191 })],
        [14000, () => { K.hills(ctx, 560, 30, null, 23, { grad: [K.hz(L.leafS, 14000, L), K.hz(L.leaf, 12000, L)] }); const r = prng(3); ctx.fillStyle = K.hz(mixHex(L.leaf, L.leafS, .4), 13000, L); for (let k = 0; k < 120; k++) { const x = -1400 + r() * 4700, y = 560 + r() * 30; ctx.beginPath(); ctx.arc(x, y, 16 + r() * 10, 0, 7); ctx.fill(); } }],
        [7000, () => { K.band(ctx, 600, 1400, K.hz(L.leafS, 7000, L), K.hz(L.leafS, 6000, L)); const r = prng(4); for (let k = 0; k < 90; k++) { const x = -1600 + r() * 5100, y = 610 + r() * 70; ctx.fillStyle = K.hz(mixHex(L.leaf, L.light, r() * .2), 7000, L); ctx.beginPath(); ctx.ellipse(x, y, 30 + r() * 20, 36 + r() * 16, 0, 0, 7); ctx.fill(); }
          ctx.strokeStyle = K.hz(mixHex('#8fc0e0', L.light, .3), 7000, L); ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-1600, 700); ctx.bezierCurveTo(200, 640, 900, 720, 3400, 650); ctx.stroke(); }],
        [3200, () => { const r = prng(6); for (let k = 0; k < 26; k++) K.tree(ctx, t, -900 + k * 150 + r() * 60, 820 + r() * 50, .55 + r() * .2, L, { leaf: K.hz(mixHex(L.leaf, L.light, r() * .15), 3200, L), wind: .5 }); }],
        [1150, () => { K.tree(ctx, t, -60, 1300, 2.4, L, { wind: .4 }); K.tree(ctx, t, 2080, 1320, 2.2, L, { wind: .4 }); }],
      ]);
      // the map card: the field grid of 2026 (cornfields to the horizon); on 9.02 the fields draw together round the town, the rest turns to forest
      const mu = clamp(span(t, s.a + .6, s.a + 1.4) - span(t, s.b - .6, s.b - .1));
      if (mu > 0) K.scr(ctx, (g) => K.paper(g, t, 340, 180, 1240, 690, mu, { head: t < t2 ? '2026 · FIELDS TO THE HORIZON' : '2050 · FOOD CLOSE TO TOWN, THE REST GIVEN BACK', from: [960, 700], draw: (q, x, y, w, h) => {
        const cw = w / MAP.cols, ch = h / MAP.rows, tx = x + w * .5, ty = y + h * .55, p = span(t, t2 + .2, t2 + 3.6), r = prng(11);
        const cells = []; for (let i = 0; i < MAP.cols; i++) for (let j = 0; j < MAP.rows; j++) { const cx = x + (i + .5) * cw, cy = y + (j + .5) * ch; cells.push([cx, cy, Math.hypot((cx - tx) / w, (cy - ty) / h)]); }
        const order = [...cells].sort((a, b) => a[2] - b[2]), keep = new Set(order.slice(0, 14));
        for (const cell of cells) { const [cx, cy, d] = cell, f = keep.has(cell) ? 0 : span(p, d * .9, d * .9 + .35), rr = r();
          q.fillStyle = mixHex(mixHex('#e8c870', '#d9b45a', rr), '#5f8f4a', f); q.fillRect(cx - cw / 2 + 3, cy - ch / 2 + 3, cw - 6, ch - 6);
          if (f < .6) { q.strokeStyle = rgba('#a88a3a', .5 * (1 - f)); q.lineWidth = 1.5; for (let k = 1; k < 4; k++) { q.beginPath(); q.moveTo(cx - cw / 2 + 6, cy - ch / 2 + k * ch / 4); q.lineTo(cx + cw / 2 - 6, cy - ch / 2 + k * ch / 4); q.stroke(); } }
          if (f > 0) { q.fillStyle = rgba('#2f5c4a', f); for (let k = 0; k < 5; k++) { q.beginPath(); q.arc(cx - cw * .3 + r() * cw * .6, cy - ch * .3 + r() * ch * .6, 5 + r() * 5, 0, 7); q.fill(); } } }
        K.ink(q, '#3a7ab8', 7); q.beginPath(); q.moveTo(x, y + h * .2); q.bezierCurveTo(x + w * .3, y + h * .1, x + w * .4, y + h * .9, x + w, y + h * .75); q.stroke();   // the river
        q.fillStyle = '#c8473a'; for (let k = 0; k < 9; k++) q.fillRect(tx - 40 + (k % 3) * 28, ty - 40 + Math.floor(k / 3) * 28, 20, 20);   // the town
        q.font = '700 22px Inter'; q.fillStyle = K.PAPER.ink; q.textAlign = 'center'; q.fillText('TOWN', tx, ty + 70); q.textAlign = 'left';
      } }));
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 9.03 · the river in evening light, clean enough to swim in
  const S903 = {
    id: '9.03',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -420, y: -60, x: -80 })], [s.b + .6, cam3({ z: -180, y: -40, x: 80 })]], .6);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 600, clouds: 5, seed: 203 })],
        [9000, () => { K.hills(ctx, 600, 40, null, 31, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)] }); const r = prng(9); for (let k = 0; k < 30; k++) K.tree(ctx, t, -1200 + k * 160 + r() * 40, 640, .5 + r() * .2, L, { leaf: K.hz(L.leaf, 8000, L) }); }],
        [4200, () => {
          ctx.fillStyle = lin(ctx, 0, 650, 0, 1200, [[0, mixHex(L.low, '#7ab0d8', .35)], [.4, mixHex('#3a7ab8', L.light, .25)], [1, mixHex('#1e4a88', L.shade, .3)]]); ctx.fillRect(-1600, 650, W + 3200, 900);
          const [sx] = L.sun; ctx.fillStyle = rgba(L.sunCol, .45); for (let k = 0; k < 14; k++) { const y = 670 + k * 26, w = 160 - k * 8 + 40 * Math.sin(t * 1.5 + k); ctx.fillRect(sx - w / 2 + Math.sin(t + k) * 14, y, w, 4); }
          ctx.fillStyle = mixHex('#86a85a', L.light, .2); ctx.beginPath(); ctx.moveTo(-1600, 640); ctx.quadraticCurveTo(900, 670, 3500, 640); ctx.lineTo(3500, 660); ctx.quadraticCurveTo(900, 690, -1600, 664); ctx.fill();
        }],
        [2400, () => {
          // swimmers: heads and arms in the water, rings spreading
          for (const [x, y, i] of [[640, 860, 0], [860, 900, 1], [1180, 840, 2], [1420, 920, 3]]) { const ph = t * 1.1 + i * 1.7;
            for (let k = 0; k < 3; k++) { const p = ((t * .5 + k / 3 + i * .2) % 1); ctx.strokeStyle = rgba('#e8f4ff', .5 * (1 - p)); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(x, y + 10, 30 + 70 * p, 8 + 16 * p, 0, 0, 7); ctx.stroke(); }
            ctx.fillStyle = mixHex(K.pal(i).base ?? '#2a2440', '#1a1a30', .5); ctx.beginPath(); ctx.arc(x, y - 8, 20, 0, 7); ctx.fill();
            ctx.strokeStyle = ctx.fillStyle; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + 18, y + 4); ctx.quadraticCurveTo(x + 50, y - 40 - 20 * Math.sin(ph), x + 80, y + 2 + 10 * Math.sin(ph)); ctx.stroke(); }
          // the jetty and a child jumping off it
          ctx.fillStyle = mixHex('#7a5030', L.shade, .25); ctx.fillRect(1500, 780, 700, 24); for (let x = 1520; x < 2200; x += 110) ctx.fillRect(x, 800, 14, 160);
          const jp = ((t - s.a) / 2.2) % 1, jx = lerp(1620, 1440, jp), jy = 770 - Math.sin(Math.PI * jp) * 160 + jp * 120;
          if (jp < .85) K.folk(ctx, t, 6, jx, jy, 120, { pose: 'lift', dir: -1, lean: -.3 }); else { ctx.fillStyle = rgba('#ffffff', .8); for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.arc(1440 + (k - 4) * 12, 890 - Math.sin(k) * 20, 6, 0, 7); ctx.fill(); } }
          K.folk(ctx, t, 2, 1900, 780, 190, { pose: 'look', look: -.5, dir: -1 });
        }],
        [1150, () => { ctx.fillStyle = mixHex(L.leafS, '#0c1438', .3); ctx.beginPath(); ctx.ellipse(-100, 1150, 420, 160, 0, 0, 7); ctx.fill(); for (let k = 0; k < 9; k++) { ctx.fillRect(40 + k * 22, 1000 - (k % 3) * 40 + Math.sin(t + k) * 4, 6, 200); } }],
      ]);
      K.caps(ctx, 'CLEAN ENOUGH TO SWIM IN', W * .5, 200, K.cardU(t, s.a + .4, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 9.04 · some evenings, from the hill, you hear wolves: a wolf on the far hill against the sky (wow)
  const S904 = {
    id: '9.04',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -200, y: -40, x: -120 })], [s.b + .6, cam3({ z: -520, y: -80, x: 40 })]], .5);   // pull back: tiny you, the wide hill
      const howl = K.sineIO(span(t, s.w('wolves') - .3, s.w('wolves') + .7));
      K.stage(ctx, c, [
        [30000, () => { K.sky(ctx, t, L, { horizon: 640, clouds: 3, seed: 211, sunAt: [1500, 560] }); ctx.fillStyle = rgba('#fbf4e0', .9); ctx.beginPath(); ctx.arc(520, 210, 40, 0, 7); ctx.fill(); K.halo(ctx, 520, 210, 160, .3); }],
        [6000, () => {
          ctx.fillStyle = K.hz(mixHex(L.leafS, '#141c4a', .5), 6000, L); ctx.beginPath(); ctx.moveTo(-1400, 1400); ctx.lineTo(-1400, 720); ctx.quadraticCurveTo(300, 560, 760, 470); ctx.quadraticCurveTo(1200, 520, 3300, 700); ctx.lineTo(3300, 1400); ctx.fill();
          const r = prng(12); ctx.fillStyle = ctx.fillStyle; for (let k = 0; k < 40; k++) { const x = 900 + k * 60 + r() * 30, y = 520 + (x - 900) * .1; ctx.beginPath(); ctx.ellipse(x, y - 30, 16, 40 + r() * 20, 0, 0, 7); ctx.fill(); }
          wolf(ctx, 760, 474, 1.0, howl, mixHex('#1a1a38', L.shade, .3));
          if (howl > .5) { ctx.strokeStyle = rgba('#fbf4e0', .35 * (howl - .5) * 2); ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { const p = ((t * .6 + k / 3) % 1); ctx.beginPath(); ctx.arc(690, 370, 40 + p * 160, -2.4, -1.2); ctx.stroke(); } }
        }],
        [2600, () => { ctx.fillStyle = mixHex(L.grass, L.shade, .35); ctx.beginPath(); ctx.moveTo(-1400, 1400); ctx.lineTo(-1400, 920); ctx.quadraticCurveTo(600, 800, 1300, 860); ctx.quadraticCurveTo(2200, 920, 3300, 1000); ctx.lineTo(3300, 1400); ctx.fill();
          ctx.fillStyle = mixHex(L.walk, L.shade, .3); ctx.beginPath(); ctx.moveTo(900, 1400); ctx.quadraticCurveTo(1100, 1000, 1300, 860); ctx.lineTo(1340, 862); ctx.quadraticCurveTo(1200, 1000, 1100, 1400); ctx.fill();
          K.you(ctx, t, 1300, 870, 170, { pose: 'look', look: -.9, dir: -1 }); }],
        [1150, () => { ctx.fillStyle = mixHex(L.leafS, '#0c1438', .45); for (let k = 0; k < 14; k++) { const x = 1640 + k * 26, h = 160 + (k % 4) * 50; ctx.beginPath(); ctx.moveTo(x, 1200); ctx.quadraticCurveTo(x + 10 + Math.sin(t + k) * 10, 1200 - h * .6, x + 20 + Math.sin(t * .8 + k) * 16, 1200 - h); ctx.lineTo(x + 8, 1200); ctx.fill(); } }],
      ]);
      K.today(ctx, t, s.a + 1.4, s.b + .3, ['EUROPE’S WOLVES:', 'UP 58% IN TEN YEARS'], 'FORBES, AUG 2026 · OVER 21,500 WOLVES IN 2022', { size: 30 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- P.01–P.02 · the path loops back into YOUR STREET at dusk, the square at its end · the empty box YOU
  const camS = (t) => camK(t, [[RT('P.01') - 1, cam3({ z: -620, y: -30 })], [RT('P.03'), cam3({ z: -180, y: -50 })]], .7);
  const SP01 = {
    id: 'P.01',
    draw(ctx, t, s) {
      const L = look(R, t), t2 = s.r('P.02');
      S.street(ctx, t, camS(t), L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, lanterns: span(t, s.a - .5, s.a + 1.5), hl: (i) => .4 + .2 * Math.sin(t + i), you: [960 + 40 * Math.sin(t * .2), 1010, 220], youWalk: K.walkPh(t, .5), youDir: 1 });
      K.caps(ctx, 'THE SQUARE', W / 2, 520, K.cardU(t, s.a + .6, t2), { size: 26, align: 'center', col: '#ffe7a8' });
      K.scr(ctx, (g) => { const u = span(t, t2 - .2, t2 + .6); if (u > 0) { K.scrim(g, 760, 180, 400, 360, .4 * u); youBox(g, t, 960, 330, u, span(t, t2 + .5, t2 + 1.0)); } });
    },
    out: { k: 'iris', c: [960, 330, 80], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- P.03–P.06 · the square in the evening, full like every evening · the motorbike man sands a chair · a grandmother folds dumplings with children
  const CH = [430, 960], DU = [1450, 960];
  const camQ = (t) => camK(t, [[RT('P.03') - 1, cam3({ z: -600, y: -60 })], [RT('P.05') - .3, cam3({ z: -420, y: -40 })], [RT('P.05') + 1.0, aim(2000, CH[0], CH[1] - 120, 1.6), 'q'], [RT('P.06') - .1, aim(2000, CH[0] + 60, CH[1] - 120, 1.7)], [RT('P.06') + 1.0, aim(2000, DU[0], DU[1] - 120, 1.6), 'q'], [RT('P.07') + .6, aim(2000, DU[0] - 40, DU[1] - 120, 1.7)]], .6);
  const vignettes = (g, t, L, s, o = {}) => {
    // the motorbike man sanding a chair the town doesn't strictly need
    const sa = Math.sin(t * 6); chairCrooked(g, CH[0] + 40, CH[1], 1.0, mixHex('#b07a48', L.light, .15), 0);
    K.folk(g, t, 5, CH[0] - 80, CH[1] + 6, 250, { armR: [1.2 + .25 * sa, 1.6 + .25 * sa], armL: [.9, 1.4], look: .4, lean: .12 });
    g.fillStyle = rgba('#e8d2a8', .7); for (let k = 0; k < 10; k++) { const p = ((t * .8 + k / 10) % 1); g.beginPath(); g.arc(CH[0] + 10 + k * 6 + p * 30, CH[1] - 150 + p * 140, 3, 0, 7); g.fill(); }
    // a grandmother folding dumplings with two children
    K.folk(g, t, 1, DU[0] + 20, DU[1] + 60, 260, { pose: 'hold', look: .3, armR: [1.4 + .1 * Math.sin(t * 2), 2.0] }); K.girl(g, t, DU[0] - 120, DU[1] + 60, 190, { pose: 'reach', look: .5, armR: [1.6, 2.0] }); K.folk(g, t, 7, DU[0] + 150, DU[1] + 60, 180, { pose: 'reach', dir: -1, look: .4, armR: [1.6, 2.1] });
    g.fillStyle = mixHex('#c9a070', L.light, .1); g.beginPath(); g.ellipse(DU[0], DU[1] - 40, 150, 22, 0, 0, 7); g.fill();
    table(g, t, DU[0], DU[1] - 30, 300, L, { candle: false });
    const t6 = s.r('P.06'); for (let k = 0; k < 7; k++) dumpling(g, DU[0] - 120 + k * 40, DU[1] - 40, 1, span(t, t6 + .3 + k * .45, t6 + .7 + k * .45) + (o.done ? 1 : 0));
  };
  const SP03 = {
    id: 'P.03',
    draw(ctx, t, s) {
      const L = look(R, t), t4 = s.r('P.04');
      PL.square(ctx, t, camQ(t), L, { people: 6 + Math.round(4 * span(t, t4, t4 + 2)), tables: 1, lanterns: 1, still: false, focus: (g) => vignettes(g, t, L, s) });
      K.caps(ctx, 'FULL, LIKE EVERY EVENING', W / 2, 380, K.cardU(t, t4 + .2, s.r('P.05') + .2), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'cut' },
  };
  // ---------------------------------------------------------------- P.07–P.11 · the fear of 2026 on paper (no use for people), the card turns · price tags fall to zero but one: SOMEBODY'S TIME, now scarce
  const TAGS = [['HOUSE', 380], ['POWER', 720], ['WATER', 1200], ['A RIDE', 1540]];
  const SP07 = {
    id: 'P.07',
    draw(ctx, t, s) {
      const L = look(R, t), t8 = s.r('P.08'), t9 = s.r('P.09'), t10 = s.r('P.10'), t11 = s.r('P.11');
      PL.square(ctx, t, camQ(t), L, { people: 10, tables: 1, lanterns: 1, focus: (g) => vignettes(g, t, L, s, { done: 1 }) });
      K.scr(ctx, (g) => { g.fillStyle = rgba('#0b1440', .35 * clamp(span(t, s.a - .3, s.a + .5))); g.fillRect(0, 0, W, H); });
      // the fear of 2026: a paper card, an empty chair in a world that has no use for people; on 'the other way' it turns over
      const cu = K.cardU(t, s.a + .1, t9 + .2), flip = Math.cos(Math.PI * K.quartIO(span(t, t8 - .1, t8 + .7)));
      if (cu > 0) K.scr(ctx, (g) => { g.save(); g.translate(960, 480); g.scale(Math.abs(flip) * .999 + .001, 1); g.translate(-960, -480);
        if (flip > 0) K.paper(g, t, 560, 200, 800, 560, cu, { head: 'BACK IN THE TWENTIES · THE FEAR', lines: ['a world with no use for people'], lineSize: 40, draw: (q, x, y, w, h) => { K.ink(q); chairCrooked(q, x + w / 2, y + h - 10, 1.1, K.PAPER.ink, 0); q.fillStyle = K.PAPER.ink; q.globalAlpha = .7; for (let k = 0; k < 5; k++) q.fillRect(x + 40 + k * 120, y + h - 6, 80, 3); q.globalAlpha = 1; } });
        else K.paper(g, t, 560, 200, 800, 560, cu, { head: 'IT WENT THE OTHER WAY', draw: (q, x, y, w, h) => { K.ink(q); for (let k = 0; k < 7; k++) K.folk(q, t, k, x + 60 + k * 100, y + h - 10, 170 + (k % 2) * 20, { pose: k % 3 ? 'look' : 'hold' }); } });
        g.restore(); });
      // P.09: the machines can make almost anything: the tags fall towards zero; P.10 one stays; P.11 it rises, gold
      K.scr(ctx, (g) => {
        TAGS.forEach(([lab, x], i) => { const inU = span(t, t9 - .2 + i * .12, t9 + .5 + i * .12); if (inU <= 0) return; const z = span(t, t9 + .4 + i * .2, t9 + 2.2 + i * .1), fall = K.expoIn(span(t, t10 - .2 + i * .1, t10 + .9 + i * .1));
          tag(g, t, x, lerp(-120, 330, K.expoOut(inU)) + fall * 900, lab, 1 - z, { rot: fall * (i % 2 ? .8 : -.7), a: 1 - span(fall, .7, 1) }); });
        const su = span(t, t10 - .1, t10 + .6); if (su > 0) { const rise = K.expoOut(span(t, t11 - .1, t11 + 1.0)), gauge = lerp(.35, 1, K.expoOut(span(t, t11 + .2, t11 + 2.2)));
          g.save(); g.translate(960, lerp(-140, 380, K.expoOut(su)) - rise * 140); const sc = 1 + .5 * rise; g.scale(sc, sc); tag(g, t, 0, 0, 'SOMEBODY’S TIME', gauge, { w: 360, gold: rise > .3 }); g.restore(); }
      });
      K.caps(ctx, 'NOW SCARCE', W / 2, 120, K.cardU(t, t11 + .3, s.b + .3), { size: 34, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [960, 300, 120], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- P.12–P.14 · a meal cooked for you · a chair with a person's mistakes in it · someone who shows up
  const SP12 = {
    id: 'P.12',
    draw(ctx, t, s) {
      const L = look(R, t), t13 = s.r('P.13'), t14 = s.r('P.14');
      const c = camK(t, [[s.a - 1, aim(1700, 880, 860, 1.25)], [t13 - .1, aim(1700, 900, 850, 1.3)], [t13 + .8, aim(1700, 1300, 820, 1.3), 'q'], [t14 - .1, aim(1700, 1320, 820, 1.32)], [t14 + .9, aim(1700, 1280, 640, 1.15), 'q'], [s.b + .6, aim(1700, 1260, 640, 1.12)]], .5);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 560, clouds: 3, seed: 12 })],
        [4200, () => { for (let i = 0; i < 6; i++) K.house(ctx, -200 + i * 420, 720, 340, 360, L, { col: ['#d8b98a', '#c9a0a0', '#e2c79a', '#b7c0a0', '#d1b090', '#cfa77e'][i], rows: 3, cols: 2, lit: Math.max(.5, L.night), roofH: 90, door: false, t }); K.band(ctx, 718, 1400, mixHex('#cbb99a', L.light, .2), mixHex('#b9a688', L.shade, .2)); }],
        [2400, () => {   // the open door of the bakery: someone comes through it and waves
          const dx = 1280, dy = 600; ctx.fillStyle = mixHex('#c9a07a', L.shade, .2); ctx.fillRect(dx - 260, dy - 260, 520, 420);
          const op = K.quartIO(span(t, t14 - .3, t14 + .5)); ctx.fillStyle = rad(ctx, dx, dy + 40, 260, [[0, '#ffe2a8'], [1, '#d89a5a']]); ctx.fillRect(dx - 80, dy - 120, 160, 280);
          ctx.fillStyle = mixHex('#3a5a8a', L.shade, .2); ctx.fillRect(dx - 80, dy - 120, 160 * (1 - op * .85), 280);
          const w = span(t, t14 + .1, t14 + .9); if (w > 0) K.folk(ctx, t, 3, lerp(dx, dx - 30, w), dy + 160, 230, { armR: [2.6 + .3 * Math.sin(t * 8), 2.9 + .3 * Math.sin(t * 8)], look: 0, dir: -1 });
          K.halo(ctx, dx, dy + 40, 300, .2 + .3 * op);
        }],
        [1700, () => {
          table(ctx, t, 880, 900, 560, L);
          // a plate set down in front of you: steam rises
          const pu = K.expoOut(span(t, s.a - .3, s.a + .7)), py = lerp(760, 880, pu);
          ctx.fillStyle = '#f8f4ea'; ctx.beginPath(); ctx.ellipse(880, py, 120, 26, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#e2a24a'; ctx.beginPath(); ctx.ellipse(880, py - 8, 70, 16, 0, 0, 7); ctx.fill(); ctx.fillStyle = '#5f8f4a'; ctx.beginPath(); ctx.arc(850, py - 14, 10, 0, 7); ctx.arc(900, py - 12, 8, 0, 7); ctx.fill();
          ctx.strokeStyle = rgba('#ffffff', .4); ctx.lineWidth = 4; for (let k = 0; k < 3; k++) { const p = ((t * .5 + k / 3) % 1); ctx.beginPath(); ctx.moveTo(850 + k * 30, py - 20 - p * 120); ctx.quadraticCurveTo(870 + k * 30 + 20 * Math.sin(t * 2 + k), py - 60 - p * 120, 850 + k * 30, py - 100 - p * 120); ctx.stroke(); }
          if (pu < 1) { ctx.fillStyle = SKINH; ctx.beginPath(); ctx.ellipse(880 + 130, py - 6 - 40 * (1 - pu), 30, 18, 0, 0, 7); ctx.fill(); ctx.fillStyle = mixHex('#5a7a9a', L.shade, .2); ctx.fillRect(1040, py - 30 - 40 * (1 - pu), 400, 46); }
          // the chair with the crooked back, beside the table
          chairCrooked(ctx, 1300, 1000, 1.15, mixHex('#b07a48', L.light, .15), 1);
          K.halo(ctx, 1300, 800, 220, .3 * K.cardU(t, t13, t14 + .2));
        }],
        [1150, () => { ctx.fillStyle = rgba('#2a2440', .9); K.you(ctx, t, 300, 1300, 620, { pose: 'hold', look: .3, dir: 1 }); }],
      ]);
      K.caps(ctx, 'A MEAL COOKED FOR YOU', W * .42, 200, K.cardU(t, s.a + .3, t13 + .1), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'A PERSON’S MISTAKES IN IT', W * .62, 200, K.cardU(t, t13 + .4, t14 + .1), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'SOMEONE WHO SHOWS UP', W * .6, 200, K.cardU(t, t14 + .4, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- P.15–P.18 · is that enough to fill a life? a question mark over the square · two tables argue and laugh · it stays, lit
  const SP15 = {
    id: 'P.15',
    draw(ctx, t, s) {
      const L = look(R, t), t16 = s.r('P.16'), t17 = s.r('P.17'), t18 = s.r('P.18');
      const c = camK(t, [[s.a - 1, cam3({ z: -300, y: -60 })], [t16, cam3({ z: -150, y: -30 })], [t18 + .3, cam3({ z: -260, y: -70 })], [s.b + .6, cam3({ z: -380, y: -90 })]], .6);
      PL.square(ctx, t, c, L, { people: 4, tables: 0, lanterns: 1, focus: (g) => {
        // two tables, arguing and laughing (arms up on P.17)
        const ag = span(t, t17 - .2, t17 + .4);
        for (const [x, i0] of [[600, 0], [1320, 3]]) {
          for (let k = 0; k < 3; k++) { const sx = x - 130 + k * 130, a = ag * Math.sin(t * (3 + k) + k + i0); K.folk(g, t, i0 + k, sx, 1060, 240, { armR: [1.6 + .9 * ag + .4 * a, 2.0 + .8 * ag], look: (k - 1) * .5 + .3 * a, dir: k === 2 ? -1 : 1, lean: .04 * a }); }
          table(g, t, x, 950, 420, L);
        }
        if (ag > 0) { g.fillStyle = rgba('#fff3c4', .7 * ag); g.font = '600 34px "Instrument Serif"'; g.textAlign = 'center'; for (const [x, y, w] of [[520, 790, 'ha!'], [1400, 780, 'no —'], [700, 760, 'but…']]) g.fillText(w, x + 8 * Math.sin(t * 3 + x), y + 6 * Math.sin(t * 2 + y)); g.textAlign = 'left'; }
      } });
      K.scr(ctx, (g) => { const u = span(t, s.a - .1, s.a + .7); if (u <= 0) return; const lit = span(t, t18, t18 + 1.0), e = backOut(clamp(u));
        g.save(); g.translate(1420, 330 + 10 * Math.sin(t * .8)); g.scale(e, e); if (lit > 0) K.halo(g, 0, -40, 320, .45 * lit);
        K.glowText(g, '?', 0, 60, { size: 300, serif: true, align: 'center', col: mixHex(P.cream, '#ffd982', lit) }); g.restore(); });
      K.caps(ctx, 'NOBODY CLAIMS TO KNOW', W / 2, 560, K.cardU(t, t16 + .2, t17 + .2), { size: 28, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'THE QUESTION THE MACHINES HANDED BACK', W / 2, 560, K.cardU(t, t18 + .6, s.b + .3), { size: 28, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  return [S901, S903, S904, SP01, SP03, SP07, SP12, SP15];
}
const SKINH = mixHex(P.shade0, P.night1, .5);
