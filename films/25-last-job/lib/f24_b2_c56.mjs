// Film 24 · B2 · the stretch that straddles c05 | c06: the map between Spain and Switzerland → the pig pin's medallion (the barn of the
// hook) → BIRTH → SLAUGHTER, FEELINGS → the barn closes into its pin and the map flies to Dominica. Called by BOTH sc05 and sc06
// with the same (t, T), so the chunk boundary at T.G('In the Caribbean') is one continuous picture.
import * as E from './f10_editorial.mjs';
import * as F from './f24_kit.mjs';
import * as B from './f24_b2_world.mjs';
import * as Hb from './f24_b2_habitats.mjs';
const { W, H, P, rgba, mixHex, clamp, lerp, span, sineIO, expoOut, expoIn, halo } = E;
const { rise } = F;

export function barnTimes(T) {
  const G = (p, after = 0) => T.G(p, 0, after), GE = (p, after = 0) => T.GE(p, 0, after);
  const a = {};
  a.pigs = G('And the pigs from the start'); a.zo0 = a.pigs - .55; a.zo1 = a.zo0 + 2.7;
  a.another = G('That was another team, also in Europe'); a.anotherE = GE('That was another team, also in Europe');
  a.learned = G('Their A.I. learned from thousands', a.another); a.thousands = G('thousands of pig calls', a.learned);
  a.birth = G('birth to slaughter', a.learned); a.slaughterE = GE('birth to slaughter', a.learned);
  a.piece = G('So one piece is already in place'); a.feelW = G('feelings', a.piece); a.feelE = GE('feelings', a.piece);
  a.carib = G('In the Caribbean'); a.caribE = GE('In the Caribbean'); a.found = G('They found that the clicks', a.carib);
  a.tb0 = a.anotherE - .25; a.tb1 = a.tb0 + 2.9;          // into the pig pin (2.9 s)
  a.bo0 = a.feelE - .15; a.bo1 = a.bo0 + 4.1;             // the barn closes into its pin + the flight to Dominica (one van Wijk move)
  a.beadGo = a.piece - .5; a.beadIn = B.tabAt(T).feel;       // the FEELS beads fly into the tablet slot (it engraves on arrival)
  a.dz0 = a.bo1 + .25; a.dz1 = a.dz0 + 2.9;               // c06: into the Dominica medallion
  return a;
}
export const DOM_VIEW = F.mapView(-63, 17.2, 3.6);
export const domHold = (t, a) => B.crept(DOM_VIEW, 1 + .012 * Math.max(0, t - a.bo1));
const ZR_OUT = 4.2;   // the map zoom at which the barn has shrunk back to its pin size on the way out

// ---- the barn of the hook (no you): calls rise while the medallion opens, the cards, the life line, the beads
const CARD1 = [262, 300], CARD2 = [1352, 300], CS = 1.2;
const BEAD1 = [CARD1[0] + 248 * CS, CARD1[1] + 100 * CS], BEAD2 = [CARD2[0] + 84 * CS, CARD2[1] + 100 * CS];
const BCAM1 = F.aim(F.F0, 965, 640, 1.0), BCAM2 = F.aim(F.F0, 962, 648, 1.075);
function barnCam(t, a) {
  const K = [[a.tb0, F.BARN_MED], [a.tb1, BCAM1], [a.bo0, BCAM2], [a.bo0 + 2.0, F.BARN_MED]];
  const amt = 1.6 * span(t, a.tb0, a.tb1) * (1 - span(t, a.bo0, a.bo0 + 2.0));
  return E.camDrift(B.camSpline(t, K), t, amt, 5);
}
function barnScene(ctx, t, a, c) {
  const PUFFS = []; for (let k = 0; k < 12; k++) PUFFS.push([k % 2 ? 2 : 1, a.tb0 + .4 + k * .36 + .1 * Math.sin(k * 3.1), k % 3 === 1 ? 'squeal' : 'grunt']);
  const puff = (pg) => PUFFS.reduce((m, [p, t0]) => (p === pg ? Math.max(m, Math.sin(Math.PI * span(t, t0 - .1, t0 + .45))) : m), 0);
  const cast = F.barnCast(ctx, c, t, { you: false, p1: { snout: puff(1) * .7 }, p2: { head: .2 * puff(2), open: .3 * puff(2) } });
  const out = 1 - expoIn(span(t, a.bo0 - .75, a.bo0 - .1));   // everything explained sinks back before the barn closes
  E.card(ctx, c, F.F0, () => {
    for (const [pg, t0, kind] of PUFFS) {   // "thousands of pig calls": small calls rise from the snouts and shrink away
      const u = span(t, t0, t0 + 1.6); if (u <= 0 || u >= 1) continue;
      const m = pg === 1 ? cast.p1.mouth : cast.p2.mouth, s = pg === 1 ? 1 : -1, x = m[0] + 30 * s + 30 * u * s, y = m[1] - 40 - 90 * sineIO(u);
      F.wave(ctx, t, x, y, 64, 26 * Math.sin(Math.PI * Math.min(1, u * 1.6)) * (1 - u * .5), kind, { u: Math.min(1, u * 3), bars: 12, seed: 5 + pg + Math.round(t0), head: false, a: .8 });
    }
    const lu = sineIO(span(t, a.birth - .15, a.slaughterE)), lc = span(t, a.birth - .05, a.slaughterE + .35);
    Hb.lifeLine(ctx, t, lu, lc, { retract: sineIO(span(t, a.bo0 - 1.0, a.bo0 - .1)) });
    const cardAt = (xy, fn) => { ctx.save(); ctx.translate(xy[0], xy[1]); ctx.scale(CS, CS); fn(); ctx.restore(); };
    const r1 = span(t, a.thousands - .5, a.thousands + .25), r2 = span(t, a.thousands - .2, a.thousands + .55);
    const pul = (k) => 1 + .5 * Math.sin(Math.PI * span(t, a.beadGo - .1 + k * .12, a.beadGo + .4 + k * .12));
    cardAt(CARD1, () => F.idCard(ctx, t, 0, 0, { name: 'PIG 1', sub: 'FARM · EUROPE', animal: 'pig', feelRow: true, u: rise(r1) * out, feel: 1, feelU: span(t, a.thousands + .2, a.thousands + .9), feelWord: 'FINE' }));
    cardAt(CARD2, () => F.idCard(ctx, t, 0, 0, { name: 'PIG 2', sub: 'FARM · EUROPE', animal: 'pig', feelRow: true, u: rise(r2) * out, feel: -1, feelU: span(t, a.thousands + .5, a.thousands + 1.2), feelWord: 'NOT FINE' }));
    if (t > a.beadGo - .2 && t < a.beadGo + .8) { const k = pul(0); halo(ctx, BEAD1[0], BEAD1[1], 30 * k, .3 * (k - 1) * 2, F.GOLD.body, F.GOLD.core); halo(ctx, BEAD2[0], BEAD2[1], 30 * pul(1), .3 * (pul(1) - 1) * 2, P.blue0, P.cream); }
  });
  return cast;
}
// the beads in screen space (full frame only): a light copy lifts off each FEELS bead and arcs into the FEELINGS slot
function beads(ctx, t, a, c) {
  const tgt = B.slotXY('feel');
  [[BEAD1, 0, true], [BEAD2, .12, false]].forEach(([bd, d, good]) => {
    const u = span(t, a.beadGo + d, a.beadIn + d * .5); if (u <= 0 || u >= 1) return;
    const p = E.project(c, F.F0, bd[0], bd[1]); if (!p) return;
    const q = sineIO(u), cx = lerp(p[0], tgt[0], .45), cy = Math.min(p[1], tgt[1]) - 160;
    const x = (1 - q) ** 2 * p[0] + 2 * (1 - q) * q * cx + q * q * tgt[0], y = (1 - q) ** 2 * p[1] + 2 * (1 - q) * q * cy + q * q * tgt[1];
    const col = good ? F.GOLD : { body: P.blue0, core: mixHex(P.blue0, P.cream, .45) };
    halo(ctx, x, y, 46, .5, col.body, col.core); ctx.fillStyle = col.core; ctx.beginPath(); ctx.arc(x, y, 9 * (1 - .4 * q), 0, 7); ctx.fill();
  });
}

// t from a.zo1 (the map between Spain and Switzerland) to a.dz0 (the flight has reached Dominica)
export const MID = F.mapView(1.5, 45.2, 5.2);   // the map between León and the pig pin (5.04)
export function barnPart(ctx, t, T, a) {
  const MIDc = (tt) => B.crept(MID, 1 + .012 * (tt - a.zo1));
  if (t < a.tb0) { B.mapMed(ctx, t, T, MIDc(t), {}); return; }
  const V0P = B.medView('pigs', MIDc(a.tb0).z);
  if (t < a.tb1) {
    const v = F.flight(MIDc(a.tb0), V0P, B.ZIN(span(t, a.tb0, a.tb1)));
    B.mapMed(ctx, t, T, v, { pid: 'pigs', zRef: MIDc(a.tb0).z, scene: (cx) => barnScene(cx, t, a, barnCam(t, a)) });
    return;
  }
  if (t < a.bo0) { const c = barnCam(t, a); barnScene(ctx, t, a, c); beads(ctx, t, a, c); return; }
  // the barn closes into its pin while the map flies to Dominica (van Wijk: out over the Atlantic, in onto the Caribbean)
  const V0P2 = B.medView('pigs', ZR_OUT);
  const v = t < a.bo1 ? F.flight(V0P2, DOM_VIEW, B.ZOUT(span(t, a.bo0, a.bo1))) : domHold(t, a);
  B.mapMed(ctx, t, T, v, { pid: 'pigs', zRef: ZR_OUT, scene: (cx) => barnScene(cx, t, a, barnCam(t, a)) });
}
