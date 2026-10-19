// s05_w1 · chapter 05, window 1 (shots 5.01–5.04): the long table from above → the toast → the name tag → the canvas.
import { W, H, C, rgba, clamp, mix, prng, mixHex, shade, layer, put, stipple, maskLinear, maskRadial, roughPath, roughPoly, roughRect, roughLine, sagLine, hatch, fog, cone, person, castShadow, printFinish, vnoise, fbm, soften, quadMap, limb } from './art.mjs';
import { lin, sm, eio, eout, ein, sine, drift, text } from '../engine.mjs';
import { memo, view, toScreen, plate, camAt, glowSprite, spr, bokehSprite, topPerson, wineGlass, smear, bloom, pool, WARM, HOT, CREAM, WHITE } from './s05_kit.mjs';

const YOU = { coat: '#e59a3a', coatDark: '#b06a22', pants: '#1a1830', shoes: '#0d0c1c', skin: '#e9c3a0', hair: '#2a1a14' };
const COATS = ['#7a2f3a', '#2f4a5a', '#5a4a7a', '#8a5a2a', '#3a5a4a', '#6a3050', '#2a3a6a', '#a0603a', '#4a3a5a', '#7a6a3a'];
const HAIRS = ['#1a1010', '#3a2214', '#6a4a2a', '#c9c2b6', '#2a1a14', '#0e0a08', '#8a6a4a'];
const SKINS = ['#e9c3a0', '#c98e6a', '#8a5a3a', '#5a3424', '#f0cfae', '#b07a52'];

// =====================================================================================================
// 5.01 · "But people aren't enough." — the long table from above, one person drifts to the quay edge.
// =====================================================================================================
const TB = { cx: 930, cy: 420, a: -.07 };
const P01 = (u, v) => [TB.cx + u * Math.cos(TB.a) - v * Math.sin(TB.a), TB.cy + u * Math.sin(TB.a) + v * Math.cos(TB.a)];
const QUAY = 800;
const SEATS = (() => { const r = prng(21), out = []; for (let k = 0; k < 30; k++) { const u = -1380 + k * 96; for (const side of [-1, 1]) { if (r() < .1) continue; out.push({ u: u + (r() - .5) * 14, v: side * (96 + (r() - .5) * 8), side, coat: COATS[Math.floor(r() * COATS.length)], hair: HAIRS[Math.floor(r() * HAIRS.length)], skin: SKINS[Math.floor(r() * SKINS.length)], ph: r() * 7, bun: r() < .3, reach: 20 + r() * 14 }); } } return out; })();
const WALK_U = 420, NEIGH_U = 324;
const walkerSeat = { u: WALK_U, v: 96 };
const neighbour = SEATS.find((s) => s.side > 0 && Math.abs(s.u - NEIGH_U) < 30) || SEATS[0];
for (let i = SEATS.length - 1; i >= 0; i--) if (SEATS[i].side > 0 && Math.abs(SEATS[i].u - WALK_U) < 40) SEATS.splice(i, 1);

export function ground01() {
  return memo('g01', () => {
    const [c, g] = layer(), r = prng(3), n = vnoise(4);
    g.fillStyle = '#121729'; g.fillRect(0, 0, W, H);
    // cobbles: irregular rounded stones in rows that follow the street, darker joints
    for (let y = 150; y < QUAY + 4; y += 15) {
      let x = -20 + (y % 30 ? 9 : 0);
      while (x < W + 20) { const w = 14 + r() * 12, h = 10 + r() * 4, v = n(x * .01, y * .01);
        g.fillStyle = mixHex('#1a2036', '#2a2f48', clamp(v * .8 + r() * .35)); g.beginPath(); g.roundRect(x, y + (r() - .5) * 2, w, h, 4); g.fill(); x += w + 2.5; }
    }
    // the light pool of the table: warm, wide, stippled at the falloff
    const [pc, px] = layer(); px.translate(TB.cx + 200, TB.cy + 30); px.rotate(TB.a); px.scale(1, .42);
    const rg = px.createRadialGradient(0, 0, 0, 0, 0, 1250); rg.addColorStop(0, rgba(WARM, .55)); rg.addColorStop(.35, rgba(WARM, .32)); rg.addColorStop(.7, rgba('#e07a3a', .08)); rg.addColorStop(1, rgba('#e07a3a', 0));
    px.fillStyle = rg; px.beginPath(); px.arc(0, 0, 1250, 0, 7); px.fill(); px.setTransform(1, 0, 0, 1, 0, 0); stipple(pc, { k: .7, g: 1.15, seed: 5 }); put(g, pc, { op: 'lighter', a: .55 });
    { const dk = g.createLinearGradient(0, 520, 0, QUAY); dk.addColorStop(0, 'rgba(4,5,16,0)'); dk.addColorStop(1, 'rgba(4,5,16,.55)'); g.fillStyle = dk; g.fillRect(0, 520, W, QUAY - 520 + 40); }
    // houses along the top (roofs from above): tiles hatched, ridge, chimneys, a lit skylight; door light spilling down
    let x = -30; const rr = prng(8);
    while (x < W + 30) {
      const w = 130 + rr() * 150, d = 110 + rr() * 50, col = mixHex('#2a1e2e', '#3a2a30', rr());
      roughRect(g, x, -10, w, d + 10 + 10, col, { amp: 1.2, seed: Math.round(x) });
      g.save(); g.beginPath(); g.rect(x, -10, w, d + 20); g.clip();
      hatch(g, [x, -10, w, d + 20], { angle: Math.PI / 2, gap: 6, w: 1, col: '#0c0a14', a: .45, seed: Math.round(x) + 1, broken: .2 });
      const gr = g.createLinearGradient(0, 0, 0, d + 10); gr.addColorStop(0, 'rgba(0,0,0,.4)'); gr.addColorStop(1, rgba(WARM, .12)); g.fillStyle = gr; g.fillRect(x, 0, w, d + 10);
      g.restore();
      g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(x, (d + 10) * .45, w, 2.5);
      if (rr() < .6) { const cx = x + 20 + rr() * (w - 50); roughRect(g, cx, 18 + rr() * 30, 16, 16, '#1a1218', { amp: .6, seed: Math.round(cx) }); g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(cx + 16, 22, 10, 16); }
      if (rr() < .35) { const sx = x + 20 + rr() * (w - 60); roughRect(g, sx, 40 + rr() * 30, 30, 20, '#ffcf8a', { amp: .5, seed: Math.round(sx) }); }
      g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x, d + 8, w, 5);   // eave shadow
      if (rr() < .55) { const dx = x + w * (.3 + rr() * .4), [lc, lx] = layer(); lx.fillStyle = rgba('#ffc98a', .5); lx.beginPath(); lx.moveTo(dx - 16, d + 12); lx.lineTo(dx + 16, d + 12); lx.lineTo(dx + 40, d + 120); lx.lineTo(dx - 40, d + 120); lx.closePath(); lx.fill(); maskLinear(lc, 0, d + 12, 0, d + 130, [[0, 1], [1, 0]]); stipple(lc, { k: .6, seed: Math.round(dx) }); put(g, lc, { op: 'lighter' }); }
      x += w + 2;
    }
    // the quay: granite edge, bollards, then dark water with the lights' reflections
    roughPoly(g, [[-20, QUAY], [W + 20, QUAY - 12], [W + 20, QUAY + 26], [-20, QUAY + 38]], '#3a3a52', { amp: 1.5, seed: 9 });
    for (let xx = 0; xx < W; xx += 70 + r() * 30) { g.fillStyle = 'rgba(0,0,0,.4)'; g.fillRect(xx, QUAY - 12 + xx * -.006, 2, 40); }
    g.fillStyle = 'rgba(255,220,170,.18)'; g.beginPath(); g.moveTo(-20, QUAY); g.lineTo(W + 20, QUAY - 12); g.lineTo(W + 20, QUAY - 9); g.lineTo(-20, QUAY + 3); g.fill();
    const wg = g.createLinearGradient(0, QUAY + 30, 0, H); wg.addColorStop(0, '#0d1230'); wg.addColorStop(1, '#070a1c'); g.fillStyle = wg; g.beginPath(); g.moveTo(-20, QUAY + 38); g.lineTo(W + 20, QUAY + 26); g.lineTo(W + 20, H + 20); g.lineTo(-20, H + 20); g.fill();
    for (let i = 0; i < 260; i++) { const xx = r() * W, yy = QUAY + 40 + Math.pow(r(), 1.3) * 260; g.fillStyle = rgba(r() < .4 ? '#ffb35c' : '#6f7fb8', .08 + .18 * r()); g.fillRect(xx, yy, 12 + r() * 50, 1.3); }
    for (const bx of [260, 700, 1180, 1660]) { g.fillStyle = '#0c0d18'; g.beginPath(); g.arc(bx, QUAY + 10 - bx * .006, 13, 0, 7); g.fill(); g.strokeStyle = rgba(HOT, .4); g.lineWidth = 2; g.beginPath(); g.arc(bx, QUAY + 10 - bx * .006, 12, -2.6, -1.2); g.stroke(); }
    return c;
  });
}
function table01() {
  return memo('t01', () => {
    const [c, g] = layer(), r = prng(12);
    g.save(); g.translate(TB.cx, TB.cy); g.rotate(TB.a);
    // chairs under everybody (static)
    for (const s of SEATS) { g.fillStyle = '#1d1520'; g.beginPath(); g.roundRect(s.u - 17, s.side * (96 + 12) - (s.side > 0 ? 0 : 14), 34, 14, 4); g.fill(); }
    g.fillStyle = '#1d1520'; g.beginPath(); g.roundRect(WALK_U - 17, 120, 34, 14, 4); g.fill();
    // joined tables: different lengths, cloths, tiny misalignments
    const cloths = ['#cdb38c', '#c49e74', '#d4bf9a', '#b8865a', '#c9a08c', '#c7ae88'];
    let u = -1560; let k = 0;
    while (u < 1560) { const L = 260 + r() * 140, dv = (r() - .5) * 6, col = cloths[k++ % cloths.length];
      g.fillStyle = 'rgba(0,0,0,.45)'; g.fillRect(u + 6, -60 + dv + 8, L, 124);
      roughRect(g, u, -60 + dv, L - 3, 120, col, { amp: 1, seed: k });
      g.save(); g.beginPath(); g.rect(u, -60 + dv, L - 3, 120); g.clip();
      if (k % 3 === 1) { hatch(g, [u, -60, L, 120], { angle: 0, gap: 12, w: 4, col: '#b84a3a', a: .18, seed: k, broken: 0, wobble: .3 }); hatch(g, [u, -60, L, 120], { angle: Math.PI / 2, gap: 12, w: 4, col: '#b84a3a', a: .18, seed: k + 1, broken: 0, wobble: .3 }); }
      const sh = g.createLinearGradient(0, -60, 0, 60); sh.addColorStop(0, 'rgba(40,20,14,.5)'); sh.addColorStop(.5, 'rgba(255,240,210,.0)'); sh.addColorStop(1, 'rgba(40,20,14,.55)'); g.fillStyle = sh; g.fillRect(u, -60, L, 120);
      g.restore(); u += L;
    }
    // things on the table: plates at every seat, glasses, bottles, bowls, bread, candles in jars
    for (const s of [...SEATS, { u: WALK_U, side: 1 }]) {
      const pv = s.side * 36; g.fillStyle = 'rgba(40,20,10,.25)'; g.beginPath(); g.arc(s.u + 2, pv + 3, 17, 0, 7); g.fill();
      g.fillStyle = '#fbf3e4'; g.beginPath(); g.arc(s.u, pv, 17, 0, 7); g.fill(); g.strokeStyle = 'rgba(120,80,50,.35)'; g.lineWidth = 1.2; g.beginPath(); g.arc(s.u, pv, 12, 0, 7); g.stroke();
      if (r() < .8) { g.fillStyle = mixHex('#7a3a22', '#c8762a', r()); g.beginPath(); g.ellipse(s.u + (r() - .5) * 6, pv + (r() - .5) * 4, 7, 5, r() * 3, 0, 7); g.fill(); }
      const gx = s.u + 20, gy = s.side * 18; g.fillStyle = 'rgba(255,240,215,.25)'; g.beginPath(); g.arc(gx, gy, 6, 0, 7); g.fill(); g.fillStyle = r() < .6 ? '#c8763a' : '#7a1a2a'; g.beginPath(); g.arc(gx, gy, 4, 0, 7); g.fill(); g.fillStyle = 'rgba(255,250,235,.8)'; g.fillRect(gx - 3, gy - 4, 2, 2);
    }
    for (let uu = -1500; uu < 1500; uu += 110 + r() * 80) {
      const kind = r();
      if (kind < .35) { g.fillStyle = '#1f3a2a'; g.beginPath(); g.arc(uu, (r() - .5) * 20, 7, 0, 7); g.fill(); g.strokeStyle = 'rgba(200,255,220,.4)'; g.lineWidth = 1.5; g.beginPath(); g.arc(uu, 0, 4, -2.5, -1); g.stroke(); }
      else if (kind < .6) { g.fillStyle = '#d98a4a'; g.beginPath(); g.ellipse(uu, (r() - .5) * 16, 22, 11, r(), 0, 7); g.fill(); g.strokeStyle = 'rgba(90,40,20,.6)'; g.lineWidth = 1; for (let q = -2; q <= 2; q++) { g.beginPath(); g.moveTo(uu + q * 7 - 3, -8); g.lineTo(uu + q * 7 + 3, 8); g.stroke(); } }
      else { g.fillStyle = mixHex('#a03a2a', '#6a8a3a', r()); g.beginPath(); g.arc(uu, (r() - .5) * 14, 14, 0, 7); g.fill(); g.fillStyle = 'rgba(255,240,210,.25)'; g.beginPath(); g.arc(uu - 4, -4, 5, 0, 7); g.fill(); }
    }
    g.restore();
    return c;
  });
}
const CANDLES = (() => { const r = prng(33), o = []; for (let u = -1450; u < 1500; u += 170 + r() * 60) o.push({ u, v: (r() - .5) * 18, ph: r() * 9 }); return o; })();
// string lights: festoons from the eaves (top) down to posts on the quay, crossing the table diagonally
const WIRES = (() => { const r = prng(41), o = []; for (let i = 0; i < 7; i++) { const x0 = -120 + i * 330 + r() * 60; o.push({ a: [x0, 120], b: [x0 + 300 + r() * 80, QUAY - 20], sag: 30 + r() * 30 }); } return o; })();
function lights01(ctx, t) {
  const bulb = glowSprite(26, WARM, WHITE, .95, .4, 3);
  for (const [i, w] of WIRES.entries()) {
    const pts = sagLine(w.a, w.b, w.sag + Math.sin(t * .8 + i) * 2, 24);
    ctx.strokeStyle = 'rgba(10,8,16,.85)'; ctx.lineWidth = 1.6; ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke();
    for (let k = 1; k < pts.length - 1; k += 2) { const [x, y] = pts[k], f = .82 + .18 * Math.sin(t * 2.3 + k * 1.7 + i); ctx.fillStyle = '#fff1d0'; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 7); ctx.fill(); spr(ctx, bulb, x, y, 1, f); }
  }
}
// timings shared by draw + the zoom point of the next shot
function walker01(t, T0) {
  const st = T0 + .45, w0 = st + .5, w1 = T0 + 2.35;                    // stands, walks, arrives just after "enough"
  const p0 = P01(walkerSeat.u, walkerSeat.v), p1 = [1560, QUAY - 34];
  const u = eout(lin(w0, w1, t)) * .15 + sine(lin(w0, w1, t)) * .85, x = mix(p0[0], p1[0], u), y = mix(p0[1], p1[1], u);
  const ang = mix(TB.a + Math.PI / 2, Math.PI / 2 + .12, sm(lin(w0, w0 + .7, t)));
  return { x, y, ang, stand: sm(lin(st, st + .4, t)), walk: lin(w0, w1, t), moving: t > w0 && t < w1 };
}
function cam01(t, T0) {
  return camAt(t, [{ t: T0 - 1.2, x: 60, y: 40, z: 1.5, r: .08, f: [1300, 560] }, { t: T0 + 3.0, x: 40, y: 30, z: 1.1, r: .0, ease: sine }, { t: T0 + 4, x: 44, y: 34, z: 1.08, r: 0 }], { dx: 5, dy: 4 });
}
export function shot01(T) {
  const T0 = T.seg('05a').start - 1.0, tEnough = T.S('05a', 'enough');
  return {
    t: T0, tr: 'up', d: .9,
    draw(ctx, t) {
      const c = cam01(t, T0);
      plate(ctx, ground01(), c, .92);
      // water shimmer (alive)
      ctx.save(); view(ctx, c, .92); const r = prng(7);
      for (let i = 0; i < 40; i++) { const x = r() * W, y = QUAY + 50 + r() * 240, ph = r() * 7; ctx.fillStyle = rgba(WARM, .1 + .1 * Math.sin(t * 1.7 + ph)); ctx.fillRect(x + Math.sin(t * .6 + ph) * 14, y, 20 + r() * 40, 1.4); }
      ctx.restore();
      plate(ctx, table01(), c, 1);
      ctx.save(); view(ctx, c, 1);
      // candles in jars (flicker)
      const cs = glowSprite(70, WARM, WHITE, .8, .45, 9);
      for (const k of CANDLES) { const [x, y] = P01(k.u, k.v), f = .75 + .15 * Math.sin(t * 7 + k.ph) + .1 * Math.sin(t * 13.3 + k.ph * 2); ctx.fillStyle = 'rgba(255,240,210,.35)'; ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); spr(ctx, cs, x, y, .9, f); }
      // the people at the table: breathing, leaning, heads turning in conversation
      const wk = walker01(t, T0);
      for (const s of SEATS) {
        const [x, y] = P01(s.u, s.v + s.side * Math.sin(t * 1.1 + s.ph) * 1.2), face = TB.a + (s.side > 0 ? -Math.PI / 2 : Math.PI / 2);
        let head = .35 * Math.sin(t * .5 + s.ph) * Math.sin(t * .23 + s.ph * 2);
        if (s === neighbour) head = mix(head, -1.1, sm(lin(T0 + 1.2, T0 + 2.2, t)));
        topPerson(ctx, x, y, face, 1.12, { coat: s.coat, hair: s.hair, skin: s.skin }, { head, reach: s.reach + Math.sin(t * .9 + s.ph) * 3, light: Math.atan2(TB.cy - y, TB.cx + (s.u - 0) * .2 - x), bun: s.bun, armL: Math.sin(t * .7 + s.ph) * 2 });
      }
      // you: stand up, drift away from the light to the dark edge, look out
      {
        const sw = wk.moving ? Math.sin(wk.walk * Math.PI * 7) : 0;
        const head = wk.walk >= 1 ? -.35 * sm(lin(tEnough, tEnough + .8, t)) + .08 * Math.sin(t * .6) : 0;
        ctx.save(); ctx.translate(wk.x, wk.y); ctx.rotate(Math.PI / 2 + .1); const sg = ctx.createLinearGradient(0, 0, 150, 0); sg.addColorStop(0, 'rgba(3,3,10,.6)'); sg.addColorStop(1, 'rgba(3,3,10,0)'); ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(70, 0, 80, 16, 0, 0, 7); ctx.fill(); ctx.restore();
        if (wk.stand < 1 && !wk.moving) topPerson(ctx, wk.x, wk.y, wk.ang, 1.12 + .3 * wk.stand, YOU, { reach: 26 * (1 - wk.stand), light: -Math.PI / 2, rimA: .7 });
        else topPerson(ctx, wk.x, wk.y, wk.ang, 1.42, YOU, { walk: sw, swing: sw, head, light: -Math.PI / 2, rimA: .55 + .2 * (1 - wk.walk) });
      }
      ctx.restore();
      // haze above the table, then the string lights (nearest layer, strongest parallax)
      plate(ctx, haze01(), c, 1.18, .9, 'screen');
      ctx.save(); view(ctx, c, 1.38); lights01(ctx, t); ctx.restore();
      printFinish(ctx, { grain: .07, vig: .5, vigCol: '#05060f' });
    },
  };
}
export function haze01() {
  return memo('h01', () => { const [c, g] = layer(); fog(g, { y0: 230, y1: 640, col: '#c98a5a', a: .22, seed: 14, cover: .55, soft: .5, k: .35, sx: .004, sy: .02 }); return c; });
}
export const zoom01to02 = (T) => { const T0 = T.seg('05a').start - 1.0, t = T.S('05a', 'Sooner') - .2, c = cam01(t, T0), [x, y] = P01(neighbour.u, neighbour.v); return toScreen(c, 1, x, y); };

// =====================================================================================================
// 5.02 · "Sooner or later, someone at the table asks you what you do." — a neighbour turns, glass raised.
// =====================================================================================================
const NB = { x: 1250, y: 820, s: 3.3 };
function bg02() {
  return memo('b02', () => {
    const [c, g] = layer();
    { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0c0c24'); gr.addColorStop(.55, '#24183a'); gr.addColorStop(1, '#3a2030'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    // facades across the street, warm windows
    const r = prng(5);
    let x = -40; while (x < W + 40) { const w = 160 + r() * 140, h = 420 + r() * 260; roughRect(g, x, 640 - h, w, h + 500, mixHex('#1a1428', '#241a30', r()), { amp: 1.5, seed: Math.round(x) });
      for (let fy = 640 - h + 50; fy < 600; fy += 90) for (let fx = x + 22; fx < x + w - 40; fx += 60) { if (r() < .5) { roughRect(g, fx, fy, 26, 44, mixHex('#e8954a', '#ffd59a', r()), { amp: .6, seed: fx + fy }); } else roughRect(g, fx, fy, 26, 44, '#120e1c', { amp: .6, seed: fx + fy }); }
      x += w + 6; }
    // the table receding to the left, diners along it (to be blurred: depth of field)
    const VP = [360, 560];
    roughPoly(g, [[VP[0], VP[1]], [VP[0] + 30, VP[1]], [1500, 900], [700, 980]], '#a88864', { amp: 1, seed: 3 });
    const tm = (q, s) => [mix(mix(700, 1500, s), VP[0] + 15, q), mix(mix(980, 900, s), VP[1], q)];
    for (let i = 0; i < 9; i++) { const q = Math.pow(i / 9, .8), sc = mix(1.5, .25, q);
      for (const side of [0, 1]) { const [px, py] = tm(q, side); if (side === 1 && i < 1) continue;
        person(g, px + (side ? 40 : -40) * sc, py - 30 * sc, sc, { lean: (r() - .5) * .3, head: (r() - .5) * .5, sh: [.9 + r() * .4, .6], el: [.8, .5], hip: [1.5, 1.45], kn: [1.5, 1.4], hair: ['short', 'long', 'bun', 'curly', 'grey'][Math.floor(r() * 5)] }, { flip: side === 0, dress: { coat: COATS[Math.floor(r() * COATS.length)], skin: SKINS[Math.floor(r() * SKINS.length)], hair: HAIRS[Math.floor(r() * HAIRS.length)] }, rim: HOT, rimSide: 1, shadeA: .25 }); } }
    for (let i = 0; i < 12; i++) { const [px, py] = tm(Math.pow(i / 12, .8), .5); bloom(g, px, py - 10, mix(60, 14, i / 12), { a: .35, k: .2, seed: i }); }
    const out = soften(c, 7);
    // bokeh: the string lights out of focus
    const og = out.getContext('2d');
    for (let i = 0; i < 26; i++) { const q = i / 25, x = mix(-60, 1980, q), y = 150 + Math.sin(q * Math.PI * 2.2) * 70 + q * 60, rr = 26 + r() * 30; og.globalCompositeOperation = 'lighter'; og.drawImage(bokehSprite(Math.round(rr)), x - rr, y - rr); }
    og.globalCompositeOperation = 'source-over';
    return out;
  });
}
function fg02() {
  return memo('f02', () => {
    const [c, g] = layer();
    // the near table in focus: cloth top from the neighbour's waist down, lit from the candle on the left
    roughPoly(g, [[-20, 846], [W + 20, 826], [W + 20, H + 20], [-20, H + 20]], '#cdb08a', { amp: 1.2, seed: 4 });
    const gr = g.createRadialGradient(640, 840, 0, 640, 840, 1500); gr.addColorStop(0, 'rgba(255,214,150,.45)'); gr.addColorStop(.35, 'rgba(200,120,60,.1)'); gr.addColorStop(1, 'rgba(30,12,16,.75)'); g.fillStyle = gr; g.fillRect(0, 820, W, 280);
    g.save(); g.beginPath(); g.rect(0, 830, W, 260); g.clip(); hatch(g, [0, 830, W, 260], { angle: -.08, gap: 5, w: 1, col: '#5a3020', a: .18, seed: 6, broken: .4 }); g.restore();
    g.fillStyle = 'rgba(255,236,200,.35)'; g.fillRect(0, 838, W, 3);
    g.fillStyle = 'rgba(60,30,16,.3)'; g.beginPath(); g.ellipse(880, 958, 190, 34, 0, 0, 7); g.fill();
    g.fillStyle = '#f6ecd8'; g.beginPath(); g.ellipse(870, 950, 180, 30, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(120,80,50,.4)'; g.lineWidth = 2; g.beginPath(); g.ellipse(870, 950, 128, 20, 0, 0, 7); g.stroke();
    g.fillStyle = '#9a4a24'; g.beginPath(); g.ellipse(850, 944, 60, 10, .1, 0, 7); g.fill();
    roughRect(g, 600, 760, 56, 96, 'rgba(255,240,210,.2)', { amp: .6, seed: 5 }); g.fillStyle = '#f3e6c8'; g.fillRect(612, 818, 32, 36);
    return c;
  });
}
function cam02(t, T0, tDo) { return camAt(t, [{ t: T0 - .5, x: -30, y: 10, z: 1.0, f: [1100, 600] }, { t: tDo + .6, x: 20, y: -6, z: 1.08, ease: sine }], { dx: 4, dy: 3 }); }
function pose02(t, T0, tAsk) {
  const turn = sm(lin(T0 + .9, T0 + 1.9, t)), raise = eio(lin(tAsk - .5, tAsk + .5, t)), br = Math.sin(t * 1.9) * .015;
  return { raise, P: { lean: mix(.18, -.06, turn) + br, head: mix(.45, -.08, turn) + .04 * Math.sin(t * .9), sh: [mix(.35, 1.0, raise), .25], el: [mix(1.1, 1.75, raise), .9], hip: [1.5, 1.45], kn: [1.45, 1.4], hair: 'curly', bulk: 1.05 } };
}
const D02 = { coat: '#5a2a44', pants: '#1a1428', shoes: '#0d0a14', skin: '#b07a52', hair: '#1a1010' };
export function shot02(T) {
  const T0 = T.S('05a', 'Sooner') - .2, tAsk = T.S('05a', 'asks'), tDo = T.S('05a', 'do');
  return {
    t: T0, tr: 'zoom', d: .8, ...((p) => ({ x: p[0], y: p[1], depth: 5 }))(zoom01to02(T)),
    draw(ctx, t) {
      const c = cam02(t, T0, tDo);
      plate(ctx, bg02(), c, .45);
      ctx.save(); view(ctx, c, 1);
      const f = .8 + .2 * Math.sin(t * 8.3) * Math.sin(t * 5.1);
      // the neighbour: turns toward you, glass comes up on "asks", holds still on "do", a glint
      const { P, raise } = pose02(t, T0, tAsk);
      roughRect(ctx, NB.x - 6, NB.y - 150, 16, 240, '#1a1018', { amp: .8, seed: 2 });
      const fig = person(ctx, NB.x, NB.y, NB.s, P, { flip: true, dress: D02, light: { x: 620, y: 780, col: '#ffcf8a', a: .65 }, shadeA: .18, shadeCol: '#140a14', rim: HOT, rimSide: -1, rimW: 3 });
      const [hx, hy] = fig.hand(0);
      const gl = wineGlass(ctx, hx, hy + 6, 2.1, mix(.15, -.05, raise));
      const glint = Math.exp(-Math.pow((t - tDo - .1) / .25, 2));
      spr(ctx, glowSprite(60, WARM, WHITE, 1, .3, 11), gl[0] + 14, gl[1] - 22, .5 + glint * 1.2, .35 + glint);
      ctx.restore();
      plate(ctx, fg02(), c, 1);
      ctx.save(); view(ctx, c, 1); ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.ellipse(628, 810 + Math.sin(t * 9) * 1.5, 4, 10, Math.sin(t * 3) * .1, 0, 7); ctx.fill(); spr(ctx, glowSprite(120, WARM, WHITE, .75, .45, 6), 628, 812, 1, f); ctx.restore();
      // front bokeh (nearest layer)
      ctx.save(); view(ctx, c, 1.6); for (const [x, y, r] of [[200, 120, 70], [1700, 90, 90], [1820, 300, 50]]) { ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .7; ctx.drawImage(bokehSprite(r), x - r, y - r); } ctx.restore();
      printFinish(ctx, { grain: .07, vig: .5, vigCol: '#07040c' });
    },
  };
}
// where the glass bowl sits at the hand-off (computed once, off-screen)
export function zoom02to03(T) {
  return memo('z23', () => {
    const T0 = T.S('05a', 'Sooner') - .2, tAsk = T.S('05a', 'asks'), tDo = T.S('05a', 'do'), t = T.S('05a', 'And for once') - .2;
    const [, g] = layer(8, 8), { P, raise } = pose02(t, T0, tAsk), fig = person(g, NB.x, NB.y, NB.s, P, { flip: true, dress: D02 });
    const [hx, hy] = fig.hand(0), tilt = mix(.15, -.05, raise), bx = hx + Math.sin(tilt) * 40 * 2.1, by = hy + 6 - Math.cos(tilt) * 40 * 2.1;
    return toScreen(cam02(t, T0, tDo), 1, bx, by);
  });
}

// =====================================================================================================
// 5.03 · "And for once, the honest answer isn't a job title." — the name tag; the title dissolves.
// =====================================================================================================
const TAG = { x: 960, y: 520, w: 640, h: 380, rot: -.05 };
const TITLE = 'Senior Account Manager';
function lapel03() {
  return memo('l03', () => {
    const [c, g] = layer(), r = prng(5);
    // amber wool coat filling the frame, lapel fold diagonal, a seam, warm light from upper right
    g.fillStyle = '#b8701e'; g.fillRect(0, 0, W, H);
    const gr = g.createRadialGradient(1700, 0, 0, 1700, 0, 1900); gr.addColorStop(0, 'rgba(255,214,150,.55)'); gr.addColorStop(.5, 'rgba(229,154,58,.1)'); gr.addColorStop(1, 'rgba(40,14,6,.75)'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    hatch(g, [0, 0, W, H], { angle: .8, gap: 4, w: 1, col: '#5a2a0a', a: .22, seed: 3, broken: .35 });
    hatch(g, [0, 0, W, H], { angle: -.8, gap: 5, w: 1, col: '#ffd59a', a: .08, seed: 4, broken: .5 });
    // the lapel: a darker folded triangle on the left with a bright edge where it turns
    roughPoly(g, [[-20, -20], [520, -20], [300, 1100], [-20, 1100]], 'rgba(80,32,8,.55)', { amp: 3, seed: 7 });
    roughLine(g, [[520, -20], [300, 1100]], { w: 4, col: rgba('#ffd59a', .55), seed: 8 });
    // buttonhole + stitching
    roughRect(g, 360, 300, 60, 10, '#5a2a0a', { amp: .6, seed: 9 });
    g.setLineDash([8, 7]); g.strokeStyle = 'rgba(255,220,160,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(560, -20); g.lineTo(340, 1100); g.stroke(); g.setLineDash([]);
    // depth: the bokeh of the party behind, peeking over the shoulder (top right)
    for (let i = 0; i < 8; i++) { const x = 1300 + r() * 700, y = -40 + r() * 220, rr = 30 + r() * 40; g.globalCompositeOperation = 'lighter'; g.globalAlpha = .6; g.drawImage(bokehSprite(Math.round(rr)), x - rr, y - rr); }
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
    stipple(c, { k: .08, seed: 2, mid: false });
    return c;
  });
}
function tagTex() {
  return memo('tag', () => {
    const [c, g] = layer(TAG.w, TAG.h);
    g.fillStyle = '#f4ecdc'; g.beginPath(); g.roundRect(0, 0, TAG.w, TAG.h, 18); g.fill();
    g.save(); g.beginPath(); g.roundRect(0, 0, TAG.w, TAG.h, 18); g.clip();
    g.fillStyle = '#c4482a'; g.fillRect(0, 0, TAG.w, 104);
    const r = prng(4); for (let i = 0; i < 2600; i++) { g.fillStyle = r() < .5 ? 'rgba(120,90,60,.07)' : 'rgba(255,255,255,.1)'; g.fillRect(r() * TAG.w, r() * TAG.h, 1 + r() * 3, 1); }
    g.restore();
    text(g, 'HELLO, I’M', TAG.w / 2, 70, { size: 38, weight: 600, color: '#f4ecdc', align: 'center', spacing: 8 });
    g.strokeStyle = 'rgba(60,40,30,.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, 300); g.lineTo(TAG.w - 60, 300); g.stroke();
    return c;
  });
}
const GLYPHS = (() => { const r = prng(77), out = []; let x = 0; const [c, g] = layer(4, 4); g.font = '70px "Instrument Serif"';
  const total = g.measureText(TITLE).width;
  for (const ch of TITLE) { const w = g.measureText(ch).width; out.push({ ch, x: x - total / 2, w, parts: Array.from({ length: 14 }, () => [r() * w, -r() * 50, r(), r()]) }); x += w; } return out; })();
export function shot03(T, zoomFrom) {
  const T0 = T.S('05a', 'And for once') - .2, tTitle = T.S('05a', 'title'), T1 = T.S('05a', 'whatever') - .3;
  return {
    t: T0, tr: 'zoom', d: .7, x: zoomFrom[0], y: zoomFrom[1], depth: 5,
    draw(ctx, t) {
      const c = camAt(t, [{ t: T0 - .4, x: 20, y: 10, z: 1.0, r: .02 }, { t: tTitle - .2, x: -10, y: -4, z: 1.08, r: -.01, ease: sine }, { t: T1 + .4, x: 0, y: 0, z: 1.3, r: -.015, ease: ein }], { dx: 3, dy: 2.5 });
      plate(ctx, lapel03(), c, .8);
      ctx.save(); view(ctx, c, 1);
      ctx.translate(TAG.x, TAG.y); ctx.rotate(TAG.rot + Math.sin(t * .9) * .006);
      // tag shadow + clip
      ctx.fillStyle = 'rgba(40,12,0,.45)'; ctx.beginPath(); ctx.roundRect(-TAG.w / 2 + 14, -TAG.h / 2 + 22, TAG.w, TAG.h, 18); ctx.fill();
      ctx.drawImage(tagTex(), -TAG.w / 2, -TAG.h / 2);
      roughRect(ctx, -60, -TAG.h / 2 - 34, 120, 52, '#9aa0a8', { amp: .5, seed: 3 }); ctx.fillStyle = 'rgba(255,255,255,.45)'; ctx.fillRect(-56, -TAG.h / 2 - 30, 112, 6);
      // the job title, letter by letter lifting off as ink dust on "title"
      ctx.font = '70px "Instrument Serif"';
      for (const [i, gph] of GLYPHS.entries()) {
        const t0 = tTitle - .3 + i * .02, u = lin(t0, t0 + .5, t), a = 1 - sm(u);
        const gx = gph.x, gy = 60;
        if (a > 0) text(ctx, gph.ch, gx + u * 14, gy - u * 26, { size: 70, font: 'Instrument Serif', color: '#2a1a14', alpha: a });
        if (u > 0 && u < 1) for (const [px, py, s1, s2] of gph.parts) { const k = eout(u); ctx.fillStyle = rgba('#3a2214', (1 - u) * .7); ctx.fillRect(gx + px + k * (30 + s1 * 70), gy + py * .6 - 20 - k * (40 + s2 * 90), 2, 2); }
      }
      // after the title is gone the tag catches the light: an invitation, still blank
      const after = sm(lin(tTitle + .6, tTitle + 1.4, t));
      if (after > 0) { const g = ctx.createRadialGradient(0, 40, 0, 0, 40, 380); g.addColorStop(0, rgba('#fff6e2', .35 * after)); g.addColorStop(1, rgba('#fff6e2', 0)); ctx.fillStyle = g; ctx.fillRect(-TAG.w / 2, -TAG.h / 2 + 104, TAG.w, TAG.h - 104); }
      ctx.restore();
      printFinish(ctx, { grain: .07, vig: .5, vigCol: '#140600' });
    },
  };
}

// =====================================================================================================
// 5.04 · "It's whatever you'd do even if nobody paid you." — the blank tag pinned to a canvas, paint starts.
// =====================================================================================================
const CV = [[420, 150], [1400, 190], [1390, 860], [430, 900]];     // canvas quad (slightly turned)
const PIN = [1290, 250];
const LAMP = [240, 80];
const STROKE = (q) => { const a = [560, 700], b = [960, 560], e = [1330, 520]; return [(1 - q) ** 2 * a[0] + 2 * (1 - q) * q * b[0] + q * q * e[0], (1 - q) ** 2 * a[1] + 2 * (1 - q) * q * b[1] + q * q * e[1]]; };
function studio04() {
  return memo('s04', () => {
    const [c, g] = layer(), r = prng(6);
    // attic wall: umber, plaster hatch; a small night window top right; one lamp top left (hero light)
    g.fillStyle = '#2a1a16'; g.fillRect(0, 0, W, H);
    { const gr = g.createRadialGradient(240, 80, 0, 240, 80, 1700); gr.addColorStop(0, 'rgba(255,190,110,.55)'); gr.addColorStop(.35, 'rgba(160,80,40,.22)'); gr.addColorStop(1, 'rgba(8,4,10,.8)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    hatch(g, [0, 0, W, H], { angle: -.5, gap: 6, w: 1, col: '#0a0406', a: .25, seed: 3, broken: .4 });
    roughRect(g, 1560, 120, 260, 330, '#0b1030', { amp: 1.5, seed: 4 }); { const gr = g.createLinearGradient(0, 120, 0, 450); gr.addColorStop(0, '#0a0e2a'); gr.addColorStop(1, '#27305e'); g.fillStyle = gr; g.fillRect(1572, 132, 236, 306); }
    for (let i = 0; i < 40; i++) { g.fillStyle = rgba('#dfe8ff', .2 + .5 * r()); g.fillRect(1575 + r() * 230, 135 + r() * 200, 1.4, 1.4); }
    roughRect(g, 1686, 120, 8, 330, '#140a0a', { amp: .5, seed: 5 }); roughRect(g, 1560, 280, 260, 8, '#140a0a', { amp: .5, seed: 6 });
    // floor boards
    roughPoly(g, [[-20, 900], [W + 20, 880], [W + 20, H + 20], [-20, H + 20]], '#1e120e', { amp: 2, seed: 7 });
    for (let k = 0; k < 12; k++) { g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(k * 190 - 200, H); g.lineTo(k * 120 + 100, 890); g.stroke(); }
    // easel legs behind the canvas
    roughLine(g, [[900, 120], [700, 1080]], { w: 22, col: '#3a2414', seed: 8 }); roughLine(g, [[900, 120], [1180, 1080]], { w: 22, col: '#3a2414', seed: 9 }); roughLine(g, [[920, 140], [940, 1060]], { w: 18, col: '#2a180e', seed: 10 });
    // the canvas: stretched linen, slightly turned; faint charcoal sketch of a terraced hill town (the chapter's world)
    roughPoly(g, CV, '#efe4cf', { amp: 1.5, seed: 11 });
    g.save(); g.beginPath(); roughPath(g, CV, { amp: 1.5, seed: 11 }); g.clip();
    { const gr = g.createLinearGradient(400, 150, 1400, 900); gr.addColorStop(0, 'rgba(255,240,210,.4)'); gr.addColorStop(1, 'rgba(90,50,30,.45)'); g.fillStyle = gr; g.fillRect(400, 140, 1010, 780); }
    hatch(g, [420, 150, 980, 760], { angle: 0, gap: 3, w: .7, col: '#7a6450', a: .12, seed: 12, broken: .1, wobble: .3 });
    g.strokeStyle = 'rgba(40,30,30,.38)'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(470, 810); g.bezierCurveTo(640, 760, 780, 560, 860, 330); g.quadraticCurveTo(910, 300, 960, 330); g.bezierCurveTo(1040, 560, 1180, 760, 1360, 800); g.stroke();
    for (const [y, w] of [[690, 420], [600, 320], [500, 220], [410, 130]]) { g.beginPath(); g.moveTo(910 - w, y + 8); g.quadraticCurveTo(910, y - 14, 910 + w, y + 8); g.stroke(); }
    for (let i = 0; i < 26; i++) { const y = 420 + r() * 360, w = (y - 300) * .95, x = 910 + (r() - .5) * 2 * w * .8; g.strokeRect(x, y - 16, 16 + r() * 14, 16); }
    g.restore();
    // canvas edge (thickness) + shadow on the wall
    roughPoly(g, [CV[1], [CV[1][0] + 18, CV[1][1] + 10], [CV[2][0] + 18, CV[2][1] - 4], CV[2]], '#a08a6a', { amp: .8, seed: 13 });
    cone(g, LAMP[0], LAMP[1], { dir: -1.0, spread: .5, len: 1500, col: '#ffcf8a', a: .22, k: .6, seed: 15, op: 'screen' });
    { const sh = g.createLinearGradient(420, 0, 1420, 0); sh.addColorStop(0, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(40,16,8,.35)'); g.fillStyle = sh; g.beginPath(); roughPath(g, CV, { amp: 1.5, seed: 11 }); g.fill(); }
    // the easel ledge + paint tubes, a jar of brushes on a stool (foreground left)
    roughRect(g, 400, 892, 1020, 22, '#4a2e18', { amp: 1, seed: 14 });
    for (let i = 0; i < 5; i++) roughRect(g, 520 + i * 70, 872, 46, 18, ['#c4482a', '#e5a23a', '#2a5a7a', '#efe4cf', '#6a3a7a'][i], { amp: .6, seed: 20 + i });
    return c;
  });
}
function front04() {
  return memo('fr04', () => {
    const [c, g] = layer();
    // stool + brush jar, deep foreground (dark, rim-lit)
    roughRect(g, 40, 880, 300, 30, '#140a08', { amp: 1, seed: 1 }); roughLine(g, [[80, 900], [60, 1090]], { w: 18, col: '#0e0606', seed: 2 }); roughLine(g, [[300, 900], [320, 1090]], { w: 18, col: '#0e0606', seed: 3 });
    roughRect(g, 130, 760, 110, 130, 'rgba(255,230,190,.16)', { amp: .8, seed: 4 });
    for (let i = 0; i < 7; i++) roughLine(g, [[150 + i * 13, 870], [130 + i * 18, 640 - (i % 3) * 30]], { w: 6, col: ['#3a2010', '#5a3418', '#2a1408'][i % 3], seed: 5 + i });
    g.strokeStyle = rgba(HOT, .45); g.lineWidth = 2; g.beginPath(); g.moveTo(240, 760); g.lineTo(240, 890); g.stroke();
    return c;
  });
}
export function shot04(T, zoomFrom) {
  const T0 = T.S('05a', 'whatever') - .3, tNobody = T.S('05a', 'nobody'), tPaid = T.S('05a', 'paid'), tEnd = T.S('05a', 'Something made by human') - .5;
  const s0 = tNobody - .12, s1 = tPaid + .1;                                    // the stroke
  const wh0 = tEnd - .5, wh1 = tEnd + .25;                                      // the whip right
  return {
    t: T0, tr: 'zoom', d: .7, x: zoomFrom[0], y: zoomFrom[1], depth: 6,
    draw(ctx, t) {
      // camera: lands close on the pinned tag, pulls back to show the canvas, then leans toward the stroke
      const c = camAt(t, [{ t: T0 - .4, x: 330, y: -290, z: 2.5, f: [960, 540] }, { t: T0 + 1.6, x: 40, y: -20, z: 1.12, ease: eio }, { t: tPaid + .5, x: 60, y: -10, z: 1.16, ease: sine }, { t: wh1, x: 90, y: -10, z: 1.2 }], { dx: 4, dy: 3 });
      plate(ctx, studio04(), c, 1);
      ctx.save(); view(ctx, c, 1);
      // lamp: a bulb and its stippled cone on the canvas
      spr(ctx, glowSprite(160, WARM, WHITE, .9, .45, 4), LAMP[0], LAMP[1], 1, .85 + .05 * Math.sin(t * 3.1));
      // the blank tag pinned to the canvas's corner
      ctx.save(); ctx.translate(PIN[0], PIN[1]); ctx.rotate(.12 + Math.sin(t * 1.3) * .01); ctx.fillStyle = 'rgba(30,14,6,.4)'; ctx.fillRect(-70, -26, 150, 96); ctx.drawImage(tagTex(), -80, -38, 160, 95); ctx.restore();
      ctx.fillStyle = '#c4482a'; ctx.beginPath(); ctx.arc(PIN[0] - 2, PIN[1] - 30, 8, 0, 7); ctx.fill(); ctx.fillStyle = 'rgba(255,230,200,.7)'; ctx.beginPath(); ctx.arc(PIN[0] - 4, PIN[1] - 32, 2.5, 0, 7); ctx.fill();
      // the stroke: amber paint laid in bristle lines along the curve on "nobody"
      const q = eio(lin(s0, s1, t));
      if (q > 0) {
        const r = prng(9), n = 26;
        ctx.save(); ctx.beginPath(); roughPath(ctx, CV, { amp: 1.5, seed: 11 }); ctx.clip();
        for (let k = 0; k < n; k++) { const off = (k / (n - 1) - .5) * 46, cut = q * (.86 + .14 * r()), a = .55 + .45 * r();
          ctx.strokeStyle = rgba(k % 5 === 0 ? '#ffd59a' : k % 3 === 0 ? '#c8641e' : '#f0a040', a); ctx.lineWidth = 2 + r() * 2.5; ctx.beginPath();
          for (let s = 0; s <= 40; s++) { const u = s / 40 * cut, [x, y] = STROKE(u), ux = u + .002, [x2, y2] = STROKE(ux), L = Math.hypot(x2 - x, y2 - y) || 1, w = Math.sin(Math.PI * Math.min(1, u / (cut || 1) * 1.05)) ** .3; ctx[s ? 'lineTo' : 'moveTo'](x - (y2 - y) / L * off * w, y + (x2 - x) / L * off * w); }
          ctx.stroke(); }
        ctx.restore();
      }
      // the brush hand: forearm in an amber sleeve from the lower right, brush tip on the stroke head; then the whip
      const head = q > 0 ? STROKE(Math.max(.001, q)) : [520, 740];
      const wq = ein(lin(wh0, wh1, t)), tip = [mix(head[0], 2600, wq), mix(head[1], head[1] - 140, wq)];
      const pre = 1 - sm(lin(T0 + .6, s0, t)); tip[0] += pre * 220; tip[1] += pre * 260;
      const vx = (wq > 0 && wq < 1) ? 7000 : 0;
      const hand = (dx) => {
        const tx = tip[0] + dx, ty = tip[1], ang = .78 - .08 * Math.sin(t * 2) + wq * .25, ux = Math.cos(ang), uy = Math.sin(ang);
        const P = (d, o = 0) => [tx + ux * d - uy * o, ty + uy * d + ux * o];
        // brush: loaded bristles, ferrule, long handle
        ctx.fillStyle = '#e08a2a'; ctx.beginPath(); ctx.moveTo(...P(-6, 0)); ctx.quadraticCurveTo(...P(10, -11), ...P(34, -7)); ctx.lineTo(...P(34, 7)); ctx.quadraticCurveTo(...P(10, 11), ...P(-6, 0)); ctx.fill();
        roughLine(ctx, [P(34), P(62)], { w: 13, col: '#9aa0a8', seed: 2 }); roughLine(ctx, [P(36, -3), P(60, -3)], { w: 2, col: 'rgba(255,255,255,.6)', seed: 3 });
        roughLine(ctx, [P(62), P(250)], { w: 10, col: '#7a2a1a', seed: 4 }); roughLine(ctx, [P(64, -2), P(250, -2)], { w: 2, col: rgba(HOT, .5), seed: 5 });
        // forearm in the amber sleeve, coming from the lower right corner
        const g0 = P(150), elbow = [g0[0] + 520, g0[1] + 420], wrist = [g0[0] + 46, g0[1] + 34];
        limb(ctx, [wrist, [mix(wrist[0], elbow[0], .35), mix(wrist[1], elbow[1], .35) - 10], elbow], 74, 120, '#c87a22', 7);
        limb(ctx, [[wrist[0] + 4, wrist[1] - 8], [mix(wrist[0], elbow[0], .35) + 2, mix(wrist[1], elbow[1], .35) - 30], [elbow[0], elbow[1] - 44]], 10, 24, rgba(HOT, .55), 8);
        limb(ctx, [[wrist[0] + 30, wrist[1] + 30], [elbow[0] + 10, elbow[1] + 30]], 30, 70, 'rgba(60,20,4,.35)', 9);
        roughPoly(ctx, [[wrist[0] - 30, wrist[1] + 22], [wrist[0] + 22, wrist[1] - 34], [wrist[0] + 36, wrist[1] - 18], [wrist[0] - 14, wrist[1] + 38]], '#8a4a14', { amp: 1, seed: 10 });
        // the hand: fist round the handle, knuckles toward us, thumb along the brush
        ctx.fillStyle = '#d9a77e'; ctx.beginPath(); ctx.ellipse(g0[0] + 8, g0[1] + 2, 44, 34, ang - .2, 0, 7); ctx.fill();
        ctx.fillStyle = 'rgba(90,40,20,.25)'; ctx.beginPath(); ctx.ellipse(g0[0] + 18, g0[1] + 14, 34, 20, ang - .2, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(110,60,36,.55)'; ctx.lineWidth = 2; for (let k = 0; k < 3; k++) { const a0 = P(132 + k * 14, -24), a1 = P(132 + k * 14, -8); ctx.beginPath(); ctx.moveTo(...a0); ctx.lineTo(...a1); ctx.stroke(); }
        ctx.fillStyle = '#e2b48c'; ctx.beginPath(); ctx.ellipse(...P(112, 10), 30, 11, ang, 0, 7); ctx.fill();
        ctx.strokeStyle = rgba(HOT, .7); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.ellipse(g0[0] + 8, g0[1] + 2, 44, 34, ang - .2, 3.6, 5.2); ctx.stroke();
      };
      if (wq > 0) {
        // paint arc thrown off the brush, flying right with the hand (the carrier)
        const r = prng(4); for (let k = 0; k < 18; k++) { const u = r(), x = mix(head[0], tip[0], u), y = mix(head[1], tip[1], u) + Math.sin(u * 3) * -30; ctx.strokeStyle = rgba('#f0a040', .9 * (1 - u * .3)); ctx.lineWidth = 3 + r() * 9; ctx.beginPath(); ctx.moveTo(x, y + (r() - .5) * 26); ctx.lineTo(x - 60 - r() * 120 * wq, y + (r() - .5) * 26); ctx.stroke(); }
      }
      smear(ctx, vx, (dx) => hand(dx));
      ctx.restore();
      plate(ctx, front04(), c, 1.45);
      printFinish(ctx, { grain: .075, vig: .5, vigCol: '#0a0406' });
    },
  };
}
export const tagScreen = () => [TAG.x, TAG.y];
