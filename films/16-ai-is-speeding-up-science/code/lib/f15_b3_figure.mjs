// Film 15 · B3 · a copy of the kit figure (lib/f10_editorial.mjs figure/du/person, Film 13 state) with ONE addition: o.stride 0..1
// scales the gait (legs, knees, arm swing, hem), so a walk can start and stop without a pose jump (the kit du() has no amplitude:
// stopping a walk always popped the legs). Kit wish in the B3 report. Everything else is identical to the kit.
// Second addition: o.turn 0..1 blends front view into side view continuously (the kit switches view with a pose jump).
import { Path2D, PathOp } from '@napi-rs/canvas';
import { P, rgba, mixHex, clamp, lerp, lin } from './f10_editorial.mjs';
const COAT = { base: P.coat, lit: mixHex(P.coat, P.core1, .45), shade: mixHex(P.coat, P.shade0, .62), deep: mixHex(P.coat, P.night1, .55) };
const PERSON = { base: P.ind2, lit: mixHex(P.ind2, P.blue0, .85), shade: P.night1, deep: P.night0 };
const FPOSE = {
  stand: {}, look: { look: 1, lean: -.03 }, lift: { armR: [2.92, 3.08], armL: [-2.92, -3.08], look: .5 },
  point: { armR: [1.85, 1.92], look: .25, lean: .02 }, reach: { armR: [2.5, 2.62], look: .85 },
  hold: { armR: [.75, 2.35] }, walk: { view: 'side' }, sit: { sit: true },
};
const SKIN = mixHex(P.shade0, P.night1, .5);
function figure(ctx, x, y, h, o, CC, isDu) {
  const q = { ...(FPOSE[o.pose] || {}) }; for (const [k, v] of Object.entries(o)) if (v !== undefined) q[k] = v;
  const dir = q.dir ?? 1, L = (q.light ?? 1) * dir, back = q.back ?? 0, look = q.look ?? 0, lean = q.lean ?? 0;
  const ph = q.walk, walking = ph != null, side = q.view === 'side' || (walking && q.view !== 'back'), tn = clamp(q.turn ?? (side ? 1 : 0));
  const st = clamp(q.stride ?? 1), sw = walking ? Math.sin(ph) * st : 0, wf = lerp(1, .74, tn), hm = CC.hem;
  const cLit = mixHex(CC.lit, CC.shade, back), cShade = mixHex(CC.shade, CC.deep, back * .6);
  const rimCol = q.rim || (isDu ? mixHex(P.coat, P.core1, .75) : P.blue0);
  const hands = {}, hip = [0, -.47];
  const toCaller = (u, v) => { const c = Math.cos(lean), s = Math.sin(lean), du0 = u - hip[0], dv = v - hip[1]; const uu = hip[0] + du0 * c - dv * s, vv = hip[1] + du0 * s + dv * c; return [x + h * dir * uu, y + h * vv]; };
  const cap = (pts, w0, w1, col) => { ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (let i = 0; i < pts.length - 1; i++) { ctx.lineWidth = lerp(w0, w1, i / Math.max(1, pts.length - 2)); ctx.beginPath(); ctx.moveTo(...pts[i]); ctx.lineTo(...pts[i + 1]); ctx.stroke(); } };
  const rimFill = (path, col, dx, dy) => { const sh = new Path2D(); sh.addPath(path, { a: 1, b: 0, c: 0, d: 1, e: dx, f: dy }); ctx.fillStyle = col; ctx.fill(new Path2D(path).op(sh, PathOp.Difference)); };
  ctx.save(); ctx.translate(x, y); ctx.scale(h * dir, h);
  ctx.fillStyle = rgba(P.night0, .6); ctx.beginPath(); ctx.ellipse(-L * .2, 0, .3, .022, 0, 0, 6.29); ctx.fill();
  const pants = isDu ? P.ind1 : P.night1, pantsLit = mixHex(pants, P.blue1, .45);
  if (q.sit) {   // crouched on the ground, arms round the knees, head down on them (thumbnail "or dumber")
    const cp = new Path2D(); cp.moveTo(-.02, -.62); cp.bezierCurveTo(-.12, -.62, -.18, -.5, -.19, -.32); cp.bezierCurveTo(-.2, -.16, -.22, -.06, -.23, -.006);
    cp.lineTo(.0, -.006); cp.bezierCurveTo(.02, -.12, .04, -.3, .05, -.42); cp.bezierCurveTo(.05, -.55, .03, -.61, -.02, -.62); cp.closePath();
    ctx.fillStyle = lin(ctx, -.23 * L, 0, .06 * L, 0, [[0, cShade], [.55, CC.base], [1, cLit]]); ctx.fill(cp); rimFill(cp, rimCol, -L * .016, .01);
    cap([[-.05, -.1], [.12, -.33], [.16, -.03]], .085, .07, pantsLit);                  // the near leg, knee up
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(.185, -.018, .052, .024, 0, 0, 6.29); ctx.fill();
    if (isDu) { ctx.fillStyle = cShade; ctx.beginPath(); ctx.ellipse(-.02, -.6, .075, .045, -.5, 0, 6.29); ctx.fill(); }
    ctx.fillStyle = isDu ? P.ind2 : P.night0; ctx.beginPath(); ctx.ellipse(.075, -.53, .064, .07, .6, 0, 6.29); ctx.fill();   // head down on the knees
    cap([[.0, -.52], [.15, -.42], [.15, -.3]], .068, .056, mixHex(CC.base, cLit, .4));   // arm round the knees
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(.15, -.29, .022, 0, 6.29); ctx.fill();
    ctx.restore(); const hh = [x + h * dir * .15, y - h * .29]; return { R: hh, L: hh };
  }
  // legs (trousers, shoes pointing where you go)
  const leg = (hx, a, k, col) => {
    const kn = [hx + Math.sin(a) * .22, -.45 + Math.cos(a) * .22], ft = [kn[0] + Math.sin(a - k) * .21, kn[1] + Math.cos(a - k) * .21];
    cap([[hx, -.45], kn, ft], .075, .062, col);
    ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(ft[0] + lerp(.015, .035, tn), ft[1] - .006, lerp(.046, .058, tn), .024, 0, 0, 6.29); ctx.fill();
  };
  const a1 = walking ? lerp(.03, .4 * Math.sin(ph), st) : .03, k1 = walking ? Math.max(0, Math.sin(ph + 1.7)) * .6 * st : 0, k2 = walking ? Math.max(0, Math.sin(ph + 1.7 + Math.PI)) * .6 * st : 0;
  const lx = lerp(.045, .012, tn);
  leg(-lx, -a1, k2, pants); leg(lx, a1, k1, pantsLit);
  // upper body: lean around the hip
  ctx.translate(hip[0], hip[1]); ctx.rotate(lean); ctx.translate(-hip[0], -hip[1]);
  let armR = q.armR || [.2, .1], armL = q.armL || [-.2, -.1];
  if (walking && !o.armR) armR = [-.42 * sw, -.42 * sw + .3];
  if (walking && !o.armL) armL = [.42 * sw, .42 * sw + .3];
  const arm = (sd, [s1, s2], col) => {
    const sx = sd * .098 * wf + -.01 * tn, sy = -.74, el = [sx + Math.sin(s1) * .17, sy + Math.cos(s1) * .17], hd = [el[0] + Math.sin(s2) * .155, el[1] + Math.cos(s2) * .155];
    cap([[sx, sy], el, hd], .072, .056, col);
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(hd[0] + Math.sin(s2) * .01, hd[1] + Math.cos(s2) * .01, .021, .025, -s2, 0, 6.29); ctx.fill();
    hands[sd > 0 ? 'R' : 'L'] = toCaller(hd[0], hd[1]);
    if (q.cup === (sd > 0 ? 'R' : 'L')) { ctx.fillStyle = P.cream; ctx.beginPath(); ctx.moveTo(hd[0] - .036, hd[1] - .075); ctx.lineTo(hd[0] + .036, hd[1] - .075); ctx.lineTo(hd[0] + .028, hd[1] - .005); ctx.lineTo(hd[0] - .028, hd[1] - .005); ctx.closePath(); ctx.fill(); }
  };
  arm(-1, armL, cShade);
  // the coat: rounded shoulders, A-line, a hem that swings with the walk
  const s2 = walking ? -.025 * sw - .02 : 0, yA = lerp(-.52, -hm, .4), yB = lerp(-.52, -hm, .75), fl = lerp(.135, .19, clamp((.47 - hm) / .27));
  const cp = new Path2D(), ox = -.012 * tn;
  cp.moveTo(ox - .05 * wf, -.805); cp.bezierCurveTo(ox - .09 * wf, -.8, ox - .122 * wf, -.78, ox - .124 * wf, -.735);
  cp.bezierCurveTo(ox - .13 * wf, -.66, ox - .132 * wf, -.58, ox - .135 * wf, -.52);
  cp.bezierCurveTo(ox - .148 * wf, yA, ox - (fl - .02) * wf + s2, yB, ox - fl * wf + s2, -hm);
  cp.bezierCurveTo(ox - .1 * wf + s2, -hm + .02, ox + .05 * wf + s2, -hm + .008, ox + fl * wf + s2 * 1.2, -hm - .006);
  cp.bezierCurveTo(ox + (fl - .02) * wf + s2, yB, ox + .148 * wf, yA, ox + .135 * wf, -.52);
  cp.bezierCurveTo(ox + .132 * wf, -.58, ox + .13 * wf, -.66, ox + .124 * wf, -.735);
  cp.bezierCurveTo(ox + .122 * wf, -.78, ox + .09 * wf, -.8, ox + .05 * wf, -.805); cp.quadraticCurveTo(ox, -.815, ox - .05 * wf, -.805); cp.closePath();
  ctx.fillStyle = lin(ctx, -.19 * L, 0, .19 * L, 0, [[0, cShade], [.42, CC.base], [.8, mixHex(CC.base, cLit, .7)], [1, cLit]]); ctx.fill(cp);
  ctx.save(); ctx.clip(cp);
  ctx.fillStyle = rgba(CC.deep, .32); ctx.beginPath(); ctx.moveTo(-.03 * L, -.55); ctx.quadraticCurveTo(-.05 * L, -.35, (-.1 * L) + s2, -hm); ctx.lineTo((-.045 * L) + s2, -hm); ctx.quadraticCurveTo(-.03 * L, -.38, -.02 * L, -.55); ctx.fill();   // fold
  ctx.fillStyle = rgba(CC.deep, .2); ctx.beginPath(); ctx.moveTo(.05 * L, -.5); ctx.quadraticCurveTo(.07 * L, -.33, (.12 * L) + s2, -hm); ctx.lineTo((.085 * L) + s2, -hm); ctx.quadraticCurveTo(.06 * L, -.34, .055 * L, -.5); ctx.fill();
  ctx.fillStyle = lin(ctx, 0, -.52, 0, -hm, [[0, rgba(CC.deep, 0)], [1, rgba(CC.deep, .3)]]); ctx.fillRect(-.3, -.55, .6, .5);
  ctx.fillStyle = lin(ctx, 0, -.8, 0, -.66, [[0, rgba(cLit, .35)], [1, rgba(cLit, 0)]]); ctx.fillRect(-.3, -.82, .6, .2);   // light on the shoulders
  ctx.restore();
  rimFill(cp, rimCol, -L * .02, .012);
  if (back > .05) rimFill(cp, rgba(P.core1, .8 * back), L * .016, .01);
  // hood (down, bunched round the neck) or up; then the head (dark, no face)
  const hx = .012 * tn - .012 * look, hy = -.885 - .008 * look;
  if (isDu) {
    const hp = new Path2D(); hp.ellipse(ox - .004, -.8, .088 * wf + .012, .05, 0, 0, 6.29); hp.ellipse(ox - .02 - .012 * look - .025 * tn, -.835, .078, .062, -.3, 0, 6.29);
    ctx.fillStyle = lin(ctx, -.1 * L, 0, .1 * L, 0, [[0, cShade], [1, mixHex(CC.base, cLit, .5)]]); ctx.fill(hp); rimFill(hp, rimCol, -L * .014, .008);
  } else { ctx.fillStyle = CC.shade; ctx.beginPath(); ctx.ellipse(ox, -.8, .05, .03, 0, 0, 6.29); ctx.fill(); }
  ctx.fillStyle = isDu ? P.ind2 : P.night0; ctx.beginPath(); ctx.ellipse(hx, hy, .066, .074 - .01 * look, look * -.35, 0, 6.29); ctx.fill();
  ctx.fillStyle = rgba(P.blue1, .55); ctx.beginPath(); ctx.ellipse(hx + .03 * L, hy - .012, .026, .048, look * -.35, 0, 6.29); ctx.fill();   // light on the hair
  if (isDu && q.hood) {   // Film 13: the hood is up by default (raincoat). A soft peak at the back, a dark face opening on the facing side.
    const ra = look * -.35;
    let hu = new Path2D(); hu.ellipse(hx - .006, hy + .002, .084, .09, ra, 0, 6.29);
    const pk = new Path2D(); pk.moveTo(hx - .075, hy - .005); pk.quadraticCurveTo(hx - .1, hy - .085, hx - .035, hy - .096); pk.lineTo(hx + .02, hy - .07); pk.lineTo(hx - .02, hy - .01); pk.closePath();
    hu = hu.op(pk, PathOp.Union);
    ctx.fillStyle = lin(ctx, -.09 * L, 0, .09 * L, 0, [[0, cShade], [1, cLit]]); ctx.fill(hu); rimFill(hu, rimCol, -L * .014, .008);
    if (q.view !== 'back') {   // the opening: a dark crescent at the front edge (no face, ever)
      ctx.save(); ctx.clip(hu); ctx.fillStyle = mixHex(P.night0, P.ind1, .35);
      ctx.beginPath(); ctx.ellipse(hx + .066 + .01 * tn, hy + .016 - .012 * look, .036 + .008 * tn, .056, ra - .12, 0, 6.29); ctx.fill(); ctx.restore();
    }
  }
  if (q.headset) {
    ctx.strokeStyle = P.cream; ctx.lineWidth = .014; ctx.beginPath(); ctx.arc(hx, hy + .004, .075, Math.PI * 1.08, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = P.blue2; ctx.beginPath(); ctx.ellipse(hx + .058, hy + .012, .022, .032, 0, 0, 6.29); ctx.fill();
    ctx.strokeStyle = P.cream; ctx.lineWidth = .008; ctx.stroke();
  }
  arm(1, armR, mixHex(CC.base, cLit, .55));
  ctx.restore();
  return hands;
}
export function du(ctx, x, y, h, o = {}) { return figure(ctx, x, y, h, { hood: true, ...o }, { ...COAT, hem: .2 }, true); }   // Film 13: hood up unless o.hood === false
export function person(ctx, x, y, h, o = {}) { return figure(ctx, x, y, h, o, { ...PERSON, hem: o.long ? .22 : .44 }, false); }
