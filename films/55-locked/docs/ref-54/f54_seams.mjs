// Film 54 · THE HALL OF RELICS (the one world of the film) + the seam plates between the builder groups (owned by the lead; builders
// import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it (the
// plate becomes a thing of the hall, never a blend). Both call it with the same (t, T): the seam is invisible by construction.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet54.mjs <dir>
//
//   Lead → B1 at T.G("He didn't invent it") (c01 → c02): plateRoadshow   THE WALL PANEL AND THE LECTERN. The quote card has folded into
//            the drawn video frame IPO ROADSHOW VIDEO · NOV 10, 2026 on the dark wall panel (left of centre); right, the reading lectern
//            with the CLOSED essay under its cream lamp. Camera RS_CAM. B1 (1:11): glides right to the lectern, the essay opens.
//   B1 → B2  at T.G('The third disease answers fast') (c05 → c06): plateMind   VITRINE 3 (MENTAL ILLNESS). The quiet ring specimen in
//            its mint glass, the plaque MENTAL ILLNESS, V4's edge dim at the right; the board top left (CANCER ✓, HEART ½, MIND lights on
//            this phrase). The QR window of subscribe 1 is open: the top-right corner is dark wall. Camera MIND_CAM.
//   B2 → B3  at T.G('He even warned of a jam') (c09 → c10): plateKiosk   THE MEDIA KIOSK. The podcast screen dark (a cream play mark),
//            the bench in front, the audio-guide post at the right edge, board complete (✓ ½ ? ✗). Camera KIOSK_CAM. B3: into the screen → C2.
//
// THE HALL (design px on the F0 card; cam3() = thumbnail A: vitrine 1 right of centre, you small in front of it, the thesis left):
//   x  −820 the plague mask vitrine (a RELIC: faded cream light) · −160 the diorama A DOCTOR'S OFFICE · 2026 (warm practical lamp)
//      1440 V1 CANCER (the cell) · 2440 V2 HEART DISEASE · 3440 V3 MENTAL ILLNESS · 4440 V4 ALZHEIMER'S (glass 660 × 690, bottom y 800)
//      4900–6300 the wall panel (quote cards C1 / C1b, the roadshow frame at 5600) · 6650 the lectern (the essay) · 7300 the media kiosk
//      (C3, C2) · 7900 the audio-guide post (C5). Floor (feet) y ≈ 925; plinths end at y ≈ 897.
//   Back wall Z_WALL 2600: tall arched windows with cool moonlight, a lit doorway between V2 and V3 (subscribe 1: the hospital room).
//   Foreground Z 1150: dark stanchions with a sagging rope (parallax), low in the frame.
// hallWorld(ctx, c, t, st) st (all optional):
//   moon 0..1 (window light, default .75) · door 0..1 (the lit doorway) · v(i) → { glow, spec: { a, ghost, relic }, inside(ctx, w, h) }
//   plaque(i) → { name, q, a } (default: the name) · diorama { lit, relic, inside(ctx, w, h) } · plague { a }
//   panel(ctx) (drawn on the wall panel, design px) · frame { u, cap, a } (the roadshow frame) · lectern { lamp, open, lens }
//   kiosk { glow, screen(ctx, w, h) } · post { lit } · du { x, h, o } | false · kids [{ x, h, walk, dir, look, a }] · extra(ctx) (F0 card)
//   fg (stanchions, default true) · back(ctx) (extra on the wall card)
import { Path2D } from '@napi-rs/canvas';
import * as E from './f10_editorial.mjs';
import * as F from './f54_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const { MINT, COOL, LAMP, RELIC, INK, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
const tr = (k) => TRUCK * (k - 1) / CREEP;

// ================================================================================================================= THE HALL
export const Z_WALL = 2600, Z_FG = 1150, FLOOR = 925;
export const HALL = {
  plague: { x: -820, y: 800, w: 420, h: 520 },
  diorama: { x: -160, y: 800, w: 760, h: 470 },
  V: [
    { x: 1440, kind: 'cell', name: 'CANCER', short: 'CANCER' },
    { x: 2440, kind: 'heart', name: 'HEART DISEASE', short: 'HEART' },
    { x: 3440, kind: 'mind', name: 'MENTAL ILLNESS', short: 'MIND' },
    { x: 4440, kind: 'brain', name: "ALZHEIMER'S", short: "ALZHEIMER'S" },
  ],
  vy: 800, vw: 660, vh: 690, plinth: 97, plaque: { dy: 48, s: 260 },
  door: 2940,
  panel: { x0: 4900, x1: 6300, y0: 140, y1: 860 },
  frame: { x: 5600, y: 470, w: 640, h: 360 },
  lectern: { x: 6650, y: 900, s: 420 },
  kiosk: { x: 7300, y: 900, s: 520 },
  post: { x: 7900, y: 900, s: 300 },
  du: { x: 1000, y: FLOOR, h: 190 },
};
// where an object of the F0 card at x sits on a card at depth Z when the camera is centred on it (to line up the back wall)
export const hallX = (Z, x) => W / 2 + (x - W / 2) * F0 / Z;
// glass rect of vitrine i (design px, F0 card) · plaque centre of vitrine i · the roadshow frame rect · the kiosk screen rect
export const glassOf = (i) => { const v = HALL.V[i]; return { x: v.x - HALL.vw / 2, y: HALL.vy - HALL.vh, w: HALL.vw, h: HALL.vh, cx: v.x, cy: HALL.vy - HALL.vh / 2 }; };
export const plaqueOf = (i) => ({ x: HALL.V[i].x, y: HALL.vy + HALL.plaque.dy, s: HALL.plaque.s, h: HALL.plaque.s * .36 });
export const frameRect = () => { const f = HALL.frame; return { x: f.x - f.w / 2, y: f.y - f.h / 2, w: f.w, h: f.h }; };
export const kioskScreen = () => { const k = HALL.kiosk, s = k.s, sh = s * .5625; return { x: k.x - s / 2, y: k.y - s * .55 - sh, w: s, h: sh }; };
export const postSpeaker = () => { const p = HALL.post; return { x: p.x, y: p.y - p.s * .82, r: p.s * .11 }; };
export const dioramaGlass = () => { const d = HALL.diorama; return { x: d.x - d.w / 2, y: d.y - d.h, w: d.w, h: d.h }; };

const WINDOWS = (() => { const out = []; const dx = hallX(Z_WALL, HALL.door); for (let x = -2600; x <= 9400; x += 700) if (Math.abs(x - dx) > 330) out.push(x); return out; })();
const WPATH = new Map(), archPath = (x0, y0, w, h) => { const k = `${x0}:${y0}:${w}:${h}`; if (!WPATH.has(k)) { const g = new Path2D(); g.moveTo(x0, y0 + h); g.lineTo(x0, y0 + w / 2); g.arc(x0 + w / 2, y0 + w / 2, w / 2, Math.PI, 0); g.lineTo(x0 + w, y0 + h); g.closePath(); WPATH.set(k, g); } return WPATH.get(k); };
const MOTES = (() => { const r = prng(5454), a = []; for (let k = 0; k < 70; k++) a.push([r(), r(), r(), r() * TAU]); return a; })();
export function hallWorld(ctx, c, t, st = {}) {
  const moon = clamp(st.moon ?? .75);
  // the dark of the hall (screen space): nothing outside the cards is ever empty
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.55, mixHex(P.night1, P.ind0, .35)], [1, P.night0]]); ctx.fillRect(0, 0, W, H); ctx.restore();
  // the back wall: arched windows, pilasters, moonlight shafts, the doorway; its floor
  E.card(ctx, c, Z_WALL, () => {
    ctx.fillStyle = lin(ctx, 0, -900, 0, 700, [[0, P.night0], [.6, mixHex(P.night1, P.ind2, .55)], [1, mixHex(P.ind2, P.blue1, .18)]]); ctx.fillRect(-4000, -2400, 16000, 3100);
    ctx.fillStyle = rgba(INK.rim, .12); ctx.fillRect(-4000, 20, 16000, 3); ctx.fillRect(-4000, 640, 16000, 2);
    for (const x of WINDOWS) {
      ctx.fillStyle = rgba(mixHex(P.ind2, P.blue1, .5), .45); ctx.fillRect(x + 300, 40, 56, 600);   // pilaster
      const wx = x - 110, wy = 90, ww = 220, wh = 470;
      const g = archPath(wx, wy, ww, wh);
      ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.ind1, COOL.halo, .32 * moon)], [1, mixHex(P.ind0, COOL.body, .16 * moon)]]); ctx.fill(g);
      ctx.strokeStyle = rgba(P.night0, .85); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy + 12); ctx.lineTo(wx + ww / 2, wy + wh); for (let k = 1; k < 4; k++) { ctx.moveTo(wx, wy + ww / 2 + k * (wh - ww / 2) / 4); ctx.lineTo(wx + ww, wy + ww / 2 + k * (wh - ww / 2) / 4); } ctx.stroke();
      ctx.strokeStyle = rgba(P.night0, .9); ctx.lineWidth = 14; ctx.stroke(g);
      // the moonlight shaft: from the window down-left onto the floor
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = lin(ctx, wx, wy + wh, wx - 260, 1120, [[0, rgba(COOL.halo, .075 * moon)], [1, rgba(COOL.halo, 0)]]);
      ctx.beginPath(); ctx.moveTo(wx, wy + ww / 2); ctx.lineTo(wx + ww, wy + ww / 2); ctx.lineTo(wx + ww - 300, 1120); ctx.lineTo(wx - 360, 1120); ctx.closePath(); ctx.fill(); ctx.restore();
    }
    // the doorway (subscribe 1): a tall arch with warm practical light from a corridor
    const dx = hallX(Z_WALL, HALL.door), du = clamp(st.door ?? 0);
    const dp = archPath(dx - 120, 140, 240, 500);
    ctx.fillStyle = mixHex(P.night0, mixHex(LAMP.body, P.ind2, .35), .15 + .75 * du); ctx.fill(dp);
    if (du > 0) { halo(ctx, dx, 520, 420, .35 * du, LAMP.body, LAMP.core); ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = lin(ctx, 0, 640, 0, 980, [[0, rgba(LAMP.body, .16 * du)], [1, rgba(LAMP.body, 0)]]); ctx.beginPath(); ctx.moveTo(dx - 120, 640); ctx.lineTo(dx + 120, 640); ctx.lineTo(dx + 260, 980); ctx.lineTo(dx - 260, 980); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = rgba(INK.rim, .3); ctx.lineWidth = 4; ctx.stroke(dp);
    // the floor between the wall and the vitrines (polished: the windows and the mint glows reflect in it)
    ctx.fillStyle = lin(ctx, 0, 640, 0, 1300, [[0, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]); ctx.fillRect(-4000, 642, 16000, 1200);
    for (const x of WINDOWS) { ctx.fillStyle = rgba(COOL.halo, .05 * moon); ctx.fillRect(x - 80, 660, 160, 140); }
    if (st.back) st.back(ctx);
  });
  // the F0 card: the floor in front, the exhibits, the people
  E.card(ctx, c, F0, () => {
    ctx.fillStyle = lin(ctx, 0, 870, 0, 1500, [[0, rgba(mixHex(P.night1, P.ind1, .35), 0)], [.12, mixHex(P.night1, P.ind1, .35)], [1, P.night0]]); ctx.fillRect(-3000, 870, 13000, 1000);
    // the plague mask (a relic): faded cream light, no mint
    const pl = HALL.plague, plA = st.plague?.a ?? 1;
    F.vitrine(ctx, t, pl.x, pl.y, pl.w, pl.h, { glow: .45 * plA, relic: true, inside: (cx, w, h) => F.plagueMask(cx, t, w * .45, h * .97, h * .42) });
    F.plaque(ctx, t, pl.x, pl.y + 46, 220, { name: 'THE PLAGUE', sub: 'A RELIC' });
    // the diorama: a doctor's office, 2026
    const dg = HALL.diorama, dio = st.diorama || {};
    F.diorama(ctx, t, dg.x, dg.y, dg.w, dg.h, { lit: dio.lit ?? .6, glass: 1, inside: dio.inside || ((cx, w, h) => officeRoom(cx, t, w, h, { lit: dio.lit ?? .6, relic: dio.relic ?? 0 })) });
    F.plaque(ctx, t, dg.x, dg.y + 50, 250, { name: "A DOCTOR'S OFFICE", sub: '2026', a: dio.plaque ?? 1 });
    // the four vitrines
    HALL.V.forEach((v, i) => {
      const o = (st.v && st.v(i)) || {}, g = o.glow ?? (i ? .82 : 1), sp = o.spec || {};
      F.vitrine(ctx, t, v.x, HALL.vy, HALL.vw, HALL.vh, { glow: g, plinth: HALL.plinth, inside: o.inside || ((cx, w, h) => F.specimen(cx, t, v.kind, w / 2, h * .47, v.kind === 'cell' ? w * .27 : v.kind === 'mind' ? w * .3 : w * .26, { seed: 54 + i, ...sp })) });
      const pq = plaqueOf(i), po = (st.plaque && st.plaque(i)) || {};
      F.plaque(ctx, t, pq.x, pq.y, pq.s, { name: po.name ?? v.name, q: po.q ?? 0, a: po.a ?? 1 });
    });
    // the wall panel (quote cards), the roadshow frame
    const pn = HALL.panel;
    halo(ctx, (pn.x0 + pn.x1) / 2, pn.y0 + 40, 700, .12, LAMP.body, LAMP.core);
    ctx.fillStyle = lin(ctx, 0, pn.y0, 0, pn.y1, [[0, mixHex(P.night1, P.ind2, .7)], [1, mixHex(P.night0, P.ind2, .4)]]); ctx.fillRect(pn.x0, pn.y0, pn.x1 - pn.x0, pn.y1 - pn.y0);
    ctx.fillStyle = rgba(LAMP.core, .5); ctx.fillRect(pn.x0 + 260, pn.y0 - 14, pn.x1 - pn.x0 - 520, 6);   // the picture light
    ctx.fillStyle = lin(ctx, 0, pn.y0, 0, pn.y0 + 260, [[0, rgba(LAMP.body, .1)], [1, rgba(LAMP.body, 0)]]); ctx.fillRect(pn.x0, pn.y0, pn.x1 - pn.x0, 260);
    ctx.strokeStyle = rgba(P.cream, .14); ctx.lineWidth = 2; ctx.strokeRect(pn.x0, pn.y0, pn.x1 - pn.x0, pn.y1 - pn.y0);
    ctx.fillStyle = P.night0; ctx.fillRect(pn.x0 + 40, pn.y1, 30, FLOOR - pn.y1); ctx.fillRect(pn.x1 - 70, pn.y1, 30, FLOOR - pn.y1);
    if (st.frame) roadshowFrame(ctx, t, st.frame);
    if (st.panel) st.panel(ctx);
    // the lectern (the essay), the media kiosk, the audio-guide post
    const L = HALL.lectern, lo = st.lectern || {};
    F.lectern(ctx, t, L.x, L.y, L.s, { lamp: lo.lamp ?? 1, book: (cx, x, y, w) => F.essay(cx, t, x - w * .25 * (1 - Math.min(1, (lo.open ?? 0) * 2)), y - w * .2, w, { open: lo.open ?? 0, lens: lo.lens }) });
    const K = HALL.kiosk, ko = st.kiosk || {};
    F.kiosk(ctx, t, K.x, K.y, K.s, { glow: ko.glow ?? .45, screen: ko.screen });
    const PO = HALL.post; F.audioPost(ctx, t, PO.x, PO.y, PO.s, { lit: st.post?.lit ?? .3 });
    for (const k of st.kids || []) { const ky = FLOOR + (k.dy ?? 40); F.halo(ctx, k.x, ky - k.h * .4, k.h * 1.1, .1, LAMP.body, LAMP.core); E.person(ctx, k.x, ky, k.h ?? 112, { pose: k.walk != null ? 'walk' : 'stand', walk: k.walk, dir: k.dir ?? -1, look: k.look ?? .2, light: k.light ?? 1, back: .75, rim: mixHex(P.blue1, LAMP.body, .5), a: k.a }); }
    if (st.du !== false) { const d = st.du || {}; E.du(ctx, d.x ?? HALL.du.x, FLOOR, d.h ?? HALL.du.h, { look: .7, light: 1, back: .45, ...(d.o || {}) }); }
    if (st.extra) st.extra(ctx);
  });
  // the foreground: dark stanchions with a sagging rope (parallax), low in the frame
  const fgM = E.cardM(c, Z_FG), fgA = fgM ? 1 - span(fgM.k, 1.5, 2.3) : 0;   // the rope fades when the camera comes too close to it
  if (st.fg !== false && fgA > 0) E.card(ctx, c, Z_FG, () => {
    ctx.globalAlpha *= fgA;
    for (let x = -2200; x <= 9600; x += 640) {
      ctx.fillStyle = mixHex(P.night0, P.ind0, .3); ctx.fillRect(x - 7, 1010, 14, 170); ctx.beginPath(); ctx.ellipse(x, 1010, 16, 9, 0, 0, TAU); ctx.fill();
      ctx.fillStyle = rgba(INK.rim, .35); ctx.fillRect(x - 7, 1012, 3, 160);
      ctx.strokeStyle = mixHex(P.night0, P.ind1, .4); ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(x + 8, 1020); ctx.quadraticCurveTo(x + 320, 1090, x + 632, 1020); ctx.stroke();
    }
  });
}
// slow dust motes in a light (design px of the current card): x, y, w, h box, a
export function motes(ctx, t, x, y, w, h, a = 1, col = MINT.core) {
  for (const [u, v, s, ph] of MOTES) { const px = x + ((u + t * .006 * (s - .5)) % 1 + 1) % 1 * w, py = y + ((v - t * .01 * (.4 + s)) % 1 + 1) % 1 * h, al = a * (.25 + .5 * s) * (.6 + .4 * Math.sin(t * .8 + ph));
    ctx.fillStyle = rgba(col, al); ctx.fillRect(px, py, 1.6 + s * 1.6, 1.6 + s * 1.6); }
}

// ================================================================================================================= THE DIORAMA: A DOCTOR'S OFFICE
// Local px (w × h ≈ 760 × 470). o { lit (the desk lamp), relic 0..1 (the colours fade to cream-grey: a thing of the past), doctor 0..1
// (sits down: 0 standing → 1 seated behind the desk), loved { a }, you { a, hand } (you beside the loved one, a hand on the shoulder),
// cards [[word, u (fall 0..1), old 0..1, k (slot 0..3)]], extra(ctx) }
export const OFFICE = { desk: { x0: 150, x1: 640, y: 300 }, doctor: { x: 470, h: 300 }, loved: { x: 250, seat: 360, h: 330 }, you: { x: 118, h: 300 } };
export function officeRoom(ctx, t, w, h, o = {}) {
  const lit = clamp(o.lit ?? 1), rel = clamp(o.relic ?? 0), D = OFFICE.desk;
  const warm = mixHex(LAMP.body, RELIC.body, rel), wallC = mixHex(mixHex(P.ind2, LAMP.deep, .3 * lit), RELIC.deep, rel * .6);
  ctx.fillStyle = lin(ctx, 0, 0, 0, h, [[0, mixHex(wallC, P.night0, .35)], [.62, wallC], [1, P.night1]]); ctx.fillRect(0, 0, w, h);
  // a window with night blinds (left back), a certificate frame, a shelf
  ctx.fillStyle = mixHex(P.ind0, P.blue0, .25 * (1 - rel)); ctx.fillRect(w * .07, h * .12, w * .2, h * .3);
  for (let k = 0; k < 7; k++) { ctx.fillStyle = rgba(mixHex(P.night1, warm, .25), .8); ctx.fillRect(w * .07, h * .12 + k * h * .045, w * .2, h * .02); }
  ctx.strokeStyle = rgba(P.night0, .8); ctx.lineWidth = 6; ctx.strokeRect(w * .07, h * .12, w * .2, h * .3);
  ctx.fillStyle = rgba(warm, .25); ctx.fillRect(w * .62, h * .14, w * .1, h * .12); ctx.strokeStyle = rgba(P.night0, .7); ctx.lineWidth = 4; ctx.strokeRect(w * .62, h * .14, w * .1, h * .12);
  ctx.fillStyle = rgba(P.night0, .55); ctx.fillRect(w * .78, h * .22, w * .18, h * .02);
  for (let k = 0; k < 6; k++) { ctx.fillStyle = mixHex(P.ind2, warm, .15 + .08 * (k % 3)); ctx.fillRect(w * .79 + k * w * .025, h * .22 - h * (.06 + .02 * (k % 2)), w * .018, h * (.06 + .02 * (k % 2))); }
  // the desk lamp: the practical light of the room (cream, warm)
  const lx = D.x1 - 60, ly = D.y - 70;
  halo(ctx, lx, ly + 40, w * .55, .42 * lit, warm, LAMP.core);
  // the doctor (indigo, no face) sits down behind the desk: he lowers, the desk hides his legs
  const sit = sineIO(clamp(o.doctor ?? 1)), dh = OFFICE.doctor.h;
  const talk = sit * Math.sin(t * 1.25), talk2 = sit * Math.sin(t * .9 + 1);   // he talks with his hands (slow)
  E.person(ctx, OFFICE.doctor.x, D.y + 40 + sit * dh * .36, dh, { look: .05 + .04 * talk2, lean: .03 * talk2, dir: -1, light: -1, back: .25, long: true, armR: [lerp(.2, .9, sit) + .12 * talk, lerp(.1, 1.5, sit) + .2 * talk], armL: [lerp(-.2, -.6, sit) - .06 * talk2, lerp(-.1, -1.2, sit) - .1 * talk2] });
  // the desk: a dark top lit by the lamp, a front panel
  ctx.fillStyle = lin(ctx, 0, D.y, 0, D.y + 14, [[0, mixHex(P.night1, warm, .35 * lit)], [1, P.night1]]); ctx.fillRect(D.x0 - 20, D.y, D.x1 - D.x0 + 40, 14);
  ctx.fillStyle = lin(ctx, 0, D.y + 14, 0, h, [[0, mixHex(P.night1, P.ind2, .5)], [1, P.night0]]); ctx.fillRect(D.x0, D.y + 14, D.x1 - D.x0, h - D.y - 14);
  ctx.fillStyle = mixHex(P.night0, P.ind2, .6); ctx.beginPath(); ctx.moveTo(lx - 22, D.y); ctx.lineTo(lx - 6, ly); ctx.lineTo(lx + 30, ly - 10); ctx.lineTo(lx + 40, ly + 8); ctx.lineTo(lx, ly + 6); ctx.lineTo(lx - 8, D.y); ctx.closePath(); ctx.fill();
  ctx.fillStyle = rgba(LAMP.core, .9 * lit); ctx.beginPath(); ctx.ellipse(lx + 30, ly + 8, 16, 4, -.3, 0, TAU); ctx.fill();
  // the word cards on the desk (falling in from above, landing flat; they yellow as they age)
  for (const [word, u, old, k] of o.cards || []) {
    if (u <= 0) continue; const e = clamp(u), land = expoOut(span(e, .55, 1)), fall = clamp(e / .55);
    const tx = D.x0 + 70 + k * 110, ty = D.y - 6 - (k % 2) * 3, x = lerp(tx + 30 * (k - 1.5), tx, fall), y = lerp(-80, ty, fall * fall);
    F.wordCard(ctx, t, x, y, 104, word, { rot: lerp(.5 * (k % 2 ? -1 : 1), (k - 1.5) * .05, fall), flat: land, old: clamp(old) });
  }
  // the loved one (back view, seated: clipped at the chair seat), the chair back in front
  const lo = o.loved || {}, L = OFFICE.loved;
  if ((lo.a ?? 1) > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, L.seat); ctx.clip();
    E.person(ctx, L.x, L.seat + L.h * .44, L.h, { view: 'back', look: .1 + .05 * Math.sin(t * .7), lean: -.02 + .015 * Math.sin(t * .5), dir: 1, light: 1, back: .5, a: lo.a ?? 1 });
    ctx.restore();
    ctx.fillStyle = mixHex(P.night0, P.ind1, .35); ctx.beginPath(); ctx.roundRect(L.x - 62, L.seat - 40, 124, h - L.seat + 50, 14); ctx.fill();
    ctx.fillStyle = rgba(warm, .14 * lit); ctx.fillRect(L.x - 62, L.seat - 40, 124, 4);
  }
  // you beside them, a hand on their shoulder (the yellow coat: the only warm colour person)
  const yo = o.you || {};
  if ((yo.a ?? 0) > 0) { const hand = clamp(yo.hand ?? 1); E.du(ctx, OFFICE.you.x, h - 6, OFFICE.you.h, { view: 'back', dir: 1, look: .1, light: 1, back: .4, a: yo.a, armR: [lerp(.2, 1.05, hand), lerp(.1, 1.55, hand)] }); }
  if (o.extra) o.extra(ctx);
  // age: a cream-grey veil as the room becomes a relic
  if (rel > 0) { ctx.fillStyle = rgba(RELIC.body, .18 * rel); ctx.fillRect(0, 0, w, h); }
}

// ================================================================================================================= THE ROADSHOW FRAME
// The drawn video frame on the wall panel (the quote card C1 folds into it, 1:00). No footage, no person: a dark screen, a cream play
// mark, the caption IPO ROADSHOW VIDEO · NOV 10, 2026. o { u 0..1 (the frame draws: outline then fill), cap 0..1 (caption rises), a, inner(ctx, w, h) }
export function roadshowFrame(ctx, t, o = {}) {
  const u = clamp(o.u ?? 1), a = o.a ?? 1; if (u <= 0 || a <= 0) return;
  const R = frameRect();
  ctx.save(); ctx.globalAlpha *= a;
  const fill = span(u, .45, 1);
  if (fill > 0) {
    ctx.save(); ctx.globalAlpha *= fill; ctx.beginPath(); ctx.roundRect(R.x, R.y, R.w, R.h, 10); ctx.clip();
    ctx.fillStyle = lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex(P.ind1, COOL.deep, .35)], [1, P.night0]]); ctx.fillRect(R.x, R.y, R.w, R.h);
    const by = R.y + ((t * .07) % 1) * R.h; ctx.fillStyle = rgba(P.cream, .03); ctx.fillRect(R.x, by - 30, R.w, 60);
    if (o.inner) { ctx.save(); ctx.translate(R.x, R.y); o.inner(ctx, R.w, R.h); ctx.restore(); }
    const cx = R.x + R.w / 2, cy = R.y + R.h / 2 - 16;
    ctx.fillStyle = rgba(P.cream, .75); ctx.beginPath(); ctx.moveTo(cx - 22, cy - 28); ctx.lineTo(cx + 30, cy); ctx.lineTo(cx - 22, cy + 28); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(P.cream, .25); ctx.fillRect(R.x + 40, R.y + R.h - 46, R.w - 80, 3); ctx.fillStyle = rgba(MINT.line, .8); ctx.fillRect(R.x + 40, R.y + R.h - 46, (R.w - 80) * (.3 + .02 * Math.sin(t * .3)), 3);
    ctx.restore();
  }
  // the outline draws itself clockwise from the top-left corner
  const per = 2 * (R.w + R.h), d = per * span(u, 0, .6), pts = [[R.x, R.y], [R.x + R.w, R.y], [R.x + R.w, R.y + R.h], [R.x, R.y + R.h], [R.x, R.y]];
  ctx.strokeStyle = rgba(P.cream, .85); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(R.x, R.y); let acc = 0;
  for (let i = 1; i < pts.length && acc < d; i++) { const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]), f = Math.min(1, (d - acc) / L); ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); acc += L; }
  ctx.stroke();
  const cu = F.rise(clamp(o.cap ?? 1));
  if (cu > 0) { F.maskLine(ctx, [['IPO ROADSHOW VIDEO', 0]], R.x, R.y - 22, 24, cu, { serif: false, weight: 600, col: P.cream, glow: false });
    F.maskLine(ctx, [['NOV 10, 2026', 0]], R.x + R.w, R.y - 22, 24, cu, { serif: false, weight: 600, col: P.halo2, glow: false, align: 'right' }); }
  ctx.restore();
}

// ================================================================================================================= THE PLATES
// 1 · Lead → B1: the wall panel with the roadshow frame + the lectern with the closed essay
export const RS_CAM = E.aim(F0, 6120, 560, .9);
export function plateRoadshow(ctx, t, T) {
  const k = creep(t, T, "He didn't invent it");
  hallWorld(ctx, E.aim(F0, 6120 + tr(k), 560, .9 * k), t, { frame: { u: 1, cap: 1 }, lectern: { lamp: 1, open: 0 }, du: false });
}
// 2 · B1 → B2: vitrine 3 (MENTAL ILLNESS), the board top left, the QR corner (top right) dark wall
export const MIND_CAM = E.aim(F0, 3440, 500, 1.15, 860, 560);
export function plateMind(ctx, t, T) {
  const k = creep(t, T, 'The third disease answers fast');
  hallWorld(ctx, E.aim(F0, 3440 + tr(k), 500, 1.15 * k, 860, 560), t, { moon: .6, du: false, v: (i) => (i === 3 ? { glow: .35 } : {}) });
  F.board(ctx, t, T);
}
// 3 · B2 → B3: the media kiosk (dark screen, play mark), the bench, the audio-guide post at the right, board complete
export const KIOSK_CAM = E.aim(F0, 7360, 560, 1.05);
export function plateKiosk(ctx, t, T) {
  const k = creep(t, T, 'He even warned of a jam');
  hallWorld(ctx, E.aim(F0, 7360 + tr(k), 560, 1.05 * k), t, { kiosk: { glow: .5 }, du: false });
  F.board(ctx, t, T);
}

// ================================================================================================================= THE END SCREEN (c13, last 15 s)
// The hall wide and calm: the four vitrines in a low row, the warm doorway between HEART and MIND. The YouTube end-screen elements sit on
// the dark upper wall (END_TILES, screen px) and the subscribe circle sits in the doorway. Nothing moves there but drift, motes and breath.
export const END_CAM = E.aim(F0, 2940, 120, .36);
export const END_TILES = { left: { x: 100, y: 130, w: 720, h: 405 }, right: { x: 1100, y: 130, w: 720, h: 405 }, subscribe: { x: 960, y: 620, r: 90 } };
