// 09 · How we get there (≈7:21–10:00): three things that already worked somewhere.
// Carrier chain: two windows → window cross → board (3 chalk circles) → lens → idea lab → night window → Berkeley lab → robot arm →
// furnace glow → crystal jars → red note → pipette → lab train → circle 2 (scale) → album → UK map → pill bottle → ward → monitor →
// vaccine ring → four boxes → daylight → key board → circle 3 (door) → protein library → clip screen → protein birds → world map →
// garden → compass/coins vs clinic → quote → helm over the city → many hands → public science field → fountain → the narrow door.
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, back, prng, canvas, addGlow, glow, text, label, glowLine, drift } from '../engine.mjs';
import { P, skyGrad, cityLayer, fogBand, cone, hill, grass, person, finish, shade, mixHex } from '../lib/world.mjs';
import { clipScreen, clipLabel, clipQuote, quoteCard, source } from '../lib/kit.mjs';
import {
  once, bg, look, motes, pool, beam, chalkCircle, chalkLine, chalkStick, BOARD, CIRC, CR, boardRoom, chalkIcon,
  robotArm, crucible, jar, ideaCard, GB, NI, WORLD, smoothPath, landDots, reach, protein, iconDisc,
} from '../lib/s09_helpers.mjs';

const JAR_COLS = [P.cyanSoft, P.amber, P.rose, '#b59cff', '#7fffd4', '#ffd29a'];

// ---------- 88: two windows, grey and amber; the camera floats between them, then settles on the amber one ----------
function windowView(ctx, x, y, w, h, kind, t) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  if (kind === 'grey') {
    bg(ctx, [[0, '#2b3044'], [1, '#4b5266']]);
    const r = prng(3); ctx.fillStyle = '#23283a';
    for (let i = 0; i < 12; i++) { const bw = 40 + r() * 60, bh = 120 + r() * 260, bx = x + i * (w / 11) - 20; ctx.fillRect(bx, y + h - bh, bw, bh); }
    ctx.fillStyle = 'rgba(160,170,190,.08)'; ctx.fillRect(x, y + h * .55, w, h * .45);
    ctx.strokeStyle = 'rgba(200,210,230,.28)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 70; i++) { const rx = x + ((r() * w + t * 30) % w), ry = y + ((r() * h + t * (500 + r() * 300)) % h); ctx.beginPath(); ctx.moveTo(rx, ry); ctx.lineTo(rx - 6, ry + 26); ctx.stroke(); }
    // droplets on the glass running down
    for (let i = 0; i < 14; i++) { const dx = x + r() * w, dy = y + ((r() * h + t * (20 + r() * 40)) % h); ctx.fillStyle = 'rgba(220,230,245,.35)'; ctx.beginPath(); ctx.ellipse(dx, dy, 3, 5, 0, 0, 7); ctx.fill(); }
  } else {
    const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#3a2d66'); g.addColorStop(.55, '#e98a6a'); g.addColorStop(1, '#ffcf8a');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    const sy = y + h * .72 - (t % 100) * 6 % 40;
    addGlow(ctx, x + w * .55, y + h * .62 - Math.sin(t * .2) * 20, 260, .9, P.amber, '#fff6e0');
    const r = prng(5);
    for (let i = 0; i < 12; i++) { const bw = 40 + r() * 60, bh = 100 + r() * 240, bx = x + i * (w / 11) - 20; ctx.fillStyle = '#5a3550'; ctx.fillRect(bx, y + h - bh, bw, bh); for (let k = 0; k < 6; k++) { if (r() < .5) { ctx.fillStyle = rgba('#ffd29a', .7); ctx.fillRect(bx + 8 + r() * (bw - 20), y + h - bh + 20 + r() * (bh - 40), 6, 9); } } }
    // birds crossing
    ctx.strokeStyle = 'rgba(60,30,50,.8)'; ctx.lineWidth = 2.5;
    for (let i = 0; i < 6; i++) { const bx = x + ((i * 130 + t * (40 + i * 6)) % (w + 100)) - 50, by = y + 120 + i * 28 + Math.sin(t * 2 + i) * 8, f = Math.sin(t * 9 + i) * 6; ctx.beginPath(); ctx.moveTo(bx - 10, by - f); ctx.lineTo(bx, by); ctx.lineTo(bx + 10, by - f); ctx.stroke(); }
    void sy;
  }
  ctx.restore();
}
function windowFrame(ctx, x, y, w, h, warm) {
  ctx.strokeStyle = '#3a2a1e'; ctx.lineWidth = 18; ctx.strokeRect(x, y, w, h);
  ctx.fillStyle = '#3a2a1e'; ctx.fillRect(x + w / 2 - 9, y, 18, h); ctx.fillRect(x, y + h / 2 - 9, w, 18);
  ctx.fillStyle = '#2b1f16'; ctx.fillRect(x - 30, y + h + 6, w + 60, 22);
  if (warm) { ctx.strokeStyle = 'rgba(255,207,145,.35)'; ctx.lineWidth = 2; ctx.strokeRect(x - 10, y - 10, w + 20, h + 20); }
}
const twoWindows = (T, tEnd) => {
  const tNob = T.S('09a', 'Nobody');
  return (ctx, t, s) => {
    const tc = s.b;
    const u = eio(lin(tc - 2.0, tc - .15, t));
    const cx = mix(960 + drift(t, 40), 1360, u), z = mix(1 + .02 * Math.sin(t * .5), 1.5, u);
    bg(ctx, [[0, '#0c0e2a'], [1, '#181a40']]);
    ctx.save(); look(ctx, cx, 540, z);
    // wall paper stripes
    ctx.fillStyle = 'rgba(255,255,255,.015)'; for (let x = -400; x < W + 400; x += 60) ctx.fillRect(x, -200, 24, H + 400);
    const L = { x: 280, y: 220, w: 560, h: 640 }, R = { x: 1080, y: 220, w: 560, h: 640 };
    windowView(ctx, L.x, L.y, L.w, L.h, 'grey', t); windowFrame(ctx, L.x, L.y, L.w, L.h, false);
    windowView(ctx, R.x, R.y, R.w, R.h, 'amber', t); windowFrame(ctx, R.x, R.y, R.w, R.h, true);
    // light falling onto the floor from each window
    beam(ctx, 560, 870, 560, 470, 1250, 900, '#aab4cc', .12);
    beam(ctx, 1360, 870, 560, 1460, 1250, 900, '#ffcf91', .25);
    ctx.restore();
    // "nobody does": both windows breathe once
    const nb = Math.exp(-Math.pow((t - tNob - .4) / .5, 2));
    if (nb > .01) { ctx.fillStyle = rgba('#000000', .15 * nb); ctx.fillRect(0, 0, W, H); }
    motes(ctx, t, { seed: 88, n: 50, a: .18, hex: '#ffd29a', x0: 900, x1: 1920 });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 89: the window cross becomes a three-field board; three chalk circles ----------
const boardIntro = (T) => {
  const t0 = T.S('09a', 'But the second') - .2, tThree = T.S('09a', 'three things'), tWorked = T.S('09a', 'already worked');
  return (ctx, t, s) => {
    const morph = eio(lin(t0 + .2, t0 + 1.4, t));
    const z = mix(1, 1.08, lin(t0 + 1.4, s.b, t));
    ctx.save(); look(ctx, 960, 530, z);
    boardRoom(ctx, t, { morph, glass: (1 - sm(lin(t0, t0 + .9, t))) * .8 });
    const icons = ['flask', 'scale', 'door'];
    let pen = null;
    CIRC.forEach((c, i) => {
      const a = tThree + i * .55, u = eio(lin(a, a + .55, t));
      const p = chalkCircle(ctx, c.x, c.y, CR, u, { seed: 10 + i });
      if (u > 0 && u < 1) pen = p;
      text(ctx, String(i + 1), c.x - CR - 10, c.y - CR + 6, { size: 64, font: 'Instrument Serif Italic', color: C.cream, alpha: .8 * sm(lin(a, a + .3, t)) });
      const ui = lin(tWorked - .3 + i * .25, tWorked + .5 + i * .25, t);
      chalkIcon(ctx, icons[i], c.x, c.y, 1.1, ui);
      // a small tick: "already worked somewhere"
      const ut = lin(tWorked + .5 + i * .25, tWorked + .8 + i * .25, t);
      chalkLine(ctx, [[c.x + CR * .6, c.y + CR * .85], [c.x + CR * .72, c.y + CR * .98], [c.x + CR * .98, c.y + CR * .66]], ut, { hex: P.amber, w: 6 });
      if (ut > 0) addGlow(ctx, c.x + CR * .8, c.y + CR * .85, 60, .3 * ut, P.amber, '#fff3dd');
    });
    if (pen) chalkStick(ctx, pen[0], pen[1]);
    ctx.restore();
    motes(ctx, t, { seed: 89, n: 70, a: .2, hex: '#e8e4d8', speed: 6 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 90: through circle 1 into a lab: ideas fly in faster than the benches move, then the benches catch up ----------
const ideaLab = (T) => {
  const t0 = T.S('09a', 'First'), tFast = T.S('09a', 'as fast as'), tEnd = T.S('09a', 'In twenty');
  const cards = (() => { const r = prng(90), out = []; for (let i = 0; i < 16; i++) out.push({ d: r() * 1.6, y: 120 + r() * 300, slot: i % 8, row: Math.floor(i / 8), sp: .8 + r() * .5, rot: (r() - .5) * 1.2 }); return out; })();
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0b0e2c'], [1, '#1a1d4a']]);
    const camX = 960 + drift(t, 25), z = 1.04 + .04 * lin(s.a, s.b, t);
    ctx.save(); look(ctx, camX, 560, z);
    // back window with night hills (the next shot lives behind it)
    ctx.fillStyle = '#0f1640'; ctx.fillRect(1380, 180, 240, 240); skyGradInRect(ctx, 1380, 180, 240, 240, t);
    ctx.strokeStyle = '#2a2f62'; ctx.lineWidth = 10; ctx.strokeRect(1380, 180, 240, 240);
    // two benches in perspective
    const on = (i) => sm(lin(tFast + i * .12, tFast + i * .12 + .3, t));
    for (let row = 0; row < 2; row++) {
      const y = 640 + row * 170, x0 = 260 - row * 80, x1 = 1660 + row * 80;
      ctx.fillStyle = shade('#1c2160', row * -.03); ctx.fillRect(x0, y, x1 - x0, 30); ctx.fillStyle = '#10143c'; ctx.fillRect(x0 + 20, y + 30, x1 - x0 - 40, 120);
      for (let k = 0; k < 8; k++) {
        const bx = mix(x0 + 90, x1 - 90, k / 7), lit = on(row * 8 + k);
        // equipment: flask, box instrument, screen
        ctx.fillStyle = mixHex('#232a6a', '#2f3a8a', lit); ctx.fillRect(bx - 34, y - 54, 68, 54);
        ctx.fillStyle = rgba(P.cyan, .15 + .6 * lit); ctx.fillRect(bx - 24, y - 44, 48, 20);
        if (lit > 0) { addGlow(ctx, bx, y - 34, 70, .35 * lit, P.cyan, '#e8fbff'); cone(ctx, bx, y - 300, 300, 0, .3, '#bfe9ff', .12 * lit); }
        // a card landed here pulses as it is processed
      }
    }
    // cards: they arrive in a hurry and pile above the dark benches; on "as fast as ideas" they drop into the lit benches
    cards.forEach((c, i) => {
      const ta = t0 + .1 + c.d * .9, u = eout(lin(ta, ta + .9 * c.sp, t));
      if (u <= 0) return;
      const bx = mix(260 - c.row * 80 + 90, 1660 + c.row * 80 - 90, c.slot / 7), by = 640 + c.row * 170 - 70;
      const hx = 300 + i * 80, hy = 260 + (i % 4) * 46 + Math.sin(t * 2 + i) * 6;   // hovering queue (waiting)
      const drop = eio(lin(tFast + i * .06, tFast + i * .06 + .5, t));
      let x = mix(-100, hx, u), y = mix(c.y, hy, u);
      x = mix(x, bx, drop); y = mix(y, by, drop);
      const a = 1 - sm(lin(tFast + i * .06 + .5, tFast + i * .06 + .9, t)) * .8;
      ideaCard(ctx, x, y, .9, c.rot * (1 - u) + Math.sin(t * 3 + i) * .05 * (1 - drop), a, .45);
    });
    // the last card leaves through the window
    const uOut = ein(lin(tEnd - 1.1, tEnd + .1, t));
    if (uOut > 0) ideaCard(ctx, mix(900, 1500, uOut), mix(500, 300, uOut), mix(1, .5, uOut), .3, 1, .8);
    ctx.restore();
    motes(ctx, t, { seed: 90, n: 40, a: .15 });
    finish(ctx, t, { vig: .55 });
  };
};
function skyGradInRect(ctx, x, y, w, h, t) {
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, '#0a0c26'); g.addColorStop(1, '#2c3a7e'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#121845'; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.quadraticCurveTo(x + w * .3, y + h * .55, x + w * .6, y + h * .7); ctx.quadraticCurveTo(x + w * .8, y + h * .6, x + w, y + h * .68); ctx.lineTo(x + w, y + h); ctx.fill();
  const r = prng(4); for (let i = 0; i < 20; i++) { ctx.fillStyle = rgba(C.cream, .3 + .3 * Math.sin(t * 2 + i)); ctx.fillRect(x + r() * w, y + r() * h * .5, 2, 2); }
  ctx.restore();
}

// ---------- 91: Berkeley at night, the lab switches itself on, nobody there ----------
const berkeley = (T) => {
  const t0 = T.S('09a', 'In twenty'), tRan = T.S('09a', 'ran itself');
  return (ctx, t, s) => {
    const z = mix(1.0, 1.1, sine(lin(s.a, s.b, t)));
    bg(ctx, [[0, '#090b24'], [1, '#141844']]);
    ctx.save(); look(ctx, 960 + drift(t, 20), 540, z);
    // the big back window: Berkeley hills, the campus tower, the bay
    ctx.save(); ctx.beginPath(); ctx.rect(120, 120, 1680, 420); ctx.clip();
    const g = ctx.createLinearGradient(0, 120, 0, 540); g.addColorStop(0, '#0a0c26'); g.addColorStop(1, '#2e3e86'); ctx.fillStyle = g; ctx.fillRect(120, 120, 1680, 420);
    const r = prng(91); for (let i = 0; i < 90; i++) { ctx.fillStyle = rgba(C.cream, (.2 + .5 * r()) * (.6 + .4 * Math.sin(t * 2 + i))); ctx.fillRect(120 + r() * 1680, 120 + r() * 220, 2, 2); }
    addGlow(ctx, 1560, 200, 70, .5, '#cfe6ff', '#ffffff');
    hill(ctx, [[0, 470], [300, 380], [620, 410], [900, 350], [1250, 400], [1600, 360], [1920, 420]], { col: '#1a2260' });
    hill(ctx, [[0, 520], [400, 470], [800, 500], [1200, 470], [1920, 500]], { col: '#121845' });
    // campus tower
    ctx.fillStyle = '#0e133c'; ctx.fillRect(700, 330, 34, 170); ctx.beginPath(); ctx.moveTo(694, 332); ctx.lineTo(717, 290); ctx.lineTo(740, 332); ctx.fill();
    ctx.fillStyle = rgba('#ffd29a', .7); ctx.fillRect(710, 350, 14, 10); addGlow(ctx, 717, 355, 30, .4, P.amber, '#fff3dd');
    for (let i = 0; i < 40; i++) { ctx.fillStyle = rgba(r() < .7 ? '#ffd29a' : P.cyan, .5 + .4 * Math.sin(t * 3 + i)); ctx.fillRect(140 + r() * 1640, 480 + r() * 50, 3, 3); }
    ctx.restore();
    ctx.strokeStyle = '#1b2052'; ctx.lineWidth = 14; ctx.strokeRect(120, 120, 1680, 420); for (let k = 1; k < 4; k++) ctx.fillRect(120 + k * 420 - 5, 120, 10, 420);
    // floor + machines
    ctx.fillStyle = '#0e1238'; ctx.fillRect(-200, 700, W + 400, 600);
    ctx.fillStyle = '#151a4a'; ctx.fillRect(-200, 690, W + 400, 14);
    // ceiling lamps switch on one after another
    for (let i = 0; i < 6; i++) {
      const lx = 220 + i * 300, lt = t0 + .5 + i * .28, on = sm(lin(lt, lt + .2, t)) * (.85 + .15 * Math.sin(t * 40 + i) * (1 - lin(lt, lt + .6, t)));
      ctx.fillStyle = '#1f255c'; ctx.fillRect(lx - 60, 70, 120, 12);
      if (on > 0) { cone(ctx, lx, 84, 760, 0, .34, '#d8f3ff', .22 * on); pool(ctx, lx, 820, 260, 60, '#bfe9ff', .18 * on); }
    }
    // furnaces + conveyor of crucibles + idle robot arm
    for (let i = 0; i < 3; i++) { const fx = 330 + i * 260; ctx.fillStyle = '#1b2058'; ctx.fillRect(fx - 90, 560, 180, 180); ctx.fillStyle = rgba('#ff8a3d', .5 + .3 * Math.sin(t * 2 + i)); ctx.fillRect(fx - 40, 620, 80, 40); addGlow(ctx, fx, 640, 90, .35, '#ff7a2e', '#fff0c8'); }
    ctx.fillStyle = '#20265e'; ctx.fillRect(1000, 720, 820, 26);
    for (let i = 0; i < 9; i++) { const cx = 1000 + ((i * 100 + (t - t0) * 60) % 820); crucible(ctx, cx, 716, 0, .8, .7); }
    robotArm(ctx, 1180, 800, 1290 + Math.sin(t * 1.3) * 40, 600 + Math.cos(t * 1.1) * 20, { l1: 220, l2: 200, w: 36 });
    // a desk chair, empty, still turning a little
    ctx.save(); ctx.translate(880, 830); ctx.rotate(Math.sin(t * .7) * .05); ctx.fillStyle = '#141947'; ctx.fillRect(-40, -90, 80, 70); ctx.fillRect(-46, -20, 92, 16); ctx.fillRect(-4, -4, 8, 40); ctx.restore();
    ctx.restore();
    label(ctx, t, t0 + .6, 110, 160, 'A-Lab, Berkeley', 'Nature 2023');
    void tRan;
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 92: powders, furnace, measure, AI picks the next try; three loops, each faster ----------
const robotLoop = (T) => {
  const t0 = T.S('09a', 'Robots mixed') - .2, tAI = T.S('09a', 'an AI chose');
  const durs = [2.4, 1.8, 1.3, 1.0, .9, .8];
  const BASE = [920, 930], RACK = (k) => [470 + k * 46, 700], HOP = [740, 450], FUR = [1300, 640], HOME = [930, 470];
  const keys = [[0, HOME], [.14, null], [.22, null], [.36, HOP], [.44, HOP], [.6, FUR], [.66, FUR], [.8, HOME], [1, HOME]];
  return (ctx, t, s) => {
    // which loop / phase
    let tt = t - t0, k = 0; while (k < durs.length - 1 && tt > durs[k]) { tt -= durs[k]; k++; }
    const p = clamp(tt / durs[k]), slot = (k * 3 + 1) % 6;
    const pts = keys.map(([q, P0]) => [q, P0 || RACK(slot)]);
    let i = 0; while (i < pts.length - 2 && p > pts[i + 1][0]) i++;
    const v = eio(lin(pts[i][0], pts[i + 1][0], p)), ex = mix(pts[i][1][0], pts[i + 1][1][0], v), ey = mix(pts[i][1][1], pts[i + 1][1][1], v);
    const holding = p > .2 && p < .62, inFurnace = p >= .62 ? 1 : 0;
    bg(ctx, [[0, '#0b0e2c'], [1, '#191c48']]);
    ctx.save(); look(ctx, 960 + drift(t, 15), 560, 1.0 + .03 * Math.sin(t * .4));
    // bench
    ctx.fillStyle = '#1a1f58'; ctx.fillRect(160, 760, 1600, 26); ctx.fillStyle = '#0f1340'; ctx.fillRect(180, 786, 1560, 300);
    // rack with crucibles (the slot the AI picks is ringed)
    ctx.fillStyle = '#20265e'; ctx.fillRect(430, 712, 300, 14);
    for (let j = 0; j < 6; j++) { if (holding && j === slot) continue; crucible(ctx, RACK(j)[0], 712, 0, .8, j < k + 1 ? 0 : 0); }
    // hopper with powder
    ctx.fillStyle = '#262d70'; ctx.beginPath(); ctx.moveTo(640, 230); ctx.lineTo(840, 230); ctx.lineTo(770, 360); ctx.lineTo(710, 360); ctx.fill();
    ctx.fillStyle = '#d8d0c0'; ctx.beginPath(); ctx.moveTo(660, 250); ctx.lineTo(820, 250); ctx.lineTo(790, 300); ctx.lineTo(690, 300); ctx.fill();
    const pour = p > .36 && p < .46 ? 1 : 0;
    if (pour) { const r = prng(Math.floor(t * 30)); for (let n = 0; n < 40; n++) { ctx.fillStyle = rgba(['#e8e0d0', '#8fe6ff', '#ffd29a'][n % 3], .8); ctx.fillRect(740 + (r() - .5) * 18, 360 + r() * 70, 3, 3); } }
    // furnace
    const heat = p > .62 && p < .82 ? Math.sin(lin(.62, .82, p) * Math.PI) : 0;
    ctx.fillStyle = '#1f255f'; ctx.beginPath(); ctx.roundRect(1190, 480, 260, 280, 18); ctx.fill();
    ctx.fillStyle = mixHex('#3a1a10', '#ff8a3d', .35 + .65 * heat); ctx.fillRect(1240, 560, 160, 120);
    addGlow(ctx, 1320, 620, 160 + 120 * heat, .35 + .5 * heat, '#ff7a2e', '#fff0c8');
    if (inFurnace && p < .82) crucible(ctx, 1320, 676, heat, .9, 1);
    // monitor: measurement curve + next pick
    ctx.fillStyle = '#121647'; ctx.beginPath(); ctx.roundRect(1380, 150, 420, 250, 12); ctx.fill(); ctx.strokeStyle = rgba(P.cyan, .4); ctx.lineWidth = 2; ctx.stroke();
    const done = k + (p > .8 ? 1 : 0), ys = [300, 250, 270, 200, 215, 180, 170];
    const pts2 = []; for (let j = 0; j <= done && j < ys.length; j++) pts2.push([1420 + j * 55, ys[j] + 10]);
    if (pts2.length > 1) glowLine(ctx, pts2, 1, { color: C.cyan, width: 3, glowW: 12 });
    pts2.forEach(([x, y]) => { ctx.fillStyle = C.cyanWhite; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); });
    const pick = p > .8 ? 1 : 0;
    text(ctx, t >= tAI - .2 ? 'AI · NEXT TRY' : 'MEASURE', 1410, 190, { size: 18, weight: 600, color: C.muted, spacing: 4 });
    if (pick && t >= tAI - .3) { const nx = RACK((slot + 3) % 6); const a = sm(lin(.8, .9, p)); ctx.strokeStyle = rgba(P.cyan, a); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(nx[0], 690, 34 + 4 * Math.sin(t * 12), 0, 7); ctx.stroke(); addGlow(ctx, nx[0], 690, 60, .5 * a, P.cyan, '#e8fbff'); glowLine(ctx, [[1590, 400], [1300, 560], [nx[0], 655]], a, { color: C.cyan, width: 2, glowW: 8, alpha: .6, dash: [8, 10] }); }
    // arm
    const kk = robotArm(ctx, BASE[0], BASE[1], ex, ey, { grip: holding ? 1 : 0, l1: 340, l2: 320, w: 50 });
    if (holding) crucible(ctx, kk.tx, kk.ty + 62, 0, .9, p > .44 ? 1 : lin(.36, .44, p));
    ctx.restore();
    text(ctx, `TRY ${String(k + 1).padStart(2, '0')}`, 110, 140, { size: 22, weight: 600, color: C.muted, spacing: 6 });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 93: a shelf fills with new crystals; 41 in 17 days ----------
const SHELF = (() => { const out = []; for (let row = 0; row < 4; row++) for (let i = 0; i < 11; i++) out.push({ x: 720 + i * 100, y: 300 + row * 190, row, i }); return out; })();
function shelfWall(ctx, t, nShown, tPop, { dimSome = 0 } = {}) {
  bg(ctx, [[0, '#0b0e2c'], [1, '#171a44']]);
  pool(ctx, 1220, 520, 900, 520, '#8fe6ff', .07);
  for (let row = 0; row < 4; row++) { const y = 300 + row * 190; ctx.fillStyle = '#2a2050'; ctx.fillRect(640, y + 2, 1160, 16); ctx.fillStyle = 'rgba(255,210,154,.12)'; ctx.fillRect(640, y + 2, 1160, 3); }
  const r = prng(93);
  SHELF.forEach((j, n) => {
    const col = JAR_COLS[Math.floor(r() * JAR_COLS.length)], seed = 10 + n;
    if (n >= nShown) return;
    const ap = tPop ? back(clamp((t - tPop[n]) / .35)) : 1;
    const dim = dimSome && n % 3 === 1 ? dimSome : 0;
    jar(ctx, j.x, j.y, .95 * ap, col, (.45 + .15 * Math.sin(t * 2 + n)) * (1 - .7 * dim), seed);
  });
}
const shelfFill = (T) => {
  const t0 = T.S('09a', 'In a little'), tEnd = T.S('09a', 'Other scientists');
  const tPop = SHELF.map((_, n) => t0 + .2 + n * (3.6 / 41));
  return (ctx, t, s) => {
    const n = clamp(Math.floor((t - t0 - .2) / (3.6 / 41)) + 1, 0, 41);
    ctx.save(); look(ctx, 1000, 540, mix(1.06, 1.0, eio(lin(s.a, s.b, t))));
    shelfWall(ctx, t, n, tPop);
    ctx.restore();
    // counter + days
    const a = sm(lin(t0, t0 + .5, t));
    text(ctx, String(n), 330, 520, { size: 220, font: 'Instrument Serif', align: 'center', alpha: a, color: C.cream });
    text(ctx, 'NEW MATERIALS', 330, 580, { size: 20, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 6 });
    const day = clamp(Math.ceil(lin(t0 + .2, t0 + 3.8, t) * 17), 1, 17);
    for (let d = 0; d < 17; d++) { ctx.fillStyle = d < day ? rgba(P.amber, .9 * a) : rgba(C.muted, .25 * a); ctx.fillRect(160 + d * 20, 640, 14, 14); }
    text(ctx, `DAY ${day} OF 17`, 330, 700, { size: 18, weight: 600, color: C.muted, align: 'center', alpha: a, spacing: 5 });
    source(ctx, t, t0 + 1, tEnd + 1, 'Nature 2023 · novelty disputed, corrected 2026', { x: 110, y: 1000 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 94a: a red margin note, healthy doubt: two scientists look closer ----------
const shelfDoubt = (T) => {
  const t0 = T.S('09a', 'Other scientists'), tQ = T.S('09a', 'questioned'), tNew = T.S('09a', 'truly new');
  return (ctx, t, s) => {
    ctx.save(); look(ctx, mix(1000, 1100, eio(lin(s.a, s.b, t))), 540, mix(1.0, 1.08, eio(lin(s.a, s.b, t))));
    shelfWall(ctx, t, 41, null, { dimSome: sm(lin(tNew, tNew + .8, t)) * .6 });
    // question marks over every third jar
    SHELF.slice(0, 41).forEach((j, n) => { if (n % 3 !== 1) return; const a = back(clamp((t - tNew - n * .02) / .4)); if (a <= 0) return; text(ctx, '?', j.x, j.y - 92 - 6 * Math.sin(t * 3 + n), { size: 46 * a, font: 'Instrument Serif Italic', color: P.rose, align: 'center' }); });
    // the note slaps onto the shelf
    const u = eout(lin(tQ - .1, tQ + .4, t));
    if (u > 0) {
      ctx.save(); ctx.translate(mix(1900, 1240, u), mix(120, 240, u)); ctx.rotate(mix(.6, -.06, u) + Math.sin(t * 1.5) * .01);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(-116, -66, 240, 150);
      ctx.fillStyle = '#f2e6c8'; ctx.fillRect(-120, -72, 240, 150);
      ctx.fillStyle = '#c94a40'; ctx.fillRect(-120, -72, 240, 10);
      text(ctx, 'disputed?', 0, 18, { size: 56, font: 'Instrument Serif Italic', color: '#c94a40', align: 'center' });
      ctx.restore();
    }
    ctx.restore();
    // two scientists in the foreground, one points
    person(ctx, 520, 1080, 420, t, { coat: '#d9d6e8', hood: false, skin: '#a8714f', look: .5, flip: false });
    person(ctx, 360, 1090, 440, t, { coat: '#c9c6dc', hood: false, skin: '#e0b48f', hair: '#3b2a1c', arm: (c, sh) => { const a = -.9 + .1 * Math.sin(t * 2); c.beginPath(); c.moveTo(3, sh + 5); c.lineTo(3 + Math.cos(a) * 30, sh + 5 + Math.sin(a) * 30); c.stroke(); } });
    finish(ctx, t, { vig: .55 });
    void t0;
  };
};

// ---------- 94b: the robot hand trembles over a dish of living cells ----------
const delicate = (T) => {
  const t0 = T.S('09a', 'That debate'), tStr = T.S('09a', 'robots still');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0c0f2e'], [1, '#1b1e4c']]);
    // soft bokeh lab behind
    const r = prng(94); for (let i = 0; i < 26; i++) pool(ctx, r() * W, 200 + r() * 500, 40 + r() * 70, 40 + r() * 70, r() < .5 ? P.cyan : P.amber, .08 + r() * .08);
    ctx.save(); look(ctx, 960, 560, mix(1.0, 1.15, eio(lin(s.a, s.b, t))));
    // petri dish with cells
    ctx.fillStyle = '#121647'; ctx.fillRect(400, 820, 1120, 30);
    ctx.save(); ctx.translate(960, 760); ctx.scale(1, .32);
    ctx.fillStyle = 'rgba(160,230,255,.10)'; ctx.beginPath(); ctx.arc(0, 0, 330, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(216,247,255,.5)'; ctx.lineWidth = 6; ctx.stroke();
    const rc = prng(7);
    for (let i = 0; i < 26; i++) {
      const q = rc() * 6.283, R = rc() * 280, cx = Math.cos(q) * R + Math.sin(t * .8 + i) * 6, cy = Math.sin(q) * R + Math.cos(t * .7 + i) * 6, rr = 22 + rc() * 18;
      ctx.fillStyle = rgba(i % 4 ? '#e8a3c0' : '#ffd29a', .55); ctx.beginPath();
      for (let k = 0; k <= 20; k++) { const a = k / 20 * 6.283, w = rr * (1 + .12 * Math.sin(a * 3 + t * 2 + i)); k ? ctx.lineTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w) : ctx.moveTo(cx + Math.cos(a) * w, cy + Math.sin(a) * w); }
      ctx.fill(); ctx.fillStyle = rgba('#7a3b5a', .6); ctx.beginPath(); ctx.arc(cx, cy, rr * .3, 0, 7); ctx.fill();
    }
    ctx.restore();
    // the gripper with a pipette, trembling once "robots still struggle"
    const shake = lin(tStr - .3, tStr + .3, t), jx = Math.sin(t * 37) * 7 * shake + Math.sin(t * 23) * 4 * shake, jy = Math.cos(t * 31) * 5 * shake;
    const tipY = mix(300, 600, eio(lin(t0, t0 + 1.8, t))) - 20 * shake + jy, tipX = 960 + jx;
    robotArm(ctx, 1600, 1000, tipX + 20, tipY - 260, { l1: 420, l2: 380, w: 50, grip: 1, up: -1 });
    ctx.fillStyle = 'rgba(220,240,255,.75)'; ctx.beginPath(); ctx.moveTo(tipX + 10, tipY - 220); ctx.lineTo(tipX + 30, tipY - 220); ctx.lineTo(tipX + 22, tipY); ctx.lineTo(tipX + 18, tipY); ctx.fill();
    // droplet wobbling at the tip
    const dr = 7 + 2 * Math.sin(t * 9); ctx.fillStyle = 'rgba(143,230,255,.85)'; ctx.beginPath(); ctx.ellipse(tipX + 20, tipY + dr, dr * .8, dr, 0, 0, 7); ctx.fill();
    addGlow(ctx, tipX + 20, tipY + dr, 40, .4, P.cyan, '#e8fbff');
    if (shake > .2) { ctx.strokeStyle = rgba(P.amber, .5 * shake); ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(tipX + 20, tipY - 100, 40 + k * 16 + (t * 30 % 16), -.5, .5); ctx.stroke(); ctx.beginPath(); ctx.arc(tipX + 20, tipY - 100, 40 + k * 16 + (t * 30 % 16), Math.PI - .5, Math.PI + .5); ctx.stroke(); } }
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 95: labs that work through the night: a train of lit labs, ideas board instead of waiting ----------
const labTrain = (T) => {
  const t0 = T.S('09a', 'But the idea'), tThou = T.S('09a', 'so a thousand');
  const V = 160;
  return (ctx, t, s) => {
    const pull = eio(lin(tThou - .4, tThou + 2.2, t)), z = mix(1.0, .62, pull);
    skyGrad(ctx, { t, stars: .7, bottom: '#34489a' });
    addGlow(ctx, 1500, 160, 90, .5, '#cfe6ff', '#ffffff');
    ctx.save(); look(ctx, 960, mix(600, 560, pull), z);
    // far trains on other tracks (seen when the camera pulls back)
    for (let L = 0; L < 4; L++) {
      const y = [300, 380, 880, 960][L], sp = [70, 90, -80, -60][L], sc = [.45, .55, .8, .7][L];
      ctx.fillStyle = rgba(P.cyan, .25); ctx.fillRect(-1500, y + 2, W + 3000, 2);
      for (let c = 0; c < 7; c++) { const x = ((c * 260 * sc + (t - t0) * sp + L * 400) % (W * 2.6)) - W * .8; ctx.fillStyle = '#141a4c'; ctx.fillRect(x, y - 70 * sc, 240 * sc, 70 * sc); ctx.fillStyle = rgba(c % 2 ? P.amber : P.cyanSoft, .75); ctx.fillRect(x + 10 * sc, y - 56 * sc, 220 * sc, 24 * sc); addGlow(ctx, x + 120 * sc, y - 44 * sc, 80 * sc, .25, c % 2 ? P.amber : P.cyan, '#ffffff'); }
    }
    hill(ctx, [[-800, 700], [0, 640], [500, 670], [1100, 630], [1700, 660], [2700, 640]], { col: '#151a4c' });
    // main track
    ctx.fillStyle = '#0c1036'; ctx.fillRect(-1500, 700, W + 3000, 600);
    ctx.fillStyle = rgba(P.cyan, .45); ctx.fillRect(-1500, 700, W + 3000, 3);
    // platform (left) with the queue of ideas
    ctx.fillStyle = '#1b2058'; ctx.fillRect(80, 700, 640, 34); ctx.fillStyle = rgba(P.amber, .3); ctx.fillRect(80, 700, 640, 3);
    lampPostSimple(ctx, 140, 700, t); lampPostSimple(ctx, 620, 700, t);
    // train of labs, arriving from the right
    const cars = 6, CW = 330, PL = 420;
    const headX = 900 - (t - t0) * V;
    const carX = (c) => headX + c * (CW + 14);
    for (let c = 0; c < cars; c++) {
      const x = carX(c);
      ctx.fillStyle = '#18205a'; ctx.beginPath(); ctx.roundRect(x, 560, CW, 140, 14); ctx.fill();
      ctx.fillStyle = '#0f1440'; ctx.fillRect(x, 690, CW, 10);
      const wg = ctx.createLinearGradient(0, 580, 0, 660); wg.addColorStop(0, '#fff1d6'); wg.addColorStop(1, c % 2 ? '#ffb35c' : '#8fe6ff');
      ctx.fillStyle = wg; ctx.fillRect(x + 16, 582, CW - 32, 76);
      ctx.fillStyle = '#1c2160'; ctx.fillRect(x + 16, 640, CW - 32, 18);
      for (let a = 0; a < 3; a++) { const ax = x + 60 + a * 100, ph = t * 4 + c + a; ctx.strokeStyle = '#1c2160'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ax, 640); ctx.lineTo(ax + Math.sin(ph) * 16, 610); ctx.lineTo(ax + 22 + Math.sin(ph * 1.3) * 12, 600 + Math.cos(ph) * 8); ctx.stroke(); }
      addGlow(ctx, x + CW / 2, 620, 220, .35, c % 2 ? P.amber : P.cyan, '#ffffff');
      ctx.fillStyle = '#0a0d30'; for (const wx of [x + 60, x + CW - 60]) { ctx.beginPath(); ctx.arc(wx, 702, 16, 0, 7); ctx.fill(); }
    }
    // ideas: a queue on the platform; each car takes four as it passes the platform
    for (let i = 0; i < 24; i++) {
      const c = Math.floor(i / 4), k = i % 4, qx = 150 + (i % 12) * 46, qy = 674 - Math.floor(i / 12) * 34;
      const tPass = t0 + (900 + c * (CW + 14) + CW / 2 - PL) / V, hop = tPass - .5 + k * .18, u = eio(lin(hop, hop + .6, t));
      if (u >= 1) continue;
      const tx = carX(c) + CW / 2 + (k - 1.5) * 50;
      const x = mix(qx, tx, u), y = mix(qy + Math.sin(t * 3 + i) * 3, 620, u) - Math.sin(u * Math.PI) * 110;
      ideaCard(ctx, x, y, .5, Math.sin(t * 2 + i) * .1, 1 - sm(lin(.85, 1, u)), .35);
    }
    // a stream of more ideas arriving from the sky once the camera pulls back
    if (pull > 0) for (let i = 0; i < 40; i++) { const ph = ((t * .5 + i * .13) % 1), x = -900 + (i * 97 % 3600), y = mix(-300, 600, ph); ideaCard(ctx, x + Math.sin(ph * 6 + i) * 40, y, .5, .2, pull * Math.sin(ph * Math.PI), .3); }
    ctx.restore();
    fogBand(ctx, t, H * .8, 200, { a: .18, hex: '#8ab8e8', seed: 95 });
    finish(ctx, t, { vig: .55 });
  };
};
function lampPostSimple(ctx, x, y, t) { ctx.fillStyle = '#0d0f2e'; ctx.fillRect(x - 4, y - 260, 8, 260); ctx.fillRect(x - 4, y - 260, 44, 7); cone(ctx, x + 36, y - 250, 270, 0, .3, P.amber, .35); }

// ---------- 96: circle 2: a balance; evidence falls in, the needle answers at once ----------
const boardScale = (T) => {
  const t0 = T.S('09a', 'Second', 1), tEv = T.S('09a', 'evidence'), tSafe = T.S('09a', 'without cutting');
  return (ctx, t, s) => {
    const zz = eio(lin(t0 + .6, s.b, t));
    ctx.save(); look(ctx, mix(960, 960, zz), mix(520, 560, zz), mix(1, 1.9, zz));
    boardRoom(ctx, t);
    CIRC.forEach((c, i) => { chalkCircle(ctx, c.x, c.y, CR, 1, { seed: 10 + i, a: i === 1 ? .95 : .45 }); text(ctx, String(i + 1), c.x - CR - 10, c.y - CR + 6, { size: 64, font: 'Instrument Serif Italic', color: C.cream, alpha: i === 1 ? .85 : .35 }); });
    chalkIcon(ctx, 'flask', CIRC[0].x, CIRC[0].y, 1.1, 1);
    chalkIcon(ctx, 'door', CIRC[2].x, CIRC[2].y, 1.1, 1);
    // live balance in circle 2 (glowing chalk)
    const c = CIRC[1], nW = clamp(Math.floor((t - tEv + .3) / .45) + 1, 0, 6);
    const tilt = Math.sin(clamp(nW / 6) * .45) + Math.exp(-((t - tEv) % .45) * 6) * .06 * Math.sin(t * 20) * (nW > 0 && nW < 6 ? 1 : 0);
    ctx.save(); ctx.translate(c.x, c.y + 20);
    chalkLine(ctx, [[0, -80], [0, 70]], 1, { w: 5 }); chalkLine(ctx, [[-50, 70], [50, 70]], 1, { w: 5 });
    ctx.save(); ctx.translate(0, -80); ctx.rotate(-tilt * .5);
    chalkLine(ctx, [[-100, 0], [100, 0]], 1, { w: 5 });
    for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 100, 0); ctx.rotate(tilt * .5); chalkLine(ctx, [[0, 0], [-34, 60], [34, 60], [0, 0]], 1, { w: 3 }); chalkLine(ctx, [[-40, 60], [40, 60]], 1, { w: 5 });
      if (sx < 0) for (let k = 0; k < nW; k++) { const fall = eout(clamp((t - tEv - k * .45 + .3) / .3)); ctx.fillStyle = rgba(P.amber, .9); ctx.fillRect(-36 + (k % 3) * 25, mix(-200, 40 - Math.floor(k / 3) * 18, fall), 20, 16); }
      ctx.restore(); }
    ctx.restore();
    // needle
    ctx.save(); ctx.rotate(-tilt * .9); chalkLine(ctx, [[0, -80], [0, -150]], 1, { hex: P.amber, w: 5 }); ctx.restore();
    addGlow(ctx, 0, -110, 120, .25, P.amber, '#fff3dd');
    ctx.restore();
    // safety checks stay ticked
    const us = lin(tSafe, tSafe + .8, t);
    for (let k = 0; k < 3; k++) { const ux = clamp(us * 3 - k); if (ux <= 0) continue; const x = c.x - 60 + k * 60, y = c.y + 128; chalkLine(ctx, [[x - 12, y], [x - 3, y + 10], [x + 14, y - 12]], ux, { hex: '#9fe8c0', w: 5 }); }
    if (us > 0) text(ctx, 'safety', c.x, c.y + 175, { size: 26, font: 'Instrument Serif Italic', color: C.cream, align: 'center', alpha: .7 * sm(us) });
    ctx.restore();
    motes(ctx, t, { seed: 96, n: 60, a: .18, hex: '#e8e4d8', speed: 6 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 97: an old album, the page turns to 2020 ----------
const album = (T) => {
  const t0 = T.S('09a', "We've done");
  return (ctx, t, s) => {
    bg(ctx, [[0, '#120f22'], [1, '#231a2c']]);
    pool(ctx, 960, 560, 900, 420, '#ffcf91', .18);
    ctx.save(); look(ctx, 960, 560, mix(1.0, 1.12, eio(lin(s.a, s.b, t))));
    // desk
    ctx.fillStyle = '#2a1d16'; ctx.fillRect(-200, 820, W + 400, 400);
    // book: two pages
    const L = { x: 420, y: 260, w: 540, h: 560 }, R = { x: 960, y: 260, w: 540, h: 560 };
    ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(L.x + 20, L.y + 24, 1080, 560);
    ctx.fillStyle = '#3a2418'; ctx.fillRect(L.x - 20, L.y - 14, 1120, 590);
    const pg = (x, y, w, h, shade0) => { const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, shade0 ? '#d9cdb0' : '#efe4c8'); g.addColorStop(1, shade0 ? '#efe4c8' : '#d9cdb0'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); };
    pg(L.x, L.y, L.w, L.h, false);
    // left page: older photos (faded corners)
    ctx.fillStyle = 'rgba(120,90,60,.35)'; ctx.fillRect(L.x + 60, L.y + 70, 200, 150); ctx.fillRect(L.x + 290, L.y + 110, 190, 140); ctx.fillRect(L.x + 120, L.y + 300, 260, 180);
    pg(R.x, R.y, R.w, R.h, true);
    // right page (revealed): "2020" + photo of the map
    text(ctx, '2020', R.x + 270, R.y + 110, { size: 92, font: 'Instrument Serif', color: '#5a3f28', align: 'center' });
    ctx.fillStyle = '#1b2052'; ctx.fillRect(R.x + 150, R.y + 160, 240, 330);
    ctx.save(); ctx.beginPath(); smoothPath(ctx, GB, R.x + 190, R.y + 180, 160, 290); ctx.fillStyle = '#3a4a92'; ctx.fill(); ctx.restore();
    addGlow(ctx, R.x + 280, R.y + 400, 40, .5, P.amber, '#fff3dd');
    // the turning page
    const u = eio(lin(t0 - .1, t0 + .9, t));
    if (u < 1) {
      const w = R.w * Math.cos(u * Math.PI), x = w >= 0 ? R.x : R.x + w;
      ctx.fillStyle = w >= 0 ? '#e8dcc0' : '#d9cdb0'; ctx.fillRect(x, R.y, Math.abs(w), R.h);
      if (w >= 0) { ctx.fillStyle = 'rgba(120,90,60,.35)'; ctx.fillRect(R.x + 80 * Math.cos(u * Math.PI), R.y + 90, 200 * Math.cos(u * Math.PI), 160); }
      const sg = ctx.createLinearGradient(R.x, 0, R.x + 80, 0); sg.addColorStop(0, 'rgba(0,0,0,.25)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.fillRect(R.x, R.y, 80, R.h);
    }
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(958, L.y, 4, L.h);
    ctx.restore();
    motes(ctx, t, { seed: 97, n: 40, a: .2, hex: '#ffd29a' });
    finish(ctx, t, { vig: .6 });
  };
};

// ---------- 98: map of Britain: hospitals light up, one line joins them, several treatments travel at once ----------
const MAPB = { x: 560, y: 80, w: 720, h: 920 };
const hospitals = () => once('hosp', () => {
  const [c, x] = canvas(W, H); x.beginPath(); smoothPath(x, GB, MAPB.x, MAPB.y, MAPB.w, MAPB.h);
  const r = prng(98), out = [];
  while (out.length < 46) { const px = MAPB.x + r() * MAPB.w, py = MAPB.y + 60 + r() * (MAPB.h - 80); if (x.isPointInPath(px, py)) out.push([px, py]); }
  // one tour: start in the north, always hop to the nearest hospital not yet joined
  out.sort((a, b) => (a[1] - b[1]));
  const tour = [out.shift()];
  while (out.length) { const [lx, ly] = tour[tour.length - 1]; let bi = 0, bd = 1e9; out.forEach(([x2, y2], i) => { const d = Math.hypot(x2 - lx, y2 - ly); if (d < bd) { bd = d; bi = i; } }); tour.push(out.splice(bi, 1)[0]); }
  return tour;
});
const ukMap = (T) => {
  const t0 = T.S('09a', 'In March'), tSet = T.S('09a', 'set up'), tOne = T.S('09a', 'one trial'), tTest = T.S('09a', 'testing several');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#080b26'], [1, '#121a48']]);
    // sea lines
    ctx.strokeStyle = 'rgba(143,230,255,.05)'; ctx.lineWidth = 1; for (let y = 0; y < H; y += 18) { ctx.beginPath(); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, y + Math.sin(x * .01 + t + y) * 3); ctx.stroke(); }
    const z = mix(1.0, 1.06, lin(s.a, s.b, t));
    ctx.save(); look(ctx, 960, 540, z);
    for (const [shape, ox, oy, w, h] of [[GB, MAPB.x, MAPB.y, MAPB.w, MAPB.h], [NI, MAPB.x - 40, MAPB.y, MAPB.w, MAPB.h]]) {
      ctx.beginPath(); smoothPath(ctx, shape, ox, oy, w, h); ctx.fillStyle = '#1d2560'; ctx.fill(); ctx.strokeStyle = rgba(C.cream, .35); ctx.lineWidth = 2; ctx.stroke();
    }
    const hs = hospitals();
    hs.forEach(([x, y], i) => { const a = sm(lin(tSet - .4 + i * .03, tSet + i * .03, t)); if (a <= 0) return; ctx.fillStyle = rgba(C.cream, a); ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); addGlow(ctx, x, y, 26, .5 * a, P.cyan, '#e8fbff'); });
    // the line joining them
    const uL = eio(lin(tOne, tOne + 1.6, t));
    glowLine(ctx, hs, uL, { color: C.cyan, width: 2.5, glowW: 12 });
    // several treatments travel the line in parallel
    if (t > tTest - .2) {
      const cols = [P.amber, P.rose, '#b59cff', '#7fffd4'];
      cols.forEach((col, k) => {
        const q = (((t - tTest) * .22 + k * .25) % 1 + 1) % 1, f = q * (hs.length - 1), i0 = Math.floor(f), fr = f - i0;
        const [x0, y0] = hs[i0], [x1, y1] = hs[Math.min(i0 + 1, hs.length - 1)], x = mix(x0, x1, fr), y = mix(y0, y1, fr);
        ctx.save(); ctx.translate(x, y); ctx.rotate(.6); ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(-14, -7, 28, 14, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(-1, -7, 2, 14); ctx.restore();
        addGlow(ctx, x, y, 40, .5 * sm(lin(tTest - .2, tTest + .3, t)), col, '#ffffff');
      });
      // legend: four arms at once
      const la = sm(lin(tTest, tTest + .5, t));
      cols.forEach((col, k) => { ctx.fillStyle = rgba(col, la); ctx.beginPath(); ctx.roundRect(1380, 420 + k * 54, 36, 16, 8); ctx.fill(); text(ctx, ['treatment A', 'treatment B', 'treatment C', 'usual care'][k], 1432, 435 + k * 54, { size: 26, color: C.cream, alpha: la * .85 }); });
    }
    ctx.restore();
    label(ctx, t, t0 + .4, 110, 160, 'RECOVERY trial · UK', 'March 2020');
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 99: a hundred days later: a cheap steroid in a plain bottle lights up ----------
const bottle = (T) => {
  const t0 = T.S('09a', 'Within'), tSaved = T.S('09a', 'saved lives');
  return (ctx, t, s) => {
    const g = sm(lin(tSaved - .2, tSaved + .6, t));
    bg(ctx, [[0, mixHex('#0f0f26', '#2a1c1a', g)], [1, mixHex('#191834', '#4a2d1e', g)]]);
    ctx.save(); look(ctx, 960, 600, mix(1, 1.18, eio(lin(s.a, s.b, t))));
    ctx.fillStyle = '#211a2a'; ctx.fillRect(-200, 760, W + 400, 400);
    pool(ctx, 960, 770, 360, 50, '#ffcf91', .25 + .3 * g);
    // rays
    if (g > 0) { ctx.save(); ctx.globalCompositeOperation = 'screen'; for (let i = 0; i < 14; i++) { const a = i / 14 * 6.283 + t * .15; ctx.fillStyle = rgba('#ffd29a', .06 * g); ctx.beginPath(); ctx.moveTo(960, 600); ctx.lineTo(960 + Math.cos(a - .05) * 900, 600 + Math.sin(a - .05) * 900); ctx.lineTo(960 + Math.cos(a + .05) * 900, 600 + Math.sin(a + .05) * 900); ctx.fill(); } ctx.restore(); }
    // the bottle
    const bg2 = ctx.createLinearGradient(880, 0, 1040, 0); bg2.addColorStop(0, '#5a2a0e'); bg2.addColorStop(.4, mixHex('#a85a1e', '#ffb35c', g)); bg2.addColorStop(1, '#4a200c');
    ctx.fillStyle = bg2; ctx.beginPath(); ctx.roundRect(880, 520, 160, 240, 18); ctx.fill();
    ctx.fillStyle = '#efe9da'; ctx.beginPath(); ctx.roundRect(892, 470, 136, 62, 8); ctx.fill(); for (let i = 0; i < 8; i++) { ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fillRect(900 + i * 16, 474, 6, 54); }
    ctx.fillStyle = '#f3efe2'; ctx.fillRect(880, 590, 160, 90); ctx.fillStyle = '#c8661e'; ctx.fillRect(880, 600, 160, 8);
    ctx.fillStyle = 'rgba(40,30,30,.6)'; ctx.fillRect(900, 625, 110, 6); ctx.fillRect(900, 645, 80, 6);
    ctx.fillStyle = 'rgba(255,255,255,.22)'; ctx.fillRect(898, 530, 10, 220);
    addGlow(ctx, 960, 620, 260, .25 + .55 * g, P.amber, '#fff3dd');
    // tiny price tag on a string, swinging
    ctx.save(); ctx.translate(1032, 540); ctx.rotate(.3 + Math.sin(t * 1.6) * .12);
    ctx.strokeStyle = '#c9bfa8'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(40, 40); ctx.stroke();
    ctx.translate(40, 40); ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(34, -12); ctx.lineTo(34, 12); ctx.lineTo(0, 12); ctx.lineTo(-10, 0); ctx.fill();
    ctx.fillStyle = '#c8661e'; ctx.beginPath(); ctx.arc(17, 0, 6, 0, 7); ctx.fill();
    ctx.restore();
    ctx.restore();
    // day counter
    const day = Math.round(mix(1, 100, eio(lin(t0 + .2, t0 + 2.2, t))));
    text(ctx, `DAY ${day}`, 960, 170, { size: 30, weight: 600, color: C.cream, align: 'center', alpha: sm(lin(t0, t0 + .4, t)), spacing: 8 });
    ctx.fillStyle = rgba(C.muted, .3); ctx.fillRect(760, 200, 400, 3); ctx.fillStyle = rgba(P.amber, .9); ctx.fillRect(760, 200, 400 * (day / 100), 3);
    motes(ctx, t, { seed: 99, n: 50, a: .25 * (.3 + g), hex: '#ffd29a' });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 100: three ventilated patients; the light over one bed turns warm, its line calms ----------
const ward = (T) => {
  const t0 = T.S('09a', 'Among'), tCut = T.S('09a', 'it cut');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0b0d26'], [1, '#161a40']]);
    ctx.save(); look(ctx, 960 + drift(t, 20), 560, mix(1, 1.06, lin(s.a, s.b, t)));
    ctx.fillStyle = '#10143a'; ctx.fillRect(-200, 760, W + 400, 400);
    const warm = sm(lin(tCut, tCut + 1.2, t));
    for (let b = 0; b < 3; b++) {
      const bx = 380 + b * 580, isSaved = b === 1, w = isSaved ? warm : 0;
      // overhead light: cold red pulse → warm steady
      const pulse = .5 + .5 * Math.sin(t * 4 + b);
      const lc = mixHex('#e05a5a', '#ffcf91', w);
      ctx.fillStyle = '#1f255c'; ctx.fillRect(bx - 70, 80, 140, 14);
      cone(ctx, bx, 96, 700, 0, .3, lc, (.12 + .08 * pulse * (1 - w)) + .16 * w);
      // ventilator with bellows
      const br = Math.sin(t * (isSaved ? 1.4 : 2.2) + b);
      ctx.fillStyle = '#1d2360'; ctx.beginPath(); ctx.roundRect(bx - 250, 470, 90, 240, 10); ctx.fill();
      ctx.fillStyle = 'rgba(143,230,255,.25)'; ctx.fillRect(bx - 236, 560 + br * 14, 62, 90 - br * 14);
      // monitor
      ctx.fillStyle = '#121647'; ctx.beginPath(); ctx.roundRect(bx - 250, 330, 150, 110, 8); ctx.fill();
      const pts = []; for (let i = 0; i <= 40; i++) { const x = bx - 240 + i * 3.25, ph = t * 6 + i * .5; const jag = Math.sin(ph * 3.1) * 22 * (Math.sin(ph) > .7 ? 1 : .3), calm = Math.exp(-Math.pow(((i + t * 30) % 40) - 20, 2) / 4) * -26; pts.push([x, 390 + mix(jag, calm, w)]); }
      glowLine(ctx, pts, 1, { color: w > .5 ? '#7fffd4' : '#ff7a6e', width: 2, glowW: 8, head: false });
      // bed + patient breathing
      ctx.fillStyle = '#2a3070'; ctx.fillRect(bx - 150, 660, 330, 26); ctx.fillStyle = '#1a1f55'; ctx.fillRect(bx - 150, 686, 12, 90); ctx.fillRect(bx + 168, 686, 12, 90);
      ctx.fillStyle = '#e9e4d6'; ctx.beginPath(); ctx.ellipse(bx - 110, 645, 44, 18, 0, 0, 7); ctx.fill();
      ctx.fillStyle = mixHex('#c98f6a', '#d9a07a', w); ctx.beginPath(); ctx.ellipse(bx - 100, 630, 22, 18, 0, 0, 7); ctx.fill();
      const chest = 6 + Math.sin(t * (isSaved ? 1.4 : 2.2) + b) * (isSaved ? 6 : 3);
      ctx.fillStyle = mixHex('#7d8ab8', '#c9b9e0', w); ctx.beginPath(); ctx.moveTo(bx - 80, 662); ctx.quadraticCurveTo(bx, 640 - chest, bx + 170, 650); ctx.lineTo(bx + 170, 664); ctx.lineTo(bx - 80, 664); ctx.fill();
      ctx.strokeStyle = 'rgba(216,247,255,.4)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(bx - 160, 560); ctx.quadraticCurveTo(bx - 140, 640, bx - 110, 630); ctx.stroke();
      // nightstand with a small bottle
      ctx.fillStyle = '#1c2160'; ctx.fillRect(bx + 190, 610, 80, 150); ctx.fillStyle = '#a85a1e'; ctx.fillRect(bx + 218, 580, 22, 32); ctx.fillStyle = '#efe9da'; ctx.fillRect(bx + 218, 574, 22, 8);
      if (w > 0) { pool(ctx, bx, 680, 300, 90, '#ffcf91', .3 * w); addGlow(ctx, bx, 120, 160, .5 * w, P.amber, '#fff3dd'); }
    }
    ctx.restore();
    const la = sm(lin(tCut + .4, tCut + 1, t));
    text(ctx, 'ON VENTILATORS: ABOUT ONE THIRD FEWER DEATHS', 960, 990, { size: 22, weight: 600, color: C.cream, align: 'center', alpha: .85 * la, spacing: 5 });
    void t0;
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 101: the vaccine: twelve months orbit the vial ----------
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const vaccine = (T) => {
  const t0 = T.S('09a', 'The vaccines');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#090c28'], [1, '#162054']]);
    pool(ctx, 960, 560, 700, 500, P.cyan, .08);
    ctx.save(); look(ctx, 960, 540, mix(1.0, 1.08, lin(s.a, s.b, t)));
    const sweep = clamp((t - t0 + .2) / 2.4), rot = t * .25;
    // ring behind
    const drawRing = (front) => MONTHS.forEach((m, i) => {
      const q = i / 12 * 6.283 + rot, x = 960 + Math.cos(q) * 480, y = 560 + Math.sin(q) * 130, isFront = Math.sin(q) > 0;
      if (isFront !== front) return;
      const on = i <= Math.floor(sweep * 11.99), hl = i === 0 || i === 11;
      const sc = mix(.75, 1.15, (Math.sin(q) + 1) / 2);
      text(ctx, m, x, y, { size: 30 * sc, weight: 600, color: on ? (hl ? P.amber : C.cyanWhite) : C.muted, align: 'center', alpha: on ? .95 : .35, spacing: 3 });
      if (on && hl) addGlow(ctx, x, y - 10, 60, .5, P.amber, '#fff3dd');
    });
    ctx.strokeStyle = rgba(P.cyan, .25); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(960, 550, 480, 130, 0, Math.PI, 2 * Math.PI); ctx.stroke();
    drawRing(false);
    // vial
    ctx.save(); ctx.translate(960, 560); ctx.rotate(Math.sin(t * .8) * .04);
    ctx.fillStyle = 'rgba(200,235,255,.15)'; ctx.strokeStyle = 'rgba(216,247,255,.7)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(-60, -150, 120, 260, 18); ctx.fill(); ctx.stroke();
    const lg = ctx.createLinearGradient(0, -40, 0, 110); lg.addColorStop(0, '#8fe6ff'); lg.addColorStop(1, '#2fa6d6'); ctx.fillStyle = lg; ctx.beginPath(); ctx.roundRect(-52, -40 + Math.sin(t * 2) * 3, 104, 142, 12); ctx.fill();
    ctx.fillStyle = '#6a7090'; ctx.fillRect(-46, -200, 92, 54); ctx.fillStyle = '#9aa0c0'; ctx.fillRect(-46, -200, 92, 10);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-44, -130, 12, 220);
    ctx.restore();
    addGlow(ctx, 960, 590, 240, .4, P.cyan, '#e8fbff');
    ctx.strokeStyle = rgba(P.cyan, .4); ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(960, 550, 480, 130, 0, 0, Math.PI); ctx.stroke();
    drawRing(true);
    ctx.restore();
    const la = sm(lin(t0 + .5, t0 + 1.1, t));
    text(ctx, 'SEQUENCE JAN 2020  →  AUTHORISED DEC 2020', 960, 960, { size: 22, weight: 600, color: C.cream, align: 'center', alpha: .85 * la, spacing: 5 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 102: four boxes, first one after another, then side by side; money up front, a reviewer reading as data arrives ----------
const BOXES = [['TRIALS', P.cyan], ['FACTORY', '#b59cff'], ['REVIEW', '#7fffd4'], ['FUNDING', P.amber]];
const parallel = (T) => {
  const t0 = T.S('09a', "They didn't"), tSide = T.S('09a', 'side by side'), tMoney = T.S('09a', 'the money'), tReg = T.S('09a', 'regulators');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0b0e2c'], [1, '#171b48']]);
    const u = eio(lin(tSide - .3, tSide + 1.2, t));
    ctx.save(); look(ctx, mix(960, 900, u), 540, 1);
    // timeline arrow: long ("years") → short ("months")
    const ax0 = 160, ax1 = mix(1780, 1060, u), ay = 900;
    ctx.strokeStyle = rgba(C.cream, .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax0, ay); ctx.lineTo(ax1, ay); ctx.stroke();
    ctx.fillStyle = rgba(C.cream, .5); ctx.beginPath(); ctx.moveTo(ax1 + 18, ay); ctx.lineTo(ax1, ay - 10); ctx.lineTo(ax1, ay + 10); ctx.fill();
    text(ctx, u < .5 ? 'one step after another' : 'side by side', (ax0 + ax1) / 2, ay + 46, { size: 30, font: 'Instrument Serif Italic', color: C.cream, align: 'center', alpha: .75 * Math.abs(u - .5) * 2 });
    BOXES.forEach(([name, col], i) => {
      const a = sm(lin(t0 + i * .25, t0 + i * .25 + .4, t));
      const x = mix(180 + i * 400, 360, u), y = mix(560, 220 + i * 150, u), w = mix(360, 640, u), h = 110;
      ctx.globalAlpha = a;
      ctx.fillStyle = rgba(col, .14); ctx.strokeStyle = rgba(col, .8); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(x, y, w, h, 14); ctx.fill(); ctx.stroke();
      text(ctx, name, x + 30, y + 66, { size: 26, weight: 600, color: C.cream, spacing: 6 });
      // a progress bar running inside (all at once when parallel)
      const prog = clamp((t - t0 - (u < .5 ? i * 1.2 : 0)) / 5);
      ctx.fillStyle = rgba(col, .7); ctx.fillRect(x + 260, y + 50, (w - 300) * prog, 10);
      ctx.globalAlpha = 1;
      addGlow(ctx, x + w - 30, y + 55, 50, .3 * a, col, '#ffffff');
    });
    // coins dropped up front into FUNDING
    const fy = mix(560, 220 + 3 * 150, u), fx = mix(180 + 3 * 400, 360, u);
    for (let k = 0; k < 6; k++) { const ft = tMoney + k * .12, f = eout(clamp((t - ft) / .4)); if (f <= 0) continue; const cx = fx + 120 + k * 22, cy = mix(fy - 300, fy + 40, f); ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.ellipse(cx, cy, 12, 12, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#a8661e'; ctx.lineWidth = 2; ctx.stroke(); }
    // reviewer at a desk on the right, pages arriving from TRIALS as they print
    const ra = sm(lin(tReg - .4, tReg + .3, t));
    if (ra > 0) {
      ctx.globalAlpha = ra;
      ctx.fillStyle = '#1c2160'; ctx.fillRect(1420, 640, 300, 20); ctx.fillRect(1440, 660, 14, 140); ctx.fillRect(1690, 660, 14, 140);
      person(ctx, 1600, 800, 300, t, { sit: true, coat: '#3b4a8a', hood: false, skin: '#8a5a3c', typing: true });
      cone(ctx, 1560, 300, 380, 0, .35, '#ffe6c2', .2);
      ctx.globalAlpha = 1;
      const ty = 220;
      for (let k = 0; k < 6; k++) { const q = ((t - tReg) * .9 + k / 6) % 1; if (t < tReg) continue; const x = mix(1000, 1560, q), y = mix(ty + 55, 610, q) - Math.sin(q * Math.PI) * 140; ctx.save(); ctx.translate(x, y); ctx.rotate(q * 1.5 - .4); ctx.fillStyle = rgba('#f3efe2', .9 * ra * Math.sin(q * Math.PI)); ctx.fillRect(-20, -26, 40, 52); ctx.fillStyle = rgba('#5a5f8a', .7 * ra * Math.sin(q * Math.PI)); for (let l = 0; l < 4; l++) ctx.fillRect(-14, -16 + l * 10, 28, 3); ctx.restore(); }
    }
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 103: the blue emergency light dims to daylight; quiet diseases step into the light ----------
const daylight = (T) => {
  const t0 = T.S('09a', 'That was'), tNorm = T.S('09a', 'The work now'), tQuiet = T.S('09a', 'for diseases');
  return (ctx, t, s) => {
    const day = sm(lin(tNorm, tNorm + 1.8, t)), em = 1 - day;
    bg(ctx, [[0, mixHex('#070a22', '#3a3a6a', day)], [1, mixHex('#10143a', '#8a6a6a', day)]]);
    ctx.save(); look(ctx, mix(960, 1010, lin(s.a, s.b, t)), 540, 1);
    // tall windows
    for (let i = 0; i < 4; i++) { const x = 180 + i * 420; ctx.fillStyle = mixHex('#141a48', '#ffe2b0', day); ctx.fillRect(x, 140, 200, 520); ctx.strokeStyle = '#1b2052'; ctx.lineWidth = 10; ctx.strokeRect(x, 140, 200, 520); ctx.fillStyle = '#1b2052'; ctx.fillRect(x + 95, 140, 10, 520); if (day > 0) beam(ctx, x + 100, 660, 200, x + 360, 1080, 420, '#ffe2b0', .3 * day); }
    ctx.fillStyle = mixHex('#0c1036', '#3a2f4a', day); ctx.fillRect(-200, 780, W + 400, 400);
    // emergency: a blue beacon sweeps the hall, people hurry through
    if (em > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      for (const [bx, ph, col] of [[700, 0, '#3a7bff'], [1220, Math.PI, '#ff4a5a']]) {
        const q = t * 4.2 + ph;
        ctx.fillStyle = rgba(col, .2 * em); ctx.beginPath(); ctx.moveTo(bx, 70); ctx.lineTo(bx + Math.cos(q - .25) * 2600, 70 + Math.abs(Math.sin(q - .25)) * 1400); ctx.lineTo(bx + Math.cos(q + .25) * 2600, 70 + Math.abs(Math.sin(q + .25)) * 1400); ctx.fill();
      }
      ctx.restore();
      const fl = .5 + .5 * Math.sin(t * 8.4);
      ctx.fillStyle = '#1b2052'; ctx.fillRect(660, 50, 600, 26);
      addGlow(ctx, 700, 70, 200, .9 * em * fl, '#3a7bff', '#cfe0ff'); addGlow(ctx, 1220, 70, 200, .9 * em * (1 - fl), '#ff4a5a', '#ffd0d0');
      ctx.fillStyle = rgba('#3a7bff', .12 * em * fl); ctx.fillRect(-200, 0, W + 400, H);
      for (let k = 0; k < 3; k++) { const x = mix(-100, W + 200, ((t - t0) * .32 + k * .3) % 1.4); person(ctx, x, 900 + k * 30, 260, t, { phase: t * 9 + k, coat: ['#d9d6e8', '#5a8ab8', '#d9d6e8'][k], hood: false, skin: ['#c98f6a', '#8a5a3c', '#e0b48f'][k] }); }
    }
    // three quiet diseases walk out of the shadow into the light
    ['heart', 'kidney', 'mosquito'].forEach((k, i) => {
      const st = tQuiet - .2 + i * .35, u = eio(lin(st, st + 1.4, t));
      const x = mix(1760 + i * 160, 620 + i * 340, u), y = 640 + Math.sin(t * 1.5 + i) * 8;
      iconDisc(ctx, k, x, y, 110, u * day, t);
    });
    ctx.restore();
    motes(ctx, t, { seed: 103, n: 60, a: .25 * day, hex: '#ffe6c2' });
    void t0;
    finish(ctx, t, { vig: .5, warm: day * .3 });
  };
};

// ---------- 104: the key board; a hand takes the big key ----------
const keyBoard = (T) => {
  const tHold = T.S('09a', 'hold that key');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#2a2440'], [1, '#4a3a4a']]);
    beam(ctx, 300, -100, 300, 900, 1100, 900, '#ffe2b0', .25);
    ctx.save(); look(ctx, 960, 540, mix(1, 1.1, eio(lin(s.a, s.b, t))));
    // wooden board with hooks
    ctx.fillStyle = '#4a2f1e'; ctx.beginPath(); ctx.roundRect(520, 220, 880, 560, 18); ctx.fill(); ctx.strokeStyle = '#2b1a10'; ctx.lineWidth = 8; ctx.stroke();
    ctx.fillStyle = '#e8dcc0'; ctx.fillRect(680, 250, 560, 50); text(ctx, 'HEALTH AGENCIES · GOVERNMENTS', 960, 284, { size: 18, weight: 600, color: '#4a2f1e', align: 'center', spacing: 3 });
    const keyDraw = (x, y, s2, rot, col) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s2, s2); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 40, 0, 7); ctx.stroke(); ctx.fillRect(-7, 38, 14, 200); ctx.fillRect(7, 180, 40, 16); ctx.fillRect(7, 212, 30, 16); ctx.restore(); };
    for (let i = 0; i < 6; i++) { const hx = 600 + i * 145; if (i === 2 || i === 3) continue; ctx.fillStyle = '#2b1a10'; ctx.fillRect(hx - 5, 360, 10, 24); keyDraw(hx, 410 + Math.sin(t + i) * 2, .45, Math.sin(t * .8 + i) * .05, '#8a7a5a'); }
    // the big key, lifted by a hand
    const take = eio(lin(tHold - .2, tHold + 1.0, t)), kx = mix(960, 1050, take), ky = mix(420, 360, take) + Math.sin(t * 1.2) * 3 * (1 - take);
    ctx.fillStyle = '#2b1a10'; ctx.fillRect(955, 350, 10, 26);
    keyDraw(kx, ky, .9, mix(Math.sin(t * .9) * .04, -.3, take), '#ffcf6a');
    addGlow(ctx, kx, ky + 80, 180, .35, P.amber, '#fff3dd');
    const hIn = eout(lin(tHold - 1.0, tHold - .1, t));
    reach(ctx, 1900, 1150, mix(1700, kx + 70, hIn), mix(900, ky + 20, hIn), { sleeve: '#232a60', cuff: '#e8e4d8', w: 74, grip: take });
    ctx.restore();
    motes(ctx, t, { seed: 104, n: 50, a: .3, hex: '#ffe6c2', x0: 300, x1: 1400 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 105: circle 3: a door without a lock, open ----------
const boardDoor = (T) => {
  const t0 = T.S('09a', 'Third', 1), tEvery = T.S('09a', 'for everyone');
  return (ctx, t, s) => {
    ctx.save(); look(ctx, CIRC[2].x, CIRC[2].y + 10, mix(1.6, 1.8, lin(s.a, s.b, t)));
    boardRoom(ctx, t);
    CIRC.forEach((c, i) => chalkCircle(ctx, c.x, c.y, CR, 1, { seed: 10 + i, a: i === 2 ? .95 : .45 }));
    chalkIcon(ctx, 'scale', CIRC[1].x, CIRC[1].y, 1.1, 1);
    text(ctx, '3', CIRC[2].x - CR - 10, CIRC[2].y - CR + 6, { size: 64, font: 'Instrument Serif Italic', color: C.cream, alpha: .85 });
    // the open door, glowing; no lock, no handle hole
    const c = CIRC[2], open = eio(lin(t0, t0 + 1.6, t)) * (1 + .03 * Math.sin(t * 2));
    ctx.save(); ctx.translate(c.x, c.y + 10);
    const g = ctx.createLinearGradient(0, -95, 0, 95); g.addColorStop(0, '#fff3dd'); g.addColorStop(1, '#ffb35c');
    ctx.fillStyle = g; ctx.globalAlpha = .9; ctx.fillRect(-50, -95, 100, 190); ctx.globalAlpha = 1;
    addGlow(ctx, 0, 0, 160, .5 + .2 * open, P.amber, '#fff3dd');
    chalkLine(ctx, [[-50, 95], [-50, -95], [50, -95], [50, 95]], 1, { w: 5 });
    const dw = 100 * Math.cos(open * 1.2);
    ctx.fillStyle = '#1d2a3a'; ctx.beginPath(); ctx.moveTo(-50, -95); ctx.lineTo(-50 + dw, -95 + (100 - dw) * .15); ctx.lineTo(-50 + dw, 95 + (100 - dw) * .1); ctx.lineTo(-50, 95); ctx.fill();
    chalkLine(ctx, [[-50, -95], [-50 + dw, -95 + (100 - dw) * .15], [-50 + dw, 95 + (100 - dw) * .1], [-50, 95]], 1, { w: 4 });
    beam(ctx, 0, 95, 100, 0, 200, 300, '#ffcf91', .3 * open);
    ctx.restore();
    // little chalk people walking through
    const ev = lin(tEvery - .2, s.b, t);
    for (let k = 0; k < 4; k++) { const q = clamp(ev * 2.2 - k * .35); if (q <= 0 || q >= 1) continue; const x = c.x - 160 + q * 160, y = c.y + 105; ctx.save(); ctx.globalAlpha = Math.sin(q * Math.PI); chalkLine(ctx, [[x, y - 40], [x, y - 12], [x - 7 + Math.sin(t * 9 + k) * 5, y], [x, y - 12], [x + 7 - Math.sin(t * 9 + k) * 5, y]], 1, { w: 3 }); ctx.beginPath(); ctx.arc(x, y - 48, 7, 0, 7); ctx.strokeStyle = rgba(C.cream, .9); ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
    ctx.restore();
    motes(ctx, t, { seed: 105, n: 60, a: .2, hex: '#e8e4d8', speed: 6 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 106: a hall of glowing protein shapes on shelves; the doors at the far end swing open to daylight ----------
const library = (T) => {
  const t0 = T.S('09a', 'When Google'), tGave = T.S('09a', 'gave the');
  const BX0 = 780, BX1 = 1140, BY0 = 320, BY1 = 700;
  return (ctx, t, s) => {
    const open = eio(lin(tGave - .2, tGave + 1.2, t));
    bg(ctx, [[0, '#0a0c26'], [1, '#141844']]);
    ctx.save(); look(ctx, 960, 520, mix(1, 1.14, eio(lin(s.a, s.b, t))));
    // back wall with the doors
    ctx.fillStyle = '#1a1f55'; ctx.fillRect(BX0, BY0, BX1 - BX0, BY1 - BY0);
    const dX = 960, dw = 90, dTop = 420;
    const g = ctx.createLinearGradient(0, dTop, 0, BY1); g.addColorStop(0, '#fff3dd'); g.addColorStop(1, '#ffcf91'); ctx.fillStyle = g; ctx.fillRect(dX - dw, dTop, dw * 2, BY1 - dTop);
    const leaf = dw * Math.cos(open * 1.4); ctx.fillStyle = '#0e1238'; ctx.fillRect(dX - dw, dTop, leaf, BY1 - dTop); ctx.fillRect(dX + dw - leaf, dTop, leaf, BY1 - dTop);
    addGlow(ctx, dX, 560, 160 + 500 * open, .25 + .6 * open, P.amber, '#fff3dd');
    // floor, ceiling, side walls in one-point perspective
    const poly = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill(); };
    poly([[-200, H + 200], [BX0, BY1], [BX1, BY1], [W + 200, H + 200]], '#10143c');
    poly([[-200, -200], [BX0, BY0], [BX1, BY0], [W + 200, -200]], '#0b0e2c');
    poly([[-200, -200], [BX0, BY0], [BX0, BY1], [-200, H + 200]], '#151a4c');
    poly([[W + 200, -200], [BX1, BY0], [BX1, BY1], [W + 200, H + 200]], '#151a4c');
    // daylight runner on the floor
    if (open > 0) beam(ctx, dX, BY1, dw * 2, dX, H + 200, 1300, '#ffcf91', .28 * open);
    // shelves: rows along each wall, uprights receding; glowing proteins between them
    const depth = (k) => 1 - Math.pow(.62, k);     // 0 near → ~1 far
    for (const side of [-1, 1]) {
      const nx = side < 0 ? -200 : W + 200, fx = side < 0 ? BX0 : BX1;
      for (let r = 0; r <= 5; r++) { const f = r / 5; const y0 = mix(-200, H + 200, f), y1 = mix(BY0, BY1, f); ctx.strokeStyle = '#2b3270'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(nx, y0); ctx.lineTo(fx, y1); ctx.stroke(); ctx.strokeStyle = rgba(P.amber, .12); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(nx, y0 - 4); ctx.lineTo(fx, y1 - 2); ctx.stroke(); }
      for (let k = 1; k < 9; k++) {
        const u = depth(k), x = mix(nx, fx, u), ytop = mix(-200, BY0, u), ybot = mix(H + 200, BY1, u), sc = (1 - u) * 1.0 + .08;
        ctx.fillStyle = '#20265e'; ctx.fillRect(x - 6 * sc, ytop, 12 * sc, ybot - ytop);
        if (k < 2) continue;
        for (let r = 0; r < 5; r++) {
          const u2 = depth(k + .5), x2 = mix(nx, fx, u2), f = (r + .62) / 5, y = mix(mix(-200, H + 200, f), mix(BY0, BY1, f), u2);
          const sc2 = (1 - u2) * 1.1 + .06;
          protein(ctx, x2, y - 10 * sc2, 1.15 * sc2, t * .8 + k + r, { seed: k * 7 + r + (side > 0 ? 50 : 0), hex: JAR_COLS[(k + r + (side > 0 ? 3 : 0)) % JAR_COLS.length], a: .95 });
        }
      }
    }
    // a few proteins lift off and drift toward the open doors
    if (t > tGave) for (let k = 0; k < 8; k++) { const q = ((t - tGave) * .3 + k / 8) % 1; protein(ctx, mix(960 + (k - 3.5) * 220, dX + (k - 3.5) * 10, q), mix(820 - (k % 3) * 120, 560, q), mix(.6, .15, q), t + k, { seed: 60 + k, hex: JAR_COLS[k % 6], a: open * Math.sin(q * Math.PI), wings: .6 }); }
    ctx.restore();
    label(ctx, t, t0 + .5, 110, 160, 'AlphaFold database', 'free since 2021');
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- C7 (K9): the clip on a canvas in the library entrance; proteins fly out like birds ----------
const clipK9 = (T) => {
  return (ctx, t, s) => {
    bg(ctx, [[0, '#2a2a5a'], [1, '#e2a07a']]);
    ctx.save(); look(ctx, 960, 540, mix(1.04, 1.0, eio(lin(s.a, s.b, t))));
    // portal: columns + arch, daylight outside
    ctx.fillStyle = '#141844'; ctx.fillRect(0, 0, 280, H); ctx.fillRect(W - 280, 0, 280, H); ctx.fillRect(0, 0, W, 70);
    for (const x of [300, 1580]) { ctx.fillStyle = '#1c2160'; ctx.fillRect(x, 70, 40, 900); ctx.fillStyle = rgba('#ffcf91', .2); ctx.fillRect(x + 32, 70, 8, 900); }
    ctx.fillStyle = '#0f1340'; ctx.fillRect(0, 950, W, 200);
    for (let k = 0; k < 4; k++) { ctx.fillStyle = shade('#1a1f55', k * .02); ctx.fillRect(280 + k * 40, 950 + k * 30, W - 560 - k * 80, 30); }
    // the canvas with the clip
    const sx = 500, sy = 140, sw = 920, sh = 518;
    ctx.fillStyle = '#0a0c26'; ctx.fillRect(sx - 14, sy - 14, sw + 28, sh + 28);
    ctx.strokeStyle = '#2a2f6a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(sx + 100, 70); ctx.lineTo(sx + 100, sy - 14); ctx.moveTo(sx + sw - 100, 70); ctx.lineTo(sx + sw - 100, sy - 14); ctx.stroke();
    clipScreen(ctx, t, T, 'K9', sx, sy, sw, sh);
    clipQuote(ctx, t, T, 'K9', sx + 40, sy + sh + 90, sw - 80, 34);
    // protein birds streaming out of the portal
    for (let k = 0; k < 14; k++) {
      const q = ((t * .12 + k / 14) % 1), x = mix(300 + (k * 137 % 1300), -200 + (k % 2) * (W + 400), q), y = mix(760 - (k * 53 % 300), -120, q) + Math.sin(q * 6 + k) * 40;
      protein(ctx, x, y, mix(.35, .6, q), t * 1.4 + k, { seed: 70 + k, hex: JAR_COLS[k % 6], a: Math.sin(q * Math.PI) * .9, wings: 1 });
    }
    ctx.restore();
    clipLabel(ctx, t, T, 'K9', 110, 960);
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 107 + 108: world map: proteins land in cities; then every light sprouts into a garden ----------
const MAP = { x: 160, y: 140, w: 1600, h: 820 };
const CITIES = [[.12, .3], [.2, .36], [.25, .27], [.16, .22], [.29, .6], [.31, .74], [.27, .58], [.49, .22], [.52, .19], [.47, .26], [.54, .26], [.5, .4], [.55, .48], [.52, .62], [.58, .44], [.62, .3], [.68, .44], [.7, .3], [.78, .26], [.83, .22], [.87, .3], [.8, .38], [.74, .2], [.85, .68], [.9, .7], [.62, .2], [.33, .2], [.07, .22], [.57, .58], [.45, .4]];
function worldMap(ctx, t, { lit = () => 0, garden = 0 } = {}) {
  const dots = landDots(WORLD, MAP.w, MAP.h, 14);
  for (const [x, y] of dots) { ctx.fillStyle = rgba(mixHex('#6a7cc8', '#6fc8a8', garden), .75); ctx.beginPath(); ctx.arc(MAP.x + x, MAP.y + y, 3.2, 0, 7); ctx.fill(); }
  CITIES.forEach(([cx, cy], i) => {
    const a = lit(i); if (a <= 0) return; const x = MAP.x + cx * MAP.w, y = MAP.y + cy * MAP.h;
    ctx.fillStyle = rgba('#fff3dd', a); ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); addGlow(ctx, x, y, 40 + 10 * Math.sin(t * 3 + i), .6 * a, P.amber, '#fff3dd');
  });
}
const worldLand = (T) => {
  const t0 = T.S('09b', 'Today'), tMil = T.S('09b', 'three million');
  const land = CITIES.map((_, i) => t0 + .1 + (i * 7 % 30) * .1);
  return (ctx, t, s) => {
    bg(ctx, [[0, '#080b26'], [1, '#121a48']]);
    ctx.save(); look(ctx, 960, 540, mix(1.04, 1, eio(lin(s.a, s.b, t))));
    worldMap(ctx, t, { lit: (i) => sm(lin(land[i] + .6, land[i] + .9, t)) });
    CITIES.forEach(([cx, cy], i) => {
      const u = lin(land[i] - .3, land[i] + .7, t); if (u <= 0 || u >= 1) return;
      const x = MAP.x + cx * MAP.w, y = MAP.y + cy * MAP.h, e = eio(u);
      protein(ctx, mix(x + 200 * Math.sin(i), x, e), mix(-100, y, e), mix(.45, .12, e), t * 1.5 + i, { seed: 80 + i, hex: JAR_COLS[i % 6], a: 1 - sm(lin(.85, 1, u)), wings: 1 - e });
    });
    ctx.restore();
    const a = sm(lin(tMil - .3, tMil + .3, t));
    text(ctx, '3 million+', 110, 930, { size: 84, font: 'Instrument Serif', alpha: a });
    text(ctx, 'RESEARCHERS USE IT', 114, 975, { size: 20, weight: 600, color: C.muted, alpha: a, spacing: 6 });
    finish(ctx, t, { vig: .5 });
  };
};
const worldGarden = (T) => {
  const t0 = T.S('09b', "That's what");
  return (ctx, t, s) => {
    const g = sm(lin(t0, t0 + 1.8, t));
    bg(ctx, [[0, mixHex('#080b26', '#0b1a2a', g)], [1, mixHex('#121a48', '#123a3a', g)]]);
    ctx.save(); look(ctx, 960, 540, mix(1, 1.05, lin(s.a, s.b, t)));
    worldMap(ctx, t, { lit: () => 1, garden: g });
    CITIES.forEach(([cx, cy], i) => {
      const u = eout(lin(t0 + (i % 10) * .06, t0 + 1.6 + (i % 10) * .06, t)); if (u <= 0) return;
      const x = MAP.x + cx * MAP.w, y = MAP.y + cy * MAP.h, hgt = 70 * u, sw = Math.sin(t * 1.5 + i) * 6;
      ctx.strokeStyle = rgba('#7fd8a8', .9); ctx.lineWidth = 3; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + sw, y - hgt * .5, x + sw * 1.5, y - hgt); ctx.stroke();
      for (let l = 0; l < 3; l++) { const lu = clamp(u * 3 - l); if (lu <= 0) continue; const ly = y - hgt * (.35 + l * .25), side = l % 2 ? 1 : -1; ctx.fillStyle = rgba('#9fe8c0', .85); ctx.beginPath(); ctx.ellipse(x + sw * (.4 + l * .3) + side * 10 * lu, ly, 10 * lu, 5 * lu, side * .6, 0, 7); ctx.fill(); }
      if (u > .8) addGlow(ctx, x + sw * 1.5, y - hgt, 30, .4, '#9fe8c0', '#ffffff');
    });
    ctx.restore();
    motes(ctx, t, { seed: 108, n: 40, a: .3 * g, hex: '#ffe6a0', speed: 8 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 109: the compass points at the coins; the village clinic stays in the shade ----------
function clinicHouse(ctx, x, y, s, t, lit = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#151a44'; ctx.fillRect(-150, -150, 300, 150); ctx.fillStyle = '#10143a'; ctx.beginPath(); ctx.moveTo(-170, -150); ctx.lineTo(0, -230); ctx.lineTo(170, -150); ctx.fill();
  ctx.fillStyle = '#2b336e'; ctx.fillRect(-40, -110, 80, 110);
  ctx.fillStyle = rgba('#ffd29a', .25 + .15 * Math.sin(t * 3) + lit); ctx.fillRect(-120, -110, 50, 40); ctx.fillRect(70, -110, 50, 40);
  ctx.fillStyle = '#e8e4d8'; ctx.fillRect(-12, -205, 24, 8); ctx.fillRect(-4, -213, 8, 24);
  ctx.restore();
  for (let i = 0; i < 5; i++) person(ctx, x - 260 * s + i * 50 * s, y, 120 * s, t, { coat: ['#6a5a8a', '#8a5a4a', '#4a6a8a', '#7a6a4a', '#5a4a6a'][i], hood: i % 2 === 0, skin: '#8a5a3c' });
}
const compass = (T) => {
  const t0 = T.S('09b', 'But a market'), tPays = T.S('09b', 'what pays'), tPoor = T.S('09b', 'Diseases of');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0b0e2c'], [1, '#191c46']]);
    const pan = eio(lin(tPoor - .3, tPoor + 1.4, t));
    ctx.save(); look(ctx, mix(1060, 700, pan), 580, mix(1, 1.08, pan));
    ctx.fillStyle = '#0f1340'; ctx.fillRect(-400, 760, W + 800, 500);
    // coins on the right, bright spotlight
    cone(ctx, 1600, -40, 820, 0, .26, '#ffe6a0', .35);
    for (let k = 0; k < 40; k++) { const r = prng(k + 3); const cx = 1600 + (r() - .5) * 220 * (1 - k / 50), cy = 760 - Math.floor(k / 8) * 18 - r() * 6; ctx.fillStyle = mixHex('#ffcf6a', '#e8a33a', r()); ctx.beginPath(); ctx.ellipse(cx, cy, 30, 10, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#a8661e'; ctx.lineWidth = 2; ctx.stroke(); }
    addGlow(ctx, 1600, 700, 240, .55, P.amber, '#fff3dd');
    // the clinic on the left edge, in shade
    clinicHouse(ctx, 330, 770, 1.35, t, 0);
    ctx.fillStyle = 'rgba(7,9,24,.35)'; ctx.fillRect(-400, 0, 800, H);
    // the compass in the middle
    const cx = 1000, cy = 640;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1.4, 1.4); ctx.translate(-cx, -cy);
    ctx.fillStyle = '#6a4a2a'; ctx.beginPath(); ctx.ellipse(cx, cy + 20, 200, 70, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#c9a25a'; ctx.beginPath(); ctx.ellipse(cx, cy, 200, 70, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#efe4c8'; ctx.beginPath(); ctx.ellipse(cx, cy, 176, 60, 0, 0, 7); ctx.fill();
    for (let i = 0; i < 16; i++) { const q = i / 16 * 6.283; ctx.fillStyle = '#5a3f28'; ctx.fillRect(cx + Math.cos(q) * 160 - 2, cy + Math.sin(q) * 54 - 2, 4, 4); }
    const settle = lin(t0, tPays + .4, t), ang = mix(-2.6, 0, eout(settle)) + Math.sin(t * 8) * .25 * (1 - settle) + Math.sin(t * 1.3) * .02;
    ctx.save(); ctx.translate(cx, cy); ctx.scale(1, .34); ctx.rotate(ang);
    ctx.fillStyle = '#c94a40'; ctx.beginPath(); ctx.moveTo(150, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.fill();
    ctx.fillStyle = '#2a2f6a'; ctx.beginPath(); ctx.moveTo(-150, 0); ctx.lineTo(0, -14); ctx.lineTo(0, 14); ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#5a3f28'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 7); ctx.fill();
    ctx.restore();
    if (settle >= 1) glowLine(ctx, [[cx + 230, cy], [1480, 720]], sm(lin(tPays + .4, tPays + 1, t)), { color: P.amber, width: 2, glowW: 10, alpha: .6, dash: [10, 12], head: false });
    ctx.restore();
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 110: the quote card over the clinic ----------
const quote110 = (T) => {
  const t0 = T.S('09b', 'Even Hassabis'), tEnd = T.S('09b', 'So who');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#0b0e2c'], [1, '#191c46']]);
    ctx.save(); look(ctx, 960, 560, mix(1.0, 1.06, lin(s.a, s.b, t)));
    ctx.fillStyle = '#0f1340'; ctx.fillRect(-400, 800, W + 800, 500);
    clinicHouse(ctx, 960, 800, 1.9, t, .1 * sm(lin(t0 + 1.5, t0 + 3, t)));
    ctx.restore();
    ctx.fillStyle = 'rgba(7,9,24,.55)'; ctx.fillRect(0, 0, W, H);
    quoteCard(ctx, t, t0 + .1, tEnd + .5, { quote: '“Maybe the balance of what the industry is doing is not enough.”', who: 'Demis Hassabis · WEF Davos, Jan 2026', y: 470, size: 66, w: 1600, hi: ['not enough'] });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 111 + 112: an empty helm over the city of lights; a few hands, then many ----------
function helm(ctx, x, y, R, rot, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  ctx.strokeStyle = '#5a3a22'; ctx.lineCap = 'round';
  for (let i = 0; i < 10; i++) { const q = i / 10 * 6.283; ctx.lineWidth = 16; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(q) * (R + 70), Math.sin(q) * (R + 70)); ctx.stroke(); ctx.fillStyle = '#6a4428'; ctx.beginPath(); ctx.ellipse(Math.cos(q) * (R + 80), Math.sin(q) * (R + 80), 18, 18, 0, 0, 7); ctx.fill(); }
  ctx.lineWidth = 34; ctx.strokeStyle = '#6a4428'; ctx.beginPath(); ctx.arc(0, 0, R, 0, 7); ctx.stroke();
  ctx.lineWidth = 3; ctx.strokeStyle = rgba(P.cyanSoft, .5); ctx.beginPath(); ctx.arc(0, 0, R - 15, -2.4, -.8); ctx.stroke();
  ctx.fillStyle = '#7a5030'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, 7); ctx.fill(); ctx.fillStyle = '#c9a25a'; ctx.beginPath(); ctx.arc(0, 0, 18, 0, 7); ctx.fill();
  ctx.restore();
}
const handlePos = (x, y, R, rot, i) => { const q = i / 10 * 6.283 + rot; return [x + Math.cos(q) * (R + 80), y + Math.sin(q) * (R + 80)]; };
function lightCity(ctx, t) {
  const city = once('city111', () => cityLayer({ seed: 111, z: 1, base: H, hMin: 160, hMax: 440, col: '#121845', lit: .35, litCol: P.cyan, warmLit: .4, span: 2400, fogAmt: .2 }));
  city.draw(ctx, t, 0, 0, 1);
}
const helmEmpty = (T) => {
  const t0 = T.S('09b', 'So who');
  return (ctx, t, s) => {
    skyGrad(ctx, { t, stars: .6, bottom: '#2c3a7e' });
    lightCity(ctx, t);
    addGlow(ctx, 960, 1000, 900, .25, P.cyan, '#e8fbff');
    const rot = Math.sin(t * .6) * .25 + (t - t0) * .05;
    const z = mix(.85, 1, eio(lin(s.a, s.b, t)));
    ctx.save(); look(ctx, 960, 470, z); helm(ctx, 960, 430, 220, rot, t); ctx.restore();
    fogBand(ctx, t, H * .75, 220, { a: .2, hex: '#8ab8e8', seed: 111 });
    finish(ctx, t, { vig: .55 });
  };
};
const SLEEVES = [['#20264f', '#e8e4d8'], ['#e9e6dc', '#cfd8e8'], ['#3a5a8a', '#2a3a6a'], ['#c8661e', '#7a3b17'], ['#4a7a5a', '#2a4a3a'], ['#b85a6a', '#7a3a4a'], ['#e9e6dc', '#cfd8e8'], ['#6a5a8a', '#3a2a5a']];
const helmHands = (T) => {
  const tHand = T.S('09b', 'a handful'), tMore = T.S('09b', "They don't");
  return (ctx, t, s) => {
    skyGrad(ctx, { t, stars: .6, bottom: '#2c3a7e' });
    lightCity(ctx, t);
    addGlow(ctx, 960, 1000, 900, .25, P.cyan, '#e8fbff');
    const rot = Math.sin(t * .6) * .05 + .3;
    const many = eout(lin(tMore + .2, tMore + 1.6, t));
    ctx.save(); look(ctx, 960, 480, mix(1.05, .92, many));
    const HX = 960, HY = 430, R = 220;
    helm(ctx, HX, HY, R, rot, t);
    // five suit sleeves from the top
    for (let i = 0; i < 5; i++) {
      const hi = [6, 7, 8, 9, 5][i], [hx, hy] = handlePos(HX, HY, R, rot, hi), u = eout(lin(tHand - .3 + i * .1, tHand + .5 + i * .1, t));
      if (u <= 0) continue; const sx = hx + (hx - HX) * 2.2, sy = hy - 900;
      reach(ctx, sx, sy, mix(sx, hx, u), mix(sy, hy, u), { sleeve: '#1a1f45', cuff: '#e8e4d8', w: 60, grip: u, skin: ['#c98f6a', '#e0b48f', '#d9a07a', '#c98f6a', '#e0b48f'][i] });
    }
    // many more, of every kind, from the sides and below
    [0, 1, 2, 3, 4].forEach((hi, i) => {
      const [hx, hy] = handlePos(HX, HY, R, rot, hi), u = eout(lin(tMore + .1 + i * .15, tMore + 1.0 + i * .15, t)); if (u <= 0) return;
      const ang = Math.atan2(hy - HY, hx - HX), sx = hx + Math.cos(ang) * 900, sy = hy + Math.sin(ang) * 900 + 300;
      const [sl, cf] = SLEEVES[(i + 1) % SLEEVES.length];
      reach(ctx, sx, sy, mix(sx, hx, u), mix(sy, hy, u), { sleeve: sl, cuff: cf, w: 60, grip: u, skin: ['#8a5a3c', '#c98f6a', '#6a4028', '#e0b48f', '#a8714f'][i] });
    });
    for (let k = 0; k < 6; k++) { const u = eout(lin(tMore + .6 + k * .12, tMore + 1.6 + k * .12, t)); if (u <= 0) continue; const ang = -2.6 + k * .9, ex = HX + Math.cos(ang) * (R + 220), ey = HY + Math.sin(ang) * (R + 220) + 120; const sx = HX + Math.cos(ang) * 1300, sy = HY + Math.sin(ang) * 1300 + 400; const [sl, cf] = SLEEVES[(k + 3) % SLEEVES.length]; reach(ctx, sx, sy, mix(sx, ex, u), mix(sy, ey, u), { sleeve: sl, cuff: cf, w: 54, grip: .3, skin: ['#8a5a3c', '#e0b48f', '#6a4028', '#c98f6a', '#a8714f', '#d9a07a'][k] }); }
    ctx.restore();
    fogBand(ctx, t, H * .8, 200, { a: .18, hex: '#8ab8e8', seed: 112 });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- 113: public science: a compute dome rises beside the telescope and the collider; light flows to universities ----------
const publicScience = (T) => {
  const t0 = T.S('09b', 'Governments can'), tPub = T.S('09b', 'public science'), tTel = T.S('09b', 'telescopes'), tCol = T.S('09b', 'particle');
  return (ctx, t, s) => {
    skyGrad(ctx, { t, stars: .4, warm: .55, bottom: '#3a4a92' });
    ctx.save(); look(ctx, 960, 560, mix(1.05, 1, eio(lin(s.a, s.b, t))));
    hill(ctx, [[0, 640], [400, 600], [900, 630], [1400, 590], [1920, 620]], { col: '#1a2058' });
    ctx.fillStyle = '#121845'; ctx.fillRect(-200, 700, W + 400, 500);
    // collider ring (center, far)
    const cl = sm(lin(tCol - .2, tCol + .6, t));
    ctx.save(); ctx.translate(960, 760); ctx.scale(1, .22);
    ctx.strokeStyle = rgba(P.cyan, .25 + .6 * cl); ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(0, 0, 520, 0, 7); ctx.stroke();
    ctx.restore();
    if (cl > 0) { const q = t * 3; addGlow(ctx, 960 + Math.cos(q) * 520, 760 + Math.sin(q) * 520 * .22, 60, .8 * cl, P.cyan, '#ffffff'); }
    ctx.fillStyle = '#1c2160'; ctx.fillRect(900, 690, 120, 70);
    // telescope dome (left) with slit, rotating
    const tl = sm(lin(tTel - .2, tTel + .5, t));
    ctx.fillStyle = '#d9d6e8'; ctx.fillRect(250, 560, 220, 140); ctx.beginPath(); ctx.arc(360, 560, 110, Math.PI, 0); ctx.fill();
    const sl = Math.sin(t * .5) * 30; ctx.fillStyle = '#0a0c26'; ctx.fillRect(345 + sl, 452, 30, 108);
    if (tl > 0) { cone(ctx, 360 + sl, 470, 500, Math.PI + .5, .05, '#cfe6ff', .25 * tl); addGlow(ctx, 360, 560, 220, .25 * tl, '#cfe6ff', '#ffffff'); }
    // the new public compute dome rising on the right
    const rise = eout(lin(t0 + .3, tPub, t));
    const by = mix(840, 560, rise);
    ctx.save(); ctx.beginPath(); ctx.rect(1300, 300, 500, 400); ctx.clip();
    ctx.fillStyle = '#2a3070'; ctx.fillRect(1400, by, 300, 160); ctx.beginPath(); ctx.arc(1550, by, 150, Math.PI, 0); ctx.fill();
    for (let i = 0; i < 6; i++) { ctx.fillStyle = rgba(P.cyan, .6 + .4 * Math.sin(t * 5 + i)); ctx.fillRect(1420 + i * 46, by + 40, 30, 8); }
    ctx.restore();
    addGlow(ctx, 1550, by - 40, 260, .45 * rise, P.cyan, '#e8fbff');
    // universities (columned buildings) on the near ground, receiving light
    const flow = lin(tPub - .2, tPub + 1.5, t);
    const unis = [[300, 900], [760, 940], [1200, 920], [1700, 960]];
    unis.forEach(([ux, uy], i) => {
      ctx.fillStyle = '#1c2260'; ctx.fillRect(ux - 90, uy - 90, 180, 90); ctx.beginPath(); ctx.moveTo(ux - 105, uy - 90); ctx.lineTo(ux, uy - 140); ctx.lineTo(ux + 105, uy - 90); ctx.fill();
      for (let c = 0; c < 5; c++) { ctx.fillStyle = '#2a3270'; ctx.fillRect(ux - 75 + c * 36, uy - 82, 12, 82); }
      const f = clamp(flow * 1.6 - i * .2);
      if (f > 0) {
        const pts = []; for (let k = 0; k <= 30; k++) { const v = k / 30; pts.push([mix(1550, ux, v), mix(by + 40, uy - 120, v) - Math.sin(v * Math.PI) * 160]); }
        glowLine(ctx, pts, f, { color: C.cyan, width: 3, glowW: 14, alpha: .8 });
        if (f >= 1) addGlow(ctx, ux, uy - 60, 120, .4 + .1 * Math.sin(t * 4 + i), P.cyan, '#e8fbff');
      }
    });
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 114: a coin into the fountain; water runs out in channels to many fields ----------
const fountain = (T) => {
  const t0 = T.S('09b', 'Funders'), tShare = T.S('09b', 'shared with');
  return (ctx, t, s) => {
    bg(ctx, [[0, '#101a3a'], [1, '#1c2a50']]);
    ctx.save(); look(ctx, 960, 560, mix(1.12, 1.0, eio(lin(s.a, s.b, t))));
    // ground seen from above at an angle: fields at the edges
    const fl = lin(tShare - 1.0, tShare + .8, t);
    const fields = []; for (let i = 0; i < 12; i++) { const q = i / 12 * 6.283 + .15; fields.push([960 + Math.cos(q) * 760, 560 + Math.sin(q) * 380, q]); }
    fields.forEach(([fx, fy, q], i) => {
      const lit = clamp(fl * 1.4 - (i % 6) * .08);
      ctx.save(); ctx.translate(fx, fy); ctx.rotate(q);
      ctx.fillStyle = mixHex('#18224a', '#2f6a5a', lit); ctx.fillRect(-90, -50, 180, 100);
      ctx.strokeStyle = rgba(mixHex('#24305a', '#9fe8c0', lit), .7); ctx.lineWidth = 2; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.moveTo(-90, k * 20); ctx.lineTo(90, k * 20); ctx.stroke(); }
      ctx.restore();
      // channel from the fountain
      const pts = []; for (let k = 0; k <= 30; k++) { const v = k / 30; pts.push([mix(960, fx, v) + Math.sin(v * 6 + i) * 14, mix(560, fy, v)]); }
      ctx.strokeStyle = 'rgba(10,14,40,.9)'; ctx.lineWidth = 12; ctx.beginPath(); pts.forEach(([x, y], k) => k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
      const w = clamp(lin(t0 + 1.0, tShare + .6, t) * 1.2 - (i % 4) * .05);
      glowLine(ctx, pts, w, { color: C.cyan, width: 4, glowW: 14, alpha: .9 });
      if (lit > 0) addGlow(ctx, fx, fy, 120, .25 * lit, '#9fe8c0', '#ffffff');
    });
    // fountain basin
    ctx.fillStyle = '#2a3270'; ctx.beginPath(); ctx.ellipse(960, 580, 190, 90, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#3a8ab8'; ctx.beginPath(); ctx.ellipse(960, 570, 160, 70, 0, 0, 7); ctx.fill();
    // water column + spray
    for (let k = 0; k < 40; k++) { const q = ((t * .9 + k / 40) % 1), a = k / 40 * 6.283; const x = 960 + Math.cos(a) * 80 * q, y = 560 - Math.sin(q * Math.PI) * 140 + Math.sin(a) * 30 * q; ctx.fillStyle = rgba('#cfefff', .7 * (1 - q)); ctx.fillRect(x, y, 3, 3); }
    // the coin falls, splash rings
    const tc = T.S('09b', 'pay for'), f = ein(lin(t0 - .2, tc, t));
    if (f < 1) { const cy = mix(-80, 560, f); ctx.save(); ctx.translate(960, cy); ctx.scale(Math.cos(t * 9), 1); ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fill(); ctx.strokeStyle = '#a8661e'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); addGlow(ctx, 960, cy, 60, .5, P.amber, '#fff3dd'); }
    else for (let r = 0; r < 3; r++) { const q = clamp((t - tc - r * .3) / 1.2); if (q <= 0 || q >= 1) continue; ctx.strokeStyle = rgba('#ffe6a0', .7 * (1 - q)); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(960, 570, 20 + q * 140, (20 + q * 140) * .44, 0, 0, 7); ctx.stroke(); }
    addGlow(ctx, 960, 560, 200, .35, P.cyan, '#e8fbff');
    ctx.restore();
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- 115: the narrow door: three hands on the handle together, the door gives ----------
const DOORC = { x: 960, y: 540 };
const doorHands = (T) => {
  const t0 = T.S('09b', 'And none'), tLabs = T.S('09b', 'The labs'), tGov = T.S('09b', 'the governments'), tVot = T.S('09b', 'and the voters'), tAll = T.S('09b', 'all have');
  return (ctx, t, s) => {
    const tOpenEnd = T.seg('09b').end + 1.6, open = eio(lin(tAll + .2, tOpenEnd, t));
    bg(ctx, [[0, '#090b24'], [1, '#141844']]);
    ctx.save(); look(ctx, mix(1000, DOORC.x, open), mix(560, DOORC.y, open), mix(1.0, 1.35, open));
    // wall + fence texture
    ctx.fillStyle = '#0e1238'; ctx.fillRect(-400, 0, W + 800, H);
    ctx.strokeStyle = 'rgba(40,50,110,.5)'; ctx.lineWidth = 1.2; for (let x = -400; x < W + 400; x += 26) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 300, H); ctx.moveTo(x + 300, 0); ctx.lineTo(x, H); ctx.stroke(); }
    // the doorway (light behind)
    const dx0 = 860, dx1 = 1060, dy0 = 260, dy1 = 820;
    const lg = ctx.createLinearGradient(0, dy0, 0, dy1); lg.addColorStop(0, '#fff3dd'); lg.addColorStop(1, '#ffb35c');
    ctx.fillStyle = lg; ctx.fillRect(dx0, dy0, dx1 - dx0, dy1 - dy0);
    // the leaf swings inward, the gap grows (centred near x=960 at the end)
    const gap = mix(10 + 4 * Math.sin(t * .8), 200, open);
    ctx.fillStyle = '#080a26'; ctx.fillRect(dx0, dy0, dx1 - dx0 - gap, dy1 - dy0);
    ctx.fillStyle = '#121640'; ctx.fillRect(dx0, dy0, 8, dy1 - dy0);
    addGlow(ctx, dx1 - gap / 2, (dy0 + dy1) / 2, 180 + 600 * open, .45 + .5 * open, P.amber, '#fff3dd');
    beam(ctx, dx1 - gap / 2, dy1, gap, dx1 + 300 * (1 - open), H + 300, gap * 4 + 300, '#ffd29a', .35 + .3 * open);
    ctx.strokeStyle = '#1b2052'; ctx.lineWidth = 16; ctx.strokeRect(dx0 - 8, dy0 - 8, dx1 - dx0 + 16, dy1 - dy0 + 8);
    // handle
    const hx = dx1 - gap - 40, hy = 560;
    ctx.fillStyle = '#c9a25a'; ctx.beginPath(); ctx.roundRect(hx - 26, hy - 8, 52, 16, 8); ctx.fill(); ctx.fillStyle = '#8a6a3a'; ctx.beginPath(); ctx.arc(hx + 18, hy, 12, 0, 7); ctx.fill();
    ctx.restore();
    // three hands arrive on the handle (screen space follows the camera roughly)
    const cam = (x, y) => { const z = mix(1.0, 1.35, open), cx = mix(1000, DOORC.x, open), cy = mix(560, DOORC.y, open); return [W / 2 + (x - cx) * z, H / 2 + (y - cy) * z]; };
    const [HX, HY] = cam(1060 - mix(10, 200, open) - 40, 560);
    const hands = [
      { t: tLabs, from: [HX - 520, H + 140], to: [HX - 40, HY - 14], sleeve: '#d9d6e8', cuff: '#9fb0d0', skin: '#e0b48f' },
      { t: tGov, from: [HX - 120, H + 220], to: [HX - 26, HY + 22], sleeve: '#232a5c', cuff: '#e8e4d8', skin: '#8a5a3c' },
      { t: tVot, from: [HX + 420, H + 160], to: [HX + 6, HY + 4], sleeve: '#b8641e', cuff: '#7a3b17', skin: '#c98f6a', ballot: true },
    ];
    hands.forEach((h) => {
      const u = eout(lin(h.t - .2, h.t + .7, t)); if (u <= 0) return;
      const x = mix(h.from[0], h.to[0], u), y = mix(h.from[1], h.to[1], u);
      reach(ctx, h.from[0], h.from[1], x, y, { sleeve: h.sleeve, cuff: h.cuff, skin: h.skin, w: 58, grip: u, rimA: .5 });
      if (h.ballot) { ctx.save(); ctx.translate(x - 30, y + 30); ctx.rotate(.4); ctx.fillStyle = '#f3efe2'; ctx.fillRect(-30, -20, 60, 40); ctx.strokeStyle = '#5a5f8a'; ctx.lineWidth = 2; ctx.strokeRect(-20, -10, 14, 14); chalkLine(ctx, [[-18, -4], [-13, 2], [-6, -10]], 1, { hex: '#c94a40', w: 3 }); ctx.restore(); }
    });
    void t0;
    motes(ctx, t, { seed: 115, n: 50, a: .25 + .3 * open, hex: '#ffd29a' });
    finish(ctx, t, { vig: .55 });
  };
};

export default function (T) {
  const A = (p, n) => T.S('09a', p, n), B = (p, n) => T.S('09b', p, n), K = T.clip('K9');
  return [
    { t: A("I don't") - .2, draw: twoWindows(T), tr: 'zoom', d: 1.0, x: W / 2, y: H / 2, depth: 4 },
    { t: A('But the second') - .2, draw: boardIntro(T), tr: 'match', d: .5 },
    { t: A('First') - .3, draw: ideaLab(T), tr: 'zoom', d: 1.0, x: 427, y: 529, depth: 5 },
    { t: A('In twenty') - .25, draw: berkeley(T), tr: 'zoom', d: 1.0, x: 1500, y: 300, depth: 4 },
    { t: A('Robots mixed') - .25, draw: robotLoop(T), tr: 'zoom', d: .9, x: 1200, y: 640, depth: 3 },
    { t: A('In a little') - .25, draw: shelfFill(T), tr: 'iris', d: 1.0, x: 1320, y: 620 },
    { t: A('Other scientists') - .2, draw: shelfDoubt(T), tr: 'match', d: .5 },
    { t: A('That debate') - .2, draw: delicate(T), tr: 'left', d: 1.0 },
    { t: A('But the idea') - .3, draw: labTrain(T), tr: 'out', d: 1.2, x: 1065, y: 620, depth: 5 },
    { t: A('Second', 1) - .3, draw: boardScale(T), tr: 'out', d: 1.2, x: 960, y: 540, depth: 5 },
    { t: A("We've done") - .25, draw: album(T), tr: 'iris', d: .8, x: 960, y: 560 },
    { t: A('In March') - .3, draw: ukMap(T), tr: 'zoom', d: .9, x: 1240, y: 590, depth: 4 },
    { t: A('Within') - .3, draw: bottle(T), tr: 'iris', d: 1.0, x: 960, y: 900 },
    { t: A('Among') - .3, draw: ward(T), tr: 'out', d: 1.1, x: 1189, y: 610, depth: 5 },
    { t: A('The vaccines') - .25, draw: vaccine(T), tr: 'zoom', d: .9, x: 885, y: 390, depth: 5 },
    { t: A("They didn't") - .25, draw: parallel(T), tr: 'push', d: .9 },
    { t: A('That was') - .3, draw: daylight(T), tr: 'right', d: 1.1 },
    { t: A('Health agencies') - .3, draw: keyBoard(T), tr: 'right', d: 1.0 },
    { t: A('Third', 1) - .3, draw: boardDoor(T), tr: 'out', d: 1.1, x: W / 2, y: 540, depth: 5 },
    { t: A('When Google') - .3, draw: library(T), tr: 'zoom', d: 1.0, x: W / 2, y: 540, depth: 5 },
    { t: K.start - .3, draw: clipK9(T), tr: 'zoom', d: 1.0, x: W / 2, y: 470, depth: 3 },
    { t: B('Today') - .3, draw: worldLand(T), tr: 'up', d: 1.0 },
    { t: B("That's what") - .2, draw: worldGarden(T), tr: 'match', d: .6 },
    { t: B('But a market') - .25, draw: compass(T), tr: 'push', d: .9 },
    { t: B('Even Hassabis') - .25, draw: quote110(T), tr: 'dissolve', d: .8 },
    { t: B('So who') - .25, draw: helmEmpty(T), tr: 'iris', d: 1.0, x: W / 2, y: 470 },
    { t: B('Right now') - .2, draw: helmHands(T), tr: 'match', d: .5 },
    { t: B('Governments can') - .3, draw: publicScience(T), tr: 'down', d: 1.1 },
    { t: B('Funders') - .3, draw: fountain(T), tr: 'zoom', d: 1.0, x: 1550, y: 520, depth: 4 },
    { t: B('And none') - .3, draw: doorHands(T), tr: 'iris', d: 1.0, x: W / 2, y: 560 },
  ];
}
