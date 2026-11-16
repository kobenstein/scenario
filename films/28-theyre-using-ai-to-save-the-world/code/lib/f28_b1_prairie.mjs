// Film 28 · B1 · THE PRAIRIE (No. 10, Wyoming): the end of the night over a wind farm. Shared by c03 (the slow wave becomes its horizon)
// and c04 (the eagle, the camera tower, the turbine that slows). Prairie-world design px; cam3() = the home view, horizon at y HOR.
//   st: { dawn 0..1, spin(k) → blade speed factor 0..1 for turbine k, slow (k index that slows), tower 0..1 (the camera tower visible),
//         eye { ang, a, cone } (the camera on the tower and its view cone), eagle { x, y, Z, s, flap, dir, bank, glow, a } (world-ish),
//         extra(ctx) on the turbine card }
import * as E from './f10_editorial.mjs';
import * as F from './f28_kit.mjs';
import * as B from './f28_b1_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, halo, lin, prng } = E;
const TAU = Math.PI * 2;

export const HOR = 600;
export const Z_FAR = 9000, Z_TURB = 4000, Z_TOWER = 2400, Z_GRASS = 1250;
const horAt = (Z) => H / 2 + (HOR - H / 2) * Z_FAR / Z;           // design y of the (flat) horizon line on card Z
export const TURB = [[-760, 230], [-330, 300], [120, 270], [560, 340], [1000, 285], [1420, 320], [1860, 260], [2300, 300]].map(([x, h], k) => ({ x, y: horAt(Z_TURB) + 4, h, k }));
export const TOWER = { x: 1560, y: horAt(Z_TOWER) + 6, h: 330 };
export const towerEye = () => [TOWER.x, TOWER.y - TOWER.h - 18];
// the blades' angle of turbine k at time t (integrated speed: spin(k, t) 0..1, 1 = full speed .9 rad/s)
export function bladeAngle(k, t, spin) {
  if (!spin) return t * .9 + k * 1.7;
  let s = 0; const n = 60, t0 = t - 30; for (let i = 0; i < n; i++) { const tt = t0 + (i + .5) * 30 / n; s += spin(k, tt) * 30 / n; } return s * .9 + k * 1.7;
}
const GRASS = (() => { const r = prng(1010), g = []; for (let i = 0; i < 260; i++) g.push([-1400 + r() * 4600, r(), r() * 6.3, .5 + r()]); return g; })();

export function prairie(ctx, c, t, st = {}) {
  const dawn = clamp(st.dawn ?? .5);
  // sky: night above, a thin cold-gold band of the coming day on the horizon (left), stars fading
  E.card(ctx, c, 40000, () => {
    B.fillView(ctx, lin(ctx, 0, -2000, 0, H / 2 + (HOR - H / 2) * 9000 / 40000 + 40, [[0, P.night0], [.55, P.night1], [.85, mixHex(P.ind0, P.blue0, .5)], [1, mixHex(P.blue0, P.halo1, .28 * dawn)]]));
    E.stars(ctx, 41, 500, t, [-4000, -3000, 12000, 3400], .9 - .5 * dawn);
  });
  E.card(ctx, c, Z_FAR, () => {
    halo(ctx, 200, HOR, 1500, .22 * dawn, mixHex(P.blue0, P.halo1, .5), mixHex(P.halo1, P.core1, .5));
    F.hills(ctx, [[-3000, HOR + 4], [-1200, HOR - 18], [-200, HOR - 6], [700, HOR - 24], [1700, HOR - 8], [2800, HOR - 20], [4600, HOR]], { top: mixHex(P.night1, P.ind1, .55), bottom: P.night0, rimA: .3 + .25 * dawn, rim: mixHex(P.blue0, P.halo1, .35 * dawn), depth: 200 });
  });
  // the plain
  E.card(ctx, c, 6000, () => { const y = horAt(6000); ctx.fillStyle = lin(ctx, 0, y - 10, 0, y + 900, [[0, mixHex(P.night1, P.ind0, .6)], [1, P.night0]]); ctx.fillRect(-6000, y - 8, 16000, 3000); });
  // the turbines
  E.card(ctx, c, Z_TURB, () => {
    for (const T of TURB) {
      const ang = bladeAngle(T.k, t, st.spin), slow = st.slowGlow && T.k === st.slow ? st.slowGlow : 0;
      if (slow > 0) halo(ctx, T.x, T.y - T.h, T.h * .7, .25 * slow, F.COOL.halo, F.COOL.body);
      B.turbine(ctx, T.x, T.y, T.h, ang, { col: mixHex(mixHex(P.night1, P.ind1, .65), P.blue1, .25 * dawn) });
    }
    if (st.extraFar) st.extraFar(ctx);
  });
  // the camera tower (IdentiFlight): a lattice mast with the camera on top
  E.card(ctx, c, Z_TOWER, () => {
    const y0 = horAt(Z_TOWER);
    ctx.fillStyle = lin(ctx, 0, y0, 0, y0 + 600, [[0, mixHex(P.night1, P.ind0, .4)], [1, P.night0]]); ctx.fillRect(-5000, y0 + 2, 14000, 3000);
    const ta = clamp(st.tower ?? 1);
    if (ta > 0) {
      const { x, y, h } = TOWER; ctx.save(); ctx.globalAlpha *= ta;
      ctx.strokeStyle = mixHex(P.night1, P.blue1, .5); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 22, y); ctx.lineTo(x - 5, y - h); ctx.moveTo(x + 22, y); ctx.lineTo(x + 5, y - h); ctx.stroke();
      for (let k = 1; k < 9; k++) { const yy = lerp(y, y - h, k / 9), hw = lerp(22, 5, k / 9), yn = lerp(y, y - h, (k + 1) / 9), hn = lerp(22, 5, (k + 1) / 9); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x - hw, yy); ctx.lineTo(x + hn, yn); ctx.moveTo(x + hw, yy); ctx.lineTo(x - hn, yn); ctx.stroke(); }
      const eye = st.eye || {}, [ex, ey] = towerEye();
      if ((eye.cone ?? 0) > 0) { // the view cone up into the sky (cool, the machine's look)
        const ang = eye.ang ?? -2.2, L = 1500, wdt = .2;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = E.rad(ctx, ex, ey, L, [[0, rgba(F.COOL.halo, .22 * eye.cone)], [1, rgba(F.COOL.halo, 0)]]);
        ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex + Math.cos(ang - wdt) * L, ey + Math.sin(ang - wdt) * L); ctx.lineTo(ex + Math.cos(ang + wdt) * L, ey + Math.sin(ang + wdt) * L); ctx.closePath(); ctx.fill(); ctx.restore();
      }
      ctx.save(); ctx.translate(ex, ey + 22); F.tool(ctx, 'camera', 0, 0, 64, { col: 'cream', glow: .5 + .5 * (eye.a ?? 0) }); ctx.restore();
      if ((eye.a ?? 0) > 0) F.agent(ctx, t, ex, ey + 14, 6 * eye.a, { a: eye.a, ring: .6 });
      ctx.restore();
    }
    if (st.extraTower) st.extraTower(ctx);
  });
  // grass in front (dark blades, slow sway)
  E.card(ctx, c, Z_GRASS, () => {
    const y0 = 1010;
    ctx.fillStyle = P.night0; ctx.fillRect(-3000, y0, 9000, 2000);
    for (const [x, v, ph, f] of GRASS) { const h = 60 + v * 110, b = 14 * Math.sin(t * f * .8 + ph); ctx.fillStyle = mixHex(P.night0, P.ind1, .2 + .25 * v); ctx.beginPath(); ctx.moveTo(x - 6, y0 + 4); ctx.quadraticCurveTo(x + b * .3, y0 - h * .5, x + b, y0 - h); ctx.quadraticCurveTo(x + b * .3 + 3, y0 - h * .5, x + 6, y0 + 4); ctx.fill(); }
  });
}
