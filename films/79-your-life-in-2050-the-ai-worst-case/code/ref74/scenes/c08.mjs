// Film 74 · c08 DECADES (8.01–8.21): the biggest thing missing is a sentence, "That will take decades." stamped on three hopes (fusion, a cure,
// a town on the Moon), the stamps fall off, a decade of research shrinks to a year (AlphaEvolve), the Moon town older than she is, her birthday in orbit,
// a ship caught by its tower, the Earth between thumb and finger, the old screen a third time on a bench (C1, Hassabis), two curves, the evening path
// past the last house and the young trees behind it.
import * as K from '../lib/f79_kit.mjs';
import * as S from '../lib/f79_street.mjs';
import { hourAt } from './hud.mjs';
import { clipPlate } from './clips.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, cam3, aim, camK, project, lin, rad, prng } = K;
const look = (R, t) => K.hourLook(hourAt(R, t));
const SKIN = mixHex(P.shade0, P.night1, .5);
const backOut = (x) => { const c = 1.7, y = x - 1; return 1 + (c + 1) * y * y * y + c * y * y; };
const RED = '#c8473a';
// ---------------------------------------------------------------- small props
function pin(g, x, y, s, col = K.GOLD.body) {   // a map pin (a place)
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = rgba('#0b1440', .35); g.beginPath(); g.ellipse(0, 112, 34, 9, 0, 0, 7); g.fill();
  g.fillStyle = rad(g, -18, -30, 110, [[0, K.GOLD.core], [.5, col], [1, K.GOLD.mid]]);
  g.beginPath(); g.moveTo(0, 108); g.bezierCurveTo(-30, 50, -64, 10, -64, -26); g.arc(0, -26, 64, Math.PI, 0); g.bezierCurveTo(64, 10, 30, 50, 0, 108); g.fill();
  g.fillStyle = '#7a4a18'; g.beginPath(); g.arc(0, -26, 24, 0, 7); g.fill(); g.restore();
}
function stamp(g, x, y, u, rot, t) {   // red DECADES stamp: slams in from above the card (u 0..1)
  if (u <= 0) return; const e = clamp(u), sc = lerp(1.9, 1, K.expoOut(e)), a = clamp(e * 3);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha *= a;
  g.strokeStyle = RED; g.lineWidth = 7; g.beginPath(); g.roundRect(-150, -46, 300, 92, 10); g.stroke(); g.lineWidth = 3; g.beginPath(); g.roundRect(-138, -34, 276, 68, 6); g.stroke();
  g.fillStyle = RED; g.font = '800 54px Inter'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.letterSpacing = '0.08em'; g.fillText('DECADES', 4, 3); g.letterSpacing = '0em';
  const r = prng(Math.round(x)); g.fillStyle = rgba(K.PAPER.body, .35); for (let k = 0; k < 18; k++) { g.beginPath(); g.arc(-140 + r() * 280, -40 + r() * 80, 2 + r() * 5, 0, 7); g.fill(); }   // worn ink
  g.restore();
}
// a hope card standing on the ground line; stand 0..1 (hinged at its foot), titleU / drawU reveal; returns the drawing rect (screen)
function hopeCard(g, t, cx, gy, w, h, stand, sc, title, titleU, draw, drawU) {
  if (stand <= 0) return null;
  g.save(); g.translate(cx, gy); g.scale(sc, sc * stand); g.rotate(.004 * Math.sin(t * .7 + cx));
  g.fillStyle = rgba('#060a24', .35); g.beginPath(); g.roundRect(-w / 2 + 12, -h + 16, w, h, 8); g.fill();
  g.fillStyle = lin(g, -w / 2, -h, w / 2, 0, [[0, K.PAPER.lit], [1, K.PAPER.body]]); g.beginPath(); g.roundRect(-w / 2, -h, w, h, 8); g.fill();
  g.strokeStyle = rgba(K.PAPER.edge, .9); g.lineWidth = 2; g.stroke();
  if (titleU > 0) { g.globalAlpha = clamp(titleU); g.fillStyle = K.PAPER.ink; g.font = '700 30px Inter'; g.textAlign = 'center'; g.letterSpacing = '0.1em'; g.fillText(title, 0, -h + 62 + 14 * (1 - K.expoOut(clamp(titleU)))); g.letterSpacing = '0em'; g.globalAlpha = 1; }
  g.fillStyle = rgba(K.PAPER.ink2, .45); g.fillRect(-w / 2 + 30, -h + 84, w - 60, 2);
  const r = [-w / 2 + 30, -h + 100, w - 60, h - 130];
  if (drawU > 0) { g.save(); K.ink(g); draw(g, ...r, clamp(drawU), t); g.restore(); }
  g.restore();
  return [cx + sc * r[0], gy + sc * stand * r[1], sc * r[2], sc * stand * r[3]];
}
const DRAW = {
  fusion(g, x, y, w, h, u, t) {   // a tokamak: a ring of plasma in a doughnut
    const cx = x + w / 2, cy = y + h / 2 + 10;
    g.lineWidth = 3.2; K.strokeIn(g, Array.from({ length: 49 }, (_, i) => [cx + Math.cos(i / 48 * 6.283) * 140, cy + Math.sin(i / 48 * 6.283) * 62]), u);
    K.strokeIn(g, Array.from({ length: 49 }, (_, i) => [cx + Math.cos(i / 48 * 6.283) * 70, cy - 6 + Math.sin(i / 48 * 6.283) * 26]), u);
    g.strokeStyle = RED; g.lineWidth = 2.4; K.strokeIn(g, Array.from({ length: 61 }, (_, i) => { const a = i / 60 * 6.283 + t * .8; return [cx + Math.cos(a) * 105, cy - 3 + Math.sin(a) * 44 + Math.sin(a * 5 + t * 3) * 5]; }), u);
    g.strokeStyle = K.PAPER.ink; g.lineWidth = 3; g.beginPath(); g.moveTo(cx - 150, cy + 100); g.lineTo(cx + 150, cy + 100); g.stroke();
    for (const dx of [-110, 110]) { g.beginPath(); g.moveTo(cx + dx, cy + 50); g.lineTo(cx + dx, cy + 100); g.stroke(); }
  },
  cure(g, x, y, w, h, u, t) {   // a capsule, opening, a little cross
    const cx = x + w / 2, cy = y + h / 2 + 10, o = 8 * Math.sin(t * 1.4);
    g.save(); g.translate(cx, cy); g.rotate(-.5); g.lineWidth = 3.4;
    g.beginPath(); g.roundRect(-120 - o, -42, 120, 84, [42, 0, 0, 42]); g.stroke(); g.fillStyle = rgba(RED, .22 * u); g.fill();
    g.beginPath(); g.roundRect(0 + o, -42, 120, 84, [0, 42, 42, 0]); g.stroke(); g.restore();
    g.fillStyle = RED; g.globalAlpha = u; g.fillRect(cx + 96, cy - 112, 16, 52); g.fillRect(cx + 78, cy - 94, 52, 16); g.globalAlpha = 1;
    g.fillStyle = K.PAPER.ink; for (let k = 0; k < 6; k++) { const a = k * 1.05 + t * .3; g.beginPath(); g.arc(cx + Math.cos(a) * 30 * o / 8, cy + 74 + Math.sin(a) * 8, 3, 0, 7); g.fill(); }
  },
  moon(g, x, y, w, h, u, t) {   // the curve of the Moon, three domes, the Earth in its sky
    const cx = x + w / 2, by = y + h - 30;
    g.lineWidth = 3.2; K.strokeIn(g, Array.from({ length: 31 }, (_, i) => [x + 6 + i / 30 * (w - 12), by - 40 * Math.sin(i / 30 * Math.PI)]), u);
    for (const [dx, r] of [[-90, 46], [0, 70], [86, 38]]) { const yb = by - 40 * Math.sin((cx + dx - x) / w * Math.PI); K.strokeIn(g, Array.from({ length: 21 }, (_, i) => [cx + dx - r + i / 20 * 2 * r, yb - Math.sin(i / 20 * Math.PI) * r * .9]), clamp(u * 1.5 - .3)); }
    g.globalAlpha = clamp(u * 2 - 1); g.beginPath(); g.arc(cx + 90, y + 70, 34, 0, 7); g.stroke(); g.beginPath(); g.moveTo(cx + 70, y + 60); g.quadraticCurveTo(cx + 90, y + 52, cx + 102, y + 76); g.stroke(); g.globalAlpha = 1;
    g.fillStyle = K.PAPER.ink; for (const [sx, sy] of [[-150, 20], [-60, 50], [-120, 90], [20, 30]]) { g.beginPath(); g.arc(cx + sx, y + sy, 2.2, 0, 7); g.fill(); }
  },
};
// the old screen of the twenties (a laptop), screen rect in the caller's coords; lit 0..1
function laptop(g, t, [x, y, w, h], lit, L) {
  g.fillStyle = '#1b1d30'; g.beginPath(); g.roundRect(x - 10, y - 10, w + 20, h + 20, 8); g.fill();
  g.fillStyle = lin(g, 0, y, 0, y + h, [[0, mixHex('#24305e', '#8fb4ff', .55 * lit)], [1, mixHex('#121630', '#3a5aa8', .4 * lit)]]); g.fillRect(x, y, w, h);
  g.fillStyle = rgba('#ffffff', .07); g.beginPath(); g.moveTo(x, y + h); g.lineTo(x + w * .45, y); g.lineTo(x + w * .6, y); g.lineTo(x + w * .15, y + h); g.fill();
  if (lit > 0) K.halo(g, x + w / 2, y + h / 2, w * .9, .3 * lit * (.85 + .15 * Math.sin(t * 7)));
  g.fillStyle = '#2a2c44'; g.beginPath(); g.moveTo(x - 14, y + h + 10); g.lineTo(x + w + 14, y + h + 10); g.lineTo(x + w + 40, y + h + 26); g.lineTo(x - 40, y + h + 26); g.closePath(); g.fill();
  g.fillStyle = rgba(L?.ink ?? '#0c1745', .3); g.beginPath(); g.ellipse(x + w / 2, y + h + 30, w * .7, 6, 0, 0, 7); g.fill();
}
// the Earth seen from space (r px), rotating clouds
function earth(g, t, x, y, r, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a;
  g.fillStyle = rad(g, x, y, r * 2.2, [[0, rgba('#8fd0ff', .35)], [.5, rgba('#5aa0ff', .12)], [1, rgba('#5aa0ff', 0)]]); g.fillRect(x - r * 2.2, y - r * 2.2, r * 4.4, r * 4.4);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip();
  g.fillStyle = lin(g, x - r, y - r, x + r, y + r, [[0, '#4f9ee8'], [.6, '#2a5cb8'], [1, '#14286a']]); g.fillRect(x - r, y - r, 2 * r, 2 * r);
  const rot = t * .02; g.fillStyle = '#5f9a5a';
  for (const [u, v, s] of [[.1, -.2, .42], [.55, .25, .3], [-.5, .3, .36], [-.2, -.55, .2]]) { const xx = x + (((u + rot) % 2 + 3) % 2 - 1) * r * 1.4; g.beginPath(); g.ellipse(xx, y + v * r, s * r, s * r * .62, .4, 0, 7); g.fill(); }
  g.fillStyle = rgba('#f4f7ff', .75); for (const [u, v, s] of [[.3, -.45, .5], [-.4, .05, .4], [.0, .55, .45], [.7, .1, .25]]) { const xx = x + (((u + rot * 1.6) % 2 + 3) % 2 - 1) * r * 1.4; g.beginPath(); g.ellipse(xx, y + v * r, s * r, s * r * .16, -.2, 0, 7); g.fill(); }
  g.fillStyle = lin(g, x - r, y, x + r, y, [[0, rgba('#020414', 0)], [.62, rgba('#020414', 0)], [1, rgba('#020414', .75)]]); g.fillRect(x - r, y - r, 2 * r, 2 * r);   // the night side
  g.restore(); g.strokeStyle = rgba('#bfe4ff', .6); g.lineWidth = Math.max(1.5, r * .04); g.beginPath(); g.arc(x, y, r, Math.PI * .55, Math.PI * 1.5); g.stroke(); g.restore();
}
const space = (g, t, seed = 87) => { g.fillStyle = lin(g, 0, -600, 0, H + 600, [[0, '#03041a'], [1, '#0d1238']]); g.fillRect(-1800, -1400, W + 3600, H + 2800); K.stars(g, seed, 260, t, [-900, -600, W + 1800, H + 1200], 1); };
// a floating figure (zero g): drawn around its hip at (x, y), rotated
function floater(g, fn, x, y, rot) { g.save(); g.translate(x, y); g.rotate(rot); fn(); g.restore(); }
// a cupcake with a candle; the flame is round in zero g
function cupcake(g, t, x, y, s, u) {
  if (u <= 0) return; g.save(); g.translate(x, y); g.rotate(.15 * Math.sin(t * .6)); g.scale(s, s); g.globalAlpha *= clamp(u * 2);
  g.fillStyle = '#c98a52'; g.beginPath(); g.moveTo(-40, 0); g.lineTo(40, 0); g.lineTo(30, 44); g.lineTo(-30, 44); g.closePath(); g.fill();
  g.fillStyle = '#f6e7d8'; g.beginPath(); g.ellipse(0, -4, 46, 26, 0, 0, 7); g.fill(); g.fillStyle = '#e8b0b8'; g.beginPath(); g.ellipse(0, -14, 30, 16, 0, 0, 7); g.fill();
  g.fillStyle = '#8fb4ff'; g.fillRect(-4, -64, 8, 46);
  const fl = 1 + .08 * Math.sin(t * 9); K.halo(g, 0, -80, 70, .55 * fl);
  g.fillStyle = rad(g, 0, -80, 16 * fl, [[0, '#ffffff'], [.4, '#ffe9a8'], [1, rgba('#6fa8ff', .5)]]); g.beginPath(); g.arc(0, -80, 15 * fl, 0, 7); g.fill();
  g.restore();
}
// young trees on stakes (planted, not yet a forest)
function sapling(g, t, x, base, s, L, i) {
  const sw = Math.sin(t * .9 + i) * 3 * s; g.strokeStyle = mixHex('#7a5a3a', L.shade, .2); g.lineWidth = 4 * s; g.beginPath(); g.moveTo(x + 10 * s, base); g.lineTo(x + 10 * s, base - 90 * s); g.stroke();
  g.strokeStyle = mixHex('#5a4030', L.shade, .2); g.lineWidth = 3 * s; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x - 2 * s, base - 60 * s, x + sw, base - 110 * s); g.stroke();
  g.fillStyle = mixHex(L.leaf, L.light, .1 + .1 * (i % 3)); g.beginPath(); g.ellipse(x + sw, base - 130 * s, 34 * s, 42 * s, 0, 0, 7); g.fill();
  g.fillStyle = rgba(L.leafS, .55); g.beginPath(); g.ellipse(x + sw + 10 * s, base - 120 * s, 22 * s, 28 * s, 0, 0, 7); g.fill();
}
export default function c08(T, R) {
  const RT = (id) => R[id];
  // ---------------------------------------------------------------- 8.01–8.02 · the street at 4 PM; a place pin over it is crossed out and turns into quotation marks
  const camA = (t) => camK(t, [[RT('8.01') - 1, cam3({ z: -520, y: -30 })], [RT('8.03'), cam3({ z: -250, y: -70 })]], .7);
  const S801 = {
    id: '8.01',
    draw(ctx, t, s) {
      const L = look(R, t), t2 = s.r('8.02'), tp = s.w('place');
      S.street(ctx, t, camA(t), L, { apples: 1, bayTrees: 1, solar: 1, walkers: 1, kids: 1, chalk: 1 });
      K.scr(ctx, (g) => {
        const drop = K.expoOut(span(t, s.a - .2, s.a + .9)), mo = span(t, t2 - .05, t2 + .55), y = lerp(-160, 300, drop) + 6 * Math.sin(t * 1.6);
        K.scrim(g, 700, 140, 520, 400, .35 * (1 - mo));
        if (mo < 1) { pin(g, 960, y, (1 - mo) * (1 + .03 * Math.sin(t * 2)), K.GOLD.body);
          const xu = span(t, tp - .1, tp + .3); if (xu > 0) { g.save(); g.globalAlpha = 1 - mo; g.strokeStyle = RED; g.lineWidth = 14; g.lineCap = 'round'; g.shadowColor = rgba('#000', .3); g.shadowBlur = 8;
            K.strokeIn(g, [[870, y - 120], [1050, y + 110]], xu); K.strokeIn(g, [[1050, y - 120], [870, y + 110]], span(t, tp + .1, tp + .45)); g.restore(); } }
        if (mo > 0) { const e = backOut(clamp(mo)); g.save(); g.translate(960, 300); g.scale(e, e); K.glowText(g, '“ ”', 0, 0, { size: 300, serif: true, align: 'center', base: 'middle', col: '#ffe7a8' }); g.restore(); }
      });
      K.caps(ctx, 'A PLACE', W / 2, 470, K.cardU(t, s.a + .5, t2 + .1), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'A SENTENCE', W / 2, 470, K.cardU(t, t2 + .3, s.b + .4), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: [960, 300, 150], lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.03–8.10 · "That will take decades." · three hopes stamped DECADES · the stamps fall off · a decade shrinks to a year
  const GY = 860, CW = 420, CH = 500, CX = [400, 960, 1520];
  const HOPES = [['FUSION POWER', 'fusion', '8.05'], ['A CURE', 'cure', '8.06'], ['A TOWN ON THE MOON', 'moon', '8.07']];
  const HEAD = [['"That', 'That'], ['will', 'will take'], ['take', 'take decades'], ['decades."', 'decades']];
  // card i's layout at t: x, scale, stand (cards 0 and 1 fold down at 8.10, the moon card walks right and grows)
  const lay = (t, i) => {
    const t4 = RT('8.04'), t10 = RT('8.10');
    let stand = backOut(clamp(span(t, t4 - .1 + i * .14, t4 + .65 + i * .14))), x = CX[i], sc = 1;
    const f = K.quartIO(span(t, t10 - .1, t10 + 1.0));
    if (i < 2) stand *= 1 - K.expoIn(span(t, t10 - .2 + i * .1, t10 + .5 + i * .1)); else { x = lerp(CX[2], 1460, f); sc = lerp(1, 1.12, f) + .02 * span(t, t10 + 1, RT('8.11') + 1); }
    return { x, sc, stand };
  };
  const moonRect = (t) => { const { x, sc } = lay(t, 2); return [x + sc * (-CW / 2 + 30), GY + sc * (-CH + 100), sc * (CW - 60), sc * (CH - 130)]; };
  const S803 = {
    id: '8.03',
    draw(ctx, t, s) {
      const t4 = s.r('8.04'), t8 = s.r('8.08'), t9 = s.r('8.09'), t10 = s.r('8.10'), t11 = s.r('8.11');
      K.dusk(ctx, t, { glow: [960, 520] });
      K.scr(ctx, (g) => {
        const z = 1 + .025 * span(t, s.a, t11 + 1) + .02 * K.bump(t, t8 - .05, .9); g.translate(960, 560); g.scale(z, z); g.translate(-960, -560);
        g.fillStyle = rgba(P.cream, .18); g.fillRect(-200, GY, W + 400, 2);
        // the quotation marks from the street open around the sentence, then step back
        const op = K.quartIO(span(t, s.a - .1, s.a + .8)), mf = 1 - span(t, t4 - .1, t4 + .4);
        if (mf > 0) for (const [sd, ch] of [[-1, '“'], [1, '”']]) K.glowText(g, ch, 960 + sd * lerp(60, 640, op), lerp(300, 520, op), { size: lerp(300, 220, op), serif: true, align: 'center', base: 'middle', col: '#ffe7a8', a: mf });
        // the sentence: word by word on the voice, heavy; at 8.04 it rises and shrinks into the headline over the cards
        const up = K.quartIO(span(t, t4 - .1, t4 + .8)), fall = K.expoIn(span(t, t9 + .2, t9 + 1.4)), size = lerp(124, 58, up), y = lerp(600, 180, up) + fall * 900;
        const ws = HEAD.map(([w]) => w), widths = ws.map((w) => K.measure(w + ' ', size, true)), tot = widths.reduce((a, b) => a + b, 0) - K.measure(' ', size, true);
        let xx = 960 - tot / 2;
        HEAD.forEach(([w, ph], i) => { const u = span(t, s.w(ph) - .08, s.w(ph) + .4); if (u > 0) { g.save(); g.translate(xx, y + 30 * (1 - K.expoOut(u))); g.rotate(fall * (i % 2 ? .3 : -.25)); K.glowText(g, w, 0, 0, { size, serif: true, col: P.cream, a: clamp(u * 1.5) * (1 - span(fall, .6, 1)) }); g.restore(); } xx += widths[i]; });
        // the three hopes stand up; each gets its name, its drawing and the stamp
        HOPES.forEach(([title, key, row], i) => {
          const { x, sc, stand } = lay(t, i), tr = s.r(row), nx = i < 2 ? s.r(HOPES[i + 1][2]) : t8;
          hopeCard(g, t, x, GY, CW, CH, stand, sc, title, span(t, tr - .1, tr + .4), DRAW[key], span(t, tr - .05, tr + 1.2));
          const ts = Math.min(tr + .5, nx - .25), su = span(t, ts, ts + .22);
          if (su > 0 && stand > .05) {   // the stamp: slams, kicks, falls off at 8.09
            const f = span(t, t9 + .3 + i * .28, t9 + 1.6 + i * .28), pulse = .06 * K.bump(t, t8 - .05 + i * .06, .45), sy = GY - CH * .42 * sc * stand + 1100 * f * f;
            const shake = (1 - span(t, ts + .22, ts + .5)) * su * Math.sin(t * 70) * 5;
            g.save(); g.translate(x + shake, sy); g.scale(1 + pulse, 1 + pulse); stamp(g, 0, 0, su, -.16 + (i - 1) * .05 + f * (i % 2 ? 1.4 : -1.1), t); g.restore();
            if (su < 1) K.halo(g, x, sy, 260, .25 * (1 - su));
          }
        });
        // 8.09: your granddaughter walks in under the cards and looks up: she has never heard it
        const gw = span(t, t9 - .2, t9 + 2.4); if (gw > 0) { const gx = lerp(2060, 1120, K.sineIO(gw)), walking = gw < 1; K.girl(g, t, gx, GY + 2, 210, walking ? { walk: K.walkPh(t, .7), dir: -1 } : { pose: 'look', look: .9, dir: 1, armR: [.3, .2] }); }
        // 8.10: A DECADE of research shrinks to A YEAR (same result)
        const bu = span(t, t10 - .1, t10 + .5); if (bu > 0) {
          const sh = K.expoOut(span(t, t10 + .9, t10 + 2.0)), x0 = 140, len = lerp(820, 86, sh), by = 330;
          g.globalAlpha = bu; g.strokeStyle = rgba(P.cream, .35); g.setLineDash([10, 10]); g.lineWidth = 2; g.strokeRect(x0, by, 820, 56); g.setLineDash([]);
          g.fillStyle = lin(g, x0, 0, x0 + len, 0, [[0, K.GOLD.mid], [1, K.GOLD.body]]); g.beginPath(); g.roundRect(x0, by, len * K.expoOut(bu), 56, 4); g.fill();
          K.glowText(g, 'A DECADE OF RESEARCH', x0, by - 22, { size: 30, weight: 700, col: P.cream, glow: false, a: 1 - sh });
          K.glowText(g, 'A YEAR', x0, by - 22, { size: 30, weight: 700, col: '#ffe7a8', glow: false, a: sh });
          K.glowText(g, 'SAME RESULT', x0 + len + 24, by + 40, { size: 26, weight: 600, col: P.cream, glow: false, a: sh });
          g.globalAlpha = 1;
        }
      });
      K.caps(ctx, 'EVERY BIG HOPE', W / 2, 260, K.cardU(t, t4 + .5, t9), { size: 28, align: 'center', col: '#ffe7a8' });
      K.today(ctx, t, t10 + 1.4, t11 + .3, ['AN AI BEATS A MATH RECORD', 'FROM 1969'], 'GOOGLE DEEPMIND ALPHAEVOLVE · 48 INSTEAD OF 49 STEPS', { size: 30, x: 110, y: 520 });
    },
    out: { k: 'portal', win: (t) => moonRect(t), lead: .55, dur: 1.1 },
  };
  // ---------------------------------------------------------------- 8.11 · THE MOON TOWN: domes with lit windows on grey regolith, the Earth in the sky · FOUNDED 2041
  const camM = (t) => camK(t, [[RT('8.11') - 1, cam3({ z: -700, y: 30 })], [RT('8.12') + .6, cam3({ z: -160, y: -40, x: 60 })]], .6);
  const EARTH_M = [1300, 230];
  const S811 = {
    id: '8.11',
    draw(ctx, t, s) {
      const c = camM(t), lit = .85 + .15 * Math.sin(t * .9);
      K.stage(ctx, c, [
        [30000, () => { space(ctx, t, 87); earth(ctx, t, EARTH_M[0], EARTH_M[1], 86); }],
        [9000, () => { K.hills(ctx, 660, 60, null, 21, { grad: ['#5a5c70', '#33354a'] }); ctx.fillStyle = rgba('#1c1e30', .35); for (const [x, y, r] of [[200, 700, 60], [900, 690, 40], [1500, 705, 80]]) { ctx.beginPath(); ctx.ellipse(x, y, r, r * .2, 0, 0, 7); ctx.fill(); } }],
        [4200, () => {
          K.band(ctx, 700, 1400, '#6c6e80', '#3e4054');
          ctx.strokeStyle = '#8a8ca0'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(300, 730); ctx.lineTo(1500, 730); ctx.stroke();   // the tube between the domes
          for (const [x, r] of [[300, 90], [620, 130], [1100, 110], [1450, 80]]) {
            ctx.fillStyle = lin(ctx, x - r, 0, x + r, 0, [[0, '#c9ccd8'], [.6, '#a6a8bc'], [1, '#5c5e74']]); ctx.beginPath(); ctx.arc(x, 740, r, Math.PI, 0); ctx.fill();
            ctx.fillStyle = rgba('#ffcf8a', .9 * lit); for (let k = -2; k <= 2; k++) { ctx.fillRect(x + k * r * .3 - 7, 740 - r * .38, 14, 10); } ctx.fillRect(x - r * .5, 740 - r * .14, r, 6);
          }
          ctx.fillStyle = '#4a4c60'; ctx.fillRect(1700, 520, 8, 220); ctx.fillStyle = rgba('#ff5a4a', .5 + .5 * Math.sin(t * 3)); ctx.beginPath(); ctx.arc(1704, 516, 7, 0, 7); ctx.fill();
        }],
        [2600, () => {
          K.band(ctx, 860, 1500, '#7a7c8e', '#4a4c60');
          ctx.strokeStyle = rgba('#3a3c50', .5); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(-200, 1000); ctx.quadraticCurveTo(700, 900, 1500, 960); ctx.stroke();   // rover tracks
          // the big dome: a glass garden, warm inside, people at its trees
          const x = 760, b = 880, r = 340;
          ctx.save(); ctx.beginPath(); ctx.arc(x, b, r, Math.PI, 0); ctx.clip();
          ctx.fillStyle = rad(ctx, x, b - 60, r * 1.2, [[0, '#ffe2b0'], [.6, '#e6b37c'], [1, '#8a6a70']]); ctx.fillRect(x - r, b - r, 2 * r, r);
          for (const [tx, s] of [[600, .7], [760, .9], [930, .65]]) K.tree(ctx, t, tx, b - 10, s, { leaf: '#5f8f4a', leafS: '#2f5c4a', light: '#ffe2b0', shade: '#5a4a5a', ink: '#2a2440', dir: 1, haze: '#e6b37c', grass: '#86a85a' }, { apples: 6 });
          K.folk(ctx, t, 1, 680, b - 6, 90, { pose: 'reach', look: .6 }); K.folk(ctx, t, 3, 850, b - 6, 84, { walk: K.walkPh(t, .4), dir: -1 });
          ctx.restore();
          ctx.strokeStyle = rgba('#e8ecff', .55); ctx.lineWidth = 3; for (let k = 1; k < 6; k++) { const a = Math.PI + k * Math.PI / 6; ctx.beginPath(); ctx.moveTo(x, b); ctx.lineTo(x + Math.cos(a) * r, b + Math.sin(a) * r); ctx.stroke(); }
          for (const f of [.45, .75]) { ctx.beginPath(); ctx.arc(x, b, r * f, Math.PI, 0); ctx.stroke(); }
          ctx.lineWidth = 6; ctx.strokeStyle = '#d8dae6'; ctx.beginPath(); ctx.arc(x, b, r, Math.PI, 0); ctx.stroke();
          ctx.fillStyle = rgba('#ffffff', .12); ctx.beginPath(); ctx.ellipse(x - r * .45, b - r * .62, r * .2, r * .08, -.7, 0, 7); ctx.fill();
          K.halo(ctx, x, b - r * .4, r * 1.2, .18 * lit);
        }],
        [1150, () => { ctx.fillStyle = '#2a2c3c'; for (const [x, y, rx, ry] of [[-60, 1080, 360, 160], [2000, 1060, 300, 130], [1700, 1110, 160, 70]]) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7); ctx.fill(); } }],
      ]);
      // the label line on the dome
      const [lx, ly] = project(c, 2600, 760, 540), lu = K.cardU(t, s.a + .5, s.b + .3);
      if (lu > 0) K.scr(ctx, (g) => { g.strokeStyle = rgba(P.cream, .8 * lu); g.lineWidth = 2; g.beginPath(); g.moveTo(lx, ly); g.lineTo(lx, ly - 120 * K.expoOut(lu)); g.stroke(); });
      K.caps(ctx, 'THE TOWN ON THE MOON', lx, ly - 168, lu, { size: 26, align: 'center', col: P.cream });
      K.caps(ctx, 'FOUNDED 2041', lx, ly - 132, K.cardU(t, s.a + .8, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: (t) => { const [x, y] = project(camM(t), 30000, ...EARTH_M); return [x, y, 86]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.12–8.14 · ORBIT: a station window, the Earth small and blue below · no suit, a jumper · you and her, a birthday candle
  const WIN = [960, 430, 300];
  const camO = (t) => camK(t, [[RT('8.12') - 1, cam3({ z: -300, y: 20 })], [RT('8.14'), cam3({ z: -120, y: 0 })], [RT('8.15') + .6, aim(1700, WIN[0], WIN[1], 1.15)]], .5);
  const station = (ctx, t, cam, o = {}) => {
    K.stage(ctx, cam, [
      [30000, () => { space(ctx, t, 91); earth(ctx, t, o.ex ?? 1010, o.ey ?? 560, o.er ?? 80); }],
      [1700, () => {
        const [cx, cy, r] = o.win || WIN;
        ctx.beginPath(); ctx.rect(-900, -700, W + 1800, H + 1400); ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, 6.2832, true); ctx.closePath();
        ctx.fillStyle = lin(ctx, 0, -300, 0, H + 300, [[0, '#d9d2c4'], [.5, '#c4bcae'], [1, '#8f8898']]); ctx.fill('evenodd');
        ctx.strokeStyle = rgba('#7a7484', .45); ctx.lineWidth = 3; for (const x of [200, 520, 1400, 1720]) { ctx.beginPath(); ctx.moveTo(x, -200); ctx.lineTo(x, H + 200); ctx.stroke(); } for (const y of [80, 900]) { ctx.beginPath(); ctx.moveTo(-200, y); ctx.lineTo(W + 200, y); ctx.stroke(); }
        ctx.fillStyle = '#e8c46a'; ctx.fillRect(220, 360, 280, 12); ctx.fillRect(1420, 360, 280, 12);   // handrails
        ctx.fillStyle = rgba('#ffe2a0', .8); ctx.fillRect(-200, 60, W + 400, 6);
        ctx.lineWidth = 34; ctx.strokeStyle = '#4a4658'; ctx.beginPath(); ctx.arc(cx, cy, r + 14, 0, 7); ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#8a8698'; ctx.beginPath(); ctx.arc(cx, cy, r + 30, 0, 7); ctx.stroke();
        ctx.fillStyle = '#b8b4c4'; for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (r + 14), cy + Math.sin(a) * (r + 14), 5, 0, 7); ctx.fill(); }
        ctx.fillStyle = rgba('#ffffff', .06); ctx.beginPath(); ctx.ellipse(cx - r * .4, cy - r * .45, r * .3, r * .12, -.6, 0, 7); ctx.fill();
        if (o.wall) o.wall(ctx, t);
      }],
      [1150, () => { if (o.near) o.near(ctx, t); }],
    ]);
  };
  const S812 = {
    id: '8.12',
    draw(ctx, t, s) {
      const t13 = s.r('8.13'), t14 = s.r('8.14'), c = camO(t);
      station(ctx, t, c, {
        wall: (g) => {   // a pen floats past the window
          const p = ((t - s.a) * .06) % 1; g.save(); g.translate(lerp(1500, 1250, p), 220 + 20 * Math.sin(t)); g.rotate(t * .4); g.fillStyle = '#3a5aa8'; g.fillRect(-30, -4, 60, 8); g.restore();
        },
        near: (g) => {
          // her: in a jumper, floating at the window (head and shoulders against the panels)
          const gi = K.expoOut(span(t, s.a - .4, s.a + 1.6)), gx = lerp(-200, 560, gi), gy = 770 + 16 * Math.sin(t * .8);
          floater(g, () => K.girl(g, t, 0, 420, 760, { pose: 'reach', armR: [2.2 + .1 * Math.sin(t * .7), 2.5], armL: [-1.0, -1.3 + .2 * Math.sin(t)], look: .7, dir: 1 }), gx, gy, -.18 + .05 * Math.sin(t * .5));
          // 8.13 'Not as an astronaut': a helmet of glass forms round her head and pops into droplets
          const hb = span(t, t13 - .1, t13 + .5), pop = span(t, t13 + .75, t13 + 1.15); if (hb > 0) { const hx = gx + 70, hy = gy - 270;
            if (pop < 1) { g.save(); g.globalAlpha = (1 - pop) * hb; g.strokeStyle = rgba('#e8fbff', .9); g.lineWidth = 6; g.beginPath(); g.arc(hx, hy, 120 * K.expoOut(hb) * (1 + .15 * pop), 0, 7); g.stroke(); g.fillStyle = rgba('#bfe4ff', .14); g.fill(); g.restore(); }
            if (pop > 0 && pop < 1) { g.fillStyle = rgba('#e8fbff', 1 - pop); for (let k = 0; k < 14; k++) { const a = k / 14 * 6.283, d = 120 + 140 * pop; g.beginPath(); g.arc(hx + Math.cos(a) * d, hy + Math.sin(a) * d, 5 * (1 - pop) + 1, 0, 7); g.fill(); } } }
          // 8.14 you float in from the right; the birthday candle floats between you
          const yi = K.expoOut(span(t, t14 - .3, t14 + 1.6)); if (yi > 0) floater(g, () => K.you(g, t, 0, 440, 820, { pose: 'reach', armR: [2.0, 2.3], look: .6, dir: -1 }), lerp(2200, 1400, yi), 760 + 14 * Math.sin(t * .7 + 2), .16 + .04 * Math.sin(t * .4));
          cupcake(g, t, lerp(980, 960, K.expoOut(span(t, t14 + .3, t14 + 1.5))), lerp(1250, 790, K.expoOut(span(t, t14 + .3, t14 + 1.5))), 1.3, span(t, t14 + .3, t14 + .9));
        },
      });
      K.caps(ctx, 'IN ORBIT', W / 2, 120, K.cardU(t, s.a + .4, t13 + .2), { size: 30, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'HAPPY BIRTHDAY', W / 2, 120, K.cardU(t, t14 + 1.0, s.b + .4), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'portal', win: (t) => { const c = camO(t), a = project(c, 1700, WIN[0] - WIN[2] * .7, WIN[1] - WIN[2] * .7), b = project(c, 1700, WIN[0] + WIN[2] * .7, WIN[1] + WIN[2] * .7); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; }, lead: .45, dur: 1.1 },
  };
  // ---------------------------------------------------------------- 8.15 · a ship settles on its tower the way a plane pulls up to a gate · TODAY: caught by its launch tower
  const TX = 1240;
  const S815 = {
    id: '8.15',
    draw(ctx, t, s) {
      const L = look(R, t), c = camK(t, [[s.a - 1, cam3({ z: -320, y: -150 })], [s.a + 2.6, cam3({ z: -160, y: 10 })], [s.b + .6, cam3({ z: -60, y: 30 })]], .6);
      const d = K.expoOut(span(t, s.a - .6, s.a + 2.6)), sy = lerp(-380, 430, d), arms = K.quartIO(span(t, s.a + 2.1, s.a + 2.8)), hit = span(t, s.a + 2.5, s.a + 2.9);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 640, clouds: 4, seed: 151 })],
        [9000, () => { K.hills(ctx, 650, 30, null, 15, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)] }); K.band(ctx, 660, 1400, mixHex('#3a6aa8', L.light, .2), mixHex('#2a4a88', L.shade, .3)); ctx.fillStyle = rgba(L.light, .35); for (let k = 0; k < 9; k++) ctx.fillRect(200 + k * 190 + Math.sin(t * .5 + k) * 20, 700 + k % 3 * 20, 90, 3); }],
        [2600, () => {
          K.band(ctx, 880, 1500, mixHex('#c9b48e', L.light, .2), mixHex('#8f7f66', L.shade, .3));
          // the tower: a dark lattice with two arms ("chopsticks") that close round the ship
          const top = 60, base = 900;
          ctx.fillStyle = '#2a2c44'; ctx.fillRect(TX + 80, top, 120, base - top);
          ctx.strokeStyle = '#4a4c66'; ctx.lineWidth = 6; for (let y = top + 20; y < base; y += 60) { ctx.beginPath(); ctx.moveTo(TX + 80, y); ctx.lineTo(TX + 200, y + 60); ctx.moveTo(TX + 200, y); ctx.lineTo(TX + 80, y + 60); ctx.stroke(); }
          ctx.fillStyle = rgba('#ff5a4a', .5 + .5 * Math.sin(t * 2.6)); ctx.beginPath(); ctx.arc(TX + 140, top - 8, 8, 0, 7); ctx.fill();
          for (const sd of [-1, 1]) { const ang = sd * lerp(.75, 0, arms) ; ctx.save(); ctx.translate(TX + 80, 190 + sd * 26); ctx.rotate(-ang); ctx.fillStyle = '#3a3c58'; ctx.fillRect(-300, -14, 300, 28); ctx.restore(); }
          // the ship: a slim steel cylinder on its flame
          ctx.save(); ctx.translate(TX - 110 + (1 - hit) * hit * Math.sin(t * 50) * 3, sy);
          const fl = 1 - span(t, s.a + 2.6, s.a + 3.0); if (fl > 0) { const fh = 260 * fl * (1 + .1 * Math.sin(t * 40)); ctx.fillStyle = lin(ctx, 0, 330, 0, 330 + fh, [[0, rgba('#fff3c4', .95)], [.4, rgba('#ffb35c', .8)], [1, rgba('#ff7a3a', 0)]]); ctx.beginPath(); ctx.moveTo(-34, 330); ctx.lineTo(34, 330); ctx.lineTo(0, 330 + fh); ctx.fill(); K.halo(ctx, 0, 360, 220, .5 * fl); }
          ctx.fillStyle = lin(ctx, -50, 0, 50, 0, [[0, '#8a8ea8'], [.45, '#eef0f8'], [1, '#6a6e88']]); ctx.beginPath(); ctx.moveTo(-50, 330); ctx.lineTo(-50, -180); ctx.quadraticCurveTo(-50, -320, 0, -360); ctx.quadraticCurveTo(50, -320, 50, -180); ctx.lineTo(50, 330); ctx.closePath(); ctx.fill();
          ctx.fillStyle = '#4a4e66'; ctx.beginPath(); ctx.moveTo(-50, 230); ctx.lineTo(-92, 320); ctx.lineTo(-50, 320); ctx.fill(); ctx.beginPath(); ctx.moveTo(50, 230); ctx.lineTo(92, 320); ctx.lineTo(50, 320); ctx.fill();
          ctx.beginPath(); ctx.moveTo(-50, -200); ctx.lineTo(-80, -140); ctx.lineTo(-50, -120); ctx.fill(); ctx.beginPath(); ctx.moveTo(50, -200); ctx.lineTo(80, -140); ctx.lineTo(50, -120); ctx.fill();
          ctx.restore();
          if (hit > 0) { ctx.fillStyle = rgba('#f4f0e8', .5 * (1 - span(t, s.a + 2.9, s.b))); for (let k = 0; k < 7; k++) { const p = span(t, s.a + 2.6, s.b + .5); ctx.beginPath(); ctx.arc(TX - 110 + (k - 3) * 60 * (1 + p), 880 - 30 * p - (k % 2) * 30, 50 + 60 * p, 0, 7); ctx.fill(); } }
        }],
        [1150, () => { ctx.fillStyle = mixHex('#2f5c4a', L.shade, .4); ctx.beginPath(); ctx.ellipse(-80, 1120, 420, 140, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.ellipse(2050, 1140, 380, 150, 0, 0, 7); ctx.fill(); }],
      ]);
      // the gate: a small ink plane pulling up to its jet bridge (the comparison, MIX)
      const pu = K.cardU(t, s.a + .5, s.b + .3);
      if (pu > 0) K.scr(ctx, (g) => K.paper(g, t, 110, 120, 560, 300, pu, { head: 'LIKE A PLANE AT A GATE', from: [TX - 110, 400], draw: (q, x, y, w, h, u) => {
        K.ink(q); const p = K.expoOut(span(t, s.a + .9, s.a + 2.6)), px = lerp(x + 40, x + w * .48, p), py = y + h * .62;
        q.beginPath(); q.moveTo(x + w - 10, py - 40); q.lineTo(x + w * .62, py - 40); q.lineTo(x + w * .62, py - 4); q.lineTo(x + w - 10, py - 4); q.stroke();   // the jet bridge
        q.beginPath(); q.moveTo(x + w * .62, py - 40); q.lineTo(x + w * .62, py + 30); q.stroke();
        q.beginPath(); q.ellipse(px, py - 20, 110, 18, 0, 0, 7); q.stroke(); q.beginPath(); q.moveTo(px - 10, py - 18); q.lineTo(px - 60, py + 36); q.lineTo(px - 30, py + 36); q.lineTo(px + 30, py - 18); q.stroke();
        q.beginPath(); q.moveTo(px - 90, py - 30); q.lineTo(px - 116, py - 62); q.lineTo(px - 100, py - 62); q.lineTo(px - 70, py - 34); q.stroke();
        q.strokeStyle = K.PAPER.ink2; q.setLineDash([8, 8]); q.beginPath(); q.moveTo(x, py + 50); q.lineTo(x + w, py + 50); q.stroke(); q.setLineDash([]); } }));
      K.today(ctx, t, s.a + 2.9, s.b + .3, ['A SPACESHIP CAUGHT BY', 'ITS LAUNCH TOWER'], 'SPACEX STARSHIP FLIGHT 15 · 14 NOV 2026', { size: 30, x: 110, y: 560 });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.16 · her hand at the window: the Earth fits between thumb and finger
  const E16 = [1020, 470, 44];
  const S816 = {
    id: '8.16',
    draw(ctx, t, s) {
      const c = camK(t, [[s.a - 1, aim(1700, 960, 480, 1.0)], [s.b + .6, aim(1700, 990, 470, 1.14)]], .5);
      station(ctx, t, c, { win: [960, 480, 420], ex: E16[0], ey: E16[1], er: E16[2] });
      const [ex, ey] = project(c, 30000, E16[0], E16[1]);
      K.scr(ctx, (g) => {
        const u = K.expoOut(span(t, s.a - .2, s.a + 1.6)), pinch = K.sineIO(span(t, s.a + 1.0, s.a + 2.0)), hx = lerp(ex - 900, ex - 175, u), hy = lerp(ey + 520, ey, u) + 4 * Math.sin(t * .9) * (1 - pinch);
        g.save(); g.translate(hx, hy); g.rotate(-.12 * (1 - u));
        g.fillStyle = mixHex(K.RUST.base, K.RUST.shade, .3); g.beginPath(); g.roundRect(-760, -86, 700, 172, 70); g.fill();   // the jumper sleeve
        g.fillStyle = K.RUST.lit; g.fillRect(-90, -86, 26, 172);
        g.fillStyle = SKIN; g.beginPath(); g.ellipse(0, 0, 96, 82, 0, 0, 7); g.fill();   // the back of the hand
        for (const [kx, ky] of [[70, -18], [78, 14], [70, 44]]) { g.beginPath(); g.ellipse(kx, ky, 34, 18, .1, 0, 7); g.fill(); }   // the other fingers, curled
        const op = 1 - pinch;   // index finger above the Earth, thumb below it: they close until the Earth just fits between
        g.save(); g.translate(30, -72); g.rotate(-.38 * op); g.beginPath(); g.roundRect(0, -22, 236, 44, 22); g.fill(); g.restore();
        g.save(); g.translate(10, 70); g.rotate(.42 * op); g.beginPath(); g.roundRect(0, -24, 214, 48, 24); g.fill(); g.restore();
        g.restore();
      });
      K.caps(ctx, 'SMALL ENOUGH TO LOOK AFTER', W / 2, 990, K.cardU(t, s.a + 1.6, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'iris', c: (t, h) => { const [x, y] = project(camK(t, [[h.a - 1, aim(1700, 960, 480, 1.0)], [h.b + .6, aim(1700, 990, 470, 1.14)]], .5), 30000, E16[0], E16[1]); return [x, y, 60]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.17–8.18 + C1 · the old screen a third time, on a bench · BACK IN THE TWENTIES · economists' flat curve · C1 out of the screen
  const SCR = [900, 640, 230, 140];
  const C1 = T.clip('C1') || { start: RT('8.18') + 4.8, end: RT('8.19') - .7 };
  const camB = (t) => camK(t, [[RT('8.17') - 1, cam3({ z: -480, y: -30 })], [RT('8.18'), aim(1700, 1015, 700, 1.15)], [C1.start - .2, aim(1700, 1015, 710, 1.45)], [C1.end + 1, aim(1700, 1015, 710, 1.3)]], .6);
  const scrRect = (t) => { const c = camB(t), a = project(c, 1700, SCR[0], SCR[1]), b = project(c, 1700, SCR[0] + SCR[2], SCR[1] + SCR[3]); return [a[0], a[1], b[0] - a[0], b[1] - a[1]]; };
  const S817 = {
    id: '8.17',
    draw(ctx, t, s) {
      const L = look(R, t), c = camB(t), t18 = s.r('8.18'), lit = span(t, t18 - .3, t18 + .4);
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 620, clouds: 4, seed: 171 })],
        [8500, () => { K.hills(ctx, 640, 50, null, 17, { grad: [K.hz(L.leafS, 8500, L), K.hz(L.leaf, 6000, L)] }); for (const x of [300, 380, 1500, 1580, 1660]) K.poplar(ctx, x, 650, 150, K.hz(L.leafS, 8500, L)); }],
        [4200, () => { K.band(ctx, 700, 1400, K.hz(L.grass, 4200, L), mixHex(L.grass, L.shade, .2)); for (const [x, sc] of [[200, .7], [1700, .8]]) K.tree(ctx, t, x, 720, sc, L, { leaf: K.hz(L.leaf, 4200, L) }); }],
        [2600, () => { ctx.fillStyle = mixHex(L.walk, L.light, .1); ctx.beginPath(); ctx.moveTo(-400, 1300); ctx.quadraticCurveTo(700, 860, 1300, 760); ctx.lineTo(1500, 770); ctx.quadraticCurveTo(900, 900, 400, 1300); ctx.fill(); }],
        [1700, () => {
          const bx = 640, by = 790, bw = 640;   // the bench
          ctx.fillStyle = mixHex('#7a5030', L.shade, .25); ctx.fillRect(bx, by, bw, 22); ctx.fillRect(bx + 20, by + 22, 16, 80); ctx.fillRect(bx + bw - 36, by + 22, 16, 80);
          ctx.fillStyle = mixHex('#8a6040', L.light, .1); ctx.fillRect(bx, by - 110, bw, 18); ctx.fillRect(bx, by - 70, bw, 18); ctx.fillStyle = mixHex('#4a3a40', L.shade, .3); ctx.fillRect(bx + 30, by - 120, 14, 120); ctx.fillRect(bx + bw - 44, by - 120, 14, 120);
          ctx.fillStyle = rgba(L.ink, .3); ctx.beginPath(); ctx.ellipse(bx + bw / 2, by + 104, bw * .6, 14, 0, 0, 7); ctx.fill();
          laptop(ctx, t, SCR, lit, L);
          ctx.fillStyle = rgba('#e8eef8', .9); ctx.fillRect(bx + 60, by - 12, 90, 12);   // a newspaper folded beside it
        }],
        [1150, () => { ctx.fillStyle = mixHex(L.leafS, '#0c1438', .3); for (const [x, y, r] of [[-120, 1040, 260], [120, 1120, 180], [2040, 1080, 240]]) { ctx.beginPath(); ctx.arc(x + Math.sin(t * .6) * 6, y, r, 0, 7); ctx.fill(); } }],
      ]);
      const [sx, sy, sw, sh] = scrRect(t), from = [sx + sw / 2, sy + sh / 2];
      const pu = K.cardU(t, s.a + .2, t18 - .05);
      if (pu > 0) K.scr(ctx, (g) => K.paper(g, t, 120, 190, 640, 220, pu, { head: 'BACK IN THE TWENTIES', lines: ['the same AI lab chief', 'put a number on it'], lineSize: 42, from }));
      // 8.18 · he had something to sell; most economists expected far less: a flat curve on paper
      const eu = K.cardU(t, t18 + .1, C1.start - .5);
      if (eu > 0) K.scr(ctx, (g) => K.paper(g, t, 100, 190, 680, 440, eu, { head: 'MOST ECONOMISTS EXPECTED', from, draw: (q, x, y, w, h, u) => {
        K.ink(q); q.beginPath(); q.moveTo(x + 20, y + 10); q.lineTo(x + 20, y + h - 40); q.lineTo(x + w - 10, y + h - 40); q.stroke();
        q.font = '600 22px Inter'; q.fillStyle = K.PAPER.ink2; q.fillText('2026', x + 20, y + h - 8); q.textAlign = 'right'; q.fillText('2050', x + w - 10, y + h - 8); q.textAlign = 'left';
        const pts = Array.from({ length: 25 }, (_, i) => [lerp(x + 20, x + w - 10, i / 24), y + h - 40 - (Math.pow(1.035, i) - 1) * 70]);
        q.lineWidth = 4; q.setLineDash([14, 9]); K.strokeIn(q, pts, span(t, t18 + .5, t18 + 2.2)); q.setLineDash([]);
        if (span(t, t18 + 2.0, t18 + 2.4) > 0) { q.globalAlpha = span(t, t18 + 2.0, t18 + 2.4); q.font = '700 26px Inter'; q.fillStyle = K.PAPER.ink; q.fillText('ECONOMISTS', x + w - 220, pts[24][1] - 26); q.globalAlpha = 1; }
      } }));
      K.today(ctx, t, t18 + 1.6, C1.start - .5, ['EVEN WITH RAPID AI, ECONOMISTS EXPECT', 'ABOUT 3.5% GROWTH A YEAR BY 2050'], 'NBER WORKING PAPER 35046 · 2026 (MEDIAN)', { size: 28, x: 1150, y: 110 });
      const m = span(t, C1.start - .6, C1.start + .2) - span(t, C1.end - .2, C1.end + .6);
      if (m > 0) clipPlate(ctx, t, T, 'C1', scrRect(t), m);
    },
    out: { k: 'iris', c: (t) => { const [x, y, w, h] = scrRect(t); return [x + w / 2, y + h / 2, h / 2]; }, lead: .3, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.19 · two curves, LAB CHIEF and ECONOMISTS; the 2050 of this story lies near his
  const S819 = {
    id: '8.19',
    draw(ctx, t, s) {
      const tc = s.w('closer');
      K.dusk(ctx, t, { glow: [1300, 380] });
      K.scr(ctx, (g) => {
        const z = 1 + .03 * span(t, s.a, s.b + 1); g.translate(960, 540); g.scale(z, z); g.translate(-960, -540);
        const x0 = 280, x1 = 1480, y0 = 820, yr = (i) => lerp(x0, x1, i / 24);
        g.strokeStyle = rgba('#cfd8ff', .35); g.lineWidth = 2; g.beginPath(); g.moveTo(x0, 230); g.lineTo(x0, y0); g.lineTo(x1 + 40, y0); g.stroke();
        K.glowText(g, '2026', x0, y0 + 44, { size: 28, weight: 600, col: P.cream2 ?? '#a49fc4', glow: false }); K.glowText(g, '2050', x1, y0 + 44, { size: 28, weight: 600, align: 'center', col: '#a49fc4', glow: false });
        K.glowText(g, 'HOW MUCH CHANGES', x0 + 16, 250, { size: 24, weight: 600, col: '#a49fc4', glow: false, spacing: .12 });
        const eco = Array.from({ length: 25 }, (_, i) => [yr(i), y0 - (Math.pow(1.035, i) - 1) * 100]);
        const lab = Array.from({ length: 25 }, (_, i) => [yr(i), y0 - 520 * (Math.exp(i / 24 * 3.2) - 1) / (Math.exp(3.2) - 1)]);
        g.lineWidth = 5; g.strokeStyle = '#a49fc4'; g.setLineDash([16, 10]); K.strokeIn(g, eco, span(t, s.a - .2, s.a + .6)); g.setLineDash([]);
        g.strokeStyle = K.CYAN.body; g.shadowColor = rgba(K.CYAN.body, .6); g.shadowBlur = 12; K.strokeIn(g, lab, span(t, s.a + .2, s.a + 2.2)); g.shadowBlur = 0;
        const lu = span(t, s.a + .7, s.a + 1.1), lu2 = span(t, s.a + 2.0, s.a + 2.4);
        if (lu > 0) { g.globalAlpha = lu; g.fillStyle = '#a49fc4'; g.fillRect(x1 + 30, eco[24][1] - 3, 26, 6); K.glowText(g, 'ECONOMISTS', x1 + 66, eco[24][1] + 10, { size: 28, weight: 700, col: P.cream, glow: false }); g.globalAlpha = 1; }
        if (lu2 > 0) { g.globalAlpha = lu2; g.fillStyle = K.CYAN.body; g.fillRect(x1 + 30, lab[24][1] - 3, 26, 6); K.glowText(g, 'LAB CHIEF', x1 + 66, lab[24][1] + 10, { size: 28, weight: 700, col: P.cream, glow: false }); g.globalAlpha = 1; }
        // the 2050 of this story: a gold mark that lands near his line
        const mu = span(t, tc - .3, tc + .5); if (mu > 0) { const e = backOut(clamp(mu)), mx = x1, my = lab[24][1] + 60; g.globalAlpha = clamp(mu * 2);
          g.strokeStyle = rgba(K.GOLD.line, .5); g.setLineDash([6, 8]); g.lineWidth = 2; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx, y0); g.stroke(); g.setLineDash([]);
          K.halo(g, mx, my, 120 * e, .55); g.fillStyle = K.GOLD.core; g.beginPath(); g.arc(mx, my, 14 * e, 0, 7); g.fill(); g.strokeStyle = '#0b1340'; g.lineWidth = 2; g.stroke();
          K.glowText(g, 'THIS STORY’S 2050', mx - 30, my + 8, { size: 28, weight: 700, align: 'right', col: '#ffe7a8', glow: false }); g.globalAlpha = 1; }
      });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  // ---------------------------------------------------------------- 8.20–8.21 · the evening path: you walk past the last house; behind it, young trees
  const camP = (t) => camK(t, [[RT('8.20') - 1, cam3({ z: -400, x: -260, y: -20 })], [RT('8.21') + .3, cam3({ z: -300, x: 160, y: -40 })], [RT('9.01') + .6, cam3({ z: -200, x: 520, y: -60 })]], .6);
  const S820 = {
    id: '8.20',
    draw(ctx, t, s) {
      const L = look(R, t), c = camP(t), t21 = s.r('8.21');
      K.stage(ctx, c, [
        [30000, () => K.sky(ctx, t, L, { horizon: 620, clouds: 4, seed: 201 })],
        [9000, () => K.hills(ctx, 640, 40, null, 19, { grad: [K.hz(L.leafS, 9000, L), K.hz(L.leaf, 7000, L)], x0: -2400, x1: W + 2400 })],
        [4200, () => {
          K.band(ctx, 690, 1400, K.hz(L.grass, 4200, L), mixHex(L.grass, L.shade, .25), -2400, W + 2400);
          // the young trees past the last house: rows of saplings on stakes, all the way out
          const r = prng(5); let i = 0; for (let row = 0; row < 4; row++) for (let k = 0; k < 16; k++) { const x = 900 + k * 120 + (row % 2) * 60 + r() * 20, b = 700 + row * 22; sapling(ctx, t, x, b, .55 + row * .08, L, i++); }
        }],
        [2600, () => {
          ctx.fillStyle = mixHex(L.walk, L.light, .15); ctx.beginPath(); ctx.moveTo(-1600, 930); ctx.quadraticCurveTo(600, 860, 2600, 800); ctx.lineTo(2600, 860); ctx.quadraticCurveTo(600, 930, -1600, 1020); ctx.fill();
          K.house(ctx, 200, 860, 520, 420, L, { col: '#d1b090', side: 1, lit: Math.max(L.night, .4), t, roofH: 170 });   // the last house, a lamp in its window
          K.tree(ctx, t, 820, 870, .9, L, { apples: 8 });
          ctx.fillStyle = mixHex('#7a5030', L.shade, .2); ctx.fillRect(-300, 870, 1100, 10); for (let x = -300; x < 800; x += 90) ctx.fillRect(x, 830, 8, 50);   // its fence ends; past it only the young trees
        }],
        [1700, () => {
          const p = span(t, s.a - .8, s.b + 1), x = lerp(250, 1700, K.sineIO(p) * .4 + p * .6);
          K.you(ctx, t, x, 960 - (x - 250) * .04, 250, { walk: K.walkPh(t, .55), dir: 1 });
        }],
        [1150, () => { ctx.fillStyle = mixHex(L.leafS, '#0c1438', .3); for (const [x, y, r] of [[-400, 1150, 280], [2300, 1160, 260], [3000, 1150, 280]]) { ctx.beginPath(); ctx.ellipse(x + Math.sin(t * .6) * 8, y, r, r * .55, 0, 0, 7); ctx.fill(); } }],
      ]);
      K.caps(ctx, 'THE LAST HOUSE', W * .3, 220, K.cardU(t, s.a + .5, t21 + .4), { size: 28, align: 'center', col: '#ffe7a8' });
      K.caps(ctx, 'YOUNG TREES', W * .66, 300, K.cardU(t, t21 + .6, s.b + .3), { size: 30, align: 'center', col: '#ffe7a8' });
    },
    out: { k: 'sweep', dir: -1, w: 520, lead: .4, dur: 1.0 },
  };
  return [S801, S803, S811, S812, S815, S816, S817, S819, S820];
}
