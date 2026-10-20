// C06 (Film 4 v2) · your room in the hill town (behind hillWindow(0, 'you')), owner c06.
// One room, one pinhole camera (world cm, y DOWN, the camera looks along +Z from the window W1 at Z = 0 toward the back wall).
// The front window W1 IS the hill's window 'you' (its size comes from maslow4), so the hill push-in ends exactly in this room.
//   roomGeo(hw, hh)          geometry from W1's half size (cm)
//   roomState(t, A)          everything that changes with time (hour, TV, you, glass, bottle, hanger, bell …), A = anchors (scene)
//   drawRoom(ctx, t, c, S)   the whole room for camera c = { x, y, z, F } (also when c.z < 0: seen from outside through W1)
// Light: the hour h (a smooth monotone time-lapse) drives the sun patch through W1 (sliding across floor and back wall), the sky in the
// back window W2 (moon, dawn, afternoon, dusk), the warmth of the walls; the TV is the cyan hero light at night (same flicker as the hill).
import { W, H, rgba, clamp, mix, sm, prng, drift } from '../engine.mjs';
import { ring } from './certificate.mjs';
import { TAU, mono, ss, E, s5, hash, mixC, mixH, shadeH, flick, pr, plane, poly3, seg3, wineGlass, bottle, wineStream, remote, wallClock, youBack, SCREEN, SCREEN_HOT, OCHRE } from './v2_c06_kit.mjs';
import { drawView } from './v2_c06_view.mjs';
const vis = (c, Z, m = 6) => Z - c.z > m;

// ---------------------------------------------------------------- geometry
export function roomGeo(hw = 60, hh = 90) {
  const FL = hh + 45, G = { hw, hh, FL, CE: FL - 272, XL: -300, XR: 280, ZB: 560 };
  const y = (h) => FL - h; G.y = y;
  G.W2 = { x0: -265, x1: -145, y0: y(215), y1: y(105), z: 560, dep: 26 };
  G.bed = { x0: -296, x1: -104, z0: 466, z1: 560, top: y(50) };
  G.ward = { x0: -92, x1: 0, z0: 500, z1: 560, top: y(202) };
  G.cab = { x0: 20, x1: 200, z0: 516, z1: 560, top: y(50) };
  G.tv = { x0: 50, x1: 170, y0: y(127), y1: y(59), z: 546 };
  G.sofa = { x0: 10, x1: 210, z0: 300, z1: 392, back: y(86), seat: y(45), arm: y(63), aw: 19 };
  G.you = { x: 88, y: y(44), z: 336 };
  G.remote = { x: 200, y: y(63) - .6, z: 342 };
  G.hook = { x: -24, y: y(150), z: 500 };
  G.sill = { x0: -274, x1: -136, y: y(105), z0: 543, z1: 560 };
  G.glass = { x: -196, z: 553 };
  return G;
}

// ---------------------------------------------------------------- time of day
// day 0..1 (sun up), gold 0..1 (low sun), az −1 morning … +1 evening, el (sin of elevation), moon 0..1
export function sky(h) {
  const hm = ((h % 24) + 24) % 24, el = Math.sin(Math.PI * (hm - 6) / 14), up = hm > 6 && hm < 20;
  const day = sm(clamp(el * 2.6 + .08));
  // gold: the long afternoon from 3 pm, gone by 7:30 pm (then the heavy blue dusk); a short morning gold
  const aft = sm(clamp((hm - 14.2) / 2.6)) * (1 - sm(clamp((hm - 18.2) / 1.2))), morn = sm(clamp((hm - 5.2) / .8)) * (1 - sm(clamp((hm - 7.6) / 1.2)));
  const gold = Math.max(aft, morn * .7), moon = clamp(1 - day * 1.6);
  return { hm, el: up ? el : 0, day, gold, az: clamp((hm - 13) / 7, -1, 1), moon };
}
const SK = { nT: '#070a20', nB: '#18204a', gT: '#3a3466', gB: '#f2a47c', dT: '#7fa7d2', dB: '#e2e8ea' };
const skyCols = (L) => { const top = mixH(mixH(SK.nT, SK.gT, L.gold), SK.dT, L.day * (1 - L.gold * .5)), bot = mixH(mixH(SK.nB, SK.gB, L.gold), SK.dB, L.day * (1 - L.gold * .6)); return [top, bot]; };
// room tones: walls / floor / ceiling by daylight (warm plaster and oak by day, deep blue at night, rose-amber at the low sun)
const tone = (L, night, dayc, goldc) => mixH(mixH(night, dayc, L.day * .92), goldc, L.gold * .35);

// ---------------------------------------------------------------- state over time (A = anchors from scenes/sc06.mjs)
export function roomState(t, A) {
  const S = {};
  // the hour: night when we arrive, two days blur by (≥ 2.5 s each), midnight on "midnight", into the dawn while you scroll,
  // 4 pm on "four", a little later on "second", dusk on "evening", night when we leave
  if (!A._h) A._h = mono([[A.t0, 22.6], [A.enter - .6, 25], [A.enter + .3, 27.5], [A.bed - .55, 69.4], [A.bed + .05, 71.0], [A.midnight, 72], [A.whyNot + .1, 78.4], [A.four, 88], [A.four + .7, 88.25], [A.second, 88.6], [A.evening0, 89.2], [A.evening, 91.5], [A.dont + .6, 93.3], [A.out1 + 2, 94.6]]);
  S.h = A._h(t);
  S.rate = (A._h(t + .02) - A._h(t - .02)) / .04;
  // TV: on all the time (you never switch it off); the auto-play ring closes on "episode", again faster on "another"
  S.tv = 1; S.flick = flick(t);
  S.ringA = clamp((t - (A.episode - .78)) / .78); S.ringB = clamp((t - (A.another - .52)) / .52);
  S.bloom = Math.max(t >= A.episode ? Math.exp(-(t - A.episode) * 4.5) : 0, t >= A.another ? Math.exp(-(t - A.another) * 4.5) : 0);
  S.ringOn = (t > A.episode - .9 && t < A.episode + .1) || (t > A.another - .62 && t < A.another + .08) ? 1 : 0;
  S.showB = t >= A.episode && t < A.another;                  // the next episode's picture (then the coast again: another one)
  // you: on the sofa, except on the bed in 6.05 (you move while the camera looks at the TV / the window)
  S.you = t > A.another + .1 && t < A.whyNot + .55 ? 'bed' : 'sofa';
  S.sink = s5(clamp((t - (A.dont - .35)) / 1.1)) * .9 + s5(clamp((t - (A.toDont - .2)) / .8)) * .1;
  S.phone = S.you === 'bed' ? 1 : 0;
  // the glass on the sill: filled on "four", drunk while the camera looks at the clock, filled again on "second"
  const p1 = A.four - .62, p2 = A.second - .18;
  const pour = (p0, l0, l1) => { const u = clamp((t - p0) / .75); return { in: s5(clamp((t - (p0 - .4)) / .4)), out: s5(clamp((t - (p0 + .75)) / .45)), level: mix(l0, l1, s5(clamp((u - .08) / .92))), flow: u > 0 && u < 1 ? clamp(Math.min(u / .1, (1 - u) / .12)) : 0, u }; };
  const P1 = pour(p1, 0, .74), P2 = pour(p2, .12, .78);
  S.level = t < A.second - 1.3 ? P1.level : t < p2 ? mix(P1.level, .12, s5(clamp((t - (A.four + .55)) / (A.second - .9 - A.four - .55)))) : P2.level;
  const P = t < (p1 + p2) / 2 ? P1 : P2; S.bottle = { show: P.in * (1 - P.out), flow: P.flow, u: P.u };
  S.glassShow = t > A.whyNot - .6 && t < A.evening + .5;
  // the hanger (empty since 5.04) swings a little: a draft from the open window
  S.swing = .07 * Math.sin(t * 1.9) + .03 * Math.sin(t * 3.1 + 1);
  // the town clock strikes on "midnight" and on "four": the bell swings, rings of sound open from the belfry
  S.bells = [A.midnight, A.four];
  S.street = s5(clamp((t - (A.evening - .25)) / .5));
  S.curtain = 0;                                              // set by the take (opens as the camera arrives)
  return S;
}

// ---------------------------------------------------------------- drawing helpers
const fillP = (ctx, c, pts, style) => { if (poly3(ctx, c, pts)) { ctx.fillStyle = style; ctx.fill(); } };
const lineP = (ctx, c, a, b) => { const s = seg3(c, a, b); if (s) { ctx.moveTo(s[0], s[1]); ctx.lineTo(s[2], s[3]); } };
function lighter(ctx, f) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; f(); ctx.restore(); }
// a soft radial light on a plane at depth Z (world cm), in the plane's transform
function glowAt(ctx, c, Z, X, Y, R, col, a, sy = 1) {
  if (a <= .004 || Z - c.z < 4) return; ctx.save(); plane(ctx, c, Z); ctx.translate(X, Y); ctx.scale(1, sy);
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R); g.addColorStop(0, rgba(col, a)); g.addColorStop(.45, rgba(col, a * .32)); g.addColorStop(1, rgba(col, 0));
  ctx.fillStyle = g; ctx.globalCompositeOperation = 'lighter'; ctx.fillRect(-R, -R, 2 * R, 2 * R); ctx.restore();
}


// the street lamp on the quay outside W1 (it comes on at dusk): W1's shape thrown onto plane Z (back wall / wardrobe door), with the
// shadows of the two parted curtains at its sides
const LQ = { x: -62, y: -250, z: -3000 };
function lampPatch(ctx, c, G, S, Z, t) {
  const on = S.street; if (on < .005 || !vis(c, Z)) return;
  const s = (Z - LQ.z) / -LQ.z, X = (x) => LQ.x + (x - LQ.x) * s, Y = (y) => LQ.y + (y - LQ.y) * s;
  const x0 = X(-G.hw), x1 = X(G.hw), y0 = Y(-G.hh), y1 = Y(G.hh), a = on * (.92 + .08 * Math.sin(t * 7.1) * Math.sin(t * 2.3));
  plane(ctx, c, Z); ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [m, k] of [[14, .08], [8, .1], [3, .12], [0, .14]]) { ctx.fillStyle = rgba('#ffa850', k * a); ctx.beginPath(); ctx.roundRect(x0 + m, y0 + m, x1 - x0 - 2 * m, y1 - y0 - 2 * m, 6 + m); ctx.fill(); }
  ctx.restore();
  return { x0, x1, y0, y1, a };
}

// the sun (or moon) patch of W1: the window rect projected along the light onto the floor and the back wall, with the curtain pleats
function sunPatch(ctx, c, G, L, t, k) {
  const a = L.day * .5 + L.gold * .25, am = L.moon * .12; if (a + am < .01) return;
  const E0 = .18 + L.el * .75, A0 = L.az * .85, D = [Math.sin(A0) * Math.cos(E0), Math.sin(E0), Math.cos(A0) * Math.cos(E0)];
  const col = L.day > .05 ? mixH('#ffe2b0', '#ff9d62', L.gold) : '#9fb6e8', alpha = L.day > .05 ? a : am;
  const corners = [[-G.hw, -G.hh], [G.hw, -G.hh], [G.hw, G.hh], [-G.hw, G.hh]];
  // floor: hit Y = FL
  const fl = corners.map(([X, Y]) => { const s = (G.FL - Y) / D[1]; return [X + s * D[0], G.FL, s * D[2]]; });
  const wl = corners.map(([X, Y]) => { const s = G.ZB / D[2]; return [X + s * D[0], Y + s * D[1], G.ZB]; });
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  // pleats: the patch in 9 vertical bands (the sheer curtains at the sides filter the edges)
  const nb = 9;
  for (let i = 0; i < nb; i++) {
    const u0 = i / nb, u1 = (i + 1) / nb, um = (u0 + u1) / 2, edge = Math.abs(um - .5) * 2, k2 = (edge > .55 ? .45 + .25 * Math.sin(i * 2.3 + t * .8) : 1) * alpha;
    const band = (Q) => [[mix(Q[0][0], Q[1][0], u0), mix(Q[0][1], Q[1][1], u0), mix(Q[0][2], Q[1][2], u0)], [mix(Q[0][0], Q[1][0], u1), mix(Q[0][1], Q[1][1], u1), mix(Q[0][2], Q[1][2], u1)], [mix(Q[3][0], Q[2][0], u1), mix(Q[3][1], Q[2][1], u1), mix(Q[3][2], Q[2][2], u1)], [mix(Q[3][0], Q[2][0], u0), mix(Q[3][1], Q[2][1], u0), mix(Q[3][2], Q[2][2], u0)]];
    // floor part: clip to Z ≤ ZB by drawing inside a clip of the floor rectangle
    ctx.save(); if (poly3(ctx, c, [[G.XL, G.FL, 0], [G.XR, G.FL, 0], [G.XR, G.FL, G.ZB], [G.XL, G.FL, G.ZB]])) { ctx.clip(); if (poly3(ctx, c, band(fl))) { ctx.fillStyle = rgba(col, k2); ctx.fill(); } } ctx.restore();
    ctx.save(); if (poly3(ctx, c, [[G.XL, G.CE, G.ZB], [G.XR, G.CE, G.ZB], [G.XR, G.FL, G.ZB], [G.XL, G.FL, G.ZB]])) { ctx.clip(); if (poly3(ctx, c, band(wl))) { ctx.fillStyle = rgba(col, k2 * .85); ctx.fill(); } } ctx.restore();
  }
  ctx.restore();
}

// ---------------------------------------------------------------- the TV and its picture
function tvPicture(ctx, t, S, w, h) {
  // the show (engraved, cold): a coast at night, a boat; after the first ring, the next episode: a city street; both slowly alive
  const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0d2a3e'); g.addColorStop(1, '#2a6a82'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (!S.showB) {
    ctx.fillStyle = '#0a1a28'; ctx.beginPath(); ctx.moveTo(0, h * .62); for (let x = 0; x <= w; x += 4) ctx.lineTo(x, h * .62 - 6 * Math.sin(x * .05) - 10 * Math.exp(-(((x - w * .7) / 18) ** 2))); ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,230,255,.35)'; ctx.lineWidth = .4; for (let y = h * .66; y < h; y += 2.2) { ctx.beginPath(); ctx.moveTo(((t * 3 + y * 7) % 20) - 10, y); ctx.lineTo(w, y + .4); ctx.stroke(); }
    ctx.fillStyle = '#e8fbff'; ctx.beginPath(); ctx.arc(w * .26, h * .26, 5, 0, TAU); ctx.fill();
    const bx = w * .4 + Math.sin(t * .3) * 2; ctx.fillStyle = '#071018'; ctx.beginPath(); ctx.moveTo(bx - 8, h * .64); ctx.lineTo(bx + 8, h * .64); ctx.lineTo(bx + 5, h * .67); ctx.lineTo(bx - 5, h * .67); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx, h * .64); ctx.lineTo(bx, h * .44); ctx.lineTo(bx + 7, h * .62); ctx.closePath(); ctx.fill();
  } else {
    ctx.fillStyle = '#081622'; for (let i = 0; i < 9; i++) { const x = i * w / 9, hh = h * (.35 + .4 * hash(i, 3)); ctx.fillRect(x + 1, h - hh, w / 9 - 2, hh); }
    ctx.fillStyle = 'rgba(190,240,255,.55)'; for (let i = 0; i < 9; i++) for (let j = 0; j < 7; j++) if (hash(i * 7 + j, 5) < .35) ctx.fillRect(i * w / 9 + 3 + (j % 2) * 5, h - h * .1 - j * 5, 2.2, 2.6);
    ctx.fillStyle = 'rgba(220,250,255,.12)'; ctx.fillRect(0, h * .85, w, h * .15);
  }
  // the auto-play overlay: dimmed picture, the guilloche ring closing round a play triangle, the next cards below
  if (S.ringOn) {
    const u = S.ringA < 1 || S.ringB <= 0 ? S.ringA : S.ringB, cx = w / 2, cy = h * .46, R = h * .22;
    ctx.fillStyle = 'rgba(2,8,16,.55)'; ctx.fillRect(0, 0, w, h);
    ctx.save(); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R * 1.6, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(u)); ctx.closePath(); ctx.clip();
    ring(ctx, cx, cy, R, R, { lines: 6, band: R * .18, wave: R * .32, col: '#e8fbff', glow: SCREEN, glowA: .25, a: .95, lw: .35, ph: t * 2 });
    ctx.restore();
    ctx.strokeStyle = 'rgba(232,251,255,.18)'; ctx.lineWidth = .3; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
    ctx.fillStyle = '#e8fbff'; ctx.beginPath(); ctx.moveTo(cx - R * .28, cy - R * .4); ctx.lineTo(cx + R * .42, cy); ctx.lineTo(cx - R * .28, cy + R * .4); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { const x = w * .2 + i * w * .16, y = h * .8; ctx.fillStyle = i === 1 ? 'rgba(232,251,255,.85)' : 'rgba(150,200,220,.35)'; ctx.fillRect(x, y, w * .13, h * .09); ctx.fillStyle = 'rgba(8,24,36,.7)'; ctx.fillRect(x + .6, y + .6, w * .13 - 1.2, h * .09 - 1.2); ctx.fillStyle = 'rgba(160,220,240,.4)'; ctx.fillRect(x + 1.5, y + h * .05, w * .13 - 3, h * .02); }
  }
  if (S.bloom > .01) { ctx.fillStyle = rgba(SCREEN_HOT, .55 * S.bloom); ctx.fillRect(0, 0, w, h); }
}
function drawTV(ctx, c, G, t, S, L) {
  const T = G.tv, k = plane(ctx, c, T.z), w = T.x1 - T.x0, h = T.y1 - T.y0;
  // stand and bezel
  ctx.fillStyle = '#07080e'; ctx.fillRect(T.x0 + w * .42, T.y1, w * .16, 4); ctx.fillRect(T.x0 + w * .3, T.y1 + 3.2, w * .4, 1.6);
  ctx.fillStyle = '#0b0c12'; ctx.beginPath(); ctx.roundRect(T.x0 - 2, T.y0 - 2, w + 4, h + 4, 1.2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.rect(T.x0, T.y0, w, h); ctx.clip(); ctx.translate(T.x0, T.y0);
  const br = (.82 + .18 * S.flick) * S.tv; tvPicture(ctx, t, S, w, h);
  ctx.fillStyle = rgba('#000000', (1 - br) * .5); ctx.fillRect(0, 0, w, h);
  // scan texture and the room's reflection on the glass (the window behind you, faint)
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = .2; ctx.beginPath(); for (let y = 0; y < h; y += .7) { ctx.moveTo(0, y); ctx.lineTo(w, y); } ctx.stroke();
  const rg = ctx.createLinearGradient(0, 0, w, h); rg.addColorStop(0, `rgba(255,240,220,${.04 + .1 * L.day})`); rg.addColorStop(.5, 'rgba(255,255,255,0)'); ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
  ctx.restore();
  ctx.strokeStyle = rgba(SCREEN, .25 * S.tv); ctx.lineWidth = .35; ctx.strokeRect(T.x0 - 1.6, T.y0 - 1.6, w + 3.2, h + 3.2);
}

// ---------------------------------------------------------------- furniture
function cabinet(ctx, c, G, L, tvL) {
  const B = G.cab, wood = tone(L, '#1e171b', '#6a4a30', '#7a4a32');
  if (c.y < B.top) fillP(ctx, c, [[B.x0, B.top, B.z0], [B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x0, B.top, B.z1]], shadeH(wood, .25));
  if (c.x > B.x1) fillP(ctx, c, [[B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x1, G.FL, B.z1], [B.x1, G.FL, B.z0]], shadeH(wood, -.25));
  if (c.x < B.x0) fillP(ctx, c, [[B.x0, B.top, B.z0], [B.x0, B.top, B.z1], [B.x0, G.FL, B.z1], [B.x0, G.FL, B.z0]], shadeH(wood, -.25));
  if (!vis(c, B.z0)) return;
  plane(ctx, c, B.z0); const w = B.x1 - B.x0, h = G.FL - B.top;
  ctx.fillStyle = wood; ctx.fillRect(B.x0, B.top, w, h - 6);
  ctx.fillStyle = shadeH(wood, .2); ctx.fillRect(B.x0 - 1.5, B.top - 1.2, w + 3, 2.4);
  // three engraved panels with brass pulls, legs, the grain
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = .45; for (let i = 0; i < 3; i++) { const x = B.x0 + 4 + i * (w - 8) / 3; ctx.strokeRect(x + 1, B.top + 5, (w - 8) / 3 - 2, h - 18); ctx.strokeStyle = 'rgba(255,230,190,.1)'; ctx.strokeRect(x + 3, B.top + 7, (w - 8) / 3 - 6, h - 22); ctx.strokeStyle = 'rgba(0,0,0,.4)';
    ctx.fillStyle = tone(L, '#5a4a20', '#c8a050', '#e0a050'); ctx.beginPath(); ctx.arc(x + (w - 8) / 6, B.top + 12, 1.2, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = 'rgba(255,230,190,.08)'; ctx.lineWidth = .25; for (let y = B.top + 2; y < G.FL - 6; y += 1.3) { ctx.beginPath(); ctx.moveTo(B.x0, y); ctx.bezierCurveTo(B.x0 + w * .3, y + 1, B.x0 + w * .6, y - 1, B.x1, y + .4); ctx.stroke(); }
  ctx.fillStyle = '#08070a'; for (const x of [B.x0 + 4, B.x1 - 7]) ctx.fillRect(x, G.FL - 6, 3, 6);
  // the TV light along its top edge and down the panels
  ctx.strokeStyle = rgba(SCREEN, .6 * tvL); ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(B.x0, B.top - 1); ctx.lineTo(B.x1, B.top - 1); ctx.stroke();
  const tg = ctx.createLinearGradient(0, B.top, 0, G.FL); tg.addColorStop(0, rgba(SCREEN, .16 * tvL)); tg.addColorStop(1, rgba(SCREEN, 0)); ctx.fillStyle = tg; ctx.globalCompositeOperation = 'lighter'; ctx.fillRect(B.x0, B.top, w, h); ctx.globalCompositeOperation = 'source-over';
}
// on the cabinet: two empty wine bottles left of the TV, a takeaway box (folded white carton, wire handle) on the right
function cabTop(ctx, c, G, L, tvL, t) {
  const B = G.cab, zt = B.z0 + 14; if (!vis(c, zt)) return; plane(ctx, c, zt);
  const lit = { col: SCREEN, a: .5 + .5 * tvL };
  for (const [x, a] of [[29, -.04], [38.5, .05]]) { ctx.save(); ctx.translate(x, B.top); ctx.rotate(a); ctx.scale(.68, .68); bottle(ctx, 0, -44.6, { ang: -Math.PI / 2, light: lit }); ctx.restore(); }
  // the takeaway carton: trapezoid, folded flaps, a red band, the wire handle
  const x = 184, y = B.top, wb = 9, wt = 12, hh = 11, paper = tone(L, '#3a4058', '#f2ece0', '#f6dcc0');
  ctx.fillStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.ellipse(x + 1, y, 7, 1.2, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = paper; ctx.beginPath(); ctx.moveTo(x - wb / 2, y); ctx.lineTo(x - wt / 2, y - hh); ctx.lineTo(x - 2.5, y - hh - 3.2); ctx.lineTo(x + 2.5, y - hh - 3.2); ctx.lineTo(x + wt / 2, y - hh); ctx.lineTo(x + wb / 2, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = shadeH(paper, -.25); ctx.beginPath(); ctx.moveTo(x + 1.2, y); ctx.lineTo(x + 1.6, y - hh); ctx.lineTo(x + wt / 2, y - hh); ctx.lineTo(x + wb / 2, y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#b8342a'; ctx.beginPath(); ctx.moveTo(x - wb / 2 - .3, y - 4); ctx.lineTo(x + wb / 2 + .3, y - 4); ctx.lineTo(x + wb / 2 + .5, y - 5.6); ctx.lineTo(x - wb / 2 - .5, y - 5.6); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = .18; ctx.beginPath(); ctx.moveTo(x - wt / 2, y - hh); ctx.lineTo(x + wt / 2, y - hh); ctx.moveTo(x - 2.5, y - hh - 3.2); ctx.lineTo(x - 1, y - hh); ctx.moveTo(x + 2.5, y - hh - 3.2); ctx.lineTo(x + 1, y - hh); ctx.stroke();
  ctx.strokeStyle = tone(L, '#6a6a7a', '#8a8a92', '#9a8a80'); ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(x - 5.4, y - hh + .5); ctx.quadraticCurveTo(x, y - hh - 11, x + 5.4, y - hh + .5); ctx.stroke();
  ctx.strokeStyle = rgba(SCREEN, .55 * tvL); ctx.lineWidth = .25; ctx.beginPath(); ctx.moveTo(x - wb / 2, y); ctx.lineTo(x - wt / 2, y - hh); ctx.lineTo(x - 2.5, y - hh - 3.2); ctx.stroke();
}
function wardrobe(ctx, c, G, t, S, L, tvL) {
  const B = G.ward, wood = tone(L, '#15121a', '#7a5a3c', '#8a5a3c');
  if (c.x > B.x1) fillP(ctx, c, [[B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x1, G.FL, B.z1], [B.x1, G.FL, B.z0]], shadeH(wood, -.3));
  if (c.y < B.top) fillP(ctx, c, [[B.x0, B.top, B.z0], [B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x0, B.top, B.z1]], shadeH(wood, .1));
  if (!vis(c, B.z0)) return; plane(ctx, c, B.z0); const w = B.x1 - B.x0, h = G.FL - B.top;
  ctx.fillStyle = wood; ctx.fillRect(B.x0, B.top, w, h);
  ctx.fillStyle = shadeH(wood, .08); ctx.fillRect(B.x0 - 2, B.top - 3, w + 4, 5);
  // two doors with raised panels, keyholes; the grain
  for (let i = 0; i < 2; i++) { const x = B.x0 + 2 + i * (w - 4) / 2, dw = (w - 4) / 2 - 1; ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = .4; ctx.strokeRect(x, B.top + 4, dw, h - 12);
    for (const [py, ph] of [[B.top + 12, 70], [B.top + 92, 90]]) { ctx.strokeRect(x + 5, py, dw - 10, ph); ctx.strokeStyle = 'rgba(255,230,190,.1)'; ctx.strokeRect(x + 6, py + 1, dw - 12, ph - 2); ctx.strokeStyle = 'rgba(0,0,0,.45)'; }
    ctx.fillStyle = tone(L, '#2a2010', '#b89040', '#d09040'); ctx.beginPath(); ctx.arc(i ? x + 4 : x + dw - 4, B.top + 96, .9, 0, TAU); ctx.fill(); }
  ctx.strokeStyle = 'rgba(0,0,0,.16)'; ctx.lineWidth = .25; for (let x = B.x0 + 1; x < B.x1; x += 1.1) { ctx.beginPath(); ctx.moveTo(x, B.top + 2); ctx.bezierCurveTo(x + 1, B.top + 60, x - 1, B.top + 130, x + .5, G.FL - 2); ctx.stroke(); }
  // the TV light grazing the door from the right; dusk blue from the window on the left
  const lg = ctx.createLinearGradient(B.x0, 0, B.x1, 0); lg.addColorStop(0, rgba('#6f8fd0', .12 * (L.gold + L.moon * .5))); lg.addColorStop(1, rgba(SCREEN, .18 * tvL)); ctx.fillStyle = lg; ctx.globalCompositeOperation = 'lighter'; ctx.fillRect(B.x0, B.top, w, h); ctx.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.beginPath(); ctx.rect(B.x0, B.top, w, h); ctx.clip(); const LP = lampPatch(ctx, c, G, S, B.z0 - .3, t); ctx.restore();
  // the hook and the empty hanger (where the shirt and tie hung in 5.04), swinging a little
  const hk = G.hook; plane(ctx, c, hk.z - .5);
  ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(hk.x + 1.2, hk.y + 1.5, 1.6, 1.2, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = tone(L, '#6a5020', '#d8b060', '#f0b060'); ctx.lineWidth = .9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(hk.x, hk.y + 1.4); ctx.quadraticCurveTo(hk.x, hk.y - 2.6, hk.x + 2.4, hk.y - 3); ctx.stroke();
  ctx.save(); ctx.translate(hk.x + 1.6, hk.y - 3.1); ctx.rotate(S.swing);
  // shadow of the hanger on the door (offset by the light)
  { const la = LP ? LP.a : 0; ctx.save(); ctx.translate(2.6 - la * 1.2, 2.2 + la * 2.4); ctx.globalAlpha = .35 + .3 * la; hangerShape(ctx, '#000000', '#000000'); ctx.restore(); }
  hangerShape(ctx, tone(L, '#3a2416', '#9a6a3a', '#b07040'), tone(L, '#2a2a30', '#a0a0a8', '#b0a8a0'), LP ? rgba('#ffc890', .8 * LP.a) : rgba(SCREEN, .5 * tvL));
  ctx.restore();
}
function hangerShape(ctx, wood, metal, rim) {
  ctx.lineCap = 'round'; ctx.strokeStyle = metal; ctx.lineWidth = .55; ctx.beginPath(); ctx.arc(-1.4, 1.6, 1.6, -Math.PI * .95, 0); ctx.lineTo(.2, 6); ctx.stroke();
  ctx.fillStyle = wood; ctx.beginPath(); ctx.moveTo(.2, 5.2); ctx.quadraticCurveTo(-12, 9.5, -21, 15.6); ctx.lineTo(-20.4, 17.4); ctx.quadraticCurveTo(-10, 12, .2, 8.2); ctx.quadraticCurveTo(10.4, 12, 20.8, 17.4); ctx.lineTo(21.4, 15.6); ctx.quadraticCurveTo(12.4, 9.5, .2, 5.2); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = metal; ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(-19.6, 16.8); ctx.lineTo(20, 16.8); ctx.stroke();
  if (rim) { ctx.strokeStyle = rim; ctx.lineWidth = .35; ctx.beginPath(); ctx.moveTo(.6, 5.4); ctx.quadraticCurveTo(12.4, 9.7, 21.2, 15.6); ctx.stroke(); }
}
function bed(ctx, c, G, t, S, L, tvL) {
  const B = G.bed, wood = tone(L, '#120f16', '#5a3a26', '#6a3a26'), sheet = tone(L, '#1c2240', '#d9d2c2', '#e8c0a0'), duvet = tone(L, '#2a2f52', '#8a9ab8', '#b09098');
  // headboard against the left wall
  { const hb = []; for (let i = 0; i <= 12; i++) { const z = mix(B.z0 + 4, B.z1, i / 12); hb.push([B.x0 + 1, G.y(100) - 12 * Math.sin(Math.PI * i / 12), z]); } hb.push([B.x0 + 1, G.FL, B.z1], [B.x0 + 1, G.FL, B.z0 + 4]);
    fillP(ctx, c, hb, shadeH(wood, .18)); ctx.strokeStyle = rgba('#000000', .35); ctx.lineWidth = 1.2; ctx.beginPath(); for (let i = 1; i < 8; i++) { const z = mix(B.z0 + 4, B.z1, i / 8); lineP(ctx, c, [B.x0 + 1.5, G.y(100) - 12 * Math.sin(Math.PI * i / 8) + 6, z], [B.x0 + 1.5, G.y(52), z]); } ctx.stroke();
    ctx.strokeStyle = rgba(SCREEN, .35 * tvL + .25); ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < 12; i++) lineP(ctx, c, hb[i], hb[i + 1]); ctx.stroke(); }
  // mattress top (with the duvet), then the front faces
  if (c.y < B.top) fillP(ctx, c, [[B.x0, B.top, B.z0], [B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x0, B.top, B.z1]], sheet);
  if (c.x > B.x1) fillP(ctx, c, [[B.x1, B.top, B.z0], [B.x1, B.top, B.z1], [B.x1, G.FL, B.z1], [B.x1, G.FL, B.z0]], shadeH(wood, -.2));
  // pillow (left end) and the duvet as a soft mound billboard (a crumpled heap when you are not in it)
  const zP = (B.z0 + B.z1) / 2; if (!vis(c, zP + 8)) return; plane(ctx, c, zP + 8);
  ctx.fillStyle = shadeH(sheet, .08); ctx.beginPath(); ctx.ellipse(B.x0 + 30, B.top - 5, 24, 8, -.05, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .4; ctx.stroke();
  if (S.you === 'bed') bedYou(ctx, c, G, t, S, L, zP);
  else { ctx.fillStyle = duvet; ctx.beginPath(); ctx.moveTo(B.x0 + 50, B.top + 2); ctx.bezierCurveTo(B.x0 + 70, B.top - 22, B.x0 + 120, B.top - 18, B.x0 + 140, B.top - 8); ctx.bezierCurveTo(B.x0 + 160, B.top - 14, B.x1 - 10, B.top - 6, B.x1 - 4, B.top + 4); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .45; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.moveTo(B.x0 + 60 + i * 20, B.top); ctx.quadraticCurveTo(B.x0 + 70 + i * 20, B.top - 12, B.x0 + 85 + i * 19, B.top - 6); ctx.stroke(); } }
  // front rail of the frame + legs, the duvet hanging over the front edge
  if (!vis(c, B.z0)) return; plane(ctx, c, B.z0); const w = B.x1 - B.x0;
  ctx.fillStyle = duvet; ctx.beginPath(); ctx.moveTo(B.x0 + 40, B.top); ctx.lineTo(B.x1, B.top); ctx.lineTo(B.x1, B.top + 16); for (let x = B.x1; x > B.x0 + 40; x -= 8) ctx.quadraticCurveTo(x - 4, B.top + 19, x - 8, B.top + 15 + 2 * Math.sin(x)); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.3)'; ctx.lineWidth = .4; for (let x = B.x0 + 52; x < B.x1; x += 14) { ctx.beginPath(); ctx.moveTo(x, B.top + 1); ctx.quadraticCurveTo(x + 2, B.top + 9, x - 1, B.top + 16); ctx.stroke(); }
  ctx.fillStyle = wood; ctx.fillRect(B.x0, B.top + 14, w, 12); ctx.fillRect(B.x0 + 1, B.top + 25, 4, G.FL - B.top - 25); ctx.fillRect(B.x1 - 5, B.top + 25, 4, G.FL - B.top - 25);
  ctx.strokeStyle = 'rgba(255,220,180,.08)'; ctx.lineWidth = .3; for (let y = B.top + 15; y < B.top + 26; y += 1.2) { ctx.beginPath(); ctx.moveTo(B.x0, y); ctx.lineTo(B.x1, y + .3); ctx.stroke(); }
}
// you on the bed (6.05): lying on your side, your back to us, the phone in front of your face (hidden): its cold light on the wall
function bedYou(ctx, c, G, t, S, L, zP) {
  const B = G.bed, y0 = B.top, br = Math.sin(t * TAU / 4.6) * .8, duvet = tone(L, '#26304f', '#8a9ab8', '#b09098'), hair = '#17110f';
  // the body under the duvet: head end left, shoulder, waist, hip, legs to the right
  ctx.fillStyle = duvet; ctx.beginPath(); ctx.moveTo(B.x0 + 46, y0 + 2);
  ctx.bezierCurveTo(B.x0 + 48, y0 - 20 - br, B.x0 + 62, y0 - 30 - br, B.x0 + 80, y0 - 28 - br);
  ctx.bezierCurveTo(B.x0 + 96, y0 - 25, B.x0 + 104, y0 - 18, B.x0 + 116, y0 - 21);
  ctx.bezierCurveTo(B.x0 + 132, y0 - 26, B.x0 + 140, y0 - 22, B.x0 + 150, y0 - 14);
  ctx.bezierCurveTo(B.x0 + 165, y0 - 9, B.x1 - 14, y0 - 10, B.x1 - 6, y0 + 3); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(0,0,0,.32)'; ctx.lineWidth = .5; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.moveTo(B.x0 + 56 + i * 14, y0 - 30); ctx.quadraticCurveTo(B.x0 + 62 + i * 14, y0 - 12, B.x0 + 58 + i * 15, y0 + 2); ctx.stroke(); }
  const g = ctx.createLinearGradient(0, y0 - 32, 0, y0 + 2); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)'); ctx.fillStyle = g; ctx.fillRect(B.x0, y0 - 34, B.x1 - B.x0, 38); ctx.restore();
  // the ochre blanket thrown over the hip (you)
  ctx.fillStyle = tone(L, '#5a3a18', OCHRE, '#d08a40'); ctx.beginPath(); ctx.moveTo(B.x0 + 104, y0 - 19); ctx.bezierCurveTo(B.x0 + 120, y0 - 26, B.x0 + 138, y0 - 24, B.x0 + 150, y0 - 14); ctx.lineTo(B.x0 + 156, y0 + 4); ctx.lineTo(B.x0 + 100, y0 + 4); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(60,24,4,.45)'; ctx.lineWidth = .5; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(B.x0 + 108 + i * 11, y0 - 20); ctx.quadraticCurveTo(B.x0 + 112 + i * 11, y0 - 8, B.x0 + 108 + i * 12, y0 + 3); ctx.stroke(); }
  // the shoulder in the sweater above the duvet edge, the back of the head on the pillow (hair, an ear)
  ctx.fillStyle = tone(L, '#1e2540', '#3a4a70', '#4a4a70'); ctx.beginPath(); ctx.ellipse(B.x0 + 70, y0 - 27 - br, 15, 7, -.2, Math.PI, TAU); ctx.fill();
  const hx = B.x0 + 40, hy = y0 - 18 - br * .4;
  ctx.fillStyle = hair; ctx.beginPath(); ctx.ellipse(hx, hy, 10.5, 9, -.35, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(120,100,90,.35)'; ctx.lineWidth = .35; for (let i = 0; i < 12; i++) { const a = -2.6 + i * .3; ctx.beginPath(); ctx.moveTo(hx + Math.cos(a) * 3, hy + Math.sin(a) * 3); ctx.quadraticCurveTo(hx + Math.cos(a + .3) * 7, hy + Math.sin(a + .3) * 7, hx + Math.cos(a + .2) * 10, hy + Math.sin(a + .2) * 8.6); ctx.stroke(); }
  ctx.fillStyle = '#7a5038'; ctx.beginPath(); ctx.ellipse(hx + 8, hy + 4, 2, 3, .3, 0, TAU); ctx.fill();
  // the phone's light: a cold rim on the hair and shoulder from beyond, the glow is drawn on the wall (drawRoom)
  const p = S.phone * (.85 + .15 * Math.sin(t * 9) * Math.sin(t * 2.3));
  ctx.strokeStyle = rgba(SCREEN, .75 * p); ctx.lineWidth = .7; ctx.beginPath(); ctx.ellipse(hx, hy, 10.5, 9, -.35, -2.2, -.5); ctx.stroke();
  ctx.beginPath(); ctx.ellipse(B.x0 + 70, y0 - 27 - br, 15, 7, -.2, Math.PI * 1.15, Math.PI * 1.6); ctx.stroke();
}
// the sofa seen from behind: an upholstered back in three channels with a rolled top, piping, rolled arms lower at the sides, turned
// legs; your weight (sink) pulls the middle of the top roll down and wrinkles the cover around you
function sofa(ctx, c, G, t, S, L, tvL, sun) {
  const F = G.sofa, fab = tone(L, '#24353a', '#4a6a64', '#6a6a58'), dark = shadeH(fab, -.4), lite = shadeH(fab, .22), sink = S.sink;
  const yb = F.back, dip = 1.2 + sink * 3.4, dipAt = (x, k = 1) => dip * k * Math.exp(-(((x - G.you.x) / 30) ** 2));
  // armrest tops (rolled) and outer faces
  for (const [x0, x1, outer] of [[F.x0, F.x0 + F.aw, F.x0], [F.x1 - F.aw, F.x1, F.x1]]) {
    if (c.y < F.arm) { fillP(ctx, c, [[x0, F.arm, F.z0], [x1, F.arm, F.z0], [x1, F.arm, F.z1], [x0, F.arm, F.z1]], shadeH(fab, .3)); ctx.save(); ctx.clip(); ctx.fillStyle = rgba(SCREEN, .2 * tvL); ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if ((outer === F.x0 && c.x < F.x0) || (outer === F.x1 && c.x > F.x1)) fillP(ctx, c, [[outer, F.arm, F.z0], [outer, F.arm, F.z1], [outer, G.FL - 6, F.z1], [outer, G.FL - 6, F.z0]], dark);
  }
  // the remote on the right armrest (TV light on its buttons)
  { const R = G.remote; if (c.y < F.arm && vis(c, R.z, 10)) { plane(ctx, c, R.z); remote(ctx, R.x, R.y, { ang: -.08, sq: Math.min(.9, Math.max(.25, (F.arm - c.y) / (R.z - c.z) * 1.6)), light: { col: SCREEN, a: .6 + .4 * tvL } }); } }
  // backrest top roll seen from above, dented where your back presses in
  if (c.y < yb) { const pts = []; for (let i = 0; i <= 24; i++) { const x = mix(F.x0 + F.aw - 2, F.x1 - F.aw + 2, i / 24); pts.push([x, yb + dipAt(x), F.z0]); } for (let i = 24; i >= 0; i--) { const x = mix(F.x0 + F.aw - 2, F.x1 - F.aw + 2, i / 24); pts.push([x, yb + dipAt(x, .6) + .5, F.z0 + 22]); }
    fillP(ctx, c, pts, shadeH(fab, .14)); }
  if (!vis(c, F.z0)) return;
  plane(ctx, c, F.z0); const w = F.x1 - F.x0, xa = F.x0 + F.aw, xb = F.x1 - F.aw, bot = G.FL - 7;
  const outline = () => { ctx.beginPath(); ctx.moveTo(F.x0 + 1, bot); ctx.lineTo(F.x0, F.arm + 4); ctx.quadraticCurveTo(F.x0, F.arm - 3, F.x0 + 6, F.arm - 3); ctx.lineTo(xa - 4, F.arm - 3); ctx.quadraticCurveTo(xa - 1, F.arm - 3, xa, F.arm - 8); ctx.lineTo(xa + 1, yb + 6);
    ctx.quadraticCurveTo(xa + 1, yb, xa + 7, yb + dipAt(xa + 7)); for (let i = 1; i <= 24; i++) { const x = mix(xa + 7, xb - 7, i / 24); ctx.lineTo(x, yb + dipAt(x)); } ctx.quadraticCurveTo(xb - 1, yb, xb - 1, yb + 6);
    ctx.lineTo(xb, F.arm - 8); ctx.quadraticCurveTo(xb + 1, F.arm - 3, xb + 4, F.arm - 3); ctx.lineTo(F.x1 - 6, F.arm - 3); ctx.quadraticCurveTo(F.x1, F.arm - 3, F.x1, F.arm + 4); ctx.lineTo(F.x1 - 1, bot); ctx.closePath(); };
  outline(); ctx.fillStyle = fab; ctx.fill();
  ctx.save(); outline(); ctx.clip();
  // three channels: each a soft cylinder (light in the middle, dark at the seams), the seams pulled in at the buttons
  const nC = 3, cw2 = (xb - xa) / nC;
  for (let i = 0; i < nC; i++) { const x0 = xa + i * cw2, g = ctx.createLinearGradient(x0, 0, x0 + cw2, 0); g.addColorStop(0, rgba('#000000', .32)); g.addColorStop(.4, rgba('#ffffff', .05)); g.addColorStop(.6, rgba('#ffffff', .04)); g.addColorStop(1, rgba('#000000', .32)); ctx.fillStyle = g; ctx.fillRect(x0, yb - 4, cw2, F.arm - yb + 12); }
  // the rolled top: a highlight band under the roll's crest and its shadow below, following the dent
  ctx.lineCap = 'round';
  ctx.strokeStyle = rgba(lite, .55); ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const x = mix(xa + 6, xb - 6, i / 24); i ? ctx.lineTo(x, yb + 2.4 + dipAt(x)) : ctx.moveTo(x, yb + 2.4 + dipAt(x)); } ctx.stroke();
  ctx.strokeStyle = rgba('#000000', .38); ctx.lineWidth = 2.2; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const x = mix(xa + 6, xb - 6, i / 24); i ? ctx.lineTo(x, yb + 8.5 + dipAt(x, .8)) : ctx.moveTo(x, yb + 8.5 + dipAt(x, .8)); } ctx.stroke();
  // piping along the roll, seams between the channels, buttons; wrinkles fanning out from the dent when you sink
  ctx.strokeStyle = rgba(shadeH(fab, -.55), .8); ctx.lineWidth = .55; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const x = mix(xa + 4, xb - 4, i / 24); i ? ctx.lineTo(x, yb + 10.2 + dipAt(x, .7)) : ctx.moveTo(x, yb + 10.2 + dipAt(x, .7)); } ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.45)'; ctx.lineWidth = .6; for (let i = 1; i < nC; i++) { const x = xa + i * cw2; ctx.beginPath(); ctx.moveTo(x, yb + 11 + dipAt(x, .7)); ctx.quadraticCurveTo(x + 1.5, (yb + F.arm) / 2 + 6, x, bot - 4); ctx.stroke(); }
  for (let i = 1; i < nC; i++) for (const y of [yb + 20, yb + 36]) { const x = xa + i * cw2; ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.beginPath(); ctx.arc(x, y + dipAt(x, .5), 1, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = .35; for (const a of [-.6, .6, 2.5, 3.7]) { ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * 1.3, y + dipAt(x, .5) + Math.sin(a) * 1.3); ctx.lineTo(x + Math.cos(a) * 4.4, y + dipAt(x, .5) + Math.sin(a) * 3.4); ctx.stroke(); } }
  if (sink > .02) { ctx.strokeStyle = rgba('#000000', .3 * sink); ctx.lineWidth = .45; for (let k = -3; k <= 3; k++) { if (!k) continue; const x0 = G.you.x + k * 9; ctx.beginPath(); ctx.moveTo(x0, yb + 9 + dipAt(x0, .8)); ctx.quadraticCurveTo(x0 + k * 3, yb + 18, x0 + k * 6, yb + 26 + Math.abs(k) * 2); ctx.stroke(); } }
  // weave (fine horizontal engraving), the base shadow, the sun from behind the viewer
  ctx.strokeStyle = 'rgba(255,255,255,.05)'; ctx.lineWidth = .3; for (let y = yb + 2; y < G.FL; y += 1.2) { ctx.beginPath(); ctx.moveTo(F.x0, y); ctx.lineTo(F.x1, y + .4); ctx.stroke(); }
  const vg = ctx.createLinearGradient(0, F.arm, 0, G.FL); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); ctx.fillStyle = vg; ctx.fillRect(F.x0, F.arm, w, G.FL - F.arm);
  if (sun > 0) { ctx.fillStyle = rgba('#ffe2b0', .22 * sun); ctx.fillRect(F.x0, yb - 4, w, G.FL - yb); }
  // the arms' rolled fronts (seen from behind: a curl at the top of each arm)
  for (const [ax, sx] of [[F.x0 + F.aw / 2, -1], [F.x1 - F.aw / 2, 1]]) { ctx.strokeStyle = rgba(lite, .4); ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(ax - F.aw / 2 + 3, F.arm); ctx.quadraticCurveTo(ax, F.arm - 3.5, ax + F.aw / 2 - 3, F.arm); ctx.stroke(); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(ax - F.aw / 2 + 2, F.arm + 5); ctx.lineTo(ax + F.aw / 2 - 2, F.arm + 5); ctx.stroke(); }
  ctx.restore();
  // the TV rim along the roll and down the arms (cyan), the legs
  ctx.strokeStyle = rgba(SCREEN, .7 * tvL); ctx.lineWidth = .7; ctx.beginPath(); for (let i = 0; i <= 24; i++) { const x = mix(xa + 6, xb - 6, i / 24); i ? ctx.lineTo(x, yb + .4 + dipAt(x)) : ctx.moveTo(x, yb + .4 + dipAt(x)); } ctx.stroke();
  ctx.beginPath(); ctx.moveTo(F.x0 + 5, F.arm - 2.6); ctx.lineTo(xa - 4, F.arm - 2.6); ctx.moveTo(xb + 4, F.arm - 2.6); ctx.lineTo(F.x1 - 5, F.arm - 2.6); ctx.stroke();
  ctx.fillStyle = tone(L, '#0a0808', '#3a2618', '#3a2414'); for (const x of [F.x0 + 4, F.x1 - 8]) { ctx.beginPath(); ctx.moveTo(x, bot); ctx.lineTo(x + 4, bot); ctx.lineTo(x + 3.2, G.FL); ctx.lineTo(x + .8, G.FL); ctx.closePath(); ctx.fill(); }
}

// ---------------------------------------------------------------- the whole room
export function drawRoom(ctx, t, c, S, G) {
  const L = sky(S.h), night = clamp(1 - L.day * 1.25), tvL = S.tv * (.74 + .26 * S.flick) * (1 - L.day * .5) + S.bloom * .9;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const wallC = tone(L, '#1d2546', '#cdbf9f', '#d9a684'), floorC = tone(L, '#151a33', '#7a5a3e', '#8a5a40'), ceilC = tone(L, '#11163a', '#b9ae96', '#c49a84'), sideC = shadeH(wallC, -.14);
  ctx.fillStyle = shadeH(wallC, -.3); ctx.fillRect(0, 0, W, H);
  // ---- back wall with the W2 opening (the view out drawn first, clipped to the opening)
  const B = G.W2, ZB = G.ZB;
  ctx.save(); if (poly3(ctx, c, [[B.x0, B.y0, ZB + B.dep], [B.x1, B.y0, ZB + B.dep], [B.x1, B.y1, ZB + B.dep], [B.x0, B.y1, ZB + B.dep]])) { ctx.clip(); drawView(ctx, c, t, S, L); } ctx.restore();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.save(); ctx.beginPath(); poly3(ctx, c, [[G.XL, G.CE, ZB], [G.XR, G.CE, ZB], [G.XR, G.FL, ZB], [G.XL, G.FL, ZB]], 3, true); poly3(ctx, c, [[B.x0, B.y0, ZB], [B.x0, B.y1, ZB], [B.x1, B.y1, ZB], [B.x1, B.y0, ZB]], 3, true);
  ctx.clip('evenodd');
  { const k = plane(ctx, c, ZB); ctx.fillStyle = wallC; ctx.fillRect(G.XL, G.CE, G.XR - G.XL, G.FL - G.CE);
    // plaster: engraved courses that swell and bend; wainscot below the dado; the wall darker toward the corners and the ceiling
    const v0 = Math.max(G.CE, c.y - H / 2 / k - 4), v1 = Math.min(G.FL, c.y + H / 2 / k + 4), x0 = Math.max(G.XL, c.x - W / 2 / k - 4), x1 = Math.min(G.XR, c.x + W / 2 / k + 4);
    const ink = L.day > .5 ? '#4a3a28' : '#04050e'; ctx.strokeStyle = rgba(ink, .26 + .12 * night); ctx.lineWidth = Math.max(.25, 1.15 / k); ctx.beginPath();
    for (let y = Math.ceil(v0 / 2.6) * 2.6; y < Math.min(v1, G.y(92)); y += 2.6) { const st = Math.max(4, 40 / k); for (let x = x0; x <= x1 + st; x += st) { const yy = y + .5 * Math.sin(x * .05 + y * .3) + .3 * Math.sin(x * .13 + y); x === x0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); } } ctx.stroke();
    ctx.fillStyle = shadeH(wallC, -.12); ctx.fillRect(G.XL, G.y(92), G.XR - G.XL, 92);
    ctx.strokeStyle = rgba(ink, .32 + .1 * night); ctx.lineWidth = Math.max(.25, 1.1 / k); ctx.beginPath(); for (let x = Math.ceil(x0 / 9) * 9; x < x1; x += 9) { ctx.moveTo(x, G.y(90)); ctx.lineTo(x, G.FL - 10); } ctx.stroke();
    ctx.fillStyle = shadeH(wallC, .15); ctx.fillRect(G.XL, G.y(93.5), G.XR - G.XL, 2.4); ctx.fillStyle = rgba('#000000', .3); ctx.fillRect(G.XL, G.y(91.2), G.XR - G.XL, 1.2);
    ctx.fillStyle = shadeH(wallC, -.25); ctx.fillRect(G.XL, G.FL - 10, G.XR - G.XL, 10);
    const cg = ctx.createLinearGradient(G.XL, 0, G.XR, 0); cg.addColorStop(0, 'rgba(0,0,0,.4)'); cg.addColorStop(.2, 'rgba(0,0,0,0)'); cg.addColorStop(.8, 'rgba(0,0,0,0)'); cg.addColorStop(1, 'rgba(0,0,0,.4)'); ctx.fillStyle = cg; ctx.fillRect(G.XL, G.CE, G.XR - G.XL, G.FL - G.CE);
    const tg = ctx.createLinearGradient(0, G.CE, 0, G.CE + 70); tg.addColorStop(0, 'rgba(0,0,0,.35)'); tg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = tg; ctx.fillRect(G.XL, G.CE, G.XR - G.XL, 70);
    // a small framed photo right of the TV (grandmother's garden, 5.10: an engraved oval vignette)
    { const px = 186, py = G.y(196); ctx.fillStyle = tone(L, '#2a2018', '#5a3a20', '#6a3a20'); ctx.fillRect(px, py, 34, 42); ctx.fillStyle = tone(L, '#262c44', '#d8ccae', '#e0b898'); ctx.fillRect(px + 3.5, py + 3.5, 27, 35);
    ctx.strokeStyle = tone(L, '#0a0c18', '#5a4a38', '#6a4a38'); ctx.lineWidth = .4; ctx.beginPath(); ctx.ellipse(px + 17, py + 21, 9, 12.5, 0, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(px + 17, py + 17, 3.6, 0, TAU); ctx.moveTo(px + 10.5, py + 31); ctx.quadraticCurveTo(px + 17, py + 19, px + 23.5, py + 31); ctx.stroke(); }
  }
  ctx.restore();
  // light on the back wall: the TV (cyan hero: a wide pool and a hot core), the phone (bed), the sun / moon patch from W1
  const tvx = (G.tv.x0 + G.tv.x1) / 2, tvy = (G.tv.y0 + G.tv.y1) / 2;
  glowAt(ctx, c, ZB - .5, tvx, tvy, 260, SCREEN, .34 * tvL, .78); glowAt(ctx, c, ZB - .5, tvx, tvy, 110, SCREEN_HOT, .3 * tvL, .8);
  if (S.phone > 0) { const ph = S.phone * (.8 + .2 * Math.sin(t * 7.3) * Math.sin(t * 2.1)); glowAt(ctx, c, ZB - .5, G.bed.x0 + 30, G.bed.top - 40, 120, SCREEN, .5 * ph, 1.1); phoneCards(ctx, c, G, t, ph); }
  sunPatch(ctx, c, G, L, t);
  ctx.save(); ctx.beginPath(); poly3(ctx, c, [[G.XL, G.CE, ZB], [G.XR, G.CE, ZB], [G.XR, G.FL, ZB], [G.XL, G.FL, ZB]]); ctx.clip(); lampPatch(ctx, c, G, S, ZB - .4, t); ctx.restore();
  // ---- W2: the reveal (thick old wall), the frame with its cross, the sill
  { const d = B.dep, sc = shadeH(wallC, -.2);
    if (c.x > B.x0) fillP(ctx, c, [[B.x0, B.y0, ZB], [B.x0, B.y0, ZB + d], [B.x0, B.y1, ZB + d], [B.x0, B.y1, ZB]], sc);
    if (c.x < B.x1) fillP(ctx, c, [[B.x1, B.y0, ZB], [B.x1, B.y0, ZB + d], [B.x1, B.y1, ZB + d], [B.x1, B.y1, ZB]], sc);
    if (c.y > B.y0) fillP(ctx, c, [[B.x0, B.y0, ZB], [B.x1, B.y0, ZB], [B.x1, B.y0, ZB + d], [B.x0, B.y0, ZB + d]], shadeH(sc, -.2));
    if (vis(c, ZB + 14)) { plane(ctx, c, ZB + 14); const frame = tone(L, '#2a3050', '#e6dcc6', '#f0d0b0');
      ctx.fillStyle = frame; ctx.fillRect(B.x0, B.y0, B.x1 - B.x0, 4); ctx.fillRect(B.x0, B.y1 - 4, B.x1 - B.x0, 4); ctx.fillRect(B.x0, B.y0, 4, B.y1 - B.y0); ctx.fillRect(B.x1 - 4, B.y0, 4, B.y1 - B.y0);
      ctx.fillRect((B.x0 + B.x1) / 2 - 2, B.y0, 4, B.y1 - B.y0); ctx.fillRect(B.x0, mix(B.y0, B.y1, .42) - 1.5, B.x1 - B.x0, 3);
      ctx.fillStyle = rgba(night > .5 ? '#9fb4e8' : '#fff6e0', .45); ctx.fillRect(B.x0, B.y0, B.x1 - B.x0, .8); ctx.fillRect(B.x0 + 4, mix(B.y0, B.y1, .42) - 1.5, B.x1 - B.x0 - 8, .7);
      ctx.fillStyle = rgba('#dfe8ff', .04 + .05 * L.day); ctx.fillRect(B.x0 + 4, B.y0 + 4, B.x1 - B.x0 - 8, B.y1 - B.y0 - 8); }
    const s2 = G.sill; if (c.y < s2.y) fillP(ctx, c, [[s2.x0, s2.y, s2.z0], [s2.x1, s2.y, s2.z0], [s2.x1, s2.y, ZB + 6], [s2.x0, s2.y, ZB + 6]], tone(L, '#2c3252', '#e6dcc6', '#f0c8a0'));
    if (vis(c, s2.z0)) { plane(ctx, c, s2.z0); ctx.fillStyle = tone(L, '#181c38', '#b8ab92', '#c09a80'); ctx.fillRect(s2.x0, s2.y, s2.x1 - s2.x0, 4.5);
      ctx.strokeStyle = rgba(L.day > .2 ? '#fff6e0' : SCREEN, .3); ctx.lineWidth = .3; ctx.beginPath(); ctx.moveTo(s2.x0, s2.y + .2); ctx.lineTo(s2.x1, s2.y + .2); ctx.stroke(); } }
  // ---- ceiling, side walls, floor (projected), with beams, courses and boards
  fillP(ctx, c, [[G.XL, G.CE, 0], [G.XR, G.CE, 0], [G.XR, G.CE, ZB], [G.XL, G.CE, ZB]], ceilC);
  for (let z = 70; z < ZB; z += 82) { const bc = tone(L, '#0c0f26', '#6a5038', '#7a5038'); fillP(ctx, c, [[G.XL, G.CE, z], [G.XR, G.CE, z], [G.XR, G.CE + 14, z], [G.XL, G.CE + 14, z]], bc); if (c.y > G.CE + 14) fillP(ctx, c, [[G.XL, G.CE + 14, z], [G.XR, G.CE + 14, z], [G.XR, G.CE + 14, z + 16], [G.XL, G.CE + 14, z + 16]], shadeH(bc, .2)); }
  fillP(ctx, c, [[G.XL, G.CE, 0], [G.XL, G.CE, ZB], [G.XL, G.FL, ZB], [G.XL, G.FL, 0]], sideC);
  fillP(ctx, c, [[G.XR, G.CE, 0], [G.XR, G.CE, ZB], [G.XR, G.FL, ZB], [G.XR, G.FL, 0]], sideC);
  ctx.strokeStyle = rgba('#03040c', .22); ctx.lineWidth = 1; ctx.beginPath(); for (let y = G.CE + 8; y < G.FL; y += 6) { lineP(ctx, c, [G.XL, y, 0], [G.XL, y, ZB]); lineP(ctx, c, [G.XR, y, 0], [G.XR, y, ZB]); } ctx.stroke();
  // the door on the right wall (closed): panels, a brass handle
  fillP(ctx, c, [[G.XR - .5, G.y(205), 390], [G.XR - .5, G.y(205), 480], [G.XR - .5, G.FL, 480], [G.XR - .5, G.FL, 390]], tone(L, '#1a1622', '#6a4a30', '#7a4a30'));
  ctx.strokeStyle = rgba('#000000', .4); ctx.lineWidth = 1; ctx.beginPath(); for (const [ya, yb2] of [[G.y(195), G.y(115)], [G.y(100), G.y(12)]]) for (const [za, zb] of [[398, 432], [438, 472]]) { if (poly3(ctx, c, [[G.XR - 1, ya, za], [G.XR - 1, ya, zb], [G.XR - 1, yb2, zb], [G.XR - 1, yb2, za]], 3)) ctx.stroke(); } 
  fillP(ctx, c, [[G.XL, G.FL, 0], [G.XR, G.FL, 0], [G.XR, G.FL, ZB], [G.XL, G.FL, ZB]], floorC);
  ctx.strokeStyle = rgba('#000000', .34); ctx.lineWidth = 1; ctx.beginPath(); for (let x = G.XL; x <= G.XR; x += 14) lineP(ctx, c, [x, G.FL, 0], [x, G.FL, ZB]);
  for (let x = G.XL, i = 0; x < G.XR; x += 14, i++) for (let z = (hash(i, 1) * 120) % 120; z < ZB; z += 120) lineP(ctx, c, [x, G.FL, z], [x + 14, G.FL, z]); ctx.stroke();
  // the rug under the sofa (engraved border)
  fillP(ctx, c, [[-10, G.FL - .3, 262], [236, G.FL - .3, 262], [236, G.FL - .3, 516], [-10, G.FL - .3, 516]], tone(L, '#2c1c30', '#7a3a34', '#8a4a3a'));
  ctx.strokeStyle = tone(L, '#4a3448', '#d8b890', '#e0b090'); ctx.lineWidth = 1.2; for (const m of [8, 14]) { if (poly3(ctx, c, [[-10 + m, G.FL - .4, 262 + m], [236 - m, G.FL - .4, 262 + m], [236 - m, G.FL - .4, 516 - m], [-10 + m, G.FL - .4, 516 - m]])) ctx.stroke(); }
  // light on the floor / ceiling / side walls: the TV pools (cyan), the moonlight through W2 on the floor by the bed
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  const pool = (X, Y, Z, R, a, sq) => { const p = pr(c, X, Y, Z); if (p[3] < 5 || a < .005) return; const r = R * p[2], g = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r); g.addColorStop(0, rgba(SCREEN, a)); g.addColorStop(.5, rgba(SCREEN, a * .3)); g.addColorStop(1, rgba(SCREEN, 0)); ctx.fillStyle = g; ctx.save(); ctx.setTransform(1, 0, 0, sq, 0, p[1] * (1 - sq)); ctx.fillRect(p[0] - r, p[1] - r, 2 * r, 2 * r); ctx.restore(); };
  pool(110, G.FL, 470, 300, .3 * tvL, .32); pool(110, G.CE, 440, 340, .2 * tvL, .3); pool(G.XR, 40, 470, 220, .12 * tvL, 1);
  if (L.moon > .05) { ctx.setTransform(1, 0, 0, 1, 0, 0); if (poly3(ctx, c, [[B.x0 + 10, G.FL - .5, ZB - 20], [B.x1 + 10, G.FL - .5, ZB - 20], [B.x1 + 40, G.FL - .5, ZB - 150], [B.x0 + 40, G.FL - .5, ZB - 150]])) { ctx.fillStyle = rgba('#9fb4e8', .1 * L.moon); ctx.fill(); } }
  ctx.restore();
  // ---- objects, far to near
  ctx.setTransform(1, 0, 0, 1, 0, 0); wardrobe(ctx, c, G, t, S, L, tvL);
  ctx.setTransform(1, 0, 0, 1, 0, 0); cabinet(ctx, c, G, L, tvL); if (vis(c, G.tv.z)) drawTV(ctx, c, G, t, S, L); cabTop(ctx, c, G, L, tvL, t);
  ctx.setTransform(1, 0, 0, 1, 0, 0); bed(ctx, c, G, t, S, L, tvL);
  if (S.glassShow) sillProps(ctx, c, G, t, S, L);
  // floor lamp (off) right of the cabinet
  if (vis(c, 540)) { plane(ctx, c, 540); const lx = 254; ctx.fillStyle = tone(L, '#0a0b14', '#2a2420', '#2a2018'); ctx.fillRect(lx - 1.1, G.y(160), 2.2, 160); ctx.beginPath(); ctx.ellipse(lx, G.FL - .5, 13, 2.5, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx - 13, G.y(160)); ctx.lineTo(lx + 13, G.y(160)); ctx.lineTo(lx + 7, G.y(186)); ctx.lineTo(lx - 7, G.y(186)); ctx.closePath(); ctx.fillStyle = tone(L, '#1c1a28', '#d8c8a0', '#e0b080'); ctx.fill();
    ctx.strokeStyle = rgba(SCREEN, .5 * tvL); ctx.lineWidth = .45; ctx.beginPath(); ctx.moveTo(lx - 7, G.y(186)); ctx.lineTo(lx - 13, G.y(160)); ctx.stroke(); }
  // the ceiling pendant (off), a glass shade on a cord
  if (vis(c, 330, 12)) { plane(ctx, c, 330); ctx.strokeStyle = tone(L, '#05060c', '#2a2420', '#2a2018'); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(100, G.CE); ctx.lineTo(100, G.y(212)); ctx.stroke();
    ctx.fillStyle = tone(L, '#1a1e36', '#e8e0cc', '#f0c8a0'); ctx.beginPath(); ctx.moveTo(93, G.y(212)); ctx.quadraticCurveTo(100, G.y(220), 107, G.y(212)); ctx.lineTo(112, G.y(202)); ctx.lineTo(88, G.y(202)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgba(SCREEN, .55 * tvL); ctx.lineWidth = .4; ctx.beginPath(); ctx.moveTo(88, G.y(202)); ctx.lineTo(112, G.y(202)); ctx.stroke(); }
  // you on the sofa (behind the backrest), then the sofa
  const sunOn = L.day * .7 + L.gold * .3;
  if (S.you === 'sofa') { const Y = G.you, p = pr(c, Y.x, Y.y, Y.z); if (p[3] > 12) { ctx.setTransform(1, 0, 0, 1, 0, 0); youBack(ctx, p[0], p[1], p[2], { t, seed: 3, sink: S.sink, tv: { col: SCREEN, a: Math.min(1, .6 + .45 * tvL) }, sun: { col: '#ffe2b0', a: sunOn * .8 }, shade: .1 * (1 - L.day) }); } }
  ctx.setTransform(1, 0, 0, 1, 0, 0); sofa(ctx, c, G, t, S, L, tvL, sunOn);
  // ---- dust in the TV light (cyan) and in the sun (warm): world points, so they parallax with the camera
  dust(ctx, c, G, t, L, tvL, S);
  ctx.restore();
  return { L, tvL };
}
function phoneCards(ctx, c, G, t, a) {
  if (!vis(c, G.ZB - .6)) return; plane(ctx, c, G.ZB - .6); const x0 = G.bed.x0 + 18, y0 = G.bed.top - 40;
  ctx.save(); ctx.beginPath(); ctx.ellipse(x0 + 12, y0 - 20, 46, 60, 0, 0, TAU); ctx.clip(); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 8; i++) { const y = y0 + 40 - (((t * 26 + i * 22) % 176)) + 20, fade = Math.sin(clamp((y - (y0 - 80)) / 140) * Math.PI); ctx.fillStyle = rgba(SCREEN, .18 * a * fade); ctx.beginPath(); ctx.roundRect(x0, y, 24, 16, 2); ctx.fill(); ctx.fillStyle = rgba(SCREEN_HOT, .14 * a * fade); ctx.fillRect(x0 + 3, y + 3, 9, 6); ctx.fillRect(x0 + 3, y + 11, 18, 1.2); }
  ctx.restore();
}
// the glass on the sill, the bottle that tips in from above and pours (no hand: it stays above the frame)
function sillProps(ctx, c, G, t, S, L) {
  const s2 = G.sill, gx = G.glass.x, gz = G.glass.z; if (!vis(c, gz, 8)) return; const k = plane(ctx, c, gz), side = L.az > 0 ? -1 : 1;
  const lit = { col: L.day > .2 ? '#ffe6c0' : '#cfe0ff', a: .5 + .5 * L.day };
  if (L.day > .05) { ctx.save(); const sun = L.day * (.35 + .65 * L.gold); if (poly3(ctx, c, [[gx - 62, s2.y - .1, s2.z0], [gx + 34, s2.y - .1, s2.z0], [gx + 22, s2.y - .1, G.ZB + 4], [gx - 74, s2.y - .1, G.ZB + 4]])) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ffc078', .1 * sun); ctx.fill(); }
    ctx.restore(); plane(ctx, c, gz); }
  // the long afternoon shadow and the wine's red caustic on the sill
  if (L.day > .05) { ctx.save(); ctx.fillStyle = rgba('#000000', .25 * L.day); ctx.beginPath(); ctx.ellipse(gx + side * -9, s2.y - .2, 11, 1.2, 0, 0, TAU); ctx.fill(); if (S.level > .05) { ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rgba('#ff3048', .3 * L.day * S.level); ctx.beginPath(); ctx.ellipse(gx - side * 7, s2.y - .3, 6, .9, 0, 0, TAU); ctx.fill(); } ctx.restore(); }
  wineGlass(ctx, gx, s2.y, { level: S.level, side, light: lit, glint: .5 + .5 * L.day });
  const b = S.bottle; if (b.show > .001) {
    const ang = mix(1.65, 2.3, s5(clamp(b.u * 1.2))) - (1 - b.show) * .25, mx = gx + 3.4 + (1 - b.show) * 26, my = s2.y - 28.5 - (1 - b.show) * 44;
    if (b.flow > 0) wineStream(ctx, mx, my, gx + .6, s2.y - mix(10.6, 17.4, S.level), clamp(b.flow * 1.2), { thin: 1 - b.flow, t });
    bottle(ctx, mx, my, { ang, light: lit });
  }
}
function dust(ctx, c, G, t, L, tvL, S) {
  const r = prng(55); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 70; i++) {
    const X = -40 + r() * 280, Y = G.y(40) - r() * 160, Z = 300 + r() * 240, ph = r() * TAU, sp = .3 + r() * .5;
    const x = X + Math.sin(t * sp + ph) * 6 + t * .8, y = Y + Math.cos(t * sp * .8 + ph) * 5 - ((t * 1.5 * sp) % 30), p = pr(c, x, y, Z); if (p[3] < 20 || p[0] < -20 || p[0] > W + 20 || p[1] < -20 || p[1] > H + 20) continue;
    const near = Math.exp(-(((X - 110) / 120) ** 2) - (((Y - G.y(100)) / 90) ** 2)), a = (.35 * tvL + .3 * L.day) * near * (.5 + .5 * Math.sin(t * 2 + ph)) * (.6 + .6 * S.sink);
    if (a < .02) continue; const s = Math.max(1, p[2] * .25); ctx.fillStyle = rgba(L.day > .4 ? '#fff0d0' : SCREEN_HOT, a); ctx.fillRect(p[0], p[1], s, s);
  }
  ctx.restore();
}
// W1 from inside / outside: the reveal of the facade wall and the two sheer curtains (backlit by the TV); open 0..1 parts them
// W1 from inside / outside: the reveal of the facade wall and the two sheer curtains (backlit by the TV); open 0..1 parts them
export function drawW1(ctx, t, c, G, S, o = {}) {
  const hw = G.hw, hh = G.hh, open = clamp(o.open ?? 0), glowCol = o.col || SCREEN, glowA = o.glow ?? 1;
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  // reveal faces (the wall is 30 cm thick): visible from outside as the camera comes close
  const sc = '#121530';
  if (c.z < -30) { if (c.x > -hw) fillP(ctx, c, [[-hw, -hh, -30], [-hw, -hh, 0], [-hw, hh, 0], [-hw, hh, -30]], sc); if (c.x < hw) fillP(ctx, c, [[hw, -hh, -30], [hw, -hh, 0], [hw, hh, 0], [hw, hh, -30]], sc);
    if (c.y > -hh) fillP(ctx, c, [[-hw, -hh, -30], [hw, -hh, -30], [hw, -hh, 0], [-hw, -hh, 0]], '#0b0d22'); if (c.y < hh) fillP(ctx, c, [[-hw, hh, -30], [hw, hh, -30], [hw, hh, 0], [-hw, hh, 0]], '#1a1d40'); }
  // the curtains at Z = 6: two sheer panels, pleated; backlit they glow, the room shows through them
  const Zc = 6; if (c.z < Zc - 2) {
    const k = plane(ctx, c, Zc), gap = mix(0, hw * .95, open), sway = Math.sin(t * .9) * 1.2 + Math.sin(t * 2.3) * .5;
    for (const sx of [-1, 1]) {
      const xi = sx * gap, xo = sx * (hw + 8), top = -hh - 6, bot = hh + 4;
      ctx.save(); ctx.beginPath(); ctx.moveTo(xo, top); ctx.lineTo(xi, top); ctx.bezierCurveTo(xi + sway * .5, top + (bot - top) * .3, xi + sway * 1.3 - sx * open * 6, top + (bot - top) * .7, xi + sway * 2 - sx * open * 14, bot); ctx.lineTo(xo, bot); ctx.closePath();
      if (o.fill) { ctx.fillStyle = o.fill; ctx.fill(); } else { const g = ctx.createLinearGradient(xi, 0, xo, 0); g.addColorStop(0, rgba(glowCol, .14 * glowA)); g.addColorStop(1, rgba(glowCol, .3 * glowA)); ctx.fillStyle = g; ctx.fill(); }
      ctx.clip();
      // pleats: folds bunch toward the outer edge as the curtain opens (darker valleys, light crests)
      const n = 9; for (let i = 0; i < n; i++) { const u = Math.pow((i + .5) / n, 1 - open * .45), x = mix(xi, xo, u) + sway * (1 - u), wv = Math.abs(xo - xi) / n * (1 - open * .4);
        ctx.fillStyle = rgba('#05060f', .12 + .05 * Math.sin(i * 1.7)); ctx.fillRect(x - wv * .22, top, wv * .44, bot - top); ctx.fillStyle = rgba('#ffffff', .07 * glowA); ctx.fillRect(x + wv * .28, top, wv * .14, bot - top); }
      ctx.restore();
      ctx.strokeStyle = rgba('#ffffff', .25 * glowA); ctx.lineWidth = .5; ctx.beginPath(); ctx.moveTo(xi, top); ctx.bezierCurveTo(xi + sway * .5, top + (bot - top) * .3, xi + sway * 1.3 - sx * open * 6, top + (bot - top) * .7, xi + sway * 2 - sx * open * 14, bot); ctx.stroke();
    }
    // the rod
    ctx.fillStyle = '#1a1a24'; ctx.fillRect(-hw - 12, -hh - 8, 2 * hw + 24, 2);
  }
  ctx.restore();
}
