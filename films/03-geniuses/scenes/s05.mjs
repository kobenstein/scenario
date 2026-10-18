// 05 · The promise (3:39–4:24): a whole country of them; Amodei's compressed century; Hassabis (clip K6); bets, not facts.
// Carrier chain: camera rises out of the bus window → glowing city on the horizon → calendar pages → the squeezed century →
// a thin book → protein ribbon → clinic monitor (clip) → disease names → poker chips → a chip rolls into a dark corridor →
// the light under a door, at screen centre (s06 takes over there).
import { W, H, C, rgba, clamp, lin, mix, sm, eio, eout, ein, sine, prng, canvas, addGlow, text } from '../engine.mjs';
import { P, skyGrad, cityLayer, fogBand, cone, person, finish, shade, mixHex } from '../lib/world.mjs';
import { clipScreen, clipLabel, clipQuote, source } from '../lib/kit.mjs';

const cache = new Map(); const once = (k, f) => { if (!cache.has(k)) cache.set(k, f()); return cache.get(k); };
const zoomAt = (ctx, x, y, z) => { ctx.translate(x, y); ctx.scale(z, z); ctx.translate(-x, -y); };

// ---------- shot 50: rising over the night city; on the horizon a second city of light glows ----------
const horizon = (T) => {
  const t0 = T.S('05a', 'So what'), tC = T.S('05a', 'country'), tEnd = T.S('05a', "Amodei's bet");
  const near = () => once('h_near', () => cityLayer({ seed: 611, z: 1.4, base: H * 1.02, hMin: 260, hMax: 620, col: '#141846', lit: .22, litCol: P.amber, span: 3400, fogAmt: .2 }));
  const mid = () => once('h_mid', () => cityLayer({ seed: 612, z: 3, base: H * .86, hMin: 120, hMax: 320, col: '#1d2560', lit: .12, litCol: P.amber, span: 3000, fogTo: '#3a4a92', fogAmt: .5 }));
  return (ctx, t, s) => {
    const rise = eio(lin(s.a, tEnd, t)), camY = mix(-260, 120, rise);
    skyGrad(ctx, { t, stars: .7, bottom: '#41579e' });
    // the light city: a band of countless points on the horizon, growing brighter on "country"
    const hy = 640 + camY * .15, b = .5 + .5 * sm(lin(tC - .4, tC + .8, t));
    const hg = ctx.createLinearGradient(0, hy - 160, 0, hy + 40); hg.addColorStop(0, rgba(P.amber, 0)); hg.addColorStop(1, rgba('#ffd29a', .35 * b)); ctx.fillStyle = hg; ctx.fillRect(0, hy - 160, W, 200);
    const r = prng(5); for (let i = 0; i < 1400; i++) { const x = r() * W, y = hy - Math.pow(r(), 3) * 70, tw = .6 + .4 * Math.sin(t * (1 + r() * 3) + i); ctx.fillStyle = rgba(r() < .7 ? '#ffd29a' : C.cyanWhite, b * tw * (.3 + .6 * r())); ctx.fillRect(x, y, 2, 2); }
    addGlow(ctx, 960, hy - 20, 700, .35 * b, P.amber, '#fff3dd');
    fogBand(ctx, t, hy + 30, 160, { a: .3, hex: '#8ab8e8' });
    mid().draw(ctx, t, t * 10, mix(0, -1200, rise), 1);
    near().draw(ctx, t, t * 18, mix(0, -700, rise), 1);
    // the bus far below, a little row of lit windows on the street
    const by = H + 40 + camY * 1.6; if (by < H + 80) { ctx.fillStyle = '#0d1033'; ctx.fillRect(700, by - 40, 380, 46); for (let i = 0; i < 8; i++) { ctx.fillStyle = rgba('#ffd29a', .8); ctx.fillRect(716 + i * 45, by - 32, 32, 16); } }
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- shot 51: a century of calendar pages (2026 → 2126) squeezed by two hands to ten pages ----------
function bigHand(ctx, x, y, s, flip, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(flip ? -s : s, s);
  ctx.fillStyle = '#2a2f6e'; ctx.beginPath(); ctx.roundRect(-520, -70, 380, 150, 30); ctx.fill(); ctx.fillStyle = P.amberDeep; ctx.fillRect(-170, -70, 26, 150);
  ctx.fillStyle = '#c98f6a'; ctx.beginPath(); ctx.roundRect(-150, -110, 150, 220, 50); ctx.fill();
  for (let i = 0; i < 4; i++) { ctx.fillStyle = shade('#c98f6a', -.03 * i); ctx.beginPath(); ctx.roundRect(-20, -100 + i * 50, 44, 44, 20); ctx.fill(); }
  ctx.fillStyle = shade('#c98f6a', -.08); ctx.beginPath(); ctx.roundRect(-110, -150, 60, 90, 28); ctx.fill();
  ctx.restore();
}
const century = (T) => {
  const t0 = T.S('05a', "Amodei's bet"), tF = T.S('05a', 'fifty'), tSq = T.S('05a', 'squeezed'), tTen = T.E('05a', 'five to ten'), tEnd = T.S('05a', 'He calls');
  const N = 100;
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(960, 520, 0, 960, 520, 1100); bg.addColorStop(0, '#1d2458'); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const open = eout(lin(t0 - .3, tF + .2, t)), sq = eio(lin(tSq - .1, tTen + .1, t));
    const width = mix(260, 1620, open) * mix(1, .12, sq), x0 = 960 - width / 2, ph = 300;
    // the accordion: zig-zag pages, each a little calendar sheet
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1), x = x0 + u * width, skew = (i % 2 ? 1 : -1) * mix(8, 1, sq);
      const light = .55 + .45 * Math.abs(Math.sin(i * .9 + t * .2));
      ctx.fillStyle = mixHex('#c9bc9c', '#efe4c8', light); ctx.beginPath(); ctx.moveTo(x, 540 - ph / 2); ctx.lineTo(x + width / N + skew, 540 - ph / 2 + 6); ctx.lineTo(x + width / N + skew, 540 + ph / 2 + 6); ctx.lineTo(x, 540 + ph / 2); ctx.fill();
      ctx.fillStyle = mixHex('#8a2e22', '#b4472e', light); ctx.fillRect(x, 540 - ph / 2, width / N + 1, 26);
    }
    // year markers riding on the pages
    for (let y = 0; y <= 100; y += 10) { const u = y / 100, x = x0 + u * width, a = (1 - sm(clamp(sq * 3)) * (y % 100 ? 1 : 0)) * open; text(ctx, String(2026 + y), x, 540 + ph / 2 + 50, { size: 26, weight: 500, color: C.cream, align: 'center', alpha: a }); ctx.fillStyle = rgba(C.cream, .5 * a); ctx.fillRect(x - 1, 540 + ph / 2 + 12, 2, 12); }
    addGlow(ctx, 960, 540, mix(300, 160, sq), .25 + .3 * sq, P.amber, '#fff3dd');
    // two hands press from both sides
    const hx = width / 2 + 60;
    bigHand(ctx, 960 - hx, 540, 1, false, t); bigHand(ctx, 960 + hx, 540, 1, true, t);
    // the counter above: 50–100 years → 5–10 years
    const la = lin(tF - .2, tF + .3, t) * (1 - lin(tEnd - .4, tEnd, t));
    text(ctx, sq < .5 ? '50–100 years' : '5–10 years', 960, 250, { size: 84, font: 'Instrument Serif', align: 'center', color: sq < .5 ? C.cream : P.amber, alpha: la });
    text(ctx, 'OF PROGRESS IN BIOLOGY AND MEDICINE', 960, 300, { size: 18, weight: 600, spacing: 6, align: 'center', color: C.muted, alpha: la });
    source(ctx, t, t0, tEnd, "Dario Amodei's bet · Machines of Loving Grace, 2024", { x: 110, y: 1010 });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- shot 52: the squeezed pages close into a slim book: the compressed 21st century ----------
function slimBook(ctx, x, y, w, h, t, a = 1) {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.fillRect(-w / 2 + 16, -h / 2 + 18, w, h);
  const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0); g.addColorStop(0, '#5a2f22'); g.addColorStop(.5, '#7a3b28'); g.addColorStop(1, '#4a2418'); ctx.fillStyle = g; ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.fillStyle = '#3a1c12'; ctx.fillRect(-w / 2, -h / 2, 24, h);
  ctx.strokeStyle = rgba('#e0b060', .8); ctx.lineWidth = 2; ctx.strokeRect(-w / 2 + 40, -h / 2 + 30, w - 70, h - 60);
  // the gold title catches a light sweep
  const sw = ((t * .35) % 1.6) - .3;
  text(ctx, 'The', 12, -60, { size: 40, font: 'Instrument Serif Italic', align: 'center', color: '#e0b060', alpha: a });
  text(ctx, 'Compressed', 12, 6, { size: 66, font: 'Instrument Serif', align: 'center', color: '#e0b060', alpha: a });
  text(ctx, '21st Century', 12, 76, { size: 66, font: 'Instrument Serif', align: 'center', color: '#e0b060', alpha: a });
  ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip(); const sg = ctx.createLinearGradient(-w / 2 + sw * w - 80, 0, -w / 2 + sw * w + 80, 0); sg.addColorStop(0, 'rgba(255,240,200,0)'); sg.addColorStop(.5, 'rgba(255,240,200,.18)'); sg.addColorStop(1, 'rgba(255,240,200,0)'); ctx.fillStyle = sg; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.restore();
  ctx.restore();
}
const book = (T) => {
  const t0 = T.S('05a', 'He calls'), tC = T.S('05a', 'compressed'), tEnd = T.S('05a', 'Demis');
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(960, 520, 0, 960, 520, 1100); bg.addColorStop(0, '#1d2458'); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const fold = eio(lin(t0 - .3, tC, t)), w = mix(200, 560, fold), h = mix(300, 720, fold) * mix(1, 1, fold);
    // the squeezed stack first (pages edge-on), then it turns to face us as the book
    if (fold < 1) { ctx.save(); ctx.translate(960, 540); ctx.globalAlpha = 1 - fold; for (let i = 0; i < 10; i++) { ctx.fillStyle = i % 2 ? '#efe4c8' : '#d9cba8'; ctx.fillRect(-100 + i * 20, -150, 20, 300); ctx.fillStyle = '#b4472e'; ctx.fillRect(-100 + i * 20, -150, 20, 26); } ctx.restore(); }
    ctx.save(); zoomAt(ctx, 960, 540, 1 + .04 * lin(tC, tEnd, t));
    slimBook(ctx, 960, 540 + Math.sin(t * .9) * 6, w, h, t, fold);
    ctx.restore();
    addGlow(ctx, 960, 540, 600, .18 * fold, P.amber, '#fff3dd');
    // spine thickness callout: "ten pages thin"
    text(ctx, '“the compressed 21st century”', 960, 990, { size: 44, font: 'Instrument Serif Italic', align: 'center', color: C.cream, alpha: lin(tC, tC + .5, t) * (1 - lin(s.b - .5, s.b, t)) });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- shot 53: a protein ribbon rises out of the book and folds; a Nobel medal turns beside it ----------
function ribbon(ctx, t, cx, cy, fold, rise, a = 1) {
  // a long ribbon: unfolded = a wavy line; folded = helices packed into a compact knot
  const n = 240, pts = [];
  for (let i = 0; i < n; i++) {
    const u = i / (n - 1), seg = Math.floor(u * 5), su = u * 5 - seg;
    const ox = (u - .5) * 900, oy = Math.sin(u * 12 + t) * 30;
    const ang = seg * 1.26 + t * .3, rr = 120, hx = Math.cos(ang) * rr + Math.cos(su * 22) * 34 * Math.cos(ang + 1.57), hy = Math.sin(ang) * rr * .7 + (su - .5) * 150 + Math.sin(su * 22) * 20;
    pts.push([cx + mix(ox, hx, fold), cy - rise + mix(oy, hy, fold), Math.sin(su * 22 + seg)]);
  }
  ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (let i = 1; i < n; i++) {
    const [x0, y0, d0] = pts[i - 1], [x1, y1] = pts[i], col = mixHex(C.cyan, P.amber, i / n);
    ctx.strokeStyle = rgba(shade(col, -.25 + .25 * d0), .95); ctx.lineWidth = 10 + 8 * (d0 * .5 + .5); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  ctx.restore();
  addGlow(ctx, cx, cy - rise, 300, .3 * a, C.cyan, C.cyanWhite);
}
function medal(ctx, x, y, r, t, a = 1) {
  if (a <= 0) return;
  const sx = Math.cos(t * 1.2); ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y);
  ctx.fillStyle = '#7a3b28'; ctx.beginPath(); ctx.moveTo(-30, -r - 140); ctx.lineTo(0, -r + 10); ctx.lineTo(30, -r - 140); ctx.fill();
  ctx.scale(Math.max(.06, Math.abs(sx)), 1);
  const g = ctx.createRadialGradient(-r * .3, -r * .3, 0, 0, 0, r); g.addColorStop(0, '#ffe6a8'); g.addColorStop(1, '#b07a2a'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
  ctx.strokeStyle = '#8a5a1a'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, 0, r * .82, 0, 7); ctx.stroke();
  if (sx > 0) { ctx.fillStyle = '#8a5a1a'; ctx.beginPath(); ctx.ellipse(-4, -6, r * .3, r * .38, 0, 0, 7); ctx.fill(); } else { text(ctx, 'NOBEL', 0, 8, { size: r * .28, weight: 600, align: 'center', color: '#8a5a1a', spacing: 2 }); }
  ctx.restore(); addGlow(ctx, x, y, r * 1.8, .35 * a, P.amber, '#fff3dd');
}
const protein = (T) => {
  const t0 = T.S('05a', 'Demis'), tN = T.S('05a', 'Nobel'), tBio = T.S('05a', 'biology', 1), tFur = T.S('05a', 'goes further'), clip = T.clip('K6');
  return (ctx, t, s) => {
    const bg = ctx.createRadialGradient(960, 520, 0, 960, 520, 1100); bg.addColorStop(0, '#16204e'); bg.addColorStop(1, '#070918'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const rise = eout(lin(t0 - .2, t0 + 1.2, t)) * 300, fold = eio(lin(t0 + .6, tBio + .3, t));
    const go = eio(lin(tFur, clip.start + .2, t)); // at the end: ribbon shrinks toward the monitor position of the next shot
    ctx.save(); zoomAt(ctx, 960, 540, 1 - .0 * go);
    slimBook(ctx, 960, 760 + rise * .4, 440, 560, t, 1 - sm(lin(t0 + .8, t0 + 1.6, t)));
    ribbon(ctx, t, mix(860, 1210, go), 760, fold * (1 - .3 * go), rise, 1 - .3 * go);
    medal(ctx, 1520, 420, 110, t, lin(tN - .3, tN + .3, t) * (1 - go));
    ctx.restore();
    const la = lin(tN, tN + .4, t) * (1 - lin(tFur, tFur + .5, t));
    text(ctx, 'Demis Hassabis', 160, 820, { size: 56, font: 'Instrument Serif', color: C.cream, alpha: lin(t0, t0 + .4, t) * (1 - lin(tFur, tFur + .5, t)) });
    text(ctx, 'NOBEL PRIZE IN CHEMISTRY · 2024', 162, 866, { size: 18, weight: 600, spacing: 6, color: P.amber, alpha: la });
    text(ctx, 'for AI that predicts protein shapes', 162, 910, { size: 32, font: 'Instrument Serif Italic', color: C.muted, alpha: lin(tBio, tBio + .4, t) * (1 - lin(tFur, tFur + .5, t)) });
    finish(ctx, t, { vig: .5 });
  };
};

// ---------- clip K6: a monitor in a quiet clinic plays the clip; beside it, disease names fade one by one ----------
const MON = { x: 520, y: 210, w: 880, h: 495 };
const clinicClip = (T) => {
  const c = T.clip('K6'), names = ['Alzheimer’s', 'Malaria', 'Cancer', 'ALS', 'Sickle cell', 'Tuberculosis', 'Parkinson’s'];
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); zoomAt(ctx, MON.x + MON.w / 2, MON.y + MON.h / 2, mix(1.05, 1.0, u)); ctx.translate(mix(20, -20, u), 0);
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d2858'); g.addColorStop(1, '#141a40'); ctx.fillStyle = g; ctx.fillRect(-100, -100, W + 200, H + 200);
    // window with dawn light at the far left, a bed edge, an IV stand
    ctx.fillStyle = '#2a3a78'; ctx.fillRect(60, 120, 300, 520); ctx.fillStyle = '#121638'; ctx.fillRect(204, 120, 12, 520); ctx.fillRect(60, 372, 300, 12);
    const wg = ctx.createLinearGradient(0, 120, 0, 640); wg.addColorStop(0, rgba('#e9a07f', .1)); wg.addColorStop(1, rgba('#e9a07f', .45)); ctx.fillStyle = wg; ctx.fillRect(60, 120, 300, 520);
    ctx.fillStyle = 'rgba(233,160,127,.07)'; ctx.beginPath(); ctx.moveTo(60, 640); ctx.lineTo(360, 640); ctx.lineTo(760, 1080); ctx.lineTo(0, 1080); ctx.fill();
    ctx.fillStyle = '#e9e1cc'; ctx.fillRect(-60, 860, 640, 60); ctx.fillStyle = '#8fb0d0'; ctx.fillRect(-60, 846, 460, 30);
    ctx.fillStyle = '#0d1030'; ctx.fillRect(620, 300, 8, 700); ctx.fillStyle = 'rgba(216,247,255,.3)'; ctx.beginPath(); ctx.roundRect(590, 300, 66, 110, 14); ctx.fill();
    // monitor on an arm
    ctx.fillStyle = '#0b0d22'; ctx.fillRect(MON.x + MON.w / 2 - 14, MON.y + MON.h + 18, 28, 240); ctx.fillRect(MON.x - 20, MON.y - 20, MON.w + 40, MON.h + 40);
    clipScreen(ctx, t, T, 'K6', MON.x, MON.y, MON.w, MON.h, { radius: 4 });
    clipQuote(ctx, t, T, 'K6', MON.x + 40, MON.y + MON.h - 40, MON.w - 80, 32);
    ctx.restore();
    // disease names, right side, fading one after another while he speaks
    names.forEach((n, i) => {
      const tf = mix(c.start + 2.5, c.end - 1.5, i / (names.length - 1)), a = lin(c.start - .4, c.start + .3, t) * (1 - .82 * sm(lin(tf, tf + .9, t)));
      text(ctx, n, 1800, 300 + i * 74, { size: 44, font: 'Instrument Serif', color: C.cream, alpha: a * (1 - lin(s.b - .6, s.b, t)), align: 'right' });
      const st = sm(lin(tf, tf + .6, t)); if (st > 0) { ctx.save(); ctx.font = '44px "Instrument Serif"'; const w = ctx.measureText(n).width; ctx.restore(); ctx.fillStyle = rgba(P.amber, .7 * st * (1 - lin(s.b - .6, s.b, t))); ctx.fillRect(1800 - w * st, 300 + i * 74 - 14, w * st, 2); }
    });
    clipLabel(ctx, t, T, 'K6', 110, 990);
    finish(ctx, t, { vig: .45 });
  };
};

// ---------- shot 54: a poker table: chips in company colours are pushed in; biologists at the edge, arms crossed ----------
function chip(ctx, x, y, r, col, k = .45) {
  ctx.fillStyle = shade(col, -.25); ctx.beginPath(); ctx.ellipse(x, y + 6, r, r * k, 0, 0, 7); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y, r, r * k, 0, 0, 7); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.setLineDash([6, 8]); ctx.beginPath(); ctx.ellipse(x, y, r * .8, r * .8 * k, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]);
}
const CHIPCOL = [C.cyan, P.amber, '#e58f8a', '#9b8cff', '#7ff0b0'];
const poker = (T) => {
  const t0 = T.S('05b', 'These are bets'), tSell = T.S('05b', 'sell'), tBio = T.S('05b', 'Many biologists'), tHope = T.S('05b', 'far too hopeful'), tPoint = T.S('05b', 'have a point');
  const stacks = [[-300, -40, 0], [-120, 40, 1], [80, -30, 2], [260, 30, 3], [-20, -90, 4]];
  return (ctx, t, s) => {
    const u = sine(lin(s.a, s.b, t));
    ctx.save(); zoomAt(ctx, 960, 560, mix(1.0, 1.08, u)); ctx.translate(mix(0, -60, u), 0);
    ctx.fillStyle = '#0b0d26'; ctx.fillRect(-200, -200, W + 400, H + 400);
    cone(ctx, 960, -40, 980, 0, .5, '#ffe7c4', .26); ctx.fillStyle = '#05060f'; ctx.fillRect(900, -60, 120, 40);
    // biologists standing in the dark around the table: lab coats, arms crossed; one shakes the head
    const ba = sm(lin(tBio - .6, tBio + .3, t));
    for (const [x, sc, shake] of [[300, 1.0, 0], [1640, 1.05, 1], [1800, .9, 0], [140, .92, 0]]) {
      const look = shake ? Math.sin((t - tHope) * 9) * sm(lin(tHope, tHope + .3, t)) * (1 - sm(lin(tHope + 1.2, tHope + 1.6, t))) * 2.5 : 0;
      ctx.save(); ctx.globalAlpha = ba; person(ctx, x, 900, 460 * sc, t, { coat: '#e9e1cc', dark: '#283055', hood: false, skin: ['#8a5a3c', '#d9a77f', '#a8714f', '#e2b994'][Math.round(x) % 4], look, flip: x > 960,
        arm: (c, sh) => { c.strokeStyle = shade('#e9e1cc', -.2); c.lineWidth = 6; c.beginPath(); c.moveTo(-6, sh + 10); c.lineTo(10, sh + 26); c.lineTo(-10, sh + 26); c.stroke(); } }); ctx.restore();
    }
    // table: an oval of felt in perspective
    ctx.fillStyle = '#1a0f0a'; ctx.beginPath(); ctx.ellipse(960, 720, 760, 250, 0, 0, 7); ctx.fill();
    const fg = ctx.createRadialGradient(960, 690, 0, 960, 690, 760); fg.addColorStop(0, '#1d5a4a'); fg.addColorStop(1, '#0c2a26'); ctx.fillStyle = fg; ctx.beginPath(); ctx.ellipse(960, 700, 720, 225, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(243,239,226,.15)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(960, 700, 520, 160, 0, 0, 7); ctx.stroke();
    // stacks pushed in from the edge, one after another, by hands
    stacks.forEach(([dx, dy, k], i) => {
      const tp = t0 + .2 + i * .45 + (i > 2 ? tSell - t0 - 1.2 : 0), pu = eout(lin(tp, tp + .6, t)); if (pu <= 0) return;
      const ex = 960 + dx * 2.2 + (dx > 0 ? 300 : -300), ey = 860, x = mix(ex, 960 + dx, pu), y = mix(ey, 690 + dy, pu), n = 4 + (i * 3) % 5;
      for (let j = 0; j < n; j++) chip(ctx, x, y - j * 12, 40, CHIPCOL[k]);
      const ha = sm(lin(tp - .2, tp + .1, t)) * (1 - sm(lin(tp + .6, tp + 1, t))); if (ha > 0) { ctx.globalAlpha = ha; ctx.fillStyle = '#2a2f6e'; ctx.beginPath(); ctx.moveTo(x + (dx > 0 ? 30 : -30), y - 20); ctx.lineTo(x + (dx > 0 ? 500 : -500), y + 260); ctx.lineTo(x + (dx > 0 ? 560 : -560), y + 180); ctx.lineTo(x + (dx > 0 ? 60 : -60), y - 50); ctx.fill(); ctx.fillStyle = '#c98f6a'; ctx.beginPath(); ctx.ellipse(x + (dx > 0 ? 50 : -50), y - 30, 40, 26, 0, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    });
    addGlow(ctx, 960, 690, 420, .18, P.amber, '#fff3dd');
    ctx.restore();
    text(ctx, 'BETS', 160, 200, { size: 22, weight: 600, spacing: 8, color: P.amber, alpha: lin(t0, t0 + .4, t) * (1 - lin(s.b - .5, s.b, t)) });
    text(ctx, 'from people who build and sell it', 160, 250, { size: 40, font: 'Instrument Serif Italic', color: C.cream, alpha: lin(tSell - .6, tSell, t) * (1 - lin(tBio - .2, tBio + .3, t)) });
    text(ctx, 'many biologists: “far too hopeful”', 160, 250, { size: 40, font: 'Instrument Serif Italic', color: C.cream, alpha: lin(tHope - .3, tHope + .2, t) * (1 - lin(s.b - .5, s.b, t)) });
    finish(ctx, t, { vig: .55 });
  };
};

// ---------- shot 55: a chip rolls off the table, the camera follows it into a dark corridor; light under a door ----------
const corridor = (T) => {
  const t0 = T.S('05b', 'Because'), tNob = T.S('05b', 'nobody'), tEnd = T.E('05b', 'talks about');
  const VP = [960, 470];
  return (ctx, t, s) => {
    const push = eio(lin(tNob - .4, s.b, t)), z = 1 + 1.6 * push;
    ctx.save(); zoomAt(ctx, 960, 540, z);
    ctx.fillStyle = '#05060f'; ctx.fillRect(0, 0, W, H);
    // corridor walls in one-point perspective: floor, ceiling, doors along the sides, all dark
    const D = { x0: 900, x1: 1020, y0: 380, y1: 560 };
    const quad = (pts, col) => { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill(); };
    quad([[0, 0], [W, 0], [D.x1 + 40, D.y0 - 30], [D.x0 - 40, D.y0 - 30]], '#0a0c24');
    quad([[0, H], [W, H], [D.x1 + 40, D.y1 + 10], [D.x0 - 40, D.y1 + 10]], '#0d1030');
    quad([[0, 0], [D.x0 - 40, D.y0 - 30], [D.x0 - 40, D.y1 + 10], [0, H]], '#0b0d2a');
    quad([[W, 0], [D.x1 + 40, D.y0 - 30], [D.x1 + 40, D.y1 + 10], [W, H]], '#090b26');
    for (const f of [.2, .45, .7]) { const lx = mix(0, D.x0 - 40, f), rx = mix(W, D.x1 + 40, f), ty = mix(0, D.y0 - 30, f), by = mix(H, D.y1 + 10, f); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(lx, ty + (by - ty) * .25, (1 - f) * 70 + 10, (by - ty) * .7); ctx.fillRect(rx - (1 - f) * 70 - 10, ty + (by - ty) * .25, (1 - f) * 70 + 10, (by - ty) * .7); }
    // floor lines
    ctx.strokeStyle = 'rgba(95,143,196,.06)'; ctx.lineWidth = 2; for (let i = -6; i <= 6; i++) { ctx.beginPath(); ctx.moveTo(960 + i * 320, H); ctx.lineTo(960 + i * 12, D.y1 + 10); ctx.stroke(); }
    // the door at the end, closed; warm light leaking from the gap underneath (exactly at screen centre at the end)
    ctx.fillStyle = '#0e1236'; ctx.fillRect(D.x0 - 40, D.y0 - 30, 200, D.y1 - D.y0 + 40);
    ctx.fillStyle = '#141a48'; ctx.fillRect(D.x0, D.y0, D.x1 - D.x0, 534 - D.y0);
    const flick = .85 + .15 * Math.sin(t * 7) * Math.sin(t * 3.1);
    ctx.fillStyle = rgba('#ffe2b0', flick); ctx.fillRect(D.x0, 534, D.x1 - D.x0, 6);
    addGlow(ctx, 960, 540, 90 + 40 * push, .7 * flick, P.amber, '#fff3dd');
    const fl = ctx.createLinearGradient(0, 540, 0, 760); fl.addColorStop(0, rgba('#ffd29a', .3 * flick)); fl.addColorStop(1, rgba('#ffd29a', 0)); ctx.fillStyle = fl; ctx.beginPath(); ctx.moveTo(D.x0, 540); ctx.lineTo(D.x1, 540); ctx.lineTo(D.x1 + 200, 760); ctx.lineTo(D.x0 - 200, 760); ctx.fill();
    // the chip rolls in from the bright table edge (left) down the corridor toward the door, wobbling, then lies flat
    const ru = eout(lin(s.a + .2, tNob, t)), cx = mix(-80, 960, ru), cy = mix(980, 600, ru), cr = mix(60, 10, ru);
    if (ru < 1) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.sin(t * 8) * .1 * (1 - ru)); ctx.scale(Math.max(.25, Math.abs(Math.cos((1 - ru) * 6))), 1); ctx.fillStyle = P.amber; ctx.beginPath(); ctx.ellipse(0, 0, cr * .35, cr, 0, 0, 7); ctx.fill(); ctx.restore(); }
    else { chip(ctx, 960, 600, 10, P.amber); }
    ctx.restore();
    // the bright table on the left at the start (camera pans off it)
    const ta = 1 - sm(lin(s.a + .2, s.a + 1.2, t)); if (ta > 0) { const g = ctx.createRadialGradient(-100, 900, 0, -100, 900, 700); g.addColorStop(0, rgba('#ffd29a', .35 * ta)); g.addColorStop(1, 'rgba(255,210,154,0)'); ctx.fillStyle = g; ctx.fillRect(0, 300, 900, 780); }
    finish(ctx, t, { vig: .6 });
  };
};

export default function (T) {
  const S = (p) => T.S('05a', p), Sb = (p) => T.S('05b', p), k6 = T.clip('K6');
  return [
    { t: S('So what') - .3, draw: horizon(T), tr: 'up', d: 1.4 },
    { t: S("Amodei's bet") - .2, draw: century(T), tr: 'zoom', d: .9, x: 960, y: 620, depth: 5 },
    { t: S('He calls') - .3, draw: book(T), tr: 'match', d: .6 },
    { t: S('Demis') - .25, draw: protein(T), tr: 'match', d: .6 },
    { t: k6.start - .4, draw: clinicClip(T), tr: 'iris', d: .8, x: MON.x + MON.w / 2, y: MON.y + MON.h / 2, r: 60 },
    { t: Sb('These are bets') - .2, draw: poker(T), tr: 'black', d: .8 },
    { t: Sb('Because') - .35, draw: corridor(T), tr: 'left', d: 1.0 },
  ];
}
