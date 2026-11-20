// Film 66 · THE LONG LAND, FROM PURE THOUGHT TO SOLID GROUND (the one world of the film) + the seam plates between the builder groups
// (owned by the lead; builders import, never edit — wishes go in the report).
// A plate is the EXACT picture at a group boundary. The handing side steers its last move so its frame converges to the plate and draws
// the plate for t in [T0 − .5, T0); the receiving side draws the same plate for t in [T0, T0 + .5) and grows its world out of it.
// Plates keep a slow push (CREEP 4 %/s from T0 − .5) and a slow truck right (TRUCK 30 px/s); the receiving side continues both.
// Check: SECS=c01,c02 node tools/seam.mjs --at <T0>   ·   stills: node tools/kit_sheet66.mjs <dir>
//
//   Lead → B1 at T.G('This January') (c01 → c02): platePromise   THUMBNAIL A AGAIN, HALF GONE. Home camera: you on the rooftop (left),
//            holding your pay slip (the city's windows cool: machines took the office work); THE PROMISE (the big gold tag, top right) is half crumbled to dust ("half right"), the dust streams
//            down-left over the city. No title, no list tags. B1 (1.01) grows the C1 clip plate out of the promise tag's face.
//   B1 → B2  at T.G('So far, every price') (c04 → c05): plateFactory   THE FACTORY WAITS. Over the land at the college / factory: the
//            factory centre right (cool window, the robot arm), its tag 3 hangs above it, not yet lit; the college's edge at the left;
//            the clock top left (1 fallen, 2 split). B2 (4.01) lights tag 3 and brings it close ("things you can drop on your foot").
//   B2 → B3  at T.G('So what does that do') (c08 → c09): plateStairs   THUMBNAIL B. The six tags stand on the ground in a rising row
//            (sorted by how much of them is scarce: 1 2 3 5 4), the last "tag" is the house itself, gold, you small in its lit door.
//            B3 (8.01) brings the seventh tag (face down) down next to you.
//
// THE WORLD (design px per depth card; cam3() = home = thumbnail A):
//   sky Z 40000 (night gradient, stars) · far hills Z 12000 (two soft blue ranges) · THE PROMISE Z 6000: the big tag, eyelet (1490, 140),
//   w 470, hanging at .38 rad (body down-left), thread up-right · THE LAND Z 3600: ground line y 900 (GY); under it THE EARTH (a cut
//   through the ground: warm umber, warmer and thicker to the right), the power cable runs through it under every station; on it the
//   STATIONS left → right: 1 THE ADVICE OFFICE (x 1180, in the city of thought; its lit window = the programmer at his desk) · 2 THE
//   COLLEGE (2050) · 3 THE FACTORY (2950, cool window, a robot arm) · 4 THE POWER STATION + DATA CENTRE (3900, pylons) · 5 THE FIELDS
//   and the farm (4850) · 6 THE HOUSE on its plot (5800) · 7 THE TOWN HALL (6600: where the rules are written). Each station's tag hangs
//   above it (eyelet y 330). · THE ROOFTOP F0 (your building, at home): the ledge y 975 from x −700 to 945, a stair box with a ladder at
//   the left, you at (700, 975) h 190. · foreground Z 1150: nothing at home.
// landWorld(ctx, c, t, st) st (all optional):
//   promise { …F.tag options (dust, split, back, glow, lines, price, rot) } | false · promiseExtra(ctx, box) (on the promise card, after
//   the tag) · tags [7 × { …F.tag options, a, dy (px down), w } | null] (station tags) · cool 0..1 (machines took the office work: the city's
//   windows turn cool, left → right) · city 0..1 (warm windows everywhere: "everybody") · office { lit, person 0..1 } (station 1's window)
//   · power 0..1 (the cable in the earth glows, a pulse runs) · arm 0..1 (the factory's robot arm works) · stairs 0..1 (thumbnail B: the
//   six tags stand on the ground near the house) · houseTag 0..1 (the house becomes the gold house-tag) · you { x, y, h, o } | false
//   (rooftop) · youLand { x, h, o } (you on the ground of the land) · land(ctx) (land card, after the stations) · roof(ctx, hands)
//   (rooftop card) · fg(ctx) (Z 1150)
import * as E from './f10_editorial.mjs';
import * as F from './f66_kit.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, halo, lin, prng } = E;
const { GOLD, COOL, LAMP, EARTH, PAPER, F0 } = F;
const TAU = Math.PI * 2;

export const SEAM_HALF = .5;
export const CREEP = .04;
export const creep = (t, T, phrase, nth = 0) => 1 + CREEP * Math.max(0, t - (T.G(phrase, nth) - SEAM_HALF));
export const TRUCK = 30;
export const trk = (k) => TRUCK * (k - 1) / CREEP;

export const Z_SKY = 40000, Z_FAR = 12000, Z_PROMISE = 6000, Z_LAND = 3600, Z_FG = 1150, GY = 900;
export const PROMISE = { x: 1490, y: 140, w: 470, rot: .38 };
export const YOU = { x: 700, y: 975, h: 190 };
export const LEDGE = { x0: -700, x1: 945, y: 975 };
export const TAG_Y = 420, TAG_W = 120;
export const STATIONS = [
  { x: 1180, name: 'KNOWLEDGE & ADVICE' }, { x: 2050, name: 'EDUCATION' }, { x: 2950, name: 'THINGS FROM FACTORIES' },
  { x: 3900, name: 'ENERGY' }, { x: 4850, name: 'FOOD' }, { x: 5800, name: 'HOUSING & LAND' }, { x: 6600, name: 'YOUR WAGE' },
];
export const OFFICE_WIN = { x: 1112, y: 700, w: 136, h: 92 };   // station 1's lit window (the programmer)
// thumbnail B: the six tags standing on the ground near the house, sorted by height (station index per slot), the house = the last tag
export const STAIRS = { slots: [0, 1, 2, 4, 3], xs: [4720, 4900, 5080, 5270, 5470], ws: [92, 104, 118, 132, 146], house: { x: 5800, w: 250 } };
// a camera that looks at station i (s = magnification; 2.5–3 = close, 1.2 = wide)
export const stationCam = (i, s = 1.9, dv = 0, sx = W / 2, sy = H / 2) => E.aim(Z_LAND, STATIONS[i].x, 640 + dv, s, sx, sy);

// ------------------------------------------------------------------------------------------------ the skylines (seeded, cached)
const SKY = new Map();
function skyline(seed, x0, x1, base, hMin, hMax, wMin, wMax, litP) {
  const key = [seed, x0, x1].join(':'); if (SKY.has(key)) return SKY.get(key);
  const r = prng(seed), out = []; let x = x0;
  while (x < x1) {
    const w = wMin + r() * (wMax - wMin), h = hMin + r() * (hMax - hMin), wins = [];
    const cols = Math.max(2, Math.floor(w / 22)), rows = Math.max(3, Math.floor(h / 30));
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { const q = r(); if (q < litP * 3) wins.push([i / cols, j / rows, q < litP ? 1 : 0, r()]); }
    out.push({ x, w, h, base, cols, rows, wins, ant: r() < .2 }); x += w + r() * 14 - 4;
  }
  SKY.set(key, out); return out;
}
function drawSkyline(ctx, t, list, col, o = {}) {
  ctx.fillStyle = col;
  for (const b of list) { ctx.fillRect(b.x, b.base - b.h, b.w, b.h + 40); if (b.ant) ctx.fillRect(b.x + b.w * .45, b.base - b.h - 36, 4, 36); }
  const city = o.city ?? 0, cool = o.cool ?? 0, cx0 = o.cx0 ?? -1400, cx1 = o.cx1 ?? 1500;
  for (const b of list) {
    const cw = b.w / b.cols, rh = b.h / b.rows;
    for (const [u, v, lit, q] of b.wins) {
      const on = lit ? 1 : clamp(city * 1.6 - q * 1.2); if (on <= 0) continue;
      const wx = b.x + u * b.w, f = (wx - cx0) / (cx1 - cx0), cl = clamp((cool * 1.35 - f) * 6 + (q - .5) * .6);   // the cool wave runs left → right
      ctx.fillStyle = rgba(mixHex(LAMP.body, COOL.body, cl), (o.a ?? .8) * on * (.75 + .25 * Math.sin(t * .3 + q * 20)));
      ctx.fillRect(wx + cw * .3, b.base - b.h + v * b.h + rh * .35, cw * .4, rh * .38);
    }
  }
}
function hills(ctx, pts, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(pts[0][0], 3000); for (const [x, y] of pts) ctx.lineTo(x, y); ctx.lineTo(pts[pts.length - 1][0], 3000); ctx.closePath(); ctx.fill(); }
const HILL1 = [[-4000, 780], [-2600, 640], [-1500, 700], [-400, 560], [500, 660], [1250, 600], [1800, 470], [2300, 430], [2900, 500], [3800, 590], [4600, 480], [5600, 560], [6600, 500], [7800, 590], [9500, 640]];
const HILL2 = [[-4000, 820], [-2000, 720], [-800, 760], [300, 700], [1200, 700], [2000, 600], [2800, 650], [3900, 690], [5200, 610], [6400, 660], [8000, 640], [9500, 700]];

// ------------------------------------------------------------------------------------------------ the stations (land card, design px)
const IND = () => mixHex(P.night1, P.ind1, .45), IND2 = () => mixHex(P.night0, P.ind1, .3);
function win(ctx, x, y, w, h, col, a = .85) { ctx.fillStyle = rgba(col, a); ctx.fillRect(x, y, w, h); }
function office(ctx, t, st) {   // station 1: the advice office (a tower) with the programmer's window
  const s = STATIONS[0], o = st.office ?? {}, lit = o.lit ?? 1;
  ctx.fillStyle = IND2(); ctx.fillRect(s.x - 120, GY - 310, 240, 330); ctx.fillRect(s.x - 4, GY - 350, 8, 40);
  const r = prng(11); for (let j = 0; j < 7; j++) for (let i = 0; i < 5; i++) { const q = r(), wy = GY - 290 + j * 34, wx = s.x - 100 + i * 42; if (wy > OFFICE_WIN.y - 30 && wy < OFFICE_WIN.y + OFFICE_WIN.h + 6) continue; win(ctx, wx, wy, 24, 18, q < .3 ? mixHex(LAMP.body, COOL.body, clamp(st.cool ?? 0)) : P.night0, q < .3 ? .6 : .45); }
  const R = OFFICE_WIN;
  halo(ctx, R.x + R.w / 2, R.y + R.h / 2, R.w * 1.2, .15 * lit, GOLD.halo, LAMP.core);
  ctx.save(); ctx.beginPath(); ctx.rect(R.x, R.y, R.w, R.h); ctx.clip();
  ctx.fillStyle = lin(ctx, 0, R.y, 0, R.y + R.h, [[0, mixHex(P.ind1, LAMP.deep, .55 * lit)], [1, mixHex(P.night1, LAMP.deep, .3 * lit)]]); ctx.fillRect(R.x, R.y, R.w, R.h);
  // the desk, the lamp (warm) and the screen (cool); the programmer (a small figure, facing the screen)
  ctx.fillStyle = P.night0; ctx.fillRect(R.x + 14, R.y + R.h - 26, R.w - 28, 6); ctx.fillRect(R.x + 24, R.y + R.h - 20, 5, 20); ctx.fillRect(R.x + R.w - 30, R.y + R.h - 20, 5, 20);
  ctx.fillStyle = rgba(COOL.body, .85 * lit); ctx.fillRect(R.x + R.w - 62, R.y + R.h - 58, 36, 26); ctx.fillStyle = P.night0; ctx.fillRect(R.x + R.w - 46, R.y + R.h - 32, 4, 6);
  halo(ctx, R.x + R.w - 44, R.y + R.h - 45, 30, .25 * lit, COOL.halo, COOL.core);
  ctx.strokeStyle = P.night0; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(R.x + 30, R.y + R.h - 26); ctx.lineTo(R.x + 36, R.y + R.h - 52); ctx.lineTo(R.x + 48, R.y + R.h - 58); ctx.stroke();
  halo(ctx, R.x + 48, R.y + R.h - 54, 22, .5 * lit, GOLD.halo, LAMP.core);
  if ((o.person ?? 1) > 0) E.person(ctx, R.x + R.w - 84, R.y + R.h + 4, 62, { dir: 1, light: .6, lean: .12, look: -.2 });
  ctx.restore();
  ctx.strokeStyle = mixHex(P.night1, P.blue2, .4); ctx.lineWidth = 4; ctx.strokeRect(R.x, R.y, R.w, R.h);
}
function college(ctx, t, st) {   // station 2: a long hall with tall arched windows and a small cupola (no clock)
  const s = STATIONS[1], x0 = s.x - 260, x1 = s.x + 260, top = GY - 250;
  ctx.fillStyle = IND(); ctx.fillRect(x0, top, x1 - x0, 270);
  ctx.beginPath(); ctx.moveTo(x0 - 20, top); ctx.lineTo(s.x, top - 90); ctx.lineTo(x1 + 20, top); ctx.closePath(); ctx.fill();
  ctx.fillRect(s.x - 26, top - 150, 52, 64); ctx.beginPath(); ctx.arc(s.x, top - 150, 26, Math.PI, 0); ctx.fill();
  for (let i = 0; i < 6; i++) { const wx = x0 + 40 + i * 80; ctx.fillStyle = rgba(LAMP.body, .55 + .1 * Math.sin(t * .4 + i)); ctx.beginPath(); ctx.moveTo(wx, GY - 40); ctx.lineTo(wx, top + 70); ctx.arc(wx + 18, top + 70, 18, Math.PI, 0); ctx.lineTo(wx + 36, GY - 40); ctx.closePath(); ctx.fill(); }
  ctx.fillStyle = mixHex(P.night0, P.ind1, .2); ctx.fillRect(x0 - 30, GY - 16, x1 - x0 + 60, 16);   // the steps
}
function factory(ctx, t, st) {   // station 3: saw-tooth roof, a cool window band, a robot arm that works, boxes on a belt
  const s = STATIONS[2], x0 = s.x - 300, x1 = s.x + 300, top = GY - 210;
  ctx.fillStyle = IND(); ctx.fillRect(x0, top, x1 - x0, 230);
  for (let i = 0; i < 6; i++) { const bx = x0 + i * 100; ctx.beginPath(); ctx.moveTo(bx, top); ctx.lineTo(bx + 100, top - 60); ctx.lineTo(bx + 100, top); ctx.closePath(); ctx.fill(); }
  ctx.fillRect(x1 - 70, top - 200, 30, 200);
  const wx = x0 + 40, wy = top + 50, ww = x1 - x0 - 80, wh = 110, arm = st.arm ?? 1;
  ctx.fillStyle = lin(ctx, 0, wy, 0, wy + wh, [[0, mixHex(P.ind1, COOL.deep, .6)], [1, mixHex(P.night1, COOL.deep, .35)]]); ctx.fillRect(wx, wy, ww, wh);
  ctx.save(); ctx.beginPath(); ctx.rect(wx, wy, ww, wh); ctx.clip();
  ctx.fillStyle = P.night0; ctx.fillRect(wx, wy + wh - 24, ww, 8);   // the belt
  for (let i = 0; i < 9; i++) { const bx = wx + ((i * 70 + t * 38 * arm) % (ww + 70)) - 50; ctx.fillStyle = mixHex(P.night0, COOL.deep, .5); ctx.fillRect(bx, wy + wh - 42, 34, 18); ctx.fillStyle = rgba(COOL.body, .6); ctx.fillRect(bx + 4, wy + wh - 38, 26, 3); }
  for (const [ax, ph] of [[wx + ww * .33, 0], [wx + ww * .72, 1.7]]) {   // two robot arms (flat silhouettes: base, two links, a gripper)
    const a1 = -.9 + .35 * Math.sin(t * 1.3 * arm + ph), a2 = 1.2 + .4 * Math.sin(t * 1.3 * arm + ph + 1.1);
    const p1 = [ax + Math.cos(a1) * 50, wy + wh - 30 + Math.sin(a1) * 50], p2 = [p1[0] + Math.cos(a1 + a2) * 42, p1[1] + Math.sin(a1 + a2) * 42];
    ctx.strokeStyle = P.night0; ctx.lineCap = 'round'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(ax, wy + wh - 26); ctx.lineTo(...p1); ctx.lineTo(...p2); ctx.stroke();
    ctx.fillStyle = P.night0; ctx.fillRect(ax - 14, wy + wh - 30, 28, 10); ctx.beginPath(); ctx.arc(p2[0], p2[1], 7, 0, TAU); ctx.fill();
    halo(ctx, p2[0], p2[1], 18, .3 * arm, COOL.halo, COOL.core);
  }
  ctx.restore();
}
function power(ctx, t, st) {   // station 4: the power station (two stacks, a hall) + the data centre (long, low, cool vents)
  const s = STATIONS[3];
  ctx.fillStyle = IND(); ctx.fillRect(s.x - 280, GY - 170, 260, 190); ctx.fillRect(s.x - 250, GY - 380, 34, 220); ctx.fillRect(s.x - 180, GY - 340, 34, 180);
  for (let i = 0; i < 3; i++) win(ctx, s.x - 260 + i * 80, GY - 130, 50, 60, LAMP.body, .45);
  // the data centre
  ctx.fillStyle = IND2(); ctx.fillRect(s.x + 20, GY - 120, 300, 140);
  for (let i = 0; i < 8; i++) { const on = .5 + .5 * Math.sin(t * 2 + i * 1.3); ctx.fillStyle = rgba(COOL.body, .35 + .45 * on); ctx.fillRect(s.x + 40 + i * 34, GY - 90, 18, 4); ctx.fillRect(s.x + 40 + i * 34, GY - 60, 18, 4); }
  // steam from the stacks (slow, flat puffs)
  for (let i = 0; i < 5; i++) { const ph = (t * .05 + i / 5) % 1; ctx.fillStyle = rgba(P.blue1, .22 * (1 - ph)); ctx.beginPath(); ctx.ellipse(s.x - 233 + ph * 60, GY - 400 - ph * 160, 20 + ph * 40, 12 + ph * 22, 0, 0, TAU); ctx.fill(); }
}
function pylons(ctx, t, st) {   // a pylon line across the whole land (wires sag between them): power runs to every station
  const xs = []; for (let x = -1300; x <= 7200; x += 520) xs.push(x);
  ctx.fillStyle = mixHex(P.night1, P.blue2, .25);
  for (const x of xs) { ctx.beginPath(); ctx.moveTo(x - 22, GY); ctx.lineTo(x - 4, GY - 250); ctx.lineTo(x + 4, GY - 250); ctx.lineTo(x + 22, GY); ctx.closePath(); ctx.fill(); ctx.fillRect(x - 34, GY - 236, 68, 5); ctx.fillRect(x - 26, GY - 206, 52, 4); }
  ctx.strokeStyle = rgba(mixHex(P.blue2, COOL.body, .3 + .4 * (st.power ?? 0)), .5); ctx.lineWidth = 1.6;
  for (const dy of [-234, -204]) { ctx.beginPath(); for (let i = 0; i < xs.length - 1; i++) { const a = xs[i], b = xs[i + 1]; ctx.moveTo(a + (dy < -220 ? -32 : -24), GY + dy); ctx.quadraticCurveTo((a + b) / 2, GY + dy + 34, b + (dy < -220 ? -32 : -24), GY + dy); } ctx.stroke(); }
}
function fields(ctx, t, st) {   // station 5: the fields (furrows in the earth's colour) and the farm (a barn with a lit door, crates)
  const s = STATIONS[4], x0 = s.x - 420, x1 = s.x + 380;
  for (let i = 0; i < 7; i++) { const y = GY - 6 - i * 9; ctx.fillStyle = i % 2 ? mixHex(EARTH.body, P.ind1, .55) : mixHex(P.night1, '#1d3a2e', .45); ctx.fillRect(x0 + i * 14, y, x1 - x0 - i * 28, 9); }
  for (let k = 0; k < 26; k++) { const cx = x0 + 30 + k * 30, sw = .06 * Math.sin(t * .8 + k * .7); ctx.strokeStyle = mixHex(P.night1, '#2c5a40', .5); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, GY - 60); ctx.quadraticCurveTo(cx + 6 + sw * 60, GY - 82, cx + 2 + sw * 90, GY - 98); ctx.stroke(); }
  const bx = s.x + 120; ctx.fillStyle = IND(); ctx.fillRect(bx, GY - 150, 200, 170); ctx.beginPath(); ctx.moveTo(bx - 16, GY - 150); ctx.lineTo(bx + 100, GY - 220); ctx.lineTo(bx + 216, GY - 150); ctx.closePath(); ctx.fill();
  win(ctx, bx + 76, GY - 96, 48, 96, LAMP.body, .7); halo(ctx, bx + 100, GY - 50, 80, .12, GOLD.halo, LAMP.core);
  ctx.fillStyle = mixHex(EARTH.top, P.night1, .4); for (let i = 0; i < 3; i++) ctx.fillRect(bx - 70 + i * 30, GY - 22 - (i === 1 ? 20 : 0), 26, 20);
}
function house(ctx, t, st) {   // station 6: the small house on its plot (fence posts; the earth under it is the warmest)
  const s = STATIONS[5], ht = clamp(st.houseTag ?? 0);
  ctx.fillStyle = mixHex(EARTH.line, P.night1, .35); for (let i = 0; i < 9; i++) { const fx = s.x - 260 + i * 65; if (Math.abs(fx - s.x) < 120) continue; ctx.fillRect(fx, GY - 34, 7, 34); }
  ctx.fillRect(s.x - 260, GY - 26, 520, 4);
  if (ht < 1) {
    ctx.save(); ctx.globalAlpha *= 1 - ht;
    ctx.fillStyle = IND(); ctx.fillRect(s.x - 95, GY - 140, 190, 160); ctx.beginPath(); ctx.moveTo(s.x - 112, GY - 138); ctx.lineTo(s.x, GY - 230); ctx.lineTo(s.x + 112, GY - 138); ctx.closePath(); ctx.fill();
    ctx.fillRect(s.x + 40, GY - 230, 22, 60);
    win(ctx, s.x - 62, GY - 110, 44, 40, LAMP.body, .8); win(ctx, s.x + 18, GY - 84, 38, 84, LAMP.body, .55);
    halo(ctx, s.x, GY - 70, 140, .14, GOLD.halo, LAMP.core);
    ctx.restore();
  }
  if (ht > 0) {   // the house-tag (thumbnail B): a big gold tag with a roof, a chimney, the eyelet, a lit door
    const w = STAIRS.house.w, hh = w * 1.42, ey = GY - hh * .9;
    F.tag(ctx, t, STAIRS.house.x, ey, w, { thread: 0, house: 1, glow: ht, a: ht, rot: 0, seed: 66 });
    ctx.fillStyle = rgba(GOLD.core, .9 * ht); ctx.fillRect(STAIRS.house.x - 26, GY - 120, 52, 120); halo(ctx, STAIRS.house.x, GY - 50, 120, .4 * ht, GOLD.halo, GOLD.core);
  }
}
function townHall(ctx, t, st) {   // station 7: the town hall (wide steps, tall lit windows, a low dome; no flags)
  const s = STATIONS[6];
  ctx.fillStyle = IND(); ctx.fillRect(s.x - 230, GY - 200, 460, 220); ctx.fillRect(s.x - 260, GY - 214, 520, 20);
  ctx.beginPath(); ctx.ellipse(s.x, GY - 214, 90, 70, 0, Math.PI, 0); ctx.fill();
  for (let i = 0; i < 6; i++) win(ctx, s.x - 200 + i * 72, GY - 170, 40, 110, LAMP.body, .5 + .2 * (st.city ?? 0));
  ctx.fillStyle = mixHex(P.night0, P.ind1, .2); for (let i = 0; i < 3; i++) ctx.fillRect(s.x - 260 - i * 18, GY - 14 + i * 5, 520 + i * 36, 6);
}
function earth(ctx, t, st) {   // THE EARTH: the cut through the ground under the whole land (warmer and thicker to the right), the cable
  const x0 = -2600, x1 = 8600;
  ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, P.night0], [.3, mixHex(EARTH.deep, P.night0, .7)], [.5, mixHex(EARTH.body, P.night0, .45)], [.72, EARTH.body], [1, mixHex(EARTH.body, EARTH.warm, .5)]]);
  ctx.fillRect(x0, GY, x1 - x0, 900);
  ctx.fillStyle = lin(ctx, 0, GY, 0, GY + 520, [[0, rgba(EARTH.rim, .0)], [.04, rgba(EARTH.top, .5)], [.5, rgba(EARTH.deep, .2)], [1, rgba(P.night0, .9)]]); ctx.fillRect(x0, GY, x1 - x0, 900);
  ctx.fillStyle = lin(ctx, x0, 0, x1, 0, [[0, rgba(EARTH.rim, 0)], [.3, rgba(EARTH.rim, .08)], [1, rgba(EARTH.rim, .6)]]); ctx.fillRect(x0, GY, x1 - x0, 4);   // the lit rim of the ground
  ctx.strokeStyle = rgba(EARTH.line, .22); ctx.lineWidth = 2;   // strata
  for (let k = 0; k < 4; k++) { ctx.beginPath(); for (let x = x0; x <= x1; x += 120) { const y = GY + 110 + k * 90 + 14 * Math.sin(x * .002 + k * 1.7); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); }
  const pw = clamp(st.power ?? 0), cy = GY + 64;   // the power cable under every station
  ctx.strokeStyle = rgba(mixHex(P.blue2, COOL.body, pw), .35 + .5 * pw); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-1500, cy); ctx.lineTo(7400, cy); ctx.stroke();
  if (pw > 0) for (let i = 0; i < 6; i++) { const px = -1500 + ((t * 260 + i * 1480) % 8900); halo(ctx, px, cy, 40, .5 * pw, COOL.halo, COOL.core); }
  for (const s of STATIONS) { ctx.strokeStyle = rgba(mixHex(P.blue2, COOL.body, pw), .25 + .4 * pw); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(s.x, GY); ctx.lineTo(s.x, cy); ctx.stroke(); }
}
// the stair tags (thumbnail B): slot k stands on the ground; heights rise; numbers in serif
function stairs(ctx, t, u) {
  STAIRS.slots.forEach((si, k) => {
    const w = STAIRS.ws[k], h = w * 1.42, uu = clamp(u * 1.4 - k * .1); if (uu <= 0) return;
    F.tag(ctx, t, STAIRS.xs[k], GY - h * .9 + (1 - expoOut(uu)) * 40, w, { thread: 0, rot: 0, glow: .55 + .45 * k / 4, dust: [.75, .45, .18, 0, 0][k], seed: 90 + k, a: clamp(uu * 3),
      lines: [[String(si + 1), w * .36, 0, true]] });
  });
}

// ------------------------------------------------------------------------------------------------ the world
export function landWorld(ctx, c, t, st = {}) {
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = lin(ctx, 0, 0, 0, H, [[0, P.night0], [.5, mixHex(P.night1, P.ind0, .6)], [1, mixHex(P.ind1, P.blue0, .3)]]); ctx.fillRect(0, 0, W, H);
  ctx.restore();
  E.card(ctx, c, Z_SKY, () => { E.stars(ctx, 66, 190, t, [-3000, -1200, 12000, 1900], .85); });
  E.card(ctx, c, Z_FAR, () => {
    hills(ctx, HILL1, mixHex(P.ind0, P.blue0, .18)); hills(ctx, HILL2, mixHex(P.night1, P.ind0, .45));
  });
  // THE PROMISE (the big tag of the hook)
  let pbox = null;
  E.card(ctx, c, Z_PROMISE, () => {
    if (st.promise) pbox = F.tag(ctx, t, PROMISE.x, PROMISE.y, PROMISE.w, { rot: PROMISE.rot, seed: 6, ...st.promise });
    if (st.promiseExtra) st.promiseExtra(ctx, pbox);
  });
  // THE LAND: far city, the stations, the earth, the station tags
  E.card(ctx, c, Z_LAND, () => {
    const cool = st.cool ?? 0, city = st.city ?? 0;
    drawSkyline(ctx, t, skyline(23, -2600, 1500, GY, 90, 300, 70, 170, .08), mixHex(P.night1, P.ind1, .4), { city, cool, a: .75 });
    drawSkyline(ctx, t, skyline(41, 1500, 8600, GY - 60, 30, 120, 60, 140, .05), mixHex(P.night1, P.ind0, .55), { city: city * .7, a: .5 });
    pylons(ctx, t, st);
    office(ctx, t, st); college(ctx, t, st); factory(ctx, t, st); power(ctx, t, st); fields(ctx, t, st); house(ctx, t, st); townHall(ctx, t, st);
    earth(ctx, t, st);
    if (st.stairs) stairs(ctx, t, st.stairs);
    (st.tags ?? []).forEach((o, i) => {
      if (!o) return; const s = STATIONS[i];
      F.tag(ctx, t, o.x ?? s.x, (o.y ?? TAG_Y) + (o.dy ?? 0), o.w ?? TAG_W, { seed: 20 + i, ...o });
    });
    if (st.youLand) { const y = st.youLand; E.du(ctx, y.x, y.y ?? GY, y.h ?? 64, { light: 1, back: .3, dir: 1, ...(y.o ?? {}) }); }
    if (st.land) st.land(ctx);
  });
  // THE ROOFTOP (F0): the stair box with its ladder, the ledge, you
  let hands = null;
  E.card(ctx, c, F0, () => {
    const L = LEDGE;
    ctx.fillStyle = mixHex(P.night0, P.ind1, .25); ctx.fillRect(-180, 700, 400, 300); ctx.fillRect(-150, 670, 120, 34);
    ctx.fillStyle = mixHex(P.night1, P.blue2, .3); for (let i = 0; i < 9; i++) ctx.fillRect(160, 720 + i * 28, 46, 4); ctx.fillRect(160, 700, 5, 280); ctx.fillRect(201, 700, 5, 280);
    ctx.fillStyle = lin(ctx, 0, L.y, 0, L.y + 140, [[0, mixHex(P.ind2, P.blue1, .25)], [.08, mixHex(P.night1, P.ind1, .4)], [1, P.night0]]);
    ctx.beginPath(); ctx.moveTo(L.x0, L.y); ctx.lineTo(L.x1, L.y); ctx.lineTo(L.x1 - 6, L.y + 1200); ctx.lineTo(L.x0, L.y + 1200); ctx.closePath(); ctx.fill();
    ctx.fillStyle = rgba(GOLD.hot, .14); ctx.fillRect(L.x0 + 200, L.y, L.x1 - L.x0 - 200, 3);   // the lit edge (the promise's light)
    if (st.you !== false) { const y = st.you ?? {}; hands = E.du(ctx, y.x ?? YOU.x, y.y ?? YOU.y, y.h ?? YOU.h, { light: 1, back: .35, dir: 1, look: .8, ...(y.o ?? {}) }); }
    if (st.roof) st.roof(ctx, hands);
  });
  if (st.fg) E.card(ctx, c, Z_FG, st.fg);
  return { promise: pbox, hands };
}
// screen helpers for carriers
export function promiseRect(c) { const p = E.project(c, Z_PROMISE, PROMISE.x, PROMISE.y); return p ? { x: p[0], y: p[1], k: p[2], w: PROMISE.w * p[2] } : null; }
export function tagAt(c, i, dy = 0, w = TAG_W) { const s = STATIONS[i], p = E.project(c, Z_LAND, s.x, TAG_Y + dy); return p ? { x: p[0], y: p[1], k: p[2], w: w * p[2], h: w * 1.42 * p[2] } : null; }
export function officeRect(c) { const R = OFFICE_WIN, p = E.project(c, Z_LAND, R.x, R.y); return p ? { x: p[0], y: p[1], w: R.w * p[2], h: R.h * p[2] } : null; }

// ------------------------------------------------------------------------------------------------ cameras of the plates
export const HOME = () => E.cam3();
export const PROMISE_CAM = (k = 1, tr = 0) => E.aim(Z_PROMISE, W / 2 + tr * .3, H / 2, k);
export const FACTORY_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, STATIONS[2].x - 220 + tr, 645, 1.55 * k);
export const STAIRS_CAM = (k = 1, tr = 0) => E.aim(Z_LAND, 5260 + tr, 700, 1.25 * k, 960, 560);
// the station tags as they stand after their verdicts (for plates and the end screen); i 0..5
export const VERDICT_TAGS = [{ dy: 70, dust: .6, glow: .55 }, { split: .85, glow: .6 }, { dy: 40, glow: .6 }, { dy: -20, glow: .7 }, { dy: 30, glow: .65 }, { dy: -30, heavy: 1, glow: .8 }];

// Lead → B1: thumbnail A again, the promise half gone
export const PROMISE_HALF = { dust: .5, glow: 1 };
export function platePromise(ctx, t, T) {
  const k = creep(t, T, 'This January'), c = PROMISE_CAM(k, trk(k));
  landWorld(ctx, c, t, { promise: PROMISE_HALF, cool: 1, you: { o: { armR: [2.2, 2.6], look: .7 } }, roof: (cx, h) => { if (h?.R) F.paySlip(cx, t, h.R[0] + 8, h.R[1] - 16, 62, { glow: .7, rot: -.25 }); } });
}
// B1 → B2: the factory waits (tag 3 unlit); the clock top left
export function plateFactory(ctx, t, T) {
  const k = creep(t, T, 'So far, every price'), c = FACTORY_CAM(k, trk(k) * .3);
  landWorld(ctx, c, t, { you: false, tags: [VERDICT_TAGS[0], VERDICT_TAGS[1], { glow: .3 }], cool: 1 });
  F.board(ctx, t, T);
}
// B2 → B3: thumbnail B (the stairs and the house-tag, you in its door)
export function plateStairs(ctx, t, T) {
  const k = creep(t, T, 'So what does that do'), c = STAIRS_CAM(k, trk(k) * .3);
  landWorld(ctx, c, t, { you: false, stairs: 1, houseTag: 1, youLand: { x: STAIRS.house.x, h: 70, o: { look: .5 } }, power: .3 });
  F.board(ctx, t, T);
}

// ------------------------------------------------------------------------------------------------ the end screen (last 15 s)
// The land at night around the house and the town hall; the seven tags hang in a row high in the sky (their verdicts: fallen, split, …; the
// seventh in your hand); you small on the ground left of centre. The ground's dark earth below carries the two YouTube tiles and the
// subscribe circle (clean, low detail). No text. The picture keeps breathing (tags sway, the cable pulse, windows).
export const END_CAM = E.aim(Z_LAND, 6150, GY, 1.0, 960, 600);
export const END_TILES = { left: { x: 80, y: 640, w: 640, h: 360 }, right: { x: 1200, y: 640, w: 640, h: 360 }, sub: { x: 960, y: 930, r: 80 } };
export const END_ROW = (i) => ({ x: 6150 + (i - 3) * 200, y: 480 });   // land-card eyelets of the seven tags in the end screen row
// the end-screen picture (B3 may refine it; keep the lower half calm for the tiles): the seven tags in a row in the sky, their verdicts;
// the seventh = your wage, lit; you small at the house door; the land's windows warm; a slow push (never still)
export function endScreen(ctx, t, T) {
  const t0 = T.duration - 15, k = 1 + .006 * Math.max(0, t - t0), c = E.aim(Z_LAND, 6150 + 6 * Math.max(0, t - t0), GY, k, 960, 600);
  const row = [...VERDICT_TAGS.map((v) => ({ ...v, dy: 0 })), { glow: 1 }].map((v, i) => ({ ...v, ...END_ROW(i), w: 92, thread: 2400, seed: 120 + i,
    lines: [[String(i + 1), 30, 0, true]] }));
  landWorld(ctx, c, t, { you: false, tags: row, city: 1, power: .4, youLand: { x: STAIRS.house.x - 40, h: 60, o: { look: .6 } } });
}
