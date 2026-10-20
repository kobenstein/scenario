// c11 (Film 4 v2) · a dancer practising a slow turn (11.06): a real turn about the standing foot (a small 3D skeleton projected
// orthographically), on relevé with the other leg in retiré, the arms rising from in front (first position) to up (fifth).
// Drawn as a silhouette against the lit mirror wall, with a warm rim on the lamp side.
//   dancer(ctx, t, x, y, k, o)  x, y = the floor point under the standing foot (screen); k = px per metre
//     o: { t0 (the arms rise from t0 to t0 + 1.1), turn0 (start angle), rate (rad/s), col, rim, light: {x, y} }
import { rgba, clamp, mix, sm, TAU, qio } from './v2_c11_kit.mjs';

export function dancer(ctx, t, x, y, k, o = {}) {
  const th = (o.turn0 ?? -.6) + (o.rate ?? .82) * (t - (o.t0 ?? 0)) + .04 * Math.sin(t * 1.3);
  const ua = qio(clamp((t - (o.t0 ?? 0) - .6) / 1.2)), br = Math.sin(t * 1.9) * .006;
  const cs = Math.cos(th), sn = Math.sin(th);
  const pr = ([px, py, pz]) => [x + (px * cs + pz * sn) * k, y - py * k, -px * sn + pz * cs];
  const A = (a, b, u) => [mix(a[0], b[0], u), mix(a[1], b[1], u), mix(a[2], b[2], u)];
  // skeleton (metres; the dancer faces +z at th = 0; standing on her right leg (x +), the left in retiré)
  const pel = [0, .95 + br, 0], chest = [0, 1.31 + br, .01], neck = [0, 1.45 + br, 0], head = [0, 1.57 + br, .01];
  const shR = [.185, 1.405 + br, 0], shL = [-.185, 1.405 + br, 0], hpR = [.085, .93, 0], hpL = [-.085, .93, 0];
  const anR = [.03, .11, .01], knR = [.05, .52, .02], toeR = [.03, .0, .07];
  const knL = [-.36, .77, .14], anL = [-.03, .54, .05], toeL = [.01, .43, .08];
  // arms: first position (rounded in front at the navel) → fifth (rounded above the head)
  const elR = A([.31, 1.12, .2], [.31, 1.69, .06], ua), wrR = A([.09, 1.0, .32], [.09, 1.88, .07], ua), fiR = A([.0, .99, .34], [.0, 1.93, .07], ua);
  const elL = [-elR[0], elR[1], elR[2]], wrL = [-wrR[0], wrR[1], wrR[2]], fiL = [-fiR[0], fiR[1], fiR[2]];
  const col = o.col || '#1d1526', rim = o.rim || '#ffcf8a';
  const lx = o.light ? Math.sign(o.light.x - x) || 1 : 1, rw = Math.max(1, k * .012);
  ctx.fillStyle = 'rgba(20,10,20,.35)'; ctx.beginPath(); ctx.ellipse(x, y, .3 * k, .05 * k, 0, 0, TAU); ctx.fill();   // a shadow pool
  for (const pass of [0, 1]) {
    const dx = pass ? 0 : lx * rw, dy = pass ? 0 : -rw * .5, c = pass ? col : rim;
    ctx.save(); ctx.translate(dx, dy); ctx.fillStyle = c;
    const cap = (a, b, ra, rb) => {
      const P = pr(a), Q = pr(b), vx = Q[0] - P[0], vy = Q[1] - P[1], L = Math.hypot(vx, vy) || 1e-6, nx = -vy / L, ny = vx / L;
      ctx.beginPath(); ctx.moveTo(P[0] + nx * ra * k, P[1] + ny * ra * k); ctx.lineTo(Q[0] + nx * rb * k, Q[1] + ny * rb * k); ctx.lineTo(Q[0] - nx * rb * k, Q[1] - ny * rb * k); ctx.lineTo(P[0] - nx * ra * k, P[1] - ny * ra * k); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(P[0], P[1], ra * k, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(Q[0], Q[1], rb * k, 0, TAU); ctx.fill();
    };
    // legs (standing on relevé; the working leg in retiré), feet pointed
    cap(hpR, knR, .068, .046); cap(knR, anR, .046, .028); cap(anR, toeR, .026, .012);
    cap(hpL, knL, .066, .046); cap(knL, anL, .046, .028); cap(anL, toeL, .024, .011);
    // torso (a polygon through shoulders, waist, hips), neck, head + bun
    const Ps = [pr(shL), pr(shR), pr([.13, 1.12, 0]), pr([.15, .93, 0]), pr([-.15, .93, 0]), pr([-.13, 1.12, 0])];
    ctx.beginPath(); Ps.forEach(([sx, sy], i) => (i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy))); ctx.closePath(); ctx.fill();
    cap(chest, neck, .075, .045); cap(neck, head, .045, .04);
    const Hh = pr(head); ctx.beginPath(); ctx.ellipse(Hh[0], Hh[1], .092 * k, .118 * k, 0, 0, TAU); ctx.fill();
    const bun = pr([0, 1.62, -.11]); ctx.beginPath(); ctx.arc(bun[0], bun[1], .05 * k, 0, TAU); ctx.fill();
    // the practice skirt: a short flared cone round the hips (it swings a little with the turn)
    const sk = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU, fl = .3 + .02 * Math.sin(a * 3 + t * 2); sk.push(pr([Math.cos(a) * fl, .72 + .03 * Math.sin(a * 2 + t * 1.6), Math.sin(a) * fl])); }
    const wa = []; for (let i = 0; i <= 16; i++) { const a = i / 16 * TAU; wa.push(pr([Math.cos(a) * .14, 1.0, Math.sin(a) * .12])); }
    // outline of the cone as seen: the hull of waist ring + hem ring (both projected): draw as a fan of quads
    for (let i = 0; i < 16; i++) { ctx.beginPath(); ctx.moveTo(wa[i][0], wa[i][1]); ctx.lineTo(wa[i + 1][0], wa[i + 1][1]); ctx.lineTo(sk[i + 1][0], sk[i + 1][1]); ctx.lineTo(sk[i][0], sk[i][1]); ctx.closePath(); ctx.fill(); }
    // arms
    cap(shR, elR, .043, .032); cap(elR, wrR, .03, .022); cap(wrR, fiR, .02, .01);
    cap(shL, elL, .043, .032); cap(elL, wrL, .03, .022); cap(wrL, fiL, .02, .01);
    ctx.restore();
  }
}
