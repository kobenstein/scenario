// c11 (Film 4 v2) · what happens in the rooms of the cut-away esteem street (see lib/v2_c11_rooms.mjs). Every act is a pure
// function of t; the clocks that matter for the VO come from st.busy (absolute film seconds), everything else loops on its own.
//   potter  · the wheel turns under the clay, a bowl rises between her hands (st.busy.potter = t0 of the bowl)
//   dancer  · a slow turn in a studio, arms in front and up (silhouette against the lit mirror wall)
//   violin  · a person of forty, the bow moving; engraved staff lines drift out of the room
//   joiner  · an old man guides a child's hands on a plane; shavings curl
//   office  · paper stacks, empty desks, a cold tube light; it turns into dotted ghost lines and drifts away (st.busy.office)
//   painter · a painter at an easel (the sixth shop), upper floors: small domestic life
import { W, H, rgba, clamp, mix, lin, sm, prng, TAU, eoX, eiX, qio, qo, u01, putGlow, mixHex, shadeHex, hash } from './v2_c11_kit.mjs';
import { person, kid, reachArm } from './v2_c11_people.mjs';
import { dancer } from './v2_c11_dancer.mjs';

const MPU = .23, FOC = 1400;
const figS = (V, d) => FOC / Math.max(.05, V.D + d) / MPU / 105.7;
const U = (m) => m / MPU;                        // metres → units
function quad(ctx, V, pts) { ctx.beginPath(); pts.forEach(([x, y, d], i) => { const [sx, sy] = V.P(x, y, d); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.closePath(); }
const seg3 = (ctx, V, a, b) => { const p = V.P(a[0], a[1], a[2]), q = V.P(b[0], b[1], b[2]); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); };
// a box (x0..x1, y0..y1, d0..d1) with its visible faces (front, top or bottom, the side toward the camera)
export function box(ctx, V, x0, y0, d0, x1, y1, d1, col, o = {}) {
  const top = V.P(0, y0, d0)[1] > V.P(0, y0, d1)[1] ? 0 : 1;   // is the camera above the top face?
  const cxs = V.x;
  ctx.fillStyle = shadeHex(col, -.22);
  if (cxs < x0) { quad(ctx, V, [[x0, y0, d0], [x0, y0, d1], [x0, y1, d1], [x0, y1, d0]]); ctx.fill(); }
  if (cxs > x1) { quad(ctx, V, [[x1, y0, d0], [x1, y0, d1], [x1, y1, d1], [x1, y1, d0]]); ctx.fill(); }
  if (V.y < y0) { ctx.fillStyle = o.top || shadeHex(col, .12); quad(ctx, V, [[x0, y0, d0], [x1, y0, d0], [x1, y0, d1], [x0, y0, d1]]); ctx.fill(); }
  if (V.y > y1) { ctx.fillStyle = shadeHex(col, -.35); quad(ctx, V, [[x0, y1, d0], [x1, y1, d0], [x1, y1, d1], [x0, y1, d1]]); ctx.fill(); }
  ctx.fillStyle = col; quad(ctx, V, [[x0, y0, d0], [x1, y0, d0], [x1, y1, d0], [x0, y1, d0]]); ctx.fill();
  if (o.line) { ctx.strokeStyle = o.line; ctx.lineWidth = Math.max(.6, V.P(x0, y0, d0)[2] * .05); ctx.stroke(); }
}
// a body of revolution (pot, bowl, vase) standing at (x, yFloor, d): profile = [[r, h], …] from the foot up (units)
export function pot(ctx, V, x, yb, d, prof, col, o = {}) {
  const P0 = V.P(x, yb, d), q = P0[2], tilt = clamp((yb - V.y) / Math.max(.5, V.D + d), -.6, .6);   // how much of the rim's ellipse we see
  const top = prof[prof.length - 1], ell = Math.abs(tilt) * .9 + .04;
  ctx.fillStyle = col; ctx.beginPath();
  prof.forEach(([r, h], i) => { const sx = P0[0] - r * q, sy = P0[1] - h * q; i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); });
  ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q, top[0] * q * ell, 0, Math.PI, 0, true);
  for (let i = prof.length - 1; i >= 0; i--) { const [r, h] = prof[i]; ctx.lineTo(P0[0] + r * q, P0[1] - h * q); }
  ctx.ellipse(P0[0], P0[1], prof[0][0] * q, prof[0][0] * q * ell, 0, 0, Math.PI, false);
  ctx.closePath(); ctx.fill();
  // the opening (inside, darker) when seen from above
  if (tilt > .02 && o.open !== false) { ctx.fillStyle = o.inside || shadeHex(col, -.4); ctx.beginPath(); ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q * .92, top[0] * q * ell * .92, 0, 0, TAU); ctx.fill(); }
  if (o.sheen) { ctx.fillStyle = rgba('#fff1d6', o.sheen); ctx.beginPath(); const mid = prof[Math.floor(prof.length / 2)]; ctx.ellipse(P0[0] - mid[0] * q * .45, P0[1] - mid[1] * q, mid[0] * q * .12, (top[1] - prof[0][1]) * q * .3, 0, 0, TAU); ctx.fill(); }
}

// ---------------------------------------------------------------- the lamp of each room
export function lampOf(R) {
  const w = R.x1 - R.x0, r = hash(R.seed * .37);
  const xs = { potter: .52, dancer: .62, violin: .45, joiner: .5, office: .5, painter: .4 }[R.kind] ?? (.3 + .4 * r);
  return { x: R.x0 + w * xs, y: R.y0 + (R.kind === 'office' ? .35 : 2.2), d: R.kind === 'office' ? 8 : 6.5, cool: R.kind === 'office' };
}
export function lamp(ctx, t, V, R, L, office) {
  const P = V.P(L.x, L.y, L.d), q = P[2], top = V.P(L.x, R.y0, L.d);
  if (office) {   // a cold tube light flush with the ceiling
    const a = V.P(L.x - 4, L.y, L.d - .6), b = V.P(L.x + 4, L.y, L.d + .6);
    ctx.fillStyle = '#eef6ff'; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.lineTo(a[0], b[1]); ctx.closePath(); ctx.fill();
    putGlow(ctx, P[0], P[1], q * 6, .22, '#cfe6ff'); return;
  }
  ctx.strokeStyle = 'rgba(20,12,10,.85)'; ctx.lineWidth = Math.max(.6, q * .06); ctx.beginPath(); ctx.moveTo(top[0], top[1]); ctx.lineTo(P[0], P[1] - q * .5); ctx.stroke();
  const fl = .92 + .08 * Math.sin(t * 2.1 + R.seed);
  putGlow(ctx, P[0], P[1] + q * .3, q * 9 * fl, .28, '#ffb35c');
  // a conical enamel shade, lit inside
  ctx.fillStyle = '#2f3a36'; ctx.beginPath(); ctx.moveTo(P[0] - q * .35, P[1] - q * .55); ctx.lineTo(P[0] + q * .35, P[1] - q * .55); ctx.lineTo(P[0] + q * 1.05, P[1] + q * .25); ctx.lineTo(P[0] - q * 1.05, P[1] + q * .25); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#fff1d6'; ctx.beginPath(); ctx.ellipse(P[0], P[1] + q * .25, q * 1.0, q * .16, 0, 0, TAU); ctx.fill();
  putGlow(ctx, P[0], P[1] + q * .3, q * 2.2, .7 * fl, '#fff1d6');
}

// ---------------------------------------------------------------- props behind the people (per kind)
export function props(ctx, t, V, S, R, st, layer) {
  const f = PROPS[R.kind]; if (f) f(ctx, t, V, S, R, st);
}
export function people(ctx, t, V, S, R, st, L) {
  const f = ACTS[R.kind]; if (f) f(ctx, t, V, S, R, st, L);
}
const lightOf = (V, L) => { const P = V.P(L.x, L.y + .4, L.d); return { x: P[0], y: P[1], col: '#ffcf8a', a: .6 }; };

// shelves with pots against the back wall
function shelves(ctx, V, x0, x1, y0, n, d, r, cols) {
  for (let k = 0; k < n; k++) {
    const y = y0 + k * 2.6; box(ctx, V, x0, y, d - .9, x1, y + .25, d, '#5a4030');
    let x = x0 + .4; while (x < x1 - .8) { const w = .45 + r() * .6, h = .6 + r() * 1.2, c = cols[Math.floor(r() * cols.length)]; pot(ctx, V, x + w, y, d - .45, [[w * .55, 0], [w * .95, h * .4], [w * .7, h * .85], [w * .6, h]], c, { open: false }); x += w * 2 + .25 + r() * .3; }
  }
}
const PROPS = {
  potter(ctx, t, V, S, R) {
    const r = prng(R.seed + 5);
    shelves(ctx, V, R.x0 + 1.2, R.x0 + 13, R.y0 + 2.6, 3, R.d1 - .1, r, ['#c4a07a', '#8a5a3a', '#4f6a7a', '#b7c25a', '#e8dcc0', '#a4583a']);
    // the kiln at the back right: brick, a glowing spy hole
    const kx0 = R.x1 - 9, ky = R.y1;
    box(ctx, V, kx0, ky - 6.2, R.d1 - 5, kx0 + 6, ky, R.d1 - .2, '#7a4a38', { line: 'rgba(40,20,14,.5)' });
    ctx.strokeStyle = 'rgba(40,20,14,.45)'; ctx.lineWidth = Math.max(.5, V.P(kx0, ky, R.d1 - 5)[2] * .04); ctx.beginPath(); for (let y = ky - 5.6; y < ky; y += .6) seg3(ctx, V, [kx0, y, R.d1 - 5], [kx0 + 6, y, R.d1 - 5]); ctx.stroke();
    const sp = V.P(kx0 + 3, ky - 3.6, R.d1 - 5.02); putGlow(ctx, sp[0], sp[1], sp[2] * 1.4, .7, '#ff8a3a'); ctx.fillStyle = '#ffcf6a'; ctx.beginPath(); ctx.arc(sp[0], sp[1], sp[2] * .3, 0, TAU); ctx.fill();
    // a work table with clay blocks (right, mid depth)
    const tx0 = R.x1 - 12.5, ty = R.y1 - 3.9;
    box(ctx, V, tx0, ty, 9.5, tx0 + 7.5, ty + .5, 12.5, '#8a6a4a');
    for (const [x, d] of [[tx0 + .6, 10], [tx0 + 7, 10], [tx0 + .6, 12.3], [tx0 + 7, 12.3]]) box(ctx, V, x, ty + .5, d - .3, x + .3, R.y1, d, '#4a3424');
    for (let k = 0; k < 3; k++) box(ctx, V, tx0 + 1.2 + k * 2, ty - 1, 10.4 + (k % 2) * .6, tx0 + 2.6 + k * 2, ty, 11.6 + (k % 2) * .6, '#9a5a3e');
  },
  dancer(ctx, t, V, S, R) {
    // a mirror wall at the back (it reflects the lamp: a warm bright field), a barre in front of it
    const mx0 = R.x0 + 4, mx1 = R.x1 - 4;
    ctx.fillStyle = '#e9d9b8'; quad(ctx, V, [[mx0, R.y0 + 1.6, R.d1 - .05], [mx1, R.y0 + 1.6, R.d1 - .05], [mx1, R.y1 - .6, R.d1 - .05], [mx0, R.y1 - .6, R.d1 - .05]]); ctx.fill();
    const g0 = V.P((mx0 + mx1) / 2, R.y1 - 5, R.d1); putGlow(ctx, g0[0], g0[1], g0[2] * 14, .25, '#fff1d6');
    ctx.strokeStyle = 'rgba(60,40,30,.5)'; ctx.lineWidth = Math.max(.6, g0[2] * .05); ctx.beginPath(); for (let x = mx0 + 6; x < mx1; x += 6) seg3(ctx, V, [x, R.y0 + 1.6, R.d1 - .06], [x, R.y1 - .6, R.d1 - .06]); ctx.stroke();
    ctx.strokeStyle = '#6a4a30'; ctx.lineWidth = Math.max(1, g0[2] * .2); ctx.beginPath(); seg3(ctx, V, [mx0, R.y1 - 4.4, R.d1 - 1], [mx1, R.y1 - 4.4, R.d1 - 1]); ctx.stroke();
  },
  violin(ctx, t, V, S, R) {
    const r = prng(R.seed + 9);
    // a window at the back (the night), a bookcase of scores, a music stand
    win(ctx, t, V, R, R.x0 + 6, R.x0 + 12, R.y0 + 2.5, R.y1 - 5);
    for (let k = 0; k < 3; k++) { const y = R.y0 + 3 + k * 2.4; box(ctx, V, R.x1 - 12, y, R.d1 - 1.2, R.x1 - 3, y + .25, R.d1 - .1, '#5a4030'); let x = R.x1 - 11.8; while (x < R.x1 - 3.4) { const w = .25 + r() * .3; box(ctx, V, x, y - 1.6 - r() * .4, R.d1 - 1.1, x + w, y, R.d1 - .3, ['#7a2a2a', '#2a3a5a', '#d8c8a8', '#3a5a3a', '#8a6a3a'][Math.floor(r() * 5)]); x += w + .05; } }
  },
  joiner(ctx, t, V, S, R) {
    const r = prng(R.seed + 3);
    // tools on a board on the back wall, planks leaning, a long bench (drawn with the people: they stand behind it)
    box(ctx, V, R.x0 + 3, R.y0 + 3, R.d1 - .3, R.x0 + 17, R.y0 + 7.5, R.d1 - .1, '#8a6a48');
    ctx.strokeStyle = '#2a1a10'; ctx.lineWidth = Math.max(.8, V.P(R.x0, R.y0, R.d1)[2] * .12); ctx.beginPath();
    for (let k = 0; k < 9; k++) { const x = R.x0 + 4 + k * 1.5, y = R.y0 + 3.6; seg3(ctx, V, [x, y, R.d1 - .35], [x + (k % 3 === 0 ? .4 : 0), y + 2.2 + (k % 2) * 1.1, R.d1 - .35]); }
    ctx.stroke();
    for (let k = 0; k < 5; k++) { const x = R.x1 - 4 - k * .7; box(ctx, V, x, R.y0 + 2.2 + k * .2, R.d1 - 1 - k * .3, x + .4, R.y1, R.d1 - .6 - k * .3, ['#c49a6a', '#b08a5c', '#d0a878'][k % 3]); }
  },
  painter(ctx, t, V, S, R) {
    const r = prng(R.seed + 1);
    for (let k = 0; k < 6; k++) { const x = R.x0 + 3 + k * 4.2 + r(), w = 2.4 + r() * 1.6, h = 2 + r() * 2.2, y = R.y0 + 3 + r() * 2; box(ctx, V, x, y, R.d1 - .2, x + w, y + h, R.d1 - .1, ['#c4512e', '#4f6a7a', '#e9c46a', '#3a5a3a', '#b7c25a', '#8a5a9a'][k]); }
    win(ctx, t, V, R, R.x1 - 14, R.x1 - 7, R.y0 + 2.4, R.y1 - 4.6);
  },
  office(ctx, t, V, S, R, st) { ACT_OFFICE.props(ctx, t, V, S, R, st); },
};
// a window in the back wall: the night outside (deep blue, a few lights of the level above), mullions
function win(ctx, t, V, R, x0, x1, y0, y1) {
  const d = R.d1 - .02; ctx.fillStyle = '#141a3a'; quad(ctx, V, [[x0, y0, d], [x1, y0, d], [x1, y1, d], [x0, y1, d]]); ctx.fill();
  for (let k = 0; k < 4; k++) { const P = V.P(x0 + (x1 - x0) * (.2 + .2 * k), y0 + (y1 - y0) * (.3 + .1 * (k % 2)), d); ctx.fillStyle = '#ffcf8a'; ctx.fillRect(P[0], P[1], Math.max(1, P[2] * .25), Math.max(1, P[2] * .3)); }
  ctx.strokeStyle = '#3a2a20'; ctx.lineWidth = Math.max(.8, V.P(x0, y0, d)[2] * .2); quad(ctx, V, [[x0, y0, d], [x1, y0, d], [x1, y1, d], [x0, y1, d]]); ctx.stroke();
  ctx.beginPath(); seg3(ctx, V, [(x0 + x1) / 2, y0, d], [(x0 + x1) / 2, y1, d]); seg3(ctx, V, [x0, (y0 + y1) * .45 + y1 * .1, d], [x1, (y0 + y1) * .45 + y1 * .1, d]); ctx.stroke();
}

// ---------------------------------------------------------------- the people of the rooms
const ACTS = {
  potter(ctx, t, V, S, R, st, L) { POTTER(ctx, t, V, S, R, st, L); },
  dancer(ctx, t, V, S, R, st, L) {
    const d = 8.5, x = R.x0 + (R.x1 - R.x0) * .48, P = V.P(x, R.y1, d);
    dancer(ctx, t, P[0], P[1], P[2] / MPU, { t0: st.busy?.dancer ?? 0, light: lightOf(V, L) });
  },
  violin: (ctx, t, V, S, R, st, L) => VIOLIN(ctx, t, V, S, R, st, L),
  joiner: (ctx, t, V, S, R, st, L) => JOINER(ctx, t, V, S, R, st, L),
  painter: (ctx, t, V, S, R, st, L) => PAINTER(ctx, t, V, S, R, st, L),
  office: (ctx, t, V, S, R, st, L) => ACT_OFFICE.people(ctx, t, V, S, R, st, L),
};

// ---------------------------------------------------------------- the potter ★
// the bowl's profile at u (0 a centred lump … 1 the finished bowl), in metres: [[r, h], …] from the foot up
function bowlProfile(u) {
  const a = sm(clamp(u / .18)), b = sm(clamp((u - .18) / .2)), c = qio(clamp((u - .38) / .62));
  const H0 = mix(.12, .1, b), Hh = mix(H0, .2, c), rb = mix(.15, .13, b), rr = mix(.1, .17, c) + mix(0, .02, b) * (1 - c);
  if (b <= 0) {   // the lump: a dome
    const pts = []; for (let i = 0; i <= 8; i++) { const q = i / 8; pts.push([rb * Math.cos(q * 1.35) * (1 - .1 * q), H0 * Math.sin(q * 1.35) * 1.02]); } return pts;
  }
  return [[rb, 0], [mix(rb, rb * 1.02, c), Hh * .25], [mix(rb * .98, mix(rb, rr, .55), c), Hh * .55], [mix(rr * .95, rr * .9, c), Hh * .85], [rr, Hh]];
}
function POTTER(ctx, t, V, S, R, st, L) {
  const t0 = st.busy?.potter ?? -1e9, u = clamp((t - t0) / 2.6), done = clamp((t - t0 - 2.75) / .5);
  const fl = R.y1, wx = R.x0 + (R.x1 - R.x0) * .55, wd = 6.5;                    // the wheel
  const hw = U(.46), pr = U(.3), ph = U(.5), wr = U(.16);
  const sx = wx - U(.66), sd = wd + U(.05);                                    // the stool, left of the wheel; she faces right
  const s = figS(V, sd), hipP = V.P(sx, fl - U(.485), sd), lt = lightOf(V, L);
  const dress = { coat: '#8a4e3a', pants: '#34303e', shoes: '#2a1e1a', skin: '#c99a76', hair: '#3a2a24', shirt: '#d8c8a8' };
  const pose = { hip: [1.32, 1.42], kn: [1.36, 1.42], lean: .4, head: .34, sh: [1.0, 1.0], el: [.6, .6], hair: 'bun', bulk: .95, hands: ['open', 'open'] };
  // the clay at u: the hands sit on the wall at its rim; once the bowl is done they come away and rest on her knees
  const prof = bowlProfile(u), top = prof[prof.length - 1], rimY = fl - hw - U(top[1]), rimR = U(top[0]);
  const q = V.P(wx, fl - hw, wd)[2];
  const outT = V.P(wx - rimR - U(.03), rimY + U(.035), wd - U(.02)), inT = V.P(wx - rimR + U(.055), rimY + U(.04), wd + U(.04));
  const rest = V.P(sx + U(.36), fl - U(.53), sd);
  const hf = sm(done), tgt0 = [mix(outT[0], rest[0] + q * U(.05), hf), mix(outT[1], rest[1], hf)], tgt1 = [mix(inT[0], rest[0] - q * U(.03), hf), mix(inT[1], rest[1] + q * U(.02), hf)];
  const oo = { t, seed: 41, flip: false, dress, rim: '#ffcf8a', rimW: Math.max(1, 1.2 * s), light: lt, smile: .3 + .4 * hf, shadow: false };
  const a0 = reachArm(hipP[0], hipP[1], s, pose, 0, false, oo, tgt0, -1), a1 = reachArm(hipP[0], hipP[1], s, pose, 1, false, oo, tgt1, -1);
  pose.sh = [a0.sh, a1.sh]; pose.el = [a0.el, a1.el]; pose.head = .34 - .12 * hf;
  // the stool (behind her legs)
  box(ctx, V, sx - U(.16), fl - U(.44), sd - U(.16), sx + U(.16), fl - U(.41), sd + U(.16), '#6a4a30');
  for (const dx of [-.12, .12]) box(ctx, V, sx + U(dx) - U(.02), fl - U(.41), sd - U(.02), sx + U(dx) + U(.02), fl, sd + U(.02), '#4a3020');
  // the body (back arm included), then the wheel and the clay, then the front arm over it
  person(ctx, hipP[0], hipP[1], s, pose, { ...oo, part: 'body' });
  wheel(ctx, t, V, wx, fl, wd, hw, pr, ph, wr, prof, u);
  person(ctx, hipP[0], hipP[1], s, pose, { ...oo, part: 'front', rim: null });
}
function wheel(ctx, t, V, x, fl, d, hw, pr, ph, wr, prof, u) {
  // a low motor housing, the splash pan (a shallow tub at knee height) round the turning wheel head, the clay, the pan's front rim
  const P = V.P(x, fl - ph, d), q = P[2], e = clamp((fl - ph - V.y) / Math.max(.5, V.D + d), .06, .6) * .95, pb = U(.09);
  box(ctx, V, x - U(.17), fl - ph + pb, d - U(.15), x + U(.17), fl, d + U(.15), '#3a403e');
  box(ctx, V, x + U(.22), fl - U(.06), d - U(.08), x + U(.38), fl, d + U(.06), '#2c302e');   // the pedal
  // the pan's body (a band) and its far inside
  ctx.fillStyle = '#4a524e'; ctx.beginPath(); ctx.ellipse(P[0], P[1], pr * q, pr * q * e, 0, 0, Math.PI); ctx.lineTo(P[0] - pr * q, P[1] + pb * q); ctx.ellipse(P[0], P[1] + pb * q, pr * q, pr * q * e, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#262a28'; ctx.beginPath(); ctx.ellipse(P[0], P[1], pr * q * .96, pr * q * e * .96, 0, 0, TAU); ctx.fill();
  const Hd = V.P(x, fl - hw, d), rot = t * 7.5;
  ctx.fillStyle = '#8a8e8c'; ctx.beginPath(); ctx.ellipse(Hd[0], Hd[1], wr * q, wr * q * e, 0, 0, TAU); ctx.fill();
  ctx.fillStyle = '#5e6260'; ctx.beginPath(); ctx.ellipse(Hd[0], Hd[1], wr * q, wr * q * e, 0, 0, Math.PI); ctx.lineTo(Hd[0] - wr * q, Hd[1] + U(.02) * q); ctx.ellipse(Hd[0], Hd[1] + U(.02) * q, wr * q, wr * q * e, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
  // marks on the wheel head turning (they show the rotation under the clay), a slip of wet clay on it
  ctx.strokeStyle = 'rgba(30,30,36,.85)'; ctx.lineWidth = Math.max(.8, q * .05); ctx.beginPath();
  for (let k = 0; k < 8; k++) { const a = rot + k * TAU / 8, ca = Math.cos(a), sa = Math.sin(a); ctx.moveTo(Hd[0] + ca * wr * q * .78, Hd[1] + sa * wr * q * e * .78); ctx.lineTo(Hd[0] + ca * wr * q * .97, Hd[1] + sa * wr * q * e * .97); }
  ctx.stroke();
  potClay(ctx, t, V, x, fl - hw, d, prof.map(([r, h]) => [U(r), U(h)]), e, rot);
  // the front half of the pan's rim, with a wet sheen
  ctx.strokeStyle = '#6a726e'; ctx.lineWidth = Math.max(1, q * .05); ctx.beginPath(); ctx.ellipse(P[0], P[1], pr * q, pr * q * e, 0, 0, Math.PI); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,230,200,.3)'; ctx.lineWidth = Math.max(.6, q * .02); ctx.beginPath(); ctx.ellipse(P[0], P[1] - q * .01, pr * q, pr * q * e, 0, .5, 1.6); ctx.stroke();
}
function potClay(ctx, t, V, x, yb, d, pts, e, rot) {
  const P0 = V.P(x, yb, d), q = P0[2], top = pts[pts.length - 1], hollow = pts.length === 5, n = pts.length;
  const outline = () => {
    ctx.beginPath();
    pts.forEach(([r, h], i) => { const sx = P0[0] - r * q, sy = P0[1] - h * q; i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); });
    if (hollow) ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q, top[0] * q * e, 0, Math.PI, 0, true);
    for (let i = n - 1; i >= 0; i--) { const [r, h] = pts[i]; ctx.lineTo(P0[0] + r * q, P0[1] - h * q); }
    ctx.ellipse(P0[0], P0[1], pts[0][0] * q, pts[0][0] * q * e, 0, 0, Math.PI, false); ctx.closePath();
  };
  // body: wet terracotta, lit from the lamp (front-left), the far side in shade
  const g = ctx.createLinearGradient(P0[0] - top[0] * q * 1.3, 0, P0[0] + top[0] * q * 1.3, 0);
  g.addColorStop(0, '#c87a52'); g.addColorStop(.38, '#a95c3c'); g.addColorStop(1, '#5e2c1c');
  outline(); ctx.fillStyle = g; ctx.fill();
  if (hollow) {   // the inside: the far wall lit, the floor of the bowl dark; the rim catches the light
    ctx.fillStyle = '#5a2a1a'; ctx.beginPath(); ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q * .9, top[0] * q * e * .9, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#b8704a'; ctx.beginPath(); ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q * .9, top[0] * q * e * .9, 0, Math.PI, TAU); ctx.ellipse(P0[0], P0[1] - top[1] * q + top[0] * q * e * .25, top[0] * q * .7, top[0] * q * e * .55, 0, TAU, Math.PI, true); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(255,214,170,.75)'; ctx.lineWidth = Math.max(.8, q * .035); ctx.beginPath(); ctx.ellipse(P0[0], P0[1] - top[1] * q, top[0] * q * .95, top[0] * q * e * .95, 0, .25, Math.PI - .25); ctx.stroke();
  }
  // a few soft throwing lines, and wet glints that travel round with the wheel
  const nl = Math.max(2, Math.min(5, Math.round(top[1] / U(.04))));
  for (let k = 1; k < nl; k++) {
    const h = top[1] * k / nl; let r = pts[0][0]; for (let i = 1; i < n; i++) if (pts[i][1] >= h) { const a = pts[i - 1], b = pts[i], f = (h - a[1]) / Math.max(1e-6, b[1] - a[1]); r = mix(a[0], b[0], f); break; }
    ctx.strokeStyle = 'rgba(70,24,10,.28)'; ctx.lineWidth = Math.max(.6, q * .018); ctx.beginPath(); ctx.ellipse(P0[0], P0[1] - h * q, r * q, r * q * e, 0, .2, Math.PI - .2); ctx.stroke();
    for (let m = 0; m < 2; m++) { const a = (rot + m * 3.1 + k * 1.3) % TAU; if (Math.sin(a) < .25) continue; ctx.fillStyle = 'rgba(255,226,196,.5)'; ctx.beginPath(); ctx.ellipse(P0[0] + Math.cos(a) * r * q, P0[1] - h * q + Math.sin(a) * r * q * e, q * .045, q * .012, 0, 0, TAU); ctx.fill(); }
  }
  // the wet sheen: a vertical highlight on the lit side
  ctx.save(); outline(); ctx.clip(); ctx.fillStyle = 'rgba(255,220,190,.22)'; ctx.fillRect(P0[0] - top[0] * q * .62, P0[1] - top[1] * q - q, top[0] * q * .16, top[1] * q + q); ctx.restore();
}

// ---------------------------------------------------------------- placeholders filled in below (violin, joiner, painter, office)
function VIOLIN(ctx, t, V, S, R, st, L) {}
function JOINER(ctx, t, V, S, R, st, L) {}
function PAINTER(ctx, t, V, S, R, st, L) {}
const ACT_OFFICE = { props() {}, people() {} };
export function officeClip() {}
export function officeSmoke() {}
export function passage(ctx, t, V, S, st) {}
