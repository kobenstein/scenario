// Film 26 · the two places the film lives in + the seam plates between the builder groups (owned by the lead; builders import, never edit).
//
// ONE CAMERA SPACE FOR BOTH PLACES. The hill and the street are two sets of near layers in front of the SAME sky and the SAME far city
// (lib/f26_kit.mjs sky() + city(), same design coordinates). So a SKY DOOR is simple and exact: the camera rises until the near layers are
// below the frame (only stars + the tops of the far city are in view: SKY_CAM or anything with cam.y <= SKY_Y), the world switches on any
// frame up there, and the camera comes down over the other place. Both worlds must call city() with the same options at the switch
// (default options; deck/winA only differ in c11). No cut, no flood, no blend: the frame at the switch is identical by construction.
//
// A PLATE is the exact picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it.
// Plates creep (CREEP 3 %/s push from T0 − .5) and truck right (TRUCK 24 px/s); the receiving side continues both, then takes over.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet26.mjs <dir>
//
//   Lead → B1 at T.G('And behind that picture') (c01 → c02): plateCondition   ABOVE THE ROOFS. Your street from above the roof line, the far
//            city behind, the night sky; across the sky a GOLD CONDITION LINE (a thin rule of light) with Musk's words above it:
//            “If any of the things that we’ve said are true …”. Camera COND_CAM. B1 (2.01): the argument is built on that line.
//   B1 → B2  at T.G('Someone pays you an income', 1) (c04 → c05): plateMailbox   YOUR STREET, THE MAILBOX. The older you stands at the
//            mailbox at the curb, the lid open, nothing inside; the street lamps, your window lit above. Test card top right with line 3
//            lifting as the headline (testCard does that by itself). Camera MAIL_CAM.
//   B2 → B3  at T.G("If he's wrong, you're still fine", 1) (c07 → c08): platePiggy   THE HILL AGAIN. Thumbnail A without the title: the
//            giant cracked piggy, the coins rising, you small at its feet looking up; test card top right, line 5 lifting. Camera HILL_CAM.
import * as E from './f10_editorial.mjs';
import * as F from './f26_kit.mjs';
const { P, W, H, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, rad, prng } = E;
const F0 = E.F0, TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const seamWindow = (t, T0) => t >= T0 - SEAM_HALF && t < T0 + SEAM_HALF;
export const CREEP = .03, TRUCK = 24;
// creep factor k (1 at T0 − .5, growing 3 %/s) and the truck offset that goes with it
export const creepAt = (t, T0) => 1 + CREEP * Math.max(0, t - (T0 - SEAM_HALF));
export const truckAt = (t, T0) => TRUCK * Math.max(0, t - (T0 - SEAM_HALF));
// a plate camera: design point (u, v) of card Z at screen centre, magnification s · creep, trucking right
export const plateCam = (t, T0, Z, u, v, s) => E.aim(Z, u + truckAt(t, T0) / (s * creepAt(t, T0)), v, s * creepAt(t, T0));

// ================================================================================================================= CAMERAS (design px on F0)
export const HOME = E.aim(F0, 960, 540, 1);
export const SKY_GLOW = [1300, 120, 1300];                  // the one sky glow both places share (a sky door needs identical skies)
export const SKY_Y = -1500;                                  // any camera aimed at F0 y <= SKY_Y (s ≈ 1) sees only sky + the far city tops
export const SKY_CAM = E.aim(F0, 960, SKY_Y, 1);
export const HILL_CAM = E.aim(F0, 960, 540, 1);              // thumbnail A
export const STREET_CAM = E.aim(F0, 1000, 560, 1);          // the whole street front (house A + B, sidewalk)
export const COND_CAM = E.aim(F0, 960, -230, 1);            // above the roofs (the condition line)
export const MAIL_CAM = E.aim(F0, 860, 760, 1.55);          // the mailbox + the older you, your window above

// ================================================================================================================= THE HILL (thumbnail A)
export const PIG = { x: 1440, y: F.HILL_Y + 2, h: 690 };     // the giant piggy bank (feet, height)
export const DU_HILL = { x: 950, y: F.HILL_Y + 8, h: 196 };   // you, looking up at it
export const HILL_WINDOW = { Z: F.Z_SHORE, x: 452, y: 905, w: 16, h: 20 };   // the window across the river where the hook's coin lands (1.02)
export const crackOf = () => [PIG.x + .2 * PIG.h, PIG.y - .84 * PIG.h];
// st: { crack (1), fountain: { rate, a, dust } | false, du: { …du options, a } | false, pig: { …piggy options }, window: 0..1 (lit),
//   deck (bridge 0..1), winA, field(ctx, c) (sky-field explainers, in front of the city), front(ctx, c) (last), pool (1) }
export function hillWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: SKY_GLOW });
  F.city(ctx, c, t, { deck: st.deck ?? 0, winA: st.winA ?? 1 });
  E.card(ctx, c, HILL_WINDOW.Z, () => {   // one small house on the far shore: its window lights where the hook's coin lands
    const w = HILL_WINDOW, a = clamp(st.window ?? 0);
    ctx.fillStyle = mixHex(P.night0, P.night1, .5); ctx.fillRect(w.x - 70, w.y - 60, 150, 170); ctx.fillRect(w.x - 40, w.y - 84, 50, 30);
    ctx.fillStyle = rgba(mixHex(P.halo1, P.core1, .3), .5); ctx.fillRect(w.x + 34, w.y - 4, 8, 10);
    if (a <= 0) return;
    ctx.fillStyle = rgba(mixHex(P.core1, P.halo0, .3), a); ctx.fillRect(w.x - w.w / 2, w.y - w.h / 2, w.w, w.h);
    halo(ctx, w.x, w.y, 70 * a + 10, .55 * a);
  });
  if (st.field) st.field(ctx, c);
  F.hill(ctx, c, t, { pool: [PIG.x - 380, 560, st.pool ?? 1] });
  E.card(ctx, c, F0, () => {
    const p = st.pig || {};
    const out = F.piggy(ctx, t, PIG.x, PIG.y, PIG.h, { crack: st.crack ?? 1, ...p });
    if (st.fountain !== false) { const f = st.fountain || {}; F.fountain(ctx, t, out.crack[0], out.crack[1] + 12, PIG.h / 700, { rate: f.rate ?? 1.5, a: f.a ?? 1, dust: f.dust ?? 260, seed: f.seed ?? 5 }); }
    if (st.du !== false) { const d = st.du || {}; ctx.save(); ctx.globalAlpha *= d.a ?? 1;
      E.du(ctx, d.x ?? DU_HILL.x, d.y ?? DU_HILL.y, d.h ?? DU_HILL.h, { look: .75, light: 1, back: .35, ...d }); ctx.restore(); }
    // the light the coins throw on you and the ground
    halo(ctx, DU_HILL.x + 30, DU_HILL.y - 60, 260, .12);
  });
  if (st.front) st.front(ctx, c);
}

// ================================================================================================================= YOUR STREET
// house row on F0 (design px): house A (yours, your window on the 2nd floor), house B (the ON AIR window upstairs, the shop below),
// neighbours left and right. The street (sidewalk) at GROUND; lamps on a nearer card; the mailbox at the curb in front of house A.
export const GROUND = 985;
export const HOUSES = [
  { x0: -980, x1: 80, roof: 170, seed: 31, rows: [[250, 170], [520, 170]], lit: .3 },
  { x0: 100, x1: 1020, roof: 92, seed: 32, rows: [[150, 170], [400, 250], [700, 170]], lit: .3, door: 140 },
  { x0: 1040, x1: 1900, roof: 196, seed: 33, rows: [[290, 190]], lit: .45 },
  { x0: 1920, x1: 2960, roof: 128, seed: 34, rows: [[200, 170], [460, 170], [720, 170]], lit: .35, door: 2500 },
];
export const MYWIN = { x: 380, y: 400, w: 360, h: 250 };                    // your window (house A)
export const ONAIR = { x: 1300, y: 300, w: 280, h: 190 };                   // the podcast window (house B, upstairs)
export const SHOP = { x: 1100, y: 640, w: 740, h: 300 };                    // the shop window (house B, ground floor)
export const Z_ROOM = F0 * 1.14, Z_FIG = F0 * 1.05;                         // your room: back wall, you at the window
export const ROOM = { calendar: [530, 430, 80], lamp: [762, 470], piggy: [724, 646, 64], fig: [668, 770, 248] };
// the room is laid out so that a push onto the calendar (CALCAM, through the left pane) never sees the figure (right pane): the hook swaps
// you → the older you there. Pushes into the room stay in front of the facade plane (camera z < F0 − 30), never through the wall.
export const CALCAM = (m) => E.aim(F0, 470, 472, m);
export const MONITOR = { x: 1398, y: 330, w: 96, h: 58 };                   // the monitor on the studio's back wall (on the Z_ROOM card)
export const MAILBOX = { x: 905, y: GROUND + 22, h: 210 };
export const LAMPS = [[-60, 1], [1030, 1], [1960, -1], [2900, 1]];         // street lamps (x, arm side) on the Z_LAMP card
export const Z_LAMP = F0 * .86;
const holeOf = (w) => [w.x, w.y, w.w, w.h];
// screen point → design point on card Z (inverse of E.project)
export function unproject(c, Z, sx, sy) { const m = E.cardM(c, Z); return m ? [(sx - m.e) / m.k, (sy - m.f) / m.k] : [sx, sy]; }

// your room behind your window. st.room: { lit (lamp 0..1), page (calendar page float), label(i), gold(i), who: 'du' | 'older' | false,
//   fig: { …du options }, piggy: { a, fill, x, y, h } | false, hold (piggy in the hands 0..1), extra(ctx, c, hands) }
function room(ctx, c, t, r = {}) {
  const lit = r.lit ?? 1;
  E.card(ctx, c, Z_ROOM, () => {
    const { x, y, w, h } = MYWIN;
    ctx.fillStyle = lin(ctx, x - 60, y - 40, x + w + 60, y + h + 40, [[0, mixHex(P.shade0, P.night1, .5)], [.6, mixHex(P.halo1, P.shade0, .55)], [1, mixHex(P.halo0, P.shade0, .3)]]);
    ctx.fillRect(x - 200, y - 200, w + 400, h + 400);
    ctx.fillStyle = rgba(P.night0, .25); ctx.fillRect(x - 200, y + h - 30, w + 400, 230);   // the floor line / wainscot
    // the lamp (a small table lamp on a shelf at the right; THE light of the room, the flood door)
    const [lx, ly] = ROOM.lamp;
    ctx.fillStyle = mixHex(P.shade0, P.night1, .5); ctx.fillRect(lx - 34, ly + 34, 68, 6); ctx.fillRect(lx - 3, ly, 6, 36);
    ctx.fillStyle = lin(ctx, 0, ly - 34, 0, ly + 2, [[0, mixHex(P.core1, P.halo0, .3)], [1, P.halo0]]);
    ctx.beginPath(); ctx.moveTo(lx - 16, ly - 34); ctx.lineTo(lx + 16, ly - 34); ctx.lineTo(lx + 26, ly + 2); ctx.lineTo(lx - 26, ly + 2); ctx.closePath(); ctx.fill();
    halo(ctx, lx, ly - 10, 150, .55 * lit * (1 + .02 * Math.sin(t * 2.1)));
    const [cx, cy, cw] = ROOM.calendar;
    F.calendar(ctx, t, cx, cy, cw, r.page ?? 0, { label: r.label, gold: r.gold });
  });
  let hands = null;
  E.card(ctx, c, Z_FIG, () => {
    const [fx, fy, fh] = ROOM.fig, who = r.who ?? 'du';
    if (who) { const o = { light: 1, back: .4, dir: 1, ...(r.fig || {}) }; hands = who === 'older' ? F.older(ctx, fx, fy, fh, o) : E.du(ctx, fx, fy, fh, o); }
    if (r.piggy !== false) {
      const p = r.piggy || {}, hold = clamp(r.hold ?? 0), [px, py, ph] = ROOM.piggy;
      const hx = hands ? (hands.R[0] + hands.L[0]) / 2 : px, hy = hands ? (hands.R[1] + hands.L[1]) / 2 + (p.h ?? ph) * .5 : py;
      const x = p.x ?? lerp(px, hx, hold), y = p.y ?? lerp(py, hy, hold);
      if ((p.a ?? 1) > 0) r.pig = F.piggy(ctx, t, x, y, p.h ?? ph, { crack: 0, warm: 0, lit: .8, fill: p.fill ?? 0, a: p.a ?? 1, dir: 1 });
      r.pigAt = [x, y, p.h ?? ph];
    }
    if (r.extra) r.extra(ctx, c, hands);
  });
  r.hands = hands;
}
// the podcast studio behind the ON AIR window: two silhouettes at microphones, the monitor on the back wall (clip plates grow out of it)
function studio(ctx, c, t, s = {}) {
  E.card(ctx, c, Z_ROOM, () => {
    const { x, y, w, h } = ONAIR;
    ctx.fillStyle = lin(ctx, x, y, x + w, y + h, [[0, mixHex(P.shade0, P.ind1, .55)], [.55, mixHex(P.ind1, P.shade0, .3)], [1, mixHex(P.night1, P.ind1, .5)]]); ctx.fillRect(x - 90, y - 90, w + 180, h + 180);
    ctx.fillStyle = rgba(P.night0, .3); ctx.fillRect(x - 90, y + h - 24, w + 180, 120);
    const m = MONITOR; ctx.fillStyle = mixHex(P.night0, P.night1, .4); ctx.fillRect(m.x - 5, m.y - 5, m.w + 10, m.h + 10);
    ctx.fillStyle = lin(ctx, m.x, m.y, m.x + m.w, m.y + m.h, [[0, mixHex(P.blue0, P.halo2, .3)], [1, mixHex(P.blue1, P.ind1, .4)]]); ctx.fillRect(m.x, m.y, m.w, m.h);
    halo(ctx, m.x + m.w / 2, m.y + m.h / 2, 120, .25 * (s.screen ?? 1), P.blue0, P.halo2);
    // a warm desk lamp between them
    halo(ctx, x + w / 2, y + h - 30, 150, .5, P.halo0, P.core1);
  });
  E.card(ctx, c, Z_FIG, () => {
    const { x, y, w, h } = ONAIR, by = y + h + 40, br = Math.sin(t * 1.3) * .015;
    E.person(ctx, x + 50, by, 190, { dir: 1, view: 'side', armR: [.4, 1.25], armL: [.25, 1.1], look: .05 + br, lean: .08, light: -1, back: .5, headset: true });
    E.person(ctx, x + w - 50, by, 190, { dir: -1, view: 'side', armR: [.45 + .25 * Math.max(0, Math.sin(t * .9)), 1.35], armL: [.25, 1.1], look: .1 - br, lean: .06, light: 1, back: .5, headset: true });
    ctx.fillStyle = mixHex(P.night0, P.night1, .4);
    for (const mx of [x + 92, x + w - 92]) { ctx.fillRect(mx - 2, y + h - 60, 4, 70); ctx.beginPath(); ctx.ellipse(mx, y + h - 66, 9, 15, 0, 0, TAU); ctx.fill(); }
    ctx.fillStyle = mixHex(P.shade0, P.night1, .55); ctx.fillRect(x - 20, y + h - 4, w + 40, 14);   // the desk
  });
}
// st: { room: {…} (see room()), myLit (your window 0..1), studio: {…} | false, onAirA, shop: { fill 0..1, zero 0..1, light 0..1 },
//   mailbox: { open, check, flag, a } , older: { x, y, h, …options } | false (the older you on the street), du: {…} | false (you on the street),
//   lampsA, field(ctx, c) (sky field, in front of the far city), mid(ctx, c) (between the houses and the lamps), front(ctx, c) }
export function streetWorld(ctx, c, t, st = {}) {
  F.sky(ctx, c, t, { glow: SKY_GLOW });
  F.city(ctx, c, t, { deck: st.deck ?? 0, winA: st.winA ?? 1 });
  if (st.field) st.field(ctx, c);
  // what is behind the open windows
  const r = st.room || {}; room(ctx, c, t, r); st.room = r;
  if (st.studio !== false) studio(ctx, c, t, st.studio || {});
  E.card(ctx, c, F0, () => {
    // the shop interior (behind its glass, on the facade card: shallow)
    const s = st.shop || {}, S = SHOP;
    for (const hz of HOUSES) F.house(ctx, t, { ...hz, ground: GROUND, holes: hz.seed === 32 ? [holeOf(MYWIN)] : hz.seed === 33 ? [holeOf(ONAIR), holeOf(SHOP)] : [] });
    shopWindow(ctx, t, s);
    F.win(ctx, t, MYWIN.x, MYWIN.y, MYWIN.w, MYWIN.h, { open: true, mull: [2, 1], frame: 12 });
    if ((st.myLit ?? 1) > 0) halo(ctx, MYWIN.x + MYWIN.w / 2, MYWIN.y + MYWIN.h / 2, 330, .16 * (st.myLit ?? 1));
    F.win(ctx, t, ONAIR.x, ONAIR.y, ONAIR.w, ONAIR.h, { open: true, mull: [1, 1], frame: 12 });
    F.onAir(ctx, t, ONAIR.x + ONAIR.w / 2, ONAIR.y - 34, 1.3, st.onAirA ?? 1);
    F.street(ctx, t, GROUND);
    if (st.mid) st.mid(ctx, c);
    const m = st.mailbox || {};
    st.mail = F.mailbox(ctx, t, MAILBOX.x, MAILBOX.y, MAILBOX.h, { open: m.open ?? 0, check: m.check ?? 0, flag: m.flag ?? 0, a: m.a ?? 1 });
    if (st.older) { const o = st.older; st.olderHands = F.older(ctx, o.x ?? 790, o.y ?? GROUND + 26, o.h ?? 210, { light: 1, dir: 1, ...o }); }
    if (st.du) { const o = st.du; st.duHands = E.du(ctx, o.x ?? 700, o.y ?? GROUND + 26, o.h ?? 200, { light: 1, dir: 1, ...o }); }
  });
  E.card(ctx, c, Z_LAMP, () => {
    for (const [x, d] of LAMPS) F.streetLamp(ctx, t, x, GROUND + 70, 560, { dir: d, a: st.lampsA ?? 1 });
  });
  if (st.front) st.front(ctx, c);
}
// the shop window: warm light, three shelves; goods appear on them one by one (fill 0..1, left → right, top → bottom), every good with a
// price tag that rolls down to $0 (zero 0..1). o.light (the shop light 0..1), o.orb (0..1: the light gathers into an orb above the shop)
export const SHELF_Y = [736, 820, 904];
const SHOP_GOODS = [['bread', 1.0], ['shoe', 1.0], ['books', 1.0], ['lamp', .9], ['cup', .8], ['tv', 1.0], ['chair', .75], ['box', .9], ['flat', .75]];
const PRICES = ['$4', '$90', '$30', '$60', '$12', '$400', '$150', '$25', '$900'];
export function shopWindow(ctx, t, s = {}) {
  const S = SHOP, light = s.light ?? .45, fill = clamp(s.fill ?? 0), zero = clamp(s.zero ?? 0);
  ctx.fillStyle = lin(ctx, 0, S.y, 0, S.y + S.h, [[0, mixHex(P.shade0, P.night1, .4)], [1, mixHex(P.halo1, P.shade0, .5)]]); ctx.fillRect(S.x, S.y, S.w, S.h);
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = rad(ctx, S.x + S.w / 2, S.y + 30, S.w * .7, [[0, rgba(P.halo1, .45 * light)], [1, rgba(P.halo1, 0)]]); ctx.fillRect(S.x, S.y, S.w, S.h); ctx.restore();
  ctx.fillStyle = mixHex(P.shade0, P.night1, .6); for (const y of SHELF_Y) ctx.fillRect(S.x + 20, y, S.w - 40, 7);
  const n = SHOP_GOODS.length;
  for (let i = 0; i < n * 3; i++) {
    const row = Math.floor(i / n), col = i % n, [kind, sc] = SHOP_GOODS[(col + row * 4) % n];
    const k = clamp(fill * n * 3 - (row * n + col) * .92), u = expoOut(clamp(k * 1.6)); if (u <= 0) continue;
    const x = S.x + 60 + col * ((S.w - 120) / (n - 1)), y = SHELF_Y[row];
    ctx.save(); ctx.globalAlpha *= clamp(u * 2); F.goods(ctx, kind, x, y - (1 - u) * 26, 46 * sc); ctx.restore();
    if (row === 1 && col % 2 === 1) {   // a few price tags (middle shelf): the number rolls down to $0
      const z = clamp(zero * 1.4 - col * .05), txt = z >= .98 ? '$0' : z > 0 ? `$${Math.max(0, Math.round(parseInt(PRICES[col].slice(1)) * Math.pow(1 - z, 2.2)))}` : PRICES[col];
      F.priceTag(ctx, t, x + 24, y + 6, 40, txt, { col: z >= .98 ? 'gold' : 'cream', len: 6, a: u, ang: .05 * Math.sin(t * 1.4 + col) });
    }
  }
  // glass sheen + frame
  ctx.fillStyle = rgba(P.blue0, .07); ctx.beginPath(); ctx.moveTo(S.x + 80, S.y); ctx.lineTo(S.x + 240, S.y); ctx.lineTo(S.x + 90, S.y + S.h); ctx.lineTo(S.x - 70, S.y + S.h); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = mixHex(NIGHTW(), P.night0, .45); ctx.lineWidth = 14; ctx.strokeRect(S.x, S.y, S.w, S.h);
  ctx.fillStyle = mixHex(NIGHTW(), P.night0, .3); ctx.fillRect(S.x - 30, S.y - 46, S.w + 60, 30);
  if (s.sign !== false) E.glowText(ctx, 'GOODS', S.x + S.w / 2, S.y - 24, { size: 18, align: 'center', col: P.halo2, glow: false, spacing: .3 });
}
const NIGHTW = () => F.NIGHT.wall;

// ================================================================================================================= SEAM PLATES
// plateCondition: above the roofs, the gold condition line with Musk's words. (c01 → c02)
export const COND_LINE = { y: -330, x0: 330, x1: 1590 };    // the rule of light (F0 design, sky over the street)
export function condLine(ctx, t, u = 1, o = {}) {
  const L = COND_LINE, k = expoOut(clamp(u)), m = (L.x0 + L.x1) / 2, hw = (L.x1 - L.x0) / 2 * k;
  if (k <= 0) return;
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = rgba(P.halo1, .2); ctx.lineWidth = 14; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(m - hw, L.y); ctx.lineTo(m + hw, L.y); ctx.stroke(); ctx.restore();
  ctx.fillStyle = rgba(P.halo0, .95); ctx.fillRect(m - hw, L.y - 2, hw * 2, 4);
  halo(ctx, m - hw, L.y, 60, .5 * (1 - clamp(u - .999) )); halo(ctx, m + hw, L.y, 60, .5);
  const q = F.QUOTES.condition, tu = o.text ?? clamp((u - .3) / .7);
  if (tu > 0) F.maskLine(ctx, [['“' + q.lines[0] + '”', 0]], m, L.y - 34, 54, F.rise(tu), { align: 'center' });
  if (tu > 0 && o.src !== false) F.maskLine(ctx, [[q.src, 0]], m, L.y + 46, 20, F.rise(clamp(tu * 1.2 - .2)), { serif: false, weight: 600, align: 'center', col: F.GOLD.text, glow: false });
}
export function plateCondition(ctx, t, T) {
  const T0 = T.G('And behind that picture'), c = plateCam(t, T0, F0, 960, -230, 1);
  streetWorld(ctx, c, t, { room: { page: 35, label: CAL_LABEL, gold: CAL_GOLD, who: 'older', piggy: false }, field: () => E.card(ctx, c, F0, () => condLine(ctx, t, 1)) });
  return c;
}
// plateMailbox: your street, the older you at the open, empty mailbox (c04 → c05)
export function plateMailbox(ctx, t, T) {
  const T0 = T.G('Someone pays you an income', 1), c = plateCam(t, T0, F0, 860, 760, 1.55);
  streetWorld(ctx, c, t, { room: { page: 35, label: CAL_LABEL, gold: CAL_GOLD, who: false, piggy: false, lit: .8 }, mailbox: { open: 1, flag: 0 },
    older: { x: 790, look: -.25, armR: [1.05, .5], pose: 'stand' } });
  F.testCard(ctx, t, T);
  return c;
}
// platePiggy: the hill again, thumbnail A without the title (c07 → c08)
export function platePiggy(ctx, t, T) {
  const T0 = T.G("If he's wrong, you're still fine", 1), c = plateCam(t, T0, F0, 960, 540, 1);
  hillWorld(ctx, c, t, {});
  F.testCard(ctx, t, T);
  return c;
}
// the calendar on your wall (hook): months, then years, landing on the year you stop working (page 35 = 2061, circled)
export const CAL_LABEL = (i) => (i < 3 ? [['NOV', 'DEC', 'JAN'][i], i < 2 ? '2026' : '2027'] : [String(2027 + i - 2), i >= 35 ? 'LAST DAY AT WORK' : '']);
// holding the piggy at the chest (both forearms forward)
export const HOLD = { armR: [-.2, -1.9], armL: [.2, 1.9] };
export const CAL_GOLD = (i) => (i >= 35 ? 1 : 0);
