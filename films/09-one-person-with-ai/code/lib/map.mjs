// The world as a printed paper map in Equal Earth projection, lying on a table and seen at an angle (never a globe).
// Data: Natural Earth via world-atlas@2.0.2 (data/countries-110m.json, data/countries-50m.json for close-ups).
//
//   worldMap(ctx, cam, o)   cam = { cx, cy, z, rot, tilt, x, y, f }  (cx,cy = view centre in Equal Earth units, see ll();
//                                   z = zoom (1 = whole world ~1790 px wide); rot = in-plane rotation (rad); tilt = how far the
//                                   sheet leans away (0 = flat-on, .5 = on a table); x,y = screen anchor; f = focal length px)
//     o: { t, paper: '#ece2c8', ink, land, sea, borders: true, hatch: true, graticule: true, sheet: true (paper edge + shadow),
//          highlight: ['USA', 'NOR', …] (amber fill + light), borderGlow: ['USA'] (glowing border), dim: 0..1 (darken all
//          non-highlighted land), terminator: { utc: 6.5, decl: -10 } (day/night split, soft twilight), light: [x,y] (warm spot),
//          detail: 'auto'|'110m'|'50m', glowCol }
//   region(name, fill = .55) → cam for a country or named area: 'USA' (lower 48), 'Alaska', 'Norway', 'Switzerland',
//          'Philippines', 'Kenya', 'South Korea', 'World', or an ISO alpha-3 / numeric id.  Spread it into your cam: {...region('USA'), tilt: .45}
//   ll(lon, lat) → [x, y] Equal Earth units;  project(cam, lon, lat) → [sx, sy, scale] screen position on the tilted sheet
//   country(id) → { id, name, polys } (lon/lat rings) for custom drawing
//   outlineLocal(name, o) → { rings: [[x, y]…]…, box } the outline of a country/area in a local equal-area-ish projection
//          (x = Δlon·cos lat0, y = −Δlat, degrees; looks like an atlas inset), largest ring first; o: { detail '50m', n (max rings) }.
//          For motion graphics (a line that becomes a coast); fitTo(rings, box, x, y, w, h) scales them into a screen box.
//          .coast = per-vertex flags (false on a land border); coastRuns(ring, flags) → the open coast stretches (for waterlines).
import { Path2D, ImageData } from '@napi-rs/canvas';
import fs from 'node:fs';
import { W, H, rgba, clamp, mix, prng, addGlow, rough, poly, hatch } from '../engine.mjs';
import { fibreFill, halftoneFill } from './print.mjs';
import { hatch as artHatch, stipple as artStipple, vnoise } from './art.mjs';
import { canvas as mkCanvas } from '../engine.mjs';

const DATA = new URL('../data/', import.meta.url);
const ISO = { USA: '840', NOR: '578', CHE: '756', PHL: '608', KEN: '404', KOR: '410', CAN: '124', MEX: '484', BRA: '076', IND: '356', CHN: '156', NGA: '566', DEU: '276', GBR: '826', FRA: '250', JPN: '392', AUS: '036', ZAF: '710', RUS: '643', IDN: '360', EGY: '818', ARG: '032', SWE: '752', FIN: '246', DNK: '208', ISL: '352' };
const NAMES = { 'United States': 'USA', Norway: 'NOR', Switzerland: 'CHE', Philippines: 'PHL', Kenya: 'KEN', 'South Korea': 'KOR' };

function decode(topo) {
  const [sx, sy] = topo.transform.scale, [tx, ty] = topo.transform.translate;
  const arcs = topo.arcs.map((arc) => { let x = 0, y = 0; return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
  const ring = (idx) => { const pts = []; for (const i of idx) { const a = i < 0 ? arcs[~i].slice().reverse() : arcs[i]; for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]); } return pts; };
  const geoms = (obj) => obj.geometries.map((g) => {
    const polys = g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
    return { id: g.id, name: g.properties?.name, polys: polys.map((p) => p.map(ring)), arcIdx: polys.flat(2) };
  });
  const countries = geoms(topo.objects.countries), land = geoms(topo.objects.land);
  const use = new Map(); for (const c of countries) for (const i of c.arcIdx) { const k = i < 0 ? ~i : i; use.set(k, (use.get(k) || 0) + 1); }
  const borders = [...use].filter(([, n]) => n > 1).map(([k]) => arcs[k]);
  return { countries, land, borders, byId: new Map(countries.map((c) => [c.id, c])) };
}
const DS = {};
function data(detail) { if (!DS[detail]) DS[detail] = decode(JSON.parse(fs.readFileSync(new URL(`countries-${detail}.json`, DATA), 'utf8'))); return DS[detail]; }

// ---------- Equal Earth (Šavrič, Patterson, Jenny 2018) ----------
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, M = Math.sqrt(3) / 2, D2R = Math.PI / 180;
export function ll(lon, lat) {
  const l = lon * D2R, th = Math.asin(M * Math.sin(lat * D2R)), t2 = th * th, t6 = t2 * t2 * t2;
  return [l * Math.cos(th) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))];
}
const K = 330; // px per Equal Earth unit at z = 1
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
export const project = (cam, lon, lat) => { const [ex, ey] = ll(lon, lat); return projector(cam).P(ex, ey); };
export function country(id, detail = '110m') { const d = data(detail); const key = ISO[id] || NAMES[id] || id; return d.byId.get(key) || d.countries.find((c) => c.name === id); }

// rings that cross the antimeridian are unwrapped (lon may run past ±180); the land is clipped to the map outline
function ringPath(ctx, P, ring) { let first = true, prev = 0, k = 0; for (const [lon0, lat] of ring) { let lon = lon0 + k; if (!first && lon - prev > 180) { k -= 360; lon -= 360; } else if (!first && prev - lon > 180) { k += 360; lon += 360; } prev = lon; const [ex, ey] = ll(clamp(lon, -200, 200), lat), [x, y] = P(ex + (lon > 180 ? (lon - 180) * .015 : lon < -180 ? (lon + 180) * .015 : 0), ey); first ? ctx.moveTo(x, y) : ctx.lineTo(x, y); first = false; } ctx.closePath(); }
function countryPath(ctx, P, c, filter) { for (const p of c.polys) { if (filter && !filter(p[0])) continue; for (const r of p) ringPath(ctx, P, r); } }

export function outlineLocal(name, o = {}) {
  const A = AREAS[name] || { id: name }, c = country(A.id, o.detail || '50m');
  if (!c) throw new Error('map.outlineLocal: unknown ' + name);
  const polys = c.polys.filter((p) => !A.filter || A.filter(p[0])).map((p) => p[0]).sort((a, b) => b.length - a.length).slice(0, o.n ?? 12);
  let lo = 0, la = 0, k = 0; for (const [x, y] of polys[0]) { lo += x; la += y; k++; } lo /= k; la /= k;
  const cl = Math.cos(la * D2R), dl = (x) => { let d = x - lo; if (d > 180) d -= 360; if (d < -180) d += 360; return d; };   // islands across the antimeridian stay next door
  const rings = polys.map((r) => r.map(([x, y]) => [dl(x) * cl, -(y - la)]));
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const r of rings) for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  // coast[i][j] = false where the vertex lies on a land border shared with another country (no waterlines there)
  const B = borderKeys(o.detail || '50m'), coast = polys.map((r) => r.map(([x, y]) => !B.has(x + ',' + y)));
  return { rings, coast, box: [x0, y0, x1 - x0, y1 - y0], lon0: lo, lat0: la };
}
const BK = {};
function borderKeys(detail) { if (!BK[detail]) { const s = new Set(); for (const arc of data(detail).borders) for (const [x, y] of arc) s.add(x + ',' + y); BK[detail] = s; } return BK[detail]; }
// split a ring into its coast runs (open polylines without the land-border stretches); coast = flags from outlineLocal
export function coastRuns(ring, coast) {
  const n = ring.length, runs = []; if (coast.every(Boolean)) return [ring.concat([ring[0]])];
  let s = coast.findIndex((c) => !c); // start right after a border vertex so no run wraps around the seam
  let cur = null; for (let k = 1; k <= n; k++) { const i = (s + k) % n; if (coast[i]) { (cur ||= []).push(ring[i]); } else { if (cur && cur.length > 1) runs.push(cur); cur = null; } }
  if (cur && cur.length > 1) runs.push(cur); return runs;
}
export function fitTo(rings, box, x, y, w, h) { const k = Math.min(w / box[2], h / box[3]), ox = x + (w - box[2] * k) / 2 - box[0] * k, oy = y + (h - box[3] * k) / 2 - box[1] * k; return rings.map((r) => r.map(([a, b]) => [ox + a * k, oy + b * k])); }
const AREAS = {
  USA: { id: 'USA', filter: (r) => r[0][0] > -130 && r[0][1] < 50 },
  Alaska: { id: 'USA', filter: (r) => r[0][0] < -130 && r[0][1] > 50 },
  Norway: { id: 'NOR', filter: (r) => r[0][1] < 72 }, Switzerland: { id: 'CHE' }, Philippines: { id: 'PHL' }, Kenya: { id: 'KEN' }, 'South Korea': { id: 'KOR' },
};
export function region(name, fill = .55) {
  if (name === 'World') return { cx: 0, cy: 0, z: 1 };
  const A = AREAS[name] || { id: name }, c = country(A.id);
  if (!c) throw new Error('map.region: unknown ' + name);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const p of c.polys) { if (A.filter && !A.filter(p[0])) continue; for (const [lon, lat] of p[0]) { const [x, y] = ll(lon, lat); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
  const z = Math.min(W * fill / ((x1 - x0) * K), H * fill / ((y1 - y0) * K));
  return { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, z };
}
// outline of the Equal Earth world (the edge of the printed map)
function outline() { const pts = []; for (let lat = -90; lat <= 90; lat += 3) pts.push(ll(180, lat)); for (let lat = 90; lat >= -90; lat -= 3) pts.push(ll(-180, lat)); return pts; }
const OUT = outline();
// sun elevation boundary: latitude where the sun stands at elevation h for a given longitude
function twilight(lon, lonS, decl, h) {
  const a = Math.sin(decl * D2R), b = Math.cos(decl * D2R) * Math.cos((lon - lonS) * D2R), R = Math.hypot(a, b), al = Math.atan2(b, a);
  const s = clamp(Math.sin(h * D2R) / R, -1, 1), wrap = (v) => Math.atan2(Math.sin(v), Math.cos(v));
  const p1 = wrap(Math.asin(s) - al), p2 = wrap(Math.PI - Math.asin(s) - al);
  return (Math.abs(p1) <= Math.PI / 2 + 1e-9 ? p1 : p2) / D2R;
}

export function worldMap(ctx, cam = {}, o = {}) {
  const { P, c, k } = projector(cam), t = o.t ?? 0;
  const detail = o.detail === 'auto' || !o.detail ? (c.z > 3.2 ? '50m' : '110m') : o.detail;
  const D = data(detail);
  const paper = o.paper || '#ece2c8', ink = o.ink || '#2a2030', land = o.land || '#cdb98f', sea = o.sea || '#e4d8bc', glowCol = o.glowCol || '#ffb35c';
  const lw = (w) => w * Math.sqrt(c.z) * .9;
  // sheet: rough-edged paper with a soft shadow on the table
  const sheet = (() => { const m = .14, cs = [[-2.7066 - m, -1.3173 - m], [2.7066 + m, -1.3173 - m], [2.7066 + m, 1.3173 + m], [-2.7066 - m, 1.3173 + m]].map(([x, y]) => P(x, y)); return rough(cs.map((p) => [p[0], p[1]]), 2.2, 5, { step: 10 }); })();
  if (o.sheet !== false) {
    ctx.save(); ctx.fillStyle = 'rgba(3,3,10,.55)'; ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetX = 18; ctx.shadowOffsetY = 26;
    poly(ctx, sheet); ctx.fill(); ctx.restore();
    ctx.save(); poly(ctx, sheet);
    const lg = o.light || [W * .7, H * .25], g = ctx.createRadialGradient(lg[0], lg[1], 0, lg[0], lg[1], W * .9);
    g.addColorStop(0, mixHex(paper, '#fff6e2', .5)); g.addColorStop(.6, paper); g.addColorStop(1, mixHex(paper, '#6b5a48', .55));
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    poly(ctx, sheet); fibreFill(ctx, .55);
  }
  ctx.save();
  // the map's own edge: sea tone + engraved horizontal hatch
  ctx.beginPath(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); }); ctx.closePath();
  const outlinePath = new Path2D(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? outlinePath.lineTo(sx, sy) : outlinePath.moveTo(sx, sy); }); outlinePath.closePath();
  ctx.fillStyle = rgba(sea, .9); ctx.fill(outlinePath);
  if (o.hatch !== false) hatch(ctx, outlinePath, -c.rot * 0 + Math.atan2(P(1, 0)[1] - P(0, 0)[1], P(1, 0)[0] - P(0, 0)[0]), Math.max(3.2, 4.5 * Math.sqrt(c.z) * .8), .22, { col: '#3a3046', w: .8, wobble: .6, box: [0, 0, W, H] });
  ctx.strokeStyle = rgba(ink, .55); ctx.lineWidth = lw(1.4); ctx.stroke(outlinePath);
  // graticule in pencil
  if (o.graticule !== false) {
    ctx.save(); ctx.clip(outlinePath); ctx.strokeStyle = rgba(ink, .14); ctx.lineWidth = lw(.8); ctx.beginPath();
    for (let lon = -180; lon <= 180; lon += 30) for (let lat = -90; lat <= 90; lat += 3) { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); lat === -90 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon <= 180; lon += 4) { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); lon === -180 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); }
    ctx.stroke(); ctx.restore();
  }
  // land (all countries in one path), halftone + coast ink
  const area = (e) => { const A = AREAS[e]; const cn = country(A ? A.id : e, detail); return cn ? { cn, filter: A?.filter && e !== 'USA' ? A.filter : null } : null; };
  const hi = (o.highlight || []).map(area).filter(Boolean), bg = (o.borderGlow || []).map(area).filter(Boolean);
  ctx.save(); ctx.clip(outlinePath);
  const landPath = new Path2D(); for (const cn of D.countries) countryPath(landPath, P, cn);
  ctx.fillStyle = land; ctx.fill(landPath);
  ctx.save(); ctx.beginPath(); for (const cn of D.countries) countryPath(ctx, P, cn); halftoneFill(ctx, .35); ctx.restore();
  if (o.dim) { ctx.fillStyle = `rgba(20,16,28,${.45 * o.dim})`; ctx.fill(landPath); }
  ctx.strokeStyle = rgba(ink, .75); ctx.lineWidth = lw(1.15); ctx.lineJoin = 'round'; ctx.stroke(landPath);
  if (o.borders !== false) {
    ctx.save(); ctx.setLineDash([lw(3), lw(2.5)]); ctx.strokeStyle = rgba(ink, .45); ctx.lineWidth = lw(.8); ctx.beginPath();
    for (const arc of D.borders) { let pl = null; arc.forEach(([lon, lat], i) => { const [x, y] = ll(lon, lat), [sx, sy] = P(x, y); (i && Math.abs(lon - pl) < 180) ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); pl = lon; }); }
    ctx.stroke(); ctx.restore();
  }
  ctx.restore(); // outline clip
  // highlighted countries: amber ink + light rising from the paper
  for (const { cn, filter } of hi) {
    const pth = new Path2D(); countryPath(pth, P, cn, filter);
    const pulse = .85 + .15 * Math.sin(t * 1.6);
    ctx.fillStyle = rgba(glowCol, .85); ctx.fill(pth);
    ctx.save(); ctx.clip(pth); const b = bboxOf(cn, P, filter); const g = ctx.createRadialGradient(b.cx - b.w * .15, b.cy - b.h * .2, 0, b.cx, b.cy, Math.max(b.w, b.h) * .7);
    g.addColorStop(0, `rgba(255,241,214,${.75 * pulse})`); g.addColorStop(1, 'rgba(255,179,92,0)'); ctx.fillStyle = g; ctx.fillRect(b.x, b.y, b.w, b.h); ctx.restore();
    addGlow(ctx, b.cx, b.cy, Math.max(b.w, b.h) * .75, .35 * pulse, glowCol, '#fff1d6');
    ctx.strokeStyle = rgba('#7a3b17', .9); ctx.lineWidth = lw(1.3); ctx.stroke(pth);
  }
  for (const { cn, filter } of bg) {
    const pth = new Path2D(); countryPath(pth, P, cn, filter);
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; const a = .8 + .2 * Math.sin(t * 3);
    for (const [w, al] of [[lw(14), .12], [lw(6), .3], [lw(2.2), .95]]) { ctx.strokeStyle = rgba(w < lw(3) ? '#fff1d6' : glowCol, al * a); ctx.lineWidth = w; ctx.stroke(pth); }
    ctx.restore();
  }
  // day / night: night side in ink-blue, with three twilight steps (civil, nautical, astronomical)
  if (o.terminator) {
    const utc = o.terminator.utc ?? 12, decl = o.terminator.decl ?? -10, lonS = -15 * (utc - 12), pole = decl > 0 ? -90 : 90;
    ctx.save(); ctx.clip(outlinePath);
    const na = o.terminator.night ?? 1;
    for (const [h, a] of [[0, .2 * na], [-6, .2 * na], [-12, .2 * na], [-18, .24 * na]]) {
      ctx.beginPath(); let first = true;
      for (let lon = -180; lon <= 180; lon += 2) { const lat = twilight(lon, lonS, decl, h), [x, y] = ll(lon, lat), [sx, sy] = P(x, y); first ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy); first = false; }
      for (let lon = 180; lon >= -180; lon -= 6) { const [x, y] = ll(lon, pole), [sx, sy] = P(x, y); ctx.lineTo(sx, sy); }
      ctx.closePath(); ctx.fillStyle = `rgba(11,17,44,${a})`; ctx.fill();
    }
    if (o.cityLights !== false) { // tiny amber specks on land where the sun is down
      const r = prng(57), D2 = data('110m');
      ctx.save(); ctx.clip(landPathAll(P, D2)); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2600; i++) {
        const lon = -180 + r() * 360, lat = -45 + r() * 112, cosz = Math.sin(lat * D2R) * Math.sin(decl * D2R) + Math.cos(lat * D2R) * Math.cos(decl * D2R) * Math.cos((lon - lonS) * D2R);
        if (cosz > -.08) continue; const [x, y] = ll(lon, lat), [sx, sy, q] = P(x, y), m = r();
        ctx.fillStyle = `rgba(255,${180 + m * 50 | 0},110,${(.25 + .6 * m) * Math.min(1, -cosz * 6)})`; const sz = (m > .93 ? 2.2 : 1.3) * Math.min(1.6, q); ctx.fillRect(sx, sy, sz, sz);
      }
      ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
  return { P, outline: outlinePath, sheet };
}
const LP = new WeakMap();
function landPathAll(P, D) { const p = new Path2D(); for (const cn of D.countries) countryPath(p, P, cn); return p; }
function bboxOf(cn, P, filter) { let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const p of cn.polys.filter((q) => !filter || filter(q[0]))) for (const [lon, lat] of p[0]) { const [ex, ey] = ll(lon, lat), [x, y] = P(ex, ey); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 }; }
function mixHex(a, b, u) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const m = (s) => Math.round(mix((A >> s) & 255, (B >> s) & 255, u)); return '#' + [m(16), m(8), m(0)].map((v) => v.toString(16).padStart(2, '0')).join(''); }

// ---------- the engraved night sheet ----------
// nightSheet(cam, o) → S: the whole static view, rendered once and cached (≈1.5 s): dark table, the paper sheet with its shadow,
//   ruled sea with waterlines along every coast, land with coastal intaglio hatching, graticule, borders, then the night from the
//   real sun position (per-pixel sun elevation: a soft twilight band, deep blue night, a golden edge on the day side), city lights
//   as stipple + bloom on the night side only, and depth of field (far edge soft).
//   o: { utc 22.6, decl -10.5, detail '50m', night '#1d2b62', lamp [x, y] (warm light on the sheet), pad 90, lights true }
// drawSheet(ctx, S, view) draws it per frame; view = { z (push-in, 1 = as cached), dx, dy, t (twinkle) }.
// paperAt(S, view, lon, lat) → { x, y, m: [a, b, c, d] } screen point + the local linear map from paper px to screen
//   (ctx.translate(x, y); ctx.transform(...m, 0, 0) → draw circles, rings, ripples lying flat on the paper).
// sunElev(lon, lat, utc, decl) → degrees.
export function sunElev(lon, lat, utc, decl) { const lonS = -15 * (utc - 12); return Math.asin(Math.sin(lat * D2R) * Math.sin(decl * D2R) + Math.cos(lat * D2R) * Math.cos(decl * D2R) * Math.cos((lon - lonS) * D2R)) / D2R; }
function eeInverse(ex, ey) {   // Equal Earth inverse → [lon, lat] or null outside the map
  if (Math.abs(ey) > 1.3174) return null;
  let th = ey / A1; for (let i = 0; i < 6; i++) { const t2 = th * th, t6 = t2 * t2 * t2, f = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)) - ey, df = A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2); th -= f / df; }
  const t2 = th * th, t6 = t2 * t2 * t2, df = A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2), lon = ex * M * df / Math.cos(th) / D2R;
  if (Math.abs(lon) > 180) return null; return [lon, Math.asin(Math.sin(th) / M) / D2R];
}
// metro areas (lon, lat, weight): the city lights cluster around them; the sun decides which are lit
const METROS = [[-0.13,51.5,1],[2.35,48.86,1],[-3.7,40.4,.7],[2.17,41.39,.5],[-9.14,38.72,.4],[12.5,41.9,.6],[9.19,45.46,.7],[13.4,52.52,.6],[10,53.55,.4],[11.58,48.14,.4],[7,51.4,.9],[4.6,52.1,.7],[4.35,50.85,.5],[16.37,48.2,.4],[21,52.23,.45],[19.04,47.5,.4],[14.42,50.08,.35],[18.07,59.33,.3],[12.57,55.68,.3],[10.75,59.91,.25],[24.94,60.17,.25],[23.73,37.98,.45],[28.98,41.01,.9],[26.1,44.43,.35],[30.52,50.45,.45],[37.62,55.75,1],[30.3,59.94,.5],[-2.24,53.48,.5],[-6.26,53.35,.3],[4.83,45.76,.3],[5.37,43.3,.3],[14.27,40.85,.35],[20.46,44.8,.3],[27.56,53.9,.3],[49.1,55.8,.3],[60.6,56.8,.3],[82.9,55,.3],[73.4,55,.2],
  [31.24,30.04,1],[29.92,31.2,.45],[31.3,28.1,.3],[31.2,26.5,.25],[32.7,25.7,.25],[32.9,24.1,.2],[34.78,32.08,.4],[35.9,31.95,.3],[35.5,33.89,.3],[36.3,33.5,.35],[44.36,33.31,.6],[51.39,35.69,.9],[59.6,36.3,.3],[46.68,24.71,.7],[39.17,21.54,.5],[55.27,25.2,.6],[54.37,24.45,.35],[51.53,25.29,.3],[47.98,29.37,.35],[-7.59,33.57,.5],[-5,34,.3],[3.06,36.75,.45],[10.18,36.8,.35],[32.86,39.93,.45],[27.14,38.42,.3],[37.1,36.2,.3],[13.2,32.9,.25],
  [3.38,6.52,.8],[3.9,7.38,.3],[8.52,12,.4],[7.49,9.06,.3],[-0.19,5.6,.45],[-4.03,5.36,.45],[-17.45,14.7,.35],[15.27,-4.44,.55],[13.23,-8.84,.4],[36.82,-1.29,.45],[38.75,9.03,.45],[39.28,-6.79,.4],[32.58,0.35,.35],[32.53,15.5,.4],[28.05,-26.2,.8],[18.42,-33.92,.45],[31.02,-29.86,.35],[-1.5,12.4,.25],[-8,12.6,.25],[47.5,-18.9,.25],[45.3,2,.25],
  [77.21,28.61,1],[72.88,19.08,1],[88.36,22.57,.9],[80.27,13.08,.7],[77.59,12.97,.7],[78.49,17.39,.65],[72.57,23.02,.55],[73.86,18.52,.5],[80.95,26.85,.45],[67,24.86,.9],[74.36,31.52,.8],[90.41,23.81,.95],[85.32,27.72,.25],[79.86,6.93,.3],[69.2,34.55,.3],[69.24,41.3,.35],[76.9,43.24,.3],[75.8,26.9,.4],[83,25.3,.4],[85.1,25.6,.4],[76.3,10,.4],[71.5,30.2,.4],
  [100.5,13.75,.8],[96.16,16.84,.45],[105.85,21.03,.55],[106.66,10.82,.6],[101.69,3.14,.55],[103.82,1.35,.55],[106.85,-6.2,.9],[110.4,-7,.5],[112.7,-7.3,.5],[106.55,29.56,.6],[104.07,30.57,.55],[114.3,30.59,.6],[108.94,34.34,.45],[116.4,39.9,1],[117.2,39.1,.6],[113.26,23.13,.9],[114.17,22.32,.6],[113.6,34.7,.5],[117,36.6,.5],[112.5,37.9,.35],[123.4,41.8,.4],[106.9,47.9,.2],[98.7,3.6,.3],
  [-46.63,-23.55,1],[-43.17,-22.91,.8],[-58.38,-34.6,.9],[-43.94,-19.92,.5],[-47.88,-15.79,.4],[-38.5,-12.97,.45],[-34.88,-8.05,.45],[-38.54,-3.73,.4],[-56.16,-34.9,.3],[-49.3,-25.4,.4],[-51.2,-30,.4],[-64.2,-31.4,.35],[-66.9,10.5,.5],[-48.5,-1.45,.3],[-60,-3.1,.25],[-71.06,42.36,.6],[-74,40.7,1],[-75.2,40,.5],[-77,38.9,.5]];
const VIEW0 = { z: 1, dx: 0, dy: 0 };
export function nightSheet(cam, o = {}) {
  const key = 'night' + JSON.stringify([cam, o]); if (SHEETS.has(key)) return SHEETS.get(key);
  const pad = o.pad ?? 90, CW = W + 2 * pad, CH = H + 2 * pad, utc = o.utc ?? 22.6, decl = o.decl ?? -10.5;
  const camP = { ...cam, x: (cam.x ?? W / 2) + pad, y: (cam.y ?? H / 2) + pad }, { P, c, k } = projector(camP), D = data(o.detail || '50m');
  const PL = (lon, lat) => { const [x, y] = ll(lon, lat); return P(x, y); };
  const [cv, g] = mkCanvas(CW, CH), r = prng(91), n = vnoise(23), ink = o.ink || '#2b2433';
  // the table: dark walnut with long grain, warm where the lamp reaches
  g.fillStyle = '#0d0a0c'; g.fillRect(0, 0, CW, CH); g.lineCap = 'round';
  for (let i = 0; i < 420; i++) { const y = r() * CH, a = .05 + r() * .09; g.strokeStyle = r() < .5 ? `rgba(120,80,55,${a})` : `rgba(0,0,0,${a * 1.5})`; g.lineWidth = .6 + r() * 2.2; g.beginPath(); for (let x = -20; x <= CW + 20; x += 40) { const yy = y + 8 * Math.sin(x * .004 + i) + 5 * (n(x * .006, i * .3) - .5); x < 0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  const lamp = o.lamp || [W * .82 + pad, pad - 60];
  { const lg = g.createRadialGradient(lamp[0], lamp[1] + 120, 0, lamp[0], lamp[1] + 120, 1500); lg.addColorStop(0, 'rgba(255,170,100,.32)'); lg.addColorStop(.5, 'rgba(255,150,90,.08)'); lg.addColorStop(1, 'rgba(255,150,90,0)'); g.fillStyle = lg; g.fillRect(0, 0, CW, CH); }
  // the sheet: rough edge, soft shadow on the table
  const m = .16, cs = [[-2.7066 - m, -1.3173 - m], [2.7066 + m, -1.3173 - m], [2.7066 + m, 1.3173 + m], [-2.7066 - m, 1.3173 + m]].map(([x, y]) => P(x, y));
  const sheet = rough(cs.map((p) => [p[0], p[1]]), 2.4, 7, { step: 10 }), sheetPath = new Path2D(); sheet.forEach(([x, y], i) => (i ? sheetPath.lineTo(x, y) : sheetPath.moveTo(x, y))); sheetPath.closePath();
  { const [sc, sg] = mkCanvas(CW, CH); sg.fillStyle = 'rgba(0,0,0,.85)'; sg.translate(16, 24); sg.fill(sheetPath); g.save(); g.filter = 'blur(18px)'; g.drawImage(sc, 0, 0); g.filter = 'none'; g.restore(); }
  const paper = o.paper || '#ebe1c7';
  { g.save(); g.clip(sheetPath); const pg = g.createRadialGradient(lamp[0], lamp[1] + 200, 0, lamp[0], lamp[1] + 200, CW * 1.05); pg.addColorStop(0, '#f6eedb'); pg.addColorStop(.5, paper); pg.addColorStop(1, '#a8987a'); g.fillStyle = pg; g.fillRect(0, 0, CW, CH); g.restore(); }
  g.save(); g.beginPath(); sheet.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.scale(CW / W, CH / H); fibreFill(g, .5); g.restore();
  // neatline: double rule just outside the map
  { const q = .07, rr = [[-2.7066 - q, -1.3173 - q], [2.7066 + q, -1.3173 - q], [2.7066 + q, 1.3173 + q], [-2.7066 - q, 1.3173 + q]].map(([x, y]) => P(x, y)); g.strokeStyle = rgba(ink, .7); g.lineWidth = 1.6; poly(g, rr); g.stroke();
    const q2 = .095, r2 = [[-2.7066 - q2, -1.3173 - q2], [2.7066 + q2, -1.3173 - q2], [2.7066 + q2, 1.3173 + q2], [-2.7066 - q2, 1.3173 + q2]].map(([x, y]) => P(x, y)); g.lineWidth = .7; poly(g, r2); g.stroke(); }
  const outlinePath = new Path2D(); OUT.forEach(([x, y], i) => { const [sx, sy] = P(x, y); i ? outlinePath.lineTo(sx, sy) : outlinePath.moveTo(sx, sy); }); outlinePath.closePath();
  const landPath = new Path2D(); for (const cn of D.countries) countryPath(landPath, P, cn);
  const [lm, lmg] = mkCanvas(CW, CH); lmg.fillStyle = '#fff'; lmg.fill(landPath);                     // land mask
  const band = (d, w) => { const [a, ag] = mkCanvas(CW, CH), [b, bg] = mkCanvas(CW, CH); ag.lineJoin = bg.lineJoin = 'round'; ag.strokeStyle = bg.strokeStyle = '#fff'; ag.lineWidth = 2 * d + w; ag.stroke(landPath); bg.lineWidth = Math.max(.1, 2 * d - w); bg.stroke(landPath); ag.globalCompositeOperation = 'destination-out'; ag.drawImage(b, 0, 0); return a; };
  // sea: a faint cool tint, ruled engraving lines (stopping short of the coast), waterlines along every coast
  g.save(); g.clip(outlinePath); g.fillStyle = 'rgba(150,170,185,.16)'; g.fillRect(0, 0, CW, CH); g.restore();
  { const [sc, sg] = mkCanvas(CW, CH); sg.save(); sg.clip(outlinePath); sg.strokeStyle = rgba(ink, .34); sg.lineWidth = .65; const step = 3.3 / (K * c.z);
    for (let ey = -1.3173; ey <= 1.3173; ey += step) { const a = P(-2.75, ey), b = P(2.75, ey); sg.beginPath(); sg.moveTo(a[0], a[1]); sg.lineTo(b[0], b[1]); sg.stroke(); } sg.restore();
    sg.globalCompositeOperation = 'destination-out'; sg.lineJoin = 'round'; sg.strokeStyle = '#fff'; sg.lineWidth = 2 * 12.5; sg.stroke(landPath); sg.drawImage(lm, 0, 0);
    g.drawImage(sc, 0, 0); }
  { const [wc, wg] = mkCanvas(CW, CH); [2.2, 4.6, 7.3, 10.4].forEach((d, i) => { wg.globalAlpha = .62 * Math.pow(.74, i); wg.drawImage(band(d, .75), 0, 0); });
    wg.globalAlpha = 1; wg.globalCompositeOperation = 'destination-out'; wg.drawImage(lm, 0, 0); wg.globalCompositeOperation = 'source-in'; wg.fillStyle = ink; wg.fillRect(0, 0, CW, CH); g.save(); g.clip(outlinePath); g.drawImage(wc, 0, 0); g.restore(); }
  // land: warmer paper, intaglio hatching along the coasts fading inland, the coast in ink
  g.save(); g.fillStyle = 'rgba(255,246,225,.5)'; g.fill(landPath); g.restore();
  { const [hc, hg] = mkCanvas(CW, CH); artHatch(hg, [0, 0, CW, CH], { angle: -.78, gap: 2.7, w: .55, col: ink, a: .55, wobble: .4, seed: 5, broken: .2 });
    const [fc, fg] = mkCanvas(CW, CH); fg.filter = 'blur(6px)'; fg.strokeStyle = '#fff'; fg.lineJoin = 'round'; fg.lineWidth = 16; fg.stroke(landPath); fg.filter = 'none';
    hg.globalCompositeOperation = 'destination-in'; hg.drawImage(fc, 0, 0); hg.drawImage(lm, 0, 0); g.drawImage(hc, 0, 0); }
  // graticule in pencil, borders dashed, coast ink
  { g.save(); g.clip(outlinePath); g.strokeStyle = rgba(ink, .2); g.lineWidth = .8; g.beginPath();
    for (let lon = -180; lon <= 180; lon += 30) for (let lat = -90; lat <= 90; lat += 3) { const [sx, sy] = PL(lon, lat); lat === -90 ? g.moveTo(sx, sy) : g.lineTo(sx, sy); }
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon <= 180; lon += 4) { const [sx, sy] = PL(lon, lat); lon === -180 ? g.moveTo(sx, sy) : g.lineTo(sx, sy); }
    g.stroke(); g.restore(); }
  g.save(); g.setLineDash([2.2, 2.2]); g.strokeStyle = rgba(ink, .38); g.lineWidth = .6; g.beginPath();
  for (const arc of D.borders) { let pl = null; arc.forEach(([lon, lat], i) => { const [sx, sy] = PL(lon, lat); (i && Math.abs(lon - pl) < 180) ? g.lineTo(sx, sy) : g.moveTo(sx, sy); pl = lon; }); } g.stroke(); g.restore();
  g.save(); g.clip(outlinePath); g.strokeStyle = rgba(ink, .85); g.lineWidth = .95; g.lineJoin = 'round'; g.stroke(landPath); g.restore();
  g.strokeStyle = rgba(ink, .7); g.lineWidth = 1.3; g.stroke(outlinePath);
  // the night: sun elevation per pixel (half resolution), inverse camera + inverse Equal Earth
  const hw = Math.ceil(CW / 2), hh = Math.ceil(CH / 2), night = new Float32Array(hw * hh), gold = new Float32Array(hw * hh);
  { const cr = Math.cos(c.rot), sr = Math.sin(c.rot), ct = Math.cos(c.tilt), st = Math.sin(c.tilt), f = c.f;
    for (let j = 0; j < hh; j++) for (let i = 0; i < hw; i++) {
      const X = i * 2 + 1 - c.x, Yd = j * 2 + 1 - c.y, v = Yd * f / (ct * f + Yd * st), q = f / (f - v * st), u = X / q;
      const u0 = u * cr + v * sr, v0 = -u * sr + v * cr, ll0 = eeInverse(u0 / k + c.cx, -v0 / k + c.cy); if (!ll0) continue;
      const e = sunElev(ll0[0], ll0[1], utc, decl), idx = j * hw + i;
      night[idx] = 1 - sstep(-9.5, 3, e); gold[idx] = Math.exp(-Math.pow((e - 3.2) / 4.2, 2));   // twilight band: golden on the day side, then deep blue
    } }
  const toCanvas = (arr, col, amax) => { const [hc] = mkCanvas(hw, hh), id = new ImageData(hw, hh), p = id.data; for (let i = 0; i < arr.length; i++) { p[i * 4] = col[0]; p[i * 4 + 1] = col[1]; p[i * 4 + 2] = col[2]; p[i * 4 + 3] = Math.round(255 * amax * arr[i]); } hc.getContext('2d').putImageData(id, 0, 0); const [fc, fx] = mkCanvas(CW, CH); fx.imageSmoothingEnabled = true; fx.drawImage(hc, 0, 0, CW, CH); return fc; };
  const nightCol = o.night || '#1d2b62', nc = parseInt(nightCol.slice(1), 16), NC = [nc >> 16, (nc >> 8) & 255, nc & 255];
  { const N1 = toCanvas(night, NC, 1), N2 = toCanvas(night, [8, 12, 34], .5), G1 = toCanvas(gold, [242, 156, 104], .5);
    g.save(); g.clip(outlinePath); g.globalCompositeOperation = 'multiply'; g.drawImage(G1, 0, 0); g.drawImage(N1, 0, 0); g.globalCompositeOperation = 'source-over'; g.drawImage(N2, 0, 0); g.restore(); }
  // city lights: clustered around the metros, only on land and only where the sun is down; stipple + bloom
  const twinkle = [];
  if (o.lights !== false) {
    const land = lmg.getImageData(0, 0, CW, CH).data, onLand = (x, y) => { const xi = x | 0, yi = y | 0; return xi >= 0 && yi >= 0 && xi < CW && yi < CH && land[(yi * CW + xi) * 4 + 3] > 128; };
    const [Lc, Lg] = mkCanvas(CW, CH), gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += r(); return (s - 2) * 1.22; };
    const put = (lon, lat, b) => {
      const e = sunElev(lon, lat, utc, decl); if (e > -2) return; const nf = Math.min(1, (-2 - e) / 7), [x, y, q] = PL(lon, lat); if (!onLand(x, y)) return;
      const a = Math.min(1, b * nf), sz = (b > .85 ? 1.5 : 1) * Math.min(1.25, q);
      Lg.fillStyle = `rgba(255,${176 + r() * 54 | 0},${100 + r() * 50 | 0},${a})`; Lg.fillRect(x - sz / 2, y - sz / 2, sz, sz);
      if (b > .85 && r() < .3) twinkle.push([x, y, r() * 6.28, a]);
    };
    for (const [lon, lat, w] of METROS) {                     // a bright core, suburbs, then towns and roads thinning out
      const cl = Math.cos(lat * D2R);
      for (let i = 0, nn = Math.round(26 * w); i < nn; i++) put(lon + gauss() * .22 / cl, lat + gauss() * .2, .5 + r() * .5);
      for (let i = 0, nn = Math.round(150 * w); i < nn; i++) put(lon + gauss() * 1.1 / cl, lat + gauss() * .9, .12 + r() * .4);
      for (let i = 0, nn = Math.round(260 * w); i < nn; i++) put(lon + gauss() * 3.4 / cl, lat + gauss() * 2.6, .05 + r() * .22);
    }
    g.save(); g.clip(outlinePath); g.globalCompositeOperation = 'lighter';
    g.filter = 'blur(4px)'; g.globalAlpha = .45; g.drawImage(Lc, 0, 0); g.filter = 'none'; g.globalAlpha = 1; g.drawImage(Lc, 0, 0); g.restore();
  }
  // lamp light on the paper (warm, from the upper right), stippled falloff
  { const [lc, lg2] = mkCanvas(CW, CH); const rg = lg2.createRadialGradient(lamp[0], lamp[1] + 160, 0, lamp[0], lamp[1] + 160, 1400); rg.addColorStop(0, 'rgba(255,196,130,.55)'); rg.addColorStop(.45, 'rgba(255,170,100,.16)'); rg.addColorStop(1, 'rgba(255,160,90,0)'); lg2.fillStyle = rg; lg2.fillRect(0, 0, CW, CH); artStipple(lc, { k: .6, g: 1.2, seed: 61 });
    g.save(); g.clip(sheetPath); g.globalCompositeOperation = 'soft-light'; g.drawImage(lc, 0, 0); g.restore(); }
  // depth of field: the far edge of the sheet (top) and the table behind it go soft
  if (o.dof !== false) { const [bc, bgx] = mkCanvas(CW, CH); bgx.filter = 'blur(3px)'; bgx.drawImage(cv, 0, 0); bgx.filter = 'none'; const top = PL(0, 90)[1];
    bgx.globalCompositeOperation = 'destination-in'; const mg = bgx.createLinearGradient(0, top - 120, 0, top + 260); mg.addColorStop(0, '#000'); mg.addColorStop(1, 'rgba(0,0,0,0)'); bgx.fillStyle = mg; bgx.fillRect(0, 0, CW, CH); g.drawImage(bc, 0, 0); }
  const S = { c: cv, pad, cam: camP, P, PL, twinkle, utc, decl, k };
  SHEETS.set(key, S); return S;
}
const SHEETS = new Map();
const sstep = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const viewPt = (S, v, x, y) => [W / 2 + (x - S.pad - W / 2) * v.z + v.dx, H / 2 + (y - S.pad - H / 2) * v.z + v.dy];
export function drawSheet(ctx, S, view = {}) {
  const v = { ...VIEW0, ...view }, t = v.t ?? 0;
  ctx.save(); ctx.translate(W / 2 + v.dx, H / 2 + v.dy); ctx.scale(v.z, v.z); ctx.drawImage(S.c, -W / 2 - S.pad, -H / 2 - S.pad); ctx.restore();
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  for (const [x, y, ph, a] of S.twinkle) { const [sx, sy] = viewPt(S, v, x, y), w = .5 + .5 * Math.sin(t * (1.3 + ph * .3) + ph * 7); if (w < .55) continue; const rg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 7); rg.addColorStop(0, `rgba(255,226,170,${.55 * a * (w - .5) * 2})`); rg.addColorStop(1, 'rgba(255,190,120,0)'); ctx.fillStyle = rg; ctx.fillRect(sx - 7, sy - 7, 14, 14); }
  ctx.restore();
}
export function paperAt(S, view, lon, lat) {
  const v = { ...VIEW0, ...view }, [ex, ey] = ll(lon, lat), e = 1e-3, p0 = S.P(ex, ey), px = S.P(ex + e, ey), py = S.P(ex, ey - e), s = 1 / (e * S.k);
  const [x, y] = viewPt(S, v, p0[0], p0[1]);
  return { x, y, m: [(px[0] - p0[0]) * s * v.z, (px[1] - p0[1]) * s * v.z, (py[0] - p0[0]) * s * v.z, (py[1] - p0[1]) * s * v.z], q: p0[2] };
}
