// Film 13 · builder B3 (c11–c14 + end screen) · shared pieces for scenes/sc11.mjs … sc14.mjs.
// Owned by B3. Builds on lib/f10_editorial.mjs (stage, light, figures) and lib/f13_kit.mjs (hourglass, thread, lines).
//   refCard()      a card whose content is authored in SCREEN coordinates as seen from a reference camera (far stages, maps)
//   bgNight()      the explainer night (screen space): deep indigo with a lift, as in the style test; tone 0 night … 1 pre-dawn
//   cloth()        the tablecloth = the sheet of the B2→B3 seam plate, redrawn in card space (identical to plateSheet at home)
//   topPerson()    people seen from above (shoulders, head, arms on the table); topDu() = you (yellow coat, hood)
//   phoneTop()     a phone lying on the table: lights up cool, flips face down by itself
//   MAP            western Europe + Australia as lon/lat outlines, projected by mapProj()
//   coin(), office(), dome(), ballot()   light marks for the explainers
// Rules: no canvas / pattern per frame; seeded randomness only; nothing appears from nowhere (reveals are masks, threads, rises).
import { Path2D, PathOp } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as K from './f13_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, expoIn, drift, prng, lin, rad, halo, glowFill, dust } = E;

export const COOL = mixHex(P.blue2, P.cream, .35);

// ---------- stage ----------
// draw fn in screen coordinates as they appear from camera Cref, on a card at depth Z (true parallax for any other camera)
export function refCard(ctx, c, Z, Cref, fn) {
  const r = E.cardM(Cref, Z);
  return E.card(ctx, c, Z, (k) => { ctx.transform(1 / r.k, 0, 0, 1 / r.k, -r.e / r.k, -r.f / r.k); fn(k / r.k); });
}
// project a point authored in Cref-screen coords on card Z, seen from camera c
export function refProject(c, Z, Cref, x, y) { const r = E.cardM(Cref, Z); return E.project(c, Z, (x - r.e) / r.k, (y - r.f) / r.k); }
// interpolate cameras in log distance to a reference depth (like camAt, for a single pair)
export function camLerp(a, b, u, ref = E.F0) {
  const out = E.cam3(); for (const k of ['x', 'y', 'f', 'roll']) out[k] = lerp(a[k] ?? out[k], b[k] ?? out[k], u);
  const da = Math.max(1, ref - (a.z || 0)), db = Math.max(1, ref - (b.z || 0)); out.z = ref - Math.exp(lerp(Math.log(da), Math.log(db), u)); return out;
}

// ---------- the explainer night (screen space, so both sides of an internal seam draw the very same pixels) ----------
const STARS_N = 150;
export function bgNight(ctx, t, o = {}) {
  const dawn = o.dawn ?? 0, st = o.stars ?? .7, sy = o.sy ?? 0;   // sy: vertical scroll in px (a tilt: stars move, the gradient a little)
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.45, mixHex(P.night1, P.ind0, .3 * dawn)], [1, mixHex(P.ind0, P.ind1, .6 * dawn)]]); ctx.fillRect(0, 0, W, H);
  const lx = (o.lift?.[0] ?? 1300) + 10 * drift(t * .3, 1, 3), ly = (o.lift?.[1] ?? 260) + .25 * sy;
  ctx.fillStyle = rad(ctx, lx, ly, 1300, [[0, rgba(P.ind1, .9)], [.45, rgba(P.ind1, .45)], [.8, rgba(P.ind0, .18)], [1, rgba(P.ind0, 0)]]); ctx.fillRect(0, 0, W, H);
  if (dawn > 0) { ctx.fillStyle = lin(ctx, 0, H * .55, 0, H, [[0, rgba(P.blue1, 0)], [1, rgba(P.blue1, .35 * dawn)]]); ctx.fillRect(0, H * .55, W, H * .45); }
  if (st > 0) { const off = ((sy * .5) % (H * 1.2) + H * 1.2) % (H * 1.2); for (const k of [0, -1]) E.stars(ctx, 29, STARS_N, t, [-40 + 6 * drift(t * .2, 1, 7), -60 + off + k * H * 1.2, W + 80, H * 1.2], st); }
  ctx.restore();
}

// ---------- the tablecloth: plateSheet (lib/f13_seams.mjs) redrawn in card space; identical to the plate at the home camera ----------
// The cloth is bigger than the frame (the plate only shows its lit middle); beyond r 1250 it keeps darkening toward its edges.
export const CLOTH = { x0: 190, y0: -300, x1: 2560, y1: 1330 };
export function cloth(ctx, t) {
  const ex = 190 + 4 * drift(t, 1, 5), { y0, x1, y1 } = CLOTH;
  ctx.save();
  // soft drop shadow of the cloth on the dark floor (the plate's left strip, extended round the cloth)
  ctx.fillStyle = lin(ctx, ex - 70, 0, ex, 0, [[0, rgba(P.night0, 0)], [1, rgba(P.night0, .9)]]); ctx.fillRect(ex - 70, y0, 70, y1 - y0);
  ctx.filter = 'blur(40px)'; ctx.fillStyle = rgba(P.night0, .9); ctx.fillRect(ex + 30, y0 - 50, x1 - ex + 30, y1 - y0 + 120); ctx.filter = 'none';
  ctx.beginPath(); ctx.rect(ex, y0, x1 - ex, y1 - y0); ctx.clip();
  ctx.fillStyle = rad(ctx, 1000, 260, 1300, [[0, P.core1], [.22, P.halo0], [.55, P.halo1], [.85, P.shade0], [1, P.shade1]]); ctx.fillRect(ex, y0, x1 - ex, y1 - y0);
  ctx.fillStyle = rad(ctx, 1000, 300, 1250, [[.5, rgba(P.night1, 0)], [1, rgba(P.night1, .55)]]); ctx.fillRect(ex, y0, x1 - ex, y1 - y0);
  ctx.fillStyle = rad(ctx, 1000, 300, 2700, [[.463, rgba(P.night1, 0)], [1, rgba(P.night1, .75)]]); ctx.fillRect(ex, y0, x1 - ex, y1 - y0);   // 0 inside r 1250
  // paper fibres: the plate's 70 (same seed, same box), then more on the rest of the cloth (outside the home frame)
  let r = prng(77); ctx.strokeStyle = rgba(P.shade0, .1); ctx.lineWidth = 1;
  for (let i = 0; i < 70; i++) { const x0 = ex + r() * (W - ex), yy = r() * H, l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + Math.cos(a) * l, yy + Math.sin(a) * l); ctx.stroke(); }
  r = prng(78);
  for (let i = 0; i < 90; i++) { const x0 = ex + r() * (x1 - ex), yy = y0 + r() * (y1 - y0); if (x0 < W && yy > 0 && yy < H) continue; const l = 20 + r() * 60, a = r() * 6.28; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(x0 + Math.cos(a) * l, yy + Math.sin(a) * l); ctx.stroke(); }
  // the two written lines (the rule) exactly as on the plate
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [y, xe] of [[330, 1460], [430, 1240]]) {
    ctx.strokeStyle = rgba(P.shade0, .85); ctx.lineWidth = 5; ctx.beginPath();
    for (let x = 380; x <= xe; x += 6) { const yy = y + 7 * Math.sin(x * .045) + 3 * Math.sin(x * .13); x === 380 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.stroke();
  }
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 1000, 220, 700, [[0, rgba(P.core1, .1 + .03 * Math.sin(t * 1.3))], [1, rgba(P.core1, 0)]]); ctx.fillRect(ex, y0, x1 - ex, y1 - y0);
  ctx.restore();
}

// ---------- people seen from above ----------
// (x, y) = centre of the shoulders, ang = direction the person faces (toward the table), s = shoulder width.
// o: { du (yellow coat + hood), lamp: [x, y] (light source for the lit side), arms: 0..1 (forearms on the table), lean (toward table, px),
//      armL / armR: [dx, dy] extra hand offsets in the person's frame (+y = toward the table), child (smaller, no arms on table) }
const SKIN = mixHex(P.shade0, P.night1, .45);
export function topPerson(ctx, x, y, ang, s, o = {}) {
  const du = !!o.du, lamp = o.lamp || [1000, 300];
  const la = Math.atan2(lamp[1] - y, lamp[0] - x) - ang + Math.PI / 2;   // direction of the lamp in the person's frame
  const lx = Math.cos(la), ly = Math.sin(la);
  const body = du ? P.coat : P.ind2, lit = du ? mixHex(P.coat, P.core1, .45) : mixHex(P.ind2, P.blue1, .9), shade = du ? mixHex(P.coat, P.shade0, .6) : P.night1;
  const rim = du ? mixHex(P.coat, P.core1, .7) : mixHex(P.shade0, P.ind2, .35);
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang - Math.PI / 2); ctx.translate(0, o.lean ?? 0); ctx.scale(s, s);
  // shadow on the floor / chair, away from the lamp
  ctx.fillStyle = rgba(P.night0, .55); ctx.beginPath(); ctx.ellipse(-lx * .1, -ly * .1 - .05, .62, .34, 0, 0, 6.29); ctx.fill();
  // arms: shoulders → elbows → hands on the table edge (+y)
  const arms = o.arms ?? 1;
  for (const sd of [-1, 1]) {
    const ex = o[sd < 0 ? 'armL' : 'armR'] || [0, 0];
    const sh = [sd * .4, .02], el = [sd * .46, .32 * arms + .12], hd = [sd * (.26 - .06 * arms) + ex[0], (.62 * arms + .16) + ex[1]];
    ctx.strokeStyle = sd * lx > 0 ? lit : body; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = .17; ctx.beginPath(); ctx.moveTo(...sh); ctx.lineTo(...el); ctx.stroke();
    ctx.lineWidth = .14; ctx.beginPath(); ctx.moveTo(...el); ctx.lineTo(...hd); ctx.stroke();
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(hd[0], hd[1] + .05, .065, .08, 0, 0, 6.29); ctx.fill();
  }
  // shoulders (a soft capsule) with light from the lamp side
  const sp = new Path2D(); sp.roundRect(-.5, -.2, 1, .4, .2);
  ctx.fillStyle = lin(ctx, -lx * .5, -ly * .2, lx * .5, ly * .2, [[0, shade], [.55, body], [1, lit]]); ctx.fill(sp);
  const sh2 = new Path2D(); sh2.addPath(sp, { a: 1, b: 0, c: 0, d: 1, e: -lx * .03, f: -ly * .03 });
  ctx.fillStyle = rim; ctx.fill(new Path2D(sp).op(sh2, PathOp.Difference));
  // head (hair from above) or hood
  if (du) {
    const hp = new Path2D(); hp.ellipse(0, -.03, .23, .25, 0, 0, 6.29);
    const pk = new Path2D(); pk.moveTo(-.12, -.18); pk.quadraticCurveTo(0, -.42, .12, -.18); pk.closePath();
    const hood = hp.op(pk, PathOp.Union);
    ctx.fillStyle = lin(ctx, -lx * .25, -ly * .25, lx * .25, ly * .25, [[0, shade], [.6, body], [1, lit]]); ctx.fill(hood);
    ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.ellipse(0, .2, .13, .05, 0, 0, 6.29); ctx.fill();   // the face opening toward the table (no face)
  } else {
    ctx.fillStyle = lin(ctx, -lx * .2, -ly * .2, lx * .2, ly * .2, [[0, P.night0], [1, mixHex(P.night1, P.blue1, .6)]]);
    ctx.beginPath(); ctx.ellipse(0, -.01, .19, .21, 0, 0, 6.29); ctx.fill();
  }
  ctx.restore();
}
export const topDu = (ctx, x, y, ang, s, o = {}) => topPerson(ctx, x, y, ang, s, { ...o, du: true });

// ---------- a phone lying on the table (top view) ----------
// light 0..1 (screen lit, cool), flip 0..1 (turns over around its long axis; > .5 the back is up), buzz (px of a tiny shake)
export function phoneTop(ctx, x, y, s, ang, t, o = {}) {
  const fl = clamp(o.flip ?? 0), c = Math.cos(fl * Math.PI), sc = Math.abs(c), lift = 1 + .12 * Math.sin(fl * Math.PI), light = clamp(o.light ?? 0) * (c > 0 ? 1 : 0);
  const bz = o.buzz ? Math.sin(t * 90) * o.buzz : 0;
  ctx.save(); ctx.translate(x + bz, y); ctx.rotate(ang); ctx.scale(s * lift, s * lift);
  ctx.fillStyle = rgba(P.night0, .5); ctx.beginPath(); ctx.roundRect(-1 + .06, -.5 * sc + .1, 2, sc, .14); ctx.fill();   // shadow
  if (light > 0) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, 0, 0, 2.6, [[0, rgba(COOL, .55 * light)], [.4, rgba(P.blue0, .25 * light)], [1, rgba(P.blue0, 0)]]); ctx.fillRect(-3, -3, 6, 6); ctx.restore(); }
  ctx.scale(1, Math.max(.02, sc));
  ctx.fillStyle = c > 0 ? P.night0 : mixHex(P.ind2, P.blue1, .4); ctx.beginPath(); ctx.roundRect(-1, -.5, 2, 1, .14); ctx.fill();
  ctx.strokeStyle = rgba(P.blue1, .9); ctx.lineWidth = .04; ctx.stroke();
  if (c > 0 && light > 0) {
    ctx.fillStyle = lin(ctx, -.9, 0, .9, 0, [[0, rgba(P.cream, light)], [1, rgba(COOL, light)]]); ctx.beginPath(); ctx.roundRect(-.9, -.4, 1.8, .8, .08); ctx.fill();
    // a work message: an envelope and two lines (cool ink)
    ctx.strokeStyle = rgba(P.ind0, .8 * light); ctx.lineWidth = .05; ctx.lineJoin = 'round';
    ctx.strokeRect(-.72, -.22, .46, .34); ctx.beginPath(); ctx.moveTo(-.72, -.22); ctx.lineTo(-.49, -.02); ctx.lineTo(-.26, -.22); ctx.stroke();
    ctx.lineWidth = .06; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-.1, -.14); ctx.lineTo(.7, -.14); ctx.moveTo(-.1, .06); ctx.lineTo(.45, .06); ctx.stroke();
  }
  if (c < 0) { ctx.fillStyle = rgba(P.blue1, .6); ctx.beginPath(); ctx.arc(.62, -.22, .1, 0, 6.29); ctx.fill(); }   // the camera bump on the back
  ctx.restore();
}

// ---------- table things (top view) ----------
export function dish(ctx, x, y, r, o = {}) {
  ctx.save(); ctx.fillStyle = rgba(P.night0, .35); ctx.beginPath(); ctx.ellipse(x + r * .08, y + r * .1, r, r, 0, 0, 6.29); ctx.fill();
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .3, r * 1.3, [[0, mixHex(P.cream, P.halo0, .3)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.shade0, .5); ctx.lineWidth = r * .05; ctx.beginPath(); ctx.arc(x, y, r * .68, 0, 6.29); ctx.stroke();
  if (o.food) { ctx.fillStyle = rgba(o.food, .85); ctx.beginPath(); ctx.ellipse(x + r * .05, y, r * .38, r * .3, .4, 0, 6.29); ctx.fill(); }
  ctx.restore();
}
// a glass from above: rim ring, fill level (gold drink) 0..1
export function glass(ctx, x, y, r, fill = 0) {
  ctx.save(); ctx.fillStyle = rgba(P.night0, .3); ctx.beginPath(); ctx.arc(x + r * .15, y + r * .2, r, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(P.cream, .14); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.fill();
  if (fill > 0) { ctx.fillStyle = rad(ctx, x, y, r, [[0, P.core1], [.7, P.halo0], [1, P.halo1]]); ctx.beginPath(); ctx.arc(x, y, r * .86 * Math.sqrt(clamp(fill)), 0, 6.29); ctx.fill(); }
  ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = r * .1; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.29); ctx.stroke();
  ctx.restore();
}
// a bottle from above (lying in a hand, tilted toward a glass): length L, angle a, pour 0..1 (a thin gold thread from the neck)
export function bottle(ctx, x, y, L, a, pour = 0, to = null) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.fillStyle = rgba(P.night0, .4); ctx.beginPath(); ctx.roundRect(-L * .5 + 6, -L * .12 + 8, L, L * .24, L * .1); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -L * .12, 0, L * .12, [[0, mixHex(P.blue1, P.cream, .25)], [.5, P.ind2], [1, P.night1]]);
  ctx.beginPath(); ctx.roundRect(-L * .5, -L * .12, L * .72, L * .24, L * .1); ctx.fill(); ctx.beginPath(); ctx.roundRect(L * .18, -L * .05, L * .32, L * .1, L * .04); ctx.fill();
  ctx.restore();
  if (pour > 0 && to) { const nk = [x + Math.cos(a) * L * .5, y + Math.sin(a) * L * .5]; K.trailSpan(ctx, [[nk[0], nk[1], 2], [to[0], to[1], 2]], 0, clamp(pour), { w: 2.2, spark: false }); }
}

// ---------- map: western Europe + Australia (lon, lat; simplified outlines) ----------
export const MAP = {
  france: [[2.55, 51.09], [1.95, 51.0], [1.6, 50.9], [1.58, 50.4], [1.45, 50.1], [.2, 49.7], [.1, 49.45], [-.25, 49.3], [-1.1, 49.38], [-1.25, 49.65], [-1.95, 49.72], [-1.8, 49.35], [-1.55, 48.65], [-2.3, 48.62], [-3, 48.8], [-3.6, 48.75], [-4.2, 48.65], [-4.75, 48.4], [-4.4, 48.25], [-4.65, 48], [-4.35, 47.8], [-3.5, 47.7], [-2.8, 47.5], [-2.2, 47.25], [-2.15, 46.85], [-1.8, 46.5], [-1.2, 46.2], [-1.15, 45.8], [-1.25, 45.5], [-1.2, 44.8], [-1.3, 44.2], [-1.5, 43.6], [-1.78, 43.36],
    [-1.4, 43.25], [-.75, 42.95], [0, 42.7], [.7, 42.85], [1.45, 42.6], [2, 42.45], [2.7, 42.42], [3.17, 42.43],
    [3.05, 42.95], [3.25, 43.25], [3.9, 43.55], [4.6, 43.4], [5.05, 43.35], [5.4, 43.2], [6, 43.1], [6.6, 43.15], [7, 43.55], [7.53, 43.78],
    [7.65, 44.15], [6.9, 44.4], [6.95, 44.85], [6.7, 45.1], [7.1, 45.25], [6.8, 45.83], [6.95, 46.05], [6.15, 46.2], [6.1, 46.4], [6.75, 46.95], [7, 47.4], [7.55, 47.6], [7.6, 48], [7.8, 48.6], [8.2, 48.97], [7.5, 49.1], [6.75, 49.15], [6.4, 49.47], [5.8, 49.55],
    [5.45, 49.5], [4.85, 49.8], [4.8, 50.15], [4.15, 49.98], [3.65, 50.45], [3, 50.75]],
  corsica: [[9.4, 43], [9.55, 42.6], [9.4, 41.4], [8.8, 41.6], [8.6, 42.1], [8.7, 42.6], [9.3, 43]],
  belgium: [[2.55, 51.09], [3, 50.75], [3.65, 50.45], [4.15, 49.98], [4.8, 50.15], [4.85, 49.8], [5.45, 49.5], [5.8, 49.55], [6, 50.15], [6.4, 50.33], [6.05, 50.7], [5.7, 50.75], [5.85, 51.15], [5.2, 51.3], [4.8, 51.5], [4.25, 51.38], [3.4, 51.38]],
  spain: [[-8.87, 41.87], [-8.9, 42.5], [-9.3, 42.9], [-9.25, 43.2], [-8.3, 43.55], [-7.7, 43.75], [-6, 43.57], [-5, 43.45], [-3.8, 43.45], [-2.9, 43.4], [-1.78, 43.36],
    [-1.4, 43.25], [-.75, 42.95], [0, 42.7], [.7, 42.85], [1.45, 42.6], [2, 42.45], [2.7, 42.42], [3.17, 42.43],
    [3.2, 41.9], [2.6, 41.6], [2.1, 41.3], [1, 41.05], [.8, 40.7], [0, 40.05], [-.3, 39.5], [.2, 38.75], [-.5, 38.3], [-.75, 37.6], [-1.6, 37.3], [-2.1, 36.75], [-3, 36.75], [-4.4, 36.7], [-5, 36.45], [-5.6, 36], [-6, 36.3], [-6.35, 36.8], [-6.95, 37.2], [-7.4, 37.18],
    [-7.5, 37.55], [-7.25, 37.95], [-7, 38.2], [-7.3, 38.45], [-7, 38.9], [-7.25, 39.25], [-7.5, 39.65], [-7, 39.67], [-6.9, 40.25], [-6.85, 40.95], [-6.4, 41.4], [-6.2, 41.6], [-6.6, 41.95], [-7.15, 41.98], [-7.9, 41.86], [-8.2, 42.15]],
  portugal: [[-8.87, 41.87], [-8.2, 42.15], [-7.9, 41.86], [-7.15, 41.98], [-6.6, 41.95], [-6.2, 41.6], [-6.4, 41.4], [-6.85, 40.95], [-6.9, 40.25], [-7, 39.67], [-7.5, 39.65], [-7.25, 39.25], [-7, 38.9], [-7.3, 38.45], [-7, 38.2], [-7.25, 37.95], [-7.5, 37.55], [-7.4, 37.18], [-8, 37.05], [-8.95, 37], [-8.8, 37.9], [-8.9, 38.5], [-9.2, 38.45], [-9.5, 38.75], [-9.35, 39.4], [-9, 40.1], [-8.85, 40.7], [-8.75, 41.2]],
  ireland: [[-6.25, 54.05], [-6.65, 54.07], [-7.05, 54.27], [-7.2, 54.2], [-7.6, 54.13], [-8.05, 54.36], [-7.75, 54.6], [-7.55, 54.75], [-7.25, 55.05], [-7.4, 55.3], [-8.3, 55.17], [-8.5, 54.85], [-8.2, 54.6], [-8.6, 54.3], [-9.9, 54.2], [-10.1, 53.9], [-9.7, 53.6], [-10.2, 53.4], [-9, 53.2], [-9.5, 52.9], [-9.95, 52.6], [-10.4, 52.1], [-10.2, 51.6], [-9.6, 51.5], [-8.5, 51.6], [-7.6, 51.95], [-6.4, 52.2], [-6, 52.55], [-6.2, 53.3], [-6.1, 53.6], [-6.35, 54]],
  nireland: [[-6.25, 54.05], [-5.5, 54.3], [-5.45, 54.65], [-5.95, 55.05], [-6.3, 55.2], [-7.25, 55.05], [-7.55, 54.75], [-7.75, 54.6], [-8.05, 54.36], [-7.6, 54.13], [-7.2, 54.2], [-7.05, 54.27], [-6.65, 54.07]],
  britain: [[-5.7, 50.05], [-4.2, 50.35], [-3.5, 50.6], [-3, 50.7], [-2, 50.6], [-1.3, 50.78], [.3, 50.78], [1, 51], [1.4, 51.3], [.9, 51.5], [1.6, 51.95], [1.75, 52.6], [1.3, 52.95], [.35, 52.95], [.25, 53.4], [-.1, 53.7], [-.5, 54.2], [-1.2, 54.6], [-1.5, 55.1], [-1.7, 55.65], [-2.1, 55.95], [-2.9, 56.05], [-2.6, 56.3], [-2.5, 56.6], [-2, 57.1], [-1.8, 57.55], [-2.6, 57.7], [-3.6, 57.65], [-4.2, 57.5], [-3.6, 58], [-3.05, 58.6], [-4.5, 58.55], [-5, 58.62], [-5.3, 58.2], [-5.65, 57.6], [-5.7, 57], [-5.85, 56.6], [-5.6, 56.3], [-5.65, 55.8], [-4.85, 55.3], [-5.15, 54.85], [-4.4, 54.8], [-3.6, 54.9], [-3.4, 54.5], [-3, 54.15], [-2.85, 53.75], [-3.05, 53.4], [-3.5, 53.3], [-4.5, 53.4], [-4.75, 52.8], [-4.1, 52.6], [-4.1, 52.3], [-4.7, 52.05], [-5.25, 51.75], [-4.9, 51.6], [-4.2, 51.55], [-3.4, 51.4], [-2.7, 51.5], [-3, 51.2], [-4.2, 51.2], [-4.6, 51], [-5, 50.6]],
  rest: [[3.4, 51.38], [3.6, 51.6], [4, 51.95], [4.5, 52.4], [4.75, 52.95], [5.1, 53.3], [5.9, 53.42], [6.9, 53.45], [7.2, 53.6], [8, 53.7], [8.55, 53.55], [8.9, 53.9], [8.8, 54.3], [8.6, 54.9], [8.4, 55.4], [8.1, 55.6], [8.2, 56.6], [8.6, 57.1], [9.6, 57.5], [10.6, 57.75], [10.5, 57.2], [10.3, 56.6], [10.9, 56.4], [10.3, 55.9], [10, 55.4], [9.7, 55], [10, 54.6], [10.9, 54], [11.5, 54.1], [12.4, 54.45], [13.5, 54.3], [14.2, 53.9], [16, 54.3], [18, 54.8], [22, 55], [30, 56], [30, 45.5],
    [13.7, 45.65], [12.3, 45.3], [12.35, 44.2], [13.6, 43.55], [14.4, 42.4], [16, 41.9], [18.5, 40.15], [17, 39], [16.5, 38.4], [15.65, 38], [15.8, 39.6], [15, 40.2], [14.3, 40.8], [13, 41.25], [12.4, 41.7], [11.1, 42.45], [10.5, 42.95], [10.3, 43.55], [9.8, 44.08], [8.9, 44.42], [8.2, 43.95], [7.53, 43.78],
    [7.65, 44.15], [6.9, 44.4], [6.95, 44.85], [6.7, 45.1], [7.1, 45.25], [6.8, 45.83], [6.95, 46.05], [6.15, 46.2], [6.1, 46.4], [6.75, 46.95], [7, 47.4], [7.55, 47.6], [7.6, 48], [7.8, 48.6], [8.2, 48.97], [7.5, 49.1], [6.75, 49.15], [6.4, 49.47], [5.8, 49.55],
    [6, 50.15], [6.4, 50.33], [6.05, 50.7], [5.7, 50.75], [5.85, 51.15], [5.2, 51.3], [4.8, 51.5], [4.25, 51.38]],
  sardinia: [[9.6, 41.15], [9.8, 40.5], [9.65, 39.2], [9, 39], [8.4, 39], [8.4, 40.3], [8.2, 40.9], [8.9, 41]],
  africa: [[-10, 29], [-9.8, 30.6], [-9.6, 32.3], [-8.5, 33.3], [-6.8, 34.1], [-6, 35.8], [-5.3, 35.9], [-4.4, 35.2], [-2.9, 35.25], [-2, 35.1], [-1, 35.7], [0, 35.9], [1.5, 36.6], [3, 36.8], [5, 36.85], [7, 37], [8.6, 36.95], [10.2, 37.2], [11, 36.9], [10.5, 36], [11, 35], [11, 29]],
  australia: [[113.5, -22], [113.7, -24.5], [114.1, -26.5], [114.9, -29.5], [115, -31.5], [115, -34], [116.5, -35], [117.9, -35.1], [119.8, -34], [121.8, -33.9], [123.5, -33.9], [126, -32.3], [129, -31.6], [131.2, -31.5], [133.5, -32.2], [134.3, -33.2], [135.6, -34.8], [136.6, -33.9], [137.8, -32.6], [137.7, -33.9], [137.5, -35.1], [138.5, -35.6], [139.6, -36.9], [140.9, -38.05], [143.5, -38.8], [144.9, -37.9], [146.3, -39.1], [147.8, -37.9], [150, -37.4], [150.5, -35.5], [151.2, -33.9], [152.5, -32.2], [153.1, -30.5], [153.6, -28.2], [153.1, -25.5], [151.8, -24.1], [150.8, -22.6], [149.2, -21], [148.2, -20.1], [146.3, -19], [145.9, -17.5], [145.4, -16.5], [145.3, -14.9], [144, -14.3], [143.5, -12.8], [142.5, -10.7], [141.9, -12.3], [141.6, -13.5], [141.5, -15.5], [140.8, -17.5], [139.3, -17.4], [137.6, -16.2], [136.2, -15.6], [135.9, -15], [135.6, -14], [136.9, -12.3], [136.3, -11.9], [135.3, -12.1], [133.8, -11.6], [132.6, -11.5], [131.1, -12.2], [130.2, -13.2], [129.6, -14.8], [128.2, -15], [127.5, -14.1], [126.6, -13.9], [125.2, -14.6], [124.4, -16.3], [123.4, -16.9], [122.2, -18], [121.2, -19.4], [119.8, -20], [118.8, -20.3], [116.7, -20.6], [115.5, -21.5], [114.6, -21.8]],
  tasmania: [[144.7, -40.7], [146.6, -41.1], [148.3, -40.9], [148.2, -42.2], [147.9, -43.2], [146.9, -43.6], [146, -43.6], [145.2, -42.2]],
};
// projection: Europe around France (lon0, lat0) at screen (px, py), ky px per degree latitude; Australia as an inset
export const mapProj = (px, py, ky = 46, lon0 = 2.4, lat0 = 46.7) => ([lon, lat]) => [px + (lon - lon0) * ky * Math.cos(47 * Math.PI / 180), py - (lat - lat0) * ky];
export const ausProj = (ax, ay, ka = 7) => ([lon, lat]) => [ax + (lon - 134) * ka * Math.cos(25 * Math.PI / 180), ay - (lat + 25.5) * ka];
const PATHS = new Map();
export function polyPath(key, pts, proj) {
  const k = key; if (PATHS.has(k)) return PATHS.get(k);
  const p = new Path2D(); pts.map(proj).forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); PATHS.set(k, p); return p;
}
export const polyPts = (pts, proj, close = true) => { const q = pts.map(proj); if (close) q.push(q[0]); return q; };

// ---------- light marks ----------
// a coin of light (cool: money). r radius, tilt 0..1 (seen at an angle: 0 flat-on, 1 edge-on), a
export function coin(ctx, x, y, r, t, o = {}) {
  const tilt = clamp(o.tilt ?? 0), ry = r * (1 - .7 * tilt), a = o.a ?? 1, lit = o.lit ?? 0;
  const p = new Path2D(); p.ellipse(x, y, r, ry, 0, 0, 6.29);
  if (tilt > .05) { const side = new Path2D(); side.rect(x - r, y, 2 * r, r * .22); const b = new Path2D(); b.ellipse(x, y + r * .22, r, ry, 0, 0, 6.29); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = E.lin(ctx, x - r, 0, x + r, 0, [[0, mixHex(P.blue1, COOL, .55)], [.35, COOL], [.7, mixHex(P.blue1, COOL, .6)], [1, mixHex(P.blue0, P.blue1, .5)]]); ctx.fill(side.op(b, PathOp.Union)); ctx.strokeStyle = rgba(P.blue0, .6); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(x, y + r * .22, r, ry, 0, .05, Math.PI - .05); ctx.stroke(); ctx.restore(); }
  E.lightShape(ctx, p, t, { lit: o.lit ?? .3, a, dust: 0, glow: o.glow ?? .7 });
  ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = rgba(lit > .5 ? P.shade0 : P.blue1, .7); ctx.lineWidth = Math.max(1, r * .08); ctx.beginPath(); ctx.ellipse(x, y, r * .72, ry * .72, 0, 0, 6.29); ctx.stroke(); ctx.restore();
}
// signs of light (paths built once, unit size ~1, centred at the base middle (0,0), up = -y)
const SIGN = new Map();
export function signPath(name) {
  if (SIGN.has(name)) return SIGN.get(name);
  const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
  let p = new Path2D();
  if (name === 'office') {   // a tower of an office with a window grid
    p.rect(-.32, -1, .64, 1); const t2 = new Path2D(); t2.rect(-.5, -.55, .3, .55); p = U(p, t2);
    for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) { const w = new Path2D(); w.rect(-.24 + c * .18, -.92 + r * .15, .1, .08); p = D(p, w); }
    const dr = new Path2D(); dr.rect(-.06, -.16, .12, .16); p = D(p, dr);
  } else if (name === 'dome') {   // a parliament: dome, drum, columns, steps
    const d = new Path2D(); d.arc(0, -.66, .26, Math.PI, 0); d.closePath(); p = d;
    const lan = new Path2D(); lan.rect(-.035, -1, .07, .12); p = U(p, lan);
    const dr = new Path2D(); dr.rect(-.3, -.68, .6, .08); p = U(p, dr);
    const ped = new Path2D(); ped.moveTo(-.56, -.46); ped.lineTo(0, -.6); ped.lineTo(.56, -.46); ped.closePath(); p = U(p, ped);
    const ent = new Path2D(); ent.rect(-.54, -.48, 1.08, .05); p = U(p, ent);
    for (let i = 0; i < 6; i++) { const c = new Path2D(); c.rect(-.47 + i * .18, -.42, .07, .32); p = U(p, c); }
    const st = new Path2D(); st.rect(-.6, -.1, 1.2, .05); const st2 = new Path2D(); st2.rect(-.66, -.05, 1.32, .05); p = U(U(p, st), st2);
  } else if (name === 'ballot') {   // a hand (from below) holding up a ballot card
    const card = new Path2D(); card.roundRect(-.28, -1, .56, .5, .03); const fold = new Path2D(); fold.rect(-.2, -.82, .4, .04); const tick = new Path2D(); tick.moveTo(-.1, -.66); tick.lineTo(-.03, -.6); tick.lineTo(.12, -.76);
    p = D(D(card, fold), tick.stroke({ width: .045, cap: 1, join: 1 }));
    const m = E.handMatrix(.02, .05, -Math.PI / 2, .34, 1), hp = new Path2D(); hp.addPath(E.handPath({ pose: 'hold', curl: .5 }), m);
    p = U(p, hp);
  }
  SIGN.set(name, p); return p;
}
export function sign(ctx, name, x, y, size, t, o = {}) {
  const p = new Path2D(); p.addPath(signPath(name), { a: size, b: 0, c: 0, d: size, e: x, f: y });
  E.lightShape(ctx, p, t, { lit: o.lit ?? 1, a: o.a ?? 1, dust: o.dust ?? 0, glow: o.glow ?? .8, seed: o.seed ?? 3 });
  return p;
}
// a label of caps (Inter) that rises from its baseline (u 0..1; < 0 sinks again): the text rule of the film
export function capLabel(ctx, s, x, y, size, u, o = {}) {
  if (u <= 0) return;
  const sp = o.spacing ?? .14, serif = o.serif ?? false, w = K.measure(s, size, serif, o.weight ?? 600) + sp * size * s.length;
  const x0 = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
  // word by word: maskLine's baseline mask is sized without letter spacing, so a long spaced line would lose its last letters
  ctx.save(); if (sp) ctx.letterSpacing = `${sp}em`;
  let xx = x0; const sw = K.measure(' ', size, serif, o.weight ?? 600) + sp * size;
  for (const wd of s.split(' ')) {
    K.maskLine(ctx, [[wd, o.warm ?? 0]], xx, y, size, u, { serif, col: o.col ?? P.halo2, glow: o.glow ?? false, weight: o.weight ?? 600 });
    xx += K.measure(wd, size, serif, o.weight ?? 600) + sp * size * wd.length + sw;
  }
  ctx.restore();
}
// a clip disc that grows from (x,y): reveals a shape from a point (light spreading), never a fade
export function clipDisc(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, Math.max(.01, r), 0, 6.29); ctx.clip(); }

// ---------- shape morphs (a shape becomes the next shape) ----------
// resample a closed outline [[x,y]…] to n points evenly spaced by arc length, starting at its point nearest to angle `start`
// around its centroid (so two outlines line up), always clockwise on screen
export function resample(pts, n = 240, start = -Math.PI / 2) {
  let q = pts.slice(); if (q.length && (q[0][0] !== q[q.length - 1][0] || q[0][1] !== q[q.length - 1][1])) q.push(q[0]);
  let area = 0; for (let i = 0; i < q.length - 1; i++) area += q[i][0] * q[i + 1][1] - q[i + 1][0] * q[i][1];
  if (area < 0) q = q.reverse();
  const cx = q.reduce((s, p) => s + p[0], 0) / q.length, cy = q.reduce((s, p) => s + p[1], 0) / q.length;
  let best = 0, bd = 1e9; for (let i = 0; i < q.length - 1; i++) { const a = Math.atan2(q[i][1] - cy, q[i][0] - cx), d = Math.abs(Math.atan2(Math.sin(a - start), Math.cos(a - start))); if (d < bd) { bd = d; best = i; } }
  q = [...q.slice(best, q.length - 1), ...q.slice(0, best), q[best]];
  const len = [0]; for (let i = 1; i < q.length; i++) len.push(len[i - 1] + Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]));
  const L = len[len.length - 1], out = []; let j = 1;
  for (let k = 0; k < n; k++) { const d = k / n * L; while (j < q.length - 1 && len[j] < d) j++; const f = (d - len[j - 1]) / Math.max(1e-6, len[j] - len[j - 1]); out.push([lerp(q[j - 1][0], q[j][0], f), lerp(q[j - 1][1], q[j][1], f)]); }
  return out;
}
export const morphPts = (A, B, u) => A.map((p, i) => [lerp(p[0], B[i][0], u), lerp(p[1], B[i][1], u)]);
export function ptsPath(pts) { const p = new Path2D(); pts.forEach(([x, y], i) => (i ? p.lineTo(x, y) : p.moveTo(x, y))); p.closePath(); return p; }
export const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];

// ---------- c11 → c12: the coin that is carried across the chunk boundary (screen space, same call on both sides) ----------
export const COIN12 = { x: 960, y: 450, r: 46 };
export function carriedCoin(ctx, t, x = COIN12.x, y = COIN12.y, r = COIN12.r, tilt = 0) {
  halo(ctx, x, y, r * 4, .22, P.blue0, P.blue0);
  coin(ctx, x, y, r, t, { tilt, glow: .8 });
}

// ---------- machines as cool light marks (the time savers of the film): washer, envelope, phone ----------
const MICON = new Map();
export function machinePath(name) {
  if (MICON.has(name)) return MICON.get(name);
  const U = (a, b) => a.op(b, PathOp.Union), D = (a, b) => a.op(b, PathOp.Difference);
  let p = new Path2D();
  if (name === 'washer') {
    p.roundRect(-.42, -1, .84, 1, .07); const door = new Path2D(); door.arc(0, -.44, .27, 0, 6.29); p = D(p, door);
    const glassP = new Path2D(); glassP.arc(0, -.44, .19, 0, 6.29); p = U(p, glassP);
    const pan = new Path2D(); pan.rect(-.34, -.9, .36, .06); p = D(p, pan); const kn = new Path2D(); kn.arc(.24, -.87, .05, 0, 6.29); p = D(p, kn);
  } else if (name === 'envelope') {
    p.roundRect(-.5, -.68, 1, .68, .04); const v = new Path2D(); v.moveTo(-.46, -.62); v.lineTo(0, -.3); v.lineTo(.46, -.62); p = D(p, v.stroke({ width: .06, cap: 1, join: 1 }));
  } else if (name === 'phone') {
    p.roundRect(-.26, -1, .52, 1, .08); const sc = new Path2D(); sc.roundRect(-.2, -.9, .4, .74, .03); p = D(p, sc);
    const b = new Path2D(); b.arc(0, -.08, .04, 0, 6.29); p = D(p, b);
    const ln = new Path2D(); for (let i = 0; i < 3; i++) ln.rect(-.14, -.8 + i * .12, .28 - i * .06, .05); p = U(p, ln);
  }
  MICON.set(name, p); return p;
}
// (x, y) = middle of the base, size = height
export function machine(ctx, name, x, y, size, t, o = {}) {
  const p = new Path2D(); p.addPath(machinePath(name), { a: size, b: 0, c: 0, d: size, e: x, f: y });
  E.lightShape(ctx, p, t, { lit: o.lit ?? 0, a: o.a ?? 1, dust: 0, glow: o.glow ?? .6, seed: o.seed ?? 4 });
  return p;
}
// a written rule: an upright sheet of gold light with three written lines; (x, y) = middle of the base
export function ruleSheet(ctx, x, y, w, h, t, o = {}) {
  const p = new Path2D(); p.roundRect(x - w / 2, y - h, w, h, Math.min(w, h) * .08);
  E.lightShape(ctx, p, t, { lit: 1, a: o.a ?? 1, dust: 0, glow: o.glow ?? .7, seed: o.seed ?? 8 });
  const ln = o.lines ?? 1;
  if (ln > 0 && h > 20) { ctx.save(); ctx.strokeStyle = rgba(P.shade0, .75 * ln); ctx.lineWidth = Math.max(1, h * .035); ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) { const yy = y - h * (.74 - i * .2), l = w * (.62 - (i === 2 ? .22 : 0)) * ln; ctx.beginPath(); ctx.moveTo(x - w * .31, yy); ctx.lineTo(x - w * .31 + l, yy); ctx.stroke(); }
    ctx.restore(); }
  return p;
}

// ---------- the phone-readable label (lead note 28.10.): caps ≥ 56 px, one short label per picture, kept inside the frame ----------
export const LABEL = 56;
export const capWidth = (s, size = LABEL, sp = .1, serif = false) => K.measure(s, size, serif, 600) + sp * size * s.length;
export function label(ctx, s, x, y, u, o = {}) {
  const size = o.size ?? LABEL, sp = o.spacing ?? (o.serif ? 0 : .1), w = capWidth(s, size, sp, o.serif ?? false), al = o.align ?? 'center';
  let x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
  x0 = Math.max(70, Math.min(W - 70 - w, x0));
  capLabel(ctx, s, x0, Math.min(y, H - 175), size, u, { ...o, spacing: sp, align: 'left', col: o.col ?? P.cream, glow: o.glow ?? true });
}

// ---------- the slow view (lead note: no hold > 2 s without visible life) ----------
// A slow push/drift over B3's flat graphics (c11 from the Keynes graph on, c12, c13, into c14), a function of film time only, so
// both sides of every internal seam draw the same transform. The sky (bgNight) does not take it: it is far away (parallax).
export const VIEW = { k: 1, x: 0, y: 0 };
export const viewAmp = (t) => smooth(span(t, 470.6, 473.6)) * (1 - smooth(span(t, 582.6, 588.6)));
export function setView(t) {
  const a = viewAmp(t), k = 1 + a * (.038 + .022 * Math.sin(t * .31 + .4) + .012 * Math.sin(t * .53 + 1.3));
  VIEW.k = k; VIEW.x = (1 - k) * W / 2 + a * 16 * Math.sin(t * .23); VIEW.y = (1 - k) * H / 2 + a * 10 * Math.sin(t * .29 + .5);
  return VIEW;
}
export const applyView = (ctx) => ctx.setTransform(VIEW.k, 0, 0, VIEW.k, VIEW.x, VIEW.y);
// a 2D camera { s, tx, ty } seen through the view
export const viewCam = (c) => ({ s: VIEW.k * c.s, tx: VIEW.k * c.tx + VIEW.x, ty: VIEW.k * c.ty + VIEW.y });
