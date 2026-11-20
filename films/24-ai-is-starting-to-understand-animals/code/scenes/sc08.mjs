// c08 · What would change? · 1970, the songs · B2. T.G('But suppose they make it') → T.G('Now think back to those pigs').
// Plan: docs/shots.md 8.01–8.05 · world/rules: docs/MOTION.md · shared: lib/f24_b2_c78.mjs (the dusk medallion closing over the
// California field straddles the c07 | c08 boundary) · seam B2 → B3: lib/f24_seams.mjs plateBarn.
// ONE entry, one continuous take (8.03 ✂ is not used: the 1970 dot opens as an iris instead):
// the dusk medallion closes and shrinks into the strip's TODAY dot while the strip grows big (WHAT CHANGES?) → from TODAY a timeline
// runs back to the left and lands on 1970; the strip docks again → the 1970 dot opens (iris): it is the label of a record turning in
// a 1970 living room, the floor lamp, the album SONGS OF THE HUMPBACK WHALE, the family listening while the song fills the room →
// the room closes back into the dot → a bead runs to 1982: IWC, a harpoon struck, COMMERCIAL WHALING PAUSED → 1982 → TODAY lights
// up: STILL IN FORCE → the song runs along the whole timeline → everything sinks, the map flies to Europe and zooms into the pig
// pin: its medallion is the barn; it fills the frame = plateBarn (→ c09).
//
// | ID   | anchor (phrase)              | picture (one idea)                                                     | move / carrier            |
// |------|------------------------------|------------------------------------------------------------------------|---------------------------|
// | 8.01 | But suppose they make it     | the dusk closes into TODAY; the strip big: WHAT CHANGES?; timeline left | medallion → dot · strip   |
// | 8.02 | History has one clue         | the timeline lands on 1970                                              | land                      |
// | 8.03 | Nineteen seventy             | the 1970 dot is the record's label: the living room, the song           | iris                      |
// | 8.04 | Twelve years later           | 1982 · IWC · a harpoon struck · COMMERCIAL WHALING PAUSED · STILL IN FORCE | bead · timeline        |
// | 8.05 | The songs weren't the only   | the song along the timeline; zoom out, into the pig pin = plateBarn     | zoom out → zoom in · SEAM |
import * as E from '../lib/f10_editorial.mjs';
import * as F from '../lib/f24_kit.mjs';
import * as B from '../lib/f24_b2_world.mjs';
import * as Hb from '../lib/f24_b2_habitats.mjs';
import { plateBarn } from '../lib/f24_seams.mjs';
import { duskTimes, duskScene, duskClose, field, fieldView, MED_E, MED_R, FIELD_DIM } from '../lib/f24_b2_c78.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise } = F;
const TAU = Math.PI * 2;

export default async (T, R) => {
  E.prepareEditorial();
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = { ...duskTimes(T), end: R.b };
  a.would = G('Would anything change'); a.history = G('History has one clue'); a.clueE = GE('History has one clue');
  a.n70 = G('Nineteen seventy'); a.record = G('A record of humpback'); a.songsW = G('songs', a.record); a.everE = GE('nature album ever');
  a.twelve = G('Twelve years later'); a.nations = G('nations around the world'); a.pause = G('pause commercial whaling'); a.whaling = G('whaling', a.pause);
  a.still = G('That pause still holds'); a.holds = G('still holds', a.still);
  a.songs = G("The songs weren't the only"); a.sound = G('soundtrack'); a.T0 = G('Now think back to those pigs');
  return [{ t: R.a, draw: scene(a, T), print: F.PRINT24 }];
};

// ===================================================================================================== the timeline
const TL_Y = 600, X70 = 240, STRIP_AT = [1060, 600], STRIP_W = 1000, STRIP_S = 1.6;
// where the strip's TODAY dot sits (screen) at big = eb (the kit's geometry)
function stripToday(eb) {
  const D = F.STRIP_DOCK, x = lerp(D.x, STRIP_AT[0], eb), y = lerp(D.y, STRIP_AT[1], eb), w = lerp(D.w, STRIP_W, eb), s = lerp(1, STRIP_S, eb), ww = w / s;
  const lx0 = -ww / 2 + 22, lx1 = ww / 2 - 22 - F.measure('2030', 34, true) - 14;
  return [x + lerp(lx0, lx1, .62) * s, y];
}
const TX = stripToday(1)[0];
const yearX = (y) => lerp(X70, TX, (y - 1970) / (2026 - 1970));
const X82 = yearX(1982);

function harpoon(ctx, t, x, y, L, u) {   // a harpoon drawn on (u 0..1), pointing right: rope, shaft, barbed head
  if (u <= 0) return; const k = sineIO(u), x1 = x + L * k, col = mixHex(P.cream, P.shade1, .35);
  ctx.save(); ctx.strokeStyle = col; ctx.lineCap = 'round';
  ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 20; i++) { const q = i / 20, xx = x - 120 * q * k, yy = y + 10 * q + 9 * Math.sin(q * 9 + t * 1.5) * q; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();   // the rope
  ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x1, y); ctx.stroke();
  if (k > .8) { const h = span(k, .8, 1); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x1 + 50 * h, y); ctx.lineTo(x1 - 4, y - 14 * h); ctx.lineTo(x1 + 2, y); ctx.lineTo(x1 - 4, y + 14 * h); ctx.closePath(); ctx.fill();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1 + 18 * h, y - 3); ctx.lineTo(x1 - 14 * h, y - 22 * h); ctx.moveTo(x1 + 18 * h, y + 3); ctx.lineTo(x1 - 14 * h, y + 22 * h); ctx.stroke(); }   // barbs
  ctx.restore();
}

function scene(a, T) {
  // ---- strip: big while the timeline runs back; docks again when it lands
  const sb0 = a.suppose + .3, sb1 = sb0 + 1.2, sr0 = a.history + .2, sr1 = sr0 + 1.1;
  const stripBig = (t) => sineIO(span(t, sb0, sb1)) * (1 - sineIO(span(t, sr0, sr1)));
  // ---- the dusk medallion shrinks into the TODAY dot
  const dd0 = a.dc1, dd1 = dd0 + 1.0;
  // ---- the timeline
  const tl0 = a.would - .1, tl1 = a.history + .55, land = tl1;
  // ---- the 1970 room (iris)
  const io0 = a.n70 + .05, io1 = io0 + 2.3, ic0 = a.everE + .1, ic1 = ic0 + 1.6;
  const b82 = ic1 + .05, b82e = b82 + .8;
  const out0 = a.sound - 1.5, out1 = out0 + .6;
  const fl0 = out0 + .1, fl1 = a.T0 - .5, zRefP = fieldView(fl0, a).z, V0P = B.medView('pigs', zRefP);
  const REC = Hb.ROOM70.rec, RR = Hb.ROOM70.recR;
  const pinG = (t) => 1 - sineIO(span(t, tl0 - .3, tl0 + .5)) + sineIO(span(t, out0, out0 + .8));   // the California pins step aside for the timeline
  // a slow push on the timeline (screen space, about its middle); the iris origin follows it
  const PIV = [(X70 + TX) / 2, TL_Y], tlz = (t) => 1 + .006 * Math.max(0, t - tl0), tp = (t, x, y) => [PIV[0] + (x - PIV[0]) * tlz(t), PIV[1] + (y - PIV[1]) * tlz(t)];
  const tlPush = (ctx, t, fn) => { const z = tlz(t); ctx.save(); ctx.translate(PIV[0], PIV[1]); ctx.scale(z, z); ctx.translate(-PIV[0], -PIV[1]); fn(); ctx.restore(); };
  const ROOMK = [[io1, F.aim(F.F0, 1060, 640, 1.22)], [ic0, F.aim(F.F0, 1040, 650, 1.3)]];
  // the room's camera during the iris: from the record label (it fills the medallion) back to the room; e 0 = label, 1 = room
  const rCam = (t) => B.stageCam(t, ROOMK, 1.1 * span(t, io1, io1 + 1.5) * (1 - span(t, ic0 - 1.5, ic0)), 31);
  function roomCam(t, e) {
    if (e >= 1) return rCam(t);
    const ct = rCam(t < ic0 ? io1 : ic0), s1 = E.F0 / (E.F0 - ct.z), s0 = .95 * F.RF / RR;   // the room end of the path (no drift there)
    const ee = sineIO(clamp(e * 1.15)), s = Math.exp(lerp(Math.log(s0), Math.log(s1), B.ZIN(e)));
    return F.aim(F.F0, lerp(REC[0], ct.x + W / 2, ee), lerp(REC[1], ct.y + H / 2, ee), s);
  }
  // the iris progress: 0 = the dot, 1 = full frame
  const irisE = (t) => (t < io1 ? span(t, io0, io1) : t < ic0 ? 1 : 1 - span(t, ic0, ic1));
  const SONGP = [0, 1, 2, 3, 4].map((i) => ({ t0: a.record + i * 1.05, seed: 60 + i }));
  function room(ctx, t, c) {
    Hb.room70(ctx, c, t, { cast: () => {
      const g = Hb.ROOM70.floor;
      Hb.seated(ctx, t, 1250, g, 340, { dir: -1, lit: .6, seed: 1, tilt: -.06, hair: 1 });
      Hb.seated(ctx, t, 1395, 740 + .3 * 220, 220, { dir: -1, lit: .8, seed: 2, tilt: .08, hair: 2 });
      Hb.seated(ctx, t, 1530, g, 350, { dir: -1, lit: 1, seed: 3, tilt: -.02, hair: 0 });
      for (const p of SONGP) {   // the song rises out of the record player and drifts to the family
        const u = span(t, p.t0, p.t0 + 3.2); if (u <= 0 || u >= 1) continue;
        const q = sineIO(u), s = Math.sin(Math.PI * u) ** .6;
        F.wave(ctx, t, lerp(REC[0] + 40, 1300, q), lerp(REC[1] - 60, 520, q) - 50 * Math.sin(Math.PI * q), 230 * s, 70 * s, 'song', { bars: 26, seed: p.seed, col: 'cream', live: true, head: false });
      }
    } });
  }
  function timeline(ctx, t) {
    const u = sineIO(span(t, tl0, tl1)); if (u <= 0) return;
    const xl = lerp(TX, X70, u);
    ctx.save(); ctx.strokeStyle = rgba(P.cream, .55); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xl, TL_Y); ctx.lineTo(TX, TL_Y); ctx.stroke();
    const lit = sineIO(span(t, a.holds - .3, a.holds + .9));   // 1982 → TODAY lights up (the pause still holds)
    if (lit > 0) { ctx.strokeStyle = F.CREAM.core; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(X82, TL_Y); ctx.lineTo(lerp(X82, TX, lit), TL_Y); ctx.stroke(); halo(ctx, lerp(X82, TX, lit), TL_Y, 60, .35, F.CREAM.body, F.CREAM.core); }
    ctx.restore();
    // the 1970 dot lands; the 1982 dot after the bead
    const l70 = span(t, land - .15, land + .5); if (l70 > 0) { const r = 9 * (1 + .5 * Math.sin(Math.PI * l70) * (1 - l70)) * expoOut(l70 * 2); halo(ctx, X70, TL_Y, 50, .4 * l70, F.CREAM.body, F.CREAM.core); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(X70, TL_Y, r, 0, TAU); ctx.fill(); }
    B.serif(ctx, '1970', X70, TL_Y - 46, 64, rise(span(t, a.n70 - .2, a.n70 + .55)), { align: 'center' });
    const l82 = span(t, b82e - .05, b82e + .5);
    if (l82 > 0) { halo(ctx, X82, TL_Y, 50, .4 * l82, F.CREAM.body, F.CREAM.core); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(X82, TL_Y, 9 * expoOut(l82 * 2), 0, TAU); ctx.fill(); }
    B.serif(ctx, '1982', X82 + 20, TL_Y - 46, 64, rise(span(t, b82e, b82e + .6)), { align: 'center' });
    B.caps(ctx, 'IWC', X82 - 18, TL_Y + 62, 30, rise(span(t, a.nations, a.nations + .6)), {});
    B.caps(ctx, 'COMMERCIAL WHALING PAUSED', X82 - 18, TL_Y + 104, 26, rise(span(t, a.whaling, a.whaling + .6)), {});
    // the harpoon, struck through (cool: stopped)
    const hu = span(t, a.pause - .3, a.pause + .5), st = sineIO(span(t, a.whaling - .2, a.whaling + .3));
    harpoon(ctx, t, X82 + 290, TL_Y - 150, 280, hu);
    if (st > 0) { const C = mixHex(P.blue0, P.cream, .4); ctx.save(); halo(ctx, X82 + 440, TL_Y - 150, 160 * st, .25 * st, P.blue0, C); ctx.strokeStyle = C; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(X82 + 290, TL_Y - 90); ctx.lineTo(lerp(X82 + 290, X82 + 590, st), lerp(TL_Y - 90, TL_Y - 210, st)); ctx.stroke(); ctx.restore(); }
    B.caps(ctx, 'STILL IN FORCE', TX - 34, TL_Y - 34, 26, rise(span(t, a.holds, a.holds + .6)), { align: 'right' });
    // the song along the whole timeline (8.05)
    const su = span(t, a.songs - .1, a.songs + 1.3);
    if (su > 0) F.wave(ctx, t, (X70 + TX) / 2, TL_Y, TX - X70, 70, 'song', { u: su, bars: 90, seed: 77, col: 'cream', live: true });
  }
  function todayDot(ctx, t) {   // the TODAY dot (the dusk medallion became it); TODAY under it once the strip has gone
    const g = t < dd1 ? 0 : 1; if (!g) return;
    halo(ctx, TX, TL_Y, 44, .35, F.CREAM.body, F.CREAM.core); ctx.fillStyle = P.cream; ctx.beginPath(); ctx.arc(TX, TL_Y, 9, 0, TAU); ctx.fill();
    B.caps(ctx, 'TODAY', TX, TL_Y + 54, 22, rise(span(t, sr1 - .3, sr1 + .4)), { align: 'center', col: P.halo2 });
  }

  return (ctx, t) => {
    if (t >= fl1) { plateBarn(ctx, t, T); return; }   // the seam B2 → B3 (plateBarn draws the strip)
    if (t < fl0) {
      const e = irisE(t);
      if (e >= 1) room(ctx, t, rCam(t));
      else {
        if (t < dd0) duskClose(ctx, t, T, a);
        else {
          const pg = pinG(t);
          field(ctx, t, T, a, { dim: FIELD_DIM + (0 - FIELD_DIM) * sineIO(span(t, out0, fl0 + .9)), grow: { esp: pg, berkeley: pg } });
          if (t < dd1) {   // the dusk medallion shrinks into the strip's TODAY dot
            const q = sineIO(span(t, dd0, dd1)), [tx, ty] = stripToday(sineIO(stripBig(t))), cx = lerp(MED_E[0], tx, q), cy = lerp(MED_E[1], ty, q), r = Math.exp(lerp(Math.log(MED_R), Math.log(9), q));
            ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = mixHex(P.night0, P.ind1, .55); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.restore();
            B.inMed(ctx, cx, cy, r - 1, (c) => duskScene(c, t, a)); B.ring(ctx, cx, cy, r, 'other');
          }
          B.sink(ctx, 760, span(t, out0, out1), 420, () => tlPush(ctx, t, () => { timeline(ctx, t); todayDot(ctx, t); }));
          B.bead(ctx, tp(t, X70, TL_Y), tp(t, X82, TL_Y), span(t, b82, b82e), 'cream', 60);
          if (e > 0) {   // the 1970 dot opens: the record's label fills it, the room behind
            const [ox, oy] = tp(t, X70, TL_Y), r0 = 9 * tlz(t), r = Math.exp(lerp(Math.log(r0), Math.log(F.RF), B.ZIN(e))), k = (r - r0) / (F.RF - r0), cx = lerp(ox, W / 2, k), cy = lerp(oy, H / 2, k);
            ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = P.night0; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.restore();
            B.inMed(ctx, cx, cy, r - .5, (c) => room(c, t, roomCam(t, e))); B.ring(ctx, cx, cy, r, 'other');
          }
        }
      }
    } else {   // 8.05: out onto the map, the flight to Europe and into the pig pin (its medallion is the barn)
      const u = span(t, fl0, fl1), v = F.flight(fieldView(fl0, a), V0P, B.ZIN(u));
      const cu = sineIO(span(t, fl0 + 1.0, fl1)), cam = F.aim(F.F0, lerp(965, W / 2, cu), lerp(640, H / 2, cu), lerp(1.5, 1, cu));
      B.mapMed(ctx, t, T, v, { pid: 'pigs', zRef: zRefP, calls: .32, dim: FIELD_DIM * (1 - sineIO(span(t, out0, fl0 + .9))), scene: (c) => F.barnCast(c, cam, t, { you: false }), pins: { grow: { esp: pinG(t), berkeley: pinG(t) } } });
      B.sink(ctx, 760, span(t, out0, out1), 420, () => tlPush(ctx, t, () => { timeline(ctx, t); todayDot(ctx, t); }));
    }
    F.strip(ctx, t, T, { big: stripBig(t), at: STRIP_AT, w: STRIP_W, s: STRIP_S });
  };
}
