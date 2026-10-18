// "In a small study last year, experienced programmers using AI felt faster.
//  Timed, they were nineteen percent slower."
// A developer at a screen where an AI fills in code (cyan ghost lines). Beside him a big dial, slower on the left,
// faster on the right. The amber needle (how it felt) swings to +20 %. On "Timed" the dial grows a crown and
// becomes a stopwatch: a cyan hand sweeps round and settles on the slow side, at minus 19 %.
const L = require('./lib');
const { W, H, C, sm, ease, out, ramp, lerp, drift, hash, rng, lin, rad, rgba, light, cone, clamp, label, stamp } = L;
const { grainFill, roundRect, poly, cap, cached, motes } = require('./s_k2_studio');
const { figure } = require('./s_timeline');

const T0 = 119.5, T1 = 128.45;
const T_FELT = 123.92, T_TIMED = 125.36, T_SLOW = 127.28;

// ---------- the developer's screen: code with AI suggestions appearing as ghost text ----------
const CODE = (() => { const r = rng(808), rows = []; let ind = 0;
  for (let i = 0; i < 40; i++) { if (r() < 0.15 && ind) ind--; else if (r() < 0.25 && ind < 3) ind++;
    const n = 1 + Math.floor(r() * 4), toks = []; for (let k = 0; k < n; k++) toks.push({ w: 18 + r() * 70, c: r() });
    rows.push({ ind, toks, ghost: r() < 0.45 }); }
  return rows; })();
const MON = { x: 190, y: 250, w: 600, h: 380 };
function monitor(ctx, t, k) {
  ctx.fillStyle = '#05060f'; ctx.beginPath(); roundRect(ctx, MON.x - 14, MON.y - 14, MON.w + 28, MON.h + 28, 10); ctx.fill();
  grainFill(ctx, c => roundRect(c, MON.x, MON.y, MON.w, MON.h, 4), lin(ctx, MON.x, MON.y, MON.x + MON.w * 0.4, MON.y + MON.h, [[0, '#147a9a'], [0.6, '#0c4c69'], [1, '#072e45']]), 0.25);
  ctx.save(); ctx.beginPath(); ctx.rect(MON.x + 8, MON.y + 8, MON.w - 16, MON.h - 16); ctx.clip();
  const prog = (t - T0 + 2) * 2.6, scroll = Math.max(0, prog - 15) * 22;
  CODE.forEach((row, i) => {
    const y = MON.y + 26 + i * 22 - scroll; if (y < MON.y || y > MON.y + MON.h) return;
    const f = clamp(prog - i); if (f <= 0) return;
    let x = MON.x + 24 + row.ind * 26;
    // ghost suggestion: appears all at once in faint cyan, then is accepted (turns solid)
    const ghost = row.ghost, acc = ghost ? clamp((prog - i - 0.6) * 2) : 1;
    for (const tk of row.toks) {
      const w = tk.w * (ghost ? 1 : f);
      ctx.fillStyle = ghost ? rgba(C.cyanW, 0.25 + 0.6 * acc) : tk.c < 0.6 ? rgba(C.cream, 0.75) : tk.c < 0.85 ? rgba(C.cyan, 0.8) : rgba(C.amber, 0.85);
      ctx.beginPath(); roundRect(ctx, x, y, Math.max(3, w), 8, 3); ctx.fill(); x += tk.w + 12;
    }
  });
  ctx.restore();
  ctx.fillStyle = lin(ctx, MON.x, MON.y, MON.x + MON.w, MON.y + MON.h, [[0, 'rgba(216,247,255,0.10)'], [0.5, 'rgba(216,247,255,0)'], [1, 'rgba(216,247,255,0.04)']]); ctx.fillRect(MON.x, MON.y, MON.w, MON.h);
  ctx.fillStyle = '#05060f'; ctx.fillRect(MON.x + MON.w / 2 - 20, MON.y + MON.h + 14, 40, 60); ctx.fillRect(MON.x + MON.w / 2 - 80, MON.y + MON.h + 70, 160, 10);
  light(ctx, MON.x + MON.w / 2, MON.y + MON.h / 2, 620, C.cyan, 0.15 * k);
}

// ---------- the dial ----------
const D = { x: 1400, y: 420, r: 240 };
const RANGE = 30, SWEEP = 2.2;                     // +-30 % mapped to +-2.2 rad from the top
const angOf = pct => pct / RANGE * SWEEP;          // 0 = straight up
function dialArt(c) {
  const { x, y, r } = D;
  // body
  grainFill(c, k => k.arc(x, y, r + 26, 0, Math.PI * 2), lin(c, x - r, y - r, x + r, y + r, [[0, '#2c2860'], [1, '#0c0b24']]), 0.5);
  grainFill(c, k => k.arc(x, y, r, 0, Math.PI * 2), rad(c, x, y - 40, 20, r, [[0, '#f6efdc'], [0.75, '#e3d8bd'], [1, '#b9ab90']]), 0.3);
  // coloured bands: slow side violet, fast side amber
  c.lineWidth = 22; c.lineCap = 'butt';
  c.strokeStyle = 'rgba(90,74,138,0.55)'; c.beginPath(); c.arc(x, y, r - 34, -Math.PI / 2 - SWEEP, -Math.PI / 2); c.stroke();
  c.strokeStyle = 'rgba(255,179,92,0.55)'; c.beginPath(); c.arc(x, y, r - 34, -Math.PI / 2, -Math.PI / 2 + SWEEP); c.stroke();
  // ticks every 5 %
  for (let p = -RANGE; p <= RANGE; p += 5) {
    const a = -Math.PI / 2 + angOf(p), big = p % 10 === 0;
    c.strokeStyle = '#2a2240'; c.lineWidth = big ? 4 : 2;
    c.beginPath(); c.moveTo(x + Math.cos(a) * (r - 16), y + Math.sin(a) * (r - 16)); c.lineTo(x + Math.cos(a) * (r - (big ? 62 : 50)), y + Math.sin(a) * (r - (big ? 62 : 50))); c.stroke();
  }
  c.fillStyle = '#2a2240'; c.font = '26px "Inter SemiBold"'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.letterSpacing = '4px';
  c.fillText('SLOWER', x - r * 0.48, y + r * 0.42); c.fillText('FASTER', x + r * 0.48, y + r * 0.42);
  c.font = '22px "Inter Medium"'; c.fillStyle = 'rgba(42,34,64,0.7)'; c.letterSpacing = '0px';
  for (const p of [-20, -10, 10, 20]) { const a = -Math.PI / 2 + angOf(p); c.fillText((p > 0 ? '+' : '') + p + '%', x + Math.cos(a) * (r - 92), y + Math.sin(a) * (r - 92)); }
}
function needle(ctx, a, len, w, col, glow) {
  ctx.save(); ctx.translate(D.x, D.y); ctx.rotate(a);
  ctx.fillStyle = 'rgba(20,14,30,0.25)'; ctx.beginPath(); ctx.moveTo(-w + 4, 6); ctx.lineTo(4, -len + 6); ctx.lineTo(w + 4, 6); ctx.closePath(); ctx.fill();
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(-w, 0); ctx.lineTo(0, -len); ctx.lineTo(w, 0); ctx.lineTo(0, 30); ctx.closePath(); ctx.fill();
  ctx.restore();
  if (glow) light(ctx, D.x + Math.sin(a) * len * 0.9, D.y - Math.cos(a) * len * 0.9, 50, col, glow);
}

function draw(ctx, t) {
  const z = lerp(1.0, 1.06, sm((t - T0) / (T1 - T0)));
  const dx = drift(t, 1, 7) * 6, dy = drift(t, 1, 8) * 4;
  const layer = (par, fn) => { ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2 + dx * par, -H / 2 + dy * par); fn(); ctx.restore(); };
  const k = 0.92 + 0.08 * Math.sin(t * 1.5);
  const timed = ramp(t, T_TIMED - 0.1, T_TIMED + 0.45), slow = ramp(t, T_SLOW - 0.1, T_SLOW + 0.4);

  layer(0.3, () => {
    grainFill(ctx, c => c.rect(-200, -200, W + 400, H + 400), lin(ctx, 0, 0, 0, H, [[0, '#090b24'], [0.65, '#16163e'], [1, '#0b0a1e']]), 0.55);
    light(ctx, D.x, D.y, 700, lerp(0, 1, slow) > 0.5 ? C.dusk : C.amberD, 0.18);
  });
  // desk
  layer(0.6, () => {
    grainFill(ctx, c => c.rect(-200, 700, 1250, 600), lin(ctx, 0, 700, 0, H, [[0, '#262052'], [1, '#0c0a1e']]), 0.55);
    cone(ctx, 490, 650, 600, 1100, 400, C.cyan, 0.09 * k);
    monitor(ctx, t, k);
    // keyboard
    ctx.save(); ctx.translate(360, 815); ctx.transform(1, 0, -0.2, 1, 0, 0);
    grainFill(ctx, c => roundRect(c, 0, 0, 360, 70, 8), '#11122c', 0.4);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 12; j++) { const hit = hash(i, j, Math.floor(t * 9)) > 0.86; ctx.fillStyle = rgba(hit ? C.cyanW : C.cyan, hit ? 0.5 : 0.12); ctx.beginPath(); roundRect(ctx, 12 + j * 28.5, 10 + i * 19, 22, 13, 3); ctx.fill(); }
    ctx.restore();
  });
  // the developer, from behind, typing; on "slower" his shoulders drop a little
  layer(1.2, () => {
    const b = Math.sin(t * 1.7), typ = 1 - 0.8 * timed;
    const tap = j => Math.sin(t * 13 + j) * 0.05 * typ;
    figure(ctx, { x: 520, y: 1150 + b * 2 + 10 * slow, s: 2.2, hair0: '#3a1a0c', pal: ['#e8964e', '#a85424', '#401a0a'], len: 0.9, facing: 'back', br: b,
      lean: 0.06 - 0.05 * timed, turn: lerp(0.1 * Math.sin(t * 0.5), 0.75, timed), tilt: lerp(0.15, -0.05, timed) + 0.08 * slow, lx: 1,
      rim: C.cyan, rimA: 0.55, rimDx: -3, rimDy: -3,
      arms: [{ a1: 2.3, a2: -0.55 + tap(0) - 0.25 * timed, behind: true }, { a1: 0.84, a2: -2.6 + tap(2) + 0.25 * timed, behind: true }] });
  });
  // the dial / stopwatch
  layer(0.8, () => {
    const pop = out(ramp(t, T0 + 0.1, T0 + 0.9));
    ctx.save(); ctx.translate(D.x, D.y); ctx.scale(lerp(0.9, 1, pop), lerp(0.9, 1, pop)); ctx.translate(-D.x, -D.y); ctx.globalAlpha = pop;
    // stopwatch crown and side button grow on "Timed", the crown clicks down
    const press = Math.sin(clamp((t - T_TIMED) / 0.25) * Math.PI) * 8;
    if (timed > 0) {
      ctx.save(); ctx.translate(D.x, D.y - D.r - 26 - 40 * timed + press);
      grainFill(ctx, c => roundRect(c, -22, -10, 44, 44 * timed + 10, 6), lin(ctx, -22, 0, 22, 0, [[0, '#4a4380'], [1, '#1a1640']]), 0.4);
      grainFill(ctx, c => roundRect(c, -40, -34, 80, 26, 8), lin(ctx, 0, -34, 0, -8, [[0, '#5a5290'], [1, '#221c4c']]), 0.4);
      ctx.restore();
      ctx.save(); ctx.translate(D.x, D.y); ctx.rotate(0.75);
      grainFill(ctx, c => roundRect(c, -16, -D.r - 26 - 30 * timed, 32, 30 * timed + 6, 5), '#2a2458', 0.4);
      ctx.restore();
    }
    cached(ctx, 'k2dial', D.x - D.r - 30, D.y - D.r - 30, D.x + D.r + 30, D.y + D.r + 30, dialArt);
    // seconds ring appears with the stopwatch: fine ticks round the whole face
    if (timed > 0) {
      ctx.strokeStyle = rgba('#2a2240', 0.35 * timed); ctx.lineWidth = 1.5;
      for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2; if (Math.abs(((a + Math.PI) % (Math.PI * 2)) - Math.PI) < SWEEP) continue;
        ctx.beginPath(); ctx.moveTo(D.x + Math.sin(a) * (D.r - 14), D.y - Math.cos(a) * (D.r - 14)); ctx.lineTo(D.x + Math.sin(a) * (D.r - 30), D.y - Math.cos(a) * (D.r - 30)); ctx.stroke(); }
    }
    // the felt needle: swings up to +20 % on "felt faster", overshoots and settles
    const sw = ramp(t, T_FELT - 0.35, T_FELT + 0.35), settle = Math.exp(-Math.max(0, t - T_FELT - 0.2) * 3) * Math.sin(Math.max(0, t - T_FELT - 0.2) * 12) * 0.12;
    const feltA = lerp(-0.05, angOf(20), out(sw)) + settle * sw + 0.015 * Math.sin(t * 2.3);
    needle(ctx, feltA, D.r - 50, 11, rgba('#d27a34', lerp(1, 0.4, timed)), 0.35 * sw * (1 - 0.6 * timed));
    // the timed hand: on "Timed" it spins (two fast turns), slows, and lands on -19 %
    if (timed > 0) {
      const u = clamp((t - T_TIMED) / (T_SLOW - T_TIMED)), target = angOf(-19) + Math.PI * 2 * 2;
      const a = target * (1 - Math.pow(1 - u, 3)) + (u >= 1 ? Math.exp(-(t - T_SLOW) * 4) * Math.sin((t - T_SLOW) * 14) * 0.05 : 0);
      needle(ctx, a, D.r - 30, 7, '#0a6f8c', 0.25 + 0.5 * slow);
      light(ctx, D.x + Math.sin(a) * (D.r - 40), D.y - Math.cos(a) * (D.r - 40), 90, C.cyan, 0.3 * slow);
    }
    grainFill(ctx, c => c.arc(D.x, D.y, 20, 0, Math.PI * 2), '#1a1640', 0.3);
    // tags: "felt" by the amber needle, "timed" by the cyan hand
    ctx.font = '24px "Inter SemiBold"'; ctx.letterSpacing = '4px'; ctx.textAlign = 'center';
    const tag = (txt, p, col, a) => { const an = angOf(p); ctx.fillStyle = rgba(col, a); ctx.textAlign = p > 0 ? 'left' : 'right'; ctx.fillText(txt, D.x + Math.sin(an) * (D.r + 50), D.y - Math.cos(an) * (D.r + 50) + 8); };
    tag('FELT +20%', 20, C.amber, sw * (1 - 0.4 * timed)); tag('TIMED −19%', -19, C.cyan, slow);
    ctx.restore();
  });
  layer(0.5, () => motes(ctx, t, MOTES, 0, 0, W, 900, C.cream, 0.2));
  label(ctx, t, 120.24, T_TIMED + 0.2, 'METR study, 2025', '16 experienced developers', 96, 96);
  stamp(ctx, t, T_SLOW + 0.05, T1 + 0.3, '19% slower', 'measured with a stopwatch', { size: 120, x: 1130, y: 720, color: C.cyanW });
}
const MOTES = (() => { const r = rng(919); return Array.from({ length: 30 }, () => [r(), r(), r()]); })();

module.exports = { T0, T1, draw };
