// C9 helper: the engraved paper world map in DAYLIGHT, lying on the dark table under a warm lamp (6.10, 6.11, 6.12a).
// Copied and adapted from lib/map.mjs nightSheet (K0): same table, sheet, ruled sea, waterlines, coastal intaglio, graticule,
// dashed borders and depth of field, without the night pass and the city lights. Cached per camera (~2 s once).
//   daySheet(cam, o) → S  (same shape as nightSheet's S, so map.mjs drawSheet(ctx, S, view) and paperAt(S, view, lon, lat) work on it)
//     cam = { cx, cy, z, rot, tilt, x, y, f } as in map.mjs;  o: { detail '50m', lamp [x, y], pad 90, paper, ink, land (tint), hi: [iso…] }
//   PL(S, lon, lat) → [x, y, q] in sheet canvas px (add view transform with toView)
//   toView(S, view, x, y) → screen px for a sheet-canvas point
//   borderLine(S, isoA, isoB) → [[x, y]…] the shared border of two countries in sheet px (ordered polyline)
//   countryOutline(S, iso, filter) → Path2D in sheet px
import { Path2D } from '@napi-rs/canvas';
import fs from 'node:fs';
import { W, H, rgba, clamp, mix, prng, rough, poly } from '../engine.mjs';
import { fibreFill } from './print.mjs';
import { hatch as artHatch, stipple as artStipple, vnoise } from './art.mjs';
import { canvas as mkCanvas } from '../engine.mjs';

const DATA = new URL('../data/', import.meta.url);
const ISO = { USA: '840', NOR: '578', CHE: '756', PHL: '608', KEN: '404', KOR: '410', CAN: '124', MEX: '484', TZA: '834', UGA: '800', SOM: '706', ETH: '231', SSD: '728', GBR: '826', IRL: '372' };
function decode(topo) {
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const ring = (idx) => { const pts = []; for (const i of idx) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]); } return pts; };
  const countries = topo.objects.countries.geometries.map((g) => {
    const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    return { id: g.id, name: g.properties?.name, polys: polys.map((p) => p.map(ring)), arcIdx: polys.flat(2) };
  });
  const use = new Map(); for (const c of countries) for (const i of c.arcIdx) { const k = i < 0 ? ~i : i; use.set(k, (use.get(k) || 0) + 1); }
  const borders = [...use].filter(([, n]) => n > 1).map(([k]) => arcs[k]);
  return { countries, borders, arcs, byId: new Map(countries.map((c) => [c.id, c])) };
}
const DS = {};
export function mapData(detail = '50m') { if (!DS[detail]) DS[detail] = decode(JSON.parse(fs.readFileSync(new URL(`countries-${detail}.json`, DATA), 'utf8'))); return DS[detail]; }
export const isoId = (k) => ISO[k] || k;

// Equal Earth
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2, D2R = Math.PI / 180;
export function ll(lon, lat) {
  const l = lon * D2R, th = Math.asin(M * Math.sin(lat * D2R)), t2 = th * th, t6 = t2 * t2 * t2;
  return [l * Math.cos(th) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
}
const K = 330;
const CAM = { cx: .25, cy: .2, z: 1, rot: -.06, tilt: .42, x: W / 2, y: H / 2, f: 1700 };
function projector(cam) {
  const c = { ...CAM, ...cam }, cr = Math.cos(c.rot), sr = Math.sin(c.rot), ct = Math.cos(c.tilt), st = Math.sin(c.tilt), k = K * c.z;
  const P = (ex, ey) => {
    const u0 = (ex - c.cx) * k, v0 = -(ey - c.cy) * k, u = u0 * cr - v0 * sr, v = u0 * sr + v0 * cr;
    const depth = c.f - v * st, q = c.f / Math.max(60, depth);
    return [c.x + u * q, c.y + v * ct * q, q];
  };
  return { P, c, k };
}
// view centre for a lon/lat (Equal Earth units), handy for cams
export const eeOf = (lon, lat) => ll(lon, lat);
function outline() { const pts = []; for (let lat = -90; lat <= 90; lat += 3) pts.push(ll(180, lat)); for (let lat = 90; lat >= -90; lat -= 3) pts.push(ll(-180, lat)); return pts; }
const OUT = outline();
function ringPath(ctx, P, ring) { let first = true, prev = 0, k = 0; for (const [lon0, lat] of ring) { let lon = lon0 + k; if (!first && lon - prev > 180) { k -= 360; lon -= 360; } else if (!first && prev - lon > 180) { k += 360; lon += 360; } prev = lon; const [ex, ey] = ll(clamp(lon, -200, 200), lat), [x, y] = P(ex, ey); first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; } ctx.closePath(); }
function countryPath(ctx, P, c, filter) { for (const p of c.polys) { if (filter && !filter(p[0])) continue; for (const r of p) ringPath(ctx, P, r); } }

const SHEETS = new Map();
export function daySheet(cam, o = {}) {
  const key = 'day' + JSON.stringify([cam, o]); if (SHEETS.has(key)) return SHEETS.get(key);
  const pad = o.pad ?? 90, CW = W + 2 * pad, CH = H + 2 * pad;
  const camP = { ...cam, x: (cam.x ?? W / 2) + pad, y: (cam.y ?? H / 2) + pad }, { P, c, k } = projector(camP), D = mapData(o.detail || '50m');
  const PL = (lon, lat) => { const [x, y] = ll(lon, lat); return P(x, y); };
  const [cv, g] = mkCanvas(CW, CH), r = prng(o.seed ?? 91), n = vnoise(23), ink = o.ink || '#2b2433';
  // the table: dark walnut with long grain, warm where the lamp reaches
  g.fillStyle = '#0d0a0c'; g.fillRect(0, 0, CW, CH); g.lineCap = 'round';
  for (let i = 0; i < 420; i++) { const y = r() * CH, a = .05 + r() * .09; g.strokeStyle = r() < .5 ? `rgba(120,80,55,${a})` : `rgba(0,0,0,${a * 1.5})`; g.lineWidth = .6 + r() * 2.2; g.beginPath(); for (let x = -20; x <= CW + 20; x += 40) { const yy = y + 8 * Math.sin(x * .004 + i) + 5 * (n(x * .006, i * .3) - .5); x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  const lamp = o.lamp || [W * .82 + pad, pad - 60];
  { const lg = g.createRadialGradient(lamp[0], lamp[1] + 120, 0, lamp[0], lamp[1] + 120, 1500); lg.addColorStop(0, 'rgba(255,170,100,.32)'); lg.addColorStop(.5, 'rgba(255,150,90,.08)'); lg.addColorStop(1, 'rgba(255,150,90,0)'); g.fillStyle = lg; g.fillRect(0, 0, CW, CH); }
  // the sheet
  const m = .16, cs = [[-2.7066 - m, -1.3173 - m], [2.7066 + m, -1.3173 - m], [2.7066 + m, 1.3173 + m], [-2.7066 - m, 1.3173 + m]].map(([x, y]) => P(x, y));
  const sheet = rough(cs.map((p) => [p[0], p[1]]), 2.4, 7, { step: 10 }), sheetPath = new Path2D(); sheet.forEach(([x, y], i) => (i ? sheetPath.lineTo(x, y) : sheetPath.moveTo(x, y))); sheetPath.closePath();
  { const [sc, sg] = mkCanvas(CW, CH); sg.fillStyle = 'rgba(0,0,0,.85)'; sg.translate(16, 24); sg.fill(sheetPath); g.save(); g.filter = 'blur(18px)'; g.drawImage(sc, 0, 0); g.filter = 'none'; g.restore(); }
  const paper = o.paper || '#ebe1c7';
  { g.save(); g.clip(sheetPath); const pg = g.createRadialGradient(lamp[0], lamp[1] + 200, 0, lamp[0], lamp[1] + 200, CW * 1.05); pg.addColorStop(0, '#f6eedb'); pg.addColorStop(.5, paper); pg.addColorStop(1, '#a8987a'); g.fillStyle = pg; g.fillRect(0, 0, CW, CH); g.restore(); }
  g.save(); g.beginPath(); sheet.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.scale(CW / W, CH / H); fibreFill(g, .5); g.restore();
  { const q = .07, rr = [[-2.7066 - q, -1.3173 - q], [2.7066 + q, -1.3173 - q], [2.7066 + q, 1.3173 + q], [-2.7066 - q, 1.3173 + q]].map(([x, y]) => P(x, y)); g.strokeStyle = rgba(ink, .7); g.lineWidth = 1.6; poly(g, rr); g.stroke(); }
  const outlinePath = new Path2D(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? outlinePath.lineTo(sx, sy) : outlinePath.moveTo(sx, sy); }); outlinePath.closePath();
  const landPath = new Path2D(); for (const cn of D.countries) countryPath(landPath, P, cn);
  const [lm, lmg] = mkCanvas(CW, CH); lmg.fillStyle = '#fff'; lmg.fill(landPath);
  const band = (d, w) => { const [a, ag] = mkCanvas(CW, CH), [b, bg] = mkCanvas(CW, CH); ag.lineJoin = bg.lineJoin = 'round'; ag.strokeStyle = bg.strokeStyle = '#fff'; ag.lineWidth = 2 * d + w; ag.stroke(landPath); bg.lineWidth = Math.max(.1, 2 * d - w); bg.stroke(landPath); ag.globalCompositeOperation = 'destination-out'; ag.drawImage(b, 0, 0); return a; };
  const sc = Math.min(2.2, Math.max(1, Math.sqrt(c.z / 2)));   // engraving pitch grows a little with zoom
  g.save(); g.clip(outlinePath); g.fillStyle = 'rgba(150,170,185,.16)'; g.fillRect(0, 0, CW, CH); g.restore();
  { const [s2, sg] = mkCanvas(CW, CH); sg.save(); sg.clip(outlinePath); sg.strokeStyle = rgba(ink, .3); sg.lineWidth = .65 * sc; const step = 3.3 * sc / (K * c.z);
    for (let ey = -1.3173; ey <= 1.3173; ey += step) { const a = P(-2.75, ey), b = P(2.75, ey); sg.beginPath(); sg.moveTo(a[0], a[1]); sg.lineTo(b[0], b[1]); sg.stroke(); } sg.restore();
    sg.globalCompositeOperation = 'destination-out'; sg.lineJoin = 'round'; sg.strokeStyle = '#fff'; sg.lineWidth = 2 * 12.5 * sc; sg.stroke(landPath); sg.drawImage(lm, 0, 0);
    g.drawImage(s2, 0, 0); }
  { const [wc, wg] = mkCanvas(CW, CH); [2.2, 4.6, 7.3, 10.4].forEach((d, i) => { wg.globalAlpha = .62 * Math.pow(.74, i); wg.drawImage(band(d * sc, .75 * sc), 0, 0); });
    wg.globalAlpha = 1; wg.globalCompositeOperation = 'destination-out'; wg.drawImage(lm, 0, 0); wg.globalCompositeOperation = 'source-in'; wg.fillStyle = ink; wg.fillRect(0, 0, CW, CH); g.save(); g.clip(outlinePath); g.drawImage(wc, 0, 0); g.restore(); }
  g.save(); g.fillStyle = o.land || 'rgba(255,246,225,.5)'; g.fill(landPath); g.restore();
  { const [hc, hg] = mkCanvas(CW, CH); artHatch(hg, [0, 0, CW, CH], { angle: -.78, gap: 2.7 * sc, w: .55 * sc, col: ink, a: .55, wobble: .4, seed: 5, broken: .2 });
    const [fc, fg] = mkCanvas(CW, CH); fg.filter = `blur(${6 * sc}px)`; fg.strokeStyle = '#fff'; fg.lineJoin = 'round'; fg.lineWidth = 16 * sc; fg.stroke(landPath); fg.filter = 'none';
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(fc, 0, 0); hg.drawImage(lm, 0, 0); g.drawImage(hc, 0, 0); }
  // highlighted countries: a warm wash
  for (const id of o.hi || []) { const cn = D.byId.get(isoId(id)); if (!cn) continue; const p = new Path2D(); countryPath(p, P, cn, id === 'USA' ? (r0) => r0[0][0] > -130 && r0[0][1] < 50 : null); g.save(); g.fillStyle = rgba(o.hiCol || '#f0a04b', o.hiA ?? .22); g.fill(p); g.restore(); }
  { g.save(); g.clip(outlinePath); g.strokeStyle = rgba(ink, .2); g.lineWidth = .8; g.beginPath();
    for (let lon = -180; lon <= 180; lon += 30) for (let lat = -90; lat <= 90; lat += 3) { const [sx, sy] = PL(lon, lat); lat === -90 ? g.moveTo(sx, sy) : g.lineTo(sx, sy); }
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon <= 180; lon += 4) { const [sx, sy] = PL(lon, lat); lon === -180 ? g.moveTo(sx, sy) : g.lineTo(sx, sy); }
    g.stroke(); g.restore(); }
  g.save(); g.setLineDash([2.2 * sc, 2.2 * sc]); g.strokeStyle = rgba(ink, .42); g.lineWidth = .65 * sc; g.beginPath();
  for (const arc of D.borders) { let pl = null; arc.forEach(([lon, lat], i) => { const [sx, sy] = PL(lon, lat); (i && Math.abs(lon - pl) < 180) ? g.lineTo(sx, sy) : g.moveTo(sx, sy); pl = lon; }); } g.stroke(); g.restore();
  g.save(); g.clip(outlinePath); g.strokeStyle = rgba(ink, .85); g.lineWidth = .95 * Math.min(1.6, sc); g.lineJoin = 'round'; g.stroke(landPath); g.restore();
  g.strokeStyle = rgba(ink, .7); g.lineWidth = 1.3; g.stroke(outlinePath);
  // lamp light on the paper, stippled falloff
  { const [lc, lg2] = mkCanvas(CW, CH); const rg = lg2.createRadialGradient(lamp[0], lamp[1] + 160, 0, lamp[0], lamp[1] + 160, 1400); rg.addColorStop(0, 'rgba(255,196,130,.55)'); rg.addColorStop(.45, 'rgba(255,170,100,.16)'); rg.addColorStop(1, 'rgba(255,160,90,0)'); lg2.fillStyle = rg; lg2.fillRect(0, 0, CW, CH); artStipple(lc, { k: .6, g: 1.2, seed: 61 });
    g.save(); g.clip(sheetPath); g.globalCompositeOperation = 'soft-light'; g.drawImage(lc, 0, 0); g.restore(); }
  // shade away from the lamp (the far side of the sheet falls off)
  { g.save(); g.clip(sheetPath); const sg = g.createRadialGradient(lamp[0], lamp[1] + 200, 300, lamp[0], lamp[1] + 200, CW * 1.2); sg.addColorStop(0, 'rgba(20,12,10,0)'); sg.addColorStop(1, 'rgba(20,12,10,.42)'); g.fillStyle = sg; g.fillRect(0, 0, CW, CH); g.restore(); }
  if (o.dof !== false) { const [bc, bgx] = mkCanvas(CW, CH); bgx.filter = 'blur(3px)'; bgx.drawImage(cv, 0, 0); bgx.filter = 'none'; const top = o.dofTop ?? PL(0, 90)[1];
    bgx.globalCompositeOperation = 'destination-in'; const mg = bgx.createLinearGradient(0, top - 120, 0, top + 260); mg.addColorStop(0, '#000'); mg.addColorStop(1, 'rgba(0,0,0,0)'); bgx.fillStyle = mg; bgx.fillRect(0, 0, CW, CH); g.drawImage(bc, 0, 0); }
  const S = { c: cv, pad, cam: camP, P, PL, twinkle: [], k, D, sheetPath, landPath, countryPath: (ctx, id, filter) => { const cn = D.byId.get(isoId(id)); if (cn) countryPath(ctx, P, cn, filter); } };
  SHEETS.set(key, S); return S;
}
export const toView = (S, v, x, y) => [W / 2 + (x - S.pad - W / 2) * (v.z ?? 1) + (v.dx ?? 0), H / 2 + (y - S.pad - H / 2) * (v.z ?? 1) + (v.dy ?? 0)];
export function drawDay(ctx, S, view = {}) {
  const z = view.z ?? 1; ctx.save(); ctx.translate(W / 2 + (view.dx ?? 0), H / 2 + (view.dy ?? 0)); ctx.scale(z, z); ctx.drawImage(S.c, -W / 2 - S.pad, -H / 2 - S.pad); ctx.restore();
}
// the shared border of two countries (sheet px): arcs used by both, chained into one polyline
export function borderLine(S, a, b) {
  const D = S.D, A = D.byId.get(isoId(a)), B = D.byId.get(isoId(b)); if (!A || !B) return [];
  const sa = new Set(A.arcIdx.map((i) => (i < 0 ? ~i : i))), shared = B.arcIdx.map((i) => (i < 0 ? ~i : i)).filter((i) => sa.has(i));
  let chains = shared.map((i) => D.arcs[i].slice());
  // chain arcs end to end
  let out = chains.shift() || []; let guard = 0;
  while (chains.length && guard++ < 200) {
    const e = out[out.length - 1], s0 = out[0]; let hit = false;
    for (let j = 0; j < chains.length; j++) {
      const c = chains[j], c0 = c[0], c1 = c[c.length - 1], eq = (p, q) => Math.abs(p[0] - q[0]) < 1e-6 && Math.abs(p[1] - q[1]) < 1e-6;
      if (eq(e, c0)) { out = out.concat(c.slice(1)); } else if (eq(e, c1)) { out = out.concat(c.slice().reverse().slice(1)); }
      else if (eq(s0, c1)) { out = c.concat(out.slice(1)); } else if (eq(s0, c0)) { out = c.slice().reverse().concat(out.slice(1)); } else continue;
      chains.splice(j, 1); hit = true; break;
    }
    if (!hit) { const c = chains.shift(); out = out.concat(c); }
  }
  return out.map(([lon, lat]) => S.PL(lon, lat));
}
