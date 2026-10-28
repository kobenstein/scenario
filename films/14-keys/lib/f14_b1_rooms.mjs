// Film 14 · B1 · the two shared rooms (other builders and the lead READ these, only B1 edits):
//   vaultDoor(ctx, t, o)   the round vault door of 3.03–3.06 (reference look: the vault door on plateScale in lib/f14_seams.mjs):
//                          a huge dark disc, the light only in its joints (three rings + six spokes), a hinge on the left, a lock
//                          panel with TWO light fields (two-party authorization). No key, no keyhole, ever.
//   vaultWall(ctx, door, o) the wall round the door with the round opening cut out (draw the vault interior BEFORE it)
//   launchRoom(ctx, t, o)  the old missile launch room of 4.04–4.08 (KEY ANCHOR 2) and of B3's 7.01–7.03 (match): a flat wall, a long
//                          counter with a lit edge, two console panels far apart with a lock each, a screen in the middle, a cool lamp,
//                          two officers (indigo silhouettes, no faces), the two keys of light, the officers' hands.
// Everything is drawn in DESIGN coordinates of one card (1920×1080 layout as the home camera cam3() sees it at Z = F0).
// Rules: no canvas / pattern per frame, seeded randomness only, everything driven by t and the options (words → state).
//
// LAUNCH ROOM LAYOUT (design px, card at F0; see LR below):
//   wall y < 742 · counter top edge (the long lit line) y = 742, x −400 … 2320 · floor y = 960
//   console panels: left x 300–720, right x 1200–1620, top y 430 · lock slots (key tips) L (510, 680), R (1410, 680) = 900 apart
//   screen (middle housing x 826–1094): centre (960, 590), 224 × 126 (16:9) · cool lamp (960, 210)
//   officers (person(), h 410, front view, feet on y 960): L at x 760 (left arm to key L), R at x 1330 (right arm to key R)
//   keys: lightKey h 118, tip in the slot, upright (bow up) at turn 0, turned 90° clockwise at turn 1
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as X from './f14_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, smooth, sineIO, expoOut, lin, rad, glowFill, halo, prng } = E;

// ---------------------------------------------------------------------------------------------------------------- helpers
// napi PathOp quirk (measured 28.10.): rect − arc via PathOp.Difference does not cut here, so holes are built by winding instead:
// the outer contour clockwise, the hole anticlockwise (nonzero fill). The hole must lie inside the outer contour.
export function holed(outer, holes) {   // outer: [x0, y0, x1, y1] rect or { cx, cy, r }; holes: [{ cx, cy, rx, ry }]
  const p = new Path2D();
  if (Array.isArray(outer)) p.rect(outer[0], outer[1], outer[2] - outer[0], outer[3] - outer[1]); else p.ellipse(outer.cx, outer.cy, outer.r, outer.r, 0, 0, Math.PI * 2);
  for (const h of holes) { p.moveTo(h.cx + h.rx, h.cy); p.ellipse(h.cx, h.cy, h.rx, h.ry ?? h.rx, 0, 0, Math.PI * 2, true); }
  return p;
}
// two-bone IK for the kit figures (du / person): angles [shoulder, elbow] measured from straight down, + = local +x
export function ikArm(sh, tgt, l1 = .17, l2 = .155) {
  const dx = tgt[0] - sh[0], dy = tgt[1] - sh[1], d = Math.min(Math.hypot(dx, dy), (l1 + l2) * .999), base = Math.atan2(dx, dy);
  const al = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1));
  const s1 = base + (dx >= 0 ? -al : al), el = [sh[0] + Math.sin(s1) * l1, sh[1] + Math.cos(s1) * l1];   // the elbow drops below the line
  return [s1, Math.atan2(tgt[0] - el[0], tgt[1] - el[1])];
}
// world point → figure-local (feet at (x, y), height h, facing dir); shoulder of arm side sd (+1 = armR) in local units
const toLocal = (x, y, h, dir, p) => [(p[0] - x) / (h * dir), (p[1] - y) / h];
const SHOULDER = (sd) => [sd * .098, -.74];
const armTo = (x, y, h, dir, sd, p) => ikArm(SHOULDER(sd), toLocal(x, y, h, dir, p));
const shoulderAt = (x, y, h, dir, sd) => [x + h * dir * sd * .098, y - .74 * h];
const strokeGlow = (ctx, path, w, col, a, blur) => {   // a line of light: a soft added glow under a crisp core
  if (a <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.filter = `blur(${blur}px)`; ctx.strokeStyle = rgba(P.halo1, .55 * a); ctx.lineWidth = w * 4; ctx.stroke(path); ctx.restore();
  ctx.save(); ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.stroke(path); ctx.restore();
};

// ---------------------------------------------------------------------------------------------------------------- the vault door
// o: { x, y, r (door radius), shut 0..1 (0 = swung open on its left hinge, 1 = closed), joints 0..1 (light in the joints),
//      fields [f1, f2] 0..1 (0 dark · .5 half · 1 warm), crack 0..1 (the door opens a slit: a crescent of warm light on the right),
//      lock { x, y } (panel centre; default right of the door at hand height), lockA (panel alpha), a }
// returns { x, y, r, fields: [[x,y],[x,y]], lock: [x,y], slit: { x, y0, y1, w } (the crescent of light when cracked) }
export function vaultDoor(ctx, t, o = {}) {
  const x = o.x ?? 960, y = o.y ?? 480, r = o.r ?? 330, a = o.a ?? 1, J = clamp(o.joints ?? 1), shut = clamp(o.shut ?? 1), crack = clamp(o.crack ?? 0);
  const lk = o.lock || { x: x + r * 1.36, y: y + r * .62 };
  ctx.save(); ctx.globalAlpha = a;
  // the frame ring set in the wall: dark steel, a blue rim outside, a hairline of warm light inside (the seam to the door)
  ctx.fillStyle = rad(ctx, x - r * .3, y - r * .4, r * 1.5, [[0, mixHex(P.ind2, P.blue0, .22)], [.7, P.ind2], [1, P.night1]]); ctx.fill(holed({ cx: x, cy: y, r: r * 1.13 }, [{ cx: x, cy: y, rx: r * 1.005 }]));
  ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.arc(x, y, r * 1.13, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = rgba(P.blue1, .8);
  for (let i = 0; i < 16; i++) { const q = i / 16 * Math.PI * 2 + .1; ctx.beginPath(); ctx.arc(x + Math.cos(q) * r * 1.07, y + Math.sin(q) * r * 1.07, r * .012 + 1, 0, 6.29); ctx.fill(); }
  // the door: hinge on the left; open = narrow (seen nearly edge-on), shut = a full disc. sx = projected width share
  const sx = Math.max(.04, Math.sin(shut * Math.PI / 2)) * (1 - .055 * crack), hx = x - r;
  const dcx = hx + r * sx;
  // the slit of light (crack): the crescent between the opening and the door's edge, warm, the brightest thing
  let slit = null;
  if (crack > 0 && shut > .98) {
    const cres = holed({ cx: x, cy: y, r: r * 1.003 }, [{ cx: dcx + 1, cy: y, rx: r * sx, ry: r * .999 }]);
    glowFill(ctx, cres, r * .16, .9 * crack, P.halo1); glowFill(ctx, cres, r * .04, .9 * crack, P.halo0);
    ctx.fillStyle = lin(ctx, x + r * .8, 0, x + r, 0, [[0, P.core0], [1, P.core1]]); ctx.fill(cres);
    halo(ctx, x + r * (1 - .05 * crack), y, r * .9, .25 * crack, P.halo1, P.halo0);
    slit = { x: x + r * (1 - .03 * crack), y0: y - r * .9, y1: y + r * .9, w: r * .055 * crack };
  }
  if (sx < .98) { ctx.fillStyle = P.night0; ctx.beginPath(); ctx.ellipse(dcx + r * .07 * (1 - sx), y, r * sx + r * .02, r * 1.0, 0, 0, 6.29); ctx.fill(); }   // the door's thickness, seen while it swings
  ctx.save(); ctx.translate(hx, y); ctx.scale(sx, 1); ctx.translate(-hx, -y);
  // the door's thickness: a darker band behind the face, offset toward the hinge side while it swings
  const face = new Path2D(); face.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = rad(ctx, x - r * .35, y - r * .45, r * 1.6, [[0, mixHex(P.ind2, P.blue1, .28)], [.45, P.ind2], [1, mixHex(P.night1, P.night0, .5)]]); ctx.fill(face);
  ctx.save(); ctx.clip(face); ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 3 / sx; ctx.beginPath(); ctx.arc(x + 2, y + 2, r - 2, Math.PI * .95, Math.PI * 1.6); ctx.stroke(); ctx.restore();
  // the joints (the reference: rings at 1, .69, .26 of the radius, six spokes between the inner two) carry the light
  const jp = new Path2D();
  for (const k of [.965, .69, .26]) { jp.moveTo(x + r * k, y); jp.arc(x, y, r * k, 0, Math.PI * 2); }
  for (let i = 0; i < 6; i++) { const q = i * Math.PI / 3 + .2; jp.moveTo(x + r * .26 * Math.cos(q), y + r * .26 * Math.sin(q)); jp.lineTo(x + r * .69 * Math.cos(q), y + r * .69 * Math.sin(q)); }
  // dark recess of the joints (always), the light in them (J, breathing very slightly)
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = r * .022; ctx.stroke(jp);
  const br = J * (.92 + .08 * Math.sin(t * .9));
  strokeGlow(ctx, jp, Math.max(1.6, r * .0075), P.halo0, br, r * .025);
  // the hub: a dark boss with a cool rim
  ctx.fillStyle = mixHex(P.night1, P.ind1, .5); ctx.beginPath(); ctx.arc(x, y, r * .16, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .8); ctx.lineWidth = 2 / Math.max(.3, sx); ctx.stroke();
  ctx.restore();
  // the hinge: two dark blocks on the left of the frame
  ctx.fillStyle = mixHex(P.night1, P.ind1, .6);
  for (const dy of [-.55, .55]) { ctx.beginPath(); ctx.roundRect(hx - r * .1, y + dy * r - r * .09, r * .14, r * .18, r * .03); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 1.6; ctx.stroke(); }
  // the lock panel with two fields (two-party authorization): dark plate, blue rim; a field glows warm when a hand is on it
  const la = o.lockA ?? 1, pw = r * .44, ph = r * .3, fx = [lk.x - pw * .25, lk.x + pw * .25];
  if (la > 0) {
    ctx.save(); ctx.globalAlpha = a * la;
    ctx.fillStyle = lin(ctx, 0, lk.y - ph / 2, 0, lk.y + ph / 2, [[0, mixHex(P.ind2, P.blue0, .2)], [1, P.night1]]);
    ctx.beginPath(); ctx.roundRect(lk.x - pw / 2, lk.y - ph / 2, pw, ph, r * .03); ctx.fill(); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.stroke();
    const fs = o.fields || [0, 0];
    fs.forEach((f, i) => {
      const fw = pw * .32, fh = ph * .66, p = new Path2D(); p.roundRect(fx[i] - fw / 2, lk.y - fh / 2, fw, fh, fw * .18);
      ctx.fillStyle = P.night0; ctx.fill(p); ctx.strokeStyle = rgba(mixHex(P.blue0, P.cream, .25), .8); ctx.lineWidth = 1.6; ctx.stroke(p);
      if (f > 0) {
        const hot = clamp(f), col = mixHex(mixHex(P.blue1, P.halo1, .6), P.core1, clamp(hot * 1.3 - .3));
        glowFill(ctx, p, fw * .9, .55 * hot, P.halo1);
        ctx.save(); ctx.globalAlpha = a * la * clamp(hot * 1.6); ctx.fillStyle = rad(ctx, fx[i], lk.y, fh * .7, [[0, P.core0], [.4, col], [1, mixHex(col, P.shade0, .5)]]); ctx.fill(p); ctx.restore();
      }
    });
    ctx.restore();
  }
  ctx.restore();
  return { x, y, r, lock: [lk.x, lk.y], fields: fx.map((xx) => [xx, lk.y]), slit };
}
// the wall round the door, with the round opening cut out (PathOp). door = { x, y, r }; o: { x0, y0, x1, y1, floor }
export function vaultWall(ctx, door, o = {}) {
  const { x, y, r } = door, x0 = o.x0 ?? -2400, x1 = o.x1 ?? 4400, y0 = o.y0 ?? -2000, fl = o.floor ?? y + r * 1.32;
  const wall = holed([x0, y0, x1, fl], [{ cx: x, cy: y, rx: r * 1.005 }]);
  ctx.fillStyle = lin(ctx, 0, y - r * 2, 0, fl, [[0, P.night0], [.55, mixHex(P.night1, P.ind1, .35)], [1, P.night1]]); ctx.fill(wall);
  // faint vertical panel seams (a room, not a sky) and a dado line
  ctx.save(); ctx.clip(wall); ctx.strokeStyle = rgba(P.blue0, .28); ctx.lineWidth = 1.6;
  for (let xx = x - r * 2.6; xx < x1; xx += r * .9) { if (Math.abs(xx - x) < r * 1.2) continue; ctx.beginPath(); ctx.moveTo(xx, y0); ctx.lineTo(xx, fl); ctx.stroke(); }
  ctx.restore();
  // the floor: dark, a blue rim, a soft pool of the door's light
  ctx.fillStyle = lin(ctx, 0, fl, 0, fl + 500, [[0, P.night1], [1, P.night0]]); ctx.fillRect(x0, fl, x1 - x0, 2000);
  ctx.strokeStyle = rgba(P.blue0, .85); ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(x0, fl); ctx.lineTo(x1, fl); ctx.stroke();
  return fl;
}

// ---------------------------------------------------------------------------------------------------------------- the launch room
export const LR = {
  edge: 742, floor: 960, panelTop: 430, panels: [[300, 720], [1200, 1620]],
  slots: [[510, 680], [1410, 680]], screen: { x: 960, y: 590, w: 224, h: 126 }, housing: [826, 1094, 470], lamp: [960, 210],
  officers: [{ x: 760, dir: 1, side: -1 }, { x: 1330, dir: 1, side: 1 }], oh: 410, keyH: 118,
};
const DIALS = (() => { const r = prng(1958), out = []; for (const [p0, p1] of LR.panels) { const d = []; for (let i = 0; i < 9; i++) d.push([lerp(p0 + 40, p1 - 40, i / 8), 560 + (i % 2) * 8, r()]); out.push(d); } return out; })();
// key geometry: tip (local (0, .4)) sits in the slot; rot 0 = upright; turn 1 = 90° clockwise. Returns { x, y (centre), rot, bow }
export function keyPose(slot, h, turn) {
  const rot = turn * Math.PI / 2, c = Math.cos(rot), s = Math.sin(rot);
  const R = (u, v) => [slot[0] + (u * c - v * s) * h - (0 * c - .4 * s) * h, slot[1] + (u * s + v * c) * h - (0 * s + .4 * c) * h];
  const [x, y] = R(0, 0), bow = R(0, -.3);
  return { x, y, rot, bow };
}
// o: { build 0..1 (wall seams draw, consoles rise from the edge line, lamp on), edge 0..1 (the long line grows from the centre out;
//      default 1), edgeWarm 0..1 (the line is still the warm data thread), lamp 0..1,
//      officers 0..1 (they step in from the frame sides to their consoles), officerL / officerR: false to skip one,
//      keys 0..1 (the keys of light grow out of the slots) or keys: [kL, kR] (B3: keys: [1, 0] draws only the left one),
//      turn 0..1 (both turn; or turn: [tL, tR]), lum 0..1 (key light; .2 = sunk into the dark), hands 0..1 (the officers' hands
//      on their keys; a hand is drawn only where that key is drawn), pulse 0..1 (a light pulse runs along the edge from both keys to the centre), measure 0..1 (the cream line
//      between the keys), reach 0..1 (officer L stretches the right arm toward key R: it ends far short), screen 0..1 (the file
//      lights up on the screen), screenFn (ctx, t) drawn inside the screen rect instead of the default file (screen space = W×H),
//      stamp 0..1 ("LATE 1950s"), bg: false (no wall / floor fill: the caller draws its own ground), edgeLine: false (the caller
//      draws the long lit line itself) or edgeLine: (ctx, x0, x1, y) => … (drawn in its place, behind the officers and keys) }
// returns { slots, keys: [{x,y,rot,bow}|null ×2], hands: [[x,y]|null ×2] (wrist positions), screen, edgeY, officers: [[x,y,h]…] }
export function launchRoom(ctx, t, o = {}) {
  const b = clamp(o.build ?? 1), e = clamp(o.edge ?? 1), lampU = clamp(o.lamp ?? b), offU = clamp(o.officers ?? 1);
  const kArr = Array.isArray(o.keys) ? o.keys : [o.keys ?? 0, o.keys ?? 0], tArr = Array.isArray(o.turn) ? o.turn : [o.turn ?? 0, o.turn ?? 0];
  const lum = o.lum ?? 1, handsU = clamp(o.hands ?? 0), reach = clamp(o.reach ?? 0);
  const { edge: EY, floor: FY, panelTop: PT } = LR;
  // ---- wall: flat dark indigo, panel seams draw down from the ceiling (sineIO), a dado rail; a faint cool wash from the lamp
  if (o.bg !== false) { ctx.fillStyle = lin(ctx, 0, -600, 0, EY, [[0, P.night0], [.6, mixHex(P.night1, P.ind1, .3)], [1, mixHex(P.ind1, P.night1, .4)]]); ctx.fillRect(-2400, -1600, 6800, EY + 1600); }
  ctx.save(); ctx.strokeStyle = rgba(P.blue0, .3); ctx.lineWidth = 1.6;
  for (let i = 0; i < 12; i++) { const xx = -560 + i * 280, k = sineIO(span(b, .05 + i * .03, .45 + i * .03)); if (k <= 0) continue; ctx.beginPath(); ctx.moveTo(xx, -1600); ctx.lineTo(xx, lerp(-1600, EY, k)); ctx.stroke(); }
  const rail = sineIO(span(b, .3, .8)); if (rail > 0) { ctx.beginPath(); ctx.moveTo(960 - 2400 * rail, 330); ctx.lineTo(960 + 2400 * rail, 330); ctx.stroke(); }
  ctx.restore();
  // ---- the lamp: a small round cage lamp on the wall, greenish cool when on (never the hero)
  const [lx, ly] = LR.lamp, lampCol = mixHex('#9fe3c6', P.cream, .35);
  ctx.fillStyle = P.night1; ctx.beginPath(); ctx.roundRect(lx - 30, ly - 46, 60, 18, 4); ctx.fill();
  ctx.fillStyle = mixHex(P.night1, lampCol, .15 + .75 * lampU * (.94 + .06 * Math.sin(t * 2.3))); ctx.beginPath(); ctx.arc(lx, ly, 22, 0, 6.29); ctx.fill();
  ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 2.5; for (const dx of [-8, 8]) { ctx.beginPath(); ctx.moveTo(lx + dx, ly - 22); ctx.lineTo(lx + dx, ly + 22); ctx.stroke(); }
  if (lampU > 0) { halo(ctx, lx, ly, 260, .16 * lampU, mixHex(P.blue2, lampCol, .5), lampCol); }
  // ---- the counter (desk): from the edge line down to the floor
  const ex0 = lerp(960, -400, sineIO(e)), ex1 = lerp(960, 2320, sineIO(e));
  ctx.fillStyle = lin(ctx, 0, EY, 0, FY, [[0, mixHex(P.ind2, P.blue0, .12)], [.25, P.ind2], [1, P.night1]]);
  const cb = smooth(span(b, 0, .35)); if (cb > 0) ctx.fillRect(ex0, EY, ex1 - ex0, (FY - EY) * cb);
  if (o.bg !== false) { ctx.fillStyle = lin(ctx, 0, FY, 0, FY + 300, [[0, P.night1], [1, P.night0]]); ctx.fillRect(-2400, FY, 6800, 2000); }
  ctx.strokeStyle = rgba(P.blue0, .7); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-2400, FY); ctx.lineTo(4400, FY); ctx.stroke();
  // ---- console panels rise from the edge (staggered: left, middle housing, right), each with dials, a row of lamps and a lock
  const rise = (i) => expoOut(span(b, .25 + i * .12, .7 + i * .12));
  const panel = (x0, x1, top, k) => { const yy = lerp(EY, top, k); ctx.fillStyle = lin(ctx, 0, yy, 0, EY, [[0, mixHex(P.ind2, P.blue0, .2)], [.12, P.ind2], [1, mixHex(P.ind2, P.night1, .4)]]); ctx.fillRect(x0, yy, x1 - x0, EY - yy); ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x0, EY); ctx.lineTo(x0, yy); ctx.lineTo(x1, yy); ctx.lineTo(x1, EY); ctx.stroke(); return yy; };
  LR.panels.forEach(([x0, x1], i) => {
    const k = rise(i === 0 ? 0 : 2); if (k <= 0) return;
    const yy = panel(x0, x1, PT, k);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, yy, x1 - x0, EY - yy); ctx.clip();
    // dials (three) and a row of small indicator lamps, a grille of slots
    for (let j = 0; j < 3; j++) { const dx = lerp(x0 + 80, x1 - 80, j / 2), dy = PT + 62; ctx.strokeStyle = rgba(P.blue0, .9); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(dx, dy, 30, 0, 6.29); ctx.stroke(); const q = -2.2 + .5 * j + .05 * Math.sin(t * .7 + j); ctx.strokeStyle = rgba(P.cream, .55); ctx.beginPath(); ctx.moveTo(dx, dy); ctx.lineTo(dx + Math.cos(q) * 22, dy + Math.sin(q) * 22); ctx.stroke(); }
    for (const [dx, dy, r1] of DIALS[i]) { ctx.fillStyle = r1 < .2 ? rgba(lampCol, .55 + .2 * Math.sin(t * (.8 + r1) + r1 * 9)) : rgba(P.blue2, .9); ctx.beginPath(); ctx.arc(dx, dy - 400 + PT + 25, 6, 0, 6.29); ctx.fill(); }
    ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 3; for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(x0 + 40, PT + 220 + j * 13); ctx.lineTo(x0 + 150, PT + 220 + j * 13); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x1 - 150, PT + 220 + j * 13); ctx.lineTo(x1 - 40, PT + 220 + j * 13); ctx.stroke(); }
    // the lock: a round brass-dark plate with a slot
    const [sx, sy] = LR.slots[i];
    ctx.fillStyle = mixHex(P.night1, P.ind1, .4); ctx.beginPath(); ctx.arc(sx, sy, 30, 0, 6.29); ctx.fill();
    ctx.strokeStyle = rgba(P.halo1, .35 + .3 * clamp(kArr[i] ?? 0)); ctx.lineWidth = 2.2; ctx.stroke();
    ctx.fillStyle = P.night0; ctx.fillRect(sx - 3, sy - 14, 6, 28);
    ctx.restore();
  });
  // middle housing with the screen
  const hk = rise(1);
  if (hk > 0) {
    const [hx0, hx1, ht] = LR.housing, yy = panel(hx0, hx1, ht, hk), S = LR.screen;
    ctx.save(); ctx.beginPath(); ctx.rect(hx0, yy, hx1 - hx0, EY - yy); ctx.clip();
    screenAt(ctx, t, S, clamp(o.screen ?? 0), o.screenFn);
    ctx.restore();
  }
  // ---- the long edge: a lit line across the room (it was the data thread); a pulse runs along it from both keys to the centre
  if (typeof o.edgeLine === 'function') o.edgeLine(ctx, ex0, ex1, EY);
  else if (e > 0 && o.edgeLine !== false) {
    const warm = clamp(o.edgeWarm ?? 0);
    ctx.save(); ctx.lineCap = 'round';
    ctx.globalCompositeOperation = 'lighter'; ctx.filter = 'blur(6px)'; ctx.strokeStyle = rgba(mixHex(P.blue0, P.halo1, warm), .5 + .3 * warm); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(ex0, EY); ctx.lineTo(ex1, EY); ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = mixHex(mixHex(P.blue0, P.cream, .35), P.halo0, warm); ctx.lineWidth = lerp(2.4, 3.2, warm); ctx.beginPath(); ctx.moveTo(ex0, EY); ctx.lineTo(ex1, EY); ctx.stroke();
  }
  // the pulse along the edge (also over a caller's own edge line)
  const pu = o.pulse ?? 0;
  if (pu > 0 && pu < 1 && e > 0 && o.edgeLine !== false) for (const [sx] of LR.slots) { const px = lerp(sx, 960, expoOut(pu)); halo(ctx, px, EY, 90, .9 * (1 - pu), P.halo1, P.core0); ctx.strokeStyle = rgba(P.core1, .9 * (1 - pu)); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(lerp(sx, px, .6), EY); ctx.lineTo(px, EY); ctx.stroke(); }
  // ---- the measuring line between the keys (4.06): grows from key L to key R; the part one arm can reach stays warm
  const out = { slots: LR.slots, keys: [null, null], hands: [null, null], screen: LR.screen, edgeY: EY, officers: [] };
  const mu = clamp(o.measure ?? 0);
  if (mu > 0) {
    const my = LR.slots[0][1] + 110, [ax] = LR.slots[0], [bx] = LR.slots[1], mx = lerp(ax, bx, sineIO(mu));
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 2.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ax, my); ctx.lineTo(mx, my); ctx.stroke();
    for (const xx of [ax, mx]) { ctx.beginPath(); ctx.moveTo(xx, my - 16); ctx.lineTo(xx, my + 16); ctx.stroke(); }
    ctx.restore();
    out.measureY = my;
  }
  // ---- the keys of light (KEY ANCHOR 2 / 3 only): grow out of their slots, turn together
  const KH = LR.keyH;
  for (let i = 0; i < 2; i++) {
    const ku = clamp(kArr[i] ?? 0); if (ku <= 0) continue;
    const g = expoOut(ku), kp = keyPose(LR.slots[i], KH * g, clamp(tArr[i] ?? 0));
    X.lightKey(ctx, kp.x, kp.y, KH * g, t, { rot: kp.rot, turn: 0, lum: clamp(lum), glow: .55 + .45 * lum, blue: .5, dust: 900, seed: 30 + i, a: clamp(ku * 3) });
    out.keys[i] = keyPose(LR.slots[i], KH, clamp(tArr[i] ?? 0));
  }
  // ---- officers: indigo silhouettes, front view, step in from the frame sides; the hand on the key is a darkHand (with a
  // warm rim from the key); officer L can stretch his right arm toward key R (it ends far short)
  const OH = LR.oh;
  LR.officers.forEach((of, i) => {
    if ((i === 0 && o.officerL === false) || (i === 1 && o.officerR === false)) return;
    const away = (1 - sineIO(offU)) * (i === 0 ? -900 : 900), x = of.x + away, y = FY;
    const walking = offU > 0 && offU < 1;
    const wph = walking ? offU * 9 : null;
    const key = out.keys[i] || keyPose(LR.slots[i], KH, clamp(tArr[i] ?? 0));
    // the near arm to the key: wrist a little short of the bow, along the line from the shoulder
    const sd = of.side, sh = shoulderAt(x, y, OH, of.dir, sd), dx = key.bow[0] - sh[0], dy = key.bow[1] - sh[1], dl = Math.hypot(dx, dy);
    const L = 21, wr = [key.bow[0] - dx / dl * L * .75, key.bow[1] - dy / dl * L * .75];
    const rest = sd > 0 ? [.18, .08] : [-.18, -.08];
    const hk = handsU * offU, onKey = armTo(x, y, OH, of.dir, sd, wr), arm = [lerp(rest[0], onKey[0], sineIO(hk)), lerp(rest[1], onKey[1], sineIO(hk))];
    const fig = { dir: of.dir, light: i === 0 ? 1 : -1, look: .05, long: true, rim: P.blue0 };
    if (walking) Object.assign(fig, { walk: wph, dir: i === 0 ? 1 : -1, view: 'side' });
    else { if (sd > 0) fig.armR = arm; else fig.armL = arm; }
    // officer L reaches: his right arm stretches out toward key R
    if (i === 0 && reach > 0 && !walking) { const tgt = [x + 600, LR.slots[1][1] - 40]; const ext = armTo(x, y, OH, of.dir, 1, tgt); fig.armR = [lerp(.18, ext[0], sineIO(reach)), lerp(.08, ext[1], sineIO(reach))]; }
    const hands = E.person(ctx, x, y, OH, fig);
    out.officers.push([x, y, OH]);
    if (hk > .02 && !walking && (kArr[i] ?? 0) > 0) {
      const pose = [hands.L, hands.R][sd > 0 ? 1 : 0], ang = Math.atan2(key.bow[1] - pose[1], key.bow[0] - pose[0]);
      const m = E.handMatrix(lerp(pose[0], wr[0], sineIO(hk)), lerp(pose[1], wr[1], sineIO(hk)), ang, L * lerp(.6, 1, sineIO(hk)), sd > 0 ? 1 : -1);
      X.darkHand(ctx, m, { pose: 'hold', curl: .1 + .3 * hk, warm: lum * hk * clamp(kArr[i] ?? 0), side: sd > 0 ? -1 : 1 });
      out.hands[i] = wr;
    }
    if (i === 0 && reach > .02 && !walking) {
      const hp = hands.R, ang = Math.atan2(LR.slots[1][1] - 40 - hp[1], 600);
      X.darkHand(ctx, E.handMatrix(hp[0], hp[1], ang, L * .9, 1), { pose: 'open', curl: 0, warm: 0 });
      out.reachHand = hp;
    }
  });
  // ---- the date stamp (4.04)
  const st = clamp(o.stamp ?? 0);
  if (st > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(120, 140 - 40, 600, 52); ctx.clip();
    E.glowText(ctx, 'LATE 1950s', 140, 140 + (1 - expoOut(st)) * 40, { size: 30, spacing: .28, col: rgba(P.cream, .9), glow: false });
    ctx.restore();
  }
  return out;
}
// the console screen: dark glass; s 0..1 = the file lights up (the same picture as plateScreen, scaled into the rect)
export function screenAt(ctx, t, S, s, fn) {
  const x0 = S.x - S.w / 2, y0 = S.y - S.h / 2, k = S.w / W;
  ctx.fillStyle = P.night0; ctx.fillRect(x0 - 6, y0 - 6, S.w + 12, S.h + 12);
  ctx.save(); ctx.translate(x0, y0); ctx.scale(k, k);
  if (fn) fn(ctx, t, s); else screenFile(ctx, t, s);
  ctx.restore();
}
// the content of the screen in screen space (W×H): identical to lib/f14_seams.mjs plateScreen at s = 1 (no setTransform here, so it
// can be drawn into the console). s < 1: the screen is off / warming up (the bezel first, then the file from its outline).
export const PLATE_FILE_B1 = X.fileShape(960, 560, 560, 760, 104);
export function screenFile(ctx, t, s = 1) {
  ctx.save();
  ctx.fillStyle = P.night0; ctx.fillRect(0, 0, W, H);
  const on = clamp(s * 2.5), fileU = clamp(s * 1.6 - .5);
  ctx.fillStyle = rad(ctx, 960, 540, 1150, [[0, mixHex(P.night0, P.ind1, on)], [.55, mixHex(P.night0, P.ind0, on)], [1, P.night0]]); ctx.beginPath(); ctx.roundRect(46, 34, W - 92, H - 68, 26); ctx.fill();
  ctx.strokeStyle = rgba(P.blue0, .85 * (.35 + .65 * on)); ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = lin(ctx, 46, 34, 900, 700, [[0, rgba(P.cream, .05 * on)], [1, rgba(P.cream, 0)]]); ctx.fill();
  if (fileU > 0) {
    const F = PLATE_FILE_B1, y = 2 * E.drift(t, 1, 4);
    ctx.translate(0, y);
    ctx.save(); ctx.globalAlpha = fileU; ctx.filter = 'blur(28px)'; ctx.fillStyle = rgba(P.halo1, .28); ctx.fill(F.path); ctx.restore();
    ctx.save(); ctx.globalAlpha = fileU;
    ctx.fillStyle = lin(ctx, 0, F.rect[1], 0, F.rect[3], [[0, mixHex(P.ind2, P.halo1, .22)], [1, mixHex(P.ind1, P.halo1, .12)]]); ctx.fill(F.path);
    ctx.fillStyle = rgba(P.halo0, .35); ctx.fill(F.fold);
    ctx.restore();
    ctx.save(); ctx.globalAlpha = clamp(fileU * 2); ctx.strokeStyle = rgba(P.core0, .95); ctx.lineWidth = 2.6; ctx.lineJoin = 'round'; ctx.stroke(F.path); ctx.restore();
    if (fileU > .3) X.numberField(ctx, t, { gather: 1, file: F, onlyFile: true, size: 20, a: clamp((fileU - .3) / .7) });
    ctx.font = '600 22px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = rgba(P.halo0, .9 * fileU);
    ctx.fillText('THE WEIGHTS', 960, F.rect[1] - 26);
  }
  ctx.restore();
}
