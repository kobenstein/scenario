// C06 (Film 4 v2) · take 1 (owner c06): the hill at night → push into your window → your room (6.02–6.10) → pull back out → the street
// of screens (6.11 ★) → the cold fog rises from the water and fills the frame (6.12).
// ONE camera for the whole take, in your room's cm (y down, looking along +Z; the facade's outer face at Z = FZ). Outside, the hill camera
// is derived from it, so the hill and the room are one optical space:
//   hill cam = { x: wc.x + mc.x / RW, y: wc.y + mc.y / RW, z: RW · F / (FZ − mc.z) }      (RW = cm per hill unit; wc = the window centre)
// While the window does not cover the frame, drawHill draws the town and your room is its st.inside view (clipped to the window by the
// hill); once the opening covers the frame, only the room is drawn (same projection, so nothing jumps).
import { W, H, rgba, clamp, mix, sm } from '../engine.mjs';
import { drawHill, hillWindow, VIEWS, toScreen } from './maslow4.mjs';
import { roomGeo, roomState, drawRoom, drawW1 } from './v2_c06_room.mjs';
import { TAU, mono, mixC, mixH, screenF, s5, SCREEN } from './v2_c06_kit.mjs';
import { TOWER, FAR } from './v2_c06_view.mjs';
import { fogDraw, fogX } from './v2_c06_fog.mjs';

export const RW = 20, FZ = -30;
const qz = (z) => Math.asinh(z / 50), zq = (q) => 50 * Math.sinh(q);

export function makeHillTake(A) {
  const WY = hillWindow(0, 'you'), wc = { x: WY.x + WY.w / 2, y: WY.y + WY.h / 2 }, G = roomGeo(WY.w / 2 * RW, WY.h / 2 * RW), H1 = VIEWS.H1;
  const F0 = 1500, d0 = RW * F0 / H1.cam.z, sx0 = (wc.x - H1.cam.x) * H1.cam.z + W / 2, sy0 = (wc.y - H1.cam.y) * H1.cam.z + H / 2;
  // the street view at the end of the pull-back (6.11) and the sink toward the water (6.12): hill cams → window anchors
  const hc1 = { x: 960, y: 720, z: 1.37 }, hc2 = { x: 960, y: 768, z: 1.56 };
  const anc = (hc) => [(wc.x - hc.x) * hc.z + W / 2, (wc.y - hc.y) * hc.z + H / 2, FZ - RW * F0 / hc.z];
  const [sx1, sy1, z1] = anc(hc1), [sx2, sy2, z2] = anc(hc2);
  const enter = A.changes + 1.77, out = A.dontE + 1.1, end = A.numbE + 1.2;
  // ---- the camera keys (absolute s)
  const KZ = mono([[A.t0, FZ - d0], [A.t0 + 1.4, FZ - d0 * .98], [A.changes - .5, -22000], [A.changes, -15000], [A.changes + .47, -6000], [A.changes + .82, -2000], [A.changes + 1.07, -650], [A.changes + 1.27, -250],
    [A.changes + 1.44, -128], [A.changes + 1.62, -62], [enter, -6], [A.blur - .2, 34], [A.blur + .5, 50], [A.one - .15, 62],
    [A.one + .3, 300], [A.episode - .1, 392], [A.another + .15, 404], [A.scroll - .7, 320], [A.scroll - .05, 214], [A.whyNot - .4, 226],
    [A.glass1 - .25, 430], [A.second + .8, 446], [A.every + .75, 392], [A.you1 - .25, 396], [A.you1 + .7, 172], [A.dont + .5, 206],
    [A.dontE + .7, 60], [out, 4], [out + .25, -60], [out + .7, -420], [A.this + .8, -2600], [A.this + 2.0, -9000], [A.work, -17500], [A.workE + .3, z1], [A.numb, z1 + 400], [end, z2]].map(([t, z]) => [t, qz(z)]));
  const KX = mono([[A.t0, 0], [A.changes + 1.5, 0], [enter + .3, 22], [A.blur + .5, 40], [A.one - .15, 44], [A.one + .3, 96], [A.episode - .1, 110], [A.another + .15, 107],
    [A.scroll - .7, -40], [A.scroll - .05, -188], [A.whyNot - .4, -197], [A.glass1 - .25, -205], [A.second + .8, -206], [A.every + .75, -80], [A.you1 - .25, -74],
    [A.you1 + .7, 150], [A.dont + .5, 144], [A.dontE + .7, 46], [out, 0], [end, 0]]);
  const KY = mono([[A.t0, 0], [A.changes + 1.5, 0], [enter + .3, -6], [A.blur + .5, -10], [A.one - .15, -7], [A.one + .3, 30], [A.episode - .1, 40], [A.another + .15, 38],
    [A.scroll - .7, 16], [A.scroll - .05, 12], [A.whyNot - .4, 9], [A.glass1 - .25, 5], [A.second + .8, 3], [A.every + .75, -15], [A.you1 - .25, -13],
    [A.you1 + .7, -20], [A.dont + .5, -17], [A.dontE + .7, -4], [out, 0], [end, 0]]);
  const KOY = mono([[A.t0, 0], [A.you1 - .25, 0], [A.you1 + .7, -380], [A.dont + .5, -372], [A.dontE + .7, 0], [end, 0]]);
  const KF = mono([[A.t0, F0], [A.four + .45, F0], [A.four + 1.0, 4200], [A.second - .48, 4200], [A.second - .12, F0], [end, F0]]);
  const KSX = mono([[A.t0, sx0], [A.changes - .3, mix(sx0, W / 2, .2)], [A.changes + .8, mix(sx0, W / 2, .75)], [A.changes + 1.4, W / 2], [out, W / 2], [A.this + 1.2, mix(W / 2, sx1, .3)], [A.work, mix(W / 2, sx1, .9)], [A.workE + .3, sx1], [end, sx2]]);
  const KSY = mono([[A.t0, sy0], [A.changes - .3, mix(sy0, H / 2, .2)], [A.changes + .8, mix(sy0, H / 2, .75)], [A.changes + 1.4, H / 2], [out, H / 2], [A.this + 1.2, mix(H / 2, sy1, .3)], [A.work, mix(H / 2, sy1, .9)], [A.workE + .3, sy1], [end, sy2]]);
  const cam = (t) => {
    const z = zq(KZ(t)), d = Math.max(0, FZ - z), F = KF(t);
    let x = KX(t) - (KSX(t) - W / 2) * d / F, y = KY(t) - (KSY(t) - H / 2) * d / F, ox = 0, oy = KOY(t);
    // a breath of hand-held drift inside the room (the global float adds its own)
    if (z > FZ) { x += 1.6 * Math.sin(t * .53) + .8 * Math.sin(t * 1.31); y += 1.1 * Math.sin(t * .71 + 1); }
    // the look up at the town clock: the lens shifts toward the clock face as the focal length grows (6.07)
    const u = clamp((F - F0) / (4200 - F0)); if (u > 0) { const kf = F / (FAR.Z - z); ox = -(TOWER.x - x) * kf * u; oy += -(TOWER.face - y) * kf * u; }
    return { x, y, z, F, ox, oy };
  };
  // ---- the room's clock (anchors for roomState)
  const RA = { t0: A.t0, enter, bed: A.scroll, midnight: A.midnight, whyNot: A.whyNot, four: A.four, second: A.second, evening0: A.every, evening: A.evening, dont: A.dont, toDont: A.to, out1: out, episode: A.episode, another: A.another };
  // curtains: closed (glowing like the window they are) until the push gets close, they part as you arrive, half close as you leave
  const curtain = (t) => s5((t - (A.changes + .6)) / .95) * (1 - .55 * s5((t - (out + .2)) / 1.6));
  // the screens' rhythm: your TV = your window's flicker; it falls into the town's common rhythm on "numb" (6.12)
  const syncU = (t) => s5((t - (A.numb - .3)) / 1.1);
  const flickNow = (t) => screenF(t, WY.k, WY.ph, syncU(t));
  const screens = (t) => s5((t - A.changes) / 1.2);
  // your window as the hill paints it (namedGlow: amber lamp → the screen's cold gradient as it turns), so the closed curtains glow the same
  const tvYou = (t) => sm(clamp((screens(t) * 1.1 - (WY.sth ?? .5)) / .05));
  const winFill = (ctx, t) => { const tv = tvYou(t), f = flickNow(t), a1 = (1 - tv) * .92, a2 = tv * f, g = ctx.createLinearGradient(0, -G.hh, 0, G.hh);
    g.addColorStop(0, mixC(mixH('#0b0e22', '#ffd28e', a1), '#2c5f88', Math.min(1, a2))); g.addColorStop(1, mixC(mixH('#0b0e22', '#e8913c', a1), '#8fe6ff', Math.min(1, a2))); return g; };
  // the fog: from the water line up over the street, then the whole frame (the edge is a screen y)
  const KFOG = mono([[A.that - .3, H + 90], [A.numb + .1, 960], [A.numbE - .25, 650], [A.numbE + .2, 330], [A.so2 + .1, -160], [end + 1, -260]]);
  function draw(ctx, t) {
    const mc = cam(t), S = roomState(t, RA); S.flick = flickNow(t);
    const d = FZ - mc.z, open = curtain(t), fill = winFill(ctx, t);
    const room = (c2) => { drawRoom(c2, t, mc, S, G); drawW1(c2, t, mc, G, S, { open, fill, glow: 1 }); };
    let covered = d <= 0;
    if (!covered) { const k = mc.F / d, l = W / 2 + mc.ox + (-G.hw - mc.x) * k, r = W / 2 + mc.ox + (G.hw - mc.x) * k, tp = H / 2 + mc.oy + (-G.hh - mc.y) * k, b = H / 2 + mc.oy + (G.hh - mc.y) * k; covered = l <= 0 && r >= W && tp <= 0 && b >= H; }
    if (covered) { room(ctx); }
    else {
      const hc = { x: wc.x + mc.x / RW, y: wc.y + mc.y / RW, z: RW * mc.F / d };
      const night = .3 + .7 * s5((t - (A.t0 + .1)) / (A.changes - .2 - A.t0)), lab = 1 - s5((t - (A.but + .2)) / (A.changes - .6 - A.but));
      const useIn = t > A.changes + .5;
      const st = { night, lit: [1, 0, 0, 0, 0], labels: lab, title: lab, focus: 0, focusU: H1.st.focusU, people: t < A.changes + .55 ? 1 : 0,
        screens: screens(t), sync: syncU(t) };
      if (useIn) st.inside = { level: 0, id: WY.id, draw: (c2) => room(c2) };
      drawHill(ctx, t, hc, st);
      // the glow round your window that the hill leaves out for an inside window (same light as its neighbours), gone up close
      if (useIn) { const a = .14 * (1 - s5((hc.z - 5) / 18)); if (a > .003) { const [hx, hy] = toScreen(hc, wc.x, wc.y); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = rgba('#8fe6ff', a); ctx.beginPath(); ctx.arc(hx, hy, 9 * hc.z, 0, TAU); ctx.fill(); ctx.restore(); } }
    }
    // the fog off the water (6.12), lit cyan by the street of screens
    const fe = KFOG(t); if (fe < H + 80) fogDraw(ctx, t, { edge: fe, x: fogX(t, A), tint: { x: W / 2, y: Math.min(H, fe + 260), r: 1100, col: SCREEN, a: .12 + .08 * flickNow(t) } });
  }
  return { draw, cam, G, end, enter, out, fogEdge: KFOG };
}
